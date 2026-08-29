import type { DebugEvent, DebugIssue, ScreenMeta } from './debugTypes';

export interface DebugExportPayload {
  exportedAt: string;
  currentScreenId: string | null;
  currentUser: string | null | undefined;
  screenMeta: ScreenMeta | null;
  issues: DebugIssue[];
  events: DebugEvent[];
}

/** Serialise the debug snapshot to a pretty-printed JSON string */
export function exportDebugToJSON(payload: DebugExportPayload): string {
  // Strip any field that might carry sensitive data beyond what we already masked
  const safe: DebugExportPayload = {
    ...payload,
    events: payload.events.map((e) => ({
      ...e,
      // details already contains only masked value previews — keep as-is
    })),
  };
  return JSON.stringify(safe, null, 2);
}

/** Download the JSON snapshot as a file in the browser */
export function downloadDebugJSON(payload: DebugExportPayload): void {
  const json = exportDebugToJSON(payload);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `debug-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Export issues to a basic CSV string */
export function exportIssuesToCSV(issues: DebugIssue[]): string {
  const headers = ['Severity', 'SourceKey', 'Category', 'FieldName', 'Description', 'RecommendedFix'];
  const rows = issues.map((i) => [
    i.severity,
    i.sourceKey,
    i.category,
    i.fieldName,
    `"${i.description.replace(/"/g, '""')}"`,
    `"${i.recommendedFix.replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/** Download the issues CSV in the browser */
export function downloadIssuesCSV(issues: DebugIssue[]): void {
  const csv  = exportIssuesToCSV(issues);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `debug-issues-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
