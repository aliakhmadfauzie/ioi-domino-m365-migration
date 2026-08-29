# Master App PDF Source - Customer Questionnaire & Regulations 2025

> Master row: 230 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 230 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Customer Questionnaire & Regulations 2025 | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related | Source inventory |
| Form List | Customer Questionnaire & Regulations 2025 | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CUSTQUESREGU | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/Marketing/9_PCCustQuest25_Regulations.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.950 | HCL fallback needs review | 2 | 488 | 16 | 2 | companyname (radio buttons) |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/Marketing/9_PCCustQuest25_CustQuest.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.700 | HCL fallback needs review | 4 | 1890 | 53 | 4 | companyname (radio buttons) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Regulations | Inferred from PDF text | Needs Human Confirmation |
| 2 | Regulation No | Inferred from PDF text | Needs Human Confirmation |
| 3 | Sector | Inferred from PDF text | Needs Human Confirmation |
| 4 | Country | Inferred from PDF text | Needs Human Confirmation |
| 5 | Topic | Inferred from PDF text | Needs Human Confirmation |
| 6 | Customer Questionnaire | Inferred from PDF text | Needs Human Confirmation |
| 7 | Date Request | Inferred from PDF text | Needs Human Confirmation |
| 8 | request/per customer given | Inferred from PDF text | Needs Human Confirmation |
| 9 | Reply Section | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Log | Inferred from PDF text | Needs Human Confirmation |
| 11 | Qc Hod | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Qchod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | CC | CC | Text | 1 | Parsed from PDF text |
| 3 | REGULATION NO | RegNo | Text | 1 | Parsed from PDF text |
| 4 | SECTOR | Sector | Text | 1 | Parsed from PDF text |
| 5 | COUNTRY | Country | Text | 1 | Parsed from PDF text |
| 6 | TOPIC | Topic | Person/Text | 1 | Parsed from PDF text |
| 7 | REGULATIONS | Reg | Text | 1 | Parsed from PDF text |
| 8 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 9 | Last Updated on | DateModified | Date/Text | 1 | Parsed from PDF text |
| 10 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Author | Creator | Text | 1 | Parsed from PDF text |
| 12 | DateSubmitted | SubmitDate | Date/Text | 1 | Parsed from PDF text |
| 13 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 14 | QA User | QAUser | Text | 1 | Parsed from PDF text |
| 15 | QC User | QCUser | Text | 1 | Parsed from PDF text |
| 16 | Reader | Reader | Text | 1 | Parsed from PDF text |
| 17 | CQ No. | CQNo | Number/Text | 1 | Parsed from PDF text |
| 18 | Business Area | BusinessArea | Text | 1 | Parsed from PDF text |
| 19 | To QA & QC | ToAll | Text | 1 | Parsed from PDF text |
| 20 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 21 | Date Request | DateRequest | Date/Text | 1 | Parsed from PDF text |
| 22 | Customer Name | CustomerName | Person/Text | 1 | Parsed from PDF text |
| 23 | Agent/Trader | AgentName | Person/Text | 1 | Parsed from PDF text |
| 24 | Product | Product | Text | 1 | Parsed from PDF text |
| 25 | Packaging Type | PackType | Choice/Text | 1 | Parsed from PDF text |
| 26 | Customer Spec code | CustSpecCode | Text | 1 | Parsed from PDF text |
| 27 | Product Application | ProductApp | Text | 1 | Parsed from PDF text |
| 28 | Customer Type | CurrType | Choice/Text | 1 | Parsed from PDF text |
| 29 | deadline) | ResponseBy | Text | 1 | Parsed from PDF text |
| 30 | Questionnaire | Attachment | Text | 1 | Parsed from PDF text |
| 31 | Other Info | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 32 | Attachment | AttachmentFinal | Text | 1 | Parsed from PDF text |
| 33 | Remarks | OtherRemarks | Multiline Text | 1 | Parsed from PDF text |
| 34 | Related Regulation | Regulations | Text | 1 | Parsed from PDF text |
| 35 | Requestor | DateReturned | Date/Text | 1 | Parsed from PDF text |
| 36 | Completed by | CompletedBy | Text | 1 | Parsed from PDF text |
| 37 | Remark/ Attachment | PSRemark | Multiline Text | 1 | Parsed from PDF text |
| 38 | Category | CCRemark | Multiline Text | 1 | Parsed from PDF text |
| 39 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 40 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 42 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 43 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 44 | AEditor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 45 | Marketing user | MKTUser | Text | 1 | Parsed from PDF text |
| 46 | Utilities User | Utilities | Text | 1 | Parsed from PDF text |
| 47 | Logistics User | LOG | Text | 1 | Parsed from PDF text |
| 48 | QC HOD | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 49 | QAMail | QAMail | Text | 1 | Parsed from PDF text |
| 50 | QC Mail | QCMail | Text | 1 | Parsed from PDF text |
| 51 | CC | CCAll | Text | 1 | Parsed from PDF text |
| 52 | Marketing SN | MKTSN | Text | 1 | Parsed from PDF text |
| 53 | Mailing List FA | MailingListFA | Text | 1 | Parsed from PDF text |
| 54 | Mailing List Ref | MailingListRef | Text | 1 | Parsed from PDF text |
| 55 | Mailing List SN | MailingListSN | Text | 1 | Parsed from PDF text |
| 56 | QC - FA & GLY | QC | Text | 1 | Parsed from PDF text |
| 57 | QC - REF | QC2 | Text | 1 | Parsed from PDF text |
| 58 | QC - SN | QC3 | Text | 1 | Parsed from PDF text |
| 59 | QA | QA | Text | 1 | Parsed from PDF text |
| 60 | Prod - FA | PRD_1 | Text | 1 | Parsed from PDF text |
| 61 | Prod - Ref | PRD_2 | Text | 1 | Parsed from PDF text |
| 62 | All Company List | CompMail | Text | 1 | Parsed from PDF text |
| 63 | Notes Admin | ISG | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (3), review (2), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `CUSTQUESREGU`
Child-list recommendation: `MainDB_QA_Ext_CUSTQUESREGU_Rows` candidate for repeating row fields

Use the single-main-list pattern from DEC-2026-001. Parsed fields are evidence candidates only; final SharePoint internal names and choices require confirmation against Domino XML/DXL or business review.

## 7. Power Apps Build Specification

| Screen/Component | Requirement | Confidence |
| --- | --- | --- |
| List | Filter by site/owner/FormCode and status | Inferred |
| New/Edit | Render parsed PDF fields grouped by inferred sections | Inferred |
| Detail | Read-only view with audit/workflow metadata | Inferred |
| Approval Actions | Show only if workflow state confirms approval is required | Needs Human Confirmation |
| Child Rows | Use editable gallery only if child-list recommendation is confirmed | Needs Human Confirmation |

## 8. Human Confirmation Questions

| # | Question | Severity |
| --- | --- | --- |
| MASTER-230-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-230-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-230-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 2 |
| Parsed Field Count | 63 |
| Workflow Signal Count | 6 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
