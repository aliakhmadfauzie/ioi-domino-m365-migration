# UI Design vs Specification Audit

> **Date**: 2026-06-01
> **Spec Source**: `docs/ui-page-specification.md`
> **Scope**: LOG (11 forms), MTN/Maintenance (4 forms), EAF (reference)

---

## Summary

| Check | Passing | Failing | Score |
|---|---|---|---|
| Uses `FormSubmissionLayout` | 0 | 15 forms | ❌ 0% |
| Uses CSS variables (not hardcoded colors) | 0 | 15 forms | ❌ 0% |
| Uses `status-utils.ts` for status badges | 0 | 0 forms with badges | ❌ N/A |
| Uses `Card` + `CardHeader` + `CardContent` | 15 | 0 | ✅ 100% |
| Uses `Label` + `Input`/`Select` pattern | 15 | 0 | ✅ 100% |
| Uses `Button` with proper variants | 11 | 4 (plain `<button>`) | ⚠️ 73% |
| Uses proper spacing (`gap-4`, `p-6`) | 15 | 0 | ✅ 100% |
| Uses `motion` for animations | 15 | 0 | ✅ 100% |
| Uses `sonner` toast for errors | 15 | 0 | ✅ 100% |
| Responsive grid (`md:grid-cols-2`) | 15 | 0 | ✅ 100% |

---

## Detailed Findings

### FINDING-UI-1: Forms bypass `FormSubmissionLayout`

**Spec**: Section 7.2 states `FormSubmissionLayout` is the **canonical form pattern** — every new form must use it.

**Actual**: All 15 LOG and MTN forms implement custom multi-step logic with manual `currentStep` state, custom step indicators, and manual success screens.

**Affected forms**: CSD, TI, POD, FBN, ECMFB, GTPW, TMI, WCC, SHUNTING, IMDG, FJB, FAR, MTP, MECP, EPI

**Impact**: 150+ lines of duplicated boilerplate per form (step management, success screen, navigation). Inconsistent step indicator styling.

**Fix**: Refactor to use `FormSubmissionLayout` which provides:
- `formConfig`, `steps`, `fields` props
- Built-in step indicator with `MultiStepForm`
- Built-in success confirmation screen
- Consistent header, spacing, navigation

---

### FINDING-UI-2: Hardcoded colors instead of CSS variables

**Spec**: Section 6.2 states use CSS variables (`--background`, `--primary`, `--foreground`, etc.).

**Actual**: All LOG/MTN forms use:
- `bg-[#F5F5F5]` instead of `bg-muted` or `bg-background`
- `text-[#1C1C1C]` instead of `text-foreground`
- `text-black` instead of `text-foreground`
- `shadow-[0_4px_14px_rgba(0,0,0,0.12)]` instead of `shadow-lg`

**Affected**: All 15 LOG/MTN forms

**Impact**: Dark mode broken. Theme changes require editing every form. Accessibility contrast not guaranteed.

**Fix**: Replace hardcoded values:
- `bg-[#F5F5F5]` → `bg-muted` (or `bg-background`)
- `text-[#1C1C1C]` → `text-foreground`
- `shadow-[0_4px_14px_rgba(0,0,0,0.12)]` → `shadow-lg`
- `text-gray-500` → `text-muted-foreground`

---

### FINDING-UI-3: No status badges using `status-utils.ts`

**Spec**: Section 7.2 "Status badges — use `Badge` component + `status-utils.ts` colors. Do NOT define inline colors."

**Actual**: LOG and MTN forms don't display status badges on submission screens (they show `CheckCircle` icons instead). When status badges are added later, they must use the centralized utility.

**Affected**: All 15 LOG/MTN forms (latent issue)

**Impact**: When list/detail views are added for LOG/MTN, status colors will need to follow spec. Currently not an active bug.

**Fix**: Pre-create status config entries in `status-utils.ts` for LOG/MTN form codes before building list pages.

---

### FINDING-UI-4: Navigation back buttons use plain `<button>` instead of `Button` component

**Spec**: Section 7.1 "Any clickable action — use `Button` component."

**Actual**: Back buttons use raw `<button>` elements:
```tsx
<button onClick={() => navigate(-1)} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-700">
  <ArrowLeft className="mr-1 h-4 w-4" /> Back
</button>
```

**Affected**: FAR, MTP, WCC, SHUNTING, IMDG, FJB (6 forms)

**Fix**: Replace with `Button variant="ghost" size="sm"`.

---

### FINDING-UI-5: Mock customer data instead of SharePoint lookup

**Spec**: Section 6.3 - values should come from config or SharePoint lists.

**Actual**: CSD form has `MOCK_CUSTOMERS` array hardcoded in the page.

**Affected**: CSD form only

**Impact**: Customer list is static. Adding new customers requires code change.

**Fix**: Replace with data from `Config_Companies` or `config_companies` SharePoint list.

---

## Compliance Scorecard

| Form | FormSubmissionLayout | CSS Variables | Badge Utils | Button Component | Back Nav Component | Mock Data |
|---|---|---|---|---|---|---|
| **LOG - CSD** | ❌ | ❌ | N/A | ✅ | ❌ (mock data) |
| **LOG - TI** | ❌ | ❌ | N/A | ✅ | ✅ | ✅ |
| **LOG - POD** | ❌ | ❌ | N/A | ✅ | ✅ | ✅ |
| **LOG - FBN** | ❌ | ❌ | N/A | ✅ | ✅ | ✅ |
| **LOG - ECMFB** | ❌ | ❌ | N/A | ✅ | ✅ | ✅ |
| **LOG - GTPW** | ❌ | ❌ | N/A | ✅ | ✅ | ✅ |
| **LOG - TMI** | ❌ | ❌ | N/A | ✅ | ✅ | ✅ |
| **LOG - WCC** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |
| **LOG - SHUNTING** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |
| **LOG - IMDG** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |
| **LOG - FJB** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |
| **MTN - FAR** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |
| **MTN - MTP** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |
| **MTN - MECP** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |
| **MTN - EPI** | ❌ | ❌ | N/A | ✅ | ❌ | ✅ |

✅ = Compliant | ❌ = Non-compliant | N/A = Not applicable

---

## Recommendations

| Priority | Action | Effort |
|---|---|---|
| P0 | **Fix FINDING-UI-2**: Replace hardcoded colors with CSS variables across all 15 forms | 1 hour (find/replace) |
| P1 | **Fix FINDING-UI-4**: Replace raw `<button>` with `Button` component in 6 forms | 15 min |
| P1 | **Fix FINDING-UI-1**: Refactor one form (e.g., FAR) to use `FormSubmissionLayout` as proof of concept | 2 hours |
| P2 | **Fix FINDING-UI-5**: Replace mock customers with SharePoint list lookup | 1 hour |
| P3 | **Add status-utils.ts entries** for LOG/MTN form codes before building list pages | 30 min |
