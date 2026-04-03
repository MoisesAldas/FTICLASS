// ─────────────────────────────────────────────────────────────────────────────
// Database types generados del schema de Supabase / FITCLASS
// Refleja exactamente las tablas y sus columnas
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'gym_owner' | 'coach' | 'athlete'

export type GymStatus = 'active' | 'inactive'
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'
export type EnrollmentStatus = 'confirmed' | 'cancelled' | 'attended'
export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'other'
export type SaasSubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing'
export type BillingCycle = 'monthly' | 'quarterly' | 'annual'

// ─── Platform Layer ──────────────────────────────────────────────────────────

export interface Plan {
  id: string
  name: string
  price_monthly: number
  max_athletes: number | null
  max_coaches: number | null
  features: string[]
  is_active: boolean
  created_at: string
}

export interface Gym {
  id: string
  name: string
  owner_clerk_id: string
  plan_id: string | null
  logo_url: string | null
  phone: string | null
  address: string | null
  timezone: string
  is_active: boolean
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface SaasSubscription {
  id: string
  gym_id: string
  plan_id: string | null
  status: SaasSubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

// ─── Identity Layer ──────────────────────────────────────────────────────────

export interface Profile {
  id: string // = Clerk user_id
  full_name: string
  avatar_url: string | null
  phone: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface GymMember {
  id: string
  gym_id: string
  user_id: string
  role: UserRole
  joined_at: string
  is_active: boolean
}

// ─── Operations Layer ────────────────────────────────────────────────────────

export interface Service {
  id: string
  gym_id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

export interface Coach {
  id: string
  gym_id: string
  user_id: string
  specialty: string | null
  bio: string | null
  is_active: boolean
  created_at: string
  // joined via foreign key
  profiles?: Profile
}

export interface Athlete {
  id: string
  gym_id: string
  user_id: string
  birthdate: string | null
  emergency_contact: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  // joined via foreign key
  profiles?: Profile
}

export interface ClassType {
  id: string
  gym_id: string
  service_id: string | null
  name: string
  description: string | null
  max_capacity: number
  duration_minutes: number
  color: string
  is_active: boolean
  created_at: string
  // joined
  services?: Service
}

export interface ClassSession {
  id: string
  gym_id: string
  class_type_id: string
  coach_id: string | null
  date: string
  start_time: string
  end_time: string
  max_capacity: number
  current_enrolled: number
  status: SessionStatus
  notes: string | null
  created_at: string
  // joined
  class_types?: ClassType
  coaches?: Coach
}

export interface ClassEnrollment {
  id: string
  class_session_id: string
  gym_id: string
  athlete_id: string
  enrolled_at: string
  status: EnrollmentStatus
  // joined
  athletes?: Athlete
  class_sessions?: ClassSession
}

export interface Wod {
  id: string
  gym_id: string
  title: string
  description: string | null
  movements: WodMovement[]
  date: string | null
  is_published: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface WodMovement {
  name: string
  reps?: number | string
  sets?: number
  weight?: string
  notes?: string
}

export interface Event {
  id: string
  gym_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  image_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface GymSettings {
  gym_id: string
  logo_url: string | null
  primary_color: string
  social_links: Record<string, string>
  notifications_config: Record<string, unknown>
  updated_at: string
}

// ─── Financial Layer ─────────────────────────────────────────────────────────

export interface MembershipPlan {
  id: string
  gym_id: string
  name: string
  price: number
  billing_cycle: BillingCycle
  description: string | null
  is_active: boolean
  created_at: string
}

export interface AthleteMembership {
  id: string
  gym_id: string
  athlete_id: string
  membership_plan_id: string
  status: MembershipStatus
  start_date: string
  end_date: string
  auto_renew: boolean
  created_at: string
  updated_at: string
  // joined
  membership_plans?: MembershipPlan
  athletes?: Athlete
}

export interface Payment {
  id: string
  gym_id: string
  athlete_id: string
  athlete_membership_id: string | null
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  paid_at: string | null
  notes: string | null
  registered_by: string | null
  created_at: string
  updated_at: string
  // joined
  athletes?: Athlete
  athlete_memberships?: AthleteMembership
}

export interface Invoice {
  id: string
  gym_id: string
  athlete_id: string
  payment_id: string
  invoice_number: string
  issued_at: string
  items: InvoiceItem[]
  subtotal: number
  total: number
  pdf_url: string | null
  created_at: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

// ─── Utility Types ───────────────────────────────────────────────────────────

export type GymStats = {
  active_athletes: number
  active_coaches: number
  today_sessions: ClassSession[]
  monthly_revenue: number
  expiring_memberships: AthleteMembership[]
}
