// =============================================================================
// Generic Form New / Create Page
// Auto-generated form creation page for screen-builder departments.
// Renders fields from the ScreenFormDefinition with shadcn/ui components.
// =============================================================================

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  getDepartmentByCode,
  getDepartmentModules,
  type DepartmentCode,
} from '@/config/departments';
import {
  buildScreenFormDefinition,
  getDepartmentDisplayName,
  DEPARTMENT_SCREEN_CONFIGS,
} from '@/lib/screen-builder/screen-builder-service';
import type { ScreenFieldDef, ScreenFieldType } from '@/lib/screen-builder/screen-builder-types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] as const } },
} as const;

/**
 * Renders a single form field based on its type.
 */
function FieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: ScreenFieldDef;
  value: string | boolean | number;
  onChange: (name: string, value: string | boolean) => void;
  error?: string;
}) {
  const id = `field-${field.name}`;

  if (field.type === 'section-break') {
    return (
      <div className="border-t pt-4 mt-2">
        <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
      </div>
    );
  }

  const baseCn = 'w-full';
  const errorCn = error ? 'border-destructive ring-destructive' : '';

  switch (field.type) {
    case 'textarea':
      return (
        <div className={field.fullWidth ? 'col-span-full' : ''}>
          <Label htmlFor={id}>
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          <Textarea
            id={id}
            placeholder={field.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`mt-1.5 ${baseCn} ${errorCn}`}
            rows={4}
          />
          {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div className={field.fullWidth ? 'col-span-full' : ''}>
          <Label htmlFor={id}>
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          <Select
            value={(value as string) ?? ''}
            onValueChange={(v) => onChange(field.name, v)}
          >
            <SelectTrigger id={id} className={`mt-1.5 ${errorCn}`}>
              <SelectValue placeholder={field.placeholder ?? `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      );

    case 'date':
      return (
        <div className={field.fullWidth ? 'col-span-full' : ''}>
          <Label htmlFor={id}>
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          <Input
            id={id}
            type="date"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`mt-1.5 ${errorCn}`}
          />
          {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      );

    case 'number':
      return (
        <div className={field.fullWidth ? 'col-span-full' : ''}>
          <Label htmlFor={id}>
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          <Input
            id={id}
            type="number"
            placeholder={field.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`mt-1.5 ${errorCn}`}
          />
          {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      );

    case 'boolean':
      return (
        <div className={`flex items-center gap-3 ${field.fullWidth ? 'col-span-full' : ''}`}>
          <Switch
            id={id}
            checked={(value as boolean) ?? false}
            onCheckedChange={(v) => onChange(field.name, v)}
          />
          <Label htmlFor={id} className="cursor-pointer">
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
        </div>
      );

    case 'attachment':
      return (
        <div className={field.fullWidth ? 'col-span-full' : ''}>
          <Label htmlFor={id}>
            {field.label}
          </Label>
          <Input
            id={id}
            type="file"
            className={`mt-1.5 ${errorCn}`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(field.name, file.name);
            }}
          />
          {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
        </div>
      );

    default:
      return (
        <div className={field.fullWidth ? 'col-span-full' : ''}>
          <Label htmlFor={id}>
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          <Input
            id={id}
            type="text"
            placeholder={field.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`mt-1.5 ${baseCn} ${errorCn}`}
          />
          {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      );
  }
}

export default function GenericFormNewPage() {
  const navigate = useNavigate();
  const { departmentCode, formCode } = useParams<{
    departmentCode: string;
    formCode: string;
  }>();
  const deptCode = (departmentCode ?? '').toUpperCase() as DepartmentCode;
  const department = getDepartmentByCode(deptCode);
  const deptPath = `/${deptCode.toLowerCase()}`;

  // Find form config
  const formDef = useMemo(() => {
    const modules = department?.modules ?? getDepartmentModules(deptCode);
    for (const mod of modules) {
      const found = mod.forms.find(
        (f) => f.formCode.toLowerCase() === (formCode ?? '').toLowerCase()
      );
      if (found) return found;
    }
    return null;
  }, [department, deptCode, formCode]);

  // Build screen form definition
  const screenDef = useMemo(() => {
    if (!formDef || !formCode) return null;
    return buildScreenFormDefinition(formDef, formCode);
  }, [formDef, formCode]);

  // Form state
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  const handleFieldChange = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!screenDef) return false;

    for (const section of screenDef.sections) {
      for (const field of section.fields) {
        if (field.required) {
          const val = values[field.name];
          if (!val || (typeof val === 'string' && !val.trim())) {
            newErrors[field.name] = `${field.label} is required`;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (mode: 'draft' | 'submit') => {
    if (mode === 'submit' && !validate()) {
      toast.error('Please fix the validation errors before submitting.');
      return;
    }

    setIsPending(true);
    try {
      // Simulate API call — in production, this would call SharePoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const refNo = `${formCode?.toUpperCase() ?? 'NEW'}-${format(new Date(), 'yyyyMMdd')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;

      toast.success(
        mode === 'draft'
          ? `${screenDef?.name ?? 'Form'} saved as draft. Ref: ${refNo}`
          : `${screenDef?.name ?? 'Form'} submitted! Ref: ${refNo}`
      );

      navigate(`${deptPath}/forms/${formCode}`);
    } catch (error) {
      toast.error(
        `Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsPending(false);
    }
  };

  if (!department || !formDef || !screenDef) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-3">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <CardTitle>Form Not Found</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formCode
                ? `Form "${formCode}" not found in ${departmentCode} department.`
                : 'No form code specified.'}
            </p>
            <Button variant="outline" onClick={() => navigate(deptPath)}>
              Back to {department.name}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = DEPARTMENT_SCREEN_CONFIGS[deptCode];

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-24 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`${deptPath}/forms/${formCode}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">New {screenDef.name}</h1>
          <Badge variant="outline" className="uppercase text-xs">
            {formCode}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground ml-10">
          {department.name}
          {config?.sharePointList && ` — ${config.sharePointList}`}
        </p>
      </motion.div>

      {/* Form sections */}
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('submit');
        }}
        variants={itemVariants}
        className="space-y-6"
      >
        {screenDef.sections.map((section, sIdx) => (
          <Card key={sIdx}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{section.title}</CardTitle>
              {section.description && (
                <CardDescription className="text-xs">{section.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    value={values[field.name] ?? field.defaultValue ?? ''}
                    onChange={handleFieldChange}
                    error={errors[field.name]}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-end pt-2"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`${deptPath}/forms/${formCode}`)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit('draft')}
            disabled={isPending}
            className="gap-1.5"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="gap-1.5"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
