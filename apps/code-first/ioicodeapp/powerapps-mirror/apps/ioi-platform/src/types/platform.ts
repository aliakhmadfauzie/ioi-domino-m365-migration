// Platform Types - IOI Enterprise HR & IT Management Platform

import type { LucideIcon } from 'lucide-react';

// Department Codes - All 23 departments
export type DepartmentCode = 
  | 'IT' | 'HR' | 'PROD' | 'QA' | 'QC' | 'WH' | 'ADMIN' | 'ENG' | 'FIN' | 'LOG'
  | 'MKT' | 'MAINT' | 'POWERBI' | 'PLANT' | 'SAFETY' | 'PURCH' | 'RND' | 'LEGAL'
  | 'ENV' | 'SEC' | 'TRANS' | 'COMM' | 'EXEC';

// User Roles
export type UserRole = 'initiator' | 'manager' | 'approver' | 'admin' | 'viewer';

// Site Codes
export type SiteCode = 'MY-JH' | 'MY-PR';

// Department Status
export type DepartmentStatus = 'active' | 'migration' | 'pending';

// Module Definition
export interface ModuleDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  forms: FormDefinition[];
  roles: UserRole[]; // Which roles can see this module
}

// Form Definition
export interface FormDefinition {
  formCode: string;
  name: string;
  description: string;
  stages: string[];
  isInitialSubmission: boolean; // Only show on module home if true
  roles: UserRole[]; // Which roles can see this form
  conditionalSections?: string[]; // Stage-gated or conditional sections
}

// Department Definition
export interface DepartmentDefinition {
  code: DepartmentCode;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  status: DepartmentStatus;
  modules: ModuleDefinition[];
  sharePointList?: string; // MainDB_IT, MainDB_IT_JHR, MainDB_HR, etc.
}

// Navigation Item
export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
  roles?: UserRole[];
}

// Department Navigation Structure
export interface DepartmentNavigation {
  department: DepartmentCode;
  items: NavItem[];
}

// Submission Status
export type SubmissionStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under_Review' 
  | 'Pending_Approval'
  | 'Approved' 
  | 'Rejected' 
  | 'Returned'
  | 'Completed'
  | 'Archived';

// Form Submission (for display in module home)
export interface FormSubmission {
  id: string;
  title: string;
  formCode: string;
  formName: string;
  submittedBy: string;
  submittedDate: string;
  currentStatus: SubmissionStatus;
  currentStage: string;
  currentApprover?: string;
  site: SiteCode;
  department: DepartmentCode;
}

// KPI Card Data
export interface KPIData {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Search Result
export interface SearchResult {
  id: string;
  type: 'form' | 'submission' | 'module';
  title: string;
  description: string;
  department: DepartmentCode;
  module?: string;
  formCode?: string;
  path: string;
}