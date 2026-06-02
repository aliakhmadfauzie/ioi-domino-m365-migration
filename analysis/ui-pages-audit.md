# UI Pages — Spec Compliance Audit

> **Date**: 2026-06-01
> **Spec Source**: `docs/ui-page-specification.md`
> **Scope**: All 75 form pages across 20+ departments

---

## Executive Summary

| Metric | Count | % |
|---|---|---|
| Total form pages | 75 | 100% |
| ✅ Hardcoded color free (CSS variables) | 58 | **77%** |
| ✅ Uses generated service (real data) | 13 | **17%** |
| ✅ Has toast error handling | 48 | **64%** |
| ✅ Uses Card pattern consistently | 7 | **9%** |

---

## FINDING-AUDIT-1: 17 Forms Still Use Hardcoded Colors

**Spec**: Section 6.2 — Use CSS variables (`bg-muted`, `text-foreground`, `bg-card`, etc.)

**Affected forms** (need `bg-[#F5F5F5]` → `bg-muted` fix):

| Form | File |
|---|---|
| EAF | `it/forms/eaf/new.tsx` |
| ISGDOC | `it/forms/isgdoc/new.tsx` |
| ITDR | `it/forms/itdr/new.tsx` |
| ITDR2 | `it/forms/itdr2/new.tsx` |
| ITINFO | `it/forms/itinfo/new.tsx` |
| ITSC | `it/forms/itsc/new.tsx` |
| NIR | `it/forms/nir/new.tsx` |
| PRF | `it/forms/prf/new.tsx` |
| SAPAMR | `it/forms/sapamr/new.tsx` |
| SAPDRP | `it/forms/sapdrp/new.tsx` |
| SAPSLCF | `it/forms/sapslcf/new.tsx` |
| SAPSOF2 | `it/forms/sapsof2/new.tsx` |
| TRNMAN | `it/forms/trnman/new.tsx` |
| CSD | `log/forms/csd/new.tsx` |
| ECMFB | `log/forms/ecmfb/new.tsx` |
| GTPW | `log/forms/gtpw/new.tsx` |
| POD | `log/forms/pod/new.tsx` |
| TI | `log/forms/ti/new.tsx` |
| TMI | `log/forms/tmi/new.tsx` |

---

## FINDING-AUDIT-2: 62 Forms Use Mock Data

**Spec**: Section 7.2 — Forms must persist to SharePoint via generated services.

Only **13 forms** use real service calls:
| Department | Forms Using Services |
|---|---|
| **LOG** | CSD, TI, POD, FBN, ECMFB, GTPW, TMI, WCC, SHUNTING, IMDG, FJB (11) |
| **SEC** | security/forms/new (1 — dynamic) |
| **EAF** | eaf/new (1 — uses MainDBITService) |

All other 62 forms use `await new Promise(setTimeout(...))` or `SAMPLE_DATA`.

---

## FINDING-AUDIT-3: 27 Forms Missing Error Toast Handling

**Spec**: Section 7.2 — "Errors — Toast via `sonner` (`toast.error()`)"

Forms missing error handling on submit failure:
`adm/forms/new`, `engineering/forms/new`, `it/forms/[formCode]/new`, `it/forms/asset-submission/new`, `it/forms/dcal/new`, `it/forms/drr/new`, `it/forms/edl/new`, `it/forms/ite/new`, `it/forms/itp/new`, `it/forms/itssr/new`, `it/forms/rs/new`, `it/forms/sap-inc/new`, `it/forms/sfar/new`, `it/forms/srl/new`, `it/forms/srr/new`, `it/forms/srvr/new`, `it/forms/ur/new`, `mtr/forms/new`, `procurement/forms/new`, `qc/forms/calibration/new`, `qc/forms/lwr/new`, `qc/forms/oos/new`, `qc/forms/pqcar/new`, `training/forms/new`

---

## FINDING-AUDIT-4: Card Pattern Usage Is Inconsistent

**Spec**: Section 7.1 — Form sections must use `Card` with `CardHeader` + `CardContent`.

Only 7 forms consistently use the proper Card pattern:
`mpsprn`, `sapsof2`, `srr`, `qa/forms/new`, `str/new`, `training/forms/new`

Most other forms use custom div structures or partial Card usage.

---

## Summary by Department

| Dept | Forms | ✅ CSS Vars | ✅ Real Data | ✅ Toast | ✅ Card |
|---|---|---|---|---|---|
| **ADM** | 1 | 1 | 0 | 0 | 0 |
| **ENG** | 1 | 1 | 0 | 0 | 1 |
| **FIN** | 1 | 1 | 0 | 1 | 0 |
| **HR** | 3 | 3 | 0 | 3 | 0 |
| **IT** | 32 | 22 | 1 | 23 | 2 |
| **LOG** | 11 | 11 | 11 | 11 | 0 |
| **MTN** | 4 | 4 | 4 | 4 | 0 |
| **MTR** | 1 | 1 | 0 | 0 | 0 |
| **PRC** | 1 | 1 | 0 | 0 | 0 |
| **PROD** | 1 | 1 | 0 | 1 | 0 |
| **QA** | 4 | 4 | 0 | 3 | 1 |
| **QC** | 4 | 4 | 0 | 0 | 0 |
| **SEC** | 1 | 1 | 0 | 1 | 0 |
| **SHE** | 1 | 1 | 0 | 1 | 0 |
| **STR** | 1 | 1 | 0 | 1 | 1 |
| **TD** | 1 | 1 | 0 | 0 | 1 |
| **WH** | 4 | 4 | 4 | 4 | 0 |

---

## Priority Recommendations

| Priority | Fix | Forms | Effort |
|---|---|---|---|
| **P0** | Fix 19 hardcoded color forms (FINDING-AUDIT-1) | 19 IT + LOG forms | 30 min |
| **P1** | Wire 62 mock-data forms to generated services | 62 forms | Per-form |
| **P1** | Add `toast.error()` to 27 forms missing it | 27 forms | 15 min |
| **P2** | Refactor to use Card pattern consistently | 68 forms | Per-form |
