# Decision Log

> Append-only. Never delete a decision. Mark superseded decisions as SUPERSEDED with reference to the replacement.
> Last updated: 2026-06-02

---

## Decision Format

Each entry uses:
- **ID** — unique identifier
- **Date** — when decision was made
- **Area** — architecture / data / workflow / component / naming / scope
- **Decision** — what was decided
- **Rationale** — why this was chosen
- **Alternatives Considered** — what was rejected and why
- **Impact** — what this affects
- **Status** — ACTIVE / SUPERSEDED / DEFERRED

---

## DEC-001 — Target Platform

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Architecture |
| Decision | Microsoft Power Apps Canvas App is the final target. TSX/React app is reference only. |
| Rationale | TSX code-first Power Apps is non-standard, harder to maintain, and does not integrate cleanly with M365 approval flows. Canvas App is the supported path for SP-backed forms with role-based approval. |
| Alternatives Considered | Continue TSX code-first — rejected because it does not use native Canvas connectors and is not maintainable by business teams. |
| Impact | All Canvas implementation uses Canvas controls, Power Fx, and SP connector. No React or TypeScript in the final app. |
| Status | ACTIVE |

---

## DEC-002 — Screen Count Strategy

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Architecture |
| Decision | 15 canonical parameterized screens for all 361 forms. Not 361 individual screens. |
| Rationale | Canvas App has practical screen limits (~500). 361 forms × 3 modes (New/Edit/View) = 1,000+ screens if per-form. Parameterized approach uses global variables (gblActiveFormCode, gblActiveDept) to drive form context. |
| Alternatives Considered | Per-form screens — rejected due to Canvas limits and unsustainable maintenance overhead. |
| Impact | Navigation uses Set() + Navigate() pattern. All form screens are context-driven. One screen handles all forms of the same type. |
| Status | ACTIVE |

---

## DEC-003 — Form Rendering Pattern

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Architecture |
| Decision | Hybrid pattern: SP SharePoint EditForm/DisplayForm for field rendering + custom Canvas components for workflow, approval, and command bar. |
| Rationale | 22,074 fields across 361 forms cannot be mapped to Canvas controls manually in one pass. SP EditForm auto-renders from SP list schema. Custom components handle the business logic layer. |
| Alternatives Considered | Pure custom Canvas controls for every field — rejected due to time and scale. Fully native SP forms — rejected because they cannot support the workflow/approval overlays. |
| Impact | Form screens use SP form control + overlay components. Not every field needs a dedicated Canvas control designed upfront. |
| Status | ACTIVE |

---

## DEC-004 — Site Value Correction

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Data |
| Decision | SP `EntitySite` column stores `"Prai"` for the Penang/Prai factory site, and `"Johor"` for the Johor factory site. The value `"Penang"` is NOT valid for MainDB_HR or MainDB_FIN. |
| Rationale | Confirmed from `main-dbfin-model.ts` and `main-dbhr-model.ts` SiteKeyToLabel mappings. Service wrapper confirms `SITE_KEY_TO_LABEL: { SiteKey0: 'PRAI', SiteKey1: 'JOHOR' }`. |
| Alternatives Considered | Using "Penang" — rejected because it does not match confirmed SP choice value. |
| Impact | All Filter formulas must use `EntitySite.Value = "Prai"` not `EntitySite.Value = "Penang"`. gblActiveSite toggle = "Johor" / "Prai". |
| Status | ACTIVE |

---

## DEC-005 — Status Field Pattern

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Data |
| Decision | SP `Status` column stores label text values ("Draft", "Submitted", "Under Review", "Approved", "Rejected", "Closed", "Archived"). Canvas filters use `Status.Value = "Draft"`. TypeScript `statusKey` codes (StatusKey0–6) are client-side only and do NOT exist in SP. |
| Rationale | Confirmed from `main-dbhr-service.ts` `toSharePointWrite` which converts `statusKey: 'StatusKey0'` → SP write `Status: "Draft"`. Service also confirms Status is a Choice column. |
| Alternatives Considered | Storing key codes in SP (StatusKey0 etc.) — rejected; confirmed labels are stored, not codes. |
| Impact | All Canvas Patch writes use `Status: {Value: "Draft"}`. All Canvas Filters use `Status.Value = "Draft"`. |
| Status | ACTIVE |

---

## DEC-006 — Workflow Routing Fields

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Workflow |
| Decision | Workflow routing uses THREE SP fields: `CurrentStage` (text label), `CurrentApprover_Email` (email), `CurrentApproverGroup` (group name). There is no single generic `CA` field. |
| Rationale | Confirmed from `main-dbfin-model.ts` and `main-dbhr-model.ts` which both define these three fields with matching @displayName annotations. HR service confirms mapping. |
| Alternatives Considered | Single CA field — rejected; CA is a PDF-extracted field label, not a confirmed SP routing field. |
| Impact | Approval queue filter uses `CurrentApprover_Email = gblCurrentUser.UserPrincipalName`. Patch on advance writes all three fields. |
| Status | ACTIVE |

---

## DEC-007 — Approval History Lists

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Data |
| Decision | Approval history is stored in separate per-dept SP lists: `ApprovalHistory_HR`, `ApprovalHistory_QA`, `ApprovalHistory_STR`, `ApprovalHistory_SHE`. There is no global WorkflowHistory list. |
| Rationale | Confirmed from generated model files: `ApprovalHistory_HRModel.ts`, `ApprovalHistory_QAModel.ts`, `ApprovalHistory_STRModel.ts`, `ApprovalHistory_SHEModel.ts`. |
| Alternatives Considered | Single global WorkflowHistory — rejected; confirmed per-dept lists exist. |
| Impact | Canvas App must register each dept's history list as a separate data source. Audit writes use If/Switch to select correct list by gblActiveDept. |
| Status | ACTIVE |

---

## DEC-008 — Role Configuration List

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Roles |
| Decision | Use existing `Config_GlobalUserRoleAssignments` SP list for role assignments. Do NOT create a new AppConfig_Roles list. |
| Rationale | Confirmed from `Config_GlobalUserRoleAssignmentsModel.ts`. List already exists with schema: UserPrincipalName, RoleKey, AssignmentScope, IsActiveAssignment, DepartmentCodeScope, ModuleKeyScope. |
| Alternatives Considered | Creating AppConfig_Roles — rejected; would duplicate an existing confirmed SP list. |
| Impact | App.OnStart role load uses `Filter(Config_GlobalUserRoleAssignments, UserPrincipalName = gblCurrentUser.UserPrincipalName And IsActiveAssignment = true)`. |
| Status | ACTIVE |

---

## DEC-009 — IT List Status Pattern

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Data |
| Decision | MainDB_IT uses `currentStatus` (plain string, camelCase) with 60 possible values. This is completely different from the HR/FIN `Status` Choice column pattern. IT does NOT use the 7-value StatusKey pattern. |
| Rationale | Confirmed from `main-dbit-model.ts`: `currentStatus: string` required field. Model comment: "New code should use currentStatus (plain string) directly." IT has 60 status values in `MainDBITCurrentstatusKeyToLabel`. |
| Alternatives Considered | Treating IT same as HR/FIN — rejected; models confirm different patterns. |
| Impact | IT filter formulas use `currentStatus = "Pending HOD"` (no .Value accessor). IT workflow routing must be confirmed separately from HR/FIN. |
| Status | ACTIVE |

---

## DEC-010 — Child Row Storage

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Area | Data |
| Decision | Child/editable gallery row storage is MIXED. Some forms store rows as JSON string in a parent field (e.g. AWHR stores in `awhrWorkingHours`). Others use separate SP child lists (e.g. MainDB_HR_Ext_EEN). cmpRelatedChildItems must support both patterns. |
| Rationale | AWHR new.tsx confirms JSON storage: `awhrWorkingHours: JSON.stringify(rows)`. Generated model files confirm separate child lists (MainDB_HR_Ext_EEN, MainDB_HR_Ext_EPDU, etc.). |
| Alternatives Considered | Assume all forms use child lists — rejected by AWHR evidence. |
| Impact | cmpRelatedChildItems needs `propStoragePattern` input property: "ChildList" or "JSON". Per-form storage pattern must be confirmed before building each form. |
| Status | ACTIVE |
