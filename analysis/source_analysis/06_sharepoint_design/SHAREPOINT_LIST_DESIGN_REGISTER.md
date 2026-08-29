# SharePoint List Design Register

> SharePoint parent, child, and extension-list design register for every form already extracted from PDF.
> Generated: 2026-06-02 21:59
> Source: promoted PDF requirement files under `analysis/source_analysis/02_extracted_requirements/`.

## Summary

| Department | Module | Forms | Rows |
|---|---|---:|---:|
| FIN | Finance - Capital Approval | 1 | 1 |
| FIN | Finance - Credit Management | 3 | 4 |
| FIN | Finance - Expenditure Approval | 1 | 2 |
| FIN | Finance - Service Entry | 1 | 1 |
| HR | HR - Applications Support | 1 | 1 |
| HR | HR - Attendance | 1 | 1 |
| HR | HR - Cafeteria | 1 | 1 |
| HR | HR - Contract | 1 | 3 |
| HR | HR - Duty Roster | 1 | 1 |
| HR | HR - Employee Data | 1 | 1 |
| HR | HR - Employee Health | 1 | 1 |
| HR | HR - Exit | 1 | 1 |
| HR | HR - Foreign Worker | 2 | 3 |
| HR | HR - Gift/Donation/Sponsorship | 1 | 1 |
| HR | HR - Information | 1 | 1 |
| HR | HR - Survey | 1 | 1 |
| HR | HR - Workforce | 2 | 2 |
| IT | IT - Access | 1 | 2 |
| IT | IT - Activity Logs | 4 | 4 |
| IT | IT - Asset Inventory | 1 | 2 |

## FIN / Finance - Capital Approval

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-FIN-CAR-PARENT | SRC-FIN-001 | CAR | `MainDB_FIN` | Parent | 42 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## FIN / Finance - Credit Management

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-FIN-CMF_A-PARENT | SRC-FIN-002 | CMF_A | `MainDB_FIN` | Parent | 25 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-FIN-CMF_B-PARENT | SRC-FIN-003 | CMF_B | `MainDB_FIN` | Parent | 25 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-FIN-CMF_C-PARENT | SRC-FIN-004 | CMF_C | `MainDB_FIN` | Parent | 22 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-FIN-CMF_C-CHILD | SRC-FIN-004 | CMF_C | `MainDB_FIN_Ext_CMF_C` | Child/Extension | 1 | Repeating rows, attachments, workflow history, or processing sections from requirement evidence | Confirm child-list need before provisioning if rows are fixed-count in source PDF |

## FIN / Finance - Expenditure Approval

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-FIN-EARF-PARENT | SRC-FIN-005 | EARF | `MainDB_FIN` | Parent | 32 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-FIN-EARF-CHILD | SRC-FIN-005 | EARF | `MainDB_FIN_Ext_EARF` | Child/Extension | 2 | Repeating rows, attachments, workflow history, or processing sections from requirement evidence | Confirm child-list need before provisioning if rows are fixed-count in source PDF |

## FIN / Finance - Service Entry

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-FIN-RSES-PARENT | SRC-FIN-006 | RSES | `MainDB_FIN` | Parent | 18 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Applications Support

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-HRAPR-PARENT | SRC-HR-015 | HRAPR | `MainDB_HR` | Parent | 32 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Attendance

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-AWHR-PARENT | SRC-HR-002 | AWHR | `MainDB_HR` | Parent | 47 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Cafeteria

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-CIR-PARENT | SRC-HR-003 | CIR | `MainDB_HR` | Parent | 22 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Contract

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-FTCR-PARENT | SRC-HR-010 | FTCR | `MainDB_HR` | Parent | 42 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-HR-FTCR-CHILD | SRC-HR-010 | FTCR | `MainDB_HR_Ext_FTCR_BackgroundHistory` if the 10 background-history rows should be flexible` | Child/Extension | Needs sizing | Repeating rows, attachments, workflow history, or processing sections from requirement evidence | Confirm child-list need before provisioning if rows are fixed-count in source PDF |
| SHD-HR-FTCR-CHILD | SRC-HR-010 | FTCR | `otherwise fixed row columns can remain on the parent/extension form storage` | Child/Extension | Needs sizing | Repeating rows, attachments, workflow history, or processing sections from requirement evidence | Confirm child-list need before provisioning if rows are fixed-count in source PDF |

## HR / HR - Duty Roster

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-DRD-PARENT | SRC-HR-005 | DRD | `MainDB_HR` | Parent | 35 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Employee Data

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-EPDU-PARENT | SRC-HR-007 | EPDU | `MainDB_HR` | Parent | 35 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Employee Health

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-EPHR-PARENT | SRC-HR-008 | EPHR | `MainDB_HR` | Parent | 21 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Exit

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-EEN-PARENT | SRC-HR-006 | EEN | `MainDB_HR` | Parent | 64 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Foreign Worker

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-FWWPD-PARENT | SRC-HR-011 | FWWPD | `MainDB_HR` | Parent | 24 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-HR-FWWPD-CHILD | SRC-HR-011 | FWWPD | `- `MainDB_HR_Ext_FWWPD_Insurance` | Child/Extension | Needs sizing | Repeating rows, attachments, workflow history, or processing sections from requirement evidence | Confirm child-list need before provisioning if rows are fixed-count in source PDF |
| SHD-HR-FWWPE-PARENT | SRC-HR-012 | FWWPE | `MainDB_HR` | Parent | 47 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Gift/Donation/Sponsorship

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-GDSN-PARENT | SRC-HR-013 | GDSN | `MainDB_HR` | Parent | 32 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Information

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-HEALTHINFO-PARENT | SRC-HR-014 | HEALTHINFO | `MainDB_HR` | Parent | 10 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Survey

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-ESF-PARENT | SRC-HR-009 | ESF | `MainDB_HR` | Parent | 14 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## HR / HR - Workforce

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-HR-BSD-PARENT | SRC-HR-001 | BSD | `MainDB_HR` | Parent | 39 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-HR-CWR-PARENT | SRC-HR-004 | CWR | `MainDB_HR` | Parent | 62 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## IT / IT - Access

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-IT-EAF-PARENT | SRC-001 | EAF | `MainDB_IT` | Parent | 21 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-IT-EAF-CHILD | SRC-001 | EAF | `MainDB_IT_Ext_Access` (for provisioning/config details)` | Child/Extension | Needs sizing | Repeating rows, attachments, workflow history, or processing sections from requirement evidence | Confirm child-list need before provisioning if rows are fixed-count in source PDF |

## IT / IT - Activity Logs

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-IT-IAL1-PARENT | SRC-003 | IAL1 | `MainDB_IT` | Parent | 16 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-IT-IAL2-PARENT | SRC-004 | IAL2 | `MainDB_IT` | Parent | 16 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-IT-IAL3-PARENT | SRC-005 | IAL3 | `MainDB_IT` | Parent | 16 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-IT-IAL4-PARENT | SRC-006 | IAL4 | `MainDB_IT` | Parent | 16 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |

## IT / IT - Asset Inventory

| Design ID | Source ID | Form | List | Role | Columns | Design Basis | Notes |
|---|---|---|---|---|---|---|---|
| SHD-IT-HI-PARENT | SRC-002 | HI | `MainDB_IT` | Parent | 26 | Promoted PDF requirement fields plus FormCode/system fields | Use FormCode discriminator and generated model columns; unknown choices need confirmation |
| SHD-IT-HI-CHILD | SRC-002 | HI | `MainDB_IT_Ext_Assets` (for software list and detailed config)` | Child/Extension | 3 | Repeating rows, attachments, workflow history, or processing sections from requirement evidence | Confirm child-list need before provisioning if rows are fixed-count in source PDF |

## Caveats

- Rows are generated from already-extracted PDF requirement artifacts, not from new business confirmation.
- Values marked Unknown, Inferred, or Needs Human Confirmation must stay open until DXL/SME evidence confirms them.
- Original source PDFs and XML files remain reference-only and were not modified.
