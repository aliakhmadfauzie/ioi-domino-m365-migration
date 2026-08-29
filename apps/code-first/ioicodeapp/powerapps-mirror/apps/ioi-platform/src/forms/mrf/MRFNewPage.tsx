/**
 * MRFNewPage — IT Material Request Form (New submission)
 *
 * Demonstrates the full debug data map pattern:
 *  1. Registers screen metadata on mount
 *  2. Reads data through the instrumented data service
 *  3. Submits through the instrumented write wrapper
 *  4. All operations are automatically logged to the debug panel
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';
import { toast } from 'sonner';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { debugRegistry }                   from '@/debug/debugRegistry';
import { debugCurrentScreenIdAtom }        from '@/debug/debugStore';
import { logNavigation }                   from '@/debug/debugLogger';
import { createRecord }                    from '@/data/dataService';
import { MRF_NEW_META }                    from './mrf.metadata';
import { mrfWriteActions }                 from './mrf.writeMap';

// ─── Form value types ─────────────────────────────────────────────────────────

interface MRFFormValues {
  title: string;
  site: string;
  department: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  justification: string;
  priority: string;
  requiredByDate: string;
  remarks: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateFormCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const ts = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const seq  = String(Math.floor(Math.random() * 999)).padStart(3, '0');
  return `IT-MRF-${date}-${ts}-${seq}`;
}

/** Returns a masked value preview — used by the write wrapper internally */
// (maskValue is called inside sharePointClient.ts — no need to call here)

// ─── Component ────────────────────────────────────────────────────────────────

export function MRFNewPage() {
  const navigate       = useNavigate();
  const setCurrentScreen = useSetAtom(debugCurrentScreenIdAtom);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MRFFormValues>({
    defaultValues: {
      title: '',
      site: '5102',
      department: 'IT',
      itemDescription: '',
      quantity: 1,
      unit: 'Unit',
      justification: '',
      priority: 'Medium',
      requiredByDate: '',
      remarks: '',
    },
  });

  // ─── Register screen metadata on mount ───────────────────────────────────
  useEffect(() => {
    debugRegistry.register(MRF_NEW_META);
    setCurrentScreen(MRF_NEW_META.screenId);
    logNavigation({
      screenId:  MRF_NEW_META.screenId,
      routePath: MRF_NEW_META.routePath,
    });
    return () => {
      setCurrentScreen('');
    };
  }, [setCurrentScreen]);

  // ─── Create action ────────────────────────────────────────────────────────
  const onSubmit = async (values: MRFFormValues) => {
    const createAction = mrfWriteActions.find((a) => a.actionKey === 'mrf_create');
    if (!createAction) return;

    // Build the SP payload using the write map's spColumnName declarations.
    // Note: RequiredByDate → RequiredBy mismatch is intentional for demo;
    // the debug panel will flag it as a WriteMapMismatch issue.
    const payload: Record<string, unknown> = {
      Title:           values.title.trim(),
      FormCode:        generateFormCode(),
      Requestor_Email: 'current-user@ioiacidchem.com', // resolved from auth in production
      SubmittedDate:   new Date().toISOString(),
      Site:            values.site,
      Department:      values.department,
      ItemDescription: values.itemDescription.trim(),
      Quantity:        Number(values.quantity),
      Unit:            values.unit,
      Justification:   values.justification.trim(),
      Priority:        values.priority,
      RequiredByDate:  values.requiredByDate || null, // BUG: SP expects "RequiredBy"
      CurrentStatus:   'Submitted',
      WorkflowStage:   'PendingHODApproval',
      IsLocked:        false,
    };

    const result = await createRecord(
      {
        sourceKey:              createAction.targetListName,
        screenId:               MRF_NEW_META.screenId,
        actionKey:              createAction.actionKey,
        payload,
        fieldMappings:          createAction.fieldMappings,
        targetListDisplayName:  createAction.targetListDisplayName,
      },
      MRF_NEW_META.dataMode,
    );

    if (!result.success) {
      toast.error(`Failed to submit: ${result.error}`);
      return;
    }

    toast.success('Material request submitted successfully.');
    navigate('/it/forms/mrf');
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold">New Material Request</h1>
        <p className="text-sm text-muted-foreground mt-1">IT Department · Form IT-MRF</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <Field label="Request Title" error={errors.title?.message} htmlFor="titleInput">
          <Input
            id="titleInput"
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g. Laptop for new hire"
          />
        </Field>

        {/* Site + Department */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Site" error={errors.site?.message} htmlFor="siteSelect">
            <Select onValueChange={(v) => {}} {...register('site', { required: true })}>
              <SelectTrigger id="siteSelect">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5102">5102 - PEO Refinery</SelectItem>
                <SelectItem value="5103">5103 - PEO Consumer</SelectItem>
                <SelectItem value="5200">5200 - POC Plant</SelectItem>
                <SelectItem value="5201">5201 - POC Soap</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Department" error={errors.department?.message} htmlFor="departmentSelect">
            <Select onValueChange={(v) => {}} {...register('department', { required: true })}>
              <SelectTrigger id="departmentSelect">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="PROD">Production</SelectItem>
                <SelectItem value="QC">QC</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Item Description */}
        <Field label="Item Description" error={errors.itemDescription?.message} htmlFor="itemDescInput">
          <Textarea
            id="itemDescInput"
            {...register('itemDescription', { required: 'Description is required' })}
            rows={3}
            placeholder="Describe the item or material needed"
          />
        </Field>

        {/* Quantity + Unit */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Quantity" error={errors.quantity?.message} htmlFor="quantityInput">
            <Input
              id="quantityInput"
              type="number"
              min={1}
              inputMode="numeric"
              {...register('quantity', { required: true, min: 1, valueAsNumber: true })}
            />
          </Field>
          <Field label="Unit" error={errors.unit?.message} htmlFor="unitSelect">
            <Select onValueChange={(v) => {}} {...register('unit')}>
              <SelectTrigger id="unitSelect">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unit">Unit</SelectItem>
                <SelectItem value="Pcs">Pcs</SelectItem>
                <SelectItem value="Box">Box</SelectItem>
                <SelectItem value="Set">Set</SelectItem>
                <SelectItem value="Kg">Kg</SelectItem>
                <SelectItem value="Litre">Litre</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Justification */}
        <Field label="Justification" error={errors.justification?.message} htmlFor="justificationInput">
          <Textarea
            id="justificationInput"
            {...register('justification', { required: 'Justification is required', minLength: { value: 10, message: 'Min 10 characters' } })}
            rows={3}
            placeholder="Business justification for this request"
          />
        </Field>

        {/* Priority + Required By */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Priority" error={errors.priority?.message} htmlFor="prioritySelect">
            <Select onValueChange={(v) => {}} {...register('priority')}>
              <SelectTrigger id="prioritySelect">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Required By Date" error={errors.requiredByDate?.message} htmlFor="requiredByInput">
            <Input
              id="requiredByInput"
              type="date"
              {...register('requiredByDate')}
            />
          </Field>
        </div>

        {/* Remarks */}
        <Field label="Remarks (optional)" htmlFor="remarksInput">
          <Input
            id="remarksInput"
            {...register('remarks')}
            placeholder="Additional notes"
          />
        </Field>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-foreground">{label}</label>
      {children}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}
