import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const ProcurementDepartmentHomePage = lazy(() => import('@/pages/procurement/index'));
const ProcurementFormsIndexPage = lazy(() => import('@/pages/procurement/forms/index'));
const ProcurementFormNewPage = lazy(() => import('@/pages/procurement/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function ProcurementLayout() {
  return <DepartmentLayout departmentCode="PUR" />;
}

export const procurementRoutes = (
  <Route path="procurement" element={<ProcurementLayout />}>
    <Route index element={<ProcurementDepartmentHomePage />} />
    <Route path="forms" element={<ProcurementFormsIndexPage />} />
    <Route path="forms/:formCode/new" element={<ProcurementFormNewPage />} />
    <Route path="contracts" element={<Navigate to="/procurement/forms" replace />} />
    <Route path="receiving" element={<Navigate to="/procurement/forms" replace />} />
    <Route path="requests" element={<Navigate to="/procurement/forms" replace />} />
    <Route path="vendors" element={<Navigate to="/procurement/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
