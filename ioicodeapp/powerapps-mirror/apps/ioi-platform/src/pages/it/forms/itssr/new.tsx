/**
 * ITSSR - IT Support & Service Request (New Form)
 *
 * Clean submission screen for service-desk tickets. ITSSR is not an approval
 * form; submit creates a parent MainDB_IT row plus MainDB_IT_Ext_Support fields.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  Banknote,
  Building2,
  CheckCircle2,
  FileText,
  Headset,
  Info,
  Monitor,
  Paperclip,
  Route,
  Send,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormSubmissionLayout, type FormConfig } from '@/components/forms/form-submission-layout';
import type { FormStep } from '@/components/multi-step-form';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';

import { MainDBITExtDocsService } from '@/generated/services/main-dbit-ext-docs-service';
import { MainDBITExtSupportService } from '@/generated/services/main-dbit-ext-support-service';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { determineITSSRRouting } from '@/hooks/use-itssr-routing';
import { useUser } from '@/hooks/use-user';
import { ITSSR } from '@/lib/it-forms-config';
import { mapLocationToSiteKey, retryWithBackoff, type FormSubmissionResult } from '@/lib/form-submission-utils';
import { getITFormListPath } from '@/lib/it-form-page-utils';
import { cn } from '@/lib/utils';
import { OutlookEmailService } from '@/services/outlook-email-service';
import {
  ITSSR_APPLICATIONS,
  ITSSR_BANK_MODULES,
  ITSSR_COMPANIES,
  ITSSR_DEPARTMENTS,
  ITSSR_HARDWARE_ITEMS,
  ITSSR_SAP_MODULES,
  type ITSSRServiceType,
} from '@/types/m2-itssr-types';
import type { ITSSRSite } from '@/types/m2-itssr-workflow';

type ITSSRFormState = {
  site: string;
  company: string;
  department: string;
  reportedByEmail: string;
  reportedByName: string;
  phoneExtension: string;
  serviceType: string;
  hardware: string;
  application: string;
  module: string;
  sapModule: string;
  bankModule: string;
  problemDescription: string;
  attachments: File[];
};

type ITSSRFormErrors = Partial<Record<keyof ITSSRFormState, string>>;

const ITSSR_CODE = ITSSR.code;
const ITSSR_LIST_PATH = getITFormListPath(ITSSR_CODE);

const FORM_CONFIG: FormConfig = {
  code: ITSSR_CODE,
  name: 'IT Support & Service Request',
  basePath: ITSSR_LIST_PATH,
  submissionsPath: ITSSR_LIST_PATH,
  initialStatus: 'Submitted',
  initialStage: 1,
  hasExtRecord: true,
};

const FORM_STEPS: FormStep[] = [
  { id: '0', name: 'Request', description: 'Submit an IT support ticket' },
];

const ITSSR_ALLOWED_SERVICE_TYPES = ['Hardware', 'Software'] as const satisfies readonly ITSSRServiceType[];
const DEFAULT_ITSSR_TEAM_EMAIL = 'taung@ioioleo.com';

const DEFAULT_FORM: ITSSRFormState = {
  site: 'MY-PR',
  company: '',
  department: '',
  reportedByEmail: '',
  reportedByName: '',
  phoneExtension: '',
  serviceType: '',
  hardware: '',
  application: '',
  module: '',
  sapModule: '',
  bankModule: '',
  problemDescription: '',
  attachments: [],
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] as const } },
};

function timestampTitle(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${ITSSR_CODE}-${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
}

function cleanEmail(value: string): string {
  const match = value.match(/<([^<>]+)>/);
  return (match?.[1] || value).trim().toLowerCase();
}

function cleanEmailList(values: Array<string | undefined>): string {
  return Array.from(
    new Set(values.map((value) => cleanEmail(value || '')).filter(Boolean)),
  ).join(';');
}

function siteToRoutingSite(site: string): ITSSRSite {
  return site === 'MY-JH' ? 'Johor' : 'Prai';
}

function isSapApplication(application: string): boolean {
  const value = application.toUpperCase();
  return value.includes('SAP') || value === 'SAC';
}

function isBankApplication(application: string): boolean {
  return application.toUpperCase() === 'BANK';
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-destructive" role="alert">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}

function FieldShell({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <Label className="text-sm font-semibold">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      <ErrorText message={error} />
    </div>
  );
}

export default function ITSSRNewFormPage() {
  const { data: user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ITSSRFormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<ITSSRFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);

  const routingSite = useMemo(() => siteToRoutingSite(form.site), [form.site]);

  const routing = useMemo(
    () =>
      determineITSSRRouting({
        serviceType: form.serviceType as ITSSRServiceType | undefined,
        site: routingSite,
        application: form.application,
        department: form.department,
      }),
    [form.serviceType, routingSite, form.application, form.department],
  );
  const notificationToEmail = cleanEmail(routing.primaryPICEmail || DEFAULT_ITSSR_TEAM_EMAIL);
  const notificationCcEmail = cleanEmailList([routing.secondaryPICEmail]);
  const notificationToDisplay = routing.primaryPICName
    ? `${routing.primaryPICName} <${notificationToEmail}>`
    : notificationToEmail;
  const notificationCcDisplay = routing.secondaryPICName && routing.secondaryPICEmail
    ? `${routing.secondaryPICName} <${cleanEmail(routing.secondaryPICEmail)}>`
    : notificationCcEmail;

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      reportedByEmail: prev.reportedByEmail || user.userPrincipalName || '',
      reportedByName: prev.reportedByName || user.fullName || user.userPrincipalName || '',
    }));
  }, [user]);

  const updateField = <K extends keyof ITSSRFormState>(field: K, value: ITSSRFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'serviceType') {
        next.hardware = '';
        next.application = '';
        next.module = '';
        next.sapModule = '';
        next.bankModule = '';
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (isDraft: boolean): boolean => {
    if (isDraft) return true;

    const nextErrors: ITSSRFormErrors = {};
    if (!form.company) nextErrors.company = 'Company is required';
    if (!form.department) nextErrors.department = 'Department is required';
    if (!form.reportedByEmail) nextErrors.reportedByEmail = 'Reported By is required';
    if (!form.serviceType) nextErrors.serviceType = 'Service Type is required';
    if (form.serviceType === 'Hardware' && !form.hardware) nextErrors.hardware = 'Hardware item is required';
    if (form.serviceType === 'Software' && !form.application) nextErrors.application = 'Application is required';
    if (form.problemDescription.trim().length < 10) {
      nextErrors.problemDescription = 'Describe the request with at least 10 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveSubmission = async (isDraft: boolean) => {
    if (!validate(isDraft)) {
      toast.error('Please complete all required ITSSR fields.');
      return;
    }

    setIsSubmitting(true);
    setNotificationSent(false);

    const now = new Date();
    const submittedDate = now.toISOString();
    const initialTitle = `${timestampTitle(now)}-draft`;
    const status = isDraft ? 'Draft' : 'Submitted';
    const routedEmail = notificationToEmail;
    const routedName = routing.primaryPICName || routedEmail;

    try {
      const parent = await retryWithBackoff(
        () =>
          MainDBITService.create({
            title: initialTitle,
            formcode: ITSSR_CODE,
            currentStatus: status,
            currentAction: status,
            workflowstage: isDraft ? 0 : 1,
            environmenttagKey: 'EnvironmenttagKey0',
            siteKey: mapLocationToSiteKey(form.site),
            company: form.company,
            subject: form.problemDescription.trim().slice(0, 120) || 'IT support request',
            requestoremail: cleanEmail(form.reportedByEmail),
            requestorName: form.reportedByName || cleanEmail(form.reportedByEmail),
            submitteddate: submittedDate,
            islocked: false,
          } as Parameters<typeof MainDBITService.create>[0]),
        (attempt, max) => toast.info(`SharePoint is busy, retrying... (${attempt}/${max})`),
      );

      const finalTitle = `${timestampTitle(now)}-${parent.id}`;
      const submitted = await MainDBITService.update(String(parent.id), {
        title: finalTitle,
      } as Parameters<typeof MainDBITService.update>[1]);

      try {
        await MainDBITExtSupportService.create({
          title: finalTitle,
          parentFormCode: ITSSR_CODE,
          parentRecord: { id: submitted.id, title: finalTitle },
          parentSite: form.site,
          iTSSRCaseNo: finalTitle,
          iTSSRServiceType: form.serviceType,
          iTSSRProblemDescription: form.problemDescription.trim(),
          iTSSRReportedByEmail: cleanEmail(form.reportedByEmail),
          iTSSRSendToEmail: routedEmail,
          iTSSRDepartment: form.department,
          iTSSRExtension: form.phoneExtension,
          iTSSRHardware: form.hardware,
          iTSSRApplication: form.application,
          iTSSRModule: form.module,
          iTSSRSAPModule: form.sapModule,
          iTSSRBankModule: form.bankModule,
          iTSSRProblemCategory: form.serviceType,
          iTSSRSupportMethod: 'To be assigned',
          iTSSRCC: notificationCcEmail,
          iTSSRITRemarks: [
            routedEmail ? `Primary PIC: ${routedName || routedEmail} <${routedEmail}>` : null,
            notificationCcEmail ? `CC: ${notificationCcEmail}` : null,
            form.attachments.length ? `Attachments: ${form.attachments.map((file) => file.name).join(', ')}` : null,
          ].filter(Boolean).join('\n'),
        } as Parameters<typeof MainDBITExtSupportService.create>[0]);
      } catch (childError) {
        await MainDBITService.delete(String(submitted.id)).catch(() => undefined);
        throw childError;
      }

      for (const file of form.attachments) {
        await MainDBITExtDocsService.create({
          title: finalTitle,
          parentFormCode: ITSSR_CODE,
          parentRecord: { id: submitted.id, title: finalTitle },
          parentSite: form.site,
          iTPDocType: 'Requestor Attachment',
          iTPDocTitle: file.name,
          iTPVersionNo: '1',
          iTPRevisionNo: '0',
          iTPDateLastUpdated: submittedDate,
          iTPApplicableTo: ITSSR_CODE,
          iTPComments: `Selected file metadata only: ${file.name}; ${file.type || 'unknown type'}; ${file.size} bytes`,
        } as Parameters<typeof MainDBITExtDocsService.create>[0]).catch(() => undefined);
      }

      if (!isDraft && routedEmail) {
        await OutlookEmailService.sendEmail({
          to: routedEmail,
          cc: notificationCcEmail || undefined,
          subject: `[${ITSSR_CODE}] New support request ${finalTitle}`,
          body: `
            <p>A new IT support request has been submitted.</p>
            <p><strong>Case:</strong> ${finalTitle}</p>
            <p><strong>Service Type:</strong> ${form.serviceType}</p>
            <p><strong>Requestor:</strong> ${form.reportedByName || form.reportedByEmail}</p>
            <p><strong>Company / Department:</strong> ${form.company} / ${form.department}</p>
            <p><strong>Description:</strong><br/>${form.problemDescription.replace(/\n/g, '<br/>')}</p>
          `,
        }).then(() => setNotificationSent(true)).catch(() => setNotificationSent(false));
      }

      setSubmissionResult({
        id: submitted.id,
        ticketId: finalTitle,
        title: finalTitle,
        formcode: ITSSR_CODE,
        currentStatus: status,
        site: form.site,
        submittedDate,
        requestorEmail: cleanEmail(form.reportedByEmail),
      });
      toast.success(isDraft ? 'ITSSR draft saved.' : 'ITSSR request submitted.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save ITSSR request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    updateField('attachments', [...form.attachments, ...selected]);
    toast.success(`${selected.length} file(s) selected`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (name: string, index: number) => {
    updateField(
      'attachments',
      form.attachments.filter((file, fileIndex) => !(file.name === name && fileIndex === index)),
    );
  };

  return (
    <FormSubmissionLayout
      formConfig={FORM_CONFIG}
      steps={FORM_STEPS}
      currentStep={0}
      onStepChange={() => undefined}
      formData={form as unknown as Record<string, unknown>}
      onFieldChange={(field, value) => updateField(field as keyof ITSSRFormState, value as never)}
      fields={[]}
      isSubmitting={isSubmitting}
      onSubmit={() => saveSubmission(false)}
      onSaveDraft={() => saveSubmission(true)}
      submissionResult={submissionResult}
      notificationSent={notificationSent}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-2">
                <Headset className="h-5 w-5 text-primary" />
                <CardTitle>Service Details</CardTitle>
              </div>
              <CardDescription>Select the type of IT support needed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FieldShell label="Service Type" required error={errors.serviceType}>
                  <Select value={form.serviceType} onValueChange={(value) => updateField('serviceType', value)}>
                    <SelectTrigger className={cn('h-11 w-full', errors.serviceType && 'border-destructive')}>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ITSSR_ALLOWED_SERVICE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldShell>

                {form.serviceType === 'Hardware' ? (
                  <FieldShell label="Hardware Item" required error={errors.hardware}>
                    <Select value={form.hardware} onValueChange={(value) => updateField('hardware', value)}>
                      <SelectTrigger className={cn('h-11 w-full', errors.hardware && 'border-destructive')}>
                        <SelectValue placeholder="Select hardware item" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITSSR_HARDWARE_ITEMS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                ) : null}

                {form.serviceType === 'Software' ? (
                  <FieldShell label="Application" required error={errors.application}>
                    <Select value={form.application} onValueChange={(value) => updateField('application', value)}>
                      <SelectTrigger className={cn('h-11 w-full', errors.application && 'border-destructive')}>
                        <SelectValue placeholder="Select application" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITSSR_APPLICATIONS.map((application) => (
                          <SelectItem key={application} value={application}>
                            {application}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                ) : null}

                {form.serviceType === 'Software' && isSapApplication(form.application) && !isBankApplication(form.application) ? (
                  <FieldShell label="SAP Module" error={errors.sapModule}>
                    <Select value={form.sapModule} onValueChange={(value) => updateField('sapModule', value)}>
                      <SelectTrigger className={cn('h-11 w-full', errors.sapModule && 'border-destructive')}>
                        <SelectValue placeholder="Select SAP module" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITSSR_SAP_MODULES.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                ) : null}

                {form.serviceType === 'Software' && isBankApplication(form.application) ? (
                  <FieldShell label="Bank Module" error={errors.bankModule}>
                    <Select value={form.bankModule} onValueChange={(value) => updateField('bankModule', value)}>
                      <SelectTrigger className={cn('h-11 w-full', errors.bankModule && 'border-destructive')}>
                        <SelectValue placeholder="Select bank module" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITSSR_BANK_MODULES.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                ) : null}

                <FieldShell label="Module / System">
                  <Input
                    className="h-11"
                    value={form.module}
                    onChange={(event) => updateField('module', event.target.value)}
                    placeholder="Optional module, client, or system name"
                  />
                </FieldShell>
              </div>

              {form.serviceType ? (
                <Badge className="border-0 bg-primary/10 text-primary">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  {form.serviceType}
                  {form.hardware || form.application || form.sapModule || form.bankModule
                    ? ` - ${form.hardware || form.application || form.sapModule || form.bankModule}`
                    : ''}
                </Badge>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Requestor Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FieldShell label="Site" required>
                  <Select value={form.site} onValueChange={(value) => updateField('site', value)}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MY-PR">Penang / Prai (MY-PR)</SelectItem>
                      <SelectItem value="MY-JH">Johor (MY-JH)</SelectItem>
                      <SelectItem value="remote">Remote / Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldShell>

                <FieldShell label="Company" required error={errors.company}>
                  <SharePointLookupSelect
                    kind="company"
                    value={form.company}
                    onChange={(value) => updateField('company', value)}
                    placeholder="Select company"
                    className={cn('h-11 w-full', errors.company && 'border-destructive')}
                    fallbackOptions={[...ITSSR_COMPANIES]}
                  />
                </FieldShell>

                <FieldShell label="Department" required error={errors.department}>
                  <SharePointLookupSelect
                    kind="department"
                    value={form.department}
                    onChange={(value) => updateField('department', value)}
                    placeholder="Select department"
                    className={cn('h-11 w-full', errors.department && 'border-destructive')}
                    fallbackOptions={[...ITSSR_DEPARTMENTS]}
                  />
                </FieldShell>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FieldShell label="Reported By" required error={errors.reportedByEmail}>
                  <Input
                    className={cn('h-11 bg-muted/50', errors.reportedByEmail && 'border-destructive')}
                    value={
                      form.reportedByName && form.reportedByEmail
                        ? `${form.reportedByName} <${form.reportedByEmail}>`
                        : form.reportedByEmail
                    }
                    readOnly
                  />
                </FieldShell>

                <FieldShell label="Phone Extension">
                  <Input
                    className="h-11"
                    value={form.phoneExtension}
                    onChange={(event) => updateField('phoneExtension', event.target.value)}
                    placeholder="e.g. 1234"
                  />
                </FieldShell>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Issue Description</CardTitle>
              </div>
              <CardDescription>Describe the issue, request, or error message clearly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <FieldShell label="Problem Description" required error={errors.problemDescription}>
                <Textarea
                  className={cn('min-h-32', errors.problemDescription && 'border-destructive')}
                  value={form.problemDescription}
                  onChange={(event) => updateField('problemDescription', event.target.value)}
                  placeholder="Include what happened, when it happened, affected users, and any error messages."
                />
              </FieldShell>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Attachment</Label>
                <input
                  ref={fileInputRef}
                  id="itssr-attachments"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(event) => handleFilesSelected(event.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <Upload className="h-4 w-4" />
                  Select screenshots or supporting documents
                </button>

                {form.attachments.length ? (
                  <div className="space-y-2">
                    {form.attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800"
                      >
                        <Paperclip className="h-3.5 w-3.5 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(file.name, index)}
                          className="shrink-0 text-emerald-700 transition-colors hover:text-destructive"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Notification &amp; Routing</CardTitle>
              </div>
              <CardDescription>Routing is calculated from Service Type, Department, and Application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                {[
                  { label: 'Service Type', value: form.serviceType || 'Not set', done: Boolean(form.serviceType), icon: Monitor },
                  { label: 'Department', value: form.department || 'Not set', done: Boolean(form.department), icon: Building2 },
                  { label: 'System', value: form.application || form.sapModule || form.bankModule || form.module || 'Not set', done: Boolean(form.application || form.sapModule || form.bankModule || form.module), icon: Banknote },
                  { label: 'Routing', value: routing.isRoutingDetermined ? 'Auto-routed' : 'Manual assign', done: routing.isRoutingDetermined, icon: Route },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-lg border bg-muted/20 p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <span className="h-4 w-4 shrink-0 rounded-full border-2 border-border" />
                        )}
                        <span className="min-w-0 truncate text-sm font-medium">{item.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {routing.primaryPICEmail ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold text-white">
                      {routing.primaryPICName?.charAt(0) || 'I'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-emerald-950">
                        Routed to {routing.primaryPICName || 'IT Support'}
                      </p>
                      <p className="truncate text-xs text-emerald-700">{routing.primaryPICEmail}</p>
                      {routing.picDescription ? (
                        <p className="mt-1 text-xs text-emerald-700">{routing.picDescription}</p>
                      ) : null}
                    </div>
                    <UserCheck className="h-5 w-5 shrink-0 text-emerald-700" />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <Info className="mr-1 inline h-3.5 w-3.5" />
                  No automatic IT PIC is selected yet. The ticket can still be submitted and assigned manually.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FieldShell label="To">
                  <Input className="h-11 bg-muted/50" value={notificationToDisplay} readOnly />
                </FieldShell>
                <FieldShell label="CC">
                  <Input className="h-11 bg-muted/50" value={notificationCcDisplay} readOnly />
                </FieldShell>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </FormSubmissionLayout>
  );
}
