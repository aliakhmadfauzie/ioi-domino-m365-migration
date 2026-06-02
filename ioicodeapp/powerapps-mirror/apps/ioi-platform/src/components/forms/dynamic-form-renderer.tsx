/**
 * DynamicFormRenderer — Renders an IT form from its config definition in it-forms-config.ts
 * Used by forms like RS, SFAR, UR, DCAL that don't have fully custom UIs yet.
 * Uses the IOI-branded FormSubmissionLayout pattern (blue header, breadcrumbs, sidebar).
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Send, Loader2, CheckCircle2, HelpCircle, Headset, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtAccess } from '@/generated/hooks/use-main-dbitext-access';
import { useCreateMainDBITExtAssets } from '@/generated/hooks/use-main-dbitext-assets';
import { useCreateMainDBITExtDocs } from '@/generated/hooks/use-main-dbitext-docs';
import { useCreateMainDBITExtInfra } from '@/generated/hooks/use-main-dbitext-infra';
import { useCreateMainDBITExtPolicy } from '@/generated/hooks/use-main-dbitext-policy';
import { useCreateMainDBITExtSAP } from '@/generated/hooks/use-main-dbitext-sap';
import { useCreateMainDBITExtSupport } from '@/generated/hooks/use-main-dbitext-support';
import { useCreateApprovalRecords } from '@/generated/hooks/use-approval-records';
import { EmployeePicker, MultiEmployeePicker } from '@/components/employee-picker';
import { shouldSkipStage, type FormField, type FormSection, type ITFormConfig } from '@/lib/it-forms-config';
import type { MainDBIT, MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';
import type { MainDBITExtDocs } from '@/generated/models/main-dbit-ext-docs-model';
import type { MainDBITExtInfra } from '@/generated/models/main-dbit-ext-infra-model';
import type { MainDBITExtPolicy } from '@/generated/models/main-dbit-ext-policy-model';
import type { MainDBITExtSAP } from '@/generated/models/main-dbit-ext-sap-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';

interface Props {
  formConfig: ITFormConfig;
}

export default function DynamicFormRenderer({ formConfig }: Props) {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const createExtAccess = useCreateMainDBITExtAccess();
  const createExtAssets = useCreateMainDBITExtAssets();
  const createExtDocs = useCreateMainDBITExtDocs();
  const createExtInfra = useCreateMainDBITExtInfra();
  const createExtPolicy = useCreateMainDBITExtPolicy();
  const createExtSAP = useCreateMainDBITExtSAP();
  const createExtSupport = useCreateMainDBITExtSupport();
  const createApprovalRecord = useCreateApprovalRecords();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => {
      const updates: Record<string, string | boolean> = {};
      for (const section of formConfig.sections) {
        for (const field of section.fields ?? []) {
          if (prev[field.id] !== undefined) continue;
          if (field.autoFill === 'user.fullName') updates[field.id] = user.fullName || '';
          if (field.autoFill === 'user.email') updates[field.id] = user.userPrincipalName || '';
          if (field.autoFill === 'user.department') updates[field.id] = '';
        }
      }
      return Object.keys(updates).length ? { ...prev, ...updates } : prev;
    });
  }, [formConfig.sections, user]);

  const sectionMatchesCondition = (section: FormSection) => {
    if (!section.conditionalField) return true;
    const value = formData[section.conditionalField.field];
    if (section.conditionalField.values?.length) {
      return section.conditionalField.values.includes(String(value ?? ''));
    }
    if (section.conditionalField.value === 'filled') {
      return Boolean(value && String(value).trim());
    }
    return value === section.conditionalField.value;
  };

  const visibleSections = useMemo(
    () => formConfig.sections.filter((section) => {
      if (!section.fields?.length) return false;
      if (section.isStageGated) return false;
      return sectionMatchesCondition(section);
    }),
    [formConfig.sections, formData],
  );

  const activeWorkflowStages = useMemo(
    () => formConfig.stages.filter((stage) => !shouldSkipStage(stage, formData)),
    [formConfig.stages, formData],
  );

  const allVisibleFields = useMemo(
    () => visibleSections.flatMap((section) => section.fields ?? []),
    [visibleSections],
  );

  const displayValue = (field: FormField, value: string | boolean | undefined) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (!value) return '';
    const optionLabel = field.options?.find((option) => option.value === value)?.label;
    return optionLabel || String(value);
  };

  const filledFields = useMemo(
    () => allVisibleFields
      .map((field) => ({ field, value: displayValue(field, formData[field.id]) }))
      .filter((item) => item.value.trim() && !item.field.disabled),
    [allVisibleFields, formData],
  );

  const buildRemarksSummary = () => {
    if (!filledFields.length) return '';
    return filledFields
      .map(({ field, value }) => `${field.label}: ${value}`)
      .join('\n')
      .slice(0, 4000);
  };

  const suggestedAssignee = (actor: string) => {
    const actorKey = actor.toLowerCase();
    const extraFields = formConfig.submitTransform?.(formData, user) ?? {};
    const picEmail = extraFields.rSAssignedPICEmail || extraFields.assignedToEmail || extraFields.AssignedToEmail;

    if (actorKey.includes('request')) return user?.fullName || user?.userPrincipalName || 'Current user';
    if (actorKey.includes('hod') || actorKey.includes('head of department')) {
      return formData.HOD || formData.HODApprover || formData.depthead || 'Selected HOD field';
    }
    if (actorKey.includes('executive director') || actorKey.includes('division director')) {
      return formData.ExecutiveDirector || formData.Executive || 'Selected executive field';
    }
    if (actorKey.includes('pic')) {
      return String(picEmail || formData.AssignedTo || formData.AssignedTechnician || 'Auto-assigned from routing');
    }
    if (actorKey.includes('it')) {
      return String(picEmail || formData.AssignedTo || formData.AssignedTechnician || 'Auto-assigned IT queue');
    }
    return 'Assigned by workflow';
  };

  const validateVisibleFields = () => {
    const nextErrors: Record<string, string> = {};
    for (const field of allVisibleFields) {
      if (!field.required || field.disabled) continue;
      const value = formData[field.id];
      if (value === undefined || value === false || (typeof value === 'string' && !value.trim())) {
        nextErrors[field.id] = `${field.label} is required`;
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please complete all required visible fields before submitting.');
      return false;
    }
    return true;
  };

  const handleReview = () => {
    if (!user) {
      toast.error('User profile is still loading. Please try again.');
      return;
    }
    if (!validateVisibleFields()) return;
    setIsReviewOpen(true);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      // Resolve additional fields from submitTransform (e.g. PIC email for RS)
      const extraFields = formConfig.submitTransform?.(formData, user) ?? {};
      const submittedAt = new Date().toISOString();
      const tid = formConfig.code + '-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
      const isSFAR = formConfig.code === 'SFAR';
      const isRS = formConfig.code === 'RS';
      const isUR = formConfig.code === 'UR';
      const currentStatus = (isSFAR ? 'CurrentstatusKey49' : isRS || isUR ? 'CurrentstatusKey4' : 'CurrentstatusKey1') as MainDBITCurrentstatusKey;
      const workflowstage = isSFAR ? 2 : 1;
      const remarks = buildRemarksSummary();

      const createdRecord = await createMainDBIT.mutateAsync({
        title: tid,
        formcode: formConfig.code,
        currentStatus,
        requestoremail: user.userPrincipalName || '',
        requestorName: user.fullName || '',
        submitteddate: submittedAt,
        workflowstage,
        islocked: false,
        remarks,
        ...extraFields,
      });

      if (createdRecord?.id) {
        if (formConfig.extensionTable && formConfig.extensionTransform) {
          await createExtensionChildRecord(createdRecord, tid);
        }
        if (isSFAR) {
          await createSFARApprovalRecords(createdRecord, submittedAt);
        }
      }
      setTicketId(tid);
      setIsSubmitted(true);
      setIsReviewOpen(false);
      toast.success('Form submitted!');
    } catch (e) {
      toast.error('Submission failed');
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValue = (fieldId: string) => {
    const value = formData[fieldId];
    return typeof value === 'string' ? value.trim() : value ? 'Yes' : '';
  };

  const baseExtensionRecord = (createdRecord: MainDBIT, ticketNumber: string) => ({
    title: `${ticketNumber}-ext`,
    parentFormCode: formConfig.code,
    parentRecord: { id: createdRecord.id, title: createdRecord.title || ticketNumber },
    parentSite: formValue('Site') || formValue('rbSite') || 'PRAI',
  });

  const createExtensionChildRecord = async (createdRecord: MainDBIT, ticketNumber: string) => {
    const extensionFields = formConfig.extensionTransform?.(formData, user) ?? {};
    const payload = {
      ...baseExtensionRecord(createdRecord, ticketNumber),
      ...extensionFields,
    };

    switch (formConfig.extensionTable) {
      case 'access':
        await createExtAccess.mutateAsync(payload as Omit<MainDBITExtAccess, 'id'>);
        break;
      case 'assets':
        await createExtAssets.mutateAsync(payload as Omit<MainDBITExtAssets, 'id'>);
        break;
      case 'docs':
        await createExtDocs.mutateAsync(payload as Omit<MainDBITExtDocs, 'id'>);
        break;
      case 'infra':
        await createExtInfra.mutateAsync(payload as Omit<MainDBITExtInfra, 'id'>);
        break;
      case 'policy':
        await createExtPolicy.mutateAsync(payload as Omit<MainDBITExtPolicy, 'id'>);
        break;
      case 'sap':
        await createExtSAP.mutateAsync(payload as Omit<MainDBITExtSAP, 'id'>);
        break;
      case 'support':
        await createExtSupport.mutateAsync(payload as Omit<MainDBITExtSupport, 'id'>);
        break;
      default:
        break;
    }
  };

  const createSFARApprovalRecords = async (createdRecord: MainDBIT, submittedAt: string) => {
    const ticketNumber = createdRecord.title || String(createdRecord.id);
    if (!formConfig.extensionTable || !formConfig.extensionTransform) {
      const extAccessData: Omit<MainDBITExtAccess, 'id'> = {
      title: `${ticketNumber}-ext`,
      parentFormCode: 'SFAR',
      parentRecord: { id: createdRecord.id, title: createdRecord.title || ticketNumber },
      parentSite: 'PRAI',
      sFARFolderPath: formValue('FolderName'),
      sFARAccessLevel: formValue('Permission'),
      };

      await createExtAccess.mutateAsync(extAccessData);
    }

    const owner = formValue('Owner') || 'Folder Owner';
    await createApprovalRecord.mutateAsync({
      stagename: 'Submission',
      formid: String(createdRecord.id),
      formcode: 'SFAR',
      actionbyid: user?.userPrincipalName || '',
      actionbyname: user?.fullName || user?.userPrincipalName || 'Requester',
      actiondate: submittedAt,
      actionKey: 'ActionKey3',
      stagenumber: 0,
      nextstage: 'PendingOwner',
      comments: `Submitted by ${user?.fullName || user?.userPrincipalName || 'Requester'}`,
    });

    await createApprovalRecord.mutateAsync({
      stagename: 'Pending Folder Owner Review',
      formid: String(createdRecord.id),
      formcode: 'SFAR',
      actionbyid: owner,
      actionbyname: owner,
      actiondate: submittedAt,
      actionKey: 'ActionKey3',
      stagenumber: 2,
      nextstage: 'PendingIT',
      comments: `Pending folder owner review for ${formValue('FolderName') || ticketNumber}`,
    });
  };

  if (isSubmitted && ticketId) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-primary mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Submitted!</h2>
            <div className="bg-[#003366]/5 rounded-lg p-4 border border-[#D0D0D0]">
              <p className="text-lg font-mono font-bold text-[#003366]">{ticketId}</p>
            </div>
            <Button onClick={() => navigate(`/my-submissions?form=${formConfig.code}`)}>View My Submissions</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* IOI Blue Header */}
      <header className="h-16 bg-[#003366] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <Link to="/it" className="hover:text-white transition-colors">IT</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/it/forms" className="hover:text-white transition-colors">Forms</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">{formConfig.name}</span>
          </div>
        </div>
        <Badge className="bg-white/20 text-white border-0">
          <Headset className="h-3 w-3 mr-1" />
          IT Support
        </Badge>
      </header>

      {/* Main Content */}
      <div className="p-6 pb-32">
        <div className="flex gap-6 max-w-6xl mx-auto">
          {/* Left Column - Form */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
              className="space-y-6"
            >
              {visibleSections.map((section, index) => (
                <Card key={section.id} className="border-[#D0D0D0]">
                  <CardHeader className="bg-[#003366]/5 border-b border-[#D0D0D0]">
                    <CardTitle className="text-[#003366]">
                      Section {index + 1} — {section.title}
                    </CardTitle>
                    {section.description && (
                      <p className="text-sm text-[#5C5C5C]">{section.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 lg:gap-x-10 lg:gap-y-8 items-start">
                      {(section.fields ?? []).map((field) => {
                        const val = formData[field.id];
                        const fieldError = errors[field.id];
                        switch (field.type) {
                          case 'text':
                          case 'email':
                          case 'number':
                          case 'date':
                            return (
                              <div key={field.id} className="space-y-2">
                                <Label>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
                                <Input
                                  type={field.type === 'date' ? 'date' : field.type}
                                  value={(val as string) || ''}
                                  onChange={(e) => setFormData(p => ({...p, [field.id]: e.target.value}))}
                                  placeholder={field.placeholder}
                                  disabled={field.disabled || Boolean(field.autoFill)}
                                />
                                {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
                                {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
                              </div>
                            );
                          case 'people':
                            return (
                              <div key={field.id} className="space-y-2">
                                <Label>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
                                {field.multipleSelection ? (
                                  <MultiEmployeePicker
                                    value={String(val || '').split(';').map((v) => v.trim()).filter(Boolean)}
                                    onChange={(emails) => setFormData(p => ({...p, [field.id]: emails.join('; ')}))}
                                    placeholder={field.placeholder || 'Search employees...'}
                                    disabled={field.disabled}
                                    helperText={field.helperText}
                                    required={field.required}
                                    error={Boolean(fieldError)}
                                  />
                                ) : (
                                  <EmployeePicker
                                    value={(val as string) || ''}
                                    onChange={(email, employee) => setFormData(p => ({
                                      ...p,
                                      [field.id]: email || employee?.fullName || '',
                                    }))}
                                    placeholder={field.placeholder || 'Search employee...'}
                                    disabled={field.disabled}
                                    helperText={field.helperText}
                                    required={field.required}
                                    error={Boolean(fieldError)}
                                    showEmail
                                  />
                                )}
                                {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
                              </div>
                            );
                          case 'file':
                            return (
                              <div key={field.id} className="space-y-2">
                                <Label>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
                                <Input
                                  type="text"
                                  value={(val as string) || ''}
                                  onChange={(e) => setFormData(p => ({...p, [field.id]: e.target.value}))}
                                  placeholder={field.placeholder || 'Attachment reference'}
                                  disabled={field.disabled}
                                />
                                {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
                                {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
                              </div>
                            );
                          case 'textarea':
                            return (
                              <div key={field.id} className="space-y-2 md:col-span-2">
                                <Label>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
                                <Textarea
                                  value={(val as string) || ''}
                                  onChange={(e) => setFormData(p => ({...p, [field.id]: e.target.value}))}
                                  placeholder={field.placeholder}
                                  disabled={field.disabled}
                                  rows={4}
                                />
                                {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
                                {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
                              </div>
                            );
                          case 'select':
                            return (
                              <div key={field.id} className="space-y-2">
                                <Label>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
                                <Select
                                  value={(val as string) || ''}
                                  onValueChange={(v) => setFormData(p => ({...p, [field.id]: v}))}
                                >
                                  <SelectTrigger><SelectValue placeholder={field.placeholder || `Select ${field.label}`} /></SelectTrigger>
                                  <SelectContent>
                                    {(field.options ?? []).filter(o => o.value).map(o => (
                                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
                                {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
                              </div>
                            );
                          case 'checkbox':
                            return (
                              <div key={field.id} className="flex items-start gap-3 py-2">
                                <Checkbox
                                  id={field.id}
                                  checked={!!val}
                                  onCheckedChange={(v) => setFormData(p => ({...p, [field.id]: !!v}))}
                                />
                                <Label htmlFor={field.id} className="text-sm font-normal">{field.label}</Label>
                                {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-80 space-y-4 shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl border border-[#D0D0D0] p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="h-5 w-5 text-[#003366]" />
                <h3 className="text-base font-semibold text-[#1C1C1C]">Workflow / Approver Steps</h3>
              </div>
              <div className="space-y-3">
                {activeWorkflowStages.map((stage) => (
                  <div key={stage.key} className="rounded-md border border-[#D0D0D0] bg-[#FAFAFA] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#1C1C1C]">Step {stage.order}</p>
                      {stage.isConditional && <Badge variant="outline">Conditional</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-[#003366]">{stage.name}</p>
                    <p className="mt-1 text-xs text-[#5C5C5C]">{stage.description}</p>
                    <p className="mt-2 text-xs text-[#1C1C1C]">
                      <span className="font-medium">Assigned/Approver:</span> {suggestedAssignee(stage.actor)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#D0D0D0] p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-5 w-5 text-[#003366]" />
                <h3 className="text-base font-semibold text-[#1C1C1C]">Form Rules</h3>
              </div>
              <p className="text-sm text-[#5C5C5C]">
                Fill in all required visible fields marked with <span className="text-red-500">*</span>. Conditional sections appear only after the trigger field is selected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white border-t border-[#D0D0D0] px-6 py-4">
        <div className="flex gap-3 justify-end max-w-6xl mx-auto">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleReview} disabled={isSubmitting} className="bg-[#003366] hover:bg-[#002244] text-white">
            <Send className="h-4 w-4 mr-2" />
            Review & Submit
          </Button>
        </div>
      </div>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Your Submission</DialogTitle>
            <DialogDescription>
              Confirm the fields you filled in before submitting {formConfig.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] overflow-y-auto rounded-md border border-[#D0D0D0]">
            {filledFields.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No user-filled fields yet.</p>
            ) : (
              <div className="divide-y divide-[#D0D0D0]">
                {filledFields.map(({ field, value }) => (
                  <div key={field.id} className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-[180px_1fr]">
                    <p className="text-sm font-medium text-[#1C1C1C]">{field.label}</p>
                    <p className="text-sm text-[#5C5C5C] break-words">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsReviewOpen(false)}>
              Back to Form
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#003366] hover:bg-[#002244] text-white">
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {isSubmitting ? 'Submitting...' : 'Submit Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
