# Form Requirement — Hardware Inventory (HI)

> **Source ID**: SRC-002
> **Analysis Date**: 2026-06-01
> **Analyst**: Domino PDF Source Analysis Agent
> **Evidence Base**: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/HI.pdf` (607 KB), `analysis/pdf-ui-inventory.md`, `docs/central-form-reference.md`

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-002 | Clearly Found |
| Department | IT | Clearly Found |
| Form Name | Hardware Inventory | Clearly Found |
| Domino Form Name | newhware | Clearly Found |
| Source File | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/HI.pdf` | Clearly Found |
| PDF Size | 607 KB | Clearly Found |
| Est. Visible Fields | ~50 | Inferred |
| Form Purpose | Track IT hardware assets — configuration, software, accounts, and procurement information | Clearly Found |
| Single or Multi-Form | Single form | Clearly Found |

## 2. Form Sections

| Section No. | Section Name | Type | Purpose | Visibility Rule | Role Dependency | Confidence |
|---|---|---|---|---|---|---|
| 1 | General Information | Requester | Asset identification, user assignment, location, procurement info | Always visible | Requester/IT Staff | Clearly Found |
| 2 | Hardware Configuration | Information | CPU, RAM, HDD, monitor, IP, MAC, OS details | Always visible | IT Staff | Clearly Found |
| 3 | Software | Information | Installed software list | Always visible | IT Staff | Clearly Found |
| 4 | Accounts | Information | User accounts, email, SAP accounts | Always visible | IT Staff | Clearly Found |
| 5 | Notes | Information | Additional remarks | Always visible | Requester/IT Staff | Clearly Found |

## 3. Field Extraction

| Field ID | Section | Field Label | Suggested Internal Name | Data Type | Required | Default Value | Choices | Field Group | Repeating Table | Evidence Confidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HI-001 | General | Asset Tag / ID | `assetTag` | Text | Inferred | — | — | Header | No | Clearly Found | |
| HI-002 | General | Asset Type | `assetType` | Choice | Inferred | — | Unknown | Header | No | Clearly Found | |
| HI-003 | General | Brand / Model | `brandModel` | Text | Inferred | — | — | Header | No | Clearly Found | |
| HI-004 | General | Serial Number | `serialNumber` | Text | Inferred | — | — | Header | No | Clearly Found | |
| HI-005 | General | Assigned User | `assignedUser` | Person | Inferred | — | — | Header | No | Clearly Found | |
| HI-006 | General | Department | `department` | Text | Inferred | — | Unknown | Header | No | Clearly Found | |
| HI-007 | General | Location | `location` | Text | Inferred | — | Unknown | Header | No | Clearly Found | |
| HI-008 | General | Purchase Date | `purchaseDate` | Date | Optional (Inferred) | — | — | Header | No | Clearly Found | |
| HI-009 | General | Warranty Expiry | `warrantyExpiry` | Date | Optional (Inferred) | — | — | Header | No | Clearly Found | |
| HI-010 | General | Status | `assetStatus` | Choice | Inferred | — | Unknown | Header | No | Clearly Found | Active, Retired, etc. |
| HI-011 | General | PO Number | `poNumber` | Text | Optional (Inferred) | — | — | Header | No | Inferred | |
| HI-012 | Hardware Config | CPU | `cpu` | Text | Inferred | — | — | Information | No | Clearly Found | |
| HI-013 | Hardware Config | RAM | `ram` | Text | Inferred | — | — | Information | No | Clearly Found | |
| HI-014 | Hardware Config | HDD / Storage | `hddStorage` | Text | Inferred | — | — | Information | No | Clearly Found | |
| HI-015 | Hardware Config | Monitor | `monitor` | Text | Optional (Inferred) | — | — | Information | No | Clearly Found | |
| HI-016 | Hardware Config | IP Address | `ipAddress` | Text | Optional (Inferred) | — | — | Information | No | Clearly Found | |
| HI-017 | Hardware Config | MAC Address | `macAddress` | Text | Optional (Inferred) | — | — | Information | No | Clearly Found | |
| HI-018 | Hardware Config | Operating System | `operatingSystem` | Text | Inferred | — | Unknown | Information | No | Clearly Found | |
| HI-019 | Hardware Config | OS Version | `osVersion` | Text | Optional (Inferred) | — | — | Information | No | Inferred | |
| HI-020 | Hardware Config | Hostname | `hostname` | Text | Inferred | — | — | Information | No | Clearly Found | |
| HI-021 | Software | Software Name | `softwareName` | Text | Optional (Inferred) | — | — | Information | Yes (Child List Candidate) | Clearly Found | Repeating rows |
| HI-022 | Software | Software Version | `softwareVersion` | Text | Optional (Inferred) | — | — | Information | Yes (Child List Candidate) | Clearly Found | Repeating rows |
| HI-023 | Software | License Key | `licenseKey` | Text | Optional (Inferred) | — | — | Information | Yes (Child List Candidate) | Inferred | |
| HI-024 | Accounts | Account Type | `accountType` | Choice | Optional (Inferred) | — | Unknown | Information | No | Clearly Found | Email, SAP, etc. |
| HI-025 | Accounts | Account Username | `accountUsername` | Text | Optional (Inferred) | — | — | Information | No | Clearly Found | |
| HI-026 | Notes | Remarks | `remarks` | Multiline Text | No | — | — | Comments | No | Clearly Found | |

## 4. Choice Fields

| Field Label | Choices Found | Source Evidence | Exact Text | Confidence |
|---|---|---|---|---|
| Asset Type | Unknown | PDF analysis — dropdown not visible | — | Unknown |
| Department | Unknown | PDF analysis — likely department list | — | Unknown |
| Location | Unknown | PDF analysis — likely site/location list | — | Unknown |
| Status | Unknown | PDF analysis — likely Active/Retired/In Repair | — | Unknown |
| Operating System | Unknown | PDF analysis — likely Windows/Linux/macOS variants | — | Unknown |
| Account Type | Unknown | PDF analysis — likely Email/SAP/Domain | — | Unknown |

## 5. Validation Rules

| Field | Validation Rule | Evidence | Confidence |
|---|---|---|---|
| Asset Tag / ID | Must be unique | Inferred from inventory system practice | Inferred |
| Serial Number | Should not be empty | Inferred from hardware tracking practice | Inferred |
| IP Address | Must be valid IP format if entered | Inferred from technical field type | Inferred |
| MAC Address | Must be valid MAC format if entered | Inferred from technical field type | Inferred |

## 6. Role and Visibility Rules

| Section/Field | Visible To | Editable By | Hidden From | Condition | Evidence | Confidence |
|---|---|---|---|---|---|---|
| All sections | IT Staff | IT Staff | — | Always visible | No role restrictions visible in PDF | Inferred |
| General Information | IT Staff | IT Staff | — | On create/edit | General data entry form | Inferred |

## 7. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Not Required | Clearly Found |
| Approval Type | N/A | Clearly Found |

### Status Values

| Status Value | Description | Evidence | Confidence |
|---|---|---|---|
| Active | Asset in use | Inferred from inventory system | Inferred |
| Inactive | Asset not in use | Inferred | Inferred |
| Retired | Asset decommissioned | Inferred | Inferred |
| In Repair | Asset being serviced | Inferred | Inferred |

**Evidence Note**: No approval sections, signature blocks, or routing instructions visible in the HI PDF. This is classified as a data-entry/inventory form without approval workflow.

## 8. Notifications

| Trigger | Recipient | Message/Purpose | Evidence | Confidence |
|---|---|---|---|---|
| None visible | — | No notification evidence in PDF | — | Unknown |

## 9. SharePoint Design Recommendation

| Attribute | Value | Confidence |
|---|---|---|
| Recommended Parent List | `MainDB_IT` | Clearly Found |
| Recommended Child List(s) | `MainDB_IT_Ext_Assets` (for software list and detailed config) | Inferred |
| Parent-Child Design | Yes — hardware header in parent, software list in child | Inferred |

### Parent List Columns (MainDB_IT)

| Column Name | Column Type | Required | Choice Values | Lookup Target | Person Field | Notes |
|---|---|---|---|---|---|---|
| Title | Single line of text | Yes | — | — | — | Asset Tag/ID |
| FormCode | Choice | Yes | HI | — | — | Discriminator |
| hiAssetType | Choice | Inferred | Needs Human Confirmation | — | — | |
| hiBrandModel | Single line of text | Inferred | — | — | — | |
| hiSerialNumber | Single line of text | Inferred | — | — | — | |
| hiAssignedUser | Person | Inferred | — | — | Yes | |
| hiDepartment | Single line of text | Inferred | — | — | — | |
| hiLocation | Single line of text | Inferred | — | — | — | |
| hiPurchaseDate | Date | No | — | — | — | |
| hiWarrantyExpiry | Date | No | — | — | — | |
| hiAssetStatus | Choice | Inferred | Needs Human Confirmation | — | — | |
| hiPONumber | Single line of text | No | — | — | — | |
| hiCPU | Single line of text | Inferred | — | — | — | |
| hiRAM | Single line of text | Inferred | — | — | — | |
| hiHDDStorage | Single line of text | Inferred | — | — | — | |
| hiMonitor | Single line of text | No | — | — | — | |
| hiIPAddress | Single line of text | No | — | — | — | |
| hiMACAddress | Single line of text | No | — | — | — | |
| hiOperatingSystem | Choice | Inferred | Needs Human Confirmation | — | — | |
| hiOSVersion | Single line of text | No | — | — | — | |
| hiHostname | Single line of text | Inferred | — | — | — | |
| hiAccountType | Choice | No | Needs Human Confirmation | — | — | |
| hiAccountUsername | Single line of text | No | — | — | — | |
| hiRemarks | Multiple lines of text | No | — | — | — | |
| hiCurrentStatus | Choice | Yes | Submitted | — | — | Non-approval form; store as Submitted/Completed |

### Child List Columns (MainDB_IT_Ext_Assets)

| Column Name | Column Type | Required | Choice Values | Lookup Target | Person Field | Notes |
|---|---|---|---|---|---|---|
| Title | Single line of text | Yes | — | — | — | Software name |
| ParentID | Lookup | Yes | — | MainDB_IT:ID | — | |
| hiSoftwareName | Single line of text | Yes | — | — | — | |
| hiSoftwareVersion | Single line of text | No | — | — | — | |
| hiLicenseKey | Single line of text | No | — | — | — | |

## 10. Power Apps Build Specification

| Screen | Section | Control Type | Data Card / Component | Validation | Visibility | Submit Mapping | Notes |
|---|---|---|---|---|---|---|---|
| New/Edit | General Information | Text inputs, People picker, Date pickers, Dropdowns | DynamicFormRenderer | Asset Tag, Serial Number required | Always | MainDB_IT | |
| New/Edit | Hardware Config | Text inputs, Dropdown for OS | DynamicFormRenderer | CPU, RAM, HDD required | Always | MainDB_IT | |
| New/Edit | Software | Repeating table / Gallery | EditableTable | — | Always | Ext_Assets | Child list entries |
| New/Edit | Accounts | Text inputs, Dropdown | DynamicFormRenderer | — | Always | MainDB_IT | |
| New/Edit | Notes | Multiline text | DynamicFormRenderer | — | Always | MainDB_IT | |
| List | All | Gallery / Data table | ListView | — | — | MainDB_IT + Ext_Assets | Join child records |
| Detail | All | Read-only display | DetailView | — | — | MainDB_IT + Ext_Assets | Show child records |

## 11. Open Questions

| Question | Area | Severity | Why It Matters | Suggested Owner |
|---|---|---|---|---|
| What are the exact Asset Type choices? | Field Choices | Medium | Affects categorization and filtering | IT Asset Manager |
| What are the exact Asset Status values? | Field Choices | Medium | Affects lifecycle tracking | IT Asset Manager |
| Should software be in a child list or a single multiline field? | SharePoint Design | Medium | Affects list architecture | SharePoint Architect / IT Team |
| Are purchase/warranty dates always captured or optional? | Field Required | Low | Affects validation | IT Team |
| Should child records (software) be created inline or after parent save? | App Design | Low | Affects UX flow | App Developer |

## 12. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes — with choice values confirmed |
| Needs Human Confirmation | Yes — choice values (Asset Type, Status, OS, Account Type) |
| Blocked | No |
| Duplicate | No |
| Not a Form | No |
