# Source Traceability Matrix

> Links every form code to its Domino source, TSX reference page, Canvas screen, and SP list.
> Pilot forms seeded first. Expand as each form is built.
> Last updated: 2026-06-02

---

## How to Read This Matrix

Each row = one form.
- **Domino Source** = path to MASTER-NNN_SOURCES.md in source_analysis
- **TSX Reference** = path to the most relevant TSX page used as reference (NOT built from)
- **Canvas Screen** = canonical screen name + gblActiveFormCode value
- **SP Parent List** = MainDB_ list this form's records live in
- **SP Child List** = Ext_ list for child rows (if editable gallery pattern)
- **Build Status** = PENDING / IN_PROGRESS / BUILT / TESTED

---

## Pilot Forms (Build First)

| Form Code | App Name | Site | Dept | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Build Status |
|---|---|---|---|---|---|---|---|---|---|
| CAR | Capital Appropriation Request | Johor | FIN | `requirements/Johor/FIN/MASTER-002_PanCen_Capital_Appropriation_Request_CAR_SOURCES.md` | `pages/finance/forms/` | scrNewRequest / scrEditDraft / scrViewRequest (gblActiveFormCode="CAR") | MainDB_FIN | None | PENDING |
| NDF (Late Coming) | Late Coming Notification | Johor | HR | `requirements/Johor/HR/MASTER-012_PanCen_Late_Coming_Notification_SOURCES.md` | `pages/hr/ndf/` | scrNewRequest / scrEditDraft / scrViewRequest (gblActiveFormCode="NDF") | MainDB_HR | None | PENDING |
| AWHR | Rest Day & Additional Working Hours | Penang | HR | `requirements/Penang/HR/MASTER-147_SOURCES.md` | `pages/hr/awhr/new.tsx` **KEY** | scrNewRequest / scrEditDraft / scrViewRequest (gblActiveFormCode="AWHR") | MainDB_HR | JSON in awhrWorkingHours | PENDING |
| SSR | IT Support & Service Request | Penang | IT | `requirements/Penang/IT/MASTER-173_SOURCES.md` | `pages/it/forms/` | scrNewRequest / scrEditDraft / scrViewRequest (gblActiveFormCode="SSR") | MainDB_IT | MainDB_IT_Ext_Support | PENDING |

---

## HR Forms — Penang

| Form Code | App Name | Domino Source | TSX Reference | SP Parent List | SP Child List | Build Status |
|---|---|---|---|---|---|---|
| AWHR | Rest Day & Working Hours Req. | `requirements/Penang/HR/MASTER-147_*` | `pages/hr/awhr/` | MainDB_HR | JSON (awhrWorkingHours) | PENDING |
| EEN | Employee Exit Notification | `requirements/Penang/HR/MASTER-149_*` | `pages/hr/een/` | MainDB_HR | MainDB_HR_Ext_EEN | PENDING |
| EPDU | Employee Personal Detail Update | `requirements/Penang/HR/MASTER-160_*` | `pages/hr/epdu/` | MainDB_HR | MainDB_HR_Ext_EPDU | PENDING |
| TMPU | Talent Management Planning | `requirements/Penang/HR/MASTER-148_*` | `pages/hr/tmpu/` | MainDB_HR | MainDB_HR_Ext_TMPU (TBC) | PENDING |
| CWR | Contract Worker Requisition | `requirements/Penang/HR/MASTER-158_*` | `pages/hr/cwr/` | MainDB_HR | MainDB_HR_Ext_CWR | PENDING |
| FTCR | Fixed Term Contract Req. | `requirements/Penang/HR/MASTER-162_*` | `pages/hr/ftcr/` | MainDB_HR | MainDB_HR_Ext_FTCR | PENDING |
| FWWPE | Foreign Worker Work Permit Extension | `requirements/Penang/HR/MASTER-163_*` | `pages/hr/fwwpe/` | MainDB_HR | MainDB_HR_Ext_FWWPE | PENDING |
| GDSN | Gift-Donation-Sponsorship Req. | `requirements/Penang/HR/MASTER-164_*` | `pages/hr/gdsn/` | MainDB_HR | MainDB_HR_Ext_GDSN | PENDING |

---

## IT Forms — Penang (M1–M7 Modules, 24 Active Forms)

> Evidence source: `docs/central-form-reference.md`, `docs/04_WORKFLOW_APPROVAL_RULES.md`, `mapping/field-mapping.md`

### M1 — User & Access Management (Approval Required)

| Form Code | App Name | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Approval | Build Status |
|---|---|---|---|---|---|---|---|---|
| EAF | External Access Form (VPN & Citrix) | `source/dxl/EAF.xml` | `pages/it/forms/eaf/new.tsx` **KEY** | scrNewRequest / scrViewRequest / scrApprovalProcess (gblActiveFormCode="EAF") | MainDB_IT | MainDB_IT_Ext_Access | YES — 5-stage | PENDING |
| NIR (NOTESID) | Notes ID Request | `source/dxl/NOTESID.xml` | `pages/it/forms/nir/new.tsx` **KEY** | scrNewRequest / scrViewRequest (gblActiveFormCode="NIR") | MainDB_IT | MainDB_IT_Ext_Access | YES — 4-stage | PENDING |
| RS (PWDRESET) | Reset Password / Unlock ID | `source/dxl/PWDRESET.xml` | `pages/it/forms/rs/new.tsx` | scrNewRequest / scrViewRequest (gblActiveFormCode="RS") | MainDB_IT | MainDB_IT_Ext_Access | YES — 2-stage + conditional ED | PENDING |
| SFAR | Share Folder Access Request | `source/dxl/SFAR.xml` | `pages/it/forms/sfar/new.tsx` | scrNewRequest / scrViewRequest (gblActiveFormCode="SFAR") | MainDB_IT | MainDB_IT_Ext_Access | YES — 5-stage | PENDING |
| UR (USERID) | User ID Requisition Form | `source/dxl/USERID.xml` | `pages/it/forms/ur/new.tsx` | scrNewRequest / scrViewRequest (gblActiveFormCode="UR") | MainDB_IT | MainDB_IT_Ext_Access | YES — multi-stage | PENDING |

### M2 — IT Support

| Form Code | App Name | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Approval | Build Status |
|---|---|---|---|---|---|---|---|---|
| ITSSR | IT Support & Service Request | `source/dxl/ITSSR.xml` | `features/itssr/itssr-app.tsx` **KEY** | scrNewRequest / scrViewRequest (gblActiveFormCode="ITSSR") | MainDB_IT | MainDB_IT_Ext_Support | **NO** — service desk | PENDING |
| PRF | Program Request Form | `source/dxl/PRF.xml` | `pages/it/forms/prf/new.tsx` **KEY** | scrNewRequest / scrViewRequest (gblActiveFormCode="PRF") | MainDB_IT | MainDB_IT_Ext_Support | YES — 12-section multi-stage | PENDING |
| IAL (ITEVT) | IT Event/Activity Log | `source/dxl/ITEVT.xml` | `pages/it/forms/ial/new.tsx` | scrNewRequest (gblActiveFormCode="IAL") | MainDB_IT | MISSING_INFO | **NO** — legacy, custom component | PENDING |
| SRL (SVRREBOOT) | Server Reboot Log | `source/dxl/SVRREBOOT.xml` | `pages/it/forms/srl/new.tsx` | scrNewRequest (gblActiveFormCode="SRL") | MainDB_IT | MISSING_INFO | **NO** — legacy, custom component | PENDING |

### M3 — Hardware & Infrastructure

| Form Code | App Name | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Approval | Build Status |
|---|---|---|---|---|---|---|---|---|
| HI | Hardware Inventory | `source/dxl/HI.xml` | `pages/it/forms/hi/new.tsx` **KEY** | scrNewRequest / scrViewRequest (gblActiveFormCode="HI") | MainDB_IT | MainDB_IT_Ext_Assets | **NO** — record-keeping | PENDING |
| ITSC | IT Server Checklist | `source/dxl/ITSC.xml` | `pages/it/forms/itsc/new.tsx` | scrNewRequest (gblActiveFormCode="ITSC") | MainDB_IT | MainDB_IT_Ext_Assets | **NO** — record-keeping | PENDING |
| SVRREC | Server Record / RCA | `source/dxl/SVRREC.xml` | `pages/it/forms/svrrec/new.tsx` | scrNewRequest (gblActiveFormCode="SVRREC") | MainDB_IT | MISSING_INFO | TSX_INFERENCE — no approval signals | PENDING |

### M4 — SAP Governance (All Approval Required)

| Form Code | App Name | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Approval | Build Status |
|---|---|---|---|---|---|---|---|---|
| SAPAMR | SAP Authorisation Matrix Review | `source/dxl/SAPAMR.xml` | `pages/it/forms/sapamr/new.tsx` | scrNewRequest (gblActiveFormCode="SAPAMR") | MainDB_IT | MainDB_IT_Ext_SAP | YES | PENDING |
| SAPCA | SAP Config Access | `source/dxl/SAPCA.xml` | `pages/it/forms/sapca/new.tsx` | scrNewRequest (gblActiveFormCode="SAPCA") | MainDB_IT | MainDB_IT_Ext_SAP | YES | PENDING |
| SAPCR | SAP Change Request | `source/dxl/SAPCR.xml` | `pages/it/forms/sapcr/new.tsx` **KEY** | scrNewRequest (gblActiveFormCode="SAPCR") | MainDB_IT | MainDB_IT_Ext_SAP | YES — multi-stage | PENDING |
| SAPTR | SAP Transport Request | `source/dxl/SAPTR.xml` | `pages/it/forms/saptr/new.tsx` | scrNewRequest (gblActiveFormCode="SAPTR") | MainDB_IT | MainDB_IT_Ext_SAP | YES — 2-stage | PENDING |
| SAPSLCF | SAP Storage Location Create | `source/dxl/SAPSLCF.xml` | `pages/it/forms/sapslcf/new.tsx` | scrNewRequest (gblActiveFormCode="SAPSLCF") | MainDB_IT | MainDB_IT_Ext_SAP | TSX_INFERENCE — needs confirmation | PENDING |
| SAPDRP | SAP Disaster Recovery Plan | `source/dxl/SAPDRP.xml` | `pages/it/forms/sapdrp/new.tsx` | scrNewRequest (gblActiveFormCode="SAPDRP") | MainDB_IT | MainDB_IT_Ext_Infra | TSX_INFERENCE — needs confirmation | PENDING |

### M5 — Documentation

| Form Code | App Name | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Approval | Build Status |
|---|---|---|---|---|---|---|---|---|
| IOIPOL | IOI Policy | `source/dxl/IOIPOL.xml` | `pages/it/forms/ioip/new.tsx` | scrNewRequest (gblActiveFormCode="IOIPOL") | MainDB_IT | MainDB_IT_Ext_Policy | YES — 3-column authority sign-off | PENDING |
| ITINFO | IT Information Notice | `source/dxl/ITINFO.xml` | `pages/it/forms/iti/new.tsx` | scrNewRequest (gblActiveFormCode="ITINFO") | MainDB_IT | MISSING_INFO | **NO** — information record | PENDING |
| ISGDOC | IT Procedures/Document | `source/dxl/ISGDOC.xml` | `pages/it/forms/itp/new.tsx` | scrNewRequest (gblActiveFormCode="ISGDOC") | MainDB_IT | MainDB_IT_Ext_Docs | **NO** — document management | PENDING |

### M6 — Other IT

| Form Code | App Name | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Approval | Build Status |
|---|---|---|---|---|---|---|---|---|
| TRNMAN | Training Manuals | `source/dxl/TRNMAN.xml` | `pages/it/forms/trnman/new.tsx` | scrNewRequest (gblActiveFormCode="TRNMAN") | MainDB_IT | MISSING_INFO | **NO** — document management | PENDING |
| DCALOG | Data Center Access Log | `source/dxl/DCALOG.xml` | `pages/it/forms/dcalog/new.tsx` | scrNewRequest (gblActiveFormCode="DCALOG") | MainDB_IT | MISSING_INFO | **NO** — log entry | PENDING |
| ITDAILYRPT | IT Daily Report | `source/dxl/ITDAILYRPT.xml` | `pages/it/forms/itdailyrpt/new.tsx` | scrNewRequest (gblActiveFormCode="ITDAILYRPT") | MainDB_IT | MISSING_INFO | **NO** — daily log | PENDING |
| ITDR2 | IT Department Report v2 | `source/dxl/ITDR2.xml` | `pages/it/forms/itdr2/new.tsx` | scrNewRequest (gblActiveFormCode="ITDR2") | MainDB_IT | MISSING_INFO | **NO** — report submission | PENDING |

### M7 — Sign-Off Forms

| Form Code | App Name | Domino Source | TSX Reference | Canvas Screen | SP Parent List | SP Child List | Approval | Build Status |
|---|---|---|---|---|---|---|---|---|
| INTUATSOF | Integration UAT Sign-Off | `source/dxl/INTUATSOF.xml` | `pages/it/forms/intuatsof/new.tsx` | scrNewRequest (gblActiveFormCode="INTUATSOF") | MainDB_IT | MISSING_INFO | TSX_INFERENCE — needs confirmation | PENDING |
| SILOUATSOF | Silo UAT Sign-Off | `source/dxl/SILOUATSOF.xml` | `pages/it/forms/silouatsof/new.tsx` | scrNewRequest (gblActiveFormCode="SILOUATSOF") | MainDB_IT | MISSING_INFO | TSX_INFERENCE — needs confirmation | PENDING |

### Legacy / Superseded IT Forms (DO NOT BUILD)

| Form Code | Reason | Status |
|---|---|---|
| VPNACCESS | Superseded by EAF — duplicate schema | RETIRED |
| HWINV_PRAI | Superseded by HI — duplicate schema | RETIRED |
| ITEVT | Legacy — custom component, not DynamicForm. Use IAL instead. | RETIRED |
| SVRREBOOT | Legacy — custom component, not DynamicForm. Use SRL instead. | RETIRED |
| SAPAMR (LEGACY config) | Active config in `it-forms-config.ts` but marked Outdated in central-form-reference | RETIRED |

---

## FIN Forms — Johor

| Form Code | App Name | Domino Source | TSX Reference | SP Parent List | SP Child List | Build Status |
|---|---|---|---|---|---|---|
| CAR | Capital Appropriation Request | `requirements/Johor/FIN/MASTER-002_*` | `pages/finance/forms/` | MainDB_FIN | None | PENDING |
| CMF_A | Credit Management Form A | `requirements/Johor/FIN/MASTER-003_*` | `pages/finance/forms/` | MainDB_FIN | None | PENDING |
| INSUCLAI | Insurance Claim | `requirements/Johor/FIN/MASTER-004_*` | `pages/finance/forms/` | MainDB_FIN | MainDB_FIN_Ext_INSUCLAI_Rows | PENDING |

---

## How to Expand This Matrix

1. When a new form is ready to build, add a row to the correct dept section
2. Find the Domino source path from `01-source-reference/domino-source-index.md`
3. Find the TSX reference page from `01-source-reference/tsx-reference-index.md`
4. Confirm the SP list from `02-sharepoint-schema/sharepoint-list-inventory.md`
5. Set Build Status to PENDING
6. Update to IN_PROGRESS when build starts, BUILT when complete, TESTED when verified
