# Field Candidate Register

> Pre-promotion field register. Fields extracted from PDFs are stored here as **candidates** until verified by quality review and promoted to `GLOBAL_FIELD_DICTIONARY.md`.

## Register Format

| Candidate ID | Source ID | Form | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|

## Status Values

| Status | Meaning |
|---|---|
| `Candidate` | Extracted from PDF text, not yet verified |
| `Verified` | Confirmed by quality review |
| `Promoted` | Moved to GLOBAL_FIELD_DICTIONARY.md |
| `Rejected` | Not a real field (noise, duplicate, system artifact) |
| `Needs Human Review` | Ambiguous — requires human decision |

## IT Batch 001+002 Candidates (Promoted)

See `source_analysis/09_reports/PDF_EXTRACTION_EVIDENCE.md` for the full 156-field extraction evidence. All IT fields from SRC-001 through SRC-006 have been promoted.

## Pending Candidates

| Source ID | Form | Candidates | Status | Quality |
|---|---|---|---|---|
| SRC-HR-001 | Backup Staff Database (BSD) | 38 | Candidate | 98/100 |
| SRC-HR-002 | Rest Day & Additional Working Hours (AWHR) | 76 | Candidate | 85/100 |
| SRC-HR-003 | Cafeteria Inspection (CIR) | 17 | Candidate | 100/100 |
| SRC-HR-004 | Contract Worker Requisition (CWR) | 62 | Candidate | 96/100 |
| SRC-HR-005 | Duty Roster Database (DRD) | 35 | Candidate | 98/100 |
| SRC-HR-006 | Employee Exit Notification (EEN) | 70 | Candidate | 93/100 |
| SRC-HR-007 | Employee Personal Detail Update (EPDU) | 35 label pairs + grouped repeating tables | Promoted to Requirements - Human Confirmation Pending | 91/100 |
| SRC-HR-008 | Employee Personal Health Record (EPHR) | 21 label pairs + grouped medical rows | Promoted to Requirements - Human Confirmation Pending | 88/100 |
| SRC-HR-009 | Employee Survey Form (ESF) | 14 label pairs + grouped survey rows | Promoted to Requirements - Human Confirmation Pending | 92/100 |
| SRC-HR-010 | Fixed Term Contract Requisition Form (FTCR) | 42 label pairs + background-history rows | Promoted to Requirements - Human Confirmation Pending | 94/100 |
| SRC-HR-011 | Foreign Workers Work Permit Database (FWWPD) | 24 label pairs + grouped tracking rows | Promoted to Requirements - Human Confirmation Pending | 90/100 |
| SRC-HR-012 | Foreign Worker Work Period Extension (FWWPE) | 47 label pairs + workflow/completion sections | Promoted to Requirements - Human Confirmation Pending | 95/100 |
| SRC-HR-013 | Gift/Donation/Sponsorship Notification (GDSN) | 32 label pairs + routing fields | Promoted to Requirements - Human Confirmation Pending | 92/100 |
| SRC-HR-014 | HR Information / Notice (HEALTHINFO) | 10 label pairs + admin fields | Promoted to Requirements - Human Confirmation Pending | 86/100 |
| SRC-HR-015 | HR Applications Problem Reporting (HRAPR) | 32 label pairs + routing/audit fields | Promoted to Requirements - Human Confirmation Pending | 93/100 |
| SRC-FIN-001 | Capital Appropriation Request (CAR) | 42 grouped candidates + investment/PO/completion row structures | Promoted to Requirements - Human Confirmation Pending | 96/100 |
| SRC-FIN-002 | Approval for Credit Application Form (CMF_A) | 25 label candidates + routing fields | Promoted to Requirements - Human Confirmation Pending | 95/100 |
| SRC-FIN-003 | Temporary Credit Limit Change Form (CMF_B) | 25 label candidates + routing fields | Promoted to Requirements - Human Confirmation Pending | 94/100 |
| SRC-FIN-004 | Review of Customers on Credit (CMF_C) | 22 grouped candidates + 50 customer row structure | Promoted to Requirements - Human Confirmation Pending | 91/100 |
| SRC-FIN-005 | Expenditure Appropriation Request Form (EARF) | 32 grouped candidates + asset/PR row structures | Promoted to Requirements - Human Confirmation Pending | 94/100 |
| SRC-FIN-006 | Reversal Service Entry Sheet (RSES) | 18 label candidates + routing fields | Promoted to Requirements - Human Confirmation Pending | 98/100 |
| **Total** | | **719 promoted/grouped label candidates + grouped HR/FIN table structures** | | |

See `field_candidates/SRC-HR-00{1-9}_*_FIELD_CANDIDATES.md`, `field_candidates/SRC-HR-01{0-5}_*_FIELD_CANDIDATES.md`, and `field_candidates/SRC-FIN-00{1-6}_*_FIELD_CANDIDATES.md` for detailed field tables.

*EXB-001 (BSD, AWHR, CIR), EXB-002 (CWR, DRD, EEN), EXB-003 (EPDU, EPHR, ESF), EXB-004 (FTCR, FWWPD, FWWPE), EXB-005 (GDSN, HEALTHINFO, HRAPR), FXB-001 (CAR, CMF_A, CMF_B), and FXB-002 (CMF_C, EARF, RSES) promoted to source requirements. EXB-003/004/005 and FXB-001/002 remain subject to human-confirmation caveats for table modeling, privacy/access, workflow state values, role ownership, routing, Finance threshold approvals, credit-limit rules, and asset/SES workflow states.*

---

*Last Updated: 2026-06-02*
