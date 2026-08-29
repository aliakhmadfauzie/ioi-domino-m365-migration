/**
 * MRF Write Map — IT Department
 *
 * Declares exactly which app controls map to which SP columns for each
 * write action.  The debug write wrapper uses this to build safe field
 * previews and detect type mismatches before the data is sent to SP.
 */
import { FieldType } from '@/debug/debugTypes';
import type { WriteActionMeta } from '@/debug/debugTypes';

export const MRF_SITE_URL  = 'https://ioioi.sharepoint.com/sites/ioi-portal-it';
export const MRF_LIST_NAME = 'maindb_it';
export const MRF_LIST_DISPLAY_NAME = 'IT Main Database';

export const mrfWriteActions: WriteActionMeta[] = [
  // ─── Submit new request ───────────────────────────────────────────────────
  {
    actionKey: 'mrf_create',
    buttonOrActionName: 'Submit Request',
    targetListName: MRF_LIST_NAME,
    targetListDisplayName: MRF_LIST_DISPLAY_NAME,
    targetSiteUrl: MRF_SITE_URL,
    operation: 'Create',
    fieldMappings: [
      {
        appControlName: 'titleInput',
        appColumnName:  'Title',
        appFieldType:   FieldType.Text,
        spColumnName:   'Title',
        spFieldType:    FieldType.Text,
        validationRule: 'Required, max 255 characters',
      },
      {
        appControlName: 'formCodeInput',
        appColumnName:  'FormCode',
        appFieldType:   FieldType.Text,
        spColumnName:   'FormCode',
        spFieldType:    FieldType.Text,
        transformFn:    'toUpperCase',
        validationRule: 'Auto-generated: IT-MRF-YYYYMMDD-NNNN',
      },
      {
        appControlName: 'requestorEmailInput',
        appColumnName:  'Requestor_Email',
        appFieldType:   FieldType.Text,
        spColumnName:   'Requestor_Email',
        spFieldType:    FieldType.Text,
        validationRule: 'Must be a valid UPN from Office365Users',
      },
      {
        appControlName: 'submittedDateInput',
        appColumnName:  'SubmittedDate',
        appFieldType:   FieldType.DateTime,
        spColumnName:   'SubmittedDate',
        spFieldType:    FieldType.DateTime,
        transformFn:    'toISOString',
      },
      {
        appControlName: 'siteSelect',
        appColumnName:  'Site',
        appFieldType:   FieldType.Choice,
        spColumnName:   'Site',
        spFieldType:    FieldType.Choice,
        validationRule: 'Must be one of the configured site codes',
      },
      {
        appControlName: 'departmentSelect',
        appColumnName:  'Department',
        appFieldType:   FieldType.Choice,
        spColumnName:   'Department',
        spFieldType:    FieldType.Choice,
      },
      {
        appControlName: 'itemDescInput',
        appColumnName:  'ItemDescription',
        appFieldType:   FieldType.Text,
        spColumnName:   'ItemDescription',
        spFieldType:    FieldType.Text,
        validationRule: 'Required',
      },
      {
        appControlName: 'quantityInput',
        appColumnName:  'Quantity',
        appFieldType:   FieldType.Number,
        spColumnName:   'Quantity',
        spFieldType:    FieldType.Number,
        validationRule: 'Must be > 0',
      },
      {
        appControlName: 'unitSelect',
        appColumnName:  'Unit',
        appFieldType:   FieldType.Choice,
        spColumnName:   'Unit',
        spFieldType:    FieldType.Choice,
      },
      {
        appControlName: 'justificationInput',
        appColumnName:  'Justification',
        appFieldType:   FieldType.Text,
        spColumnName:   'Justification',
        spFieldType:    FieldType.Text,
        validationRule: 'Required, min 10 characters',
      },
      {
        appControlName: 'prioritySelect',
        appColumnName:  'Priority',
        appFieldType:   FieldType.Choice,
        spColumnName:   'Priority',
        spFieldType:    FieldType.Choice,
      },
      {
        appControlName: 'requiredByInput',
        // BUG: app sends "RequiredByDate" but SP column is "RequiredBy"
        // → this mismatch will be surfaced by compareWriteMap()
        appColumnName: 'RequiredByDate',
        appFieldType:  FieldType.Date,
        spColumnName:  'RequiredBy',
        spFieldType:   FieldType.Date,
      },
      {
        appControlName: 'currentStatusInput',
        appColumnName:  'CurrentStatus',
        appFieldType:   FieldType.Choice,
        spColumnName:   'CurrentStatus',
        spFieldType:    FieldType.Choice,
        transformFn:    'defaultToSubmitted',
      },
      {
        appControlName: 'workflowStageInput',
        appColumnName:  'WorkflowStage',
        appFieldType:   FieldType.Text,
        spColumnName:   'WorkflowStage',
        spFieldType:    FieldType.Text,
        transformFn:    'defaultToInitial',
      },
      {
        appControlName: 'isLockedInput',
        appColumnName:  'IsLocked',
        appFieldType:   FieldType.Boolean,
        spColumnName:   'IsLocked',
        spFieldType:    FieldType.Boolean,
      },
    ],
  },

  // ─── Approver updates the record ─────────────────────────────────────────
  {
    actionKey: 'mrf_update_status',
    buttonOrActionName: 'Update Status',
    targetListName: MRF_LIST_NAME,
    targetListDisplayName: MRF_LIST_DISPLAY_NAME,
    targetSiteUrl: MRF_SITE_URL,
    operation: 'Update',
    fieldMappings: [
      {
        appControlName: 'currentStatusInput',
        appColumnName:  'CurrentStatus',
        appFieldType:   FieldType.Choice,
        spColumnName:   'CurrentStatus',
        spFieldType:    FieldType.Choice,
        validationRule: 'Must be a valid status transition',
      },
      {
        appControlName: 'workflowStageInput',
        appColumnName:  'WorkflowStage',
        appFieldType:   FieldType.Text,
        spColumnName:   'WorkflowStage',
        spFieldType:    FieldType.Text,
      },
      {
        appControlName: 'remarksInput',
        appColumnName:  'Remarks',
        appFieldType:   FieldType.Text,
        spColumnName:   'Remarks',
        spFieldType:    FieldType.Text,
      },
      {
        appControlName: 'isLockedInput',
        appColumnName:  'IsLocked',
        appFieldType:   FieldType.Boolean,
        spColumnName:   'IsLocked',
        spFieldType:    FieldType.Boolean,
      },
    ],
  },
];
