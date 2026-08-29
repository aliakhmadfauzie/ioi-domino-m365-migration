# Source Analysis Rules

> Rules governing the Domino PDF source analysis pipeline. All agents must follow these rules when analyzing PDF forms, extracting fields, classifying evidence, and designing M365 targets.

## Core Principles

1. **Evidence-first**: Every claim must trace to visible PDF evidence, a page number, or a form section.
2. **No invention**: Do not invent fields, workflows, approvers, status values, or validation rules.
3. **Explicit classification**: Use Clearly Found, Inferred, Unknown, or Needs Human Confirmation for every claim.
4. **Conservative approval**: Signature boxes alone do not prove approval routing. Classify conservatively.
5. **Exact extraction**: Choices, labels, and field text must be extracted exactly as shown in the PDF.

## Evidence Classification

| Classification | Meaning | When to Use |
|---|---|---|
| **Clearly Found** | Directly visible in the PDF | Label, field, choice, signature box, routing instruction, or status is explicitly shown. |
| **Inferred** | Strongly suggested but not stated | Pattern strongly implies behavior (e.g., approver section exists but routing rules are not shown). |
| **Unknown** | Not enough evidence | Cannot determine from visible PDF content alone. |
| **Needs Human Confirmation** | Wrong interpretation risks data/security | Approval routing, role assignments, conditional visibility, or security-sensitive behavior. |

## Field Extraction Rules

1. Extract field labels exactly as they appear in the PDF.
2. Suggest internal field names using camelCase derived from the label.
3. Infer data type only when the PDF label, format, or context makes it reasonable.
4. Mark Required only when the PDF explicitly marks a field as mandatory (asterisk, required label, or instructions).
5. Record exact choice text where dropdown, radio, or checkbox options are visible.
6. If choices are not visible, mark `Choices = Unknown`.
7. Identify repeating rows/tables as Child List Candidates.
8. Identify attachment areas as Attachment fields.

## Section Classification

Each visible section must be classified by role:

| Section Type | Indicators |
|---|---|
| **Requester/Submitter** | Fields for person making the request (name, department, date, contact). |
| **Approver** | Signature blocks, approval stamps, "Approved By", "Reviewed By" labels. |
| **Admin/Process** | Fields for administrative processing (date stamps, reference numbers, process checkboxes). |
| **Information** | Display-only or reference information sections. |
| **Line Items** | Repeating rows for items, details, materials, or costs. |

## Workflow & Approval Rules

1. Do **NOT** classify approval as Required solely because a signature box exists.
2. If an approver section has labeled roles (e.g., "HOD Approval", "IT Manager Review"), mark `Approval Required = Inferred`.
3. If routing rules are visible (e.g., "If amount > 5000, route to Director"), mark `Routing Logic = Clearly Found`.
4. If no routing instructions are visible, mark `Routing Logic = Unknown`.
5. Status fields visible in the PDF should be extracted as status values.
6. If a workflow diagram or process flow is visible, extract all stages.

## SharePoint Design Rules

1. Recommend Parent-Child lists when the form has header data + repeating line items.
2. Recommend a single list when the form is a flat set of fields.
3. Do not invent SharePoint columns that do not map to a source field.
4. Use `MainDB_{Department}` for the parent list naming convention.
5. Use `MainDB_{Department}_Ext_{Purpose}` for child/extension lists.
6. Respect SharePoint column limits (max ~276 columns per list for most types).
7. Mark lookup fields when a field references another list.
8. Mark person fields when a field captures a user/approver identity.

## Power Apps Design Rules

1. Map each form section to a screen or tab.
2. Recommend control types based on field data type and choices.
3. Specify visibility rules based on role and status evidence.
4. Specify validation based on required fields and visible validation rules.
5. Do not invent submit behavior beyond what the PDF shows.

## Batch Rules

1. Each batch analyzes 3 PDFs by default.
2. Only select items with `Analysis Status = Not Started` and `File Type = PDF`.
3. Create one requirement file per form extracted (a PDF may contain multiple forms).
4. Update all registers after each batch.
5. Create a batch summary with counts and reconciliation.
6. Run quality review after each batch before proceeding.

## Register Update Rules

1. Every extracted form must have a row in `FORM_REQUIREMENT_REGISTER.md`.
2. Every unique field must have an entry in `GLOBAL_FIELD_DICTIONARY.md`.
3. Every workflow finding must have a row in `WORKFLOW_REGISTER.md`.
4. Every role/section rule must have a row in `ROLE_SECTION_RULE_REGISTER.md`.
5. Every form must have a row in `SHAREPOINT_LIST_DESIGN_REGISTER.md`.
6. Every form must have a row in `POWERAPPS_BUILD_SPEC_REGISTER.md`.
7. `PDF_FORM_INVENTORY.md` must be updated after each PDF is analyzed.
