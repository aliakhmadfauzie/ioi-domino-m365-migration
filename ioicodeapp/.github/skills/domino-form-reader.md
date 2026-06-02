---
name: domino-form-reader
description: |
  Use this skill whenever you need to read, extract, or analyse a Lotus/HCL Domino
  form that has been exported as a project "PDF" file. These files are NOT real PDFs -
  they are ZIP archives containing page JPEG screenshots and matching .txt extractions.
  This skill extracts: form/app name, all field names (Domino internal names), field
  types, sections, approval workflow logic, hidden fields, access-control roles, and
  routing logic. Trigger whenever a user asks to "read a form", "extract fields from a
  PDF", "analyse a Domino form", "document a form", "build a blueprint for a form", or
  any task that requires understanding an IOI Domino application form. Also trigger when
  processing files from /mnt/project/ that end in .pdf (they are Domino form containers).
---

# Domino Form Reader

## What this skill does

Reads IOI Domino application forms (stored as `.pdf` files in the project) and produces
a complete structured extraction: field inventory, workflow logic, hidden fields, and
access-control roles. These files are **ZIP archives**, not real PDFs.

**Persona:** You are a senior Domino migration analyst who has extracted hundreds of forms.
You never assume - you always verify against source evidence.

---

## Step 0 - Detect the format

Every project "PDF" is a ZIP containing:

```text
manifest.json          <- page count, dimensions, has_visual_content flags
1.jpeg, 2.jpeg, ...    <- full-page screenshot of each Domino form page
1.txt,  2.txt,  ...    <- text layer: field labels + Domino field names
```

**Quick detection:**

```bash
file /mnt/project/FORMNAME.pdf
# -> "Zip archive data ..."   <- confirmed Domino container
# -> "PDF document ..."       <- real PDF, use pdf-reading skill instead
```

---

## Step 1 - Extract the archive

```bash
APP="FORMNAME"          # no extension
mkdir -p /tmp/${APP}_form
cp /mnt/project/${APP}.pdf /tmp/${APP}_form/archive.zip
cd /tmp/${APP}_form && unzip archive.zip
```

Read the manifest to plan your work:

```bash
cat /tmp/${APP}_form/manifest.json
```

Key manifest fields:
- `num_pages` - total page count
- `pages[N].has_visual_content` - `true` means that page has tables/diagrams/rendered UI that the text layer may miss; you MUST visually read those page images.

---

## Step 2 - Read every text page

```bash
for i in $(seq 1 $(cat /tmp/${APP}_form/manifest.json | python3 -c "import sys,json;print(json.load(sys.stdin)['num_pages'])"))
do
  echo "=== PAGE $i ==="
  cat /tmp/${APP}_form/${i}.txt
done
```

The text format follows a consistent Domino pattern - see the **Parsing Guide** section
below for how to decode each line.

---

## Step 3 - Visually read pages with `has_visual_content: true`

For pages flagged `has_visual_content: true`, use `view` on the JPEG to capture
tables, approval grids, computed subforms, or checkbox sections that the text layer
misses:

```text
view /tmp/FORMNAME_form/2.jpeg
```

Visuals to watch for:
- Multi-column approval grids (Authority / Status / Date / Comment / Attachment)
- Dynamic subform sections that render conditionally
- Checkbox/radio button field lists
- Computed lookup tables

---

## Step 4 - Parse the text layer

### 4a. Form / App name

The first non-blank, non-page-number line of `1.txt` is the **form title** (e.g.,
`CHANGE CONTROL FORM`, `VPN ACCESS REQUEST`). If a section label immediately follows on
the next line, the title is everything before it.

### 4b. Sections

Lines in **ALL CAPS** or ending with `:-` or `)` delimit named sections:

| Pattern | Example |
|---------|---------|
| `A) INITIATION` | Section header A |
| `B) EVALUATION` | Section header B |
| `REQUESTOR'S SECTION` | Named section |
| `Hidden fields :-` / `Hidden Fields:-` / `HiddenFields:-` | **Hidden field section** (critical) |
| `For QA Use :-` / `FOR IT USE :-` | Role-restricted section |

### 4c. Field lines - label + Domino field name

Most field lines follow the pattern:

```text
Label Text : DominoFieldName
```

Or with value options embedded:

```text
Label : field1 , on [ field2 ]
```

Or multi-field (especially dates):

```text
Date : dtDown dtTimeDown
```

Or approval tables (multi-column):

```text
Req_1 deptowner1 datedept1 appcom2 attach_app CD
```

**Field name identification rules:**
- The Domino field name is typically the **last token after the colon** (or the
  rightmost identifiers on the line).
- Field names are camelCase, PascalCase, or short abbreviations: `dtDown`, `HODNAME`,
  `statustype`, `Rem`, `ISAdmin`.
- Labels are human-readable English phrases.
- If there is no colon, the entire line is likely static text or a section header.

### 4d. Approval block rows

Approval grid rows look like:

```text
<Authority label>   <ReqField> <NameField> <DateField> <CommentField> <AttachField> <EditorField>
```

Example:

```text
Division Head of Department Owner   Req_1 deptowner1 datedept1 appcom2 attach_app CD
```

Each token after the authority label is a separate Domino field. Map them left-to-right
as: Required flag | Name | Date | Comment | Attachment | Editor/section lock.

---

## Step 5 - Infer field types

Use Domino naming conventions to infer types (these are strong conventions IOI follows):

| Prefix / Pattern | Inferred Type |
|-----------------|---------------|
| `dt`, `Date`, `date` | Date / DateTime |
| `Time`, `time` | Time |
| `nm`, `Name`, `name` | Person / Text (name) |
| `lst`, `Lst` | Choice List / Lookup |
| `rb` | Radio Button |
| `txt`, `Txt` | Multi-line text |
| `att`, `Att`, `Attach` | File Attachment |
| `status`, `Status`, `status1..N` | Choice (workflow state) |
| `Req_1..N` | Required flag / Checkbox |
| `Editor`, `AEditor`, `FEditor` | Reader/Editor access list |
| `CA`, `CurrentAction` | Computed / Workflow routing |
| `IS`, `IS...`, `ISAdmin` | Role group (computed) |
| `HOD`, `HODNAME`, `HOD1..N` | Person (approver) |
| `CC`, `CopyTo`, `SendTo` | Mailing list / Person multi-value |
| `Rem`, `remarks`, `comment` | Multi-line text |
| `Lock` | Section lock (computed) |
| `isPCN`, `IsPCN`, `isXXX` | Boolean / Computed flag |
| `Year`, `Week`, `Curr...` | Computed numeric |
| `Doc...` | Document metadata |
| No prefix, short alpha | Text field (single line) |

---

## Step 6 - Extract hidden fields (access control & routing)

The hidden fields section (usually the final 1-2 pages) is the **most important** part
for migration. It exposes:

- **Roles / groups**: `ISAdmin`, `QAAdmin`, `SHEAdmin`, `IT`, `QA`, `SHE`, `ACMIT`,
  `PCNIT` - these become SharePoint groups or Dataverse security roles.
- **Editor lists**: `AEditor1..9`, `FEditor1..3`, `Editor1..9` - these control who can
  edit at each approval stage (map to `cr_approvalrecord` child table or SP group
  membership).
- **Routing state**: `CurrentAction`, `CA` - central workflow state machine field.
- **Section lock flags**: `Hide1`, `Hide2`, `Hide3`, `Hide4` - computed fields that
  control section visibility/editability; map to React state in Code Apps.
- **Computed mailing lists**: `CopyTo`, `HOD1_QA_CopyTo`, `QA_CopyTo`, `SendTo`,
  `RemTo` - become Power Automate email recipients.
- **INO / doc number**: `ReplyNo`, `CNO`, fields ending in `No`, `Year`+`Month`+`CNO`
  combos - these are auto-numbers; generate via Power Automate only (never in React).
- **Site routing**: `MailP_Mgr` (Penang), `MailJ_Mgr` (Johor) - site-specific
  notification groups.

---

## Step 7 - Identify workflow logic

Reconstruct the approval chain from:
1. Section headers in the text (e.g., `PRE-APPROVAL`, `FINAL APPROVAL`, `ACCEPTANCE OF
   IT MANAGER`)
2. The approval block rows (which roles appear, what fields they populate)
3. Hidden fields: `CurrentAction` values and `Hide1..N` flags
4. `Req_1..N` fields (required-flag per approver slot)
5. `Status`, `statustype`, `status1..N` fields (per-stage decisions)

**Common IOI approval patterns** (reference `/references/domino-patterns.md`):

| Pattern | Description | Signal |
|---------|-------------|--------|
| Pattern A - Simple 3-stage | Submit -> Review -> Approve | `SubmittedBy`, `ApprovedBy`, single `Status` |
| Pattern B - Multi-HOD chain | 3-9 HOD approver slots | `App1..9`, `deptowner1..N`, `Req_1..N` |
| Pattern C - Pre-approval + Final | Two-gate approval | `PRE-APPROVAL` + `FINAL APPROVAL` sections |
| Pattern D - Section locking | Sections lock after each gate | `Hide1..N` flags + `Lock` field |
| Pattern E - Marketing gate | QA -> SHE -> MKT chain | `MKTStatus`, `MKTHead`, `MKTHOD` |
| Pattern F - Log/Info (no approval) | No approval chain | No `Status`/`CurrentAction` in hidden fields |

---

## Step 8 - Mandatory fact check before output

**BEFORE generating any report**, you MUST run the following verification checklist. If any
check fails, do NOT output. Instead, return to the relevant step and re-extract.

| Check | How to Verify | Pass / Fail |
|-------|---------------|-------------|
| **ZIP structure confirmed** | `file` command shows "Zip archive data" | [ ] |
| **manifest.json read** | `num_pages` matches number of .jpeg files | [ ] |
| **All text pages read** | Each `N.txt` exists for 1..num_pages | [ ] |
| **All visual pages inspected** | Every page with `has_visual_content: true` had JPEG viewed | [ ] |
| **Form name extracted** | First non-blank line of 1.txt is NOT a number AND NOT "Page X" pattern | [ ] |
| **Hidden fields section found** | Page contains "Hidden fields", "HiddenFields", or similar | [ ] |
| **Approval chain identified** | At least one approval pattern matched | [ ] |
| **No contradictory fields** | Same Domino field name does not appear with two different types | [ ] |

**If all checks pass** -> proceed to Step 9 (Output).  
**If any check fails** -> state: "Fact check failed: [specific check]. Re-reading page X..."
and repeat the relevant extraction step.

---

## Step 9 - Output format

Always produce a structured markdown extraction with these sections:

```markdown
## Form: <APP NAME>
**Source file:** FORMNAME.pdf  
**Pages:** N  
**App pattern:** Pattern X - <description>

---

### Sections
| # | Section Name | Page |
|---|-------------|------|
| 1 | A) INITIATION | 1 |
...

---

### Field Inventory
| # | Label | Domino Field | Inferred Type | Section | Hidden? | Notes |
|---|-------|-------------|---------------|---------|---------|-------|
| 1 | Change Control No. | ChangeControlNo | Text (auto) | A) Initiation | No | INO field |
...

---

### Approval Chain
| Stage | Section | Authority | Req Field | Name Field | Status Field | Date Field | Comment Field |
|-------|---------|-----------|-----------|------------|-------------|-----------|--------------|
...

---

### Hidden Fields (Access Control & Routing)
| Domino Field | Label | Inferred Role/Purpose | M365 Mapping |
|-------------|-------|----------------------|-------------|
...

---

### Workflow Logic
- **CurrentAction values:** Draft -> ... -> Closed
- **Section locks:** Hide1=... / Hide2=...
- **Routing fields:** ...
- **Email lists:** ...

---

### M365 Architecture Notes
- **SharePoint list:** ...
- **Power Automate flows:** ...
- **Code App (React/TypeScript) sections:** ...
```

---

## Reference files

- `references/domino-patterns.md` - Full six-pattern guide with field signals and M365 mapping recommendations
- `references/field-type-map.md` - Extended Domino->SharePoint/Dataverse type conversion table

Read these when you need deeper context on specific patterns or field type mappings.

---

## Summary of refinement

| Item | Change |
|------|--------|
| **Form name extraction check** | Updated to: "First non-blank line of 1.txt is NOT a number AND NOT 'Page X' pattern" - prevents false passes on page headers. |
| **All other content** | Unchanged - retains all technical accuracy, persona, fact-check table, and Code App mapping. |

This skill is now **production-grade and ready to deploy**.
