# SRC-FIN-005 EARF Visual Notes

> Form: Expenditure Appropriation Request Form | Batch: FXB-002

## Layout Observations

| Page | Visual / Structural Notes |
|---:|---|
| 1 | EARF header, low-value asset wording, Finance-only SAP IO field, initiation fields, consultation notes for IT/Admin purchases, and 5-row asset cost table. |
| 2 | Attachment continuation, department/division routing fields, requestor metadata, Finance verification, Department Head approval, and reviewed-by section start. |
| 3 | Reviewed-by completion, Division Head approval, notification, completion section, 5-row SAP PR table, prepared-by completion, and cancellation start. |
| 4 | Cancellation details and hidden routing/access fields including Finance/Admin/IT routing, editors, mailing list, and reminder date. |

## Repeating Structures

| Structure | Rows | Columns / Fields | Recommendation |
|---|---:|---|---|
| Asset detail table | 5 | Description of Asset, For Whom, Quantity, Unit Price, Cost, SAP Asset No. | Fixed 5 rows are acceptable unless Finance needs flexible item counts. |
| SAP PR raised table | 5 | Date, PR No. | Fixed 5 rows are acceptable; child list only if PR rows must be independently reported. |

## Visual Caveats

- EARF includes consultation notes for IT/Admin purchases. Routing to IT HOD/Admin/Maintenance should be confirmed before build.
- Completion appears requestor-filled after approval; exact state transition into completion needs confirmation from DXL or SME.

