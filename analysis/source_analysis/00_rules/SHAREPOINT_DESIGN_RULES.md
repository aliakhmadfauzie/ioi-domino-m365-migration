# SharePoint Design Rules

> Rules for designing SharePoint lists from Domino PDF form analysis. Every design must be justified by source evidence.

## Naming Conventions

### List Names
| Pattern | Example | When to Use |
|---|---|---|
| `MainDB_{Department}` | `MainDB_IT` | Parent list for department forms |
| `MainDB_{Department}_Ext_{Purpose}` | `MainDB_IT_Ext_Access` | Child/extension list |
| `MainDB_{Department}_Ext_{FormCode}` | `MainDB_IT_Ext_SAP` | Form-specific extension list |

### Column Internal Names
- camelCase
- Prefix with form code for shared-list columns: `{formCode}{FieldName}` (e.g., `eafClientID`)
- No spaces or special characters
- Max 32 characters

## Parent-Child List Design

### When to Use Parent-Child
- Form has **header data** (requester, date, department) **plus** repeating line items
- Repeating table with multiple columns
- Line items that can vary in count per submission

### Parent List Contains
- Header/requester fields
- Form identification (FormCode)
- Status/workflow fields
- System fields (Created, Modified, Author, Editor)

### Child List Contains
- Line item fields
- Lookup column to parent (ParentID)
- Row number/sequence
- Item-level calculations

## Column Type Mapping

| Source Field Type | SharePoint Column Type | Notes |
|---|---|---|
| Text (single line) | `Single line of text` | |
| Text (multiline) | `Multiple lines of text` | Plain or rich text |
| Number | `Number` | Specify decimal places |
| Currency | `Currency` | Specify currency format |
| Date | `Date and Time` | Date only or date & time |
| Boolean | `Yes/No` | Default to No |
| Choice (single) | `Choice` | Provide all options |
| Choice (multi) | `Choice (Multi-select)` | |
| Person | `Person or Group` | Allow single selection |
| Attachment | `Attachments` (built-in) or `Hyperlink` | |
| Lookup | `Lookup` | Target list and column |
| Signature | `Multiple lines of text` or `Image` | Store as text or image reference |
| Calculated | `Calculated` | Formula-based |

## Column Limit Rules

- Max ~276 columns per list for most types
- Lookup columns: max 12 per list (can be increased to 96)
- Choice columns: max 276 per list
- Person columns: max 96 per list
- Indexed columns: max 20 per list

## System Columns (Always Include)

Every SharePoint list must include:
- `ID` (auto-generated, integer)
- `Title` (default, can rename to a meaningful field)
- `FormCode` (text, for discriminator pattern)
- `Created` (date/time, auto)
- `Modified` (date/time, auto)
- `Author` (person, auto - Created By)
- `Editor` (person, auto - Modified By)

## Design Justification

Every designed column must trace to:
1. A field extracted from the PDF (with Source ID and page reference), OR
2. A required system field (Title, FormCode, status fields, audit fields)

Do not create columns that have no source evidence.

## Child List Lookup Configuration

For every child list:
- `ParentID` column: Lookup to parent list's `ID`
- Enable cascade delete if business rules require it
- Index the lookup column

## Choice Column Values

Choice values must match exactly what was extracted from the PDF.
If choices are `Unknown`, mark the SharePoint column as `Needs Human Confirmation` and do not populate choice values.
