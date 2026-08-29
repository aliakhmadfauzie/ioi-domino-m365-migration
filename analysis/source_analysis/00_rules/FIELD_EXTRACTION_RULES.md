# Field Extraction Rules

> Rules for extracting fields from Domino PDF forms. Every extracted field must follow these rules.

## Field Identification

A field is identified when the PDF shows:
- A labeled input area (text box, line, blank space with a label)
- A checkbox with a label
- A radio button group with labels
- A dropdown/combobox with visible label
- A table column header (for repeating items)
- A signature block with a role label
- A date field with a calendar or date label
- An attachment indicator (paperclip, "Attach", "Upload" label)
- A calculated/total field

## Field Label Extraction

1. Extract the label exactly as shown in the PDF.
2. Preserve capitalization, punctuation, and spacing from the PDF.
3. If a label spans multiple lines, join with a space.
4. If a label is abbreviated, extract the abbreviation exactly.
5. If a label is truncated or partially visible, note `[Partially Visible]`.

## Internal Name Suggestion

Generate suggested internal names using these conventions:
- camelCase format
- Remove spaces, punctuation, and special characters
- Use full words where possible (e.g., `requestorName` not `reqNm`)
- Prefix with form code abbreviation for shared-list fields (e.g., `eafClientID`)
- Use consistent suffixes: `Date`, `Email`, `Name`, `Amount`, `Comments`, `Status`

Examples:
| Label | Suggested Internal Name |
|---|---|
| Requestor Name | `requestorName` |
| Department | `department` |
| Date of Request | `dateOfRequest` |
| HOD Approval Date | `hodApprovalDate` |
| Total Amount (RM) | `totalAmount` |
| Item Description | `itemDescription` |

## Data Type Inference

Infer data type conservatively:

| PDF Evidence | Inferred Type |
|---|---|
| Blank line/box for text | `Text` |
| Date label or date format hint | `Date` |
| Currency symbol (RM, $) or "Amount" | `Number` |
| Checkbox (single) | `Boolean` |
| Checkbox group (multiple select) | `Choice (Multi)` |
| Radio buttons | `Choice (Single)` |
| Dropdown indicator | `Choice (Single)` |
| Large blank area or "Remarks" | `Multiline Text` |
| Email label or "@" reference | `Email` |
| Person name with role context | `Person` |
| Signature block | `Signature` |
| Attachment indicator | `Attachment` |
| Table with number columns | `Number` (per column) |
| "Total" or "Sum" label | `Number (Calculated)` |

If type cannot be reasonably inferred, mark as `Text` and note `Confidence = Inferred`.

## Required Field Detection

Mark as Required ONLY when:
- An asterisk (*) appears next to the label
- The word "Required" or "Mandatory" appears near the field
- Form instructions state the field is required
- The field is clearly part of a minimum required set (e.g., "All fields in Section A are mandatory")

Otherwise, mark Required = `Unknown` or `Optional (Inferred)`.

## Choice Extraction

1. Extract choice text exactly as shown. Preserve capitalization and spacing.
2. For radio buttons, list all visible options.
3. For checkboxes, list all visible options.
4. For dropdowns where options are visible, list all options.
5. If dropdown options are not visible, mark `Choices = Unknown`.
6. Use pipe separator for multiple choices: `Option 1 | Option 2 | Option 3`.

## Repeating Table Detection

A repeating table is identified when:
- Column headers appear above multiple blank rows
- Row numbers (1, 2, 3...) are visible
- "Add Row" or similar indicator is visible
- The section label mentions "Items", "Details", "Line Items", "List"

Mark as `Child List Candidate` and record:
- Number of visible columns
- Column header labels
- Number of visible rows
- Whether totals/sums are calculated

## Field Grouping

Group related fields:
| Group | Examples |
|---|---|
| `Header/Requester` | Requestor name, department, date, contact |
| `Approval` | Approver name, signature, date, comments |
| `LineItems` | Item description, quantity, unit price, total |
| `Admin` | Reference number, date received, processed by |
| `Attachments` | File upload fields, attachment lists |
| `Status` | Status field, stage indicator |
| `Comments` | Remarks, notes, justification fields |

## Confidence Assignment

| Confidence | When to Use |
|---|---|
| `Clearly Found` | Field label and type are clearly visible in the PDF or explicitly documented in verified DXL. |
| `Inferred` | Field appears to be present but label or type is partially obscured, or derived from intermediate analysis (PDF UI inventory) rather than direct PDF viewing. |
| `Unknown` | Cannot determine from visible PDF content or available analysis. |
| `Needs Human Confirmation` | Field purpose or type could significantly affect data design. |

## Evidence Chain Rule

When direct PDF viewing is unavailable and field extraction relies on intermediate sources:
1. Cite the intermediate source explicitly (e.g., `analysis/pdf-ui-inventory.md`, `analysis/workflow-analysis.md`).
2. Mark field labels derived from intermediate analysis as `Inferred` unless confirmed by DXL or another primary source.
3. Mark field types derived from intermediate analysis as `Inferred`.
4. Never mark a field as `Clearly Found` based solely on an intermediate source unless that source was verified against the original PDF.
5. Record the evidence chain in the requirement file's Evidence Base header.
