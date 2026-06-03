import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const WarehouseDepartmentHomePage = lazy(() => import('@/pages/warehouse/index'));
const WarehouseFormsIndexPage = lazy(() => import('@/pages/warehouse/forms/index'));
const GRNNewFormPage = lazy(() => import('@/pages/warehouse/forms/grn/new'));
const STONewFormPage = lazy(() => import('@/pages/warehouse/forms/sto/new'));
const DONewFormPage = lazy(() => import('@/pages/warehouse/forms/do/new'));
const ADJNewFormPage = lazy(() => import('@/pages/warehouse/forms/adj/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function WarehouseLayout() {
  return <DepartmentLayout departmentCode="WH" />;
}

export const warehouseRoutes = (
  <Route path="warehouse" element={<WarehouseLayout />}>
    <Route index element={<WarehouseDepartmentHomePage />} />
    <Route path="forms" element={<WarehouseFormsIndexPage />} />
    <Route path="forms/grn/new" element={<GRNNewFormPage />} />
    <Route path="forms/sto/new" element={<STONewFormPage />} />
    <Route path="forms/do/new" element={<DONewFormPage />} />
    <Route path="forms/adj/new" element={<ADJNewFormPage />} />
    <Route path="delivery" element={<Navigate to="/warehouse/forms" replace />} />
    <Route path="goods-receipt" element={<Navigate to="/warehouse/forms" replace />} />
    <Route path="inventory" element={<Navigate to="/warehouse/forms" replace />} />
    <Route path="stock-transfer" element={<Navigate to="/warehouse/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
