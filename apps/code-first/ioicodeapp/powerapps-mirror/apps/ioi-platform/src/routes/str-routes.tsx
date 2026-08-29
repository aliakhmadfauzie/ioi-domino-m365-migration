import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const STRDepartmentHomePage = lazy(() => import('@/pages/str/index'));
const STROperationsPage = lazy(() => import('@/pages/str/operations'));
const STRRequisitionPage = lazy(() => import('@/pages/str/requisition'));
const STRProcurementPage = lazy(() => import('@/pages/str/procurement'));
const STRDisposalPage = lazy(() => import('@/pages/str/disposal'));
const STRCompliancePage = lazy(() => import('@/pages/str/compliance'));
const STRNewRequestPage = lazy(() => import('@/pages/str/new'));
const STRSubmissionDetailPage = lazy(() => import('@/pages/str/submission-detail'));
const STREditPage = lazy(() => import('@/pages/str/edit'));
const STRApprovePage = lazy(() => import('@/pages/str/approve'));
const MRFFormPage = lazy(() => import('@/pages/str/mrf-form'));
const STRFormNewRedirectPage = lazy(() => import('@/pages/str/form-new-redirect'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function STRLayout() {
  return <DepartmentLayout departmentCode="STR" />;
}

export const strRoutes = (
  <Route path="str" element={<STRLayout />}>
    <Route index element={<STRDepartmentHomePage />} />
    <Route path="operations" element={<STROperationsPage />} />
    <Route path="requisition" element={<STRRequisitionPage />} />
    <Route path="procurement" element={<STRProcurementPage />} />
    <Route path="disposal" element={<STRDisposalPage />} />
    <Route path="compliance" element={<STRCompliancePage />} />
    <Route path="mrf/new" element={<MRFFormPage />} />
    <Route path="forms/:formCode/new" element={<STRFormNewRedirectPage />} />
    <Route path=":formCode/new" element={<STRFormNewRedirectPage />} />
    <Route path="new" element={<STRNewRequestPage />} />
    <Route path="edit/:id" element={<STREditPage />} />
    <Route path="approve/:id" element={<STRApprovePage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
