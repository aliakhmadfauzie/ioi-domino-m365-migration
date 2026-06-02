import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const MTRDepartmentHomePage = lazy(() => import('@/pages/mtr/index'));
const MTRFormsIndexPage = lazy(() => import('@/pages/mtr/forms/index'));
const MTRFormDatabaseView = lazy(() => import('@/pages/mtr/forms/[formCode]/index'));
const MTRFormNewPage = lazy(() => import('@/pages/mtr/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function MTRLayout() {
  return <DepartmentLayout departmentCode="MTR" />;
}

export const mtrRoutes = (
  <Route path="mtr" element={<MTRLayout />}>
    <Route index element={<MTRDepartmentHomePage />} />
    <Route path="forms" element={<MTRFormsIndexPage />} />
    <Route path="forms/:formCode" element={<MTRFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<MTRFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
