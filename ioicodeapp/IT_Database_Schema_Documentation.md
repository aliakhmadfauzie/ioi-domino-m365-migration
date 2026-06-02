# IT Database Schema Documentation
## Lotus Notes / Domino — IT Department Forms & Databases

**Extraction Date:** 22 May 2026  
**Source:** DXL XML exports + Inventory text files  
**Sites Covered:** Johor (PanCen) · Penang (IOI Penang / Oleo Local)  
**Total Modules:** 23

---

## Table of Contents

| # | Module Code | Database Name | Site |
|---|---|---|---|
| 1 | PanCen_HWInv | PanCen – Hardware Inventory | Johor |
| 2 | PanCen_SAPDR | PanCen – SAP Disaster Recovery (DRP) | Johor |
| 3 | PanCen_SAPLoc | PanCen – Storage Location Creation Form | Johor |
| 4 | EAF | External Access Form (VPN & Citrix) | Penang |
| 5 | HI | Hardware Inventory | Penang |
| 6 | IAL | IT Activity Log – NEW | Penang |
| 7 | IOIP | IOI Policy | Penang |
| 8 | ITDR | IT Report – 2026 | Penang |
| 9 | ITI | IT Info | Penang |
| 10 | ITSC | IT Server Checklist 2026 | Penang |
| 11 | ITSSR | IT Support & Service Request (SSR) 2026 | Penang |
| 12 | NIR | Notes ID Request | Penang |
| 13 | ITP | IT Procedures / Training Manuals | Penang |
| 14 | PRF | Program Request Form (PRF) 2026 | Penang |
| 15 | RS | Reset Password / Unlock ID | Penang |
| 16 | SAPAMR | SAP Authorisation Matrix Review | Penang |
| 17 | SAPCA | SAP Config Access | Penang |
| 18 | SAPCR | SAP & WB Change Request Form | Penang |
| 19 | SAPDR | SAP Disaster Recovery (DRP) | Penang |
| 20 | SAPLoc | SAP – Storage Location Creation Form | Penang |
| 21 | SAPSOF | SAP Sign Off Form | Penang |
| 22 | SAPTR | SAP Transport Request | Penang |
| 23 | SFAR | Share Folder Access Requisition | Penang |

---

---

# SITE: JOHOR (PanCen)

---

## Module 1 — PanCen Hardware Inventory

**Code:** `PanCen_HWInv`  
**Database Name:** PanCen – Hardware Inventory  
**NSF Path:** `PanCen - Current\HWInv.nsf`  
**Extraction Date:** 22/05/2026 3:53 PM  
**Launch:** Frameset `FS`

### Forms

#### Form: `newhware` — PC Hardware List

| Field Name | Type | Kind | Label / Description |
|---|---|---|---|
| status | keyword | editable | Status · options: Active, New, Returned, Scrap, Unallocated, Under repair |
| server | keyword | editable | H/Ware Type · radiobutton: SERVER, DESKTOP, NOTEBOOK |
| LastAuditedBy | datetime | editable | Last audited on |
| TagNo | text | editable | Machine ID (7 digits YYMM999) |
| AccessType | keyword | editable | Access Type · radiobutton: CITRIX USER, DIRECT USER, BOTH, STANDALONE |
| machineid | text | editable | Computer name (legacy field, hidden in read/edit/print) |
| compname | text | editable | Computer name (input translated to UPPERCASE) |
| usedby | text | editable | Used by |
| macdesc | text | editable | Computer Model |
| loc | keyword | editable | Current Location (plant location list) |
| comp | keyword | editable | Company · options: PCOC, PCEO |
| dept | keyword | editable | Department (lookup from AllShared\PCNDepartment) |
| cputype | text | editable | CPU Type |
| cpusno | text | editable | CPU Serial No. / Support No. |
| cpuspeed | text | editable | CPU Speed |
| cpuspd | keyword | editable | CPU Speed unit · options: Mhz, Ghz |
| hddsize | text | editable | Hard disk size |
| hddtype | keyword | editable | Hard disk unit · options: MB, GB |
| ramsize | text | editable | RAM size |
| ram | keyword | editable | RAM unit · options: MB, GB |
| ramtype | keyword | editable | RAM type · options: DDR, DDR2, DDR3, EDO, SDRAM |
| monmodel | text | editable | Monitor model |
| inch | keyword | editable | Monitor size · options: 14", 15", 17", 19", 23" |
| monitortype | keyword | editable | Monitor type · options: CRT, LCD |
| cdtype | keyword | editable | CD-DRIVE · options: CD-R, CD-RW, Combo Drive, DVD-R, DVD-RW, External CD-ROM, External CD-RW |
| vlan | keyword | editable | VLAN · options: 10, 16, 26, 30, 31, 32, 34, 35, 88, 90, 95 |
| SANStorage | text | editable | SAN Storage (Server only) |
| ipadd | text | editable | IP Address (primary) |
| ipadd_1 | text | editable | IP Address (secondary) |
| winversion | keyword | editable | Windows version · options: Win 2000 Server, Win PRO 2000, Win XP Professional, Windows 7, Windows 8, Windows Server 2003/2008/2012 |
| winsp | keyword | editable | Windows SP · options: SP 1, SP 2, SP 3, SP 4, None |
| winkey | text | editable | Windows product key |
| msversion | keyword | editable | Microsoft Office version · options: MS Office 2000/2003/2007/2010/2012/2013/2016/XP/NIL |
| WinRegCode | text | editable | Windows Registration Code |
| MSOfficeKey | text | editable | Microsoft Office Product Key |
| antiversion | keyword | editable | Anti-virus version · options: Kaspersky 6, KES 8, ESET |
| notesver | keyword | editable | Lotus Notes version · options: R7.0.2, R8.5.1, R8.5.3 |
| others | text | editable | Others |
| DRPyn | keyword | editable | Auto-startup Excel DRP File · options: Yes, No |
| sentby | keyword | editable | Sent by · options: Thanabalan, Tinakaran, Ung Tay Aik |
| datesent | text | editable | Date sent |
| probfindings | text | editable | Problem findings |
| actions | text | editable | Actions taken |
| LastAuditDate | text | editable | Last Audit Date |
| LastAuditBy | text | editable | Last Audit By |
| ISGRemarks | text | editable | ISG Remarks |
| RemarksISG | richtextlite | editable | ISG Remarks (rich text) |
| prevuser | text | editable | Previous user |
| current | text | editable | Current |
| hwareused | keyword | editable | Hardware used |
| hwareused_1 | text | editable | Hardware used (other) |
| addram | keyword | editable | Add RAM |
| ram_1 | keyword | editable | RAM (added) |
| ramtype_1 | keyword | editable | RAM type (added) |
| datechng | text | editable | Date changed |
| sentby_1 | keyword | editable | Sent by (additional) |
| CarNo | text | editable | Car No |
| FARno | text | editable | FAR No |
| MDNFno | text | editable | MDNF No |
| Vendor | text | computed | Vendor |
| PoNumber | text | editable | PO Number |
| PoDate | datetime | editable | PO Date |
| DoNo | text | editable | DO No |
| DoDate | datetime | editable | DO Date |
| InvoiceNo | text | editable | Invoice No |
| InvDate | datetime | editable | Invoice Date |

#### Form: `DepartmentPrinter` — Department Printer

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Printer | text | editable | Printer |
| Model | text | editable | Model |
| IP | text | editable | IP |
| SN | text | editable | Serial No. |
| Dept | keyword | editable | Department |
| Location | text | editable | Location |
| Remark | text | editable | Remark |

#### Form: `MPSNetworkPrinter` (alias: `NP`) — MPS Network Printer

Same structure as DepartmentPrinter (Model, IP, SN, Location, Remark).

#### Form: `NewInv` — New Inventory (Server / Desktop / Notebook)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| status | keyword | editable | Status |
| type | keyword | editable | Type (recalculates on change) |
| DeskType | keyword | editable | Desktop Type |
| srvrmodel | keyword | editable | Server Model |
| usedby | text | editable | Used By |
| ram | keyword | editable | RAM unit · options: MB, GB |
| hddtype | keyword | editable | HDD unit · options: MB, GB |
| HDType | keyword | editable | HD Type |
| hddsize_1 | text | editable | HDD size (secondary) |
| hddtype_1 | keyword | editable | HDD unit (secondary) |
| HDType_1 | keyword | editable | HD Type (secondary) |
| Rem | text | editable | Remark |
| Start | datetime | editable | Warranty Start |
| End | datetime | editable | Warranty End |
| ModelM | text | editable | Monitor Model |
| SerialNoM | text | editable | Monitor Serial No. |
| inch | keyword | editable | Monitor size |
| StartM | datetime | editable | Monitor Warranty Start |
| winversion | keyword | editable | Windows version |
| winsvrversion | keyword | editable | Windows Server version |
| msversion | keyword | editable | MS Office version |
| MSOfficeKey | text | editable | MS Office Key |
| Vendor | text | computed | Vendor |
| MachineCreationDate | datetime | computed | Machine Creation Date |
| MachineAuthor | names | computed | Machine Author |
| DateModified | datetime | computed | Date Modified |
| Year | datetime | computed | Year |
| Month | datetime | computed | Month |
| INO | text | computed | Running No |

#### Form: `Network` — Network Hardware

| Field Name | Type | Kind | Label |
|---|---|---|---|
| MACAddress | text | editable | MAC Address |
| Model | text | editable | Model |
| Name | text | editable | Name |
| IPAddress | text | editable | IP Address |
| SerialNo | text | editable | Serial No |
| Location | text | editable | Location |
| MachineCreationDate | datetime | computed | Machine Creation Date |
| MachineAuthor | names | computed | Machine Author |
| DateModified | datetime | computed | Date Modified |

#### Form: `Checklist` — Software Checklist (response form)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| R_1 – R_18 | text | editable | Checklist items (rows 1–18) |
| Owner | names | editable | Owner |
| link | richtext | computed | Document Link |

#### Form: `Reminder` (nocompose)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Subject | text | computed | Subject |
| DateSent | datetime | computedwhencomposed | Date Sent |
| rTxtDocLink | richtext | computed | Document Link |
| compname | text | computed | Computer Name |
| CopyTo | names | computed | CC |
| SendTo | names | computed | To |

#### Subform: `History`

Fields: IT, MachineComments, MachineModificationDate, DateModified, MachineAuthor, MachineCreationDate, Authors

### Views

| View Name | Selection Formula | Key Columns |
|---|---|---|
| All Desktops | `type="DESKTOP" & Status="ACTIVE"` | Dept, Company, Machine ID, Computer name, Used by, Current Loc., Model, CPU S/N, HDD, RAM, Processor, Warranty Start/End, OS, Windows version, MS Office, Last Audited |
| All Servers | `type="SERVER" & Status="ACTIVE"` | Same columns |
| All Notebooks | `type="NOTEBOOK" & Status="ACTIVE"` | Same columns |
| All List | All hardware | All fields combined |
| All List by UsedBy / ComputerName / Department / OS / Office / MachineID | Sorted views | Respective sort column |
| SCRAPDesktops / SCRAPServer / SCRAPNotebook / SCRAPPrinters | `status="SCRAP"` by type | Company, Dept, Computer name |
| Unallocated / UnallocatedDesktop | `Status="Unallocated"` | Company, Dept, Computer name |
| All Printers | Printer forms | Company, Dept, Printer, Model, IP, SN, Location |
| NetworkHardware | `Form="Network"` | MACAddress, Model, Name, IPAddress, SerialNo, Location |
| SoftChecklist / SoftChecklist\PdgAccept / SoftChecklist\Draft | `Form="Checklist"` | Checklist columns |
| ARCHIVED | `Status="ARCHIVED"` | Standard columns |
| KRAKPI | KPI data | Computed KPI columns |
| RunningNumber / ComputerModel / lookup | Lookup views | INO / compmodel |
| Reminders | `Form="Reminder"` | Subject, DateSent, User |
| Spare | Spare hardware | Standard columns |
| TESTING | Testing view | All fields |

### Agents

| Agent | Status |
|---|---|
| Set | ENABLED |
| Refresh Docs | ENABLED |
| Modi | ENABLED |
| INO | ENABLED |
| FORMULA | ENABLED |
| RemExpiry | ENABLED |
| DB_NSF | ENABLED |

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Mohd Syed/OU=PanCen/O=PHB | Editor | Person |
| CN=Amir Afdzan/OU=PanCen/O=PHB | Editor | Person |
| CN=Prakash/OU=PanCen/O=PHB | Editor | Person |
| PanCen IT | Editor | Person Group |
| CN=PCNSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 2 — PanCen SAP Disaster Recovery (DRP)

**Code:** `PanCen_SAPDR`  
**Database Name:** PanCen – SAP Disaster Recovery (DRP)  
**NSF Path:** `PanCen - Current\SAPDR_PanCen.nsf`  
**Extraction Date:** 22/05/2026 3:55 PM

### Forms

#### Form: `SAP_DR Issue` — SAP Disaster Recovery Record

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Year | datetime | computedwhencomposed | Year |
| Month | datetime | computedwhencomposed | Month |
| INO | text | computed | Running Number |
| dtSubmission | datetime | computed | Date Issued |
| DRNo | text | computed | DR Number |
| Disp_dtSubmission | datetime | computedfordisplay | Display Submission Date |
| Requestor1 | names | computedwhencomposed | Requestor |
| Recipient1 | names | editable | Recipient (To) |
| dtDRDate | datetime | editable | DR Date |
| chkSAPProcess | keyword | editable | SAP Process (checkbox) |
| txtDRIssue | text | editable | DR Process Issue |
| txtReqComments | text | editable | Requestor Comments |
| dtReplyDate | datetime | computed | Date Replied |
| COP | text | editable | Cause of DR Issue |
| Pa | text | editable | Corrective/Preventive Action |
| Whom | text | editable | Person Responsible (PIC) |
| When | datetime | editable | Completion Date |
| Pa_1 | text | editable | Corrective/Preventive Action (2) |
| Whom_1 | text | editable | PIC (2) |
| When_1 | datetime | editable | Completion Date (2) |
| CPA | keyword | editable | CPA Status |
| dtCommentDate | datetime | computed | Comment Date |
| nmAcceptedBy | names | computed | Accepted By |
| Comment1_1 | text | editable | Comments |
| txtUserAttachment | richtext | editable | Attachment |
| NewStatus | keyword | editable | New Status |
| Body | richtext | editable | Comments Body |
| dtVerifiedOn | datetime | computed | Verified On |
| nmVerifiedBy | names | computed | Verified By |
| FollowUpDate | datetime | editable | Follow Up Date |

#### Form: `SAP_DR NoIssue` — SAP DR No Issue Record

Key fields (subset): Year, Month, INO, dtSubmission, DRNo, Requestor1, dtDRDate, chkSAPProcess, txtReqComments

#### Form: `ProcedureEntryV1` — Procedure Entry

| Field Name | Type | Kind | Label |
|---|---|---|---|
| TimeCreated | datetime | computedwhencomposed | Time Created |
| TimeModified | text | computedfordisplay | Time Modified |
| Distributed | datetime | computed | Distributed |
| Subject | text | editable | Subject |
| EffectDate | datetime | editable | Effective Date |
| Dept | keyword | editable | Department |
| Body | richtext | editable | Body |
| Comments | text | editable | Comments |

#### Forms: `ReplyMemo`, `AcceptMemo`, `ImpMemo` — Workflow Memos (renderpassthrough)

Computed fields: DateOFReminder, DRNo, DueDate, rTxtDocLink

#### Forms: `Contacts`, `Reports` (renderpassthrough — reference documents)

### Views

| View Name | Selection Formula | Key Columns |
|---|---|---|
| Summary | `Form="SAP_DR Issue"` | DRNo, DR Date, SAP Process, Requestor, Status |
| Summary NoIssue | `Form="SAP_DR NoIssue"` | DRNo, Date |
| 1) Draft | `CurrentAction="Request"` | DRNo, Date, Requestor |
| 2) All Documents | All | All columns |
| 3) By Category | All | Category, DRNo |
| 4) Pending Endorsement | `CurrentAction="Submitted"` | DRNo, Date |
| 5) Pending Approval | `CurrentAction="Replied"` | DRNo, Date |
| 6) Pending Distribution | ProcedureEntryV1 pending | Subject, Date |
| 8) Old Archive | Archived | DRNo, Date |
| 9) Completed | Completed | DRNo, Date |
| DR_Draft | `CurrentAction="Request"` | DRNo, Date |
| PdgReply | `CurrentAction="Submitted"` | DRNo, DR Date, Requestor |
| PdgAcceptance | `CurrentAction="Replied"` | DRNo, DR Date, Requestor |
| PdgFinalStatus | `CurrentAction="Accepted"` | DRNo, DR Date, Requestor |
| PdgReply_Rem / PdgAcceptance_Rem / PdgFinalStatus_Rem | Reminder views | DRNo, Due Date |
| Rejected | Rejected | DRNo, Date |
| All_DRIssue | All DR Issues | DRNo, Date, Status |
| Contacts / Reports | Reference forms | Contact / Report info |
| All_Reminders | Reminders | Subject, Date |
| lookup / lookupDR / lookupDRIssue | Running number lookups | INO |

### Agents

PdgReply · PdgAcceptance · PdgImp · Change creator · When document is being pasted · Refresh Docs · Archive Old Procedures · Clear · AE1 · App · SET · Ref · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Zuriyati/OU=PanCen/O=PHB | Editor | Person |
| CN=Emillia/OU=PanCen/O=PHB | Editor | Person |
| CN=Mahani/OU=PanCen/O=PHB | Editor | Person |
| CN=Tan Wei Shen/OU=PMS/O=PHB | Editor | Person |
| CN=Tan Kean Hua/OU=PMS/O=PHB | Reader | Person |
| SAP BPO - Johor | Editor | Person Group |
| SAP Key Users - Johor | Editor | Person Group |
| PanCen Group | Reader | Person Group |
| Pancen Deputy Managers & Above | Editor | Person Group |
| PanCen IT | Editor | Person Group |
| CN=PCNSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 3 — PanCen Storage Location Creation Form

**Code:** `PanCen_SAPLoc`  
**Database Name:** PanCen – Storage Location Creation Form  
**NSF Path:** `PanCen - Current\SAPSLoc.nsf`  
**Extraction Date:** 22/05/2026 3:57 PM

### Forms

#### Forms: `External Storage Location` (alias: `external`) & `Internal Storage Location` (alias: `internal`)

Both share the same field structure:

| Field Name | Type | Kind | Label |
|---|---|---|---|
| txtReqNo | text | computed | Request No |
| txtReqBy | text | editable | By (Requestor name) |
| authorReqBy | authors | computedwhencomposed | Submitter |
| dtSubmittedTimestamp | datetime | editable | Date Submitted |
| txtDesignation | text | editable | Designation |
| cboDep | keyword | editable | Department |
| txtPhoneNo | text | editable | Phone No. / Ext. |
| namesDepHead | names | editable | CC (HOD) |
| cboProteanSite | keyword | editable | Plant Code (Requestor section) |
| txtAreaLocNo | text | editable | Storage Location Code |
| txtLocAdd1 | text | editable | Storage Location Description |
| txtMatExtend | text | editable | Extended to Material Code |
| cboUllage | keyword | editable | Tank included for Ullage StockTake adjustment |
| txtRmk | text | editable | Remarks (Requestor) |
| txtProteanSite | text | editable | Plant Code (IT section) |
| txtProteanLoc | text | editable | Storage Location Code (IT section) |
| txtSLocDesc | text | editable | Storage Location Description (IT section) |
| txtActivate | keyword | editable | Activate |
| txtRemarks | text | editable | Remarks (IT section) |
| txtRejRem | text | editable | Rejection Remarks |
| txtCpISGApp | text | computed | IT Approver |
| dtISGCreatedDate | datetime | editable | IT Created Date |
| ExtendedStatus | keyword | editable | Extended Status |
| txtRejRem_1 | text | editable | Rejection Remarks (2) |
| txtCpISGApp_1 | names | computed | IT Approver (2) |
| dtISGCreatedDate_1 | datetime | computed | IT Created Date (2) |
| authorReqBy_1 | authors | computedwhencomposed | Author |
| dtCreatedTimestamp | datetime | computed | Created Timestamp |
| txtRunNo | text | computed | Running No |
| txtHDocStatus | text | editable | Document Status |
| txtHCpReqSec | names | computed | Requestor Section |

#### Form: `User Guide` (alias: `frmUserGuide`, renderpassthrough — static content)

### Views

| View Name | Key Purpose |
|---|---|
| Storage Location Creation Summary | Active requests |
| Completed Area/Location Creation Form | Completed records |
| Draft | Draft (txtHDocStatus = "I") |
| Pending Action by ISG Department | Pending IT action |
| Rejected By ISG | Rejected by IT |
| lookupACM / AES / AUS / AEC / DCM / POM / POC / PSN / PRF / PCP | Plant-code lookup views |
| PendingApproval | Pending HOD |
| Draft2 / PendingISG2 / Rejected By ISG 2 / Completed | Internal form equivalents |
| All | All forms combined |
| Summary | All records by status |

### Agents

Refresh Docs · Replace · status2 · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Danny Lee/OU=PMS/O=PHB | Editor | Person |
| CN=Kelly/OU=PMS/O=PHB | Editor | Person |
| IT Software Team | Reader | Person Group |
| PanCen Group | Editor | Person Group |
| CN=PCNSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

---

# SITE: PENANG (IOI Penang / Oleo Local)

---

## Module 4 — External Access Form (VPN & Citrix)

**Code:** `EAF`  
**Database Name:** External Access Form (VPN & Citrix)  
**NSF Path:** `Current\vpnaccess.nsf`  
**Extraction Date:** 19/05/2026 10:28 AM

### Forms

#### Form: `vpnaccess` — VPN / Citrix Access Request

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Company | keyword | editable | Company |
| req / requestor | names | computedwhencomposed | Requestor |
| date1 | datetime | computed | Date Requested |
| User | text | editable | User (who will receive access) |
| App | text | editable | Application |
| system | text | editable | System |
| justification | text | editable | Justification |
| depthead | names | editable | Dept Head |
| CC | names | editable | CC |
| Status | keyword | editable | Status · options: ACTIVE, INACTIVE |
| CurrentAction | keyword | editable | Current Action |
| status1 | keyword | computed | HOD Status |
| HODNAME | names | computed | HOD Name |
| date2 | datetime | computed | HOD Approval Date |
| comment1 | text | computed | HOD Comment |
| status2 | keyword | computed | COO/DD Status |
| DIVNAME | names | computed | Division Head Name |
| date3 | datetime | computed | Division Approval Date |
| comment2 | text | computedfordisplay | Division Comment |
| status3 | keyword | computed | IT Manager Status |
| name4 | names | computed | IT Manager Name |
| date4 | datetime | computed | IT Manager Date |
| comment3 | text | computed | IT Manager Comment |
| status4 | keyword | computed | IT Staff Status |
| name5 | names | computed | IT Staff Name |
| date5 | datetime | computed | IT Completion Date |
| comment4 | text | computed | IT Comment |
| att | richtext | editable | Attachment |
| remarks | text | editable | Remarks |
| isPCN | text | computed | Is PanCen flag |
| AEditor1 | names | computed | Additional Editor |
| RemSubject | names | computed | Reminder Subject |
| RemTo | names | computed | Reminder To |

#### Forms: `EnterComments1`, `EnterComments2`, `EnterComments3` (nocompose, noquery)

Fields: comment1 / comment2 / comment3 (text, editable)

#### Form: `SubAgents_VPNAccess` — Subsidiaries / Agents VPN Access

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Category | keyword | editable | Category |
| AccessBy | names | editable | Accessed By |
| VPNId | text | editable | VPN ID |
| EmailAdd | text | editable | Email Address |
| AccessApps | keyword | editable | Access Type |
| Country | text | computed | Country |
| RequestedBy | names | editable | Requested By |
| DateRequested | datetime | editable | Date Requested |
| VPNRemarks | text | editable | Remarks |

#### Form: `CountryDetails` — Country Phone Details

Field: CountryName (text, editable)

#### Form: `VPNAgent` — VPN Agent Records

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Type | text | editable | Type |
| AgentName | text | editable | Agent Name |
| ClientID | text | editable | Client ID |
| Group | text | editable | Group |
| AgentStatus | keyword | editable | Status |

#### Form: `Reminder` (renderpassthrough)

Fields: DateSent, User, rTxtDocLink, CopyTo, SendTo, Subject

#### Subform: `Signature`

Fields: DateModified, CDate, DocAuthor

### Views

| View Name | Selection Formula | Key Columns |
|---|---|---|
| Summary | `Status="ACTIVE" & CurrentAction!="discard"` | Year, Company, Requestor, User, Requested Date |
| ByRequestor | `Form="vpnaccess"` | Requested date, Requestor |
| pendingHODapp | `status1="" & date2="" & Form="vpnaccess"` | Requestor, Date, System, HOD |
| pendingCOOapp | `CurrentAction="Acceptance1" & status1="Accepted" & date3=""` | Requestor, Date |
| pendingISMGR | `date3!="" & date4="" & status3!="Accepted"` | Requestor, Date |
| pendingISG | `date4!="" & date5="" & status4!="Completed" & CurrentAction!="Closed"` | Requestor, Date |
| PendingApp | All pending stages | Stage, Requestor, Date, System |
| Completed | `date4!=""` | Year, Requested Date, Requestor |
| Rejected | Rejected actions | Stage, Requestor, Date |
| Inactive | `Status="INACTIVE"` | Year, User, Requested Date |
| Draft | `CurrentAction="Request"` | Requestor, Created |
| Sum by Status | By status | Status, Company, User, Date |
| Subsd/Agents Summary | `Form="SubAgents_VPNAccess"` | Category, Country, Company, AccessedBy |
| SummaryVPNList | `Form="VPNAgent"` | Type, Group, Status, Name, ClientID |
| CountryPhone | `Form="CountryDetails"` | CountryName |
| RemPdgApp | Pending >3 days | RemTo, CC, Subject |
| Reminders | `Form="Reminder"` | Year, Subject, Date, User |
| KPI | `CurrentAction="Closed"` | FY, Quarter, IT Staff, App, Month, Total, Date Sent, Date Completed |
| TESTING | Testing | Form, Modified, etc. |

### Agents

Clear · Refresh Docs · FORMULA · RemAllPdg · Set · DBNSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| Oleo Local & PanCen | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 5 — Hardware Inventory (Penang)

**Code:** `HI`  
**Database Name:** Hardware Inventory  
**NSF Path:** `ISG\HWInv2013.nsf`  
**Extraction Date:** 22/05/2026 4:28 PM

> **Note:** Same form and field structure as Module 1 (PanCen Hardware Inventory). Contains identical forms: `newhware`, `DepartmentPrinter`, `MPSNetworkPrinter`, `NewInv`, `Network`, `Checklist`, `Reminder`. Refer to Module 1 for full field definitions.

### Differences from Module 1

**ACL — Penang-specific entries:**

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Sineta/OU=PMS/O=PHB | Editor | Person |
| CN=Tinakaran/OU=PMS/O=PHB | Editor | Person |
| CN=Suhair/OU=PMS/O=PHB | Editor | Person |
| CN=Ung Tay Aik/OU=PMS/O=PHB | Editor | Person |
| CN=Saw Eng Cheng/OU=PMS/O=PHB | Editor | Person |
| CN=Kelly/OU=PMS/O=PHB | Editor | Person |
| Oleo Local | Editor | Person Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 6 — IT Activity Log – NEW

**Code:** `IAL`  
**Database Name:** IT Activity Log – NEW  
**NSF Path:** `ISG\ISGLogActFYNew.nsf`  
**Extraction Date:** 22/05/2026 3:46 PM

### Forms

#### Form: `DataRestorationV1` — Data Restoration Request

| Field Name | Type | Kind | Label |
|---|---|---|---|
| INO | text | computed | Running Number |
| rbSite | keyword | editable | Site (radiobutton) |
| nmRequestedBy | text | editable | Requested By |
| lstDept | keyword | editable | Department (dialoglist, allownew) |
| txtFilePath | text | editable | File Path |
| txtReason | text | editable | Reason |
| rtxtAttach | richtext | editable | Attachment |
| nmSubmitted | names | computedwhencomposed | Submitted By |
| dtSubmitted | datetime | computedwhencomposed | Date Submitted |
| txtFileName1 | text | editable | File Name |
| rbStatus | keyword | editable | Status (radiobutton) |
| nmPerformed | names | computed | Performed By |
| nmMgrMail | names | computed | Manager Mail |

#### Form: `DataCenterV1` — Data Center Access Log

| Field Name | Type | Kind | Label |
|---|---|---|---|
| rbSite | keyword | editable | Site |
| lstServerRoom | keyword | editable | Server Room (dialoglist) |
| dtCreatedAccess | datetime | editable | Date/Time of Access |
| nmVisitor | text | editable | Visitor Name |
| lstCompany | keyword | editable | Company |
| txtReasonAccess | text | editable | Reason for Access |

#### Form: `ServerRebootV1` — Server Reboot Log

| Field Name | Type | Kind | Label |
|---|---|---|---|
| rbSite | keyword | editable | Site |
| rbRebootType | keyword | editable | Reboot Type · options: Planned, Unplanned |
| dtDown | datetime | editable | Date Down |
| dtTimeDown | datetime | editable | Time Down |
| dtUp | datetime | editable | Date Up |
| dtTimeUp | datetime | editable | Time Up |
| txtReason | text | editable | Reason |
| RebootRemarks | richtext | editable | Remarks |
| nmReqReboot | names | computed | Requested By |

#### Form: `ServerRecordsV1` — Server Records

| Field Name | Type | Kind | Label |
|---|---|---|---|
| rbSite | keyword | editable | Site |
| lstRecType | keyword | editable | Record Type (dialoglist) |
| DateChanged | datetime | editable | Date Changed |
| TimeChanged | datetime | editable | Time Changed |
| ChangesMade | richtext | editable | Changes Made |
| Purpose | richtext | editable | Purpose |
| YESNO | keyword | editable | Yes / No |
| SvrAttach | richtext | editable | Attachment |
| nmReqRecords | names | computed | Requested By |

#### Form: `ISGEventsV1` — ISG Events

| Field Name | Type | Kind | Label |
|---|---|---|---|
| lstEventType | keyword | editable | Event Type |
| txtEventDesc | text | editable | Event Description |
| txtPurpose | text | editable | Purpose |
| txtServer | text | editable | Server |
| rtxtEventAtt | richtext | editable | Attachment |
| EvtDate | datetime | editable | Event Date |
| EvtTime | datetime | editable | Event Time |
| EvtDate_1 | datetime | editable | Event End Date |
| EvtTime_1 | datetime | editable | Event End Time |
| txtRemarks | text | editable | Remarks |
| nmReqEvent | names | computed | Requested By |
| dtTime | datetime | computed | Date/Time |

#### Forms: `ServerReboot`, `ServerRecords`, `DataRestoration` — Legacy versions

Same structure as V1 equivalents above.

#### Subforms

- **HiddenFields:** MailJ_Mgr, MailP_Mgr, ISGRecipients, dsSvrName, ISAdmin, CurrentAction, dtCreatedOn, nmRequestor
- **HiddenFields_DataRestoration:** dsSvrName, ISAdmin, dtCreatedOn, nmRequestor
- **ServerList:** lstServerName

### Views

| View Name | Selection Formula | Key Columns |
|---|---|---|
| vwData Center | `Form="DataCenterV1"` | Site, Server Room, Date, Visitor, Company |
| vwDataRestoration | `Form="DataRestorationV1"` | Site, Dept, File Path, Status |
| vwServerReboot | `Form="ServerRebootV1"` | Site, Type, Date Down, Date Up |
| vwServerRecords | `Form="ServerRecordsV1"` | Site, Record Type, Date, Changes |
| vwISG Events Summary | `Form="ISGEventsV1"` | Event Type, Date, Description |
| vwDataRestNum | Running number | INO |
| vwDataRestoration_Pdg | Pending restoration | INO, Status |
| vwServerReboot_ByDate | By date | Date, Site |
| All | All forms | Form, Date |

### Agents

time · downtime - Plan · downtime - Unplan · Refresh Docs · Server · INO · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| ACM IT | Editor | Person Group |
| PanCen IT | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 7 — IOI Policy

**Code:** `IOIP`  
**Database Name:** IOIOI POLICY  
**NSF Path:** `Current\DRPPROC.nsf`  
**Extraction Date:** 22/05/2026 3:49 PM

### Forms

#### Form: `PolicyEntryV1` — Policy Entry (current version)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| PolicyNo | text | editable | Policy No |
| Subject | text | editable | Subject |
| ReviNum | text | editable | Revision Number (with input validation) |
| R_1 – R_10 | text | editable | Revision table rows |
| D_1 – D_10 | text | editable | Distribution table rows |
| U_1 – U_10 | text | editable | Update table rows |
| com1 / com2 / com3 | text | editable | Comments (approval stages 1–3) |

#### Form: `PolicyEntry` — Policy Entry (original version)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| PolicyNo | text | editable | Policy No |
| Subject | text | editable | Subject |
| ReviNum | text | editable | Revision Number |
| comment1 / comment2 / comment3 | text | editable | Comments (stages 1–3) |
| ApprName1 / ApprName2 / ApprName3 | text | computedfordisplay | Approver Name 1–3 |
| ApprStatus1 / ApprStatus2 / ApprStatus3 | text | computedfordisplay | Approval Status 1–3 |
| dOn1 / dOn2 / dOn3 | text | computedfordisplay | Date of Approval 1–3 |
| ApprComment1 / ApprComment2 / ApprComment3 | text | computedfordisplay | Approval Comment 1–3 |

#### Forms: `EnterComments1/2/3`, `EnterCom1/2/3` (nocompose, noquery)

Comment entry dialogs for each approval stage.

#### Form: `DisplayComments` (alias: `DisplayComments`, nocompose — display only)

#### Subform: `Approvalv2`

Fields: A3replied, A2replied, A1replied, Status1/2/3, App1/2/3, App1_1/2_1/3_1, DateApproved1/2/3, Req1/2/3, Authority1/2/3, Approval_Section

#### Subform: `Signature`

Fields: CDate, DocAuthor, PolicyOwner, FormName, DateArchived, FinalStatus, Sendto, Authors, Editors

### Views

| View Name | Selection Formula | Key Columns |
|---|---|---|
| 1) Draft | `CurrentAction="Draft"` | PolicyNo, Subject |
| 2) Summary – Policy | `Form="PolicyEntry"\|"PolicyEntryV1"` | PolicyNo, Subject, Revision |
| 3) Pending Approval | Pending | PolicyNo, Approver |
| 5) Pending Distribution | Pending distribution | PolicyNo, Date |
| Archived | Archived policies | PolicyNo, Subject, Date |

### Agents

When document is being pasted · Change creator · A3Replied · Clear · Archieve old policy · Formula · Refresh Docs · Set · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Ravi Madhu/OU=PMS/O=PHB | Manager | Person |
| CN=Irin Decruz/OU=PMS/O=PHB | Editor | Person |
| CN=David Koo/OU=PMS/O=PHB | Editor | Person |
| CN=Tan Kean Hua/OU=PMS/O=PHB | Editor | Person |
| CN=Kelly/OU=PMS/O=PHB | Editor | Person |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| PanCen Group | Reader | Person Group |
| Oleo Local | Reader | Person Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 8 — IT Report 2026

**Code:** `ITDR`  
**Database Name:** IT Report – 2026  
**NSF Path:** `ISG\ITReport2026.nsf`  
**Extraction Date:** 22/05/2026 3:52 PM

### Forms

#### Form: `Report` — Monthly IT Report (default=true)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Subject | text | editable | Subject |
| Date | datetime | editable | Report Date |
| EndDate | datetime | editable | End Date |
| TimeTo | datetime | editable | Time To |
| DateStart | datetime | editable | Date Start |
| DateEnd | datetime | editable | Date End |

#### Form: `Plan` — Outstanding Tasks

| Field Name | Type | Kind | Label |
|---|---|---|---|
| year | text | computed | Year |
| month | keyword | editable | Month · options: January–December |
| title | text | computed | Title (auto: "Outstanding Tasks as at [month]") |
| No | text | editable | Row No |
| Task | richtext | editable | Task |
| Description | richtext | editable | Description |
| Timeline | datetime | editable | Time-line |
| Priority / Priority_1 – Priority_10 | text | editable | Priority (per row) |
| Attachment | richtext | editable | Attachment |

#### Subform: `Signature`

Fields: CDate, DocAuthor

### Views

Key views: byDate · All Reports · OT · AllPlan · AllPlanMgr · futureplan · byCategory · byType · byAuthorNType · TODAY · bySize

Individual staff views (by author): Lit Kai Loon, Ravi Madhu, Anna Ooi, Kelly, Fadzli, Harith, Suhair, Prakash, Tinakaran, Mohd Syed, Cindy Chew, Danny Lee, Ung Tay Aik, Saw Eng Cheng, Yong Siaw Hooi, Tan Yi Wei, Tan Wei Shen, Qayyim, Amir Afdzan, Izzatun Nadiah, Sineta, Mugunthen

### Agents

SET · DocAuthor · Clear · Authors · Refresh Docs · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Wong Yin Ling/OU=PMS/O=PHB | Reader | Person |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=Test1/OU=PMS/O=PHB | Editor | Person |
| PanCen IT | Editor | Person Group |
| ACM IT | Editor | Person Group |
| OtherDomainServers | Reader | Server Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 9 — IT Info

**Code:** `ITI`  
**Database Name:** IT Info  
**NSF Path:** `Current\ISGInfo.nsf`  
**Extraction Date:** 22/05/2026 3:56 PM

### Forms

#### Form: `ISGInfo` (default=true)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| InfoType | keyword | editable | Info Type |
| Att | richtext | editable | Attachment |
| ISGRemarks | richtext | editable | ISG Remarks |

### Views

Summary · Draft · Summary by Date · All

### Agents

Date · FORMULA · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| PanCen Group | Reader | Person Group |
| Oleo Local | Reader | Person Group |
| ACM IT | Editor | Person Group |
| PanCen IT | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 10 — IT Server Checklist 2026

**Code:** `ITSC`  
**Database Name:** IT Server Checklist 2026  
**NSF Path:** `ISG\svrchklist26.nsf`  
**Extraction Date:** 22/05/2026 4:01 PM

### Forms

#### Form: `AllServerMonitor` — Primary Server Checklist

| Field Name | Type | Kind | Label |
|---|---|---|---|
| svrname | keyword | editable | Server Name |
| svrname2 | text | editable | Server Name 2 |
| nav | datetime | editable | Date |
| Memory | text | editable | Memory |
| FullMemory | text | computed | Full Memory |
| FullSpace | text | computed | Full Space |
| Size | text | editable | Size |
| Type | keyword | editable | Type (dialoglist: physical/virtual) |
| Type1 / Type2 / Type3 | keyword | editable | Disk Types |
| diskcleanup | keyword | editable | Disk Cleanup |
| WinUpd | datetime | editable | Windows Update |
| MDC | text | editable | MDC |
| Tenant | text | editable | Tenant |
| Volume1 / Volume2 / Volume3 | text | editable | Volume names |
| TimeStart | datetime | editable | Time Start |
| TimeEnd | datetime | editable | Time End |
| remarks | text | editable | Remarks |
| Attachment | richtext | editable | Attachment |
| Size_1 | text | editable | Additional Size |
| Type_1 / Type_1 / Type_1 | keyword | editable | Additional Disk Types |
| Physical | text | editable | Physical |
| CreatedBy | authors | computedwhencomposed | Created By |
| Status_1 – Status_13 | keyword | editable | Status items (rows 1–13) |
| Remark_1 – Remark_13 | text | editable | Remark items (rows 1–13) |
| Antivirus | richtext | editable | Antivirus |

#### Form: `NewForm` (default=true — simplified version)

#### Subform: `WeekNum`

Fields: CO, OU, WkDay, Week, YearStartDate, WeekEndDate, CurrYear

### Views

| View Name | Alias | Description |
|---|---|---|
| Summary-PNG | PNG | Penang servers by week/status |
| Summary-JHR | JHR | Johor servers by week/status |
| AUTHOR | — | By author |
| ALL | — | All records |
| TODAY | — | Today's records |
| KPI | — | KPI metrics |

### Agents

Form · Refresh Docs · SET · replaced · svrname · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| ACM IT | Editor | Person Group |
| PanCen IT | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 11 — IT Support & Service Request (SSR) 2026

**Code:** `ITSSR`  
**Database Name:** IT Support & Service Request (SSR) 2026  
**NSF Path:** `Current\ITSSR26.nsf`  
**Extraction Date:** 22/05/2026 4:05 PM

### Forms

#### Form: `SS3` (default=true) — Support Request (current version)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| CaseNo | number | computed | Case No |
| Company | text | computed | Company |
| DateCreated | datetime | computed | Date Created |
| ReportedBy | names | editable | Reported By |
| Requestor | authors | computed | Requestor |
| Dept | keyword | editable | Department |
| ExtNo | number | editable | Extension No. |
| Type | keyword | editable | Type · options: H/W, S/W, Network, SAP, etc. |
| Type2 | keyword | editable | Type 2 |
| HWare2 | keyword | editable | Hardware 2 |
| HWare | keyword | editable | Hardware |
| App | keyword | editable | Application |
| Module | text | editable | Module |
| SAPModule | keyword | editable | SAP Module |
| BankModule | keyword | editable | Bank Module |
| ProblemDesc | text | editable | Problem Description |
| Attach | richtext | editable | Attachment |
| ITName | names | computed | IT Name |
| Solution | text | editable | Solution |
| Attachment2 | richtext | editable | IT Attachment |
| StartDate | datetime | editable | Start Date |
| ITRemarks | text | editable | IT Remarks |
| DateNotified | datetime | computed | Date Notified |
| Classification | keyword | editable | Classification |
| Support | keyword | editable | Support type |
| DateClosed | datetime | computed | Date Closed |
| KeyField | text | editable | Key Field |
| Remarks | richtext | editable | Remarks |
| ITAtt | richtext | editable | IT Attachment (2) |
| DateAccept | datetime | computed | Date Accepted |
| Comment | text | editable | Comment |
| CA | keyword | editable | Corrective Action |
| OU | text | computed | OU |
| Category | text | computed | Category |
| dsSAPSubject | text | computed | SAP Subject |
| RemSubject | text | computed | Reminder Subject |
| RespondDate | datetime | computed | Respond Date |
| Days | text | computed | Days (SLA) |
| Days2 | text | computed | Days (overdue — red) |
| Year | datetime | computedwhencomposed | Year |
| Month | datetime | computedwhencomposed | Month |
| Team | text | computed | Team |
| COO_APP | keyword | editable | COO Approval |
| PcnHW | names | computed | PanCen HW |
| VerDate | datetime | computed | Verification Date |
| Comment_HW | text | editable | Comment HW |
| Status1b | text | computed | Status 1b |
| PcnM | names | computed | PanCen Manager |
| VerDateM | datetime | computed | Verification Date M |
| CommentM | text | editable | Comment M |
| PcnCOO | names | computed | PanCen COO |
| VerDateCOO | datetime | computed | Verification Date COO |
| CommentCOO | text | editable | Comment COO |

#### Form: `SS` — Support Request (older version)

Same key fields; no ReportedBy / ProblemDesc.

#### Form: `Reminder` (nocompose)

Fields: Subject, NotNum, rTxtDocLink, DateSent, CopyTo, SendTo

#### Subform: `CreatedBy`

Fields: CreationDate, DocAuthor

### Views

| View Name | Key Purpose |
|---|---|
| Draft | `CurrentAction="Draft"` |
| lookup | Running number (CaseNo) |
| Summary | Active SSRs |
| Summary-JHR / Summary-PNG | Site-specific summaries |
| JobInProgress | In progress |
| PdgAccept | Pending IT acceptance |
| Completed | Completed |
| Rejected / RejectedbyIT | Rejected |
| byApplication / byProblemCat | Categorised views |
| byMonthly / byYearly | Statistics |
| KPI | KPI metrics |
| PdgITWithRem / PdgITWithoutRem | Pending IT by reminder status |
| PdgITVer / PdgITManager / PdgCOO | Pending verification/manager/COO |
| ITPersonnel | By IT staff member |
| Underrated / RemPdgUnderrated | Low-rated tickets |
| Reminders | Reminder records |
| ALL | All records |
| Archived | Archived |
| TESTING | Testing |

### Agents

INO · SET · Refresh Docs · Clear Rejection · RemPdgAcceptance · Clear · RemPdgUnderrated · UNLOCK · RemPdgITWithoutRem · RemPdgITWithRem · FORMULA · Change Requestor · Refresh Docs · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| PanCen Group | Editor | Person Group |
| Oleo Local | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 12 — Notes ID Request

**Code:** `NIR`  
**Database Name:** Notes ID Request  
**NSF Path:** `Current\LNIDRequest.nsf`  
**Extraction Date:** 22/05/2026 4:26 PM

### Forms

#### Form: `IDR2` (default=true) — Notes ID Request (current version)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| EmailType | keyword | editable | Email Type |
| Company | keyword | editable | Company |
| Emailid | names | editable | Email ID |
| FullName | text | editable | Full Name |
| EmpNo | text | editable | Employee No |
| Department | keyword | editable | Department |
| Extension | text | editable | Extension |
| Type | keyword | editable | Type (New / Modify / Delete) |
| HOD | names | editable | Head of Department |
| Designation | text | editable | Designation |
| Remark | text | editable | Remark |
| Requestor | names | computed | Requestor |
| DateSent | datetime | computed | Date Sent |
| HODName | text | computed | HOD Name |
| HodDate | datetime | computed | HOD Date |
| HodComment | text | editable | HOD Comment |
| PICName | text | computed | PIC Name |
| PICDate | datetime | computed | PIC Date |
| PICRemark | richtext | editable | PIC Remark |
| AccName | datetime | computed | Acceptance Name |
| AccDate | datetime | computed | Acceptance Date |
| AccComment | text | editable | Acceptance Comment |
| CA | keyword | editable | CA |

#### Form: `IDR` (alias: `lnir`) — Notes ID Request (v1)

Same fields as IDR2 minus: Extension, HOD, HODName/HodDate/HodComment. Uses isgHODName / isgHodDate / isgHodComment (ISG HOD) instead.

#### Form: `ID Request` (alias: `idr`) — Original version

Fields: Emailid, NewEmailid, Company, Internal, External, Department, Designation, Remark, PCName, Requestor, DateSent, isgHODName, isgHodDate, isgHodComment, PICName, PICDate, PICComment, AccName, AccDate, AccComment, ISGHOD, PIC

#### Form: `Reminder` (nocompose)

Fields: Subject, DateSent, rTxtDocLink, CopyTo, SendTo

#### Subform: `Signature`

Fields: CDate, DocAuthor

### Views

| View Name | Key Purpose |
|---|---|
| Draft | Draft requests |
| Summary | Active requests by company |
| PendingByHOD / PendingByHWG / PendingByPIC | Pending by stage |
| Completed | Completed requests |
| Rejected | Rejected |
| ALL | All records |
| By PIC_IT users | By PIC |
| CompletedByCompany | By company |
| RemPdgByHWG / RemPdgHOD | Pending reminders |
| Reminders | Reminder records |
| KPI | KPI metrics |
| Namelist | Name lookup |
| TESTING | Testing |

### Agents

Refresh Docs · Clear Completion · RemPdgHWG · RemPdgHOD · SET · _OLDDBNSF · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Mohamad Naufal/OU=PMS/O=PHB | Editor | Person |
| CN=Kumutha/OU=PanCen/O=PHB | Editor | Person |
| Oleo Executives | Editor | Person Group |
| Pancen Executives & Above | Editor | Person Group |
| ACM IT | Editor | Person Group |
| PanCen IT | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 13 — IT Procedures / Training Manuals

**Code:** `ITP`  
**Database Name:** IT Procedures / Training Manuals  
**NSF Path:** `ISG\isgdoc.nsf`  
**Extraction Date:** 22/05/2026 3:57 PM

### Forms

#### Form: `isgdoc` (default=true) — IT Procedures

| Field Name | Type | Kind | Label |
|---|---|---|---|
| doctitle | text | editable | Document Title |
| verno | text | editable | Version No |
| revision | text | editable | Revision |
| datelast | datetime | computed | Date Last Modified |
| att | richtext | editable | Attachment |
| DateModified | datetime | computed | Date Modified |
| MachineModificationDate | datetime | computed | Machine Modification Date |

#### Form: `TrgManual` — Training Manuals

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Trgtype | keyword | editable | Training Type |
| TrgTitle | text | editable | Training Title |
| Trgverno | text | editable | Version No |
| Trgrevision | text | editable | Revision |
| Trgdatelast | datetime | computed | Date Last Modified |
| MachineAuthor | text | computed | Author |
| MachineModificationDate | datetime | computed | Modification Date |
| Status | text | computed | Status |

### Views

summary · by ISG Personnel · by Module · by Update date · Current · TrgSummary · Archive · All

### Agents

Refresh Docs · Archive · Owner · UNLOCK · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| ACM IT | Editor | Person Group |
| PanCen IT | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 14 — Program Request Form (PRF) 2026

**Code:** `PRF`  
**Database Name:** Program Request Form (PRF) 2026  
**NSF Path:** `Current\PRF26.nsf`  
**Extraction Date:** 22/05/2026 4:23 PM

### Forms

#### Form: `PRF` (default=true) — Program Request

| Field Name | Type | Kind | Label |
|---|---|---|---|
| system | text | computed | System |
| link | richtext | editable | Link |
| NotesOwner | authors | computedwhencomposed | Notes Owner |
| deptmanager | names | editable | Dept Manager / Section Head |
| dept | keyword | editable | Department (dialoglist) |
| module | text | editable | Module |
| objective | richtext | editable | Objective |
| Remarks | richtext | editable | Remarks |
| Implementation | keyword | editable | Implementation (radiobutton) |
| BI_DS | keyword | editable | BI/DS (radiobutton) |
| grpname | text | editable | Group Name (with validation) |
| validity | keyword | editable | Validity (radiobutton) |
| reason | richtext | editable | Reason |
| benefits | text | editable | Benefits |
| att | richtext | editable | Attachment |
| noofusers | text | editable | No. of Users |
| datesent | datetime | computed | Date Sent |
| requiredby | datetime | editable | Required By |
| reqdate | datetime | computedwhencomposed | Request Date |
| Year | datetime | computedwhencomposed | Year |
| Month | datetime | computedwhencomposed | Month |
| INO | text | computed | Running No |
| upddt | datetime | computed | Updated Date |
| dateapp1 | datetime | computed | Approval Date 1 |
| comments1 | text | editable | Comments 1 |
| status2 | keyword | editable | Status 2 |
| RFC | keyword | editable | RFC |
| Attachment_SAP | richtext | editable | SAP Attachment |
| ITReason | text | editable | IT Reason |
| AppBy_SAP | names | computed | Approved By (SAP) |
| dateapp2_1 | datetime | computed | Approval Date 2 |
| comments2_1 | text | editable | Comments 2 |
| startdate | datetime | editable | Start Date |
| status3 | keyword | editable | Status 3 |
| TestingDate | datetime | computed | Testing Date |
| IEDDate | datetime | editable | IED Date |
| NotesforIT | richtext | editable | Notes for IT |
| testedby | names | computed | Tested By |
| testedon | datetime | computed | Tested On |
| statusISG | keyword | editable | ISG Status |
| DateISG | datetime | computed | ISG Date |
| NotifiedBy | names | computed | Notified By |
| comment1 | text | editable | Comment |
| ReqAtt | richtext | editable | Requestor Attachment |
| CurrentAction | text | editable | Current Action |
| finalstatus | keyword | editable | Final Status |
| FuncOwnerName | names | computed | Functional Owner Name |
| OU | text | computed | OU |
| isSAP | text | computed | Is SAP |
| RFCDone | text | computed | RFC Done |
| Clare | names | computed | Clare |

#### Subforms

- **Ratings:** RatingCom, Rating, satisfaction_rating_field
- **IT_Comments:** datenotify, ITRemark, TESTING_VALIDATION

#### Form: `Reminder` (alias: `rem`)

Fields: system, link, Date, CopyTo, SendTo, Subject

#### Forms: `NotesSampleDesign` (alias: `NSD`), `FlowChart`, `ProcessFlow` (renderpassthrough — static)

### Views (49 total — key views listed)

| View Name | Key Purpose |
|---|---|
| Draft | `CurrentAction="Draft"` |
| lookup | Running number (INO) |
| Summary | All PRFs by status |
| PdgAcceptance / PdgAcceptance_SAP | Pending acceptance |
| pending_Assign_NonSAP / pending_Assign_SAP | Pending assignment |
| pending_Testing | Pending testing |
| pending_ABAP_IEQ / PdgAssign_ABAP | Pending ABAP |
| PdgFS_Completion / pendingFunctOwner | Pending functional |
| pendingisg / pendingisg_SAP | Pending ISG |
| Outstanding | Outstanding |
| KIV | Keep In View |
| Completed / CompletedbyIT / ByISG_Completed | Completed views |
| Rejected / Cancelled | Rejected/Cancelled |
| Underrated / PdgUnderrated | Ratings |
| byMonthly / byYearly / KPI / KPI2 | Statistics / KPI |
| Reminders / RemPdgApproval / RemPdgTesting / RemPdgAcceptance / RemPdgJustification | Reminder views |
| isgmanager / withoutapp | Manager views |
| All | All records |

### Agents

INO · SET · HR · Clear · Refresh Docs · Change Requestor · Clear Task Assignment · Clear Functional · Clear Acceptance · Clear IT Functional-Completion for SAP · Clear ABAP Assign · SET-FORMULA · ReminderPdgTesting · ReminderPdgApproval · ReminderPdgAcceptance · ReminderUnderrated · ReminderPdgJustify · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Ravi Madhu/OU=PMS/O=PHB | Manager | Person |
| CN=Kelly/OU=PMS/O=PHB | Editor | Person |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=Admin/O=PHB | Manager | Person |
| IT Software Team | Editor | Person Group |
| Oleo Local & PanCen | Editor | Person Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 15 — Reset Password / Unlock ID

**Code:** `RS`  
**Database Name:** Reset Password / Unlock ID  
**NSF Path:** `Current\ResetPwd09.nsf`  
**Extraction Date:** 22/05/2026 4:18 PM

### Forms

#### Form: `ResetPassword2` (default=true) — Reset / Unlock (current version)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| empname | text | editable | Employee Name |
| designation | text | editable | Designation |
| coname | keyword | editable | Company Name |
| dept | keyword | editable | Department |
| phnum | text | editable | Phone Number |
| type | keyword | editable | Type |
| Client | keyword | editable | Client |
| Client_1 | keyword | editable | Client 1 |
| ClientName | text | editable | Client Name |
| Unlock | keyword | editable | Unlock |
| datecreated | datetime | computed | Date Created |
| finalstatus | keyword | computed | Final Status |
| datecre | datetime | computed | Date |
| rem | text | editable | Remark |
| eddate | datetime | computed | Edit Date |
| edname | names | computed | Editor Name |
| edrem | text | editable | Editor Remark |
| CurrentAction | text | editable | Current Action |
| status | keyword | editable | Status |
| docauthor | authors | computedwhencomposed | Doc Author |
| requestor | names | computedwhencomposed | Requestor |
| isEDApp | text | computed | Is ED Approved |
| ED | names | computed | ED |
| Numbers | text | computed | Running Numbers |
| IncludeAll | text | computed | Include All |
| CO | text | computed | CO |

#### Form: `ResetPassword` — Reset / Unlock (v1)

Same structure minus: Client_1, eddate/edname/edrem, isEDApp, ED.

#### Forms: `ResetPasswordV1`, `changepwd` (renderpassthrough — legacy)

#### Form: `EnterComments` (alias: `EnterComments`, nocompose, noquery)

Field: comment (text, editable)

#### Form: `Reminder` (nocompose)

Fields: Subject, DateSent, rTxtDocLink, CopyTo, SendTo, ID, Application

### Views

| View Name | Key Purpose |
|---|---|
| Draft | Draft requests |
| SummaryPNG | Active Penang requests |
| SummaryJHR | Active Johor requests |
| Requestor | By requestor |
| OutStanding | Outstanding |
| Completed | Completed |
| Rejected | Rejected |
| By Application | By application |
| Archives | Archived |
| lookup | Running number |
| Reminders | Reminder records |
| all | All records |

### Agents

RunningNumber · SET · Refresh Docs · Formula · RemPdgIT · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| Oleo Local & PanCen | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | Manager | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 16 — SAP Authorisation Matrix Review

**Code:** `SAPAMR`  
**Database Name:** SAP Authorisation Matrix Review  
**NSF Path:** `SAP IOI\AuthMatrixReview.nsf`  
**Extraction Date:** 22/05/2026 3:25 PM

### Forms

#### Form: `SAPAutMatNew` — Auth Matrix Review (current version)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| RevFormNum | text | computed | Review Form Number |
| AuthAttachment | richtext | editable | Auth Attachment |
| Remarks | richtext | editable | Remarks |
| TBV | names | editable | To Be Verified (primary) |
| TBV_1 – TBV_5 | names | editable | Additional Verifiers 1–5 |
| TBA | names | editable | To Be Approved |
| PreparedBy | names | computed | Prepared By |
| PreparedDate | datetime | computed | Prepared Date |
| txtComment1 | text | computed | Verification Comment |
| VerifiedBy | names | computed | Verified By |
| VerifiedDate | datetime | computed | Verified Date |
| txtComment2 | text | computed | Verified Comment |
| Approval1 – Approval5 | names | computed | Approvers 1–5 |
| Date1 – Date5 | datetime | computed | Approval Dates 1–5 |
| Comment1 – Comment5 | text | computed | Approval Comments 1–5 |
| ApprovedBy | names | computed | Final Approved By |
| ApprovedDate | datetime | computed | Final Approval Date |
| txtComment3 | text | computed | Final Approval Comment |
| TotalReq | number | computed | Total Required |
| TotalVer | number | computed | Total Verified |
| AllApproved | text | computed | All Approved flag |
| WTDOn | datetime | computed | Withdrawn On |
| txtComment4 | text | computed | Withdrawal Reason |
| CreateDate | datetime | computedwhencomposed | Create Date |
| CurrentAction | text | editable | Current Action |
| Year | datetime | computedwhencomposed | Year |
| dsWthButton | text | computed | Withdraw Button |
| ISAdmin | names | computed | IS Admin |
| IsFI | number | computed | Is FI module flag |

#### Form: `SAPAutMatReview` — Auth Matrix Review (original)

Simplified version: single TBV (no TBV_1–5), single approval level. Fields: RevFormNum, AuthAttachment, Remarks, TBV, PreparedBy, VerifiedBy, ApprovedBy, dates, comments, WTDOn, requestor, CreateDate, CurrentAction, Year, ISAdmin, IT

#### Forms: `EnterComments1–4`, `EnterCommentsTBV_1–5` (nocompose, noquery)

Comment entry dialogs per approval stage and verifier slot.

#### Form: `Reminder` (nocompose)

Fields: Subject, NotNum, DateSent, rTxtDocLink, CopyTo, SendTo

### Views

| View Name | Key Purpose |
|---|---|
| Draft | `CurrentAction="Draft"` |
| lookup | Running number (RevFormNum) |
| Summary | All review forms |
| PdgVerification | Pending verification |
| PdgApproval | Pending approval |
| Withdrawn | Withdrawn |
| By Functional Support | By functional support |
| Sign Off – Completed | Completed |
| Rejected | Rejected |
| RemPdgApproval / RemPdgVerification | Pending reminders |
| Reminders | Reminder records |

### Agents

Clear · SET · PendingVerification · PendingApproval · Refresh Docs · FORMULA · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| IT Software Team | Editor | Person Group |
| Oleo Local & PanCen | Editor | Person Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 17 — SAP Config Access

**Code:** `SAPCA`  
**Database Name:** SAP Config Access  
**NSF Path:** `ISG\SAPConfigAccess.nsf`  
**Extraction Date:** 22/05/2026 3:34 PM

### Forms

#### Form: `ConfigForm` (default=true) — SAP Config Access Request

| Field Name | Type | Kind | Label |
|---|---|---|---|
| txtOthers | text | editable | Others (specify) |
| Client | keyword | editable | Client |
| ClientNum | text | editable | Client Number |
| RefDoc | richtext | editable | Reference Document |
| Purpose | text | editable | Purpose |
| ChangesDone | richtext | editable | Changes Done |
| Attachment | richtext | editable | Attachment |
| RequestedBy | names | computed | Requested By |
| DateSubmitted | datetime | computed | Date Submitted |
| ApprovedBy | names | computed | Approved By |
| ApprovedDate | datetime | computed | Approved Date |
| ApprovedCom | text | editable | Approved Comment |
| ConfigStatus | keyword | editable | Config Status |
| Attachment_B | richtext | editable | Attachment B |
| Comment3 | richtext | editable | Comment 3 |
| nmPerformedBy | names | computed | Performed By |
| dtPerformed | datetime | computed | Date Performed |
| RequestClosure | text | computed | Request Closure |
| nmRequestorClose | names | computed | Requestor Close |
| dtReqClose | datetime | computed | Request Close Date |
| nmClosedBy | names | computed | Closed By |
| WDStatus | keyword | computed | WD Status |
| WDBy | names | computed | WD By |
| WDDate | datetime | computed | WD Date |
| Comment1 | text | computed | Comment 1 |
| Year | text | computed | Year |
| Month | text | computed | Month |
| INO | text | computed | Running No |
| ISAdmin | names | computed | IS Admin |
| CurrentAction | text | editable | Current Action |

#### Forms: `EnterCommentsCom1`, `EnterCommentsCom2` (nocompose, noquery)

Fields: Comment1 / Comment2 (text, editable)

#### Form: `Guidelines` (renderpassthrough — static content)

#### Form: `Reminder` (renderpassthrough)

Fields: RequestedBy, Body, rTxtDocLink, Content, ReqNum, DateOFReminder, CopyTo, SendTo, Subject

#### Subform: `Signature`

Fields: CDate, DocAuthor

### Views

| View Name | Key Purpose |
|---|---|
| Draft | `CurrentAction="Draft"` |
| lookup | Running number (INO) |
| Summary | All config requests |
| PdgAccess | Pending access grant |
| PdgCompletion | Pending completion |
| PdgClosure | Pending closure |
| PdgReqClosure | Pending requestor closure |
| Withdrawn | Withdrawn |
| Completed | Completed |
| Rejected | Rejected |
| Reminders | Reminder records |
| All | All records |
| TESTING | Testing |

### Agents

INO · Clear · Refresh Docs · RemPdgCompClosure · RemPdgReqClosure · FORMULA · SET · DB_NSF *(all ENABLED)*  
RemPdgReq_with time adjustment *(DISABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| IT Software Team | Editor | Person Group |
| CN=Ung Tay Aik/OU=PMS/O=PHB | Editor | Person |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 18 — SAP & WB Change Request Form

**Code:** `SAPCR`  
**Database Name:** SAP & WB Change Request Form  
**NSF Path:** `SAP IOI\SAPChgRequestForm.nsf`  
**Extraction Date:** 22/05/2026 3:36 PM

### Forms

#### Form: `ChangeFormV3` (default=true) — SAP Change Request (current)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Year | datetime | computedwhencomposed | Year |
| INO | text | computed | Running No |
| ProjectPhase | keyword | editable | Project Phase |
| txtOthers | text | editable | Others (specify) |
| dlPriority | keyword | editable | Priority · dialoglist: Low, Medium, High |
| btnPurpose | keyword | editable | Purpose |
| btnPurpose2 | keyword | editable | Purpose 2 |
| txtOthers_Purpose | text | editable | Purpose (others) |
| txtProposedChange | text | editable | Proposed Change |
| Att_C | richtext | editable | Attachment C |
| nmReportedBy | names | computed | Reported By |
| dtReportedBy | datetime | computed | Date Reported |
| nmAppBy | names | editable | Approved By (BPO) |
| dtAppBPO | datetime | computed | BPO Approval Date |
| commentE | text | computed | Comment E |
| nmAssgTo | names | editable | Assigned To |
| dtDueDate_F | datetime | editable | Due Date |
| nmPMApp | names | computed | PM Approval |
| dtAppInvDate | datetime | computed | Investigation Date |
| commentF | text | computed | Comment F |
| SAPChange | keyword | editable | SAP Change type |
| PrgID | text | editable | Program ID |
| PrgType | text | editable | Program Type |
| ObjectName | text | editable | Object Name |
| Code1 / Code2 / Code3 | richtext | editable | Code sections |
| Config1 / Config2 / Config3 | richtext | editable | Config sections |
| Desc | richtext | editable | Description |
| InsNum | text | editable | Installation Number |
| BasisRelNum | text | editable | Basis Release Number |
| RegAccessKey | text | editable | Registration Access Key |
| TRNumber | text | editable | Transport Number |
| TRNumber2 | text | editable | Transport Number 2 |
| TRRemarks | text | editable | Transport Remarks |
| TRRemarks2 | text | editable | Transport Remarks 2 |
| TRAttachment | richtext | editable | TR Attachment |
| TRAttachment2 | richtext | editable | TR Attachment 2 |
| ABAPTR | text | computed | ABAP TR |
| ResolutionComments | text | editable | Resolution Comments |
| Att_G | richtext | editable | Attachment G |
| dtResolutionDetails | datetime | computed | Resolution Date |
| ResolutionComments_1 | text | editable | Resolution Comments (2) |
| dtDueDateImp | datetime | editable | Implementation Due Date |
| nmPMApp_1 | names | computed | PM Approval (2) |
| dtResolutionDetails_1 | datetime | computed | Resolution Date (2) |
| chkDisposition | keyword | editable | Disposition |
| nmImpPM | names | computed | Imp PM |
| dtAppImp | datetime | computed | Implementation Approval Date |
| commentH | text | computed | Comment H |
| CompBy | names | computed | Completed By |
| DateComp | datetime | computed | Date Completed |
| CompletedBy | names | computed | Final Completed By |
| DateCompleted | datetime | computed | Final Date Completed |
| DiscardStatus | text | computed | Discard Status |
| commentdiscard | text | computed | Discard Comment |
| DiscardedBy | names | computed | Discarded By |
| DiscardedDate | datetime | computed | Discard Date |

#### Forms: `ChangeForm`, `ChangeFormV1`, `ChangeFormV2` — Legacy versions

Progressively fewer fields; V1 and original lack SAP-specific code/config fields.

#### Forms: `EnterComments_E/F/H/J/Discard` (nocompose, noquery)

Comment entry dialogs per workflow stage.

#### Form: `Reminder` (nocompose)

Fields: rTxtDocLink, NotNum, DateOFReminder, CopyTo, SendTo, Subject

### Views (20+ views)

| View Name | Key Purpose |
|---|---|
| lookup | Running number (INO) |
| Draft | `CurrentAction="Draft"` |
| Summary | All change requests |
| Summary-Past | Past records |
| Outstanding | Outstanding |
| Outstanding\PdgTransport / Outstanding\PdgImplementation | Sub-views |
| ByStatus / ByPriority / ByAuthorisation / BySAPType / ByModule | Categorised views |
| ByFunctional_Pending | Pending functional |
| BySapnote / BySapnoteAll | By SAP Note |
| Development TRs | Development only |
| Withdrawn | Withdrawn |
| ALL | All records |
| Reminders / PdgHODRem | Reminder views |
| PdgApp | Pending approval |
| byBasis | By Basis team |

### Agents

RunningNumber · Refresh Docs · nmAssgTo · TR · ChangeForm · Clear Discard · Clear · Change Completed · PdgHOD · FORMULA · Clear Section E · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Cindy Chew/OU=PanCen/O=PHB | Editor | Person |
| CN=Harith/OU=PMS/O=PHB | Editor | Person |
| CN=Yong Siaw Hooi/OU=PMS/O=PHB | Editor | Person |
| CN=Ung Tay Aik/OU=PMS/O=PHB | Editor | Person |
| IT Software Team | Editor | Person Group |
| SAP BPO – Prai | Editor | Person Group |
| SAP Key Users – Prai | Editor | Person Group |
| Oleo Executives | Editor | Person Group |
| Pancen Executives & Above | Editor | Person Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 19 — SAP Disaster Recovery (DRP) — Penang

**Code:** `SAPDR`  
**Database Name:** SAP Disaster Recovery (DRP)  
**NSF Path:** `Current\SAPDRIssue.nsf`  
**Extraction Date:** 22/05/2026 3:39 PM

> **Note:** Same form/field structure as Module 2 (PanCen SAP DR). Contains identical forms: `SAP_DR Issue`, `Contacts`, `ProcedureEntryV1`, `Reports`, `ReplyMemo`, `AcceptMemo`, `ImpMemo`, `SAP_DR NoIssue`. Refer to Module 2 for full field definitions.

### Differences from Module 2

**Additional fields in `ProcedureEntryV1`:**

| Field Name | Type | Kind | Label |
|---|---|---|---|
| selection1 | keyword | editable | Selection 1 |
| AppBy | names | editable | Approved By |

**Additional Agents:** distributed · chg form *(both ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Irin Decruz/OU=PMS/O=PHB | Editor | Person |
| CN=Khor Kok Hiang/OU=PMS/O=PHB | Editor | Person |
| CN=Azisma/OU=PMS/O=PHB | Editor | Person |
| CN=Marlina/OU=PMS/O=PHB | Editor | Person |
| CN=Ravindran/OU=PMS/O=PHB | Editor | Person |
| CN=Kelly/OU=PMS/O=PHB | Editor | Person |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| SAP BPO – Prai | Editor | Person Group |
| SAP Key Users – Prai | Editor | Person Group |
| Oleo Local | Reader | Person Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 20 — SAP Storage Location Creation Form (Penang)

**Code:** `SAPLoc`  
**Database Name:** SAP – Storage Location Creation Form  
**NSF Path:** `Current\SAPSLoc.nsf`  
**Extraction Date:** 22/05/2026 4:00 PM

### Forms

#### Form: `New Storage Location` (alias: `frmAreaLocForm`)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| txtReqBy | text | editable | By (Requestor name) |
| dtSubmittedTimestamp | datetime | editable | Date Submitted |
| txtDesignation | text | editable | Designation |
| namesDepHead | names | editable | CC (HOD) |
| txtAreaLocNo | text | editable | Storage Location Code |
| txtLocAdd1 | text | editable | Storage Location Description |
| txtMatExtend | text | editable | Extended to Material Code |
| Attach | richtext | editable | Attachment |
| txtRmk | text | editable | Remarks (Requestor) |
| txtProteanSite | text | editable | Plant Code (IT section) |
| txtProteanLoc | text | editable | Storage Location Code (IT section) |
| txtSLocDesc | text | editable | SLoc Description (IT section) |
| txtRemarks | text | editable | IT Remarks |
| ITAttachment | richtext | editable | IT Attachment |
| txtRejRem | text | editable | Rejection Remarks |
| txtCpISGApp | text | computed | IT Approver |
| dtISGCreatedDate | datetime | computed | IT Created Date |
| ExtendedStatus | keyword | editable | Extended Status |
| txtRejRem_1 | text | editable | Rejection Remarks (2) |
| txtCpISGApp_1 | names | computed | IT Approver (2) |
| dtISGCreatedDate_1 | datetime | computed | IT Created Date (2) |
| authorReqBy_1 | authors | computedwhencomposed | Author |
| dtCreatedTimestamp | datetime | computed | Created Timestamp |
| txtRunNo | text | computed | Running No |
| txtHDocStatus | text | editable | Document Status |
| txtHCpDepHeadApp | names | editable | Dept Head Approval |
| txtHCpReqSec | names | computed | Requestor Section |

#### Form: `User Guide` (alias: `frmUserGuide`, renderpassthrough — static content)

### Views

| View Name | Key Purpose |
|---|---|
| Storage Location Creation Summary | Active requests |
| Completed Area/Location Creation Form | Completed |
| Draft | Draft requests |
| Pending Action by ISG Department | Pending IT |
| Rejected By ISG | Rejected |
| lookupACM / AES / AUS / AEC / DCM / POM / POC / PSN / PRF / PCP / ECM | Plant-code lookups |
| PanCen Records_Storage Location Creation Summary | PanCen records view |

### Agents

Replace · DB_NSF *(both ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| CN=Ravi Madhu/OU=PMS/O=PHB | Manager | Person |
| CN=Cindy Chew/OU=PanCen/O=PHB | Editor | Person |
| CN=Fadzli/OU=PanCen/O=PHB | Editor | Person |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| Oleo Local | Editor | Person Group |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 21 — SAP Sign Off Form

**Code:** `SAPSOF`  
**Database Name:** SAP Sign Off Form  
**NSF Path:** `Current\SAPSignForm.nsf`  
**Extraction Date:** 22/05/2026 3:42 PM

### Forms

#### Form: `SILO3` (default=true) — SILO Sign-Off (current)

**IT Submission Section:**

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Year | datetime | computedwhencomposed | Year |
| INO | text | computed | Running No |
| TRNumber | text | editable | Transport Number |
| DocTitle | text | editable | Document Title |
| TestPurpose | text | editable | Test Purpose |
| ITSubmittedDate | datetime | computed | IT Submitted Date |

**Test Script Table (rows 1–N):**

| Field Name | Type | Kind | Label |
|---|---|---|---|
| No1, No2 ... NoN | text | editable | Row number |
| TrnSteps1, TrnSteps2 ... | text | editable | Training Steps |
| TCode1, TCode2 ... | text | editable | T-Code |
| TestPara1, TestPara2 ... | text | editable | Test Parameters |
| ExpResult1, ExpResult2 ... | text | editable | Expected Result |
| ActResults1, ActResults2 ... | text | editable | Actual Results |

**Key User Sign-Off (KU1–KU5):**

| Field Name | Type | Kind | Label |
|---|---|---|---|
| KU1_SILO – KU5_SILO | names | editable | Key User 1–5 |
| KUStatus1 – KUStatus5 | keyword | computed | KU Status 1–5 |
| KUDate1 – KUDate5 | datetime | computed | KU Sign-Off Date 1–5 |
| KURemark1 – KURemark5 | text | editable | KU Remark 1–5 |
| KU1_Attachment – KU5_Attachment | richtext | editable | KU Attachment 1–5 |

**BPO Sign-Off (BPO1–BPO3):**

| Field Name | Type | Kind | Label |
|---|---|---|---|
| BPO1_SILO – BPO3_SILO | names | editable | BPO 1–3 |
| BPOStatus1 – BPOStatus3 | keyword | computed | BPO Status 1–3 |
| BPODate1 – BPODate3 | datetime | computed | BPO Sign-Off Date 1–3 |
| BPORemark1 – BPORemark3 | text | editable | BPO Remark 1–3 |

#### Forms: `SignOffForm_SILO`, `SignOffForm_SILO_New` (alias: `SILO2`) — Older SILO versions

#### Form: `SignOffForm_UAT` — UAT Sign-Off

Same structure as SILO but for UAT (User Acceptance Testing) phase.

#### Form: `SignOffForm-Ori` — Original Sign-Off

Simpler structure: TRNumber, DocTitle, TestPurpose, KU1–KU3 sign-off, ITSubmittedDate.

#### Forms: `ReminderMemoKU`, `guidelines`, `EnterCommentsCom1`, `Reminder` — Supporting forms

#### Subforms: `ITCreator`, `SignOff`

### Views

| View Name | Key Purpose |
|---|---|
| Draft_SILO / Draft_UAT | Draft by type |
| Summary_SILO / Summary_UAT | Summary by type |
| PdgKU_UAT / PdgBPO_UAT | Pending UAT sign-offs |
| PdgKU_SILO / PdgBPO_SILO | Pending SILO sign-offs |
| Completed_SILO | Completed SILO |
| lookupSILO / lookup | Running number by type |
| RemPdgKeyUsers / RemPdgBPO / Reminder_SILO / Reminders | Reminder views |
| Check BPO SILO Exists | BPO lookup |
| All | All sign-off forms |

### Agents

unlock · SET · Clear · Refresh Docs · Clear Sign Off 1 · FORMULA · RemPdgKeyUsers · RemPdgBPO · INO · Append · DB_NSF *(all ENABLED)*  
ReminderKeyUser *(DISABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| IT Software Team | Editor | Person Group |
| Oleo Local & PanCen | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 22 — SAP Transport Request

**Code:** `SAPTR`  
**Database Name:** SAP Transport Request  
**NSF Path:** `ISG\SAPTransRequest.nsf`  
**Extraction Date:** 22/05/2026 3:45 PM

### Forms

#### Form: `TRForm2` (default=true) — Transport Request (current)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Year | datetime | computedwhencomposed | Year |
| INO | text | computed | Running No |
| Category | keyword | editable | Category (dialoglist) |
| DevCategory | keyword | editable | Dev Category |
| Client | keyword | editable | Client |
| Client_2 | keyword | computed | Client 2 |
| IssueNum | text | editable | Issue Number (CRF/PRF reference) |
| TRNumber | text | editable | TR Number |
| TRDependant | text | editable | TR Dependant |
| Tcode | text | editable | T-Code |
| RptName | text | editable | Report Name |
| ChangesDone | text | editable | Changes Done |
| Remarks | richtext | editable | Remarks |
| Attachment | richtext | editable | Attachment |
| KeyUser | text | editable | Key User |
| RequestedBy | names | computed | Requested By |
| DateSubmitted | datetime | computed | Date Submitted |
| AppStatus | text | computed | Approval Status |
| AppBy | names | computed | Approved By |
| dtApproved | datetime | computed | Date Approved |
| Comment1 | text | computed | Comment 1 |
| TRStatus | text | computed | TR Status |
| TRBy | names | computed | TR By |
| dtTransport | datetime | computed | Date Transported |

#### Forms: `TRForm`, `TRForm1`, `TRForm_chris`, `TRForm_changing` — Older / variant versions

#### Forms: `EnterCommentsCom1–5` (nocompose, noquery)

Comment entry dialogs per approval/transport stage.

#### Form: `Guidelines` (renderpassthrough — static content)

#### Subforms: `Signature` (CDate, DocAuthor) · `SignOff` (extensive KU/BPO fields — shared with Module 21)

### Views (75+ views — key views listed)

| View Name | Key Purpose |
|---|---|
| lookup | Running number (INO) |
| Draft | Draft requests |
| PdgApproval | Pending approval (standard) |
| PdgApproval_IEP / PdgApproval_SAC | Pending approval by landscape |
| PdgTransport | Pending transport (standard) |
| PdgTransport_IEP | Pending transport IEP |
| PdgApp_Direct | Pending direct approval |
| Completed / CompletedIEP / CompletedSAC / CompletedALL / CompletedALLTEST | Completed by landscape |
| View All TRs | All transport requests |
| Summary | Summary by status |
| Rejected / Withdrawn | Rejected/Withdrawn |
| Resubmission for Transports | Resubmissions |
| Category / ByCategory | By category |
| Development TRs | Development only |
| ForSILO | SILO-linked TRs |
| IEDIEQHANA / IBDIBQHANA / IEDIEQIEPDUAL views | By landscape (HANA/DUAL) |
| BI_Completed / Transport_IBD/IBQ/IBP etc. | BI landscape |
| PdgTransport_SAC / PdgApproval_SAC | SAC landscape |

**SAP Landscape Reference:**

| Code | Description |
|---|---|
| IED / IEQ / IEP | IOI ERP Development / Quality / Production |
| IBD / IBQ / IBP | IOI BI Development / Quality / Production |
| HANA | HANA landscape |
| DUAL | Dual-stack landscape |
| SAC | SAP Analytics Cloud |

### Agents

INO · Clear Transport (B) · Set · Clear Withdrawn · Comments · DocAuthor · Refresh Docs · Clear Approval (B) · UNLOCK · Clear Submission (B) · FORMULA · DB_NSF *(all ENABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| IT Software Team | Editor | Person Group |
| CN=Danny Lee/OU=PMS/O=PHB | Editor | Person |
| CN=Ung Tay Aik/OU=PMS/O=PHB | Editor | Person |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| OtherDomainServers | No Access | Server Group |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

## Module 23 — Share Folder Access Requisition

**Code:** `SFAR`  
**Database Name:** Share Folder Access Requisition  
**NSF Path:** `Current\SFRequest.nsf`  
**Extraction Date:** 22/05/2026 3:49 PM

### Forms

#### Form: `Form3` (default=true) — Share Folder Request (current)

| Field Name | Type | Kind | Label |
|---|---|---|---|
| Company | keyword | editable | Company |
| Server | keyword | editable | Server (recalculates on change) |
| HOD | names | editable | HOD |
| Dept | keyword | editable | Department |
| Ext | number | editable | Extension |
| Owner | names | editable | Folder Owner |
| AccessType | keyword | editable | Access Type |
| FolderName | text | editable | Folder Name |
| Permission | keyword | editable | Permission |
| Purpose | text | editable | Purpose |
| Justification | text | editable | Justification |
| Remark | richtext | editable | Remark |
| Requestor | names | computed | Requestor |
| DateSent | datetime | computed | Date Sent |
| ITPICName | datetime | computed | IT PIC Name |
| ITPICDate | datetime | computed | IT PIC Date |
| ITPICComment | text | editable | IT PIC Comment |
| ITName | datetime | computed | IT Name |
| ITDate | datetime | computed | IT Date |
| ITComment | text | editable | IT Comment |
| ITName2 | datetime | computed | IT Name 2 |
| ITDate2 | datetime | computed | IT Date 2 |
| ITComment2 | richtext | editable | IT Comment 2 |
| OwnerName | text | computed | Owner Name |
| OwnerDate | datetime | computed | Owner Date |
| OwnerComment | text | editable | Owner Comment |
| hodName | text | computed | HOD Name |
| hodDate | datetime | computed | HOD Date |
| hodComment | text | editable | HOD Comment |
| AccName | datetime | computed | Acceptance Name |
| AccDate | datetime | computed | Acceptance Date |
| AccComment | richtext | editable | Acceptance Comment |

#### Form: `Form2` — Share Folder Request (v2)

Same as Form3 (no Form2-specific differences found).

#### Form: `Form1` — Share Folder Request (v1)

Same structure but with single IT approval (no ITPICName/ITPICDate; no ITName2/ITDate2/ITComment2). Uses: Owner, HOD, AccessType as radio selections.

#### Form: `Form` (alias: `lnir`) — Original version

Minimal: Company, Server, FullName, Ext, FolderName, Dept, Purpose, Justification, Remark, SendTo, Requestor, DateSent, hodName/hodDate/hodComment, AccName/AccDate/AccComment

#### Form: `Reminder` (alias: `rem`)

Fields: CopyTo, link, Date, SendTo

#### Form: `Guideline` (renderpassthrough — static content)

#### Subform: `Hidden Fields`

Fields: isReject, IT, Maillist, RemCC, Verifier, VerifierPrai, ITHOD, Editor1–6, PCNITSUP, PPIC, PIC, INT, BS, JHR, JHR2, PNG, ISG, svrLst, CA, CurrentAction

#### Subform: `Signature`

Fields: CDate, DocAuthor

### Views

| View Name | Key Purpose |
|---|---|
| Draft | Draft requests |
| Summary | Active requests |
| PendingByHOD | Pending HOD |
| PendingByOwner | Pending folder owner |
| PendingByPIC | Pending IT PIC |
| PendingITSup | Pending IT Support |
| PendingITVer | Pending IT Verification |
| PendingByITHOD | Pending IT HOD |
| Completed | Completed |
| Rejected | Rejected |
| All | All records |
| ForIT | For IT action |
| Owners | Owner lookup |
| KPI | KPI metrics |
| RemPdgHOD / RemPdgOwner / RemPdgPIC | Pending reminders |
| RemPdgITSup / RemPdgITHOD / RemPdgITVer | IT pending reminders |
| Reminders | Reminder records |
| TESTING | Testing |

### Agents

Set · Refresh Docs · Form · PendingOwner · PendingHOD · PendingISG · Clear Owner · RemPdgITSup · Clear HOD · Clear IT Verification · Clear DateSent · DB_NSF *(all ENABLED)*  
PendingITHOD · RemPdgITVer *(DISABLED)*

### Access Control List

| Entry | Access | Type |
|---|---|---|
| -Default- | No Access | Unspecified |
| PanCen Group | Editor | Person Group |
| Oleo Local | Editor | Person Group |
| CN=Test 3/OU=PMS/O=PHB | Reader | Person |
| CN=PHBSVR/O=PHB | Manager | Server |
| LocalDomainServers | Manager | Server Group |
| Notes Administrator Group | Manager | Mixed Group |

---

---

# APPENDIX A — Module Summary Table

| # | Code | Database Name | NSF Path | Site | Forms | Views | Agents |
|---|---|---|---|---|---|---|---|
| 1 | PanCen_HWInv | PanCen – Hardware Inventory | PanCen - Current\HWInv.nsf | Johor | 7 | 25+ | 7 |
| 2 | PanCen_SAPDR | PanCen – SAP Disaster Recovery (DRP) | PanCen - Current\SAPDR_PanCen.nsf | Johor | 8 | 20+ | 13 |
| 3 | PanCen_SAPLoc | PanCen – Storage Location Creation Form | PanCen - Current\SAPSLoc.nsf | Johor | 3 | 18+ | 4 |
| 4 | EAF | External Access Form (VPN & Citrix) | Current\vpnaccess.nsf | Penang | 8 | 19 | 6 |
| 5 | HI | Hardware Inventory | ISG\HWInv2013.nsf | Penang | 7 | 25+ | 7 |
| 6 | IAL | IT Activity Log – NEW | ISG\ISGLogActFYNew.nsf | Penang | 8 | 9 | 7 |
| 7 | IOIP | IOI Policy | Current\DRPPROC.nsf | Penang | 9 | 5+ | 9 |
| 8 | ITDR | IT Report – 2026 | ISG\ITReport2026.nsf | Penang | 2 | 30+ | 6 |
| 9 | ITI | IT Info | Current\ISGInfo.nsf | Penang | 1 | 4 | 3 |
| 10 | ITSC | IT Server Checklist 2026 | ISG\svrchklist26.nsf | Penang | 2 | 6 | 6 |
| 11 | ITSSR | IT Support & Service Request (SSR) 2026 | Current\ITSSR26.nsf | Penang | 3 | 30+ | 14 |
| 12 | NIR | Notes ID Request | Current\LNIDRequest.nsf | Penang | 4 | 17+ | 7 |
| 13 | ITP | IT Procedures / Training Manuals | ISG\isgdoc.nsf | Penang | 2 | 8 | 5 |
| 14 | PRF | Program Request Form (PRF) 2026 | Current\PRF26.nsf | Penang | 5 | 49+ | 18 |
| 15 | RS | Reset Password / Unlock ID | Current\ResetPwd09.nsf | Penang | 6 | 12+ | 6 |
| 16 | SAPAMR | SAP Authorisation Matrix Review | SAP IOI\AuthMatrixReview.nsf | Penang | 12 | 13+ | 7 |
| 17 | SAPCA | SAP Config Access | ISG\SAPConfigAccess.nsf | Penang | 5 | 14+ | 9 |
| 18 | SAPCR | SAP & WB Change Request Form | SAP IOI\SAPChgRequestForm.nsf | Penang | 10 | 20+ | 12 |
| 19 | SAPDR | SAP Disaster Recovery (DRP) | Current\SAPDRIssue.nsf | Penang | 8 | 22+ | 13 |
| 20 | SAPLoc | SAP – Storage Location Creation Form | Current\SAPSLoc.nsf | Penang | 2 | 15+ | 2 |
| 21 | SAPSOF | SAP Sign Off Form | Current\SAPSignForm.nsf | Penang | 10 | 20+ | 12 |
| 22 | SAPTR | SAP Transport Request | ISG\SAPTransRequest.nsf | Penang | 11 | 75+ | 12 |
| 23 | SFAR | Share Folder Access Requisition | Current\SFRequest.nsf | Penang | 6 | 20+ | 14 |

---

# APPENDIX B — Common Field Patterns

## Workflow Control Fields (present in most approval forms)

| Field Name | Type | Kind | Purpose |
|---|---|---|---|
| CurrentAction | text/keyword | editable | Workflow state machine (Draft, Submitted, Acceptance1, etc.) |
| Year | datetime | computedwhencomposed | Year of submission (for categorised views) |
| Month | datetime | computedwhencomposed | Month of submission |
| INO | text | computed | Running/sequence number |
| DocAuthor / docauthor | authors | computedwhencomposed | Document creator |

## Common Reminder Form Fields

| Field | Purpose |
|---|---|
| Subject | Reminder subject line |
| DateSent | Date reminder was sent |
| rTxtDocLink | Rich-text link back to source document |
| SendTo | Primary recipient |
| CopyTo | CC recipients |

## Standard Computed Approval Audit Fields

| Pattern | Example | Purpose |
|---|---|---|
| nm[Stage]By | nmAcceptedBy, nmVerifiedBy | Name of person who acted at stage |
| dt[Stage]Date | dtApproved, dtReplyDate | Date/time of action at stage |
| [Stage]Comment | ApprComment, hodComment | Free-text comment at stage |

## DB_NSF Agent

Every database contains a `DB_NSF` agent (ENABLED). This is a standard maintenance agent used to update the `DB_NSF` field that stores the database file path, enabling cross-database document links.

---

# APPENDIX C — Server Reference

| Server / Domain | Role |
|---|---|
| CN=PHBSVR/O=PHB | Penang (IOI Penang / Oleo) main Domino server |
| CN=PCNSVR/O=PHB | Johor (PanCen) main Domino server |
| LocalDomainServers | All servers in local domain |
| OtherDomainServers | Servers in other domains |

---

*End of document — IT Database Schema Documentation v1.0*  
*Generated: 22 May 2026 | Source: DXL XML exports from Lotus Notes / IBM Domino 12.0*
