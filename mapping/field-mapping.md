# Field Mapping Documentation

> **Updated**: 2026-06-01 — Added reconciliation notes from SharePoint integration audit
> **Source**: Domino DXL/XML field inventory + SharePoint list designs
> **CSV Export**: `mapping/field-mapping.csv`

> **⚠️ RECONCILIATION NOTE**: The mappings below reflect the ORIGINAL DESIGN intent. A
> SharePoint integration audit (2026-06-01) found discrepancies between this document
> and the actual SharePoint schema. See `analysis/sharepoint-integration-audit.md`
> for the full reconciliation. Key differences:
> - Many EAF/HI/ITSSR fields are stored on **extension lists** (`MainDB_IT_Ext_Access`,
>   `MainDB_IT_Ext_Support`, `MainDB_IT_Ext_Assets`), not on `MainDB_IT` as shown below
> - Several columns listed as `Person/Group` are actually stored as `Single line of text`
>   in SharePoint (e.g., `Requestor_Name`, `EAF_TargetUser_Email`)
> - Several columns listed as `Choice` are stored as `Single line of text` (e.g., `CurrentStatus`)
> - Column names differ: `EAF_TargetUser_Email` instead of `TargetUser`, `EAF_SystemName`
>   instead of `SystemName`, `EAF_Justification` instead of `Description`

## Overview
Detailed field-by-field mapping from Domino to Microsoft 365. Maps Domino fields to SharePoint list columns in `MainDB_IT`, `MainDB_IT_Ext_*`, and standalone lists.

## Mapping Summary

| Category | Forms | Fields Mapped | SharePoint Target |
|---|---|---|---|
| **M1 — User & Access** | EAF, NIR, RS, SFAR, UR | ~120 fields | MainDB_IT + MainDB_IT_Ext_Access |
| **M2 — IT Support** | ITSSR, PRF, IAL1-5, ITDR, ITDR2 | ~90 fields | MainDB_IT + MainDB_IT_Ext_Support |
| **M3 — Hardware** | HI, ITSC, 1_HWInv_NewInv | ~70 fields | MainDB_IT_Ext_Assets |
| **M4 — SAP** | SAPAMR, SAPCA, SAPCR, SAPSLCF, SAPSOF, SAPSOF2, SAPTR | ~160 fields | MainDB_IT_Ext_SAP |
| **M5 — Documentation** | IOIP, ITI, ITP, ITP2 | ~20 fields | MainDB_IT_Ext_Docs |
| **M6 — Disaster Recovery** | SAPDRP | ~5 fields | MainDB_IT_Ext_Infra |
| **Total** | **28 forms (including sub-variants)** | **~465 fields** | **6 SharePoint lists** |

## EAF (VPN/Citrix) — Full Mapping

| Domino Field | Domino Type | Kind | M365 Target | Target Column | Target Type | Transformation | Risk |
|---|---|---|---|---|---|---|---|
| req | names | editable | MainDB_IT | Requestor_Name | Person/Group | Map to current user | Low |
| User | text | editable | MainDB_IT | TargetUser | Person/Group | Direct | Low |
| justification | text | editable | MainDB_IT | Description | Multiple lines | Direct | Low |
| system | text | editable | MainDB_IT | SystemName | Choice | Map to config list | Low |
| Type | text | editable | MainDB_IT | ApplicationType | Choice | VPN/Citrix/Other | Low |
| depthead | names | editable | MainDB_IT | HODApprover | Person/Group | Direct | Low |
| CC | names | editable | MainDB_IT | CCRecipients | Multiple lines | Multi-person | Low |
| date1 | datetime | computed | MainDB_IT | SubmittedDate | Date/Time | Default=Now | Low |
| currentaction | text | computed | MainDB_IT | CurrentStatus | Choice | Workflow state map | Medium |
| status1 | text | computed | MainDB_IT | HODStatus | Choice | Approved/Rejected/Pending | Low |
| status2 | text | computed | MainDB_IT | DirectorStatus | Choice | Approved/Rejected/Pending | Low |
| status3 | text | computed | MainDB_IT | ITManagerStatus | Choice | Approved/Rejected/Pending | Low |
| status4 | text | computed | MainDB_IT | ITCompletionStatus | Choice | Completed/Rejected/Pending | Low |
| date2 | datetime | computed | MainDB_IT | HODApprovedDate | Date/Time | Set on approval | Low |
| date3 | datetime | computed | MainDB_IT | DirectorApprovedDate | Date/Time | Set on approval | Low |
| date4 | datetime | computed | MainDB_IT | ITManagerApprovedDate | Date/Time | Set on approval | Low |
| date5 | datetime | computed | MainDB_IT | ITCompletionDate | Date/Time | Set on provisioning | Low |
| comment1 | text | editable | MainDB_IT | HODRemarks | Multiple lines | Direct | Low |
| comment2 | text | editable | MainDB_IT | DirectorRemarks | Multiple lines | Direct | Low |
| comment3 | text | editable | MainDB_IT | ITManagerRemarks | Multiple lines | Direct | Low |
| comment4 | text | editable | MainDB_IT | ITRemarks | Multiple lines | Direct | Low |
| HODNAME | names | computed | MainDB_IT | HODApprovedBy | Person/Group | Set on approval | Low |
| DIVNAME | names | computed | MainDB_IT | DirectorApprovedBy | Person/Group | Set on approval | Low |
| name4 | names | computed | MainDB_IT | ITManagerApprovedBy | Person/Group | Set on approval | Low |
| name5 | names | computed | MainDB_IT | ITCompletedBy | Person/Group | Set on provisioning | Low |
| isPCN | text | computed | MainDB_IT | IsPCN | Yes/No | "1" → Yes | Low |
| AgentName | text | editable | MainDB_IT | Application | Choice | Direct | Low |
| ClientID | text | editable | MainDB_IT | ClientID | Single line | Direct | Low |
| Group | text | editable | MainDB_IT | UserGroup | Single line | Direct | Low |
| Company | text | computed | MainDB_IT | Company | Choice | Map to config list | Low |
| Country | text | computed | MainDB_IT | Country | Choice | Direct | Low |
| HApp | names | computed | MainDB_IT | SecondApprover | Person/Group | Direct | Low |

## Hardware Inventory (HI) — Key Mappings

| Domino Field | Domino Type | Kind | M365 Target | Target Column | Target Type | Transformation | Risk |
|---|---|---|---|---|---|---|---|
| machineid | text | editable | MainDB_IT_Ext_Assets | AssetTag | Single line | Direct | Low |
| usedby | text | editable | MainDB_IT_Ext_Assets | AssignedTo | Person/Group | Map to person | Low |
| macdesc | text | editable | MainDB_IT_Ext_Assets | Description | Single line | Direct | Low |
| comp | keyword | editable | MainDB_IT_Ext_Assets | ComputerType | Choice | Desktop/Notebook/Server/Printer | Low |
| cpuspd | keyword | editable | MainDB_IT_Ext_Assets | CPU | Choice | Direct | Low |
| hddtype | keyword | editable | MainDB_IT_Ext_Assets | HDDType | Choice | Direct | Low |
| ram | keyword | editable | MainDB_IT_Ext_Assets | RAM | Choice | Direct | Low |
| ipadd_1 | text | editable | MainDB_IT_Ext_Assets | IPAddress | Single line | Direct | Low |
| winversion | keyword | editable | MainDB_IT_Ext_Assets | OSVersion | Choice | Direct | Low |
| MACAddress | text | editable | MainDB_IT_Ext_Assets | MACAddress | Single line | Direct | Low |
| SerialNo | text | editable | MainDB_IT_Ext_Assets | SerialNo | Single line | Direct | Low |

## ITSSR (IT Support) — Key Mappings

| Domino Field | Domino Type | Kind | M365 Target | Target Column | Target Type | Transformation | Risk |
|---|---|---|---|---|---|---|---|
| CaseNo | text | editable | MainDB_IT_Ext_Support | CaseNo | Single line | Direct | Low |
| ReportedBy | text | editable | MainDB_IT_Ext_Support | ReportedBy | Person/Group | Map to person | Low |
| CreationDate | datetime | computed | MainDB_IT_Ext_Support | CreationDate | Date/Time | Default=Now | Low |
| INO | text | computed | MainDB_IT_Ext_Support | INONumber | Single line | Auto-generated via Flow | Medium |
| CA | text | editable | MainDB_IT_Ext_Support | Category | Choice | Direct | Low |
| Category | text | editable | MainDB_IT_Ext_Support | SubCategory | Choice | Direct | Low |

## Key Transformation Rules

| Rule ID | Description | Applies To |
|---|---|---|
| T1 | Auto-numbering: INO agent → Power Automate flow on SharePoint list creation | ITSSR, PRF |
| T2 | isPCN flag: "1" → Yes/No field for conditional routing | EAF |
| T3 | Computed date fields set by Power Automate on stage transitions | All workflow forms |
| T4 | Person/Group mapping: Domino names field → SharePoint Person/Group column | req, depthead, HODNAME, etc. |
| T5 | Keyword list → SharePoint Choice column (preserve all options) | comp, cpuspd, hddtype, etc. |
| T6 | Multi-value CC → SharePoint Multiple lines of text (JSON serialized) | CC, SendTo |

## Status

| Form | Fields Mapped | Status | Notes |
|---|---|---|---|
| EAF | 32/32 | ✅ Complete | Full 5-stage workflow mapped |
| HI | 58/58 | ✅ Complete | All hardware fields mapped |
| ITSSR | 23/23 | ✅ Complete | IT support fields mapped |
| NIR | 27/27 | ✅ Complete | Notes ID request fields mapped |
| PRF | 23/23 | ✅ Complete | Program request fields mapped |
| RS | 21/21 | ✅ Complete | Reset password fields mapped |
| SFAR | 26/26 | ✅ Complete | Share folder access mapped |
| SAPCR | 54/54 | ✅ Complete | SAP change request mapped |
| IOIP | 10/10 | ✅ Complete | Policy form mapped |
| ITI | 3/3 | ✅ Complete | IT Info mapped |
| ITP | 10/10 | ✅ Complete | Procedures mapped |
| ITSC | 27/27 | ✅ Complete | Server checklist mapped |
| SAPAMR | 26/26 | ✅ Complete | Auth matrix mapped |
| SAPCA | 16/16 | ✅ Complete | Config access mapped |
| SAPDRP | 5/5 | ✅ Complete | DRP mapped |
| SAPSLCF | 11/11 | ✅ Complete | Storage location mapped |
| SAPTR | 34/34 | ✅ Complete | Transport request mapped |
| SAPSOF | 385+ | ⚠️ Partial | Largest form — needs dedicated pass |
| **Total** | **~465** | **95%** | |
