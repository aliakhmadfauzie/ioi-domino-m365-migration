# User Acceptance Test

> UAT sign-off sheet per department. All items must be PASS before go-live.
> Requires sign-off from dept HOD and IT Admin.
> Last updated: 2026-06-02

---

## UAT Sign-Off Rules

1. Each dept must complete all test scenarios for their forms before sign-off
2. UAT must be performed by actual end users — not IT Admin
3. Failed tests must be logged in `11-risk-and-issues/issue-log.md`
4. All critical and high issues must be resolved before sign-off
5. UAT environment must mirror production data (test with real-world data volumes)

---

## UAT Template (Copy per Department)

```
## UAT Sign-Off: [Department Name]
## Date: [YYYY-MM-DD]
## HOD Sign-Off: [Name + Date]
## IT Admin Sign-Off: [Name + Date]
## Forms Tested: [List form codes]

### Submission Flow
[ ] Submitter can create new request
[ ] Submitter can save as draft and return later
[ ] Submitter can submit
[ ] Submitter can see own submissions in My Requests
[ ] Submitter cannot see other users' private records
[ ] Status badge shows correct status at each stage
[ ] Breadcrumb navigation works correctly

### Approval Flow
[ ] First approver receives correct records in approval queue
[ ] First approver can approve
[ ] First approver can reject with comment
[ ] First approver can return for edit
[ ] On rejection: submitter's record shows "Rejected" with reason
[ ] On return: submitter can edit and resubmit
[ ] Approval history visible in record detail

### Data Accuracy
[ ] All form fields are saved correctly to SharePoint
[ ] SP column values match what was entered in the form
[ ] Date fields are saved in correct format
[ ] People picker saves email address correctly

### Performance
[ ] Form list loads within 3 seconds (< 500 records)
[ ] Form list loads within 5 seconds (500–2000 records)
[ ] Submission action completes within 5 seconds
[ ] Approval action completes within 5 seconds

### Mobile / Responsive
[ ] Form renders correctly on mobile device
[ ] Gallery items are readable on mobile
[ ] Approval actions accessible on mobile

### Sign-Off
HOD Name: _________________________ Date: ___________ Signature: ___________
IT Admin: __________________________ Date: ___________ Signature: ___________
```

---

## HR Department UAT

```
## UAT Sign-Off: HR Department
## Status: PENDING
## Target Date: TBD (after build complete)
## Forms to Test: AWHR, EEN, EPDU, CWR, FTCR, JD, NDF, SR, and others
```

---

## FIN Department UAT

```
## UAT Sign-Off: Finance Department
## Status: PENDING
## Target Date: TBD
## Forms to Test: CAR, CMF_A, CMF_B, CMF_C, INSUCLAI, EARF, RSES
## Note: CAR requires 4 approvers (HOD, FIN Manager, COO, ED) — full chain must be tested
```

---

## IT Department UAT

```
## UAT Sign-Off: IT Department
## Status: PENDING
## Target Date: TBD
## Forms to Test: SSR, PRF, UR, SFAR, RS, SAPAMR, SAPSOF
## Note: IT uses currentStatus (plain string) — verify correct status values displayed
```

---

## Overall UAT Sign-Off Checklist

| Dept | Forms Tested | HOD Sign-Off | IT Sign-Off | Status |
|---|---|---|---|---|
| HR | AWHR pilot first | PENDING | PENDING | NOT STARTED |
| FIN | CAR pilot first | PENDING | PENDING | NOT STARTED |
| IT | SSR pilot first | PENDING | PENDING | NOT STARTED |
| QA | TBD | PENDING | PENDING | NOT STARTED |
| QC | TBD | PENDING | PENDING | NOT STARTED |
| PUR | TBD | PENDING | PENDING | NOT STARTED |
| SHE | TBD | PENDING | PENDING | NOT STARTED |
| STR | TBD | PENDING | PENDING | NOT STARTED |
| All remaining depts | TBD | PENDING | PENDING | NOT STARTED |
