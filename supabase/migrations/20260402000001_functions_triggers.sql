-- 01_functions_triggers.sql: Lógica y Automatización

-- ==========================================
-- 1. FUNCIONES DE IDENTIDAD (HELPER FUNCTIONS)
-- ==========================================

-- Obtener ID de usuario desde el JWT de Clerk
CREATE OR REPLACE FUNCTION public.get_my_user_id()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (auth.jwt() ->> 'sub')::text;
$function$;

-- Obtener ID del gimnasio desde el JWT
CREATE OR REPLACE FUNCTION public.get_my_gym_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (auth.jwt() ->> 'gym_id')::uuid;
$function$;

-- Obtener rol desde el JWT
CREATE OR REPLACE FUNCTION public.get_my_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT auth.jwt() ->> 'role';
$function$;

-- ==========================================
-- 2. FUNCIONES DE SEGURIDAD (LLAVES MAESTRAS)
-- ==========================================

-- Verificar si el usuario es administrador (Dueño o Coach) en cualquier gym
CREATE OR REPLACE FUNCTION public.is_any_admin(user_uuid_text text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.gym_members 
    WHERE user_id = user_uuid_text 
      AND (role = 'gym_owner' OR role = 'coach')
  );
END;
$function$;

-- Verificar si el usuario es administrador de un gym específico
CREATE OR REPLACE FUNCTION public.is_admin_of_gym(user_uuid_text text, target_gym_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.gym_members 
    WHERE user_id = user_uuid_text 
      AND (role = 'gym_owner' OR role = 'coach')
      AND gym_id = target_gym_id
  );
END;
$function$;

-- ==========================================
-- 3. FUNCIONES DE UTILIDAD (UTILITIES)
-- ==========================================

-- Actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Generar número de factura secuencial por gimnasio
CREATE OR REPLACE FUNCTION public.next_invoice_number(p_gym_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_next int;
BEGIN
  INSERT INTO invoice_sequences (gym_id, last_number)
  VALUES (p_gym_id, 1)
  ON CONFLICT (gym_id) DO UPDATE
    SET last_number = invoice_sequences.last_number + 1
  RETURNING last_number INTO v_next;
  
  RETURN 'FIT-' || LPAD(v_next::text, 4, '0');
END;
$function$;

-- ==========================================
-- 4. TRIGGERS (DISPARADORES)
-- ==========================================

-- Trigger para actualizar updated_at en perfiles
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger para actualizar updated_at en gimnasios
CREATE TRIGGER trg_gyms_updated_at BEFORE UPDATE ON public.gyms FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger para actualizar el conteo de inscritos en una sesión
CREATE OR REPLACE FUNCTION public.update_enrolled_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE class_sessions
  SET current_enrolled = (
    SELECT COUNT(*) FROM class_enrollments
    WHERE class_session_id = COALESCE(NEW.class_session_id, OLD.class_session_id)
      AND status = 'confirmed'
  )
  WHERE id = COALESCE(NEW.class_session_id, OLD.class_session_id);
  RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_enrolled_count AFTER INSERT OR DELETE OR UPDATE ON public.class_enrollments FOR EACH ROW EXECUTE FUNCTION update_enrolled_count();
