// =============================================================================
// Screen Builder — Auto-Generated Department Routes
// =============================================================================
// This file provides generic CRUD routes for departments that are configured
// to use the screen builder pipeline.
//
// MIGRATION PATH
// --------------
// 1. Import GenericDepartmentHomePage, GenericFormListPage, GenericFormNewPage
//    from @/pages/generic-department/* in your route file.
// 2. Replace lazy() imports for custom pages with the generic ones.
// 3. For a full automatic route tree, uncomment a buildGenericDeptRoutes()
//    call below and remove the corresponding import from App.tsx.
//
// Example — replace in adm-routes.tsx:
//   Before: const ADMFormsIndexPage = lazy(() => import('@/pages/adm/forms/index'));
//   After:  const ADMFormsIndexPage = lazy(() => import('@/pages/generic-department/generic-form-list'));
// =============================================================================

export const screenBuilderRoutes = (
  <>
    {/*
      SCREEN BUILDER DISABLED BY DEFAULT
      ──────────────────────────────────
      All departments currently have custom route files in src/routes/.
      To switch a department to screen builder:

      1. Remove its custom route import from App.tsx:
         e.g. remove `import { governanceRoutes } from '@/routes/governance-routes';`

      2. Uncomment the corresponding buildGenericDeptRoutes() call below.

      3. The department will auto-generate pages from the module/form
         config in src/config/departments.ts.

      Departments ready for screen builder adoption:
      - GOV  → route path="governance"
      - MTR  → route path="mtr"
      - MKT  → route path="sales"
      - LOG  → route path="log"
      - SEC  → route path="security"
      - TD   → route path="training"
      - ENG  → route path="engineering"
      - ADM  → route path="adm"
      - PUR  → route path="procurement"
      - WH   → route path="warehouse"
      - EI   → route path="ei"
      - PBI  → route path="pbi"
      - RND  → route path="rnd"
      - OPS  → route path="ops"
    */}
  </>
);
