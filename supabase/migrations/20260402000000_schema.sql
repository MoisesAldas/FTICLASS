-- 00_schema.sql: Estructura de Tablas y Relaciones de FTICLASS

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: Planes de Suscripción (SaaS)
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    price_monthly numeric NOT NULL,
    max_athletes integer,
    max_coaches integer,
    features jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 2. TABLA: Gimnasios
CREATE TABLE IF NOT EXISTS public.gyms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    owner_clerk_id text UNIQUE NOT NULL,
    plan_id uuid REFERENCES public.plans(id),
    logo_url text,
    phone text,
    address text,
    timezone text DEFAULT 'America/Guayaquil'::text,
    is_active boolean DEFAULT true,
    stripe_customer_id text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. TABLA: Perfiles de Usuario (Sincronizado con Clerk)
CREATE TABLE IF NOT EXISTS public.profiles (
    id text PRIMARY KEY,
    full_name text NOT NULL,
    avatar_url text,
    phone text,
    email text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. TABLA: Miembros del Gimnasio (Roles)
CREATE TABLE IF NOT EXISTS public.gym_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id uuid NOT NULL REFERENCES public.gyms(id),
    user_id text NOT NULL REFERENCES public.profiles(id),
    role text NOT NULL CHECK (role = ANY (ARRAY['gym_owner'::text, 'coach'::text, 'athlete'::text])),
    joined_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true
);

-- 5. TABLA: Atletas (Datos específicos)
CREATE TABLE IF NOT EXISTS public.athletes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id uuid NOT NULL REFERENCES public.gyms(id),
    user_id text NOT NULL REFERENCES public.profiles(id),
    birthdate date,
    emergency_contact text,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 6. TABLA: Planes de Membresía (Interno del Gym)
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id uuid NOT NULL REFERENCES public.gyms(id),
    name text NOT NULL,
    price numeric NOT NULL,
    billing_cycle text NOT NULL DEFAULT 'monthly'::text CHECK (billing_cycle = ANY (ARRAY['monthly'::text, 'quarterly'::text, 'annual'::text])),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 7. TABLA: Membresías de Atletas
CREATE TABLE IF NOT EXISTS public.athlete_memberships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id uuid NOT NULL REFERENCES public.gyms(id),
    athlete_id uuid NOT NULL REFERENCES public.athletes(id),
    membership_plan_id uuid NOT NULL REFERENCES public.membership_plans(id),
    status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['active'::text, 'expired'::text, 'cancelled'::text, 'pending'::text])),
    start_date date NOT NULL,
    end_date date NOT NULL,
    auto_renew boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 8. TABLA: WODs (Entrenamientos)
CREATE TABLE IF NOT EXISTS public.wods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id uuid NOT NULL REFERENCES public.gyms(id),
    title text NOT NULL,
    description text,
    movements jsonb DEFAULT '[]'::jsonb,
    date date,
    is_published boolean DEFAULT false,
    created_by text REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 9. TABLA: Sesiones de Clase
CREATE TABLE IF NOT EXISTS public.class_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id uuid NOT NULL REFERENCES public.gyms(id),
    class_type_id uuid NOT NULL, -- Relación con class_types
    coach_id uuid, -- Relación con coaches
    date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    max_capacity integer DEFAULT 20,
    current_enrolled integer DEFAULT 0,
    status text DEFAULT 'scheduled'::text CHECK (status = ANY (ARRAY['scheduled'::text, 'completed'::text, 'cancelled'::text])),
    notes text,
    created_at timestamptz DEFAULT now()
);

-- 10. TABLA: Pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id uuid NOT NULL REFERENCES public.gyms(id),
    athlete_id uuid NOT NULL REFERENCES public.athletes(id),
    athlete_membership_id uuid REFERENCES public.athlete_memberships(id),
    amount numeric NOT NULL,
    status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text])),
    method text DEFAULT 'cash'::text CHECK (method = ANY (ARRAY['cash'::text, 'transfer'::text, 'card'::text, 'other'::text])),
    paid_at timestamptz,
    notes text,
    registered_by text REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Otras tablas omitidas por brevedad en este archivo inicial pero presentes en la DB
