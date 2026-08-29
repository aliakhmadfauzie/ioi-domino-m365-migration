# UI and Page Specification — IOI Enterprise Platform

> **Document**: `docs/ui-page-specification.md`
> **Version**: 1.0
> **Date**: 2026-05-31
> **App Type**: Power Apps new code app (code-first) — React 19 + TypeScript + Vite
> **UI Framework**: shadcn/ui (New York style) + Radix UI + Tailwind CSS v4
> **App Location**: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/`
> **Status**: ✅ Active source of truth for all UI decisions

---

## 1. Executive Summary

### Existing UI Pattern Assessment

The existing UI is **well-structured and consistent**. The codebase already follows a mature design system built on shadcn/ui + Tailwind CSS v4 with custom IOI-branded tokens. Key existing patterns worth standardising:

| Pattern | Assessment | Action |
|---------|-----------|--------|
| shadcn/ui component library (70+ components) | ✅ Excellent — reuse as-is | Document as standard |
| IOI Blue (#003366) primary design system in `index.css` | ✅ Comprehensive with dark mode | Document as standard |
| `FormSubmissionLayout` multi-step form wrapper | ✅ Canonical form pattern | Document as standard |
| `ModuleHomeLayout` per-module dashboard | ✅ Good reusable pattern | Document as standard |
| `DynamicSubmissionDetails` detail view | ✅ Good reusable pattern | Document as standard |
| `DatabaseView` + `DatabaseTable` list view | ✅ Good reusable pattern | Document as standard |
| `DepartmentLayout` sidebar navigation | ✅ Good reusable pattern | Document as standard |
| `color-tokens.ts` semantic status tokens | ✅ Well-defined | Document as standard |
| `status-utils.ts` workflow status config | ✅ Comprehensive | Document as standard |
| Dynamic form config (`it-forms-config.ts`) | ✅ Config-driven forms | Document as standard |
| 40+ page routes with consistent patterns | ⚠️ Some variance in form implementations | Improve by enforcing canonical pattern |

### Major Inconsistencies Found

1. **Form implementations vary**: EAF, ITSSR, PRF, HI each have custom form implementations vs dynamic form renderer — not all use `FormSubmissionLayout` consistently
2. **Status badge styling is duplicated**: Both `status-utils.ts` and `DatabaseTable.StatusBadge` define status colors
3. **Detail page routes split**: Generic `/submissions/:id` vs form-specific `/it/forms/:formCode/:id` pages
4. **Some forms hardcode field order** that differs from field mapping and SharePoint column order
5. **No canonical New/Edit/View/Approval pattern** — edit mode handled via edit-request-modal rather than a dedicated edit form page

### Required Specification Updates

1. Enforce one canonical form pattern (`FormSubmissionLayout`) for all new form implementations
2. Consolidate status badge styling to use `status-utils.ts` + `color-tokens.ts` as the single source
3. Route detail pages to canonical `/submissions/:id` where possible
4. Standardise field display order per form using `it-forms-config.ts` or form schema definitions
5. Document the New/Edit/View/Approval mode strategy

---

## 2. Sources Reviewed

| Source | Path / Location | Purpose | Reviewed |
|--------|----------------|---------|----------|
| **CSS Theme** | `src/index.css` | Custom CSS variables, IOI Blue tokens, dark mode | ✅ |
| **UI Components** | `src/components/ui/` | 70+ shadcn/ui + Radix UI components | ✅ |
| **Form Layout** | `src/components/forms/form-submission-layout.tsx` | Canonical multi-step form wrapper | ✅ |
| **Dynamic FormRenderer** | `src/components/forms/dynamic-form-renderer.tsx` | Config-driven form renderer | ✅ |
| **MultiStepForm** | `src/components/multi-step-form.tsx` | Step indicator + field renderer | ✅ |
| **Module Home Layout** | `src/components/it/module-home-layout.tsx` | Per-module dashboard with quick actions | ✅ |
| **Department Layout** | `src/components/layouts/department-layout.tsx` | Sidebar navigation for departments | ✅ |
| **Standalone Layout** | `src/components/layouts/standalone-layout.tsx` | Minimal header for shared pages | ✅ |
| **DatabaseView** | `src/components/database-view/` | List/database view with table + detail modal | ✅ |
| **DatabaseTable** | `src/components/database-table.tsx` + `database-view/database-table.tsx` | Reusable table with filtering/sorting | ✅ |
| **Detail Modal** | `src/components/database-view/detail-modal.tsx` | Field groups + approval history modal | ✅ |
| **DynamicSubmissionDetails** | `src/components/submission-details/index.tsx` | Read-only detail field groups | ✅ |
| **Submission Detail Page** | `src/pages/submissions/[id].tsx` | Canonical detail page | ✅ |
| **Status Utils** | `src/lib/status-utils.ts` | Workflow status config | ✅ |
| **Color Tokens** | `src/lib/color-tokens.ts` | Semantic status color tokens | ✅ |
| **IT Forms Config** | `src/lib/it-forms-config.ts` | Config-driven form definitions | ✅ |
| **Form Sections Resolver** | `src/lib/form-sections-resolver.ts` | Merges base config with field definitions | ✅ |
| **Form Fields (M1)** | `src/lib/m1-form-fields.ts` | M1 form field definitions | ✅ |
| **Form Fields (M2)** | `src/lib/m2-form-fields.ts` | M2 form field definitions | ✅ |
| **IT Routes** | `src/routes/it-routes.tsx` | All IT form route definitions | ✅ |
| **App Router** | `src/App.tsx` | Root-level route structure | ✅ |
| **SharePoint List Design** | `design/m365-design/sharepoint-list-design.md` | SharePoint schema | ✅ |
| **Power Apps Design** | `design/m365-design/powerapps-design.md` | App architecture design | ✅ |
| **Field Mapping** | `mapping/field-mapping.csv` | Domino → M365 field mapping | ✅ |
| **Data Migration Rules** | `mapping/data-migration-rules.csv` | Transformation rules | ✅ |
| **SharePoint Write Audit** | `apps/code-first/ioicodeapp/sharepoint-write-buttons-audit.md` | Button-to-SP column mapping | ✅ |
| **Repo Knowledge Base** | `docs/repo-knowledge-base.md` | Repo structure governance | ✅ |
| **Migration Documentation** | `docs/migration-documentation.md` | Migration overview | ✅ |
| **Active Agent Instructions** | `.github/instructions/domino-migration.instructions.md` | Agent governance rules | ✅ |
| **EAF New Form Page** | `src/pages/it/forms/eaf/new.tsx` | EAF multi-step form implementation | ✅ |
| **ITSSR Pages** | `src/pages/it/forms/itssr/` | ITSSR list/detail/new pages | ✅ |
| **Access Module Page** | `src/pages/it/access.tsx` | M1 module home | ✅ |
| **Support Module Page** | `src/pages/it/support.tsx` | M2 module home | ✅ |

---

## 3. Missing Inputs / Assumptions

| Missing Input | Assumption Made | Impact |
|--------------|----------------|--------|
| Specific design mockups from stakeholder review | Using existing code-first implementation as reference | Low — app is already built |
| Formal accessibility (a11y) audit | shadcn/ui components are ARIA-compliant by default | Low |
| Formal user testing results | Existing patterns reflect developer implementation, assume validated | Medium — may need UX review |
| Dept-specific UI screens for non-IT departments | IT department is primary migration focus; other depts follow same patterns | Low for now |
| Mobile responsive testing results | Using responsive Tailwind breakpoints, MobileBottomNav exists | Low |

---

## 4. Existing UI Pattern Review

| Existing UI Item | Path / Location | Purpose | Current Pattern | Good Enough To Reuse? | Recommended Action |
|---|---|---|---|---|---|
| `index.css` | `src/index.css` | Design system tokens (colors, spacing, radius, dark mode) | CSS variables with `@theme inline`, `:root`/`.dark` | ✅ Yes — comprehensive | Document as standard |
| `src/components/ui/` | 70+ shadcn/ui components | Buttons, inputs, selects, tables, cards, dialogs, etc. | Radix UI primitives + Tailwind + CVA | ✅ Yes — mature library | Document as standard |
| `color-tokens.ts` | `src/lib/color-tokens.ts` | Semantic status color tokens | `StatusStyle` objects with bg/text/border/badgeVariant | ✅ Yes — well-defined | Use as single source of truth for status colors |
| `status-utils.ts` | `src/lib/status-utils.ts` | Workflow status config (label, type, color) | Status config map with 60+ status keys | ✅ Yes — comprehensive | Consolidate badge rendering to use this |
| `FormSubmissionLayout` | `src/components/forms/form-submission-layout.tsx` | Multi-step form with success screen | IOI header, multi-step skeleton, success confirmation | ✅ Yes — canonical form pattern | Document as standard; enforce for all new forms |
| `MultiStepForm` | `src/components/multi-step-form.tsx` | Step indicator + field renderer | Step progress, category selection, field rendering | ✅ Yes — good reusable pattern | Reuse within FormSubmissionLayout |
| `DynamicFormRenderer` | `src/components/forms/dynamic-form-renderer.tsx` | Config-driven form from `it-forms-config.ts` | Renders sections/fields from config | ✅ Yes — good for simple forms | Use as intermediate step for new forms |
| `ModuleHomeLayout` | `src/components/it/module-home-layout.tsx` | Per-module dashboard | Quick actions, submissions list, analytics | ✅ Yes — good reusable pattern | Document as standard for module homes |
| `DepartmentLayout` | `src/components/layouts/department-layout.tsx` | Department page layout with sidebar | Sidebar nav, header, content area | ✅ Yes — good reusable pattern | Document as standard for all department pages |
| `StandaloneLayout` | `src/components/layouts/standalone-layout.tsx` | Minimal header for shared pages | IOI Blue header, content, mobile nav | ✅ Yes — good for standalone pages | Document as standard |
| `DatabaseView` | `src/components/database-view/` | List/database view page | Table with search, filter, sort, pagination, detail modal | ✅ Yes — good reusable pattern | Document as standard for list views |
| `DatabaseTable` | `src/components/database-view/database-table.tsx` | Reusable table with filtering/sorting | Search, status/module/date filters, pagination, row click | ✅ Yes — comprehensive | Document as standard |
| `DynamicSubmissionDetails` | `src/components/submission-details/index.tsx` | Read-only detail field groups | Section cards with FieldRow, form-code-specific detail components | ✅ Yes — good reusable pattern | Extend to cover all forms |
| `SubmissionDetailPage` | `src/pages/submissions/[id].tsx` | Canonical detail page | Field groups, approval panel, status timeline, edit request | ✅ Yes — good reusable pattern | Route all details here where possible |
| `ApprovalWorkflowPanel` | `src/components/workflow/approval-workflow-panel.tsx` | Approval actions for approvers | Approve/Reject/Return buttons, comments | ✅ Yes — good reusable pattern | Document as standard |
| `StageProgress` | `src/components/workflow/stage-progress.tsx` | Visual workflow stage indicator | Progress bar/steps for multi-stage workflows | ✅ Yes — good reusable pattern | Document as standard |
| `WorkflowTimeline` | `src/components/workflow/workflow-timeline.tsx` | Audit trail timeline | Chronological action list with status | ✅ Yes — good reusable pattern | Document as standard |
| `EAF New Form Page` | `src/pages/it/forms/eaf/new.tsx` | EAF multi-step form | Custom multi-step with FormSubmissionLayout | ✅ Yes — good exemplar | Use as reference pattern for other forms |
| `IT Forms (sapamr, sapcr, etc.)` | `src/pages/it/forms/*/new.tsx` | Form-specific implementations | Various patterns — some use FormSubmissionLayout, some custom | ⚠️ Partially | Migrate to FormSubmissionLayout canonical pattern |
| `SAPDRP form` | `src/pages/it/forms/sapdrp/new.tsx` | Dynamic config-driven form | Uses DynamicFormRenderer | ⚠️ Partially | Evaluate upgrading to FormSubmissionLayout |
| EAF detail (`[id].tsx`) | `src/pages/it/forms/eaf/[id].tsx` | Form-specific detail page | Custom detail page outside canonical `/submissions/:id` | ❌ Duplicate | Route to canonical `/submissions/:id` |

---

## 5. UI Source of Truth Matrix

| UI Information | Primary Source of Truth | Secondary Source | Conflict Rule |
|---|---|---|---|
| **Page layout** | `docs/ui-page-specification.md` (this doc) | `DepartmentLayout` / `StandaloneLayout` components | This doc overrides |
| **Form layout** | `FormSubmissionLayout` component | `docs/ui-page-specification.md` | Component is reference implementation |
| **List/view layout** | `DatabaseView` + `DatabaseTable` components | `docs/ui-page-specification.md` | Component is reference implementation |
| **Detail layout** | `DynamicSubmissionDetails` + `SubmissionDetailPage` | `docs/ui-page-specification.md` | Component is reference implementation |
| **Component usage** | `src/components/ui/` (shadcn/ui) | `docs/ui-page-specification.md` | Component library is reference |
| **Typography** | `index.css` CSS variables + Tailwind typography | `docs/ui-page-specification.md` | Tailwind utility classes |
| **Font** | Tailwind default stack (Inter/system) + Work Sans from comments | `docs/ui-page-specification.md` | Use Tailwind `font-sans` |
| **Colors** | `index.css` CSS variables (`--primary`, `--status-*`, etc.) | `color-tokens.ts` for semantic status | CSS variables are source of truth |
| **Spacing** | Tailwind spacing scale (`px-4`, `gap-4`, `py-2`, etc.) | shadcn/ui conventions | Use Tailwind spacing |
| **Field labels** | `mapping/field-mapping.csv` + `it-forms-config.ts` | SharePoint column display names | Field mapping is source of truth |
| **Field visibility** | `it-forms-config.ts` (`visibleAtStages`, `conditionalField`) | `docs/ui-page-specification.md` | Config is source of truth |
| **Required fields** | `it-forms-config.ts` (`required: true`) | `mapping/field-mapping.csv` | Config is source of truth for UI |
| **Validation** | Zod schemas in `src/generated/validators/` | React Hook Form `resolver` | Generated validators are source of truth |
| **SharePoint column binding** | `src/generated/` models + hooks | `design/m365-design/sharepoint-list-design.md` | Generated code is source of truth |
| **Choice values** | `it-forms-config.ts` (options arrays) | SharePoint list column choices | Config is source of truth |
| **Role-based visibility** | `useRoleAccess` hook + department layouts | `docs/ui-page-specification.md` | Hook implementation is source of truth |
| **Status-based visibility** | `status-utils.ts` + `it-forms-config.ts` stage gating | `docs/ui-page-specification.md` | Config is source of truth |
| **Department-specific UI** | Department routes/modules in `src/routes/` | `src/config/departments/` | Route config is source of truth |

---

## 6. Typography, Font, Color, and Spacing Standards

### 6.1 Typography

| Element | Font / Style | Size | Weight | Color Token | Usage Rule |
|---------|------------|------|--------|-------------|-----------|
| App/Page title | `font-sans` (Tailwind default) | `text-xl` / `text-2xl` | `font-semibold` | `text-foreground` | Top of every page |
| Section title | `font-sans` | `text-sm` | `font-semibold` | `text-foreground` | Card headers, section dividers |
| Form label | `font-sans` | `text-sm` | `font-medium` | `text-foreground` | Above every form input |
| Form input text | `font-sans` | `text-sm` | `font-normal` | `text-foreground` | Input, select, textarea values |
| Helper text | `font-sans` | `text-xs` | `font-normal` | `text-muted-foreground` | Below form inputs |
| Error text | `font-sans` | `text-xs` | `font-medium` | `text-destructive` | Below invalid inputs |
| Button text | `font-sans` | `text-sm` | `font-medium` | `varies` | Inside button components |
| Table/list header | `font-sans` | `text-xs` | `font-medium` | `text-muted-foreground` | `TableHead` in tables |
| Table/list body | `font-sans` | `text-sm` | `font-normal` | `text-foreground` | `TableCell` in tables |
| Status badge | `font-sans` | `text-xs` | `font-medium` | `varies by status` | Via `StatusBadge` component |
| Empty state | `font-sans` | `text-base` | `font-normal` | `text-muted-foreground` | Via `Empty` component |
| Modal/surface title | `font-sans` | `text-lg` | `font-semibold` | `text-foreground` | Dialog/Sheet headers |
| Breadcrumb | `font-sans` | `text-sm` | `font-normal` | `text-muted-foreground` | Via `Breadcrumb` component |

**Existing implementation**: Uses Tailwind `font-sans` which defaults to system UI font stack. Comments in `index.css` mention Work Sans — if a custom font is loaded, apply via Tailwind config.

### 6.2 Color and Status Rules

**Primary tokens** (from `index.css`):

| Token | Value (Light) | Value (Dark) | Usage |
|-------|-------------|-------------|-------|
| `--primary` | `#003366` (IOI Blue) | `#3B82F6` | Primary buttons, active states |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` | Text on primary backgrounds |
| `--background` | `#FFFFFF` | `#121212` | Page background |
| `--foreground` | `#1C1C1C` | `#E8E8E8` | Primary text |
| `--card` | `#FFFFFF` | `#1E1E1E` | Card backgrounds |
| `--destructive` | `#9B2F23` | `#EF5350` | Delete/reject actions |
| `--sidebar` | `#003366` | `#001F3F` | Sidebar background |
| `--border` | `#D0D0D0` | `rgba(255,255,255,0.1)` | Borders and dividers |

**Semantic status colors** (from `color-tokens.ts`):

| Usage | Badge Variant | Background | Text | When To Use |
|-------|-------------|-----------|------|-------------|
| Primary action | `default` | `bg-primary` | `text-primary-foreground` | Submit, Save, Create |
| Secondary action | `secondary` | `bg-secondary` | `text-secondary-foreground` | Cancel, Back |
| Destructive action | `destructive` | `bg-destructive` | `text-destructive-foreground` | Delete, Reject |
| Success / Approved / Completed | `default` | `bg-primary` | `text-primary-foreground` | Status badges for terminal-good states |
| Warning / Pending / In Review | `outline` | — | — | Status badges for in-progress states |
| Error / Rejected | `destructive` | — | — | Status badges for rejected states |
| Disabled state | — | — | `text-muted-foreground` | Disabled inputs, inactive elements |
| Required field indicator | — | — | `text-destructive` | Asterisk or indicator on required fields |
| Draft | `secondary` | — | — | Initial/unsaved status |
| Submitted | `default` | — | — | After initial submission |

**Status-specific badge colors** (from `DatabaseTable.StatusBadge` — to be consolidated with `status-utils.ts`):

| Status | Background | Text Color |
|--------|-----------|-----------|
| Draft | `#E5E7EB` | `#6B7280` |
| Pending / Pending Approval | `#FEF3C7` | `#D97706` |
| Approved | `#D1FAE5` | `#10B981` |
| Rejected | `#FEE2E2` | `#EF4444` |
| Completed | `#DBEAFE` | `#3B82F6` |
| In Progress | `#E0E7FF` | `#6366F1` |
| Cancelled | `#F3F4F6` | `#9CA3AF` (strikethrough) |

> **⚠️ Rule**: Use `status-utils.ts` + `color-tokens.ts` for status badge rendering. Do not duplicate status color definitions. The `DatabaseTable.StatusBadge` should be refactored to use `status-utils.ts` functions.

### 6.3 Spacing, Layout, and Grid Rules

| UI Area | Layout Rule | Spacing Rule | Max Width / Columns | Notes |
|---------|-----------|-------------|--------------------|-------|
| Page container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | `py-6` | 1280px | Standard content width |
| Header area | `sticky top-0 z-40 h-14` | `px-4` | Full width | IOI Blue (`#003366`) background |
| Action bar | Horizontal flex with gap | `gap-2` | Full row | Buttons right-aligned |
| Form body | Single column on mobile, 2-col on desktop | `gap-6` sections, `gap-4` fields | `md:grid-cols-2` | Via `FormSubmissionLayout` |
| Section spacing | Sections separated by `Card` or divider | `mb-6` between sections | — | Use `Card` + `CardHeader` |
| Field spacing | Vertical stack or 2-col grid | `gap-4` between fields | `md:grid-cols-2` fields | Labels above inputs |
| Two-column layout | `grid grid-cols-1 md:grid-cols-2` | `gap-4` | 2 columns on `md+` | Use for field groups |
| One-column mobile | `grid-cols-1` (default) | `gap-4` | 1 column on mobile | Auto via responsive grid |
| List/table area | Full width with horizontal scroll | `p-4` | Responsive | Via `DatabaseView` |
| Detail view area | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | `gap-4` | 1-3 columns | Via `DynamicSubmissionDetails` |
| Modal/surface area | Centered with backdrop | `p-6` | `sm:max-w-lg` | Via `Dialog` / `Sheet` |
| Footer/action area | Bottom of form/modal | `pt-6`, `gap-2` buttons | Full row | Right-aligned buttons |
| Sidebar | Fixed left, 280px width | `p-4` | 280px | IOI Blue or dark background |

**Responsive breakpoints** (Tailwind defaults):
- `sm`: 640px — mobile landscape
- `md`: 768px — tablet / form 2-column
- `lg`: 1024px — desktop / 3-column detail
- `xl`: 1280px — wide desktop

---

## 7. Component Usage Standards

### 7.1 Existing Component Inventory

| Component | Path | Purpose | Use When | Do Not Use When | Required Props / Inputs | Notes |
|-----------|------|---------|----------|-----------------|------------------------|-------|
| `Button` | `ui/button` | Action buttons | Any clickable action | Navigation links (use `Link`) | `variant`, `size`, `onClick` | Use `variant="default"` for primary |
| `Input` | `ui/input` | Text input fields | Single-line text entry | Multi-line (use `Textarea`) | — | Wrapped in `Label` |
| `Textarea` | `ui/textarea` | Multi-line text | Paragraph/long text | Short text (use `Input`) | — | — |
| `Select` | `ui/select` | Dropdown selection | Choice fields, options | Boolean (use `Checkbox`) | `value`, `onValueChange` | Radix UI Select |
| `Checkbox` | `ui/checkbox` | Boolean/yes-no | Single toggle fields | Multi-select (use `Select`) | `checked`, `onCheckedChange` | — |
| `Badge` | `ui/badge` | Status indicators | Status display, tags | Clickable statuses (use `Button`) | `variant` | Variants: default/secondary/destructive/outline |
| `Card` | `ui/card` | Content grouping | Sections, field groups | Simple spacing (use `div`) | — | Use `CardHeader` + `CardContent` |
| `Dialog` | `ui/dialog` | Modal dialogs | Confirmations, forms | Full-page content (use Route) | `open`, `onOpenChange` | Radix UI Dialog |
| `Table` | `ui/table` | Data tables | List views, data grids | Simple lists (use `div`) | — | Use `TableHeader` + `TableBody` |
| `Tabs` | `ui/tabs` | Tabbed content | Multi-section detail views | Page navigation (use Routes) | `value`, `onValueChange` | Radix UI Tabs |
| `Separator` | `ui/separator` | Dividers | Between sections | Around every section (spacing is better) | — | Radix UI Separator |
| `Empty` | `ui/empty` | Empty state | No data to display | Loading state (use `Skeleton`) | — | Use `EmptyHeader`, `EmptyTitle`, `EmptyDescription` |
| `Skeleton` | `ui/skeleton` | Loading placeholder | Content loading | Loaded content | — | Animated pulse placeholder |
| `Spinner` | `ui/spinner` | Loading spinner | Action in progress | Static content | — | Use during async operations |
| `PeoplePicker` | `ui/people-picker` | Person/group selection | Approver, requestor fields | Non-person text fields | `value`, `onChange` | Uses M365 Users connector |
| `DatePicker` | via `Calendar` + `Popover` | Date selection | Date fields | Non-date text | — | Radix UI Popover + Calendar |
| `FormSubmissionLayout` | `forms/form-submission-layout` | Multi-step forms | Every new form page | Simple forms (use `DynamicFormRenderer`) | `formConfig`, `steps`, `fields` | **Canonical form pattern** |
| `MultiStepForm` | `multi-step-form` | Step indicators | Multi-step flows | Single-step forms | `steps`, `currentStep`, `onStepChange` | Wrapped in FormSubmissionLayout |
| `DynamicFormRenderer` | `forms/dynamic-form-renderer` | Config-driven forms | Simple/early forms | Complex forms (EAF, ITSSR) | `formConfig` | Use as intermediate implementation |
| `ModuleHomeLayout` | `it/module-home-layout` | Module dashboards | M1-M4 module home pages | Non-module pages | `moduleCode`, `quickActions`, `submissions` | **Canonical module home** |
| `DatabaseView` | `database-view/` | List/database view | Every list page | Simple lists (use `Table` directly) | `data`, `columns` | **Canonical list page** |
| `DatabaseTable` | `database-view/database-table` | Reusable table | Within DatabaseView | Detail views | `data`, `columns`, `onRowClick` | Includes search/filter/pagination |
| `DetailModal` | `database-view/detail-modal` | Detail modal | Quick-look details | Full detail page (use `/submissions/:id`) | `fieldGroups`, `approvalHistory` | For list view row clicks |
| `DynamicSubmissionDetails` | `submission-details/` | Read-only field groups | Detail pages, approval pages | Forms (use form components) | `submission`, `approvals` | **Canonical detail component** |
| `ApprovalWorkflowPanel` | `workflow/approval-workflow-panel` | Approval actions | Approver view on detail page | Non-approver view | — | **Canonical approval UI** |
| `StageProgress` | `workflow/stage-progress` | Workflow progress | Multi-stage workflows | Simple status | `stages`, `currentStage` | Shows stage completion |
| `WorkflowTimeline` | `workflow/workflow-timeline` | Audit trail | History/audit sections | Simple date display | `events` | Chronological action log |
| `EditRequestModal` | `workflow/edit-request-modal` | Request edits | Edit submitted records | New forms (use New form) | — | Enables edit workflow |
| `PageLoading` | `page-loading` | Page-level loading | Route/page loading | Component loading | — | Full-page loading state |
| `LoadingScreen` | `loading-screen` | App initialization | App startup loading | Page loading | — | Full-screen loading |

### 7.2 Component Usage Rules

| UI Element | Required Component | Notes |
|-----------|-------------------|-------|
| Page headers | `CardHeader` + `CardTitle` or typography classes | — |
| Form fields | `Label` + field component (`Input`/`Select`/etc.) | Labels above inputs |
| Form sections | `Card` with `CardHeader` + `CardContent` | Consistent spacing |
| Command buttons | `Button` component | Use correct variant |
| Status badges | `Badge` component + `status-utils.ts` colors | Do NOT define inline colors |
| Approval panels | `ApprovalWorkflowPanel` | **Required** for approval sections |
| List rows/tables | `DatabaseTable` inside `DatabaseView` | **Canonical list pattern** |
| Loading states | `Skeleton` for component, `PageLoading` for page | — |
| Errors | Toast via `sonner` (`toast.error()`) | — |
| Empty states | `Empty` component with `EmptyTitle`/`EmptyDescription` | — |
| Detail views | `DynamicSubmissionDetails` | **Canonical detail pattern** |
| Multi-step forms | `FormSubmissionLayout` | **Canonical form pattern** |
| Simple config-driven forms | `DynamicFormRenderer` | Use for forms without custom UI |
| Module home pages | `ModuleHomeLayout` | **Canonical module home** |

**Do not create a new component unless:**
1. No existing component satisfies the need
2. The new component has a documented purpose
3. It does not duplicate another component
4. It is added to this specification

---

## 8. Page Type Specifications

### 8.1 List / View Page

| Element | Required | Implementation | Notes |
|---------|----------|---------------|-------|
| Header | ✅ | Page title + "New" button | Use "New Request" button |
| Filters/search | ✅ | `DatabaseTable` built-in search | Text search across columns |
| Table/gallery columns | ✅ | `ColumnDef` array in `DatabaseTable` | Columns from form config or schema |
| Status display | ✅ | `StatusBadge` component | Using `status-utils.ts` colors |
| New button | ✅ | `Button` → `onClick` → navigate to `/path/new` | Prominent placement |
| Row click behavior | ✅ | `DatabaseTable.onRowClick` → navigate to detail or open `DetailModal` | Navigate to `/submissions/:id` |
| View filters (My Submissions / My Pending Tasks) | ✅ | `DatabaseTable` view filter | Tabs or dropdown |
| Date range filter | ✅ | `DatabaseTable` date range | Calendar-based |
| Module/status filter | ✅ | `DatabaseTable` dropdown filters | — |
| Export | ⬜ Optional | Future enhancement | CSV export |
| Pagination | ✅ | `DatabaseTable` built-in pagination | Page size selector |
| Empty state | ✅ | `Empty` component | When no records match |
| Loading state | ✅ | `Skeleton` rows | During data fetch |
| Error state | ✅ | Toast notification + retry button | — |

**Reference pattern**: `src/components/database-view/database-table.tsx`

### 8.2 New Form Page

| Element | Required | Implementation | Notes |
|---------|----------|---------------|-------|
| Form wrapper | ✅ | `FormSubmissionLayout` | **Canonical pattern** |
| Step indicator | ✅ | `MultiStepForm` step progress | For multi-step flows |
| Required fields | ✅ | Marked with indicator | Config in `it-forms-config.ts` |
| Default values | ✅ | Auto-filled from user context | Via `useUser()` |
| Save as draft | ✅ | `onSaveDraft` callback | — |
| Submit | ✅ | `onSubmit` callback | — |
| Cancel | ✅ | Navigate back | With unsaved changes warning |
| Validation | ✅ | Zod schema + React Hook Form | Generated validators |
| Success screen | ✅ | `FormSubmissionLayout` success state | Ticket ID, confirmation |
| People picker | ✅ | `PeoplePicker` component | From M365 Users |
| Parent-child creation | ⚠️ Config-specific | Via `hasExtRecord` in form config | EAF/NIR create ext records |

**Reference pattern**: `src/pages/it/forms/eaf/new.tsx`

### 8.3 Edit / Update Form Page

| Element | Required | Implementation | Notes |
|---------|----------|---------------|-------|
| Same canonical form | ✅ | Reuse `FormSubmissionLayout` | Same component as New |
| Existing data loading | ✅ | Load by ID from SharePoint | — |
| Editable vs read-only fields | ✅ | Via `disabled` prop or `DisplayMode` | Status/workflow-controlled |
| Save/update behavior | ✅ | `useUpdateMainDBIT` hook | — |
| Validation | ✅ | Same Zod schema as New | — |
| Audit fields | ✅ | Auto-set `Modified`, `Editor` | SharePoint handles |
| Status-controlled behavior | ✅ | Via `status-utils.ts` + config | Locked when in progress |
| Edit request workflow | ✅ | `EditRequestModal` for submitted records | — |

> **Current implementation**: Edit mode for submitted records uses the `EditRequestModal` workflow (request → approve → edit → re-submit) rather than a separate edit form page.

### 8.4 Detail / View-Only Page

| Element | Required | Implementation | Notes |
|---------|----------|---------------|-------|
| Read-only layout | ✅ | `DynamicSubmissionDetails` | **Canonical pattern** |
| Status panel | ✅ | `Badge` + `StageProgress` | Shows current status |
| Approval history | ✅ | `WorkflowTimeline` | Audit trail |
| Attachments | ✅ | File list with download | — |
| Related child/checklist items | ✅ | `Tabs` for child records | If applicable |
| Edit button visibility | ✅ | Role-based via `useRoleAccess` | — |
| Back navigation | ✅ | "Back" button or breadcrumb | — |
| Withdraw/Cancel | ✅ | Action buttons for initiator | — |
| Edit request | ✅ | `EditRequestModal` for submitted | — |
| Approval actions | ✅ | `ApprovalWorkflowPanel` for approvers | — |

**Reference pattern**: `src/pages/submissions/[id].tsx`

### 8.5 Approval Page / Section

| Element | Required | Implementation | Notes |
|---------|----------|---------------|-------|
| Approver role visibility | ✅ | `ApprovalWorkflowPanel` checks role | — |
| Approve button | ✅ | `Button variant="default"` | — |
| Reject button | ✅ | `Button variant="destructive"` | — |
| Return button | ✅ | `Button variant="secondary"` | Optional |
| Comments required for rejection | ✅ | `Textarea` with validation | Required for reject/return |
| Status transition | ✅ | Updates `CurrentStatus` accordingly | — |
| Notification expectations | ✅ | Email via `useSendApprovalEmail` | — |
| Audit/history update | ✅ | Auto-logged via Power Automate or service | — |

**Reference paths**: `src/components/workflow/approval-workflow-panel.tsx`, `src/pages/approvals.tsx`

### 8.6 Modal / Surface Page

| Element | Required | Implementation | Notes |
|---------|----------|---------------|-------|
| When to use | ✅ | Confirmations, quick edits, filters | Not for complex flows |
| Header/body/footer | ✅ | `DialogHeader` + content + `DialogFooter` | — |
| Dismiss behavior | ✅ | X button + click outside + Escape | — |
| Save/cancel behavior | ✅ | Primary + secondary buttons | — |
| Accessibility | ✅ | Radix UI Dialog handles ARIA | — |

**Reference**: `src/components/ui/dialog.tsx`, `src/components/database-view/detail-modal.tsx`

---

## 9. Canonical Form Specification

### 9.1 Form Mode Rules

| Mode | Entry Point | Form Component | Fields | Actions |
|------|------------|---------------|-------|---------|
| **New** | `/path/new` | `FormSubmissionLayout` | All editable, empty | Save Draft, Submit, Cancel |
| **View** | `/submissions/:id` | `DynamicSubmissionDetails` | All read-only | Back, Withdraw/Cancel (if initiator) |
| **Edit** | Via `EditRequestModal` on detail page | Edit request workflow | Editable per request | Submit edit request, Cancel |
| **Approval** | `/approvals` or embedded on detail page | `ApprovalWorkflowPanel` | Read-only + action buttons | Approve, Reject (with comment), Return |

> **Rule**: Prefer one canonical form per business process. New/View/Approval modes use the same data model with different components. Edit uses a separate workflow for submitted records.

### 9.2 Form Pattern (New)

| Property | Specification |
|----------|-------------|
| **Component** | `FormSubmissionLayout` wrapping form steps |
| **Steps** | Multi-step `FormStep[]` defining the wizard flow |
| **Fields per step** | `FormFieldConfig[]` with type, label, required, options |
| **Data source** | `useCreateMainDBIT` (or typed variant) for MainDB_IT |
| **Extension records** | `useCreateMainDBITExt*` for extension lists (if `hasExtRecord`) |
| **Submit logic** | `retryWithBackoff` wrapper → create MainDB_IT → create ext record → send email |
| **Validation** | Zod schema via `react-hook-form` + `@hookform/resolvers` |
| **Success state** | `FormSuccessScreen` with ticket ID, copy, and navigation |
| **Error state** | Toast notification with retry |
| **Auto-fill** | `useUser()` for requestor name, email, department |
| **People picker** | `PeoplePicker` component using M365 Users connector |
| **Stage gating** | `isStageGated` sections hidden until workflow reaches that stage |

### 9.3 Default Form Steps (Example — EAF Pattern)

| Step | Name | Description | Key Fields |
|------|------|-------------|-----------|
| 1 | Requestor | Your information | Company, Requestor, Submitted on |
| 2 | Access Details | What access is needed | User ID, User Name, System, Application |
| 3 | Justification | Business reason | Justification, HOD, CC |
| 4 | Review | Confirm & submit | Summary of all fields, Save/Submit buttons |

---

## 10. Field Display and Data Binding Rules

### 10.1 Field Binding Table

| UI Field Label | SharePoint Column | Source Evidence | Control Type | Display Rule | Edit Rule | Required Rule | Notes |
|---------------|------------------|---------------|-------------|-------------|-----------|-------------|-------|
| Company | `Company` | DXL/PDF | `Select` | Always | Editable on New | Required | Options from `IOI_COMPANY_OPTIONS` |
| Requestor | `Requestor_Name` | DXL/PDF | `PeoplePicker` | Always | Auto-filled, read-only | Required | From `useUser()` |
| User Name | `TargetUser` | DXL/PDF | `PeoplePicker` | Always | Editable | Required | M365 Users picker |
| System | `SystemName` | DXL/PDF | `Select` | Always | Editable | Required | Options from `EAF_SYSTEMS` |
| Application | `ApplicationType` | DXL/PDF | `Select` | Always | Editable | Required | VPN/Citrix/Both |
| Justification | `Description` | DXL/PDF | `Textarea` | Always | Editable | Required | Multi-line |
| HOD | `HODApprover` | DXL/PDF | `PeoplePicker` | Always | Editable | Required | Department head |
| Status | `CurrentStatus` | Workflow | `Badge` | Always | Read-only | — | From `status-utils.ts` |
| Submitted Date | `SubmittedDate` | Auto | Date display | Always | Auto-set | — | `=Now` on submit |

> **Rule**: Every displayed field must have a source in `mapping/field-mapping.csv`, SharePoint schema, or documented derived logic. Field labels must match approved UI labels in `it-forms-config.ts`. No placeholder/demo fields.

### 10.2 Field Label Convention

- Labels are UPPERCASE for section titles (e.g., "REQUESTOR'S SECTION")
- Labels are Title Case for field labels (e.g., "Company", "User Name")
- Helper text is sentence case (e.g., "Select department head who will approve this request")
- Error text matches field label case

---

## 11. Visibility and Editability Rules

### 11.1 Visibility Matrix

| Page / Section / Field | Visible When | Editable When | Hidden When | Source Evidence | Implementation |
|------------------------|-------------|--------------|-------------|---------------|---------------|
| Form fields (New) | Mode=New | Always | Mode=View/Approval | DXL form design | `FormSubmissionLayout` |
| Stage-gated sections | Workflow stage matched | Current stage only | Other stages | DXL workflow | `isStageGated` + `visibleAtStages` |
| Dept Head Approval section | Status=S2 onward | Current approver | Before S2 | EAF workflow | `stage-gated-section.tsx` |
| Approval buttons | User is current approver | — | User is not approver | Role matrix | `ApprovalWorkflowPanel` |
| Withdraw/Cancel button | User is initiator, status is not terminal | — | Not initiator or terminal | Workflow rules | Role check |
| Edit request button | User is initiator, status is in-progress | — | Not initiator or completed | Workflow rules | `EditRequestModal` |
| Admin fields | User role=Admin | Admin | Non-admin users | Role check | `useRoleAccess` |
| Department-specific sections | FormCode matches department | — | Other departments | Form config | Route-based |
| Conditional sections | Condition field value matches | Same as parent section | Condition not met | DXL evidence | `conditionalField` in config |
| Attachment section | Form has attachment support | — | Form has no attachments | DXL evidence | `attachments/` component |

### 11.2 Power Fx / React Formula Guidance

```tsx
// Visibility pattern (React/TypeScript)
const isFieldVisible = useMemo(() => {
  if (formConfig.sections.find(s => s.id === sectionId)?.isStageGated) {
    return visibleAtStages.includes(currentStage);
  }
  return sectionMatchesCondition(section);
}, [currentStage, formData, sectionId]);

// Editability pattern
const isFieldEditable = useMemo(() => {
  if (mode === 'view' || mode === 'approval') return false;
  if (formData.currentStatus !== 'Draft') return false;
  return true;
}, [mode, formData.currentStatus]);

// Display mode pattern
const displayMode = isFieldEditable ? 'edit' : 'view';
```

---

## 12. Duplicate UI Prevention Rules

### 12.1 Pre-Creation Checklist

| New UI Request | Must Check First | Duplicate Risk | Required Action |
|---------------|-----------------|---------------|----------------|
| New page | `src/pages/`, `src/routes/`, `src/App.tsx` | Route already exists | Reuse existing route |
| New form | `src/pages/*/forms/`, `it-forms-config.ts` | Form already implemented | Extend existing form |
| New component | `src/components/ui/`, `src/components/` | Component exists in shadcn/ui or custom | Reuse existing component |
| New field in UI | `mapping/field-mapping.csv`, `it-forms-config.ts` | Field already displayed elsewhere | Reuse binding, do not duplicate |
| New model/service | `src/generated/models/`, `src/generated/services/` | Model auto-generated | Use generated model |
| New layout | `src/components/layouts/` | Layout pattern already defined | Use `DepartmentLayout` or `StandaloneLayout` |
| New detail page | `/submissions/:id` route | Canonical detail page exists | Route to canonical page |
| New list page | `DatabaseView` component | Generic list view exists | Use `DatabaseView` + `DatabaseTable` |

### 12.2 Prevention Rules

1. **Do not create a new page** if an existing route can be reused or extended.
2. **Do not create a new form** if the canonical `FormSubmissionLayout` pattern can support the mode.
3. **Do not create a new component** if an existing component (shadcn/ui or custom) can be extended safely.
4. **Do not add a field to UI** unless it exists in `mapping/field-mapping.csv` or SharePoint schema.
5. **Do not show the same field twice** on the same page unless documented and intentional.
6. **Do not create a new service/model** just to support a duplicate UI — use generated models.
7. **Do not create a new layout** unless neither `DepartmentLayout` nor `StandaloneLayout` fits the requirement.

---

## 13. Page-by-Page Inventory

### 13.1 IT Department Pages

| Page / Screen | Path | Page Type | Uses Component(s) | Data Source(s) | Fields Displayed | Actions | Alignment Status |
|--------------|------|-----------|------------------|---------------|-----------------|---------|-----------------|
| IT Dept Home | `/it` | Department module hub | `DepartmentLayout`, module links | — | Module cards | Navigate to modules | ✅ Aligned |
| M1: User & Access | `/it/access` | Module home | `ModuleHomeLayout`, `DataReadyGuard`, `Card`, `Input`, `Badge`, `Button` | `MainDB_IT` | Module cards, quick actions, submissions list | View, New, Navigate | ✅ Aligned |
| M2: IT Support | `/it/support` | Module home | `ModuleHomeLayout`, `DataReadyGuard`, `Card`, role config | `MainDB_IT` | Module cards, quick actions, submissions list, role config | View, New, Navigate, Role config | ✅ Aligned |
| EAF New | `/it/forms/eaf/new` | Multi-step new form | `FormSubmissionLayout`, `MultiStepForm`, `PeoplePicker`, `Select`, `Input`, `Textarea` | `MainDB_IT`, `MainDB_IT_Ext_Access` | EAF fields (Company, Requestor, User, System, Application, etc.) | Submit, Save Draft | ✅ Aligned |
| EAF Detail | `/it/forms/eaf/[id]` | Detail page | Custom detail (not using canonical `/submissions/:id`) | `MainDB_IT` | EAF field display | — | ❌ Duplicate — route to canonical |
| ITSSR New | `/it/forms/itssr/new` | Multi-step new form | Custom ITSSR intake | `MainDB_IT`, `MainDB_IT_Ext_Support` | ITSSR fields | Submit | ⚠️ Partially aligned — custom not using `FormSubmissionLayout` |
| ITSSR List | `/it/forms/itssr/` | List/database view | Custom list | `MainDB_IT`, `MainDB_IT_Ext_Support` | ITSSR columns | View, Filter, Navigate | ⚠️ Partially aligned — custom list |
| ITSSR Detail | `/it/forms/itssr/[id]` | Detail page | Custom detail with tabs | `MainDB_IT`, `MainDB_IT_Ext_Support` | ITSSR field display, triage actions | Triage, Assign, Resolve | ⚠️ Partially aligned — form-specific triage actions justified |
| Hardware | `/it/hardware` | Module view | Custom | `MainDB_IT`, `MainDB_IT_Ext_Assets` | HI fields | View, Filter | ✅ Aligned |
| Hardware Dashboard | `/it/hardware-dashboard` | Analytics dashboard | Custom | `MainDB_IT` | Stats, charts | — | ✅ Aligned |
| SAP | `/it/sap` | Module hub | Custom | `MainDB_IT` | SAP form cards | Navigate | ✅ Aligned |
| SAP Forms (various) | `/it/forms/sap*/new` | New forms | `FormSubmissionLayout` or custom | `MainDB_IT`, `MainDB_IT_Ext_SAP` | Form-specific fields | Submit | ⚠️ Partially aligned — some use `FormSubmissionLayout`, some custom |
| Dynamic Forms (RS, SFAR, UR, DCAL, etc.) | `/it/forms/:code/new` | Config-driven new form | `DynamicFormRenderer` | `MainDB_IT` | Config-defined fields | Submit | ⚠️ Partially aligned — `DynamicFormRenderer` is simpler but less feature-rich |
| Form List Views (ITSC, IOIP, SRL, etc.) | `/it/forms/:code` | Database view | `DatabaseView` variant | `MainDB_IT` | Form-specific columns | View, Filter | ✅ Aligned |
| Activity Log | `/it/activity-log` | Database view | Custom | `MainDB_IT` | IAL1-5 records | View, Filter | ✅ Aligned |

### 13.2 Shared Pages

| Page / Screen | Path | Page Type | Uses Component(s) | Data Source(s) | Fields Displayed | Actions | Alignment Status |
|--------------|------|-----------|------------------|---------------|-----------------|---------|-----------------|
| Dashboard | `/dashboard` | Analytics | Custom with `Recharts` | `MainDB_IT` | Stats charts | Navigate | ✅ Aligned |
| Department Hub | `/` (landing) | Hub | Custom card grid | Department config | Department cards | Navigate by dept | ✅ Aligned |
| Approvals | `/approvals` | Approval list | `DatabaseTable` variant | `MainDB_IT`, `ApprovalRecords` | Pending approvals | Approve, Reject, Return | ✅ Aligned |
| My Submissions | `/my-submissions` | List/view | `DatabaseView` | `MainDB_IT` | User's submissions | View, Filter | ✅ Aligned |
| Submission Detail | `/submissions/:id` | Detail page | `DynamicSubmissionDetails`, `ApprovalWorkflowPanel`, `StageProgress`, `WorkflowTimeline`, `EditRequestModal` | `MainDB_IT`, `ApprovalRecords`, `WorkflowAuditLog` | All form fields grouped by section | Approve, Reject, Return, Edit Request, Withdraw, Cancel | ✅ Aligned — **Canonical detail page** |
| Manager Dashboard | `/manager-dashboard` | Approval list | Custom | `MainDB_IT` | Team submissions | Approve, Reject | ✅ Aligned |
| Batch Approvals | `/batch-approvals` | Batch action | Custom | `MainDB_IT`, `ApprovalRecords` | Selected submissions | Batch Approve/Reject | ✅ Aligned |
| Admin | `/admin` | Admin panel | Tabbed admin panels | Config lists | System settings | CRUD on config | ✅ Aligned |
| Bug Admin | `/bug-admin` | Admin panel | Custom | `IssueAndBugTracker` | Bug reports | Status/priority update | ✅ Aligned |
| Settings | `/settings` | User settings | Custom | User config | User preferences | Save | ✅ Aligned |
| Help | `/help` | Static content | Custom | — | FAQ, guides | Navigate | ✅ Aligned |

### 13.3 Department Pages (Non-IT — Structure Review)

| Page / Screen | Path | Page Type | Alignment Status | Notes |
|--------------|------|-----------|-----------------|-------|
| HR Module | `/hr/*` | Department with sub-modules | ✅ Aligned | Sidebar nav, module-specific forms |
| STR Module | `/str/*` | Department with sub-modules | ✅ Aligned | Uses `MainDB_STR` list |
| Finance Module | `/fin/*` | Department with sub-modules | ✅ Aligned | Uses `MainDB_FIN` list |
| Production Module | `/production/*` | Department with sub-modules | ✅ Aligned | Uses `MainDB_PRD` list |
| Other departments | `/*` | Stub/placeholder | ✅ Aligned | Basic routing configured |

---

## 14. UI Update Governance Rules

| Change Type | Must Update | Must Check | Required Reviewer / Confirmation |
|------------|-------------|-----------|--------------------------------|
| New page created | This doc (Page-by-Page Inventory) | Existing routes for duplicates | AI/Developer confirmation |
| Page removed | This doc (Page-by-Page Inventory) | Route references | AI/Developer confirmation |
| Form field added | `it-forms-config.ts`, this doc (Field Binding) | Field mapping, SharePoint schema | Cross-reference with evidence |
| Form field removed | `it-forms-config.ts`, this doc (Field Binding) | Field mapping, SharePoint schema | Cross-reference with evidence |
| Field label changed | `it-forms-config.ts`, this doc (Field Binding) | Existing labels in all forms | No duplicate labels |
| Field requirement changed | `it-forms-config.ts` | SharePoint column required flag | Must match SP schema |
| Validation changed | Generated validators, this doc | Zod schema, SP column validation | Must match SP constraints |
| Visibility rule changed | `it-forms-config.ts`, this doc (Visibility) | Workflow stage, role config | Cross-reference with Domino evidence |
| Component added | This doc (Component Inventory) | Existing components for duplicates | No duplicate components |
| Component changed | This doc (Component Inventory) | All usages across pages | No breaking changes |
| Typography changed | This doc (Typography), `index.css` | All text elements, dark mode | Consistent update |
| Color/status rule changed | This doc (Color Rules), `index.css`, `color-tokens.ts` | All status badge usages | Consistent update |
| SharePoint column changed | `design/m365-design/sharepoint-list-design.md`, `mapping/field-mapping.csv` | All generated models/services | Regenerate models |
| Workflow status changed | `status-utils.ts`, this doc | All status badge references | Consistent update |
| Approval logic changed | This doc, Power Automate flows | Role matrix, `ApprovalWorkflowPanel` | Cross-reference with workflow analysis |
| Department-specific UI changed | This doc, department route config | Department config | Consistent with other depts |
| New component library added | This doc (Component Standards) | Duplicate to shadcn/ui | Avoid library bloat |

---

## 15. Recommended Files to Create or Update

| File | Action | Reason | Safe Condition |
|------|--------|--------|---------------|
| `docs/ui-page-specification.md` | ✅ **Create** | Single source of truth for UI design | This document |
| `.github/instructions/domino-migration.instructions.md` | ✅ **Update** | Add UI Specification Governance section | After this doc is created |
| `src/components/database-view/database-table.tsx` | ⚠️ **Refactor** | `StatusBadge` should use `status-utils.ts` | After UI spec is approved |
| `src/pages/it/forms/eaf/[id].tsx` | ⚠️ **Consider redirect** | Route to canonical `/submissions/:id` | After confirming no form-specific features are lost |
| `src/pages/it/forms/itssr/new.tsx` | ⚠️ **Consider upgrade** | Migrate to `FormSubmissionLayout` canonical pattern | After UI spec is approved |
| Other custom form pages | ⚠️ **Evaluate** | Migrate to canonical patterns incrementally | Per-form priority basis |

---

## 16. Full UI Specification Document Content

> This document itself (`docs/ui-page-specification.md`) IS the full UI specification. The sections above constitute the complete specification content.

### Document Location

```
docs/ui-page-specification.md
```

### Document Governance

- **Owner**: Migration Team
- **Review Cycle**: Before any UI change that introduces a new pattern
- **Version Tracking**: Via git commit history
- **Conflicts**: This document overrides ad-hoc UI decisions. If a conflict arises between this spec and an existing implementation, log the conflict in `docs/risks-assumptions-questions.md` and resolve via the UI Update Governance rules (Section 14).

---

## 17. Active Instruction File Update

### File to Update

```
.github/instructions/domino-migration.instructions.md
```

### Instruction Block to Add

Add the following section after the existing "Hard Rules" section (before "Departments (for reference)"):

```markdown
## UI Specification Governance

Before creating or updating any screen, page, form, component, model, service, or UI-related formula, check `docs/ui-page-specification.md`.

Use the UI specification as the source of truth for:
- page layout
- form layout
- typography
- font usage
- spacing
- component usage
- field display
- data binding
- visibility rules
- editability rules
- no-duplicate UI rules

### Rules

1. **Use existing components first** — Check `src/components/ui/` and `src/components/` before creating new ones. Reuse shadcn/ui components where practical.
2. **Use canonical form pattern** — New forms must use `FormSubmissionLayout` from `src/components/forms/form-submission-layout.tsx`. Use `DynamicFormRenderer` only as an intermediate step for simple forms.
3. **Use canonical list pattern** — List views must use `DatabaseView` + `DatabaseTable` from `src/components/database-view/`.
4. **Use canonical detail pattern** — Detail pages must route to `/submissions/:id` and use `DynamicSubmissionDetails` + `ApprovalWorkflowPanel` where practical.
5. **Use canonical layout** — Department pages use `DepartmentLayout`. Shared pages use `StandaloneLayout`.
6. **Use canonical module home** — Module dashboard pages use `ModuleHomeLayout` from `src/components/it/module-home-layout.tsx`.
7. **Use existing design tokens** — Colors, spacing, and typography from `src/index.css` CSS variables. Status colors from `src/lib/color-tokens.ts` and `src/lib/status-utils.ts`.
8. **Do not duplicate fields** — Every displayed field must exist in `mapping/field-mapping.csv`, SharePoint schema, or documented derived logic.
9. **Do not duplicate pages** — Check all routes in `src/App.tsx` and department route files before creating a new page.
10. **Do not duplicate components** — Check existing components before creating new ones.

### Conflict Resolution

If the requested UI change conflicts with the specification:
1. Do not implement the change immediately.
2. Document the conflict.
3. Recommend whether the specification should be updated or the requested change should be adjusted.
4. Ask for confirmation if the conflict affects business behavior, field mapping, workflow, or data source usage.

Do not create duplicate pages, forms, components, models, services, or fields. Reuse the canonical UI pattern and existing components where practical.
```

---

## 18. Validation Checklist

| # | Check | Action | Expected Result | Status |
|---|-------|--------|----------------|--------|
| 1 | Existing UI reviewed | Inspected all page types, components, layouts, themes, routes | Complete inventory in Section 4 | ✅ |
| 2 | Existing components reviewed | Reviewed `src/components/ui/` (70+), `src/components/` (30+) | Complete inventory in Section 7.1 | ✅ |
| 3 | Typography source identified | Found in `index.css` CSS variables + Tailwind defaults | Documented in Section 6.1 | ✅ |
| 4 | Color tokens source identified | Found in `index.css`, `color-tokens.ts`, `status-utils.ts` | Documented in Section 6.2 | ✅ |
| 5 | Component standards documented | Component inventory + usage rules in Section 7 | Complete | ✅ |
| 6 | Page type standards documented | 6 page types defined in Section 8 | Complete | ✅ |
| 7 | Canonical form pattern documented | `FormSubmissionLayout` documented in Section 9 | Complete | ✅ |
| 8 | Field binding rules documented | Field binding table in Section 10 | Complete | ✅ |
| 9 | Duplicate UI rules documented | Pre-creation checklist + prevention rules in Section 12 | Complete | ✅ |
| 10 | Active instruction file updated | `.github/instructions/domino-migration.instructions.md` updated | Pending - see Section 17 | ⬜ |
| 11 | New UI work required to check specification | Rule added to active instructions | Pending | ⬜ |
| 12 | Page inventory created | Complete IT + shared + dept page inventory in Section 13 | Complete | ✅ |
| 13 | UI governance rules documented | Change type × required action matrix in Section 14 | Complete | ✅ |
