# Audit Output Template — Domino → M365 Migration

> **Use this template for**: Form audits, SharePoint integration audits, Power Fx reviews, approval logic discovery, and section visibility audits.
> **Reference**: `docs/10_PROMPT_LIBRARY.md` for the prompts that produce these outputs.

---

## Audit Summary

| Item | Count |
|---|---|
| Forms checked | |
| Forms passed | |
| Forms with issues | |
| Critical blockers | |
| Missing SharePoint mappings | |
| Unknown approval classification | |
| Unknown section visibility | |

---

## Form-by-Form Audit

### Form: [FORM_NAME]

| Item | Detail |
|---|---|
| Department | |
| Screen/File | |
| Source PDF | |
| SharePoint List | |
| Approval Classification | Approval Required / No Approval Required / Unknown |
| Risk Level | Low / Medium / High / Critical |

#### Data Source Mapping

| Purpose | Source/List | Read/Write | Formula/File | Status | Notes |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

#### Field Mapping

| UI Label | Control | SharePoint Column | Internal Name | Type | Required | Status | Issue |
|---|---|---|---|---|---|---|---|
| | | | | | | ✅ / ⚠️ / ❌ | |

#### Workflow / Approval

| Stage | Trigger | Actor | Status Value | Section Visibility | Issue |
|---|---|---|---|---|---|
| | | | | | |

#### Section Visibility

| Section | Visible To | Visible When | Editable? | Evidence | Issue |
|---|---|---|---|---|---|
| | | | | | |

#### Problems Found

1. [CRITICAL / HIGH / MEDIUM / LOW] **[Issue title]** — [Description] ([File:Line])
2. ...

#### Recommended Fixes

1. **[Fix title]** — [Description. Files affected. Risk level.]
2. ...

#### Test Steps

1. [ ] **[Test name]** — [Steps. Expected result.]
2. ...

---

## Data Source Mapping Table (Quick Reference)

| Purpose | Source/List | Read/Write | Formula/File | Status | Notes |
|---|---|---|---|---|---|
| Read parent record | MainDB_IT | Read | `useMainDBITBySite().getById(id)` | ✅ | |
| Write parent record | MainDB_IT | Write | `sharepointService.patchItem(...)` | ✅ | |
| Read extension record | MainDB_IT_Ext_* | Read | `useMainDBITExt*().getByParentId(id)` | ✅ | |
| Write extension record | MainDB_IT_Ext_* | Write | `sharepointService.createItem(...)` | ✅ | |
| Approval record | ApprovalRecords | Write | `approvalService.record(...)` | ✅ | |
| Workflow audit log | WorkflowAuditLog | Write | `auditService.log(...)` | ✅ | |

---

## Field Mapping Table (Quick Reference)

| UI Label | Control | SharePoint Column | Internal Name | Type | Required | Status | Issue |
|---|---|---|---|---|---|---|
| Title | TextInput | Title | Title | Text | Yes | ✅ | |
| Form Code | Dropdown | FormCode | FormCode | Choice | Yes | ✅ | |
| Current Status | Label | CurrentStatus | CurrentStatus | Choice | Yes | ✅ | |
| Requestor Email | EmployeePicker | Requestor_Email | Requestor_Email | Text | Yes | ✅ | |
| Submitted Date | DatePicker | SubmittedDate | SubmittedDate | DateTime | No | ✅ | |

---

## Workflow Table (Quick Reference)

| Stage | Trigger | Actor | Status Value | Section Visibility | Issue |
|---|---|---|---|---|---|
| Draft | User clicks Save Draft | Submitter | Draft | All sections visible to submitter, editable | |
| Submitted | User clicks Submit | Submitter | Submitted | Submitter sees read-only; approver sees approval sections | |
| Approved | Approver clicks Approve | Approver | Approved | All read-only; completion sections visible | |
| Rejected | Approver clicks Reject | Approver | Rejected | Submitter sees rejection reason, can resubmit | |
| Completed | Final step | System/Admin | Completed | All read-only | |

---

## Section Visibility Table (Quick Reference)

| Section | Visible To | Visible When | Editable? | Evidence | Issue |
|---|---|---|---|---|---|
| Requester Info | All | Always | Only in Draft mode by submitter | `new.tsx` | |
| Approval Panel | Approver, Admin | Status = Submitted | Editable by approver only | `[id].tsx`, `ApprovalWorkflowPanel` | |
| Admin Notes | Admin | Always | Always editable by admin | `[id].tsx` | |

---

## Issue Classification

| Level | Icon | Meaning | Action Required |
|---|---|---|---|
| Critical | 🔴 | Blocks production deployment | Must fix before release |
| High | 🟠 | Data integrity or UX issue | Fix in current batch |
| Medium | 🟡 | Best practice or consistency | Fix in next batch |
| Low | 🟢 | Cosmetic or nice-to-have | Backlog |

---

## Status Icons

| Icon | Meaning |
|---|---|
| ✅ | Verified — correct and working |
| ⚠️ | Warning — needs attention |
| ❌ | Broken — must fix |
| ⬜ | Not checked yet |
| 🔁 | Duplicate of another item |
| 📌 | Needs business confirmation |
