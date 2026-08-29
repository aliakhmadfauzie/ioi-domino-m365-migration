import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FieldRenderer } from './FieldRenderer';
import type { SectionSchema, FormValues, FormErrors } from '@/types/form-schema';

interface SectionRendererProps {
  section: SectionSchema;
  values: FormValues;
  errors: FormErrors;
  onFieldChange: (fieldId: string, value: string | boolean | string[] | null) => void;
}

export function SectionRenderer({ section, values, errors, onFieldChange }: SectionRendererProps) {
  const fields = [...section.fields].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <Card className="border-[#D0D0D0]">
      <CardHeader className="bg-[#003366]/5 border-b border-[#D0D0D0]">
        <CardTitle className="text-[#003366] text-base">{section.sectionName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          {fields.map(field => (
            <div
              key={field.fieldId}
              className={`space-y-2 ${field.fullWidth ? 'col-span-2' : ''}`}
            >
              <Label>
                {field.label}
                {field.required && !field.readOnly && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
              <FieldRenderer
                field={field}
                value={values[field.fieldId] ?? null}
                error={errors[field.fieldId]}
                onChange={val => onFieldChange(field.fieldId, val)}
              />
              {errors[field.fieldId] && (
                <p className="text-xs text-destructive">{errors[field.fieldId]}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
