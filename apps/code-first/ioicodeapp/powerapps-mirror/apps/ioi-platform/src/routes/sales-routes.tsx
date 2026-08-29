import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const SalesDepartmentHomePage = lazy(() => import('@/pages/sales/index'));
const SalesFormsIndexPage = lazy(() => import('@/pages/sales/forms/index'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function SalesLayout() {
  return <DepartmentLayout departmentCode="MKT" />;
}

export const salesRoutes = (
  <Route path="sales" element={<SalesLayout />}>
    <Route index element={<SalesDepartmentHomePage />} />
    <Route path="forms" element={<SalesFormsIndexPage />} />
    <Route path="brand" element={<Navigate to="/sales/forms" replace />} />
    <Route path="budget" element={<Navigate to="/sales/forms" replace />} />
    <Route path="campaigns" element={<Navigate to="/sales/forms" replace />} />
    <Route path="digital" element={<Navigate to="/sales/forms" replace />} />
    <Route path="research" element={<Navigate to="/sales/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
