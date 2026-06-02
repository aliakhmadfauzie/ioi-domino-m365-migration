/**
 * Workflow Routing Configuration
 * 
 * PRODUCTION MODE: Role-based access is now managed via SharePoint ConfigGlobalUserRoleAssignments table.
 * Use the useDynamicRoleAccess hook for real-time role lookups.
 * 
 * This file provides legacy fallback functions that are DISABLED by default.
 * Set ENABLE_TEST_MODE = true only for local development without SharePoint.
 */

export type TestUserRole = 'approver' | 'initiator_approver' | 'initiator';

export interface WorkflowUser {
  email: string;
  displayName: string;
  role: 'first-approver' | 'initiator-approver' | 'initiator';
  canInitiate: boolean;
  canApprove: boolean;
}

export interface TestUser {
  email: string;
  name: string;
  role: TestUserRole;
}

export interface WorkflowRoutingConfig {
  /** The default first approver for all new submissions */
  firstApprover: WorkflowUser | null;
  /** All configured workflow users */
  users: WorkflowUser[];
  /** Whether hardcoded test routing is enabled (SHOULD BE FALSE FOR PRODUCTION) */
  enabled: boolean;
}

// ============================================================================
// PRODUCTION CONFIGURATION
// ============================================================================

/**
 * IMPORTANT: Set to false for production deployment.
 * When false, all role checks use SharePoint ConfigGlobalUserRoleAssignments.
 * When true, falls back to hardcoded test users below.
 */
const ENABLE_TEST_MODE = false;

// ============================================================================
// LEGACY TEST USERS (only used when ENABLE_TEST_MODE = true)
// ============================================================================

const LEGACY_TEST_USERS: Record<string, WorkflowUser> = {
  'kelly@ioioleo.com': {
    email: 'kelly@ioioleo.com',
    displayName: 'Kelly',
    role: 'first-approver',
    canInitiate: true,
    canApprove: true,
  },
  'taung@ioioleo.com': {
    email: 'taung@ioioleo.com',
    displayName: 'Taung',
    role: 'initiator-approver',
    canInitiate: true,
    canApprove: true,
  },
};

// ============================================================================
// WORKFLOW ROUTING CONFIGURATION
// ============================================================================

/**
 * Legacy workflow routing configuration.
 * In production, enabled = false and roles come from SharePoint.
 */
export const WORKFLOW_ROUTING: WorkflowRoutingConfig = {
  enabled: ENABLE_TEST_MODE,
  firstApprover: ENABLE_TEST_MODE ? LEGACY_TEST_USERS['kelly@ioioleo.com'] : null,
  users: ENABLE_TEST_MODE ? Object.values(LEGACY_TEST_USERS) : [],
};

// For backwards compatibility, export the test users object
// But warn that it should not be used in production
export const WORKFLOW_USERS = ENABLE_TEST_MODE ? LEGACY_TEST_USERS : {};

// ============================================================================
// HELPER FUNCTIONS (Legacy - Use useDynamicRoleAccess hook instead)
// ============================================================================

/**
 * @deprecated Use useDynamicRoleAccess hook for production role checks.
 * Get the first approver for all new submissions.
 * Returns null in production mode - use SharePoint role assignments.
 */
export function getFirstApprover(): WorkflowUser | null {
  if (!ENABLE_TEST_MODE) {
    console.warn('getFirstApprover() is deprecated. Use useDynamicRoleAccess hook and SharePoint role assignments.');
    return null;
  }
  return WORKFLOW_ROUTING.firstApprover;
}

/**
 * @deprecated Use useDynamicRoleAccess hook for production role checks.
 * Get a workflow user by email.
 */
export function getWorkflowUser(email: string): WorkflowUser | undefined {
  if (!ENABLE_TEST_MODE) {
    return undefined; // Use SharePoint for production
  }
  const normalizedEmail = email.toLowerCase();
  return Object.values(LEGACY_TEST_USERS).find(
    (user: WorkflowUser) => user.email.toLowerCase() === normalizedEmail
  );
}

/**
 * @deprecated Use useDynamicRoleAccess hook for production role checks.
 * In production, this always returns false - use the hook instead.
 */
export function canUserApprove(email: string): boolean {
  if (!ENABLE_TEST_MODE) {
    // Production: Return false here, actual check is done via useDynamicRoleAccess
    return false;
  }
  const user = getWorkflowUser(email);
  return user?.canApprove ?? false;
}

/**
 * @deprecated Use useDynamicRoleAccess hook for production role checks.
 * All authenticated users can initiate.
 */
export function canUserInitiate(email: string): boolean {
  return true; // All users can initiate forms
}

/**
 * @deprecated Use useApproverList hook for production.
 * Get all users who can approve.
 */
export function getApprovers(): WorkflowUser[] {
  if (!ENABLE_TEST_MODE) {
    return []; // Use SharePoint for production
  }
  return WORKFLOW_ROUTING.users.filter((user: WorkflowUser) => user.canApprove);
}

/**
 * Check if the hardcoded test routing is enabled.
 * In production, this should return false.
 */
export function isRoutingEnabled(): boolean {
  return ENABLE_TEST_MODE;
}

/**
 * @deprecated Use SharePoint role assignments for dynamic approver lookup.
 */
export function getSubmissionApproverEmail(): string | null {
  if (!ENABLE_TEST_MODE) {
    return null; // Production: Look up from SharePoint
  }
  return WORKFLOW_ROUTING.firstApprover?.email || null;
}

/**
 * @deprecated Use SharePoint role assignments for dynamic approver lookup.
 */
export function getSubmissionApproverName(): string | null {
  if (!ENABLE_TEST_MODE) {
    return null; // Production: Look up from SharePoint
  }
  return WORKFLOW_ROUTING.firstApprover?.displayName || null;
}

/**
 * @deprecated Legacy test users list.
 */
export function getTestUsers(): TestUser[] {
  if (!ENABLE_TEST_MODE) {
    return [];
  }
  return [
    { email: 'kelly@ioioleo.com', name: 'Kelly', role: 'approver' },
    { email: 'taung@ioioleo.com', name: 'Taung', role: 'initiator_approver' },
  ];
}