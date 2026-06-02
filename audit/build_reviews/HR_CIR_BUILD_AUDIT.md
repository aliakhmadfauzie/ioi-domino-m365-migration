# HR CIR Build Audit

> **Date**: 2026-06-01 | **Auditor**: Domino PDF Source Analysis Agent
> **Form**: CIR — Cafeteria Inspection | **Requirement**: `SRC-HR-003_CIR_REQUIREMENTS.md`
> **Schema**: `HR_SHAREPOINT_SCHEMA_EXPORT.md` | **DXL**: `Submitted → Accepted` (2-state)

## Audit Result: ❌ Failed — Fix Required

| Metric | Result |
|---|---|
| Checks Passed | 6/12 |
| Checks Failed | 6/12 |
| Fix Backlog Items | 6 |

---

## 12-Point Validation

### 1. All source fields in UI or intentionally excluded? ❌ FAILED

| Requirement Field | In UI? | Status |
|---|---|---|
| Site | ✅ Select dropdown | Pass |
| TeamMembers | ❌ Missing | **Fail** — required by PDF/DXL (Domino field: `TeamMembers`) |
| Inspector | ✅ EmployeePicker | Pass |
| InsDate | ✅ Input | Pass |
| InsTime | ✅ Input | Pass |
| SubmittedBy | ❌ Missing | **Fail** — should auto-set to @Me |
| SubmittedDate | ❌ Missing | **Fail** — should auto-set to @Now |
| ReviewedBy | ❌ Missing | **Fail** — corrective action reviewer |
| ReviewedDate | ❌ Missing | **Fail** — corrective action date |
| Remarks | ✅ Textarea | Pass |
| CurrentAction | ⚠️ Wrong values | **Fail** — uses Request/Denied; DXL says Submitted/Accepted only |
| ACMComm | ❌ Missing | **Fail** — hidden but included in schema |
| ECMComm | ❌ Missing | **Fail** — hidden but included in schema |

**Extraneous fields**: `insDueDate`, `inspectorName`, `useNewForm` toggle — not in CIR requirement.

### 2. SharePoint columns mapped correctly? ❌ FAILED

| Schema Column | Current Mapping | Issue |
|---|---|---|
| cirSite | `entitysiteKey` (SiteKey0/SiteKey1) | ❌ Wrong internal name |
| cirTeamMembers | Not mapped | ❌ Missing |
| cirInspector | `inspectedby` | ❌ Wrong internal name |
| cirInsDate | `inspectiondate` | ❌ Wrong internal name |
| cirInsTime | `inspectiontime` | ❌ Wrong internal name |
| cirCurrentAction | `currentaction` + `statusKey` | ❌ Uses StatusKey pattern instead of cirCurrentAction |
| cirRemarks | `description` | ❌ Wrong internal name |
| cirSubmittedBy | Not mapped | ❌ Missing |
| cirSubmittedDate | Not mapped | ❌ Missing |
| cirReviewedBy | Not mapped | ❌ Missing |
| cirReviewedDate | Not mapped | ❌ Missing |

### 3. Field types match expected controls? ⚠️ PARTIAL

| Field | Expected | Actual | Match? |
|---|---|---|---|
| Site | Select/Dropdown | Select | ✅ |
| TeamMembers | People picker (multi) | Missing | ❌ |
| Inspector | People picker | Text input | ⚠️ Uses `inspector` string not EmployeePicker |
| InsDate | Date picker | Text input | ⚠️ |

### 4. Required validation implemented? ⚠️ PARTIAL

Site, InsDate, InsTime validated on submit ✅. Inspector, TeamMembers not validated ❌.

### 5. Submit writes to correct list? ⚠️ PARTIAL

Writes to `MainDB_HR` ✅. Also writes to `MainDB_HR_Ext_Cafeteria` ❌ — schema design is parent-only.

### 6. Submit writes to correct columns? ❌ FAILED

Uses `formcode`, `inspectiondate`, `inspectedby`, `entitysiteKey`, `currentaction`, `statusKey` — none match the schema internal names (cirSite, cirInsDate, cirInspector, cirCurrentAction, etc.).

### 7. No approval workflow added? ❌ FAILED

`detail.tsx` contains `ApprovalActionPanel` with Accept/Deny actions and `CIR_ACTIONS` mapping with `SubmittedInspection` → Accepted/Denied transitions. CIR is **Not Required** — no approval workflow should exist.

### 8. Edit/view behavior matches build plan? ⚠️ PARTIAL

Detail shows inspection data ✅. Edit functionality not evident ❌. Ext_Cafeteria extension read on detail ✅ but should be parent-only.

### 9. Error handling exists? ✅ PASSED

`toast.error(err?.message || 'Failed to ...')` in both new.tsx and detail.tsx.

### 10. Success message exists? ✅ PASSED

`toast.success(action === 'draft' ? 'Draft saved' : 'Inspection submitted')`.

### 11. No unrelated files modified? ✅ PASSED

Only `hr/cafeteria/` files modified. BSD, CWR, and other HR pages untouched.

### 12. No unrelated forms affected? ✅ PASSED

CIR changes are self-contained in `/hr/cafeteria/`. No shared form-renderer modifications.

---

## Issues Summary

| # | Issue | Severity | Area |
|---|---|---|---|
| 1 | Uses `MainDB_HR_Ext_Cafeteria` extension — should be parent-only | High | Data source |
| 2 | Column internal names don't match schema (entitysiteKey, inspectedby, etc.) | High | Field mapping |
| 3 | Approval panel on detail — CIR is Not Approval | High | Workflow |
| 4 | CurrentAction uses Request/Denied/StatusKey — DXL says Submitted/Accepted only | High | Status |
| 5 | Missing required fields: TeamMembers, SubmittedBy, SubmittedDate | Medium | Fields |
| 6 | Missing review fields: ReviewedBy, ReviewedDate | Medium | Fields |
| 7 | Missing system fields: ACMComm, ECMComm | Low | Fields |
| 8 | Extraneous fields: insDueDate, inspectorName, useNewForm | Low | Fields |

---

*Audit complete. 6 fix backlog items created. DRD build should wait until CIR fixes are applied.*
