begin;

create type public.invitation_status as enum ('PENDING','ACCEPTED','EXPIRED','REVOKED');
create type public.domain_status as enum ('PENDING','VERIFYING','VERIFIED','ERROR','DISABLED');
create type public.ssl_status as enum ('PENDING','ISSUING','ACTIVE','ERROR');
create type public.integration_status as enum ('DISCONNECTED','CONNECTING','CONNECTED','DEGRADED','ERROR','DISABLED');

insert into public.permissions(key, description) values
  ('settings.view','Visualizar configurações da agência'),
  ('settings.edit','Editar dados e regras da agência'),
  ('settings.integrations.manage','Gerenciar referências de integrações'),
  ('settings.branding.manage','Gerenciar identidade visual'),
  ('settings.domain.manage','Gerenciar domínios'),
  ('team.view','Visualizar equipe e convites'),
  ('team.create','Convidar integrantes'),
  ('team.edit','Editar integrantes')
on conflict (key) do update set description=excluded.description;

create or replace function public.has_agency_permission(target_agency uuid, required_key text) returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.agency_members m
    join public.licenses l on l.agency_id=m.agency_id and l.status='ACTIVE'
    left join public.permission_profile_permissions pp on pp.profile_id=m.profile_id
    left join public.agency_member_permissions mp on mp.agency_member_id=m.id
    where m.agency_id=target_agency and m.user_id=auth.uid() and m.status='ACTIVE'
      and (m.role='ADMIN' or pp.permission_key=required_key or mp.permission_key=required_key)
  )
$$;

create table public.agency_settings (
  agency_id uuid primary key references public.agencies(id) on delete cascade,
  legal_name text not null check (length(trim(legal_name)) > 0),
  cadastur text,
  contact_email text,
  contact_phone text,
  timezone text not null default 'America/Sao_Paulo',
  commercial_rules jsonb not null default '{}'::jsonb check (jsonb_typeof(commercial_rules)='object'),
  updated_at timestamptz not null default now()
);
create table public.agency_branding (
  agency_id uuid primary key references public.agencies(id) on delete cascade,
  logo_url text,
  primary_color text not null default '#075985' check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  secondary_color text not null default '#172B3A' check (secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
  font_family text not null default 'Arial' check (font_family in ('Arial','Inter','Roboto','Montserrat')),
  updated_at timestamptz not null default now()
);
create table public.agency_domains (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  hostname text not null check (hostname=lower(hostname) and hostname !~ '[/?:#]' and hostname ~ '^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$'),
  is_platform_subdomain boolean not null default false, is_primary boolean not null default false,
  status public.domain_status not null default 'PENDING', ssl_status public.ssl_status not null default 'PENDING',
  verification_token_hash text, verified_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(hostname), unique(id,agency_id)
);
create unique index agency_domains_one_primary on public.agency_domains(agency_id) where is_primary and status <> 'DISABLED';
create table public.passenger_categories (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  name text not null check(length(trim(name)) between 2 and 80), active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(agency_id,name), unique(id,agency_id)
);
create table public.agency_boarding_locations (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  name text not null check(length(trim(name)) between 2 and 100), address text not null check(length(trim(address)) > 0),
  advance_minutes integer check(advance_minutes between 0 and 1440), tolerance_minutes integer check(tolerance_minutes between 0 and 1440), active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(agency_id,name), unique(id,agency_id)
);
create table public.agency_invitations (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  email text not null check(email=lower(trim(email))), member_role public.member_role not null default 'ANALYST', invited_by uuid not null references auth.users(id),
  token_hash text not null unique, expires_at timestamptz not null, status public.invitation_status not null default 'PENDING',
  created_at timestamptz not null default now(), accepted_at timestamptz, revoked_at timestamptz,
  check(expires_at > created_at), unique(id,agency_id)
);
create unique index agency_invitations_pending_email on public.agency_invitations(agency_id,email) where status='PENDING';
create table public.agency_integrations (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  provider text not null check(provider ~ '^[a-z0-9_]+$'), status public.integration_status not null default 'DISCONNECTED',
  credential_reference text check(credential_reference is null or credential_reference ~ '^[a-zA-Z0-9_./:-]+$'),
  updated_at timestamptz not null default now(), unique(agency_id,provider), unique(id,agency_id)
);
create table public.agency_audit_events (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  actor_user_id uuid references auth.users(id), action text not null, entity_type text not null, entity_id uuid,
  details jsonb not null default '{}'::jsonb check(jsonb_typeof(details)='object'), created_at timestamptz not null default now()
);

create or replace function public.touch_agency_record() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create or replace function public.protect_domain_verification() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and (new.status is distinct from old.status or new.ssl_status is distinct from old.ssl_status or new.verified_at is distinct from old.verified_at) then
    raise exception 'domain verification is provider managed' using errcode='42501';
  end if;
  return new;
end $$;
create or replace function public.audit_agency_change() returns trigger language plpgsql security definer set search_path=public,internal as $$
declare aid uuid; eid uuid; act text;
begin
  aid=coalesce(new.agency_id,old.agency_id); eid=coalesce(new.id,old.id); act=tg_table_name||'.'||lower(tg_op);
  insert into public.agency_audit_events(agency_id,actor_user_id,action,entity_type,entity_id,details)
  values(aid,auth.uid(),act,tg_table_name,eid,jsonb_build_object('status',coalesce(to_jsonb(new)->>'status',to_jsonb(old)->>'status')));
  insert into internal.outbox(scope,agency_id,event_type,idempotency_key,payload)
  values('AGENCY',aid,upper(tg_table_name||'_'||tg_op),tg_table_name||':'||coalesce(eid::text,aid::text)||':'||extract(epoch from clock_timestamp())::text,jsonb_build_object('entity_id',eid));
  return coalesce(new,old);
end $$;

create trigger agency_settings_touch before update on public.agency_settings for each row execute function public.touch_agency_record();
create trigger agency_branding_touch before update on public.agency_branding for each row execute function public.touch_agency_record();
create trigger agency_domains_touch before update on public.agency_domains for each row execute function public.touch_agency_record();
create trigger agency_domains_protect_verification before update on public.agency_domains for each row execute function public.protect_domain_verification();
create trigger passenger_categories_touch before update on public.passenger_categories for each row execute function public.touch_agency_record();
create trigger boarding_locations_touch before update on public.agency_boarding_locations for each row execute function public.touch_agency_record();
create trigger agency_integrations_touch before update on public.agency_integrations for each row execute function public.touch_agency_record();
create trigger agency_settings_immutable_tenant before update on public.agency_settings for each row execute function public.prevent_tenant_transfer();
create trigger agency_branding_immutable_tenant before update on public.agency_branding for each row execute function public.prevent_tenant_transfer();
create trigger agency_domains_immutable_tenant before update on public.agency_domains for each row execute function public.prevent_tenant_transfer();
create trigger passenger_categories_immutable_tenant before update on public.passenger_categories for each row execute function public.prevent_tenant_transfer();
create trigger boarding_locations_immutable_tenant before update on public.agency_boarding_locations for each row execute function public.prevent_tenant_transfer();
create trigger agency_invitations_immutable_tenant before update on public.agency_invitations for each row execute function public.prevent_tenant_transfer();
create trigger agency_integrations_immutable_tenant before update on public.agency_integrations for each row execute function public.prevent_tenant_transfer();
create trigger audit_domains after insert or update or delete on public.agency_domains for each row execute function public.audit_agency_change();
create trigger audit_integrations after insert or update or delete on public.agency_integrations for each row execute function public.audit_agency_change();

create or replace function public.resolve_verified_agency(host_name text) returns table(agency_id uuid,hostname text) language sql stable security definer set search_path=public as $$
  select d.agency_id,d.hostname from public.agency_domains d join public.licenses l on l.agency_id=d.agency_id
  where d.hostname=lower(trim(trailing '.' from host_name)) and d.status='VERIFIED' and d.ssl_status='ACTIVE' and l.status='ACTIVE' limit 1
$$;
create or replace function public.accept_agency_invitation(raw_token text) returns uuid language plpgsql security definer set search_path=public,extensions as $$
declare inv public.agency_invitations%rowtype; current_email text;
begin
  current_email=lower(coalesce(auth.jwt()->>'email',''));
  select * into inv from public.agency_invitations where token_hash=encode(digest(raw_token,'sha256'),'hex') for update;
  if inv.id is null or inv.status <> 'PENDING' or inv.expires_at <= now() or inv.email <> current_email then raise exception 'invitation is invalid' using errcode='22023'; end if;
  insert into public.agency_members(agency_id,user_id,role,status) values(inv.agency_id,auth.uid(),inv.member_role,'ACTIVE')
  on conflict(agency_id,user_id) do update set role=excluded.role,status='ACTIVE';
  update public.agency_invitations set status='ACCEPTED',accepted_at=now() where id=inv.id and status='PENDING';
  insert into public.agency_audit_events(agency_id,actor_user_id,action,entity_type,entity_id) values(inv.agency_id,auth.uid(),'invitation.accept','agency_invitations',inv.id);
  return inv.agency_id;
end $$;

do $$ declare t text; begin foreach t in array array['agency_settings','agency_branding','agency_domains','passenger_categories','agency_boarding_locations','agency_invitations','agency_integrations','agency_audit_events'] loop execute format('alter table public.%I enable row level security',t); execute format('alter table public.%I force row level security',t); end loop; end $$;

create policy settings_read on public.agency_settings for select using(public.has_agency_permission(agency_id,'settings.view'));
create policy settings_write on public.agency_settings for all using(public.has_agency_permission(agency_id,'settings.edit')) with check(public.has_agency_permission(agency_id,'settings.edit'));
create policy branding_read on public.agency_branding for select using(public.is_active_member(agency_id));
create policy branding_write on public.agency_branding for all using(public.has_agency_permission(agency_id,'settings.branding.manage')) with check(public.has_agency_permission(agency_id,'settings.branding.manage'));
create policy domains_read on public.agency_domains for select using(public.has_agency_permission(agency_id,'settings.view'));
create policy domains_write on public.agency_domains for all using(public.has_agency_permission(agency_id,'settings.domain.manage')) with check(public.has_agency_permission(agency_id,'settings.domain.manage'));
create policy categories_read on public.passenger_categories for select using(public.is_active_member(agency_id));
create policy categories_write on public.passenger_categories for all using(public.has_agency_permission(agency_id,'settings.edit')) with check(public.has_agency_permission(agency_id,'settings.edit'));
create policy boarding_read on public.agency_boarding_locations for select using(public.is_active_member(agency_id));
create policy boarding_write on public.agency_boarding_locations for all using(public.has_agency_permission(agency_id,'settings.edit')) with check(public.has_agency_permission(agency_id,'settings.edit'));
create policy invitations_read on public.agency_invitations for select using(public.has_agency_permission(agency_id,'team.view'));
create policy invitations_insert on public.agency_invitations for insert with check(public.has_agency_permission(agency_id,'team.create') and invited_by=auth.uid());
create policy invitations_update on public.agency_invitations for update using(public.has_agency_permission(agency_id,'team.edit')) with check(public.has_agency_permission(agency_id,'team.edit'));
create policy integrations_read on public.agency_integrations for select using(public.has_agency_permission(agency_id,'settings.view'));
create policy integrations_write on public.agency_integrations for all using(public.has_agency_permission(agency_id,'settings.integrations.manage')) with check(public.has_agency_permission(agency_id,'settings.integrations.manage'));
create policy audit_read on public.agency_audit_events for select using(public.is_active_member(agency_id));

grant select,insert,update,delete on public.agency_settings,public.agency_branding,public.agency_domains,public.passenger_categories,public.agency_boarding_locations,public.agency_invitations,public.agency_integrations to authenticated;
grant select on public.agency_audit_events to authenticated;
grant execute on function public.resolve_verified_agency(text) to anon,authenticated;
grant execute on function public.accept_agency_invitation(text) to authenticated;
revoke insert,update,delete on public.agency_audit_events from authenticated,anon;

commit;
