import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const TrainingDepartmentHomePage = lazy(() => import('@/pages/training/index'));
const TrainingFormsIndexPage = lazy(() => import('@/pages/training/forms/index'));
const TrainingFormNewPage = lazy(() => import('@/pages/training/forms/new'));
const TrainingFormDatabaseView = lazy(() => import('@/pages/training/forms/[formCode]/index'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function TrainingLayout() {
  return <DepartmentLayout departmentCode="TD" />;
}

export const trainingRoutes = (
  <Route path="training" element={<TrainingLayout />}>
    <Route index element={<TrainingDepartmentHomePage />} />
    <Route path="forms" element={<TrainingFormsIndexPage />} />
    <Route path="forms/:formCode" element={<TrainingFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<TrainingFormNewPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
