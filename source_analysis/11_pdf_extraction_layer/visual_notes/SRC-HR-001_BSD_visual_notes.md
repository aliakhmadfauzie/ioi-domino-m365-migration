# Visual Notes — BSD.pdf (SRC-HR-001)

> **Form**: Backup Staff Database | **Pages**: 3 | **Department**: HR

## Page 1 — SECTION A: PERSON IN CHARGE

**Layout**: Header block with company name "IOI OLEOCHEMICAL INDUSTRIES BERHAD", form title "Backup Staff Database", then SECTION A.

**Fields (label : fieldname)**:
- Division : Division
- Department : Dept
- Section : Section
- Name : PIC
- Employee No. : EmpNo
- Position : Position
- Area of Responsibility : Responsibility
- Department/Division Head : HOD

**Visual notes**: Standard label-fieldname pairs. No checkboxes or dropdowns visible in text. "TO BE FILLED BY HOD/HOS" indicates role-based section.

## Page 2 — SECTION B + SECTION C

**SECTION B — BACKUP STAFF**: Three repeating blocks (BACKUP STAFF 1, 2, 3) with identical field pattern:
- Name : PIC_1 / PIC_2 / PIC_3
- Position : Position_1 / Position_2 / Position_3
- Area of Responsibility : Responsibility_1 / Responsibility_2 / Responsibility_3

**Child List Candidate**: This is a repeating row structure — 3 identical blocks with numbered field suffixes.

**SECTION C — NOMINATED BY HOD/HOS**:
- Name : SubmittedBy
- Date : SubmitDate
- Remark : Remark

## Page 3 — SECTION D + Hidden Fields

**SECTION D — APPROVED BY HEAD OF DIVISION**:
- "APPROVE REJECT" text exists — likely radio buttons or dropdown
- Name : HODName
- Position : HODPost
- Date : HODDate
- Remarks : HODRemarks
- HODApp (approval flag)
- Update/Revision Required : Revision
- Updated by : Updatedby
- Date : Updateddt
- Status : Status
- Remarks : StaRem

**Hidden Fields**:
- Created by : DocAuthor
- Status : CurrentAction (workflow state machine)
- HR Section : Editor1
- HOD Section : Editor2
- HOD/HOS : Editor3
- HR Admin : HRAdmin
- Modification Date : ModifiedDate

## Summary

| Feature | Count |
|---|---|
| Labeled sections | 4 (A, B, C, D) |
| Repeating blocks | BACKUP STAFF 1-3 (Child List Candidate) |
| Approval section | SECTION D with APPROVE/REJECT |
| Hidden/system fields | 7 |
| Role-based sections | SECTION A (HOD/HOS), SECTION C (HOD/HOS), SECTION D (HOD), Editor roles |
