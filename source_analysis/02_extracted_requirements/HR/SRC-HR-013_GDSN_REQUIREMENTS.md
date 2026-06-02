# Form Requirement - Gift/Donation/Sponsorship Notification (GDSN)

> Source ID: SRC-HR-013 | Department: HR | Promoted: 2026-06-02 | Quality: 92/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/HR/GDSN.pdf` (3 pages, 1,210 chars)
> Promotion: Promote with Human Confirmation - HOD finality, notification routing, and choice values need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-013 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | Gift/Donation/Sponsorship Notification | Clearly Found |
| Form Purpose | Notify and endorse gift, donation, or sponsorship requests, including recipient, value, PO, submitter, HOD, and notification routing details. | Clearly Found |
| Pages | 3 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Part A - Initiator Section | 1-2 | Request details | ProjectCode, ReqType, company, Recipient, Name, Address, SAP_ID, Requestor, HOD, Department, Type, Purpose, otherPurpose, IsBenefit, benefitText, IsLogo, ItemDetail, GiftValue, DateRec, Quantity, Price, Total, IsPO, PoNo |
| Submitter | 2 | Submission | Notified, position, reportedDate |
| Part B - HOD Section | 2 | Endorsement | HODName, HODPost, HODDate, App, SendTo |
| Hidden Fields | 3 | System/routing | CA, Editor1, Editor2, ED, SGM, HR, FIN, PUR, IsPUR, MKT, IT, INO, MailList, Readers |

## 3. Field Requirements

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Notification No. | `ProjectCode` | Text | Clearly Found |
| Request Type | `ReqType` | Choice | Clearly Found, values need confirmation |
| Company | `company` | Text | Clearly Found |
| Relationship | `Recipient` | Text/Choice | Clearly Found |
| Name of person/company | `Name` | Text | Clearly Found |
| Address | `Address` | Multiline | Clearly Found |
| SAP No. / Vendor ID No. | `SAP_ID` | Text | Clearly Found |
| Requestor | `Requestor` | Person/Text | Clearly Found |
| HOD | `HOD` | Person | Clearly Found |
| Department | `Department` | Text | Clearly Found |
| Type | `Type` | Choice | Clearly Found, values need confirmation |
| Purpose of the gift | `Purpose`, `otherPurpose` | Choice/Text | Clearly Found |
| Benefit to Company | `IsBenefit`, `benefitText` | Boolean/Choice + multiline | Clearly Found |
| Gift with Company Logo | `IsLogo` | Boolean/Choice | Clearly Found |
| Gift details | `ItemDetail`, `GiftValue`, `DateRec`, `Quantity`, `Price`, `Total`, `IsPO`, `PoNo` | Mixed | Clearly Found |
| Submitter | `Notified`, `position`, `reportedDate` | Person/Text/Date | Clearly Found |
| HOD endorsement | `HODName`, `HODPost`, `HODDate`, `App`, `SendTo` | Mixed | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | HOD endorsement / notification workflow candidate | Clearly Found |
| Workflow Evidence | Submitted by, HOD section, App status, SendTo, CurrentAction, editor and department routing fields | Clearly Found |
| CurrentAction Field | `CA` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `GDSN`
Recommended storage: parent/extension fields for one-row request and endorsement data; no child-table structures detected.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| GDSN-01 | Is HOD endorsement the final approval, or do ED/SGM/HR/FIN/PUR/MKT routing fields represent later required approvals/notifications? | High |
| GDSN-02 | What are valid `CA` and `App` state values? | High |
| GDSN-03 | Confirm choice values for Request Type, Type, Purpose, Benefit, Logo, and Purchase through PO. | Medium |
| GDSN-04 | Which department routing fields are conditional, especially PUR/IsPUR and FIN/MKT? | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with routing/status confirmation |
| Approval Required | HOD endorsement / notification candidate |
| Promotion Quality | 92/100 |

