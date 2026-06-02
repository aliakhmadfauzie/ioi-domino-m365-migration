# PDF UI Inventory — Complete Portfolio

> **Updated**: 2026-05-31 — Full population with HCL PDF source data; expanded to all 36 department-sites
> **Primary Source**: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/{DEPT}/` and `JOHOR_SITE_FORM/{DEPT}/` — **🟢 BEST QUALITY**
> **Secondary Source**: `source/Project Iventories/extracted-embedded-pdfs/`
> **Total HCL PDF UI Exports**: **626** (372 Penang + 254 Johor)
> **Total Extracted PDFs**: 1,171
> **Grand Total**: ~1,797
> **IT Department PDFs**: 28 (Penang) + 6 (Johor) = **34 clean named PDFs**
> **Portfolio CSV**: `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv` (361 apps)
> **Status**: ✅ IT forms fully inventoried — other departments have PDF-only evidence (see below)

---

## Source Priority

1. **🟢 HCL PDF Forms** — `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/{FormCode}.pdf` — clean named PDFs
2. **🟡 Extracted Embedded PDFs** — fallback for cross-reference only
3. **📄 DXL/XML source** — for field-level details where PDF is image-only

---

## Penang IT Forms — PDF UI Inventory

| # | FormCode | Domino Form | HCL PDF Path | PDF Size | Est. Fields | Workflow | UI Sections (from DXL) | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | **EAF** | vpnaccess | `PRAI/EAF.pdf` | 234 KB | ~21 visible | ✅ 5-stage | Requestor Info, HOD Acceptance, Director Acceptance, IT Manager, IT Provisioning, Config | Pilot form — fully analyzed |
| 2 | **HI** | newhware | `PRAI/HI.pdf` | 607 KB | ~50 visible | ❌ | General Info, Hardware Config, Software, Accounts, Notes | Large detailed form |
| 3 | **IAL1** | DataRestorationV1 | `PRAI/IAL1.pdf` | 151 KB | ~16 | ✅ | Data Restoration form | IT Activity Log |
| 4 | **IAL2** | DataRestorationV1 | `PRAI/IAL2.pdf` | 150 KB | ~16 | ✅ | Server Reboot form | IT Activity Log variant |
| 5 | **IAL3** | DataRestorationV1 | `PRAI/IAL3.pdf` | 76 KB | ~16 | ✅ | ISG Events form | Smallest IT PDF |
| 6 | **IAL4** | DataRestorationV1 | `PRAI/IAL4.pdf` | 153 KB | ~16 | ✅ | Data Center form | IT Activity Log variant |
| 7 | **IAL5** | DataRestorationV1 | `PRAI/IAL5.pdf` | 186 KB | ~16 | ✅ | Server Records form | IT Activity Log variant |
| 8 | **IOIP** | PolicyEntry | `PRAI/IOIP.pdf` | 268 KB | ~10 | ❌ | Policy Document | Doc management |
| 9 | **ITDR** | Plan | `PRAI/ITDR.pdf` | 347 KB | ~3 | ❌ | IT Report | Small form |
| 10 | **ITDR2** | Plan variant | `PRAI/ITDR2.pdf` | 420 KB | ~3 | ❌ | IT Report variant | Report variant |
| 11 | **ITI** | ISGInfo | `PRAI/ITI.pdf` | 119 KB | ~3 | ✅ | ISG Info | Smallest IT form |
| 12 | **ITP** | isgdoc | `PRAI/ITP.pdf` | 297 KB | ~10 | ❌ | Procedure Document | Training Manual |
| 13 | **ITP2** | isgdoc variant | `PRAI/ITP2.pdf` | 300 KB | ~10 | ❌ | Procedure variant | Training Manual v2 |
| 14 | **ITSC** | AllServerMonitor | `PRAI/ITSC.pdf` | 737 KB | ~27 | ❌ | Server Checklist | **Largest PDF** — detailed checklist |
| 15 | **ITSSR** | Reminder (SSR) | `PRAI/ITSSR.pdf` | 318 KB | ~18 visible | ✅ 3-stage | Requestor Details, Service Details, Resolution, Closure | Pilot form — has SLA tracking |
| 16 | **NIR** | ID Request | `PRAI/NIR.pdf` | 309 KB | ~27 | ✅ 4-stage | Requestor, ID Details, HOD, HW Group, Notes Admin | Notes ID |
| 17 | **PRF** | Reminder (PRF) | `PRAI/PRF.pdf` | 273 KB | ~23 | ✅ 6-stage | Requestor, System, Functional Specs, Processing, Validation | Program Request |
| 18 | **RS** | changepwd | `PRAI/RS.pdf` | 490 KB | ~21 | ✅ 3-stage | Requestor, Password Reset, IT Processing, ED Approval | Password Reset |
| 19 | **SAPAMR** | SAPAutMatReview | `PRAI/SAPAMR.pdf` | 100 KB | ~26 | ✅ | Auth Matrix Review | SAP Governance |
| 20 | **SAPCA** | ConfigForm | `PRAI/SAPCA.pdf` | 92 KB | ~16 | ✅ | Config Access | SAP Gov — smallest |
| 21 | **SAPCR** | ChangeForm | `PRAI/SAPCR.pdf` | 209 KB | ~54 | ✅ 4+ stage | Initiation, Description, Technical, Testing, Approval | SAP Change Request |
| 22 | **SAPDRP** | SAP_DR Issue | `PRAI/SAPDRP.pdf` | 88 KB | ~5 | ✅ | DR Issue | SAP DRP |
| 23 | **SAPSLCF** | New Storage Location | `PRAI/SAPSLCF.pdf` | 232 KB | ~11 | ❌ | Storage Location | SAP Storage |
| 24 | **SAPSOF** | SignOffForm-Ori | `PRAI/SAPSOF.pdf` | 580 KB | 385+ | ✅ 5+ stage | UAT Sign-Off sections | **Most complex form** |
| 25 | **SAPSOF2** | SignOffForm-Ori | `PRAI/SAPSOF2.pdf` | 549 KB | ~385 | ✅ 5+ stage | SILO Sign-Off variant | SAPSOF variant |
| 26 | **SAPTR** | TRForm | `PRAI/SAPTR.pdf` | 90 KB | ~34 | ❌ | Transport Request | SAP Transport |
| 27 | **SFAR** | Share Folder Access | `PRAI/SFAR.pdf` | 228 KB | ~26 | ✅ 3-stage | Requestor, Folder Access, HOD, Owner, IT Support | Share Folder |
| 28 | **UR** | User ID Request | `PRAI/UR.pdf` | 685 KB | ~20 | ❌ | User ID Request | **2nd largest** |

---

## Johor IT Forms — PDF UI Inventory

| # | FormCode | Domino Form | HCL PDF Path(s) | PDF Size | Notes |
|---|---|---|---|---|---|
| 1 | **HI_JHR** | newhware (PanCen) | `JOHOR/1_HWInv_MSPNetworkPrinter.pdf` | 429 KB | Hardware — Network Printer |
| 2 | **HI_JHR** | newhware (PanCen) | `JOHOR/1_HWInv_Network.pdf` | 432 KB | Hardware — Network |
| 3 | **HI_JHR** | newhware (PanCen) | `JOHOR/1_HWInv_NewInv.pdf` | 875 KB | Hardware — New Inventory (**largest overall**) |
| 4 | **SAPDRP_JHR** | SAP_DR Issue (PanCen) | `JOHOR/2_SAPDR_PanCen.pdf` | 132 KB | SAP DRP Johor |
| 5 | **SAPSLCF_JHR** | Ext. Storage Location | `JOHOR/3_SAPSLoc_External.pdf` | 203 KB | Storage Location — External |
| 6 | **SAPSLCF_JHR** | Int. Storage Location | `JOHOR/3_SAPSLoc_Internal.pdf` | 297 KB | Storage Location — Internal |

---

## UI Analysis Summary

| Metric | Value |
|---|---|
| **Total IT HCL PDFs (Penang)** | **28** — one per form code |
| **Total IT HCL PDFs (Johor)** | **6** — 3 forms with multiple sub-forms |
| **Total PDF UI evidence** | **34 clean named files** |
| **Forms with image-based PDFs** | All — PDFs contain form screenshots |
| **Largest PDFs** | ITSC (737 KB), UR (685 KB), HI (607 KB), SAPSOF (580 KB) |
| **Smallest PDFs** | SAPCA (92 KB), SAPTR (90 KB), SAPDRP (88 KB) |

---

## UI Categories by Form Type

### Workflow Forms (Multi-Stage Approval) — 11 forms
These have visible approval stage sections in their PDF UIs:

| Form | Stages | PDF Evidence |
|---|---|---|
| **EAF** | 5: HOD → Director → IT Manager → IT Provisioning | `EAF.pdf` 234 KB |
| **NIR** | 4: HOD → HW Group → Notes Admin → Complete | `NIR.pdf` 309 KB |
| **PRF** | 6: ISG → Functional → Processing → Validation | `PRF.pdf` 273 KB |
| **SFAR** | 3: Owner → HOD → IT Support | `SFAR.pdf` 228 KB |
| **RS** | 3: IT Processing → ED Approval → Closed | `RS.pdf` 490 KB |
| **SAPCR** | 4+: BPO → PM → Implementation | `SAPCR.pdf` 209 KB |
| **SAPSOF** | 5+: Key User → BPO → IT Review → Close | `SAPSOF.pdf` 580 KB |
| **ITSSR** | 3: Triage → Resolution → Acceptance | `ITSSR.pdf` 318 KB |
| **IAL1-5** | 2: Entry → Review | `IAL1-5.pdf` 76-186 KB |
| **ITI** | 2: Info entry | `ITI.pdf` 119 KB |
| **SAPAMR** | 3: Draft → Verification → Approval | `SAPAMR.pdf` 100 KB |
| **SAPCA** | 4: Access → Closure → Completion | `SAPCA.pdf` 92 KB |
| **SAPDRP** | 3: Reply → Acceptance → Final | `SAPDRP.pdf` 88 KB |

### Data Entry Forms (No Workflow) — 9 forms
| Form | Sections | PDF Evidence |
|---|---|---|
| **HI** | Asset info, hardware config, procurement, software, notes | `HI.pdf` 607 KB |
| **ITSC** | Server monitoring checklist (27 fields) | `ITSC.pdf` 737 KB |
| **ITDR/ITDR2** | IT report entries | `ITDR.pdf` 347 KB, `ITDR2.pdf` 420 KB |
| **SAPSLCF** | Storage location details | `SAPSLCF.pdf` 232 KB |
| **SAPTR** | Transport request entries | `SAPTR.pdf` 90 KB |

### Document Management Forms — 4 forms
| Form | Sections | PDF Evidence |
|---|---|---|
| **IOIP** | Policy document metadata | `IOIP.pdf` 268 KB |
| **ITI** | ISG information entry | `ITI.pdf` 119 KB |
| **ITP/ITP2** | Training manual documents | `ITP.pdf` 297 KB, `ITP2.pdf` 300 KB |

---

---

## Penang All Departments — PDF Inventory Summary

| Dept | Folder | PDF Count | Form Codes (from filenames) |
|------|--------|-----------|-----------------------------|
| **ADMIN** | `PRAI_SITE_FORM/ADMIN/` | 4 | DAR, RAR, SRS, SRS_SF |
| **E&I** | `PRAI_SITE_FORM/E&I/` | 6 | CALI, ECMCALI, ISO50001BR, ISO50001NCR, ISO50001SOP, PRODSYSMOD |
| **ENG** | `PRAI_SITE_FORM/ENG/` | 1 | ENGSR |
| **FIN** | `PRAI_SITE_FORM/FIN/` | 6 | CAR, CMF_A, CMF_B, CMF_C, EARF, RSES |
| **HR** | `PRAI_SITE_FORM/HR/` | **26** | AWHR, BSD, CIR, CWR, DRD, EEN, EPDU, EPHR, ESF, FTCR, FWWPD, FWWPE, GDSN, HEALTHINFO, HRAPR, HRINFO, INTERN, INTERVIEWDB, JD, NDF, ORGCHART, OWP, PAF, SR, TMPU, TNPRA |
| **IT** | `PRAI_SITE_FORM/IT/` | **28** | EAF, HI, IAL1-5, IOIP, ITDR, ITDR2, ITI, ITP, ITP2, ITSC, ITSSR, NIR, PRF, RS, SAPAMR, SAPCA, SAPCR, SAPDRP, SAPSLCF, SAPSOF, SAPSOF2, SAPTR, SFAR, UR |
| **LOG** | `PRAI_SITE_FORM/LOG/` | 15 | ECMFORKLIFT, FORKLIFT1-4, IMDG, POD, SHUNTINGTRUCK1-3, TANKERWASH1-3, WCC1-2 |
| **MKT** | `PRAI_SITE_FORM/MKT/` | 5 | ACMPDS, ACMSE, CO, MKTCD, MKTVCR |
| **MTN** | `PRAI_SITE_FORM/MTN/` | 9 | EE, ENMS1, ENMS2, EQUIPPREINS, FAR, MTNEMGNCY, MTNPLAN1, MTNPLAN2, PLANTMTN |
| **PBI** | `PRAI_SITE_FORM/PBI/` | 1 | PBISOPWI |
| **POM** | `PRAI_SITE_FORM/POM/` | 1 | VCARPOM |
| **PRC** | `PRAI_SITE_FORM/PRC/` | **23** | ECMRMDNF, KOSHER, MAM1-4, MER, MSP, NCFV, RSPO, TAF, VAR1, VAR1_SF, VAR2, VCAR, VCAR_SF, VCSR, VDR, VQA1, VQA2, VQA2_SF, VRF1, VRF2 |
| **PRD** | `PRAI_SITE_FORM/PRD/` | 11 | ASMR, CCP1, EPIR, PMD, PSMR, RMTC, SAM, SAM_SF, SAPMMM, SAPMMM_SF, STVF |
| **QA** | `PRAI_SITE_FORM/QA/` | **~120** | APISHIP, ASNHACCP1-5, BRD1-4, CC1-6, CCCAR, CEAR1-2, CIPR1-3, CRRF, CUSTQ1-2, DIR, DOR, FDM1-3, FFSM1-5, FLKRA, FLKRA2, GBMB1-2, GHSSDS*, GMP, GMP2, HAD, HAD2, HIA, HIA2, ICAR, IMSHALAL, IMSHALAL2, IMSQSHE, IOIEA, IRN, LTM, MLFG, MLFG2, MLR, MQP, NCR1-4, OFI, PAR, PMRR1-4, POM, PPR, PQP, PT, QAINFO, QP, SECDOC, SMF1-4, SOP, SRR, TQM1-3, VALIDATIONREPORT1-7, WI |
| **QC** | `PRAI_SITE_FORM/QC/` | **36** | CHEMSHERPA, COD, COI, ECMPDS, EMTRN, ISOOFI, ISORI_1-10, LABOOS, LABQMISO, LABSURVEY, LABSURVEY2, LABSURVEY3, LWR, MLE, MLE2, MLE3, NCRISO, PCQI, PQCAR, PQCAR_SF, PQCAR_SF2, PSC, QCINFO, QCNTR, QCPAR, RMAM, RNMR, STIR |
| **R&D** | `PRAI_SITE_FORM/R&D/` | 6 | NEWPRDREQ, NEWPRDREQ_SF, RNDDB, RNDDB_SF, RNDPRJ, RNDPRJ_SF |
| **SA** | `PRAI_SITE_FORM/SA/` | 1 | CARGO |
| **SEC** | `PRAI_SITE_FORM/SEC/` | 6 | CCTVPR, CSL, TCCI, TLCICAR, TPR, WT |
| **SHE** | `PRAI_SITE_FORM/SHE/` | **22** | 5SIR, EI, FEED, HIRADC, INSW, IPPE, RLOD, SDS, SHEAI, SHEARO, SHECP, SHED, SHEFAIC, SHEFAR, SHEGO, SHEIA, SHEICAR, SHEINFO, SHEIOC, SHEOFI, SHESR, SHETBR |
| **STR** | `PRAI_SITE_FORM/STR/` | 16 | ACMSTR, IFSSH, IMSI, MDNF, ODFM, SDCI, SIC, SIC_SF, SII, SII_SF, SII_SF2, SIROP, SIU, SLED, SRRI1, SRRI2, STIDS |
| **T&D** | `PRAI_SITE_FORM/T&D/` | 11 | AFT, ETA, ETA_SF, ITA, ITA_SF, OJT, PTE, TA, TB, TI, TNDP |
| **WH** | `PRAI_SITE_FORM/WH/` | 16 | CST, CVA, ECMPCR1-6, ISOTANK, MDINFO1, MDINFO2, PCR, QUOTATIONMD, SAPIAAF1, SAPIAAF2, SHIPMENT |

## Johor All Departments — PDF Inventory Summary

| Dept | Folder | PDF Count | Form Codes (from filenames) |
|------|--------|-----------|-----------------------------|
| **FN (Finance)** | `JOHOR_SITE_FORM/FN/` | 5 | PCNCAR, creditmgmt_Appendix_A, creditmgmt_Appendix_B, creditmgmt_Appendix_C, insclaim |
| **HR** | `JOHOR_SITE_FORM/HR/` | **~38** | PCNBkStf, cancomp, ContractorReg, TyphoidVacc, UniformReq, pcnjd, LateComing, manpowerReq, NightVisit, PCNOrgChart, AppTest (8 variants), SpVisit, workins, hostel, PCNTND (8 variants), PCNDriver, EmpUpPOC, empinfo, SecObsReport, TalentMgmt, fdreq, scrap |
| **IT** | `JOHOR_SITE_FORM/IT/` | 6 | HWInv_MSPNetworkPrinter, HWInv_Network, HWInv_NewInv, SAPDR_PanCen, SAPSLoc_External, SAPSLoc_Internal |
| **LOG** | `JOHOR_SITE_FORM/LOG/` | 3 | PanConShip, tankerinsp, FJBInsp |
| **Marketing** | `JOHOR_SITE_FORM/Marketing/` | 9 | PCChgOrd25, CRRF, ILC, CustDB, MKTVisit, PSNSamNote, PurRspo, CCCAR25, CustQuest25 |
| **MTN** | `JOHOR_SITE_FORM/MTN/` | 6 | pcnCal (3 files), PESP, PCNFAR, EnMS (3 files), aimbox, TPM |
| **PRC** | `JOHOR_SITE_FORM/PRC/` | **19** | kosher, PMDEC, AppMat, MER24, EOMkt, NewLinerReg, VdrChange, POcrf, VCAR, VendorAss, VenAudit (2 files), VCSR, VQA (2 files), vendorreg, swsi |
| **PRD** | `JOHOR_SITE_FORM/PRD/` | 14 | BHTAddition, DrawingRequest, FIICI, oprp_CCP (4 files), StockMemo (3 files), STCI (2 files), WSV, QCDatabase (3 files) |
| **Project** | `JOHOR_SITE_FORM/Project/` | 2 | PRJREQ, DrawingRequest |
| **QA** | `JOHOR_SITE_FORM/QA/` | **~90** | PCNFL (6 files), DataAnalyst (3 files), deptkrakpi, QEN (2 files), FoodManual (4 files), FDAssess, FoodSecManual (3 files + SF), FSS (3 files), PIMSSOP, PIMSWI, PCIMSQM (2 files), ICAR, PCLTM, PCMatQP, PanCenPQP (3 files), PCMSDS, PIoRN (2 files), PCMasterFilters, PCQltyRec, PCNCR (2 files), PCGenOFI, PanCenPAR, QACAR, PCNQAINFO, SDSPCNBM, PanCenSecDoc, PCNSNHManual (6 files + SF), validation (3 files), SiteMaster (3 files), PCMasterlistImp, PCPQ |
| **QC** | `JOHOR_SITE_FORM/QC/` | **~80** | PFAD, FJBInsp, PISOSOP (2 files), ISOManual (2 files), ISO17025Info (9 files), LabWkReq, pqcar (2 files), QASystAudit (2 files), QCInfo (2 files), QCPAR, RNMR, QCDatabase25 (3 files), Sensory, tankerinsp, MasterCalibration (3 files), OOSqc, speccode, PIMSSOP, PIMSWI, PCLTM, PanCenPQP (3 files), PCMatQP, PCPQ, SDS (2 files), MSDS, Retained, COI, Srvyfrm (3 files), PCNHAS (3 files) |
| **SHE** | `JOHOR_SITE_FORM/SHE/` | 7 | CMR, SDS, hsencr, HSE, SHERO, PIIR, PPE, LROR |
| **SlsAdmin** | `JOHOR_SITE_FORM/SlsAdmin/` | 3 | HCert, dbpay, ILC |
| **STR** | `JOHOR_SITE_FORM/STR/` | 6 | MatDisposal (2 files), mrfapp, returnables, StkItem, StoreIsp, SWaste |

## Path Reference

```powershell
# Format: source/pdf/pdf_form_hcl/hcl_form_pdf/{SITE}_SITE_FORM/{DEPT}/{FormCode}.pdf
# Penang IT example:
$penangIT = "source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT"
# e.g. "$penangIT/EAF.pdf"

# Penang HR example:
$penangHR = "source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR"
# e.g. "$penangHR/AWHR.pdf"

# Johor IT example:
$johorIT = "source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/IT"
# e.g. "$johorIT/1_HWInv_NewInv.pdf"

# Johor QA example:
$johorQA = "source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/QA"
# e.g. "$johorQA/1_PCNFL_Form_FT.pdf"

# Fallback extracted PDFs
$fallback = "source/Project Iventories/extracted-embedded-pdfs"
```
| 14 | SAPCA (Config Access) | `Penang/IT/` SAPCA PDFs | — | ✅ 16 fields | ✅ Resolved |
| 15 | SAPCR (Change Request) | `Penang/IT/` SAPCR PDFs | — | ✅ 54 fields | ✅ Resolved |
| 16 | SAPDRP (Disaster Recovery) | `Penang/IT/` SAPDRP PDFs | — | ✅ 5 fields | ✅ Resolved |
| 17 | SAPSLCF (Storage Location) | `Penang/IT/` SAPSLCF PDFs | — | ✅ 11 fields | ✅ Resolved |
| 18 | SAPSOF (Sign Off) | `Penang/IT/` SAPSOF PDFs | — | ⚠️ 385+ fields — in progress | ⚠️ Pending |
| 19 | SAPTR (Transport Request) | `Penang/IT/` SAPTR PDFs | — | ✅ 34 fields | ⚠️ Pending |
| 20 | UR (User Access) | `Penang/IT/` UR PDFs | — | ✅ Mapped from DXL | ✅ Resolved |

### Johor IT (6 PDFs)

| # | Form Name | PDF File Range | PDF Count | DXL Match | Reconciliation Status |
|---|---|---|---|---|---|
| 1 | HI (Hardware Inventory) | `Johor/IT/` HI PDFs | — | ✅ 60 fields (2 extra vs Penang) | ⚠️ Variance noted |
| 2 | SAPDRP (Disaster Recovery) | `Johor/IT/` SAPDRP PDFs | — | ✅ 5 fields | ✅ Resolved |
| 3 | SAPSLCF (Storage Location) | `Johor/IT/` SAPSLCF PDFs | — | ✅ 9 fields | ⚠️ Noted |

---

## UI Elements Inventory — Template

> **⚠️ NEEDS POPULATION**: For each form, inspect the PDF exports and document UI elements using the template below.
> Start with priority forms: EAF (28 PDFs), ITSSR, HI.

### Template: [Form Name]

**PDF File**: `[path/to/pdf-file.pdf]`
**Domino Form**: [FormName]

| UI Element | Domino Type | Label (from PDF) | Data Field (DXL) | Visible? | Required? | Notes |
|---|---|---|---|---|---|---|
| Text input | `text` | "User Name" | `UserName` | ✅ | ✅ | |
| Dropdown | `choice` | "Department" | `Department` | ✅ | ✅ | Choices: IT, HR, FIN... |
| Button | `button` | "Submit" | — | ✅ | — | Submits form |
| Computed | `computed` | "Request No" | `INONumber` | ✅ (display only) | — | Auto-generated |
| Section | `section` | "Approval" | — | ✅ | — | Tab/accordion |

---

## Form-Specific UI Details

### EAF (VPN/Citrix) — 28 PDFs Available

**Key UI Sections Identified from PDFs**:
1. **Requestor Section** — User field, Company, Country
2. **Request Details** — Justification, System, Type, Application
3. **Target User** — TargetUser, ClientID, Group
4. **Approval Section** — Dept Head, CC, routing options
5. **Status Section** — CurrentAction, status1-4, comments

**Button Actions Visible in PDF**:
| Button | Action | Domino Equivalent |
|--------|--------|-------------------|
| Submit | Send for Approval | @Command([FileSave]) + @MailSend |
| Approve | Approve request | status field update |
| Reject | Reject request | status field + email |
| Add Comment | Open comment dialog | @DialogBox |

### ITSSR (Support) — PDFs Available

**Key UI Sections**:
1. **Case Info** — CaseNo, INO, CreationDate
2. **Requestor Details** — ReportedBy, Department, Category
3. **Issue Description** — Description, Priority
4. **Assignment** — AssignedPIC, Status
5. **Resolution** — ResolvedAt, Resolution

### HI (Hardware Inventory) — PDFs Available

**Key UI Sections**:
1. **Asset Identity** — TagNo, AssetNo, SerialNo
2. **Hardware Specs** — ComputerType, CPU, RAM, HDD, Monitor
3. **User Assignment** — UsedBy, Department, Location
4. **Network** — IPAddress, MACAddress
5. **Purchase** — PurchaseDate, Vendor, PO_Number
6. **Audit** — LastAuditDate, Status

---

## Cross-Department PDFs

> **Note**: The extracted-embedded-pdfs folder contains PDFs for non-IT departments as well.
> These are not yet analyzed and are outside current migration scope until HR/other forms are added.

| Department | PDF Count | Status |
|------------|-----------|--------|
| IT (Penang) | 28 | ✅ Mapped to forms |
| IT (Johor) | 6 | ✅ Mapped to forms |
| HR (Penang) | — | ⬜ Not analyzed |
| HR (Johor) | — | ⬜ Not analyzed |
| Finance | — | ⬜ Not analyzed |
| Other Depts | — | ⬜ Not analyzed |
| **Total** | **1,171** | **⚠️ 34 IT PDFs mapped** |
