import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const ProductionDepartmentHomePage = lazy(() => import('@/pages/production/index'));
const ProductionFormsIndexPage = lazy(() => import('@/pages/production/forms/index'));
const ProductionFormDatabaseView = lazy(() => import('@/pages/production/forms/[formCode]/index'));
const ProductionFormNewPage = lazy(() => import('@/pages/production/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function ProductionLayout() {
  return <DepartmentLayout departmentCode="PROD" />;
}

export const productionRoutes = (
  <Route path="production" element={<ProductionLayout />}>
    <Route index element={<ProductionDepartmentHomePage />} />
    <Route path="forms" element={<ProductionFormsIndexPage />} />
    <Route path="forms/:formCode" element={<ProductionFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<ProductionFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
