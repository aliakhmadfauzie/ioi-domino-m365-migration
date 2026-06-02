# Status Key → Human-Readable Label Audit

Date: 2026-06-02
Department: IT
Scope: All index and detail pages displaying `currentStatus`

## Summary

All IT index pages and the shared `submissions/[id]` detail page correctly map `CurrentstatusKey*` values to human-readable labels via `MainDBITCurrentstatusKeyToLabel` or custom status badge components. No raw keys are displayed to end users.

## Verification Method

Scan all `src/pages/it/forms/*/index.tsx` and `src/pages/submissions/[id].tsx` for:
1. Import of `MainDBITCurrentstatusKeyToLabel` ✓
2. Usage of `mapStatusToLabel()` or `getStatusLabel()` or `MainDBITCurrentstatusKeyToLabel[]` for display ✓
3. No direct display of raw `currentStatus` or `CurrentstatusKey*` values in JSX ✓

## Form-by-Form Status Label Coverage

| Form | Index Page | Detail Page | Label Source | Status |
|------|-----------|-------------|-------------|--------|
| EAF | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` + `getStatusLabel()` | ✅ |
| ITSSR | Custom | `submissions/[id].tsx` | `getStatusLabel()` | ✅ |
| HI | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| NIR | `index.tsx` | `detail.tsx` (custom) | `mapStatusToLabel()` + custom `NIRStatusBadge` | ✅ |
| RS | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| UR | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SFAR | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| PRF | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SAPCR | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SAPTR | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SAPCA | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SAPAMR | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SAPDRP | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SAPSLCF | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| SAPSOF2 | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| ITSC | `index.tsx` | `submissions/[id].tsx` | `MainDBITCurrentstatusKeyToLabel[]` | ✅ |
| ISGDOC | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| ITINFO | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| ITDR | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| ITDR2 | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| IOIP/IOIPOL | `index.tsx` | `submissions/[id].tsx` | Custom `iOIPFinalStatus` labels + `getStatusLabel()` | ✅ |
| EAF | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |
| HI | `index.tsx` | `submissions/[id].tsx` | `mapStatusToLabel()` | ✅ |

## Key → Label Mapping Reference

| Internal Key | Display Label | Used By |
|-------------|--------------|---------|
| `CurrentstatusKey0` | Active | HI |
| `CurrentstatusKey1` | Approved | Terminal states |
| `CurrentstatusKey2` | Closed | Rejected/terminal |
| `CurrentstatusKey3` | Draft | Save-as-draft |
| `CurrentstatusKey4` | Sent | SAPDRP, RS, UR, ITSC, ISGDOC, ITINFO, ITDR2 |
| `CurrentstatusKey5` | Verified | Approval complete |
| `CurrentstatusKey6` | Withdrawn | Withdrawn records |
| `CurrentstatusKey9` | Pending Approval A | SAPTR |
| `CurrentstatusKey14` | Pending BPO | SAPCR |
| `CurrentstatusKey27` | Pending HOD | NIR(initial), SAPSLCF, EAF, PRF |
| `CurrentstatusKey30` | Pending IT | NIR(submitted) |
| `CurrentstatusKey38` | Pending IT PIC | NIR(HOD approved) |
| `CurrentstatusKey47` | Pending KU Sign-Off | SAPSOF2 |
| `CurrentstatusKey49` | Pending Owner | SFAR |

## Finding

All IT index pages and detail pages correctly render human-readable status labels. No raw `CurrentstatusKey*` values are exposed in the UI. The label mapping is verified for all 22+ IT forms.

**Audit Result: ✅ PASSED — No issues found.**
