begin;
select plan(16);
select has_table('public','agency_members','agency members exists');
select has_table('public','agency_customers','tenant customers exists');
select ok((select relrowsecurity from pg_class where oid='public.agency_members'::regclass),'member RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.agency_customers'::regclass),'customer RLS enabled');
select has_function('public','prevent_last_admin_removal','last admin guard exists');
select has_function('public','has_agency_permission','permission helper exists');

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','admin-a@example.test','x',now(),'{}','{}',now(),now()),
 ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','admin-b@example.test','x',now(),'{}','{}',now(),now()),
 ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','customer@example.test','x',now(),'{}','{}',now(),now()),
 ('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','analyst@example.test','x',now(),'{}','{}',now(),now()),
 ('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','platform@example.test','x',now(),'{}','{}',now(),now());
insert into public.accounts(id,legal_name) values ('20000000-0000-0000-0000-000000000001','Conta de teste');
insert into public.agencies(id,account_id,name) values
 ('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Agência A'),
 ('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','Agência B');
insert into public.agency_members(agency_id,user_id,role) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','ADMIN'),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','ADMIN'),
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004','ANALYST');
insert into public.licenses(account_id,agency_id,status) values
 ('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','ACTIVE'),
 ('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','ACTIVE');
insert into public.platform_admins(user_id) values ('10000000-0000-0000-0000-000000000005');
insert into public.agency_customers(agency_id,auth_user_id,display_name) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','Cliente A'),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000003','Cliente B');

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is((select count(*) from public.agencies),1::bigint,'member A only reads agency A');
select is((select count(*) from public.agency_customers),1::bigint,'member A cannot read customer B');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select is((select count(*) from public.agency_customers),2::bigint,'same customer identity sees only own tenant-local rows');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000005',true);
select is((select count(*) from public.agency_customers),0::bigint,'platform admin has no private customer bypass');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000004',true);
select ok(not public.has_agency_permission('30000000-0000-0000-0000-000000000001','team.manage_permissions'),'analyst has no implicit management permission');
select throws_ok($$insert into public.permission_profiles(agency_id,name) values ('30000000-0000-0000-0000-000000000001','Escalation')$$,'42501',null,'analyst cannot alter permission profiles');
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',true);
select throws_ok($$insert into public.agency_customers(agency_id,auth_user_id,display_name) values ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Cross tenant')$$,'42501',null,'customer cannot create relation for another identity');
reset role;
select throws_ok($$update public.agency_members set status='INACTIVE' where agency_id='30000000-0000-0000-0000-000000000001'$$,'23514','cannot remove the last active admin','last active admin cannot be deactivated');
select throws_ok($$update public.agency_customers set agency_id='30000000-0000-0000-0000-000000000002' where agency_id='30000000-0000-0000-0000-000000000001'$$,'23514','agency_id is immutable','tenant transfer is rejected');
update public.licenses set status='SUSPENDED' where agency_id='30000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select is((select count(*) from public.agencies),0::bigint,'suspended license grants no tenant access');
reset role;
select * from finish();
rollback;
