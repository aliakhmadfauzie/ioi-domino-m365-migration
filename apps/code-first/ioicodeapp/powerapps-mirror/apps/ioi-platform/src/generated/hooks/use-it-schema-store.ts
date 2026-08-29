import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ITSchemaStoreService } from '../services/it-schema-store-service';
import type { ITSchemaStore } from '../models/it-schema-store-model';

export const IT_SCHEMA_STORE_KEY = ['it-schema-store-list'] as const;

/** Fetch all schema override records. Shared cache — only one request regardless of how many forms are mounted. */
export function useITSchemaStoreList() {
  return useQuery({
    queryKey: IT_SCHEMA_STORE_KEY,
    queryFn: () => ITSchemaStoreService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create-or-update a schema override for a given formCode.
 * Uses the cached list to decide whether to create or update, avoiding an extra round-trip.
 */
export function useUpsertITSchemaStore() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ formCode, schemaJson }: { formCode: string; schemaJson: string }) => {
      const cached = client.getQueryData<ITSchemaStore[]>(IT_SCHEMA_STORE_KEY);
      const existing = cached?.find(s => s.title === formCode);
      if (existing) {
        return ITSchemaStoreService.update(String(existing.id), {
          schemaJson,
          schemaVersion: (existing.schemaVersion ?? 0) + 1,
          isActive: true,
        });
      }
      return ITSchemaStoreService.create({
        title: formCode,
        schemaJson,
        schemaVersion: 1,
        isActive: true,
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: IT_SCHEMA_STORE_KEY });
    },
  });
}

/** Delete the SP override for a formCode, reverting to the static bundled schema. */
export function useDeleteITSchemaStore() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (formCode: string) => {
      const cached = client.getQueryData<ITSchemaStore[]>(IT_SCHEMA_STORE_KEY);
      const existing = cached?.find(s => s.title === formCode);
      if (existing) {
        return ITSchemaStoreService.delete(String(existing.id));
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: IT_SCHEMA_STORE_KEY });
    },
  });
}

export const ITSchemaStore_DATA_SOURCE_TYPE = 'SharePoint' as const;
