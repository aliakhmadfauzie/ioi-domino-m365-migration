import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function MaintenanceLayout() {
  return <DepartmentLayout departmentCode="MAINT" />;
}

export const maintenanceRoutes = (
  <Route path="maintenance" element={<MaintenanceLayout />}>
    <Route index element={<Navigate to="/mtr" replace />} />
    <Route path="forms" element={<Navigate to="/mtr/forms" replace />} />
    <Route path="forms/far/new" element={<Navigate to="/mtr/forms/far/new" replace />} />
    <Route path="forms/mtp/new" element={<Navigate to="/mtr/forms/mtp/new" replace />} />
    <Route path="forms/mecp/new" element={<Navigate to="/mtr/forms/mecp/new" replace />} />
    <Route path="forms/epi/new" element={<Navigate to="/mtr/forms/epi/new" replace />} />
    <Route path="forms/*" element={<Navigate to="/mtr/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
