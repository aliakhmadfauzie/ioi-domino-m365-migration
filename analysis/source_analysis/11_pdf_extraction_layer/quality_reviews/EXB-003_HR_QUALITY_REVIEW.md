# EXB-003 HR Extraction - Quality Review

> **Batch**: EXB-003 | **Review Date**: 2026-06-01
> **Reviewer**: Domino PDF Source Analysis Agent

## Quality Decision

**Classification**: Approved to Promote with Human Confirmation

All three PDFs opened successfully, all 8 pages produced extractable text, and field candidates trace to raw text. Promotion is allowed because there are no hallucinated labels or invented choices. Promotion must carry forward the noted caveats: EPDU has many repeated table/system codes, EPHR has Unicode/ligature extraction artifacts that must be normalized in implementation, and ESF survey row codes should be modeled as a survey response table instead of unrelated standalone fields.

---

## 22-Point Quality Checklist

| # | Check | EPDU | EPHR | ESF | Detail |
|---|---|---|---|---|---|
| 1 | Page inventory created? | Yes | Yes | Yes | Combined in `EXB-003_page_inventories.md` |
| 2 | Raw text extracted? | 3 files | 2 files | 3 files | 8 raw text files total |
| 3 | Visual notes created? | Yes | Yes | Yes | 3 individual files |
| 4 | Field candidate files? | Yes | Yes | Yes | 70 label pairs total |
| 5 | Workflow candidate files? | Yes | Yes | Yes | 3 individual files |
| 6 | Labels from extraction? | Yes | Yes | Yes | All promoted labels trace to raw text |
| 7 | Inferred fields marked? | Yes | Yes | Yes | Table/system row codes remain candidate/grouped |
| 8 | Unknown fields marked? | Yes | Yes | Yes | Choices remain Unknown unless visible |
| 9 | Choices only when visible? | Yes | Yes | Yes | ESF rating scale 1-10 visible; other choices remain Unknown |
| 10 | Approval assumptions avoided? | Yes | Yes | Yes | EPDU is review/notification, not full approval; EPHR/ESF are not approval |
| 11 | Signature boxes conservative? | Yes | Yes | Yes | No signature-only approval promotion |
| 12 | Workflow evidence-based? | Yes | Yes | Yes | Workflow files cite page tokens |
| 13 | CurrentAction/CA detected? | Partial | CA only | CA only | CA/status-like fields exist but do not prove approval |
| 14 | Approval/acceptance captured? | HRAction + Accepted fields | N/A | N/A | EPDU requires HR confirmation of review state |
| 15 | Repeating tables identified? | Yes | Yes | Yes | Education, children/family, medical history, survey questions |
| 16 | Quality scores correct? | 91 | 88 | 92 | G1-G6 applied conservatively |
| 17 | Promotion justified? | Yes | Yes | Yes | All scores are above 80 and caveats are documented |
| 18 | Manual review items? | Yes | Yes | Yes | Human confirmation questions listed below |
| 19 | Registers updated? | Yes | Yes | Yes | Queue, rollout register, HR progress, next-day list, and human-confirmation log updated after promotion |
| 20 | Duplicate candidates? | None found | None found | None found | No cross-batch duplicate ownership issue found |
| 21 | Hallucinated fields? | None found | None found | None found | Zero invented labels identified |
| 22 | Quality vs EXB-002? | Lower | Lower | Lower | More noisy table extraction, still promotable |

---

## Problems Found

| # | Problem | Severity | Affects | Required Handling |
|---|---|---|---|---|
| 1 | EPDU has 143 standalone table/system codes, many from repeating tables | Medium | EPDU | Promote grouped table structures, not every code as a parent field |
| 2 | EPHR raw text contains Unicode extraction artifacts in `Location` and `Attachment` field names | Medium | EPHR | Normalize to ASCII internal names during schema/build |
| 3 | ESF survey questions extract as row codes plus text split across pages | Medium | ESF | Model as survey question/response rows with rating/comment/group fields |
| 4 | Choice values mostly absent | Low | All 3 | Carry as Unknown/Human Confirmation; do not invent values |

---

## Promotion Decisions

| PDF | Score | Decision | Rationale |
|---|---:|---|---|
| EPDU.pdf | 91/100 | Promote with Human Confirmation | Strong extraction coverage and HR review evidence, but repeated tables require careful schema design. |
| EPHR.pdf | 88/100 | Promote with Human Confirmation | Health record fields and medical/admission sections are clear; field-name normalization and sensitive-data handling require confirmation. |
| ESF.pdf | 92/100 | Promote with Human Confirmation | Survey structure and rating scale are clear; response table design requires confirmation. |

---

## PDFs Requiring Human Confirmation

| Form | Questions for HR |
|---|---|
| EPDU | Confirm HR review workflow state values; confirm whether education, children, and family details should use child lists or fixed rows; confirm marital/status choice values. |
| EPHR | Confirm health-record access/privacy roles; confirm medical history choice values and whether admission records can repeat. |
| ESF | Confirm survey response model: fixed 16 questions or configurable question list; confirm category/age/service choices and total-rating calculation. |

---

## Final Decision

EXB-003 passes quality review and may be promoted to source requirements. Promotion must include the caveats above and must not start HR form builds until CIR schema sync/read-write/re-audit blockers are resolved.
