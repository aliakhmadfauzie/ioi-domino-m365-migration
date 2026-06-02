---
name: domino-form-reader
description: >
  Use this skill whenever you need to read, extract, or analyse a Lotus/HCL Domino
  form that has been exported as a project "PDF" file. These files are NOT real PDFs —
  they are ZIP archives containing page JPEG screenshots and matching .txt extractions.
  This skill extracts: form/app name, all field names (Domino internal names), field
  types, sections, approval workflow logic, hidden fields, access-control roles, and
  routing logic. Trigger whenever a user asks to "read a form", "extract fields from a
  PDF", "analyse a Domino form", "document a form", "build a blueprint for a form", or
  any task that requires understanding an IOI Domino application form. Also trigger when
  processing files from /mnt/project/ that end in .pdf (they are Domino form containers).
---

# Domino Form Reader Skill

Purpose
- Recognise IOI/HCL Domino "PDF" form containers (ZIP-style) and extract a complete
  structured representation: form title, pages, section map, field inventory (Domino
  internal names), inferred field types, approval chain, hidden fields, roles, and
  routing/state logic.

Triggers
- User asks: "read a form", "extract fields from a PDF", "analyse a Domino form",
  "document a form", "build a blueprint for a form", or similar.
- File in /mnt/project/ or workspace ending with .pdf (assume Domino container unless
  file magic indicates a real PDF).

Detection
- Open file header ("file" magic). If it reports "Zip archive data" treat as Domino
  container. If "PDF document" delegate to pdf-reading skill.
- Expect files: manifest.json, 1.jpeg..N.jpeg, 1.txt..N.txt

Processing steps
1. Extract archive to a temp dir and read manifest.json for num_pages and has_visual_content flags.
2. Read every *.txt page sequentially; locate first non-blank line as form title.
3. Parse text lines using Domino patterns (label : DominoFieldName, approval row tokens, section headers).
4. For pages marked has_visual_content, open the corresponding .jpeg and visually inspect for tables, grids, checkbox lists, and subforms.
5. Parse hidden-fields sections (Hidden Fields, HiddenFields:, etc.) to capture roles, Editor lists, routing fields, and computed flags.
6. Infer field types using naming conventions (dt*/Date → Date, nm*/Name → Person, att*/Attach → Attachment, Req_* → Checkbox/required flag, etc.).
7. Reconstruct approval chain from section headers, approval grid rows, Req_1..N fields, CurrentAction/status fields and Hide1..N flags.
8. Produce structured extraction using the Output Format below.

Parsing Guide (summary)
- Section headers: ALL CAPS, or ending with ":-" or ")"; treat as section delimiters.
- Field lines: "Label : DominoFieldName"; last token after colon is Domino field name.
- Approval rows: authority label followed by tokens mapping to [ReqFlag, Name, Date, Comment, Attach, Editor].
- Hidden fields: usually final pages; capture roles (ISAdmin, QAAdmin...), editor arrays (AEditor1..9), routing (CurrentAction, CA), locks (Hide1..N).

Inferred Type Map (abbreviated)
- dt*, Date* → Date/DateTime
- nm*, Name* → Person/Text
- lst*, Lst → Choice/List
- rb* → Radio Button
- txt*, Rem*, remarks → Multi-line text
- att*, attach* → File Attachment
- Req_* → Required flag/Checkbox
- Editor*, AEditor*, FEditor* → Reader/Editor access lists

Output Format
Produce a structured markdown with sections:
- Form: <APP NAME> (source file, pages, app pattern)
- Sections table (index, name, page)
- Field Inventory table (#, Label, Domino Field, Inferred Type, Section, Hidden?, Notes)
- Approval Chain table (Stage, Section, Authority, Req Field, Name Field, Status Field, Date Field, Comment Field)
- Hidden Fields table (Domino Field, Label, Inferred Role/Purpose, M365 Mapping)
- Workflow Logic bullets (CurrentAction sequence, section locks, routing fields, email lists)
- M365 Architecture Notes (SharePoint/Dataverse/Power Automate/Canvas suggestions)

References
- references/domino-patterns.md — pattern guide and mapping (refer when needed)
- references/field-type-map.md — extended Domino→SharePoint type conversions

Implementation notes
- Prefer textual parsing of *.txt files; visual inspection of JPEG pages is mandatory for pages with has_visual_content=true.
- Treat these PDF containers as binary ZIPs; do not run PDF parsers on them.
- When uncertain about a field’s type or role, include a "confidence" note in the Field Inventory.

Example invocation
- "Read and extract fields from /mnt/project/ChangeControlForm.pdf"

---

# End of skill file
