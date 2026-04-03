// ─────────────────────────────────────────────────────────────────────────────
// Barrel export de la capa Supabase
// ─────────────────────────────────────────────────────────────────────────────

export { createClerkSupabaseClient, supabasePublic } from './client'
export type {
  // Platform
  Plan,
  Gym,
  SaasSubscription,
  // Identity
  Profile,
  GymMember,
  UserRole,
  // Operations
  Service,
  Coach,
  Athlete,
  ClassType,
  ClassSession,
  ClassEnrollment,
  Wod,
  WodMovement,
  Event,
  GymSettings,
  // Financial
  MembershipPlan,
  AthleteMembership,
  Payment,
  Invoice,
  InvoiceItem,
  // Status enums
  SessionStatus,
  EnrollmentStatus,
  MembershipStatus,
  PaymentStatus,
  PaymentMethod,
  BillingCycle,
  SaasSubscriptionStatus,
  // Utility
  GymStats,
} from './types'
