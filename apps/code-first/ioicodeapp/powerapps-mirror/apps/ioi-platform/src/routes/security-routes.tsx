import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const SecurityDepartmentHomePage = lazy(() => import('@/pages/security/index'));
const SecurityFormsIndexPage = lazy(() => import('@/pages/security/forms/index'));
const SecurityFormNewPage = lazy(() => import('@/pages/security/forms/new'));
const SecurityFormDatabaseView = lazy(() => import('@/pages/security/forms/[formCode]/index'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function SecurityLayout() {
  return <DepartmentLayout departmentCode="SEC" />;
}

export const securityRoutes = (
  <Route path="security" element={<SecurityLayout />}>
    <Route index element={<SecurityDepartmentHomePage />} />
    <Route path="forms" element={<SecurityFormsIndexPage />} />
    <Route path="forms/:formCode/new" element={<SecurityFormNewPage />} />
    <Route path="forms/:formCode" element={<SecurityFormDatabaseView />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
