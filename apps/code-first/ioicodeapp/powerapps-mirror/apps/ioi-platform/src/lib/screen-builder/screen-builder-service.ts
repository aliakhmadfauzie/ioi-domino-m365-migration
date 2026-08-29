// =============================================================================
// Screen Builder — Service
// Generates ScreenFormDefinitions from department/module/form config.
// Provides helpers for building list columns, form sections, and detail groups
// from the lightweight FormDefinition metadata.
// =============================================================================

import { FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  type Department,
  type ModuleDefinition,
  type FormDefinition,
  type DepartmentCode,
  getDepartmentModules,
  getDepartmentByCode,
} from '@/config/departments';
import type {
  ScreenFormDefinition,
  ScreenFieldDef,
  ScreenSectionDef,
  ScreenListColumn,
  ScreenDetailFieldGroup,
  ScreenFieldType,
  DepartmentScreenConfig,
} from './screen-builder-types';

// ---------------------------------------------------------------------------
// Screen builder config registry
// Map department codes to their screen builder settings.
// Departments with useScreenBuilder: true get auto-generated pages.
// ---------------------------------------------------------------------------

export const DEPARTMENT_SCREEN_CONFIGS: Partial<Record<DepartmentCode, DepartmentScreenConfig>> = {
  GOV:  { useScreenBuilder: true, sharePointList: 'MainDB_GOV', defaultStatus: 'Submitted' },
  MTR:  { useScreenBuilder: true, sharePointList: 'MainDB_MTR', defaultStatus: 'Submitted' },
  PUR:  { useScreenBuilder: true, sharePointList: 'MainDB_PUR', defaultStatus: 'Submitted' },
  WH:   { useScreenBuilder: true, sharePointList: 'MainDB_WH', defaultStatus: 'Submitted' },
  LOG:  { useScreenBuilder: true, sharePointList: 'MainDB_LOG', defaultStatus: 'Submitted' },
  SEC:  { useScreenBuilder: true, sharePointList: 'MainDB_SEC', defaultStatus: 'Submitted' },
  TD:   { useScreenBuilder: true, sharePointList: 'MainDB_TD', defaultStatus: 'Submitted' },
  ENG:  { useScreenBuilder: true, sharePointList: 'MainDB_ENG', defaultStatus: 'Submitted' },
  ADM:  { useScreenBuilder: true, sharePointList: 'MainDB_ADM', defaultStatus: 'Submitted' },
  MKT:  { useScreenBuilder: true, sharePointList: 'MainDB_MKT', defaultStatus: 'Submitted' },
};

// ---------------------------------------------------------------------------
// Default icon per form type
// ---------------------------------------------------------------------------

const DEFAULT_FORM_ICON: LucideIcon = FileText;

const FORM_TYPE_ICONS: Record<string, LucideIcon> = {
  report: FileText,
  request: FileText,
  form: FileText,
  register: FileText,
  log: FileText,
  database: FileText,
};

// ---------------------------------------------------------------------------
// Field inference heuristics
// ---------------------------------------------------------------------------

const COMMON_FIELDS: ScreenFieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true, displayOrder: 1 },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true, displayOrder: 2 },
  { name: 'department', label: 'Department', type: 'select', options: [], displayOrder: 3 },
  { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Submitted', 'Approved', 'Rejected'], displayOrder: 99, defaultValue: 'Draft' },
];

/**
 * Infers field type from a form code and field name pattern.
 * Uses heuristics based on common naming conventions.
 */
function inferFieldType(fieldName: string): ScreenFieldType {
  const name = fieldName.toLowerCase();
  if (name.includes('date') || name.includes('start') || name.includes('end') || name.includes('submitted')) return 'date';
  if (name.includes('email')) return 'email';
  if (name.includes('phone') || name.includes('tel') || name.includes('fax')) return 'phone';
  if (name.includes('amount') || name.includes('price') || name.includes('cost') || name.includes('budget') || name.includes('qty') || name.includes('quantity') || name.includes('count') || name.includes('year')) return 'number';
  if (name.includes('remark') || name.includes('comment') || name.includes('note') || name.includes('description') || name.includes('justification') || name.includes('scope') || name.includes('objective')) return 'textarea';
  if (name.includes('type') || name.includes('category') || name.includes('status') || name.includes('priority') || name.includes('method') || name.includes('mode')) return 'select';
  if (name.includes('attachment') || name.includes('file') || name.includes('document')) return 'attachment';
  if (name.includes('is') || name.includes('has') || name.includes('active') || name.includes('enabled') || name.includes('flag')) return 'boolean';
  return 'text';
}

/**
 * Infers dropdown options from a field name.
 * Returns common option sets based on naming patterns.
 */
function inferOptions(fieldName: string): string[] | undefined {
  const name = fieldName.toLowerCase();
  if (name.includes('status')) return ['Draft', 'Pending Review', 'Approved', 'Rejected', 'Completed'];
  if (name.includes('priority')) return ['Low', 'Medium', 'High', 'Critical'];
  if (name === 'type' || name === 'category' || name.endsWith('type') || name.endsWith('category')) return ['Type A', 'Type B', 'Type C', 'Other'];
  if (name.includes('department')) return undefined; // Will be populated from config
  return undefined;
}

/**
 * Generates a set of form fields based on the form's name, description,
 * and workflow stages. The more stages, the more fields we generate.
 */
function generateFormFields(form: FormDefinition): ScreenFieldDef[] {
  const fields: ScreenFieldDef[] = [];
  let order = 0;

  // Basic info fields derived from form metadata
  fields.push({
    name: `${form.formCode.toLowerCase()}-reference`,
    label: `${form.name} Reference No`,
    type: 'text',
    required: true,
    placeholder: `e.g. ${form.formCode.toUpperCase()}-${new Date().getFullYear()}-001`,
    hint: 'Unique reference number',
    displayOrder: order++,
  });

  // Title field is always first
  fields.push({
    name: `${form.formCode.toLowerCase()}-title`,
    label: 'Title / Subject',
    type: 'text',
    required: true,
    fullWidth: true,
    placeholder: `Enter ${form.name.toLowerCase()} title`,
    displayOrder: order++,
  });

  // Description
  fields.push({
    name: `${form.formCode.toLowerCase()}-description`,
    label: 'Description / Details',
    type: 'textarea',
    fullWidth: true,
    required: true,
    placeholder: `Provide details for this ${form.name.toLowerCase()}`,
    displayOrder: order++,
  });

  // If the form has stages (workflow), add status and assignment fields
  if (form.stages && form.stages.length > 0) {
    fields.push({
      name: `${form.formCode.toLowerCase()}-initiator`,
      label: 'Requested By',
      type: 'text',
      required: true,
      hint: 'Your name',
      displayOrder: order++,
    });

    fields.push({
      name: `${form.formCode.toLowerCase()}-date`,
      label: 'Date',
      type: 'date',
      required: true,
      displayOrder: order++,
    });

    fields.push({
      name: `${form.formCode.toLowerCase()}-priority`,
      label: 'Priority',
      type: 'select',
      options: ['Low', 'Medium', 'High', 'Critical'],
      displayOrder: order++,
    });
  }

  // Attachment field
  fields.push({
    name: `${form.formCode.toLowerCase()}-attachment`,
    label: 'Attachment',
    type: 'attachment',
    hint: 'Upload supporting documents (if any)',
    displayOrder: order++,
  });

  return fields;
}

/**
 * Generates a list of columns for the database/list table view.
 */
function generateListColumns(form: FormDefinition, formCode: string): ScreenListColumn[] {
  const cols: ScreenListColumn[] = [];
  const fc = formCode.toLowerCase();

  cols.push({ key: 'recordNumber', header: 'Record No', width: '140px', sortable: true });
  cols.push({ key: `${fc}-title`, header: 'Title / Subject', sortable: true });
  cols.push({ key: `${fc}-initiator`, header: 'Requested By', width: '140px', sortable: true, hideOnMobile: true });

  if (form.stages && form.stages.length > 0) {
    cols.push({ key: 'status', header: 'Status', width: '140px', sortable: true });
    cols.push({ key: 'dateSubmitted', header: 'Date', width: '110px', sortable: true, hideOnMobile: true });
  } else {
    cols.push({ key: 'dateSubmitted', header: 'Date', width: '110px', sortable: true, hideOnMobile: true });
  }

  return cols;
}

/**
 * Generates detail modal field groups for the detail view.
 */
function generateDetailGroups(form: FormDefinition, formCode: string): ScreenDetailFieldGroup[] {
  const fc = formCode.toLowerCase();

  const groups: ScreenDetailFieldGroup[] = [
    {
      title: 'Details',
      fields: [
        { label: 'Reference No', key: `${fc}-reference` },
        { label: 'Title', key: `${fc}-title`, fullWidth: true },
        { label: 'Description', key: `${fc}-description`, fullWidth: true },
      ],
    },
  ];

  if (form.stages && form.stages.length > 0) {
    groups.push({
      title: 'Workflow',
      fields: [
        { label: 'Requested By', key: `${fc}-initiator` },
        { label: 'Date', key: `${fc}-date` },
        { label: 'Priority', key: `${fc}-priority` },
        { label: 'Status', key: 'status' },
      ],
    });

    groups.push({
      title: 'Stages',
      fields: form.stages.map((s) => ({
        label: `Stage ${s.order}: ${s.name}`,
        key: `stage-${s.order}`,
        fullWidth: true,
      })),
    });
  }

  return groups;
}

/**
 * Main function: generates a full ScreenFormDefinition from a FormDefinition.
 *
 * @param form - The lightweight FormDefinition from departments.ts config
 * @param formCode - The form code (e.g. 'RNDDB', 'SR')
 * @returns A complete ScreenFormDefinition with sections, columns, and detail groups
 */
export function buildScreenFormDefinition(
  form: FormDefinition,
  formCode: string
): ScreenFormDefinition {
  const icon = FORM_TYPE_ICONS[formCode.toLowerCase()] || DEFAULT_FORM_ICON;

  // Build form sections from the generated fields
  const fields = generateFormFields(form);

  const mainSection: ScreenSectionDef = {
    title: form.name,
    description: form.description,
    fields,
  };

  // Additional sections for workflow forms
  const sections: ScreenSectionDef[] = [mainSection];

  if (form.stages && form.stages.length > 0) {
    sections.push({
      title: 'Workflow & Approvals',
      description: 'Review and approval stages',
      fields: form.stages.map((stage, i) => ({
        name: `stage-${stage.order}`,
        label: `Stage ${stage.order}: ${stage.name}`,
        type: 'section-break' as ScreenFieldType,
        displayOrder: i,
      })),
    });
  }

  return {
    formCode: formCode.toUpperCase(),
    name: form.name,
    description: form.description,
    icon,
    sections,
    columns: generateListColumns(form, formCode),
    detailGroups: generateDetailGroups(form, formCode),
    isInitialSubmission: form.isInitialSubmission,
    stages: form.stages,
  };
}

/**
 * Generates ScreenFormDefinitions for all forms across all modules
 * in a given department.
 */
export function buildDepartmentFormDefinitions(
  departmentCode: DepartmentCode
): ScreenFormDefinition[] {
  const modules = getDepartmentModules(departmentCode);
  if (!modules || modules.length === 0) return [];

  const definitions: ScreenFormDefinition[] = [];

  for (const mod of modules) {
    for (const form of mod.forms) {
      definitions.push(buildScreenFormDefinition(form, form.formCode));
    }
  }

  return definitions;
}

/**
 * Resolves the SharePoint list name for a department.
 * Defaults to MainDB_{DepartmentCode}.
 */
export function getSharePointListForDept(departmentCode: DepartmentCode): string {
  const config = DEPARTMENT_SCREEN_CONFIGS[departmentCode];
  return config?.sharePointList ?? `MainDB_${departmentCode}`;
}

/**
 * Returns whether a department should use the screen builder.
 */
export function shouldUseScreenBuilder(departmentCode: DepartmentCode): boolean {
  return DEPARTMENT_SCREEN_CONFIGS[departmentCode]?.useScreenBuilder ?? false;
}

/**
 * Returns the display-friendly department name from code.
 */
export function getDepartmentDisplayName(code: DepartmentCode): string {
  const dept = getDepartmentByCode(code);
  return dept?.name ?? code;
}

