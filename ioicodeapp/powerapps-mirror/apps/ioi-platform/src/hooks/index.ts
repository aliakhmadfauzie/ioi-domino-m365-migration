/**
 * Hooks Module
 * Re-exports all hooks
 */

// User & auth
export { useUser } from './use-user';
export { useCurrentRole } from './use-current-role';
export { useAutoRole } from './use-auto-role';

// Platform
export {
  useCurrentDepartment,
  useRoleAccess,
  useLogout,
  usePermissions,
  useDepartmentNavigation,
  useGlobalSearch,
} from './use-platform';

// Workflow
export { useWorkflowEngine } from './use-workflow-engine';
export { useApprovalWorkflow, useApprovalDashboard } from './use-approval-workflow';
export { useFormApprovers, useApprovalMatrix, useSiteRouting, useUserRolePermissions } from './use-approver-matrix';
export { useFormApprover } from './use-form-approver';

// Notifications & email
export { useEmailNotification } from './use-email-notification';
export { useSendEmail } from './use-send-email';
export { useRealtimeNotifications, default as useNotificationBadge } from './use-realtime-notifications';

// ITSSR
export { useITSSRWorkflow } from './use-itssr-workflow';
export { useITSSRRouting } from './use-itssr-routing';

// NIR
export { useNIRWorkflow, parseNIRRecord, getNIRStateLabel, getNIRStateColor } from './use-nir-workflow';

// PRF
export { usePRFWorkflow } from './use-prf-workflow';

// Admin
export { useFormRegistry, useApprovalRouting, useWorkflowDefinitions, useUserRoleAssignments, useSystemSettings, useAdminStats, useAdminActiveTab, useAuditLog } from './use-admin-config';
export { useAdminConfigSharePoint, useUserRoleAssignmentsSharePoint, useAuditLogSharePoint } from './use-admin-sharepoint';

// HR
export { useMainDBHR, useCreateMainDBHR, useUpdateMainDBHR, useDeleteMainDBHR } from './use-main-dbhr';

// STR
export { useSTRSubmissions, useSTRSubmission, useCreateSTRSubmission, useUpdateSTRSubmission, useDeleteSTRSubmission, useSTRStats } from './use-str-submissions';

// Office 365
export { useSearchUsers, useUserProfile, useMyProfile, useUserManager, useDirectReports, useAllOrganizationUsers } from './use-office365-users';

// Utility
export { useDebounce } from './use-debounce';
export { useIsMobile } from './use-mobile';
