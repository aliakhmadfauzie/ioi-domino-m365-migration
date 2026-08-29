import { useQueryClient } from '@tanstack/react-query';
import {
  useITSchemaStoreList,
  useUpsertITSchemaStore,
  useDeleteITSchemaStore,
  IT_SCHEMA_STORE_KEY,
} from '@/generated/hooks/use-it-schema-store';
import { schemaRegistry } from '@/form-schemas/registry';
import type { FormSchema } from '@/types/form-schema';
import type { ITSchemaStore } from '@/generated/models/it-schema-store-model';

const VALID_FIELD_TYPES = new Set([
  'text', 'choice', 'multiline', 'people',
  'date', 'datetime', 'time', 'boolean', 'attachment',
]);

/**
 * Type-guard that validates a parsed JSON value matches the FormSchema contract.
 * Returns the schema if valid, or null (logging a warning) if the structure is wrong.
 * This prevents a corrupted SharePoint override from breaking a form at runtime.
 */
function validateFormSchema(parsed: unknown, formCode: string): FormSchema | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    console.warn(`[FormSchema] Invalid schema for "${formCode}": not an object`);
    return null;
  }
  const s = parsed as Record<string, unknown>;

  if (typeof s.formCode !== 'string' || !s.formCode) {
    console.warn(`[FormSchema] Invalid schema for "${formCode}": missing formCode`);
    return null;
  }
  if (typeof s.title !== 'string' || !s.title) {
    console.warn(`[FormSchema] Invalid schema for "${formCode}": missing title`);
    return null;
  }
  if (typeof s.routeBase !== 'string') {
    console.warn(`[FormSchema] Invalid schema for "${formCode}": missing routeBase`);
    return null;
  }
  if (typeof s.version !== 'number') {
    console.warn(`[FormSchema] Invalid schema for "${formCode}": version must be a number`);
    return null;
  }
  if (!Array.isArray(s.sections)) {
    console.warn(`[FormSchema] Invalid schema for "${formCode}": sections must be an array`);
    return null;
  }

  for (let si = 0; si < s.sections.length; si++) {
    const sec = s.sections[si] as Record<string, unknown>;
    if (!sec || typeof sec !== 'object') {
      console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}] is not an object`);
      return null;
    }
    if (typeof sec.sectionId !== 'string' || !sec.sectionId) {
      console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}] missing sectionId`);
      return null;
    }
    if (typeof sec.sectionName !== 'string') {
      console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}] missing sectionName`);
      return null;
    }
    if (typeof sec.displayOrder !== 'number') {
      console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}] displayOrder must be a number`);
      return null;
    }
    if (!Array.isArray(sec.fields)) {
      console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}] fields must be an array`);
      return null;
    }

    for (let fi = 0; fi < sec.fields.length; fi++) {
      const f = sec.fields[fi] as Record<string, unknown>;
      if (!f || typeof f !== 'object') {
        console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}].field[${fi}] is not an object`);
        return null;
      }
      if (typeof f.fieldId !== 'string' || !f.fieldId) {
        console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}].field[${fi}] missing fieldId`);
        return null;
      }
      if (typeof f.label !== 'string') {
        console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}].field[${fi}] missing label`);
        return null;
      }
      if (!VALID_FIELD_TYPES.has(f.fieldType as string)) {
        console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}].field[${fi}] unknown fieldType "${f.fieldType}"`);
        return null;
      }
      if (typeof f.required !== 'boolean') {
        console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}].field[${fi}] required must be boolean`);
        return null;
      }
      if (typeof f.displayOrder !== 'number') {
        console.warn(`[FormSchema] Invalid schema for "${formCode}": section[${si}].field[${fi}] displayOrder must be a number`);
        return null;
      }
    }
  }

  return parsed as FormSchema;
}

/**
 * Used inside DynamicForm — returns the SP-override schema for the given formCode,
 * or undefined while loading / if no override exists in SharePoint.
 * Multiple mounted forms share a single underlying query (IT_SCHEMA_STORE_KEY).
 */
export function useFormSchemaFromSP(formCode: string): FormSchema | undefined {
  const { data: list } = useITSchemaStoreList();
  if (!list) return undefined;
  const record = list.find(s => s.title === formCode && s.isActive !== false);
  if (!record?.schemaJson) return undefined;
  try {
    const parsed = JSON.parse(record.schemaJson);
    return validateFormSchema(parsed, formCode) ?? undefined;
  } catch {
    console.warn(`[FormSchema] Failed to parse SP schema JSON for "${formCode}"`);
    return undefined;
  }
}

/**
 * Used in the Form Builder admin screens.
 * Returns the full SP list + helpers for load, save, reset, and status checks.
 */
export function useFormSchemaAdmin() {
  const { data: spList = [], isLoading } = useITSchemaStoreList();
  const { mutateAsync: upsert, isPending: isSaving } = useUpsertITSchemaStore();
  const { mutateAsync: deleteRecord, isPending: isDeleting } = useDeleteITSchemaStore();
  const client = useQueryClient();

  const getEffectiveSchema = (formCode: string): FormSchema => {
    const record = spList.find(s => s.title === formCode && s.isActive !== false);
    if (record?.schemaJson) {
      try {
        const validated = validateFormSchema(JSON.parse(record.schemaJson), formCode);
        if (validated) return validated;
      } catch {
        console.warn(`[FormSchema] Failed to parse SP schema JSON for "${formCode}" in admin hook`);
      }
    }
    const registrySchema = schemaRegistry[formCode];
    if (!registrySchema) throw new Error(`[FormSchema] No schema found for formCode "${formCode}"`);
    return registrySchema;
  };

  const saveSchema = async (formCode: string, schema: FormSchema) => {
    await upsert({ formCode, schemaJson: JSON.stringify(schema) });
  };

  const resetSchema = async (formCode: string) => {
    await deleteRecord(formCode);
  };

  const isModified = (formCode: string): boolean =>
    spList.some(s => s.title === formCode && s.isActive !== false);

  const getSpRecord = (formCode: string): ITSchemaStore | undefined =>
    spList.find(s => s.title === formCode);

  /** Optimistically apply the schema to the React Query cache so the form updates
   *  before the SP write completes. Replaced by the real data on next invalidation. */
  const applyOptimistic = (formCode: string, schema: FormSchema) => {
    client.setQueryData<ITSchemaStore[]>(IT_SCHEMA_STORE_KEY, prev => {
      if (!prev) return prev;
      const existing = prev.find(s => s.title === formCode);
      const updated = { ...existing, title: formCode, schemaJson: JSON.stringify(schema), isActive: true } as ITSchemaStore;
      return existing ? prev.map(s => s.title === formCode ? updated : s) : [...prev, updated];
    });
  };

  return {
    registry: schemaRegistry,
    spList,
    isLoading,
    isSaving,
    isDeleting,
    getEffectiveSchema,
    saveSchema,
    resetSchema,
    isModified,
    getSpRecord,
    applyOptimistic,
  };
}
