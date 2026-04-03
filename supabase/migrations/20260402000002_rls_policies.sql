-- 02_rls_policies.sql: Blindaje y Seguridad de Datos

-- ==========================================
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- ==========================================

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. POLÍTICAS DE PERFILES (CENTRALIZADAS)
-- ==========================================

-- El propio usuario puede ver y editar su perfil
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO public USING (id = (auth.jwt() ->> 'sub'));

-- Los administradores (Dueño/Coach) pueden ver perfiles de su gimnasio
CREATE POLICY "profiles_admin_manage" ON public.profiles FOR ALL TO authenticated 
USING ( is_any_admin((auth.jwt() ->> 'sub')::text) )
WITH CHECK ( is_any_admin((auth.jwt() ->> 'sub')::text) );

-- ==========================================
-- 3. POLÍTICAS DE GIMNASIOS Y MIEMBROS
-- ==========================================

-- Permitir a cualquiera ver el gimnasio al que pertenece
CREATE POLICY "gyms_member_select" ON public.gyms FOR SELECT TO public 
USING ( id = get_my_gym_id() );

-- Permitir al dueño gestionar su gimnasio
CREATE POLICY "gyms_owner_all" ON public.gyms FOR ALL TO public 
USING ( owner_clerk_id = (auth.jwt() ->> 'sub') );

-- Gestión de miembros (Admin Manage)
CREATE POLICY "gym_members_admin_manage" ON public.gym_members FOR ALL TO authenticated 
USING ( is_admin_of_gym((auth.jwt() ->> 'sub')::text, gym_id) )
WITH CHECK ( is_admin_of_gym((auth.jwt() ->> 'sub')::text, gym_id) );

-- ==========================================
-- 4. POLÍTICAS DE ATLETAS (MULTI-TENANCY)
-- ==========================================

-- El Dueño o Coach puede gestionar atletas de su gimnasio
CREATE POLICY "athletes_admin_manage" ON public.athletes FOR ALL TO authenticated 
USING ( is_any_admin((auth.jwt() ->> 'sub')::text) )
WITH CHECK ( is_any_admin((auth.jwt() ->> 'sub')::text) );

-- El atleta puede ver su propia info
CREATE POLICY "athletes_own_read" ON public.athletes FOR SELECT TO public 
USING ( user_id = (auth.jwt() ->> 'sub') );

-- ==========================================
-- 5. POLÍTICAS DE CONTENIDO (WODS, EVENTOS)
-- ==========================================

-- WODs visibles solo para miembros del gimnasio si están publicados
CREATE POLICY "wods_athlete_read" ON public.wods FOR SELECT TO public 
USING ( gym_id = get_my_gym_id() AND is_published = true );

-- WODs gestionables por Admin/Coach
CREATE POLICY "wods_admin_all" ON public.wods FOR ALL TO public 
USING ( gym_id = get_my_gym_id() AND (get_my_role() = 'gym_owner' OR get_my_role() = 'coach') );

-- ==========================================
-- 6. POLÍTICAS DE PAGOS Y FACTURAS
-- ==========================================

-- Solo dueños ven facturas y pagos completos
CREATE POLICY "payments_owner_all" ON public.payments FOR ALL TO public 
USING ( gym_id = get_my_gym_id() AND get_my_role() = 'gym_owner' );

-- Atletas ven sus propios pagos
CREATE POLICY "payments_athlete_own" ON public.payments FOR SELECT TO public 
USING ( athlete_id IN (SELECT id FROM athletes WHERE user_id = (auth.jwt() ->> 'sub')) );
