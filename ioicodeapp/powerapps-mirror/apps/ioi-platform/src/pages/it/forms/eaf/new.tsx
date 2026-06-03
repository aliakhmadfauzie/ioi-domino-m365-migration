/**
 * EAF - External Access Form (VPN & Citrix)
 * M1 - User & Access Management
 *
 * 5-Stage Workflow:
 * S1 Submission -> S2 Dept Head -> S3 Division Director -> S4 IT Manager -> S5 IT Provisioning
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  User as UserIcon,
  Monitor,
  FileText,
  AlertCircle,
  Globe,
  Lock,
  Server,
} from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtAccessService } from '@/generated/services/main-dbit-ext-access-service';
import { useSendApprovalEmail, useSendConfirmationEmail } from '@/hooks/use-send-email';
import { PeoplePicker, type PersonValue } from '@/components/ui/people-picker';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import { useFormApprover } from '@/hooks/use-form-approver';
import {
  type EAFFormInput,
  type EAFApplication,
  EAF_APPLICATIONS,
  EAF_STAGES,
} from '@/types/m1-forms';
import { useSharePointCompanies } from '@/hooks/use-sharepoint-config';
import { IOI_COMPANY_OPTIONS } from '@/lib/it-forms-config';
import { EAF_SYSTEMS } from '@/config/form-dropdown-config';
import { retryWithBackoff, generateTicketId, mapLocationToSiteKey, type FormSubmissionResult } from '@/lib/form-submission-utils';
import { FormSubmissionLayout, type FormConfig } from '@/components/forms/form-submission-layout';
import type { FormStep } from '@/components/multi-step-form';

// =============================================================================
// FORM STEPS
// =============================================================================

const FORM_STEPS: FormStep[] = [
  { id: '0', name: 'Requestor', description: 'Your information' },
  { id: '1', name: 'Access Details', description: 'What access is needed' },
  { id: '2', name: 'Justification', description: 'Business reason' },
  { id: '3', name: 'Review', description: 'Confirm & submit' },
];

// =============================================================================
// COMPONENT
// =============================================================================

const FORM_CONFIG: FormConfig = {
  code: 'EAF',
  name: 'External Access Form (VPN & Citrix)',
  basePath: '/it/forms/eaf',
  initialStatus: 'CurrentstatusKey27',
  initialStage: 1,
  hasExtRecord: true,
};

export default function EAFNewFormPage() {
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const { approver: manualApprover, isManualAssign } = useFormApprover('EAF');
  const sendApprovalEmail = useSendApprovalEmail();
  const sendConfirmationEmail = useSendConfirmationEmail();

  // SharePoint company dropdown data (with static fallback)
  const { companies: spCompanies, isLoading: isLoadingCompanies } = useSharePointCompanies();
  const companies = useMemo(() => {
    if (spCompanies.length > 0) return spCompanies;
    return IOI_COMPANY_OPTIONS.map((opt) => ({ code: opt.value, name: opt.value }));
  }, [spCompanies]);

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSubmittedTicketId] = useState('');
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  // Form data
  const [formData, setFormData] = useState<EAFFormInput>({
    Company: '',
    Site: 'MY-PR',
    Requestor: user?.fullName || '',
    TargetUser: '',
    Application: 'VPN',
    System: 'Active Directory',
    Justification: '',
    DepartmentHead: '',
    CCRecipients: '',
    ClientID: '',           // Domino 'ClientID' field
    Group: '',              // Domino 'Group' field
    HigherApprover: '',     // Domino 'HApp' field
  });

  // Determine if a company is a PanCen company (PCEO / PCOC)
  // Matches Domino: @If(Company="PCEO" | Company="PCOC";"1";"0")
  const isPancenCompany = useMemo(() => {
    const company = formData.Company.toUpperCase();
    return company.includes('PCEO') || company.includes('PCOC') ||
           company.includes('PAN-CENTURY');
  }, [formData.Company]);

  useEffect(() => {
    if (user?.fullName && formData.Requestor !== user.fullName) {
      setFormData(prev => ({ ...prev, Requestor: user.fullName }));
    }
  }, [user?.fullName, formData.Requestor]);

  // Selected people from M365 People Picker
  const [selectedTargetUser, setSelectedTargetUser] = useState<PersonValue | PersonValue[] | null>(null);
  const [selectedDeptHead, setSelectedDeptHead] = useState<PersonValue | PersonValue[] | null>(null);
  const [selectedHigherApprover, setSelectedHigherApprover] = useState<PersonValue | PersonValue[] | null>(null);
  const [selectedCCRecipients, setSelectedCCRecipients] = useState<PersonValue | PersonValue[] | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof EAFFormInput, string>>>({});

  // Helper to extract user info from PeoplePicker selection
  const extractUserEmail = (user: PersonValue | PersonValue[] | null): string => {
    if (!user) return '';
    if (Array.isArray(user)) {
      return user.map(u => u.email || '').filter(Boolean).join(';');
    }
    return user.email || '';
  };

  const extractSingleUserEmail = (user: PersonValue | PersonValue[] | null): string => {
    if (!user) return '';
    if (Array.isArray(user)) return user[0]?.email || '';
    return user.email || '';
  };

  const extractSingleUserDisplayName = (user: PersonValue | PersonValue[] | null): string => {
    if (!user) return '';
    if (Array.isArray(user)) return user[0]?.displayName || '';
    return user.displayName || '';
  };

  // Update form field
  const updateField = <K extends keyof EAFFormInput>(field: K, value: EAFFormInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Navigation handled by MultiStepForm via onStepChange

  // Build approver information
  const getApproverInfo = (): { email: string; name: string } => {
    if (isManualAssign && manualApprover) {
      return {
        email: manualApprover.email,
        name: manualApprover.name,
      };
    }

    // Use selected department head from People Picker
    const email = extractSingleUserEmail(selectedDeptHead);
    const name = extractSingleUserDisplayName(selectedDeptHead);

    return { email, name };
  };

  // Retry notification callback
  const handleRetryNotification = useCallback((attempt: number, maxAttempts: number) => {
    toast.info(`System busy, retrying... (${attempt}/${maxAttempts})`, { duration: 2000 });
  }, []);

  // Client-side validation matching Domino required fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EAFFormInput, string>> = {};

    if (!formData.Company) newErrors.Company = 'Company is required';
    if (!formData.Site) newErrors.Site = 'Site is required';
    if (!formData.Requestor) newErrors.Requestor = 'Requestor name is required';
    if (!formData.TargetUser && !formData.TargetUserId) newErrors.TargetUser = 'Target user is required';
    if (!formData.Application) newErrors.Application = 'Application type is required';
    if (!formData.System) newErrors.System = 'System is required';
    if (!formData.ClientID) newErrors.ClientID = 'Client ID is required';
    if (!formData.Justification) newErrors.Justification = 'Justification is required';
    if (!formData.DepartmentHead && !extractSingleUserEmail(selectedDeptHead)) newErrors.DepartmentHead = 'Department head is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form with proper data patching
  const handleSubmit = async () => {
    // Validate before submission
    if (!validateForm()) {
      toast.error('Please fill in all required fields before submitting.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate ticket ID using shared utility
      const ticketId = generateTicketId('EAF');

      // Get approver information
      const approver = getApproverInfo();

      // Get target user info from People Picker
      const targetUserEmail = extractSingleUserEmail(selectedTargetUser);
      const targetUserDisplayName = extractSingleUserDisplayName(selectedTargetUser);

      // Build requestor information
      const requestorEmail = user?.email || user?.email || '';
      const requestorName = user?.fullName || formData.Requestor || '';

      // Create record in SharePoint MainDB_IT - PARENT TABLE
      // Status: Pending HOD — triggers HOD approval workflow
      const submissionData: Omit<MainDBIT, 'id'> = {
        title: ticketId,
        formcode: 'EAF',
        company: formData.Company || '',
        currentStatus: 'pending-hod',
        workflowstage: 2,
        islocked: false,
        submitteddate: new Date().toISOString(),
        requestoremail: requestorEmail,
        siteKey: mapLocationToSiteKey(formData.Site),
        // NOTE: Justification is stored on Ext_Access child, not on parent Remarks
        // to avoid dual-write drift between MainDB_IT.Remarks and Ext_Access.EAF_Justification
      };

      // Use retryWithBackoff for transient errors
      const createdDraft = await retryWithBackoff(
        () => createMainDBIT.mutateAsync(submissionData),
        handleRetryNotification
      );

      const parentId = createdDraft.id;
      let childCreated = false;

      try {
        // Create child record in MainDB_IT_Ext_Access - CHILD TABLE
        const extAccessData: Omit<MainDBITExtAccess, 'id'> = {
          title: `Access Details for ${ticketId}`,

          // Parent relationship
          parentFormCode: 'EAF',
          parentRecord: {
            id: parentId,
            title: createdDraft.title,
          },

          // EAF specific fields
          eAFClientID: formData.ClientID || '',
          eAFUserGroup: formData.Group || '',
          eAFHigherApproverEmail: extractSingleUserEmail(selectedHigherApprover) || formData.HigherApprover || '',
          eAFApplication: formData.Application || '',
          eAFTargetUserEmail: targetUserEmail,
          eAFSystemName: formData.System || '',       // Domino 'system' field
          eAFJustification: formData.Justification || '',
          eAFReminderTo: extractUserEmail(selectedCCRecipients),
          eAFCC: extractUserEmail(selectedCCRecipients),
          eAFDeptHeadEmail: approver.email,
          eAFIsPCN: isPancenCompany ? '1' : '0',      // Domino 'isPCN' computed field
        };

        await retryWithBackoff(
          () => MainDBITExtAccessService.create(extAccessData),
          handleRetryNotification
        );
        childCreated = true;
      } catch (childError) {
        // Rollback: parent record was created but child failed — delete parent
        console.error('[EAF] Child record creation failed, rolling back parent:', parentId);
        try {
          await MainDBITService.delete(String(parentId));
        } catch (deleteError) {
          console.error('[EAF] Failed to delete parent record during rollback:', deleteError);
        }
        throw childError; // Re-throw for outer catch to show error message
      }

        // Send email notifications
        try {
          if (approver.email) {
            await sendApprovalEmail.mutateAsync({
              ticketId,
              formType: 'EAF',
              formTitle: 'External Access Form (VPN/Citrix)',
              requestorName,
              requestorEmail,
              approverEmail: approver.email,
              approverName: approver.name,
              justification: formData.Justification,
              additionalDetails: {
                'Description': `External access request for ${targetUserDisplayName || targetUserEmail || 'target user'}`,
                'Company': formData.Company,
                'Target User': targetUserDisplayName,
                'Target User Email': targetUserEmail,
                'Application Name': formData.Application,
                'System': formData.System,
                'Client ID': formData.ClientID,
                'Business Justification': formData.Justification,
                'Approver': approver.name || approver.email,
                'Approver Email': approver.email,
                'Higher Approver': extractSingleUserEmail(selectedHigherApprover) || formData.HigherApprover || '-',
                ...(isPancenCompany ? { 'Route': 'PCN IT Team (PanCen)' } : { 'Route': 'ACM IT Team' }),
              },
              cc: extractUserEmail(selectedCCRecipients),
            });
          }
          if (requestorEmail) {
            await sendConfirmationEmail.mutateAsync({
              ticketId,
              formType: 'EAF',
              formTitle: 'External Access Form (VPN/Citrix)',
              requestorEmail,
              requestorName,
              approverName: approver.name || 'Department Head',
            });
          }
          setNotificationSent(true);
        } catch (emailError) {
          console.error('Email notification error:', emailError);
        }

        // Set submission result for shared success screen
        setSubmissionResult({
          id: createdDraft.id,
          ticketId,
          title: `EAF - ${formData.Application}`,
          formcode: 'EAF',
          currentStatus: 'Submitted',
          priority: 'Normal',
          submittedDate: new Date().toISOString(),
          requestorEmail,
        });

        setSubmittedTicketId(ticketId);
        setIsSubmitting(false);
        return; // Success

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Submission error:', errorMessage);

        // Check if this is a data model lock error
        const isDataModelLockError = errorMessage.includes('data model configuration is currently being updated');

        // Check if parent record was created but child failed
        if (errorMessage.includes('MainDBITExtAccess')) {
          toast.error('Failed to save access details. Please try again or contact support.');
        } else if (isDataModelLockError) {
          toast.error('The system is currently updating. Please wait 30 seconds and try again, or refresh the page.');
        } else {
          toast.error('Failed to submit request: ' + errorMessage);
        }

        setIsSubmitting(false);
      }
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <FormSubmissionLayout
      formConfig={FORM_CONFIG}
      steps={FORM_STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      formData={formData as unknown as Record<string, unknown>}
      onFieldChange={(field, value) => updateField(field as keyof EAFFormInput, value as EAFFormInput[keyof EAFFormInput])}
      fields={[]}
      isSubmitting={isSubmitting}
      selectedCategory={formData.Application}
      onSubmit={handleSubmit}
      submissionResult={submissionResult}
      notificationSent={notificationSent}
    >
      {/* Step 0: Requestor Information */}
      {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <UserIcon className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold text-foreground">
                      Requestor Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Site Selection */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Site <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Select
                        value={formData.Site}
                        onValueChange={(value: string) => updateField('Site', value)}
                      >
                        <SelectTrigger
                          className="mt-2"
                          style={{
                            height: '44px',
                            borderRadius: '8px',
                            backgroundColor: '#E8E8E8',
                            borderColor: errors.Site ? '#9B2F23' : '#D0D0D0',
                          }}
                        >
                          <SelectValue placeholder="Select site..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MY-PR">Penang / Prai (MY-PR)</SelectItem>
                          <SelectItem value="MY-JH">Johor (MY-JH)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.Site && (
                        <p className="text-xs mt-1 flex items-center gap-1 text-destructive" role="alert">
                          <AlertCircle className="w-3 h-3" />
                          {errors.Site}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Company <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Select
                        value={formData.Company}
                        onValueChange={(value: string) => updateField('Company', value)}
                      >
                        <SelectTrigger
                          className="mt-2"
                          style={{
                            height: '44px',
                            borderRadius: '8px',
                            backgroundColor: '#E8E8E8',
                            borderColor: errors.Company ? '#9B2F23' : '#D0D0D0',
                          }}
                        >
                          <SelectValue placeholder="Select company..." />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCompanies ? (
                            <SelectItem value="loading" disabled>Loading companies...</SelectItem>
                          ) : (
                            companies.map((company: { code: string; name: string }) => (
                              <SelectItem key={company.code} value={company.name}>
                                {company.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.Company && (
                        <p className="text-xs mt-1 flex items-center gap-1 text-destructive" role="alert">
                          <AlertCircle className="w-3 h-3" />
                          {errors.Company}
                        </p>
                      )}
                    </div>

                    {/* Requestor Name */}
                                    <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Requestor Name <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Input
                            value={formData.Requestor}
                            onChange={(e) => updateField('Requestor', e.target.value)}
                            placeholder="Your full name"
                            className="mt-2"
                            style={{
                              height: '44px',
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                              borderColor: errors.Requestor ? '#9B2F23' : '#D0D0D0',
                            }}
                          />
                          <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                            Pre-filled from your Microsoft 365 profile. Edit if needed.
                          </p>
                          {errors.Requestor && (
                            <p className="text-xs mt-1 flex items-center gap-1 text-destructive" role="alert">
                              <AlertCircle className="w-3 h-3" />
                              {errors.Requestor}
                            </p>
                          )}
                        </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Access Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold text-foreground">
                      Access Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Target User - M365 People Picker */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Target User <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Search and select the user who will be granted access
                      </p>
                      <PeoplePicker
                        value={selectedTargetUser as PersonValue | null}
                        onChange={(users: PersonValue | PersonValue[] | null) => {
                          setSelectedTargetUser(users);
                          // Update form data with selected user's email
                          const email = extractSingleUserEmail(users);
                          updateField('TargetUser', email);
                        }}
                        multiple={false}
                        placeholder="Search for target user..."
                        helperText="Search for internal IOI employees"
                        className={errors.TargetUser ? '[&_button]:border-[#9B2F23]' : ''}
                      />
                      {errors.TargetUser && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#9B2F23' }}>
                          <AlertCircle className="w-3 h-3" />
                          {errors.TargetUser}
                        </p>
                      )}
                    </div>

                    {/* Manual User ID (optional) */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        User ID (manual entry)
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        If the target user cannot be found via search, enter the user ID or email here.
                      </p>
                      <Input
                        value={(formData as unknown as Record<string, string>).TargetUserId || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('TargetUserId' as keyof EAFFormInput, e.target.value as EAFFormInput[keyof EAFFormInput])}
                        placeholder="e.g., j.smith or j.smith@ioi.com"
                        className="mt-2"
                        style={{
                          height: '44px',
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                          borderColor: '#D0D0D0',
                        }}
                      />
                    </div>

                    {/* System - Domino 'system' field (radiobutton) */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        System <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Select the system or platform requiring access
                      </p>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {EAF_SYSTEMS.map((sys: string) => (
                          <button
                            key={sys}
                            type="button"
                            onClick={() => updateField('System', sys)}
                            aria-pressed={formData.System === sys}
                            className={cn(
                              'p-3 rounded-lg border-2 transition-all duration-200 text-left',
                              formData.System === sys
                                ? 'bg-primary/10 border-primary'
                                : 'bg-[#FAFAFA] border-border hover:border-primary'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4" style={{ color: '#003366' }} />
                              <span
                                className="font-medium text-sm"
                                style={{ color: formData.System === sys ? '#003366' : '#1C1C1C' }}
                              >
                                {sys}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.System && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#9B2F23' }}>
                          <AlertCircle className="w-3 h-3" />
                          {errors.System}
                        </p>
                      )}
                    </div>

                    {/* Application Type */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Application Type <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {EAF_APPLICATIONS.map((app: EAFApplication) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => updateField('Application', app)}
                            aria-pressed={formData.Application === app}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                              formData.Application === app
                                ? 'bg-primary/10 border-primary'
                                : 'bg-[#FAFAFA] border-border hover:border-primary'
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {app === 'VPN' && <Lock className="w-4 h-4" style={{ color: '#003366' }} />}
                              {app === 'Citrix' && <Monitor className="w-4 h-4" style={{ color: '#003366' }} />}
                              {app === 'Other' && <Globe className="w-4 h-4" style={{ color: '#003366' }} />}
                              <span
                                className="font-semibold text-sm"
                                style={{ color: formData.Application === app ? '#003366' : '#1C1C1C' }}
                              >
                                {app}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: '#5C5C5C' }}>
                              {app === 'VPN' && 'Secure remote network access'}
                              {app === 'Citrix' && 'Virtual desktop environment'}
                              {app === 'Other' && 'Other access type'}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Client ID — Domino 'ClientID' field */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Client ID <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Client identifier from Domino 'ClientID' field
                      </p>
                      <Input
                        value={formData.ClientID || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ClientID', e.target.value)}
                        placeholder="e.g., CLT-001234"
                        className="mt-2"
                        style={{
                          height: '44px',
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                          borderColor: errors.ClientID ? '#9B2F23' : '#D0D0D0',
                        }}
                      />
                      {errors.ClientID && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#9B2F23' }}>
                          <AlertCircle className="w-3 h-3" />
                          {errors.ClientID}
                        </p>
                      )}
                    </div>

                    {/* User Group — Domino 'Group' field */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        User Group
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        User group for access assignment (from Domino 'Group' field)
                      </p>
                      <Input
                        value={formData.Group || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Group', e.target.value)}
                        placeholder="e.g., VPN-Users, Citrix-Admins"
                        className="mt-2"
                        style={{
                          height: '44px',
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                          borderColor: '#D0D0D0',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Justification */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold text-foreground">
                      Business Justification
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Justification */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Business Justification <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Explain why this access is required
                      </p>
                      <Textarea
                        value={formData.Justification}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('Justification', e.target.value)}
                        placeholder="Enter business justification for this access request..."
                        rows={4}
                        style={{
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                          borderColor: errors.Justification ? '#9B2F23' : '#D0D0D0',
                        }}
                      />
                      {errors.Justification && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#9B2F23' }}>
                          <AlertCircle className="w-3 h-3" />
                          {errors.Justification}
                        </p>
                      )}
                    </div>

                    {/* Department Head - M365 People Picker */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Department Head (Approver) <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Select the department head who will approve this request
                      </p>
                      <PeoplePicker
                        value={selectedDeptHead as PersonValue | null}
                        onChange={(users: PersonValue | PersonValue[] | null) => {
                          setSelectedDeptHead(users);
                          // Update form data with selected user's email
                          const email = extractSingleUserEmail(users);
                          updateField('DepartmentHead', email);
                        }}
                        multiple={false}
                        placeholder="Search for department head..."
                        helperText="Search for internal IOI employees"
                        className={errors.DepartmentHead ? '[&_button]:border-[#9B2F23]' : ''}
                      />
                      {errors.DepartmentHead && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#9B2F23' }}>
                          <AlertCircle className="w-3 h-3" />
                          {errors.DepartmentHead}
                        </p>
                      )}
                    </div>

                    {/* Higher Approver - M365 People Picker */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Higher Approver <span className="font-normal" style={{ color: '#5C5C5C' }}>(optional)</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Select the COO or Division Director when required
                      </p>
                      <PeoplePicker
                        value={selectedHigherApprover as PersonValue | null}
                        onChange={(users: PersonValue | PersonValue[] | null) => {
                          setSelectedHigherApprover(users);
                          const email = extractSingleUserEmail(users);
                          updateField('HigherApprover', email);
                        }}
                        multiple={false}
                        placeholder="Search for higher approver..."
                        helperText="Search for internal IOI employees"
                      />
                    </div>

                    {/* CC Recipients - M365 People Picker (Multiple) */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        CC Recipients <span className="font-normal" style={{ color: '#5C5C5C' }}>(optional)</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Add people who should receive notifications about this request
                      </p>
                      <PeoplePicker
                        value={selectedCCRecipients as PersonValue | PersonValue[] | null}
                        onChange={(users: PersonValue | PersonValue[] | null) => {
                          setSelectedCCRecipients(users);
                          // Store as semicolon-separated emails for the form data
                          const emails = extractUserEmail(users);
                          updateField('CCRecipients', emails);
                        }}
                        multiple={true}
                        placeholder="Search for people to CC..."
                        helperText="Search for internal IOI employees"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Check className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold text-foreground">
                      Review & Submit
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Request Summary */}
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}
                    >
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#1C1C1C' }}>
                        Request Summary
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Company</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Company}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Requestor</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Requestor}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Target User</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>
                            {extractSingleUserDisplayName(selectedTargetUser) || (formData as unknown as Record<string, string>).TargetUserId || 'Not selected'}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Description</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>
                            External access request for {extractSingleUserDisplayName(selectedTargetUser) || extractSingleUserEmail(selectedTargetUser) || 'target user'}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Application Name</p>
                          <Badge
                            variant="outline"
                            style={{
                              backgroundColor: 'rgba(0, 51, 102, 0.1)',
                              color: '#003366',
                              borderColor: '#003366',
                            }}
                          >
                            {formData.Application}
                          </Badge>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>System</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.System || '-'}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Client ID</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.ClientID || '-'}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Approver</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{getApproverInfo().name || getApproverInfo().email || '-'}</p>
                        </div>
                        {isPancenCompany && (
                          <div className="col-span-2">
                            <Badge
                              variant="outline"
                              style={{
                                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                color: '#4f46e5',
                                borderColor: '#4f46e5',
                              }}
                            >
                              PanCen Company — routes to PCN IT Team
                            </Badge>
                          </div>
                        )}
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Business Justification</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Justification}</p>
                        </div>
                      </div>
                    </div>

                    {/* Approval Workflow Preview */}
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', border: '1px solid #003366' }}
                    >
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#003366' }}>
                        Approval Workflow
                      </h3>

                      <div className="space-y-2">
                        {EAF_STAGES.map((stage, index) => (
                          <div key={stage.id} className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                              style={{
                                backgroundColor: index === 0 ? '#166534' : '#D0D0D0',
                                color: index === 0 ? '#FFFFFF' : '#5C5C5C',
                              }}
                            >
                              {index === 0 ? <Check className="w-3 h-3" /> : index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: '#003366' }}>
                                {stage.label}
                              </p>
                              {index === 1 && getApproverInfo().name && (
                                <p className="text-xs" style={{ color: '#5C5C5C' }}>
                                  {getApproverInfo().name}
                                </p>
                              )}
                            </div>
                            {index === 0 && (
                              <Badge style={{ backgroundColor: '#166534', color: '#FFFFFF' }}>
                                Current
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Confirmation Notice */}
                    <div
                      className="p-4 rounded-lg border-l-4 flex items-start gap-3"
                      style={{
                        backgroundColor: 'rgba(123, 62, 0, 0.08)',
                        borderLeftColor: '#7B3E00',
                      }}
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7B3E00' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#7B3E00' }}>
                          Please review before submitting
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                          Once submitted, this request will be routed to {getApproverInfo().name || 'the approver'} for approval.
                          You will receive email notifications for each approval stage.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
    </FormSubmissionLayout>
  );
}
