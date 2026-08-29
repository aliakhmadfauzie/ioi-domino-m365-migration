# Form Requirement - Employee Personal Health Record (EPHR)

> **Source ID**: SRC-HR-008 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 88/100
> **Evidence**: PyMuPDF direct text from `PRAI_SITE_FORM/HR/EPHR.pdf` (2 pages, 953 chars)
> **Promotion**: Promote with Human Confirmation - sensitive-data access and repeated admission model need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-008 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "EMPLOYEE PERSONAL HEALTH RECORD" | Clearly Found |
| Form Purpose | Capture employee personal health, medical history, follow-up, and admission record information. | Clearly Found |
| Pages | 2 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Employee Health Header | 1 | Requester/HR medical record | FullName, IC, DOB, Gender, HP, Company, Dept |
| Measurements | 1 | Medical record | Height, Weight, BMI, Blood Pressure, Pulse, Visual, Color Vision |
| Medical History | 1-2 | Repeating table | D_N, S_N, R_N rows for condition/date/since/remark pattern |
| Follow-Up | 2 | Medical record | Followup, Followup2, Location, LocRem |
| Admission Record | 2 | Medical record | AdmDate, Diagnosis, Discharge, Attachment, Attachment2 |
| Audit | 2 | System | DocAuthor, CDate |

## 3. Field Requirements

### Employee Health Header and Measurements

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Name | `FullName` | Person/Text | Clearly Found |
| IC No. / Passport No. | `IC` | Text | Clearly Found |
| Date of Birth | `DOB` | Date | Clearly Found |
| Gender | `Gender` | Choice | Clearly Found, choices Unknown |
| HP No | `HP` | Text | Clearly Found |
| Company | `Company` | Text | Clearly Found |
| Department | `Dept` | Text | Clearly Found |
| Height | `H CM` | Number/Text | Clearly Found; normalize field name for implementation |
| Weight | `W KG` | Number/Text | Clearly Found; normalize field name for implementation |
| BMI | `BMI KG/M2` | Number/Text | Clearly Found; normalize field name for implementation |
| Blood Pressure | `BP mmHg` | Text | Clearly Found; normalize field name for implementation |
| Pulse | `P min` | Number/Text | Clearly Found; normalize field name for implementation |
| Visual | `Visual` | Text | Clearly Found |
| Color Vision | `Vision` | Text | Clearly Found |
| Past Medical / Surgical History | `MedHist` | Choice/Text | Clearly Found, choices Unknown |

### Medical History and Admission

| PDF Label / Structure | Domino Field | Type | Confidence |
|---|---|---|---|
| Medical condition rows | `D_1`-`D_7`, `S_1`-`S_7`, `R_1`-`R_7` | Repeating medical history values | Clearly Found |
| Follow up | `Followup` | Text | Clearly Found |
| Regularly | `Followup2` | Text | Clearly Found |
| Location | `Location` | Choice/Text | Clearly Found; raw extraction shows Unicode artifact |
| Remark | `LocRem` | Multiline | Clearly Found |
| Admission Date | `AdmDate` | Date | Clearly Found |
| Diagnosis | `Diagnosis` | Text/Multiline | Clearly Found |
| Discharge Summary | `Discharge` | Multiline | Clearly Found |
| Medical Report | `Attachment` | Attachment/Choice | Clearly Found; raw extraction shows Unicode artifact |
| Additional Report | `Attachment2` | Multiline/Attachment note | Clearly Found; raw extraction shows Unicode artifact |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Not Required / Record Form Candidate | Clearly Found |
| Evidence | No approval/acceptance/routing sections found in extracted text; CA-like tokens alone are not approval evidence. | Clearly Found |
| Privacy Concern | Health data requires role/access confirmation before build | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

**Parent List**: `MainDB_HR`
**FormCode**: `EPHR`
**Child List Candidate**: `MainDB_HR_Ext_EPHR_MedicalHistory` if HR wants flexible condition/admission rows; otherwise fixed condition rows can be parent fields.

Implementation must normalize extracted names such as `Location`, `Attachment`, height/weight/BMI/BP internal names to SharePoint-safe ASCII.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| EPHR-01 | Which HR/medical roles can create, view, and edit health records? | High |
| EPHR-02 | Should medical history and admission records be repeatable child rows or fixed parent fields? | High |
| EPHR-03 | What are the choice values for Gender, Past Medical/Surgical History, Location, and Medical Report? | Medium |
| EPHR-04 | Should health attachments be stored as SharePoint attachments or a separate document child list? | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with privacy and repeatability confirmation |
| Approval Required | No approval; sensitive record form |
| Promotion Quality | 88/100 |
