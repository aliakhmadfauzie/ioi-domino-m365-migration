/**
 * SAPSOF2 - SAP UAT Sign-Off Form
 * Based on detailed blueprint specifications
 * 
 * Workflow:
 * Stage 1: IT Submission (Draft → Submitted)
 * Stage 2: Key User Sign-Off (KU1-KU5)
 * Stage 3: BPO Approval (Optional - BPO1-BPO3)
 * Stage 4: Final IT Review
 * Stage 5: Closed
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Send,
  Save,
  Server,
  Users,
  ClipboardCheck,
  FileText,
  Loader2,
  TestTube,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
} from 'lucide-react';

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { ApprovalRecordsService } from '@/generated/services/approval-records-service';
import { ITSAPSOFTestEvidenceService } from '@/generated/services/it-sapsof-test-evidence-service';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtSAPService } from '@/generated/services/main-dbit-ext-sap-service';
import type { ApprovalRecords } from '@/generated/models/approval-records-model';
import type { ITSAPSOFTestEvidence } from '@/generated/models/it-sapsof-test-evidence-model';
import type { MainDBITExtSAP } from '@/generated/models/main-dbit-ext-sap-model';
import { EmployeePicker } from '@/components/employee-picker';
import type { SelectedEmployee } from '@/components/employee-picker';
import { useSAPRoutingEmails } from '@/hooks/use-app-settings-lookup';
import {
  SAPSOF2_CLIENTS,
  SAPSOF2_PLANTS,
  SAPSOF2_MODULES,
  SAPSOF2_PASS_FAIL,
  generateSAPSOF2Title,
  type SAPSOF2PassFail,
  type SAPSOF2ApprovalRecord,
  type SAPSOF2TestEvidence,
} from '@/types/sap-forms';

// =============================================================================
// FORM SCHEMA
// =============================================================================

const testEvidenceSchema = z.object({
  scenarioNumber: z.number(),
  businessScenarioDescription: z.string().min(1, { error: 'Description required' }),
  tCode: z.string().min(1, { error: 'T-Code required' }),
  testParameters: z.string().optional(),
  expectedResult: z.string().min(1, { error: 'Expected result required' }),
  actualResult: z.string().min(1, { error: 'Actual result required' }),
  testerEmail: z.string().optional(),
  testerName: z.string().optional(),
  passFail: z.enum(['Pass', 'Fail']),
  evidenceAttachmentUrl: z.string().optional(),
});

const sapsof2FormSchema = z.object({
  // === Basic SAP UAT Sign-Off Information (MANDATORY) ===
  client: z.string({ error: 'Client is required' }).min(1, { error: 'Client is required' }),
  clientNumber: z.string({ error: 'Client Number is required' }).min(1, { error: 'Client Number is required' }),
  plant: z.string({ error: 'Plant is required' }).min(1, { error: 'Plant is required' }),
  moduleName: z.string({ error: 'Module is required' }).min(1, { error: 'Module is required' }),
  referenceName: z.string().optional(),
  trNumber: z.string({ error: 'TR Number is required' }).min(1, { error: 'Transport Request Number is required' }),
  itRemarks: z.string().optional(),
  itPackageAttachmentUrl: z.string().optional(),
  
  // === IT Functional Owner (MANDATORY) ===
  itFunctionalOwnerEmail: z.string({ error: 'IT Functional Owner is required' }).min(1, { error: 'IT Functional Owner is required' }),
  itFunctionalOwnerName: z.string().optional(),
  ccEmail: z.string().optional(),
  
  // === Key User Slots (At least one required) ===
  keyUser1Email: z.string().optional(),
  keyUser1Name: z.string().optional(),
  keyUser2Email: z.string().optional(),
  keyUser2Name: z.string().optional(),
  keyUser3Email: z.string().optional(),
  keyUser3Name: z.string().optional(),
  keyUser4Email: z.string().optional(),
  keyUser4Name: z.string().optional(),
  keyUser5Email: z.string().optional(),
  keyUser5Name: z.string().optional(),
  
  // === BPO Slots (Optional - triggers BPO stage if filled) ===
  bpo1Email: z.string().optional(),
  bpo1Name: z.string().optional(),
  bpo2Email: z.string().optional(),
  bpo2Name: z.string().optional(),
  bpo3Email: z.string().optional(),
  bpo3Name: z.string().optional(),
  
  // === Test Evidence (Child Table) ===
  testEvidence: z.array(testEvidenceSchema).min(1, { error: 'At least one test scenario is required' }),
}).superRefine((data, ctx) => {
  // At least one key user must be assigned
  const hasKeyUser = data.keyUser1Email || data.keyUser2Email || data.keyUser3Email || data.keyUser4Email || data.keyUser5Email;
  if (!hasKeyUser) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one Key User must be assigned',
      path: ['keyUser1Email'],
    });
  }
});

type SAPSOF2FormValues = z.infer<typeof sapsof2FormSchema>;

// =============================================================================
// FORM STEPS
// =============================================================================

const FORM_STEPS = [
  { id: 1, label: 'UAT Package Info', description: 'Basic UAT package details', icon: Server },
  { id: 2, label: 'Test Evidence', description: 'Test scenarios & results', icon: TestTube },
  { id: 3, label: 'Sign-Off Chain', description: 'Key Users & BPO approvers', icon: Users },
  { id: 4, label: 'Review & Submit', description: 'Confirm & submit', icon: ClipboardCheck },
];

function toApprovalChildRecord(
  record: SAPSOF2ApprovalRecord,
  parentId: number,
  submittedDate: string,
  bpoRequired: boolean
): Omit<ApprovalRecords, 'id'> {
  const isKeyUser = record.stage === 'KeyUser';

  return {
    stagename: `${isKeyUser ? 'Key User Sign-Off' : 'BPO Approval'} ${record.slotNumber}`,
    formid: String(parentId),
    formcode: 'SAPSOF2',
    stagenumber: isKeyUser ? 2 : 3,
    actionbyid: record.approverEmail,
    actionbyname: record.approverName || record.approverEmail,
    actiondate: submittedDate,
    actionKey: 'ActionKey3',
    comments: [
      `Slot: ${record.slotNumber}`,
      `Parent Ticket: ${record.parentId}`,
      'Decision: Pending',
      `Lock Status: ${record.lockStatus}`,
    ].join('; '),
    nextstage: isKeyUser && bpoRequired ? 'BPOApproval' : 'FinalReview',
  };
}

function toEvidenceChildRecord(
  record: SAPSOF2TestEvidence,
  parentId: number,
  parentTitle: string,
  submittedDate: string
): Omit<ITSAPSOFTestEvidence, 'id'> {
  return {
    title: record.id,
    parentFormCode: 'SAPSOF2',
    parentRecord: { id: parentId, title: parentTitle },
    evidenceTestNo: String(record.scenarioNumber),
    evidenceDescription: record.businessScenarioDescription,
    evidenceExpectedResult: record.expectedResult,
    evidenceActualResult: record.actualResult,
    evidenceStatus: record.passFail,
    evidenceTestedBy: record.testerName
      ? `${record.testerName} (${record.testerEmail || ''})`
      : record.testerEmail,
    evidenceTestedDate: submittedDate,
    evidenceRemarks: [
      `T-Code: ${record.tCode}`,
      record.testParameters ? `Test Parameters: ${record.testParameters}` : null,
      record.evidenceAttachmentUrl ? `Evidence Attachment: ${record.evidenceAttachmentUrl}` : null,
    ].filter(Boolean).join('\n'),
  };
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SAPSOF2NewFormPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useUser();
  const createSubmission = useCreateMainDBIT();
  
  // Get SAP routing emails from Config_AppSettings (DEC-004 compliance)
  const { sapAdminEmail, sapFunctionalLeads, escalationEmail } = useSAPRoutingEmails();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing form...');
  
  // Generate preview ticket ID
  const previewTicketId = useMemo(() => generateSAPSOF2Title(1), []);
  
  // Page loading sequence
  useEffect(() => {
    let isMounted = true;
    const loadingSteps = [
      { message: 'Establishing secure connection...', duration: 600 },
      { message: 'Loading SAP configuration...', duration: 500 },
      { message: 'Preparing form...', duration: 400 },
    ];
    
    const runLoadingSequence = async () => {
      for (let i = 0; i < loadingSteps.length; i++) {
        if (!isMounted) return;
        setLoadingMessage(loadingSteps[i].message);
        setLoadingProgress(((i + 1) / loadingSteps.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, loadingSteps[i].duration));
      }
      
      // Wait for user data
      const maxWait = 10000;
      const pollInterval = 200;
      const startTime = Date.now();
      
      while (isUserLoading && Date.now() - startTime < maxWait) {
        if (!isMounted) return;
        setLoadingMessage('Loading user data...');
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
      
      if (isMounted) {
        setLoadingProgress(100);
        setLoadingMessage('Ready!');
        await new Promise((resolve) => setTimeout(resolve, 200));
        setIsPageReady(true);
      }
    };
    
    runLoadingSequence();
    return () => { isMounted = false; };
  }, [isUserLoading]);
  
  const form = useForm<SAPSOF2FormValues>({
    resolver: zodResolver(sapsof2FormSchema),
    defaultValues: {
      client: '',
      clientNumber: '',
      plant: '',
      moduleName: '',
      referenceName: '',
      trNumber: '',
      itRemarks: '',
      itPackageAttachmentUrl: '',
      itFunctionalOwnerEmail: user?.userPrincipalName || '',
      itFunctionalOwnerName: user?.fullName || '',
      ccEmail: '',
      keyUser1Email: '',
      keyUser1Name: '',
      keyUser2Email: '',
      keyUser2Name: '',
      keyUser3Email: '',
      keyUser3Name: '',
      keyUser4Email: '',
      keyUser4Name: '',
      keyUser5Email: '',
      keyUser5Name: '',
      bpo1Email: '',
      bpo1Name: '',
      bpo2Email: '',
      bpo2Name: '',
      bpo3Email: '',
      bpo3Name: '',
      testEvidence: [{
        scenarioNumber: 1,
        businessScenarioDescription: '',
        tCode: '',
        testParameters: '',
        expectedResult: '',
        actualResult: '',
        testerEmail: user?.userPrincipalName || '',
        testerName: user?.fullName || '',
        passFail: 'Pass' as SAPSOF2PassFail,
        evidenceAttachmentUrl: '',
      }],
    },
  });
  
  const { fields: testEvidenceFields, append: appendTestEvidence, remove: removeTestEvidence } = useFieldArray({
    control: form.control,
    name: 'testEvidence',
  });
  
  // Update IT Functional Owner when user loads
  useEffect(() => {
    if (user) {
      form.setValue('itFunctionalOwnerEmail', user.userPrincipalName || '');
      form.setValue('itFunctionalOwnerName', user.fullName || '');
    }
  }, [user, form]);
  
  // Compute if BPO is required
  const watchBPO1 = form.watch('bpo1Email');
  const watchBPO2 = form.watch('bpo2Email');
  const watchBPO3 = form.watch('bpo3Email');
  const bpoRequired = !!(watchBPO1 || watchBPO2 || watchBPO3);
  
  // Navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  // Submit handler - creates parent form and child records
  async function onSubmit(data: SAPSOF2FormValues) {
    setIsSubmitting(true);
    try {
      const ticketId = previewTicketId;
      const submissionDate = new Date().toISOString();
      
      // =====================================================
      // CHILD LIST CREATION: Approval Records
      // When form is submitted, create Key User approval rows
      // and BPO approval rows (if BPO slots are filled)
      // =====================================================
      const approvalRecords: SAPSOF2ApprovalRecord[] = [];
      
      // Create Key User approval slots (KU1-KU5)
      const keyUserSlots = [
        { email: data.keyUser1Email, name: data.keyUser1Name, slot: 'KU1' },
        { email: data.keyUser2Email, name: data.keyUser2Name, slot: 'KU2' },
        { email: data.keyUser3Email, name: data.keyUser3Name, slot: 'KU3' },
        { email: data.keyUser4Email, name: data.keyUser4Name, slot: 'KU4' },
        { email: data.keyUser5Email, name: data.keyUser5Name, slot: 'KU5' },
      ];
      
      keyUserSlots.forEach((ku, index: number) => {
        if (ku.email) {
          approvalRecords.push({
            id: `${ticketId}-KU${index + 1}`,
            parentId: ticketId,
            stage: 'KeyUser',
            slotNumber: ku.slot as 'KU1' | 'KU2' | 'KU3' | 'KU4' | 'KU5',
            approverEmail: ku.email,
            approverName: ku.name || '',
            decision: 'Pending',
            lockStatus: 'Open',
          });
        }
      });
      
      // Create BPO approval slots (BPO1-BPO3) if filled
      const bpoSlots = [
        { email: data.bpo1Email, name: data.bpo1Name, slot: 'BPO1' },
        { email: data.bpo2Email, name: data.bpo2Name, slot: 'BPO2' },
        { email: data.bpo3Email, name: data.bpo3Name, slot: 'BPO3' },
      ];
      
      bpoSlots.forEach((bpo, index: number) => {
        if (bpo.email) {
          approvalRecords.push({
            id: `${ticketId}-BPO${index + 1}`,
            parentId: ticketId,
            stage: 'BPO',
            slotNumber: bpo.slot as 'BPO1' | 'BPO2' | 'BPO3',
            approverEmail: bpo.email,
            approverName: bpo.name || '',
            decision: 'Pending',
            lockStatus: 'Open',
          });
        }
      });
      
      // =====================================================
      // CHILD LIST CREATION: Test Evidence Records
      // Create test evidence rows from form data
      // =====================================================
      const testEvidenceRecords: SAPSOF2TestEvidence[] = data.testEvidence.map(
        (te, index: number) => ({
          id: `${ticketId}-TE${index + 1}`,
          parentId: ticketId,
          scenarioNumber: index + 1,
          businessScenarioDescription: te.businessScenarioDescription,
          tCode: te.tCode,
          testParameters: te.testParameters || '',
          expectedResult: te.expectedResult,
          actualResult: te.actualResult,
          testerEmail: te.testerEmail || user?.userPrincipalName || '',
          testerName: te.testerName || user?.fullName || '',
          passFail: te.passFail,
          evidenceAttachmentUrl: te.evidenceAttachmentUrl,
        })
      );
      
      // Build CC list from Config_AppSettings (DEC-004 compliance)
      // No hard-coded emails - all routing comes from environment settings
      const ccList = [
        data.ccEmail,
        sapAdminEmail,
        sapFunctionalLeads,
      ].filter(Boolean).join(';');
      
      const submissionData = {
        title: ticketId,
        formcode: 'SAPSOF2',
        currentStatus: 'pending-ku-sign-off',
        siteKey: 'SiteKey0' as const, // Prai
        requestoremail: user?.userPrincipalName || '',
        requestorName: user?.fullName || '',
        currentAction: 'KeyUserSignoff',
        subject: `${data.moduleName} ${data.trNumber}`.trim(),
        submitteddate: submissionDate,
        workflowstage: 2, // Key User Signoff stage
        islocked: false,
      };
      
      const createdSubmission = await createSubmission.mutateAsync(submissionData);
      const parentId = Number(createdSubmission.id);
      const createdApprovalChildren: ApprovalRecords[] = [];
      const createdEvidenceChildren: ITSAPSOFTestEvidence[] = [];
      let createdSAPChild: MainDBITExtSAP | undefined;

      try {
        createdSAPChild = await MainDBITExtSAPService.create({
          title: `${ticketId}-sap`,
          parentFormCode: 'SAPSOF2',
          parentRecord: { id: parentId, title: ticketId },
          parentSite: 'PRAI',
          sAPClient: data.clientNumber || data.client,
          sAPPlant: data.plant,
          sAPModule: data.moduleName,
          sAPTRNumber: data.trNumber,
          sAPSOFTRNumber: data.trNumber,
          sAPSOFDocTitle: data.referenceName || `${data.moduleName} UAT Sign-Off`,
          sAPSOFTestPurpose: data.itPackageAttachmentUrl || 'SAP UAT sign-off package',
          sAPSOFCurrentStage: 'KeyUserSignoff',
          sAPSOFIsBPORequired: bpoRequired ? 'Yes' : 'No',
          sAPSOFITSubmittedDate: submissionDate,
          sAPRemarks: [
            `Client: ${data.client}`,
            `Client Number: ${data.clientNumber}`,
            `Reference Name: ${data.referenceName || 'N/A'}`,
            `IT Remarks: ${data.itRemarks || 'N/A'}`,
            `IT Package Attachment: ${data.itPackageAttachmentUrl || 'N/A'}`,
            `IT Functional Owner: ${data.itFunctionalOwnerName || 'N/A'} (${data.itFunctionalOwnerEmail})`,
            `CC: ${ccList || 'N/A'}`,
            `Key Users: ${keyUserSlots.filter((ku) => ku.email).map((ku) => `${ku.slot}: ${ku.name || ''} (${ku.email})`).join('; ') || 'N/A'}`,
            `BPO Approvers: ${bpoSlots.filter((bpo) => bpo.email).map((bpo) => `${bpo.slot}: ${bpo.name || ''} (${bpo.email})`).join('; ') || 'N/A'}`,
            `Total Test Scenarios: ${testEvidenceRecords.length}`,
            `Total Approval Slots: ${approvalRecords.length}`,
            `SAP Admin Email: ${sapAdminEmail || 'N/A'}`,
            `SAP Functional Leads: ${sapFunctionalLeads || 'N/A'}`,
            `Escalation Email: ${escalationEmail || 'N/A'}`,
          ].join('\n'),
        });

        for (const approvalRecord of approvalRecords) {
          createdApprovalChildren.push(
            await ApprovalRecordsService.create(
              toApprovalChildRecord(approvalRecord, parentId, submissionDate, bpoRequired)
            )
          );
        }

        for (const testEvidenceRecord of testEvidenceRecords) {
          createdEvidenceChildren.push(
            await ITSAPSOFTestEvidenceService.create(
              toEvidenceChildRecord(testEvidenceRecord, parentId, ticketId, submissionDate)
            )
          );
        }
      } catch (childError) {
        await Promise.allSettled([
          ...createdEvidenceChildren.map((child) =>
            ITSAPSOFTestEvidenceService.delete(String(child.id))
          ),
          ...createdApprovalChildren.map((child) =>
            ApprovalRecordsService.delete(String(child.id))
          ),
          createdSAPChild
            ? MainDBITExtSAPService.delete(String(createdSAPChild.id))
            : Promise.resolve(),
        ]);
        await MainDBITService.delete(String(createdSubmission.id));
        throw childError;
      }
      
      toast.success('UAT Sign-Off package submitted!', {
        description: `${ticketId} has been sent to Key Users for sign-off. ${approvalRecords.length} approval slots and ${testEvidenceRecords.length} test scenarios created.`,
      });
      
      navigate('/it/sap');
    } catch (error: unknown) {
      console.error('Submission error:', error);
      toast.error('Failed to submit UAT package', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  async function saveDraft() {
    setIsSavingDraft(true);
    try {
      const data = form.getValues();
      console.log('Draft saved:', data);
      toast.success('Draft saved successfully');
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  }
  
  // Add new test evidence row
  const addTestEvidence = () => {
    appendTestEvidence({
      scenarioNumber: testEvidenceFields.length + 1,
      businessScenarioDescription: '',
      tCode: '',
      testParameters: '',
      expectedResult: '',
      actualResult: '',
      testerEmail: user?.userPrincipalName || '',
      testerName: user?.fullName || '',
      passFail: 'Pass',
      evidenceAttachmentUrl: '',
    });
  };
  
  // Loading screen
  if (!isPageReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 p-8"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-2xl bg-primary"
              style={{ transform: 'scale(1.5)' }}
            />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-[#003366] to-blue-700 flex items-center justify-center shadow-lg">
              <ClipboardCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-8 w-8 text-[#003366]" />
          </motion.div>
          
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-foreground">Loading SAP UAT Sign-Off Form</p>
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
          </div>
          
          <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-[#003366] to-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/it/sap')}
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    SAP UAT Sign-Off
                  </h1>
                  <Badge variant="outline" className="text-xs font-mono">SAPSOF2</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Ref: <span className="font-mono">{previewTicketId}</span>
                  <span className="text-muted-foreground"> (preview)</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveDraft}
                disabled={isSavingDraft}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSavingDraft ? 'Saving...' : 'Save Draft'}
              </Button>
              {currentStep === FORM_STEPS.length && (
                <Button
                  size="sm"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="bg-primary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Package'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Progress Steps */}
      <motion.div variants={fadeInUp} className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {FORM_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                        isCompleted && "bg-green-600 text-white",
                        isCurrent && "bg-primary text-primary-foreground",
                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <span className={cn(
                      "text-xs mt-2 font-medium hidden md:block",
                      (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {index < FORM_STEPS.length - 1 && (
                    <div className={cn(
                      "w-16 md:w-24 h-0.5 mx-2",
                      isCompleted ? "bg-green-600" : "bg-muted"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
      
      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: UAT Package Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Server className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">UAT Package Information</CardTitle>
                          <CardDescription>Basic SAP UAT Sign-Off details</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Client & Client Number */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="client"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">
                                Client <span className="text-destructive">*</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select SAP client..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SAPSOF2_CLIENTS.map((c: string) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="clientNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">
                                Client Number <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 200" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Plant */}
                      <FormField
                        control={form.control}
                        name="plant"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Plant <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select plant..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SAPSOF2_PLANTS.map((p: string) => (
                                  <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Module */}
                      <FormField
                        control={form.control}
                        name="moduleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Module Name <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select SAP module..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SAPSOF2_MODULES.map((m: string) => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Reference & TR Number */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="referenceName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reference Name (SSR/CR/PRF)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., PRF-2026-0042" className="bg-white" />
                              </FormControl>
                              <FormDescription className="text-xs">Link to related request</FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="trNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">
                                Transport Request Number <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., IOIK900123" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* IT Remarks */}
                      <FormField
                        control={form.control}
                        name="itRemarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IT Remarks</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Notes from IT..." rows={3} className="bg-white" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {/* IT Package Attachment */}
                      <FormField
                        control={form.control}
                        name="itPackageAttachmentUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IT Package Attachment</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Link to package or evidence..." className="bg-white" />
                            </FormControl>
                            <FormDescription className="text-xs">SharePoint or OneDrive link to UAT package</FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <Separator />
                      
                      {/* IT Functional Owner */}
                      <FormField
                        control={form.control}
                        name="itFunctionalOwnerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              IT Functional Owner <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <EmployeePicker
                                label=""
                                value={field.value}
                                onChange={(email: string, employee: SelectedEmployee | null) => {
                                  field.onChange(email);
                                  form.setValue('itFunctionalOwnerName', employee?.fullName || '');
                                }}
                                placeholder="Search for IT functional owner..."
                              />
                            </FormControl>
                            <FormDescription className="text-xs">IT person submitting the UAT package</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* CC Email */}
                      <FormField
                        control={form.control}
                        name="ccEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CC Email</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Additional recipients (comma separated)" className="bg-white" />
                            </FormControl>
                            <FormDescription className="text-xs">People who should receive notifications</FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 2: Test Evidence */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <TestTube className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Test Evidence</CardTitle>
                            <CardDescription>Test scenarios and results per Key User</CardDescription>
                          </div>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addTestEvidence}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Scenario
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {testEvidenceFields.map((field, index) => (
                          <Card key={field.id} className="border-dashed">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Test Scenario #{index + 1}</CardTitle>
                                {testEvidenceFields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => removeTestEvidence(index)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`testEvidence.${index}.businessScenarioDescription`}
                                  render={({ field: f }) => (
                                    <FormItem className="col-span-2">
                                      <FormLabel className="font-semibold">Business Scenario Description <span className="text-destructive">*</span></FormLabel>
                                      <FormControl>
                                        <Textarea {...f} placeholder="Describe the business scenario..." rows={2} className="bg-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`testEvidence.${index}.tCode`}
                                  render={({ field: f }) => (
                                    <FormItem>
                                      <FormLabel className="font-semibold">T-Code <span className="text-destructive">*</span></FormLabel>
                                      <FormControl>
                                        <Input {...f} placeholder="e.g., VA01" className="bg-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`testEvidence.${index}.testParameters`}
                                  render={({ field: f }) => (
                                    <FormItem>
                                      <FormLabel>Test Parameters</FormLabel>
                                      <FormControl>
                                        <Input {...f} placeholder="Input parameters..." className="bg-white" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`testEvidence.${index}.expectedResult`}
                                  render={({ field: f }) => (
                                    <FormItem>
                                      <FormLabel className="font-semibold">Expected Result <span className="text-destructive">*</span></FormLabel>
                                      <FormControl>
                                        <Textarea {...f} placeholder="What should happen..." rows={2} className="bg-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`testEvidence.${index}.actualResult`}
                                  render={({ field: f }) => (
                                    <FormItem>
                                      <FormLabel className="font-semibold">Actual Result <span className="text-destructive">*</span></FormLabel>
                                      <FormControl>
                                        <Textarea {...f} placeholder="What actually happened..." rows={2} className="bg-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`testEvidence.${index}.passFail`}
                                  render={({ field: f }) => (
                                    <FormItem>
                                      <FormLabel className="font-semibold">Pass/Fail <span className="text-destructive">*</span></FormLabel>
                                      <div className="flex gap-2 mt-2">
                                        {SAPSOF2_PASS_FAIL.map((status: SAPSOF2PassFail) => (
                                          <button
                                            key={status}
                                            type="button"
                                            onClick={() => f.onChange(status)}
                                            className={cn(
                                              "flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2",
                                              f.value === status
                                                ? status === 'Pass'
                                                  ? "border-green-600 bg-green-50 text-green-700"
                                                  : "border-red-600 bg-red-50 text-red-700"
                                                : "border-border bg-white hover:bg-muted/50"
                                            )}
                                          >
                                            {status === 'Pass' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                            <span className="font-medium">{status}</span>
                                          </button>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`testEvidence.${index}.evidenceAttachmentUrl`}
                                  render={({ field: f }) => (
                                    <FormItem>
                                      <FormLabel>Evidence Attachment</FormLabel>
                                      <FormControl>
                                        <Input {...f} placeholder="Link to screenshot/evidence..." className="bg-white" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 3: Sign-Off Chain */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Key Users Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Key User Sign-Off (KU1-KU5)</CardTitle>
                          <CardDescription>At least one Key User is required. Slots lock after approval.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[1, 2, 3, 4, 5].map((slot) => (
                        <FormField
                          key={slot}
                          control={form.control}
                          name={`keyUser${slot}Email` as keyof SAPSOF2FormValues}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={slot === 1 ? "font-semibold" : ""}>
                                Key User {slot} (KU{slot})
                                {slot === 1 && <span className="text-destructive"> *</span>}
                              </FormLabel>
                              <FormControl>
                                <EmployeePicker
                                  label=""
                                  value={field.value as string}
                                  onChange={(email: string, employee: SelectedEmployee | null) => {
                                    field.onChange(email);
                                    form.setValue(`keyUser${slot}Name` as keyof SAPSOF2FormValues, (employee?.fullName || '') as never);
                                  }}
                                  placeholder={`Search for Key User ${slot}...`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* BPO Approvers Section */}
                  <Card className={bpoRequired ? "border-amber-300 bg-amber-50/50" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">BPO Approval (Optional)</CardTitle>
                            <CardDescription>If any BPO slot is filled, BPO approval stage will be required.</CardDescription>
                          </div>
                        </div>
                        {bpoRequired && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            BPO Stage Enabled
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[1, 2, 3].map((slot) => (
                        <FormField
                          key={slot}
                          control={form.control}
                          name={`bpo${slot}Email` as keyof SAPSOF2FormValues}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BPO Approver {slot} (BPO{slot})</FormLabel>
                              <FormControl>
                                <EmployeePicker
                                  label=""
                                  value={field.value as string}
                                  onChange={(email: string, employee: SelectedEmployee | null) => {
                                    field.onChange(email);
                                    form.setValue(`bpo${slot}Name` as keyof SAPSOF2FormValues, (employee?.fullName || '') as never);
                                  }}
                                  placeholder={`Search for BPO ${slot}...`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <ClipboardCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Review & Submit</CardTitle>
                          <CardDescription>Confirm all details before submitting the UAT package</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* UAT Package Summary */}
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        <h4 className="font-semibold mb-3">UAT Package Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Client</p>
                            <p className="font-medium">{form.watch('client') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Client Number</p>
                            <p className="font-medium">{form.watch('clientNumber') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Plant</p>
                            <p className="font-medium">{form.watch('plant') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Module</p>
                            <Badge variant="secondary">{form.watch('moduleName') || '-'}</Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">TR Number</p>
                            <p className="font-mono font-medium text-primary">{form.watch('trNumber') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reference</p>
                            <p className="font-medium">{form.watch('referenceName') || '-'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Test Evidence Summary */}
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        <h4 className="font-semibold mb-3">Test Evidence ({testEvidenceFields.length} scenario{testEvidenceFields.length > 1 ? 's' : ''})</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              <TableHead>Scenario</TableHead>
                              <TableHead className="w-24">T-Code</TableHead>
                              <TableHead className="w-24">Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {testEvidenceFields.map((field, index) => {
                              const evidence = form.watch(`testEvidence.${index}`);
                              return (
                                <TableRow key={field.id}>
                                  <TableCell className="font-mono">{index + 1}</TableCell>
                                  <TableCell className="max-w-xs truncate">{evidence.businessScenarioDescription || '-'}</TableCell>
                                  <TableCell className="font-mono">{evidence.tCode || '-'}</TableCell>
                                  <TableCell>
                                    <Badge className={cn(
                                      evidence.passFail === 'Pass' 
                                        ? "bg-green-100 text-green-800 border-green-300"
                                        : "bg-red-100 text-red-800 border-red-300"
                                    )}>
                                      {evidence.passFail === 'Pass' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                      {evidence.passFail}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {/* Sign-Off Chain Summary */}
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        <h4 className="font-semibold mb-3">Sign-Off Chain</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Key Users</p>
                            <div className="flex flex-wrap gap-2">
                              {[1, 2, 3, 4, 5].map((slot) => {
                                const email = form.watch(`keyUser${slot}Email` as keyof SAPSOF2FormValues) as string;
                                const name = form.watch(`keyUser${slot}Name` as keyof SAPSOF2FormValues) as string;
                                if (!email) return null;
                                return (
                                  <Badge key={slot} variant="outline" className="py-1">
                                    <Users className="h-3 w-3 mr-1" />
                                    KU{slot}: {name || email}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                          {bpoRequired && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">BPO Approvers</p>
                              <div className="flex flex-wrap gap-2">
                                {[1, 2, 3].map((slot) => {
                                  const email = form.watch(`bpo${slot}Email` as keyof SAPSOF2FormValues) as string;
                                  const name = form.watch(`bpo${slot}Name` as keyof SAPSOF2FormValues) as string;
                                  if (!email) return null;
                                  return (
                                    <Badge key={slot} variant="outline" className="py-1 border-amber-300 bg-amber-50">
                                      <FileText className="h-3 w-3 mr-1" />
                                      BPO{slot}: {name || email}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Workflow Preview */}
                      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                        <h4 className="font-semibold mb-3 text-primary">Workflow Preview</h4>
                        <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
                          <Badge className="bg-primary text-primary-foreground">IT Submission</Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Badge variant="outline">Key User Sign-Off</Badge>
                          {bpoRequired && (
                            <>
                              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <Badge variant="outline" className="border-amber-300 bg-amber-50">BPO Approval</Badge>
                            </>
                          )}
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Badge variant="outline">Final IT Review</Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Badge variant="outline" className="border-green-300 bg-green-50">Closed</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < FORM_STEPS.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit UAT Package'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
