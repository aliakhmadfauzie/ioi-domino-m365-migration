/**
 * MRF Screen Metadata Registrations — IT Department
 *
 * Each screen that participates in the debug system has one entry here.
 * Screens call debugRegistry.register(MRF_NEW_META) on mount.
 *
 * Also registers mock fixture data for Mock/Hybrid data modes.
 */
import { FormMode, SourceKind } from '@/debug/debugTypes';
import type { ScreenMeta } from '@/debug/debugTypes';
import { debugRegistry } from '@/debug/debugRegistry';
import { mockDataClient } from '@/data/mockDataClient';
import { mrfAppFields, mrfSpFields } from './mrf.schema';
import { mrfWriteActions, MRF_SITE_URL, MRF_LIST_NAME, MRF_LIST_DISPLAY_NAME } from './mrf.writeMap';

// ─── Shared read source ───────────────────────────────────────────────────────

const mrfReadSource = {
  sourceKey: 'maindb_it',
  friendlyTitle: 'IT Material Request Form Records',
  entityName: 'MRFRequest',
  sourceKind: SourceKind.SharePoint,
  siteUrl: MRF_SITE_URL,
  listName: MRF_LIST_NAME,
  listDisplayName: MRF_LIST_DISPLAY_NAME,
  appFields: mrfAppFields,
  spFields: mrfSpFields,
} as const;

// ─── Per-screen metadata ──────────────────────────────────────────────────────

export const MRF_NEW_META: ScreenMeta = {
  screenId: 'it-mrf-new',
  routePath: '/it/forms/mrf/new',
  screenTitle: 'New Material Request',
  departmentCode: 'IT',
  departmentName: 'Information Technology',
  formCode: 'MRF',
  formTitle: 'Material Request Form',
  formMode: FormMode.New,
  readSources: [mrfReadSource],
  writeActions: mrfWriteActions,
};

export const MRF_EDIT_META: ScreenMeta = {
  screenId: 'it-mrf-edit',
  routePath: '/it/forms/mrf/:id/edit',
  screenTitle: 'Edit Material Request',
  departmentCode: 'IT',
  departmentName: 'Information Technology',
  formCode: 'MRF',
  formTitle: 'Material Request Form',
  formMode: FormMode.Edit,
  readSources: [mrfReadSource],
  writeActions: mrfWriteActions.filter((a) => a.actionKey === 'mrf_update_status'),
};

export const MRF_VIEW_META: ScreenMeta = {
  screenId: 'it-mrf-view',
  routePath: '/it/forms/mrf/:id',
  screenTitle: 'View Material Request',
  departmentCode: 'IT',
  departmentName: 'Information Technology',
  formCode: 'MRF',
  formTitle: 'Material Request Form',
  formMode: FormMode.View,
  readSources: [mrfReadSource],
  writeActions: [],
};

// ─── Mock fixtures ────────────────────────────────────────────────────────────

mockDataClient.register('maindb_it', [
  {
    id: 1,
    Title: 'IT Equipment Request - Laptop',
    FormCode: 'IT-MRF-20250101-0001',
    Requestor_Email: 'ali.ahmad@ioiacidchem.com',
    SubmittedDate: '2025-01-01T08:00:00Z',
    Site: '5102',
    Department: 'IT',
    ItemDescription: 'Dell Latitude 5540 Laptop for new hire',
    Quantity: 1,
    Unit: 'Unit',
    Justification: 'New employee joining on 15 Jan requires workstation',
    Priority: 'High',
    RequiredBy: '2025-01-14',
    CurrentStatus: 'Submitted',
    WorkflowStage: 'PendingHODApproval',
    Remarks: null,
    IsLocked: false,
  },
  {
    id: 2,
    Title: 'Network Switch Replacement',
    FormCode: 'IT-MRF-20250102-0002',
    Requestor_Email: 'zainab.hassan@ioiacidchem.com',
    SubmittedDate: '2025-01-02T09:30:00Z',
    Site: '5200',
    Department: 'IT',
    ItemDescription: 'Cisco Catalyst 2960-X 48-port switch',
    Quantity: 2,
    Unit: 'Unit',
    Justification: 'Existing switches at server room end-of-life',
    Priority: 'Urgent',
    RequiredBy: '2025-01-07',
    CurrentStatus: 'Approved',
    WorkflowStage: 'Completed',
    Remarks: 'Pre-approved by IT Manager',
    IsLocked: true,
  },
]);

// ─── Pre-register all MRF screens ────────────────────────────────────────────
// Called once when this module is imported.

export function registerMRFScreens(): void {
  debugRegistry.register(MRF_NEW_META);
  debugRegistry.register(MRF_EDIT_META);
  debugRegistry.register(MRF_VIEW_META);
}
