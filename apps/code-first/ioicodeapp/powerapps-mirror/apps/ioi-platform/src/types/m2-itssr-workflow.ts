/**
 * M2 - ITSSR Workflow, Routing, and Hidden Fields Types
 * Based on Lotus Domino Form: ITSSR (Parts 4 & 5 - Hidden Fields)
 * 
 * This module defines:
 * - CurrentAction (CA) workflow states and transitions
 * - IT team routing groups (HW/SW, Penang/Johor)
 * - Access control fields (Authors, Readers, Editors)
 * - SLA calculation fields (Days, Days2, Days2_1)
 * - Case number generation (Year-Month-INO)
 * - Computed email subjects and mailing lists
 */

// =============================================================================
// WORKFLOW STATES (CurrentAction / CA)
// =============================================================================

/**
 * CurrentAction (CA) - Workflow State Machine
 * Controls form mode and button visibility based on current stage
 */
export const ITSSR_CURRENT_ACTIONS = [
  'New',           // Initial state - draft being created
  'Pending',       // Submitted by requestor, awaiting IT triage
  'Assigned',      // IT has assigned to a team member
  'InProgress',    // IT is actively working on the request
  'Resolved',      // IT has completed work, awaiting acceptance
  'Accepted',      // Requestor has accepted the solution
  'Rejected',      // Requestor has rejected the solution
  'Completed',     // Case fully closed
  'Cancelled',     // Request was cancelled
] as const;

export type ITSSRCurrentAction = typeof ITSSR_CURRENT_ACTIONS[number];

/**
 * Workflow state configuration
 * Defines what actions are available in each state
 */
export interface ITSSRWorkflowState {
  action: ITSSRCurrentAction;
  label: string;
  description: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  badgeColor: string;
  canRequestorEdit: boolean;
  canITEdit: boolean;
  canAccept: boolean;
  showITSection: boolean;
  showAcceptanceSection: boolean;
  availableTransitions: ITSSRCurrentAction[];
}

export const ITSSR_WORKFLOW_STATES: Record<ITSSRCurrentAction, ITSSRWorkflowState> = {
  New: {
    action: 'New',
    label: 'New',
    description: 'Draft request being created',
    badgeVariant: 'outline',
    badgeColor: '#64748b',
    canRequestorEdit: true,
    canITEdit: false,
    canAccept: false,
    showITSection: false,
    showAcceptanceSection: false,
    availableTransitions: ['Pending', 'Cancelled'],
  },
  Pending: {
    action: 'Pending',
    label: 'Pending',
    description: 'Awaiting IT triage and assignment',
    badgeVariant: 'secondary',
    badgeColor: '#f59e0b',
    canRequestorEdit: false,
    canITEdit: true,
    canAccept: false,
    showITSection: true,
    showAcceptanceSection: false,
    availableTransitions: ['Assigned', 'Cancelled'],
  },
  Assigned: {
    action: 'Assigned',
    label: 'Assigned',
    description: 'Assigned to IT team member',
    badgeVariant: 'secondary',
    badgeColor: '#3b82f6',
    canRequestorEdit: false,
    canITEdit: true,
    canAccept: false,
    showITSection: true,
    showAcceptanceSection: false,
    availableTransitions: ['InProgress', 'Pending', 'Cancelled'],
  },
  InProgress: {
    action: 'InProgress',
    label: 'In Progress',
    description: 'IT is actively working on the request',
    badgeVariant: 'default',
    badgeColor: '#8b5cf6',
    canRequestorEdit: false,
    canITEdit: true,
    canAccept: false,
    showITSection: true,
    showAcceptanceSection: false,
    availableTransitions: ['Resolved', 'Pending', 'Cancelled'],
  },
  Resolved: {
    action: 'Resolved',
    label: 'Resolved',
    description: 'IT has completed work, awaiting requestor acceptance',
    badgeVariant: 'default',
    badgeColor: '#10b981',
    canRequestorEdit: false,
    canITEdit: false,
    canAccept: true,
    showITSection: true,
    showAcceptanceSection: true,
    availableTransitions: ['Accepted', 'Rejected', 'InProgress'],
  },
  Accepted: {
    action: 'Accepted',
    label: 'Accepted',
    description: 'Requestor has accepted the solution',
    badgeVariant: 'default',
    badgeColor: '#22c55e',
    canRequestorEdit: false,
    canITEdit: false,
    canAccept: false,
    showITSection: true,
    showAcceptanceSection: true,
    availableTransitions: ['Completed'],
  },
  Rejected: {
    action: 'Rejected',
    label: 'Rejected',
    description: 'Requestor has rejected the solution',
    badgeVariant: 'destructive',
    badgeColor: '#ef4444',
    canRequestorEdit: false,
    canITEdit: true,
    canAccept: false,
    showITSection: true,
    showAcceptanceSection: true,
    availableTransitions: ['InProgress', 'Cancelled'],
  },
  Completed: {
    action: 'Completed',
    label: 'Completed',
    description: 'Case fully closed',
    badgeVariant: 'default',
    badgeColor: '#16a34a',
    canRequestorEdit: false,
    canITEdit: false,
    canAccept: false,
    showITSection: true,
    showAcceptanceSection: true,
    availableTransitions: [],
  },
  Cancelled: {
    action: 'Cancelled',
    label: 'Cancelled',
    description: 'Request was cancelled',
    badgeVariant: 'destructive',
    badgeColor: '#6b7280',
    canRequestorEdit: false,
    canITEdit: false,
    canAccept: false,
    showITSection: true,
    showAcceptanceSection: false,
    availableTransitions: [],
  },
};

// =============================================================================
// ROUTING GROUPS (IT Teams)
// =============================================================================

/**
 * IT Team types for routing
 */
export const ITSSR_TEAMS = ['HW', 'SW'] as const;
export type ITSSRTeam = typeof ITSSR_TEAMS[number];

/**
 * Site locations for IT routing
 */
export const ITSSR_SITES = ['Prai', 'Johor'] as const;
export type ITSSRSite = typeof ITSSR_SITES[number];

/**
 * IT Routing Groups - Maps to Lotus Domino hidden fields
 * These are mailing lists for routing requests to the correct IT team
 */
export interface ITSSRRoutingGroup {
  id: string;
  dominoField: string;
  label: string;
  description: string;
  team: ITSSRTeam;
  site?: ITSSRSite;
}

export const ITSSR_ROUTING_GROUPS: ITSSRRoutingGroup[] = [
  {
    id: 'hwp',
    dominoField: 'HWP',
    label: 'IT Hardware - Penang',
    description: 'Hardware team at Prai (Penang) location',
    team: 'HW',
    site: 'Prai',
  },
  {
    id: 'hwj',
    dominoField: 'HWJ',
    label: 'IT Hardware - Johor',
    description: 'Hardware team at Johor location',
    team: 'HW',
    site: 'Johor',
  },
  {
    id: 'allhw',
    dominoField: 'ALLHW',
    label: 'All Hardware Team',
    description: 'All hardware team members across all locations',
    team: 'HW',
  },
  {
    id: 'allsw',
    dominoField: 'ALLSW',
    label: 'All Software Team',
    description: 'All software team members',
    team: 'SW',
  },
];

/**
 * Service types that route to Hardware team
 */
export const HARDWARE_SERVICE_TYPES = ['Hardware'] as const;

/**
 * Service types that route to Software team
 */
export const SOFTWARE_SERVICE_TYPES = ['Software', 'SAP', 'Bank', 'Network', 'Other'] as const;

// =============================================================================
// ACCESS CONTROL FIELDS
// =============================================================================

/**
 * Access control roles - Maps to Lotus Domino Authors/Readers fields
 */
export interface ITSSRAccessControl {
  /** IT Administrator group - full access */
  ITADMIN: string[];
  /** All IT staff - read access */
  AllIT: string[];
  /** Editor 1 - section edit access */
  Editor1?: string;
  /** Editor 2 - section edit access */
  Editor2?: string;
  /** Editor 3 - section edit access */
  Editor3?: string;
  /** Editor 4 - section edit access */
  Editor4?: string;
}

/**
 * Default access control groups
 */
export const ITSSR_ACCESS_GROUPS = {
  ITADMIN: 'IT Administrators',
  AllIT: 'All IT Staff',
  MKT: 'Marketing/CFO',
  Defcc: 'Default CC List',
} as const;

// =============================================================================
// SLA CALCULATION FIELDS
// =============================================================================

/**
 * SLA metrics computed from hidden fields
 */
export interface ITSSRSLAMetrics {
  /** Date IT first responded to the request */
  RespondDate?: Date;
  /** Working days taken to complete (raw) */
  Days?: number;
  /** Working days taken to complete (adjusted, excludes holidays) */
  Days2_1?: number;
  /** Working days taken to first respond */
  Days2?: number;
  /** List of public holidays to exclude from SLA calculation */
  Holidays: Date[];
}

/**
 * SLA thresholds for response and resolution
 */
export const ITSSR_SLA_THRESHOLDS = {
  /** Maximum days to first response */
  responseTarget: 1,
  /** Maximum days to resolution (standard) */
  resolutionStandard: 5,
  /** Maximum days to resolution (critical) */
  resolutionCritical: 1,
  /** Maximum days to resolution (high priority) */
  resolutionHigh: 2,
  /** Maximum days to resolution (medium priority) */
  resolutionMedium: 3,
  /** Maximum days to resolution (low priority) */
  resolutionLow: 7,
} as const;

/**
 * SLA status based on metrics
 */
export type SLAStatus = 'OnTrack' | 'AtRisk' | 'Breached';

export interface SLAStatusInfo {
  status: SLAStatus;
  label: string;
  color: string;
  description: string;
}

export const SLA_STATUS_INFO: Record<SLAStatus, SLAStatusInfo> = {
  OnTrack: {
    status: 'OnTrack',
    label: 'On Track',
    color: '#22c55e',
    description: 'Within SLA targets',
  },
  AtRisk: {
    status: 'AtRisk',
    label: 'At Risk',
    color: '#f59e0b',
    description: 'Approaching SLA deadline',
  },
  Breached: {
    status: 'Breached',
    label: 'Breached',
    color: '#ef4444',
    description: 'SLA target exceeded',
  },
};

// =============================================================================
// CASE NUMBER GENERATION
// =============================================================================

/**
 * Case number components - Maps to Lotus Domino hidden fields
 */
export interface ITSSRCaseNumber {
  /** Year part (YYYY) */
  Year: string;
  /** Month part (MM) */
  Month: string;
  /** Sequential increment number */
  INO: number;
  /** Full case number string */
  CaseNo: string;
}

/**
 * Generate case number components
 */
export function generateCaseNumberComponents(sequence: number, date?: Date): ITSSRCaseNumber {
  const now = date || new Date();
  const Year = String(now.getFullYear());
  const Month = String(now.getMonth() + 1).padStart(2, '0');
  const INO = sequence;
  const CaseNo = `ITSSR-${Year}${Month}-${String(INO).padStart(4, '0')}`;
  
  return { Year, Month, INO, CaseNo };
}

// =============================================================================
// COMPUTED EMAIL FIELDS
// =============================================================================

/**
 * Email subject templates based on category
 */
export interface ITSSREmailSubjects {
  /** Computed subject from category */
  Category: string;
  /** Computed subject for SAP module requests */
  dsSAPSubject: string;
  /** Subject for automated reminder emails */
  RemSubject: string;
}

/**
 * Generate email subject based on request details
 */
export function generateEmailSubject(
  caseNo: string,
  serviceType: string,
  company: string,
  sapModule?: string
): ITSSREmailSubjects {
  const baseSubject = `[${caseNo}] ${serviceType} Support Request - ${company}`;
  const sapSubject = sapModule 
    ? `[${caseNo}] SAP ${sapModule} Support Request - ${company}`
    : baseSubject;
  const reminderSubject = `[REMINDER] ${baseSubject}`;
  
  return {
    Category: baseSubject,
    dsSAPSubject: sapSubject,
    RemSubject: reminderSubject,
  };
}

// =============================================================================
// HIDDEN FIELDS COMPLETE INTERFACE
// =============================================================================

/**
 * Complete hidden fields structure - Maps all Lotus Domino hidden fields
 */
export interface ITSSRHiddenFields {
  // Workflow State
  /** CurrentAction - drives form mode and button visibility */
  CA: ITSSRCurrentAction;
  
  // Routing
  /** Requestor's organisational unit - used for routing */
  OU?: string;
  /** IT sub-team assigned (SW/HW routing) */
  Team?: ITSSRTeam;
  
  // Access Control
  /** IT administrator group */
  ITADMIN: string[];
  /** Marketing/CFO mailing list - conditional routing */
  MKT?: string[];
  /** Default CC mailing list */
  Defcc?: string[];
  /** Hardware team - Penang location */
  HWP?: string[];
  /** Hardware team - Johor location */
  HWJ?: string[];
  /** All hardware team members */
  ALLHW?: string[];
  /** All software team members */
  ALLSW?: string[];
  /** All IT staff - read access control */
  AllIT?: string[];
  /** Additional editor 1 - section edit access */
  Editor1?: string;
  /** Additional editor 2 - section edit access */
  Editor2?: string;
  /** Additional editor 3 - section edit access */
  Editor3?: string;
  /** Additional editor 4 - section edit access */
  Editor4?: string;
  
  // Mailing & Notifications
  /** Computed mailing list for notifications */
  MailingList?: string[];
  /** Computed email subject from category */
  Category?: string;
  /** Computed email subject for SAP module requests */
  dsSAPSubject?: string;
  /** Computed subject for automated reminder emails */
  RemSubject?: string;
  
  // SLA Fields
  /** Public holiday list - used to exclude from SLA calculation */
  Holidays?: Date[];
  /** Computed - date IT first responded */
  RespondDate?: Date;
  /** Computed - working days taken to complete */
  Days?: number;
  /** Computed - adjusted days (excludes holidays) */
  Days2_1?: number;
  /** Computed - working days taken to first respond */
  Days2?: number;
  
  // Case Number Components
  /** Part 1 of auto-generated Case No. - Year */
  Year?: string;
  /** Part 2 of auto-generated Case No. - Month */
  Month?: string;
  /** Part 3 of auto-generated Case No. - Sequential increment */
  INO?: number;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Check if a string is a valid CurrentAction
 */
export function isValidCurrentAction(action: string): action is ITSSRCurrentAction {
  return ITSSR_CURRENT_ACTIONS.includes(action as ITSSRCurrentAction);
}

/**
 * Check if a string is a valid Team
 */
export function isValidTeam(team: string): team is ITSSRTeam {
  return ITSSR_TEAMS.includes(team as ITSSRTeam);
}

/**
 * Check if a string is a valid Site
 */
export function isValidSite(site: string): site is ITSSRSite {
  return ITSSR_SITES.includes(site as ITSSRSite);
}