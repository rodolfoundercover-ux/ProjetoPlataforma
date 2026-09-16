begin;
select plan(34);

select has_table('public','charges','charges are persisted');
select has_table('public','payments','payments are persisted');
select has_table('public','payment_allocations','allocations are persisted');
select has_table('public','payment_webhook_events','webhook events are persisted');
select has_table('public','payment_reconciliation_exceptions','late-payment exceptions are persisted');
select col_type_is('public','charges','amount','numeric(14,2)','charge money is exact');
select col_type_is('public','payments','amount','numeric(14,2)','payment money is exact');
select has_function('public','configure_reservation_charges',array['uuid','numeric','date'],'entry schedule is transactional');
select has_function('public','configure_reservation_balance',array['uuid','integer','date'],'balance schedule is transactional');
select has_function('public','register_cash_payment',array['uuid','numeric','text'],'cash registration is transactional');
select has_function('public','record_provider_confirmation',array['public.payment_provider','text','uuid','text','numeric','text'],'provider confirmation is transactional');

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values('15000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','phase5-admin@example.test','x',now(),'{}','{}',now(),now());
insert into public.accounts(id,legal_name) values('25000000-0000-0000-0000-000000000001','Conta PHASE 05');
insert into public.agencies(id,account_id,name) values('35000000-0000-0000-0000-000000000001','25000000-0000-0000-0000-000000000001','Agência PHASE 05');
insert into public.licenses(account_id,agency_id,status) values('25000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001','ACTIVE');
insert into public.agency_members(agency_id,user_id,role) values('35000000-0000-0000-0000-000000000001','15000000-0000-0000-0000-000000000001','ADMIN');
insert into public.passenger_categories(id,agency_id,name,min_age,max_age,occupies_seat_default,sort_order) values('45000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001','Adulto',18,null,true,1);
insert into public.trips(id,agency_id,code,title,slug,destination,departure_at,return_at,status,created_by) values('55000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001','P05-FLOW','Viagem PHASE 05','phase-05-flow','Destino',now()+interval '30 days',now()+interval '32 days','SALES_OPEN','15000000-0000-0000-0000-000000000001');
insert into public.trip_boarding_points(id,agency_id,trip_id,address_snapshot,name_snapshot,boarding_at,sort_order) values('65000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001','55000000-0000-0000-0000-000000000001','Terminal','Embarque',now()+interval '30 days',1);
insert into public.trip_passenger_prices(agency_id,trip_id,passenger_category_id,list_price,minimum_price_without_approval,occupies_seat) values('35000000-0000-0000-0000-000000000001','55000000-0000-0000-0000-000000000001','45000000-0000-0000-0000-000000000001',900.00,900.00,true);
insert into public.trip_vehicle_assignments(id,agency_id,trip_id,capacity_snapshot,reason,created_by) values('95000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001','55000000-0000-0000-0000-000000000001',3,'Teste','15000000-0000-0000-0000-000000000001');
insert into public.agency_customers(id,agency_id,full_name,display_name,document,status) values('a5000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001','Comprador','Comprador','DOC-P05','ACTIVE');
insert into public.agency_passengers(id,agency_id,owner_customer_id,full_name,document,birth_date,status) values('b5000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001','a5000000-0000-0000-0000-000000000001','Passageiro','DOC-P05-P','1990-01-01','ACTIVE');

set local role authenticated;
select set_config('request.jwt.claim.sub','15000000-0000-0000-0000-000000000001',true);
create temporary table phase05_flow(id uuid,charge_id uuid);
insert into phase05_flow(id) select public.create_manual_reservation('55000000-0000-0000-0000-000000000001','a5000000-0000-0000-0000-000000000001','DIRECT','PANEL',now()+interval '1 hour');
select lives_ok($$select public.add_reservation_passenger((select id from phase05_flow),'b5000000-0000-0000-0000-000000000001','65000000-0000-0000-0000-000000000001',900.00)$$,'reservation gets a passenger before payment');
select lives_ok($$select public.submit_reservation((select id from phase05_flow))$$,'reservation awaits entry');
update phase05_flow set charge_id=public.configure_reservation_charges(id,300.00,current_date+7) returning charge_id;
select is((select entry_amount::text from public.reservations where id=(select id from phase05_flow)),'300.00','entry is configured without an invented global percentage');
select lives_ok($$select public.register_cash_payment((select charge_id from phase05_flow),100.00,'cash-phase05-0001')$$,'partial cash is accepted');
select is((select status::text from public.charges where id=(select charge_id from phase05_flow)),'PARTIALLY_PAID','partial payment preserves balance');
select is((select status::text from public.reservations where id=(select id from phase05_flow)),'WAITING_ENTRY','partial entry does not confirm reservation');
select lives_ok($$select public.register_cash_payment((select charge_id from phase05_flow),200.00,'cash-phase05-0002')$$,'remaining cash is accepted');
select is((select status::text from public.charges where id=(select charge_id from phase05_flow)),'PAID','entry charge is paid only after its full allocation');
select is((select status::text from public.reservations where id=(select id from phase05_flow)),'CONFIRMED','paid entry confirms an eligible reservation');
select is((select financial_status::text from public.reservations where id=(select id from phase05_flow)),'ENTRY_PAID','entry payment is distinct from full payment');
select is((select count(*) from public.payments where reservation_id=(select id from phase05_flow)),2::bigint,'two cash facts remain in history');
select is((select public.register_cash_payment((select charge_id from phase05_flow),200.00,'cash-phase05-0002')),(select id from public.payments where agency_id='35000000-0000-0000-0000-000000000001' and idempotency_key='cash-phase05-0002'),'cash retry returns the original payment');
select is((select count(*) from public.payments where agency_id='35000000-0000-0000-0000-000000000001' and idempotency_key='cash-phase05-0002'),1::bigint,'cash retry does not duplicate a payment');
select lives_ok($$select public.configure_reservation_balance((select id from phase05_flow),2,current_date+7)$$,'remaining balance can be scheduled');
select is((select count(*) from public.charges where reservation_id=(select id from phase05_flow) and charge_type='INSTALLMENT'),2::bigint,'balance creates the requested number of installments');
select is((select coalesce(sum(amount),0)::text from public.charges where reservation_id=(select id from phase05_flow) and charge_type='INSTALLMENT'),'600.00','installments equal the exact remaining balance');
select throws_ok($$select public.configure_reservation_balance((select id from phase05_flow),2,current_date+7)$$,'23505',null,'balance schedule cannot be duplicated');

reset role;
select set_config('request.jwt.claim.sub','',true);
insert into public.payments(id,agency_id,reservation_id,provider,account_scope,payment_method,status,amount,provider_payment_id,idempotency_key)
values('c5000000-0000-0000-0000-000000000001','35000000-0000-0000-0000-000000000001',(select id from phase05_flow),'MERCADO_PAGO','AGENCY','PIX','PENDING',300.00,'provider-payment-p05','provider-phase05-0001');
update public.reservations set status='EXPIRED',expired_at=now() where id=(select id from phase05_flow);
select lives_ok($$select public.record_provider_confirmation('MERCADO_PAGO','event-phase05-0001','c5000000-0000-0000-0000-000000000001','provider-payment-p05',300.00,repeat('a',64))$$,'late provider fact is recorded');
select is((select status::text from public.reservations where id=(select id from phase05_flow)),'EXPIRED','late payment never resurrects expired reservation');
select is((select status::text from public.payments where id='c5000000-0000-0000-0000-000000000001'),'EXCEPTION','late payment is marked for reconciliation');
select is((select count(*) from public.payment_reconciliation_exceptions where payment_id='c5000000-0000-0000-0000-000000000001'),1::bigint,'late payment creates exactly one exception');
select is((select public.record_provider_confirmation('MERCADO_PAGO','event-phase05-0001','c5000000-0000-0000-0000-000000000001','provider-payment-p05',300.00,repeat('a',64))),'c5000000-0000-0000-0000-000000000001'::uuid,'repeated webhook is idempotent');
select is((select count(*) from public.payment_webhook_events where provider='MERCADO_PAGO' and external_event_id='event-phase05-0001'),1::bigint,'webhook event has one durable idempotency record');
select * from finish();
rollback;
