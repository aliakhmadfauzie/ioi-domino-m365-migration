# EXB-005 HR Promotion Summary

> Date: 2026-06-02 | Batch: EXB-005 | Status: Promoted

## 1. Forms Promoted

| Source ID | Form Name | Quality | Decision |
|---|---|---:|---|
| SRC-HR-013 | Gift/Donation/Sponsorship Notification (GDSN) | 92/100 | Promote with Human Confirmation |
| SRC-HR-014 | HR Information / Notice (HEALTHINFO) | 86/100 | Promote with Human Confirmation |
| SRC-HR-015 | HR Applications Problem Reporting (HRAPR) | 93/100 | Promote with Human Confirmation |

## 2. Requirement Files Created

| File | Sections | Pages | Promotion Notes |
|---|---:|---:|---|
| `HR/SRC-HR-013_GDSN_REQUIREMENTS.md` | 4 | 3 | HOD endorsement/notification workflow; finality and routing need confirmation |
| `HR/SRC-HR-014_HEALTHINFO_REQUIREMENTS.md` | 5 | 2 | Compact information/notice form; status/publishing semantics need confirmation |
| `HR/SRC-HR-015_HRAPR_REQUIREMENTS.md` | 7 | 3 | HR application problem-report workflow; status transitions and role ownership need confirmation |

## 3. Fields Promoted

| Form | Promoted | Not Promoted | Reason |
|---|---:|---:|---|
| GDSN | 32 label pairs plus hidden routing fields | 0 | All promoted content traces to raw text |
| HEALTHINFO | 10 label pairs plus hidden admin fields | 0 | Compact extract; no unrelated fields promoted |
| HRAPR | 32 label pairs plus hidden routing/audit fields | 0 | All promoted content traces to raw text |
| Total | 74 label pairs plus system/routing fields | 0 | No repeating child-table structures detected |

## 4. Workflow Rules Promoted

| Form | Classification | Key Evidence |
|---|---|---|
| GDSN | HOD endorsement / notification workflow candidate | Submitted by, HOD section, App, SendTo, CurrentAction, department routing |
| HEALTHINFO | Information broadcast / non-approval candidate | Recipient, body, attachment, status updates, viewed counter, CurrentAction, no approval section |
| HRAPR | Problem-report handling workflow candidate | GHR/ISG action, rejection, requestor acceptance, KIV/archive, CurrentAction, reminder/auto-close fields |

## 5. Human Confirmation Questions Added

| Form | High | Medium | Low | Total |
|---|---:|---:|---:|---:|
| GDSN | 2 | 2 | 0 | 4 |
| HEALTHINFO | 1 | 2 | 1 | 4 |
| HRAPR | 3 | 2 | 0 | 5 |
| Total | 6 | 6 | 1 | 13 |

## 6. SharePoint Design Recommendations

| Form | Parent | Child List Candidates |
|---|---|---|
| GDSN | MainDB_HR | None detected; attachment/list-specific routing may remain parent/extension fields |
| HEALTHINFO | MainDB_HR | None detected |
| HRAPR | MainDB_HR | None detected; optional document/evidence child list only if required |

## 7. Cumulative HR Progress

| Batch | Forms | Cumulative |
|---|---:|---:|
| EXB-001 | 3 | 3 forms |
| EXB-002 | 3 | 6 forms |
| EXB-003 | 3 | 9 forms |
| EXB-004 | 3 | 12 forms |
| EXB-005 | 3 | 15 forms |
| Total | 15 | 15/26 Prai HR (58%) |

## 8. Next Step

Continue HR PDF extraction with EXB-006. Recommended next Prai HR PDFs: `HRINFO.pdf`, `INTERN.pdf`, and `INTERVIEWDB.pdf`.

