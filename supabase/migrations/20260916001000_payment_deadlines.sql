begin;

insert into public.permissions(key,description) values
 ('payments.deadline_override','Autorizar exceção de quitação por reserva')
on conflict(key) do update set description=excluded.description;

create table public.reservation_payment_deadline_exceptions (
 id uuid primary key default gen_random_uuid(),
 agency_id uuid not null references public.agencies(id) on delete cascade,
 reservation_id uuid not null,
 allowed_until date not null,
 reason text not null check(length(trim(reason)) between 3 and 500),
 approved_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 revoked_at timestamptz,
 unique(agency_id,id),
 unique(reservation_id),
 foreign key(agency_id,reservation_id) references public.reservations(agency_id,id)
);
create index reservation_payment_deadline_exceptions_active on public.reservation_payment_deadline_exceptions(agency_id,reservation_id) where revoked_at is null;
alter table public.reservation_payment_deadline_exceptions enable row level security;
alter table public.reservation_payment_deadline_exceptions force row level security;
create policy payment_deadline_exceptions_read on public.reservation_payment_deadline_exceptions for select using(public.has_agency_permission(agency_id,'payments.view'));
revoke all on public.reservation_payment_deadline_exceptions from anon,authenticated;
grant select on public.reservation_payment_deadline_exceptions to authenticated;

create or replace function public.authorize_reservation_payment_deadline(p_reservation uuid,p_allowed_until date,p_reason text) returns uuid language plpgsql security definer set search_path=public,internal as $$
declare r public.reservations%rowtype; exception_id uuid;
begin
 select * into r from public.reservations where id=p_reservation and has_agency_permission(agency_id,'payments.deadline_override') for update;
 if r.id is null or p_allowed_until is null or length(trim(coalesce(p_reason,'')))<3 then raise exception 'payment deadline exception unavailable' using errcode='42501'; end if;
 insert into public.reservation_payment_deadline_exceptions(agency_id,reservation_id,allowed_until,reason,approved_by)
 values(r.agency_id,r.id,p_allowed_until,trim(p_reason),auth.uid())
 on conflict(reservation_id) do update set allowed_until=excluded.allowed_until,reason=excluded.reason,approved_by=excluded.approved_by,created_at=now(),revoked_at=null
 returning id into exception_id;
 insert into public.agency_audit_events(agency_id,actor_user_id,action,entity_type,entity_id,details)
 values(r.agency_id,auth.uid(),'payment_deadline.override','reservations',r.id,jsonb_build_object('allowed_until',p_allowed_until));
 return exception_id;
end$$;

create or replace function public.configure_reservation_balance(p_reservation uuid,p_installments integer,p_first_due_date date default null) returns integer language plpgsql security definer set search_path=public as $$
declare r public.reservations%rowtype; paid_amount numeric(14,2); outstanding numeric(14,2); base_amount numeric(14,2); residual numeric(14,2); installment integer; first_due date; final_due date; trip_departure date;
begin
 select r0.* into r from public.reservations r0 where r0.id=p_reservation and r0.status='CONFIRMED' and has_agency_permission(r0.agency_id,'payments.register') for update;
 if r.id is null or p_installments not between 1 and 24 then raise exception 'balance schedule unavailable' using errcode='42501'; end if;
 if exists(select 1 from public.charges where reservation_id=r.id and charge_type='INSTALLMENT' and status<>'CANCELLED') then raise exception 'balance schedule already exists' using errcode='23505'; end if;
 select departure_at::date into trip_departure from public.trips where id=r.trip_id and agency_id=r.agency_id;
 select allowed_until into final_due from public.reservation_payment_deadline_exceptions where reservation_id=r.id and revoked_at is null;
 final_due:=coalesce(final_due,trip_departure-7);
 first_due:=coalesce(p_first_due_date,current_date);
 if final_due is null or first_due>final_due then raise exception 'payment deadline unavailable' using errcode='22023'; end if;
 select coalesce(sum(a.amount),0) into paid_amount from public.payment_allocations a join public.payments p on p.id=a.payment_id and p.status='CONFIRMED' join public.charges c on c.id=a.charge_id where c.reservation_id=r.id;
 outstanding:=r.total_amount-paid_amount; if outstanding<=0 then raise exception 'reservation has no remaining balance' using errcode='22023'; end if;
 base_amount:=trunc(outstanding/p_installments,2); residual:=outstanding-(base_amount*p_installments);
 for installment in 1..p_installments loop
  insert into public.charges(agency_id,reservation_id,charge_type,amount,due_date) values(r.agency_id,r.id,'INSTALLMENT',base_amount+case when installment=p_installments then residual else 0 end,case when p_installments=1 then final_due else first_due+floor(((final_due-first_due)::numeric*(installment-1))/(p_installments-1))::integer end);
 end loop;
 insert into public.agency_audit_events(agency_id,actor_user_id,action,entity_type,entity_id,details) values(r.agency_id,auth.uid(),'payment_balance.configure','reservations',r.id,jsonb_build_object('installments',p_installments,'outstanding',outstanding,'first_due_date',first_due,'final_due_date',final_due));
 return p_installments;
end$$;
grant execute on function public.authorize_reservation_payment_deadline(uuid,date,text),public.configure_reservation_balance(uuid,integer,date) to authenticated;
commit;
