# All Forms Source Analysis — Domino DXL/XML vs Power Apps Implementation

> **Generated**: 2026-05-31
> **Updated**: 2026-05-31 — Added new HCL PDF evidence source; expanded scope from 23 IT to ~418+ total forms
> **Total Domino Forms (IT only)**: 23 (20 Penang IT + 3 Johor IT)
> **Total Domino Forms (all departments)**: **~418+ across 36 department-sites**
> **Penang**: ADMIN(4), E&I(6), ENG(1), FIN(6), HR(26), IT(28), LOG(15), MKT(5), MTN(9), PBI(1), POM(1), PRC(23), PRD(11), QA(~120), QC(36), R&D(6), SA(1), SEC(6), SHE(22), STR(16), T&D(11), WH(16)
> **Johor**: FN(5), HR(16), IT(6), LOG(3), Marketing(9), MTN(6), PRC(19), PRD(14), Project(2), QA(~90), QC(~80), SHE(7), SlsAdmin(3), STR(6)
> **Total App Form Schemas**: 27 JSON files (IT forms only in `powerapps-mirror/apps/ioi-platform/`)
> **Total App Form Pages**: 38 route directories (IT forms only)
> **Deep Analysis (DXL available)**: 23 IT + 26 HR Penang + 16 HR Johor + 27 QA Johor = **92 forms with complete field inventory**

---

## Evidence Source Inventory

### Primary Sources

| Source | Location | Count | Coverage | Quality |
|---|---|---|---|---|
| **Domino DXL/XML** | `source/dxl/XML_HR_*/` + IT PDF XMLs | 23 DXL files | 100% of IT forms | 📄 Full schema + field inventory |
| **HCL PDF Forms (NEW)** | `source/pdf/pdf_form_hcl/hcl_form_pdf/` | **626 PDFs** | All depts — Prai (22) + Johor (14) | 🟢 **Best quality** — clean named PDFs by form code |
| **Extracted Embedded PDFs** | `source/Project Iventories/extracted-embedded-pdfs/` | 1,171 PDFs | All depts — mixed confidence | 🟡 Mixed — has confidence ratings |
| **Master App Data CSV** | `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv` | 361 apps | Complete portfolio inventory | 🟢 **Authoritative** — build readiness status |
| **Final Apps Inventory XLSX** | `source/pdf/pdf_form_hcl/hcl_form_pdf/Final Apps Inventory.xlsx` | — | Full portfolio | 📄 Detailed spreadsheet |

### HCL PDF Evidence by Site

| Site | Departments | Total PDFs |
|---|---|---|
| **Prai (Penang)** | ADMIN, E&I, ENG, FIN, HR, **IT**, LOG, MKT, MTN, PBI, POM, PRC, PRD, QA, QC, R&D, SA, SEC, SHE, STR, T&D, WH (22 depts) | **372** |
| **Johor** | FN, HR, **IT**, LOG, Marketing, MTN, PRC, PRD, Project, QA, QC, SHE, SlsAdmin, STR (14 depts) | **254** |
| **Total** | — | **626** |

### HCL PDF Evidence for IT Forms

| Form | Penang HCL PDF | Size | Johor HCL PDF(s) | Size |
|---|---|---|---|---|
| **EAF** | `EAF.pdf` | 234 KB | — | — |
| **HI** | `HI.pdf` | 607 KB | `1_HWInv_*.pdf` (3 files) | 429-875 KB |
| **ITSSR** | `ITSSR.pdf` | 318 KB | — | — |
| **IAL1-5** | `IAL1-5.pdf` (5 files) | 75-186 KB | — | — |
| **IOIP** | `IOIP.pdf` | 268 KB | — | — |
| **ITDR** | `ITDR.pdf` | 347 KB | — | — |
| **ITDR2** | `ITDR2.pdf` | 420 KB | — | — |
| **ITI** | `ITI.pdf` | 119 KB | — | — |
| **ITP** | `ITP.pdf` | 297 KB | — | — |
| **ITP2** | `ITP2.pdf` | 300 KB | — | — |
| **ITSC** | `ITSC.pdf` | 737 KB | — | — |
| **NIR** | `NIR.pdf` | 309 KB | — | — |
| **PRF** | `PRF.pdf` | 273 KB | — | — |
| **RS** | `RS.pdf` | 490 KB | — | — |
| **SAPAMR** | `SAPAMR.pdf` | 100 KB | — | — |
| **SAPCA** | `SAPCA.pdf` | 92 KB | — | — |
| **SAPCR** | `SAPCR.pdf` | 209 KB | — | — |
| **SAPDRP** | `SAPDRP.pdf` | 88 KB | `2_SAPDR_PanCen.pdf` | 132 KB |
| **SAPSLCF** | `SAPSLCF.pdf` | 232 KB | `3_SAPSLoc_*.pdf` (2 files) | 203-297 KB |
| **SAPSOF** | `SAPSOF.pdf` | 580 KB | — | — |
| **SAPSOF2** | `SAPSOF2.pdf` | 549 KB | — | — |
| **SAPTR** | `SAPTR.pdf` | 90 KB | — | — |
| **SFAR** | `SFAR.pdf` | 228 KB | — | — |
| **UR** | `UR.pdf` | 685 KB | — | — |

### Build Readiness (from `master_app_data_still_needed.csv`)

| Status | Count | IT Forms |
|---|---|---|
| ✅ **ready_for_build** | 10 | EAF, SAPCR, SAPTR, SAPSOF, ITSC, RS, SAPCA, IT Report (multi-form), ITDR/ITDR2 |
| 🔍 **review_required** | 1 | Johor SAPSLCF |
| ⬜ **blocked_missing_source** | 10+ | ITSSR, PRF, IOIP, SAPAMR, UR, HI, IAL, SAPDRP, SFAR, SAPSLCF (Penang) |

> **Note**: Despite "blocked_missing_source" in the CSV, HCL PDFs exist for ALL forms in `PRAI_SITE_FORM/IT/`. The CSV status may refer to the older extracted-embedded-pdfs source.

---

## Complete Form Cross-Reference

| # | Domino Form | DB Title | Site | Mod | DXL Fields | Editable | Workflow | Schema File | Page Dir | Mapped | App Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **vpnaccess** | External Access Form (VPN & Citrix) | Penang | M1 | 21 | 10 | ✅ 5-stage | `EAF.json` ✅ | `eaf/` | 32/32 | ✅ Complete |
| 2 | **newhware** | Hardware Inventory | Penang | M3 | 58 | 50 | ❌ | `HI.json` ✅ | `hi/` | 58/58 | ⚠️ 25/58 in form |
| 3 | **DataRestorationV1** | IT Activity Log - NEW | Penang | M3 | 16 | 9 | ✅ | `SVRREBOOT.json` | `srvr/` | — | ❓ Unknown |
| 4 | **PolicyEntry** | IOIOI POLICY | Penang | M5 | 10 | 8 | ❌ | `IOIPOL.json` | `ioip/` | 10/10 | ❓ Unknown |
| 5 | **Plan** | IT Report - 2026 | Penang | M3 | 3 | 2 | ❌ | `ITDAILYRPT.json` | `itdr/` | — | ❓ Unknown |
| 6 | **ISGInfo** | IT Info | Penang | M5 | 3 | 3 | ✅ | `ITINFO.json` | `itinfo/` | 3/3 | ❓ Unknown |
| 7 | **isgdoc** | IT Procedures/Training Manuals | Penang | M5 | 10 | 7 | ❌ | `ISGDOC.json` | `isgdoc/` | 10/10 | ❓ Unknown |
| 8 | **AllServerMonitor** | IT Server Checklist 2026 | Penang | M3 | 27 | 25 | ❌ | `ITSC.json` | `itsc/` | 27/27 | ❓ Unknown |
| 9 | **Reminder** | IT Support & Service Request | Penang | M2 | 23 | 12 | ✅ 3-stage | `ITSSR.json` ✅ | `itssr/` | 23/23 | ✅ Complete |
| 10 | **ID Request** | Notes ID Request | Penang | M1 | 27 | 15 | ✅ | `NOTESID.json` | `nir/` | 27/27 | ❓ Unknown |
| 11 | **Reminder** | Program Request Form (PRF) | Penang | M2 | 23 | 14 | ✅ 4-stage | `PRF.json` | `prf/` | 23/23 | ❓ Unknown |
| 12 | **changepwd** | Reset Password/Unlock ID | Penang | M1 | 21 | 9 | ✅ | `PWDRESET.json` | `rs/` | 21/21 | ❓ Unknown |
| 13 | **SAPAutMatReview** | SAP Authorisation Matrix | Penang | M4 | 26 | 10 | ✅ | `SAPAMR.json` | `sapamr/` | 26/26 | ❓ Unknown |
| 14 | **ConfigForm** | SAP Config Access | Penang | M4 | 16 | 10 | ✅ | `SAPCA.json` | `sapca/` | 16/16 | ❓ Unknown |
| 15 | **ChangeForm** | SAP & WB Change Request | Penang | M4 | 54 | 33 | ✅ 4+ stage | `SAPCR.json` | `sapcr/` | 54/54 | ❓ Unknown |
| 16 | **SAP_DR Issue** | SAP Disaster Recovery (DRP) | Penang | M6 | 5 | 3 | ✅ | `SAPDRP.json` | `sapdrp/` | 5/5 | ❓ Unknown |
| 17 | **New Storage Location** | SAP Storage Location Form | Penang | M4 | 11 | 5 | ❌ | `SAPSLCF.json` | `sapslcf/` | 11/11 | ❓ Unknown |
| 18 | **SignOffForm-Ori** | SAP Sign off Form | Penang | M4 | 385+ | 110+ | ✅ 5+ stage | `SILOUATSOF.json`, `INTUATSOF.json` | `sapsof2/` | ⚠️ Partial | ⚠️ Pending |
| 19 | **TRForm** | SAP Transport Request | Penang | M4 | 34 | 19 | ❌ | `SAPTR.json` | `saptr/` | 34/34 | ❓ Unknown |
| 20 | **Form** | Share Folder Access Requisition | Penang | M1 | 26 | 13 | ✅ 3-stage | `SFAR.json` | `sfar/` | 26/26 | ❓ Unknown |
| 21 | **newhware** | PanCen - Hardware Inventory | Johor | M3 | 60 | 54 | ❌ | (same as HI) | (same as hi/) | 58/58 | ⚠️ 2 extra fields |
| 22 | **SAP_DR Issue** | PanCen - SAP DRP | Johor | M6 | 5 | 3 | ✅ | (same as SAPDRP) | (same as sapdrp/) | 5/5 | ✅ Matches Penang |
| 23 | **External Storage Location** | PanCen - Storage Location | Johor | M4 | 9 | 5 | ❌ | (same as SAPSLCF) | (same as sapslcf/) | 9/11 | ⚠️ Fewer fields |

---

## Extra Form Schemas (No Direct Domino Match)

| Schema File | FormCode | Likely Domino Form | Notes |
|---|---|---|---|
| `DCALOG.json` | DCALOG | — | Unknown — may be a new form or extracted from different source |
| `ITEVT.json` | ITEVT | — | Unknown — IT Event? |
| `TRNMAN.json` | TRNMAN | — | Training Manual? Related to ITP/isgdoc? |
| `ITDR2.json` | ITDR2 | — | IT Daily Report variant |
| `USERID.json` | USERID | UR | User ID request — probably maps to UR form |
| `SVRREBOOT.json` | SVRREBOOT | IAL | Server Reboot — maps to DataRestorationV1 |
| `SVRREC.json` | SVRREC | IAL | Server Record — maps to DataRestorationV1 |
| `HWINV_PRAI.json` | HWINV_PRAI | HI | ❌ OLD — superseded by `HI.json` |
| `VPNACCESS.json` | VPNACCESS | EAF | ❌ OLD — superseded by `EAF.json` |

---

## Page Route Directories (No Direct Domino Form Match)

| Page Dir | Likely Domino Form | Notes |
|---|---|---|
| `asset-submission/` | — | May be new process |
| `dcal/` | DCALOG | Calendar/scheduling form |
| `drr/` | — | Daily Record/Report? |
| `edl/` | — | Equipment/Device List? |
| `hwrr/` | — | Hardware Repair/Return? |
| `ite/` | ITEVT | IT Event |
| `mpsprn/` | — | MPS/PRN department |
| `sap-inc/` | SAPCR? | SAP Incident |
| `srl/` | — | Service Request List? |
| `srr/` | — | Service Request Report? |
| `trnman/` | TRNMAN | Training Manual |

---

## Module Coverage Summary

| Module | Forms | Schemas | Pages | DXL Fields | Fields Mapped | Implementation Status |
|---|---|---|---|---|---|---|
| **M1 — User & Access** | EAF, NIR, RS, SFAR, UR | `EAF.json` `NOTESID.json` `PWDRESET.json` `SFAR.json` `USERID.json` | `eaf/` `nir/` `rs/` `sfar/` `ur/` | 21+27+21+26 = ~95 | 32+27+21+26 = ~106 | ✅ EAF done; others need review |
| **M2 — IT Support** | IAL1-5, ITDR, ITDR2, ITSSR, PRF | `ITSSR.json` `PRF.json` `ITDAILYRPT.json` `ITDR2.json` | `itssr/` `prf/` `itdr/` `itdr2/` `srvr/` | 23+23+3+16 = ~65 | 23+23 = ~46 | ✅ ITSSR done; others need review |
| **M3 — Hardware** | HI, ITSC, 1_HWInv_NewInv | `HI.json` `ITSC.json` `SVRREBOOT.json` `SVRREC.json` | `hi/` `itsc/` `srvr/` `asset-submission/` | 58+27+16 = ~101 | 58+27 = ~85 | ⚠️ HI partial; ITSC/IAL need review |
| **M4 — SAP** | SAPAMR, SAPCA, SAPCR, SAPSLCF, SAPSOF, SAPTR | `SAPAMR.json` `SAPCA.json` `SAPCR.json` `SAPSLCF.json` `SAPTR.json` `SILOUATSOF.json` `INTUATSOF.json` | `sapamr/` `sapca/` `sapcr/` `sapslcf/` `sapsof2/` `saptr/` `sap-inc/` | 26+16+54+11+385+34 = ~526 | 26+16+54+11+34 = ~141 | ⚠️ SAPSOF pending; others need review |
| **M5 — Docs** | IOIP, ITI, ITP, ITP2 | `IOIPOL.json` `ITINFO.json` `ISGDOC.json` `TRNMAN.json` | `ioip/` `itinfo/` `isgdoc/` `trnman/` | 10+3+10 = ~23 | 10+3+10 = ~23 | ❓ Unknown — need to review |
| **M6 — DR** | SAPDRP | `SAPDRP.json` | `sapdrp/` | 5 | 5 | ❓ Unknown |

---

## Evidence Confidence by Form

| Form | DXL Source | PDF UI | Screenshots | Field Mapping | Confidence | Notes |
|---|---|---|---|---|---|---|
| **EAF** | ✅ `EAF_all_dxl.xml` | ✅ 28 PDFs | — | ✅ Complete | 🔵 High | Fully analyzed and reconciled |
| **HI** | ✅ `HI_all_dxl.xml` | ✅ Penang PDFs | — | ✅ Complete | 🔵 High | Johor variant has 2 extra fields |
| **ITSSR** | ✅ `ITSSR_all_dxl.xml` | ✅ Penang PDFs | — | ✅ Complete | 🔵 High | Needs PDF UI inventory populated |
| **IAL** | ✅ `IAL_all_dxl.xml` | ✅ PDFs | — | ⚠️ Partial | 🟡 Medium | Schema exists but page content unknown |
| **IOIP** | ✅ `IOIP_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | Schema exists but page content unknown |
| **ITDR** | ✅ `ITDR_all_dxl.xml` | ✅ PDFs | — | ⚠️ Partial | 🟡 Medium | 3-field form |
| **ITI** | ✅ `ITI_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 3-field form |
| **ITP** | ✅ `ITP_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | Schema = ISGDOC |
| **ITSC** | ✅ `ITSC_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 27-field server checklist |
| **NIR** | ✅ `NIR_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 27-field Notes ID Request |
| **PRF** | ✅ `PRF_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 23-field, 8 agents |
| **RS** | ✅ `RS_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 21-field password reset |
| **SFAR** | ✅ `SFAR_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 26-field share folder |
| **SAPAMR** | ✅ `SAPAMR_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 26-field auth matrix |
| **SAPCA** | ✅ `SAPCA_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 16-field config access |
| **SAPCR** | ✅ `SAPCR_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 54-field change request |
| **SAPDRP** | ✅ `SAPDR_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 5-field DRP |
| **SAPSLCF** | ✅ `SAPLoc_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 11-field storage location |
| **SAPSOF** | ✅ `SAPSOF_And_SAPSOF2_all_dxl.xml` | ✅ PDFs | — | ⚠️ Partial | 🟠 Low | 385+ fields — largest form |
| **SAPTR** | ✅ `SAPTR_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | 34-field transport request |
| **HI_JHR** | ✅ `PanCen_HWInv_all_dxl.xml` | ✅ 6 PDFs | — | ✅ Complete | 🔵 High | 60 fields, 2 extra vs Penang |
| **SAPDRP_JHR** | ✅ `PanCen_SAPDR_all_dxl.xml` | ✅ PDFs | — | ✅ Complete | 🟡 Medium | Matches Penang |
| **SAPSLCF_JHR** | ✅ `PanCen_SAPLoc_all_dxl.xml` | ✅ PDFs | — | ⚠️ Partial | 🟡 Medium | 9 fields vs 11 Penang |

---

## Key Findings — All Forms

### Missing / Unclear Form-Process Links

| Schema/Page | Domino Source | Issue | Action Required |
|---|---|---|---|
| `DCALOG.json` / `dcal/` | No clear match | May be a new form or extracted from different Domino DB | Identify source |
| `ITEVT.json` / `ite/` | No clear match | May be IT Event form from different source | Identify source |
| `TRNMAN.json` / `trnman/` | `ITP`? | Training Manuals — may be ITP variant | Verify |
| `ITDR2.json` / `itdr2/` | `ITDR` variant | Duplicate of ITDR? | Check if superseded |
| `asset-submission/` | — | New process? | Confirm purpose |
| `drr/` | — | Unknown purpose | Identify |
| `edl/` | — | Unknown purpose | Identify |
| `hwrr/` | — | Unknown purpose | Identify |
| `mpsprn/` | — | MPS/PRN department | Business process form |
| `sap-inc/` | `SAPCR`? | SAP Incident may overlap with SAPCR | Check redundancy |
| `srl/` | — | Unknown | Identify |
| `srr/` | — | Unknown | Identify |

### Old Schema Files to Delete

| File | Superseded By | Reason |
|---|---|---|
| `VPNACCESS.json` | `EAF.json` | Wrong formCode "VPNACCESS" vs actual "EAF" |
| `HWINV_PRAI.json` | `HI.json` | Wrong formCode "HWINV_PRAI" vs actual "HI" |

### Schema Files with Unknown Content Quality

These schemas exist but haven't been verified against their Domino DXL source:

| Schema | Domino Form | DXL Fields | Schema Fields | Verification Needed |
|---|---|---|---|---|
| `NOTESID.json` | NIR | 27 | ? | Full comparison |
| `PWDRESET.json` | RS | 21 | ? | Full comparison |
| `PRF.json` | PRF | 23 | ? | Full comparison |
| `SFAR.json` | SFAR | 26 | ? | Full comparison |
| `SAPAMR.json` | SAPAMR | 26 | ? | Full comparison |
| `SAPCA.json` | SAPCA | 16 | ? | Full comparison |
| `SAPCR.json` | SAPCR | 54 | ? | Full comparison |
| `SAPTR.json` | SAPTR | 34 | ? | Full comparison |
| `ITSC.json` | ITSC | 27 | ? | Full comparison |
| `IOIPOL.json` | IOIP | 10 | ? | Full comparison |
| `ITINFO.json` | ITI | 3 | ? | Full comparison |
| `ISGDOC.json` | ITP | 10 | ? | Full comparison |
| `SILOUATSOF.json` | SAPSOF | 385+ | ? | Major effort |
| `INTUATSOF.json` | SAPSOF | 385+ | ? | Major effort |

### Domino Agent Replacement Status

| Form | Agents | Replaceable via Power Automate | Status |
|---|---|---|---|
| **EAF** | 6 (Clear, Refresh, RemAllPdg, Set, DBNSF, FORMULA) | ✅ Yes — @MailSend → Approval connector | ✅ Designed |
| **HI** | 7 (Set, Refresh, Modi, INO, FORMULA, RemExpiry, DB_NSF) | ✅ Yes — RemExpiry → Scheduled flow | ⬜ Not built |
| **ITSSR** | 13 (INO, SET, Refresh, Clear Rejection, etc.) | ⚠️ Partial — INO → auto-numbering flow | ⬜ Not built |
| **NIR** | 6 (Refresh, Clear Completion, RemPdgHWG, RemPdgHOD, SET, DB_NSF) | ⚠️ Partial — Reminders replaceable | ⬜ Not built |
| **PRF** | 18 (INO, SET, HR, Clear, Refresh, etc.) | ⚠️ Partial — Complex multi-agent | ⬜ Not built |
| **RS** | 6 (RunningNumber, SET, Refresh, Formula, RemPdgIT, DB_NSF) | ✅ Yes — RunningNumber → auto-numbering | ⬜ Not built |
| **SFAR** | 14 (Set, Refresh, Form, PendingOwner, PendingHOD, etc.) | ⚠️ Partial — Multi-stage reminder agents | ⬜ Not built |
| **SAPCR** | 12 (RunningNumber, Refresh, nmAssgTo, TR, etc.) | ⚠️ Partial — Complex | ⬜ Not built |
| **SAPSOF** | 12 (unlock, SET, ReminderKeyUser, Clear, Refresh, etc.) | ⚠️ Partial — Very complex | ⬜ Not built |
| **SAPTR** | 12 (INO, Clear Transport, Set, Clear Withdrawn, etc.) | ⚠️ Partial — Complex | ⬜ Not built |

---

## CRUD Page Gap Analysis

| CRUD Score | Count | Forms |
|---|---|---|---|
| **4/4** (index + new + detail + [id]) | **16** | EAF, HI, ITSSR, NIR, PRF, IOIP, ITSC, SRVR (IAL), RS, UR, SAPAMR, SAPCA, SAPTR, **SAPCR**, **SFAR**, **SAPSOF2** |
| **2/4** (index + new only — missing detail) | **8** | SAPSLCF, ITINFO, ISGDOC, SAPDRP, DCALOG, ITE, DRR, TRNMAN |
| **1/4** (new only — missing index + detail) | **4** | ITDR2, EDL, asset-submission, sap-inc |
| **Total** | **28** | — |

### Forms Most Impacted by Missing Detail Pages

| Priority | Form | Module | Fields | Workflow | Impact |
|---|---|---|---|---|---|
| ~~🔴 P1~~ | **SAPCR** | M4 | 54 | ✅ Yes | ✅ **Done** — detail page created with full approval chain |
| ~~🔴 P1~~ | **SFAR** | M1 | 26 | ✅ Yes | ✅ **Done** — detail page created with verification info |
| ~~🔴 P1~~ | **SAPSOF2** | M4 | 385 | ✅ Yes | ✅ **Done** — detail page with child tables (key users, BPO, test evidence) |
| ~~🟡 P2~~ | **RS** | M1 | 21 | ✅ Yes | ✅ **Done** — detail page created |
| ~~🟡 P2~~ | **SAPAMR** | M4 | 26 | ✅ Yes | ✅ **Done** — detail page created |
| ~~🟡 P2~~ | **SAPCA** | M4 | 16 | ✅ Yes | ✅ **Done** — detail page created (sample data) |
| ~~🟡 P2~~ | **SAPTR** | M4 | 34 | ❌ No | ✅ **Done** — detail page created (sample data) |
| ~~🟡 P2~~ | **UR** | M1 | ~20 | ❌ No | ✅ **Done** — detail page created |
| 🟢 P3 | ITDR, ITDR2, ITINFO, ISGDOC, SAPDRP, SAPSLCF, DCALOG, ITE, DRR, TRNMAN, EDL, asset-submission, sap-inc | Various | Small | Various | Smaller or unknown forms |

---

## Summary Statistics

| Metric | Value |
|---|---|
| Total Domino forms (IT) | 23 (20 Penang + 3 Johor) |
| Total app form schemas | 27 JSON files |
| Total app form page dirs | 38 directories |
| Unique Domino→App mapped | 20 forms with clear mapping |
| Unmapped schemas | 4 (DCALOG, ITEVT, TRNMAN, ITDR2) |
| Unmapped page dirs | 7 (asset-submission, drr, edl, mpsprn, sap-inc, srl, srr) |
| Forms with full CRUD | **16 (57%)** |
| Forms missing detail page | **8 (29%)** |
| Forms missing list + detail | 4 (14%) |
| Schema files to delete | 2 (VPNACCESS.json, HWINV_PRAI.json) |

## Next Analysis Steps

1. **Verify each form schema** against its DXL source for field coverage (all 16 unchecked schemas)
2. **Identify source** of unmapped schemas (DCALOG, ITEVT, TRNMAN, ITDR2)
3. ✅ **P2 detail pages created** — RS, SAPAMR, SAPCA, SAPTR, UR
4. ✅ **P1 detail pages created** — SAPCR, SFAR, SAPSOF2 (all 3 complete)
5. 🟢 **PDF UI inventory** — ✅ Done
6. **Remaining missing detail pages** (8 forms) — SAPSLCF, ITINFO, ISGDOC, SAPDRP, DCALOG, ITE, DRR, TRNMAN
7. **Swap SAPCA, SAPTR, SAPSOF2 from sample data** to real SharePoint hooks
8. **Build SAPSOF decomposition plan** — 385+ fields need sub-form strategy
