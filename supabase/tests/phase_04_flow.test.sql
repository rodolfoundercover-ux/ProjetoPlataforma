begin;
select plan(11);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values('14000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','phase4-flow@example.test','x',now(),'{}','{}',now(),now());
insert into public.accounts(id,legal_name) values('24000000-0000-0000-0000-000000000001','Conta PHASE 04');
insert into public.agencies(id,account_id,name) values('34000000-0000-0000-0000-000000000001','24000000-0000-0000-0000-000000000001','Agência PHASE 04');
insert into public.licenses(account_id,agency_id,status) values('24000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','ACTIVE');
insert into public.agency_members(agency_id,user_id,role) values('34000000-0000-0000-0000-000000000001','14000000-0000-0000-0000-000000000001','ADMIN');
insert into public.passenger_categories(id,agency_id,name,min_age,max_age,occupies_seat_default,sort_order) values('44000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','Adulto',18,null,true,1);
insert into public.trips(id,agency_id,code,title,slug,destination,departure_at,return_at,status,created_by) values('54000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','P04-FLOW','Viagem PHASE 04','phase-04-flow','Destino',now()+interval '30 days',now()+interval '32 days','SALES_OPEN','14000000-0000-0000-0000-000000000001');
insert into public.trip_boarding_points(id,agency_id,trip_id,address_snapshot,name_snapshot,boarding_at,sort_order) values('64000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','54000000-0000-0000-0000-000000000001','Terminal A','Embarque A',now()+interval '30 days',1),('64000000-0000-0000-0000-000000000002','34000000-0000-0000-0000-000000000001','54000000-0000-0000-0000-000000000001','Terminal B','Embarque B',now()+interval '30 days',2);
insert into public.trip_passenger_prices(agency_id,trip_id,passenger_category_id,list_price,minimum_price_without_approval,occupies_seat) values('34000000-0000-0000-0000-000000000001','54000000-0000-0000-0000-000000000001','44000000-0000-0000-0000-000000000001',500.00,450.00,true);
insert into public.trip_vehicle_assignments(id,agency_id,trip_id,capacity_snapshot,reason,created_by) values('94000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','54000000-0000-0000-0000-000000000001',2,'Teste','14000000-0000-0000-0000-000000000001');
insert into public.agency_customers(id,agency_id,full_name,display_name,document,status) values('a4000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','Comprador','Comprador','DOC-COMP','ACTIVE');
insert into public.agency_passengers(id,agency_id,owner_customer_id,full_name,document,birth_date,status) values('b4000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','Passageiro Um','DOC-P1','1990-01-01','ACTIVE'),('b4000000-0000-0000-0000-000000000002','34000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','Passageiro Dois','DOC-P2','1991-01-01','ACTIVE'),('b4000000-0000-0000-0000-000000000003','34000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','Passageiro Três','DOC-P3','1992-01-01','ACTIVE');

set local role authenticated;
select set_config('request.jwt.claim.sub','14000000-0000-0000-0000-000000000001',true);
create temporary table phase04_flow(id uuid);
insert into phase04_flow select public.create_manual_reservation('54000000-0000-0000-0000-000000000001','a4000000-0000-0000-0000-000000000001','DIRECT','PANEL',now()+interval '30 minutes');
select ok((select id is not null from phase04_flow),'buyer creates a draft reservation without travelling');
select throws_ok($$select public.add_reservation_passenger((select id from phase04_flow),'b4000000-0000-0000-0000-000000000001','64000000-0000-0000-0000-000000000001',400.00)$$,'42501',null,'discount below the minimum needs approval');
insert into public.approval_requests(agency_id,reservation_id,passenger_id,requested_sale_price,list_price,context_hash,status,reason,requested_by,decided_by,decided_at,expires_at) values('34000000-0000-0000-0000-000000000001',(select id from phase04_flow),'b4000000-0000-0000-0000-000000000001',400.00,500.00,encode(extensions.digest('54000000-0000-0000-0000-000000000001:b4000000-0000-0000-0000-000000000001:400.00','sha256'),'hex'),'APPROVED','Teste','14000000-0000-0000-0000-000000000001','14000000-0000-0000-0000-000000000001',now(),now()+interval '1 hour');
select lives_ok($$select public.add_reservation_passenger((select id from phase04_flow),'b4000000-0000-0000-0000-000000000001','64000000-0000-0000-0000-000000000001',400.00)$$,'approved discount is accepted');
update public.agency_passengers set full_name='Nome alterado' where id='b4000000-0000-0000-0000-000000000001';
select is((select passenger_name_snapshot from public.reservation_passengers where reservation_id=(select id from phase04_flow) and passenger_id='b4000000-0000-0000-0000-000000000001'),'Passageiro Um','passenger snapshot survives later profile edits');
select lives_ok($$select public.add_reservation_passenger((select id from phase04_flow),'b4000000-0000-0000-0000-000000000002','64000000-0000-0000-0000-000000000002',500.00)$$,'second passenger receives an individual boarding point');
select is((select total_amount::text from public.reservations where id=(select id from phase04_flow)),'900.00','reservation total is the exact sum of individual prices');
select throws_ok($$select public.add_reservation_passenger((select id from phase04_flow),'b4000000-0000-0000-0000-000000000003','64000000-0000-0000-0000-000000000001',500.00)$$,'P0001',null,'last available seat has one winner');
select lives_ok($$select public.submit_reservation((select id from phase04_flow))$$,'reservation is submitted only by backend');
select is((select status::text from public.reservations where id=(select id from phase04_flow)),'WAITING_ENTRY','reservation reaches WAITING_ENTRY without a frontend confirmation');
update public.reservations set expires_at=now()-interval '1 minute' where id=(select id from phase04_flow);
select lives_ok($$select public.expire_reservations()$$,'backend expiration job runs');
select is((select count(*) from public.seat_holds where reservation_id=(select id from phase04_flow)),0::bigint,'expired holds are released even without browser activity');
select * from finish();
rollback;
