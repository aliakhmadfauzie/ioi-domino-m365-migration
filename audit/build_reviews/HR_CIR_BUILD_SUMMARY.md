# HR CIR Build Summary

> **Date**: 2026-06-01 | **Form**: Cafeteria Inspection (CIR) | **Source**: SRC-HR-003
> **Build Priority**: 1 (no workflow baseline)

## 1. Files Changed

| File | Status |
|---|---|
| `src/pages/hr/cafeteria/new.tsx` | ✅ Exists — create form |
| `src/pages/hr/cafeteria/index.tsx` | ✅ Exists — list view |
| `src/pages/hr/cafeteria/detail.tsx` | ✅ Exists — detail/review |

## 2. Screens/Components

| Screen | Components Used | Status |
|---|---|---|
| New Inspection | Card, Input, Select, Textarea, EmployeePicker, Button | ✅ Built |
| Inspection List | Table, Tabs, Badge, Input (search), Empty | ✅ Built |
| Detail | StatusBadge, ApprovalActionPanel, RecordInfoPanel | ✅ Built |

## 3. SharePoint Lists Used

| List | Purpose |
|---|---|
| `MainDB_HR` | Parent record (FormCode=CIR) |
| `MainDB_HR_Ext_Cafeteria` | Extension fields (used in current impl, not in our schema design) |

## 4. Field Mappings

| Requirement Field | Current Impl | Schema Column | Mapped? |
|---|---|---|---|
| Site | `site` state | cirSite | ✅ |
| TeamMembers | ❌ Missing | cirTeamMembers | ❌ |
| Inspector | `inspector` state | cirInspector | ✅ |
| Inspection Date | `insDate` state | cirInsDate | ✅ |
| Inspection Time | `insTime` state | cirInsTime | ✅ |
| Submitted By | ❌ Missing (should be auto) | cirSubmittedBy | ❌ |
| Submitted Date | ❌ Missing (should be auto) | cirSubmittedDate | ❌ |
| Reviewed By | ❌ Missing | cirReviewedBy | ❌ |
| Reviewed Date | ❌ Missing | cirReviewedDate | ❌ |
| Remarks | `remarks` state | cirRemarks | ✅ |
| CurrentAction | Mapped to StatusKey pattern | cirCurrentAction | ⚠️ Mismatch |
| ACMComm | ❌ Missing | cirACMComm | ❌ |
| ECMComm | ❌ Missing | cirECMComm | ❌ |
| INO | ❌ Missing | cirINO | ❌ |

## 5. Validation Implemented

| Field | Required? | Validated? |
|---|---|---|
| Site | Yes (Inferred) | ⚠️ Not enforced |
| Inspector | Yes (Inferred) | ⚠️ Not enforced |

## 6. Submit Behavior

Uses `MainDBHRService.create()` with FormCode='CIR' and CurrentAction='Request' (draft) or 'Submitted'.

⚠️ Uses `StatusKey1` for Submitted — should be `cirCurrentAction: 'Submitted'` per schema.

## 7. Known Limitations

| # | Issue |
|---|---|
| 1 | Uses `MainDB_HR_Ext_Cafeteria` extension list — schema design uses parent-only |
| 2 | CurrentAction mapped through StatusKey pattern, not cirCurrentAction column |
| 3 | ApprovalActionPanel on detail page — CIR is Not Approval (no workflow needed) |
| 4 | Missing fields: TeamMembers, SubmittedBy, SubmittedDate, ReviewedBy/Date, ACMComm, ECMComm, INO |
| 5 | `insDueDate` and `inspectorName` fields not in requirement — possibly from older design |
| 6 | Site choices hardcoded (ACM/ECM Cafeteria) — acceptable, matches pending HR question |

## 8. Follow-up Audit Checklist

- [ ] Verify SharePoint columns match schema internal names
- [ ] Remove approval workflow from non-approval form
- [ ] Add missing fields (TeamMembers, ReviewedBy, etc.)
- [ ] Fix CurrentAction to use cirCurrentAction column
- [ ] Remove Ext_Cafeteria dependency if not needed
- [ ] Add required field validation
