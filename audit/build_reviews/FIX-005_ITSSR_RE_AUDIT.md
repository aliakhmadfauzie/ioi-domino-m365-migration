# FIX-005 ITSSR PIC Persistence Re-Audit Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-RE-AUDIT-005 |
| Fix ID | FIX-005 |
| Department | IT |
| Form | ITSSR |
| Priority | P0 |
| Type | Re-Audit |
| Reason | Verify that new ITSSR submissions persist routed PIC to `ITSSR_AssignedTo_Email` and access resolves from the persisted assignment |

## Why Allowed

| Check | Result |
|---|---|
| `DependsOn` (TASK-FIX-005) | Complete — `Fixed Pending Re-Audit` with evidence in `audit/build_reviews/FIX-005_ITSSR_PIC_PERSISTENCE_FIX_REPORT.md` |
| Required source evidence files | Existing — `audit/findings/batch-01/itssr.md`, `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/features/itssr/itssr-app.tsx` |
| Required schema/mapping files | Existing — `.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json`, `src/generated/services/main-dbit-ext-support-service.ts` |
| Blocking rule violation | None — this is a re-audit of a P0 Fix task, not a new build |
| CIR blocking rule | Not applicable — ITSSR is an IT form, not HR |

## Re-Audit Checks

### Check 1: New ITSSR submission creates Ext_Support child row

**Evidence:** `src/features/itssr/itssr-app.tsx` lines 1247–1262

```typescript
await MainDBITExtSupportService.create({
  title: finalTitle,
  parentFormCode: ITSSR_CODE,
  parentRecord: { id: submitted.id, title: finalTitle },
  iTSSRCaseNo: finalTitle,
  iTSSRServiceType: form.ServiceType,
  iTSSRProblemDescription: form.ProblemDescription,
  iTSSRReportedByEmail: personEmail(form.ReportedByEmail),
  iTSSRProblemCategory: form.ProblemCategory || form.ServiceType,
  iTSSRSupportMethod: form.SupportMethod || 'Remote',
  iTSSRDepartment: form.Department,
  iTSSRExtension: form.PhoneExtension,
  iTSSRHardware: form.Hardware,
  iTSSRApplication: form.Application,
  iTSSRCC: typeof form.CCEmail === 'string' ? form.CCEmail : '',
  iTSSRAssignedToEmail: personEmail(routedPIC),
} as Omit<MainDBITExtSupport, 'id'>);
```

**Verdict:** ✅ **PASS** — Every ITSSR submit creates an Ext_Support child record with all ITSSR-specific fields including the assigned PIC email.

### Check 2: `ITSSR_AssignedTo_Email` receives routed primary PIC email

**Create path evidence (`itssr-app.tsx`):**
- Line 1213–1215: `routedPIC` is captured from `routing.primaryPICEmail`
- Line 1262: `iTSSRAssignedToEmail: personEmail(routedPIC)` writes to the model field

**Update path evidence (`itssr-app.tsx`):**
- Line 669: `if (values.AssignedToEmail !== undefined) extPatch.iTSSRAssignedToEmail = personEmail(values.AssignedToEmail)`

**Service denormalization (`main-dbit-ext-support-service.ts`):**
- Lines 163–164: `if (record.iTSSRAssignedToEmail !== undefined) out.ITSSR_AssignedTo_Email = record.iTSSRAssignedToEmail`

**Schema confirmation (`maindb_it_ext_support.Schema.json`):**
- Line 413–424: `ITSSR_AssignedTo_Email` confirmed as `"type": "string"`, `"x-ms-permission": "read-write"`, `"maxLength": 255`

**Verdict:** ✅ **PASS** — Model field `iTSSRAssignedToEmail` denormalizes to captured SharePoint column `ITSSR_AssignedTo_Email` (read-write string). Create path writes `routedPIC` email. Update path writes `AssignedToEmail` changes. Both paths confirmed.

### Check 3: IT PIC list/detail access resolves from persisted assignment

**Access logic (`itssr-app.tsx`):**
- Line 487: `const isITPIC = isITAdmin || emailListIncludes(record?.AssignedToEmail, userEmail) || emailListIncludes(record?.SendToEmail, userEmail)`

**Record mapping (`itssr-app.tsx`):**
- Line 387: `AssignedToEmail: ext?.iTSSRAssignedToEmail || rawText(rawRecord, 'AssignedToEmail')` — reads the persisted PIC email from Ext_Support child (via `iTSSRAssignedToEmail`) with fallback to parent field

**Assign & Start path (`itssr-app.tsx`):**
- Line 1544: Sets `AssignedToEmail: assignedPerson` then updates status → update path persists to `iTSSRAssignedToEmail`
- Lines 1672, 1680: PIC notifications use `form.AssignedToEmail` for routing

**Verdict:** ✅ **PASS** — `useITSSRAccess` resolves `isITPIC` from `AssignedToEmail` which reads `iTSSRAssignedToEmail` (the persisted routed PIC). The Assign & Start path updates this field. Notifications resolve from the same persisted value.

### Check 4: TypeScript compilation

**Evidence:** `npx tsc --noEmit` passed with zero errors from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

**Verdict:** ✅ **PASS**

## Result

| Item | Status |
|---|---|
| New ITSSR submit creates Ext_Support child | ✅ Pass |
| `ITSSR_AssignedTo_Email` receives routed PIC | ✅ Pass |
| IT PIC access resolves from persisted assignment | ✅ Pass |
| TypeScript compilation | ✅ Pass |
| **Overall** | **✅ RE-AUDIT PASSED** |

## Queue Updates

| Task ID | Previous Status | New Status |
|---|---|---|
| TASK-RE-AUDIT-005 | Ready | Complete |
| TASK-FIX-005 | Fixed Pending Re-Audit | Verified |
| TASK-NEXT-BUILD | Blocked (P0 issues exist) | Still blocked — other P0 Fix tasks remain |

## Evidence References

- `audit/build_reviews/FIX-005_ITSSR_PIC_PERSISTENCE_FIX_REPORT.md` — Original fix evidence
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/features/itssr/itssr-app.tsx` (lines 387, 487, 669, 1213–1262, 1544, 1672, 1680) — Source code
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-support-service.ts` (lines 163–164) — Service denormalization
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json` (lines 413–424) — Schema confirmation
- `npx tsc --noEmit` — TypeScript compilation passed

## Next Recommended Task

**TASK-FIX-009** — SAPAMR: Persist TBV/TBA routing fields to confirmed SharePoint columns

- Department: IT
- Priority: P0
- Status: Ready
- Reason: Next P0 Fix task in queue order after TASK-RE-AUDIT-005 completes. No unresolved P0 issues block it.
