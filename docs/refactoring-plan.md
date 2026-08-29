# Refactoring & Fix Plan — SharePoint Integration

**Date:** 2026-05-31
**Base repository:** `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`
**Reference audit:** `docs/sharepoint-integration-audit.md`

---

## Table of Contents

1. [Phase 0 — Preflight: Schema Verification & Preparatory Work](#phase-0--preflight-schema-verification--preparatory-work)
2. [Phase 1 — Critical Data Integrity Fixes](#phase-1--critical-data-integrity-fixes)
3. [Phase 2 — Field Type & Mapping Corrections](#phase-2--field-type--mapping-corrections)
4. [Phase 3 — Parent-Child & Workflow Resilience](#phase-3--parent-child--workflow-resilience)
5. [Phase 4 — Deprecation Cleanup & Metadata Accuracy](#phase-4--deprecation-cleanup--metadata-accuracy)
6. [Phase 5 — UI Label & Documentation](#phase-5--ui-label--documentation)
7. [Validation Gates](#validation-gates)
8. [Rollback Strategy](#rollback-strategy)

---

## Phase 0 — Preflight: Schema Verification & Preparatory Work

**Goal:** Establish ground truth for all SharePoint schemas before making code changes.
**Do this first** — every subsequent phase depends on accurate schema knowledge.

### Step 0.1 — Export all SharePoint list schemas

Connect to each SharePoint site and export the full column schema for every list used by the app.

**PowerShell commands** (run from repo root):

```powershell
# Install module if needed
Install-Module -Name PnP.PowerShell -Scope CurrentUser -Force

# IT Portal — MainDB_IT + child lists
Connect-PnPOnline -Url "https://ioioi.sharepoint.com/sites/ioi-portal-it" -Interactive
@("MainDB_IT","MainDB_IT_Ext_Access","MainDB_IT_Ext_Support","MainDB_IT_Ext_SAP",
  "MainDB_IT_Ext_Assets","MainDB_IT_Ext_Docs","ApprovalRecords","WorkflowAuditLog",
  "ConfigCompanies","ConfigDepartments","ConfigApproverMatrix","ConfigEmployeeDirectory",
  "ConfigNotesAdminRouting","ITForms","UserRoles_IT","Policies",
  "IT_M1_RS_Banks","IT_M1_RS_SAP_Client","IT_M1_RS_SystemsList","IT_M1_SFAR_Servers"
) | ForEach-Object {
  Get-PnPField -List $_ | Select-Object Title, InternalName, TypeAsString, Required |
    Export-Csv -Path "source/sharepoint-schemas/ioi-portal-it/$_.csv" -NoTypeInformation
}

# HR Portal — MainDB_HR + child lists
Connect-PnPOnline -Url "https://ioioi.sharepoint.com/sites/ioi-portal-hr" -Interactive
@("MainDB_HR","ApprovalHistory_HR","AuditLog_HR","AttachmentIndex_HR",
  "ConfigGlobalUserRoleAssignments","HR_RoutingMatrix",
  "HR_AppraisalRecords","HR_HealthRegister","HR_InterviewPipeline"
) | ForEach-Object {
  Get-PnPField -List $_ | Select-Object Title, InternalName, TypeAsString, Required |
    Export-Csv -Path "source/sharepoint-schemas/ioi-portal-hr/$_.csv" -NoTypeInformation
}

# STR Portal
Connect-PnPOnline -Url "https://ioioi.sharepoint.com/sites/ioi-portal-str" -Interactive
@("MainDB_STR","Assignments_STR","AttachmentIndex_STR","LineItems_STR","ApprovalHistory_STR"
) | ForEach-Object {
  Get-PnPField -List $_ | Select-Object Title, InternalName, TypeAsString, Required |
    Export-Csv -Path "source/sharepoint-schemas/ioi-portal-str/$_.csv" -NoTypeInformation
}
```

**Output directory:** `source/sharepoint-schemas/{site}/{list}.csv`

### Step 0.2 — Verify choice field options

For every choice field in every list, export the option values:

```powershell
function Export-ChoiceOptions {
  param($ListName, $FieldName)
  $field = Get-PnPField -List $ListName -Identity $FieldName
  if ($field.TypeAsString -eq "Choice" -or $field.TypeAsString -eq "MultiChoice") {
    $field.Choices | ForEach-Object { [PSCustomObject]@{ List=$ListName; Field=$FieldName; Value=$_ } }
  }
}
```

Compare against the key-to-label maps in `src/generated/models/main-dbit-model.ts` (e.g., `MainDBITCurrentstatusKeyToLabel`).

### Step 0.3 — Verify ExtAccess columns against model

Check that these EAF-specific columns exist in MainDB_IT_Ext_Access:

| Column Name | Expected Type | Known in Model? |
|-------------|--------------|-----------------|
| `eAFClientID` | Text | ⚠️ Verify |
| `eAFUserGroup` | Text | ⚠️ Verify |
| `eAFHigherApproverEmail` | Text | ⚠️ Verify |
| `eAFAttachment` | Text | Known |
| `eAFITConfigRemarks` | Text | Known |
| `eAFITConfigStatus` | Text | Known |

**Files to update if missing:** `src/generated/models/main-dbit-ext-access-model.ts` (add missing fields), `src/generated/services/main-dbit-ext-access-service.ts` (add normalization/denormalization)

### Step 0.4 — Schema documentation snapshot

After export, generate a consolidated schema reference doc:
- `docs/sharepoint-schemas/schema-reference.md`
- One table per list listing: InternalName, DisplayName, Type, Required, ChoiceOptions

### Deliverables

| Artifact | Path |
|----------|------|
| SP schema CSVs | `source/sharepoint-schemas/{site}/*.csv` |
| Schema reference doc | `docs/sharepoint-schemas/schema-reference.md` |
| Column verification report | `docs/sharepoint-schemas/column-verification.md` |

---

## Phase 1 — Critical Data Integrity Fixes

### Fix 1.1: EAFDetails reads NIR/PRF fields → ExtAccess fields

**Issue:** CRIT-01, CRIT-02 (blocking UAT)
**Files:**
- `src/components/submission-details/index.tsx`
- `src/pages/submissions/[id].tsx` (parent component that passes data)

**Root cause:** `EAFDetails({ s }: { s: MainDBIT })` only receives the main record. The component tries to show EAF data but reads NIR and PRF columns that happen to exist on the same `MainDBIT` table.

**Refactoring approach:** Refactor the form-specific detail components to accept their corresponding extension record as a prop, fetched by the parent.

#### Step 1.1.1 — Add import for ExtAccess model and hook

In `src/components/submission-details/index.tsx`, add:

```typescript
import { useMainDBITExtAccessList } from '@/generated/hooks/use-main-dbitext-access';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
```

#### Step 1.1.2 — Update `EAFDetails` signature and rendering

Replace the existing `EAFDetails` function:

```typescript
function EAFDetails({ s, extAccess }: { s: MainDBIT; extAccess?: MainDBITExtAccess }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Requestor Info" icon={User}>
        <FieldRow icon={User} label="Full Name" value={extAccess?.eAFTargetUserEmail?.split('@')[0] || s.requestorName || '-'} />
        <FieldRow icon={Mail} label="Email" value={extAccess?.eAFTargetUserEmail || s.requestoremail || '-'} />
        <FieldRow icon={Building2} label="Company" value={s.company || '-'} />
      </SectionCard>
      <SectionCard title="Access Details" icon={Shield}>
        <FieldRow icon={Monitor} label="Application" value={extAccess?.eAFApplication || '-'} />
        <FieldRow icon={Server} label="System Name" value={extAccess?.eAFSystemName || '-'} />
        <FieldRow icon={Globe} label="Environment" value={s.environmenttagKey ? MainDBITEnvironmenttagKeyToLabel[s.environmenttagKey] : '-'} />
        <FieldRow icon={Tag} label="Request Type" value={extAccess?.eAFApplication || '-'} />
        <FieldRow icon={FileText} label="Justification" value={extAccess?.eAFJustification || s.remarks || '-'} />
        <FieldRow icon={Mail} label="CC Recipients" value={extAccess?.eAFCC || extAccess?.eAFReminderTo || '-'} />
      </SectionCard>
      <SectionCard title="Approval Status" icon={CheckCircle2}>
        <FieldRow icon={User} label="Dept. Head" value={extAccess?.eAFDeptHeadEmail || '-'} />
        <FieldRow icon={CheckCircle2} label="Dept. Head Status" value={extAccess?.eAFDeptHeadStatus || '-'} />
        <FieldRow icon={Calendar} label="Dept. Head Date" value={extAccess?.eAFDeptHeadDate || '-'} />
        <FieldRow icon={User} label="Div. Director" value={extAccess?.eAFDDAppApprovedBy || '-'} />
        <FieldRow icon={CheckCircle2} label="Div. Director Status" value={extAccess?.eAFDDAppStatus || '-'} />
        <FieldRow icon={Calendar} label="Div. Director Date" value={extAccess?.eAFDDAppDate || '-'} />
        <FieldRow icon={User} label="IT Manager" value={extAccess?.eAFITManagerApprovedBy || '-'} />
        <FieldRow icon={CheckCircle2} label="IT Manager Status" value={extAccess?.eAFITManagerStatus || '-'} />
        <FieldRow icon={Calendar} label="IT Manager Date" value={extAccess?.eAFITManagerDate || '-'} />
      </SectionCard>
      {extAccess?.eAFITConfigStatus && (
        <SectionCard title="IT Configuration" icon={Settings}>
          <FieldRow icon={CheckCircle2} label="Config Status" value={extAccess?.eAFITConfigStatus} />
          <FieldRow icon={FileText} label="Config Remarks" value={extAccess?.eAFITConfigRemarks} />
        </SectionCard>
      )}
    </div>
  );
}
```

Note: The `Settings` icon needs to be imported from `lucide-react`.

#### Step 1.1.3 — Update parent `DynamicSubmissionDetails` component

The parent component at the bottom of the file needs to:
1. Accept an optional `extAccessRecords` prop (or fetch them internally)
2. Find the matching ExtAccess record by parent ID
3. Pass it to `EAFDetails`

Current signature:
```typescript
interface DynamicSubmissionDetailsProps {
  submission: MainDBIT;
  dataSource: string;
  approvals: ApprovalRecords[];
  showWorkflow?: boolean;
  showHistory?: boolean;
}
```

Change to:
```typescript
interface DynamicSubmissionDetailsProps {
  submission: MainDBIT;
  dataSource: string;
  approvals: ApprovalRecords[];
  extAccessRecords?: MainDBITExtAccess[];  // NEW
  extSupportRecords?: MainDBITExtSupport[]; // NEW
  showWorkflow?: boolean;
  showHistory?: boolean;
}
```

Then in the render section, find the matching ext record:
```typescript
const extAccess = extAccessRecords?.find(
  (ext) => ext.parentRecord?.id === submission.id
);
const extSupport = extSupportRecords?.find(
  (ext) => ext.parentRecord?.id === submission.id
);
```

#### Step 1.1.4 — Update `pages/submissions/[id].tsx`

In `src/pages/submissions/[id].tsx`, add fetches for ExtAccess and ExtSupport records, then pass them to the component.

After the existing `useMainDBITList` and `useApprovalRecordsList` hooks, add:

```typescript
const { data: extAccessRecords = [] } = useMainDBITExtAccessList({
  filter: submission ? `parentRecord/ID eq ${submission.id}` : undefined,
  enabled: !!submission && submission.formcode === 'EAF',
});

const { data: extSupportRecords = [] } = useMainDBITExtSupportList({
  filter: submission ? `parentRecord/ID eq ${submission.id}` : undefined,
  enabled: !!submission && submission.formcode === 'ITSSR',
});
```

Then pass them to `DynamicSubmissionDetails`:
```typescript
<DynamicSubmissionDetails
  submission={submission}
  dataSource="maindb_it"
  approvals={filteredApprovalRecords}
  extAccessRecords={extAccessRecords}
  extSupportRecords={extSupportRecords}
/>
```

**Import the hooks:**
```typescript
import { useMainDBITExtAccessList } from '@/generated/hooks/use-main-dbitext-access';
import { useMainDBITExtSupportList } from '@/generated/hooks/use-main-dbitext-support';
```

#### Step 1.1.5 — Fix the `structuredFields` sidebar (HIGH-03)

In the `structuredFields` `useMemo` block in `pages/submissions/[id].tsx`, wrap every form-specific field block with a `formcode` guard:

```typescript
// BEFORE (WRONG):
if (submission.nIRFullName) fields.push({ label: 'Full Name', value: submission.nIRFullName, icon: User });
if (submission.nIRDepartment) fields.push({ label: 'Department', value: submission.nIRDepartment, icon: Building2 });

// AFTER (CORRECT):
if (submission.formcode === 'NIR') {
  if (submission.nIRFullName) fields.push({ label: 'Full Name', value: submission.nIRFullName, icon: User });
  if (submission.nIRDepartment) fields.push({ label: 'Department', value: submission.nIRDepartment, icon: Building2 });
  if (submission.nIRRequestType) fields.push({ label: 'Request Type', value: submission.nIRRequestType, icon: FileText });
  if (submission.nIREmployeeNumber) fields.push({ label: 'Employee No.', value: submission.nIREmployeeNumber, icon: Hash });
  if (submission.nIRDesignation) fields.push({ label: 'Designation', value: submission.nIRDesignation, icon: Briefcase });
  // ... all other NIR fields
}
if (submission.formcode === 'HI') {
  if (submission.hITagNo) fields.push({ label: 'Tag No', value: submission.hITagNo, icon: Tag });
  if (submission.hIAssetNo) fields.push({ label: 'Asset No', value: submission.hIAssetNo, icon: Hash });
  // ... all other HI fields
}
// Repeat for PRF, RS, SFAR, UR
```

### Fix 1.2: Replace HR mock service with real SharePoint writes

**Issue:** CRIT-02 (blocking UAT for HR)
**Files:**
- `src/services/hr-submission-service.ts` (rewrite)
- All HR page files that import from `hr-submission-service`
- `src/pages/hr/leave.tsx`, `src/pages/hr/health.tsx`, `src/pages/hr/recruitment.tsx` (update)

#### Step 1.2.1 — Analyze all callers of `HRSubmissionService`

Search for all imports and usages:

```powershell
Select-String -Path "src\pages\hr\**\*.tsx" -Pattern "HRSubmissionService|hr-submission-service" -List
```

#### Step 1.2.2 — Rewrite `HRSubmissionService`

The service must be rewritten to delegate to the generated `MainDBHRService` and `ApprovalHistoryHRService`, mirroring the pattern in `services/main-dbhr-service.ts`.

**Key principles:**
1. Keep the same public API (create, update, approve, reject, etc.) so callers don't need changes
2. Internally delegate to generated services
3. Add `ensureInitialized()` calls
4. Use the same status key pattern as `MainDBHRService` (e.g., `statusKey: 'StatusKey1'` for Submitted)

**New skeleton:**

```typescript
/**
 * HR Submission Service — SharePoint-connected implementation
 *
 * Replaced the in-memory mock with real MainDBHRService calls.
 * All methods maintain the same public signature for backward compatibility.
 */

import { ensureInitialized } from '@/lib/app-init';
import { MainDBHRService } from '@/generated/services/main-dbhr-service';
import { ApprovalHistoryHRService } from '@/generated/services/approval-history-hr-service';
import type { MainDBHR } from '@/generated/models/main-dbhr-model';
import type {
  HRFormCode,
  HRCurrentStatus,
  MainDBHRBase,
  CRApprovalRecord,
  ApprovalAction,
} from '@/types/hr-forms';
import { generateHRFormINO, generateHRFormTitle, getHRFormWorkflowStages } from '@/types/hr-forms';

export interface HRSubmission extends MainDBHRBase {
  Id: number;
  GUID: string;
  Created: string;
  Modified: string;
  FormData?: string;
}

export interface CreateHRSubmissionInput {
  FormType: HRFormCode;
  Division: string;
  DepartmentRole?: string;
  Comments?: string;
  EnvironmentTag?: string;
  FormData?: Record<string, unknown>;
}

export class HRSubmissionService {
  static async create(input: CreateHRSubmissionInput): Promise<HRSubmission> {
    await ensureInitialized();
    const ino = generateHRFormINO(input.FormType, 'PRAI');
    const title = generateHRFormTitle(input.FormType, ino);

    const record = {
      title,
      formcode: input.FormType,
      statusKey: 'StatusKey1' as MainDBHR['statusKey'], // Submitted
      siteKey: 'SiteKey0' as MainDBHR['siteKey'],       // Prai
      division: input.Division,
      departmentRole: input.DepartmentRole,
      submittedDate: new Date().toISOString(),
    };

    const created = await MainDBHRService.create(record as unknown as Omit<MainDBHR, 'id'>);

    return {
      Id: created.id,
      GUID: String(created.id),
      Created: created.submittedDate || new Date().toISOString(),
      Modified: created.submittedDate || new Date().toISOString(),
      FormType: input.FormType,
      Title: title,
      INO: ino,
      CurrentStatus: 'Submitted' as HRCurrentStatus,
      EnvironmentTag: input.EnvironmentTag || 'PROD',
      Division: input.Division,
      FormData: input.FormData ? JSON.stringify(input.FormData) : undefined,
    };
  }

  // Update, approve, reject — similarly delegate to generated service
  static async update(guid: string, changes: Record<string, unknown>): Promise<HRSubmission> {
    await ensureInitialized();
    const updated = await MainDBHRService.update(guid, changes as Partial<Omit<MainDBHR, 'id'>>);
    // Map back to HRSubmission shape
    return mapToHRSubmission(updated);
  }

  static async approve(guid: string, approvedBy: string): Promise<HRSubmission> {
    await ensureInitialized();
    const updated = await MainDBHRService.update(guid, {
      statusKey: 'StatusKey3' as MainDBHR['statusKey'], // Approved
      currentapproverdisplayname: approvedBy,
    } as Partial<Omit<MainDBHR, 'id'>>);
    return mapToHRSubmission(updated);
  }

  // Similarly for reject, returnForRevision, lock, getByFormType, etc.
}

function mapToHRSubmission(sp: MainDBHR): HRSubmission {
  return {
    Id: sp.id,
    GUID: String(sp.id),
    Created: sp.submittedDate || '',
    Modified: sp.submittedDate || '',
    FormType: sp.formcode as HRFormCode,
    Title: sp.title,
    INO: sp.documentno || sp.title,
    CurrentStatus: getStatusLabel(sp.statusKey) as HRCurrentStatus || 'Draft',
    EnvironmentTag: 'PROD',
    Division: sp.division || '',
    FormData: sp.details, // or whatever field stores JSON
  };
}
```

#### Step 1.2.3 — Update each HR page

For each HR page (`leave.tsx`, `health.tsx`, `recruitment.tsx`), verify:
1. The import path doesn't need to change (same module)
2. The data returned from `create()` now has real SharePoint IDs
3. Error handling works with real SharePoint errors (not mock errors)
4. The success notification references real ticket IDs

### Fix 1.3: Set up MainDB_IT_JHR and MainDB_IT_Ext_Policy lists

**Issue:** CRIT-03
**Files:**
- `power.config.json` (update GUIDs)
- `src/services/main-dbit-site-service.ts` (verify fallback logic)

#### Step 1.3.1 — Create MainDB_IT_JHR SharePoint list

Run the existing column provisioning script:

```powershell
.\scripts\Add-MainDB_IT-Columns.ps1 -ListName "MainDB_IT_JHR"
```

This creates the list with the same schema as MainDB_IT.

#### Step 1.3.2 — Create MainDB_IT_Ext_Policy SharePoint list

Run the existing policy extension script:

```powershell
.\scripts\Add-IOIP-Ext-Policy-Columns.ps1 -ListName "MainDB_IT_Ext_Policy"
```

#### Step 1.3.3 — Add data sources in Power Apps Studio

1. Open the app in Power Apps Studio
2. Add MainDB_IT_JHR as a data source → copy the generated GUID
3. Add MainDB_IT_Ext_Policy as a data source → copy the generated GUID

#### Step 1.3.4 — Update `power.config.json`

Replace the placeholder GUIDs:

```json
"maindb_it_jhr": {
  "tableName": "GUID-FROM-POWERAPPS-STUDIO"
},
"maindb_it_ext_policy": {
  "tableName": "GUID-FROM-POWERAPPS-STUDIO"
}
```

#### Step 1.3.5 — Update site service

In `src/services/main-dbit-site-service.ts`:
1. Remove the `johorWarningShown` variable and warning
2. Remove the try/catch fallback to `MainDBITService` for Johor (routes should be deterministic now)
3. Update the `@todo` comment

---

## Phase 2 — Field Type & Mapping Corrections

### Fix 2.1: Fix ExtAccess service DATA_SOURCE_NAME casing

**Issue:** HIGH-08
**File:** `src/generated/services/main-dbit-ext-access-service.ts`

**Current:**
```typescript
const DATA_SOURCE_NAME = 'MainDBITExtAccess';
```

**Verify against** `power.config.json`:
```json
"maindb_it_ext_access": { ... }
```

If the casing doesn't match (it likely won't since the config key uses lowercase with underscores), update:
```typescript
const DATA_SOURCE_NAME = 'maindb_it_ext_access';
```

Also check `main-dbit-ext-sap-service.ts`, `main-dbit-ext-assets-service.ts`, `main-dbit-ext-docs-service.ts`, `main-dbit-ext-support-service.ts` for the same issue.

### Fix 2.2: Complete ExtAccess field mapping for OData filters

**Issue:** MED-08
**File:** `src/generated/services/main-dbit-ext-access-service.ts`

**Current** — only 4 fields mapped:
```typescript
const EXT_ACCESS_FIELD_MAP: Record<string, string> = {
  parentformcode: 'ParentFormCode',
  parentsite: 'ParentSite',
  title: 'Title',
  id: 'ID',
};
```

**Add all EAF, NIR, RS, SFAR fields:**
```typescript
const EXT_ACCESS_FIELD_MAP: Record<string, string> = {
  parentformcode: 'ParentFormCode',
  parentsite: 'ParentSite',
  parentformcode: 'ParentFormCode',
  title: 'Title',
  id: 'ID',
  // EAF fields
  eafapplication: 'EAF_Application',
  eaftargetuseremail: 'EAF_TargetUser_Email',
  eafsystemname: 'EAF_SystemName',
  eafjustification: 'EAF_Justification',
  eafdeptheademail: 'EAF_DeptHead_Email',
  eafdeptheadstatus: 'EAF_DeptHead_Status',
  eafdeptheaddate: 'EAF_DeptHead_Date',
  // ... add all remaining EAF fields
  // NIR fields
  nirfullname: 'NIR_FullName',
  nirdepartment: 'NIR_Department',
  nirrequesttype: 'NIR_RequestType',
  // ... add all remaining NIR fields
  // RS fields ...
  // SFAR fields ...
};
```

**Important:** Verify the actual SharePoint internal column names from the schema export in Phase 0. The internal names may use underscores (e.g., `EAF_Application`) or be camelCase.

### Fix 2.3: Configure FormType choice options in SharePoint

**Issue:** HIGH-06
**Files:**
- SharePoint list settings (not code)
- `src/generated/models/main-dbit-model.ts` (update labels after SP config)

**Steps:**
1. In SharePoint, navigate to MainDB_IT → List Settings → FormType column
2. Add the choice options that map to `FormTypeKey0`, `FormTypeKey1`, `FormTypeKey2`
3. Update `MainDBITFormTypeKeyToLabel` in the model file:

```typescript
export const MainDBITFormTypeKeyToLabel = {
  'FormTypeKey0': 'Standard',
  'FormTypeKey1': 'Urgent',
  'FormTypeKey2': 'Scheduled',
} as const;
```

(Use actual business labels from Domino analysis.)

### Fix 2.4: Add stable choice key mapping layer

**Issue:** MED-03
**New file:** `src/lib/choice-key-mapper.ts`

**Problem:** The current `normalize()` function extracts numeric IDs from key strings like `'CurrentstatusKey30' -> 30`. If SharePoint choice options are reordered, these indices shift and ALL existing records break.

**Solution:** Add a validation utility that warns when an unexpected key is encountered:

```typescript
/**
 * Choice Key Mapper
 *
 * Validates that choice keys match expected patterns and warns
 * if a key doesn't match any known entry. This catches SharePoint
 * choice option reordering issues early.
 */

import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';

export function validateChoiceKey<T extends string>(
  key: T | undefined,
  keyToLabel: Record<T, string>,
  fieldName: string
): T | undefined {
  if (!key) return undefined;
  if (key in keyToLabel) return key;

  console.warn(
    `[ChoiceKeyMapper] Unknown key "${key}" for field "${fieldName}". ` +
    `SharePoint choice options may have been reordered.`
  );
  return key;
}

export function validateCurrentStatusKey(
  key: string | undefined
): string | undefined {
  return validateChoiceKey(
    key as keyof typeof MainDBITCurrentstatusKeyToLabel,
    MainDBITCurrentstatusKeyToLabel,
    'CurrentStatus'
  );
}
```

Integrate into `MainDBITService.normalize()`:
```typescript
// Before:
const siteKeyVal = choiceKey('SiteKey', record, 'siteKey', 'Site#Id');

// After:
const siteKeyRaw = choiceKey('SiteKey', record, 'siteKey', 'Site#Id');
const siteKeyVal = validateChoiceKey(siteKeyRaw, MainDBITSiteKeyToLabel, 'Site');
```

### Fix 2.5: Verify EnvironmentTag write path

**Issue:** MED-09
**File:** `src/generated/services/main-dbit-service.ts` — `denormalize()` function

**Current:**
```typescript
if (record.environmenttagKey !== undefined) {
  out.EnvironmentTag = choiceValue(MainDBITEnvironmenttagKeyToLabel[record.environmenttagKey]);
}
```

**Verify:** That the SP connector accepts `{ Value: 'Production' }` format for EnvironmentTag writes. If not, change to write the raw key string.

---

## Phase 3 — Parent-Child & Workflow Resilience

### Fix 3.1: Implement rollback on child creation failure

**Issue:** MED-01
**File:** `src/pages/it/forms/eaf/new.tsx`

**Current** — orphan risk:
```typescript
const createdDraft = await createMainDBIT.mutateAsync(submissionData);
// If this fails, parent already exists but child doesn't
const extAccessData = { ... };
await MainDBITExtAccessService.create(extAccessData);
```

**Fixed** — delete parent on child failure:
```typescript
const createdDraft = await retryWithBackoff(
  () => createMainDBIT.mutateAsync(submissionData),
  handleRetryNotification
);

try {
  const extAccessData = { ... };
  await retryWithBackoff(
    () => MainDBITExtAccessService.create(extAccessData),
    handleRetryNotification
  );
} catch (childError) {
  // Rollback: delete parent record since child failed
  try {
    await MainDBITService.delete(String(createdDraft.id));
  } catch (deleteError) {
    console.error('[EAF] Failed to rollback parent record after child creation failure:', deleteError);
  }
  throw childError; // Re-throw for outer catch
}
```

**Apply the same pattern to** all forms that create parent + child records:
- `itssr/new.tsx` (MainDB_IT + Ext_Support)
- `hwrr/new.tsx` (MainDB_IT + Ext_Assets)
- `itsc/new.tsx` (MainDB_IT + Ext_Assets)
- `saptr/new.tsx` (MainDB_IT + Ext_SAP)
- `itinfo/new.tsx` (MainDB_IT + Ext_Docs)

### Fix 3.2: Verify new ExtAccess columns in SharePoint

**Issue:** MED-02
**File:** `src/pages/it/forms/eaf/new.tsx`

The EAF form writes these fields to ExtAccess:
```
eAFClientID     → from   formData.ClientID       (Domino 'ClientID')
eAFUserGroup    → from   formData.Group           (Domino 'Group')
eAFHigherApproverEmail → from formData.HigherApprover (Domino 'HApp')
```

**Action:** After Phase 0 schema export, verify these columns exist in `MainDB_IT_Ext_Access`.

If they don't exist:
1. Add them via PowerShell: `Add-PnPField -List "MainDB_IT_Ext_Access" -InternalName "EAF_ClientID" -DisplayName "EAF Client ID" -Type Text`
2. Add them to the model `MainDBITExtAccess`
3. Add normalization/denormalization in the service

### Fix 3.3: Refactor ITSSR section data storage

**Issue:** MED-04
**Action:** Move ITSSR section data from `remarks` JSON into proper ExtSupport columns

**Current pattern** — fragile JSON-in-remarks:
```typescript
const remarks = s.remarks || '';
const start = remarks.indexOf('[ITSSR_SECTION1_JSON]');
const end = remarks.indexOf('[/ITSSR_SECTION1_JSON]');
if (start >= 0 && end > start) {
  section1 = JSON.parse(remarks.slice(...));
}
```

**Refactored pattern:**

1. In `ITSSRNewScreen` (features/itssr), instead of writing section data as JSON to `remarks`, write them to `MainDBITExtSupport` columns:
   - `iTSSRProblemCategory` → SP column `ITSSR_ProblemCategory`
   - `iTSSRServiceType` → SP column `ITSSR_ServiceType`
   - `iTSSRProblemDescription` → SP column `ITSSR_ProblemDescription`
   - etc.

2. Update `ITSSRDetails` in `submission-details/index.tsx` to read from the `MainDBITExtSupport` record directly instead of parsing JSON.

3. Keep `remarks` for actual human-readable notes (not structured data).

### Fix 3.4: Replace HR mock approval records

**Issue:** MED-06
**File:** `src/services/hr-submission-service.ts`

In the new SharePoint-connected implementation (from Fix 1.2), replace `mockApprovalRecords` with real `ApprovalHistoryHRService` calls:

```typescript
// OLD (mock):
mockApprovalRecords.set(id, [approvalRecord]);

// NEW (real):
await ApprovalHistoryHRService.create({
  title: stageName,
  parentID: created.id,
  formCode: input.FormType,
  actionCode: 'Submitted',
  actionOn: new Date().toISOString(),
  actionComment: 'Initial submission',
  // ... map remaining fields
});
```

---

## Phase 4 — Deprecation Cleanup & Metadata Accuracy

### Fix 4.1: Remove deprecated mock service from public exports

**Issue:** HIGH-05
**File:** `src/services/index.ts`

**Current:**
```typescript
export * from './sharepoint-submission-service';
```

**Changed to:**
```typescript
// REMOVED: sharepoint-submission-service is deprecated - use generated services instead
```

Also add a linting rule to prevent re-introduction:

**.eslintrc addition:**
```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "@/services/sharepoint-submission-service",
        "message": "This service is deprecated. Use generated services (MainDBITService, etc.) instead."
      }]
    }]
  }
}
```

### Fix 4.2: Update data source mappings

**Issue:** HIGH-04, HIGH-07
**File:** `src/types/data-source-mapping.ts`

For every IT form entry, change:
```typescript
sourceType: 'in-memory',
connectionStatus: 'mock',
```

To:
```typescript
sourceType: 'sharepoint',
connectionStatus: 'connected',
```

And update the `service.name` from `'SharePointSubmissionService'` to `'MainDBITService'` (or the appropriate generated service).

Also update the `hooks` arrays to reference the actual generated hooks (e.g., `useMainDBITList`, `useCreateMainDBIT`, `useUpdateMainDBIT`).

### Fix 4.3: Audit formCode strings for consistency

**Issue:** LOW-01
**Files:**
- `src/config/module-workflows.ts`
- `src/config/departments.ts`
- `src/config/form-dropdown-config.ts`
- `src/types/m1-forms.ts`, `src/types/m2-forms.ts`
- `src/services/sharepoint-submission-service.ts` (FORM_CODES constant)

**Action:** Create a single source of truth for form codes:

1. Extract all form codes into a shared constant file: `src/lib/form-code-registry.ts`
2. Verify every form code string across all files matches the registry
3. Use the registry everywhere instead of inline string literals

```typescript
// src/lib/form-code-registry.ts
export const FORM_CODES = {
  EAF: 'EAF',
  NIR: 'NIR',
  RS: 'RS',
  SFAR: 'SFAR',
  UR: 'UR',
  ITSSR: 'ITSSR',
  IAL1: 'IAL1',
  IAL2: 'IAL2',
  IAL3: 'IAL3',
  IAL4: 'IAL4',
  IAL5: 'IAL5',
  ITDR: 'ITDR',
  ITDR2: 'ITDR2',
  PRF: 'PRF',
  HI: 'HI',
  ITSC: 'ITSC',
  // ... SAP forms
  // ... Documentation forms
} as const;

export type FormCode = typeof FORM_CODES[keyof typeof FORM_CODES];
```

---

## Phase 5 — UI Label & Documentation

### Fix 5.1: Generate SharePoint schema documentation

**Issue:** LOW-02
**Action:** From the Phase 0 schema exports, generate a consolidated reference.

**Output file:** `docs/sharepoint-schemas/schema-reference.md`

Format per list:
```markdown
## MainDB_IT

| InternalName | DisplayName | Type | Required | Choice Options |
|-------------|-------------|------|----------|----------------|
| Title | Title | Text | Yes | — |
| FormCode | FormCode | Text | Yes | — |
| CurrentStatus | CurrentStatus | Choice | Yes | Active, Approved, Closed, Draft, Sent, Verified, Withdrawn, ... |
| Site | Site | Choice | No | Johor, Penang, Prai, Kuala Lumpur, Both Sites |
| EnvironmentTag | EnvironmentTag | Choice | No | Production, UAT, Development |
| ... | ... | ... | ... | ... |
```

### Fix 5.2: Audit dynamic form column references

**Issue:** LOW-03
**Files:** `src/form-schemas/*.ts` (or wherever dynamic schemas are defined)

For every `FieldSchema.spColumn` reference, cross-check against the actual SharePoint internal column name from the Phase 0 exports.

### Fix 5.3: Fix HI PurchasePrice type

**Issue:** LOW-04
**File:** `src/generated/services/main-dbit-service.ts`

The `STRUCTURED_FIELD_MAP` has:
```typescript
['hIPurchasePrice', 'HI_PurchasePrice', 'number'],
```

And the `MainDBIT` model has:
```typescript
hIPurchasePrice?: number;
```

Verify in SharePoint that `HI_PurchasePrice` is indeed a Number/Currency type. If it's Text, update the model to `string`.

### Fix 5.4: Add site key logging

**Issue:** LOW-05
**File:** `src/services/main-dbit-site-service.ts`

Add console.warn when a site key doesn't match known values:
```typescript
export function siteKeyToSiteCode(siteKey: string): SiteCode {
  switch (siteKey) {
    case 'SiteKey0': return 'MY-JH';
    case 'SiteKey1': return 'MY-PR';
    default:
      console.warn(`[siteKeyToSiteCode] Unknown siteKey: "${siteKey}". Defaulting to MY-PR.`);
      return 'MY-PR';
  }
}
```

### Fix 5.5: Implement Power Automate ticket ID generation

**Issue:** LOW-06
**Action:** Create a Power Automate flow (not code change)

**Flow design:**
1. **Trigger:** When an item is created in SharePoint → MainDB_IT
2. **Step 1:** Get the `FormCode` value from the new item
3. **Step 2:** Get the last ticket number using OData query:
   ```
   GET /_api/web/lists/getbytitle('MainDB_IT')/items?$filter=startswith(Title,'{FormCode}-')&$orderby=Created desc&$top=1
   ```
4. **Step 3:** Parse the sequence number, increment it
5. **Step 4:** Format: `{FormCode}-{YYYY}{MM}-{SEQ:06d}`
6. **Step 5:** Update the Title field via SharePoint connector

**Flow file location:** `powerapps-mirror/apps/ioi-platform/flows/generate-ticket-id.json`

---

## Validation Gates

### Gate 1: TypeScript Compilation

After each phase, run:
```powershell
cd "ioicodeapp\powerapps-mirror\apps\ioi-platform"
npx tsc --noEmit
```

All phases must pass with zero errors before proceeding.

### Gate 2: Unit Tests

For the refactored services:

| Test | What it validates |
|------|------------------|
| `EAFDetailsExtAccess` | EAF details render correct ExtAccess fields, not NIR fields |
| `HRSubmissionServiceCreate` | Creates real MainDB_HR record via generated service |
| `ChoiceKeyValidation` | Unknown choice keys generate warnings, not crashes |
| `ParentChildRollback` | Parent record deleted on child creation failure |
| `ExtAccessFieldMapping` | All OData filter fields translate correctly |

### Gate 3: Integration Tests

Before deploying to production:
1. Submit an **EAF form** → verify MainDB_IT + Ext_Access created in SharePoint
2. View the **EAF submission detail** → verify correct ExtAccess data shown
3. Submit an **ITSSR form** → verify MainDB_IT + Ext_Support created
4. Submit an **HR leave form** → verify MainDB_HR record created
5. Submit a **STR form** → verify MainDB_STR record created
6. Perform an **approval action** → verify status update + ApprovalRecords entry
7. Test **Johor site** → verify MainDB_IT_JHR is used (after Phase 1.3)

### Gate 4: Performance Check

- Verify `Filter` queries use indexed SharePoint columns
- Verify no OData queries exceed SharePoint 5000-item list view threshold
- Verify galleries use delegation-compatible filters

---

## Rollback Strategy

Each refactoring phase should be implemented on its own Git branch:

```powershell
git checkout -b fix/phase1-critical-fixes
git checkout -b fix/phase2-field-mapping
git checkout -b fix/phase3-parent-child
git checkout -b fix/phase4-deprecation
git checkout -b fix/phase5-documentation
```

### Reverting individual fixes

| Fix | Revert action |
|-----|---------------|
| EAFDetails rewrite | `git revert` the commit modifying `submission-details/index.tsx` |
| HR service rewrite | Keep old `hr-submission-service.ts` as `hr-submission-service.mock.ts`, restore imports |
| SP list GUIDs | Revert `power.config.json` to placeholder GUIDs |
| Data source mappings | Revert `data-source-mapping.ts` |

### If a production hotfix is needed

1. Revert the specific phase branch
2. Apply the minimum fix on a `hotfix/` branch
3. Deploy hotfix, then re-apply the full phase branch later

---

## Effort Summary

| Phase | Estimated Hours | Dependencies |
|-------|----------------|--------------|
| Phase 0 — Preflight | 6 | Access to SharePoint sites |
| Phase 1 — Critical | 16 | Phase 0 complete |
| Phase 2 — Mapping | 6 | Phase 0.3 (schema verification) |
| Phase 3 — Resilience | 8 | Phase 2 complete |
| Phase 4 — Cleanup | 4 | Phase 1, 2 complete |
| Phase 5 — Docs | 6 | All phases complete |
| **Total** | **46 hours** | |

---

*End of Refactoring Plan*
