# AUD-039 - IOIP Audit

## 1. Basic Information

| Item | Detail |
|---|---|
| Audit ID | AUD-039 |
| Form Code | IOIP |
| Form Name | IOIP Page Route |
| Department | IT |
| Approval Classification | Required |
| Audit Status | Verified |
| Risk | High |
| Last Reviewed | 2026-06-03 |

## 2. Source Evidence

- Source: Repository source discovery and register evidence
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL
- Code/formula/section: Source relationship recorded for IOIP
- What was found: IOIP page route implements IOIPOL evidence already audited as AUD-006; DEC-2026-009 resolves IOIPOL to the active IOIP implementation for UAT.
- Why it matters: IOIP/IOIPOL ownership no longer blocks UAT build readiness for the policy module.

## 3. App Files Reviewed

| File path | Purpose Reviewed | Evidence Result |
|---|---|---|
| `src/pages/it/forms/ioip/index.tsx`; `src/pages/it/forms/ioip/new.tsx`; `src/pages/it/forms/ioip/detail.tsx` | App route or implementation evidence | Verified as the active IOIPOL policy implementation for UAT. |

## 4. UI/Form Fields

| Field/Section | Source Evidence | App Evidence | Status |
|---|---|---|---|
| Form fields | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL | `src/pages/it/forms/ioip/index.tsx`; `src/pages/it/forms/ioip/new.tsx`; `src/pages/it/forms/ioip/detail.tsx` | Verified for UAT ownership and approval path; live tenant readback not run. |

## 5. SharePoint Field Mapping

| App/source field | SharePoint list | Column display/internal name | Evidence | Mapping status |
|---|---|---|---|---|
| Form fields | MainDB_IT; MainDB_IT_Ext_Policy | Policy extension fields | `audit/build_reviews/FIX-029_IOIPOL_APPROVAL_PERSISTENCE_RE_AUDIT.md` | Verified for app-side UAT path |

Notes:

- No SharePoint columns were invented.
- If a schema is named, it is evidence that a list schema exists, not proof that every app field is correctly mapped.

## 6. Read Logic

- Source: App route/source discovery
- File path: `src/pages/it/forms/ioip/index.tsx`; `src/pages/it/forms/ioip/new.tsx`; `src/pages/it/forms/ioip/detail.tsx`
- Code/formula/section: Route/read evidence for IOIP
- What was found: Canonical detail routing opens the dedicated IOIP detail page and reads linked policy extension data by parent ID.
- Why it matters: The active IOIP route is tied to the confirmed IOIPOL policy implementation for UAT.

## 7. Write Logic

- Source: App route/source discovery
- File path: `src/pages/it/forms/ioip/index.tsx`; `src/pages/it/forms/ioip/new.tsx`; `src/pages/it/forms/ioip/detail.tsx`
- Code/formula/section: Submit/write evidence for IOIP
- What was found: Submit writes pending policy approval state and detail actions persist parent action history plus policy extension approval fields.
- Why it matters: The active IOIP route now has verified app-side workflow write behavior for the UAT policy module.

## 8. Validation Rules

| Rule | Evidence | Status |
|---|---|---|
| Required fields | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL | Unknown |
| Choice/person/date validation | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL | Unknown |

## 9. Section Visibility Rules

| Section | Visibility/editability rule | Evidence | Status |
|---|---|---|---|
| Form sections | Unknown | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL | Unknown |

## 10. Approval Workflow

| Approval Classification | Trigger/condition | Evidence | Status |
|---|---|---|---|
| Required | Confirmed for UAT app path | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL; `audit/build_reviews/FIX-029_IOIPOL_APPROVAL_PERSISTENCE_RE_AUDIT.md` | Verified |

## 11. Draft/Save/Submit/Edit/View Behavior

| Behavior | Evidence | Status |
|---|---|---|
| Draft | Not used as the submit-start state for UAT policy flow | Verified |
| Save | Not changed in this re-audit | Not assessed |
| Submit | Starts pending policy approval through IOIP implementation | Verified |
| Edit | Not changed in this re-audit | Not assessed |
| View | Canonical IOIP detail route opens the dedicated policy detail page | Verified |

## 12. Issues Found

### AUD-B005-IOIP-001 - IOIP and IOIPOL ownership unresolved

- Source: Audit evidence review
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL; `src/pages/it/forms/ioip/index.tsx`; `src/pages/it/forms/ioip/new.tsx`; `src/pages/it/forms/ioip/[id].tsx`
- Code/formula/section: Source/app/SharePoint mapping for IOIP
- What was found: IOIP page route implements IOIPOL policy for UAT under DEC-2026-009; canonical detail routing and approval persistence were re-audited under AUD-006/FIX-029.
- Why it matters: IOIP and IOIPOL ownership no longer blocks UAT build decisions; IOIP remains the active implementation for the policy module.


## 12a. Fix Backlog Reference

| Fix ID | Issue ID | Priority | Severity | Status |
|---|---|---|---|---|
| FIX-079 | AUD-B005-IOIP-001 | P4 - Documentation or minor cleanup | High | Verified |

## 13. Risk Assessment

Risk: High

Risk justification:

- Evidence: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IOIP.pdf`; related AUD-006 IOIPOL; `src/pages/it/forms/ioip/index.tsx`; `src/pages/it/forms/ioip/new.tsx`; `src/pages/it/forms/ioip/[id].tsx`; Unknown
- Impact: IOIP is the active IOIPOL policy implementation for UAT; live SharePoint readback remains outside this re-audit.
- Recommended disposition: Verified for UAT alias ownership. Use AUD-006/FIX-029 for policy workflow evidence.

## 14. Final Decision

Status: Verified

Ready for Build: Yes - app-side UAT path verified; live tenant readback not run

Final notes: IOIP/IOIPOL ownership resolved by DEC-2026-009 and re-audited in `audit/build_reviews/FIX-029_IOIPOL_APPROVAL_PERSISTENCE_RE_AUDIT.md`.

## 15. Quality Checklist

| Check | Result | Notes |
|---|---|---|
| Finding has source evidence | Yes | Source/register evidence cited above. |
| Finding has app evidence | Yes | App route or missing app evidence cited above. |
| Finding has SharePoint/list evidence | Yes | List/schema status cited as known or Unknown. |
| Approval classification is strict | Yes | Uses Required. |
| No SharePoint fields invented | Yes | Unknown fields remain Unknown. |
| Unresolved issues added to backlog | Resolved | FIX-079 verified. |
| Register row updated | Yes | Updated in master and form inventory. |

