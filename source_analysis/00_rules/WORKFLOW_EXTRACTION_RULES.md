# Workflow Extraction Rules

> Rules for extracting workflow, approval, routing, and status information from Domino PDF forms.

## Core Principle

**Do not assume approval is required. Do not assume approval is not required.**
Only classify based on visible PDF evidence or verified DXL/XML analysis source.

## Approval Detection

### Clearly Found Approval
Approval is `Clearly Found` when evidence explicitly shows:
- A labeled approval section with named roles (e.g., "HOD Approval", "Manager Review")
- Approval routing instructions (e.g., "Route to Finance if amount > 5000")
- A workflow diagram showing approval stages
- Text stating "This form requires approval by..."
- Status fields showing progression through approval stages (e.g., Draft → Pending HOD → Pending Finance → Approved)
- Verified Domino DXL/XML analysis with explicit workflow state machine

### Inferred Approval
Approval is `Inferred` when evidence shows:
- Signature blocks with role labels but no routing instructions
- Sections labeled "For Office Use Only" or "Approval Section"
- Status fields with values that suggest review/approval states
- References to "approver" or "approval" without detailed routing

### Unknown Approval
Approval is `Unknown` when:
- No signature blocks, approval sections, or status fields are visible
- The form appears to be a simple log, checklist, or information record
- The PDF or analysis evidence is too low quality to determine

## Routing Logic Extraction

Document routing logic only when:
1. Conditional rules are visible (e.g., "If amount > X, route to Y")
2. Sequential stages are labeled (e.g., "Stage 1: HOD → Stage 2: Finance → Stage 3: Director")
3. Role-based routing is specified (e.g., "Department Head for departmental requests")
4. Parallel routing is indicated (e.g., "Simultaneously notify IT and Finance")
5. A verified Domino agent or DXL formula shows routing logic

## Status Value Extraction

Extract status values when:
1. A status field with dropdown values is visible in the PDF
2. Workflow stage labels are shown in the PDF or DXL analysis
3. Document state values appear (e.g., "Draft", "Submitted", "Approved", "Rejected")
4. Domino `CurrentAction` or status fields are documented in DXL analysis

Record status values in order if sequence is visible.

## Signature Block Handling

A signature block consists of:
- Signature line/box
- Name label (printed name)
- Date label
- Role/title label
- Comments (optional)

For each signature block, record:
- Role label (e.g., "Requestor", "HOD", "Finance Manager")
- Whether date is captured
- Whether comments box exists

**Critical Rule**: Signature blocks alone do NOT prove that the form routes through those signatories in sequence. Only record routing when routing instructions are visible in the PDF or verified DXL analysis.

## Notification Detection

A notification is `Clearly Found` when evidence shows:
- Email notification instructions in the PDF
- CC/BCC fields
- Distribution list references
- "Send copy to" fields
- Automated notification text
- Verified Domino `@MailSend` agents in DXL analysis

## Workflow Diagram Extraction

If a flowchart or process diagram is visible:
1. Extract all stage labels in order.
2. Record decision diamonds and their conditions.
3. Note parallel branches.
4. Record start and end states.

## Confidence Assignment for Workflow

| Classification | When to Use |
|---|---|
| `Clearly Found` | Routing rules, stages, or approval instructions are explicitly visible in PDF or verified DXL. |
| `Inferred` | Signature blocks or approval sections exist but routing details are not shown. |
| `Unknown` | No workflow evidence is visible in any source. |
| `Needs Human Confirmation` | Workflow interpretation could affect compliance, security, or financial controls. |

## Multi-Form PDF Handling

If a PDF contains multiple forms:
1. Analyze each form's workflow independently.
2. Do not assume forms share the same approval pattern.
3. Record each form's workflow in its own requirement file.

## Evidence Chain Rule

When direct PDF viewing is unavailable and analysis relies on intermediate sources (e.g., DXL analysis, PDF UI inventory, central form reference):
1. Cite the intermediate source explicitly in the Evidence column.
2. Mark workflow claims derived from DXL as `Clearly Found` only if the DXL analysis is verified.
3. Mark workflow claims derived from PDF UI inventory as `Inferred` unless the inventory explicitly states the workflow stages.
4. Never mark a workflow as `Clearly Found` based solely on a form name or general knowledge.
