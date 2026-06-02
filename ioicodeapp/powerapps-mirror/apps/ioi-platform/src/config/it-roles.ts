/**
 * IT Role Configuration
 *
 * Each role maps 1-to-1 to a RoleCode value in the UserRolesIT SharePoint list.
 * The UserRolesITRoleCodeKeyToLabel mapping (from the generated model) is:
 *
 *   RoleCodeKey0 → INITIATOR
 *   RoleCodeKey1 → MANAGER
 *   RoleCodeKey2 → HOD
 *   RoleCodeKey3 → ADMIN
 *   RoleCodeKey4 → READER
 *   RoleCodeKey5 → IT_ADMIN
 *   RoleCodeKey6 → IT_MANAGER
 *   RoleCodeKey7 → APPROVER
 */

import type { UserRolesITRoleCodeKey } from '@/generated/models/user-roles-it-model';

/** Matches the SP RoleCode label values exactly. */
export type UserRoleKey =
  | 'INITIATOR'
  | 'MANAGER'
  | 'HOD'
  | 'ADMIN'
  | 'READER'
  | 'IT_ADMIN'
  | 'IT_MANAGER'
  | 'APPROVER';

export interface RoleConfig {
  key: UserRoleKey;
  /** Corresponding SP UserRolesIT.RoleCode key */
  roleCodeKey: UserRolesITRoleCodeKey;
  label: string;
  description: string;
  permissions: {
    /** Can submit forms */
    canSubmit: boolean;
    /** Can approve submissions */
    canApprove: boolean;
    /** Has full admin access */
    canAdmin: boolean;
    /** Can view all records (not just own) */
    canViewAll: boolean;
    /** Can triage/assign IT service requests (My Actions tab) */
    canTriageITSR: boolean;
  };
}

export const ROLES: Record<UserRoleKey, RoleConfig> = {
  INITIATOR: {
    key: 'INITIATOR',
    roleCodeKey: 'RoleCodeKey0',
    label: 'Initiator',
    description: 'Can submit forms and view own submissions',
    permissions: {
      canSubmit: true,
      canApprove: false,
      canAdmin: false,
      canViewAll: false,
      canTriageITSR: false,
    },
  },

  MANAGER: {
    key: 'MANAGER',
    roleCodeKey: 'RoleCodeKey1',
    label: 'Manager',
    description: 'Can approve team submissions',
    permissions: {
      canSubmit: true,
      canApprove: true,
      canAdmin: false,
      canViewAll: false,
      canTriageITSR: false,
    },
  },

  HOD: {
    key: 'HOD',
    roleCodeKey: 'RoleCodeKey2',
    label: 'Head of Department',
    description: 'Can approve submissions for their department',
    permissions: {
      canSubmit: true,
      canApprove: true,
      canAdmin: false,
      canViewAll: false,
      canTriageITSR: false,
    },
  },

  ADMIN: {
    key: 'ADMIN',
    roleCodeKey: 'RoleCodeKey3',
    label: 'System Administrator',
    description: 'Full system access — can admin, approve, and view all records',
    permissions: {
      canSubmit: true,
      canApprove: true,
      canAdmin: true,
      canViewAll: true,
      canTriageITSR: true,
    },
  },

  READER: {
    key: 'READER',
    roleCodeKey: 'RoleCodeKey4',
    label: 'Reader',
    description: 'Read-only access to view submissions and reports',
    permissions: {
      canSubmit: false,
      canApprove: false,
      canAdmin: false,
      canViewAll: true,
      canTriageITSR: false,
    },
  },

  IT_ADMIN: {
    key: 'IT_ADMIN',
    roleCodeKey: 'RoleCodeKey5',
    label: 'IT Administrator',
    description: 'Can triage, assign, and manage IT service requests',
    permissions: {
      canSubmit: true,
      canApprove: true,
      canAdmin: true,
      canViewAll: true,
      canTriageITSR: true,
    },
  },

  IT_MANAGER: {
    key: 'IT_MANAGER',
    roleCodeKey: 'RoleCodeKey6',
    label: 'IT Manager',
    description: 'IT management with approval authority over IT requests',
    permissions: {
      canSubmit: true,
      canApprove: true,
      canAdmin: false,
      canViewAll: true,
      canTriageITSR: true,
    },
  },

  APPROVER: {
    key: 'APPROVER',
    roleCodeKey: 'RoleCodeKey7',
    label: 'Approver',
    description: 'Dedicated approver for cross-department submissions',
    permissions: {
      canSubmit: true,
      canApprove: true,
      canAdmin: false,
      canViewAll: true,
      canTriageITSR: false,
    },
  },
};

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/** Direct lookup from SP RoleCodeKey → UserRoleKey. */
export const ROLE_CODE_KEY_TO_ROLE: Record<UserRolesITRoleCodeKey, UserRoleKey> = {
  RoleCodeKey0: 'INITIATOR',
  RoleCodeKey1: 'MANAGER',
  RoleCodeKey2: 'HOD',
  RoleCodeKey3: 'ADMIN',
  RoleCodeKey4: 'READER',
  RoleCodeKey5: 'IT_ADMIN',
  RoleCodeKey6: 'IT_MANAGER',
  RoleCodeKey7: 'APPROVER',
};

/** RoleCodeKeys whose holders can action tickets in the ITSSR triage dashboard. */
export const IT_TRIAGE_ROLE_KEYS: UserRolesITRoleCodeKey[] = [
  'RoleCodeKey3', // ADMIN
  'RoleCodeKey5', // IT_ADMIN
  'RoleCodeKey6', // IT_MANAGER
];

export function getRoleConfig(roleKey: UserRoleKey): RoleConfig {
  return ROLES[roleKey];
}

/** Get the RoleConfig from a SP RoleCodeKey directly. */
export function getRoleFromCodeKey(roleCodeKey: UserRolesITRoleCodeKey): RoleConfig {
  return ROLES[ROLE_CODE_KEY_TO_ROLE[roleCodeKey]];
}

/** Returns true if the given SP RoleCodeKey can triage/assign ITSSR tickets. */
export function canTriageITSR(roleCodeKey: UserRolesITRoleCodeKey): boolean {
  return IT_TRIAGE_ROLE_KEYS.includes(roleCodeKey);
}
