# LOG, PRD, MTN — PDF Source Analysis

> **Generated**: 2026-06-01
> **Source**: HCL PDF exports + `master_app_data_still_needed.csv`
> **Scope**: Prai (Penang) + Johor (PanCen) sites

---

## 1. LOG (Logistics) — Form Inventory

### Prai (Penang) — 15 PDFs, ~7 apps

| App Name | PDF File(s) | Form Name(s) in CSV | Readiness | Est. Fields |
|---|---|---|---|---|
| Forklift/Reach Truck Club Database 2025 | FORKLIFT1.pdf, FORKLIFT2.pdf, FORKLIFT3.pdf, FORKLIFT4.pdf | NewForm | Ready for build | ~15 |
| ECM Forklift Breakdown Notification | ECMFORKLIFT.pdf | NewForm | Ready for build | ~10 |
| Tanker POD, Overnight Unloading & Seal Problematic | POD.pdf | — | Blocked (no path) | ~12 |
| Tanker Washing, Inspection & Leak Test Notification | TANKERWASH1.pdf, TANKERWASH2.pdf, TANKERWASH3.pdf | WCC_T, WCC_C, POD3, TWN, TMI2, TLT | Review required | ~20 |
| Tanker & Container Weekly Counter Check | WCC1.pdf, WCC2.pdf | LicAss | Review required | ~15 |
| Shunting Truck Service Records | SHUNTINGTRUCK1.pdf, SHUNTINGTRUCK2.pdf, SHUNTINGTRUCK3.pdf | IssueLog, STSR, STSR SAVE, LICSR | Review required | ~18 |
| IMDG Inspection Checklist | IMDG.pdf | InsReport, IMDG | Ready for build | ~12 |

### Johor (PanCen) — 3 PDFs, ~3 apps

| App Name | PDF File(s) | Form Name(s) in CSV | Readiness | Est. Fields |
|---|---|---|---|---|
| Pancen - Tanker Inspection | 2_tankerinsp25.pdf | frmTanker | Ready for build | ~15 |
| PanCen - Container Shipment Database | 1_PanConShip.pdf | Main_Form | Ready for build | ~20 |
| Pancen - FJB Storage Tank Cleanliness Inspection | 3_FJBInsp.pdf | frmFJB, ISO | Review required | ~12 |

### Common LOG Form Patterns
- Equipment/vehicle identification (Forklift No, Truck No, Tanker No, Container No)
- Inspection/checklist fields (date, time, inspector, findings, status)
- Maintenance/breakdown tracking (reported date, issue description, resolution)
- Approval/sign-off fields

---

## 2. PRD (Production) — Form Inventory

### Prai (Penang) — 11 PDFs, ~6 apps

| App Name | PDF File(s) | Form Name(s) in CSV | Readiness | Est. Fields |
|---|---|---|---|---|
| Equipment Pre-Inspection Report | EPIR.pdf | EPI, Report | Ready for build | ~15 |
| SAP Material Master Maintenance Request | SAPMMM.pdf, SAPMMM_SF.pdf | NewMatFormV1 | Review required | ~20 |
| Stock Allocation Memo (SAM) | SAM.pdf, SAM_SF.pdf | — | Blocked (no path) | ~15 |
| CCP1 Filter Inspection Findings | CCP1.pdf | CCP2 | Ready for build | ~12 |
| Storage Tank Verification Form | STVF.pdf | NewSAM, NewForm | Review required | ~18 |
| Additional PDFs: ASMR.pdf, PMD.pdf, PSMR.pdf, RMTC.pdf | — | — | Review required | ~10-15 each |

### Johor (PanCen) — 16 PDFs, ~7 apps

| App Name | PDF File(s) | Form Name(s) in CSV | Readiness | Est. Fields |
|---|---|---|---|---|
| PanCen - TPM Database | 8_QCDatabase25_PackIns.pdf, 8_QCDatabase25_RequestAnalysis2.pdf, 8_QCDatabase25_ScrapNotification.pdf, 5_PCStockMemo_PSNSAMv1.pdf | PSNSAMv1, PackIns, RequestAnalysis2, ScrapNotification | Review required | ~25 |
| PanCen - BHT Addition Database | 1_BHTAddition.pdf | BHT | Review required | ~12 |
| PanCen - Filter Cloth Replacement Record | (no PDF filename match) | NewFilterCloth | Ready for build | ~10 |
| PanCen - OPRP/CCP Filter Inspection Record | 4_oprp_CCP.pdf, 4_oprp_CCPForm.pdf, 4_oprp_Form.pdf, 4_oprp_GOPRPForm.pdf | CCP, CCPForm, Form, GOPRPForm | Ready for build | ~15 |
| PanCen - Stock Allocation Memo | 5_PCStockMemo_PCEOSAM.pdf, 5_PCStockMemo_PCOCSAM.pdf | — | Blocked (no path) | ~12 |
| PanCen - Storage Tank Cleaning Inspection | 6_STCI_NewEntry.pdf, 6_STCI_PCEOUpdatedEntry2.pdf | NewEntry | Ready for build | ~15 |
| PanCen - Weighing Scale Verification | 7_WSV.pdf | PCOCSAM, NewEntry | Review required | ~10 |
| PanCen - Drawing Request | 2_DrawingRequest.pdf | frmDrawing2 | Ready for build | ~10 |
| PanCen - FIICI | 3_FIICI.pdf | — | Review required | ~12 |

### Common PRD Form Patterns
- Product/Batch identification (Product Code, Batch No, Tank No)
- Production inspection parameters (CCP, OPRP, temperature, pressure)
- Material/stock tracking (material code, quantity MT, allocation)
- Quality control sign-off (QC status, inspector, date)
- SAP system references (material master, storage location)

---

## 3. MTN (Maintenance) — Form Inventory

### Prai (Penang) — 9 PDFs, ~5 apps

| App Name | PDF File(s) | Form Name(s) in CSV | Readiness | Est. Fields |
|---|---|---|---|---|
| Failure Analysis Report | FAR.pdf | QM, FAR | Review required | ~15 |
| Maintenance Plan | MTNPLAN1.pdf, MTNPLAN2.pdf | MPForm | Review required | ~20 |
| MTN Emergency Change Procedure | MTNEMGNCY.pdf | changeMinorV1 | Ready for build | ~12 |
| Equipment Pre-Inspection Report | EQUIPPREINS.pdf | EPI, Report | Ready for build | ~15 |
| Plant Maintenance Documentation | PLANTMTN.pdf | AR, FormDoc | Review required | ~18 |
| Additional PDFs: EE.pdf, ENMS1.pdf, ENMS2.pdf | — | — | Review required | ~10 each |

### Johor (PanCen) — 10 PDFs, ~2 apps

| App Name | PDF File(s) | Form Name(s) in CSV | Readiness | Est. Fields |
|---|---|---|---|---|
| Pancen Failure Analysis Report | 3_PCNFAR.pdf, 1_pcnCal_FrmJust.pdf | FrmJust, FARv3 | Review required | ~15 |
| PanCen - Energy Management System (EnMS) | 4_EnMS_NewQM.pdf, 4_EnMS_NewQM_SF_Approval_Complex.pdf, 4_EnMS_QM.pdf | — | Blocked (no path) | ~20 |
| PanCen - E&I Calibration Database | 1_pcnCal_FrmCal.pdf, 1_pcnCal_FrmEqp.pdf | FrmCal, FrmEqp | Ready for build | ~15 |
| Additional PDFs: 2_PESP.pdf, 5_aimbox.pdf, 6_TPM.pdf | — | — | Review required | ~10 each |

### Common MTN Form Patterns
- Equipment/asset identification (Equipment No, Asset Tag, Location)
- Maintenance type (Preventive/Corrective/Emergency)
- Failure/issue description (fault code, symptoms, root cause)
- Maintenance schedule (planned date, actual date, frequency)
- Calibration records (instrument ID, calibration date, due date, result)
- Energy management (EnMS parameters, QM targets)

---

## 4. Cross-Department Form Overlaps

| Form Type | Departments | Notes |
|---|---|---|
| Equipment Pre-Inspection Report | MTN (Prai), PRD (Prai) | Same EPI form, dual department assignment |
| FAR (Failure Analysis Report) | MTN (Prai + Johor) | Common across both sites |
| Tanker/Storage Tank Inspection | LOG (Prai + Johor), PRD (Johor) | Related inspection workflows |
| EnMS (Energy Management) | MTN (Prai + Johor) | Environmental parameters |

---

## 5. PDF Source Path Summary

| Site | Department | PDF Path | Count |
|---|---|---|---|
| Prai | LOG | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/LOG/` | 15 |
| Prai | PRD | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/PRD/` | 11 |
| Prai | MTN | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/MTN/` | 9 |
| Johor | LOG | `source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/LOG/` | 3 |
| Johor | PRD | `source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/PRD/` | 16 |
| Johor | MTN | `source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/MTN/` | 10 |
| **Total** | | | **64** |
