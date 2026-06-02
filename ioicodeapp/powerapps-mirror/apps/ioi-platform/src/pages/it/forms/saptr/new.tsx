/**
 * SAPTR - SAP Transport Request Form
 * M5 - SAP Systems
 *
 * 5-Stage Workflow:
 * S1 Submission -> S2 Technical Lead -> S3 Basis Team -> S4 QA Approval -> S5 Closed
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
  FileCode,
  AlertCircle,
  Loader2,
  GitBranch,
  CheckCircle2,
  Clock,
  Users,
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtSAP } from '@/generated/hooks/use-main-dbitext-sap';
import { UserPicker, type SelectedPerson } from '@/components/user-picker';
import type { MainDBITExtSAP } from '@/generated/models/main-dbit-ext-sap-model';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import {
  type SAPTRFormInput,
  type SAPTRDevelopmentType,
  type SAPPriority,
  SAPTR_MODULES,
  SAPTR_TR_CATEGORIES,
  SAPTR_PHASES,
  SAPTR_CLIENT_REQUEST,
  SAPTR_CLIENT_OTHER,
  SAPTR_DEVELOPMENT_TYPES,
  SAP_COMPANIES,
  SAP_DEPARTMENTS,
  SAP_PRIORITIES,
} from '@/types/sap-forms';

const FORM_STEPS = [
  { id: 1, label: 'Request Info', description: 'Module & category' },
  { id: 2, label: 'Transport', description: 'Transport details' },
  { id: 3, label: 'Approval', description: 'Approvers' },
  { id: 4, label: 'Review', description: 'Confirm & submit' },
];

const WORKFLOW_STAGES = [
  { id: 'S1', label: 'Submission', description: 'Request submitted' },
  { id: 'S2', label: 'Technical Lead', description: 'Tech review' },
  { id: 'S3', label: 'Basis Team', description: 'Basis processing' },
  { id: 'S4', label: 'QA Approval', description: 'Quality assurance' },
  { id: 'S5', label: 'Completed', description: 'Transport executed' },
];

export default function SAPTRNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const createExtSAP = useCreateMainDBITExtSAP();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState('');
  const [requestedDate, setRequestedDate] = useState<Date | undefined>();
  const [requestNumber, setRequestNumber] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [isRequest, setIsRequest] = useState(true); // For Client conditional logic

  const [formData, setFormData] = useState<SAPTRFormInput>({
    Modules: [],
    TRCategory: '',
    DevelopmentType: 'New',
    Phases: [],
    Company: '',
    Requestor: user?.fullName || '',
    Department: '',
    Client: '',
    IssueNumber: '',
    TransportNumberPackage: '',
    Dependencies: '',
    SAPTcode: '',
    ReportNameProgramNameFioriApps: '',
    ChangesDone: '',
    TechnicalLead: '',
    BasisTeamLead: '',
    QAApprover: '',
    CC: '',
    RequestedDate: '',
    Priority: 'Medium',
    Justification: '',
  });

  const [selectedTechLead, setSelectedTechLead] = useState<SelectedPerson | null>(null);
  const [selectedBasisLead, setSelectedBasisLead] = useState<SelectedPerson | null>(null);
  const [selectedQAApprover, setSelectedQAApprover] = useState<SelectedPerson | null>(null);
  const [selectedCC, setSelectedCC] = useState<SelectedPerson | null>(null);

  // Auto-generate request number
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    setRequestNumber(`SAPTR-${year}${month}-${sequence}`);
    setDateCreated(format(new Date(), 'yyyy-MM-dd'));
  }, []);

  // Auto-fill user info
  useEffect(() => {
    if (user?.fullName) {
      setFormData(prev => ({ ...prev, Requestor: user.fullName || '' }));
    }
  }, [user]);

  const updateField = <K extends keyof SAPTRFormInput>(field: K, value: SAPTRFormInput[K]) => {
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

  const togglePhase = (phase: string) => {
    setFormData(prev => ({
      ...prev,
      Phases: prev.Phases.includes(phase)
        ? prev.Phases.filter((p: string) => p !== phase)
        : [...prev.Phases, phase]
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const submissionData: Omit<MainDBIT, 'id'> = {
        title: requestNumber,
        formcode: 'SAPTR',
        currentStatus: 'CurrentstatusKey9' as MainDBIT['currentStatus'],
        workflowstage: 1,
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        remarks: [
          '=== SAP Transport Request (SAPTR) ===',
          '',
          '--- Request Information ---',
          `Request Number: ${requestNumber}`,
          `Date Created: ${dateCreated}`,
          `Modules: ${formData.Modules.join(', ')}`,
          `TR Category: ${formData.TRCategory}`,
          `Development Type: ${formData.DevelopmentType}`,
          `Phases: ${formData.Phases.join(', ')}`,
          `Client: ${formData.Client}`,
          `Company: ${formData.Company}`,
          `Department: ${formData.Department}`,
          `Requestor: ${formData.Requestor}`,
          '',
          '--- Transport Details ---',
          `Issue Number: ${formData.IssueNumber}`,
          `Transport Number/Package: ${formData.TransportNumberPackage}`,
          `Dependencies: ${formData.Dependencies || 'None'}`,
          `SAP Tcode: ${formData.SAPTcode || 'N/A'}`,
          `Report/Program/Fiori Apps: ${formData.ReportNameProgramNameFioriApps || 'N/A'}`,
          `Changes Done: ${formData.ChangesDone}`,
          `Justification: ${formData.Justification}`,
          '',
          '--- Approval & Routing ---',
          `Priority: ${formData.Priority}`,
          `Requested Date: ${requestedDate?.toISOString() || 'Not specified'}`,
          `Technical Lead: ${selectedTechLead?.displayName || 'N/A'} (${formData.TechnicalLead})`,
          `Basis Team Lead: ${selectedBasisLead?.displayName || 'N/A'} (${formData.BasisTeamLead})`,
          `QA Approver: ${selectedQAApprover?.displayName || 'N/A'} (${formData.QAApprover})`,
          `CC: ${selectedCC?.displayName || 'N/A'} (${formData.CC || 'None'})`,
          '',
          '--- Workflow ---',
          'Current Stage: Pending Approval',
          'Workflow Stage: 1',
        ].filter(Boolean).join('\n'),
      };

      const created = await createMainDBIT.mutateAsync(submissionData);

      // Also create ExtSAP record with proper columns
      if (created?.id) {
        const extData: Omit<MainDBITExtSAP, 'id'> = {
          title: `${requestNumber}-sap`,
          parentFormCode: 'SAPTR',
          parentRecord: { id: created.id, title: requestNumber },
          sAPTRNumber: formData.TransportNumberPackage || '',
          sAPTRCategory: formData.TRCategory || '',
          sAPTRClient: formData.Client || '',
          sAPTRIssueNum: formData.IssueNumber || '',
          sAPTRTcode: formData.SAPTcode || '',
          sAPTRChangesDone: formData.ChangesDone || '',
          sAPTRKeyUser: formData.Requestor || '',
          sAPTRRequestedBy: user?.userPrincipalName || '',
        };
        await createExtSAP.mutateAsync(extData);
      }

      toast.success('SAP Transport Request submitted!');
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
                Your SAP Transport Request has been submitted for review.
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
                  <span>Pending Technical Lead Review</span>
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

  // Get client options based on status
  const clientOptions = isRequest ? SAPTR_CLIENT_REQUEST : SAPTR_CLIENT_OTHER;

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
              <GitBranch className="w-6 h-6" style={{ color: '#003366' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1C1C1C' }}>
                SAP Transport Request (SAPTR)
              </h1>
              <p className="text-sm" style={{ color: '#5C5C5C' }}>
                Request SAP transport to move changes between systems
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
                        {SAPTR_MODULES.map((module: string) => (
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

                    {/* TR Category - Single select */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        TR Category <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Select value={formData.TRCategory} onValueChange={(v: string) => updateField('TRCategory', v)}>
                        <SelectTrigger className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}>
                          <SelectValue placeholder="Select TR category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {SAPTR_TR_CATEGORIES.map((cat: string) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Development Type - Single select */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Development Type <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {SAPTR_DEVELOPMENT_TYPES.map((type: SAPTRDevelopmentType) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => updateField('DevelopmentType', type)}
                            className="p-3 rounded-lg border-2 text-center transition-all"
                            style={{
                              backgroundColor: formData.DevelopmentType === type ? 'rgba(0, 51, 102, 0.1)' : '#FAFAFA',
                              borderColor: formData.DevelopmentType === type ? '#003366' : '#D0D0D0',
                              color: formData.DevelopmentType === type ? '#003366' : '#1C1C1C',
                            }}
                          >
                            <span className="font-medium text-sm">{type}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phase - Multi-select */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Phase <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {SAPTR_PHASES.map((phase: string) => (
                          <button
                            key={phase}
                            type="button"
                            onClick={() => togglePhase(phase)}
                            className="px-4 py-2 rounded-lg border-2 text-center transition-all"
                            style={{
                              backgroundColor: formData.Phases.includes(phase) ? 'rgba(0, 51, 102, 0.1)' : '#FAFAFA',
                              borderColor: formData.Phases.includes(phase) ? '#003366' : '#D0D0D0',
                              color: formData.Phases.includes(phase) ? '#003366' : '#1C1C1C',
                            }}
                          >
                            <span className="font-medium text-xs">{phase}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Client - Conditional dropdown */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Client <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                          checked={isRequest}
                          onCheckedChange={(v: boolean) => setIsRequest(v)}
                        />
                        <span className="text-xs" style={{ color: '#5C5C5C' }}>Is this a Request status?</span>
                      </div>
                      <Select value={formData.Client} onValueChange={(v: string) => updateField('Client', v)}>
                        <SelectTrigger style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}>
                          <SelectValue placeholder="Select client..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clientOptions.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Company <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <Select value={formData.Company} onValueChange={(v: string) => updateField('Company', v)}>
                          <SelectTrigger className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}>
                            <SelectValue placeholder="Select company..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SAP_COMPANIES.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Department <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <Select value={formData.Department} onValueChange={(v: string) => updateField('Department', v)}>
                          <SelectTrigger className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}>
                            <SelectValue placeholder="Select department..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SAP_DEPARTMENTS.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Requestor Name <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Input
                        value={formData.Requestor}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Requestor', e.target.value)}
                        placeholder="Your full name"
                        className="mt-2"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Transport Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileCode className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C' }}>
                      Transport Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Issue Number <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-1" style={{ color: '#5C5C5C' }}>CR/SSR/PRF/SAP Notes Number/UR/Emp Exit/AMS incident</p>
                      <Input
                        value={formData.IssueNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('IssueNumber', e.target.value)}
                        placeholder="e.g., CR-2026-001 or PRF-2026-123"
                        className="mt-1"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Transport Number/Package <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Input
                        value={formData.TransportNumberPackage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('TransportNumberPackage', e.target.value)}
                        placeholder="e.g., DEVK900123"
                        className="mt-2"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Dependencies
                      </Label>
                      <Input
                        value={formData.Dependencies}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Dependencies', e.target.value)}
                        placeholder="List any transport dependencies..."
                        className="mt-2"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        SAP Tcode
                      </Label>
                      <Input
                        value={formData.SAPTcode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('SAPTcode', e.target.value)}
                        placeholder="e.g., SE38, SM30"
                        className="mt-2"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Report Name/Program Name/Fiori Apps
                      </Label>
                      <Input
                        value={formData.ReportNameProgramNameFioriApps}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ReportNameProgramNameFioriApps', e.target.value)}
                        placeholder="e.g., Z_CUSTOM_REPORT or Fiori App ID"
                        className="mt-2"
                        style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Changes Done <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.ChangesDone}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('ChangesDone', e.target.value)}
                        placeholder="Describe the changes being transported..."
                        rows={4}
                        className="mt-2"
                        style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Business Justification <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.Justification}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('Justification', e.target.value)}
                        placeholder="Business reason for this transport..."
                        rows={2}
                        className="mt-2"
                        style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Priority <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <Select value={formData.Priority} onValueChange={(v: SAPPriority) => updateField('Priority', v)}>
                          <SelectTrigger className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}>
                            <SelectValue placeholder="Select priority..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SAP_PRIORITIES.map((p: SAPPriority) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Requested Go-Live Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn("w-full justify-start text-left font-normal mt-2", !requestedDate && "text-muted-foreground")}
                              style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {requestedDate ? format(requestedDate, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={requestedDate} onSelect={setRequestedDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Technical Lead <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <UserPicker
                          value={formData.TechnicalLead}
                          onChange={(userId: string, person: SelectedPerson | null) => {
                            updateField('TechnicalLead', userId);
                            setSelectedTechLead(person);
                          }}
                          placeholder="Search for technical lead..."
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Basis Team Lead <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <UserPicker
                          value={formData.BasisTeamLead}
                          onChange={(userId: string, person: SelectedPerson | null) => {
                            updateField('BasisTeamLead', userId);
                            setSelectedBasisLead(person);
                          }}
                          placeholder="Search for basis team lead..."
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          QA Approver <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <UserPicker
                          value={formData.QAApprover}
                          onChange={(userId: string, person: SelectedPerson | null) => {
                            updateField('QAApprover', userId);
                            setSelectedQAApprover(person);
                          }}
                          placeholder="Search for QA approver..."
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          CC (Optional)
                        </Label>
                        <UserPicker
                          value={formData.CC}
                          onChange={(userId: string, person: SelectedPerson | null) => {
                            updateField('CC', userId);
                            setSelectedCC(person);
                          }}
                          placeholder="Search for CC recipients..."
                        />
                      </div>
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
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#1C1C1C' }}>Transport Summary</h3>
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
                          <p style={{ color: '#5C5C5C' }}>TR Category</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.TRCategory}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Development Type</p>
                          <Badge variant="secondary">{formData.DevelopmentType}</Badge>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Priority</p>
                          <Badge variant={formData.Priority === 'Critical' ? 'destructive' : formData.Priority === 'High' ? 'default' : 'secondary'}>
                            {formData.Priority}
                          </Badge>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Client</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Client}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Transport Number</p>
                          <p className="font-medium font-mono" style={{ color: '#003366' }}>{formData.TransportNumberPackage}</p>
                        </div>
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Issue Number</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.IssueNumber}</p>
                        </div>
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Changes Done</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.ChangesDone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', border: '1px solid #003366' }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#003366' }}>Approval Workflow</h3>
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
                          This transport request will be routed to {selectedTechLead?.displayName || 'Technical Lead'} for review.
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
