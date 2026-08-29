# FXB-001 Finance Promotion Summary

> Date: 2026-06-02 | Batch: FXB-001 | Status: Promoted

## 1. Forms Promoted

| Source ID | Form Name | Quality | Decision |
|---|---|---:|---|
| SRC-FIN-001 | Capital Appropriation Request (CAR) | 96/100 | Promote with Human Confirmation |
| SRC-FIN-002 | Approval for Credit Application Form (CMF_A) | 95/100 | Promote with Human Confirmation |
| SRC-FIN-003 | Temporary Credit Limit Change Form (CMF_B) | 94/100 | Promote with Human Confirmation |

## 2. Requirement Files Created

| File | Sections | Pages | Promotion Notes |
|---|---:|---:|---|
| `FIN/SRC-FIN-001_CAR_REQUIREMENTS.md` | 10 | 11 | Complex CAR approval/completion lifecycle; child-list and threshold decisions required |
| `FIN/SRC-FIN-002_CMF_A_REQUIREMENTS.md` | 8 | 5 | Fresh credit application workflow; credit state and routing conditions required |
| `FIN/SRC-FIN-003_CMF_B_REQUIREMENTS.md` | 8 | 4 | Temporary credit limit workflow; Appendix A dependency and expiry handling required |

## 3. Fields Promoted

| Form | Promoted | Not Promoted | Reason |
|---|---:|---:|---|
| CAR | 42 grouped label candidates plus investment/PO/completion row structures | 0 | Large repeating rows promoted as structures |
| CMF_A | 25 label candidates plus hidden routing fields | 0 | All promoted content traces to raw text |
| CMF_B | 25 label candidates plus hidden routing fields | 0 | All promoted content traces to raw text |
| Total | 92 grouped candidates plus table/routing structures | 0 | All promoted content traces to raw text |

## 4. Workflow Rules Promoted

| Form | Classification | Key Evidence |
|---|---|---|
| CAR | Complex multi-stage capital approval and completion workflow | Amount threshold matrix, Finance verification, HOD/recommender/SGM/Director approvals, completion approvals, cancellation, CA |
| CMF_A | Multi-stage credit approval workflow | GM approval, Finance review, SFC, SGM/ED, Finance acknowledgement, cancellation, CA |
| CMF_B | Temporary credit limit approval workflow | Marketing, GM, Finance, ED, Finance acknowledgement, TCLC expiry, CA |

## 5. Human Confirmation Questions Added

| Form | High | Medium | Low | Total |
|---|---:|---:|---:|---:|
| CAR | 4 | 1 | 0 | 5 |
| CMF_A | 2 | 2 | 0 | 4 |
| CMF_B | 3 | 2 | 0 | 5 |
| Total | 9 | 5 | 0 | 14 |

## 6. SharePoint Design Recommendations

| Form | Parent | Child List Candidates |
|---|---|---|
| CAR | MainDB_FIN | Ext_CAR_Investments, Ext_CAR_POCommitments, Ext_CAR_PostCompletionSavings |
| CMF_A | MainDB_FIN | None detected |
| CMF_B | MainDB_FIN | None detected |

## 7. Cumulative Finance Progress

| Batch | Forms | Cumulative |
|---|---:|---:|
| FXB-001 | 3 | 3 forms |
| Total | 3 | 3/6 Prai FIN (50%); 3/11 FIN/FN overall (27%) |

## 8. Next Step

Continue Finance PDF extraction with FXB-002. Recommended next Prai FIN PDFs: `CMF_C.pdf`, `EARF.pdf`, and `RSES.pdf`.

