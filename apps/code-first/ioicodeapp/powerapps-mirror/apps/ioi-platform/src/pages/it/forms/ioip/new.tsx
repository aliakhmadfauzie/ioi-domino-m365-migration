/**
 * IOIP — IOI Policy (PolicyEntryV1)
 * M5 - IT Documentation
 *
 * Company policy management with 3-approver workflow.
 * FinalStatus: 0=Draft, 1=Pending Approval, 4=Distributed, 6=Archived
 *
 * Parent: MainDB_IT (iOIPPolicyNo, iOIPPolicyTitle, iOIPEffectiveDate)
 * Child:  MainDB_IT_Ext_Policy (detailed policy fields, 3 approvers, distribution)
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { FileText, User, AlertCircle, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { MainDBITExtPolicyService } from '@/generated/services/main-dbit-ext-policy-service';
import { useSendApprovalEmail, useSendConfirmationEmail } from '@/hooks/use-send-email';
import { PeoplePicker, type PersonValue } from '@/components/ui/people-picker';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtPolicy } from '@/generated/models/main-dbit-ext-policy-model';
import { retryWithBackoff, generateTicketId, type FormSubmissionResult } from '@/lib/form-submission-utils';
import { FormSubmissionLayout, type FormConfig } from '@/components/forms/form-submission-layout';
import type { FormStep } from '@/components/multi-step-form';

// =============================================================================
// FORM STEPS
// =============================================================================

const FORM_STEPS: FormStep[] = [
  { id: '0', name: 'Policy Info', description: 'Number, title, revision' },
  { id: '1', name: 'Content', description: 'Policy body text' },
  { id: '2', name: 'Approvers', description: '3-level approval chain' },
  { id: '3', name: 'Review', description: 'Confirm & submit' },
];

// =============================================================================
// FORM CONFIG
// =============================================================================

const FORM_CONFIG: FormConfig = {
  code: 'IOIP',
  name: 'IOI Policy',
  basePath: '/it/forms/ioip',
  initialStatus: 'CurrentstatusKey55', // Pending first policy approver
  initialStage: 2,
  hasExtRecord: true,
};

// =============================================================================
// FORM INPUT TYPE
// =============================================================================

interface IOIPFormInput {
  PolicyNo: string;
  Subject: string;
  ReviNum: string;
  DateIssue: string;
  Body: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function IOIPNewFormPage() {
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const sendApprovalEmail = useSendApprovalEmail();
  const sendConfirmationEmail = useSendConfirmationEmail();

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSubmittedTicketId] = useState('');
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  // Form data
  const [formData, setFormData] = useState<IOIPFormInput>({
    PolicyNo: '',
    Subject: '',
    ReviNum: '1.0',
    DateIssue: new Date().toISOString().split('T')[0],
    Body: '',
  });

  // Auto-generate policy number on mount: IOIP-YYYY-NNN
  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const existing = await MainDBITExtPolicyService.getList({ orderBy: ['id desc'] });
        if (cancelled) return;
        const year = new Date().getFullYear();
        const prefix = `IOIP-${year}-`;
        let maxSeq = 0;
        existing.forEach((r) => {
          const no = r.iOIPPolicyNo || '';
          if (no.startsWith(prefix)) {
            const seq = parseInt(no.slice(prefix.length), 10);
            if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
          }
        });
        setFormData((prev) => ({ ...prev, PolicyNo: `${prefix}${String(maxSeq + 1).padStart(3, '0')}` }));
      } catch {
        if (!cancelled) {
          const year = new Date().getFullYear();
          setFormData((prev) => ({ ...prev, PolicyNo: `IOIP-${year}-001` }));
        }
      }
    }
    generate();
    return () => { cancelled = true; };
  }, []);

  // People pickers
  const [selectedApprover1, setSelectedApprover1] = useState<PersonValue | PersonValue[] | null>(null);
  const [selectedApprover2, setSelectedApprover2] = useState<PersonValue | PersonValue[] | null>(null);
  const [selectedApprover3, setSelectedApprover3] = useState<PersonValue | PersonValue[] | null>(null);
  const [selectedDistribution, setSelectedDistribution] = useState<PersonValue | PersonValue[] | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Helpers
  const extractUserEmail = (u: PersonValue | PersonValue[] | null): string => {
    if (!u) return '';
    if (Array.isArray(u)) return u.map(v => v.email || '').filter(Boolean).join(';');
    return u.email || '';
  };

  const extractSingleEmail = (u: PersonValue | PersonValue[] | null): string => {
    if (!u) return '';
    if (Array.isArray(u)) return u[0]?.email || '';
    return u.email || '';
  };

  const extractSingleName = (u: PersonValue | PersonValue[] | null): string => {
    if (!u) return '';
    if (Array.isArray(u)) return u[0]?.displayName || '';
    return u.displayName || '';
  };

  const updateField = <K extends keyof IOIPFormInput>(field: K, value: IOIPFormInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleRetryNotification = useCallback((attempt: number, maxAttempts: number) => {
    toast.info(`System busy, retrying... (${attempt}/${maxAttempts})`, { duration: 2000 });
  }, []);

  // Validation
  const validateForm = (): boolean => {
    const errs: Partial<Record<string, string>> = {};
    if (!formData.Subject) errs.Subject = 'Required';
    if (!formData.ReviNum) errs.ReviNum = 'Required';
    if (!formData.DateIssue) errs.DateIssue = 'Required';
    if (!formData.Body) errs.Body = 'Required';
    if (!extractSingleEmail(selectedApprover1)) errs.App1_1 = 'Required';
    if (!extractSingleEmail(selectedApprover2)) errs.App2_1 = 'Required';
    if (!extractSingleEmail(selectedApprover3)) errs.App3_1 = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Compute default distribution list from approvers
  const defaultList = useMemo(() => {
    const emails = [
      extractSingleEmail(selectedApprover1),
      extractSingleEmail(selectedApprover2),
      extractSingleEmail(selectedApprover3),
    ].filter(Boolean);
    return [...new Set(emails)].join(';');
  }, [selectedApprover1, selectedApprover2, selectedApprover3]);

  // Submit
  const handleSubmit = async () => {
    if (!validateForm()) { toast.error('Please fill in all required fields.'); return; }
    setIsSubmitting(true);
    try {
      const ticketId = generateTicketId('IOIP');
      const requestorEmail = user?.email || '';
      const requestorName = user?.fullName || '';

      const a1Email = extractSingleEmail(selectedApprover1);
      const a2Email = extractSingleEmail(selectedApprover2);
      const a3Email = extractSingleEmail(selectedApprover3);
      const distEmails = extractUserEmail(selectedDistribution);

      const parentData: Omit<MainDBIT, 'id'> = {
        title: `${formData.PolicyNo} - ${formData.Subject}`,
        formcode: 'IOIP',
        currentStatus: 'pending-section-b',
        currentAction: 'Pending Policy Approval',
        workflowstage: 2,
        islocked: false,
        submitteddate: new Date().toISOString(),
        requestoremail: requestorEmail,
        requestorName,
        subject: formData.Subject,
      };

      const created = await retryWithBackoff(
        () => createMainDBIT.mutateAsync(parentData as any),
        handleRetryNotification,
      );

      const extData: Omit<MainDBITExtPolicy, 'id'> = {
        title: `Policy: ${formData.PolicyNo}`,
        parentFormCode: 'IOIP',
        parentRecord: { id: created.id, title: created.title },
        iOIPPolicyNo: formData.PolicyNo,
        iOIPSubject: formData.Subject,
        iOIPReviNum: formData.ReviNum,
        iOIPDateIssue: formData.DateIssue,
        iOIPBody: formData.Body,
        iOIPDocTitle: formData.Subject,
        iOIPFinalStatus: '1',
        iOIPApp1_1: a1Email,
        iOIPApp2_1: a2Email,
        iOIPApp3_1: a3Email,
        iOIPReq1: '1',
        iOIPReq2: '1',
        iOIPReq3: '1',
        iOIPDefaultList: defaultList,
        iOIPDistributionList: distEmails,
        iOIPRevR: formData.ReviNum,
        iOIPRevD: new Date().toISOString().split('T')[0],
        iOIPRevU: requestorName,
      };

      await retryWithBackoff(
        () => MainDBITExtPolicyService.create(extData),
        handleRetryNotification,
      );

      // Email notifications
      try {
        if (a1Email) {
          await sendApprovalEmail.mutateAsync({
            ticketId,
            formType: 'IOIP',
            formTitle: `Policy: ${formData.Subject}`,
            requestorName,
            requestorEmail,
            approverEmail: a1Email,
            approverName: extractSingleName(selectedApprover1),
            justification: formData.Body?.substring(0, 200),
            additionalDetails: {
              'Policy No': formData.PolicyNo,
              'Revision': formData.ReviNum,
              'Effective Date': formData.DateIssue,
            },
            cc: distEmails,
          });
        }
        if (requestorEmail) {
          await sendConfirmationEmail.mutateAsync({
            ticketId,
            formType: 'IOIP',
            formTitle: `Policy: ${formData.Subject}`,
            requestorEmail,
            requestorName,
            approverName: extractSingleName(selectedApprover1),
          });
        }
        setNotificationSent(true);
      } catch (e) {
        console.error('Email error:', e);
      }

      setSubmissionResult({
        id: created.id,
        ticketId,
        title: `IOIP - ${formData.PolicyNo}`,
        formcode: 'IOIP',
        currentStatus: 'Pending Approval',
        priority: 'Normal',
        submittedDate: new Date().toISOString(),
        requestorEmail,
      });

      setSubmittedTicketId(ticketId);
      setIsSubmitting(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Submission error:', msg);
      toast.error('Failed to submit: ' + msg);
      setIsSubmitting(false);
    }
  };

  return (
    <FormSubmissionLayout
      formConfig={FORM_CONFIG}
      steps={FORM_STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      formData={formData as unknown as Record<string, unknown>}
      onFieldChange={(field, value) => updateField(field as keyof IOIPFormInput, value as IOIPFormInput[keyof IOIPFormInput])}
      fields={[]}
      isSubmitting={isSubmitting}
      selectedCategory={formData.PolicyNo}
      onSubmit={handleSubmit}
      submissionResult={submissionResult}
      notificationSent={notificationSent}
    >
      {currentStep === 0 && (
        <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5" style={{ color: '#059669' }} />
            <h2 className="text-lg font-semibold">Policy Information</h2>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm font-semibold">Policy No</Label>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
                  Auto-generated
                </span>
              </div>
              <div
                className="mt-2 flex items-center px-3 font-mono text-sm font-semibold select-none"
                style={{ height: '44px', borderRadius: '8px', backgroundColor: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' }}
              >
                {formData.PolicyNo ? formData.PolicyNo : (
                  <span className="flex items-center gap-2 text-xs font-normal font-sans" style={{ color: '#059669', opacity: 0.6 }}>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating...
                  </span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Subject/Title <span className="text-destructive">*</span></Label>
              <Input value={formData.Subject} onChange={e => updateField('Subject', e.target.value)} placeholder="Policy title" className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }} />
              {errors.Subject && <p className="text-xs mt-1 flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" />{errors.Subject}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">Revision <span className="text-destructive">*</span></Label>
                <Input value={formData.ReviNum} onChange={e => updateField('ReviNum', e.target.value)} placeholder="1.0" className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }} />
                {errors.ReviNum && <p className="text-xs mt-1 flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" />{errors.ReviNum}</p>}
              </div>
              <div>
                <Label className="text-sm font-semibold">Effective Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={formData.DateIssue} onChange={e => updateField('DateIssue', e.target.value)} className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }} />
                {errors.DateIssue && <p className="text-xs mt-1 flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" />{errors.DateIssue}</p>}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {currentStep === 1 && (
        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5" style={{ color: '#059669' }} />
            <h2 className="text-lg font-semibold">Policy Content</h2>
          </div>
          <div>
            <Label className="text-sm font-semibold">Policy Content <span className="text-destructive">*</span></Label>
            <p className="text-xs mb-2 text-muted-foreground">Enter the full policy text</p>
            <Textarea value={formData.Body} onChange={e => updateField('Body', e.target.value)} placeholder="Enter policy content..." rows={12} style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }} />
            {errors.Body && <p className="text-xs mt-1 flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" />{errors.Body}</p>}
          </div>
        </motion.div>
      )}

      {currentStep === 2 && (
        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5" style={{ color: '#059669' }} />
            <h2 className="text-lg font-semibold">Approval Chain & Distribution</h2>
          </div>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold">Approver 1 <span className="text-destructive">*</span></Label>
              <p className="text-xs mb-2 text-muted-foreground">First approver</p>
              <PeoplePicker value={selectedApprover1 as PersonValue | null} onChange={setSelectedApprover1} multiple={false} placeholder="Search approver 1..." />
              {errors.App1_1 && <p className="text-xs mt-1 flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" />{errors.App1_1}</p>}
            </div>
            <div>
              <Label className="text-sm font-semibold">Approver 2 <span className="text-destructive">*</span></Label>
              <p className="text-xs mb-2 text-muted-foreground">Second approver</p>
              <PeoplePicker value={selectedApprover2 as PersonValue | null} onChange={setSelectedApprover2} multiple={false} placeholder="Search approver 2..." />
              {errors.App2_1 && <p className="text-xs mt-1 flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" />{errors.App2_1}</p>}
            </div>
            <div>
              <Label className="text-sm font-semibold">Approver 3 <span className="text-destructive">*</span></Label>
              <p className="text-xs mb-2 text-muted-foreground">Third approver</p>
              <PeoplePicker value={selectedApprover3 as PersonValue | null} onChange={setSelectedApprover3} multiple={false} placeholder="Search approver 3..." />
              {errors.App3_1 && <p className="text-xs mt-1 flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" />{errors.App3_1}</p>}
            </div>
            <div>
              <Label className="text-sm font-semibold">Additional Distribution <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <p className="text-xs mb-2 text-muted-foreground">Additional staff to notify</p>
              <PeoplePicker value={selectedDistribution as PersonValue | PersonValue[] | null} onChange={setSelectedDistribution} multiple={true} placeholder="Search people to distribute to..." />
            </div>
          </div>
        </motion.div>
      )}

      {currentStep === 3 && (
        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-2 mb-6">
            <Check className="w-5 h-5" style={{ color: '#059669' }} />
            <h2 className="text-lg font-semibold">Review & Submit</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
              <h3 className="text-sm font-semibold mb-3">Policy Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Policy No</p><p className="font-semibold font-mono" style={{ color: '#059669' }}>{formData.PolicyNo}</p></div>
                <div><p className="text-muted-foreground">Revision</p><p className="font-medium">{formData.ReviNum}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground">Subject</p><p className="font-medium">{formData.Subject}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground">Effective Date</p><p className="font-medium">{formData.DateIssue}</p></div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(5,150,105,0.08)', border: '1px solid #059669' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#059669' }}>Approval Workflow</h3>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: i === 1 ? '#059669' : '#D0D0D0', color: i === 1 ? '#FFF' : '#5C5C5C' }}>{i}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#059669' }}>Approver {i}</p>
                      <p className="text-xs text-muted-foreground">{i === 1 ? extractSingleName(selectedApprover1) : i === 2 ? extractSingleName(selectedApprover2) : extractSingleName(selectedApprover3) || 'Not selected'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </FormSubmissionLayout>
  );
}
