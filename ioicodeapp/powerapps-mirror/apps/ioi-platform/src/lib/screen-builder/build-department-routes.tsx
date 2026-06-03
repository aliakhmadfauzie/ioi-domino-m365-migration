// =============================================================================
// Screen Builder — Route Generator
// Dynamically builds React Router `<Route>` elements for departments
// configured to use the screen builder pipeline.
// =============================================================================

import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from '@/routes/shared';
import { shouldUseScreenBuilder } from './screen-builder-service';
import {
  getDepartmentByCode,
  getDepartmentModules,
  type DepartmentCode,
} from '@/config/departments';

// Lazy-load screen builder pages
const GenericDepartmentHomePage = lazy(
  () => import('@/pages/generic-department/generic-department-home')
);
const GenericFormListPage = lazy(
  () => import('@/pages/generic-department/generic-form-list')
);
const GenericFormNewPage = lazy(
  () => import('@/pages/generic-department/generic-form-new')
);

// Shared pages
const MySubmissionsPage = lazy(() => import('@/pages/my-submissions'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

/**
 * Builds a set of React Router `<Route>` elements for a department
 * that uses the screen builder pipeline.
 *
 * Generates:
 *   /{deptCode}             → Generic department home (module cards with forms)
 *   /{deptCode}/forms       → Form list / database view
 *   /{deptCode}/forms/:formCode       → Specific form database view
 *   /{deptCode}/forms/:formCode/new   → New form creation page
 *   /{deptCode}/approvals   → Redirect to global approvals
 *   /{deptCode}/submissions → Redirect to my-submissions
 *
 * @param deptCode - The uppercase department code (e.g. 'HR', 'FIN')
 * @returns A `<Route>` element tree
 */
export function buildDepartmentRoutes(deptCode: DepartmentCode) {
  const basePath = deptCode.toLowerCase();
  const department = getDepartmentByCode(deptCode);

  // If the department shouldn't use screen builder, return null
  if (!shouldUseScreenBuilder(deptCode)) {
    return null;
  }

  // Get forms from modules
  const modules = department?.modules ?? getDepartmentModules(deptCode);

  /**
   * Layout wrapper for the screen-builder department.
   */
  function ScreenBuilderLayout() {
    return <DepartmentLayout departmentCode={deptCode} />;
  }

  return (
    <Route path={`${basePath}/*`} element={<ScreenBuilderLayout />}>
      {/* Home page — shows module cards with form links */}
      <Route index element={<GenericDepartmentHomePage />} />

      {/* Forms index — if no formCode, redirect to home */}
      <Route path="forms" element={<GenericFormListPage />} />

      {/* Specific form database view */}
      <Route path="forms/:formCode" element={<GenericFormListPage />} />

      {/* New form creation */}
      <Route path="forms/:formCode/new" element={<GenericFormNewPage />} />

      {/* Module redirect — map to forms */}
      <Route path=":module" element={<Navigate to={`/${basePath}/forms`} replace />} />

      {/* Shared pages */}
      <Route path="approvals" element={<Navigate to="/approvals" replace />} />
      <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
      <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
      <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
      <Route path="help" element={<HelpPage />} />
      <Route path="settings" element={<SettingsPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={`/${basePath}`} replace />} />
    </Route>
  );
}

/**
 * Builds route elements for ALL departments configured to use screen builder.
 * Used in App.tsx to auto-register screen-builder routes alongside custom routes.
 */
export function buildAllScreenBuilderRoutes() {
  const deptCodes: DepartmentCode[] = [
    'GOV', 'MTR', 'PUR', 'WH', 'LOG', 'SEC', 'TD', 'ENG', 'ADM', 'MKT',
  ];

  return deptCodes
    .filter((code) => shouldUseScreenBuilder(code))
    .map((code) => buildDepartmentRoutes(code))
    .filter(Boolean);
}
