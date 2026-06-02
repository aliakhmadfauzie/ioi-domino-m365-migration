/**
 * Module-level store for File objects selected in attachment fields.
 *
 * FieldRenderer writes here when users pick files; use-dynamic-form reads here
 * after the main record is created so files can be uploaded with the record ID.
 * Always call clearPendingAttachments() after a successful submit or form reset.
 */

const store = new Map<string, File[]>();

export function setPendingFiles(fieldId: string, files: File[]): void {
  if (files.length === 0) {
    store.delete(fieldId);
  } else {
    store.set(fieldId, [...files]);
  }
}

export function getPendingFiles(fieldId: string): File[] {
  return store.get(fieldId) ?? [];
}

export function getAllPendingFiles(): Map<string, File[]> {
  return new Map(store);
}

export function clearPendingAttachments(): void {
  store.clear();
}
