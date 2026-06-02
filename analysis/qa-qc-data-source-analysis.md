# QA & QC Departments — Data Source Analysis & SharePoint List Design Report

> **Generated**: 2026-05-31  
> **Analyst**: Domino → M365 Migration Agent  
> **Scope**: QA & QC Departments — Johor and Penang (Prai) sites  
> **Status**: ✅ Complete

---

## 1. Data Sources Overview

### 1.1 DXL/XML Source Files (Domino Schema)

| Site | Department | Location | Forms | Files |
|------|-----------|----------|-------|-------|
| **Johor QA** | QA | `source/dxl/XML_QA_Johor/` | 27 forms | 27 `*_dxl.xml` + 27 `*_inventory.txt` |
| **Penang QA** | QA | `source/dxl/XML_QA_Penang/` | — | **Empty folder** (no DXL available) |

> **Note**: No DXL/XML source files exist for Penang QA/QC or Johor QC. These departments rely on PDF UI exports and the master app inventory for requirements.

### 1.2 PDF UI Export Files

| Site | Department | Location | PDF Count |
|------|-----------|----------|-----------|
| **Johor QA** | QA | `JOHOR_SITE_FORM/QA/` | ~70 PDFs |
| **Johor QC** | QC | `JOHOR_SITE_FORM/QC/` | ~60 PDFs |
| **Penang QA** | QA | `PRAI_SITE_FORM/QA/` | ~105 PDFs |
| **Penang QC** | QC | `PRAI_SITE_FORM/QC/` | ~36 PDFs |

### 1.3 Master App Inventory

Referenced in: `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv`

---

## 2. Johor QA — Complete Form Inventory (DXL Sources)

| # | Form Code | Domino Database | Main Form(s) | Est. Fields | PDF Files |
|---|-----------|-----------------|--------------|-------------|-----------|
| 1 | **PCNFL** | Functional Team | Form_FT, ProcessFlow_FT | 661 | `1_PCNFL_Form_FT.pdf`, `1_PCNFL_Form_FTKRA.pdf`, `1_PCNFL_Form_FTKRA2.pdf`, `1_PCNFL_Form_HYP.pdf`, `1_PCNFL_Form_KZN2.pdf`, `1_PCNFL_Form_TPM.pdf` |
| 2 | **DataAnalyst** | Data Analysis & Self Inspection | DAForm, ReminderDA | 637 | `2_DataAnalyst_DAForm.pdf`, `2_DataAnalyst_SIForm2.pdf`, `2_DataAnalyst_SIPlan.pdf` |
| 3 | **deptkrakpi** | Departmental KRA/KPI | KRAKPI, DeptKRAKPI | 219 | `3_deptkrakpi.pdf` |
| 4 | **QEN** | Emergency & Product Recall Notification | QENoti, Reminder | 674 | `4_QEN_PRNoti.pdf`, `4_QEN_QENoti.pdf` |
| 5 | **PCNFoodManual** | Food & Feed Safety Manual | EnterComments9, EnterComments11 | 237 | `5_PCNFoodManual_necontrol.pdf`, `5_PCNFoodManual_newapp2.pdf`, `5_PCNFoodManual_newentry.pdf`, `5_PCNFoodManual_newverification.pdf` |
| 6 | **FDAssess** | Food Defence Assessment | FDAC, Guidelines | 165 | `6_FDAssess.pdf` |
| 7 | **FoodSecManual** | Food Defence Manual | EnterComments, DisplayCommentsOLD | 263 | `7_FoodSecManual_NewQM2.pdf`, `7_FoodSecManual_NewQualityManual.pdf`, `7_FoodSecManual_NewVerification.pdf` (3 variants) |
| 8 | **FSS** | Food Safety & GMP Survey | SVForm, Reminder | 183 | `8_FSS_IniExec.pdf`, `8_FSS_IniGMP.pdf`, `8_FSS_Initiator.pdf` |
| 9 | **PIMSSOP** | IMS - SOP | DisplayDHComments, EnterComments9 | 327 | `10_PIMSSOP.pdf` |
| 10 | **PIMSWI** | IMS - WI | DisplayDHComments, EnterComments9 | 386 | `11_PIMSWI.pdf` |
| 11 | **PCIMSQM** | IMS-Quality & SHE Manual | DisplayDHComments, EnterComments1 | 236 | `12_PCIMSQM_NewQM2.pdf`, `12_PCIMSQM_QM.pdf` |
| 12 | **PanCenICAR14** | Internal Corrective Action 2014-Current | Memo, ReviewMemo | 516 | `13_PanCenICAR14.pdf` |
| 13 | **PCLTM** | IQMS-LTM | DHComments, DisplayComments | 328 | `14_PCLTM.pdf` |
| 14 | **PCMatQP** | IQMS-QP (MatQP) | DisplayDHComments, EnterComments1 | 395 | `15_PCMatQP.pdf` |
| 15 | **PanCenPQP** | IQMS-PQP | DisplayDHComments, EnterComments1 | 387 | `16_PanCenPQP.pdf`, `16_PanCenPQP_SF1_newApprovalv5_Complex.pdf`, `16_PanCenPQP_SF2_Approval_Complex.pdf` |
| 16 | **PCMSDS** | IQMS-SDS | DHComments, DisplayComments | 306 | `18_PCMSDS.pdf` |
| 17 | **PIoRN** | Issuance of Records Number | record, DisRecord | 135 | `19_PIoRN_DisRecord2.pdf`, `19_PIoRN_recordV5.pdf` |
| 18 | **PCMasterFilters** | Masterlist of Filter/Glass & Brittle Materials | MasterList, EnterCommentsApp | 69 | `20_PCMasterFilters.pdf` |
| 19 | **PCQltyRec** | Masterlist of Records | Quality, Copy Of Quality | 107 | `21_PCQltyRec.pdf` |
| 20 | **PCNCR_IAReport** | NCR & Internal Audit Report | EnterComments, EnterDivComments | 577 | `22_PCNCR_IAReport.pdf`, `22_PCNCR_NewNCR5.pdf` |
| 21 | **PCGenOFI** | OFI Request | OFIRequestV1, CAMemo1 | 178 | `23_PCGenOFI.pdf` |
| 22 | **PanCenPAR** | Preventive Action Request | CAMemo2, CAMemo1 | 116 | `24_PanCenPAR.pdf` |
| 23 | **QACAR** | QA Audit Corrective Action Request | EnterComments, EnterDivComments | 193 | `25_QACAR.pdf` |
| 24 | **PCNQAINFO** | QA INFO CENTRE | QAInfo, Reminder | 92 | `27_PCNQAINFO.pdf` |
| 25 | **SDSPCNBM** | SDS (BM) | DisplayDHComments, EnterComments1 | 311 | `28_SDSPCNBM.pdf` |
| 26 | **PanCenSecDoc** | Secondary Document | New secdocument, NewDoc | 39 | `29_PanCenSecDoc.pdf` |
| 27 | **PCNSNHManual** | Soap Noodles HACCP Manual | DHComments, DisplayComments | 250 | `30_PCNSNHManual_newapp1.pdf`, `30_PCNSNHManual_newcontrol.pdf`, `30_PCNSNHManual_newentry.pdf`, `30_PCNSNHManual_newvalidation.pdf`, `30_PCNSNHManual_newverification.pdf` (6 variants) |

### Additional Johor QA (PDF-only, no DXL)

| # | App Name | PDF Files |
|---|----------|-----------|
| 28 | **Change Control Form** | — (blocked — no PDF) |
| 29 | **Validation Database** | `31_pcnvalidation.pdf`, `31_pcnvalidation_SF1_VT.pdf`, `31_pcnvalidation_SF2_VT2.pdf` |
| 30 | **Site Master** | `34_SiteMaster.pdf`, `34_SiteMaster_SF1_newApproval.pdf`, `34_SiteMaster_SF2_newApproval2.pdf` |
| 31 | **PCMasterlistImp** | `33_PCMasterlistImp.pdf` |
| 32 | **PCNFL_Form** (additional) | `9_PCNFL_Form_FT.pdf`, `9_PCNFL_Form_FTKRA.pdf`, `9_PCNFL_Form_FTKRA2.pdf`, `9_PCNFL_Form_HYP.pdf`, `9_PCNFL_Form_KZN.pdf`, `9_PCNFL_Form_TPM.pdf` |
| 33 | **PCPQ** | `17_PCPQ.pdf` |

---

## 3. Johor QC — Form Inventory (PDF only, no DXL)

| # | Form Code | App Name | PDF Files |
|---|-----------|----------|-----------|
| 1 | **PFAD** | Filter Paper PFAD Despatch | `1_PFAD.pdf` |
| 2 | **FJBInsp** | FJB Storage Tank Cleanliness Inspection | `2_FJBInsp.pdf` |
| 3 | **PISOSOP** | IMS SOP | `3_PISOSOP.pdf`, `3_PISOSOP_SF_RefDoc_Complex.pdf` |
| 4 | **ISOManual** | ISO 17025 Manual | `4_ISOManual_ISO.pdf`, `4_ISOManual_NewISO.pdf` |
| 5 | **PCNISO17025Info** | ISO/IEC17025 Related Info | `5_PCNISO17025Info_DSM.pdf`, `5_PCNISO17025Info_IA.pdf`, `5_PCNISO17025Info_IAPlan.pdf`, `5_PCNISO17025Info_MRReport.pdf`, `5_PCNISO17025Info_MV.pdf`, `5_PCNISO17025Info_Others.pdf`, `5_PCNISO17025Info_PT.pdf`, `5_PCNISO17025Info_Resources.pdf`, `5_PCNISO17025Info_TestMethod.pdf` (9 files) |
| 6 | **PCLabWkReq** | Lab Work Request | `6_PCLabWkReq.pdf` |
| 7 | **PanCenpqcar** | PQCAR | `7_PanCenpqcar.pdf`, `7_PanCenpqcar_SF_Verification_Complex.pdf` |
| 8 | **QASystAuditPC** | QA System Audit | `8_QASystAuditPC.pdf`, `9_QASystAuditPC.pdf` |
| 9 | **PCNQCInfo** | QC Info | `10_PCNQCInfo_QCInfo.pdf`, `10_PCNQCInfo_SAPInfo.pdf` |
| 10 | **QCPAR** | QC PAR | `11_QCPAR_POC.pdf` |
| 11 | **PCRNMR** | RNMR | `12_PCRNMR.pdf` |
| 12 | **QCDatabase25** | QC Chemical Preparation / Sampling Database | `13_QCDatabase25_PackIns.pdf`, `13_QCDatabase25_RequestAnalysis2.pdf`, `13_QCDatabase25_ScrapNotification.pdf` |
| 13 | **Sensory** | Sensory Evaluation Form | `14_Sensory.pdf` |
| 14 | **tankerinsp25** | Tanker Inspection | `15_tankerinsp25.pdf` |
| 15 | **MasterCalibration** | Master Calibration Record | `16_MasterCalibrationRecord_HisCard.pdf`, `16_MasterCalibrationRecord_Master.pdf`, `16_MasterCalibrationRecord_MasterNon.pdf` |
| 16 | **OOSqc** | OOS Report | `17_OOSqc.pdf` |
| 17 | **speccode** | Product Spec Code | `18_speccode.pdf` |
| 18 | **PIMSSOP** | IMS SOP (shared) | `19_PIMSSOP.pdf` |
| 19 | **PIMSWI** | IMS WI (shared) | `20_PIMSWI.pdf` |
| 20 | **PCLTM** | IQMS-LTM (shared) | `21_PCLTM.pdf` |
| 21 | **PancenPQP** | IQMS-PQP (shared) | `22_PancenPQP.pdf`, `22_PanCenPQP_SF1_newApproachv5_Complex.pdf`, `22_PanCenPQP_SF2_Approval_Complex.pdf` |
| 22 | **PCMatQP** | IQMS-QP (shared) | `23_PCMatQP.pdf` |
| 23 | **PCPQ** | IQMS-MQP (shared) | `24_PCPQ.pdf` |
| 24 | **SDSPCNBM** | SDS BM (shared) | `25_SDSPCNBM.pdf` |
| 25 | **PCMSDS** | IQMS-SDS (shared) | `26_PCMSDS.pdf` |
| 26 | **QCRetained** | Retained Samples Register | `27_QCRetained.pdf` |
| 27 | **PCOI** | OOS/Investigation | `28_PCOI.pdf` |
| 28 | **Srvyfrm** | Laboratory Customer Survey | `29_Srvyfrm_MKTForm.pdf`, `29_Srvyfrm_OTHERForm.pdf`, `29_Srvyfrm_PRODForm.pdf` |
| 29 | **PCNHAS** | Halal Assurance Management Manual | `30_PCNHAS_NewControl.pdf`, `30_PCNHAS_NewQM.pdf`, `30_PCNHAS_Quality_Manual.pdf` |

---

## 4. Penang (Prai) QA — Form Inventory (PDF only, no DXL)

| # | Form Code | App Name | PDF Files |
|---|-----------|----------|-----------|
| 1 | **APISHIP** | API Shipment (?) | `APISHIP.pdf` |
| 2 | **ASNHACCP** | ASN HACCP Manual | `ASNHACCP1.pdf`, `ASNHACCP1_SF.pdf`, `ASNHACCP2.pdf`, `ASNHACCP3.pdf`, `ASNHACCP4.pdf`, `ASNHACCP5.pdf` |
| 3 | **BRD** | Briefing Records Database | `BRD1.pdf`, `BRD1_SF.pdf`, `BRD2.pdf`, `BRD3.pdf`, `BRD4.pdf` |
| 4 | **CC** | Change Control Form (NEW) | `CC1.pdf`, `CC2.pdf`, `CC3.pdf`, `CC4.pdf`, `CC5.pdf`, `CC6.pdf` |
| 5 | **CCCAR** | CCCAR 2025 | `CCCAR.pdf` |
| 6 | **CEAR** | Customer/External Audit Reports | `CEAR1.pdf`, `CEAR2.pdf` |
| 7 | **CIPR** | CI Project Rewards | `CIPR1.pdf`, `CIPR1_SF.pdf`, `CIPR2.pdf`, `CIPR2_SF.pdf`, `CIPR3.pdf` |
| 8 | **CRRF** | Customer Requirement Review Form | `CRRF.pdf` |
| 9 | **CUSTQ** | Customer Questionnaire & Regulations 2025 | `CUSTQ1.pdf`, `CUSTQ2.pdf` |
| 10 | **DIR** | Deviation Investigation Report | `DIR.pdf` |
| 11 | **DOR** | Disposal of Records | `DOR.pdf` |
| 12 | **FDM** | Food Defense Manual (IOIOI) | `FDM1.pdf`, `FDM1_SF.pdf`, `FDM2.pdf`, `FDM3.pdf` |
| 13 | **FFSM** | Food/Feed Safety Manual | `FFSM1.pdf`, `FFSM1_SF.pdf`, `FFSM2.pdf`, `FFSM3.pdf`, `FFSM3_SF.pdf`, `FFSM4.pdf`, `FFSM5.pdf` |
| 14 | **FLKRA** | Functional Leaders KRA/KPI Report | `FLKRA.pdf`, `FLKRA2.pdf`, `FLKRA2_SF.pdf` |
| 15 | **GBMB** | GHS-SDS - BM | `GBMB.pdf`, `GBMB2.pdf` |
| 16 | **GHSSDSIOI** | GHS-SDS (IOIOI) | `GHSSDSIOI.pdf` |
| 17 | **GHSSDSNEW** | GHS-SDS (NEW) | `GHSSDSNEW.pdf` |
| 18 | **GMP** | GMP Inspection Report | `GMP.pdf`, `GMP2.pdf` |
| 19 | **HAD** | Halal Assurance Database | `HAD.pdf`, `HAD2.pdf` |
| 20 | **HIA** | Halal Internal Audit | `HIA.pdf`, `HIA2.pdf` |
| 21 | **ICAR** | Internal Corrective Action Request | `ICAR.pdf`, `ICAR_SF.pdf`, `ICAR_SF2.pdf` |
| 22 | **IMSHALAL** | IMS & Halal Minutes of Meeting | `IMSHALAL.pdf`, `IMSHALAL2.pdf` |
| 23 | **IMSQSHE** | IMS-Quality & SHE Manual (IOI) | `IMSQSHE.pdf`, `IMSQSHE2.pdf`, `IMSQSHE_SF.pdf` |
| 24 | **IOIEA** | IOI Oleo Excellent Achievement | `IOIEA.pdf` |
| 25 | **IRN** | Issuance of Records Number | `IRN.pdf` |
| 26 | **LTM** | IQMS-LTM (IOI) | `LTM.pdf`, `LTM_SF.pdf` |
| 27 | **MLFG** | Masterlist of Filter/Glass/Cleaning Agents & Chemicals | `MLFG.pdf`, `MLFG2.pdf`, `MLFG_SF.pdf` |
| 28 | **MLR** | Masterlist of Records | `MLR.pdf` |
| 29 | **MQP** | IQMS-MQP (IOI) | `MQP.pdf`, `MQP_SF.pdf` |
| 30 | **NCR** | NCR & Internal Audit Report | `NCR1.pdf`, `NCR2.pdf`, `NCR3.pdf`, `NCR4.pdf` |
| 31 | **OFI** | OFI Request | `OFI.pdf` |
| 32 | **PAR** | Preventive Action Request | `PAR.pdf`, `PAR_SF.pdf`, `PAR_SF2.pdf` |
| 33 | **PMRR** | PMRR (?) | `PMRR.pdf`, `PMRR2.pdf`, `PMRR3.pdf`, `PMRR4.pdf`, `PMRR_SF.pdf` |
| 34 | **POM** | IQMS-POM (IOI) | `POM.pdf`, `POM_SF.pdf` |
| 35 | **PPR** | IQMS-PPR (IOI) | `PPR.pdf`, `PPR_SF.pdf` |
| 36 | **PQP** | IQMS-PQP (IOI) | `PQP.pdf`, `PQP_SF.pdf` |
| 37 | **PT** | Proficiency Testing | `PT.pdf`, `PT_SF.pdf` |
| 38 | **QAINFO** | QA INFO | `QAINFO.pdf` |
| 39 | **QP** | IQMS-QP (IOI) | `QP.pdf`, `QP_SF.pdf` |
| 40 | **SECDOC** | Secondary Document | `SECDOC.pdf` |
| 41 | **SMF** | Site Master File | `SMF1.pdf`, `SMF2.pdf`, `SMF3.pdf`, `SMF4.pdf` |
| 42 | **SOP** | IMS - SOP (IOI) | `SOP.pdf`, `SOP_SF.pdf` |
| 43 | **SRR** | Statutory & Regulatory Register | `SRR.pdf` |
| 44 | **TQM** | Total Quality Management | `TQM1.pdf`, `TQM2.pdf`, `TQM3.pdf` |
| 45 | **VALIDATIONREPORT** | Validation Report | `VALIDATIONREPORT1.pdf`, `VALIDATIONREPORT1_SF.pdf`, `VALIDATIONREPORT2.pdf`, `VALIDATIONREPORT2_SF.pdf`, `VALIDATIONREPORT3.pdf`, `VALIDATIONREPORT4.pdf`, `VALIDATIONREPORT5.pdf`, `VALIDATIONREPORT6.pdf`, `VALIDATIONREPORT7.pdf` |
| 46 | **WI** | IMS-WI (IOI) | `WI.pdf`, `WI_SF.pdf` |

---

## 5. Penang (Prai) QC — Form Inventory (PDF only, no DXL)

| # | Form Code | App Name | PDF Files |
|---|-----------|----------|-----------|
| 1 | **CHEMSHERPA** | ChemSherpa | `CHEMSHERPA.pdf` |
| 2 | **COD** | COD (?) | `COD.pdf` |
| 3 | **COI** | COI (?) | `COI.pdf` |
| 4 | **ECMPDS** | ECM PDS | `ECMPDS.pdf` |
| 5 | **EMTRN** | EM Training | `EMTRN.pdf` |
| 6 | **ISOOFI** | ISO OFI | `ISOOFI.pdf` |
| 7 | **ISORI** | ISO RI | `ISORI_1.pdf` through `ISORI_10.pdf` (10 files) |
| 8 | **LABOOS** | Lab OOS | `LABOOS.pdf` |
| 9 | **LABQMISO** | Lab QM ISO | `LABQMISO.pdf` |
| 10 | **LABSURVEY** | Lab Survey | `LABSURVEY.pdf`, `LABSURVEY2.pdf`, `LABSURVEY3.pdf` |
| 11 | **LWR** | Lab Work Request | `LWR.pdf` |
| 12 | **MLE** | Master List of Equipment | `MLE.pdf`, `MLE2.pdf`, `MLE3.pdf` |
| 13 | **NCRISO** | NCR ISO | `NCRISO.pdf` |
| 14 | **PCQI** | PCQI | `PCQI.pdf` |
| 15 | **PQCAR** | PQCAR | `PQCAR.pdf`, `PQCAR_SF.pdf`, `PQCAR_SF2.pdf` |
| 16 | **PSC** | Product Spec Code | `PSC.pdf` |
| 17 | **QCINFO** | QC Info | `QCINFO.pdf` |
| 18 | **QCNTR** | QC NTR | `QCNTR.pdf` |
| 19 | **QCPAR** | QC PAR | `QCPAR.pdf` |
| 20 | **RMAM** | RMAM | `RMAM.pdf` |
| 21 | **RNMR** | RNMR | `RNMR.pdf` |
| 22 | **STIR** | STIR | `STIR.pdf` |

---

## 6. Functional Categorization

### Category A: Quality Management System (IMS) Documents (14 forms)
These are document management systems for ISO/IATF quality manuals, SOPs, work instructions:

| Form Code | Site | Description |
|-----------|------|-------------|
| PIMSSOP | Johor QA, Johor QC | IMS - SOP |
| PIMSWI | Johor QA, Johor QC | IMS - WI |
| PCIMSQM | Johor QA | IMS-Quality & SHE Manual |
| PCLTM | Johor QA, Johor QC | IQMS-LTM (List of Training Materials) |
| PCMatQP | Johor QA, Johor QC | IQMS-QP (Quality Procedure) |
| PanCenPQP | Johor QA, Johor QC | IQMS-PQP (Plant Quality Procedure) |
| PCMSDS | Johor QA, Johor QC | IQMS-SDS (Safety Data Sheet) |
| SDSPCNBM | Johor QA, Johor QC | SDS (BM) |
| PanCenSecDoc | Johor QA | Secondary Document |
| PCNSNHManual | Johor QA | Soap Noodles HACCP Manual |
| PCNFoodManual | Johor QA | Food & Feed Safety Manual |
| FoodSecManual | Johor QA | Food Defence Manual |
| PCNFoodManual | Johor QA | Food & Feed Safety Manual |
| IMSQSHE | Penang QA | IMS-Quality & SHE Manual (IOI) |
| SOP | Penang QA | IMS - SOP (IOI) |
| WI | Penang QA | IMS-WI (IOI) |
| LTM | Penang QA | IQMS-LTM (IOI) |
| MQP | Penang QA | IQMS-MQP (IOI) |
| PQP | Penang QA | IQMS-PQP (IOI) |
| POM | Penang QA | IQMS-POM (IOI) |
| PPR | Penang QA | IQMS-PPR (IOI) |
| QP | Penang QA | IQMS-QP (IOI) |
| SMF | Penang QA | Site Master File |
| FFSM | Penang QA | Food/Feed Safety Manual |
| FDM | Penang QA | Food Defense Manual (IOIOI) |
| ASNHACCP | Penang QA | ASN HACCP Manual |

### Category B: Corrective Actions & Non-Conformance (8 forms)
| Form Code | Site | Description |
|-----------|------|-------------|
| PanCenICAR14 | Johor QA | Internal Corrective Action |
| PCNCR_IAReport | Johor QA | NCR & Internal Audit Report |
| PCGenOFI | Johor QA | OFI Request |
| PanCenPAR | Johor QA | Preventive Action Request |
| QACAR | Johor QA | QA Audit Corrective Action Request |
| ICAR | Penang QA | Internal Corrective Action Request |
| NCR | Penang QA | NCR & Internal Audit Report |
| OFI | Penang QA | OFI Request |
| PAR | Penang QA | Preventive Action Request |
| ISOOFI | Penang QC | ISO OFI |

### Category C: Quality Records & Master Lists (8 forms)
| Form Code | Site | Description |
|-----------|------|-------------|
| PIoRN | Johor QA | Issuance of Records Number |
| PCMasterFilters | Johor QA | Masterlist of Filter/Glass & Brittle Materials |
| PCQltyRec | Johor QA | Masterlist of Records |
| PCNQAINFO | Johor QA | QA INFO CENTRE |
| deptkrakpi | Johor QA | Departmental KRA/KPI |
| PCNFL | Johor QA | Functional Team |
| MLFG | Penang QA | Masterlist of Filter/Glass/Cleaning Agents & Chemicals |
| MLR | Penang QA | Masterlist of Records |
| QAINFO | Penang QA | QA INFO |
| FLKRA | Penang QA | Functional Leaders KRA/KPI Report |
| BRD | Penang QA | Briefing Records Database |
| IRN | Penang QA | Issuance of Records Number |

### Category D: QC Laboratory (12 forms)
| Form Code | Site | Description |
|-----------|------|-------------|
| PCNISO17025Info | Johor QC | ISO/IEC17025 Related Info |
| PCLabWkReq | Johor QC | Lab Work Request |
| PanCenpqcar | Johor QC | PQCAR |
| QASystAuditPC | Johor QC | QA System Audit |
| PCNQCInfo | Johor QC | QC Info |
| QCPAR | Johor QC | QC PAR |
| PCRNMR | Johor QC | RNMR |
| QCDatabase25 | Johor QC | QC Chemical Preparation / Sampling |
| Sensory | Johor QC | Sensory Evaluation Form |
| MasterCalibration | Johor QC | Master Calibration Record |
| OOSqc | Johor QC | OOS Report |
| speccode | Johor QC | Product Spec Code |
| LABOOS | Penang QC | Lab OOS |
| LABQMISO | Penang QC | Lab QM ISO |
| LABSURVEY | Penang QC | Lab Survey |
| LWR | Penang QC | Lab Work Request |
| MLE | Penang QC | Master List of Equipment |
| NCRISO | Penang QC | NCR ISO |
| PCQI | Penang QC | PCQI |
| PQCAR | Penang QC | PQCAR |
| QCINFO | Penang QC | QC Info |
| RNMR | Penang QC | RNMR |

### Category E: Assessment & Audit (6 forms)
| Form Code | Site | Description |
|-----------|------|-------------|
| DataAnalyst | Johor QA | Data Analysis & Self Inspection |
| FDAssess | Johor QA | Food Defence Assessment |
| FSS | Johor QA | Food Safety & GMP Survey |
| QEN | Johor QA | Emergency & Product Recall Notification |
| GMP | Penang QA | GMP Inspection Report |
| HIA | Penang QA | Halal Internal Audit |
| CEAR | Penang QA | Customer/External Audit Reports |

### Category F: Product Quality (8 forms)
| Form Code | Site | Description |
|-----------|------|-------------|
| PFAD | Johor QC | Filter Paper PFAD Despatch |
| FJBInsp | Johor QC | FJB Storage Tank Cleanliness Inspection |
| tankerinsp25 | Johor QC | Tanker Inspection |
| PCOI | Johor QC | OOS/Investigation |
| QCRetained | Johor QC | Retained Samples Register |
| CCCAR | Penang QA | CCCAR 2025 |
| CRRF | Penang QA | Customer Requirement Review Form |
| CUSTQ | Penang QA | Customer Questionnaire & Regulations 2025 |
| DIR | Penang QA | Deviation Investigation Report |
| DOR | Penang QA | Disposal of Records |
| TQM | Penang QA | Total Quality Management |

### Category G: Halal & Certification (5 forms)
| Form Code | Site | Description |
|-----------|------|-------------|
| PCNHAS | Johor QC | Halal Assurance Management Manual |
| HAD | Penang QA | Halal Assurance Database |
| IMSHALAL | Penang QA | IMS & Halal Minutes of Meeting |
| GBMB | Penang QA | GHS-SDS - BM |
| GHSSDSIOI | Penang QA | GHS-SDS (IOIOI) |

### Category H: Change Control & Validation (4 forms)
| Form Code | Site | Description |
|-----------|------|-------------|
| CC | Penang QA | Change Control Form |
| VALIDATIONREPORT | Penang QA | Validation Report |
| PCMasterFilters | Johor QA | Masterlist of Filter/Glass & Brittle Materials |
| PCNSNHManual | Johor QA | Soap Noodles HACCP Manual (validation sub-forms) |

---

## 7. SharePoint List Architecture Design

### 7.1 Architecture Pattern

Following the same pattern as IT and HR departments:

```
SharePoint Site: IOI-App_Admin_Sites
│
├── [Main] MainDB_QA_JHR (Johor QA)       ← ⬜ NEW — All Johor QA forms, FormCode discriminator
├── [Main] MainDB_QC_JHR (Johor QC)       ← ⬜ NEW — All Johor QC forms, FormCode discriminator
├── [Main] MainDB_QA (Prai/Penang QA)     ← ⬜ NEW — All Penang QA forms, FormCode discriminator
├── [Main] MainDB_QC (Prai/Penang QC)     ← ⬜ NEW — All Penang QC forms, FormCode discriminator
│
├── [Ext]  MainDB_QA_Ext_IMS              ← ⬜ NEW — IMS document management forms
├── [Ext]  MainDB_QA_Ext_CAPA             ← ⬜ NEW — Corrective actions, NCR, OFI, PAR
├── [Ext]  MainDB_QA_Ext_Records          ← ⬜ NEW — Master lists, records, QA info
├── [Ext]  MainDB_QC_Ext_Lab              ← ⬜ NEW — Laboratory management forms
├── [Ext]  MainDB_QA_Ext_Assessment       ← ⬜ NEW — Assessment, audit, survey forms
├── [Ext]  MainDB_QA_Ext_Product          ← ⬜ NEW — Product quality forms
├── [Ext]  MainDB_QA_Ext_HalalCert        ← ⬜ NEW — Halal, certification, SDS
├── [Ext]  MainDB_QA_Ext_ChangeControl    ← ⬜ NEW — Change control, validation
│
├── [Config] Config_Companies             ← ⬜ PENDING — Company reference (shared)
├── [Config] Config_Departments           ← ⬜ PENDING — Department reference (shared)
├── [Config] Config_EmployeeDirectory     ← ⬜ PENDING — Employee lookup (shared)
├── [Config] Config_DocumentTypes         ← ⬜ PENDING — Document type reference for IMS
│
└── [Other] MainDB_IT (exists), MainDB_HR (exists), MainDB_FIN, MainDB_PRD, MainDB_SHE, MainDB_STR  ← ⬜ PENDING
```

### 7.2 Rationale

| Decision | Reason |
|----------|--------|
| **Four main lists** (QA_JHR, QC_JHR, QA, QC) | QA and QC are distinct departments with separate forms; Johor and Penang have different form sets |
| **FormCode discriminator** | Same pattern as IT/HR |
| **DXL available only for Johor QA** (27 forms) | Penang QA/QC and Johor QC have PDF-only evidence — field mapping will be derived from PDF UI analysis |
| **Many shared IMS forms** across Johor QA/QC | Forms like PIMSSOP, PCLTM, PCMatQP, PanCenPQP, PCMSDS, SDSPCNBM appear in both QA and QC — these can use the same FormCode |
| **Extension lists per category** | 8 extension lists cover the 8 functional categories |

### 7.3 Cross-Site / Cross-Dept Overlap

| Form Family | Johor QA | Johor QC | Penang QA | Merge Strategy |
|-------------|----------|----------|-----------|----------------|
| IMS SOP | PIMSSOP | PIMSSOP | SOP | Same FormCode `SOP`, site discriminator |
| IMS WI | PIMSWI | PIMSWI | WI | Same FormCode `WI`, site discriminator |
| IQMS-LTM | PCLTM | PCLTM | LTM | Same FormCode `LTM`, site discriminator |
| IQMS-QP | PCMatQP | PCMatQP | QP | Different FormCodes: `QP_JHR` vs `QP` |
| IQMS-PQP | PanCenPQP | PancenPQP | PQP | Same FormCode `PQP`, site discriminator |
| IQMS-SDS | PCMSDS | PCMSDS | — | Same FormCode `SDS`, site discriminator |
| SDS (BM) | SDSPCNBM | SDSPCNBM | GBMB | Different FormCodes |
| NCR | PCNCR_IAReport | — | NCR | Same concept, different FormCodes |
| ICAR | PanCenICAR14 | — | ICAR | Same concept, different FormCodes |
| OFI | PCGenOFI | — | OFI | Same concept, different FormCodes |
| PAR | PanCenPAR | — | PAR | Same concept, different FormCodes |
| QA Info | PCNQAINFO | — | QAINFO | Same FormCode `QAINFO` |
| Secondary Doc | PanCenSecDoc | — | SECDOC | Same FormCode `SECDOC` |

---

## 8. MainDB_QA_JHR — Core Columns Design

### 8.1 Core Columns (All Forms)

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line | ✅ | Auto-generated display name |
| **FormCode** | Choice | ✅ | **Discriminator**: PCNFL, DataAnalyst, deptkrakpi, QEN, PCNFoodManual, FDAssess, FoodSecManual, FSS, PIMSSOP, PIMSWI, PCIMSQM, PanCenICAR14, PCLTM, PCMatQP, PanCenPQP, PCMSDS, PIoRN, PCMasterFilters, PCQltyRec, PCNCR_IAReport, PCGenOFI, PanCenPAR, QACAR, PCNQAINFO, SDSPCNBM, PanCenSecDoc, PCNSNHManual |
| **CurrentStatus** | Choice | ✅ | Draft / Submitted / HOD Review / QA Review / Completed / Rejected |
| **Site** | Choice | ✅ | Johor |
| **DocumentNo** | Single line | ✅ | Document number (from INO agent) |
| **DocumentTitle** | Single line | ✅ | Document title |
| **DocumentType** | Choice | ✅ | SOP / WI / QM / QP / PQP / SDS / LTM / Form / Record / Report / Manual |
| **Department** | Choice | ✅ | QA / QC |
| **SubmittedBy** | Person/Group | ✅ | Current user |
| **SubmittedDate** | Date/Time | ✅ | `=Now` |
| **ReviewedBy** | Person/Group | — | Reviewer |
| **ReviewDate** | Date/Time | — | Review date |
| **ApprovedBy** | Person/Group | — | Approver |
| **ApprovalDate** | Date/Time | — | Approval date |
| **EffectiveDate** | Date/Time | — | Effective date |
| **RevisionNo** | Single line | — | Revision number |
| **Remarks** | Multiple lines | — | General remarks |
| **IsLocked** | Boolean | — | Lock flag |
| **WorkflowStage** | Number | — | Current workflow stage (1-5) |
| **EnvironmentTag** | Choice | — | Production / UAT / Development |

---

## 9. Implementation Priority

| Priority | List | Forms | Complexity | DXL Source |
|----------|------|-------|------------|------------|
| 🔴 P1 | **MainDB_QA_JHR** | 27 Johor QA forms | High | ✅ Full DXL |
| 🔴 P1 | **MainDB_QC_JHR** | 29 Johor QC forms | Medium | ❌ PDF only |
| 🟡 P2 | **MainDB_QA** | 46 Penang QA forms | High | ❌ PDF only |
| 🟡 P2 | **MainDB_QC** | 22 Penang QC forms | Medium | ❌ PDF only |
| 🟡 P2 | **Ext_IMS** | SOP, WI, QM, LTM, QP, PQP, SDS, Manuals | High | ✅ Partial |
| 🟡 P2 | **Ext_CAPA** | ICAR, NCR, OFI, PAR, QACAR, FSS | Medium | ✅ Partial |
| 🟢 P3 | **Ext_Records** | Master lists, QA Info, KRA/KPI, Functional Team | Medium | ✅ Partial |
| 🟢 P3 | **Ext_Lab** | QC Lab forms, Calibration, Sensory, Spec Codes | Medium | ❌ PDF only |
| 🟢 P3 | **Ext_Assessment** | Data Analysis, Food Defence, GMP Survey | Medium | ✅ Partial |
| 🔵 P4 | **Ext_Product** | Tanker Inspection, PFAD, CCCAR, CRRF, DIR | Low | ❌ PDF only |
| 🔵 P4 | **Ext_HalalCert** | Halal, SDS, Certification | Low | ❌ PDF only |
| 🔵 P4 | **Ext_ChangeControl** | Change Control, Validation | Low | ❌ PDF only |

### Key Recommendations

1. **Start with MainDB_QA_JHR** — has the richest DXL source data (27 forms with full field definitions)
2. **Leverage shared IMS forms** — many forms (SOP, WI, LTM, PQP, SDS) appear across QA and QC at both sites; use shared FormCodes with Site discriminator
3. **PDF-only forms need UI analysis** — for Penang QA/QC and Johor QC, field mapping must be derived from PDF screenshots since no DXL is available
4. **Document-centric design** — QA/QC forms are primarily document management systems (SOPs, manuals, records) rather than workflow requests, so the SharePoint list design should emphasize document metadata (document number, revision, effective date, document type)
5. **Consider content types** — SharePoint content types (SOP Document, Quality Record, CAPA Record, Lab Report) may be more appropriate than a flat list for document-heavy departments
