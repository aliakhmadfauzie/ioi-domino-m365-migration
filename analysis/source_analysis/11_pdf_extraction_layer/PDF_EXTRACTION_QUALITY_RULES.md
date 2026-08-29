# PDF Extraction Quality Rules

> Quality gates and rules for the PDF extraction pipeline. Every batch must pass these before candidates are promoted to source requirements.

## Quality Gates

| Gate | Stage | Criteria | Pass Condition |
|---|---|---|---|
| **G1** | Page Inventory | PDF opens, page count > 0 | All PDFs in batch open successfully |
| **G2** | Raw Text | Extractable text > 20 chars per page | ≥ 90% of pages pass |
| **G3** | Field Candidates | Fields parsed from text, no hallucinated labels | Manual spot-check of 20% of candidates |
| **G4** | Visual Notes | Sections/tables/signatures documented | At least section headers documented |
| **G5** | Workflow Candidates | Classification has evidence trace | No "Required" classification without routing evidence |
| **G6** | Promotion | All 5 gates passed, quality review ≥ 80% | Quality review file created |

## Anti-Hallucination Rules

1. **No invented field labels**: Every candidate field must trace to a `label : fieldname` pair in raw text.
2. **No invented choices**: If dropdown/radio values are not in raw text, mark `Choices = Unknown`.
3. **No invented workflows**: Do not classify approval as Required from signature blocks alone.
4. **No assumed field types**: Infer type only from field name patterns (Date, Email, Amount) or context.
5. **No skipped unknowns**: If a field's purpose is unclear, mark `Needs Human Review`.

## Field Candidate Quality Checks

For each batch, spot-check 20% of field candidates:
- [ ] PDF label matches raw text exactly
- [ ] Domino field name matches raw text exactly
- [ ] Page number is correct
- [ ] Suggested type is reasonable
- [ ] No hallucinated fields inserted

## Workflow Candidate Quality Checks

For each batch:
- [ ] No "Required" classification without `CurrentAction` or multi-stage evidence
- [ ] Signature-block-only forms classified as Inferred or Unknown
- [ ] "Not Required" classification only when no approval signals exist
- [ ] All workflow claims have page/evidence reference

## Batch Quality Score

| Criterion | Max Points |
|---|---|
| All PDFs opened successfully | 10 |
| All pages have extractable text | 20 |
| Field candidates match raw text (spot check) | 25 |
| No hallucinated fields found | 20 |
| Workflow classification has evidence | 15 |
| All unknowns documented | 10 |
| **Total** | **100** |

**Pass threshold**: ≥ 80 points

## Failed Batch Handling

If a batch fails quality review:
1. Document failures in `quality_reviews/EXB-{NNN}_quality_review.md`
2. Fix extraction issues and re-run
3. If unfixable (image-only PDF, garbled text), mark `Blocked - OCR Required` in status register
4. Do NOT promote candidates from a failed batch

---

*Last Updated: 2026-06-01*
