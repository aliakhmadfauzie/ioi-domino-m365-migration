import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const LOGDepartmentHomePage = lazy(() => import('@/pages/log/index'));
const LOGFormsIndexPage = lazy(() => import('@/pages/log/forms/index'));
const CSDNewFormPage = lazy(() => import('@/pages/log/forms/csd/new'));
const TINewFormPage = lazy(() => import('@/pages/log/forms/ti/new'));
const ECMFBNewFormPage = lazy(() => import('@/pages/log/forms/ecmfb/new'));
const FBNNewFormPage = lazy(() => import('@/pages/log/forms/fbn/new'));
const PODNewFormPage = lazy(() => import('@/pages/log/forms/pod/new'));
const GTPWNewFormPage = lazy(() => import('@/pages/log/forms/gtpw/new'));
const TMINewFormPage = lazy(() => import('@/pages/log/forms/tmi/new'));
const WCCNewFormPage = lazy(() => import('@/pages/log/forms/wcc/new'));
const SHUNTINGNewFormPage = lazy(() => import('@/pages/log/forms/shunting/new'));
const IMDGNewFormPage = lazy(() => import('@/pages/log/forms/imdg/new'));
const FJBNewFormPage = lazy(() => import('@/pages/log/forms/fjb/new'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function LOGLayout() {
  return <DepartmentLayout departmentCode="LOG" />;
}

export const logRoutes = (
  <Route path="log" element={<LOGLayout />}>
    <Route index element={<LOGDepartmentHomePage />} />
    <Route path="forms" element={<LOGFormsIndexPage />} />
    <Route path="forms/csd/new" element={<CSDNewFormPage />} />
    <Route path="forms/ti/new" element={<TINewFormPage />} />
    <Route path="forms/ecmfb/new" element={<ECMFBNewFormPage />} />
    <Route path="forms/fbn/new" element={<FBNNewFormPage />} />
    <Route path="forms/pod/new" element={<PODNewFormPage />} />
    <Route path="forms/gtpw/new" element={<GTPWNewFormPage />} />
    <Route path="forms/tmi/new" element={<TMINewFormPage />} />
    <Route path="forms/wcc/new" element={<WCCNewFormPage />} />
    <Route path="forms/shunting/new" element={<SHUNTINGNewFormPage />} />
    <Route path="forms/imdg/new" element={<IMDGNewFormPage />} />
    <Route path="forms/fjb/new" element={<FJBNewFormPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
