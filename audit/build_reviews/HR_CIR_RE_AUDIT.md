# HR CIR Re-Audit

> **Date**: 2026-06-01 | **Auditor**: Domino PDF Source Analysis Agent
> **Form**: CIR — Cafeteria Inspection | **Requirement**: `SRC-HR-003_CIR_REQUIREMENTS.md`
> **Schema**: `HR_SHAREPOINT_SCHEMA_EXPORT.md`

## Re-Audit Result: ❌ Failed - Fix Required

| Metric | Result |
|---|---|
| Checks Passed | 5/12 |
| Checks Failed | 7/12 |
| Fix Backlog Items | 6 |

---

## 1. Summary

The current CIR implementation has corrected the create payload to use parent list `MainDB_HR` and many `cir*` schema fields in `new.tsx`, including `cirSite`, `cirTeamMembers`, `cirInspector`, `cirInsDate`, `cirInsTime`, `cirSubmittedBy`, `cirSubmittedDate`, and `cirCurrentAction: 'Submitted'`.

However, the detail page still contains legacy approval workflow behavior and extension list dependencies, so the form is not yet ready for DRD or production validation.

## 2. 12-Point Validation

### 1. All CIR source fields in UI or intentionally excluded?
- Pass: Site, TeamMembers, Inspector, InsDate, InsTime, Remarks, SubmittedBy, SubmittedDate.
- Fail: ReviewedBy and ReviewedDate are still missing from the detail/review UI.
- Result: ❌ Failed

### 2. All CIR SharePoint columns mapped correctly?
- `new.tsx` now uses exact schema field names for create.
- `detail.tsx` still displays legacy fields such as `InspectedBy`, `InspectionDate`, `EntitySite`, and reads from `MainDB_HR_Ext_Cafeteria`.
- Result: ❌ Failed

### 3. Field types match expected controls?
- Pass: Site uses dropdown, TeamMembers uses multi-person picker, Inspector uses `EmployeePicker`, InsDate uses date picker, InsTime uses time input, Remarks uses textarea.
- Minor issue: submitted/review fields are not shown at all, not type mismatched.
- Result: ✅ Passed

### 4. Required validation implemented?
- Pass: Site, InsDate, InsTime validation exists.
- Fail: TeamMembers is not explicitly validated as required; Inspector is also not enforced.
- Result: ⚠️ Partially Passed

### 5. Submit/Patch logic writes to the correct parent list?
- Pass: `new.tsx` writes only to `MainDB_HR`.
- Result: ✅ Passed

### 6. Submit/Patch logic writes to the correct columns?
- Pass: Create payload uses `cir*` schema names.
- Result: ✅ Passed

### 7. No approval workflow exists?
- Fail: `detail.tsx` still renders `ApprovalActionPanel` and a CIR approval actions mapping.
- Result: ❌ Failed

### 8. No ApprovalActionPanel exists?
- Fail: `ApprovalActionPanel` is still imported and rendered in `detail.tsx`.
- Result: ❌ Failed

### 9. No incorrect CurrentAction approval state exists?
- Fail: `detail.tsx` still uses `CurrentAction` and `StatusKey` update logic with states `Accepted`, `Denied`, `Submitted`.
- Result: ❌ Failed

### 10. Error handling exists?
- Pass: `toast.error(...)` is present in both `new.tsx` and `detail.tsx`.
- Result: ✅ Passed

### 11. Success message exists?
- Pass: `toast.success('Inspection submitted')` and action status toasts exist.
- Result: ✅ Passed

### 12. No unrelated files were modified?
- Pass: Only `/hr/cafeteria/` files are affected.
- Result: ✅ Passed

---

## 3. Fix-Level Validation

| Fix ID | Status | Notes |
|---|---|---|
| FIX-CIR-001 | Failed Re-Audit | Extension list dependency still present in detail page. |
| FIX-CIR-002 | Partially Fixed | Create mapping uses schema names, but detail page still displays legacy column names. |
| FIX-CIR-003 | Failed Re-Audit | Approval panel and approval actions remain in `detail.tsx`. |
| FIX-CIR-004 | Failed Re-Audit | CurrentAction update logic still uses legacy `StatusKey` behavior and approval states. |
| FIX-CIR-005 | Verified | TeamMembers, SubmittedBy, SubmittedDate implemented in `new.tsx`. |
| FIX-CIR-006 | Failed Re-Audit | ReviewedBy and ReviewedDate are still absent. |

## 4. Remaining Issues

- `detail.tsx` still imports and uses `MainDB_HR_Ext_CafeteriaService`.
- `detail.tsx` still renders `ApprovalActionPanel` and action buttons for a non-approval form.
- `detail.tsx` still reads legacy field names: `EntitySite`, `InspectedBy`, `InspectionDate`, `InspectionTime`, `Description`.
- No review fields (`ReviewedBy`, `ReviewedDate`) are presented or persisted.
- Status filtering in `index.tsx` still includes `Request` and `Denied`, which are not part of the CIR schema.
- `detail.tsx` update payload still uses `CurrentAction` and `StatusKey` instead of `cirCurrentAction` and schema-driven state.

## 5. DRD Safety Assessment

CIR is not yet safe for DRD. The form has a mixed implementation state: create path is improved, but read/detail/review handling still contains legacy extension and approval behavior that must be removed before dependent forms are built.

## 6. Recommendation

- Remove `MainDB_HR_Ext_CafeteriaService` usage and `ApprovalActionPanel` from `detail.tsx`.
- Display and persist `cirReviewedBy` and `cirReviewedDate` only if review is expected.
- Convert all detail page field references to `cir*` schema names.
- Remove `Request` and `Denied` status tabs from `index.tsx` and use only schema-confirmed CIR states.
- Keep CIR as the baseline form until this re-audit is fully resolved.
