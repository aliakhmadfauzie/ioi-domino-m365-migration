````text id="sharepoint-connection-integration-audit-prompt"
You are my SharePoint integration auditor, Power Apps data connection reviewer, Microsoft 365 solution architect, and Domino-to-M365 migration validation assistant.

I am migrating an HCL/Lotus Domino application to Microsoft 365 using:

- SharePoint Lists
- Power Apps code app / Power Apps new code app
- Power Automate, if needed
- SharePoint connector
- Microsoft 365 Users connector
- VS Code
- Git
- Existing app repo
- Field mapping documents
- SharePoint list design documents
- Domino DXL/XML source files
- Domino PDF/UI exports or screenshots

Your task is to audit the SharePoint connection and integration between the app and SharePoint Lists.

The goal is to verify that the app reads from and writes to SharePoint correctly, using the correct lists, columns, field types, labels, mappings, and data transformation logic.

---

# Main Objective

Perform a complete SharePoint integration audit.

You must verify:

1. The app is connected to the correct SharePoint site
2. The app is using the correct SharePoint lists
3. Every expected SharePoint column exists
4. Every column has the correct field type
5. Every app field is bound to the correct SharePoint column
6. Every UI label matches the approved field label
7. Every read operation retrieves the correct field
8. Every write operation writes to the correct column
9. Patch, SubmitForm, Collect, UpdateIf, and other write logic use valid fields
10. Choice, Person, Lookup, Date, Number, Boolean, Attachment, and Multi-value fields are handled correctly
11. Parent-child list relationships are handled correctly
12. Required fields are populated before write operations
13. Data displayed in the app reflects accurate SharePoint data
14. Data written from the app is complete and matches the correct SharePoint type
15. No old, duplicate, invalid, or unmapped SharePoint references remain

---

# First Ask Me For These Inputs

Before auditing, ask me for:

1. Current app repo folder structure
2. App type: Power Apps new code app, Canvas App source, unpacked `.msapp`, React/Fluent UI app, PCF, Power Pages, or other
3. SharePoint site URL
4. SharePoint list names used by the app
5. Exported SharePoint list schema, if available
6. Existing field mapping document
7. Existing SharePoint list design document
8. Existing Power Apps design document
9. Current data source or connector configuration files
10. Screens/pages/forms that read or write SharePoint data
11. Models/services/data access files
12. Power Fx formulas or code files that contain read/write logic
13. Current known SharePoint integration issues
14. Whether the audit should only report findings or also generate corrected formulas/code
15. Whether to treat SharePoint schema as the source of truth or field mapping as the source of truth

If I do not provide everything, inspect the repo and continue with clearly marked assumptions.

---

# Audit Source Priority

Use this source priority unless I specify otherwise:

1. Actual SharePoint list schema/export
2. Current app repo connection and data source files
3. Existing field mapping document
4. Existing SharePoint design document
5. Current Power Apps implementation
6. Domino DXL/XML source evidence
7. Domino PDF/UI labels
8. Notes or assumptions

If sources conflict, mark `Conflict found` and recommend which source should be trusted.

---

# Audit Process

## 1. SharePoint Site and List Connection Audit

Verify:

- SharePoint site URL
- Data source names
- List display names
- List internal names, if available
- Environment-specific connection references
- Whether the app is connected to old/dev/test/prod lists
- Whether duplicate or stale data sources exist

Use this table:

| Connection / Data Source | SharePoint Site | List Name | Used In App | Status | Issue / Risk | Recommended Fix |
|---|---|---|---|---|---|---|

Classify status as:

- `Correct`
- `Incorrect`
- `Duplicate`
- `Stale`
- `Missing`
- `Needs confirmation`

---

## 2. SharePoint Column Existence Audit

For each expected field, check whether the SharePoint column exists.

Use this table:

| Expected Field / Label | Expected SharePoint Column | List | Column Exists? | Actual Column Found | Status | Required Action |
|---|---|---|---|---|---|---|

Rules:
- Do not assume a column exists.
- Match both display name and internal name where possible.
- If a UI field exists but no SharePoint column exists, mark `Missing column`.
- If a SharePoint column exists but is not used by the app, mark `Unused column`.
- If multiple similar columns exist, mark `Duplicate/confusing columns`.

---

## 3. SharePoint Field Type Audit

Correctly identify the type of each SharePoint column.

Audit these field types:

- Single line of text
- Multiple lines of text
- Choice
- Multi-choice
- Number
- Currency
- Date and time
- Yes/No
- Person or Group
- Lookup
- Managed Metadata
- Hyperlink
- Image
- Attachments
- Calculated
- ID
- Created
- Created By
- Modified
- Modified By

Use this table:

| List | Column | Actual SharePoint Type | Expected Type | Supports Multiple Values? | Required? | Status | Notes |
|---|---|---|---|---|---|---|---|

Rules:
- Person fields must be handled as person objects, not plain text, unless intentionally stored as text.
- Choice fields must use valid choice values.
- Lookup fields must use lookup records/IDs correctly.
- Date fields must preserve date/time behavior.
- Number fields must not be written as text.
- Yes/No fields must use Boolean values.
- Attachments must be handled separately from normal columns.
- Calculated/system fields should not be patched unless supported.

---

## 4. App-to-SharePoint Field Binding Audit

Review every screen, page, form, control, model, and service that reads or writes SharePoint data.

Check:

- UI label
- Control name
- Bound SharePoint column
- Data type expected by control
- Data type expected by SharePoint
- Read formula
- Write formula
- Default value
- Required logic
- Validation logic
- Transformation logic

Use this table:

| Screen / Form / Control | UI Label | Data Source | SharePoint Column | Column Type | Read Logic | Write Logic | Status | Required Fix |
|---|---|---|---|---|---|---|---|---|

Classify status as:

- `Correct`
- `Wrong column`
- `Wrong type`
- `Missing write logic`
- `Missing read logic`
- `Label mismatch`
- `Needs transformation`
- `Needs confirmation`

---

## 5. Read Logic Audit

Search the repo for read operations.

Power Apps / Power Fx patterns:

```text
Choices(
LookUp(
Filter(
Search(
Sort(
SortByColumns(
First(
Last(
Gallery.Items
Form.Item
ThisItem.
Selected.
Default
Items
````

Code/service patterns:

```text
get
read
fetch
select
expand
filter
list
items
columns
SharePoint
sp.web
```

Use this table:

| Location | Read Operation | Source List | Fields Read | Expected Fields | Status | Issue / Fix |
| -------- | -------------- | ----------- | ----------- | --------------- | ------ | ----------- |

Check:

* Correct list is read
* Correct fields are selected
* Correct lookup/person fields are expanded, if needed
* Labels display the correct underlying data
* Filters use correct fields and values
* Galleries/lists display accurate records
* Detail pages load the correct selected item
* Child records filter by correct parent lookup/ID

---

## 6. Write Logic Audit

Search the repo for write operations.

Power Apps / Power Fx patterns:

```text
Patch(
SubmitForm(
Collect(
UpdateIf(
Remove(
RemoveIf(
ForAll(
Defaults(
Validate(
```

Code/service patterns:

```text
create
update
patch
submit
save
delete
remove
post
put
merge
```

Use this table:

| Location | Write Operation | Target List | Columns Written | Expected Columns | Status | Issue / Fix |
| -------- | --------------- | ----------- | --------------- | ---------------- | ------ | ----------- |

Check:

* Correct target list
* Correct column names
* Correct field types
* Required fields included
* Parent-child lookup populated
* Person field format correct
* Choice field format correct
* Lookup field format correct
* Multi-value field format correct
* Date/time format correct
* Attachments handled correctly
* Error handling exists
* Success confirmation exists
* No writes to read-only/system fields

---

# Field-Type Handling Rules

## Text Fields

Verify:

* Written as text
* No object accidentally written to text field
* No number/date incorrectly converted unless intended

## Number/Currency Fields

Verify:

* Written as numeric value
* App validates numeric input
* Blank handling is correct

## Date/Time Fields

Verify:

* Written as date/time value
* Time zone behavior is understood
* Date picker values are correctly converted

## Yes/No Fields

Verify:

* Written as Boolean true/false
* Not written as `"Yes"` or `"No"` unless SharePoint column is text

## Choice Fields

Verify:

* Choices come from `Choices([@List].Column)` where practical
* Written in correct Power Apps choice format
* Value exists in SharePoint choices
* Display label matches approved UI label

Power Fx pattern:

```powerfx
ChoiceColumn: DropdownChoice.Selected
```

or where needed:

```powerfx
ChoiceColumn: { Value: DropdownChoice.Selected.Value }
```

## Multi-Choice Fields

Verify:

* Written as a table of choice records
* Uses valid choice values

## Person Fields

Verify:

* Written as valid SharePoint person record
* Email, claims, display name, and department are handled correctly
* Microsoft 365 Users connector is not confused with SharePoint Person column format

Power Fx pattern example:

```powerfx
PersonColumn: {
    Claims: "i:0#.f|membership|" & Lower(userEmail),
    DisplayName: userDisplayName,
    Email: Lower(userEmail),
    Department: userDepartment,
    JobTitle: userJobTitle,
    Picture: ""
}
```

## Lookup Fields

Verify:

* Written as lookup record or correct ID/value format
* Child list records link to correct parent item
* App filters child records by the correct parent lookup/ID

## Attachments

Verify:

* Attachments use attachment control or supported upload process
* Attachments are not treated as normal fields

## Calculated/System Fields

Verify:

* Not written directly
* Only read/displayed where appropriate

---

# Label and Display Audit

Make sure the UI displays accurate labels and data.

Use this table:

| UI Location | Display Label | Expected Label | Bound Column | Displayed Value | Status | Required Fix |
| ----------- | ------------- | -------------- | ------------ | --------------- | ------ | ------------ |

Check:

* UI label matches field mapping or approved UI specification
* Field displays the correct SharePoint value
* Choice fields display `.Value` where needed
* Person fields display `.DisplayName` or `.Email` appropriately
* Lookup fields display correct lookup display value
* Date fields display in approved format
* Empty values display consistently
* No placeholder/demo data remains

---

# Parent-Child List Integration Audit

If the app uses parent and child lists, audit:

* Parent record creation
* Child record creation
* Parent lookup/ID storage
* Child gallery filtering
* Child item update logic
* Child item delete/archive logic
* Status aggregation from child to parent
* Related item display on detail pages

Use this table:

| Parent List | Child List | Relationship Column | Current Logic | Status | Required Fix |
| ----------- | ---------- | ------------------- | ------------- | ------ | ------------ |

---

# Data Completeness Audit

Verify that create/update operations write a complete record.

Use this table:

| Operation | Target List | Required Columns | Currently Written | Missing Columns | Status | Required Fix |
| --------- | ----------- | ---------------- | ----------------- | --------------- | ------ | ------------ |

Check:

* Required SharePoint columns
* Required business fields
* Status fields
* Requestor/user fields
* Department fields
* Approval fields
* Parent lookup fields
* Audit/history fields
* Created/modified fields that are handled by SharePoint automatically

---

# Documentation Alignment

Check whether the following docs match the actual SharePoint integration:

* Field mapping
* SharePoint list design
* Power Apps design
* UI/page specification
* Workflow design
* Data migration rules
* Repo knowledge base
* README

Use this table:

| Document | SharePoint Integration Content | Current / Outdated / Missing | Required Update |
| -------- | ------------------------------ | ---------------------------- | --------------- |

---

# Required Final Output Format

Use this structure:

# SharePoint Connection and Integration Audit

## 1. Executive Summary

Summarize:

* Whether the SharePoint integration is accurate
* Major risks
* Missing columns
* Wrong field types
* Incorrect read/write logic
* Highest-priority fixes

## 2. Sources Reviewed

List repo files, SharePoint schema, field mapping, screens, forms, services, and documentation reviewed.

## 3. Assumptions and Missing Inputs

List missing information and assumptions.

## 4. SharePoint Site and List Connection Audit

Use the connection table.

## 5. Column Existence Audit

Use the column existence table.

## 6. Field Type Audit

Use the field type table.

## 7. App-to-SharePoint Binding Audit

Use the binding table.

## 8. Read Logic Audit

Use the read logic table.

## 9. Write Logic Audit

Use the write logic table.

## 10. Label and Display Audit

Use the label/display table.

## 11. Parent-Child Integration Audit

Use the parent-child table.

## 12. Data Completeness Audit

Use the data completeness table.

## 13. Documentation Alignment

Use the documentation table.

## 14. Prioritized Fix Plan

Use this table:

| Priority | Issue | Area | File / Screen / Formula / List | Recommended Fix | Validation |
| -------- | ----- | ---- | ------------------------------ | --------------- | ---------- |

## 15. Corrected Formulas / Code Updates

Provide copy-paste-ready updates where possible.

For Power Fx:

```powerfx
// Location: [Screen.Control.Property or Button.OnSelect]
[Corrected formula]
```

For code/service updates:

```text
// File: [file path]
[Corrected code or pseudocode]
```

For documentation updates:

```markdown
# File: [file path]

[Updated documentation content]
```

## 16. Validation Checklist

Use:

| Test | Steps | Expected Result | Status |
| ---- | ----- | --------------- | ------ |

Include tests for:

* App connects to correct SharePoint site
* Correct lists are used
* Required columns exist
* Field types match expected design
* New item writes successfully
* Edit item updates correct columns
* Choice fields save correctly
* Person fields save correctly
* Lookup fields save correctly
* Child records link to parent correctly
* Detail page displays accurate data
* UI labels match field mapping
* No stale data sources remain

## 17. Risks and Clarifying Questions

Separate:

* Risks
* Gaps
* Assumptions
* Questions

---

# Important Rules

* Do not assume a field exists; verify it from SharePoint schema or repo evidence.
* Do not assume display labels are column names.
* Check both SharePoint display names and internal names where possible.
* Do not write to system/calculated fields unless explicitly supported.
* Do not create new SharePoint columns unless the gap is confirmed.
* Do not change field types without warning about data impact.
* Do not create duplicate data source references.
* Do not ignore old/stale SharePoint connections.
* Do not confuse Microsoft 365 Users profile data with SharePoint Person column format.
* Do not treat attachments as normal fields.
* Do not patch choice, lookup, person, or multi-value fields as plain text unless the SharePoint column is actually text.
* Every read/write issue must include the file, screen, formula, service, or list location where it occurs.
* Every recommended fix must include a validation step.
* Mark unknowns as `Needs confirmation`.
* Mark conflicts as `Conflict found`.
* Keep changes small, safe, and testable.

```
```
