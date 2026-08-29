import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const SHEDepartmentHomePage = lazy(() => import('@/pages/she/index'));
const SHEFormsIndexPage = lazy(() => import('@/pages/she/forms/index'));
const SHEFormNewPage = lazy(() => import('@/pages/she/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function SHELayout() {
  return <DepartmentLayout departmentCode="SHE" />;
}

export const sheRoutes = (
  <Route path="she" element={<SHELayout />}>
    <Route index element={<SHEDepartmentHomePage />} />
    <Route path="forms" element={<SHEFormsIndexPage />} />
    <Route path="forms/:formCode/new" element={<SHEFormNewPage />} />
    <Route path="forms/:formCode/:id" element={<SHEFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
