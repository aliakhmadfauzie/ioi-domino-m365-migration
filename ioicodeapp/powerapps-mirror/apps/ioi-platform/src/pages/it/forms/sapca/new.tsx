/**
 * SAPCA - SAP Configuration Access Form
 * M4 - SAP Management
 * 
 * NSF Workflow:
 * Request -> Submitted -> Approved -> ConfigAccess-Done -> Submitted-Closure -> Completed
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Send,
  User as UserIcon,
  FileText,
  AlertCircle,
  Loader2,
  Settings,
  CheckCircle2,
  Clock,
  Users,
  Paperclip,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtSAP } from '@/generated/hooks/use-main-dbitext-sap';
import { EmployeePicker, type ManualPerson, type SelectedEmployee } from '@/components/employee-picker';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSAP } from '@/generated/models/main-dbit-ext-sap-model';
import {
  type SAPCAFormInput,
  SAPCA_MODULES,
  SAPCA_CLIENTS,
} from '@/types/sap-forms';

type PickedPerson = SelectedEmployee | ManualPerson | null;

function personLabel(person: PickedPerson): string {
  return person?.fullName || '';
}

const FORM_STEPS = [
  { id: 1, label: 'Request Info', description: 'Module & client' },
  { id: 2, label: 'Details', description: 'Purpose & changes' },
  { id: 3, label: 'Approval', description: 'Approvers' },
  { id: 4, label: 'Review', description: 'Confirm & submit' },
];

const WORKFLOW_STAGES = [
  { id: 'Request', label: 'Request', description: 'Draft by requestor' },
  { id: 'Submitted', label: 'Pending IT Approval', description: 'ITAPP review' },
  { id: 'Approved', label: 'Pending BASIS Reply', description: 'BASIS opens access' },
  { id: 'ConfigAccess-Done', label: 'Pending Requestor Closure', description: 'Requestor asks to close' },
  { id: 'Submitted-Closure', label: 'Pending BASIS Confirmation', description: 'BASIS confirms closure' },
  { id: 'Completed', label: 'Completed', description: 'Config closed' },
];

export default function SAPCANewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const createExtSAP = useCreateMainDBITExtSAP();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState('');
  const [requestNumber, setRequestNumber] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<SAPCAFormInput>({
    Modules: [],
    Client: '',
    ClientNumber: '',
    IssueLogSSRPRFSAPNotesNumber: '',
    Company: '',
    Requestor: user?.fullName || '',
    Department: '',
    Purpose: '',
    ChangesToBeDone: '',
    Attachment: '',
    CCFunctionalOwner: '',
    ITAPP: '',
    Transporter: '',
    ITPIC: '',
    Justification: '',
    DateSubmitted: '',
  });
  
  const [selectedCC, setSelectedCC] = useState<PickedPerson>(null);
  const [selectedITAPP, setSelectedITAPP] = useState<PickedPerson>(null);
  const [selectedTransporter, setSelectedTransporter] = useState<PickedPerson>(null);
  const [selectedITPIC, setSelectedITPIC] = useState<PickedPerson>(null);
  
  // Auto-generate request number
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    setRequestNumber(`SAPCA-${year}${month}-${sequence}`);
    setDateCreated(format(new Date(), 'yyyy-MM-dd'));
  }, []);
  
  // Auto-fill user info
  useEffect(() => {
    if (user?.fullName) {
      setFormData(prev => ({ ...prev, Requestor: user.fullName || '' }));
    }
  }, [user]);
  
  const updateField = <K extends keyof SAPCAFormInput>(field: K, value: SAPCAFormInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleModule = (module: string) => {
    setFormData(prev => ({
      ...prev,
      Modules: prev.Modules.includes(module)
        ? prev.Modules.filter((m: string) => m !== module)
        : [...prev.Modules, module]
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      updateField('Attachment', file.name);
    }
  };
  
  const removeAttachment = () => {
    setAttachment(null);
    updateField('Attachment', '');
  };
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const submissionData: Omit<MainDBIT, 'id'> = {
        title: requestNumber,
        formcode: 'SAPCA',
        currentStatus: 'Submitted',
        siteKey: 'SiteKey2',
        requestoremail: user?.userPrincipalName || '',
        requestorName: formData.Requestor,
        company: formData.Company,
        submitteddate: new Date().toISOString(),
        workflowstage: 2,
        currentAction: 'Submitted',
        subject: `SAP Config Access - ${formData.Client || requestNumber}`,
      };
      
      const created = await createMainDBIT.mutateAsync(submissionData);

      if (created?.id) {
        const extData: Omit<MainDBITExtSAP, 'id'> = {
          title: `${requestNumber}-sap`,
          parentFormCode: 'SAPCA',
          parentRecord: { id: created.id, title: requestNumber },
          parentSite: 'PRAI',
          sAPClient: formData.Client || '',
          sAPModule: formData.Modules.join(', '),
          sAPPlant: formData.Company || '',
          sAPRemarks: [
            `Request Number: ${requestNumber}`,
            `Date Created: ${dateCreated}`,
            formData.ClientNumber ? `Client Number: ${formData.ClientNumber}` : '',
            formData.IssueLogSSRPRFSAPNotesNumber ? `Issue Log/SSR/PRF/SAP Notes Number: ${formData.IssueLogSSRPRFSAPNotesNumber}` : '',
            `Department: ${formData.Department}`,
            `Purpose: ${formData.Purpose}`,
            `Changes to be Done: ${formData.ChangesToBeDone}`,
            formData.Attachment ? `Attachment: ${formData.Attachment}` : '',
            selectedCC ? `CC Functional Owner: ${personLabel(selectedCC)}` : '',
            selectedITAPP ? `ITAPP: ${personLabel(selectedITAPP)} (${selectedITAPP.email || ''})` : '',
            selectedTransporter ? `Transporter: ${personLabel(selectedTransporter)} (${selectedTransporter.email || ''})` : '',
            selectedITPIC ? `ITPIC: ${personLabel(selectedITPIC)} (${selectedITPIC.email || ''})` : '',
          ].filter(Boolean).join('\n'),
        };
        await createExtSAP.mutateAsync(extData);
      }
      toast.success('SAP Configuration Access request submitted!');
      setSubmittedTicketId(requestNumber);
      setIsSubmitted(true);
    } catch (error: unknown) {
      console.error('Submission error:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
                style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)' }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: '#166534' }} />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#1C1C1C' }}>
                Request Submitted
              </h2>
              
              <p className="text-sm mb-6" style={{ color: '#5C5C5C' }}>
                Your SAP Configuration Access request has been submitted.
              </p>
              
              <div 
                className="p-4 rounded-lg mb-6"
                style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', border: '1px solid #003366' }}
              >
                <p className="text-xs mb-1" style={{ color: '#5C5C5C' }}>Reference Number</p>
                <p className="text-lg font-bold" style={{ color: '#003366' }}>
                  {submittedTicketId}
                </p>
              </div>
              
              <div className="space-y-2 text-left mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA' }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#1C1C1C' }}>
                  <Clock className="w-4 h-4" style={{ color: '#7B3E00' }} />
                  <span>Pending IT Approval</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/it')}
                  style={{ height: '44px', borderRadius: '12px' }}
                >
                  Back to IT
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => navigate('/my-submissions')}
                  style={{ height: '44px', borderRadius: '12px', backgroundColor: '#003366' }}
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
  
  return (
    <div className="min-h-[calc(100vh-64px)] p-6" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/it')}
            className="mb-4 -ml-2"
            style={{ color: '#5C5C5C' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to IT Department
          </Button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)' }}
            >
              <Settings className="w-6 h-6" style={{ color: '#003366' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1C1C1C' }}>
                SAP Configuration Access (SAPCA)
              </h1>
              <p className="text-sm" style={{ color: '#5C5C5C' }}>
                Request access to SAP configuration tables and settings
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Card */}
        <Card className="shadow-lg" style={{ borderRadius: '12px' }}>
          {/* Progress */}
          <div className="p-6 border-b" style={{ borderColor: '#D0D0D0' }}>
            <div className="flex items-center justify-between">
              {FORM_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs"
                      style={{
                        backgroundColor: currentStep > step.id ? '#166534' : currentStep === step.id ? '#003366' : '#E0E0E0',
                        color: currentStep >= step.id ? '#FFFFFF' : '#5C5C5C',
                      }}
                    >
                      {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span className="text-xs mt-1 font-medium hidden md:block" style={{ color: currentStep >= step.id ? '#1C1C1C' : '#5C5C5C' }}>
                      {step.label}
                    </span>
                  </div>
                  {index < FORM_STEPS.length - 1 && (
                    <div className="w-12 md:w-20 h-0.5 mx-1" style={{ backgroundColor: currentStep > step.id ? '#166534' : '#D0D0D0' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Request Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <UserIcon className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C' }}>
                      Request Information
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Module - Multi-select checkboxes */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Module <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>Select all applicable modules</p>
                      <div className="grid grid-cols-3 gap-2">
                        {SAPCA_MODULES.map((module: string) => (
                          <div
                            key={module}
                            className="flex items-center space-x-2 p-2 rounded-lg border cursor-pointer hover:bg-gray-50"
                            style={{ 
                              backgroundColor: formData.Modules.includes(module) ? 'rgba(0, 51, 102, 0.1)' : '#FAFAFA',
                              borderColor: formData.Modules.includes(module) ? '#003366' : '#D0D0D0'
                            }}
                            onClick={() => toggleModule(module)}
                          >
                            <Checkbox
                              checked={formData.Modules.includes(module)}
                              onCheckedChange={() => toggleModule(module)}
                            />
                            <span className="text-xs font-medium" style={{ color: '#1C1C1C' }}>{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Client - Single select */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Client <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <Select value={formData.Client} onValueChange={(v: string) => updateField('Client', v)}>
                          <SelectTrigger className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}>
                            <SelectValue placeholder="Select client..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SAPCA_CLIENTS.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Client Number
                        </Label>
                        <Input
                          value={formData.ClientNumber}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ClientNumber', e.target.value)}
                          placeholder="e.g., 100"
                          className="mt-2"
                          style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                        />
                      </div>
                    </div>
                    
                    {/* Issue Number */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        CR/Issue Log/SSR/PRF/SAP Notes Number
                      </Label>
                      <Input
                        value={formData.IssueLogSSRPRFSAPNotesNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('IssueLogSSRPRFSAPNotesNumber', e.target.value)}
                        placeholder="e.g., CR-2026-001 or SSR-2026-123"
                        className="mt-2"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Company <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <SharePointLookupSelect
                          kind="company"
                          value={formData.Company}
                          onChange={(v: string) => updateField('Company', v)}
                          placeholder="Select company..."
                          className="mt-2 h-11 bg-[#E8E8E8]"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Department <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <SharePointLookupSelect
                          kind="department"
                          value={formData.Department}
                          onChange={(v: string) => updateField('Department', v)}
                          placeholder="Select department..."
                          className="mt-2 h-11 bg-[#E8E8E8]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Requested By <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Input
                        value={formData.Requestor}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Requestor', e.target.value)}
                        placeholder="Your full name"
                        className="mt-2"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                        readOnly
                      />
                      <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>Auto-populated from your account</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Purpose & Changes */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C' }}>
                      Purpose & Changes
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Purpose <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.Purpose}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('Purpose', e.target.value)}
                        placeholder="Describe the purpose of this configuration access request..."
                        rows={4}
                        className="mt-2"
                        style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Changes to be done <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.ChangesToBeDone}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('ChangesToBeDone', e.target.value)}
                        placeholder="Describe the specific configuration changes to be made..."
                        rows={4}
                        className="mt-2"
                        style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>
                    
                    {/* Attachment */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Attachment
                      </Label>
                      {!attachment ? (
                        <div
                          className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                          style={{ borderColor: '#D0D0D0', backgroundColor: '#FAFAFA' }}
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#5C5C5C' }} />
                          <p className="text-sm font-medium" style={{ color: '#1C1C1C' }}>Click to upload or drag and drop</p>
                          <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>PDF, DOC, XLS up to 10MB</p>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileChange}
                          />
                        </div>
                      ) : (
                        <div
                          className="mt-2 p-3 rounded-lg flex items-center justify-between"
                          style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', border: '1px solid #003366' }}
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4" style={{ color: '#003366' }} />
                            <span className="text-sm font-medium" style={{ color: '#003366' }}>{attachment.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeAttachment}
                            style={{ color: '#9B2F23' }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Approval */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C' }}>
                      Approval & Routing
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        CC Main/Backup Functional Owner
                      </Label>
                      <EmployeePicker
                        value={formData.CCFunctionalOwner}
                        onChange={(email, employee) => {
                          updateField('CCFunctionalOwner', email);
                          setSelectedCC(employee);
                        }}
                        placeholder="Search for CC recipients..."
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        IT Approver (ITAPP) <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <EmployeePicker
                        value={formData.ITAPP}
                        onChange={(email, employee) => {
                          updateField('ITAPP', email);
                          setSelectedITAPP(employee);
                        }}
                        placeholder="Search for IT approver..."
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        BASIS Transporter <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <EmployeePicker
                        value={formData.Transporter}
                        onChange={(email, employee) => {
                          updateField('Transporter', email);
                          setSelectedTransporter(employee);
                        }}
                        placeholder="Search for BASIS transporter..."
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        IT PIC
                      </Label>
                      <EmployeePicker
                        value={formData.ITPIC}
                        onChange={(email, employee) => {
                          updateField('ITPIC', email);
                          setSelectedITPIC(employee);
                        }}
                        placeholder="Search for IT PIC..."
                      />
                    </div>
                    
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 51, 102, 0.05)', border: '1px solid #D0D0D0' }}>
                      <p className="text-xs" style={{ color: '#5C5C5C' }}>
                        <strong>Auto-populated:</strong> Requested By ({formData.Requestor}) and Date Submitted will be recorded upon form submission.
                      </p>
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
                    <Check className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C' }}>
                      Review & Submit
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#1C1C1C' }}>Request Summary</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Modules</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.Modules.map((m: string) => (
                              <Badge key={m} variant="outline" style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', color: '#003366' }}>
                                {m}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Client</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Client} {formData.ClientNumber && `(${formData.ClientNumber})`}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Requested By</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Requestor}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Date Submitted</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{format(new Date(), 'PPP')}</p>
                        </div>
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Purpose</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Purpose}</p>
                        </div>
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Changes to be done</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.ChangesToBeDone}</p>
                        </div>
                        {attachment && (
                          <div className="col-span-2">
                            <p style={{ color: '#5C5C5C' }}>Attachment</p>
                            <p className="font-medium flex items-center gap-2" style={{ color: '#003366' }}>
                              <Paperclip className="w-4 h-4" />
                              {attachment.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', border: '1px solid #003366' }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#003366' }}>CurrentAction Workflow</h3>
                      <div className="space-y-2">
                        {WORKFLOW_STAGES.map((stage, index) => (
                          <div key={stage.id} className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                              style={{ backgroundColor: index === 0 ? '#166534' : '#D0D0D0', color: index === 0 ? '#FFFFFF' : '#5C5C5C' }}
                            >
                              {index === 0 ? <Check className="w-3 h-3" /> : index + 1}
                            </div>
                            <p className="text-sm font-medium" style={{ color: '#003366' }}>{stage.label}</p>
                            {index === 0 && <Badge style={{ backgroundColor: '#166534', color: '#FFFFFF' }}>Current</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border-l-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(123, 62, 0, 0.08)', borderLeftColor: '#7B3E00' }}>
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7B3E00' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#7B3E00' }}>Please review before submitting</p>
                        <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                          This request will be routed to {personLabel(selectedITAPP) || 'ITAPP'} for IT approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          {/* Navigation */}
          <div className="px-8 py-4 border-t flex justify-between" style={{ borderColor: '#D0D0D0' }}>
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              style={{ height: '44px', borderRadius: '12px', paddingLeft: '24px', paddingRight: '24px', opacity: currentStep === 1 ? 0.5 : 1 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {currentStep < FORM_STEPS.length ? (
              <Button onClick={nextStep} style={{ height: '44px', borderRadius: '12px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#003366' }}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} style={{ height: '44px', borderRadius: '12px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#003366' }}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : <><Send className="w-4 h-4 mr-2" />Submit Request</>}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
