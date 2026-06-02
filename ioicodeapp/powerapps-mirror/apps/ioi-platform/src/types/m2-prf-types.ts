/**
 * M2 - PRF (Program Request Form) Types
 * Based on Domino PRF26.nsf — Non-SAP and SAP dual-track workflow
 *
 * State field: CurrentAction (CA alias)
 * SAP Flag: isSAP computed — "1" when system contains SAP S4/HANA, SAP,
 *            SUCCESSFACTOR-LMS, SALES PORTAL, or DASHBOARD/ENVIRONMENT
 *            & SUSTAINABILITY with RFC="Yes"
 */

// =============================================================================
// CA STATES
// =============================================================================

export const PRF_CURRENT_ACTIONS = [
  'Request',           // Draft
  'Submitted',         // Pending Dept Head Approval
  'Acceptance1',       // Pending IT Task Assignment
  'Acceptance',        // Pending Functional Spec (SAP only)
  'Acceptance2',       // Pending IT Completion (non-SAP)
  'Submitted_SAP',     // Pending IT Manager II Assignment (SAP)
  'Acceptance3',       // Pending ABAP/IT Completion (SAP) / Re-open revision
  'Completed-SAP',     // Pending ISG Final Notification (SAP)
  'Closed',            // Pending Requestor Acceptance (final)
  'Rejected',          // Terminal
] as const;

export type PRFCurrentAction = typeof PRF_CURRENT_ACTIONS[number];

// =============================================================================
// WORKFLOW CONFIG
// =============================================================================

export interface PRFWorkflowState {
  label: string;
  description: string;
  stage: number;
  badgeColor: string;
  isTerminal: boolean;
  isSAPState: boolean;
  /** Which editors can see which sections */
  requestorEditable: boolean;
  deptHeadEditable: boolean;
  itMgr2Editable: boolean;
  itStaffEditable: boolean;
  itMgrEditable: boolean;
  itDevEditable: boolean;
  itStaffFinalEditable: boolean;
  requestorFinalEditable: boolean;
  adminEditable: boolean;
}

export const PRF_WORKFLOW_CONFIG: Record<PRFCurrentAction, PRFWorkflowState> = {
  Request: {
    label: 'Draft',
    description: 'Pending submission',
    stage: 1,
    badgeColor: '#64748b',
    isTerminal: false,
    isSAPState: false,
    requestorEditable: true,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: false,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  Submitted: {
    label: 'Pending Dept Head',
    description: 'Awaiting department head approval',
    stage: 2,
    badgeColor: '#f59e0b',
    isTerminal: false,
    isSAPState: false,
    requestorEditable: false,
    deptHeadEditable: true,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: false,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  Acceptance1: {
    label: 'Pending IT Assignment',
    description: 'Awaiting IT task assignment',
    stage: 3,
    badgeColor: '#3b82f6',
    isTerminal: false,
    isSAPState: false,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: true,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: false,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  Acceptance: {
    label: 'Pending Functional Spec',
    description: 'SAP: Pending functional spec submission',
    stage: 3,
    badgeColor: '#8b5cf6',
    isTerminal: false,
    isSAPState: true,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: true,
    itMgrEditable: false,
    itDevEditable: false,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  Acceptance2: {
    label: 'Pending IT Completion',
    description: 'Non-SAP: Pending IT completion/testing',
    stage: 4,
    badgeColor: '#8b5cf6',
    isTerminal: false,
    isSAPState: false,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: true,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  Submitted_SAP: {
    label: 'Pending IT Mgr II',
    description: 'SAP: Pending IT Manager II assignment',
    stage: 4,
    badgeColor: '#8b5cf6',
    isTerminal: false,
    isSAPState: true,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: true,
    itDevEditable: false,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  Acceptance3: {
    label: 'Pending ABAP/IT',
    description: 'SAP: Pending ABAP/IT completion',
    stage: 5,
    badgeColor: '#8b5cf6',
    isTerminal: false,
    isSAPState: true,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: true,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  'Completed-SAP': {
    label: 'Pending ISG Final',
    description: 'SAP: Pending ISG final notification',
    stage: 6,
    badgeColor: '#10b981',
    isTerminal: false,
    isSAPState: true,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: false,
    itStaffFinalEditable: true,
    requestorFinalEditable: false,
    adminEditable: true,
  },
  Closed: {
    label: 'Closed (Pending Acceptance)',
    description: 'Pending requestor acceptance or revision',
    stage: 7,
    badgeColor: '#22c55e',
    isTerminal: false,
    isSAPState: false,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: false,
    itStaffFinalEditable: false,
    requestorFinalEditable: true,
    adminEditable: true,
  },
  Rejected: {
    label: 'Rejected',
    description: 'Request has been rejected',
    stage: 2,
    badgeColor: '#ef4444',
    isTerminal: true,
    isSAPState: false,
    requestorEditable: false,
    deptHeadEditable: false,
    itMgr2Editable: false,
    itStaffEditable: false,
    itMgrEditable: false,
    itDevEditable: false,
    itStaffFinalEditable: false,
    requestorFinalEditable: false,
    adminEditable: true,
  },
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Determine if a state is a SAP-only state
 */
export function isPRFSAPState(ca: PRFCurrentAction): boolean {
  return PRF_WORKFLOW_CONFIG[ca]?.isSAPState ?? false;
}

/**
 * Get stage number for a CA state
 */
export function prfStageNumber(ca: PRFCurrentAction): number {
  return PRF_WORKFLOW_CONFIG[ca]?.stage ?? 1;
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface PRFFormInput {
  system: string;
  isSAP: boolean;
  sapClient: string;
  sapModule: string;
  company: string;
  department: string;
  requestorName: string;
  requestorEmail: string;
  phoneExt: string;
  priority: string;
  objective: string;
  justification: string;
  currentProcess: string;
  expectedOutcome: string;
  deadline: string;
  attachments: string;
  ccEmails: string;
  deptManagerEmail: string;
}
