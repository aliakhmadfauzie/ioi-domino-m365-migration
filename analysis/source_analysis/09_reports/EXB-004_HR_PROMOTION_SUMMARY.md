# EXB-004 HR Promotion Summary

> Date: 2026-06-02 | Batch: EXB-004 | Status: Promoted

## 1. Forms Promoted

| Source ID | Form Name | Quality | Decision |
|---|---|---:|---|
| SRC-HR-010 | Fixed Term Contract Requisition Form (FTCR) | 94/100 | Promote with Human Confirmation |
| SRC-HR-011 | Foreign Workers Work Permit Database (FWWPD) | 90/100 | Promote with Human Confirmation |
| SRC-HR-012 | Foreign Worker Work Period Extension (FWWPE) | 95/100 | Promote with Human Confirmation |

## 2. Requirement Files Created

| File | Sections | Pages | Promotion Notes |
|---|---:|---:|---|
| `HR/SRC-HR-010_FTCR_REQUIREMENTS.md` | 9 | 4 | Multi-stage fixed-term contract approval; route/status values need confirmation |
| `HR/SRC-HR-011_FWWPD_REQUIREMENTS.md` | 6 | 5 | Permit database/tracking form; table storage and truncated internal names need confirmation |
| `HR/SRC-HR-012_FWWPE_REQUIREMENTS.md` | 9 | 4 | Multi-stage work-period extension workflow; HOS optionality and completion actors need confirmation |

## 3. Fields Promoted

| Form | Promoted | Not Promoted | Reason |
|---|---:|---:|---|
| FTCR | 42 label pairs plus 10-row background-history structure | 0 | Hidden/routing fields retained as system candidates |
| FWWPD | 24 label pairs plus 4 fixed 10-row structures | 0 | Truncated date internal names normalized with caveats |
| FWWPE | 47 label pairs plus hidden routing fields | 0 | All promoted content traces to raw text |
| Total | 113 label pairs plus grouped row structures | 0 | All promoted content traces to raw text |

## 4. Workflow Rules Promoted

| Form | Classification | Key Evidence |
|---|---|---|
| FTCR | Clearly found multi-stage approval candidate | Submitter, recommendation, endorsement, AGM HR, COO/SGM, ED, HR status, CurrentAction |
| FWWPD | Permit record / task tracking candidate | Status, Done markers, CurrentAction, HR reminder/admin fields |
| FWWPE | Clearly found multi-stage approval/workflow candidate | Superior reply, HOS acceptance, HOD endorsement, HR approval, completion sections, withdrawal |

## 5. Human Confirmation Questions Added

| Form | High | Medium | Low | Total |
|---|---:|---:|---:|---:|
| FTCR | 3 | 2 | 0 | 5 |
| FWWPD | 3 | 2 | 0 | 5 |
| FWWPE | 3 | 2 | 0 | 5 |
| Total | 9 | 6 | 0 | 15 |

## 6. SharePoint Design Recommendations

| Form | Parent | Child List Candidates |
|---|---|---|
| FTCR | MainDB_HR | Ext_FTCR_BackgroundHistory if flexible rows required |
| FWWPD | MainDB_HR | Ext_FWWPD_Insurance, Ext_FWWPD_FOMEMA, Ext_FWWPD_MYEG, Ext_FWWPD_Contracts unless fixed rows are confirmed |
| FWWPE | MainDB_HR | Attachments/document child list only if business rejects SharePoint attachment fields |

## 7. Cumulative HR Progress

| Batch | Forms | Cumulative |
|---|---:|---:|
| EXB-001 | 3 | 3 forms |
| EXB-002 | 3 | 6 forms |
| EXB-003 | 3 | 9 forms |
| EXB-004 | 3 | 12 forms |
| Total | 12 | 12/26 Prai HR (46%) |

## 8. Next Step

Continue HR PDF extraction with EXB-005. Recommended next Prai HR PDFs: `GDSN.pdf`, `HEALTHINFO.pdf`, and `HRAPR.pdf`.

