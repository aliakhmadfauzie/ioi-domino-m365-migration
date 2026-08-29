# Form Requirement - Employee Personal Detail Update (EPDU)

> **Source ID**: SRC-HR-007 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 91/100
> **Evidence**: PyMuPDF direct text from `PRAI_SITE_FORM/HR/EPDU.pdf` (3 pages, 2,313 chars)
> **Promotion**: Promote with Human Confirmation - repeated table design and HR review states need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-007 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "EMPLOYEE PERSONAL DETAIL UPDATE - NEW" | Clearly Found |
| Form Purpose | Employee updates personal, education, children, family, spouse, and contact/tax details, then HR is notified for review/acceptance. | Clearly Found |
| Pages | 3 | Clearly Found |
| Submission Note | "Please check the details thoroughly before submit, as can't view back the form after submitted" | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Personal Details | 1 | Requester | EmpNo, Company, EmpName, NRIC_O, NRIC_N, Marital, Disabilities, addresses, phone, EPF, SOCSO, ITAX |
| Employee Education Background | 1-2 | Repeating table | InsName_N, FY_N, TY_N, Standard_N, Field_N, Place_N, Grd_N |
| Children Details | 2 | Repeating table | N_N, G_N, S_N, D_N, B_N, Ins_N, Q_N, Ds_N, TR_N |
| Family Details | 2 | Repeating table | FDN_N, FDR_N, R_N |
| Spouse Details | 2-3 | Requester | SpName, SpNRIC_N, SpWork, SpOccupation, SpComp, TelNo |
| Submission / HR Review | 3 | Submitter + HR review | Submittedby, Submittedon, HRAction, Acceptedby, Acceptedon |
| Hidden Fields | 3 | System/routing | DocAuthor, CDate, ModiDate, IT, HR_1, HR_2, HR_3, HR, HRHOD, Servers, Readers |

## 3. Field Requirements

### Personal Details

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Employee No. | `EmpNo` | Text/Person lookup | Clearly Found |
| Company | `Company` | Text | Clearly Found |
| Name | `EmpName` | Person/Text | Clearly Found |
| NRIC No. (Old) | `NRIC_O` | Text | Clearly Found |
| NRIC No. (New) | `NRIC_N` | Text | Clearly Found |
| Marital Status | `Marital` | Choice | Clearly Found, choices Unknown |
| Disabilities | `Disabilities` | Text/Choice | Clearly Found, choices Unknown |
| Permanent Address | `Address1` | Multiline | Clearly Found |
| Poscode | `Poscode1` | Text | Clearly Found |
| Tel No. | `TelNo1` | Text | Clearly Found |
| Correspondence Address | `Address2` | Multiline | Clearly Found |
| Postcode | `Poscode2` | Text | Clearly Found |
| Tel No. | `TelNo2` | Text | Clearly Found |
| EPF No. | `EPF` | Text | Clearly Found |
| SOCSO No. | `SOCSO` | Text | Clearly Found |
| Income Tax No. | `ITAX` | Text | Clearly Found |

### Repeating / Child-List Candidates

| Structure | Domino Fields | Recommendation | Confidence |
|---|---|---|---|
| Education rows | `InsName_1`-`InsName_5`, `FY_N`, `TY_N`, `Standard_N`, `Field_N`, `Place_N`, `Grd_N` | `MainDB_HR_Ext_EPDU_Education` child list or fixed 5 rows | Clearly Found |
| Children rows | `N_1`-`N_8`, `G_N`, `S_N`, `D_N`, `B_N`, `Ins_N`, `Q_N`, `Ds_N`, `TR_N` | `MainDB_HR_Ext_EPDU_Children` child list or fixed 8 rows | Clearly Found |
| Family rows | `FDN_1`-`FDN_10`, `FDR_N`, `R_N` | `MainDB_HR_Ext_EPDU_Family` child list or fixed 10 rows | Clearly Found |

### Spouse and Submission

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Name | `SpName` | Person/Text | Clearly Found |
| NRIC No. (New) | `SpNRIC_N` | Text | Clearly Found |
| Working | `SpWork` | Choice/Text | Clearly Found, choices Unknown |
| Occupation(Optional) | `SpOccupation` | Text | Clearly Found |
| Company | `SpComp` | Text | Clearly Found |
| Contact Tel. No. | `TelNo` | Text | Clearly Found |
| Submitted by | `Submittedby` | Person | Clearly Found |
| Submitted on | `Submittedon` | Date | Clearly Found |
| For Hr Use / Status | `HRAction` | Choice | Clearly Found, values Unknown |
| Accepted by | `Acceptedby` | Person | Clearly Found |
| Accepted on | `Acceptedon` | Date | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Not confirmed as approval; HR review/acceptance required | Inferred from HRAction and Accepted fields |
| Workflow Evidence | NOTIFY HR, HRAction, Acceptedby, Acceptedon, HR routing hidden fields | Clearly Found |
| Current State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

**Parent List**: `MainDB_HR`
**FormCode**: `EPDU`
**Child Lists**: `MainDB_HR_Ext_EPDU_Education`, `MainDB_HR_Ext_EPDU_Children`, `MainDB_HR_Ext_EPDU_Family` unless HR confirms fixed-row parent storage.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| EPDU-01 | What are the `HRAction` / review state values? | High |
| EPDU-02 | Should education, children, and family rows be child lists or fixed-row parent columns? | High |
| EPDU-03 | What are the choice values for Marital, Disabilities, Working, and child/family status fields? | Medium |
| EPDU-04 | Who may access/update personal identity and tax fields? | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with child-list decision |
| Approval Required | HR review/acceptance candidate, not full approval |
| Promotion Quality | 91/100 |
