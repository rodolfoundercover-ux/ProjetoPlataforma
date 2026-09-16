begin;

create or replace function public.configure_reservation_balance(
  p_reservation uuid,
  p_installments integer,
  p_first_due_date date default null
) returns integer language plpgsql security definer set search_path=public as $$
declare
  r public.reservations%rowtype;
  paid_amount numeric(14,2);
  outstanding numeric(14,2);
  base_amount numeric(14,2);
  residual numeric(14,2);
  installment integer;
  due_on date;
begin
  select * into r
  from public.reservations
  where id=p_reservation
    and status='CONFIRMED'
    and has_agency_permission(agency_id,'payments.register')
  for update;

  if r.id is null or p_installments not between 1 and 24 then
    raise exception 'balance schedule unavailable' using errcode='42501';
  end if;

  if exists (
    select 1 from public.charges
    where reservation_id=r.id and charge_type='INSTALLMENT' and status <> 'CANCELLED'
  ) then
    raise exception 'balance schedule already exists' using errcode='23505';
  end if;

  select coalesce(sum(a.amount),0) into paid_amount
  from public.payment_allocations a
  join public.payments p on p.id=a.payment_id and p.status='CONFIRMED'
  join public.charges c on c.id=a.charge_id
  where c.reservation_id=r.id;

  outstanding:=r.total_amount-paid_amount;
  if outstanding<=0 then
    raise exception 'reservation has no remaining balance' using errcode='22023';
  end if;

  base_amount:=trunc(outstanding/p_installments,2);
  residual:=outstanding-(base_amount*p_installments);
  due_on:=coalesce(p_first_due_date,current_date+7);

  for installment in 1..p_installments loop
    insert into public.charges(agency_id,reservation_id,charge_type,amount,due_date)
    values(
      r.agency_id,
      r.id,
      'INSTALLMENT',
      base_amount+case when installment=p_installments then residual else 0 end,
      (due_on+((installment-1)*interval '1 month'))::date
    );
  end loop;

  insert into public.agency_audit_events(agency_id,actor_user_id,action,entity_type,entity_id,details)
  values(r.agency_id,auth.uid(),'payment_balance.configure','reservations',r.id,jsonb_build_object('installments',p_installments,'outstanding',outstanding,'first_due_date',due_on));

  return p_installments;
end$$;

commit;
