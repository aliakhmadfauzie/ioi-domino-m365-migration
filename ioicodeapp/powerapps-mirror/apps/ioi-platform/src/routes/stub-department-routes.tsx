import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const EIDepartmentHomePage = lazy(() => import('@/pages/ei/index'));
const EIFormsIndexPage = lazy(() => import('@/pages/ei/forms/index'));
const EIFormNewPage = lazy(() => import('@/pages/ei/forms/new'));
const EIFormDatabaseView = lazy(() => import('@/pages/ei/forms/[formCode]/index'));
const PBIDepartmentHomePage = lazy(() => import('@/pages/pbi/index'));
const PBIFormsIndexPage = lazy(() => import('@/pages/pbi/forms/index'));
const PBIFormNewPage = lazy(() => import('@/pages/pbi/forms/new'));
const PBIFormDatabaseView = lazy(() => import('@/pages/pbi/forms/[formCode]/index'));
const RnDDepartmentHomePage = lazy(() => import('@/pages/rnd/index'));
const RNDFormsIndexPage = lazy(() => import('@/pages/rnd/forms/index'));
const RNDFormNewPage = lazy(() => import('@/pages/rnd/forms/new'));
const RNDFormDatabaseView = lazy(() => import('@/pages/rnd/forms/[formCode]/index'));
const OpsDepartmentHomePage = lazy(() => import('@/pages/ops/index'));
const OPSFormsIndexPage = lazy(() => import('@/pages/ops/forms/index'));
const OPSFormNewPage = lazy(() => import('@/pages/ops/forms/new'));
const OPSFormDatabaseView = lazy(() => import('@/pages/ops/forms/[formCode]/index'));
const MySubmissionsPage = lazy(() => import('@/pages/my-submissions'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function EILayout() {
  return <DepartmentLayout departmentCode="EI" />;
}
function PBILayout() {
  return <DepartmentLayout departmentCode="PBI" />;
}
function RnDLayout() {
  return <DepartmentLayout departmentCode="RND" />;
}
function OpsLayout() {
  return <DepartmentLayout departmentCode="OPS" />;
}

export const eiRoutes = (
  <Route path="ei/*" element={<EILayout />}>
    <Route index element={<EIDepartmentHomePage />} />
    <Route path="forms" element={<EIFormsIndexPage />} />
    <Route path="forms/:formCode" element={<EIFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<EIFormNewPage />} />
    <Route path=":module" element={<Navigate to="/ei/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/ei" replace />} />
  </Route>
);

export const pbiRoutes = (
  <Route path="pbi/*" element={<PBILayout />}>
    <Route index element={<PBIDepartmentHomePage />} />
    <Route path="forms" element={<PBIFormsIndexPage />} />
    <Route path="forms/:formCode" element={<PBIFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<PBIFormNewPage />} />
    <Route path=":module" element={<Navigate to="/pbi/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/pbi" replace />} />
  </Route>
);

export const rndRoutes = (
  <Route path="rnd/*" element={<RnDLayout />}>
    <Route index element={<RnDDepartmentHomePage />} />
    <Route path="forms" element={<RNDFormsIndexPage />} />
    <Route path="forms/:formCode" element={<RNDFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<RNDFormNewPage />} />
    <Route path=":module" element={<Navigate to="/rnd/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/rnd" replace />} />
  </Route>
);

export const opsRoutes = (
  <Route path="ops/*" element={<OpsLayout />}>
    <Route index element={<OpsDepartmentHomePage />} />
    <Route path="forms" element={<OPSFormsIndexPage />} />
    <Route path="forms/:formCode" element={<OPSFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<OPSFormNewPage />} />
    <Route path=":module" element={<Navigate to="/ops/forms" replace />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/ops" replace />} />
  </Route>
);

function POMLayout() { return <DepartmentLayout departmentCode="POM" />; }
function PRCLayout() { return <DepartmentLayout departmentCode="PRC" />; }
function SALayout() { return <DepartmentLayout departmentCode="SA" />; }

export const pomStubRoutes = (
  <Route path="pom/*" element={<POMLayout />}>
    <Route index element={<Navigate to="/pom" replace />} />
    <Route path="forms" element={<MySubmissionsPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/pom" replace />} />
  </Route>
);

export const prcStubRoutes = (
  <Route path="prc/*" element={<PRCLayout />}>
    <Route index element={<Navigate to="/prc" replace />} />
    <Route path="forms" element={<MySubmissionsPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/prc" replace />} />
  </Route>
);

export const saStubRoutes = (
  <Route path="sa/*" element={<SALayout />}>
    <Route index element={<Navigate to="/sa" replace />} />
    <Route path="forms" element={<MySubmissionsPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/sa" replace />} />
  </Route>
);
