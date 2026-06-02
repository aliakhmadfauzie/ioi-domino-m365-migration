# SRC-FIN-004 CMF_C Visual Notes

> Form: Review of Customers on Credit | Batch: FXB-002

## Layout Observations

| Page | Visual / Structural Notes |
|---:|---|
| 1 | Appendix C header, initiation label pairs, Marketing personnel fields, and the start of a dense customer review table. |
| 2 | Continuation of the customer review table. Rows are visually fixed and numbered up to 50 across pages 1-3. |
| 3 | Final table rows, attachment field, explanatory notes for Active/Inactive and late payment, Marketing Manager endorsement, and GM/section approval. |
| 4 | Finance Review, ED approval, and Finance acknowledgement sections with Approve/Deny controls. |
| 5 | Hidden fields area for Current Action, Marketing/ED/IT/Finance routing, editors, mail list, INO, and reminder date. |

## Repeating Structures

| Structure | Rows | Columns / Fields | Recommendation |
|---|---:|---|---|
| Customer credit review table | 50 | Customer, SAP ID, buying activity, late payment, negative market news, financial statement available, main/increase/decrease/cancel credit limit | Prefer a child list or JSON-backed extension table if row-level reporting/filtering is required; otherwise fixed 50-row parent fields may preserve the Domino layout. |

## Visual Caveats

- The PDF text extraction shows several `M_*` values visually truncated as `M_1`, `M_2`, etc. Treat those as extraction artifacts until DXL confirms exact internal names.
- Section titles for GM/ED approval are generic (`SectionTitle`, `SectionTitle_1_1`) and need business labels before UI build.

