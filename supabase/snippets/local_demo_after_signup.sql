-- Dados exclusivamente locais e fictícios para validar reservas e pagamentos.
-- Antes de executar, crie a conta no Supabase local e substitua o e-mail abaixo.
-- Não use este arquivo no Supabase Cloud ou em produção.

do $$
declare
  demo_user uuid;
begin
  select id into demo_user from auth.users where email = 'SEU_EMAIL_LOCAL_AQUI';
  if demo_user is null then
    raise exception 'Crie primeiro a conta local e informe o mesmo e-mail neste arquivo';
  end if;

  insert into public.accounts(id,legal_name) values ('71000000-0000-0000-0000-000000000001','Agência Demonstração Local') on conflict(id) do nothing;
  insert into public.agencies(id,account_id,name) values ('72000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','Viagens Demonstração') on conflict(id) do nothing;
  insert into public.licenses(id,account_id,agency_id,status) values ('73000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','ACTIVE') on conflict(agency_id) do update set status='ACTIVE';
  insert into public.agency_members(agency_id,user_id,role,status) values ('72000000-0000-0000-0000-000000000001',demo_user,'ADMIN','ACTIVE') on conflict(agency_id,user_id) do update set role='ADMIN',status='ACTIVE';
  insert into public.passenger_categories(id,agency_id,name,min_age,max_age,occupies_seat_default,sort_order) values ('74000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','Adulto',18,null,true,1) on conflict(id) do nothing;
  insert into public.trips(id,agency_id,code,title,slug,destination,departure_at,return_at,status,created_by) values ('75000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','DEMO-001','Excursão de demonstração','excursao-demonstracao','Destino fictício',now()+interval '30 days',now()+interval '32 days','SALES_OPEN',demo_user) on conflict(id) do nothing;
  insert into public.trip_boarding_points(id,agency_id,trip_id,address_snapshot,name_snapshot,boarding_at,sort_order) values ('76000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','75000000-0000-0000-0000-000000000001','Terminal de demonstração','Terminal de demonstração',now()+interval '30 days',1) on conflict(id) do nothing;
  insert into public.trip_passenger_prices(id,agency_id,trip_id,passenger_category_id,list_price,minimum_price_without_approval,occupies_seat,active) values ('77000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','75000000-0000-0000-0000-000000000001','74000000-0000-0000-0000-000000000001',900.00,900.00,true,true) on conflict(id) do nothing;
  insert into public.trip_vehicle_assignments(id,agency_id,trip_id,capacity_snapshot,reason,created_by) values ('78000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','75000000-0000-0000-0000-000000000001',20,'Dados locais de demonstração',demo_user) on conflict(id) do nothing;
  insert into public.agency_customers(id,agency_id,full_name,display_name,document,status) values ('79000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','Comprador de demonstração','Comprador de demonstração','DEMO-CUSTOMER-001','ACTIVE') on conflict(id) do nothing;
  insert into public.agency_passengers(id,agency_id,owner_customer_id,full_name,document,birth_date,status) values ('7a000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000001','79000000-0000-0000-0000-000000000001','Passageiro de demonstração','DEMO-PASSENGER-001','1990-01-01','ACTIVE') on conflict(id) do nothing;
end $$;
