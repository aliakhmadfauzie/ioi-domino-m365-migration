import { getFormByCode, type ITFormConfig } from './it-forms-config';

export function requireITFormConfig(code: string): ITFormConfig {
  const form = getFormByCode(code.toUpperCase());
  if (!form) {
    throw new Error(`IT form config not found for ${code}`);
  }
  return form;
}

export function getITFormCode(code: string): string {
  return requireITFormConfig(code).code;
}

export function getITFormName(code: string): string {
  return requireITFormConfig(code).name;
}

export function getITFormListPath(code: string): string {
  return `/it/forms/${getITFormCode(code).toLowerCase()}`;
}

export function getITFormNewPath(code: string): string {
  return `${getITFormListPath(code)}/new`;
}

export function getITFormDetailPath(code: string, id: string | number): string {
  return `${getITFormListPath(code)}/${id}`;
}

export function buildFormCodeFilter(code: string): string {
  return `formcode eq '${getITFormCode(code)}'`;
}

export function buildParentFormCodeFilter(code: string): string {
  return `parentFormCode eq '${getITFormCode(code)}'`;
}

export function buildTicketId(code: string, id: string | number | undefined): string {
  return `${getITFormCode(code)}-${id || ''}`;
}
