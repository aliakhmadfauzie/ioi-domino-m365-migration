import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  ChevronRight,
  Building2,
  Tag,
  FileText,
  MapPin,
  Server,
  Mail,
  History,
  Paperclip,
  RotateCcw,
  Download,
  UserCheck,
  Shield,
  Ban,
  Undo2,
  AlertTriangle,
  Copy,
  Printer,
  ExternalLink,
  RefreshCw,
  Activity,
  Edit3,
  Flag,
  AtSign,
  FolderOpen,
  Globe,
  Key,
  Briefcase,
  Hash,
  Monitor,
  Database,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useMainDBITList, useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtAccessList } from '@/generated/hooks/use-main-dbitext-access';
import { useMainDBITExtSupportList } from '@/generated/hooks/use-main-dbitext-support';
import { useWorkflowAuditLogList } from '@/generated/hooks/use-workflow-audit-log';
import type { ApprovalRecords, ApprovalRecordsActionKey } from '@/generated/models/approval-records-model';
import { ApprovalRecordsActionKeyToLabel } from '@/generated/models/approval-records-model';
import type { WorkflowAuditLog } from '@/generated/models/workflow-audit-log-model';
// ITFormDefinition table was removed from data model - using static form code labels
import {
  MainDBITCurrentstatusKeyToLabel,
  MainDBITSiteKeyToLabel,
  MainDBITEnvironmenttagKeyToLabel,
  type MainDBITCurrentstatusKey,
  type MainDBIT,
  type MainDBITSiteKey,
  type MainDBITEnvironmenttagKey,
} from '@/generated/models/main-dbit-model';
import { ApprovalWorkflowPanel } from '@/components/workflow/approval-workflow-panel';
import { StageProgress } from '@/components/workflow/stage-progress';
import { getModuleWorkflow, type ModuleWorkflowConfig } from '@/config/module-workflows';
import { format } from 'date-fns';
import { statusConfig, isPendingStatus, isTerminalStatus, getStatusLabel } from '@/lib/status-utils';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { PageLoading } from '@/components/page-loading';
import { EditRequestModal } from '@/components/workflow/edit-request-modal';
import { getEditRequestFromRemarks, getEditStateFromRemarks } from '@/hooks/use-edit-request';
import { useRoleAccess } from '@/hooks/use-platform';
import { DynamicSubmissionDetails } from '@/components/submission-details';
import { useApprovalRecordsList } from '@/generated/hooks/use-approval-records';

import { DataFieldRow, DataFieldGrid } from '@/components/submission/data-field-row';
import { ApprovalMatrix } from '@/components/submission/approval-matrix';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
} as const;

// Form code display names
const formCodeLabels: Record<string, string> = {
  // M1 — User & Access Management
  'EAF':   'External Access Form',
  'NIR':   'Notes ID Request',
  'RS':    'Reset Password / Unlock ID',
  'SFAR':  'Share Folder Access Request',
  'UR':    'User ID Requisition',
  // M2 — IT Support & Service Requests
  'ITSSR': 'IT Support & Service Request',
  'IAL1':  'Server Reboot Log',
  'IAL2':  'Data Center Access Log',
  'IAL3':  'IT Event Log',
  'IAL4':  'Server Records',
  'IAL5':  'Data Restoration Request',
  'ITDR':  'IT Daily Report',
  'ITDR2': 'Outstanding Tasks Register',
  'PRF':   'Program Request Form',
};

// Forms that have their own section-based detail screens.
// These use a workflow of locked/unlocked sections, not generic Approve/Reject.
const SECTION_BASED_FORM_ROUTES: Record<string, (id: string) => string> = {
  ITSSR: (id) => `/it/forms/itssr/${id}`,
};

function getSortedWorkflowStages(workflow?: ModuleWorkflowConfig) {
  return [...(workflow?.stages ?? [])].sort((a, b) => a.order - b.order);
}

function resolveWorkflowStageIndex(submission: MainDBIT, workflow?: ModuleWorkflowConfig) {
  const stages = getSortedWorkflowStages(workflow);
  if (stages.length === 0) return 0;

  const status = String(submission.currentStatus || '');
  const directIndex = stages.findIndex((stage) => stage.key === status || stage.name === status);
  if (directIndex >= 0) return directIndex;

  const numericStage = Number(submission.workflowstage);
  if (Number.isFinite(numericStage) && numericStage > 0) {
    const byOrder = stages.findIndex((stage) => stage.order === numericStage);
    if (byOrder >= 0) return byOrder;

    const oneBasedIndex = numericStage - 1;
    if (oneBasedIndex >= 0 && oneBasedIndex < stages.length) return oneBasedIndex;
  }

  return 0;
}

function getWorkflowProgressStages(submission: MainDBIT, workflow?: ModuleWorkflowConfig) {
  const stages = getSortedWorkflowStages(workflow);
  const currentStageIndex = resolveWorkflowStageIndex(submission, workflow);
  const statusText = String(submission.currentStatus || '').toLowerCase();
  const isRejected = statusText.includes('reject') || statusText.includes('denied');

  return stages.map((stage, index) => ({
    key: stage.key,
    name: stage.name,
    status: isRejected && index === currentStageIndex
      ? 'rejected' as const
      : index < currentStageIndex
        ? 'completed' as const
        : index === currentStageIndex
          ? 'active' as const
          : 'pending' as const,
    assignee: stage.actor,
  }));
}

// Helper: look up the old-style status key from a plain text status label
function statusTextToKey(statusText: string): string {
  const entry = Object.entries(MainDBITCurrentstatusKeyToLabel).find(
    ([_, label]) => label === statusText
  );
  return entry?.[0] ?? '';
}

// Resolve icon for a status value based on its type and semantic meaning
function getStatusIcon(statusText: string) {
  const statusKey = statusTextToKey(statusText) as MainDBITCurrentstatusKey;
  const cfg = statusKey ? statusConfig[statusKey] : undefined;
  if (!cfg) return FileText;
  if (cfg.type === 'initial') return FileText;
  if (cfg.type === 'in-progress') return Clock;
  // Terminal statuses
  if (statusKey === 'CurrentstatusKey6' || statusText === 'Withdrawn') return XCircle;
  if (statusKey === 'CurrentstatusKey2' || statusText === 'Closed') return XCircle;
  if (statusKey === 'CurrentstatusKey0' || statusText === 'Active') return Activity;
  return CheckCircle2;
}

// Build full status config (label + colors + icon) for a status value
function getStatusDisplay(statusText: string) {
  const statusKey = statusTextToKey(statusText) as MainDBITCurrentstatusKey;
  const cfg = statusKey ? statusConfig[statusKey] : undefined;
  const label = MainDBITCurrentstatusKeyToLabel[statusKey as MainDBITCurrentstatusKey] || statusText || 'Unknown';
  return {
    label,
    color: cfg?.color ?? 'text-muted-foreground',
    bgColor: cfg?.bgColor ?? 'bg-muted',
    icon: getStatusIcon(statusText),
  };
}

// Extract priority from remarks JSON
function getPriorityFromRemarks(remarks: string | undefined): { label: string; color: string; bgColor: string } {
  if (!remarks) return { label: 'Normal', color: 'text-accent-foreground', bgColor: 'bg-accent' };
  try {
    const data = JSON.parse(remarks);
    const priority = (data.priority || 'Normal').toLowerCase();
    switch (priority) {
      case 'critical': return { label: 'Critical', color: 'text-destructive-foreground', bgColor: 'bg-destructive' };
      case 'high': return { label: 'High', color: 'text-accent-foreground', bgColor: 'bg-accent' };
      case 'low': return { label: 'Low', color: 'text-muted-foreground', bgColor: 'bg-muted' };
      default: return { label: 'Normal', color: 'text-secondary-foreground', bgColor: 'bg-secondary' };
    }
  } catch {
    return { label: 'Normal', color: 'text-secondary-foreground', bgColor: 'bg-secondary' };
  }
}

// Sidebar field row — uses DataFieldRow under the hood
function SidebarField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) {
  return <DataFieldRow label={label} value={value} icon={Icon} />;
}

// Extract additional form data from remarks JSON
interface ApproverInfo {
  id?: string;
  name?: string;
  email?: string;
}

interface AttachmentInfo {
  name: string;
  size: number;
  type: string;
}

interface FormDataRemarks {
  priority?: string;
  approvers?: {
    approver?: ApproverInfo;
    hod?: ApproverInfo;
    manager?: ApproverInfo;
  };
  attachments?: AttachmentInfo[];
  [key: string]: unknown;
}

function getFormDataFromRemarks(remarks: string | undefined): FormDataRemarks {
  if (!remarks) return {};
  try {
    return JSON.parse(remarks) as FormDataRemarks;
  } catch {
    return {};
  }
}

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for dialogs
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showEditRequestModal, setShowEditRequestModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  // Fetch the specific record by ID using OData filter
  const { data: allRecords = [], isLoading } = useMainDBITList({
    filter: id ? `id eq ${id}` : undefined,
  });
  const updateMutation = useUpdateMainDBIT();


  // Fetch workflow audit logs for this submission
  const { data: auditLogs = [] } = useWorkflowAuditLogList({
    filter: id ? `requestItemID eq '${id}'` : undefined,
  });

  // Fetch approval records for history timeline
  const { data: approvalRecords = [] } = useApprovalRecordsList({
    filter: id ? `formid eq '${id}'` : undefined,
  });

  // Fetch extension records for form-specific detail views
  const { data: extAccessRecords = [] } = useMainDBITExtAccessList({
    filter: id ? `parentRecord/ID eq ${id}` : undefined,
  });
  const { data: extSupportRecords = [] } = useMainDBITExtSupportList({
    filter: id ? `parentRecord/ID eq ${id}` : undefined,
  });

  // Filter audit logs for this submission - match by requestItemID
  const submissionHistory = auditLogs
    .filter((log: WorkflowAuditLog) => log.requestItemID && String(log.requestItemID) === id)
    .sort((a: WorkflowAuditLog, b: WorkflowAuditLog) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA; // Most recent first
    });

  // Filter approval records for this submission - match by formid
  const filteredApprovalRecords = approvalRecords
    .filter((record: ApprovalRecords) => record.formid && String(record.formid) === id)
    .sort((a: ApprovalRecords, b: ApprovalRecords) => {
      // Sort by stage number first, then by action date
      if (a.stagenumber !== b.stagenumber) {
        return (a.stagenumber || 0) - (b.stagenumber || 0);
      }
      const dateA = a.actiondate ? new Date(a.actiondate).getTime() : 0;
      const dateB = b.actiondate ? new Date(b.actiondate).getTime() : 0;
      return dateA - dateB;
    });
  // Check if current user has approver role
  const { canApprove } = useRoleAccess();

  // Find the specific record by ID (handle both number and string IDs)
  const submission = allRecords.find((r: MainDBIT) => String(r.id) === id);

  // Form definition from form code labels (ITFormDefinition table was removed)
  const formDef = submission
    ? { name: formCodeLabels[submission.formcode] || submission.formcode }
    : null;

  // Check if this form has a module workflow config
  const moduleWorkflow = submission ? getModuleWorkflow(submission.formcode) : undefined;
  const hasModuleWorkflow = !!moduleWorkflow;
  const workflowStages = submission ? getWorkflowProgressStages(submission, moduleWorkflow) : [];
  const currentWorkflowStageIndex = submission ? resolveWorkflowStageIndex(submission, moduleWorkflow) : 0;
  const activeWorkflowStage = getSortedWorkflowStages(moduleWorkflow)[currentWorkflowStageIndex];

  // Build structured field display from submission data
  const structuredFields = useMemo(() => {
    if (!submission) return [];
    const fields: { label: string; value: string | number | undefined | null; icon: React.ElementType }[] = [];

    // Common fields across all forms
    if (submission.formcode) fields.push({ label: 'Form Code', value: submission.formcode, icon: Tag });
    if (submission.company) fields.push({ label: 'Company', value: submission.company, icon: Building2 });
    if (submission.subject && submission.formcode !== 'EAF') fields.push({ label: 'Subject', value: submission.subject, icon: FileText });
    if (submission.siteKey) {
      const siteLabel = MainDBITSiteKeyToLabel[submission.siteKey as MainDBITSiteKey];
      if (siteLabel) fields.push({ label: 'Site', value: siteLabel, icon: MapPin });
    }
    if (submission.environmenttagKey) {
      const envLabel = MainDBITEnvironmenttagKeyToLabel[submission.environmenttagKey as MainDBITEnvironmenttagKey];
      if (envLabel) fields.push({ label: 'Environment', value: envLabel, icon: Server });
    }
    if (submission.workflowstage !== undefined && submission.workflowstage !== null) {
      fields.push({ label: 'Workflow Stage', value: submission.workflowstage, icon: Activity });
    }

    // Form-specific fields — shown only for matching formCode
    if (submission.formcode === 'NIR') {
      if (submission.nIRFullName) fields.push({ label: 'Full Name', value: submission.nIRFullName, icon: User });
      if (submission.nIRDepartment) fields.push({ label: 'Department', value: submission.nIRDepartment, icon: Building2 });
      if (submission.nIRRequestType) fields.push({ label: 'Request Type', value: submission.nIRRequestType, icon: FileText });
      if (submission.nIREmployeeNumber) fields.push({ label: 'Employee No.', value: submission.nIREmployeeNumber, icon: Hash });
      if (submission.nIRDesignation) fields.push({ label: 'Designation', value: submission.nIRDesignation, icon: Briefcase });
      if (submission.nIRPhoneExtension) fields.push({ label: 'Phone Ext.', value: submission.nIRPhoneExtension, icon: Phone });
      if (submission.nIRExistingEmailAddress) fields.push({ label: 'Existing Email', value: submission.nIRExistingEmailAddress, icon: AtSign });
      if (submission.nIRHODApprovalStatus) fields.push({ label: 'HOD Status', value: submission.nIRHODApprovalStatus, icon: Shield });
      if (submission.nIRNotesAdminStatus) fields.push({ label: 'Notes Admin Status', value: submission.nIRNotesAdminStatus, icon: Shield });
      if (submission.nIRITHardwareStatus) fields.push({ label: 'IT Hardware Status', value: submission.nIRITHardwareStatus, icon: Monitor });
    }

    if (submission.formcode === 'HI') {
      if (submission.hITagNo) fields.push({ label: 'Tag No', value: submission.hITagNo, icon: Tag });
      if (submission.hIAssetNo) fields.push({ label: 'Asset No', value: submission.hIAssetNo, icon: Hash });
      if (submission.hIType) fields.push({ label: 'Type', value: submission.hIType, icon: Monitor });
      if (submission.hIComputerName) fields.push({ label: 'Computer Name', value: submission.hIComputerName, icon: Monitor });
      if (submission.hICompany) fields.push({ label: 'Company', value: submission.hICompany, icon: Building2 });
      if (submission.hIUsedByEmail) fields.push({ label: 'Used By', value: submission.hIUsedByEmail, icon: Mail });
      if (submission.hILocation) fields.push({ label: 'Location', value: submission.hILocation, icon: MapPin });
      if (submission.hIDepartment) fields.push({ label: 'Department', value: submission.hIDepartment, icon: Building2 });
      if (submission.hISerialNo) fields.push({ label: 'Serial No', value: submission.hISerialNo, icon: Hash });
      if (submission.hIPurchaseDate) fields.push({ label: 'Purchase Date', value: submission.hIPurchaseDate ? format(new Date(submission.hIPurchaseDate), 'MMM d, yyyy') : undefined, icon: Calendar });
      if (submission.hIVendor) fields.push({ label: 'Vendor', value: submission.hIVendor, icon: Building2 });
      if (submission.hIStatus) fields.push({ label: 'HI Status', value: submission.hIStatus, icon: Activity });
    }

    if (submission.formcode === 'PRF') {
      if (submission.pRFRequestNo) fields.push({ label: 'PRF No', value: submission.pRFRequestNo, icon: Hash });
      if (submission.pRFRequestType) fields.push({ label: 'PRF Type', value: submission.pRFRequestType, icon: FileText });
      if (submission.pRFPriority) fields.push({ label: 'Priority', value: submission.pRFPriority, icon: Flag });
      if (submission.pRFObjective) fields.push({ label: 'Objective', value: submission.pRFObjective, icon: FileText });
    }

    if (submission.formcode === 'RS') {
      if (submission.rSUserName) fields.push({ label: 'User Name', value: submission.rSUserName, icon: User });
      if (submission.rSDesignation) fields.push({ label: 'Designation', value: submission.rSDesignation, icon: Briefcase });
      if (submission.rSCompany) fields.push({ label: 'Company', value: submission.rSCompany, icon: Building2 });
      if (submission.rSDepartment) fields.push({ label: 'Department', value: submission.rSDepartment, icon: Building2 });
      if (submission.rSResetType) fields.push({ label: 'Reset Type', value: submission.rSResetType, icon: RotateCcw });
      if (submission.rSRequestType) fields.push({ label: 'RS Request Type', value: submission.rSRequestType, icon: FileText });
      if (submission.rSAssignedPICEmail) fields.push({ label: 'Assigned PIC', value: submission.rSAssignedPICEmail, icon: Mail });
    }

    if (submission.formcode === 'SFAR') {
      if (submission.sFARCompany) fields.push({ label: 'SFAR Company', value: submission.sFARCompany, icon: Building2 });
      if (submission.sFARDepartment) fields.push({ label: 'SFAR Dept', value: submission.sFARDepartment, icon: Building2 });
      if (submission.sFARServerName) fields.push({ label: 'Server Name', value: submission.sFARServerName, icon: Server });
      if (submission.sFARRequestType) fields.push({ label: 'SFAR Type', value: submission.sFARRequestType, icon: FileText });
      if (submission.sFARFolderType) fields.push({ label: 'Folder Type', value: submission.sFARFolderType, icon: FolderOpen });
      if (submission.sFAROwner) fields.push({ label: 'Owner', value: submission.sFAROwner, icon: User });
    }

    if (submission.formcode === 'UR') {
      if (submission.uRRequestType) fields.push({ label: 'UR Type', value: submission.uRRequestType, icon: FileText });
      if (submission.uREmployeeNumber) fields.push({ label: 'Employee No', value: submission.uREmployeeNumber, icon: Hash });
      if (submission.uRDesignation) fields.push({ label: 'Designation', value: submission.uRDesignation, icon: Briefcase });
      if (submission.uRCompany) fields.push({ label: 'Company', value: submission.uRCompany, icon: Building2 });
      if (submission.uREmailAddress) fields.push({ label: 'Email', value: submission.uREmailAddress, icon: Mail });
      if (submission.uRBankName) fields.push({ label: 'Bank Name', value: submission.uRBankName, icon: Building2 });
      if (submission.uRSystemAccess) fields.push({ label: 'System Access', value: submission.uRSystemAccess, icon: Key });
    }

    return fields;
  }, [submission]);

  if (isLoading) {
    return <PageLoading message="Loading submission details..." />;
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full border-border shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Submission Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The submission you're looking for doesn't exist or has been removed.
              </p>
              <Button
                onClick={() => navigate('/my-submissions')}
                className="bg-primary hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(submission.currentStatus);
  const StatusIcon = statusDisplay.icon;
  const priorityConfig = getPriorityFromRemarks(submission.remarks);
  const formData = getFormDataFromRemarks(submission.remarks);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Sticky Header with Breadcrumb + Action Bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
        <div className="px-5 py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/my-submissions" className="hover:text-foreground transition-colors">
              My Submissions
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{submission.title || `#${submission.id}`}</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/my-submissions')}
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-bold text-foreground truncate">
                {formCodeLabels[submission.formcode] || submission.formcode || 'Submission Details'}
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Status Badge */}
              <Badge className={`${statusDisplay.bgColor} ${statusDisplay.color} border-0 px-2.5 py-1 text-xs font-semibold`}>
                <StatusIcon className="h-3.5 w-3.5 mr-1" />
                {statusDisplay.label}
              </Badge>

              {/* Action Toolbar — pinned to header */}
              <div className="hidden sm:flex items-center gap-1 ml-2 pl-2 border-l border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/submissions/${submission.id}`);
                    toast.success('Link copied');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dynamic Form-Specific Submission Details */}
            <motion.div variants={itemVariants}>
              <DynamicSubmissionDetails
                submission={submission}
                dataSource="IT"
                approvals={filteredApprovalRecords}
                extAccessRecords={extAccessRecords}
                extSupportRecords={extSupportRecords}
                showWorkflow={hasModuleWorkflow}
                showHistory={true}
              />
            </motion.div>

            {/* Attachments Card - Always show */}
            <motion.div variants={itemVariants}>
              <Card className="border-border shadow-sm">
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                    <Paperclip className="h-5 w-5 text-primary" />
                    Attachments {formData.attachments && formData.attachments.length > 0 && `(${formData.attachments.length})`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5">
                  {formData.attachments && formData.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {formData.attachments.map((attachment: AttachmentInfo, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {attachment.size < 1024
                                  ? `${attachment.size} B`
                                  : attachment.size < 1024 * 1024
                                  ? `${(attachment.size / 1024).toFixed(1)} KB`
                                  : `${(attachment.size / (1024 * 1024)).toFixed(1)} MB`}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Paperclip className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No attachments</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">No files have been attached to this submission</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Timeline — compact version */}
            {submissionHistory.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      Activity Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {submissionHistory.slice(0, 5).map((log: WorkflowAuditLog, index: number) => {
                        const actionLower = (log.actionTaken || '').toLowerCase();
                        let color = 'text-muted-foreground';
                        let Icon = Clock;

                        if (actionLower.includes('approved') || actionLower.includes('completed')) {
                          color = 'text-emerald-600'; Icon = CheckCircle2;
                        } else if (actionLower.includes('rejected') || actionLower.includes('denied')) {
                          color = 'text-rose-600'; Icon = XCircle;
                        } else if (actionLower.includes('returned')) {
                          color = 'text-amber-600'; Icon = AlertCircle;
                        }

                        return (
                          <div key={log.id || index} className="flex items-start gap-2.5 text-sm py-1.5 border-b border-border last:border-0">
                            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-foreground">{log.actionTaken || 'Action'}</span>
                              <span className="text-muted-foreground ml-1">by {log.actorName || log.actorEmail || 'System'}</span>
                              {log.comment && <p className="text-xs text-muted-foreground/70 mt-0.5 italic">"{log.comment}"</p>}
                            </div>
                            <span className="text-xs text-muted-foreground/50 whitespace-nowrap shrink-0">
                              {log.timestamp ? format(new Date(log.timestamp), 'MMM d, h:mm a') : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Requestor Info */}
            <motion.div variants={itemVariants}>
              <Card className="border-border shadow-sm">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    Requestor
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground font-bold text-base bg-gradient-to-br from-primary to-primary/80 shrink-0">
                      {submission.requestoremail?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {submission.requestoremail?.split('@')[0].replace('.', ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        {submission.requestoremail || 'No email'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/60 p-2.5 space-y-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Status</span>
                      <Badge className={`${statusDisplay.bgColor} ${statusDisplay.color} border-0 text-[11px]`}>
                        {statusDisplay.label}
                      </Badge>
                    </div>
                    <div className="rounded-lg bg-muted/60 p-2.5 space-y-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Submitted</span>
                      <p className="text-xs font-medium text-foreground">
                        {submission.submitteddate ? format(new Date(submission.submitteddate), 'MMM d, yyyy') : '—'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form-Specific Sidebar Info */}
            <motion.div variants={itemVariants}>
              <Card className="border-border shadow-sm">
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    {submission.formcode} Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="divide-y divide-border">
                    {(submission.formcode === 'EAF' || submission.formcode === 'VPNACCESS') && (
                      <>
                        <SidebarField icon={Monitor} label="System" value={submission.subject} />
                        <SidebarField icon={Globe} label="Environment" value={submission.environmenttagKey ? MainDBITEnvironmenttagKeyToLabel[submission.environmenttagKey] : undefined} />
                        <SidebarField icon={Building2} label="Company" value={submission.nIRDepartment || submission.company} />
                        <SidebarField icon={MapPin} label="Site" value={submission.siteKey ? MainDBITSiteKeyToLabel[submission.siteKey] : undefined} />
                      </>
                    )}
                    {/* ITSSR is section-based — redirected to custom detail page */}
                    {(submission.formcode === 'NIR') && (
                      <>
                        <SidebarField icon={User} label="Full Name" value={submission.nIRFullName} />
                        <SidebarField icon={Hash} label="Employee No." value={submission.nIREmployeeNumber} />
                        <SidebarField icon={Briefcase} label="Designation" value={submission.nIRDesignation} />
                        <SidebarField icon={Building2} label="Department" value={submission.nIRDepartment} />
                        <SidebarField icon={Mail} label="Existing Email" value={submission.nIRExistingEmailAddress} />
                        <SidebarField icon={Tag} label="Request Type" value={submission.nIRRequestType} />
                      </>
                    )}
                    {(submission.formcode === 'RS') && (
                      <>
                        <SidebarField icon={User} label="Username" value={submission.rSUserName} />
                        <SidebarField icon={Building2} label="Company" value={submission.rSCompany} />
                        <SidebarField icon={Building2} label="Department" value={submission.rSDepartment} />
                        <SidebarField icon={Tag} label="Reset Type" value={submission.rSResetType} />
                        <SidebarField icon={Key} label="Token Serial" value={submission.rSBankTokenSerial} />
                      </>
                    )}
                    {(submission.formcode === 'SFAR') && (
                      <>
                        <SidebarField icon={FolderOpen} label="Folder Type" value={submission.sFARFolderType} />
                        <SidebarField icon={Server} label="Server" value={submission.sFARServerName} />
                        <SidebarField icon={Tag} label="Request Type" value={submission.sFARRequestType} />
                        <SidebarField icon={Shield} label="Access Level" value={submission.sFARAccessLevel} />
                        <SidebarField icon={FolderOpen} label="Folder Path" value={submission.sFARFolderPath} />
                      </>
                    )}
                    {(submission.formcode === 'UR') && (
                      <>
                        <SidebarField icon={User} label="Full Name" value={submission.uRUserFullName} />
                        <SidebarField icon={Hash} label="Employee No." value={submission.uREmployeeNumber} />
                        <SidebarField icon={Briefcase} label="Designation" value={submission.uRDesignation} />
                        <SidebarField icon={Building2} label="Company" value={submission.uRCompany} />
                        <SidebarField icon={Building2} label="Department" value={submission.uRUserDepartment} />
                        <SidebarField icon={Tag} label="Request Type" value={submission.uRRequestType} />
                        <SidebarField icon={AtSign} label="System Access" value={submission.uRSystemAccess} />
                      </>
                    )}
                    {(submission.formcode === 'PRF') && (
                      <>
                        <SidebarField icon={Tag} label="Request Type" value={submission.pRFRequestType} />
                        <SidebarField icon={Database} label="SAP Client" value={submission.pRFSAPClient} />
                        <SidebarField icon={FolderOpen} label="SAP Module" value={submission.pRFSAPModule} />
                        <SidebarField icon={Building2} label="Department" value={submission.pRFDepartment} />
                        <SidebarField icon={Flag} label="Priority" value={submission.pRFPriority} />
                      </>
                    )}
                    {/* Generic fallback for all other forms — renders all structured fields */}
                    {structuredFields.length > 0 && !['EAF', 'VPNACCESS', 'NIR', 'RS', 'SFAR', 'UR', 'PRF'].includes(submission.formcode) && (
                      structuredFields.map((field, idx) => (
                        <SidebarField key={idx} icon={field.icon} label={field.label} value={field.value} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Approval Workflow Panel - Visible to all, actions restricted */}
            <motion.div variants={itemVariants}>
              <ApprovalWorkflowPanel
                formId={String(submission.id)}
                formCode={submission.formcode}
                readOnly={!canApprove}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card className="border-border shadow-sm bg-card">
                <CardContent className="pt-5 pb-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {/* Always show these common actions */}
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-background border-border text-foreground hover:bg-muted"
                      onClick={() => navigate('/my-submissions')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2 text-primary" />
                      Back to My Submissions
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start bg-background border-border text-foreground hover:bg-muted"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/submissions/${submission.id}`);
                        toast.success('Link copied to clipboard');
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2 text-primary" />
                      Copy Submission Link
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white border-border text-foreground hover:bg-muted"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4 mr-2 text-primary" />
                      Print Submission
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white border-border text-foreground hover:bg-muted"
                    >
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      Contact IT Support
                    </Button>

                    {/* Draft — can submit or cancel */}
                    {getStatusLabel(submission.currentStatus) === 'Draft' && (
                      <>
                        <Button
                          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Submit for Review
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-white border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => setShowCancelDialog(true)}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Cancel Request
                        </Button>
                      </>
                    )}

                    {/* Any Pending* stage — can withdraw */}
                    {isPendingStatus(submission.currentStatus) && (
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-background border-warning text-warning hover:bg-warning/10"
                        onClick={() => setShowWithdrawDialog(true)}
                      >
                        <Undo2 className="h-4 w-4 mr-2" />
                        Withdraw Submission
                      </Button>
                    )}

                    {/* Terminal positive — Approved / Verified / Active / Sent */}
                    {(getStatusLabel(submission.currentStatus) === 'Approved' ||
                      getStatusLabel(submission.currentStatus) === 'Verified' ||
                      getStatusLabel(submission.currentStatus) === 'Active' ||
                      getStatusLabel(submission.currentStatus) === 'Sent')
                    && (
                      <>
                        {/* Edit Request Button - Show for approved/completed submissions */}
                        {(() => {
                          const editRequest = getEditRequestFromRemarks(submission.remarks);
                          const editState = getEditStateFromRemarks(submission.remarks);

                          // Don't show if edit request is pending
                          if (editRequest?.status === 'PENDING') {
                            return (
                              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                                <p className="text-sm text-warning flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Edit request pending approval
                                </p>
                              </div>
                            );
                          }

                          // Show edit window if unlocked
                          if (editState === 'EDIT_UNLOCKED') {
                            return (
                              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <p className="text-sm text-success flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Editing enabled - you can now make changes
                                </p>
                              </div>
                            );
                          }

                          // Show request edit button
                          return (
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-background border-success text-success hover:bg-success/10"
                              onClick={() => setShowEditRequestModal(true)}
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Request Edit
                            </Button>
                          );
                        })()}

                        <Button
                          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => {
                            // Navigate to create new form of same type
                            const formCode = submission.formcode?.toLowerCase() || 'eaf';
                            navigate(`/it/forms/${formCode}/new`);
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Submit Similar Request
                        </Button>
                      </>
                    )}

                    {/* Closed — can resubmit */}
                    {isTerminalStatus(submission.currentStatus) && getStatusLabel(submission.currentStatus) === 'Closed' && (
                      <>
                        <Button
                          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => {
                            // Navigate to create new form of same type
                            const formCode = submission.formcode?.toLowerCase() || 'eaf';
                            navigate(`/it/forms/${formCode}/new`);
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resubmit Request
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-background border-border text-foreground hover:bg-muted"
                        >
                          <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                          View Rejection Reason
                        </Button>
                      </>
                    )}

                    {/* Withdrawn — can create new */}
                    {isTerminalStatus(submission.currentStatus) && getStatusLabel(submission.currentStatus) === 'Withdrawn' && (
                      <Button
                        className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => {
                          // Navigate to create new form of same type
                          const formCode = submission.formcode?.toLowerCase() || 'eaf';
                          navigate(`/it/forms/${formCode}/new`);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Create New Request
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Undo2 className="h-5 w-5 text-[#7B3E00]" />
              Withdraw Submission
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw this submission? This will remove it from the approval queue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-[#1C1C1C] mb-2 block">
              Reason for withdrawal (optional)
            </label>
            <Textarea
              placeholder="Enter reason for withdrawing this submission..."
              value={withdrawReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWithdrawReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowWithdrawDialog(false);
                setWithdrawReason('');
              }}
            >
              Keep Submission
            </Button>
            <Button
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
              disabled={updateMutation.isPending}
              onClick={() => {
                if (!submission) return;
                const existingRemarks = submission.remarks ? JSON.parse(submission.remarks) : {};
                const updatedRemarks = {
                  ...existingRemarks,
                  withdrawnAt: new Date().toISOString(),
                  withdrawReason: withdrawReason || 'No reason provided',
                };
                updateMutation.mutate(
                  {
                    id: String(submission.id),
                    changedFields: {
                      currentStatus: 'CurrentstatusKey6', // Withdrawn
                      remarks: JSON.stringify(updatedRemarks),
                    },
                  },
                  {
                    onSuccess: () => {
                      toast.success('Submission withdrawn successfully');
                      setShowWithdrawDialog(false);
                      setWithdrawReason('');
                    },
                    onError: () => {
                      toast.error('Failed to withdraw submission');
                    },
                  }
                );
              }}
            >
              {updateMutation.isPending ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancel Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this draft? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-[#1C1C1C] mb-2 block">
              Reason for cancellation (optional)
            </label>
            <Textarea
              placeholder="Enter reason for cancelling this request..."
              value={cancelReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason('');
              }}
            >
              Keep Draft
            </Button>
            <Button
              variant="destructive"
              disabled={updateMutation.isPending}
              onClick={() => {
                if (!submission) return;
                const existingRemarks = submission.remarks ? JSON.parse(submission.remarks) : {};
                const updatedRemarks = {
                  ...existingRemarks,
                  cancelledAt: new Date().toISOString(),
                  cancelReason: cancelReason || 'No reason provided',
                };
                updateMutation.mutate(
                  {
                    id: String(submission.id),
                    changedFields: {
                      currentStatus: 'CurrentstatusKey6', // Withdrawn
                      remarks: JSON.stringify(updatedRemarks),
                    },
                  },
                  {
                    onSuccess: () => {
                      toast.success('Request cancelled successfully');
                      setShowCancelDialog(false);
                      setCancelReason('');
                      navigate('/my-submissions');
                    },
                    onError: () => {
                      toast.error('Failed to cancel request');
                    },
                  }
                );
              }}
            >
              {updateMutation.isPending ? 'Cancelling...' : 'Cancel Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Request Modal */}
      {submission && (
        <EditRequestModal
          open={showEditRequestModal}
          onOpenChange={setShowEditRequestModal}
          submission={submission}
          userEmail={submission.requestoremail || ''}
        />
      )}
    </div>
  );
}
