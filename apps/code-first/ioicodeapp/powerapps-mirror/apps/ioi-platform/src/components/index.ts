/**
 * Components Module
 * Re-exports all shared components
 */

// Layout components
export * from './layout';

// UI components are imported directly from @/components/ui/*

// Workflow components
export { WorkflowActions } from './workflow/workflow-actions';
export { ApprovalWorkflowPanel } from './workflow/approval-workflow-panel';
export { StageProgress } from './workflow/stage-progress';
export { StageGatedSection } from './workflow/stage-gated-section';
export { WorkflowTimeline } from './workflow/workflow-timeline';

// HR components
export { HRLayout } from './hr/hr-layout';
export { HRBreadcrumb } from './hr/hr-breadcrumb';

// Shared components
export { LoadingScreen } from './loading-screen';
export { PageLoader } from './page-loader';
export { PageLoading } from './page-loading';
export { RouteLoadingWrapper } from './route-loading-wrapper';
export { MobileBottomNav } from './mobile-bottom-nav';
export { NotificationsPanel } from './notifications-panel';
export { ScrollToTop } from './scroll-to-top';
export { MultiStepForm } from './multi-step-form';
export { UserPicker } from './user-picker';
export { EmployeePicker, MultiEmployeePicker } from './employee-picker';
export type { SelectedEmployee } from './employee-picker';
export { DataReadyGuard } from './data-ready-guard';
export { GlobalSearch } from './global-search';

// System components
export { default as ErrorBoundary } from './system/error-boundary';

// Layout variants
export { default as StandaloneLayout } from './layouts/standalone-layout';
export { default as DepartmentLayout } from './layouts/department-layout';