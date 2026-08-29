import type { FormSchema } from '@/types/form-schema';

const modules = import.meta.glob<{ default: unknown }>('./*.json', { eager: true });

export const schemaRegistry: Record<string, FormSchema> = {};

for (const path in modules) {
  const schema = modules[path].default as FormSchema;
  if (schema?.formCode) {
    schemaRegistry[schema.formCode] = schema;
  }
}

export function getStaticSchema(formCode: string): FormSchema | undefined {
  return schemaRegistry[formCode];
}
