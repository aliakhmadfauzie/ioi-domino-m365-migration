/**
 * Types Module
 * Re-exports all type definitions
 */

// Platform types - selective to avoid duplicates with admin-config
export type {
  UserRole,
  DepartmentStatus,
  ModuleDefinition,
  FormDefinition,
  DepartmentDefinition,
  NavItem,
  DepartmentNavigation,
  SubmissionStatus,
  FormSubmission,
  KPIData,
  SearchResult,
} from './platform';

// Use SiteCode from platform only
export type { SiteCode } from './platform';

// DepartmentCode from admin-config (primary definition)
export type { DepartmentCode } from './admin-config';

// Admin config types
export type {
  FormRegistryEntry,
  AuditLogEntry,
  SystemSetting,
  WorkflowDefinition,
  ApprovalRoutingRule,
  WorkflowStage,
  UserRoleAssignment,
  ApproverType,
  ActionType,
  EntityType,
  SettingType,
  RoleKey,
  AssignmentScope,
} from './admin-config';

// IT types
export * from './m1-forms';
export * from './m2-forms';
export * from './m2-itssr-types';
export * from './m2-itssr-workflow';
export * from './sap-forms';
export * from './it-approval-workflow';

// HR types
export * from './hr-forms';

// STR types
export * from './str-forms';

// LOG types
export * from './log-forms';