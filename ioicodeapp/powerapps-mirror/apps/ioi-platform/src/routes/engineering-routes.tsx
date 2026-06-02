import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const EngineeringDepartmentHomePage = lazy(() => import('@/pages/engineering/index'));
const EngineeringFormsIndexPage = lazy(() => import('@/pages/engineering/forms/index'));
const EngineeringFormDatabaseView = lazy(() => import('@/pages/engineering/forms/[formCode]/index'));
const EngineeringFormNewPage = lazy(() => import('@/pages/engineering/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function EngineeringLayout() {
  return <DepartmentLayout departmentCode="ENG" />;
}

export const engineeringRoutes = (
  <Route path="engineering" element={<EngineeringLayout />}>
    <Route index element={<EngineeringDepartmentHomePage />} />
    <Route path="forms" element={<EngineeringFormsIndexPage />} />
    <Route path="forms/:formCode" element={<EngineeringFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<EngineeringFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
