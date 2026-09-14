begin;
select plan(29);
select has_table('public','agency_settings','agency settings exists');
select has_table('public','agency_branding','agency branding exists');
select has_table('public','agency_domains','agency domains exists');
select has_table('public','passenger_categories','passenger categories exists');
select has_table('public','agency_boarding_locations','boarding locations exists');
select has_table('public','agency_invitations','invitations exists');
select has_table('public','agency_integrations','safe integration references exist');
select has_function('public','resolve_verified_agency','host resolver exists');

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at) values
('11000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','phase2-a@example.test','x',now(),'{}','{}',now(),now()),
('11000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','phase2-b@example.test','x',now(),'{}','{}',now(),now()),
('11000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','invite@example.test','x',now(),'{}','{}',now(),now());
insert into public.accounts(id,legal_name) values('21000000-0000-0000-0000-000000000001','Conta Phase 2');
insert into public.agencies(id,account_id,name) values
('31000000-0000-0000-0000-000000000001','21000000-0000-0000-0000-000000000001','Marca A'),
('31000000-0000-0000-0000-000000000002','21000000-0000-0000-0000-000000000001','Marca B');
insert into public.licenses(account_id,agency_id,status) values
('21000000-0000-0000-0000-000000000001','31000000-0000-0000-0000-000000000001','ACTIVE'),
('21000000-0000-0000-0000-000000000001','31000000-0000-0000-0000-000000000002','ACTIVE');
insert into public.agency_members(agency_id,user_id,role) values
('31000000-0000-0000-0000-000000000001','11000000-0000-0000-0000-000000000001','ADMIN'),
('31000000-0000-0000-0000-000000000002','11000000-0000-0000-0000-000000000002','ADMIN');
insert into public.agency_settings(agency_id,legal_name,cadastur,contact_email,contact_phone,commercial_rules) values
('31000000-0000-0000-0000-000000000001','Agência Legal A','CAD-A','a@example.test','1111','{"refund_policy":"flexible"}'),
('31000000-0000-0000-0000-000000000002','Agência Legal B','CAD-B','b@example.test','2222','{"refund_policy":"strict"}');
insert into public.agency_branding(agency_id,logo_url,primary_color,secondary_color,font_family) values
('31000000-0000-0000-0000-000000000001','https://example.test/a.svg','#112233','#445566','Inter'),
('31000000-0000-0000-0000-000000000002','https://example.test/b.svg','#AABBCC','#DDEEFF','Roboto');
insert into public.agency_domains(id,agency_id,hostname,is_primary,status,ssl_status) values
('41000000-0000-0000-0000-000000000001','31000000-0000-0000-0000-000000000001','a.example.test',true,'VERIFIED','ACTIVE'),
('41000000-0000-0000-0000-000000000002','31000000-0000-0000-0000-000000000002','pending.example.test',true,'PENDING','PENDING');

set local role authenticated;
select set_config('request.jwt.claim.sub','11000000-0000-0000-0000-000000000001',true);
select is((select legal_name from public.agency_settings),'Agência Legal A','settings reopen without loss and remain tenant scoped');
select is((select primary_color from public.agency_branding),'#112233','branding is tenant scoped without cross cache');
select is((select count(*) from public.agency_domains),1::bigint,'member sees only own domain');
select throws_ok($$insert into public.passenger_categories(agency_id,name) values('31000000-0000-0000-0000-000000000002','Cross tenant')$$,'42501',null,'cannot configure another agency category');
select lives_ok($$insert into public.passenger_categories(agency_id,name) values('31000000-0000-0000-0000-000000000001','Adulto')$$,'category is configurable without commercial defaults');
select lives_ok($$insert into public.agency_boarding_locations(agency_id,name,address) values('31000000-0000-0000-0000-000000000001','Terminal','Rua Um')$$,'boarding location is configurable without hidden timing defaults');
select throws_ok($$update public.agency_domains set verified_at=now() where id='41000000-0000-0000-0000-000000000001'$$,'42501','domain verification is provider managed','member cannot self verify domain');
select lives_ok($$insert into public.agency_integrations(agency_id,provider,credential_reference) values('31000000-0000-0000-0000-000000000001','example_provider','vault://agency/example')$$,'authorized admin can save safe integration reference');
reset role;
select is((select agency_id from public.resolve_verified_agency('A.EXAMPLE.TEST.')),'31000000-0000-0000-0000-000000000001'::uuid,'verified active host resolves agency');
select is((select count(*) from public.resolve_verified_agency('pending.example.test')),0::bigint,'unverified host fails closed');
select is((select count(*) from public.resolve_verified_agency('unknown.example.test')),0::bigint,'unknown host fails closed');
select throws_ok($$insert into public.agency_domains(agency_id,hostname,is_primary) values('31000000-0000-0000-0000-000000000001','second.example.test',true)$$,'23505',null,'only one active primary domain per agency');
select ok((select count(*) > 0 from public.agency_audit_events where agency_id='31000000-0000-0000-0000-000000000001' and entity_type='agency_domains'),'domain change creates audit event');
select ok((select count(*) > 0 from internal.outbox where agency_id='31000000-0000-0000-0000-000000000001' and event_type like 'AGENCY_DOMAINS_%'),'domain change creates outbox reference');
select ok((select count(*) > 0 from public.agency_audit_events where agency_id='31000000-0000-0000-0000-000000000001' and entity_type='agency_integrations'),'integration change creates audit event');

insert into public.agency_invitations(id,agency_id,email,member_role,invited_by,token_hash,expires_at) values
('51000000-0000-0000-0000-000000000001','31000000-0000-0000-0000-000000000001','invite@example.test','ANALYST','11000000-0000-0000-0000-000000000001',encode(extensions.digest('single-use','sha256'),'hex'),now()+interval '1 hour');
set local role authenticated;
select set_config('request.jwt.claim.sub','11000000-0000-0000-0000-000000000003',true);
select set_config('request.jwt.claims','{"sub":"11000000-0000-0000-0000-000000000003","email":"invite@example.test","role":"authenticated"}',true);
select is(public.accept_agency_invitation('single-use'),'31000000-0000-0000-0000-000000000001'::uuid,'valid invitation is accepted');
select throws_ok($$select public.accept_agency_invitation('single-use')$$,'22023','invitation is invalid','accepted invitation is single use');
reset role;
insert into public.agency_invitations(agency_id,email,invited_by,token_hash,expires_at,status,revoked_at) values
('31000000-0000-0000-0000-000000000001','revoked@example.test','11000000-0000-0000-0000-000000000001',encode(extensions.digest('revoked','sha256'),'hex'),now()+interval '1 hour','REVOKED',now());
insert into public.agency_invitations(agency_id,email,invited_by,token_hash,expires_at,created_at) values
('31000000-0000-0000-0000-000000000001','invite@example.test','11000000-0000-0000-0000-000000000001',encode(extensions.digest('expired','sha256'),'hex'),now()-interval '1 minute',now()-interval '1 hour');
set local role authenticated;
select set_config('request.jwt.claim.sub','11000000-0000-0000-0000-000000000003',true);
select set_config('request.jwt.claims','{"sub":"11000000-0000-0000-0000-000000000003","email":"revoked@example.test","role":"authenticated"}',true);
select throws_ok($$select public.accept_agency_invitation('revoked')$$,'22023','invitation is invalid','revoked invitation cannot be used');
select set_config('request.jwt.claims','{"sub":"11000000-0000-0000-0000-000000000003","email":"invite@example.test","role":"authenticated"}',true);
select throws_ok($$select public.accept_agency_invitation('expired')$$,'22023','invitation is invalid','expired invitation cannot be used');
select throws_ok($$insert into public.agency_integrations(agency_id,provider) values('31000000-0000-0000-0000-000000000001','forbidden_provider')$$,'42501',null,'analyst without permission cannot change integrations');
reset role;
update public.agency_members set status='INACTIVE' where agency_id='31000000-0000-0000-0000-000000000001' and user_id='11000000-0000-0000-0000-000000000003';
set local role authenticated;
select set_config('request.jwt.claim.sub','11000000-0000-0000-0000-000000000003',true);
select is((select count(*) from public.agency_settings),0::bigint,'deactivated member loses effective access');
reset role;
select * from finish();
rollback;
