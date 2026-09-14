-- PHASE_04: Clientes, Passageiros e Reservas
-- Fonte: G.1, SPEC.md, DATABASE.md

BEGIN;

-- 1. Clientes (Compradores)
CREATE TABLE IF NOT EXISTS public.agency_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    auth_user_id UUID NULL,
    
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    document TEXT NOT NULL,
    birth_date DATE NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ARCHIVED
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at TIMESTAMPTZ NULL,
    
    CONSTRAINT uk_agency_auth_user UNIQUE (agency_id, auth_user_id)
);

-- 2. Passageiros
CREATE TABLE IF NOT EXISTS public.agency_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    
    owner_customer_id UUID NULL,
    linked_auth_user_id UUID NULL,
    
    full_name TEXT NOT NULL,
    document TEXT NOT NULL,
    birth_date DATE NOT NULL,
    phone TEXT NULL,
    
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Reservas (Entidade Mestre)
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    trip_id UUID NOT NULL,
    
    code TEXT NOT NULL, -- Gerado transacionalmente
    buyer_customer_id UUID NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, WAITING_ENTRY, CONFIRMED, CANCELLED, EXPIRED, COMPLETED
    financial_status TEXT NOT NULL DEFAULT 'PENDING',
    
    commercial_source TEXT NOT NULL, -- DIRECT, AFFILIATE, PARTNER, MARKETPLACE
    sales_channel TEXT NOT NULL,
    
    currency TEXT NOT NULL DEFAULT 'BRL',
    
    subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
    discount_total NUMERIC(14,2) NOT NULL DEFAULT 0,
    client_fee_total NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    
    entry_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    
    hold_expires_at TIMESTAMPTZ NULL,
    confirmed_at TIMESTAMPTZ NULL,
    cancelled_at TIMESTAMPTZ NULL,
    expired_at TIMESTAMPTZ NULL,
    
    created_by UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Passageiros da Reserva (Com Snapshots)
CREATE TABLE IF NOT EXISTS public.reservation_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    reservation_id UUID NOT NULL,
    trip_id UUID NOT NULL,
    
    passenger_id UUID NULL, -- V�nculo opcional ao cadastro
    
    -- Snapshots (Imutabilidade hist�rica)
    passenger_name_snapshot TEXT NOT NULL,
    document_snapshot TEXT NOT NULL,
    birth_date_snapshot DATE NOT NULL,
    
    category_id UUID NOT NULL,
    category_name_snapshot TEXT NOT NULL,
    
    boarding_point_id UUID NOT NULL,
    boarding_snapshot TEXT NOT NULL,
    
    occupies_seat BOOLEAN NOT NULL DEFAULT TRUE,
    
    list_price NUMERIC(14,2) NOT NULL,
    sale_price NUMERIC(14,2) NOT NULL,
    discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, CANCELLED
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    cancelled_at TIMESTAMPTZ NULL
);

-- 5. Holds de Capacidade (Locks Tempor�rios)
CREATE TABLE IF NOT EXISTS public.seat_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    trip_id UUID NOT NULL,
    
    -- Se for hold de assento espec�fico, seat_id � preenchido. 
    -- Se for hold de vaga geral (sem mapa), seat_id � NULL.
    seat_id UUID NULL, 
    
    reservation_id UUID NULL,
    created_by UUID NOT NULL,
    
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Atribui��o de Assentos Definitiva
CREATE TABLE IF NOT EXISTS public.seat_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    trip_id UUID NOT NULL,
    reservation_passenger_id UUID NOT NULL,
    seat_id UUID NOT NULL,
    
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    released_at TIMESTAMPTZ NULL,
    release_reason TEXT NULL
);

-- 7. Pedidos de Aprova��o (Exce��es)
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    
    entity_type TEXT NOT NULL, -- RESERVATION, CUSTOMER, etc
    entity_id UUID NOT NULL,
    
    requested_by UUID NOT NULL,
    reason TEXT NOT NULL,
    
    requested_value NUMERIC(14,2) NULL,
    normal_policy_result TEXT NULL,
    exception_requested TEXT NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    
    approved_by UUID NULL,
    approved_at TIMESTAMPTZ NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_customers_agency ON public.agency_customers(agency_id);
CREATE INDEX idx_passengers_agency ON public.agency_passengers(agency_id);
CREATE INDEX idx_reservations_agency ON public.reservations(agency_id);
CREATE INDEX idx_reservations_trip ON public.reservations(trip_id);
CREATE INDEX idx_res_pass_res ON public.reservation_passengers(reservation_id);
CREATE INDEX idx_seat_holds_trip ON public.seat_holds(trip_id);
CREATE INDEX idx_seat_holds_expiry ON public.seat_holds(expires_at);
CREATE INDEX idx_seat_assign_pass ON public.seat_assignments(reservation_passenger_id);
CREATE INDEX idx_approval_agency ON public.approval_requests(agency_id);

-- RLS (Row Level Security)
ALTER TABLE public.agency_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

-- Policies (Simplificadas para ag�ncia)
CREATE POLICY policy_customers_agency ON public.agency_customers 
    FOR ALL USING (agency_id = (select agency_id from public.agency_members where user_id = auth.uid() limit 1));

CREATE POLICY policy_passengers_agency ON public.agency_passengers 
    FOR ALL USING (agency_id = (select agency_id from public.agency_members where user_id = auth.uid() limit 1));

CREATE POLICY policy_reservations_agency ON public.reservations 
    FOR ALL USING (agency_id = (select agency_id from public.agency_members where user_id = auth.uid() limit 1));

CREATE POLICY policy_res_passengers_agency ON public.reservation_passengers 
    FOR ALL USING (agency_id = (select agency_id from public.agency_members where user_id = auth.uid() limit 1));

CREATE POLICY policy_seat_holds_agency ON public.seat_holds 
    FOR ALL USING (agency_id = (select agency_id from public.agency_members where user_id = auth.uid() limit 1));

CREATE POLICY policy_seat_assignments_agency ON public.seat_assignments 
    FOR ALL USING (agency_id = (select agency_id from public.agency_members where user_id = auth.uid() limit 1));

CREATE POLICY policy_approvals_agency ON public.approval_requests 
    FOR ALL USING (agency_id = (select agency_id from public.agency_members where user_id = auth.uid() limit 1));

COMMIT;
