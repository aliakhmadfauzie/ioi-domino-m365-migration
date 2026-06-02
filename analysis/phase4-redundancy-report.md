# Phase 4: Duplicates, Redundancy & Single Source Issues

> **Generated**: 2026-05-31
> **Note**: Previous cleanup (2026-06-01 per change log) removed ~208 PascalCase duplicates, 2 legacy pages, 1 orphaned file. This report checks remaining state.

---

## Remaining Duplicate / Redundancy Check

| Issue | Location | Details | Action |
|---|---|---|---|
| ✅ **Generated cleanup done** | `src/generated/services/`, `models/`, `validators/`, `hooks/`, `components/` | 208 PascalCase files deleted; kebab-case retained as canonical | Done — no action needed |
| ✅ **Delegation dialog consolidated** | `src/components/delegation-dialog.tsx` | Root stub replaced with re-export from `workflow/` | Done — no action needed |
| ✅ **Escalation monitor consolidated** | `src/components/escalation-monitor.tsx` | Root-level deleted | Done — no action needed |
| ✅ **Legacy pages deleted** | `src/pages/itdr-form.tsx`, `itdr2-form.tsx` | Deleted per cleanup plan | Done — no action needed |
| ⚠️ **Dynamic router vs explicit routes** | `src/pages/it/forms/[formCode]/` vs `src/pages/it/forms/eaf/`, `itssr/`, `hi/` | Both patterns coexist — some forms use dynamic route, some use explicit | **Conflict** — pick one pattern |
| ⚠️ **Schema file naming inconsistency** | `VPNACCESS.json` (code=EAF), `HWINV_PRAI.json` (code=HI), `ITSSR.json` (code=ITSSR) | 2/3 schema files don't match their form code | **Fix** — rename to match form codes |
| ✅ **ITSSR: single entry point** | `src/pages/it/forms/itssr/index.tsx` → delegates to `ITSSRListScreen` | Clean delegation pattern ✅ | No action |
| ✅ **EAF: three files** | `index.tsx` (list), `new.tsx` (create), `[id].tsx` (detail) | Clean pattern ✅ | No action |
| ⚠️ **HI: missing `[id].tsx`** | Only `index.tsx` and `new.tsx` exist | Detail page never created | **Create** — needed for viewing records |
| ⚠️ **Two form schema patterns** | `ITSSR.json` has `spColumn`/`spTable` metadata; `VPNACCESS.json` and `HWINV_PRAI.json` do not | Inconsistent schema design | **Fix** — add spColumn/spTable to all schemas |
| ✅ **No remaining orphaned files** | Checked: no `Untitled-1.txt` or similar artifacts | Clean | No action |
| ✅ **No doubled services** | `str-service.ts` vs `str-submission-service.ts` — STR is non-IT dept, not in current scope | Clean | No action |

---

## Remaining Actions

| # | Action | Target | Reason |
|---|---|---|---|
| 1 | Choose route pattern: prefer explicit per-form routes | All forms | Dynamic `[formCode]` route conflicts with explicit `eaf/`, `itssr/`, `hi/` |
| 2 | Normalize schema file names to match form codes | `VPNACCESS.json` → `EAF.json`, `HWINV_PRAI.json` → `HI.json` | Single source of truth |
| 3 | Add `spColumn`/`spTable` to all form schemas | VPNACCESS, HWINV_PRAI | Consistency with ITSSR schema |
| 4 | Create HI `[id].tsx` | HI forms | Missing detail page |
