/**
 * SAP Forms Schema
 * 
 * Forms: SAPAMR, SAPTR, SAPCA, SAPCR, SAPDRP, SAPSLCF, SAPSOF2
 * Site: PRAI (MainDB_IT)
 * 
 * Based on Excel specification for SAP IT Forms
 */

import type { EnvironmentTag } from '@/services/sharepoint-submission-service';

// =============================================================================
// SHARED SAP TYPES
// =============================================================================

export type SAPApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type SAPFormStatus = 'Draft' | 'Submitted' | 'InReview' | 'Completed' | 'Rejected' | 'Closed';
export type SAPPriority = 'Low' | 'Medium' | 'High' | 'Critical';

// =============================================================================
// SAPAMR - SAP AUTHORIZATION MASTER RECORD
// =============================================================================

export type SAPAMRRequestType = 'New' | 'Change' | 'Delete' | 'Copy';

/**
 * SAPAMR workflow states matching Domino AuthMatrixReview.nsf:
 *   Request → Submitted → Verified → Approved / Rejected / Withdrawn
 */
export type SAPAMRCurrentAction = 'Request' | 'Submitted' | 'Verified' | 'Approved' | 'Rejected' | 'Withdrawn';

export interface SAPAMRFormInput {
  // Request Information
  RequestType: SAPAMRRequestType;
  Company: string;
  Requestor: string;
  RequestorEmail: string;
  Department: string;
  
  // User Details
  TargetUserName: string;
  TargetUserID: string;
  TargetUserDepartment: string;
  
  // Authorization Details
  SAPSystem: string;
  SAPClient: string;
  Module: string;
  Plant: string;
  AuthorizationType: string;
  AuthorizationProfile: string;
  RoleDescription: string;
  
  // Routing & Approval
  CC: string;
  TBV: string;           // Verifier (email or name)
  TBVEmail: string;      // Verifier email for routing
  TBA: string;           // BPO/HOD Approver
  TBAEmail: string;      // BPO email for routing
  VerifiedBy: string;
  ApprovedByBPOHOD: string;
  Remarks: string;
  Attachment?: string;
  
  // Withdrawal
  WithdrawnDate?: string;
}

export const SAPAMR_REQUEST_TYPES: SAPAMRRequestType[] = ['New', 'Change', 'Delete', 'Copy'];

export const SAPAMR_SAP_SYSTEMS = [
  'SAP ECC Production',
  'SAP ECC Development',
  'SAP ECC Quality',
  'SAP S/4HANA Production',
  'SAP S/4HANA Quality',
  'SAP BW/BI',
  'SAP GRC',
] as const;

export const SAPAMR_SAP_CLIENTS = [
  '100 - Production',
  '200 - Development',
  '300 - Quality Assurance',
  '400 - Training',
] as const;

export const SAPAMR_AUTH_PROFILES = [
  'SAP_ALL',
  'SAP_NEW',
  'Z_MM_BUYER',
  'Z_FI_USER',
  'Z_SD_USER',
  'Z_PP_USER',
  'Z_HR_USER',
  'Z_QM_USER',
  'Z_PM_USER',
  'Z_WM_USER',
  'Z_DISPLAY_ONLY',
  'Custom Profile',
] as const;

export const SAPAMR_MODULES = [
  'CO',
  'FI-AA',
  'FI-AP',
  'FI-AR',
  'FI-GL',
  'MM-Logistics',
  'MM-Purchasing',
  'MM-Store',
  'MM-Warehouse',
  'PM',
  'PP-Production',
  'PP-Production Planning',
  'QM',
  'SD-Logistics',
  'SD-Marketing',
  'SD-Shipping',
  'SD-Warehouse',
  'WM-Store',
  'WM-Warehouse',
] as const;

export const SAPAMR_PLANTS = [
  '1100 - IOI',
  '1200 - ACM',
  '1201 - AES',
  '1202 - AEC',
  '1203 - ASN',
  '1300 - AUS',
  '1400 - DCM',
  '1500 - POM',
  '1501 - BIO',
  '1600 - ECM',
  '1700 - SCM',
  '1800 - PMS',
  '1801 - PBI',
  '1900 - PJY',
  '2000 - QGS',
  '2140 - PFC',
  '2150 - PAL',
  '2160 - PPL',
  '2170 - DCS',
  '2180 - ASB',
  '2190 - PBT',
  '5102 - PEO Refinery Plant | PCEO',
  '5103 - PEO Consumer Packs Plant | PCP',
  '5200 - POC Plant | PCOC',
  '5201 - POC Soap Noodles Plant | PSN',
  '9120 - PGA',
] as const;

export const SAPAMR_AUTH_TYPES = [
  'User Roles & T-Code assignment',
  'Authorisation Objects',
] as const;

/**
 * SAPAMR workflow state labels for display.
 */
export const SAPAMR_STATE_LABELS: Record<SAPAMRCurrentAction, string> = {
  Request: 'Draft',
  Submitted: 'Pending Verification',
  Verified: 'Pending BPO Approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Withdrawn: 'Withdrawn',
};

/**
 * Terminal states for SAPAMR workflow.
 */
export const SAPAMR_TERMINAL_STATES: SAPAMRCurrentAction[] = ['Approved', 'Rejected', 'Withdrawn'];

/**
 * Active (non-terminal) states for SAPAMR — from these the requestor can withdraw.
 */
export const SAPAMR_ACTIVE_STATES: SAPAMRCurrentAction[] = ['Request', 'Submitted', 'Verified'];

// =============================================================================
// SAPTR - SAP TRANSPORT REQUEST
// =============================================================================

export type SAPTRDevelopmentType = 'New' | 'Modify';
export type SAPTRCurrentAction = 'Requestor' | 'TechnicalLead' | 'BasisTeam' | 'QAApproval' | 'Closed';

export interface SAPTRFormInput {
  // Request Information
  Modules: string[];  // Multi-select checkboxes
  TRCategory: string;  // Single select
  DevelopmentType: SAPTRDevelopmentType;
  Phases: string[];  // Multi-select
  Company: string;
  Requestor: string;
  Department: string;
  
  // Transport Details
  Client: string;  // Conditional based on status
  IssueNumber: string;  // CR/SSR/PRF/SAP Notes Number/UR/Emp Exit/AMS incident
  TransportNumberPackage: string;
  Dependencies: string;
  SAPTcode: string;
  ReportNameProgramNameFioriApps: string;
  ChangesDone: string;
  
  // Approval Chain
  TechnicalLead: string;
  BasisTeamLead: string;
  QAApprover: string;
  CC: string;
  
  // Schedule
  RequestedDate: string;
  Priority: SAPPriority;
  Justification: string;
}

export const SAPTR_MODULES = [
  'BASIS',
  'Controlling',
  'Financials',
  'Logistics/Weighbridge',
  'Materials Management',
  'Plant Maintenance',
  'Production & Planning',
  'Quality Management',
  'Sales & Distribution',
  'SAC',
  'Warehouse Management',
  'Others',
] as const;

export const SAPTR_TR_CATEGORIES = [
  'Authorisation',
  'Development',
  'Config',
  'Master Data',
  'SAP Notes',
  'BRF+',
  'Others',
] as const;

export const SAPTR_PHASES = [
  '1st phase',
  '2nd phase',
  '3rd phase',
  '4th phase',
  '5th phase',
] as const;

export const SAPTR_CLIENT_REQUEST = [
  'IED to IEQ',
  'IED to IEQ to IEP',
  'SAC IEQ to SAC IEP',
] as const;

export const SAPTR_CLIENT_OTHER = [
  'IED to IEQ',
  'IED to IEQ to IEP',
  'IBD to IBQ',
  'IBD to IBQ to IBP',
  'SAC IEQ to SAC IEP',
] as const;

export const SAPTR_DEVELOPMENT_TYPES: SAPTRDevelopmentType[] = ['New', 'Modify'];

// =============================================================================
// SAPCA - SAP CONFIGURATION ACCESS
// =============================================================================

export type SAPCAAccessType = 'Display' | 'Change' | 'Full';
export type SAPCAConfigArea = 'IMG' | 'SPRO' | 'SM30' | 'SM31' | 'Custom';
export type SAPCACurrentAction =
  | 'Request'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn'
  | 'ConfigAccess-Done'
  | 'Reject - Closed'
  | 'Submitted-Closure'
  | 'Completed';

export interface SAPCAFormInput {
  // Request Information
  Modules: string[];  // Multi-select checkboxes
  Client: string;  // Single select
  ClientNumber: string;
  IssueLogSSRPRFSAPNotesNumber: string;
  Company: string;
  Requestor: string;
  Department: string;
  
  // Purpose & Changes
  Purpose: string;
  ChangesToBeDone: string;
  
  // Attachment
  Attachment?: string;
  
  // Approval and routing
  CCFunctionalOwner: string;
  ITAPP: string;
  Transporter: string;
  ITPIC: string;
  Justification: string;
  
  // Auto-generated
  DateSubmitted: string;
}

export const SAPCA_MODULES = [
  'BASIS',
  'BI',
  'Controlling',
  'Financials',
  'Logistics/Weighbridge',
  'Materials Management',
  'Plant Maintenance',
  'Production & Planning',
  'Quality Management',
  'Sales & Distribution',
  'Warehouse Management',
  'Others',
] as const;

export const SAPCA_CLIENTS = [
  'IEQ',
  'IEP',
  'IEP-DR',
  'IBQ',
  'IBP',
] as const;

export const SAPCA_ACCESS_TYPES: SAPCAAccessType[] = ['Display', 'Change', 'Full'];
export const SAPCA_CONFIG_AREAS: SAPCAConfigArea[] = ['IMG', 'SPRO', 'SM30', 'SM31', 'Custom'];

export const SAPCA_SAP_MODULES = [
  'FI - Financial Accounting',
  'CO - Controlling',
  'MM - Materials Management',
  'SD - Sales & Distribution',
  'PP - Production Planning',
  'QM - Quality Management',
  'PM - Plant Maintenance',
  'HR - Human Resources',
  'WM - Warehouse Management',
  'PS - Project System',
  'BASIS - Basis Administration',
] as const;

// =============================================================================
// SAPCR - SAP & WB CHANGE REQUEST
// =============================================================================

export type SAPCRChangeType = 'Standard' | 'Emergency' | 'Normal';
export type SAPCRImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';

/**
 * SAPCR workflow states matching Domino SAPChgRequestForm.nsf:
 *   Request → Submitted → BPOApp → PMApp → SubmittedDetails → PMAppImp → AppFinal / SubmittedApp
 *   Terminal: BPORej, PMRej, AppFinal, SubmittedApp
 */
export type SAPCRCurrentAction =
  | 'Request'
  | 'Submitted'
  | 'BPOApp'
  | 'BPORej'
  | 'PMApp'
  | 'PMRej'
  | 'SubmittedDetails'
  | 'PMAppImp'
  | 'AppFinal'
  | 'SubmittedApp';

export const SAPCR_STATE_LABELS: Record<SAPCRCurrentAction, string> = {
  Request: 'Draft',
  Submitted: 'Pending BPO Approval',
  BPOApp: 'Pending PM Approval',
  BPORej: 'Rejected by BPO',
  PMApp: 'Pending Developer Investigation',
  PMRej: 'Rejected by PM',
  SubmittedDetails: 'Pending PM Impact Analysis',
  PMAppImp: 'Pending Project Director Approval',
  AppFinal: 'Approved — Completed',
  SubmittedApp: 'Resolved',
};

export const SAPCR_TERMINAL_STATES: SAPCRCurrentAction[] = ['BPORej', 'PMRej', 'AppFinal', 'SubmittedApp'];

export interface SAPCRFormInput {
  // Request Information
  ProjectPhase: string;  // 'Go Live & Support' | 'Implementation Phase'
  Division: string[];  // Multi-select
  System: string;  // Single select
  Company: string;
  Requestor: string;
  Department: string;
  
  // Module Selection - 4 Rows with checkbox lists
  ModulesRow1: string[];  // SAP Modules
  ModulesRow2: string[];  // Learning Management System
  ModulesRow3: string[];  // Weighbridge modules
  ModulesRow4: string[];  // Other modules
  
  // Purpose - 2 Rows with checkbox lists
  PurposeRow1: string[];  // SAP Purpose options
  PurposeRow2: string[];  // Other Purpose options
  
  // Technical Details
  ChangeDescription: string;
  BusinessJustification: string;
  TechnicalSpecification: string;
  TestPlan: string;
  RollbackPlan: string;
  
  // Risk Assessment
  RiskAssessment: string;
  MitigationPlan: string;
  
  // Approval Chain
  TechnicalReviewer: string;
  FunctionalApprover: string;
  CABApprover: string;
  
  // Schedule
  RequestedDate: string;
  PlannedStartDate: string;
  PlannedEndDate: string;
  Priority: SAPPriority;
  DowntimeRequired: string;
  EstimatedDowntime: string;
}

export const SAPCR_PROJECT_PHASES = [
  'Go Live & Support',
  'Implementation Phase',
] as const;

export const SAPCR_DIVISIONS = [
  'IOI - 1100', 'ACM - 1200', 'AES - 1201', 'AEC - 1202', 'ASN - 1203',
  'AUS - 1300', 'POM - 1500', 'BIO - 1501', 'ECM - 1600', 'POC - 5200',
  'POC-SN - 5201', 'PEO-REF - 5102', 'PEO-CP - 5103', 'SCM - 1700',
  'PMS - 1800', 'PBI - 1801', 'PJY - 1900', 'QGS - 2000', 'PFC - 2140',
  'PAL - 2150', 'PPL - 2160', 'DCS - 2170', 'ASB - 2180', 'PBT - 2190',
  'PGA - 9120',
] as const;

export const SAPCR_SYSTEMS = [
  'ESKER AP AUTOMATION',
  'SAC',
  'SAP SUCCESSFACTOR',
  'SAP S/4HANA',
  'WEIGHBRIDGE',
] as const;

// Module Row 1 - SAP Modules
export const SAPCR_MODULES_ROW1 = [
  'BASIS', 'Controlling', 'Financials', 'Logistics', 'Materials Management',
  'Plant Maintenance', 'Production & Planning', 'Quality Management',
  'Sales & Distribution', 'Warehouse Management', 'Others',
] as const;

// Module Row 2 - LMS
export const SAPCR_MODULES_ROW2 = [
  'Learning Management System',
] as const;

// Module Row 3 - Weighbridge
export const SAPCR_MODULES_ROW3 = [
  'Purchase', 'Sales', 'Transfer', 'Warehouse Transfer', 'Others Weighing', 'Others',
] as const;

// Module Row 4 - Dashboard/Others
export const SAPCR_MODULES_ROW4 = [
  'Dashboard', 'User Group', 'Vendor Upload', 'Workflow', 'Others',
] as const;

// Purpose Row 1 - SAP Purposes
export const SAPCR_PURPOSE_ROW1 = [
  'Activate Std FIORI Apps', 'Archiving', 'Authorisation', 'Authorisation with Tile/Catalog',
  'BRF+', 'Config', 'Development', 'DRC', 'Reg Access Key', 'SAP Note',
  'Table Maintenance (SM30)', 'Others',
] as const;

// Purpose Row 2 - Other Purposes
export const SAPCR_PURPOSE_ROW2 = [
  'Authorisation', 'Config', 'Dev', 'Others',
] as const;

export const SAPCR_CHANGE_TYPES: SAPCRChangeType[] = ['Standard', 'Emergency', 'Normal'];
export const SAPCR_IMPACT_LEVELS: SAPCRImpactLevel[] = ['Low', 'Medium', 'High', 'Critical'];

export const SAPCR_CHANGE_CATEGORIES = [
  'Configuration Change',
  'Development Change',
  'Infrastructure Change',
  'Security Change',
  'Interface Change',
  'Data Migration',
  'Patch/Upgrade',
] as const;

// =============================================================================
// SAPDRP - SAP DRP PROCEDURES
// =============================================================================

export type SAPDRPRequestType = 'DR Test' | 'DR Drill' | 'DR Activation';
export type SAPDRPCurrentAction = 'Requestor' | 'DRCoordinator' | 'ITSecurity' | 'Closed';

export interface SAPDRPFormInput {
  // Auto-generated timestamps
  Created: string;  // Auto-populate on form creation
  Modified: string;  // Auto-populate on form modification
  Distributed: string;  // Auto-populate when distributed
  
  // Request Information
  Subject: string;
  Category: string;  // Auto-show 'DRP Procedure'
  EffectiveDate: string;
  Revision: string;
  Department: string;
  Team: string;  // Single select: Inbound Team, Outbound Team, Maintenance Team, Risk Management Team, ISG, HR Team
  TeamLeaderOf: string;  // Single select: Inbound, Outbound
  HeadOfDepartment: string;  // UserPicker
  
  // Document
  Body: string;  // File upload
  Comments: string;
  
  // Verification (auto-generated)
  VerifiedBy: string;  // Auto-populate with verifier identity
  DateVerified: string;  // Auto-populate with timestamp
}

export const SAPDRP_TEAMS = [
  'Inbound Team',
  'Outbound Team',
  'Maintenance Team',
  'Risk Management Team',
  'ISG',
  'HR Team',
] as const;

export const SAPDRP_TEAM_LEADER_OF = [
  'Inbound',
  'Outbound',
] as const;

// =============================================================================
// SAPSLCF - STORAGE LOCATION CREATION FORM
// =============================================================================

export type SAPSLCFLocationType = 'Standard' | 'Blocked Stock' | 'Quality Inspection' | 'Production' | 'Consignment';
export type SAPSLCFCurrentAction = 'Requestor' | 'WarehouseManager' | 'MMMasterData' | 'Closed';

export interface SAPSLCFFormInput {
  // Auto-generated fields
  RequestorNo: string;  // Format: Year-Month-Number
  RequestBy: string;  // Auto-populate with logged-in user
  DateSubmitted: string;  // Auto-populate on submission
  
  // Request Information
  Designation: string;
  Department: string;
  PhoneExtension: string;
  DepartmentSectionHead: string;  // UserPicker
  
  // Location Details
  PlantCode: string;
  StorageLocationCode: string;
  ExtendedToMaterialCode: string;  // e.g., 10000400, 13000013
  TankIncludedForUllageStockTake: string;
  
  // Additional
  Remarks: string;
  Attachment?: string;
}

export const SAPSLCF_LOCATION_TYPES: SAPSLCFLocationType[] = ['Standard', 'Blocked Stock', 'Quality Inspection', 'Production', 'Consignment'];

export const SAPSLCF_PLANTS = [
  'PROI - IOI Prai',
  'PASS - IOI Pasir Gudang',
  'SBAH - IOI Sandakan',
  'LHDN - IOI Lahad Datu',
  'JOHO - IOI Johor',
] as const;

// =============================================================================
// SAPSOF2 - SAP UAT SIGN-OFF FORM (INTEGRATED)
// Based on detailed blueprint specifications
// =============================================================================

// Workflow Stages
export type SAPSOF2Stage = 'Draft' | 'KeyUserSignoff' | 'BPOApproval' | 'FinalReview' | 'Closed';
export type SAPSOF2Status = 'Draft' | 'Submitted' | 'InProgress' | 'Approved' | 'Rejected' | 'Closed';
export type SAPSOF2FinalDecision = 'Approved' | 'Rejected';
export type SAPSOF2TestResult = 'Pass' | 'Pass with Comments' | 'Fail' | 'Not Tested';
export type SAPSOF2ApprovalStage = 'KeyUser' | 'BPO' | 'FinalIT';
export type SAPSOF2ApprovalDecision = 'Pending' | 'Approved' | 'Rejected';
export type SAPSOF2SlotLock = 'Open' | 'Locked';
export type SAPSOF2PassFail = 'Pass' | 'Fail';

// Key User Slots (KU1-KU5)
export const SAPSOF2_KEY_USER_SLOTS = ['KU1', 'KU2', 'KU3', 'KU4', 'KU5'] as const;
export type SAPSOF2KeyUserSlot = typeof SAPSOF2_KEY_USER_SLOTS[number];

// BPO Slots (BPO1-BPO3)
export const SAPSOF2_BPO_SLOTS = ['BPO1', 'BPO2', 'BPO3'] as const;
export type SAPSOF2BPOSlot = typeof SAPSOF2_BPO_SLOTS[number];

// Child Table A: Approval Records (Key Users + BPO)
export interface SAPSOF2ApprovalRecord {
  id: string;
  parentId: string; // Link to main form
  stage: SAPSOF2ApprovalStage;
  slotNumber: SAPSOF2KeyUserSlot | SAPSOF2BPOSlot | 'FinalIT';
  approverEmail: string;
  approverName: string;
  decision: SAPSOF2ApprovalDecision;
  decisionDate?: string;
  remarks?: string;
  attachmentUrl?: string;
  lockStatus: SAPSOF2SlotLock;
}

// Child Table B: Test Evidence (per Key User scenario)
export interface SAPSOF2TestEvidence {
  id: string;
  parentId: string; // Link to main form
  scenarioNumber: number;
  businessScenarioDescription: string;
  tCode: string;
  testParameters: string;
  expectedResult: string;
  actualResult: string;
  testerEmail: string;
  testerName: string;
  passFail: SAPSOF2PassFail;
  evidenceAttachmentUrl?: string;
}

// Main Form Input
export interface SAPSOF2FormInput {
  // === Basic SAP UAT Sign-Off Information ===
  client: string; // SAP Client (IEQ, IED, IEP, etc.)
  clientNumber: string; // Client ID number
  plant: string; // Site (Prai, etc.)
  moduleName: string; // SAP module being tested
  referenceName?: string; // Link to SSR/CR/PRF if relevant
  trNumber: string; // Transport Request Number
  itRemarks?: string; // Notes from IT
  itPackageAttachmentUrl?: string; // Link to package or evidence
  
  // === People Fields ===
  itFunctionalOwnerEmail: string; // IT person submitting the UAT package
  itFunctionalOwnerName: string;
  ccEmail?: string; // People who should receive notifications
  finalDecisionByEmail?: string; // IT admin who closes the form
  finalDecisionByName?: string;
  
  // === Workflow Fields ===
  currentStage: SAPSOF2Stage;
  status: SAPSOF2Status;
  isBPORequired: boolean; // Auto-calculated based on whether BPO slots are filled
  finalDecision?: SAPSOF2FinalDecision;
  submissionDate?: string;
  finalDecisionDate?: string;
  workflowAuditJson?: string; // Internal log for troubleshooting
  
  // === Key User Slots (KU1-KU5) ===
  keyUser1Email?: string;
  keyUser1Name?: string;
  keyUser2Email?: string;
  keyUser2Name?: string;
  keyUser3Email?: string;
  keyUser3Name?: string;
  keyUser4Email?: string;
  keyUser4Name?: string;
  keyUser5Email?: string;
  keyUser5Name?: string;
  
  // === BPO Slots (BPO1-BPO3) - Optional ===
  bpo1Email?: string;
  bpo1Name?: string;
  bpo2Email?: string;
  bpo2Name?: string;
  bpo3Email?: string;
  bpo3Name?: string;
}

// Full Form Data with Child Tables
export interface SAPSOF2FormData extends SAPSOF2FormInput {
  id: string;
  formCode: 'SAPSOF2';
  title: string; // Auto-generated ticket ID
  createdDate: string;
  createdByEmail: string;
  createdByName: string;
  modifiedDate?: string;
  approvalRecords: SAPSOF2ApprovalRecord[];
  testEvidence: SAPSOF2TestEvidence[];
}

// Dropdown Constants
export const SAPSOF2_STAGES: SAPSOF2Stage[] = ['Draft', 'KeyUserSignoff', 'BPOApproval', 'FinalReview', 'Closed'];
export const SAPSOF2_STATUSES: SAPSOF2Status[] = ['Draft', 'Submitted', 'InProgress', 'Approved', 'Rejected', 'Closed'];
export const SAPSOF2_FINAL_DECISIONS: SAPSOF2FinalDecision[] = ['Approved', 'Rejected'];
export const SAPSOF2_TEST_RESULTS: SAPSOF2TestResult[] = ['Pass', 'Pass with Comments', 'Fail', 'Not Tested'];
export const SAPSOF2_APPROVAL_STAGES: SAPSOF2ApprovalStage[] = ['KeyUser', 'BPO', 'FinalIT'];
export const SAPSOF2_PASS_FAIL: SAPSOF2PassFail[] = ['Pass', 'Fail'];

export const SAPSOF2_CLIENTS = [
  'IEQ',
  'IED', 
  'IEP',
  'IBD',
  'IBQ',
  'IBP',
] as const;

export const SAPSOF2_PLANTS = [
  '1100 - IOI Plant',
  '1200 - ACM Plant',
  '1201 - AES Plant',
  '1202 - AEC Plant',
  '1203 - ASN Plant',
  '1300 - AUS Plant',
  '1400 - DCM Plant',
  '1500 - POM Plant',
  '1501 - BIO',
  '1600 - ECM Plant',
  '1700 - SCM',
  '1800 - PMS',
  '1801 - PBI',
  '1900 - PJY',
  '2000 - QGS',
  '2140 - PFC',
  '2150 - PAL',
  '2160 - PPL',
  '2170 - DCS',
  '2180 - ASB',
  '2190 - PBT',
  '5102 - PEO Refinery Plant | PCEO',
  '5103 - PEO Consumer Packs Plant',
  '5200 - POC Plant',
  '5201 - POC Soap Noodles Plant | PCOC',
  '9120 - PGA',
] as const;

export const SAPSOF2_MODULES = [
  'CO',
  'FI-AA',
  'FI-AP',
  'FI-AR',
  'FI-GL',
  'MM-Logistics',
  'MM-Purchasing',
  'MM-Store',
  'MM-Warehouse',
  'PM',
  'PP-Production',
  'PP-Production Planning',
  'QM',
  'SAC',
  'SD-Logistics',
  'SD-Marketing',
  'SD-Shipping',
  'SD-Warehouse',
  'WM-Store',
  'WM-Warehouse',
] as const;

// Helper function to check if BPO is required
export function isBPORequired(form: SAPSOF2FormInput): boolean {
  return !!(form.bpo1Email || form.bpo2Email || form.bpo3Email);
}

// Helper to generate form title
export function generateSAPSOF2Title(sequence: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `SAPSOF2-${year}${month}-${seq}`;
}

// =============================================================================
// SHARED CONSTANTS
// =============================================================================

export const SAP_COMPANIES = [
  'IOI Corporation Berhad',
  'IOI Oleochemical Industries Berhad',
  'IOI Acidchem Sdn Bhd',
  'IOI Pan-Century Oleochemicals Sdn Bhd',
  'IOI Pan-Century Edible Oils Sdn Bhd',
  'Loders Croklaan Asia Pacific Sdn Bhd',
  'IOI Bio-Energy Sdn Bhd',
] as const;

export const SAP_DEPARTMENTS = [
  'Information Technology',
  'Finance',
  'Human Resources',
  'Production',
  'Quality Assurance',
  'Supply Chain',
  'Procurement',
  'Sales & Distribution',
  'Warehouse',
  'Engineering',
  'Plant Operations',
  'Management',
] as const;

export const SAP_PRIORITIES: SAPPriority[] = ['Low', 'Medium', 'High', 'Critical'];
