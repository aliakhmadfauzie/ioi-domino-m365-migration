/**
 * HWRR - Hardware Request Form
 * M3 - Hardware & Infrastructure
 * 
 * 6-Stage Workflow:
 * S1 Submission -> S2 HOD Approval -> S3 IT Review -> S4 Procurement -> S5 IT Setup -> S6 Handover
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Send,
  HardDrive,
  User as UserIcon,
  FileText,
  AlertCircle,
  Loader2,
  Package,
  Settings,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtAssets } from '@/generated/hooks/use-main-dbitext-assets';
import {
  EmployeePicker,
  MultiEmployeePicker,
  type ManualPerson,
  type SelectedEmployee,
} from '@/components/employee-picker';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';
import {
  SITES,
  REQUEST_TYPES,
  HARDWARE_TYPES,
  REPLACEMENT_REASONS,
  UPGRADE_REASONS,
  DISPOSAL_REASONS,
  PRIORITY_OPTIONS,
  FORM_STEPS,
  HWRRFormInput,
  buildHWRRMainDBITSubmission,
  buildHWRRExtAssetRecord,
  getRequestTypeLabel,
  getHardwareTypeLabel,
  getPriorityLabel,
  getSiteLabel,
} from './data';

// HWRR constants, types, and helpers are imported from './data'.
type PickedPerson = SelectedEmployee | ManualPerson | null;

function personLabel(person: PickedPerson): string {
  return person?.fullName || '';
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function HWRRNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const createMainDBITExtAssets = useCreateMainDBITExtAssets();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState('');
  
  // Form data
  const [formData, setFormData] = useState<HWRRFormInput>({
    Company: '',
    Site: 'MY-PR',
    Department: '',
    PhoneExt: '',
    EmailAddress: '',
    RequestType: '',
    HardwareType: '',
    Quantity: 1,
    Specifications: '',
    Location: '',
    OldAssetTag: '',
    OldSerialNumber: '',
    ReplacementReason: '',
    CurrentAssetTag: '',
    CurrentSpecs: '',
    DesiredSpecs: '',
    UpgradeReason: '',
    DisposalAssetTag: '',
    DisposalSerialNumber: '',
    DisposalReason: '',
    DataWipeConfirm: false,
    BusinessJustification: '',
    RequiredDate: undefined,
    Priority: 'MEDIUM',
    Remarks: '',
  });

  useEffect(() => {
    if (user?.userPrincipalName && formData.EmailAddress !== user.userPrincipalName) {
      setFormData(prev => ({ ...prev, EmailAddress: user.userPrincipalName }));
    }
  }, [user?.userPrincipalName, formData.EmailAddress]);
  
  // Selected user objects (for display)
  const [selectedHOD, setSelectedHOD] = useState<PickedPerson>(null);
  const [selectedCCRecipients, setSelectedCCRecipients] = useState<string[]>([]);
  const [selectedForUser, setSelectedForUser] = useState<PickedPerson>(null);
  
  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof HWRRFormInput, string>>>({});
  
  // Update form field
  const updateField = <K extends keyof HWRRFormInput>(field: K, value: HWRRFormInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  // Navigate to next step
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 2500;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const submissionData = buildHWRRMainDBITSubmission(
          formData,
          user?.userPrincipalName || ''
        );
        const draft = await createMainDBIT.mutateAsync(submissionData);

        await createMainDBITExtAssets.mutateAsync(
          buildHWRRExtAssetRecord(formData, selectedForUser)
        );
        
        toast.success('Hardware request submitted successfully!');
        
        setSubmittedTicketId(draft.title);
        setIsSubmitted(true);
        setIsSubmitting(false);
        return;
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        const isDataModelLockError = errorMessage.includes('data model configuration is currently being updated');
        
        if (isDataModelLockError && attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(1.5, attempt - 1);
          toast.info(`System busy, retrying in ${Math.round(delay / 1000)}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (isDataModelLockError) {
          toast.error('The system is currently updating. Please wait 30 seconds and try again.');
        } else {
          toast.error('Failed to submit request. Please try again.');
        }
        console.error('Submission error:', error);
        setIsSubmitting(false);
        return;
      }
    }
  };
  
  // =============================================================================
  // RENDER: SUCCESS STATE
  // =============================================================================
  
  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6" style={{ backgroundColor: '#F5F5F5' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="max-w-md w-full"
        >
          <Card className="shadow-lg" style={{ borderRadius: '12px' }}>
            <CardContent className="pt-8 pb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: '#166534' }} />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                Request Submitted
              </h2>
              
              <p className="text-sm mb-6" style={{ color: '#5C5C5C' }}>
                Your hardware request has been submitted for HOD approval.
              </p>
              
              <div 
                className="p-4 rounded-lg mb-6"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' }}
              >
                <p className="text-xs mb-1" style={{ color: '#5C5C5C' }}>Reference Number</p>
                <p className="text-lg font-bold" style={{ color: '#f59e0b', fontFamily: 'Segoe UI' }}>
                  {submittedTicketId}
                </p>
              </div>
              
              <div className="space-y-2 text-left mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA' }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#1C1C1C' }}>
                  <Clock className="w-4 h-4" style={{ color: '#7B3E00' }} />
                  <span>Pending HOD Approval</span>
                </div>
                <p className="text-xs pl-6" style={{ color: '#5C5C5C' }}>
                  Your department head will review this request
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/it/forms')}
                  style={{ height: '44px', borderRadius: '12px' }}
                >
                  Back to Forms
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => navigate('/my-submissions')}
                  style={{ 
                    height: '44px', 
                    borderRadius: '12px',
                    backgroundColor: '#f59e0b',
                  }}
                >
                  View Submissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  // =============================================================================
  // RENDER: FORM
  // =============================================================================
  
  return (
    <div className="min-h-[calc(100vh-64px)] p-6" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/it/forms')}
            className="mb-4 -ml-2"
            style={{ color: '#5C5C5C' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to IT Forms
          </Button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
            >
              <HardDrive className="w-6 h-6" style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                Hardware Request Form (HWRR)
              </h1>
              <p className="text-sm" style={{ color: '#5C5C5C' }}>
                Request new hardware, equipment replacement, or hardware disposal
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Card */}
        <Card 
          className="shadow-lg"
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}
        >
          {/* Progress Indicator */}
          <div className="p-6 border-b" style={{ borderColor: '#D0D0D0' }}>
            <div className="flex items-center justify-between">
              {FORM_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200"
                      style={{
                        backgroundColor: currentStep > step.id 
                          ? '#166534' 
                          : currentStep === step.id 
                            ? '#f59e0b' 
                            : '#E0E0E0',
                        color: currentStep >= step.id ? '#FFFFFF' : '#5C5C5C',
                      }}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span 
                      className="text-xs mt-2 font-medium"
                      style={{ 
                        color: currentStep >= step.id ? '#1C1C1C' : '#5C5C5C',
                        fontFamily: 'Segoe UI',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  
                  {index < FORM_STEPS.length - 1 && (
                    <div
                      className="w-16 h-0.5 mx-2"
                      style={{
                        backgroundColor: currentStep > step.id ? '#166534' : '#D0D0D0',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Content */}
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Requestor Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <UserIcon className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                      Requestor Information
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Company */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Company <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <SharePointLookupSelect
                        kind="company"
                        value={formData.Company}
                        onChange={(value: string) => updateField('Company', value)}
                        placeholder="Select company..."
                        className="mt-2 h-11 bg-[#E8E8E8]"
                      />
                    </div>
                    
                    {/* Site */}
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
                          }}
                        >
                          <SelectValue placeholder="Select site..." />
                        </SelectTrigger>
                        <SelectContent>
                          {SITES.map((site) => (
                            <SelectItem key={site.value} value={site.value}>
                              {site.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Department */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Department <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <SharePointLookupSelect
                        kind="department"
                        value={formData.Department}
                        onChange={(value: string) => updateField('Department', value)}
                        placeholder="Select department..."
                        className="mt-2 h-11 bg-[#E8E8E8]"
                      />
                    </div>
                    
                    {/* Phone Extension */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Phone Extension
                      </Label>
                      <Input
                        value={formData.PhoneExt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('PhoneExt', e.target.value)}
                        placeholder="e.g., 1234"
                        className="mt-2"
                        style={{ 
                          height: '44px', 
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                        }}
                      />
                    </div>
                    
                    {/* Email Address */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        value={user?.userPrincipalName || formData.EmailAddress || ''}
                        readOnly
                        placeholder="Using your Microsoft 365 email"
                        className="mt-2"
                        style={{ 
                          height: '44px', 
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                        }}
                      />
                      <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                        Email address is populated from your Microsoft 365 profile.
                      </p>
                    </div>
                    
                    {/* Head of Department */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Head of Department <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        The HOD who will approve this request
                      </p>
                      <EmployeePicker
                        value={selectedHOD?.email || ''}
                        onChange={(_email, employee) => {
                          setSelectedHOD(employee);
                        }}
                        placeholder="Search for HOD..."
                      />
                    </div>
                    
                    {/* CC Recipients */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        CC Recipients
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        Additional people to notify (optional)
                      </p>
                      <MultiEmployeePicker
                        value={selectedCCRecipients}
                        onChange={(emails) => setSelectedCCRecipients(emails)}
                        placeholder="Search for people to CC..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Hardware Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Package className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                      Hardware Details
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Request Type */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Request Type <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Select
                        value={formData.RequestType}
                        onValueChange={(value: string) => updateField('RequestType', value)}
                      >
                        <SelectTrigger 
                          className="mt-2"
                          style={{ 
                            height: '44px', 
                            borderRadius: '8px',
                            backgroundColor: '#E8E8E8',
                          }}
                        >
                          <SelectValue placeholder="Select request type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {REQUEST_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Hardware Type */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Hardware Type <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Select
                        value={formData.HardwareType}
                        onValueChange={(value: string) => updateField('HardwareType', value)}
                      >
                        <SelectTrigger 
                          className="mt-2"
                          style={{ 
                            height: '44px', 
                            borderRadius: '8px',
                            backgroundColor: '#E8E8E8',
                          }}
                        >
                          <SelectValue placeholder="Select hardware type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {HARDWARE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Quantity */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Quantity <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={formData.Quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Quantity', parseInt(e.target.value) || 1)}
                        className="mt-2"
                        style={{ 
                          height: '44px', 
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                        }}
                      />
                    </div>
                    
                    {/* Specifications */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Specifications/Model <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.Specifications}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('Specifications', e.target.value)}
                        placeholder="Specify brand, model, specs requirements"
                        className="mt-2"
                        rows={3}
                        style={{ 
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                        }}
                      />
                    </div>
                    
                    {/* For User */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        For User <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>
                        User who will receive/use the hardware
                      </p>
                      <EmployeePicker
                        value={selectedForUser?.email || ''}
                        onChange={(_email, employee) => {
                          setSelectedForUser(employee);
                        }}
                        placeholder="Search for user..."
                      />
                    </div>
                    
                    {/* Installation Location */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Installation Location <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Input
                        value={formData.Location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Location', e.target.value)}
                        placeholder="e.g., HQ Building, Level 3, Room 301"
                        className="mt-2"
                        style={{ 
                          height: '44px', 
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                        }}
                      />
                    </div>
                    
                    {/* Conditional: Replacement Details */}
                    {formData.RequestType === 'REPLACEMENT' && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw className="w-4 h-4" style={{ color: '#f59e0b' }} />
                          <span className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Replacement Details</span>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Old Asset Tag <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Input
                            value={formData.OldAssetTag}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('OldAssetTag', e.target.value)}
                            placeholder="IOI-IT-XXXX"
                            className="mt-2"
                            style={{ 
                              height: '44px', 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Old Serial Number <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Input
                            value={formData.OldSerialNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('OldSerialNumber', e.target.value)}
                            placeholder="Enter serial number"
                            className="mt-2"
                            style={{ 
                              height: '44px', 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Reason for Replacement <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Select
                            value={formData.ReplacementReason}
                            onValueChange={(value: string) => updateField('ReplacementReason', value)}
                          >
                            <SelectTrigger 
                              className="mt-2"
                              style={{ 
                                height: '44px', 
                                borderRadius: '8px',
                                backgroundColor: '#E8E8E8',
                              }}
                            >
                              <SelectValue placeholder="Select reason..." />
                            </SelectTrigger>
                            <SelectContent>
                              {REPLACEMENT_REASONS.map((reason) => (
                                <SelectItem key={reason.value} value={reason.value}>
                                  {reason.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    
                    {/* Conditional: Upgrade Details */}
                    {formData.RequestType === 'UPGRADE' && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-4 h-4" style={{ color: '#f59e0b' }} />
                          <span className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Upgrade Details</span>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Current Asset Tag <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Input
                            value={formData.CurrentAssetTag}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('CurrentAssetTag', e.target.value)}
                            placeholder="IOI-IT-XXXX"
                            className="mt-2"
                            style={{ 
                              height: '44px', 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Current Specifications <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Textarea
                            value={formData.CurrentSpecs}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('CurrentSpecs', e.target.value)}
                            placeholder="Describe current hardware specifications"
                            className="mt-2"
                            rows={2}
                            style={{ 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Desired Upgrade Specifications <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Textarea
                            value={formData.DesiredSpecs}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('DesiredSpecs', e.target.value)}
                            placeholder="Describe desired upgrade specifications"
                            className="mt-2"
                            rows={2}
                            style={{ 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Reason for Upgrade <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Select
                            value={formData.UpgradeReason}
                            onValueChange={(value: string) => updateField('UpgradeReason', value)}
                          >
                            <SelectTrigger 
                              className="mt-2"
                              style={{ 
                                height: '44px', 
                                borderRadius: '8px',
                                backgroundColor: '#E8E8E8',
                              }}
                            >
                              <SelectValue placeholder="Select reason..." />
                            </SelectTrigger>
                            <SelectContent>
                              {UPGRADE_REASONS.map((reason) => (
                                <SelectItem key={reason.value} value={reason.value}>
                                  {reason.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    
                    {/* Conditional: Disposal Details */}
                    {formData.RequestType === 'DISPOSAL' && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2 mb-2">
                          <Trash2 className="w-4 h-4" style={{ color: '#dc2626' }} />
                          <span className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Disposal Details</span>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Asset Tag <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Input
                            value={formData.DisposalAssetTag}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('DisposalAssetTag', e.target.value)}
                            placeholder="IOI-IT-XXXX"
                            className="mt-2"
                            style={{ 
                              height: '44px', 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Serial Number <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Input
                            value={formData.DisposalSerialNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('DisposalSerialNumber', e.target.value)}
                            placeholder="Enter serial number"
                            className="mt-2"
                            style={{ 
                              height: '44px', 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                            Reason for Disposal <span style={{ color: '#9B2F23' }}>*</span>
                          </Label>
                          <Select
                            value={formData.DisposalReason}
                            onValueChange={(value: string) => updateField('DisposalReason', value)}
                          >
                            <SelectTrigger 
                              className="mt-2"
                              style={{ 
                                height: '44px', 
                                borderRadius: '8px',
                                backgroundColor: '#E8E8E8',
                              }}
                            >
                              <SelectValue placeholder="Select reason..." />
                            </SelectTrigger>
                            <SelectContent>
                              {DISPOSAL_REASONS.map((reason) => (
                                <SelectItem key={reason.value} value={reason.value}>
                                  {reason.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dataWipeConfirm"
                            checked={formData.DataWipeConfirm}
                            onCheckedChange={(checked: boolean) => updateField('DataWipeConfirm', checked)}
                          />
                          <Label
                            htmlFor="dataWipeConfirm"
                            className="text-sm font-normal cursor-pointer"
                            style={{ color: '#1C1C1C' }}
                          >
                            I confirm that all data has been backed up or is not required
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Justification */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                      Justification
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Business Justification */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Business Justification <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.BusinessJustification}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('BusinessJustification', e.target.value)}
                        placeholder="Explain the business need for this hardware request"
                        className="mt-2"
                        rows={4}
                        style={{ 
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                        }}
                      />
                    </div>
                    
                    {/* Required By Date */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Required By Date <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-2",
                              !formData.RequiredDate && "text-muted-foreground"
                            )}
                            style={{ 
                              height: '44px', 
                              borderRadius: '8px',
                              backgroundColor: '#E8E8E8',
                            }}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.RequiredDate ? format(formData.RequiredDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.RequiredDate}
                            onSelect={(date: Date | undefined) => updateField('RequiredDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Priority */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Priority <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Select
                        value={formData.Priority}
                        onValueChange={(value: string) => updateField('Priority', value)}
                      >
                        <SelectTrigger 
                          className="mt-2"
                          style={{ 
                            height: '44px', 
                            borderRadius: '8px',
                            backgroundColor: '#E8E8E8',
                          }}
                        >
                          <SelectValue placeholder="Select priority..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Additional Remarks */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Additional Remarks
                      </Label>
                      <Textarea
                        value={formData.Remarks}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('Remarks', e.target.value)}
                        placeholder="Any additional information or special requirements..."
                        className="mt-2"
                        rows={3}
                        style={{ 
                          borderRadius: '8px',
                          backgroundColor: '#E8E8E8',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 4: Review */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                      Review & Submit
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Requestor Summary */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <UserIcon className="w-4 h-4" style={{ color: '#f59e0b' }} />
                        <span className="font-semibold text-sm" style={{ color: '#1C1C1C' }}>Requestor Information</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Name:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{user?.fullName || 'N/A'}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Company:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{formData.Company || 'N/A'}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Site:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{getSiteLabel(formData.Site)}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Department:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{formData.Department || 'N/A'}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>HOD:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{personLabel(selectedHOD) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hardware Summary */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4" style={{ color: '#f59e0b' }} />
                        <span className="font-semibold text-sm" style={{ color: '#1C1C1C' }}>Hardware Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Request Type:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{getRequestTypeLabel(formData.RequestType)}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Hardware Type:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{getHardwareTypeLabel(formData.HardwareType)}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Quantity:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{formData.Quantity}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>For User:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{personLabel(selectedForUser) || 'N/A'}</span>
                        </div>
                        <div className="col-span-2">
                          <span style={{ color: '#5C5C5C' }}>Location:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{formData.Location || 'N/A'}</span>
                        </div>
                        <div className="col-span-2">
                          <span style={{ color: '#5C5C5C' }}>Specifications:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{formData.Specifications || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Justification Summary */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4" style={{ color: '#f59e0b' }} />
                        <span className="font-semibold text-sm" style={{ color: '#1C1C1C' }}>Justification</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Priority:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>{getPriorityLabel(formData.Priority)}</span>
                        </div>
                        <div>
                          <span style={{ color: '#5C5C5C' }}>Required By:</span>
                          <span className="ml-2" style={{ color: '#1C1C1C' }}>
                            {formData.RequiredDate ? format(formData.RequiredDate, 'PPP') : 'N/A'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span style={{ color: '#5C5C5C' }}>Business Justification:</span>
                          <p className="mt-1" style={{ color: '#1C1C1C' }}>{formData.BusinessJustification || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#1C1C1C' }}>Before submitting</p>
                        <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                          Please review all information carefully. Once submitted, the request will be sent to your HOD for approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#D0D0D0' }}>
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                style={{ height: '44px', borderRadius: '12px' }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < FORM_STEPS.length ? (
                <Button
                  onClick={nextStep}
                  style={{ 
                    height: '44px', 
                    borderRadius: '12px',
                    backgroundColor: '#f59e0b',
                  }}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ 
                    height: '44px', 
                    borderRadius: '12px',
                    backgroundColor: '#166534',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
