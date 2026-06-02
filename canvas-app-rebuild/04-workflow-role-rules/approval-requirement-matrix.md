# Approval Requirement Matrix

> Defines which of the 361 forms require approval workflow and which do not.
> Source: MASTER_WORKFLOW_REGISTER.md + MASTER_POWERAPPS_SPEC_REGISTER.md
> Last updated: 2026-06-02

---

## Summary

| Category | Count |
|---|---|
| Approval Required: YES | 347 |
| Approval Required: NO (confirmed) | 9 |
| Approval Required: UNKNOWN (do not build approval yet) | 5 |
| Total | 361 |

### Forms Confirmed as NO APPROVAL Required

These forms should be built WITHOUT approval workflow screens. They use simple Draft → Submitted → Completed flow.

| Form Code | Dept | Evidence | Build Instruction |
|---|---|---|---|
| ITSSR | IT | `docs/04_WORKFLOW_APPROVAL_RULES.md` — service desk ticket system. No approver role exists. | Build scrNewRequest + scrFormList + scrViewRequest. NO cmpWorkflowActionPanel. |
| HI | IT | `docs/04_WORKFLOW_APPROVAL_RULES.md` — record-keeping form. No approver fields in code. | Build scrNewRequest + scrFormList + scrViewRequest. Admin-only edit after submission. |
| DCALOG | IT | Log entry form pattern. No approval signals in TSX. | Build scrNewRequest + scrFormList + scrViewRequest. |
| ISGDOC | IT | Document upload/record form. No approval signals in TSX. | Build scrNewRequest + scrFormList + scrViewRequest. |
| ITINFO | IT | Information notice form. No approval signals in TSX. | Build scrNewRequest + scrFormList + scrViewRequest. |
| ITDR2 | IT | Report submission form. No approval signals in TSX. | Build scrNewRequest + scrFormList + scrViewRequest. |
| ITDAILYRPT | IT | Daily report log. No approval signals in TSX. | Build scrNewRequest + scrFormList + scrViewRequest. |
| ITSC | IT | Server checklist record-keeping. No approval signals in TSX. | Build scrNewRequest + scrFormList + scrViewRequest. |
| TRNMAN | IT | Training manual management. No approval signals in TSX. | Build scrNewRequest + scrFormList + scrViewRequest. |

---

## Forms with UNKNOWN Approval Status (DO NOT BUILD approval sections)

Build these forms WITHOUT approval screens. Add approval later when confirmed by form owner.

| Master # | Site | Form Code | Application Name | Action Required |
|---|---|---|---|---|
| 21 | Johor | HARDINVE | PanCen - Hardware Inventory | Confirm with IT dept — build list + data entry only |
| 145 | Penang | EPHR | Employee Personal Health Record | Confirm with HR — likely no approval needed |
| 183 | Penang | ITSRVCHK | IT Server Checklist 2025 | Confirm with IT |
| 350 | Penang | TRAINATT | Training Attendance | Confirm with T&D |
| 356 | Penang | CONTRAGREE | Contractor/Vendor Agreement | Confirm with WH/PUR |

---

## Forms Confirmed as Requiring Approval (Selected by Dept)

### Finance (FIN) — All require approval

| Master # | Site | Form Code | Approval Chain Evidence |
|---|---|---|---|
| 2 | Johor | CAR | `approve (9), hod (8), approval (4)` — 4-stage: HOD → FIN Manager → COO → ED |
| 3 | Johor | CMF_A | `approve (6), approved (5)` |
| 4 | Johor | INSUCLAI | `approve (10), hod (10), approved (8)` |
| 140 | Penang | CMF | `approved (5), approve (5)` |
| 141 | Penang | RSES | `approver (3), reject (2)` |
| 143 | Penang | CAR | `hod (14), approve (10), approved (7)` — 4-stage |
| 144 | Penang | EARF | `approve (5), review (4)` |

### HR — All require approval

| Master # | Site | Form Code | Approval Chain Evidence |
|---|---|---|---|
| 7 | Johor | BSD | `hod (7), status (3)` |
| 9 | Johor | CWR | `hod (14), approval (8), verification (4)` |
| 12 | Johor | NDF | `hod (10), approve (6), reject (6)` |
| 13 | Johor | SR | `reject (36), approve (24), hod (6)` |
| 147 | Penang | AWHR | `approve (2), reject (2), hod (1)` — CONFIRMED 3-stage |
| 149 | Penang | EEN | `hod (19), approved (7)` |
| 158 | Penang | CWR | `approved (4), hod (3)` |

### IT — Approval Required (CONFIRMED from workflow/code evidence)

| Master # | Site | Form Code | Approval Chain Evidence | Status |
|---|---|---|---|---|
| 173 | Penang | EAF | `docs/04_WORKFLOW_APPROVAL_RULES.md` — 5-stage: Submitter → HOD → COO/Director → IT Manager → IT Provisioning | CONFIRMED |
| — | Penang | NIR | 4-stage: Submitter → HOD → Notes Admin → IT Hardware | CONFIRMED |
| — | Penang | RS | 2-stage + conditional ED: Submitter → IT Processing → ED (conditional) | CONFIRMED |
| 188 | Penang | SFAR | 5-stage: Submitter → IT PIC → IT Verifier → Folder Owner → HOD → IT Action | CONFIRMED |
| 179 | Penang | UR | Multi-stage: Submitter → HOD → SAP Module Owner → Bank Module Owner → IT Checker | CONFIRMED |
| 175 | Penang | PRF | 12-section multi-stage IT program request approval | CONFIRMED |
| 177 | Penang | SAPAMR | Review cycle: Prepared → Verified → Approved (TBV/TBA) | CONFIRMED |
| — | Penang | SAPCA | Access approval: Request → BASIS → Config Close → Completion | CONFIRMED |
| — | Penang | SAPCR | Multi-stage: Submitter → BPO → PM → ABAPER → Transport | CONFIRMED |
| — | Penang | SAPTR | 2-stage: IED→IEQ, IEQ→IEP transport with key user sign-off | CONFIRMED |
| — | Penang | IOIPOL | 3-column authority sign-off (Issuers/Preparers + Endorsers/Approvers) | CONFIRMED |
| 185 | Penang | SAPSLCF | Storage location creation with ISG action + production use | TSX_INFERENCE — needs code review |
| 22 | Johor | SAPDISARECO | SAP display access record | TSX_INFERENCE — needs code review |
| — | Penang | SAPDRP | DRP with 3-column sign-off | TSX_INFERENCE — needs code review |
| — | Penang | INTUATSOF | 15 KU + 10 BPO sign-off | TSX_INFERENCE — needs confirmation |
| — | Penang | SILOUATSOF | 5 KU + 3 BPO sign-off | TSX_INFERENCE — needs confirmation |

### IT — NO Approval Required (CONFIRMED — simple submit→complete)

| Form Code | Evidence | Build Instruction |
|---|---|---|
| ITSSR | Service desk ticket system. No approver role exists. | No approval screens needed |
| HI | Record-keeping form. No approver fields in code. | No approval screens needed |
| DCALOG | Log entry form. | No approval screens needed |
| ISGDOC | Document upload/record. | No approval screens needed |
| ITINFO | Information notice. | No approval screens needed |
| ITDR2 | Report submission. | No approval screens needed |
| ITDAILYRPT | Daily report log. | No approval screens needed |
| ITSC | Server checklist. | No approval screens needed |
| TRNMAN | Training manual. | No approval screens needed |
| IAL (ITEVT) | Legacy event log — custom component. | No approval screens needed |
| SRL (SVRREBOOT) | Legacy server reboot log — custom component. | No approval screens needed |

### QA (Johor) — All require approval (80 forms, selected)

| Master # | Form Code | Approval Chain Evidence |
|---|---|---|
| 73 | CHANCONT | `status (10), submitted (4)` |
| 77 | INTECORRACTI | `status (85), review (3)` |
| 78 | ISSUOFRECO | `status (14), approved (10)` |
| 65 | EMERPRODRECA | `status (95), approve (6)` |

> Full list: All 80 QA forms in MASTER_WORKFLOW_REGISTER.md show approval signals.

---

## Canvas Implementation Rule

For forms with `Approval Required: YES`:
- Include cmpWorkflowActionPanel on scrViewRequest
- Include cmpApprovalProcess screen access for approvers
- Include ApprovalHistory write on every action
- Show approval section(s) in scrViewRequest based on current stage

For forms with `Approval Required: UNKNOWN`:
- Build scrNewRequest + scrFormList + scrViewRequest (read-only)
- Do NOT include cmpWorkflowActionPanel
- Do NOT include ApprovalHistory writes
- Add note in `11-risk-and-issues/issue-log.md` for each unknown form
