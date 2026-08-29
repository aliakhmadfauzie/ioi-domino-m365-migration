# Workflow Register

> Workflow, approval, routing, and status register for every form already extracted from PDF.
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

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-FIN-CAR | SRC-FIN-001 | CAR | Yes - complex multi-stage approval and completion workflow | Clearly Found | Needs Human Confirmation | Unknown | Contract amount matrix, Finance verification, HOD reviews, recommender, SGM/Director approval, budget exceeded path, completion approvals, cancellation, CurrentAction and editor routing / CA | Needs Human Confirmation |

## FIN / Finance - Credit Management

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-FIN-CMF_A | SRC-FIN-002 | CMF_A | Yes - multi-stage credit approval workflow | Clearly Found | Needs Human Confirmation | Unknown | GM approval, Finance review, SFC approval, SGM/ED approvals, Finance acknowledgement, cancellation, CurrentAction and routing fields / CA | Needs Human Confirmation |
| WF-FIN-CMF_B | SRC-FIN-003 | CMF_B | Yes - temporary credit limit approval workflow | Clearly Found | Needs Human Confirmation | Unknown | Requested by, Marketing Manager approval, GM approval, Finance review, ED approval, Finance acknowledgement, TCLC expiry, CurrentAction and routing fields / CA | Needs Human Confirmation |
| WF-FIN-CMF_C | SRC-FIN-004 | CMF_C | Yes - multi-stage customer credit review workflow | Clearly Found | Needs Human Confirmation | Unknown | Marketing Manager endorsement, GM approval, Finance review, ED approval, Finance acknowledgement, CurrentAction and routing fields / CA | Needs Human Confirmation |

## FIN / Finance - Expenditure Approval

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-FIN-EARF | SRC-FIN-005 | EARF | Yes - low-value asset approval and completion workflow | Clearly Found | Needs Human Confirmation | Unknown | Finance verification, Department Head approval, reviewed-by section, Division Head approval, completion, cancellation, CurrentAction and routing fields / CA | Needs Human Confirmation |

## FIN / Finance - Service Entry

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-FIN-RSES | SRC-FIN-006 | RSES | Yes - two-stage approval/completion workflow | Clearly Found | Needs Human Confirmation | Unknown | Approver Acceptance with Approve/Reject; Finance Acceptance with Complete/Reject; CurrentAction and routing fields / CA | Needs Human Confirmation |

## HR / HR - Applications Support

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-HRAPR | SRC-HR-015 | HRAPR | Problem-report handling workflow candidate | Clearly Found | Needs Human Confirmation | Unknown | Submit, GHR/ISG action, solution/completion, rejection, requestor acceptance, KIV/archive, CurrentAction, role and reminder fields / CurrentAction | Needs Human Confirmation |

## HR / HR - Attendance

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-AWHR | SRC-HR-002 | AWHR | **Required** | Clearly Found | 1; 2; 3; (Optional) | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |

## HR / HR - Cafeteria

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-CIR | SRC-HR-003 | CIR | **Not Required** | Clearly Found | Needs Human Confirmation | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |

## HR / HR - Contract

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-FTCR | SRC-HR-010 | FTCR | Yes - multi-stage approval candidate | Clearly Found | Needs Human Confirmation | Unknown | Submitter, department/division recommendation, endorsement, AGM HR review, COO/SGM approval, ED approval, HR status, CurrentAction and editor routing fields / CA / CurrentAction | Needs Human Confirmation |

## HR / HR - Duty Roster

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-DRD | SRC-HR-005 | DRD | **Required — Clearly Found** | Clearly Found | Needs Human Confirmation | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |

## HR / HR - Employee Data

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-EPDU | SRC-HR-007 | EPDU | Not confirmed as approval; HR review/acceptance required | Clearly Found | Needs Human Confirmation | Unknown | NOTIFY HR, HRAction, Acceptedby, Acceptedon, HR routing hidden fields / Not found | Needs Human Confirmation |

## HR / HR - Employee Health

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-EPHR | SRC-HR-008 | EPHR | Not Required / Record Form Candidate | Clearly Found | Needs Human Confirmation | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |

## HR / HR - Exit

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-EEN | SRC-HR-006 | EEN | Inferred / Needs Human Confirmation | Clearly Found | Needs Human Confirmation | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |

## HR / HR - Foreign Worker

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-FWWPD | SRC-HR-011 | FWWPD | Not confirmed as approval; record/task tracking candidate | Clearly Found | Needs Human Confirmation | Unknown | Status, Done markers, CurrentAction, IT Admin, HR Reminder, HR HOD, Pending Employment Contract, Section E Editors / CurrentAction | Needs Human Confirmation |
| WF-HR-FWWPE | SRC-HR-012 | FWWPE | Yes - multi-stage workflow | Clearly Found | Needs Human Confirmation | Unknown | Superior reply, HOS acceptance, HOD endorsement, HR approval, completion sections, withdrawal, CurrentAction and editor routing fields / CurrentAction | Needs Human Confirmation |

## HR / HR - Gift/Donation/Sponsorship

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-GDSN | SRC-HR-013 | GDSN | HOD endorsement / notification workflow candidate | Clearly Found | Needs Human Confirmation | Unknown | Submitted by, HOD section, App status, SendTo, CurrentAction, editor and department routing fields / CA | Needs Human Confirmation |

## HR / HR - Information

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-HEALTHINFO | SRC-HR-014 | HEALTHINFO | No approval visible in extracted text | Clearly Found | Needs Human Confirmation | Unknown | CurrentAction exists; no approval/endorsement/rejection section appears / CurrentAction | Needs Human Confirmation |

## HR / HR - Survey

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-ESF | SRC-HR-009 | ESF | Not Required / Survey Form Candidate | Clearly Found | Needs Human Confirmation | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |

## HR / HR - Workforce

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-HR-BSD | SRC-HR-001 | BSD | **Required** | Clearly Found | 1; 2; 3 | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |
| WF-HR-CWR | SRC-HR-004 | CWR | Inferred / Needs Human Confirmation | Clearly Found | Needs Human Confirmation | Unknown | Derived from promoted requirement file / CurrentAction/CA present | Needs Human Confirmation |

## IT / IT - Access

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-IT-EAF | SRC-001 | EAF | Required | Clearly Found | Draft; Submitted; HOD Approval; COO/Director Approval; IT Processing | Draft; Submitted; HOD_Approved / HOD_Rejected; COO_Approved / COO_Rejected; Completed | Sequential, 5-stage / CurrentAction/CA present | Requestor; Requestor → Dept Head; Dept Head; COO or Director; IT Manager / IT Admin |

## IT / IT - Activity Logs

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-IT-IAL1 | SRC-003 | IAL1 | Inferred | Clearly Found | Entry; Submitted; Reviewed | Draft / Entry; Submitted; Reviewed / Completed | Single-stage review / Not found | IT Staff; IT Staff → Reviewer; Reviewer |
| WF-IT-IAL2 | SRC-004 | IAL2 | Inferred | Clearly Found | Entry; Submitted; Reviewed | Draft / Entry; Submitted; Reviewed / Completed | Single-stage review / Not found | IT Staff; IT Staff → Reviewer; Reviewer |
| WF-IT-IAL3 | SRC-005 | IAL3 | Inferred | Clearly Found | Entry; Submitted; Reviewed | Draft / Entry; Submitted; Reviewed / Completed | Single-stage review / Not found | IT Staff/ISG; ISG Staff → Reviewer; Reviewer (e.g., ISG Manager) |
| WF-IT-IAL4 | SRC-006 | IAL4 | Inferred | Clearly Found | Entry; Submitted; Reviewed | Draft / Entry; Submitted; Reviewed / Completed | Single-stage review / Not found | IT Staff/DC Ops; DC Staff → Reviewer; Reviewer (e.g., DC Manager) |

## IT / IT - Asset Inventory

| WF ID | Source ID | Form | Approval | Evidence | Stages | Status Values | Routing / Current Action | Roles |
|---|---|---|---|---|---|---|---|---|
| WF-IT-HI | SRC-002 | HI | Not Required | Clearly Found | Needs Human Confirmation | Unknown | N/A / Not found | Needs Human Confirmation |

## Caveats

- Rows are generated from already-extracted PDF requirement artifacts, not from new business confirmation.
- Values marked Unknown, Inferred, or Needs Human Confirmation must stay open until DXL/SME evidence confirms them.
- Original source PDFs and XML files remain reference-only and were not modified.
