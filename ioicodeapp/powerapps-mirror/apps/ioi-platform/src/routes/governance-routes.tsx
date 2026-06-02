import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const GovernanceHomePage = lazy(() => import('@/pages/governance/index'));
const AuditMonitoringPage = lazy(() => import('@/pages/governance/audit'));
const PolicyManagementPage = lazy(() => import('@/pages/governance/policies'));
const GovernanceFormsIndexPage = lazy(() => import('@/pages/governance/forms/index'));
const GovernanceFormNewPage = lazy(() => import('@/pages/governance/forms/new'));
const GovernanceFormDatabaseView = lazy(() => import('@/pages/governance/forms/[formCode]/index'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function GovernanceLayout() {
  return <DepartmentLayout departmentCode="GOV" />;
}

export const governanceRoutes = (
  <Route path="governance" element={<GovernanceLayout />}>
    <Route index element={<GovernanceHomePage />} />
    <Route path="audit" element={<AuditMonitoringPage />} />
    <Route path="policies" element={<PolicyManagementPage />} />
    <Route path="forms" element={<GovernanceFormsIndexPage />} />
    <Route path="forms/:formCode" element={<GovernanceFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<GovernanceFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
