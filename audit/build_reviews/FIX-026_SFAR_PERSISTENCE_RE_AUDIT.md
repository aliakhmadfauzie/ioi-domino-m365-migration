# FIX-026 SFAR Persistence Alignment Re-Audit Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-RE-AUDIT-026 |
| Fix ID | FIX-026 |
| Department | IT |
| Form | SFAR |
| Priority | P0 |
| Type | Re-Audit |
| Reason | Verify SFAR structured access fields and approval action history are persisted to confirmed locations |

## Why Allowed

| Check | Result |
|---|---|
| `DependsOn` (`TASK-FIX-026`) | Complete - fix evidence recorded in `audit/build_reviews/FIX-026_SFAR_PERSISTENCE_FIX_REPORT.md` |
| Required source evidence files | Existing - SFAR config, shared renderer, ExtAccess service, MainDB/ExtAccess schemas, ApprovalRecords model |
| Blocking rule violation | None - this is a re-audit of a P0 Fix task, not a new build |
| CIR blocking rule | Not applicable - SFAR is an IT form, not HR |

## Re-Audit Checks

### Check 1: SFAR writes structured parent fields

**Source evidence:** `src/lib/it-forms-config.ts`

SFAR now defines `submitTransform` and maps visible form fields to confirmed `MainDB_IT` model fields including `sFARCompany`, `sFARDepartment`, `sFARServerName`, `sFARRequestType`, `sFAROwner`, `sFARAccessTo`, `sFARAccessToName`, `sFARFolderPath`, `sFARAccessLevel`, `sFARPurpose`, and `sFARJustification`.

**Verdict:** PASS - SFAR no longer relies only on `remarks` JSON for request data.

### Check 2: SFAR submit starts in pending owner-review state

**Source evidence:** `src/components/forms/dynamic-form-renderer.tsx`

The shared renderer now branches for SFAR and writes `CurrentstatusKey49` (`Pending Owner`) with `workflowstage: 2`. The remarks payload also records `currentAction: 'PendingOwner'`.

**Verdict:** PASS - SFAR submit no longer writes the shared approved status for the initial submission path.

### Check 3: SFAR creates confirmed ExtAccess child row

**Source evidence:** `src/components/forms/dynamic-form-renderer.tsx`

After the parent record is created, `createSFARChildRecords` creates `MainDB_IT_Ext_Access` with `parentFormCode: 'SFAR'`, linked `parentRecord`, `parentSite: 'PRAI'`, `sFARFolderPath`, and `sFARAccessLevel`.

**Verdict:** PASS - the confirmed SFAR ExtAccess child fields are persisted.

### Check 4: SFAR creates approval history records

**Source evidence:** `src/components/forms/dynamic-form-renderer.tsx`; `src/generated/models/approval-records-model.ts`

The SFAR submit path creates two `ApprovalRecords` entries: `Submission` and `Pending Folder Owner Review`, both using `ActionKey3` (`Submitted`) and linked by `formid`/`formcode`.

**Verdict:** PASS - approval action history is initialized in the confirmed `ApprovalRecords` data source.

### Check 5: ExtAccess service maps SFAR fields

**Source evidence:** `src/generated/services/main-dbit-ext-access-service.ts`

The service maps `sFARAccessLevel`, `sFARFolderPath`, `sFARReviewedBy`, and `sFARReviewedDate` to the confirmed SharePoint internal names and normalizes readback to the generated model field names.

**Verdict:** PASS - SFAR child writes and reads use confirmed schema names.

### Check 6: TypeScript compilation

**Evidence:** `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

**Verdict:** PASS

## Result

| Item | Status |
|---|---|
| SFAR parent structured fields | Pass |
| SFAR initial pending owner status | Pass |
| SFAR ExtAccess child create | Pass |
| SFAR initial approval history create | Pass |
| ExtAccess SFAR mapping/readback | Pass |
| TypeScript compilation | Pass |
| **Overall** | **RE-AUDIT PASSED** |

## Queue Updates

| Task ID | Previous Status | New Status |
|---|---|---|
| TASK-FIX-026 | Ready | Verified |
| TASK-RE-AUDIT-026 | Not listed | Complete |

## Residual Issue Outside This Fix Scope

`FIX-001` / `TASK-FIX-001` remains a separate P1 workflow task for full SFAR approval workflow transition behavior. This fix prevents the initial approved-status write and seeds approval history, but the broader approver action flow should still receive its own targeted workflow audit before closure.

## Evidence References

- `audit/03_findings/IT/AUD-023_SFAR_AUDIT.md`
- `audit/05_fix_backlog/FIX_BACKLOG.md`
- `audit/build_reviews/FIX-026_SFAR_PERSISTENCE_FIX_REPORT.md`
- `src/lib/it-forms-config.ts`
- `src/components/forms/dynamic-form-renderer.tsx`
- `src/generated/services/main-dbit-ext-access-service.ts`

## Next Recommended Task

`TASK-FIX-031` - ISGDOC structured document-field persistence/read alignment.
