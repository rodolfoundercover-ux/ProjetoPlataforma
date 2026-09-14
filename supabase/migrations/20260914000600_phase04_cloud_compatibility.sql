begin;

-- Supabase Cloud installs pgcrypto in `extensions`. Keep the function's
-- restricted search path while making digest() resolvable in every environment.
alter function public.add_reservation_passenger(uuid,uuid,uuid,numeric,uuid)
  set search_path = public, extensions;

commit;
