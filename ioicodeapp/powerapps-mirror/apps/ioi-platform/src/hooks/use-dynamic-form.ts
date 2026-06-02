import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { getAllPendingFiles, clearPendingAttachments } from '@/lib/pending-attachments';
import { MainDBITService as MainDB_ITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtAccessService } from '@/generated/services/main-dbit-ext-access-service';
import { MainDBITExtAssetsService } from '@/generated/services/main-dbit-ext-assets-service';
import { MainDBITExtDocsService } from '@/generated/services/main-dbit-ext-docs-service';
import { MainDBITExtInfraService } from '@/generated/services/main-dbit-ext-infra-service';
import { MainDBITExtPolicyService } from '@/generated/services/main-dbit-ext-policy-service';
import { MainDBITExtSAPService } from '@/generated/services/main-dbit-ext-sap-service';
import { MainDBITExtSupportService } from '@/generated/services/main-dbit-ext-support-service';
import type {
  FormSchema,
  SectionSchema,
  FormValues,
  FormErrors,
} from '@/types/form-schema';

export interface UseDynamicFormReturn {
  values: FormValues;
  errors: FormErrors;
  isPending: boolean;
  setValue(fieldId: string, value: string | boolean | string[] | null): void;
  handleSubmit(
    e: React.FormEvent,
    onSuccess: (recordNo: string) => void
  ): Promise<void>;
  reset(): void;
}

export function isSectionVisible(section: SectionSchema, values: FormValues): boolean {
  if (!section.showWhen) return true;
  const { fieldId, op, value } = section.showWhen;
  const fieldValue = values[fieldId];
  if (op === 'eq') return fieldValue === value;
  if (op === 'neq') return fieldValue !== value;
  if (op === 'in') {
    const vals = Array.isArray(value) ? value : [value];
    return vals.includes(String(fieldValue ?? ''));
  }
  if (op === 'notIn') {
    const vals = Array.isArray(value) ? value : [value];
    return !vals.includes(String(fieldValue ?? ''));
  }
  return true;
}

function generateRecordNo(formCode: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `${formCode}-${year}${month}-${seq}`;
}

function buildInitialValues(schema: FormSchema): FormValues {
  const vals: FormValues = {};
  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.autoValue === 'generateRecordNo') {
        vals[field.fieldId] = generateRecordNo(schema.formCode);
      } else if (field.autoValue === 'timestamp') {
        vals[field.fieldId] = new Date().toISOString();
      } else {
        vals[field.fieldId] = null;
      }
    }
  }
  return vals;
}

export function useDynamicForm({ schema }: { schema: FormSchema }): UseDynamicFormReturn {
  const { data: user } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(schema));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!user) return;
    setValues(prev => {
      const updates: Partial<FormValues> = {};
      let changed = false;
      for (const section of schema.sections) {
        for (const field of section.fields) {
          if (field.autoValue === 'currentUser' && !prev[field.fieldId]) {
            updates[field.fieldId] = user.userPrincipalName || '';
            changed = true;
          }
        }
      }
      return changed ? { ...prev, ...updates } : prev;
    });
  }, [user, schema]);

  const setValue = (fieldId: string, value: string | boolean | string[] | null) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    setErrors(prev => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    for (const section of schema.sections) {
      if (!isSectionVisible(section, values)) continue;
      for (const field of section.fields) {
        if (!field.required || field.readOnly || field.autoValue) continue;
        const val = values[field.fieldId];
        if (val === null || val === undefined || (typeof val === 'string' && !val.trim())) {
          newErrors[field.fieldId] = `${field.label} is required`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onSuccess: (recordNo: string) => void
  ) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPending(true);

    try {
      let recordNo = generateRecordNo(schema.formCode);
      for (const section of schema.sections) {
        for (const field of section.fields) {
          if (field.autoValue === 'generateRecordNo') {
            recordNo = String(values[field.fieldId] || recordNo);
            break;
          }
        }
      }

      // Separate fields by destination table
      const mainColumns: Record<string, unknown> = {};
      const extColumnsByTable: Record<string, Record<string, unknown>> = {};
      const unmappedValues: Record<string, unknown> = {};

      for (const section of schema.sections) {
        if (!isSectionVisible(section, values)) continue;
        for (const field of section.fields) {
          const val = values[field.fieldId];
          const hasValue = val !== null && val !== undefined && val !== '';

          if (field.spColumn && (!field.spTable || field.spTable === 'MainDB_IT')) {
            if (hasValue) {
              const strVal = String(val);
              const mappedVal = field.spLabelToKey?.[strVal] ?? strVal;
              mainColumns[field.spColumn] = field.spColumnType === 'number'
                ? (Number(mappedVal) || 0)
                : mappedVal;
            }
          } else if (field.spColumn && field.spTable && field.spTable !== 'MainDB_IT') {
            if (hasValue) {
              const strVal = String(val);
              const mappedVal = field.spLabelToKey?.[strVal] ?? strVal;
              if (!extColumnsByTable[field.spTable]) {
                extColumnsByTable[field.spTable] = {};
              }
              extColumnsByTable[field.spTable][field.spColumn] = field.spColumnType === 'number'
                ? (Number(mappedVal) || 0)
                : mappedVal;
            }
          } else if (!field.spColumn && !field.readOnly && !field.autoValue) {
            unmappedValues[field.fieldId] = val;
          }
        }
      }

      // Map spTable names to extension services
      const extServiceMap: Record<string, (payload: Record<string, unknown>) => Promise<unknown>> = {
        ExtAccess: (payload) => MainDBITExtAccessService.create(payload as any),
        ExtAssets: (payload) => MainDBITExtAssetsService.create(payload as any),
        ExtSupport: (payload) => MainDBITExtSupportService.create(payload as any),
        ExtSAP: (payload) => MainDBITExtSAPService.create(payload as any),
        ExtDocs: (payload) => MainDBITExtDocsService.create(payload as any),
        ExtInfra: (payload) => MainDBITExtInfraService.create(payload as any),
        ExtPolicy: (payload) => MainDBITExtPolicyService.create(payload as any),
      };

      // Step 1: Create MainDB_IT record
      const mainPayload: Record<string, unknown> = {
        Title: recordNo,
        FormCode: schema.formCode,
        CurrentStatus: 'Submitted',
        Requestor_Email: (mainColumns['Requestor_Email'] as string) || user?.userPrincipalName || '',
        SubmittedDate: new Date().toISOString(),
        WorkflowStage: 1,
        Remarks: Object.keys(unmappedValues).length > 0 ? JSON.stringify(unmappedValues) : undefined,
        ...mainColumns,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mainRecord = await MainDB_ITService.create(mainPayload as any);

      // Step 2: Create extension records for each table with columns
      for (const [tableName, columns] of Object.entries(extColumnsByTable)) {
        if (Object.keys(columns).length === 0) continue;
        const createFn = extServiceMap[tableName];
        if (createFn) {
          const extPayload: Record<string, unknown> = {
            Title: recordNo,
            ParentFormCode: schema.formCode,
            'ParentID#Id': (mainRecord as any).ID || mainRecord.id,
            ...columns,
          };
          await createFn(extPayload);
        }
      }

      // Step 3: Log any pending attachment files so callers can upload them.
      // Actual SharePoint file upload is handled by the AttachmentManager on the
      // detail screen after the record is created (requires the new record ID).
      const pendingFiles = getAllPendingFiles();
      if (pendingFiles.size > 0) {
        const names = [...pendingFiles.values()].flat().map(f => f.name).join(', ');
        console.info(`[DynamicForm] ${pendingFiles.size} attachment field(s) have pending files for record ${recordNo}: ${names}`);
      }
      clearPendingAttachments();

      onSuccess(recordNo);
    } finally {
      setIsPending(false);
    }
  };

  const reset = () => {
    setValues(buildInitialValues(schema));
    setErrors({});
    clearPendingAttachments();
  };

  return { values, errors, isPending, setValue, handleSubmit, reset };
}
