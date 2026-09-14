insert into public.accounts (id, legal_name)
values ('40000000-0000-0000-0000-000000000001', 'Conta de validação')
on conflict do nothing;

insert into public.agencies (id, account_id, name)
values (
  '40000000-0000-0000-0000-000000000002',
  '40000000-0000-0000-0000-000000000001',
  'Agência de validação'
)
on conflict do nothing;

insert into public.licenses (account_id, agency_id, status)
values (
  '40000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000002',
  'ACTIVE'
)
on conflict do nothing;

insert into public.agency_members (agency_id, user_id, role, status)
values (
  '40000000-0000-0000-0000-000000000002',
  'be723894-df8c-44ef-843f-cbfd2baee9a5',
  'ADMIN',
  'ACTIVE'
)
on conflict do nothing;