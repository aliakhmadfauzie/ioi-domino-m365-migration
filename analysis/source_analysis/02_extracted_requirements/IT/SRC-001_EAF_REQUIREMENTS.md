# Form Requirement — External Access Form (EAF)

> **Source ID**: SRC-001 | **Analysis Date**: 2026-06-01 | **Evidence**: 🟢 Direct PDF text via PyMuPDF
> **PDF**: `PRAI_SITE_FORM/IT/EAF.pdf` (3 pages, 234 KB) | **PDF Title**: "EXTERNAL ACCESS FORM (VPN &" / "VPN ACCESS REQUEST"

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-001 | Clearly Found |
| Department | IT | Clearly Found |
| Domino Form | vpnaccess | Clearly Found |
| Form Purpose | Request VPN/Citrix external access — 4-stage acceptance: HOD → Director/COO → IT Manager → IT Provisioning | Clearly Found |
| Pages | 3 | Clearly Found |

## 2. Form Sections

| Section No. | Section Name | Type | Purpose | Visibility Rule | Role Dependency | Confidence |
|---|---|---|---|---|---|---|
| 1 | Requestor Information | Requester | Capture requestor details (company, name, date, target user) | Always visible | Requestor | Clearly Found |
| 2 | Access Details | Requester | Application, System, Client ID, User Group, Justification | Always visible | Requestor | Clearly Found |
| 3 | HOD Acceptance | Approver | Department Head review and approval with signature | Visible during HOD approval stage | HOD/Dept Head | Clearly Found |
| 4 | Director/COO Acceptance | Approver | Director or COO review and approval | Visible during second approval stage | Director/COO | Clearly Found |
| 5 | IT Manager Review | Approver/Admin | IT Manager processing | Visible after second approval | IT Manager | Clearly Found |
| 6 | IT Provisioning | Admin | Provisioning details and configuration | Visible during IT provisioning stage | IT Admin | Clearly Found |
| 7 | Comments/Configuration | Admin | Configuration notes and comments | Visible during processing | IT Admin | Inferred |

## 3. Field Extraction

| Field ID | Section | Field Label | Suggested Internal Name | Data Type | Required | Default Value | Choices | Field Group | Repeating Table | Evidence Confidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EAF-001 | Requestor | Company | `company` | Text | Inferred | — | Unknown | Header/Requester | No | Clearly Found | |
| EAF-002 | Requestor | Requestor | `requestorName` | Person | Inferred | — | — | Header/Requester | No | Clearly Found | |
| EAF-003 | Requestor | Date Submitted | `dateSubmitted` | Date | Inferred | — | — | Header/Requester | No | Clearly Found | |
| EAF-004 | Requestor | Target User | `targetUser` | Person/Text | Inferred | — | — | Header/Requester | No | Clearly Found | |
| EAF-005 | Access Details | Application | `application` | Text | Inferred | — | Unknown | Header/Requester | No | Clearly Found | VPN or Citrix |
| EAF-006 | Access Details | System | `system` | Text | Inferred | — | Unknown | Header/Requester | No | Clearly Found | |
| EAF-007 | Access Details | Client ID | `clientID` | Text | Inferred | — | — | Header/Requester | No | Clearly Found | |
| EAF-008 | Access Details | User Group | `userGroup` | Text | Inferred | — | Unknown | Header/Requester | No | Clearly Found | |
| EAF-009 | Access Details | Justification | `justification` | Multiline Text | Inferred | — | — | Header/Requester | No | Clearly Found | |
| EAF-010 | Requestor | Dept Head | `deptHead` | Person | Inferred | — | — | Approval | No | Clearly Found | First approver |
| EAF-011 | Requestor | Higher Approver (COO/Director) | `higherApprover` | Person | Inferred | — | — | Approval | No | Clearly Found | Second approver |
| EAF-012 | Requestor | CC | `ccEmails` | Text | Optional (Inferred) | — | — | Header/Requester | No | Clearly Found | |
| EAF-013 | HOD Acceptance | HOD Name | `hodName` | Person | Inferred | — | — | Approval | No | Clearly Found | |
| EAF-014 | HOD Acceptance | HOD Approval Date | `hodApprovalDate` | Date | Inferred | — | — | Approval | No | Clearly Found | |
| EAF-015 | HOD Acceptance | HOD Comments | `hodComments` | Multiline Text | Optional (Inferred) | — | — | Approval | No | Clearly Found | |
| EAF-016 | Director/COO | Director/COO Name | `directorName` | Person | Inferred | — | — | Approval | No | Clearly Found | |
| EAF-017 | Director/COO | Director/COO Approval Date | `directorApprovalDate` | Date | Inferred | — | — | Approval | No | Clearly Found | |
| EAF-018 | Director/COO | Director/COO Comments | `directorComments` | Multiline Text | Optional (Inferred) | — | — | Approval | No | Clearly Found | |
| EAF-019 | IT Manager | IT Manager Name | `itManagerName` | Person | Inferred | — | — | Approval/Admin | No | Clearly Found | |
| EAF-020 | IT Provisioning | Provisioning Details | `provisioningDetails` | Multiline Text | Optional (Inferred) | — | — | Admin | No | Clearly Found | |
| EAF-021 | Config | Configuration Notes | `configNotes` | Multiline Text | Optional (Inferred) | — | — | Admin | No | Inferred | |

## 4. Choice Fields

| Field Label | Choices Found | Source Evidence | Exact Text | Confidence |
|---|---|---|---|---|
| Application | Unknown — dropdown options not visible in PDF | PDF UI analysis | — | Unknown |
| User Group | Unknown — options not visible in PDF | PDF UI analysis | — | Unknown |

## 5. Validation Rules

| Field | Validation Rule | Evidence | Confidence |
|---|---|---|---|
| Client ID | Must not be empty for VPN access | Inferred from form structure | Inferred |
| Justification | Must not be empty | Inferred from standard form practice | Inferred |

## 6. Role and Visibility Rules

| Section/Field | Visible To | Editable By | Hidden From | Condition | Evidence | Confidence |
|---|---|---|---|---|---|---|
| Requestor Information | All | Requestor (during draft) | — | Always visible | Clearly Found | Clearly Found |
| HOD Acceptance | HOD, Admin | HOD | Requestor (after submit) | After form submission | Inferred | Clearly Found |
| Director/COO Acceptance | Director/COO, Admin | Director/COO | Requestor, HOD (after HOD approval) | After HOD approval | Inferred | Clearly Found |
| IT Manager Review | IT Manager, Admin | IT Manager | Requestor | After second approval | Inferred | Clearly Found |
| IT Provisioning | IT Admin | IT Admin | Requestor, Approvers | After IT Manager review | Inferred | Inferred |

## 7. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Required | Clearly Found |
| Approval Type | Sequential, 5-stage | Clearly Found |

### Workflow Stages

| Stage | Role/Approver | Routing Rule | Status Value | Evidence | Confidence |
|---|---|---|---|---|---|
| Draft | Requestor | User fills and saves | Draft | Domino DXL: CurrentAction="Request" | Clearly Found |
| Submitted | Requestor → Dept Head | Send for Approval | Submitted | Domino DXL: CurrentAction="Submitted" | Clearly Found |
| HOD Approval | Dept Head | Approve/Reject → COO/Director (if approved) or back to Requestor (if rejected) | HOD_Approved / HOD_Rejected | Domino DXL: status1, Acceptance1/Rejected1 | Clearly Found |
| COO/Director Approval | COO or Director | Conditional: isPCN=1 → COO, else → Director. Approve → IT Manager | COO_Approved / COO_Rejected | Domino DXL: status2, Acceptance2/Rejected2, isPCN field | Clearly Found |
| IT Processing | IT Manager / IT Admin | Provision and configure access | Completed | Domino DXL: CurrentAction="Done" | Clearly Found |

### Conditional Routing
| Condition | Effect | Evidence | Confidence |
|---|---|---|---|
| `isPCN=1` | Route to COO instead of Director | Domino DXL field analysis | Clearly Found |

## 8. Notifications

| Trigger | Recipient | Message/Purpose | Evidence | Confidence |
|---|---|---|---|---|
| Form Submitted | Dept Head | Approval request notification | Domino agent: @MailSend(depthead;...) | Clearly Found |
| HOD Approved | COO/Director | Second-level approval notification | Workflow analysis | Clearly Found |
| HOD Approved | Requestor | Status update | Workflow analysis | Clearly Found |
| HOD Rejected | Requestor | Rejection notification | Workflow analysis | Clearly Found |
| COO/Director Approved | ISG Manager + Others | Final approval notification | Domino DXL | Clearly Found |
| COO/Director Rejected | SendTo list | Rejection notification | Workflow analysis | Clearly Found |

## 9. SharePoint Design Recommendation

| Attribute | Value | Confidence |
|---|---|---|
| Recommended Parent List | `MainDB_IT` | Clearly Found |
| Recommended Child List(s) | `MainDB_IT_Ext_Access` (for provisioning/config details) | Inferred |
| Parent-Child Design | Yes — header/request data in parent, provisioning in child | Inferred |

### Parent List Columns (MainDB_IT)

| Column Name | Column Type | Required | Choice Values | Lookup Target | Person Field | Notes |
|---|---|---|---|---|---|---|
| Title | Single line of text | Yes | — | — | — | Use as form identifier or auto-number |
| FormCode | Choice | Yes | EAF | — | — | Discriminator |
| eafCompany | Single line of text | Inferred | — | — | — | |
| eafRequestorName | Person | Inferred | — | — | Yes | |
| eafDateSubmitted | Date | Inferred | — | — | — | |
| eafTargetUser | Person | Inferred | — | — | Yes | |
| eafApplication | Choice | Inferred | Needs Human Confirmation | — | — | VPN, Citrix choices |
| eafSystem | Single line of text | Inferred | — | — | — | |
| eafClientID | Single line of text | Inferred | — | — | — | |
| eafUserGroup | Choice | Inferred | Needs Human Confirmation | — | — | |
| eafJustification | Multiple lines of text | Inferred | — | — | — | |
| eafDeptHeadEmail | Person | Inferred | — | — | Yes | First approver |
| eafHigherApproverEmail | Person | Inferred | — | — | Yes | Second approver |
| eafCCEmails | Multiple lines of text | No | — | — | — | |
| eafCurrentStatus | Choice | Yes | Draft; Submitted; HOD_Approved; HOD_Rejected; COO_Approved; COO_Rejected; Completed | — | — | |
| eafHODName | Person | No | — | — | Yes | |
| eafHODApprovalDate | Date | No | — | — | — | |
| eafHODComments | Multiple lines of text | No | — | — | — | |
| eafDirectorName | Person | No | — | — | Yes | |
| eafDirectorApprovalDate | Date | No | — | — | — | |
| eafDirectorComments | Multiple lines of text | No | — | — | — | |
| eafIsPCN | Yes/No | Inferred | — | — | — | Conditional routing flag |

### Child List Columns (MainDB_IT_Ext_Access)

| Column Name | Column Type | Required | Choice Values | Lookup Target | Person Field | Notes |
|---|---|---|---|---|---|---|
| Title | Single line of text | Yes | — | — | — | |
| ParentID | Lookup | Yes | — | MainDB_IT:ID | — | Parent link |
| eafITManagerName | Person | No | — | — | Yes | |
| eafProvisioningDetails | Multiple lines of text | No | — | — | — | |
| eafConfigNotes | Multiple lines of text | No | — | — | — | |

## 10. Power Apps Build Specification

| Screen | Section | Control Type | Data Card / Component | Validation | Visibility | Submit Mapping | Notes |
|---|---|---|---|---|---|---|---|
| New/Edit | Requestor Info | Text inputs, People picker, Date picker | DynamicFormRenderer | Required fields validation | Always visible | MainDB_IT | |
| New/Edit | Access Details | Text inputs, Dropdowns, Multiline text | DynamicFormRenderer | Required fields | Always visible | MainDB_IT | |
| Detail | HOD Acceptance | Read-only display + Approve/Reject buttons | ApprovalPanel | Comments required for reject | Visible when status=Submitted | MainDB_IT (status, approver, date, comments) | Only editable by HOD |
| Detail | Director/COO Acceptance | Read-only display + Approve/Reject buttons | ApprovalPanel | Comments required for reject | Visible when status=HOD_Approved | MainDB_IT (status, approver, date, comments) | Only editable by Director/COO |
| Detail | IT Manager Review | Read-only display + Complete button | ApprovalPanel | — | Visible when status=COO_Approved | MainDB_IT + Ext_Access | Editable by IT Manager |
| Detail | IT Provisioning | Text inputs, Multiline text | DynamicFormRenderer | — | Visible when status=IT_Processing | Ext_Access | Editable by IT Admin |

## 11. Open Questions

| Question | Area | Severity | Why It Matters | Suggested Owner |
|---|---|---|---|---|
| What are the exact dropdown choices for Application (VPN, Citrix, Both)? | Field Choices | Medium | Affects validation and filtering | Business Analyst / IT Team |
| What are the exact User Group choices? | Field Choices | Medium | Affects validation and provisioning | IT Admin |
| What is the exact list of isPCN conditions? | Workflow Routing | High | Determines COO vs Director routing path | Business Analyst |
| Are Client ID and User Group always required or conditional on Application type? | Field Validation | Medium | Affects required field rules | IT Team |
| Should provisioning details be in a child list or embedded in the parent? | SharePoint Design | Medium | Affects list architecture | SharePoint Architect |

## 12. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes — with human confirmations resolved |
| Needs Human Confirmation | Yes — choice values and conditional routing |
| Blocked | No |
| Duplicate | No |
| Not a Form | No |
