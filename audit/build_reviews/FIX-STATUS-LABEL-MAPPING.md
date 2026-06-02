# Status Key → Human-Readable Label Fix Report

Date: 2026-06-02
Task: Fix raw `CurrentstatusKey*` display on tables and detail screens

## Issues Found & Fixed

### Issue 1: `it-approval-context.tsx` — STATUS_LABELS incomplete

**Problem**: `STATUS_LABELS` only mapped 8 status keys (`CurrentstatusKey1`–`Key8`). All other keys (e.g., `CurrentstatusKey49` = "Pending Owner") showed as "Unknown" in approval panels.

**Fix**: Replaced hardcoded STATUS_LABELS with `MainDBITCurrentstatusKeyToLabel` from the generated model, which covers all 60 status keys.

**File**: `src/contexts/it-approval-context.tsx`

### Issue 2: `forms.tsx` — local `getStatusStyle` didn't handle raw keys

**Problem**: The local `getStatusStyle` function compared against lowercase labels (`'submitted'`, `'approved'`) but the actual `currentStatus` value is a key like `CurrentstatusKey49`. Badge text was correct via `getStatusLabel()`, but badge styling fell to default grey for all statuses.

**Fix**: Added `statusConfig[status as MainDBITCurrentstatusKey]` check first. If the raw key exists in statusConfig, use its styling. Otherwise fall back to existing label-based matching.

**File**: `src/pages/forms.tsx`

## Already Correct

All other pages already map correctly:
- All IT form `index.tsx` pages use `mapStatusToLabel(main.currentStatus)` ✅
- `my-submissions.tsx` uses `statusConfig[status]` fallback ✅
- `submissions/[id].tsx` uses `getStatusLabel()` and `getStatusDisplay()` ✅
- `DatabaseTable.StatusBadge` uses `getStatusStyle()` from `color-tokens.ts` ✅

## Verification

- `npx tsc --noEmit` — zero errors
