# Master App PDF Source - PanCen - Storage Location Creation Form

> Master row: 23 | Site: Johor | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 23 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Storage Location Creation Form | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PCNSVR | Source inventory |
| Form List | MPSNetworkPrinter - Form \| Network - Form \| NewInv - Form \| External Storage Location - Form \| Internal Storage Location - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STORLOCACREA | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/IT/001_oleObject46.pdf | Extracted embedded PDF | text_match_medium | 0.500 | Explicit mapping | 1 | 373 | 12 | 0 | MPS Network Printer |
| source/Project Iventories/extracted-embedded-pdfs/Johor/IT/002_oleObject47.pdf | Extracted embedded PDF | sheet_order_fallback | 0.500 | Explicit mapping | 1 | 278 | 8 | 0 | Network Hardware Inventory Form |
| source/Project Iventories/extracted-embedded-pdfs/Johor/IT/003_oleObject48.pdf | Extracted embedded PDF | text_match_high | 0.379 | Explicit mapping | 3 | 1271 | 16 | 3 | PC HARDWARE LIST |
| source/Project Iventories/extracted-embedded-pdfs/Johor/IT/005_oleObject50.pdf | Extracted embedded PDF | text_match_high | 0.505 | Explicit mapping | 2 | 1446 | 11 | 5 | External Tank & Storage Location Creation |
| source/Project Iventories/extracted-embedded-pdfs/Johor/IT/006_oleObject51.pdf | Extracted embedded PDF | text_match_high | 0.761 | Explicit mapping | 3 | 1885 | 14 | 15 | Tank Creation/Extend/Transfer Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pc Hardware List | Inferred from PDF text | Needs Human Confirmation |
| 2 | General Info | Inferred from PDF text | Needs Human Confirmation |
| 3 | Notes/Return To It Status | Inferred from PDF text | Needs Human Confirmation |
| 4 | Hardware Configuration | Inferred from PDF text | Needs Human Confirmation |
| 5 | CPU Details : | Inferred from PDF text | Needs Human Confirmation |
| 6 | Monitor Details : | Inferred from PDF text | Needs Human Confirmation |
| 7 | Software Configurations | Inferred from PDF text | Needs Human Confirmation |
| 8 | For Accounts Use :- | Inferred from PDF text | Needs Human Confirmation |
| 9 | * Request No | Inferred from PDF text | Needs Human Confirmation |
| 10 | * Cc (Hod) | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Ckc | Inferred from PDF text | Needs Human Confirmation |
| 12 | Request No | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Printer | Printer | Text | 1 | Parsed from PDF text |
| 2 | Model | Model | Text | 1 | Parsed from PDF text |
| 3 | IP | IP | Text | 1 | Parsed from PDF text |
| 4 | S/N | SN | Text | 1 | Parsed from PDF text |
| 5 | Department | Dept | Text | 1 | Parsed from PDF text |
| 6 | Location | Location | Text | 1 | Parsed from PDF text |
| 7 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 8 | Created by | Authors | Text | 1 | Parsed from PDF text |
| 9 | Creation Date | MachineCreationDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Modification Date | MachineModificationDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Comments | MachineComments | Multiline Text | 1 | Parsed from PDF text |
| 12 | IT | IT | Text | 1 | Parsed from PDF text |
| 13 | MAC Address | MACAddress | Text | 1 | Parsed from PDF text |
| 14 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 15 | IP Address | IPAddress | Text | 1 | Parsed from PDF text |
| 16 | Serial Number | SerialNo | Text | 1 | Parsed from PDF text |
| 17 | Purchase Date | PURDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Created by | Authors; MachineCreationDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Last Modified by | MachineAuthor; DateModified | Date/Text | 1 | Parsed from PDF text |
| 20 | Access Type | DeskType | Choice/Text | 1 | Parsed from PDF text |
| 21 | Remark | Notes | Multiline Text | 1 | Parsed from PDF text |
| 22 | Hard disk size | HDType | Date/Text | 1 | Parsed from PDF text |
| 23 | Remark | Rem | Multiline Text | 1 | Parsed from PDF text |
| 24 | Processor | Processor | Text | 1 | Parsed from PDF text |
| 25 | Warranty | Start | Text | 1 | Parsed from PDF text |
| 26 | Monitor Model No | ModelM | Text | 1 | Parsed from PDF text |
| 27 | Monitor Serial No | SerialNoM | Text | 1 | Parsed from PDF text |
| 28 | OS Edition | OS; BIT; Bit | Text | 1 | Parsed from PDF text |
| 29 | Asset Info | AssetInfo | Text | 1 | Parsed from PDF text |
| 30 | PO No. | PoNumber | Number/Text | 1 | Parsed from PDF text |
| 31 | Running No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |
| 32 | ISG | ITAdmin | Text | 1 | Parsed from PDF text |
| 33 | * Storage Location Code | txtAreaLocNo | Text | 1 | Parsed from PDF text |
| 34 | Description | txtLocAdd1 | Multiline Text | 1 | Parsed from PDF text |
| 35 | * Storage Location Code | txtProteanLoc | Text | 1 | Parsed from PDF text |
| 36 | * Storage Location Desc. | txtSLocDesc | Text | 1 | Parsed from PDF text |
| 37 | Extended Status | ExtendedStatus | Choice/Text | 1 | Parsed from PDF text |
| 38 | Remarks | txtRejRem_1 | Multiline Text | 1 | Parsed from PDF text |
| 39 | Extended By | txtCpISGApp_1 | Text | 1 | Parsed from PDF text |
| 40 | Date | dtISGCreatedDate_1 | Date/Text | 1 | Parsed from PDF text |
| 41 | Mailing List - Notification | NotifyAll | Text | 1 | Parsed from PDF text |
| 42 | Notify Prod PIC/Editor | ProdMail | Person/Text | 1 | Parsed from PDF text |
| 43 | SAP - Incharge | CKC | Text | 1 | Parsed from PDF text |
| 44 | Physical Tank HOD Name | tankHodName | Person/Text | 1 | Parsed from PDF text |
| 45 | Tank Description | txtLocAdd1 | Multiline Text | 1 | Parsed from PDF text |
| 46 | To Plant | ToPlant | Text | 1 | Parsed from PDF text |
| 47 | HOD Editor | Editor1 | Person/Text | 1 | Parsed from PDF text |
| 48 | Tank HOD Editor | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 49 | Division Head Editor | Editor3 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (10), hod (7), approval (3), rejected (2), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `STORLOCACREA`
Child-list recommendation: `MainDB_IT_Ext_STORLOCACREA_Rows` candidate for repeating row fields

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
| MASTER-023-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-023-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-023-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 5 |
| Parsed Field Count | 49 |
| Workflow Signal Count | 23 |
| Notes | - |
