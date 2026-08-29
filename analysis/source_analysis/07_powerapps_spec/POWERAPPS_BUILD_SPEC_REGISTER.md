# Power Apps Build Specification Register

> Power Apps list/new-edit/detail/action screen specification register for every form already extracted from PDF.
> Generated: 2026-06-02 21:59
> Source: promoted PDF requirement files under `analysis/source_analysis/02_extracted_requirements/`.

## Summary

| Department | Module | Forms | Rows |
|---|---|---:|---:|
| FIN | Finance - Capital Approval | 1 | 1 |
| FIN | Finance - Credit Management | 3 | 3 |
| FIN | Finance - Expenditure Approval | 1 | 1 |
| FIN | Finance - Service Entry | 1 | 1 |
| HR | HR - Applications Support | 1 | 1 |
| HR | HR - Attendance | 1 | 1 |
| HR | HR - Cafeteria | 1 | 1 |
| HR | HR - Contract | 1 | 1 |
| HR | HR - Duty Roster | 1 | 1 |
| HR | HR - Employee Data | 1 | 1 |
| HR | HR - Employee Health | 1 | 1 |
| HR | HR - Exit | 1 | 1 |
| HR | HR - Foreign Worker | 2 | 2 |
| HR | HR - Gift/Donation/Sponsorship | 1 | 1 |
| HR | HR - Information | 1 | 1 |
| HR | HR - Survey | 1 | 1 |
| HR | HR - Workforce | 2 | 2 |
| IT | IT - Access | 1 | 1 |
| IT | IT - Activity Logs | 4 | 4 |
| IT | IT - Asset Inventory | 1 | 1 |

## FIN / Finance - Capital Approval

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-FIN-CAR | SRC-FIN-001 | CAR | List; New/Edit; Detail; Approval/Action | 10 | 42 | 0 | Yes - complex multi-stage approval and completion workflow | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## FIN / Finance - Credit Management

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-FIN-CMF_A | SRC-FIN-002 | CMF_A | List; New/Edit; Detail; Approval/Action | 9 | 25 | 0 | Yes - multi-stage credit approval workflow | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |
| PAS-FIN-CMF_B | SRC-FIN-003 | CMF_B | List; New/Edit; Detail; Approval/Action | 8 | 25 | 0 | Yes - temporary credit limit approval workflow | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |
| PAS-FIN-CMF_C | SRC-FIN-004 | CMF_C | List; New/Edit; Detail; Approval/Action; Child Rows/Gallery | 9 | 22 | 1 | Yes - multi-stage customer credit review workflow | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## FIN / Finance - Expenditure Approval

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-FIN-EARF | SRC-FIN-005 | EARF | List; New/Edit; Detail; Approval/Action; Child Rows/Gallery | 12 | 32 | 2 | Yes - low-value asset approval and completion workflow | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## FIN / Finance - Service Entry

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-FIN-RSES | SRC-FIN-006 | RSES | List; New/Edit; Detail; Approval/Action | 4 | 18 | 0 | Yes - two-stage approval/completion workflow | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Applications Support

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-HRAPR | SRC-HR-015 | HRAPR | List; New/Edit; Detail; Approval/Action | 7 | 32 | 0 | Problem-report handling workflow candidate | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Attendance

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-AWHR | SRC-HR-002 | AWHR | List; New/Edit; Detail; Approval/Action | 10 | 47 | 0 | **Required** | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Cafeteria

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-CIR | SRC-HR-003 | CIR | List; New/Edit; Detail; Approval/Action | 3 | 22 | 0 | **Not Required** | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Contract

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-FTCR | SRC-HR-010 | FTCR | List; New/Edit; Detail; Approval/Action | 9 | 42 | 0 | Yes - multi-stage approval candidate | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Duty Roster

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-DRD | SRC-HR-005 | DRD | List; New/Edit; Detail; Approval/Action | 6 | 35 | 0 | **Required — Clearly Found** | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Employee Data

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-EPDU | SRC-HR-007 | EPDU | List; New/Edit; Detail; Approval/Action | 7 | 35 | 0 | Not confirmed as approval; HR review/acceptance required | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Employee Health

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-EPHR | SRC-HR-008 | EPHR | List; New/Edit; Detail; Approval/Action | 6 | 21 | 0 | Not Required / Record Form Candidate | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Exit

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-EEN | SRC-HR-006 | EEN | List; New/Edit; Detail; Approval/Action | 9 | 64 | 0 | Inferred / Needs Human Confirmation | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Foreign Worker

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-FWWPD | SRC-HR-011 | FWWPD | List; New/Edit; Detail; Approval/Action | 6 | 24 | 0 | Not confirmed as approval; record/task tracking candidate | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |
| PAS-HR-FWWPE | SRC-HR-012 | FWWPE | List; New/Edit; Detail; Approval/Action | 9 | 47 | 0 | Yes - multi-stage workflow | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Gift/Donation/Sponsorship

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-GDSN | SRC-HR-013 | GDSN | List; New/Edit; Detail; Approval/Action | 4 | 32 | 0 | HOD endorsement / notification workflow candidate | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Information

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-HEALTHINFO | SRC-HR-014 | HEALTHINFO | List; New/Edit; Detail; Approval/Action | 5 | 10 | 0 | No approval visible in extracted text | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Survey

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-ESF | SRC-HR-009 | ESF | List; New/Edit; Detail; Approval/Action | 5 | 14 | 0 | Not Required / Survey Form Candidate | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## HR / HR - Workforce

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-HR-BSD | SRC-HR-001 | BSD | List; New/Edit; Detail; Approval/Action | 6 | 39 | 0 | **Required** | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |
| PAS-HR-CWR | SRC-HR-004 | CWR | List; New/Edit; Detail; Approval/Action | 9 | 62 | 0 | Inferred / Needs Human Confirmation | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## IT / IT - Access

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-IT-EAF | SRC-001 | EAF | List; New/Edit; Detail; Approval/Action | 7 | 21 | 0 | Required | Yes | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## IT / IT - Activity Logs

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-IT-IAL1 | SRC-003 | IAL1 | List; New/Edit; Detail; Approval/Action | 3 | 16 | 0 | Inferred | Yes | Build from promoted requirement; preserve unknown choices/status values as confirmation items |
| PAS-IT-IAL2 | SRC-004 | IAL2 | List; New/Edit; Detail; Approval/Action | 3 | 16 | 0 | Inferred | Yes | Build from promoted requirement; preserve unknown choices/status values as confirmation items |
| PAS-IT-IAL3 | SRC-005 | IAL3 | List; New/Edit; Detail; Approval/Action | 3 | 16 | 0 | Inferred | Yes | Build from promoted requirement; preserve unknown choices/status values as confirmation items |
| PAS-IT-IAL4 | SRC-006 | IAL4 | List; New/Edit; Detail; Approval/Action | 3 | 16 | 0 | Inferred | Yes | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## IT / IT - Asset Inventory

| Spec ID | Source ID | Form | Screens | Sections | Fields | Child Galleries | Workflow | Ready | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PAS-IT-HI | SRC-002 | HI | List; New/Edit; Detail; Child Rows/Gallery | 5 | 26 | 3 | Not Required | Yes - with human confirmations | Build from promoted requirement; preserve unknown choices/status values as confirmation items |

## Caveats

- Rows are generated from already-extracted PDF requirement artifacts, not from new business confirmation.
- Values marked Unknown, Inferred, or Needs Human Confirmation must stay open until DXL/SME evidence confirms them.
- Original source PDFs and XML files remain reference-only and were not modified.
