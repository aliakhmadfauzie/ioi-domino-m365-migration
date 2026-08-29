// Admin Configuration Types for Global Administrator System

export type ApproverType = 'SPECIFIC_USER' | 'ROLE' | 'MANAGER' | 'DEPARTMENT_HEAD' | 'MANUAL_ASSIGN';
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'ACTIVATE' | 'DEACTIVATE';
export type EntityType = 'ROUTING' | 'WORKFLOW' | 'FORM' | 'SETTING' | 'ROLE';
export type SettingType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
export type RoleKey = 'admin' | 'dept_admin' | 'approver' | 'manager' | 'initiator' | 'viewer';
export type AssignmentScope = 'GLOBAL' | 'DEPARTMENT' | 'MODULE';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
export type RouteAccessLevel = 'PUBLIC' | 'AUTHENTICATED' | 'ROLE_RESTRICTED' | 'DEPARTMENT_ONLY';
export type ModuleKey = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'ADMIN' | 'DASHBOARD' | 'REPORTS';

// Department codes used across the platform
export const DEPARTMENT_CODES = [
  'IT', 'HR', 'STR', 'QA', 'QC', 'SHE', 'FIN', 'PRD', 'PUR', 'ADM', 'MTR', 'GOV', 'LOG'
] as const;
export type DepartmentCode = typeof DEPARTMENT_CODES[number];

export const DEPARTMENT_LABELS: Record<DepartmentCode, string> = {
  IT: 'Information Technology',
  HR: 'Human Resources',
  STR: 'Stores',
  QA: 'Quality Assurance',
  QC: 'Quality Control',
  SHE: 'Safety, Health & Environment',
  FIN: 'Finance',
  PRD: 'Production',
  PUR: 'Procurement',
  ADM: 'Administration',
  MTR: 'Maintenance',
  GOV: 'Governance',
  LOG: 'Logistics',
};

// Approval Routing Rule
export interface ApprovalRoutingRule {
  id: string;
  title: string;
  formCode: string;
  departmentCode: DepartmentCode;
  stageNumber: number;
  stageName: string;
  approverType: ApproverType;
  approverId?: string;
  approverEmail?: string;
  approverName?: string;
  roleKey?: RoleKey;
  escalationDays?: number;
  escalationApproverId?: string;
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  priority: number;
  conditionsJson?: string;
  createdBy?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// Workflow Definition
export interface WorkflowStage {
  stageNumber: number;
  stageName: string;
  approverType: ApproverType;
  roleKey?: RoleKey;
  escalationDays: number;
  actions: string[];
}

export interface WorkflowDefinition {
  id: string;
  title: string;
  workflowCode: string;
  departmentCode?: DepartmentCode;
  description?: string;
  stages: WorkflowStage[];
  isActive: boolean;
  version: number;
  createdBy?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// Form Registry
export interface FormRegistryEntry {
  id: string;
  title: string;
  formCode: string;
  departmentCode: DepartmentCode;
  category?: string;
  workflowCode?: string;
  isActive: boolean;
  requiresAttachment: boolean;
  autoAssignApprover: boolean;
  // Manual Assign fields - when autoAssignApprover is false
  manualAssignedApproverId?: string;
  manualAssignedApproverEmail?: string;
  manualAssignedApproverName?: string;
  notificationTemplate?: string;
  retentionDays?: number;
  description?: string;
  createdBy?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// User Role Assignment
export interface UserRoleAssignment {
  id: string;
  title: string;
  userPrincipalName: string;
  userName?: string;
  roleKey: RoleKey;
  assignmentScope: AssignmentScope;
  departmentCodeScope?: DepartmentCode;
  moduleKeyScope?: string;
  isActive: boolean;
  notes?: string;
  createdBy?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// System Setting
export interface SystemSetting {
  id: string;
  title: string;
  settingKey: string;
  settingValue: string;
  settingType: SettingType;
  category: string;
  description?: string;
  isEditable: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  title: string;
  entityType: EntityType;
  entityId: string;
  action: ActionType;
  changedBy: string;
  changedByEmail: string;
  timestamp: string;
  beforeJson?: string;
  afterJson?: string;
  changeDescription?: string;
}

// Role definitions for display
export const ROLE_LABELS: Record<RoleKey, string> = {
  admin: 'Platform Administrator',
  dept_admin: 'Department Administrator',
  approver: 'Approver',
  manager: 'Manager',
  initiator: 'Initiator (Employee)',
  viewer: 'Viewer (Read-Only)',
};

export const APPROVER_TYPE_LABELS: Record<ApproverType, string> = {
  SPECIFIC_USER: 'Specific User',
  ROLE: 'Role-Based',
  MANAGER: 'Direct Manager',
  DEPARTMENT_HEAD: 'Department Head',
  MANUAL_ASSIGN: 'Manual Assign',
};

// =============================================================================
// USER PROFILE MANAGEMENT
// =============================================================================

export interface UserProfile {
  id: string;
  userId: string; // Office 365 Object ID
  email: string;
  displayName: string;
  employeeId?: string;
  department: DepartmentCode;
  site: 'PRAI' | 'JHR' | 'HQ';
  phone?: string;
  managerId?: string;
  managerEmail?: string;
  managerName?: string;
  profilePhoto?: string;
  status: UserStatus;
  jobTitle?: string;
  hireDate?: string;
  lastLoginDate?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  PENDING: 'Pending Activation',
};

export const SITE_LABELS: Record<'PRAI' | 'JHR' | 'HQ', string> = {
  PRAI: 'Prai Plant',
  JHR: 'Johor Plant',
  HQ: 'Head Office',
};

// =============================================================================
// ROUTE PERMISSIONS MANAGEMENT
// =============================================================================

export interface RoutePermission {
  id: string;
  routePath: string;
  routeName: string;
  department?: DepartmentCode;
  moduleKey?: ModuleKey;
  allowedRoles: RoleKey[];
  accessLevel: RouteAccessLevel;
  requiresAuth: boolean;
  redirectPath?: string;
  description?: string;
  isActive: boolean;
  priority: number;
  createdBy?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export const ROUTE_ACCESS_LABELS: Record<RouteAccessLevel, string> = {
  PUBLIC: 'Public (No Auth)',
  AUTHENTICATED: 'Authenticated Users',
  ROLE_RESTRICTED: 'Role Restricted',
  DEPARTMENT_ONLY: 'Department Only',
};

export const MODULE_LABELS: Record<ModuleKey, string> = {
  M1: 'Module 1 - Forms',
  M2: 'Module 2 - Workflows',
  M3: 'Module 3 - Reports',
  M4: 'Module 4 - Analytics',
  M5: 'Module 5 - Maintenance',
  M6: 'Module 6 - Quality',
  ADMIN: 'Admin Panel',
  DASHBOARD: 'Dashboard',
  REPORTS: 'Reports Center',
};

// =============================================================================
// ENHANCED SYSTEM SETTINGS
// =============================================================================

export type SettingCategory = 'GENERAL' | 'WORKFLOW' | 'NOTIFICATION' | 'SECURITY' | 'UI' | 'INTEGRATION';

export interface EnhancedSystemSetting extends SystemSetting {
  settingCategory: SettingCategory;
  validationRule?: string;
  defaultValue?: string;
  lastResetDate?: string;
  resetBy?: string;
}

export const SETTING_CATEGORY_LABELS: Record<SettingCategory, string> = {
  GENERAL: 'General Settings',
  WORKFLOW: 'Workflow Configuration',
  NOTIFICATION: 'Notifications',
  SECURITY: 'Security & Access',
  UI: 'User Interface',
  INTEGRATION: 'Integrations',
};