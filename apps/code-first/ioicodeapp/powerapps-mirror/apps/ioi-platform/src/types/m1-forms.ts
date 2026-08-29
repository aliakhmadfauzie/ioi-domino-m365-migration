/**
 * M1 - User & Access Management Forms Schema
 *
 * Forms: EAF, NIR, RS, SFAR, UR
 * Site: PRAI (MainDB_IT)
 *
 * Schema Reference: IT Department D06 Schema (2026-05-01)
 * Domino Field Mapping: Lotus Domino IT Forms Field Mapping Document
 *
 * EAF Domino Fields (21 visible):
 *   Request: Company, req (date1), User, App, system, justification, depthead, CC
 *   HOD Approval: status1, HODNAME, date2, comment1
 *   Division Director: DDApp, status2, DIVNAME, date3, comment2
 */

import type { PersonOrGroup, EnvironmentTag } from '@/services/sharepoint-submission-service';

// =============================================================================
// EAF - EXTERNAL ACCESS FORM (VPN & Citrix)
// =============================================================================

/**
 * EAF Form Current Action states (workflow stages)
 * S1 Submission -> S2 Dept Head -> S3 Division Director -> S4 IT Manager -> S5 IT Provisioning
 */
export type EAFCurrentAction =
  | 'Requestor'     // S1: Initial submission
  | 'HOD'           // S2: Department Head approval
  | 'DDApp'         // S3: Division Director approval
  | 'ITManager'     // S4: IT Manager approval
  | 'ITComplete'    // S5: IT Provisioning
  | 'Closed';       // Final state

/**
 * EAF Approval Status for each approval tier
 */
export type EAFApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

/**
 * EAF Final Status
 */
export type EAFFinalStatus = 'Open' | 'Approved' | 'Rejected' | 'Closed';

/**
 * EAF Form Status
 */
export type EAFStatus = 'Draft' | 'Submitted' | 'InReview' | 'Completed' | 'Rejected' | 'Closed';

/**
 * EAF Application Type
 */
export type EAFApplication = 'Citrix' | 'VPN' | 'Other';

export const EAF_APPLICATIONS: EAFApplication[] = ['Citrix', 'VPN', 'Other'];

/**
 * EAF IT Completion Status
 */
export type EAFITCompletionStatus = 'Pending' | 'Completed' | 'Rework';

/**
 * EAF Form Schema - 51 Columns
 * As per SharePoint list MainDB_IT with FormCode = 'EAF'
 */
export interface EAFFormData {
  // =====================================================================
  // SHAREPOINT SYSTEM FIELDS
  // =====================================================================
  Id?: number;                          // SharePoint ID
  GUID?: string;                        // SharePoint GUID
  Created?: string;                     // Created timestamp
  Modified?: string;                    // Modified timestamp

  // =====================================================================
  // MANDATORY BASE COLUMNS (#1-2, #45-51)
  // =====================================================================

  /** #1 - Auto-generated reference number (EAF-YYYYMM-####) */
  Title: string;

  /** #2 - Form discriminator - always 'EAF' */
  FormCode: 'EAF';

  /** #45 - Form status */
  Status: EAFStatus;

  /** #46 - Submitter (mandatory governance) */
  SubmittedBy: string;

  /** #47 - Submission timestamp (mandatory governance) */
  SubmittedDate: string;

  /** #48 - Final approval actor */
  ApprovedBy?: string;

  /** #49 - Final approval timestamp */
  ApprovedDate?: string;

  /** #50 - Consolidated remarks */
  Comments?: string;

  /** #51 - Workflow troubleshooting trail (JSON) */
  WorkflowAuditJson?: string;

  // =====================================================================
  // ENVIRONMENT & WORKFLOW STATE (#3, #30)
  // =====================================================================

  /** Environment tag (from Config_AppSettings) */
  EnvironmentTag?: EnvironmentTag;

  /** #30 - Current workflow state */
  CurrentAction: EAFCurrentAction;

  // =====================================================================
  // REQUEST DETAILS (#3-11)
  // =====================================================================

  /** #3 - Company from master list */
  Company: string;

  /** #4 - Requesting user */
  Requestor: string;

  /** #5 - System timestamp */
  SubmittedOn: string;

  /** #6 - User needing access */
  TargetUser: string;

  /** #7 - Application type: Citrix, VPN, Other */
  Application: EAFApplication;

  /** #8 - System lookup */
  SystemName?: string; // Optional - field removed per TASK-003

  /** #9 - Business justification */
  Justification: string;

  /** #10 - Department Head from approver matrix */
  DepartmentHead: string;

  /** #11 - CC recipients for notifications */
  CCRecipients?: string;

  // =====================================================================
  // STAGE 2: DEPARTMENT HEAD APPROVAL (#12-15)
  // =====================================================================

  /** #12 - Dept Head approval status */
  DeptHeadStatus?: EAFApprovalStatus;

  /** #13 - Dept Head approver (flow managed) */
  DeptHeadApprovedBy?: string;

  /** #14 - Dept Head approval timestamp (flow managed) */
  DeptHeadApprovedDate?: string;

  /** #15 - Dept Head comments */
  DeptHeadComment?: string;

  // =====================================================================
  // STAGE 3: DIVISION DIRECTOR APPROVAL (#16-19)
  // =====================================================================

  /** #16 - Division Director approval status */
  DDAppStatus?: EAFApprovalStatus;

  /** #17 - Division Director approver (flow managed) */
  DDAppApprovedBy?: string;

  /** #18 - Division Director approval timestamp (flow managed) */
  DDAppApprovedDate?: string;

  /** #19 - Division Director comments */
  DDAppComment?: string;

  // =====================================================================
  // STAGE 4: IT MANAGER APPROVAL (#20-23)
  // =====================================================================

  /** #20 - IT Manager approval status */
  ITManagerStatus?: EAFApprovalStatus;

  /** #21 - IT Manager approver (flow managed) */
  ITManagerApprovedBy?: string;

  /** #22 - IT Manager approval timestamp (flow managed) */
  ITManagerApprovedDate?: string;

  /** #23 - IT Manager comments */
  ITManagerComment?: string;

  // =====================================================================
  // STAGE 5: IT PROVISIONING (#24-28)
  // =====================================================================

  /** #24 - IT completion status */
  ITCompletionStatus?: EAFITCompletionStatus;

  /** #25 - IT completion actor (flow managed) */
  ITCompletedBy?: string;

  /** #26 - IT completion timestamp (flow managed) */
  ITCompletedDate?: string;

  /** #27 - IT completion remarks */
  ITCompletionRemarks?: string;

  /** #28 - IT internal remarks */
  ITInternalRemarks?: string;

  // =====================================================================
  // FINAL STATUS (#29)
  // =====================================================================

  /** #29 - Overall form status */
  FinalStatus?: EAFFinalStatus;

  // =====================================================================
  // ROUTING FIELDS (FLOW MANAGED) (#31-44)
  // =====================================================================

  /** #31 - Flow managed routing - ACM IT */
  RouteACMIT?: string;

  /** #32 - Flow managed routing - PCN IT */
  RoutePCNIT?: string;

  /** #33 - Flow managed routing - PCN IT 2 */
  RoutePCNIT2?: string;

  /** #34 - Computed from company */
  IsPCN?: boolean;

  /** #35 - IT Person In Charge */
  ITPIC?: string;

  /** #36 - IT Person In Charge 2 */
  ITPIC2?: string;

  /** #37 - Executive Director */
  ExecutiveDirector?: string;

  /** #38 - Head of Operation */
  HeadOfOperation?: string;

  /** #39 - Higher Approver */
  HigherApprover?: string;

  /** #40 - Recipient Routing */
  RecipientRouting?: string;

  /** #41 - IS Manager */
  ISManager?: string;

  /** #42 - IT Admin */
  ITAdmin?: string;

  /** #43 - Reminder recipient */
  ReminderTo?: string;

  /** #44 - Reminder subject */
  ReminderSubject?: string;
}

/**
 * EAF Form Input - Fields required when creating a new EAF request
 */
export interface EAFFormInput {
  // Required fields
  Company: string;
  Site: string;
  Requestor: string;
  TargetUser: string;
  Application: EAFApplication;
  System: string;       // Domino field: system (radiobutton) - e.g., Active Directory, Citrix, VPN infra
  Justification: string;
  DepartmentHead: string;

  // Optional fields
  CCRecipients?: string;
  TargetUserId?: string; // Manual user ID entry fallback

  // NEW: Domino fields added per Phase 1 analysis
  ClientID?: string;     // Domino field: ClientID - client identifier
  Group?: string;        // Domino field: Group - user group for access
  HigherApprover?: string; // Domino field: HApp - higher approver (COO/Director)
}

/**
 * EAF Approval Action - Used when approving/rejecting at each stage
 */
export interface EAFApprovalAction {
  stage: 'DeptHead' | 'DDApp' | 'ITManager' | 'ITComplete';
  status: EAFApprovalStatus | EAFITCompletionStatus;
  approvedBy: string;
  comment?: string;
}

// =============================================================================
// CHOICE VALUES (for dropdowns)
// =============================================================================

// Import from centralized config
import {
  MASTER_COMPANIES,
  MASTER_DEPARTMENTS,
  EAF_SYSTEMS as EAF_SYSTEMS_CONFIG,
} from '@/config/form-dropdown-config';

// Re-export company list from config
export const EAF_COMPANIES = MASTER_COMPANIES.map(c => c.name);

// Re-export departments from config
export const EAF_DEPARTMENTS = MASTER_DEPARTMENTS.map(d => d.name);

// =============================================================================
// WORKFLOW STAGE HELPERS
// =============================================================================

/**
 * Base stage properties
 */
interface EAFStageBase {
  id: string;
  action: EAFCurrentAction;
  label: string;
  description: string;
  approverField: keyof EAFFormData;
}

/**
 * Approval stage with status tracking fields
 */
interface EAFApprovalStage extends EAFStageBase {
  statusField: keyof EAFFormData;
  approvedByField: keyof EAFFormData;
  approvedDateField: keyof EAFFormData;
  commentField: keyof EAFFormData;
}

/**
 * Submission stage (no approval tracking)
 */
interface EAFSubmissionStage extends EAFStageBase {
  statusField?: undefined;
  approvedByField?: undefined;
  approvedDateField?: undefined;
  commentField?: undefined;
}

export type EAFStage = EAFSubmissionStage | EAFApprovalStage;

/**
 * Type guard to check if stage has approval fields
 */
export function isApprovalStage(stage: EAFStage): stage is EAFApprovalStage {
  return 'statusField' in stage && stage.statusField !== undefined;
}

/**
 * EAF Workflow Stages with labels and descriptions
 */
export const EAF_STAGES: EAFStage[] = [
  {
    id: 'S1_Submission',
    action: 'Requestor',
    label: 'Submission',
    description: 'Request submitted',
    approverField: 'SubmittedBy',
  },
  {
    id: 'S2_DeptHead',
    action: 'HOD',
    label: 'Department Head',
    description: 'Pending department head approval',
    approverField: 'DepartmentHead',
    statusField: 'DeptHeadStatus',
    approvedByField: 'DeptHeadApprovedBy',
    approvedDateField: 'DeptHeadApprovedDate',
    commentField: 'DeptHeadComment',
  },
  {
    id: 'S3_DivisionDirector',
    action: 'DDApp',
    label: 'Division Director',
    description: 'Pending division director approval',
    approverField: 'ExecutiveDirector',
    statusField: 'DDAppStatus',
    approvedByField: 'DDAppApprovedBy',
    approvedDateField: 'DDAppApprovedDate',
    commentField: 'DDAppComment',
  },
  {
    id: 'S4_ITManager',
    action: 'ITManager',
    label: 'IT Manager',
    description: 'Pending IT manager approval',
    approverField: 'ISManager',
    statusField: 'ITManagerStatus',
    approvedByField: 'ITManagerApprovedBy',
    approvedDateField: 'ITManagerApprovedDate',
    commentField: 'ITManagerComment',
  },
  {
    id: 'S5_ITProvisioning',
    action: 'ITComplete',
    label: 'IT Provisioning',
    description: 'IT team provisioning access',
    approverField: 'ITPIC',
    statusField: 'ITCompletionStatus',
    approvedByField: 'ITCompletedBy',
    approvedDateField: 'ITCompletedDate',
    commentField: 'ITCompletionRemarks',
  },
];

/**
 * Get current stage index from CurrentAction
 */
export function getEAFStageIndex(currentAction: EAFCurrentAction): number {
  const index = EAF_STAGES.findIndex(s => s.action === currentAction);
  return index >= 0 ? index : 0;
}

/**
 * Check if a stage is completed
 */
export function isEAFStageCompleted(currentAction: EAFCurrentAction, stageAction: EAFCurrentAction): boolean {
  const currentIndex = getEAFStageIndex(currentAction);
  const stageIndex = getEAFStageIndex(stageAction);
  return stageIndex < currentIndex;
}

/**
 * Check if a stage is current
 */
export function isEAFStageCurrent(currentAction: EAFCurrentAction, stageAction: EAFCurrentAction): boolean {
  return currentAction === stageAction;
}

/**
 * Get stage label from action
 */
export function getEAFStageLabel(currentAction: EAFCurrentAction): string {
  const stage = EAF_STAGES.find(s => s.action === currentAction);
  return stage?.label || 'Unknown';
}

// =============================================================================
// NIR - NOTES ID REQUEST
// =============================================================================

/**
 * NIR Email Type
 */
export type NIREmailType = 'New Email' | 'Replacement' | 'Rename' | 'Delete';

/**
 * NIR Current Action (CA) states — matches Domino LNIDRequest.nsf
 * Request → Submitted → ISGHODApproved → Done → Completed
 *               ├→ ISGHODRejected (terminal)
 *                                    └→ HODRejected (admin terminal)
 */
export type NIRCurrentAction =
  | 'Request'              // Draft — requestor fills section
  | 'Submitted'            // Pending ISG HOD approval
  | 'ISGHODApproved'       // Pending PIC / Notes Admin
  | 'ISGHODRejected'       // Terminal — rejected by HOD
  | 'Done'                 // Pending HWG Configuration
  | 'Completed'            // Terminal — HWG completed config
  | 'HODRejected'          // Terminal — admin-only override
  // NIR stages (used in NIR_STAGES array)
  | 'RequestSubmitted'
  | 'HODPending'
  | 'NotesAdminPending'
  | 'HardwarePending'
  | 'Closed';

/**
 * NIR Approval Status sub-types
 */
export type NIRHODApprovalStatus = 'Approved' | 'Rejected';
export type NIRPICStatus = 'Done';
export type NIRHWGStatus = 'Completed';
export type NIRHardwareStatus = 'Pending' | 'InProgress' | 'Completed';

/**
 * Role groups for NIR workflow
 */
export type NIRRole = 'Editor1' | 'Editor2' | 'Editor3' | 'Editor4' | 'ISADMIN';

/**
 * NIR workflow transition definition
 */
export interface NIRWorkflowTransition {
  from: NIRCurrentAction;
  to: NIRCurrentAction;
  button: string;
  actor: NIRRole;
  validate?: string[];      // Fields to validate before transition
  setFields: Record<string, string>;  // Fields set on the record
  mailTo?: string;
  mailCC?: string;
  subject?: string;
}

/**
 * NIR Form Schema - 31+ Columns
 * As per SharePoint list MainDB_IT with FormCode = 'NIR'
 */
export interface NIRFormData {
  // =====================================================================
  // SHAREPOINT SYSTEM FIELDS
  // =====================================================================
  Id?: number;
  GUID?: string;
  Created?: string;
  Modified?: string;

  // =====================================================================
  // MANDATORY BASE COLUMNS
  // =====================================================================

  /** #1 - Display identifier (auto-generated) */
  Title: string;

  /** #2 - Form discriminator - always 'NIR' */
  FormCode: 'NIR';

  // =====================================================================
  // REQUEST DETAILS (#3-12)
  // =====================================================================

  /** #3 - Email request type */
  EmailType: NIREmailType;

  /** #4 - Company selection */
  Company: 'IOI Oleochemical' | 'IOI Acidchem';

  /** #5 - Existing email address (for replacement only) */
  ExistingEmailAddress?: string;

  /** #6 - User full name */
  FullName: string;

  /** #7 - Employee ID */
  EmployeeNumber: string;

  /** #8 - Department lookup */
  Department: string;

  /** #9 - Job title */
  Designation?: string;

  /** #10 - Contact extension */
  PhoneExtension?: string;

  /** #11 - Head-of-Department approver */
  HODApprover: string;

  /** #12 - Business note */
  Remarks?: string;

  // =====================================================================
  // COMPUTED/SYSTEM FIELDS (#13-14)
  // =====================================================================

  /** #13 - Request initiator (computed) */
  Requestor?: string;

  /** #14 - Submission timestamp (computed) */
  SubmittedDate?: string;

  // =====================================================================
  // STAGE 2: HOD APPROVAL (#15-18)
  // =====================================================================

  /** #15 - Recorded HOD approver */
  HODName?: string;

  /** #16 - HOD decision timestamp */
  HODApprovalDate?: string;

  /** #17 - HOD approval status */
  HODApprovalStatus?: NIRHODApprovalStatus;

  /** #18 - HOD remarks */
  HODComment?: string;

  // =====================================================================
  // STAGE 3: NOTES ADMIN PROVISIONING (#19-24)
  // =====================================================================

  /** #19 - Notes admin for provisioning */
  NotesAdministrator?: string;

  /** #20 - Notes admin action timestamp */
  NotesAdminDate?: string;

  /** #21 - Provisioning task detail */
  NotesAdminTask?: string;

  /** #22 - Internal Notes ID produced */
  InternalNotesID?: string;

  /** #23 - External Notes ID */
  ExternalNotesID?: string;

  /** #24 - Notes admin remarks */
  NotesAdminRemark?: string;

  // =====================================================================
  // STAGE 4: IT HARDWARE COMPLETION (#25-29)
  // =====================================================================

  /** #25 - IT hardware/support actor */
  ITHardwareOwner?: string;

  /** #26 - IT hardware action timestamp */
  ITHardwareDate?: string;

  /** #27 - Hardware/downstream IT task */
  ITHardwareTask?: string;

  /** #28 - IT hardware status */
  ITHardwareStatus?: NIRHardwareStatus;

  /** #29 - Hardware/support remarks */
  ITHardwareComment?: string;

  // =====================================================================
  // WORKFLOW STATE (#30)
  // =====================================================================

  /** #30 - Current workflow state */
  CurrentAction?: NIRCurrentAction;

  // =====================================================================
  // HIDDEN/ROUTING FIELDS (#31+)
  // =====================================================================

  /** #31 - Hidden IT HOD routing field */
  ITHODRoutingField?: string;

  /** Standard base fields */
  DepartmentCode?: string;
  EnvironmentTag?: EnvironmentTag;
  CreatedBy?: string;
  CreatedDate?: string;
  ModifiedBy?: string;
  ModifiedDate?: string;
}

/**
 * NIR Form Input - Fields required when creating a new NIR request
 */
export interface NIRFormInput {
  // Required fields
  EmailType: NIREmailType;
  Company: 'IOI Oleochemical' | 'IOI Acidchem';
  Site: string;
  FullName: string;
  EmployeeNumber: string;
  Department: string;
  HODApprover: string;

  // Conditional/optional fields
  ExistingEmailAddress?: string;  // Required when EmailType = 'Replacement'
  Designation?: string;
  PhoneExtension?: string;
  Remarks?: string;
}

/**
 * NIR workflow state configuration — maps Domino LNIDRequest.nsf
 * Defines which role sees which section and what transitions are available
 */
export const NIR_WORKFLOW_CONFIG: Record<NIRCurrentAction, {
  label: string;
  description: string;
  stage: number;
  badgeColor: string;
  editor1Editable: boolean;   // Requestor section
  editor2Editable: boolean;   // ISG HOD section
  editor3Editable: boolean;   // PIC / Notes Admin section
  editor4Editable: boolean;   // HWG section
  showAdminPanel: boolean;
  isTerminal: boolean;
  transitions: Array<{ to: NIRCurrentAction; button: string; actor: NIRRole }>;
}> = {
  Request: {
    label: 'Draft',
    description: 'Pending submission to ISG',
    stage: 1,
    badgeColor: '#64748b',
    editor1Editable: true,
    editor2Editable: false,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [{ to: 'Submitted', button: 'Send to ISG', actor: 'Editor1' }],
  },
  Submitted: {
    label: 'Pending ISG HOD',
    description: 'Awaiting HOD approval',
    stage: 2,
    badgeColor: '#f59e0b',
    editor1Editable: false,
    editor2Editable: true,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [
      { to: 'ISGHODApproved', button: 'Approved', actor: 'Editor2' },
      { to: 'ISGHODRejected', button: 'Rejected', actor: 'Editor2' },
    ],
  },
  ISGHODApproved: {
    label: 'Pending PIC/Notes Admin',
    description: 'Awaiting Notes ID provisioning',
    stage: 3,
    badgeColor: '#3b82f6',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: true,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [{ to: 'Done', button: 'Done', actor: 'Editor3' }],
  },
  ISGHODRejected: {
    label: 'Rejected by HOD',
    description: 'Request has been rejected by ISG HOD',
    stage: 2,
    badgeColor: '#ef4444',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: true,
    transitions: [],
  },
  Done: {
    label: 'Pending HWG Config',
    description: 'Awaiting HWG configuration',
    stage: 4,
    badgeColor: '#8b5cf6',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: false,
    editor4Editable: true,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [
      { to: 'Completed', button: 'Completed', actor: 'Editor4' },
      { to: 'HODRejected', button: 'SET (admin)', actor: 'ISADMIN' },
    ],
  },
  Completed: {
    label: 'Completed',
    description: 'Notes ID successfully configured',
    stage: 5,
    badgeColor: '#22c55e',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: true,
    transitions: [],
  },
  HODRejected: {
    label: 'HOD Rejected (Admin)',
    description: 'Manually rejected by admin override',
    stage: 4,
    badgeColor: '#6b7280',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: true,
    transitions: [],
  },
  RequestSubmitted: {
    label: 'Submitted',
    description: 'Request submitted',
    stage: 2,
    badgeColor: '#f59e0b',
    editor1Editable: false,
    editor2Editable: true,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [
      { to: 'ISGHODApproved', button: 'Approved', actor: 'Editor2' },
      { to: 'ISGHODRejected', button: 'Rejected', actor: 'Editor2' },
    ],
  },
  HODPending: {
    label: 'HOD Pending',
    description: 'Awaiting HOD review',
    stage: 2,
    badgeColor: '#f59e0b',
    editor1Editable: false,
    editor2Editable: true,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [
      { to: 'ISGHODApproved', button: 'Approved', actor: 'Editor2' },
      { to: 'ISGHODRejected', button: 'Rejected', actor: 'Editor2' },
    ],
  },
  NotesAdminPending: {
    label: 'Notes Admin Pending',
    description: 'Awaiting Notes ID provisioning',
    stage: 3,
    badgeColor: '#3b82f6',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: true,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [{ to: 'Done', button: 'Done', actor: 'Editor3' }],
  },
  HardwarePending: {
    label: 'Hardware Pending',
    description: 'Awaiting HWG configuration',
    stage: 4,
    badgeColor: '#8b5cf6',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: false,
    editor4Editable: true,
    showAdminPanel: true,
    isTerminal: false,
    transitions: [{ to: 'Completed', button: 'Completed', actor: 'Editor4' }],
  },
  Closed: {
    label: 'Closed',
    description: 'Request has been closed',
    stage: 5,
    badgeColor: '#22c55e',
    editor1Editable: false,
    editor2Editable: false,
    editor3Editable: false,
    editor4Editable: false,
    showAdminPanel: true,
    isTerminal: true,
    transitions: [],
  },
};

/**
 * NIR Approval Action - Used when approving/rejecting at each stage
 */
export interface NIRApprovalAction {
  stage: 'HOD' | 'NotesAdmin' | 'ITHardware';
  status: NIRHODApprovalStatus | NIRHardwareStatus;
  approvedBy: string;
  comment?: string;

  // Notes Admin specific
  internalNotesId?: string;
  externalNotesId?: string;
  notesAdminTask?: string;

  // IT Hardware specific
  hardwareTask?: string;
}

// =============================================================================
// NIR CHOICE VALUES
// =============================================================================

// Import from centralized config
import {
  NIR_EMAIL_TYPES as NIR_EMAIL_TYPES_CONFIG,
  NIR_EMPLOYEE_TYPES,
} from '@/config/form-dropdown-config';

// NIR Email types - updated with Rename and Delete
export const NIR_EMAIL_TYPES: NIREmailType[] = ['New Email', 'Replacement', 'Rename', 'Delete'];

// Company list from centralized config
export const NIR_COMPANIES = MASTER_COMPANIES.map(c => c.name);

// Department list from centralized config (sorted alphabetically)
export const NIR_DEPARTMENTS = MASTER_DEPARTMENTS.map(d => d.name).sort();

// Employee types for NIR
export const NIR_EMPLOYEE_TYPE_OPTIONS = NIR_EMPLOYEE_TYPES;

// =============================================================================
// NIR WORKFLOW STAGE HELPERS
// =============================================================================

/**
 * Base stage properties for NIR
 */
interface NIRStageBase {
  id: string;
  action: NIRCurrentAction;
  label: string;
  description: string;
  actorField: keyof NIRFormData;
}

/**
 * Approval stage with status tracking
 */
interface NIRApprovalStage extends NIRStageBase {
  statusField: keyof NIRFormData;
  dateField: keyof NIRFormData;
  commentField: keyof NIRFormData;
}

/**
 * Submission stage (no approval tracking)
 */
interface NIRSubmissionStage extends NIRStageBase {
  statusField?: undefined;
  dateField?: undefined;
  commentField?: undefined;
}

export type NIRStage = NIRSubmissionStage | NIRApprovalStage;

/**
 * Type guard to check if NIR stage has approval fields
 */
export function isNIRApprovalStage(stage: NIRStage): stage is NIRApprovalStage {
  return 'statusField' in stage && stage.statusField !== undefined;
}

/**
 * NIR Workflow Stages
 */
export const NIR_STAGES: NIRStage[] = [
  {
    id: 'S1_Request',
    action: 'RequestSubmitted',
    label: 'Request Submission',
    description: 'Request submitted',
    actorField: 'Requestor',
  },
  {
    id: 'S2_HOD',
    action: 'HODPending',
    label: 'HOD Approval',
    description: 'Pending Head of Department approval',
    actorField: 'HODApprover',
    statusField: 'HODApprovalStatus',
    dateField: 'HODApprovalDate',
    commentField: 'HODComment',
  },
  {
    id: 'S3_NotesAdmin',
    action: 'NotesAdminPending',
    label: 'Notes Admin',
    description: 'Notes Administrator provisioning',
    actorField: 'NotesAdministrator',
    statusField: 'HODApprovalStatus',  // Uses same status after HOD approval
    dateField: 'NotesAdminDate',
    commentField: 'NotesAdminRemark',
  },
  {
    id: 'S4_ITHardware',
    action: 'HardwarePending',
    label: 'IT Hardware',
    description: 'IT Hardware/Support completion',
    actorField: 'ITHardwareOwner',
    statusField: 'ITHardwareStatus',
    dateField: 'ITHardwareDate',
    commentField: 'ITHardwareComment',
  },
  {
    id: 'S5_Closed',
    action: 'Closed',
    label: 'Closed',
    description: 'Request completed',
    actorField: 'Requestor',
  },
];

/**
 * Get NIR stage index from CurrentAction
 */
export function getNIRStageIndex(currentAction: NIRCurrentAction): number {
  const index = NIR_STAGES.findIndex(s => s.action === currentAction);
  return index >= 0 ? index : 0;
}

/**
 * Check if a NIR stage is completed
 */
export function isNIRStageCompleted(currentAction: NIRCurrentAction, stageAction: NIRCurrentAction): boolean {
  const currentIndex = getNIRStageIndex(currentAction);
  const stageIndex = getNIRStageIndex(stageAction);
  return stageIndex < currentIndex;
}

/**
 * Check if a NIR stage is current
 */
export function isNIRStageCurrent(currentAction: NIRCurrentAction, stageAction: NIRCurrentAction): boolean {
  return currentAction === stageAction;
}

/**
 * Get NIR stage label from action
 */
export function getNIRStageLabel(currentAction: NIRCurrentAction): string {
  const stage = NIR_STAGES.find(s => s.action === currentAction);
  return stage?.label || 'Unknown';
}
