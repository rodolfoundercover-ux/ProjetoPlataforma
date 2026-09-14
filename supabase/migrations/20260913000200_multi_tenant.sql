begin;

create type public.member_role as enum ('ADMIN', 'ANALYST');
create type public.member_status as enum ('ACTIVE', 'INACTIVE');
create type public.license_status as enum ('ACTIVE', 'SUSPENDED', 'CANCELLED');

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null check (length(trim(legal_name)) > 0),
  created_at timestamptz not null default now()
);
create table public.plans (
  id uuid primary key default gen_random_uuid(), name text not null unique, created_at timestamptz not null default now()
);
create table public.agencies (
  id uuid primary key default gen_random_uuid(), account_id uuid not null references public.accounts(id),
  name text not null check (length(trim(name)) > 0), created_at timestamptz not null default now(), unique(account_id, name)
);
create table public.licenses (
  id uuid primary key default gen_random_uuid(), account_id uuid not null references public.accounts(id),
  agency_id uuid not null unique references public.agencies(id), plan_id uuid references public.plans(id),
  status public.license_status not null default 'ACTIVE', created_at timestamptz not null default now()
);
create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now()
);
create table public.features (key text primary key, description text not null, created_at timestamptz not null default now());
create table public.agency_features (
  agency_id uuid not null references public.agencies(id) on delete cascade, feature_key text not null references public.features(key), enabled boolean not null default false,
  primary key(agency_id, feature_key)
);
create table public.permissions (key text primary key, description text not null, created_at timestamptz not null default now());
create table public.permission_profiles (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  name text not null, created_at timestamptz not null default now(), unique(agency_id, name)
);
create unique index permission_profiles_id_agency on public.permission_profiles(id, agency_id);
create table public.permission_profile_permissions (
  profile_id uuid not null references public.permission_profiles(id) on delete cascade, permission_key text not null references public.permissions(key),
  primary key(profile_id, permission_key)
);
create table public.agency_members (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, role public.member_role not null, status public.member_status not null default 'ACTIVE',
  profile_id uuid, created_at timestamptz not null default now(), unique(agency_id, user_id),
  foreign key (profile_id, agency_id) references public.permission_profiles(id, agency_id) deferrable initially immediate
);
create table public.agency_member_permissions (
  agency_member_id uuid not null references public.agency_members(id) on delete cascade, permission_key text not null references public.permissions(key),
  primary key(agency_member_id, permission_key)
);
-- Customer identity remains global; the commercial relationship is tenant-local.
create table public.agency_customers (
  id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
  auth_user_id uuid not null references auth.users(id) on delete cascade, display_name text not null,
  created_at timestamptz not null default now(), unique(agency_id, auth_user_id)
);

create or replace function public.is_active_member(target_agency uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.agency_members m
    join public.licenses l on l.agency_id=m.agency_id
    where m.agency_id = target_agency and m.user_id = auth.uid() and m.status = 'ACTIVE' and l.status = 'ACTIVE'
  )
$$;
create or replace function public.is_agency_customer(target_agency uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.agency_customers where agency_id = target_agency and auth_user_id = auth.uid())
$$;
create or replace function public.has_agency_permission(target_agency uuid, required_key text) returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.agency_members m
    left join public.permission_profile_permissions pp on pp.profile_id=m.profile_id
    left join public.agency_member_permissions mp on mp.agency_member_id=m.id
    where m.agency_id=target_agency and m.user_id=auth.uid() and m.status='ACTIVE'
      and (m.role='ADMIN' or pp.permission_key=required_key or mp.permission_key=required_key)
  )
$$;
create or replace function public.prevent_last_admin_removal() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.role='ADMIN' and old.status='ACTIVE' and (tg_op='DELETE' or new.role <> 'ADMIN' or new.status <> 'ACTIVE')
     and (select count(*) from public.agency_members where agency_id=old.agency_id and role='ADMIN' and status='ACTIVE') <= 1 then
    raise exception 'cannot remove the last active admin' using errcode='23514';
  end if;
  return coalesce(new, old);
end $$;
create trigger agency_members_keep_admin before update or delete on public.agency_members for each row execute function public.prevent_last_admin_removal();
create or replace function public.prevent_tenant_transfer() returns trigger language plpgsql as $$
begin
  if new.agency_id is distinct from old.agency_id then raise exception 'agency_id is immutable' using errcode='23514'; end if;
  return new;
end $$;
create trigger agency_customers_immutable_tenant before update on public.agency_customers for each row execute function public.prevent_tenant_transfer();

alter table public.accounts enable row level security;
alter table public.plans enable row level security;
alter table public.agencies enable row level security;
alter table public.licenses enable row level security;
alter table public.platform_admins enable row level security;
alter table public.features enable row level security;
alter table public.agency_features enable row level security;
alter table public.permissions enable row level security;
alter table public.permission_profiles enable row level security;
alter table public.permission_profile_permissions enable row level security;
alter table public.agency_members enable row level security;
alter table public.agency_member_permissions enable row level security;
alter table public.agency_customers enable row level security;
alter table public.accounts force row level security;
alter table public.agencies force row level security;
alter table public.licenses force row level security;
alter table public.agency_members force row level security;
alter table public.agency_customers force row level security;

create policy agency_visible_to_member on public.agencies for select using (public.is_active_member(id));
create policy license_visible_to_member on public.licenses for select using (public.is_active_member(agency_id));
create policy member_read_own_agency on public.agency_members for select using (public.is_active_member(agency_id));
create policy member_manage_with_permission on public.agency_members for all using (public.has_agency_permission(agency_id, 'team.manage_permissions')) with check (public.has_agency_permission(agency_id, 'team.manage_permissions'));
create policy profiles_read_own_agency on public.permission_profiles for select using (public.is_active_member(agency_id));
create policy profiles_manage_with_permission on public.permission_profiles for all using (public.has_agency_permission(agency_id, 'team.manage_permissions')) with check (public.has_agency_permission(agency_id, 'team.manage_permissions'));
create policy customers_read_member_or_owner on public.agency_customers for select using (public.is_active_member(agency_id) or auth_user_id=auth.uid());
create policy customers_insert_owner on public.agency_customers for insert with check (auth_user_id=auth.uid());
create policy customers_update_owner on public.agency_customers for update using (auth_user_id=auth.uid()) with check (auth_user_id=auth.uid());
create policy permissions_read_authenticated on public.permissions for select to authenticated using (true);
create policy features_read_member on public.agency_features for select using (public.is_active_member(agency_id));

revoke all on all tables in schema public from anon;
grant select, insert, update, delete on public.agencies, public.licenses, public.agency_members, public.permission_profiles, public.agency_customers, public.agency_features to authenticated;
grant select on public.permissions to authenticated;
commit;
