# Form Requirement - Foreign Workers Work Permit Database (FWWPD)

> Source ID: SRC-HR-011 | Department: HR | Promoted: 2026-06-02 | Quality: 90/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/HR/FWWPD.pdf` (5 pages, 3,378 chars)
> Promotion: Promote with Human Confirmation - record/database ownership, truncated internal names, and table storage need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-011 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | Foreign Workers Work Permit | Clearly Found |
| Form Purpose | Maintain foreign-worker work permit, passport, insurance, FOMEMA, MYEG, and employment contract tracking records. | Clearly Found |
| Pages | 5 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Section A - General Information | 1-2 | Record details | Company, Status, Reason, Remark, COMemo, Name, EmpNo, Department, Hostel, DOB, DOC, passport fields, nationality, contract period, permit fields, WorkerCode, SocsoNo |
| Section B - Hospitalization & Surgical Scheme | 2-3 | Fixed table | Y_N, PN_N, SN_N, P_N, F_N, T_N, Att_N, D_N |
| Section C - FOMEMA Status | 3-4 | Fixed table | DY_N, C_N, DC_N, FR_N, FRmks_N, AttC_N, DD_N |
| Section D - MYEG Process | 4 | Fixed table | EY_N, DA_N, EY_N_1, ST_N, ECC_N, DS_N_1, S_N, DS_N |
| Section E - Foreign Employment Contract | 4 | Fixed table | FY_N, CPF_N, CPT_N, PB_N, FDS_N |
| Hidden Fields | 5 | System/routing | CurrentAction, IT, HR, HRHOD, PdgEmpCon, HRList, EditorsE |

## 3. Field Requirements

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Company | `Company` | Text | Clearly Found |
| Status | `Status` | Choice | Clearly Found, values need confirmation |
| Reason / Remark | `Reason`, `Remark` | Multiline | Clearly Found |
| Check-Out-Memo | `COMemo` | Attachment/Text | Clearly Found |
| Name | `Name` | Person/Text | Clearly Found |
| Employee No. | `EmpNo` | Text | Clearly Found |
| Department | `Department` | Text | Clearly Found |
| Hostel Address | `Hostel` | Multiline | Clearly Found |
| Date of Birth | `DOB` | Date | Clearly Found |
| Date of Commencement | `DOC` | Date | Clearly Found |
| New/Old Passport fields | `PassportNoNew`, `PassportNew`, `PassportExpiryDate`, `PassportNoOld`, `PassportOld` | Text/Date/Attachment | Found; expiry internal name needs confirmation |
| Nationality | `Nationality` | Choice/Text | Clearly Found |
| Contract Period | `ContractPeriod`, `ContractPeriod_1` | Date range | Clearly Found |
| Work Permit fields | `WorkPermitExpiryDate`, `WorkPermitNo`, `Permit`, `WorkerCode` | Mixed | Found; expiry internal name needs confirmation |
| SOCSO No. | `SocsoNo` | Text | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Not confirmed as approval; record/task tracking candidate | Inferred |
| Workflow Evidence | Status, Done markers, CurrentAction, IT Admin, HR Reminder, HR HOD, Pending Employment Contract, Section E Editors | Clearly Found |
| CurrentAction Field | `CurrentAction` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `FWWPD`
Child-list candidates:
- `MainDB_HR_Ext_FWWPD_Insurance`
- `MainDB_HR_Ext_FWWPD_FOMEMA`
- `MainDB_HR_Ext_FWWPD_MYEG`
- `MainDB_HR_Ext_FWWPD_Contracts`

If the 10-row tables are fixed by business rule, they can be modelled as fixed columns in an extension list instead.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| FWWPD-01 | Is FWWPD a standalone HR record form or a supporting database used by FWWPE? | High |
| FWWPD-02 | Confirm exact internal names for passport expiry and work permit expiry fields; extracted PDF text dropped the first character. | High |
| FWWPD-03 | Should insurance, FOMEMA, MYEG, and employment contract rows be child lists or fixed 10-row columns? | High |
| FWWPD-04 | What are valid `Status` and `CurrentAction` values? | Medium |
| FWWPD-05 | Which HR/admin roles may edit Section E and reminder fields? | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with table/storage confirmation |
| Approval Required | Not confirmed; record/task tracking |
| Promotion Quality | 90/100 |

