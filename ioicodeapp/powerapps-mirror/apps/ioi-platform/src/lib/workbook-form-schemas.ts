import workbookSchemaJson from '../../data-model/form-schemas.json';
import type { FormField, FormSection } from './it-forms-config';

interface WorkbookSchemaField {
  label: string;
  name?: string;
  type?: string;
  visible?: boolean;
}

interface WorkbookFormSchema {
  title?: string;
  fields: WorkbookSchemaField[];
}

interface WorkbookSchemaRegistry {
  forms: Record<string, WorkbookFormSchema>;
}

const FORM_FIELD_TYPE_MAP: Record<string, FormField['type']> = {
  text: 'text',
  textarea: 'textarea',
  date: 'date',
  number: 'number',
  checkbox: 'checkbox',
  email: 'email',
  url: 'text',
};

const workbookSchema = workbookSchemaJson as WorkbookSchemaRegistry;

function normalizeFieldId(label: string, fallbackName?: string): string {
  const source = fallbackName?.trim() || label.trim();
  const base = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return base || 'field';
}

export function getWorkbookFormSchema(formCode: string): WorkbookFormSchema | undefined {
  return workbookSchema.forms[formCode.toUpperCase()];
}

export function hasWorkbookSchema(formCode: string): boolean {
  return Boolean(getWorkbookFormSchema(formCode));
}

export function getWorkbookSections(formCode: string): FormSection[] | undefined {
  const schema = getWorkbookFormSchema(formCode);

  if (!schema) {
    return undefined;
  }

  const fields = schema.fields
    .filter((field) => field.visible !== false)
    .map((field, index) => {
      const type = FORM_FIELD_TYPE_MAP[field.type || 'text'] || 'text';
      return {
        id: normalizeFieldId(field.label, field.name) + (index === 0 ? '' : `-${index}`),
        label: field.label,
        type,
        required: false,
      } satisfies FormField;
    });

  if (fields.length === 0) {
    return undefined;
  }

  return [
    {
      id: `workbook-${formCode.toLowerCase()}`,
      title: schema.title || `${formCode} Workbook Mapping`,
      description: 'Fields imported from workbook schema',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields,
    },
  ];
}
