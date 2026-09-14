begin;
create schema if not exists internal;
revoke all on schema internal from public, anon, authenticated;
create extension if not exists pgmq;
create extension if not exists pg_cron;
-- No business events or worker jobs are enabled in PHASE_00.
create table internal.outbox (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('PLATFORM', 'AGENCY')),
  agency_id uuid,
  event_type text not null,
  idempotency_key text not null,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now(),
  dispatched_at timestamptz,
  check ((scope = 'PLATFORM' and agency_id is null) or (scope = 'AGENCY' and agency_id is not null))
);
create unique index outbox_platform_idempotency on internal.outbox(event_type, idempotency_key) where scope = 'PLATFORM';
create unique index outbox_agency_idempotency on internal.outbox(agency_id, event_type, idempotency_key) where scope = 'AGENCY';
alter table internal.outbox enable row level security;
alter table internal.outbox force row level security;
revoke all on internal.outbox from public, anon, authenticated;
-- Infrastructure queue contains event references, never raw customer data.
select pgmq.create('domain_events');
revoke all on schema pgmq from public, anon, authenticated;
revoke all on all tables in schema pgmq from public, anon, authenticated;
revoke execute on all functions in schema pgmq from public, anon, authenticated;
-- Private bucket remains inaccessible through end-user API until tenant policies exist.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('private-documents', 'private-documents', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;
commit;

