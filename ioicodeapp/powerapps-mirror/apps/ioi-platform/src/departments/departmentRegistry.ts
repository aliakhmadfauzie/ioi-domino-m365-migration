/**
 * Lightweight debug-layer department registry.
 *
 * Provides a fast lookup by code used by the debug panel.
 * The source-of-truth for full department config (icons, colours, modules)
 * remains in src/config/departments.ts.
 */
import { getActiveDepartments } from '@/config/departments';
import type { DepartmentEntry } from '@/debug/debugTypes';

const entries: DepartmentEntry[] = getActiveDepartments().map((department) => ({
  code: department.code,
  name: department.name,
  forms: [
    ...new Set(
      (department.modules ?? []).flatMap((module) =>
        module.forms.map((form) => form.formCode)
      )
    ),
  ],
}));

const byCode = new Map(entries.map((entry) => [entry.code.toUpperCase(), entry]));

export const departmentRegistry = {
  getAll: (): DepartmentEntry[] => entries,
  getByCode: (code: string): DepartmentEntry | undefined => byCode.get(code.toUpperCase()),
  getForms: (code: string): string[] => byCode.get(code.toUpperCase())?.forms ?? [],
};
