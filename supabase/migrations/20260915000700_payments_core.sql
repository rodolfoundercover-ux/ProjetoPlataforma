begin;

-- Financial facts are append-only.  A charge describes what is due; a payment
-- records what was received; allocations connect the two without losing history.
create type public.charge_type as enum ('ENTRY','INSTALLMENT','ADDITIONAL_CHARGE','CANCELLATION_FEE','PASSENGER_CHANGE_FEE','OTHER');
create type public.charge_status as enum ('OPEN','PARTIALLY_PAID','PAID','CANCELLED');
create type public.payment_provider as enum ('MERCADO_PAGO','INFINITE_PAY','CASH');
create type public.payment_account_scope as enum ('AGENCY','MARKETPLACE');
create type public.payment_method as enum ('PIX','CARD','PAYMENT_LINK','CASH');
create type public.payment_status as enum ('PENDING','CONFIRMED','REJECTED','REVERSED','REFUNDED','EXCEPTION');
create type public.webhook_processing_status as enum ('RECEIVED','PROCESSED','IGNORED','FAILED');

insert into public.permissions(key,description) values
 ('payments.view','Visualizar cobranças e pagamentos'),
 ('payments.register','Registrar fatos de pagamento'),
 ('payments.register_cash','Registrar pagamento em dinheiro'),
 ('payments.refund','Registrar reembolso'),
 ('payments.reverse','Reverter pagamento')
on conflict(key) do update set description=excluded.description;

create table public.charges (
 id uuid primary key default gen_random_uuid(),
 agency_id uuid not null references public.agencies(id) on delete cascade,
 reservation_id uuid not null,
 charge_type public.charge_type not null,
 amount numeric(14,2) not null check(amount >= 0),
 due_date date,
 status public.charge_status not null default 'OPEN',
 created_at timestamptz not null default now(), paid_at timestamptz, cancelled_at timestamptz,
 unique(agency_id,id),
 foreign key(agency_id,reservation_id) references public.reservations(agency_id,id),
 check((status='PAID') = (paid_at is not null)),
 check((status='CANCELLED') = (cancelled_at is not null))
);
create unique index charges_one_entry_per_reservation on public.charges(reservation_id) where charge_type='ENTRY' and status <> 'CANCELLED';
create index charges_by_reservation_status on public.charges(agency_id,reservation_id,status,due_date);

create table public.payments (
 id uuid primary key default gen_random_uuid(),
 agency_id uuid not null references public.agencies(id) on delete cascade,
 reservation_id uuid not null,
 provider public.payment_provider not null,
 account_scope public.payment_account_scope not null default 'AGENCY',
 payment_method public.payment_method not null,
 status public.payment_status not null default 'PENDING',
 amount numeric(14,2) not null check(amount > 0),
 client_fee_amount numeric(14,2) not null default 0 check(client_fee_amount >= 0),
 agency_fee_amount numeric(14,2) not null default 0 check(agency_fee_amount >= 0),
 provider_payment_id text,
 idempotency_key text not null check(length(trim(idempotency_key)) between 8 and 200),
 confirmed_at timestamptz, rejected_at timestamptz, created_by uuid references auth.users(id), created_at timestamptz not null default now(),
 unique(agency_id,id),
 foreign key(agency_id,reservation_id) references public.reservations(agency_id,id),
 constraint payments_confirmed_at_check check((status in ('CONFIRMED','EXCEPTION')) = (confirmed_at is not null)),
 check((provider <> 'CASH') or (payment_method='CASH' and account_scope='AGENCY')),
 check((account_scope <> 'MARKETPLACE') or provider='MERCADO_PAGO')
);
create unique index payments_idempotency on public.payments(agency_id,idempotency_key);
create unique index payments_provider_reference on public.payments(provider,provider_payment_id) where provider_payment_id is not null;
create index payments_by_reservation_status on public.payments(agency_id,reservation_id,status,created_at);

create table public.payment_allocations (
 id uuid primary key default gen_random_uuid(),
 agency_id uuid not null references public.agencies(id) on delete cascade,
 payment_id uuid not null,
 charge_id uuid not null,
 amount numeric(14,2) not null check(amount > 0), created_at timestamptz not null default now(),
 unique(agency_id,id), unique(payment_id,charge_id),
 foreign key(agency_id,payment_id) references public.payments(agency_id,id),
 foreign key(agency_id,charge_id) references public.charges(agency_id,id)
);
create index payment_allocations_by_charge on public.payment_allocations(agency_id,charge_id);

create table public.payment_transactions (
 id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
 payment_id uuid not null, provider public.payment_provider not null, external_reference text not null,
 status public.payment_status not null, amount numeric(14,2) not null check(amount > 0),
 occurred_at timestamptz, created_at timestamptz not null default now(),
 unique(agency_id,id), unique(provider,external_reference),
 foreign key(agency_id,payment_id) references public.payments(agency_id,id)
);

create table public.payment_webhook_events (
 id uuid primary key default gen_random_uuid(), provider public.payment_provider not null,
 external_event_id text not null, processing_status public.webhook_processing_status not null default 'RECEIVED',
 payment_id uuid, received_at timestamptz not null default now(), processed_at timestamptz,
 error_code text, payload_digest text not null check(length(payload_digest) between 32 and 128),
 unique(provider,external_event_id)
);

create table public.payment_adjustments (
 id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
 payment_id uuid not null, adjustment_type text not null check(adjustment_type in ('REFUND','REVERSAL','MANUAL_CORRECTION')),
 amount numeric(14,2) not null check(amount > 0), reason text not null check(length(trim(reason)) > 0),
 created_by uuid references auth.users(id), created_at timestamptz not null default now(),
 unique(agency_id,id), foreign key(agency_id,payment_id) references public.payments(agency_id,id)
);

create table public.payment_reconciliation_exceptions (
 id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
 reservation_id uuid not null, payment_id uuid not null, code text not null check(code in ('PAYMENT_CONFIRMED_AFTER_EXPIRATION','AMOUNT_MISMATCH','ACCOUNT_MISMATCH')),
 resolved_at timestamptz, created_at timestamptz not null default now(),
 unique(payment_id,code), unique(agency_id,id),
 foreign key(agency_id,reservation_id) references public.reservations(agency_id,id),
 foreign key(agency_id,payment_id) references public.payments(agency_id,id)
);

create or replace function public.refresh_charge_status(p_charge uuid) returns void language plpgsql security definer set search_path=public as $$
declare c public.charges%rowtype; allocated numeric(14,2);
begin
 select * into c from public.charges where id=p_charge for update;
 if c.id is null or c.status='CANCELLED' then return; end if;
 select coalesce(sum(a.amount),0) into allocated from public.payment_allocations a join public.payments p on p.id=a.payment_id where a.charge_id=c.id and p.status='CONFIRMED';
 if allocated >= c.amount then update public.charges set status='PAID',paid_at=coalesce(paid_at,now()) where id=c.id;
 elsif allocated > 0 then update public.charges set status='PARTIALLY_PAID',paid_at=null where id=c.id;
 else update public.charges set status='OPEN',paid_at=null where id=c.id; end if;
end$$;

create or replace function public.refresh_reservation_financial_status(p_reservation uuid) returns void language plpgsql security definer set search_path=public as $$
declare total_due numeric(14,2); total_paid numeric(14,2); entry_due numeric(14,2); entry_paid numeric(14,2); r public.reservations%rowtype;
begin
 select * into r from public.reservations where id=p_reservation for update; if r.id is null then return; end if;
 select coalesce(sum(amount),0),coalesce(sum(case when charge_type='ENTRY' then amount else 0 end),0) into total_due,entry_due from public.charges where reservation_id=r.id and status <> 'CANCELLED';
 select coalesce(sum(a.amount),0),coalesce(sum(a.amount) filter(where c.charge_type='ENTRY'),0) into total_paid,entry_paid from public.payment_allocations a join public.payments p on p.id=a.payment_id and p.status='CONFIRMED' join public.charges c on c.id=a.charge_id where c.reservation_id=r.id;
 update public.reservations set financial_status=case when total_paid=0 then 'PENDING'::public.reservation_financial_status when total_paid>=r.total_amount then 'PAID'::public.reservation_financial_status when entry_due>0 and entry_paid>=entry_due then 'ENTRY_PAID'::public.reservation_financial_status else 'PARTIALLY_PAID'::public.reservation_financial_status end, updated_at=now() where id=r.id;
 if entry_due>0 and entry_paid>=entry_due and r.status='WAITING_ENTRY' and r.expires_at>now() then
   update public.reservations set status='CONFIRMED',confirmed_at=now(),updated_at=now() where id=r.id and status='WAITING_ENTRY';
   delete from public.seat_holds where reservation_id=r.id;
 end if;
end$$;

create or replace function public.configure_reservation_charges(p_reservation uuid,p_entry_amount numeric,p_due_date date default null) returns uuid language plpgsql security definer set search_path=public as $$
declare r public.reservations%rowtype; entry_id uuid;
begin
 select * into r from public.reservations where id=p_reservation and status='WAITING_ENTRY' and has_agency_permission(agency_id,'payments.register') for update;
 if r.id is null or p_entry_amount <= 0 or p_entry_amount > r.total_amount then raise exception 'payment schedule unavailable' using errcode='42501'; end if;
 insert into public.charges(agency_id,reservation_id,charge_type,amount,due_date) values(r.agency_id,r.id,'ENTRY',p_entry_amount,p_due_date) returning id into entry_id;
 update public.reservations set entry_amount=p_entry_amount,updated_at=now() where id=r.id;
 insert into public.agency_audit_events(agency_id,actor_user_id,action,entity_type,entity_id,details) values(r.agency_id,auth.uid(),'payment_schedule.configure','reservations',r.id,jsonb_build_object('entry_amount',p_entry_amount));
 return entry_id;
end$$;

create or replace function public.register_cash_payment(p_charge uuid,p_amount numeric,p_idempotency_key text) returns uuid language plpgsql security definer set search_path=public,internal as $$
declare c public.charges%rowtype; r public.reservations%rowtype; remaining numeric(14,2); payment_id uuid;
begin
 select * into c from public.charges where id=p_charge for update;
 if c.id is not null then
   select * into r from public.reservations where id=c.reservation_id and agency_id=c.agency_id and has_agency_permission(c.agency_id,'payments.register_cash') for update;
 end if;
 if c.id is null or r.status not in ('WAITING_ENTRY','CONFIRMED') or p_amount<=0 or length(trim(p_idempotency_key))<8 then raise exception 'cash payment unavailable' using errcode='42501'; end if;
 if exists(select 1 from public.payments where agency_id=c.agency_id and idempotency_key=p_idempotency_key) then select id into payment_id from public.payments where agency_id=c.agency_id and idempotency_key=p_idempotency_key; return payment_id; end if;
 select c.amount-coalesce(sum(a.amount),0) into remaining from public.payment_allocations a join public.payments p on p.id=a.payment_id and p.status='CONFIRMED' where a.charge_id=c.id;
 if p_amount>remaining then raise exception 'payment exceeds charge balance' using errcode='22003'; end if;
 insert into public.payments(agency_id,reservation_id,provider,account_scope,payment_method,status,amount,idempotency_key,confirmed_at,created_by) values(c.agency_id,r.id,'CASH','AGENCY','CASH','CONFIRMED',p_amount,p_idempotency_key,now(),auth.uid()) returning id into payment_id;
 insert into public.payment_allocations(agency_id,payment_id,charge_id,amount) values(c.agency_id,payment_id,c.id,p_amount);
 perform public.refresh_charge_status(c.id); perform public.refresh_reservation_financial_status(r.id);
 insert into public.agency_audit_events(agency_id,actor_user_id,action,entity_type,entity_id,details) values(c.agency_id,auth.uid(),'payment.cash.register','payments',payment_id,jsonb_build_object('charge_id',c.id,'amount',p_amount));
 insert into internal.outbox(scope,agency_id,event_type,idempotency_key,payload) values('AGENCY',c.agency_id,'PAYMENT_CONFIRMED',p_idempotency_key,jsonb_build_object('payment_id',payment_id,'reservation_id',r.id));
 return payment_id;
end$$;

create or replace function public.record_provider_confirmation(p_provider public.payment_provider,p_external_event_id text,p_payment_id uuid,p_external_reference text,p_amount numeric,p_payload_digest text) returns uuid language plpgsql security definer set search_path=public,internal as $$
declare p public.payments%rowtype; r public.reservations%rowtype; entry_charge uuid;
begin
 if auth.uid() is not null then raise exception 'provider operation unavailable' using errcode='42501'; end if;
 insert into public.payment_webhook_events(provider,external_event_id,payment_id,payload_digest) values(p_provider,p_external_event_id,p_payment_id,p_payload_digest) on conflict(provider,external_event_id) do nothing;
 if not found then return p_payment_id; end if;
 select * into p from public.payments where id=p_payment_id and provider=p_provider for update;
 if p.id is null or p.amount<>p_amount or p.provider_payment_id is distinct from p_external_reference then raise exception 'provider payment does not reconcile' using errcode='22023'; end if;
 select * into r from public.reservations where id=p.reservation_id for update;
 if r.status='EXPIRED' then update public.payments set status='EXCEPTION',confirmed_at=now() where id=p.id; insert into public.payment_reconciliation_exceptions(agency_id,reservation_id,payment_id,code) values(p.agency_id,r.id,p.id,'PAYMENT_CONFIRMED_AFTER_EXPIRATION'); update public.payment_webhook_events set processing_status='IGNORED',processed_at=now() where provider=p_provider and external_event_id=p_external_event_id; return p.id; end if;
 update public.payments set status='CONFIRMED',confirmed_at=now() where id=p.id and status='PENDING';
 select id into entry_charge from public.charges where reservation_id=r.id and charge_type='ENTRY' and status <> 'CANCELLED' order by created_at limit 1;
 if entry_charge is null then raise exception 'entry charge unavailable' using errcode='23503'; end if;
 insert into public.payment_allocations(agency_id,payment_id,charge_id,amount) values(p.agency_id,p.id,entry_charge,p.amount) on conflict(payment_id,charge_id) do nothing;
 perform public.refresh_charge_status(entry_charge); perform public.refresh_reservation_financial_status(r.id);
 update public.payment_webhook_events set processing_status='PROCESSED',processed_at=now() where provider=p_provider and external_event_id=p_external_event_id;
 insert into internal.outbox(scope,agency_id,event_type,idempotency_key,payload) values('AGENCY',p.agency_id,'PAYMENT_CONFIRMED','provider:'||p_provider::text||':'||p_external_event_id,jsonb_build_object('payment_id',p.id,'reservation_id',r.id));
 return p.id;
end$$;

do $$ declare t text; begin foreach t in array array['charges','payments','payment_allocations','payment_transactions','payment_webhook_events','payment_adjustments','payment_reconciliation_exceptions'] loop execute format('alter table public.%I enable row level security',t); execute format('alter table public.%I force row level security',t); end loop; end $$;
create policy charges_read on public.charges for select using(public.has_agency_permission(agency_id,'payments.view'));
create policy payments_read on public.payments for select using(public.has_agency_permission(agency_id,'payments.view'));
create policy payment_allocations_read on public.payment_allocations for select using(public.has_agency_permission(agency_id,'payments.view'));
create policy payment_transactions_read on public.payment_transactions for select using(public.has_agency_permission(agency_id,'payments.view'));
create policy payment_adjustments_read on public.payment_adjustments for select using(public.has_agency_permission(agency_id,'payments.view'));
create policy payment_exceptions_read on public.payment_reconciliation_exceptions for select using(public.has_agency_permission(agency_id,'payments.view'));
create trigger charges_immutable_tenant before update on public.charges for each row execute function public.prevent_tenant_transfer();
create trigger payments_immutable_tenant before update on public.payments for each row execute function public.prevent_tenant_transfer();
create trigger payment_allocations_immutable_tenant before update on public.payment_allocations for each row execute function public.prevent_tenant_transfer();
create trigger payment_transactions_immutable_tenant before update on public.payment_transactions for each row execute function public.prevent_tenant_transfer();
create trigger payment_adjustments_immutable_tenant before update on public.payment_adjustments for each row execute function public.prevent_tenant_transfer();
create trigger payment_exceptions_immutable_tenant before update on public.payment_reconciliation_exceptions for each row execute function public.prevent_tenant_transfer();
revoke all on public.charges,public.payments,public.payment_allocations,public.payment_transactions,public.payment_webhook_events,public.payment_adjustments,public.payment_reconciliation_exceptions from anon,authenticated;
grant select on public.charges,public.payments,public.payment_allocations,public.payment_transactions,public.payment_adjustments,public.payment_reconciliation_exceptions to authenticated;
grant execute on function public.configure_reservation_charges(uuid,numeric,date),public.register_cash_payment(uuid,numeric,text) to authenticated;
revoke all on function public.record_provider_confirmation(public.payment_provider,text,uuid,text,numeric,text) from public,anon,authenticated;
commit;
