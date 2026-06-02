import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const ADMDepartmentHomePage = lazy(() => import('@/pages/adm/index'));
const ADMFormsIndexPage = lazy(() => import('@/pages/adm/forms/index'));
const ADMFormNewPage = lazy(() => import('@/pages/adm/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function ADMLayout() {
  return <DepartmentLayout departmentCode="ADM" />;
}

export const admRoutes = (
  <Route path="adm" element={<ADMLayout />}>
    <Route index element={<ADMDepartmentHomePage />} />
    <Route path="forms" element={<ADMFormsIndexPage />} />
    <Route path="forms/:formCode/new" element={<ADMFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
