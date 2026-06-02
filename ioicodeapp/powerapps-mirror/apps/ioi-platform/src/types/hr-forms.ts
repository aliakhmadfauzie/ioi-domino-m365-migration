/**
 * MainDB_HR - Consolidated HR Forms Schema
 *
 * Department Code: D05
 * Department Name: Human Resources (HR)
 * Primary SharePoint Site: https://ioioi.sharepoint.com/sites/ioi-portal-hr
 * Target List: MainDB_HR
 * Discriminator Column: FormCode
 * Site Column: Site
 * Environment Column: EnvironmentTag
 * Security Group Prefix: D05-HR
 * Flow Naming Standard: HR_[FORMCODE]_[EventName]
 * Shared Approval History: cr_approvalrecord
 *
 * Blueprint Version: 1.0
 * Blueprint Date: 2026-05-02
 */

import type { PersonOrGroup, EnvironmentTag } from '@/services/sharepoint-submission-service';

// =============================================================================
// MAINDB_HR SHARED COLUMNS — Section 4 Blueprint
// Every HR form has these columns (form-specific columns start at #13)
// =============================================================================

/**
 * Site options for HR forms
 */
export type HRSite = 'PRAI' | 'JOHOR';

/**
 * HR Form Status - workflow managed choices
 * As per Section 4: Draft/Submitted/EndorsedHOD/ApprovedHR/ApprovedCOO/ApprovedED/Rejected/Returned/Closed
 */
export type HRCurrentStatus =
  | 'Draft'
  | 'Submitted'
  | 'EndorsedHOD'
  | 'ApprovedHR'
  | 'ApprovedCOO'
  | 'ApprovedED'
  | 'Rejected'
  | 'Returned'
  | 'Closed';

/**
 * HR Form Codes (FormType column) - discriminator
 * Fixed value per form, immutable
 */
export type HRFormCode =
  | 'AWHR'        // Rest Day & Additional Working Hours Requisition
  | 'BSD'         // Backup Staff Declaration
  | 'CIR'         // Cafeteria Inspection Database
  | 'CWR'         // Contract Worker Request
  | 'DRD'         // Duty Roster Database
  | 'EEN'         // Employee Exit Notice
  | 'EPHR'        // Employee to HR - new in Section 4
  | 'EPDU'        // Employee Personal Data Update
  | 'ESF'         // Employee Status Form
  | 'FTCR'        // Fixed Term Contract Renewal
  | 'FWWPD'       // Flexible Working/Work Permit (D variant)
  | 'FWWPE'       // Flexible Working/Work Permit Extension
  | 'GDSN'        // Group Dependants Scheme Nomination
  | 'HEALTHINFO'  // Health Information Form
  | 'HRAPR'       // HR Approval Request
  | 'HSE'         // Health & Safety Report
  | 'HRINFO'      // HR Information
  | 'INTERN'      // Internship Application
  | 'INTERVIEWDB' // Interview Database
  | 'JD'          // Job Description
  | 'LVE'         // Leave Application
  | 'MCL'         // Medical Claim
  | 'NDF'         // New Document Form
  | 'ORGCHART'    // Organization Chart
  | 'OWP'         // Overtime Work Permit
  | 'PAF'         // Personnel Action Form
  | 'RDWH'        // Return to Duty/Work from Home
  | 'SR'          // Staff Requisition
  | 'TMPU'        // Template Update
  | 'TNPRA';      // Training Program Administration

/**
 * Environment tags
 */
export type HREnvironmentTag = 'DEV' | 'TEST' | 'PROD';

/**
 * MainDB_HR Shared Columns Schema — Section 4 Blueprint
 * These 12 columns are on EVERY HR form. Form-specific columns appended starting at #13.
 * Indexed columns: [FormType, CurrentStatus]
 */
export interface MainDBHRSharedColumns {
  // =====================================================================
  // SHAREPOINT SYSTEM FIELDS
  // =====================================================================
  Id?: number;                          // SharePoint ID
  GUID?: string;                        // SharePoint GUID
  Created?: string;                     // Created timestamp
  Modified?: string;                    // Modified timestamp

  // =====================================================================
  // SHARED COLUMNS (#1-12) — Section 4 Blueprint
  // =====================================================================

  /** #1 - Title (SYSTEM-COMPUTED)
   * Formula: '<FORMCODE>-' & INO
   * Used for gallery display */
  Title: string;

  /** #2 - INO - Reference Number (SYSTEM-COMPUTED)
   * Pattern: HR-<SUB>-YYMM-NNNN (e.g., HR-CWR-2605-0001)
   * IMPORTANT: Pattern-E. Power Automate only. NEVER set in canvas. */
  INO: string;

  /** #3 - FormType / FormCode (SYSTEM-COMPUTED)
   * Discriminator column - fixed per form, immutable
   * Default: this form's code */
  FormType: HRFormCode;

  /** #4 - CurrentStatus (WORKFLOW-MANAGED)
   * Choices: Draft/Submitted/EndorsedHOD/ApprovedHR/ApprovedCOO/ApprovedED/Rejected/Returned/Closed
   * Default: Draft */
  CurrentStatus: HRCurrentStatus;

  /** #5 - EnvironmentTag (SYSTEM-COMPUTED)
   * Choices: DEV/TEST/PROD */
  EnvironmentTag: HREnvironmentTag;

  /** #6 - SubmittedBy (SYSTEM-COMPUTED)
   * Person or Group - optional */
  SubmittedBy?: string;

  /** #7 - SubmittedDate (SYSTEM-COMPUTED)
   * DateTime - optional */
  SubmittedDate?: string;

  /** #8 - ApprovedBy (WORKFLOW-MANAGED)
   * Person or Group - optional */
  ApprovedBy?: string;

  /** #9 - ApprovedDate (WORKFLOW-MANAGED)
   * DateTime - optional */
  ApprovedDate?: string;

  /** #10 - Comments (USER-ENTERED)
   * Multiple lines text, max 2000 chars - optional */
  Comments?: string;

  /** #11 - Attachments (USER-ENTERED)
   * SPListAttachments - optional */
  Attachments?: string[];

  /** #12 - Division (USER-ENTERED)
   * Single line text - HR division or business division */
  Division?: string;

  /** #13 - IsLocked (WORKFLOW-MANAGED)
   * YesNo - set true after final stage - optional */
  IsLocked?: boolean;
}

/**
 * Alias: MainDBHRBase = MainDBHRSharedColumns
 * For backwards compatibility
 */
export type MainDBHRBase = MainDBHRSharedColumns;

// =============================================================================
// SHARED APPROVAL RECORD (cr_approvalrecord)
// =============================================================================

/**
 * Approval action types
 */
export type ApprovalAction =
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Returned'
  | 'Escalated'
  | 'Completed';

/**
 * Shared Approval Record - cr_approvalrecord table
 * Generic approval history for all HR forms
 */
export interface CRApprovalRecord {
  Id?: number;
  GUID?: string;

  /** Title - stage name */
  Title: string;

  /** Parent record lookup */
  ParentID: number;

  /** Form discriminator */
  FormCode: HRFormCode;

  /** Stage number in workflow */
  StageNumber: number;

  /** Person who took action */
  ActionByID?: string;
  ActionByName?: string;

  /** Next stage in workflow */
  NextStage?: string;

  /** Action taken */
  Action: ApprovalAction;

  /** Timestamp of action */
  ActionDate: string;

  /** Comments/remarks */
  Comments?: string;
}

// =============================================================================
// HR CHILD TABLES
// =============================================================================

/**
 * HR_BSD_BackupNominees - backup nominee rows for BSD
 */
export interface HRBSDBackupNominee {
  Id?: number;
  ParentID: number;
  FormCode: 'BSD';

  /** Nominee employee */
  NomineeName: string;
  NomineeID?: string;

  /** Position being backed up */
  BackupPosition: string;

  /** Priority level */
  Priority: number;

  /** Competency assessment */
  ReadinessLevel?: 'Ready Now' | '1-2 Years' | '3-5 Years';

  /** Comments */
  Remarks?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_INTERVIEWDB_Candidates - candidate rows for INTERVIEWDB
 */
export interface HRInterviewCandidate {
  Id?: number;
  ParentID: number;
  FormCode: 'INTERVIEWDB';

  /** Candidate info */
  CandidateName: string;
  Email?: string;
  Phone?: string;

  /** Position applied for */
  Position: string;

  /** Interview details */
  InterviewDate?: string;
  InterviewerName?: string;
  InterviewerID?: string;

  /** Assessment */
  Rating?: number;
  Recommendation?: 'Hire' | 'Hold' | 'Reject';

  /** Comments */
  Remarks?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_EPDU_Education - education history rows for EPDU
 */
export interface HREPDUEducation {
  Id?: number;
  ParentID: number;
  FormCode: 'EPDU';

  /** Education details */
  Institution: string;
  Qualification: string;
  FieldOfStudy?: string;
  StartYear?: number;
  EndYear?: number;
  Grade?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_EPDU_Children - child dependent rows for EPDU
 */
export interface HREPDUChildren {
  Id?: number;
  ParentID: number;
  FormCode: 'EPDU';

  /** Child details */
  ChildName: string;
  DateOfBirth: string;
  Gender: 'Male' | 'Female';
  ICNumber?: string;

  /** Status */
  IsDependent: boolean;
  IsStudying?: boolean;
  SchoolName?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_EPDU_Family - family contact rows for EPDU
 */
export interface HREPDUFamily {
  Id?: number;
  ParentID: number;
  FormCode: 'EPDU';

  /** Family member details */
  Name: string;
  Relationship: 'Spouse' | 'Parent' | 'Sibling' | 'Other';
  ICNumber?: string;
  ContactNumber?: string;
  Address?: string;

  /** Emergency contact */
  IsEmergencyContact: boolean;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_JD_Duties - duty statement rows for JD
 */
export interface HRJDDuty {
  Id?: number;
  ParentID: number;
  FormCode: 'JD';

  /** Duty details */
  DutyNumber: number;
  Description: string;
  Percentage?: number;

  /** Category */
  Category?: 'Core' | 'Supporting' | 'Administrative';

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_NDF_Findings - inspection findings rows for NDF
 */
export interface HRNDFFindings {
  Id?: number;
  ParentID: number;
  FormCode: 'NDF';

  /** Finding details */
  FindingNumber: number;
  Description: string;
  Severity: 'Critical' | 'Major' | 'Minor' | 'Observation';

  /** Action required */
  ActionRequired?: string;
  ResponsiblePerson?: string;
  DueDate?: string;
  Status?: 'Open' | 'In Progress' | 'Closed';

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_SR_InterviewLog - interview tracker rows for SR
 */
export interface HRSRInterviewLog {
  Id?: number;
  ParentID: number;
  FormCode: 'SR';

  /** Interview details */
  CandidateName: string;
  InterviewDate: string;
  InterviewerName: string;
  InterviewerID?: string;

  /** Assessment */
  TechnicalScore?: number;
  BehavioralScore?: number;
  OverallScore?: number;
  Recommendation?: 'Proceed' | 'Hold' | 'Reject';

  /** Comments */
  Remarks?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_TMPU_Strengths - readiness strengths rows for TMPU
 */
export interface HRTMPUStrength {
  Id?: number;
  ParentID: number;
  FormCode: 'TMPU';

  /** Strength details */
  StrengthArea: string;
  Description: string;
  Evidence?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_TMPU_Competencies - competency assessment rows for TMPU
 */
export interface HRTMPUCompetency {
  Id?: number;
  ParentID: number;
  FormCode: 'TMPU';

  /** Competency details */
  CompetencyName: string;
  RequiredLevel: number;
  CurrentLevel: number;
  Gap?: number;
  DevelopmentPlan?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_TMPU_IDP - individual development plan rows for TMPU
 */
export interface HRTMPUIDP {
  Id?: number;
  ParentID: number;
  FormCode: 'TMPU';

  /** IDP details */
  Objective: string;
  Actions: string;
  Resources?: string;
  TargetDate?: string;
  Status?: 'Not Started' | 'In Progress' | 'Completed';

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

/**
 * HR_PAF_RatingDetails - appraisal category ratings rows for PAF
 */
export interface HRPAFRatingDetail {
  Id?: number;
  ParentID: number;
  FormCode: 'PAF';

  /** Rating details */
  Category: string;
  Weight: number;
  SelfRating?: number;
  ManagerRating?: number;
  FinalRating?: number;

  /** Comments */
  SelfComments?: string;
  ManagerComments?: string;

  /** Audit fields */
  CreatedBy?: string;
  CreatedDate?: string;
}

// =============================================================================
// FORM-SPECIFIC SCHEMAS (columns #13+)
// =============================================================================

/**
 * SR - Staff Requisition Form
 */
export interface SRFormData extends MainDBHRBase {
  FormType: 'SR';

  /** Position details */
  PositionTitle: string;
  PositionLevel?: string;
  ReportingTo: string;

  /** Requisition type */
  RequisitionType: 'New Position' | 'Replacement' | 'Temporary';

  /** Justification */
  Justification: string;
  HeadcountBudget?: number;

  /** Approval fields */
  HODApprovalStatus?: 'Pending' | 'Approved' | 'Rejected';
  HODApprovalDate?: string;
  HODApprovalBy?: string;
  HODComments?: string;

  HRReviewStatus?: 'Pending' | 'Approved' | 'Rejected';
  HRReviewDate?: string;
  HRReviewBy?: string;
  HRComments?: string;

  GMApprovalStatus?: 'Pending' | 'Approved' | 'Rejected';
  GMApprovalDate?: string;
  GMApprovalBy?: string;
  GMComments?: string;
}

/**
 * LVE - Leave Application Form
 */
export interface LVEFormData extends MainDBHRBase {
  FormType: 'LVE';

  /** Leave details */
  LeaveType: 'Annual' | 'Sick' | 'Emergency' | 'Unpaid' | 'Maternity' | 'Paternity' | 'Compassionate' | 'Study' | 'Other';
  StartDate: string;
  EndDate: string;
  TotalDays: number;

  /** Half-day options */
  IsHalfDay?: boolean;
  HalfDayType?: 'AM' | 'PM';

  /** Reason */
  Reason?: string;

  /** Contact during leave */
  ContactNumber?: string;
  EmergencyContact?: string;

  /** Approval */
  ManagerApprovalStatus?: 'Pending' | 'Approved' | 'Rejected';
  ManagerApprovalDate?: string;
  ManagerApprovalBy?: string;
  ManagerComments?: string;

  HRProcessingStatus?: 'Pending' | 'Processed';
  HRProcessedDate?: string;
  HRProcessedBy?: string;
}

/**
 * PAF - Personnel Action Form
 */
export interface PAFFormData extends MainDBHRBase {
  FormType: 'PAF';

  /** Employee info */
  EmployeeID: string;
  EmployeeName: string;
  CurrentPosition: string;
  CurrentDepartment: string;
  CurrentGrade?: string;

  /** Action type */
  ActionType: 'Promotion' | 'Transfer' | 'Salary Adjustment' | 'Demotion' | 'Reclassification' | 'Other';

  /** New position details */
  NewPosition?: string;
  NewDepartment?: string;
  NewGrade?: string;
  NewSalary?: number;

  /** Effective date */
  EffectiveDate: string;

  /** Justification */
  Justification: string;

  /** Multi-level approval */
  HODApprovalStatus?: 'Pending' | 'Approved' | 'Rejected';
  HODApprovalDate?: string;
  HODApprovalBy?: string;

  HRReviewStatus?: 'Pending' | 'Approved' | 'Rejected';
  HRReviewDate?: string;
  HRReviewBy?: string;

  GMApprovalStatus?: 'Pending' | 'Approved' | 'Rejected';
  GMApprovalDate?: string;
  GMApprovalBy?: string;
}

/**
 * EEN - Employee Exit Notice
 */
export interface EENFormData extends MainDBHRBase {
  FormType: 'EEN';

  /** Employee info */
  EmployeeID: string;
  EmployeeName: string;
  Position: string;
  JoinDate: string;

  /** Exit details */
  ExitType: 'Resignation' | 'Retirement' | 'Termination' | 'Contract End' | 'Mutual Separation';
  LastWorkingDate: string;
  NoticePeriod: number;

  /** Reason */
  ReasonForLeaving?: string;
  ExitInterviewCompleted?: boolean;

  /** Clearance */
  ClearanceStatus?: 'Pending' | 'In Progress' | 'Completed';

  /** Acknowledgement */
  HODAcknowledgementDate?: string;
  HODAcknowledgedBy?: string;

  HRProcessingStatus?: 'Pending' | 'Processed';
  HRProcessedDate?: string;
  HRProcessedBy?: string;
}

/**
 * HEALTHINFO - Health Information Form
 */
export interface HEALTHINFOFormData extends MainDBHRBase {
  FormType: 'HEALTHINFO';

  /** Employee info */
  EmployeeID: string;
  EmployeeName: string;

  /** Health details */
  BloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  HasAllergies: boolean;
  AllergyDetails?: string;
  HasChronicCondition: boolean;
  ChronicConditionDetails?: string;

  /** Emergency info */
  EmergencyContactName: string;
  EmergencyContactPhone: string;
  EmergencyContactRelationship: string;

  /** Medical history */
  LastMedicalCheckup?: string;
  DoctorName?: string;
  DoctorContact?: string;
}

/**
 * BSD - Backup Staff Declaration
 */
export interface BSDFormData extends MainDBHRBase {
  FormType: 'BSD';

  /** Position being backed up */
  PositionTitle: string;
  PositionHolder: string;
  PositionHolderID?: string;

  /** Declaration period */
  EffectiveFrom: string;
  EffectiveTo?: string;

  /** Approval */
  HODReviewStatus?: 'Pending' | 'Approved' | 'Rejected';
  HODReviewDate?: string;
  HODReviewBy?: string;

  HRApprovalStatus?: 'Pending' | 'Approved' | 'Rejected';
  HRApprovalDate?: string;
  HRApprovalBy?: string;
}

// =============================================================================
// WORKFLOW HELPERS
// =============================================================================

/**
 * HR Workflow Stage definition
 */
export interface HRWorkflowStage {
  id: string;
  name: string;
  order: number;
  approverField?: string;
  statusField?: string;
  dateField?: string;
  commentField?: string;
}

/**
 * Form workflow configuration
 */
export interface HRFormWorkflow {
  formCode: HRFormCode;
  formName: string;
  stages: HRWorkflowStage[];
}

/**
 * Standard HR approval workflow stages
 */
export const HR_STANDARD_APPROVAL_STAGES: HRWorkflowStage[] = [
  { id: 'S1', name: 'Submission', order: 1 },
  { id: 'S2', name: 'HOD Approval', order: 2, approverField: 'HODApprovalBy', statusField: 'HODApprovalStatus', dateField: 'HODApprovalDate', commentField: 'HODComments' },
  { id: 'S3', name: 'HR Review', order: 3, approverField: 'HRReviewBy', statusField: 'HRReviewStatus', dateField: 'HRReviewDate', commentField: 'HRComments' },
  { id: 'S4', name: 'GM Approval', order: 4, approverField: 'GMApprovalBy', statusField: 'GMApprovalStatus', dateField: 'GMApprovalDate', commentField: 'GMComments' },
];

/**
 * Leave approval workflow stages
 */
export const HR_LEAVE_APPROVAL_STAGES: HRWorkflowStage[] = [
  { id: 'S1', name: 'Submission', order: 1 },
  { id: 'S2', name: 'Manager Approval', order: 2, approverField: 'ManagerApprovalBy', statusField: 'ManagerApprovalStatus', dateField: 'ManagerApprovalDate', commentField: 'ManagerComments' },
  { id: 'S3', name: 'HR Processing', order: 3, approverField: 'HRProcessedBy', statusField: 'HRProcessingStatus', dateField: 'HRProcessedDate' },
];

// =============================================================================
// CHOICE LISTS
// =============================================================================

export const HR_SITES: HRSite[] = ['PRAI', 'JOHOR'];

export const HR_FORM_CODES: HRFormCode[] = [
  'AWHR', 'BSD', 'CIR', 'CWR', 'DRD', 'EEN', 'EPDU', 'EPHR', 'ESF', 'FTCR', 'FWWPD', 'FWWPE', 'GDSN',
  'HEALTHINFO', 'HRAPR', 'HSE', 'HRINFO', 'INTERN', 'INTERVIEWDB', 'JD', 'LVE', 'MCL',
  'NDF', 'ORGCHART', 'OWP', 'PAF', 'RDWH', 'SR', 'TMPU', 'TNPRA'
];

export const HR_LEAVE_TYPES = [
  { id: 'Annual', name: 'Annual Leave', color: '#0ea5e9' },
  { id: 'Sick', name: 'Sick Leave', color: '#ef4444' },
  { id: 'Emergency', name: 'Emergency Leave', color: '#f59e0b' },
  { id: 'Unpaid', name: 'Unpaid Leave', color: '#6b7280' },
  { id: 'Maternity', name: 'Maternity Leave', color: '#ec4899' },
  { id: 'Paternity', name: 'Paternity Leave', color: '#8b5cf6' },
  { id: 'Compassionate', name: 'Compassionate Leave', color: '#14b8a6' },
  { id: 'Study', name: 'Study Leave', color: '#6366f1' },
  { id: 'Other', name: 'Other Leave', color: '#78716c' },
] as const;

export const HR_DIVISIONS = [
  'Corporate HR',
  'Manufacturing HR',
  'Oleochemical Division',
  'Refinery Division',
  'Plantation Division',
  'Property Division',
  'Other',
] as const;

// GxP classification types
export type GxPClass = 'Non-GxP' | 'Indirect GxP' | 'Direct GxP';
export type DQRequired = 'YES' | 'NO';

export const HR_GXP_CLASSES: GxPClass[] = ['Non-GxP', 'Indirect GxP', 'Direct GxP'];

export const HR_DQ_OPTIONS: DQRequired[] = ['YES', 'NO'];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate HR form reference number (INO)
 */
export function generateHRFormINO(formCode: HRFormCode, site: HRSite): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${formCode}-${site.substring(0, 2)}-${year}${month}-${random}`;
}

/**
 * Generate HR form title
 */
export function generateHRFormTitle(formCode: HRFormCode, ino: string): string {
  return `${formCode}-${ino}`;
}

/**
 * Get form name from code
 */
export function getHRFormName(formCode: HRFormCode): string {
  const formNames: Record<HRFormCode, string> = {
    'AWHR': 'Rest Day & Additional Working Hours Requisition',
    'BSD': 'Backup Staff Declaration',
    'CIR': 'Cafeteria Inspection Database',
    'CWR': 'Contract Worker Request',
    'DRD': 'Duty Roster Database',
    'EEN': 'Employee Exit Notice',
    'EPHR': 'Employee to HR',
    'EPDU': 'Employee Personal Data Update',
    'ESF': 'Employee Status Form',
    'FTCR': 'Fixed Term Contract Renewal',
    'FWWPD': 'Flexible Working/Work Permit (D)',
    'FWWPE': 'Flexible Working/Work Permit Extension',
    'GDSN': 'Group Dependants Scheme Nomination',
    'HEALTHINFO': 'Health Information Form',
    'HRAPR': 'HR Approval Request',
    'HSE': 'Health & Safety Report',
    'HRINFO': 'HR Information',
    'INTERN': 'Internship Application',
    'INTERVIEWDB': 'Interview Database',
    'JD': 'Job Description',
    'LVE': 'Leave Application',
    'MCL': 'Medical Claim',
    'NDF': 'New Document Form',
    'ORGCHART': 'Organization Chart',
    'OWP': 'Overtime Work Permit',
    'PAF': 'Personnel Action Form',
    'RDWH': 'Return to Duty/Work from Home',
    'SR': 'Staff Requisition',
    'TMPU': 'Template Update',
    'TNPRA': 'Training Program Administration',
  };
  return formNames[formCode] || formCode;
}

/**
 * Get workflow stages for a form code
 */
export function getHRFormWorkflowStages(formCode: HRFormCode): HRWorkflowStage[] {
  // Leave forms use leave approval workflow
  if (['LVE', 'OWP', 'FWWPE'].includes(formCode)) {
    return HR_LEAVE_APPROVAL_STAGES;
  }

  // Most forms use standard approval workflow
  return HR_STANDARD_APPROVAL_STAGES;
}

/**
 * Check if current user is approver for given stage
 */
export function isHRStageApprover(
  stage: HRWorkflowStage,
  currentUserId: string,
  formData: MainDBHRBase & Record<string, unknown>
): boolean {
  if (!stage.approverField) return false;
  const approverValue = formData[stage.approverField];
  if (!approverValue) return false;

  // Check if it's a Person field or string
  if (typeof approverValue === 'object' && 'Id' in approverValue) {
    return (approverValue as unknown as PersonOrGroup).Id?.toString() === currentUserId;
  }

  return approverValue === currentUserId;
}
