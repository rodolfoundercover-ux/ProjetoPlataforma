begin;
select plan(7);
select has_table('internal', 'outbox', 'outbox exists');
select ok((select relrowsecurity and relforcerowsecurity from pg_class where oid = 'internal.outbox'::regclass), 'outbox RLS enforced');
select ok(not has_schema_privilege('anon', 'internal', 'USAGE'), 'anon cannot access internal schema');
select ok(not has_table_privilege('authenticated', 'internal.outbox', 'SELECT'), 'authenticated cannot read outbox');
select ok(not has_schema_privilege('authenticated', 'pgmq', 'USAGE'), 'authenticated cannot consume queue');
select ok((select not public from storage.buckets where id = 'private-documents'), 'document bucket private');
select throws_ok(
  $$insert into internal.outbox(scope, event_type, idempotency_key) values ('AGENCY', 'test', 'missing-agency')$$,
  '23514', null, 'agency scope requires agency id'
);
select * from finish();
rollback;

