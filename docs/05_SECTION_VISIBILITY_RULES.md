# Section Visibility Rules — Domino → M365 Migration

> **Purpose**: Document which form sections are visible/editable per user role and submission status.
> **Rule**: Section visibility must be discovered per form, per role, per status. Do not invent visibility logic.

---

## How to Read This Document

Each form has its sections listed with:
- **Visible To**: Which roles can see the section (Submitter, Approver, Admin, All)
- **Visible When**: Status condition that makes the section visible
- **Editable?**: Whether the section is editable in this state
- **Evidence**: Source file:line where this rule is implemented or derived
- **Issue**: Any concern about the rule (missing logic, contradiction, unknown)

---

## Section Visibility Patterns

### Common Patterns Found in IOI Codebase

| Pattern | Description | Example Forms |
|---|---|---|
| **Draft-Only Edit** | Section editable only when status = Draft by submitter | All forms |
| **Approver Panel** | Approval section visible only to approvers when status = Submitted | EAF, SAPCR, NIR, RS |
| **Admin Override** | Admin can always see and edit all sections | All forms |
| **Submitter Read-Only** | Submitter sees read-only after submission | All forms |
| **Status-Gated Section** | Section appears only at specific workflow stages | EAF (HOD → COO transition) |
| **Role-Gated Field** | Individual fields visible/hidden based on role | EAF (isPCN flag changes approver) |
| **Conditional Approval Path** | Different sections show based on field value | EAF (PCN vs non-PCN routing) |

---

## Per-Form Section Visibility

### EAF — External Access Form (VPN & Citrix)

| Section | Visible To | Visible When | Editable? | Evidence | Issue |
|---|---|---|---|---|---|
| **Requester Information** | All | Always | Only in Draft by submitter | `src/pages/it/forms/eaf/new.tsx` | ✅ |
| **Access Details** (System, Justification, Type) | All | Always | Only in Draft by submitter | `src/pages/it/forms/eaf/new.tsx` | ✅ |
| **Dept Head Approval** | HOD, Admin | Status = Submitted, HOD_Rejected | Editable by HOD only | `src/pages/it/forms/eaf/[id].tsx` | ✅ |
| **COO/Director Approval** | COO/Director, Admin | Status = HOD_Approved | Editable by COO/Director only | `src/pages/it/forms/eaf/[id].tsx` | ✅ |
| **IT Configuration** | IT Config Team, Admin | Status = COO_Approved | Editable by IT Config only | `src/pages/it/forms/eaf/[id].tsx` | ⚠️ Needs code confirmation |
| **CC List & Reminders** | All | Always (read-only after submission) | In Draft by submitter | `src/pages/it/forms/eaf/new.tsx` | ✅ |
| **Attachments** | All | Always | In Draft by submitter; view-only after | `src/pages/it/forms/eaf/new.tsx` | ✅ |
| **Comments / Remarks** | All | Always | Submitter in Draft; Approvers at their stage; Admin always | `src/pages/it/forms/eaf/[id].tsx` | ✅ |
| **Workflow Timeline** | All | Status ≠ Draft | N/A (read-only display) | `src/pages/it/forms/eaf/[id].tsx` | ✅ |

### ITSSR — IT Support & Service Request

| Section | Visible To | Visible When | Editable? | Evidence | Issue |
|---|---|---|---|---|---|
| **Request Details** (Category, Description, Priority) | All | Always | Only in Draft by submitter | `src/features/itssr/itssr-app.tsx` | ✅ |
| **Contact Information** | IT PIC, Admin | Always | Submitter in Draft; IT PIC can update | `src/features/itssr/itssr-app.tsx` | ✅ |
| **Assignment** | IT PIC, Admin | Status = Submitted | Editable by IT PIC | `src/features/itssr/itssr-app.tsx` | ✅ |
| **Resolution** | All | Status = InProgress, Resolved | Editable by IT PIC only | `src/features/itssr/itssr-app.tsx` | ✅ |
| **Acceptance** | Submitter, Admin | Status = Resolved | Editable by submitter (Accept/Return) | `src/features/itssr/itssr-app.tsx` | ✅ |
| **Satisfaction Rating** | Submitter | Status = Closed | Editable by submitter after closure | `src/features/itssr/itssr-app.tsx` | ⚠️ Needs code confirmation |
| **Attachments** | All | Always | Submitter in Draft; IT PIC can add | `src/features/itssr/itssr-app.tsx` | ✅ |
| **Documents** | All | Always | Submitter in Draft; IT PIC can add | `src/features/itssr/itssr-app.tsx` | ✅ |
| **Comments / Remarks** | All | Always | Submitter in Draft; IT PIC always; Admin always | `src/features/itssr/itssr-app.tsx` | ✅ |

### HI — Hardware Inventory

| Section | Visible To | Visible When | Editable? | Evidence | Issue |
|---|---|---|---|---|---|
| **Asset Information** (Tag, Type, Serial, Location) | All | Always | In Draft by submitter; Admin always | `src/pages/it/forms/hi/new.tsx` | ✅ |
| **Hardware Specs** (CPU, RAM, Storage, OS) | All | Always | In Draft by submitter; Admin always | `src/pages/it/forms/hi/new.tsx` | ✅ |
| **Purchase Details** (Price, Vendor, Date, Warranty) | All | Always | In Draft by submitter; Admin always | `src/pages/it/forms/hi/new.tsx` | ✅ |
| **Assignment** (Current User, Department, Location) | All | Always | In Draft by submitter; Admin always | `src/pages/it/forms/hi/new.tsx` | ✅ |
| **Notes** | All | Always | In Draft by submitter; Admin always | `src/pages/it/forms/hi/new.tsx` | ✅ |

---

## Remaining IT Forms — Section Visibility Status

| Form Code | Status | Notes |
|---|---|---|
| SAPCR | ⚠️ Pending audit | Multi-stage: Submitter → BPO → IT Manager. Sections need code review. |
| SAPAMR | ⚠️ Pending audit | Review cycle with TBV/TBA approval stages. |
| SAPTR | ⚠️ Pending audit | Basis/Admin approval stages. |
| SAPCA | ⚠️ Pending audit | Access approval workflow. |
| SAPDRP | ⚠️ Pending audit | Limited code evidence. |
| SAPSLCF | ⚠️ Pending audit | Storage location request — `txtHDocStatus` based routing. |
| NIR | ⚠️ Pending audit | Multi-stage: Submitter → HOD → IT Admin. |
| RS | ⚠️ Pending audit | Submitter → IT Manager approval → IT action. |
| UR | ⚠️ Pending audit | Limited code evidence. |
| ITSC | ⚠️ Pending audit | Record-keeping form — likely simple visibility. |
| SFAR | ⚠️ Pending audit | Folder access approval workflow. |
| DCALOG | ⚠️ Pending audit | Simple log entry form. |
| IOIPOL | ⚠️ Pending audit | Policy acknowledgment. |
| ISGDOC | ⚠️ Pending audit | Document upload. |
| ITINFO | ⚠️ Pending audit | Information record. |
| ITDR / ITDR2 | ⚠️ Pending audit | Report submission forms. |
| ITDAILYRPT | ⚠️ Pending audit | Daily log form. |
| PRF | ⚠️ Pending audit | Multi-stage IT program request approval. |
| INTUATSOF / SILOUATSOF | ⚠️ Pending audit | Limited evidence. |
| TRNMAN | ⚠️ Pending audit | Training manual management. |
| ITEVT | ⚠️ Legacy — custom component | Not using DynamicForm. |
| SVRREBOOT | ⚠️ Legacy — custom component | Not using DynamicForm. |
| PWDRESET | ⚠️ Legacy schema only | Superseded by RS. |
| MRF | ⚠️ Pending audit | Separate module (`src/forms/mrf/`). |
| MPSPRN | ⚠️ Pending audit | Limited evidence. |

---

## Section Visibility Discovery Checklist

For each new form being audited, check:

- [ ] Form schema JSON (`src/form-schemas/[FORMCODE].json`) — `sections` array, `visible` conditions, `editable` conditions
- [ ] Page code — `new.tsx` (create), `[id].tsx` (detail/edit)
- [ ] Hook logic — `useDynamicForm`, `useApprovalWorkflow`, `useIntegratedWorkflow`
- [ ] Role checks — `useCurrentRole()`, `useAutoRole()`, role-based conditional rendering
- [ ] Workflow config — `src/config/workflow-routing.ts`, `module-workflows.ts`
- [ ] Status checks — `if (status === 'Submitted')`, `isDraft`, `isSubmitted`
- [ ] UI component visibility props — `visible`, `hidden`, `disabled` attributes on form sections
- [ ] Domino routing rules — `ioicodeapp/IT_Routing_Rules_Documentation.md` (section access formulas)
- [ ] Does section visibility change based on `isPCN` or similar routing flags?

If any of these cannot be determined from code evidence, mark:
> **Section visibility: UNKNOWN — source confirmation required.**

---

## Related Documents

- `docs/04_WORKFLOW_APPROVAL_RULES.md` — Per-form approval classification
- `docs/08_AUDIT_TEMPLATE.md` — Section visibility table template
- `docs/09_BATCH_DEVELOPMENT_PLAN.md` — Batch schedule for auditing remaining forms
- `ioicodeapp/IT_Routing_Rules_Documentation.md` — Domino section access formulas
