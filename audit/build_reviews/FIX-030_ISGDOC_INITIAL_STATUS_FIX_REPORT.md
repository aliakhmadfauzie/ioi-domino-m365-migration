# FIX-030 ISGDOC Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-030`
Finding: `AUD-B002-ISGDOC-001`
Form: ISGDOC - ISG Document / IT Procedures
Department: IT

## Result

Status: Fixed Pending Re-Audit

ISGDOC submit now uses `CurrentstatusKey4` (Sent) instead of `CurrentstatusKey1` (Approved). ISGDOC is a non-approval document management form.

## Code Change

File: `src/pages/it/forms/isgdoc/new.tsx`

**Before**: `currentStatus: 'CurrentstatusKey1' as MainDBITCurrentstatusKey`
**After**: `currentStatus: 'CurrentstatusKey4' as MainDBITCurrentstatusKey`

## Verification

- `npx tsc --noEmit` passed
