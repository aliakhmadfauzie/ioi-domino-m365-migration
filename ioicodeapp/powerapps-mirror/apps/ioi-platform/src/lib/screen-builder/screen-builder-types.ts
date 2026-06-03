// =============================================================================
// Screen Builder — Type Definitions
// Auto-generated form schema types derived from department/module/form config.
// =============================================================================

import type { LucideIcon } from 'lucide-react';

/**
 * Field types supported by the generic screen builder renderer.
 * Maps 1:1 to the shadcn/ui form controls used in generated pages.
 */
export type ScreenFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'datetime'
  | 'number'
  | 'email'
  | 'phone'
  | 'boolean'
  | 'people'
  | 'attachment'
  | 'section-break';

/** A single field definition generated from a FormDefinition. */
export interface ScreenFieldDef {
  /** Unique field key (kebab-case), e.g. 'project-title' */
  name: string;
  /** Human-readable label displayed on the form */
  label: string;
  /** Field type determines the rendered control */
  type: ScreenFieldType;
  /** Whether the field is mandatory */
  required?: boolean;
  /** Placeholder text inside the control */
  placeholder?: string;
  /** Help text shown below the control */
  hint?: string;
  /** Dropdown / select options (for 'select' type) */
  options?: string[];
  /** Default value */
  defaultValue?: string | number | boolean;
  /** Display width: 'full' spans the entire row */
  fullWidth?: boolean;
  /** Order in which fields appear within a section */
  displayOrder?: number;
  /** Visibility condition: only show when this field equals this value */
  showWhen?: { field: string; value: string };
}

/** A logical section/group of fields within a generated form. */
export interface ScreenSectionDef {
  /** Section title displayed as a card header */
  title: string;
  /** Section description shown below the title */
  description?: string;
  /** Fields in this section */
  fields: ScreenFieldDef[];
}

/** Column definition for the list/database table view. */
export interface ScreenListColumn {
  /** Key to read from the data record */
  key: string;
  /** Column header label */
  header: string;
  /** Column width (e.g. '130px') */
  width?: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether to hide on mobile */
  hideOnMobile?: boolean;
}

/** A field group for the detail modal view. */
export interface ScreenDetailFieldGroup {
  /** Group title displayed in the detail modal */
  title: string;
  /** Fields to display in this group */
  fields: Array<{ label: string; key: string; fullWidth?: boolean }>;
}

/**
 * Complete screen definition for a single form,
 * generated from the department's FormDefinition metadata.
 */
export interface ScreenFormDefinition {
  /** Form code identifier (e.g. 'RNDDB', 'SR', 'CAR') */
  formCode: string;
  /** Display name */
  name: string;
  /** Description of the form's purpose */
  description: string;
  /** Icon component */
  icon: LucideIcon;
  /** Form sections with fields for the new/create page */
  sections: ScreenSectionDef[];
  /** Column definitions for the list/database view */
  columns: ScreenListColumn[];
  /** Field groups for the detail modal view */
  detailGroups: ScreenDetailFieldGroup[];
  /** Whether this is an initial submission form with workflow stages */
  isInitialSubmission: boolean;
  /** Workflow stages if applicable */
  stages?: Array<{ name: string; order: number }>;
}

/**
 * Department-level screen generation config.
 * A department can either use the auto-generated screens or
 * flag itself as needing custom routes.
 */
export interface DepartmentScreenConfig {
  /** If true, the screen builder auto-generates route pages. */
  useScreenBuilder: boolean;
  /** SharePoint list name for this department's data (e.g. 'MainDB_HR') */
  sharePointList: string;
  /** Default form status for new submissions */
  defaultStatus?: string;
  /** Override the base route path (defaults to /{deptCode.lower}) */
  basePathOverride?: string;
}
