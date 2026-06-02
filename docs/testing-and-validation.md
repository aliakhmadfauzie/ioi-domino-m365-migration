# Testing & Validation Plan — Domino to M365 Migration

> **Generated**: 2026-05-31
> **Status**: Draft — awaiting first test cycle
> **App Under Test**: `powerapps-mirror/apps/ioi-platform/` (code-first Power Apps)
> **SharePoint Lists**: MainDB_IT + extension lists

---

## 1. Test Strategy

### Testing Levels

| Level | Scope | Method | Responsible |
|-------|-------|--------|-------------|
| **Unit** | Individual form schemas, validation rules, services | Automated (Vitest/Jest) | Developer |
| **Integration** | Form submission → SharePoint write-back, Power Automate trigger | Manual + automated | Developer |
| **UI/UX** | Screen flow, form rendering, approval dialogs | Manual review in dev server (`npm run dev`) | Developer + Migration Lead |
| **UAT** | End-to-end workflows with real data | Manual by pilot users | IT Department (pilot) |
| **Regression** | Existing forms still work after new changes | Manual smoke test | Developer |
| **Data Migration** | Domino → SharePoint data integrity | Automated comparison | Migration Lead |

### Test Environment

| Environment | SharePoint Site | Power Apps | Power Automate | Status |
|-------------|----------------|------------|----------------|--------|
| **Development (Local)** | — | `npm run dev` (localhost:5173) | — | ✅ Ready |
| **Development (Power Platform)** | IOI-App_Admin_Sites | Deployed dev app | Dev flows | ⬜ Pending |
| **UAT** | IOI-App_Admin_Sites | Deployed test app | Test flows | ⬜ Pending |
| **Production** | IOI-App_Admin_Sites | Published app | Production flows | ⬜ Pending |

---

## 2. Test Case Inventory

### 2.1 Form Rendering Tests

| TC# | Form | Test Case | Expected Result | Status | Notes |
|-----|------|-----------|-----------------|--------|-------|
| FR-01 | EAF (VPN/Citrix) | Open EAF create form in dev server | All EAF fields render: User, Justification, System, Type, Dept Head, CC | ⬜ Not tested | |
| FR-02 | EAF (VPN/Citrix) | Verify required fields | Justification, System, Type, Dept Head show validation errors if empty | ⬜ Not tested | |
| FR-03 | ITSSR | Open ITSSR create form | All ITSSR fields render: Category, SubCategory, Description, Priority | ⬜ Not tested | |
| FR-04 | HI (Hardware) | Open HI create form | All HI fields render: AssetTag, ComputerType, CPU, RAM, SerialNo, Location | ⬜ Not tested | |
| FR-05 | PRF (Program Request) | Open PRF create form | All PRF fields render: RequestType, IsSAP, Dept Manager, IT Approved | ⬜ Not tested | |
| FR-06 | SAPCR (Change Request) | Open SAPCR create form | All SAPCR fields render: System, ChangeType, RiskLevel, BPO Email | ⬜ Not tested | |

### 2.2 Workflow Tests

| TC# | Form | Test Case | Expected Result | Status | Notes |
|-----|------|-----------|-----------------|--------|-------|
| WF-01 | EAF | Submit EAF → status = "Submitted" | Power Automate triggered; email sent to HOD | ⬜ Not tested | Depends on Power Automate |
| WF-02 | EAF | HOD approves → status = "HOD Approved" | Approval recorded; notification sent to COO/Director | ⬜ Not tested | |
| WF-03 | EAF | COO/Director approves → status = "Approved" | Final approval; IT provisioning notified | ⬜ Not tested | |
| WF-04 | EAF | HOD rejects → status = "Rejected" | Rejection email sent to requestor | ⬜ Not tested | |
| WF-05 | EAF | isPCN=Yes → route to COO | Approval goes to COO rather than Director | ⬜ Not tested | Conditional routing |
| WF-06 | ITSSR | New ITSSR created → category routing | Assigned PIC updated based on category | ⬜ Not tested | |
| WF-07 | PRF | PRF submitted → ISG assignment | ISG notified for Program Request | ⬜ Not tested | |

### 2.3 Data Integrity Tests

| TC# | Test Case | Expected Result | Status | Notes |
|-----|-----------|-----------------|--------|-------|
| DI-01 | Create EAF record → verify in SharePoint | Record appears in MainDB_IT with correct FormCode="EAF" | ⬜ Not tested | Depends on SharePoint connector |
| DI-02 | Create HI record → verify in extension list | Record appears in MainDB_IT_Ext_Assets with correct ParentRecordID | ⬜ Not tested | |
| DI-03 | Auto-numbering: create record → verify INO | INO number format: REQ-{yyyymmdd}-{seq} | ⬜ Not tested | |
| DI-04 | Update workflow status → verify timestamp | Approval dates update correctly | ⬜ Not tested | |
| DI-05 | Create record with all field types → verify round-trip | No data loss for text, choice, person, date, boolean | ⬜ Not tested | |

### 2.4 UI/UX Tests

| TC# | Test Case | Expected Result | Status | Notes |
|-----|-----------|-----------------|--------|-------|
| UX-01 | Department hub loads all departments | 23 department cards visible | ⬜ Not tested | |
| UX-02 | IT forms page shows M1-M7 modules | All 28 forms organized by module | ⬜ Not tested | |
| UX-03 | My Submissions shows current user requests | Filtered by logged-in user | ⬜ Not tested | |
| UX-04 | Approval screen shows pending approvals | Sorted by priority and date | ⬜ Not tested | |
| UX-05 | Responsive layout on mobile | Sidebar collapses, forms adapt | ⬜ Not tested | |
| UX-06 | Search in form lists | Filters by title, requestor, status | ⬜ Not tested | |

### 2.5 Data Migration Tests

| TC# | Test Case | Expected Result | Status | Notes |
|-----|-----------|-----------------|--------|-------|
| DM-01 | Export Domino EAF data → transform → import | Field count matches, data types compatible | ⬜ Not tested | Phase 7 |
| DM-02 | Validate ITSSR imported records against DXL | All 23 fields present and correctly mapped | ⬜ Not tested | |
| DM-03 | Validate HI imported records against PDF screenshots | Asset data matches visual evidence | ⬜ Not tested | |

---

## 3. Test Execution Tracker

### Per-Form Status

| Form | Form Schema | Form UI | SharePoint Write | Workflow | Approval | Data Migration | Overall |
|------|------------|---------|------------------|----------|----------|----------------|---------|
| EAF (VPN/Citrix) | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | ⬜ Not built | ⬜ Not built | ⬜ Pending | **15%** |
| ITSSR | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | ⬜ Not built | — | ⬜ Pending | **15%** |
| HI (Hardware) | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | — | — | ⬜ Pending | **15%** |
| NIR (Notes ID) | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | — | — | ⬜ Pending | **15%** |
| RS (Reset Password) | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | — | — | ⬜ Pending | **15%** |
| PRF (Program Request) | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | ⬜ Not built | ⬜ Not built | ⬜ Pending | **15%** |
| SFAR (Share Folder) | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | ⬜ Not built | — | ⬜ Pending | **15%** |
| SAPCR (Change Request) | ✅ Schema exists | ✅ Screens exist | ⬜ Pending | ⬜ Not built | ⬜ Not built | ⬜ Pending | **15%** |
| SAPSOF (Sign Off) | ⚠️ Schema exists | ⚠️ Screens exist | ⬜ Pending | ⬜ Not built | ⬜ Not built | ⬜ Pending | **10%** |
| Other IT forms (19) | ✅ Schemas exist | ✅ Screens exist | ⬜ Pending | ⬜ Not built | ⬜ Not built | ⬜ Pending | **15%** |

### Phase Completion

| Phase | Progress | Status |
|-------|----------|--------|
| Local dev server test (`npm run dev`) | 0% | ⬜ Pending |
| Unit test each form | 0% | ⬜ Pending |
| Integration test (SharePoint write-back) | 0% | ⬜ Pending |
| Power Automate flow testing | 0% | ⬜ Pending |
| UAT with IT department pilot | 0% | ⬜ Pending |
| Data migration integrity check | 0% | ⬜ Pending |

---

## 4. Bug Tracking

> Bug tracking will be managed here until a proper issue tracker is configured.

| Bug ID | Form | Description | Severity | Status | Reported By | Date | Fix |
|--------|------|-------------|----------|--------|-------------|------|-----|
| — | — | — | — | — | — | — | — |

### Severity Levels
| Level | Definition | Response Time |
|-------|-----------|---------------|
| **Critical** | Blocking — cannot proceed with testing | Immediate |
| **High** | Major feature broken | Within 1 day |
| **Medium** | Feature works with limitations | Within 3 days |
| **Low** | Minor visual or UX issue | Next sprint |

---

## 5. UAT Sign-off

### UAT Plan

**Wave 1**: IT Department Pilot
- Participants: 3-5 IT team members
- Duration: 1 week
- Forms tested: EAF (VPN/Citrix), ITSSR, PRF, RS
- Success criteria: 90% task completion rate, <5 critical bugs

**Wave 2**: IT + HR + Finance
- Participants: 5-10 users across departments
- Duration: 2 weeks
- Forms tested: All IT forms + HR forms (if migrated)
- Success criteria: 85% task completion rate, <10 critical bugs

**Wave 3**: Full rollout
- All departments
- Duration: Ongoing
- Success criteria: <3 critical bugs per week

### Sign-off Template

```
---

## UAT Sign-off — {Form Name}

**Tester**: {Name}
**Date**: {YYYY-MM-DD}
**Environment**: {Dev / UAT / Production}

### Test Results
- Test cases passed: {N}/{Total}
- Test cases failed: {N}
- Bugs found: {N} (Critical: {N}, High: {N}, Medium: {N}, Low: {N})
- Blockers: {Yes/No — if Yes, list}

### Tester Comments
{Free text feedback}

### Approval
- [ ] Approved for production
- [ ] Approved with conditions (list below)
- [ ] Not approved — needs rework

**Signed**: __________________
```
