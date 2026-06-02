/**
 * SAPCR - SAP & WB Change Request Form
 * M5 - SAP Systems
 * 
 * 5-Stage Workflow:
 * S1 Submission -> S2 Technical Review -> S3 Functional Approval -> S4 CAB Review -> S5 Closed
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Send,
  FileText,
  User as UserIcon,
  AlertCircle,
  Loader2,
  Settings,
  GitPullRequest,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtSAP } from '@/generated/hooks/use-main-dbitext-sap';
import { UserPicker, type SelectedPerson } from '@/components/user-picker';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import {
  type SAPCRFormInput,
  type SAPPriority,
  SAPCR_PROJECT_PHASES,
  SAPCR_DIVISIONS,
  SAPCR_SYSTEMS,
  SAPCR_MODULES_ROW1,
  SAPCR_MODULES_ROW2,
  SAPCR_MODULES_ROW3,
  SAPCR_MODULES_ROW4,
  SAPCR_PURPOSE_ROW1,
  SAPCR_PURPOSE_ROW2,
  SAP_COMPANIES,
  SAP_DEPARTMENTS,
  SAP_PRIORITIES,
} from '@/types/sap-forms';

const FORM_STEPS = [
  { id: 1, label: 'Request Info', description: 'Change details' },
  { id: 2, label: 'Module & Purpose', description: 'Select modules' },
  { id: 3, label: 'Technical', description: 'Implementation details' },
  { id: 4, label: 'Review', description: 'Confirm & submit' },
];

const WORKFLOW_STAGES = [
  { id: 'S1', label: 'Submission', description: 'Request submitted' },
  { id: 'S2', label: 'Technical Review', description: 'Technical assessment' },
  { id: 'S3', label: 'Functional Approval', description: 'Business sign-off' },
  { id: 'S4', label: 'CAB Review', description: 'Change Advisory Board' },
  { id: 'S5', label: 'Completed', description: 'Change implemented' },
];

export default function SAPCRNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMainDBIT = useCreateMainDBIT();
  const createMainDBITExtSAP = useCreateMainDBITExtSAP();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState('');
  const [requestNumber, setRequestNumber] = useState('');
  const [requestedDate, setRequestedDate] = useState<Date | undefined>();
  const [plannedStartDate] = useState<Date | undefined>();
  const [plannedEndDate] = useState<Date | undefined>();
  
  const [formData, setFormData] = useState<SAPCRFormInput>({
    ProjectPhase: '',
    Division: [],
    System: '',
    Company: '',
    Requestor: user?.fullName || '',
    Department: '',
    ModulesRow1: [],
    ModulesRow2: [],
    ModulesRow3: [],
    ModulesRow4: [],
    PurposeRow1: [],
    PurposeRow2: [],
    ChangeDescription: '',
    BusinessJustification: '',
    TechnicalSpecification: '',
    TestPlan: '',
    RollbackPlan: '',
    RiskAssessment: '',
    MitigationPlan: '',
    TechnicalReviewer: '',
    FunctionalApprover: '',
    CABApprover: '',
    RequestedDate: '',
    PlannedStartDate: '',
    PlannedEndDate: '',
    Priority: 'Medium',
    DowntimeRequired: 'No',
    EstimatedDowntime: '',
  });
  
  const [selectedTechReviewer, setSelectedTechReviewer] = useState<SelectedPerson | null>(null);
  const [selectedFuncApprover, setSelectedFuncApprover] = useState<SelectedPerson | null>(null);
  const [selectedCABApprover, setSelectedCABApprover] = useState<SelectedPerson | null>(null);
  
  // Auto-generate request number
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    setRequestNumber(`${year}-${month}-${sequence}`);
  }, []);
  
  // Auto-populate user info
  useEffect(() => {
    if (user?.fullName) {
      setFormData(prev => ({ ...prev, Requestor: user.fullName || '' }));
    }
  }, [user]);
  
  const updateField = <K extends keyof SAPCRFormInput>(field: K, value: SAPCRFormInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleArrayItem = (field: 'Division' | 'ModulesRow1' | 'ModulesRow2' | 'ModulesRow3' | 'ModulesRow4' | 'PurposeRow1' | 'PurposeRow2', item: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      const updated = current.includes(item) 
        ? current.filter((i: string) => i !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const ticketId = `SAPCR-${requestNumber}`;
      
      const submissionData: Omit<MainDBIT, 'id'> = {
        title: ticketId,
        formcode: 'SAPCR',
        // Submitted SAPCR records enter the BPO approval queue.
        currentStatus: 'CurrentstatusKey14' as MainDBIT['currentStatus'],
        workflowstage: 1,
        siteKey: 'SiteKey2',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        remarks: JSON.stringify({
          requestNumber,
          projectPhase: formData.ProjectPhase,
          division: formData.Division,
          system: formData.System,
          company: formData.Company,
          requestor: formData.Requestor,
          department: formData.Department,
          changeDescription: formData.ChangeDescription,
          businessJustification: formData.BusinessJustification,
          technicalSpecification: formData.TechnicalSpecification,
          testPlan: formData.TestPlan,
          rollbackPlan: formData.RollbackPlan,
          riskAssessment: formData.RiskAssessment,
          mitigationPlan: formData.MitigationPlan,
          priority: formData.Priority,
          requestedDate: requestedDate?.toISOString(),
          plannedStartDate: plannedStartDate?.toISOString(),
          plannedEndDate: plannedEndDate?.toISOString(),
          technicalReviewer: selectedTechReviewer?.displayName || formData.TechnicalReviewer,
          functionalApprover: selectedFuncApprover?.displayName || formData.FunctionalApprover,
          cabApprover: selectedCABApprover?.displayName || formData.CABApprover,
          modulesRow1: formData.ModulesRow1,
          modulesRow2: formData.ModulesRow2,
          modulesRow3: formData.ModulesRow3,
          modulesRow4: formData.ModulesRow4,
          purposeRow1: formData.PurposeRow1,
          purposeRow2: formData.PurposeRow2,
          downtimeRequired: formData.DowntimeRequired,
          estimatedDowntime: formData.EstimatedDowntime,
        }),
      };
      
      const created = await createMainDBIT.mutateAsync(submissionData);
      
      // Create child record in MainDB_IT_Ext_SAP for SAPCR-specific email routing columns
      try {
        await createMainDBITExtSAP.mutateAsync({
          title: `${ticketId}-ext`,
          parentFormCode: 'SAPCR',
          parentRecord: { id: created.id, title: ticketId },
          parentSite: 'PRAI',
          sAPCRBPOEmail: selectedFuncApprover?.email || formData.FunctionalApprover || '',
          sAPCRPMEmail: selectedTechReviewer?.email || formData.TechnicalReviewer || '',
          sAPCRDeveloperEmail: '',
          sAPCRDirectorEmail: selectedCABApprover?.email || formData.CABApprover || '',
        });
      } catch (extErr) {
        console.warn('[SAPCR] Failed to create ext SAP record (non-fatal):', extErr);
      }
      toast.success('SAP Change Request submitted!');
      setSubmittedTicketId(ticketId);
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
                Your SAP Change Request has been submitted for review.
              </p>
              
              <div 
                className="p-4 rounded-lg mb-6"
                style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', border: '1px solid #003366' }}
              >
                <p className="text-xs mb-1" style={{ color: '#5C5C5C' }}>Change Request No.</p>
                <p className="text-lg font-bold" style={{ color: '#003366' }}>
                  {submittedTicketId}
                </p>
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
              <GitPullRequest className="w-6 h-6" style={{ color: '#003366' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1C1C1C' }}>
                SAP & WB Change Request (SAPCR)
              </h1>
              <p className="text-sm" style={{ color: '#5C5C5C' }}>
                Request changes to SAP systems or configurations
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
                    <div className="w-12 md:w-16 h-0.5 mx-2" style={{ backgroundColor: currentStep > step.id ? '#166534' : '#D0D0D0' }} />
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
                    {/* Auto-generated Request Number */}
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 51, 102, 0.05)', border: '1px solid #D0D0D0' }}>
                      <p className="text-xs" style={{ color: '#5C5C5C' }}>Change Request No.</p>
                      <p className="font-semibold" style={{ color: '#003366' }}>{requestNumber}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Project Phase <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {SAPCR_PROJECT_PHASES.map((phase: string) => (
                          <button
                            key={phase}
                            type="button"
                            onClick={() => updateField('ProjectPhase', phase)}
                            className="p-3 rounded-lg border-2 text-center transition-all"
                            style={{
                              backgroundColor: formData.ProjectPhase === phase ? 'rgba(0, 51, 102, 0.1)' : '#FAFAFA',
                              borderColor: formData.ProjectPhase === phase ? '#003366' : '#D0D0D0',
                              color: formData.ProjectPhase === phase ? '#003366' : '#1C1C1C',
                            }}
                          >
                            <span className="font-medium text-sm">{phase}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        System <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Select value={formData.System} onValueChange={(v: string) => updateField('System', v)}>
                        <SelectTrigger className="mt-2" style={{ height: '44px', borderRadius: '8px', backgroundColor: '#E8E8E8' }}>
                          <SelectValue placeholder="Select system..." />
                        </SelectTrigger>
                        <SelectContent>
                          {SAPCR_SYSTEMS.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Division <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>Select all that apply</p>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 p-4 rounded-lg max-h-48 overflow-y-auto" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                        {SAPCR_DIVISIONS.map((div: string) => (
                          <label key={div} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.Division.includes(div)}
                              onCheckedChange={() => toggleArrayItem('Division', div)}
                            />
                            <span className="text-xs" style={{ color: '#1C1C1C' }}>{div}</span>
                          </label>
                        ))}
                      </div>
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
                        Change Description <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.ChangeDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('ChangeDescription', e.target.value)}
                        placeholder="Detailed description of the change..."
                        rows={3}
                        className="mt-2"
                        style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Module & Purpose Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C' }}>
                      Module & Purpose Selection
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Module Row 1 - SAP Modules */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        SAP Modules
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                        {SAPCR_MODULES_ROW1.map((mod: string) => (
                          <label key={mod} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.ModulesRow1.includes(mod)}
                              onCheckedChange={() => toggleArrayItem('ModulesRow1', mod)}
                            />
                            <span className="text-xs" style={{ color: '#1C1C1C' }}>{mod}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Module Row 2 - LMS */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Learning Management System
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                        {SAPCR_MODULES_ROW2.map((mod: string) => (
                          <label key={mod} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.ModulesRow2.includes(mod)}
                              onCheckedChange={() => toggleArrayItem('ModulesRow2', mod)}
                            />
                            <span className="text-xs" style={{ color: '#1C1C1C' }}>{mod}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Module Row 3 - Weighbridge */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Weighbridge Modules
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                        {SAPCR_MODULES_ROW3.map((mod: string) => (
                          <label key={mod} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.ModulesRow3.includes(mod)}
                              onCheckedChange={() => toggleArrayItem('ModulesRow3', mod)}
                            />
                            <span className="text-xs" style={{ color: '#1C1C1C' }}>{mod}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Module Row 4 - Dashboard/Others */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Other Modules
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                        {SAPCR_MODULES_ROW4.map((mod: string) => (
                          <label key={mod} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.ModulesRow4.includes(mod)}
                              onCheckedChange={() => toggleArrayItem('ModulesRow4', mod)}
                            />
                            <span className="text-xs" style={{ color: '#1C1C1C' }}>{mod}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Purpose Row 1 - SAP Purposes */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Purpose - SAP Related <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                        {SAPCR_PURPOSE_ROW1.map((purpose: string) => (
                          <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.PurposeRow1.includes(purpose)}
                              onCheckedChange={() => toggleArrayItem('PurposeRow1', purpose)}
                            />
                            <span className="text-xs" style={{ color: '#1C1C1C' }}>{purpose}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Purpose Row 2 - Other Purposes */}
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Purpose - Other
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 p-4 rounded-lg" style={{ backgroundColor: '#FAFAFA', border: '1px solid #D0D0D0' }}>
                        {SAPCR_PURPOSE_ROW2.map((purpose: string) => (
                          <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.PurposeRow2.includes(purpose)}
                              onCheckedChange={() => toggleArrayItem('PurposeRow2', purpose)}
                            />
                            <span className="text-xs" style={{ color: '#1C1C1C' }}>{purpose}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Technical Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5" style={{ color: '#003366' }} />
                    <h2 className="text-lg font-semibold" style={{ color: '#1C1C1C' }}>
                      Technical Details & Approval
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Business Justification <span style={{ color: '#9B2F23' }}>*</span>
                      </Label>
                      <Textarea
                        value={formData.BusinessJustification}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('BusinessJustification', e.target.value)}
                        placeholder="Business need and expected benefits..."
                        rows={2}
                        className="mt-2"
                        style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                        Technical Specification
                      </Label>
                      <Textarea
                        value={formData.TechnicalSpecification}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('TechnicalSpecification', e.target.value)}
                        placeholder="Technical implementation steps, objects affected, code changes..."
                        rows={3}
                        className="mt-2"
                        style={{ borderRadius: '8px', backgroundColor: '#E8E8E8' }}
                      />
                    </div>
                    
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
                          Technical Reviewer <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <UserPicker
                          value={formData.TechnicalReviewer}
                          onChange={(userId: string, person: SelectedPerson | null) => {
                            updateField('TechnicalReviewer', userId);
                            setSelectedTechReviewer(person);
                          }}
                          placeholder="Search for technical reviewer..."
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          Functional Approver <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <UserPicker
                          value={formData.FunctionalApprover}
                          onChange={(userId: string, person: SelectedPerson | null) => {
                            updateField('FunctionalApprover', userId);
                            setSelectedFuncApprover(person);
                          }}
                          placeholder="Search for functional approver..."
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>
                          CAB Approver <span style={{ color: '#9B2F23' }}>*</span>
                        </Label>
                        <UserPicker
                          value={formData.CABApprover}
                          onChange={(userId: string, person: SelectedPerson | null) => {
                            updateField('CABApprover', userId);
                            setSelectedCABApprover(person);
                          }}
                          placeholder="Search for CAB approver..."
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
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#1C1C1C' }}>Change Request Summary</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Request No.</p>
                          <p className="font-semibold" style={{ color: '#003366' }}>{requestNumber}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Project Phase</p>
                          <Badge variant="outline" style={{ backgroundColor: 'rgba(0, 51, 102, 0.1)', color: '#003366' }}>
                            {formData.ProjectPhase || 'Not selected'}
                          </Badge>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>System</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.System || 'Not selected'}</p>
                        </div>
                        <div>
                          <p style={{ color: '#5C5C5C' }}>Priority</p>
                          <Badge variant={formData.Priority === 'Critical' ? 'destructive' : formData.Priority === 'High' ? 'default' : 'secondary'}>
                            {formData.Priority}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Divisions</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>{formData.Division.join(', ') || 'None selected'}</p>
                        </div>
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Selected Modules</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>
                            {[...formData.ModulesRow1, ...formData.ModulesRow2, ...formData.ModulesRow3, ...formData.ModulesRow4].join(', ') || 'None selected'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p style={{ color: '#5C5C5C' }}>Purpose</p>
                          <p className="font-medium" style={{ color: '#1C1C1C' }}>
                            {[...formData.PurposeRow1, ...formData.PurposeRow2].join(', ') || 'None selected'}
                          </p>
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
                          This change request will be routed to {selectedTechReviewer?.displayName || 'Technical Reviewer'} first.
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
