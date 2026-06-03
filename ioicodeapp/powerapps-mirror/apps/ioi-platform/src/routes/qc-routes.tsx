import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const QCDepartmentHomePage = lazy(() => import('@/pages/qc/index'));
const QCFormsIndexPage = lazy(() => import('@/pages/qc/forms/index'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function QCLayout() {
  return <DepartmentLayout departmentCode="QC" />;
}

export const qcRoutes = (
  <Route path="qc" element={<QCLayout />}>
    <Route index element={<QCDepartmentHomePage />} />
    <Route path="forms" element={<QCFormsIndexPage />} />
    <Route path="forms/:formCode/new" element={<QCFormsIndexPage />} />
    <Route path="actions" element={<Navigate to="/qc/forms" replace />} />
    <Route path="certificates" element={<Navigate to="/qc/forms" replace />} />
    <Route path="info" element={<Navigate to="/qc/forms" replace />} />
    <Route path="laboratory" element={<Navigate to="/qc/forms" replace />} />
    <Route path="specifications" element={<Navigate to="/qc/forms" replace />} />
    <Route path="testing" element={<Navigate to="/qc/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
