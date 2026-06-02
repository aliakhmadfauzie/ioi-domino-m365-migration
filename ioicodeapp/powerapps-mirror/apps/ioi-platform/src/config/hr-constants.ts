// HR Constants - Shared across all HR pages
// Based on Section 4: MainDB_HR Shared Schema

import type { HRFormCode, HRCurrentStatus } from '@/types/hr-forms';

/**
 * Form code to human-readable name mapping
 * Includes all 28 HR form codes
 */
export const HR_FORM_NAMES: Record<HRFormCode, string> = {
  AWHR: 'Rest Day & Additional Working Hours Requisition',
  BSD: 'Backup Staff Designation',
  CIR: 'Cafeteria Inspection Database',
  CWR: 'Contract Worker Requisition',
  DRD: 'Duty Roster Database',
  EEN: 'Employee Exit Notice',
  EPDU: 'Employee Personal Data Update',
  EPHR: 'Employee Personal HR',
  ESF: 'Employee Status Form',
  FTCR: 'Fixed Term Contract Renewal',
  FWWPD: 'Flexible Work Week Policy Daily',
  FWWPE: 'Flexible Work Week Policy Exception',
  GDSN: 'General Disciplinary Notice',
  HEALTHINFO: 'Health Information',
  HRAPR: 'HR Approval Request',
  HSE: 'Health & Safety Report',
  HRINFO: 'HR Information Request',
  INTERN: 'Intern Requisition',
  INTERVIEWDB: 'Interview Database',
  JD: 'Job Description',
  LVE: 'Leave Application',
  MCL: 'Medical Claim',
  NDF: 'Non-conformance & Disciplinary Finding',
  ORGCHART: 'Organization Chart Update',
  OWP: 'Overtime Work Permit',
  PAF: 'Performance Appraisal Form',
  RDWH: 'Remote/Distance Work from Home',
  SR: 'Staff Requisition',
  TMPU: 'Talent Management & Planning Update',
  TNPRA: 'Training & NPRA Assessment',
};

/**
 * Status configuration with styling - Using semantic tokens
 * Based on Section 4 CurrentStatus choices
 */
export const HR_STATUS_CONFIG: Record<HRCurrentStatus, { label: string; color: string; bgColor: string }> = {
  Draft: { label: 'Draft', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  Submitted: { label: 'Submitted', color: 'text-primary', bgColor: 'bg-primary/10' },
  EndorsedHOD: { label: 'Endorsed (HOD)', color: 'text-secondary-foreground', bgColor: 'bg-secondary' },
  ApprovedHR: { label: 'Approved (HR)', color: 'text-secondary-foreground', bgColor: 'bg-secondary' },
  ApprovedCOO: { label: 'Approved (COO)', color: 'text-primary-foreground', bgColor: 'bg-primary' },
  ApprovedED: { label: 'Approved (ED)', color: 'text-primary-foreground', bgColor: 'bg-primary' },
  Rejected: { label: 'Rejected', color: 'text-destructive-foreground', bgColor: 'bg-destructive' },
  Returned: { label: 'Returned', color: 'text-accent-foreground', bgColor: 'bg-accent' },
  Closed: { label: 'Closed', color: 'text-muted-foreground', bgColor: 'bg-muted' },
};

/**
 * Alias for HR_STATUS_CONFIG - used by some pages
 */
export const HR_STATUSES = HR_STATUS_CONFIG;

/**
 * Get status info with fallback for unknown statuses
 */
export function getStatusInfo(status: string | undefined): { label: string; color: string; bgColor: string } {
  if (!status) return { label: 'Unknown', color: 'text-muted-foreground', bgColor: 'bg-muted' };
  
  // Check if it's a known status
  if (status in HR_STATUS_CONFIG) {
    return HR_STATUS_CONFIG[status as HRCurrentStatus];
  }
  
  // Legacy status mapping
  const legacyMapping: Record<string, HRCurrentStatus> = {
    'Pending Approval': 'Submitted',
    'Approved': 'ApprovedHR',
    'Completed': 'Closed',
    'Cancelled': 'Rejected',
  };
  
  if (status in legacyMapping) {
    return HR_STATUS_CONFIG[legacyMapping[status]];
  }
  
  return { label: status, color: 'text-muted-foreground', bgColor: 'bg-muted' };
}

/**
 * Check if status is a pending status
 */
export function isPendingStatus(status: string | undefined): boolean {
  if (!status) return false;
  return ['Submitted', 'EndorsedHOD', 'Pending Approval'].includes(status);
}

/**
 * Check if status is a completed status
 */
export function isCompletedStatus(status: string | undefined): boolean {
  if (!status) return false;
  return ['ApprovedHR', 'ApprovedCOO', 'ApprovedED', 'Approved', 'Completed', 'Closed'].includes(status);
}

/**
 * Get status styling
 */
export function getStatusStyle(status: string | undefined): { color: string; bgColor: string } {
  const info = getStatusInfo(status);
  return { color: info.color, bgColor: info.bgColor };
}

/**
 * HR Module definitions with associated form codes
 */
export const HR_MODULES = [
  {
    code: 'M1',
    name: 'Recruitment & Staffing',
    description: 'Staff requisitions, interviews, and hiring',
    forms: ['SR', 'CWR', 'FTCR', 'INTERVIEWDB', 'JD', 'INTERN'] as HRFormCode[],
  },
  {
    code: 'M2',
    name: 'Leave & Attendance',
    description: 'Leave applications and work arrangements',
    forms: ['LVE', 'OWP', 'FWWPE', 'FWWPD', 'AWHR'] as HRFormCode[],
  },
  {
    code: 'M3',
    name: 'Health & Safety',
    description: 'Health records and safety compliance',
    forms: ['HEALTHINFO', 'HSE', 'MCL', 'TNPRA', 'CIR'] as HRFormCode[],
  },
  {
    code: 'M4',
    name: 'Performance & Development',
    description: 'Appraisals and talent management',
    forms: ['PAF', 'TMPU', 'HRAPR'] as HRFormCode[],
  },
  {
    code: 'M5',
    name: 'Employee Records',
    description: 'Personal data and employee information',
    forms: ['EPDU', 'EPHR', 'HRINFO', 'ESF', 'BSD'] as HRFormCode[],
  },
  {
    code: 'M6',
    name: 'Administration',
    description: 'Org charts, documents, and compliance',
    forms: ['ORGCHART', 'DRD', 'NDF', 'GDSN', 'EEN', 'RDWH'] as HRFormCode[],
  },
];

/**
 * HR Sites (PRAI and JOHOR)
 */
export const HR_SITES = ['PRAI', 'JOHOR'] as const;

/**
 * HR Divisions
 */
export const HR_DIVISIONS = [
  'Corporate HR',
  'Operations',
  'Finance',
  'IT',
  'Manufacturing',
  'Quality Assurance',
  'Research & Development',
  'Supply Chain',
  'Sales & Marketing',
  'Administration',
];

/**
 * Environment tags
 */
export const HR_ENVIRONMENTS = ['DEV', 'TEST', 'PROD'] as const;

/**
 * GxP Classification options
 */
export const HR_GXP_CLASSES = ['Non-GxP', 'Indirect GxP', 'Direct GxP'] as const;

/**
 * DQ Required options
 */
export const HR_DQ_OPTIONS = ['YES', 'NO'] as const;

/**
 * Branding constants per blueprint - Using CSS variables
 */
export const HR_BRAND = {
  primary: 'hsl(var(--primary))',
  light: 'hsl(var(--primary) / 0.1)',
  fontFamily: 'inherit',
};
