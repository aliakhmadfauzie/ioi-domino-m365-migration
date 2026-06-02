/**
 * MRF (Material Request Form) — IT Department
 * Data source: maindb_it  (ioi-portal-it site)
 *
 * This file is the single source of truth for:
 *   • Fields the app expects to read/write  (appFields)
 *   • Fields the SharePoint list actually provides (spFields)
 *
 * Keep spFields in sync with the actual SharePoint list schema.
 * The schema comparison utility diffs these two arrays at runtime.
 */
import { FieldType } from '@/debug/debugTypes';
import type { AppField, SharePointField } from '@/debug/debugTypes';

// ─── App-side field declarations ──────────────────────────────────────────────

export const mrfAppFields: AppField[] = [
  { controlName: 'titleInput',          appColumnName: 'Title',            fieldType: FieldType.Text,     required: true,  description: 'Request title / subject' },
  { controlName: 'formCodeInput',       appColumnName: 'FormCode',         fieldType: FieldType.Text,     required: true,  description: 'e.g. IT-MRF' },
  { controlName: 'requestorEmailInput', appColumnName: 'Requestor_Email',  fieldType: FieldType.Text,     required: true,  description: 'Requestor UPN/email' },
  { controlName: 'submittedDateInput',  appColumnName: 'SubmittedDate',    fieldType: FieldType.DateTime, required: false, description: 'Date form was submitted' },
  { controlName: 'siteSelect',          appColumnName: 'Site',             fieldType: FieldType.Choice,   required: true,  description: 'Plant / site code' },
  { controlName: 'departmentSelect',    appColumnName: 'Department',       fieldType: FieldType.Choice,   required: true,  description: 'Requesting department' },
  { controlName: 'itemDescInput',       appColumnName: 'ItemDescription',  fieldType: FieldType.Text,     required: true,  description: 'Material/item description' },
  { controlName: 'quantityInput',       appColumnName: 'Quantity',         fieldType: FieldType.Number,   required: true,  description: 'Quantity requested' },
  { controlName: 'unitSelect',          appColumnName: 'Unit',             fieldType: FieldType.Choice,   required: true,  description: 'Unit of measure' },
  { controlName: 'justificationInput',  appColumnName: 'Justification',    fieldType: FieldType.Text,     required: true,  description: 'Business justification' },
  { controlName: 'prioritySelect',      appColumnName: 'Priority',         fieldType: FieldType.Choice,   required: false, description: 'Low / Medium / High / Urgent' },
  { controlName: 'requiredByInput',     appColumnName: 'RequiredByDate',   fieldType: FieldType.Date,     required: false, description: 'Date item is needed' },
  { controlName: 'currentStatusInput',  appColumnName: 'CurrentStatus',    fieldType: FieldType.Choice,   required: false, description: 'Workflow status' },
  { controlName: 'workflowStageInput',  appColumnName: 'WorkflowStage',    fieldType: FieldType.Text,     required: false, description: 'Current workflow stage label' },
  { controlName: 'remarksInput',        appColumnName: 'Remarks',          fieldType: FieldType.Text,     required: false, description: 'General remarks' },
  { controlName: 'isLockedInput',       appColumnName: 'IsLocked',         fieldType: FieldType.Boolean,  required: false, description: 'Prevent further edits' },
];

// ─── SharePoint schema registry ───────────────────────────────────────────────
// Manually maintained to match the actual SP list columns.
// When Power Automate or site admins add/rename columns, update this array.

export const mrfSpFields: SharePointField[] = [
  { internalName: 'Title',           displayName: 'Title',              fieldType: FieldType.Text,     required: true  },
  { internalName: 'FormCode',        displayName: 'Form Code',          fieldType: FieldType.Text,     required: true  },
  { internalName: 'Requestor_Email', displayName: 'Requestor Email',    fieldType: FieldType.Text,     required: true  },
  { internalName: 'SubmittedDate',   displayName: 'Submitted Date',     fieldType: FieldType.DateTime, required: false },
  { internalName: 'Site',            displayName: 'Site',               fieldType: FieldType.Choice,   required: true  },
  { internalName: 'Department',      displayName: 'Department',         fieldType: FieldType.Choice,   required: true  },
  { internalName: 'ItemDescription', displayName: 'Item Description',   fieldType: FieldType.Text,     required: true  },
  { internalName: 'Quantity',        displayName: 'Quantity',           fieldType: FieldType.Number,   required: true  },
  { internalName: 'Unit',            displayName: 'Unit',               fieldType: FieldType.Choice,   required: true  },
  { internalName: 'Justification',   displayName: 'Justification',      fieldType: FieldType.Text,     required: true  },
  { internalName: 'Priority',        displayName: 'Priority',           fieldType: FieldType.Choice,   required: false },
  // NOTE: SP column is "RequiredBy" but app declares "RequiredByDate" → intentional mismatch for demo
  { internalName: 'RequiredBy',      displayName: 'Required By',        fieldType: FieldType.Date,     required: false },
  { internalName: 'CurrentStatus',   displayName: 'Current Status',     fieldType: FieldType.Choice,   required: false },
  { internalName: 'WorkflowStage',   displayName: 'Workflow Stage',     fieldType: FieldType.Text,     required: false },
  { internalName: 'Remarks',         displayName: 'Remarks',            fieldType: FieldType.Text,     required: false },
  { internalName: 'IsLocked',        displayName: 'Is Locked',          fieldType: FieldType.Boolean,  required: false },
  // Extra SP columns the app does not currently use
  { internalName: 'ApproverEmail',   displayName: 'Approver Email',     fieldType: FieldType.Text,     required: false },
  { internalName: 'ApprovedDate',    displayName: 'Approved Date',      fieldType: FieldType.DateTime, required: false },
];
