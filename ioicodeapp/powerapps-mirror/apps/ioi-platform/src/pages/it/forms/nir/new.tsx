/**
 * NIR - Notes ID Request Form (New)
 *
 * Module: M1 - User & Access Management
 * Site: PRAI (MainDB_IT)
 *
 * 4-Stage Workflow:
 * S1 Request Submission -> S2 HOD Approval -> S3 Notes Admin -> S4 IT Hardware -> Closed
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  RefreshCw,
  User as UserIcon,
  Building2,
  Phone,
  FileText,
  Send,
  Loader2,
  CheckCircle,
  Copy,
  AlertCircle,
  Trash2,
  Edit3,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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

import { UserPicker, type SelectedPerson } from '@/components/user-picker';
import type { NIRFormInput } from '@/types/m1-forms';

import { useSharePointCompanies, useSharePointDepartments } from '@/hooks/use-sharepoint-config';
import { NIR_EMAIL_TYPES, NIR_EMPLOYEE_TYPES } from '@/config/form-dropdown-config';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtAccess } from '@/generated/hooks/use-main-dbitext-access';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { retryWithBackoff, mapLocationToSiteKey, type FormSubmissionResult } from '@/lib/form-submission-utils';
import { IOI_COMPANY_OPTIONS } from '@/lib/it-forms-config';
const FORM_STEPS = [
  { id: 1, label: 'Email Type', description: 'Select request type' },
  { id: 2, label: 'Employee Details', description: 'Enter employee information' },
  { id: 3, label: 'Approver', description: 'Select approver' },
  { id: 4, label: 'Review & Submit', description: 'Confirm and submit' },
];

// Selected HOD user state (from M365)
interface SelectedHODUser {
  id: string;
  displayName: string;
  email: string;
}

export default function NIRNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const createExtAccess = useCreateMainDBITExtAccess();
  const { companies } = useSharePointCompanies();
  const { departments } = useSharePointDepartments();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [, setSubmissionResult] = useState<FormSubmissionResult | null>(null);

  // Form data
  const [formData, setFormData] = useState<Partial<NIRFormInput & { EmployeeType?: string }>>({
    EmailType: undefined,
    Company: undefined,
    Site: 'MY-PR',
    FullName: user?.fullName || '',
    EmployeeNumber: '',
    Department: '',
    HODApprover: '',
    ExistingEmailAddress: '',
    Designation: '',
    PhoneExtension: '',
    Remarks: '',
    EmployeeType: undefined,
  });

  // Update FullName when user data loads asynchronously
  useEffect(() => {
    if (user?.fullName && !formData.FullName) {
      setFormData(prev => ({ ...prev, FullName: user?.fullName || '' }));
    }
  }, [user]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedHODUser, setSelectedHODUser] = useState<SelectedHODUser | null>(null);

  // Update form field
  const updateField = <K extends keyof NIRFormInput>(field: K, value: NIRFormInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Navigate steps (no validation blocking - user can proceed with partial data)
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit form - always works with whatever data is provided
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate ticket ID
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const seq = String(Math.floor(Math.random() * 900) + 100);
      const ts = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      const newTicketId = `NIR-${year}${month}-${ts}-${seq}`;

      // Create record in SharePoint MainDB_IT
      // Use Omit<MainDBIT, 'id'> to satisfy the type requirement
      const selectedSite = formData.Site || 'MY-PR';
      const submissionData: Omit<MainDBIT, 'id'> = {
        title: newTicketId,
        formcode: 'NIR',
        currentStatus: 'CurrentstatusKey30',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: now.toISOString(),
        siteKey: mapLocationToSiteKey(selectedSite),
        remarks: JSON.stringify({ nirCA: 'Submitted' }),
        workflowstage: 2,
        company: formData.Company || '',
        nIRFullName: formData.FullName || '',
        nIRDepartment: formData.Department || '',
        nIRRequestType: formData.EmailType || '',
        nIRHODApprovedBy: selectedHODUser?.email || formData.HODApprover || '',
        nIREmployeeNumber: formData.EmployeeNumber || '',
        nIRDesignation: formData.Designation || '',
        nIRPhoneExtension: formData.PhoneExtension || '',
        nIRExistingEmailAddress: formData.ExistingEmailAddress || '',
        nIREmployeeType: formData.EmployeeType || '',
      };

      const createdRecord = await retryWithBackoff(
        () => createMainDBIT.mutateAsync(submissionData)
      );

      // Also create ExtAccess record for extended NIR fields
      if (createdRecord?.id) {
        const extAccessData: Omit<MainDBITExtAccess, 'id'> = {
          title: `${newTicketId}-ext`,
          parentFormCode: 'NIR',
          parentRecord: { id: createdRecord.id, title: newTicketId },
          parentSite: selectedSite === 'MY-JH' ? 'JOHOR' : 'PRAI',
          nIRRequestType: formData.EmailType || '',
          nIRRemark: formData.Remarks || '',
        };
        await retryWithBackoff(
          () => createExtAccess.mutateAsync(extAccessData)
        );
      }

      // Set submission result for shared success screen
      setSubmissionResult({
        id: createdRecord?.id || 0,
        ticketId: newTicketId,
        title: `NIR - ${formData.FullName}`,
        formcode: 'NIR',
        currentStatus: 'Request',
        submittedDate: now.toISOString(),
        requestorEmail: user?.userPrincipalName || '',
      });
      /* Email notification sent via Power Automate flow */

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('Notes ID Request submitted to SharePoint successfully!');

    } catch (error) {
      toast.error('Failed to submit to SharePoint. Please try again.');
      console.error('SharePoint submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy ticket ID
  const copyTicketId = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      toast.success('Ticket ID copied!');
    }
  };

  // Get step status
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  // Render success confirmation
  if (isSubmitted && ticketId) {
    return (
      <div className="min-h-screen bg-muted p-6" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div className="mx-auto max-w-[800px]">
          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="rounded-xl bg-white p-8 shadow-lg"
          >
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#003366/10]">
                <CheckCircle className="h-10 w-10 text-[#166534]" />
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                Request Submitted Successfully!
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                Your Notes ID request has been submitted and is pending ISG HOD approval.
              </p>
            </div>

            {/* Ticket ID Box */}
            <div className="mb-6 rounded-lg border-2 border-[#003366] bg-[#003366/10] p-4">
              <div className="mb-2 text-center font-['Segoe_UI'] text-[13px] font-semibold text-[#003366]">
                TICKET NUMBER
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-['Segoe_UI'] text-[24px] font-bold text-[#003366]">
                  {ticketId}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={copyTicketId}
                  className="text-[#003366] hover:bg-primary/10"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Request Summary */}
            <div className="mb-6 rounded-lg bg-[#FAFAFA] p-4">
              <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Request Summary
              </h3>
              <div className="grid gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Email Type:</span>
                  <span className="font-medium text-foreground">{formData.EmailType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Employee:</span>
                  <span className="font-medium text-foreground">{formData.FullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Employee No:</span>
                  <span className="font-medium text-foreground">{formData.EmployeeNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Department:</span>
                  <span className="font-medium text-foreground">{formData.Department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">HOD Approver:</span>
                  <span className="font-medium text-foreground">
                    {selectedHODUser?.displayName || formData.HODApprover || 'Not selected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Workflow Status */}
            <div className="mb-6 rounded-lg border-l-4 border-[#1752A8] bg-[#EAF0FB] p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#1752A8]" />
                <span className="font-['Segoe_UI'] text-[13px] font-semibold text-[#1752A8]">
                  Next Step: ISG HOD Approval
                </span>
              </div>
              <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#1752A8]/80">
                An email notification has been sent to your HOD for approval.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/it/access')}
              >
                Back to Access Management
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-[#002244]"
                onClick={() => {
                  setIsSubmitted(false);
                  setTicketId(null);
                  setCurrentStep(1);
                  setFormData({
                    EmailType: undefined,
                    Company: undefined,
                    FullName: '',
                    EmployeeNumber: '',
                    Department: '',
                    HODApprover: '',
                  });
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-6" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="mx-auto max-w-[800px]">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/it/access')}
            className="mb-4 text-[#5C5C5C] hover:text-[#003366]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Access Management
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003366/10]">
              <Mail className="h-6 w-6 text-[#003366]" />
            </div>
            <div>
              <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                Notes ID Request
              </h1>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Request new or replacement Notes/Email ID
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {FORM_STEPS.map((step, index) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-['Segoe_UI'] text-[14px] font-semibold transition-all duration-200 ${
                          status === 'completed'
                            ? 'bg-[#166534] text-white'
                            : status === 'active'
                              ? 'bg-primary text-white'
                              : 'bg-[#E0E0E0] text-[#5C5C5C]'
                        }`}
                      >
                        {status === 'completed' ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <span
                        className={`mt-2 font-['Segoe_UI'] text-[13px] font-semibold ${
                          status === 'pending' ? 'text-[#5C5C5C]' : 'text-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector Line */}
                    {index < FORM_STEPS.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 ${
                          status === 'completed' ? 'bg-[#166534]' : 'bg-[#D0D0D0]'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Email Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      What type of email request is this?
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Select whether you need a new Notes/Email ID, replacement, rename, or deletion.
                    </p>
                  </div>

                  {/* Email Type Selection - Updated with 4 options */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {NIR_EMAIL_TYPES.map((typeObj) => {
                      const IconComponent =
                        typeObj.code === 'NEW' ? Mail :
                        typeObj.code === 'REPLACEMENT' ? RefreshCw :
                        typeObj.code === 'RENAME' ? Edit3 : Trash2;
                      const description =
                        typeObj.code === 'NEW' ? 'Create a new Notes/Email ID' :
                        typeObj.code === 'REPLACEMENT' ? 'Replace an existing Notes/Email ID' :
                        typeObj.code === 'RENAME' ? 'Change the name on existing email' :
                        'Remove an existing Notes/Email ID';
                      return (
                        <button
                          key={typeObj.code}
                          type="button"
                          onClick={() => updateField('EmailType', typeObj.name as NIRFormInput['EmailType'])}
                          className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                            formData.EmailType === typeObj.name
                              ? 'border-[#003366] bg-[#003366/10] shadow-lg'
                              : 'border-border bg-[#FAFAFA] hover:border-[#003366] hover:bg-[#F0F0F0]'
                          }`}
                        >
                          {formData.EmailType === typeObj.name && (
                            <div className="absolute right-3 top-3">
                              <Check className="h-5 w-5 text-[#003366]" />
                            </div>
                          )}
                          <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${
                            formData.EmailType === typeObj.name ? 'bg-primary' : 'bg-[#E0E0E0]'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${formData.EmailType === typeObj.name ? 'text-white' : 'text-[#5C5C5C]'}`} />
                          </div>
                          <div className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                            {typeObj.name}
                          </div>
                          <div className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                            {description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.EmailType && (
                    <p className="font-['Segoe_UI'] text-[13px] text-[#9B2F23]">{errors.EmailType}</p>
                  )}

                  {/* Employee Type Selection - NEW FIELD */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      <Briefcase className="mr-2 inline h-4 w-4" />
                      Employee Type <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {NIR_EMPLOYEE_TYPES.map((empType) => (
                        <button
                          key={empType.code}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, EmployeeType: empType.code }))}
                          className={`rounded-lg border-2 p-3 text-center transition-all duration-200 ${
                            formData.EmployeeType === empType.code
                              ? 'border-[#003366] bg-[#003366/10]'
                              : 'border-border bg-[#FAFAFA] hover:border-[#003366]'
                          }`}
                        >
                          <span className={`font-['Segoe_UI'] text-[14px] font-medium ${
                            formData.EmployeeType === empType.code ? 'text-[#003366]' : 'text-foreground'
                          }`}>
                            {empType.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Site Selection */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Site <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Select
                      value={formData.Site || 'MY-PR'}
                      onValueChange={(value: string) => updateField('Site', value)}
                    >
                      <SelectTrigger className="mt-2 h-11 bg-[#E8E8E8] border-border">
                        <SelectValue placeholder="Select site..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MY-PR">Penang / Prai (MY-PR)</SelectItem>
                        <SelectItem value="MY-JH">Johor (MY-JH)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company Selection */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Company <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Select
                      value={formData.Company || ''}
                      onValueChange={(value: string) => updateField('Company', value as NIRFormInput['Company'])}
                    >
                      <SelectTrigger
                        className={`mt-2 h-11 bg-[#E8E8E8] border-border ${
                          errors.Company ? 'border-[#9B2F23]' : ''
                        }`}
                      >
                        <SelectValue placeholder="Select company..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(companies.length > 0 ? companies : IOI_COMPANY_OPTIONS).map((company) => (
                          <SelectItem key={company.code ?? company.value} value={company.name ?? company.label}>
                            {company.name ?? company.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.Company && (
                      <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#9B2F23]">{errors.Company}</p>
                    )}
                  </div>

                  {/* Existing Email (Conditional - shown for Replacement, Rename, Delete) */}
                  {(formData.EmailType === 'Replacement' || formData.EmailType === 'Rename' || formData.EmailType === 'Delete') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        Existing Email Address <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Input
                        type="email"
                        value={formData.ExistingEmailAddress || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ExistingEmailAddress', e.target.value)}
                        placeholder="existing.user@ioi.com.my"
                        className={`mt-2 h-11 bg-[#E8E8E8] border-border ${
                          errors.ExistingEmailAddress ? 'border-[#9B2F23]' : ''
                        }`}
                      />
                      {errors.ExistingEmailAddress && (
                        <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#9B2F23]">
                          {errors.ExistingEmailAddress}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Employee Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Employee Information
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Enter the details of the employee who will use this Notes/Email ID.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      <UserIcon className="mr-2 inline h-4 w-4" />
                      Full Name <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.FullName || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('FullName', e.target.value)}
                      placeholder="Enter full name as per IC"
                      className={`mt-2 h-11 bg-[#E8E8E8] border-border ${
                        errors.FullName ? 'border-[#9B2F23]' : ''
                      }`}
                    />
                    {errors.FullName && (
                      <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#9B2F23]">{errors.FullName}</p>
                    )}
                  </div>

                  {/* Employee Number */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Employee Number <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.EmployeeNumber || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('EmployeeNumber', e.target.value)}
                      placeholder="e.g., EMP00001"
                      className={`mt-2 h-11 bg-[#E8E8E8] border-border ${
                        errors.EmployeeNumber ? 'border-[#9B2F23]' : ''
                      }`}
                    />
                    {errors.EmployeeNumber && (
                      <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#9B2F23]">{errors.EmployeeNumber}</p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      <Building2 className="mr-2 inline h-4 w-4" />
                      Department <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Select
                      value={formData.Department || ''}
                      onValueChange={(value) => updateField('Department', value)}
                    >
                      <SelectTrigger
                        className={`mt-2 h-11 bg-[#E8E8E8] border-border ${
                          errors.Department ? 'border-[#9B2F23]' : ''
                        }`}
                      >
                        <SelectValue placeholder="Select department..." />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.code} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.Department && (
                      <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#9B2F23]">{errors.Department}</p>
                    )}
                  </div>

                  {/* Designation (Optional) */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Designation / Job Title
                    </Label>
                    <Input
                      type="text"
                      value={formData.Designation || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Designation', e.target.value)}
                      placeholder="e.g., Senior Executive"
                      className="mt-2 h-11 bg-[#E8E8E8] border-border"
                    />
                  </div>

                  {/* Phone Extension (Optional) */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      <Phone className="mr-2 inline h-4 w-4" />
                      Phone Extension
                    </Label>
                    <Input
                      type="text"
                      value={formData.PhoneExtension || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('PhoneExtension', e.target.value)}
                      placeholder="e.g., 1234"
                      className="mt-2 h-11 bg-[#E8E8E8] border-border"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Approver Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Select HOD Approver
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Select the Head of Department who will approve this request.
                    </p>
                  </div>

                  {/* HOD Approver Selection - M365 User Picker */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      HOD Approver <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <div className="mt-2">
                      <UserPicker
                        value={formData.HODApprover || ''}
                        onChange={(userId: string, person: SelectedPerson | null) => {
                          updateField('HODApprover', userId);
                          if (person) {
                            setSelectedHODUser({
                              id: person.id,
                              displayName: person.displayName,
                              email: person.email || userId,
                            });
                          } else {
                            setSelectedHODUser(null);
                          }
                        }}
                        placeholder="Search for HOD approver..."
                        className={errors.HODApprover ? '[&_button]:border-[#9B2F23]' : ''}
                      />
                    </div>
                    {errors.HODApprover && (
                      <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#9B2F23]">{errors.HODApprover}</p>
                    )}
                  </div>

                  {/* Selected HOD Info */}
                  {selectedHODUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-[#003366/10] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                            {selectedHODUser.displayName}
                          </div>
                          <div className="font-['Segoe_UI'] text-[13px] text-[#003366]">
                            {selectedHODUser.email}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Remarks (Optional) */}
                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      <FileText className="mr-2 inline h-4 w-4" />
                      Additional Remarks
                    </Label>
                    <Textarea
                      value={formData.Remarks || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('Remarks', e.target.value)}
                      placeholder="Any additional information for the approver..."
                      className="mt-2 min-h-[100px] bg-[#E8E8E8] border-border"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Review Your Request
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Please review the information below before submitting.
                    </p>
                  </div>

                  {/* Summary Sections */}
                  <div className="space-y-4">
                    {/* Request Type */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Request Type
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Email Type:</span>
                          <span className="font-medium text-foreground">{formData.EmailType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Company:</span>
                          <span className="font-medium text-foreground">{formData.Company}</span>
                        </div>
                        {formData.ExistingEmailAddress && (
                          <div className="flex justify-between">
                            <span className="text-[#5C5C5C]">Existing Email:</span>
                            <span className="font-medium text-foreground">{formData.ExistingEmailAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Employee Details */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Employee Details
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Full Name:</span>
                          <span className="font-medium text-foreground">{formData.FullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Employee No:</span>
                          <span className="font-medium text-foreground">{formData.EmployeeNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Department:</span>
                          <span className="font-medium text-foreground">{formData.Department}</span>
                        </div>
                        {formData.Designation && (
                          <div className="flex justify-between">
                            <span className="text-[#5C5C5C]">Designation:</span>
                            <span className="font-medium text-foreground">{formData.Designation}</span>
                          </div>
                        )}
                        {formData.PhoneExtension && (
                          <div className="flex justify-between">
                            <span className="text-[#5C5C5C]">Phone Ext:</span>
                            <span className="font-medium text-foreground">{formData.PhoneExtension}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Approval */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Approval
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">HOD Approver:</span>
                          <span className="font-medium text-foreground">
                            {selectedHODUser?.displayName || 'Not selected'}
                          </span>
                        </div>
                        {selectedHODUser?.email && (
                          <div className="flex justify-between">
                            <span className="text-[#5C5C5C]">HOD Email:</span>
                            <span className="font-medium text-foreground">{selectedHODUser.email}</span>
                          </div>
                        )}
                        {formData.Remarks && (
                          <div>
                            <span className="text-[#5C5C5C]">Remarks:</span>
                            <p className="mt-1 font-medium text-foreground">{formData.Remarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Workflow Preview */}
                  <div className="rounded-lg bg-[#FAFAFA] p-4">
                    <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Workflow Preview
                    </h3>
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="rounded-full bg-primary px-2 py-1 text-white">Submit</span>
                      <ArrowRight className="h-4 w-4 text-[#5C5C5C]" />
                      <span className="rounded-full bg-[#FFFDE7] px-2 py-1 text-[#5A4A00]">HOD Approval</span>
                      <ArrowRight className="h-4 w-4 text-[#5C5C5C]" />
                      <span className="rounded-full bg-[#E0E0E0] px-2 py-1 text-[#5C5C5C]">Notes Admin</span>
                      <ArrowRight className="h-4 w-4 text-[#5C5C5C]" />
                      <span className="rounded-full bg-[#E0E0E0] px-2 py-1 text-[#5C5C5C]">IT Hardware</span>
                    </div>
                  </div>

                  {/* Submit Notice */}
                  <div className="rounded-lg border-l-4 border-[#1752A8] bg-[#EAF0FB] p-4">
                    <p className="font-['Segoe_UI'] text-[13px] text-[#1752A8]">
                      By submitting this request, you confirm that all information provided is accurate.
                      An email notification will be sent to the selected HOD for approval.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className="h-11 px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Step {currentStep - 1}
            </Button>

            {currentStep < FORM_STEPS.length ? (
              <Button
                onClick={goToNextStep}
                className="h-11 bg-primary px-6 hover:bg-[#002244]"
              >
                Continue to Step {currentStep + 1}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-11 bg-primary px-6 hover:bg-[#002244]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
