import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const QADepartmentHomePage = lazy(() => import('@/pages/qa/index'));
const QADefectsPage = lazy(() => import('@/pages/qa/defects'));
const QAAuditsPage = lazy(() => import('@/pages/qa/audits'));
const QADocumentsPage = lazy(() => import('@/pages/qa/documents'));
const QACAPAsPage = lazy(() => import('@/pages/qa/capas'));
const QATrainingPage = lazy(() => import('@/pages/qa/training'));
const QAReportsPage = lazy(() => import('@/pages/qa/reports'));
const QAFormsIndexPage = lazy(() => import('@/pages/qa/forms/index'));
const QAFormNewPage = lazy(() => import('@/pages/qa/forms/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function QALayout() {
  return <DepartmentLayout departmentCode="QA" />;
}

export const qaRoutes = (
  <Route path="qa" element={<QALayout />}>
    <Route index element={<QADepartmentHomePage />} />
    <Route path="defects" element={<QADefectsPage />} />
    <Route path="audits" element={<QAAuditsPage />} />
    <Route path="documents" element={<QADocumentsPage />} />
    <Route path="capas" element={<QACAPAsPage />} />
    <Route path="training" element={<QATrainingPage />} />
    <Route path="reports" element={<QAReportsPage />} />
    <Route path="forms" element={<QAFormsIndexPage />} />
    <Route path="forms/:formCode/new" element={<QAFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
