import { useEffect, useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from '@/components/scroll-to-top';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { ensureInitialized, useIsAppInitialized } from '@/lib/app-init';
import { LoadingScreen } from '@/components/loading-screen';
import { queryClient } from '@/lib/query-client';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/system/error-boundary';
import { FeedbackWidget } from '@/features/bug-tracker/feedback-widget';
import { DebugOverlay } from '@/components/debug-overlay';
import { DebugToggle } from '@/components/debug/DebugToggle';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { MockToggle } from '@/components/mock-toggle/MockToggle';
import { useDebugInit } from '@/debug/useDebugInit';
import StandaloneLayout from '@/components/layouts/standalone-layout';
import { CanonicalSubmissionDetailRedirect } from '@/routes/shared';

// Department route modules
import { itRoutes } from '@/routes/it-routes';
import { hrRoutes } from '@/routes/hr-routes';
import { strRoutes } from '@/routes/str-routes';
import { governanceRoutes } from '@/routes/governance-routes';
import { qaRoutes } from '@/routes/qa-routes';
import { finRoutes } from '@/routes/fin-routes';
import { procurementRoutes } from '@/routes/procurement-routes';
import { qcRoutes } from '@/routes/qc-routes';
import { productionRoutes } from '@/routes/production-routes';
import { sheRoutes } from '@/routes/she-routes';
import { admRoutes } from '@/routes/adm-routes';
import { logRoutes } from '@/routes/log-routes';
import { maintenanceRoutes } from '@/routes/maintenance-routes';
import { warehouseRoutes } from '@/routes/warehouse-routes';
import { salesRoutes } from '@/routes/sales-routes';
import { securityRoutes } from '@/routes/security-routes';
import { trainingRoutes } from '@/routes/training-routes';
import { engineeringRoutes } from '@/routes/engineering-routes';
import { eiRoutes, pbiRoutes, rndRoutes, opsRoutes, adminStubRoutes, pomStubRoutes, prcStubRoutes, saStubRoutes } from '@/routes/stub-department-routes';
import { mtrRoutes } from '@/routes/mtr-routes';

// Root-level pages
const DepartmentHubPage = lazy(() => import('@/pages/department-hub'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const GlobalEmployeeDirectoryPage = lazy(() => import('@/pages/employee-directory'));
const ApprovalsPage = lazy(() => import('@/pages/approvals'));
const MySubmissionsPage = lazy(() => import('@/pages/my-submissions'));
const ManagerDashboardPage = lazy(() => import('@/pages/manager-dashboard'));
const HelpPage = lazy(() => import('@/pages/help'));
const AdminDashboardPage = lazy(() => import('@/pages/admin'));
const SettingsPage = lazy(() => import('@/pages/settings'));
const BugAdminDashboardPage = lazy(() => import('@/pages/bug-admin'));
const WorkflowMatrixPage = lazy(() => import('@/pages/admin/workflow-matrix'));
const AdminFormsListPage = lazy(() => import('@/pages/admin/forms/index'));
const FormSchemaEditorPage = lazy(() => import('@/pages/admin/forms/editor'));
const BatchApprovalsPage = lazy(() => import('@/pages/batch-approvals'));
const FieldWorkerPage = lazy(() => import('@/pages/field-worker'));
const QuickSubmitPage = lazy(() => import('@/pages/quick-submit'));

const INIT_TIMEOUT_MS = 30_000;

function InitFailedScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="text-destructive text-5xl mb-2">⚠</div>
        <h1 className="text-2xl font-semibold">Unable to connect</h1>
        <p className="text-muted-foreground">
          The platform could not connect to services after {INIT_TIMEOUT_MS / 1000} seconds.
          Check your network connection or try refreshing.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-accent"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const isInitialized = useIsAppInitialized();
  const [showContent, setShowContent] = useState(false);
  const [initTimedOut, setInitTimedOut] = useState(false);

  // Wire the debug data map system
  useDebugInit();

  useEffect(() => {
    ensureInitialized();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  // Show an error UI if initialization is still pending after INIT_TIMEOUT_MS
  useEffect(() => {
    if (isInitialized) return;
    const timer = setTimeout(() => setInitTimedOut(true), INIT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isInitialized]);

  if (!isInitialized || !showContent) {
    if (initTimedOut) {
      return (
        <InitFailedScreen
          onRetry={() => {
            setInitTimedOut(false);
            ensureInitialized();
          }}
        />
      );
    }
    return (
      <LoadingScreen
        message="Starting IOI Platform"
        description="Connecting to services and preparing your workspace"
        variant="full"
        minDisplayTime={1000}
      />
    );
  }

  return (
    <>
      <Toaster richColors />
      <Router>
        <ScrollToTop />
        <FeedbackWidget />
        <Suspense fallback={<LoadingScreen variant="full" message="Loading page..." showProgress={false} />}>
          <Routes>
            {/* Landing page */}
            <Route index element={<DepartmentHubPage />} />

            {/* Root-level shared pages */}
            <Route path="my-submissions" element={<StandaloneLayout><MySubmissionsPage /></StandaloneLayout>} />
            <Route path="batch-approvals" element={<StandaloneLayout><BatchApprovalsPage /></StandaloneLayout>} />
            <Route path="approvals" element={<StandaloneLayout><ApprovalsPage /></StandaloneLayout>} />
            <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
            <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
            <Route path="manager-dashboard" element={<StandaloneLayout><ManagerDashboardPage /></StandaloneLayout>} />
            <Route path="help" element={<StandaloneLayout><HelpPage /></StandaloneLayout>} />
            <Route path="admin" element={<StandaloneLayout><AdminDashboardPage /></StandaloneLayout>} />
            <Route path="admin/workflow" element={<StandaloneLayout><WorkflowMatrixPage /></StandaloneLayout>} />
            <Route path="admin/forms" element={<AdminFormsListPage />} />
            <Route path="admin/forms/:formCode" element={<FormSchemaEditorPage />} />
            <Route path="dashboard" element={<StandaloneLayout><DashboardPage /></StandaloneLayout>} />
            <Route path="bug-admin" element={<StandaloneLayout><BugAdminDashboardPage /></StandaloneLayout>} />
            <Route path="quick-submit" element={<QuickSubmitPage />} />
            <Route path="field-worker" element={<FieldWorkerPage />} />
            <Route path="employee-directory" element={<StandaloneLayout><GlobalEmployeeDirectoryPage /></StandaloneLayout>} />
            <Route path="settings" element={<StandaloneLayout><SettingsPage /></StandaloneLayout>} />

            {/* Legacy redirects for Finance / Store old paths */}
            <Route path="finance/*" element={<Navigate to="/fin" replace />} />
            <Route path="Finance/*" element={<Navigate to="/fin" replace />} />
            <Route path="store/*" element={<Navigate to="/str" replace />} />
            <Route path="Store/*" element={<Navigate to="/str" replace />} />

            {/* Department routes */}
            {itRoutes}
            {hrRoutes}
            {strRoutes}
            {governanceRoutes}
            {qaRoutes}
            {finRoutes}
            {procurementRoutes}
            {qcRoutes}
            {productionRoutes}
            {sheRoutes}
            {admRoutes}
            {logRoutes}
            {maintenanceRoutes}
            {warehouseRoutes}
            {salesRoutes}
            {securityRoutes}
            {trainingRoutes}
            {engineeringRoutes}
            {eiRoutes}
            {pbiRoutes}
            {rndRoutes}
            {opsRoutes}
            {adminStubRoutes}
            {pomStubRoutes}
            {prcStubRoutes}
            {saStubRoutes}
            {mtrRoutes}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <DebugOverlay />
        <DebugToggle />
        <DebugPanel />
        <MockToggle />
      </Router>
    </>
  );
}

function App() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary resetQueryCache>
          <AppContent />
        </ErrorBoundary>
      </QueryClientProvider>
    </JotaiProvider>
  );
}

export default App;
