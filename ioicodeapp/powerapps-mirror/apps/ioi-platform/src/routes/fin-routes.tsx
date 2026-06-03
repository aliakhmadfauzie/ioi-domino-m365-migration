import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const FINDepartmentHomePage = lazy(() => import('@/pages/finance/index'));
const FINFormsIndexPage = lazy(() => import('@/pages/finance/forms/index'));
const FINFormDatabaseView = lazy(() => import('@/pages/finance/forms/[formCode]/index'));
const FINFormDetailPage = lazy(() => import('@/pages/finance/forms/[formCode]/detail'));
const FINFormNewPage = lazy(() => import('@/pages/finance/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function FINLayout() {
  return <DepartmentLayout departmentCode="FIN" />;
}

export const finRoutes = (
  <Route path="fin" element={<FINLayout />}>
    <Route index element={<FINDepartmentHomePage />} />
    <Route path="forms" element={<FINFormsIndexPage />} />
    <Route path="forms/:formCode" element={<FINFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<FINFormNewPage />} />
    <Route path="forms/:formCode/detail/:id" element={<FINFormDetailPage />} />
    <Route path="capital" element={<Navigate to="/fin/forms" replace />} />
    <Route path="credit" element={<Navigate to="/fin/forms" replace />} />
    <Route path="insurance" element={<Navigate to="/fin/forms" replace />} />
    <Route path="service" element={<Navigate to="/fin/forms" replace />} />
    <Route path="vendor" element={<Navigate to="/fin/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
