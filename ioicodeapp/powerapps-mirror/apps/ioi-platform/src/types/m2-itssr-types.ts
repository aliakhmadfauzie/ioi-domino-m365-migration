/**
 * M2 - IT Support & Service Request (ITSSR) Types
 * Based on Lotus Domino Form: ITSSR
 * 
 * Part 1: Requestor's Section (Company, Service Type, Problem Description)
 * Part 2: IT Section (PENDING), Requestor's Acceptance, Comments
 * 
 * 5-Stage Workflow:
 * S1 Submission -> S2 Triage -> S3 Resolution -> S4 Acceptance -> S5 Closure
 */

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

/**
 * Service Types for IT Support Requests
 * Based on blueprint: Hardware, Software, Network, Email, SAP, Bank, Other
 */
export const ITSSR_SERVICE_TYPES = [
  'Hardware',
  'Software',
  'Network',
  'Email',
  'SAP',
  'Bank',
  'Other',
] as const;

export type ITSSRServiceType = typeof ITSSR_SERVICE_TYPES[number];

/**
 * Hardware items available for selection
 */
export const ITSSR_HARDWARE_ITEMS = [
  'Desktop PC',
  'Laptop',
  'Monitor',
  'Printer',
  'Scanner',
  'UPS',
  'Network Cable',
  'Keyboard',
  'Mouse',
  'Headset',
  'Webcam',
  'External Drive',
  'Docking Station',
  'Other Hardware',
] as const;

export type ITSSRHardwareItem = typeof ITSSR_HARDWARE_ITEMS[number];

/**
 * Applications available for software support
 */
export const ITSSR_APPLICATIONS = [
  'BANK',
  'CITRIX/XENAPP',
  'DASHBOARD',
  'E-TRAINING',
  'ESDE',
  'ESKER AP AUTOMATION',
  'GATEPASS & STORE DO',
  'HCL NOTES',
  'INTERNET',
  'INTRANET',
  'IOI OLEO WEBSITE',
  'LMS',
  'MS EXCEL',
  'MS POWERPOINT',
  'MS WORD',
  'OS',
  'SALES PORTAL',
  'SAP S4/HANA',
  'SAC',
  'VMS',
  'WEIGHING SYSTEM',
  'OTHERS',
] as const;

export type ITSSRApplication = typeof ITSSR_APPLICATIONS[number];

/**
 * SAP Modules for SAP-related requests
 */
export const ITSSR_SAP_MODULES = [
  'ABAP',
  'Authorisation',
  'CO',
  'FI',
  'Logistics',
  'MM-Purchasing',
  'MM-Store',
  'PM',
  'PP-PI Planning',
  'PP-PI Production',
  'QM',
  'SD-Marketing',
  'SD-Shipping',
  'System Administration',
  'WM',
] as const;

export type ITSSRSAPModule = typeof ITSSR_SAP_MODULES[number];

/**
 * Bank Systems/Modules for banking-related requests
 */
export const ITSSR_BANK_MODULES = [
  'Core Banking System',
  'Internet Banking',
  'Mobile Banking',
  'ATM System',
  'Card Management',
  'Loan Management',
  'Treasury System',
  'SWIFT',
  'RTGS/NEFT',
  'Other Bank System',
] as const;

export type ITSSRBankModule = typeof ITSSR_BANK_MODULES[number];

/**
 * Companies in the IOI Group
 */
export const ITSSR_COMPANIES = [
  'IOI Corporation Berhad',
  'IOI Properties Group Berhad',
  'IOI Oleochemical Industries Berhad',
  'IOI Bio-Energy Sdn Bhd',
  'IOI Pan-Century Oleochemicals Sdn Bhd',
  'IOI Pan-Century Edible Oils Sdn Bhd',
  'IOI Acidchem Sdn Bhd',
  'IOI Loders Croklaan',
  'IOI Loders Croklaan Oils',
  'IOI Loders Croklaan Asia',
  'IOI Loders Croklaan Americas',
  'IOI Loders Croklaan Europe',
  'IOI Edible Oils Sdn Bhd',
  'Moolgavkar Oils & Fats SDN BHD',
  'Pamol Plantations Sdn Bhd',
  'Syarikat Peladang Sabah Sdn Bhd',
  'Leepang Enterprise Sdn Bhd',
  'Sakilan Oil Palm Plantation Sdn Bhd',
  'Ladang Sabah Sdn Bhd',
  'Pamol (Sabah) Sdn Bhd',
  'IOI Plantation Sdn Bhd',
  'IOI Plantation Services Sdn Bhd',
  'Mayvin Palm Oil Mill Sdn Bhd',
  'Morisem Palm Oil Mill Sdn Bhd',
  'Unico Trading Sdn Bhd',
  'IOI Management Sdn Bhd',
  'Woodman Enterprise Sdn Bhd',
  'Gohtong Raya Sdn Bhd',
  'Menang Corporation (M) Berhad',
  'Bumiraya Impian Sdn Bhd',
  'Uptown Spring Sdn Bhd',
  'Excellent Bonanza Sdn Bhd',
  'IOI Palm Biotech Sdn Bhd',
  'Mutual Accord Sdn Bhd',
  'IOI Research Centre Sdn Bhd',
  'IOI Refinery Langat Sdn Bhd',
  'Nexsol (M) Sdn Bhd',
  'IOI Pulau Carey Resort Sdn Bhd',
  'Canter Height Sdn Bhd',
  'Other',
] as const;

export type ITSSRCompany = typeof ITSSR_COMPANIES[number];

/**
 * Departments for routing
 */
export const ITSSR_DEPARTMENTS = [
  'Accounting',
  'Administration',
  'Audit',
  'Engineering',
  'Finance',
  'Human Resources',
  'Information Technology',
  'Legal',
  'Logistics',
  'Marketing',
  'Operations',
  'Procurement',
  'Production',
  'Quality Assurance',
  'Research & Development',
  'Sales',
  'Supply Chain',
  'Other',
] as const;

export type ITSSRDepartment = typeof ITSSR_DEPARTMENTS[number];

/**
 * Problem Categories for classification
 */
export const ITSSR_PROBLEM_CATEGORIES = [
  'Hardware Issue',
  'Software Issue',
  'Network Issue',
  'Security Issue',
  'User Error',
  'Configuration',
  'Performance',
  'Data Issue',
  'Integration',
  'Other',
] as const;

export type ITSSRProblemCategory = typeof ITSSR_PROBLEM_CATEGORIES[number];

/**
 * Secondary Problem Categories
 */
export const ITSSR_PROBLEM_CATEGORIES_SECONDARY = [
  'Root Cause - Hardware',
  'Root Cause - Software',
  'Root Cause - Network',
  'Root Cause - User Training',
  'Root Cause - Configuration',
  'Root Cause - Vendor',
  'Root Cause - Unknown',
] as const;

export type ITSSRProblemCategorySecondary = typeof ITSSR_PROBLEM_CATEGORIES_SECONDARY[number];

/**
 * Incident Classifications (Severity Levels)
 * Based on blueprint: High, Medium, Low
 */
export const ITSSR_CLASSIFICATIONS = [
  'High',
  'Medium',
  'Low',
] as const;

export type ITSSRClassification = typeof ITSSR_CLASSIFICATIONS[number];

/**
 * Support Methods
 * Based on blueprint: On-site, Remote, Phone, Email, Others
 */
export const ITSSR_SUPPORT_METHODS = [
  'OnSite',
  'Remote',
  'Phone',
  'Email',
  'Others',
] as const;

export type ITSSRSupportMethod = typeof ITSSR_SUPPORT_METHODS[number];

/**
 * Satisfaction Ratings (1-10 scale)
 */
export const ITSSR_RATING_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Dissatisfied', color: '#dc2626' },
  2: { label: 'Dissatisfied', color: '#dc2626' },
  3: { label: 'Dissatisfied', color: '#dc2626' },
  4: { label: 'Dissatisfied', color: '#dc2626' },
  5: { label: 'Room for Improvement', color: '#f59e0b' },
  6: { label: 'Room for Improvement', color: '#f59e0b' },
  7: { label: 'Room for Improvement', color: '#f59e0b' },
  8: { label: 'Delighted', color: '#16a34a' },
  9: { label: 'Delighted', color: '#16a34a' },
  10: { label: 'Delighted', color: '#16a34a' },
};

/**
 * Priority levels for tickets
 */
export const ITSSR_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Critical',
] as const;

export type ITSSRPriority = typeof ITSSR_PRIORITIES[number];

/**
 * CaseStatus for ITSSR sectional workflow
 * Controls which section can be edited by which role:
 * - Draft: Requestor fills Section 1
 * - Submitted: IT Admin triages and assigns
 * - InProgress: IT PIC resolves
 * - Resolved: Requestor accepts or returns
 * - Accepted: Case closed (all view-only)
 */
/**
 * Case Status for ITSSR workflow
 * Based on blueprint: Draft, Submitted, InProgress, Resolved, Accepted, Closed
 */
export const ITSSR_CASE_STATUSES = [
  'Draft',
  'Submitted',
  'InProgress',
  'Resolved',
  'Accepted',
  'Closed',
  'Denied',
] as const;

export type ITSSRCaseStatus = typeof ITSSR_CASE_STATUSES[number];

/**
 * Legacy ticket statuses (kept for compatibility with other forms)
 */
export const ITSSR_STATUSES = [
  'Draft',
  'Submitted',
  'In Triage',
  'Assigned',
  'In Progress',
  'Pending User',
  'Resolved',
  'Accepted',
  'Closed',
  'Rejected',
  'Denied',
  'Cancelled',
] as const;

export type ITSSRStatus = typeof ITSSR_STATUSES[number];

/**
 * Workflow Stages
 */
export const ITSSR_STAGES = [
  { id: 'S1', label: 'Submission', actor: 'Requestor' },
  { id: 'S2', label: 'Triage', actor: 'IT Helpdesk' },
  { id: 'S3', label: 'Resolution', actor: 'Assigned Technician' },
  { id: 'S4', label: 'Acceptance', actor: 'Requestor' },
  { id: 'S5', label: 'Closure', actor: 'IT Helpdesk' },
] as const;

export type ITSSRStage = typeof ITSSR_STAGES[number]['id'];

// =============================================================================
// FORM TYPES
// =============================================================================

/**
 * Form input for creating/updating ITSSR
 * Maps to Lotus Domino fields from the specification
 */
export interface ITSSRFormInput {
  // Requestor's Section
  Company: string;                    // Requestor's company
  SendTo?: string;                    // Primary mail recipient (IT support team)
  CC?: string;                        // Carbon copy recipients
  ReportedBy?: string;                // Person reporting the issue
  Requestor: string;                  // Requestor identity
  Dept: string;                       // Requestor's department
  ExtNo?: string;                     // Phone extension number
  
  // Service Type & Details (conditional)
  Type: ITSSRServiceType;             // Type of IT service requested
  HWare?: string;                     // Hardware item (when Type = Hardware)
  App?: string;                       // Application (when Type = Software)
  Module?: string;                    // Application module
  SAPModule?: string;                 // SAP module (when App = SAP or Type = SAP)
  BankModule?: string;                // Bank module (when Type = Bank)
  
  // Problem Description
  ProblemDesc: string;                // Detailed description of the problem
  Attach?: string[];                  // File attachments (requestor)
  
  // --- Part 2: IT Section (PENDING) ---
  ITName?: string;                    // IT personnel who handled the request
  Solution?: string;                  // Solution provided by IT team
  Attachment2?: string[];             // File attachments from IT team
  StartDate?: Date;                   // Date IT team started working
  ITRemarks?: string;                 // IT team remarks
  DateNotified?: Date;                // Date IT notified requestor
  ProbCat?: string;                   // Primary problem category
  ProbCat2?: string;                  // Secondary problem category
  Classification?: string;           // Incident classification
  Support?: string;                   // Method of support provided
  DateClosed?: Date;                  // Date case was closed/completed
  CS?: '0' | '1' | '2';               // Domino case sub-status: 0=Rejected, 1=Closed, 2=Pending
  US?: '0' | '1';                     // Domino user sub-status: 0=Returned, 1=Accepted
  
  // --- Part 2: Requestor's Acceptance ---
  DateAccept?: Date;                  // Date requestor accepted resolution
  RatingCom?: number;                 // Satisfaction rating (1-10)
  Comment?: string;                   // Requestor feedback (mandatory if rating < 8)
  
  // --- Part 2: Comments By IT / Notify IT ---
  ITRemark?: string;                  // IT comments section remarks
  datenotify?: Date;                  // Date IT was notified
}

/**
 * Full ITSSR record (includes system fields)
 */
export interface ITSSRRecord extends ITSSRFormInput {
  // System fields
  id: string;                         // Unique record ID
  CaseNo: string;                     // Auto-generated case number (Year-Month-INO)
  DateCreated: Date;                  // Date the request was submitted
  
  // Workflow state
  Stage: ITSSRStage;                  // Current workflow stage
  Status: ITSSRStatus;                // Current status
  Priority?: ITSSRPriority;           // Assigned priority (set during triage)
  
  // Assignment (set during triage - S2)
  AssignedTo?: string;                // Assigned technician ID
  AssignedToName?: string;            // Assigned technician display name
  AssignedDate?: Date;                // Date assigned
  
  // Resolution (S3)
  ResolutionNotes?: string;           // Resolution description
  ResolutionDate?: Date;              // Date resolved
  ResolvedBy?: string;                // Technician who resolved
  ResolvedByName?: string;            // Technician display name
  
  // Acceptance (S4)
  AcceptanceStatus?: 'Accepted' | 'Rejected';
  AcceptanceNotes?: string;           // User feedback
  AcceptedDate?: Date;                // Date accepted/rejected
  
  // Closure (S5)
  ClosedDate?: Date;                  // Date closed
  ClosedBy?: string;                  // Helpdesk person who closed
  ClosedByName?: string;              // Display name
  ClosureNotes?: string;              // Closure notes
  
  // Audit trail
  CreatedBy: string;                  // User ID who created
  CreatedByName: string;              // Display name
  ModifiedDate?: Date;                // Last modified date
  ModifiedBy?: string;                // Last modified by
}

/**
 * Activity log entry for ITSSR
 */
export interface ITSSRActivity {
  id: string;
  ticketId: string;
  action: string;
  description: string;
  performedBy: string;
  performedByName: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Comment/message on an ITSSR ticket
 */
export interface ITSSRComment {
  id: string;
  ticketId: string;
  message: string;
  authorId: string;
  authorName: string;
  isInternal: boolean;                // Internal IT notes vs user-visible
  createdAt: Date;
  attachments?: string[];
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate a case number for ITSSR
 */
export function generateITSSRCaseNo(sequence: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `ITSSR-${year}${month}-${seq}`;
}

/**
 * Get stage details by ID
 */
export function getStageDetails(stageId: ITSSRStage) {
  return ITSSR_STAGES.find(s => s.id === stageId);
}

/**
 * Get status color for badges
 */
export function getStatusColor(status: ITSSRStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'Draft':
      return { bg: 'rgba(92, 92, 92, 0.1)', text: '#5C5C5C', border: '#5C5C5C' };
    case 'Submitted':
    case 'In Triage':
      return { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563eb', border: '#2563eb' };
    case 'Assigned':
    case 'In Progress':
      return { bg: 'rgba(123, 62, 0, 0.1)', text: '#7B3E00', border: '#7B3E00' };
    case 'Pending User':
      return { bg: 'rgba(161, 98, 7, 0.1)', text: '#a16207', border: '#a16207' };
    case 'Resolved':
    case 'Accepted':
    case 'Closed':
      return { bg: 'rgba(22, 101, 52, 0.1)', text: '#166534', border: '#166534' };
    case 'Rejected':
    case 'Denied':
    case 'Cancelled':
      return { bg: 'rgba(155, 47, 35, 0.1)', text: '#9B2F23', border: '#9B2F23' };
    default:
      return { bg: 'rgba(92, 92, 92, 0.1)', text: '#5C5C5C', border: '#5C5C5C' };
  }
}

/**
 * Get priority color for badges
 */
export function getPriorityColor(priority: ITSSRPriority): {
  bg: string;
  text: string;
  border: string;
} {
  switch (priority) {
    case 'Low':
      return { bg: 'rgba(92, 92, 92, 0.1)', text: '#5C5C5C', border: '#5C5C5C' };
    case 'Medium':
      return { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563eb', border: '#2563eb' };
    case 'High':
      return { bg: 'rgba(123, 62, 0, 0.1)', text: '#7B3E00', border: '#7B3E00' };
    case 'Critical':
      return { bg: 'rgba(155, 47, 35, 0.1)', text: '#9B2F23', border: '#9B2F23' };
    default:
      return { bg: 'rgba(92, 92, 92, 0.1)', text: '#5C5C5C', border: '#5C5C5C' };
  }
}
