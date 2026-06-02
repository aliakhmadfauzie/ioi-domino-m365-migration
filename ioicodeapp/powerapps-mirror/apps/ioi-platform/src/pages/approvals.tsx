import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  RotateCcw,
  ExternalLink,
  Building2,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Layers,
  MessageSquare,
  History,
  TrendingUp,
  Sparkles,
  Zap,
  Layers as BatchIcon,
  BarChart3,
  PieChart,
  ShieldX,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useMainDBITList, useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useApprovalRecordsList, useCreateApprovalRecords } from '@/generated/hooks/use-approval-records';
import { useUser } from '@/hooks/use-user';
import { useDynamicRoleAccess } from '@/hooks/use-dynamic-role-access';
import { useSendEmail } from '@/hooks/use-send-email';
import { PageLoading } from '@/components/page-loading';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, differenceInHours, differenceInDays } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, Pie, PieChart as RechartsPieChart } from 'recharts';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { ApprovalRecords } from '@/generated/models/approval-records-model';
import { DynamicSubmissionDetails } from '@/components/submission-details';
import { getITFormDetailPath } from '@/lib/it-form-routes';


// =============================================================================
// PLAIN TEXT STATUS CONSTANTS (Decoupled from SharePoint Choice IDs)
// =============================================================================

const STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  PENDING_APPROVAL: 'Pending Approval',
  PENDING_HOD: 'Pending HoD',
  PENDING_MANAGER: 'Pending Manager',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RETURNED: 'Returned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

const APPROVAL_ACTION = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RETURNED: 'Returned',
  SUBMITTED: 'Submitted',
  PENDING: 'Pending',
  REVIEWING: 'Reviewing',
} as const;

// Status display configuration
interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
  label: string;
}

function getStatusConfig(status: string | undefined): StatusConfig {
  if (!status) {
    return {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
      icon: <FileText className="h-3.5 w-3.5" />,
      label: 'Draft'
    };
  }

  const normalizedStatus = status.toLowerCase().trim();

  if (normalizedStatus === 'draft') {
    return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', icon: <FileText className="h-3.5 w-3.5" />, label: 'Draft' };
  }
  if (normalizedStatus === 'submitted' || normalizedStatus === 'pending approval' || normalizedStatus === 'pending hod' || normalizedStatus === 'pending manager') {
    return { bg: 'bg-secondary', text: 'text-secondary-foreground', border: 'border-secondary', icon: <Clock className="h-3.5 w-3.5" />, label: 'Pending' };
  }
  if (normalizedStatus === 'under review' || normalizedStatus === 'in progress') {
    return { bg: 'bg-accent', text: 'text-accent-foreground', border: 'border-accent', icon: <Eye className="h-3.5 w-3.5" />, label: 'Under Review' };
  }
  if (normalizedStatus === 'approved' || normalizedStatus === 'completed') {
    return { bg: 'bg-primary', text: 'text-primary-foreground', border: 'border-primary', icon: <CheckCircle className="h-3.5 w-3.5" />, label: 'Approved' };
  }
  if (normalizedStatus === 'rejected') {
    return { bg: 'bg-destructive', text: 'text-destructive-foreground', border: 'border-destructive', icon: <XCircle className="h-3.5 w-3.5" />, label: 'Rejected' };
  }
  if (normalizedStatus === 'returned') {
    return { bg: 'bg-accent', text: 'text-accent-foreground', border: 'border-accent', icon: <RotateCcw className="h-3.5 w-3.5" />, label: 'Returned' };
  }
  if (normalizedStatus === 'cancelled') {
    return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', icon: <XCircle className="h-3.5 w-3.5" />, label: 'Cancelled' };
  }

  // Default fallback
  return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', icon: <FileText className="h-3.5 w-3.5" />, label: status };
}

// =============================================================================
// ACCESS DENIED VIEW
// =============================================================================

function AccessDeniedView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
        className="max-w-md w-full text-center"
      >
        <div className="h-20 w-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access the approvals page. This page is restricted to users with Approver, Manager, or Admin roles.
        </p>
        <div className="space-y-3">
          <Button onClick={() => navigate('/')} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
          <p className="text-xs text-muted-foreground">
            Contact your system administrator if you believe you should have access.
          </p>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Role Requirements</span>
          </div>
          <ul className="text-xs text-muted-foreground text-left space-y-1">
            <li>• <strong>Admin</strong> - Full system access</li>
            <li>• <strong>Approver</strong> - Can approve/reject submissions</li>
            <li>• <strong>Manager</strong> - Can approve within department</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
} as const;

// =============================================================================
// CHART CONFIGURATION
// =============================================================================

const statusChartConfig = {
  submitted: { label: 'Submitted/Pending', color: 'var(--chart-1)' },
  underReview: { label: 'Under Review', color: 'var(--chart-2)' },
  approved: { label: 'Approved', color: 'var(--chart-3)' },
  rejected: { label: 'Rejected', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const formTypeChartConfig = {
  EAF: { label: 'EAF - Email Access', color: 'var(--chart-1)' },
  ITSSR: { label: 'ITSSR - IT Support', color: 'var(--chart-2)' },
  NIR: { label: 'NIR - Notes ID', color: 'var(--chart-3)' },
  RS: { label: 'RS - Reset/Unlock', color: 'var(--chart-4)' },
  Other: { label: 'Other Forms', color: 'var(--chart-5)' },
} satisfies ChartConfig;

// =============================================================================
// WORKFLOW STEP TRACKER
// =============================================================================

interface WorkflowStep {
  stage: number;
  label: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
}

function WorkflowStepTracker({ submission, approvals }: { submission: MainDBIT; approvals: ApprovalRecords[] }) {
  const currentStage = submission.workflowstage || 1;
  const currentStatus = submission.currentStatus || '';

  // Define workflow steps
  const steps: WorkflowStep[] = useMemo(() => {
    const baseSteps = [
      { stage: 1, label: 'Submitted', status: 'pending' as const },
      { stage: 2, label: 'Manager Review', status: 'pending' as const },
      { stage: 3, label: 'Department Approval', status: 'pending' as const },
      { stage: 4, label: 'Completed', status: 'pending' as const },
    ];

    const normalizedStatus = currentStatus.toLowerCase();
    const isApproved = normalizedStatus === 'approved' || normalizedStatus === 'completed';
    const isRejected = normalizedStatus === 'rejected' || normalizedStatus === 'cancelled';

    return baseSteps.map((step): WorkflowStep => {
      if (isRejected) {
        if (step.stage < currentStage) {
          return { ...step, status: 'completed' };
        } else if (step.stage === currentStage) {
          return { ...step, status: 'rejected' };
        }
        return { ...step, status: 'pending' };
      }

      if (isApproved) {
        return { ...step, status: 'completed' };
      }

      if (step.stage < currentStage) {
        return { ...step, status: 'completed' };
      } else if (step.stage === currentStage) {
        return { ...step, status: 'current' };
      }
      return { ...step, status: 'pending' };
    });
  }, [currentStage, currentStatus]);

  return (
    <div className="w-full">
      {/* Mobile: Vertical */}
      <div className="sm:hidden space-y-3">
        {steps.map((step, index) => (
          <div key={step.stage} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all',
                step.status === 'completed' && 'bg-emerald-500 border-emerald-500 text-white',
                step.status === 'current' && 'bg-primary border-primary text-primary-foreground animate-pulse',
                step.status === 'rejected' && 'bg-red-500 border-red-500 text-white',
                step.status === 'pending' && 'bg-muted border-border text-muted-foreground'
              )}>
                {step.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.status === 'rejected' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  step.stage
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'w-0.5 h-8 mt-1',
                  step.status === 'completed' ? 'bg-emerald-500' : 'bg-border'
                )} />
              )}
            </div>
            <div className="flex-1 pb-2">
              <p className={cn(
                'text-sm font-medium',
                step.status === 'completed' && 'text-emerald-600 dark:text-emerald-400',
                step.status === 'current' && 'text-primary',
                step.status === 'rejected' && 'text-red-600 dark:text-red-400',
                step.status === 'pending' && 'text-muted-foreground'
              )}>
                {step.label}
              </p>
              {step.status === 'current' && (
                <p className="text-xs text-muted-foreground mt-0.5">Awaiting approval</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.stage} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all',
                  step.status === 'completed' && 'bg-emerald-500 border-emerald-500 text-white',
                  step.status === 'current' && 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20',
                  step.status === 'rejected' && 'bg-red-500 border-red-500 text-white',
                  step.status === 'pending' && 'bg-muted border-border text-muted-foreground'
                )}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : step.status === 'rejected' ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    step.stage
                  )}
                </div>
                <p className={cn(
                  'text-xs font-medium mt-2 text-center max-w-[80px]',
                  step.status === 'completed' && 'text-emerald-600 dark:text-emerald-400',
                  step.status === 'current' && 'text-primary',
                  step.status === 'rejected' && 'text-red-600 dark:text-red-400',
                  step.status === 'pending' && 'text-muted-foreground'
                )}>
                  {step.label}
                </p>
                {step.status === 'current' && (
                  <p className="text-[10px] text-primary mt-0.5">In Progress</p>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-1 mx-2 rounded-full transition-all',
                  step.status === 'completed' ? 'bg-emerald-500' : 'bg-border'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// URGENCY HELPER
// =============================================================================

function getUrgencyLevel(submittedDate: string | undefined): { level: 'low' | 'medium' | 'high' | 'critical'; label: string; color: string } {
  if (!submittedDate) return { level: 'low', label: 'Normal', color: 'text-muted-foreground' };

  try {
    const date = new Date(submittedDate);
    if (isNaN(date.getTime())) return { level: 'low', label: 'Normal', color: 'text-muted-foreground' };

    const hours = differenceInHours(new Date(), date);
    const days = differenceInDays(new Date(), date);

    if (days >= 7) return { level: 'critical', label: 'Overdue', color: 'text-destructive' };
    if (days >= 3) return { level: 'high', label: 'Urgent', color: 'text-accent-foreground' };
    if (hours >= 24) return { level: 'medium', label: 'Pending', color: 'text-foreground' };
    return { level: 'low', label: 'New', color: 'text-primary' };
  } catch {
    return { level: 'low', label: 'Normal', color: 'text-muted-foreground' };
  }
}

// =============================================================================
// APPROVAL HISTORY TIMELINE
// =============================================================================

function ApprovalHistoryTimeline({ approvals, formId }: { approvals: ApprovalRecords[]; formId: string }) {
  const filteredApprovals = approvals.filter((a: ApprovalRecords) => a.formid === formId);

  if (filteredApprovals.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No approval history yet</p>
      </div>
    );
  }

  // Helper to get action display config
  const getActionConfig = (actionKey: string | undefined) => {
    if (!actionKey) return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' };

    const action = actionKey.toLowerCase();
    if (action === 'approved' || action === 'actionkey0') {
      return { icon: CheckCircle, color: 'text-primary-foreground', bg: 'bg-primary' };
    }
    if (action === 'rejected' || action === 'actionkey1') {
      return { icon: XCircle, color: 'text-destructive-foreground', bg: 'bg-destructive' };
    }
    if (action === 'returned' || action === 'actionkey2') {
      return { icon: RotateCcw, color: 'text-accent-foreground', bg: 'bg-accent' };
    }
    if (action === 'submitted' || action === 'actionkey3') {
      return { icon: Clock, color: 'text-secondary-foreground', bg: 'bg-secondary' };
    }
    return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' };
  };

  return (
    <div className="space-y-3">
      {filteredApprovals.map((record: ApprovalRecords, index: number) => {
        const actionConfig = getActionConfig(record.actionKey);
        const Icon = actionConfig.icon;

        // Get action label
        const actionLabel = record.actionKey || 'Action';

        return (
          <div key={record.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('h-8 w-8 rounded-full flex items-center justify-center', actionConfig.bg)}>
                <Icon className={cn('h-4 w-4', actionConfig.color)} />
              </div>
              {index < filteredApprovals.length - 1 && (
                <div className="w-px h-full bg-border flex-1 my-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">
                  {actionLabel}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">Stage {record.stagenumber || 1}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {record.actionbyname || 'System'}
              </p>
              {record.comments && (
                <p className="text-sm text-foreground mt-1 p-2 bg-muted rounded-md">
                  "{record.comments}"
                </p>
              )}
              {record.actiondate && (
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(record.actiondate), 'MMM d, yyyy • h:mm a')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// PARSE REMARKS HELPER
// =============================================================================

function parseRemarks(remarks: string | undefined): Record<string, string | number | boolean | null> {
  if (!remarks) return {};
  try {
    const parsed = JSON.parse(remarks) as Record<string, unknown>;
    const result: Record<string, string | number | boolean | null> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        result[key] = value;
      } else if (value === null || value === undefined) {
        result[key] = null;
      } else {
        result[key] = String(value);
      }
    }
    return result;
  } catch {
    return { rawRemarks: remarks };
  }
}

// =============================================================================
// FORM DESCRIPTION HELPER
// =============================================================================

function getFormDescription(formCode: string): string {
  const descriptions: Record<string, string> = {
    'EAF': 'External Access Form - VPN/System access request',
    'ITSSR': 'IT Service Support Request - Technical support ticket',
    'NIR': 'Notes ID Request - Email/Lotus Notes account creation',
    'RS': 'Reset/Unlock - Password reset or account unlock',
    'PRF': 'Purchase Request Form - IT procurement request',
    'SAPSOF': 'SAP Sign-Off Form - SAP change approval',
  };
  return descriptions[formCode] || `${formCode} Form Request`;
}

// =============================================================================
// SUBMISSION CARD COMPONENT
// =============================================================================

interface SubmissionCardProps {
  submission: MainDBIT;
  approvals: ApprovalRecords[];
  onReview: (submission: MainDBIT) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function SubmissionCard({ submission, approvals, onReview, isExpanded, onToggleExpand }: SubmissionCardProps) {
  const statusConfig = getStatusConfig(submission.currentStatus);
  const urgency = getUrgencyLevel(submission.submitteddate);
  const isPending = statusConfig.label === 'Pending' || statusConfig.label === 'Under Review' || statusConfig.label === 'Submitted';
  const relatedApprovals = approvals.filter((a: ApprovalRecords) => a.formid === String(submission.id));
  const parsedRemarks = parseRemarks(submission.remarks);

  // Extract requestor name
  const requestorName: string = String(parsedRemarks.requestor || parsedRemarks.fullName || submission.requestoremail?.split('@')[0] || 'Unknown');

  return (
    <motion.div variants={itemVariants}>
      <Card className={cn(
        'overflow-hidden transition-all duration-200 border',
        isPending && urgency.level === 'critical' && 'border-l-4 border-l-red-500',
        isPending && urgency.level === 'high' && 'border-l-4 border-l-orange-500',
        isPending && urgency.level === 'medium' && 'border-l-4 border-l-amber-500',
        isPending && urgency.level === 'low' && 'border-l-4 border-l-emerald-500',
        !isPending && 'border-l-4 border-l-border',
        'hover:shadow-md'
      )}>
        <CardContent className="p-0">
          {/* Main Row */}
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Left: Form Icon & Type */}
              <div className="hidden sm:flex flex-col items-center gap-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{submission.formcode}</span>
              </div>

              {/* Center: Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{submission.title}</h3>
                  <Badge className={cn('text-xs font-medium border', statusConfig.bg, statusConfig.text, statusConfig.border)}>
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.label}</span>
                  </Badge>
                  {isPending && (
                    <Badge variant="outline" className={cn('text-xs', urgency.color)}>
                      <Zap className="h-3 w-3 mr-1" />
                      {urgency.label}
                    </Badge>
                  )}
                </div>

                {/* Form Description */}
                <p className="text-sm text-muted-foreground mb-2">
                  {getFormDescription(submission.formcode || '')}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 mt-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{requestorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {submission.submitteddate
                        ? formatDistanceToNow(new Date(submission.submitteddate), { addSuffix: true })
                        : 'Not submitted'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {submission.siteKey || 'All Sites'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Stage {submission.workflowstage || 1}
                      {submission.environmenttagKey && (
                        <span className="ml-1 text-xs">• {submission.environmenttagKey}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Parsed Details Preview */}
                {parsedRemarks.justification && (
                  <div className="mt-3 p-2 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />
                      {String(parsedRemarks.justification)}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <Link to={getITFormDetailPath(submission.formcode, submission.id)}>
                    <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onToggleExpand}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                {isPending && (
                  <Button
                    size="sm"
                    onClick={() => onReview(submission)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Eye className="h-4 w-4 mr-1.5" />
                    Review
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Expanded Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] as const }}
                className="overflow-hidden"
              >
                <div className="border-t border-border bg-muted/30">
                  <div className="p-4">
                    <Tabs defaultValue="workflow" className="w-full">
                      <TabsList className="grid w-full max-w-lg grid-cols-3">
                        <TabsTrigger value="workflow">Workflow</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="history">
                          History
                          {relatedApprovals.length > 0 && (
                            <Badge variant="secondary" className="ml-1.5 text-xs h-5 px-1.5">
                              {relatedApprovals.length}
                            </Badge>
                          )}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="workflow" className="mt-4">
                        <div className="p-4 bg-card rounded-xl border border-border">
                          <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" />
                            Approval Workflow Progress
                          </h4>
                          <WorkflowStepTracker submission={submission} approvals={approvals} />
                        </div>
                      </TabsContent>
                      <TabsContent value="details" className="mt-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              Submission Details
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">Form Code</span>
                                <span className="text-sm font-mono font-medium text-foreground">{submission.formcode}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">Submission ID</span>
                                <span className="text-sm font-mono font-medium text-foreground">#{submission.id}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">Requestor</span>
                                <span className="text-sm font-medium text-foreground">{submission.requestoremail || 'Not specified'}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">Submitted</span>
                                <span className="text-sm text-foreground">
                                  {submission.submitteddate
                                    ? format(new Date(submission.submitteddate), 'MMM d, yyyy • h:mm a')
                                    : 'Not submitted'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">Locked</span>
                                <Badge variant={submission.islocked ? 'destructive' : 'outline'}>
                                  {submission.islocked ? 'Yes' : 'No'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary" />
                              Location & Environment
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">Site</span>
                                <span className="text-sm font-medium text-foreground">
                                  {submission.siteKey || 'All Sites'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">Environment</span>
                                <Badge variant="outline">
                                  {submission.environmenttagKey || 'Production'}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">Workflow Stage</span>
                                <span className="text-sm font-medium text-foreground">Stage {submission.workflowstage || 1}</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">Department</span>
                                <span className="text-sm font-medium text-foreground">IT Department</span>
                              </div>
                            </div>

                            {/* Parsed Form Data */}
                            {Object.keys(parsedRemarks).length > 0 && parsedRemarks.rawRemarks === undefined && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Form Data</h4>
                                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg space-y-1">
                                  {parsedRemarks.application && <p><strong>Application:</strong> {String(parsedRemarks.application)}</p>}
                                  {parsedRemarks.systemName && <p><strong>System:</strong> {String(parsedRemarks.systemName)}</p>}
                                  {parsedRemarks.company && <p><strong>Company:</strong> {String(parsedRemarks.company)}</p>}
                                  {parsedRemarks.department && <p><strong>Department:</strong> {String(parsedRemarks.department)}</p>}
                                  {parsedRemarks.priority && <p><strong>Priority:</strong> {String(parsedRemarks.priority)}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="history" className="mt-4">
                        <ApprovalHistoryTimeline approvals={approvals} formId={String(submission.id)} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// MAIN APPROVALS PAGE COMPONENT
// =============================================================================

export default function ApprovalsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { canApprove, isLoading: roleLoading } = useDynamicRoleAccess({ moduleScope: 'IT' });
  // Fetch only pending submissions — delegation-safe OData filter
  const { data: submissions = [], isLoading: submissionsLoading } = useMainDBITList({
    filter: "CurrentStatus eq 'CurrentstatusKey1' or CurrentStatus eq 'CurrentstatusKey2' or CurrentStatus eq 'CurrentstatusKey3'",
    orderBy: ['submitteddate desc'],
  });
  const { data: approvals = [], isLoading: approvalsLoading } = useApprovalRecordsList();
  const updateSubmission = useUpdateMainDBIT();
  const createApproval = useCreateApprovalRecords();
  const sendEmail = useSendEmail();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<MainDBIT | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCharts, setShowCharts] = useState(true);

  const isLoading = userLoading || roleLoading || submissionsLoading || approvalsLoading;

  // Filter submissions by search term and status
  const filteredSubmissions = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return submissions.filter((s: MainDBIT) => {
      const matchesSearch =
        String(s.title || '').toLowerCase().includes(query) ||
        String(s.formcode || '').toLowerCase().includes(query) ||
        String(s.requestoremail || '').toLowerCase().includes(query);

      const currentStatus = (s.currentStatus || '').toLowerCase();

      if (statusFilter === 'pending') {
        return matchesSearch && (
          currentStatus === 'submitted' ||
          currentStatus === 'pending approval' ||
          currentStatus === 'pending hod' ||
          currentStatus === 'pending manager' ||
          currentStatus === 'under review'
        );
      }
      if (statusFilter === 'approved') {
        return matchesSearch && (currentStatus === 'approved' || currentStatus === 'completed');
      }
      if (statusFilter === 'rejected') {
        return matchesSearch && currentStatus === 'rejected';
      }
      if (statusFilter === 'returned') {
        return matchesSearch && currentStatus === 'returned';
      }
      if (statusFilter === 'all') {
        return matchesSearch;
      }
      return matchesSearch && currentStatus === statusFilter;
    });
  }, [submissions, searchTerm, statusFilter]);

  // Sort by urgency for pending items
  const sortedSubmissions = useMemo(() => {
    return [...filteredSubmissions].sort((a: MainDBIT, b: MainDBIT) => {
      const aDate = a.submitteddate ? new Date(a.submitteddate).getTime() : Date.now();
      const bDate = b.submitteddate ? new Date(b.submitteddate).getTime() : Date.now();
      return aDate - bDate; // Oldest first (most urgent)
    });
  }, [filteredSubmissions]);

  // Calculate real stats from live data
  const stats = useMemo(() => {
    const pending = submissions.filter((s: MainDBIT) => {
      const status = (s.currentStatus || '').toLowerCase();
      return status === 'submitted' || status === 'pending approval' || status === 'pending hod' ||
             status === 'pending manager' || status === 'under review';
    });
    const urgent = pending.filter((s: MainDBIT) => {
      if (!s.submitteddate) return false;
      return differenceInDays(new Date(), new Date(s.submitteddate)) >= 3;
    });
    const approved = submissions.filter((s: MainDBIT) => {
      const status = (s.currentStatus || '').toLowerCase();
      return status === 'approved' || status === 'completed';
    });
    const rejected = submissions.filter((s: MainDBIT) => {
      return (s.currentStatus || '').toLowerCase() === 'rejected';
    });
    const draft = submissions.filter((s: MainDBIT) => {
      return (s.currentStatus || '').toLowerCase() === 'draft';
    });

    return {
      total: submissions.length,
      pending: pending.length,
      urgent: urgent.length,
      approved: approved.length,
      rejected: rejected.length,
      draft: draft.length,
    };
  }, [submissions]);

  // Chart data for status breakdown
  const statusChartData = useMemo(() => {
    const submitted = submissions.filter((s: MainDBIT) => {
      const status = (s.currentStatus || '').toLowerCase();
      return status === 'submitted' || status === 'pending approval' ||
             status === 'pending hod' || status === 'pending manager';
    }).length;
    const underReview = submissions.filter((s: MainDBIT) => {
      return (s.currentStatus || '').toLowerCase() === 'under review';
    }).length;
    const approved = submissions.filter((s: MainDBIT) => {
      const status = (s.currentStatus || '').toLowerCase();
      return status === 'approved' || status === 'completed';
    }).length;
    const rejected = submissions.filter((s: MainDBIT) => {
      return (s.currentStatus || '').toLowerCase() === 'rejected';
    }).length;

    return [
      { name: 'Submitted/Pending', value: submitted, fill: 'var(--chart-1)' },
      { name: 'Under Review', value: underReview, fill: 'var(--chart-2)' },
      { name: 'Approved', value: approved, fill: 'var(--chart-3)' },
      { name: 'Rejected', value: rejected, fill: 'var(--chart-4)' },
    ].filter((d) => d.value > 0);
  }, [submissions]);

  // Chart data for form types
  const formTypeChartData = useMemo(() => {
    const formCounts: Record<string, number> = {};
    submissions.forEach((s: MainDBIT) => {
      const code = s.formcode || 'Other';
      formCounts[code] = (formCounts[code] || 0) + 1;
    });

    return Object.entries(formCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [submissions]);

  // Role-based access control
  if (!isLoading && !canApprove) {
    return <AccessDeniedView />;
  }

  if (isLoading) {
    return <PageLoading message="Loading pending tasks..." />;
  }

  // Handle approval action
  const handleApprovalAction = async (action: 'approved' | 'rejected' | 'returned') => {
    if (!selectedSubmission || !user) return;

    try {
      // Create approval record
      await createApproval.mutateAsync({
        stagename: action === 'approved' ? 'Approved' : action === 'returned' ? 'Returned' : 'Rejected',
        formid: String(selectedSubmission.id),
        formcode: selectedSubmission.formcode,
        actionbyid: user.objectId || '',
        actionbyname: user.fullName || '',

        actiondate: new Date().toISOString(),
        stagenumber: (selectedSubmission.workflowstage || 1),
        comments: approvalComments || undefined,
      });

      // Determine new status
      let newStatus: string;
      let emailSubject: string;
      let statusLabel: string;
      let emailImportance: 'Normal' | 'High' = 'Normal';

      if (action === 'approved') {
        newStatus = STATUS.APPROVED;
        statusLabel = 'Approved';
        emailSubject = `[APPROVED] ${selectedSubmission.formcode} Request - ${selectedSubmission.title}`;
        toast.success('Submission approved successfully');
      } else if (action === 'returned') {
        newStatus = STATUS.RETURNED;
        statusLabel = 'Returned';
        emailSubject = `[ACTION REQUIRED] ${selectedSubmission.formcode} Request - ${selectedSubmission.title}`;
        emailImportance = 'High';
        toast.info('Submission returned for corrections');
      } else {
        newStatus = STATUS.REJECTED;
        statusLabel = 'Rejected';
        emailSubject = `[REJECTED] ${selectedSubmission.formcode} Request - ${selectedSubmission.title}`;
        emailImportance = 'High';
        toast.error('Submission rejected');
      }

      // Update the submission status
      await updateSubmission.mutateAsync({
        id: String(selectedSubmission.id),
        changedFields: { currentStatus: newStatus },
      });

      // Send email notification to requestor
      if (selectedSubmission.requestoremail) {
        try {
          let requestorName = 'User';
          try {
            if (selectedSubmission.remarks) {
              const parsedRemarks = JSON.parse(selectedSubmission.remarks) as Record<string, unknown>;
              requestorName = (parsedRemarks.requestor as string) || (parsedRemarks.fullName as string) || 'User';
            }
          } catch {
            // Use default name
          }

          const emailBody = buildNotificationEmail({
            ticketId: selectedSubmission.title || '',
            formType: selectedSubmission.formcode || '',
            requestorName,
            approverName: user.fullName || 'Approver',
            status: statusLabel,
            comments: approvalComments || undefined,
          });

          await sendEmail.mutateAsync({
            to: selectedSubmission.requestoremail,
            subject: emailSubject,
            body: emailBody,
            importance: emailImportance,
          });
        } catch (emailErr) {
          console.error('Failed to send notification email:', emailErr);
          toast.warning('Approval processed but email notification failed to send');
        }
      }

      setSelectedSubmission(null);
      setApprovalComments('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ApprovalAction] Error:', errorMessage);
      toast.error('Failed to process approval');
    }
  };

  // Build notification email HTML
  const buildNotificationEmail = (params: {
    ticketId: string;
    formType: string;
    requestorName: string;
    approverName: string;
    status: string;
    comments?: string;
  }): string => {
    const statusColors: Record<string, { bg: string; border: string; text: string }> = {
      Approved: { bg: '#E8F5E9', border: '#166534', text: '#166534' },
      Rejected: { bg: '#FFEBEE', border: '#B71C1C', text: '#B71C1C' },
      Returned: { bg: '#FFF3E0', border: '#E65100', text: '#E65100' },
    };

    const colors = statusColors[params.status] || statusColors.Returned;
    const commentsSection = params.comments
      ? `<div style="background-color: #FAFAFA; padding: 16px; border-radius: 8px; margin-top: 16px;">
           <p style="margin: 0 0 8px 0; font-weight: 600; color: #1C1C1C;">Comments:</p>
           <p style="margin: 0; color: #5C5C5C;">${params.comments}</p>
         </div>`
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #F5F5F5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background-color: ${colors.border}; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 20px;">Request ${params.status}</h1>
                    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">IOI Portal - ${params.formType}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 16px 0; color: #1C1C1C; font-size: 15px;">Dear ${params.requestorName},</p>
                    <p style="margin: 0 0 24px 0; color: #1C1C1C; font-size: 15px;">Your request has been <strong>${params.status.toLowerCase()}</strong> by ${params.approverName}.</p>

                    <div style="background-color: ${colors.bg}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; text-align: center;">
                      <p style="margin: 0 0 4px 0; color: #5C5C5C; font-size: 12px; text-transform: uppercase;">Reference Number</p>
                      <p style="margin: 0; color: ${colors.text}; font-size: 20px; font-weight: 700;">${params.ticketId}</p>
                    </div>

                    ${commentsSection}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background-color: #FAFAFA; border-radius: 0 0 12px 12px; border-top: 1px solid #E0E0E0;">
                    <p style="margin: 0; color: #5C5C5C; font-size: 12px;">This is an automated notification from the IOI Portal.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-800 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <ClipboardList className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Pending Tasks</h1>
                <p className="text-white/70 mt-0.5">Review and action pending submissions</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    <p className="text-xs text-white/60">Pending</p>
                  </div>
                </div>
              </div>
              {stats.urgent > 0 && (
                <div className="bg-red-500/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-red-400/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-500/30 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.urgent}</p>
                      <p className="text-xs text-red-200">Urgent</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.approved}</p>
                    <p className="text-xs text-white/60">Approved</p>
                  </div>
                </div>
              </div>
              <Link to="/batch-approvals">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <BatchIcon className="h-4 w-4 mr-2" />
                  Batch Action
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Data Visualizations */}
        {showCharts && submissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
          >
            <Card className="border border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Submissions Overview
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCharts(false)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    Hide
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Status Distribution */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">Status Distribution</p>
                    {statusChartData.length > 0 ? (
                      <ChartContainer config={statusChartConfig} className="h-[200px] w-full">
                        <RechartsPieChart>
                          <Pie
                            data={statusChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                          >
                            {statusChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ChartContainer>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                        No data available
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2 justify-center">
                      {statusChartData.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-muted-foreground">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Types */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">Submissions by Form Type</p>
                    {formTypeChartData.length > 0 ? (
                      <ChartContainer config={formTypeChartConfig} className="h-[200px] w-full">
                        <BarChart data={formTypeChartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" tickLine={false} axisLine={false} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            width={60}
                            tick={{ fontSize: 11 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" radius={4}>
                            {formTypeChartData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                        No data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Submissions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.approved}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
                    <p className="text-xs text-muted-foreground">Draft</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Show Charts Button when hidden */}
        {!showCharts && submissions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCharts(true)}
            className="text-muted-foreground"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Show Analytics
          </Button>
        )}

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card border border-border rounded-xl p-4"
        >
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, form code, or requestor..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-muted/50 border-border">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{sortedSubmissions.length}</span> submissions
          </div>
        </motion.div>

        {/* Submissions List */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {sortedSubmissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <div className="h-20 w-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">All caught up!</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  No pending submissions to review. Check back later or adjust your filters.
                </p>
              </motion.div>
            ) : (
              sortedSubmissions.map((submission: MainDBIT) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  approvals={approvals}
                  onReview={setSelectedSubmission}
                  isExpanded={expandedId === submission.id}
                  onToggleExpand={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              Review Submission
            </DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-4">
                {/* Dynamic Form-Specific Submission Details */}
                <DynamicSubmissionDetails
                  submission={selectedSubmission}
                  dataSource="IT"
                  approvals={approvals}
                  showWorkflow={true}
                  showHistory={true}
                />

                <Separator />

                {/* Comments Input */}
                <div>
                  <label className="text-sm font-medium text-foreground">Your Comments</label>
                  <Textarea
                    value={approvalComments}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApprovalComments(e.target.value)}
                    placeholder="Add comments about your decision (optional)..."
                    rows={3}
                    className="mt-2 bg-muted/50 border-border"
                  />
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2 flex-wrap border-t border-border pt-4 mt-2">
            <Button
              variant="outline"
              onClick={() => handleApprovalAction('returned')}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Return for Revision
            </Button>
            <Button
              variant="outline"
              onClick={() => handleApprovalAction('rejected')}
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => handleApprovalAction('approved')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
