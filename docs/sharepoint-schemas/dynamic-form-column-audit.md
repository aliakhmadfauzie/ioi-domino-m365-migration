# Dynamic Form Column Audit

**Date:** 2026-05-31  
**Purpose:** Verify that every `FieldSchema.spColumn` reference in dynamic form schemas matches an actual SharePoint column in the target list.

---

## Audit Methodology

For each dynamic form definition (in `src/form-schemas/` or wherever `FieldSchema` arrays are defined):

1. Identify the target SharePoint list (`spTable`)
2. Identify the target column (`spColumn`)
3. Check against the Phase 0 schema export for that list
4. Record PASS/FAIL/MISSING

---

## Form Definitions to Audit

| Form Code | Schema File | Target Table | Status |
|-----------|-------------|--------------|--------|
| ITSSR | `src/form-schemas/itssr.ts` | MainDB_IT | ⏳ Needs audit |
| EAF | `src/form-schemas/eaf.ts` | MainDB_IT | ⏳ Needs audit |
| NIR | `src/form-schemas/nir.ts` | MainDB_IT | ⏳ Needs audit |
| RS | `src/form-schemas/rs.ts` | MainDB_IT | ⏳ Needs audit |
| SFAR | `src/form-schemas/sfar.ts` | MainDB_IT | ⏳ Needs audit |
| UR | `src/form-schemas/ur.ts` | MainDB_IT | ⏳ Needs audit |
| PRF | `src/form-schemas/prf.ts` | MainDB_IT | ⏳ Needs audit |
| HI | `src/form-schemas/hi.ts` | MainDB_IT | ⏳ Needs audit |
| All SAP forms | `src/form-schemas/sap-*.ts` | MainDB_IT | ⏳ Needs audit |

## Audit Table Template

| Form | spColumn | SP Internal Name | Expected Type | Actual Type | Match? |
|------|----------|------------------|---------------|-------------|--------|
| ITSSR | Title | Title | Text | TBD | ⏳ |
| ITSSR | FormCode | FormCode | Text | TBD | ⏳ |
| ITSSR | Priority | Priority | Text | TBD | ⏳ |
| ... | ... | ... | ... | ... | ... |

---

## Findings

*No findings yet — run after Phase 0 schema export.*
