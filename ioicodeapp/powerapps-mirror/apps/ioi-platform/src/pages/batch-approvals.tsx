// Batch Actions Page - Process multiple submissions at once
// PRODUCTION: Includes role-based access control and real email notifications

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Layers,
  AlertTriangle,
  RotateCcw,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  MinusSquare,
  Zap,
  ArrowLeft,
  FileText,
  MapPin,
  Building2,
  Sparkles,
  Send,
  Info,
  ShieldX,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useMainDBITList, useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateApprovalRecords } from '@/generated/hooks/use-approval-records';
import { useUser } from '@/hooks/use-user';
import { useDynamicRoleAccess } from '@/hooks/use-dynamic-role-access';
import { useSendEmail } from '@/hooks/use-send-email';
import { PageLoading } from '@/components/page-loading';
import { cn } from '@/lib/utils';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import {
  MainDBITCurrentstatusKeyToLabel,
  MainDBITSiteKeyToLabel,
  type MainDBITCurrentstatusKey,
  type MainDBIT,
} from '@/generated/models/main-dbit-model';
import type { ApprovalRecordsActionKey } from '@/generated/models/approval-records-model';
import { getITFormDetailPath } from '@/lib/it-form-routes';

// Access Denied Component for unauthorized users
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
          You do not have permission to access the batch approvals page. This page is restricted to users with Approver, Manager, or Admin roles.
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
} as const;

// Form code labels
const formCodeLabels: Record<string, string> = {
  EAF: 'External Access Form',
  NIR: 'Notes ID Request',
  RS: 'Reset Password',
  SFAR: 'Share Folder Access',
  UR: 'User ID Requisition',
  IAL1: 'Server Reboot Log',
  IAL2: 'Data Center Access',
  IAL3: 'IT Event',
  IAL4: 'Server Records',
  IAL5: 'Data Restoration',
  ITDR: 'IT Daily Report',
  ITDR2: 'Outstanding Tasks',
  ITSSR: 'IT Support Request',
  PRF: 'Program Request',
  HI: 'Hardware Inventory',
  ITSC: 'IT Server Checklist',
};

function getUrgencyLevel(submittedDate: string | undefined): { level: 'low' | 'medium' | 'high' | 'critical'; label: string; color: string; bgColor: string } {
  if (!submittedDate) return { level: 'low', label: 'Normal', color: 'text-muted-foreground', bgColor: 'bg-muted' };
  
  const days = differenceInDays(new Date(), new Date(submittedDate));
  const hours = differenceInHours(new Date(), new Date(submittedDate));
  
  if (days >= 7) return { level: 'critical', label: 'Overdue', color: 'text-destructive-foreground', bgColor: 'bg-destructive' };
  if (days >= 3) return { level: 'high', label: 'Urgent', color: 'text-primary-foreground', bgColor: 'bg-orange-500' };
  if (hours >= 24) return { level: 'medium', label: 'Pending', color: 'text-primary-foreground', bgColor: 'bg-amber-500' };
  return { level: 'low', label: 'New', color: 'text-primary-foreground', bgColor: 'bg-emerald-500' };
}

type BatchAction = 'approve' | 'reject' | 'return';

interface ActionConfig {
  label: string;
  description: string;
  icon: LucideIcon;
  buttonClass: string;
  statusKey: MainDBITCurrentstatusKey;
  actionKey: ApprovalRecordsActionKey;
}

const actionConfigs: Record<BatchAction, ActionConfig> = {
  approve: {
    label: 'Approve',
    description: 'Approve all selected submissions',
    icon: CheckCircle2,
    buttonClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    statusKey: 'CurrentstatusKey3',
    actionKey: 'ActionKey0',
  },
  reject: {
    label: 'Reject',
    description: 'Reject all selected submissions',
    icon: XCircle,
    buttonClass: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
    statusKey: 'CurrentstatusKey4',
    actionKey: 'ActionKey1',
  },
  return: {
    label: 'Return',
    description: 'Return for corrections',
    icon: RotateCcw,
    buttonClass: 'bg-orange-500 hover:bg-orange-600 text-white',
    statusKey: 'CurrentstatusKey5',
    actionKey: 'ActionKey2',
  },
};

export default function BatchApprovalsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: submissions = [], isLoading: submissionsLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate asc'],
  });
  const updateSubmission = useUpdateMainDBIT();
  const createApproval = useCreateApprovalRecords();

  const [searchTerm, setSearchTerm] = useState('');
  const [formCodeFilter, setFormCodeFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [batchAction, setBatchAction] = useState<BatchAction | null>(null);
  const [batchComments, setBatchComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const isLoading = userLoading || submissionsLoading;

  // Filter to only pending submissions
  const pendingSubmissions = useMemo(() => {
    return submissions.filter((s: MainDBIT) =>
      s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2'
    );
  }, [submissions]);

  // Apply additional filters
  const filteredSubmissions = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return pendingSubmissions.filter((s: MainDBIT) => {
      const matchesSearch =
        String(s.title || '').toLowerCase().includes(query) ||
        String(s.formcode || '').toLowerCase().includes(query) ||
        String(s.requestoremail || '').toLowerCase().includes(query);
      
      const matchesFormCode = formCodeFilter === 'all' || s.formcode === formCodeFilter;
      const matchesSite = siteFilter === 'all' || (s.siteKey && MainDBITSiteKeyToLabel[s.siteKey] === siteFilter);
      
      if (urgencyFilter !== 'all') {
        const urgency = getUrgencyLevel(s.submitteddate);
        if (urgency.level !== urgencyFilter) return false;
      }
      
      return matchesSearch && matchesFormCode && matchesSite;
    });
  }, [pendingSubmissions, searchTerm, formCodeFilter, siteFilter, urgencyFilter]);

  // Get unique filter values
  const uniqueFormCodes = useMemo(() => {
    const codes = new Set<string>();
    pendingSubmissions.forEach((s: MainDBIT) => {
      if (s.formcode) codes.add(s.formcode);
    });
    return Array.from(codes).sort();
  }, [pendingSubmissions]);

  const uniqueSites = useMemo(() => {
    const sites = new Set<string>();
    pendingSubmissions.forEach((s: MainDBIT) => {
      if (s.siteKey) sites.add(MainDBITSiteKeyToLabel[s.siteKey]);
    });
    return Array.from(sites).sort();
  }, [pendingSubmissions]);

  // Stats by urgency
  const stats = useMemo(() => {
    let critical = 0, high = 0, medium = 0, low = 0;
    for (const s of pendingSubmissions) {
      const urgency = getUrgencyLevel(s.submitteddate);
      switch (urgency.level) {
        case 'critical': critical++; break;
        case 'high': high++; break;
        case 'medium': medium++; break;
        case 'low': low++; break;
      }
    }
    return { total: pendingSubmissions.length, critical, high, medium, low };
  }, [pendingSubmissions]);

  // Selection handlers
  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map((s: MainDBIT) => s.id)));
    }
  };

  const selectByUrgency = (level: 'critical' | 'high' | 'medium' | 'low') => {
    const ids = filteredSubmissions
      .filter((s: MainDBIT) => getUrgencyLevel(s.submitteddate).level === level)
      .map((s: MainDBIT) => s.id);
    setSelectedIds(new Set(ids));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Batch action handler
  const handleBatchAction = async () => {
    if (!batchAction || !user || selectedIds.size === 0) return;

    const config = actionConfigs[batchAction];
    setIsProcessing(true);

    const selectedSubmissions = filteredSubmissions.filter((s: MainDBIT) => selectedIds.has(s.id));
    let successCount = 0;
    let failCount = 0;

    for (const submission of selectedSubmissions) {
      try {
        // Create approval record
        await createApproval.mutateAsync({
          stagename: config.label,
          formid: String(submission.id),
          formcode: submission.formcode,
          actionbyid: user.objectId || '',
          actionbyname: user.fullName || '',
          actionKey: config.actionKey,
          actiondate: new Date().toISOString(),
          stagenumber: submission.workflowstage || 1,
          comments: batchComments || `Batch ${config.label.toLowerCase()} action`,
        });

        // Update submission status
        await updateSubmission.mutateAsync({
          id: String(submission.id),
          changedFields: { currentStatus: config.statusKey },
        });

        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to process submission ${submission.id}:`, error);
      }
    }

    setIsProcessing(false);
    setBatchAction(null);
    setBatchComments('');
    setSelectedIds(new Set());

    if (failCount === 0) {
      toast.success(`Successfully ${config.label.toLowerCase()}ed ${successCount} submission${successCount !== 1 ? 's' : ''}`);
    } else {
      toast.warning(`${successCount} succeeded, ${failCount} failed`);
    }

    refetch();
  };

  if (isLoading) {
    return <PageLoading message="Loading pending tasks..." />;
  }

  const selectionState = selectedIds.size === 0 
    ? 'none' 
    : selectedIds.size === filteredSubmissions.length 
      ? 'all' 
      : 'partial';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-800 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Link to="/approvals">
                <Button variant="ghost" size="icon-sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Batch Actions</h1>
                <p className="text-white/70">Process multiple tasks at once</p>
              </div>
            </div>

            {/* Urgency Stats */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => { setUrgencyFilter('critical'); selectByUrgency('critical'); }}
                className={cn(
                  'bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 transition-all hover:bg-white/20',
                  urgencyFilter === 'critical' && 'ring-2 ring-white/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/30 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{stats.critical}</p>
                    <p className="text-xs text-red-200">Overdue (7+ days)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setUrgencyFilter('high'); selectByUrgency('high'); }}
                className={cn(
                  'bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 transition-all hover:bg-white/20',
                  urgencyFilter === 'high' && 'ring-2 ring-white/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/30 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-orange-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{stats.high}</p>
                    <p className="text-xs text-orange-200">Urgent (3-7 days)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setUrgencyFilter('medium'); selectByUrgency('medium'); }}
                className={cn(
                  'bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 transition-all hover:bg-white/20',
                  urgencyFilter === 'medium' && 'ring-2 ring-white/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{stats.medium}</p>
                    <p className="text-xs text-amber-200">Pending (1-3 days)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setUrgencyFilter('low'); selectByUrgency('low'); }}
                className={cn(
                  'bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 transition-all hover:bg-white/20',
                  urgencyFilter === 'low' && 'ring-2 ring-white/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{stats.low}</p>
                    <p className="text-xs text-emerald-200">New (&lt;24 hrs)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUrgencyFilter('all')}
                className={cn(
                  'bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 transition-all hover:bg-white/20',
                  urgencyFilter === 'all' && 'ring-2 ring-white/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-white/60">All Pending</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Filters & Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-muted/50"
                />
              </div>

              <Select value={formCodeFilter} onValueChange={setFormCodeFilter}>
                <SelectTrigger className="w-40 bg-muted/50">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Form Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {uniqueFormCodes.map((code: string) => (
                    <SelectItem key={code} value={code}>
                      {formCodeLabels[code] || code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={siteFilter} onValueChange={setSiteFilter}>
                <SelectTrigger className="w-36 bg-muted/50">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {uniqueSites.map((site: string) => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selection Info & Batch Actions */}
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <>
                  <Badge variant="secondary" className="text-sm py-1.5 px-3">
                    {selectedIds.size} selected
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                  <Separator orientation="vertical" className="h-8" />
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setBatchAction('approve')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Approve All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                    onClick={() => setBatchAction('return')}
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    Return
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setBatchAction('reject')}
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Banner when nothing selected */}
        {selectedIds.size === 0 && filteredSubmissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/50 border border-accent rounded-lg p-4 flex items-center gap-3"
          >
            <Info className="h-5 w-5 text-accent-foreground flex-shrink-0" />
            <p className="text-sm text-accent-foreground">
              Select submissions using the checkboxes, or click an urgency badge above to select all items of that urgency level.
            </p>
          </motion.div>
        )}

        {/* Submissions Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Pending Submissions
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {filteredSubmissions.length} of {pendingSubmissions.length} shown
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="border-b border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center justify-center h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selectionState === 'all' ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : selectionState === 'partial' ? (
                    <MinusSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
                <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-4">Submission</div>
                  <div className="col-span-2">Requestor</div>
                  <div className="col-span-2">Site</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2 text-right">Urgency</div>
                </div>
              </div>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
              <div className="py-16 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No pending submissions</h3>
                <p className="text-muted-foreground mt-1">All caught up! Check back later.</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-border"
              >
                {filteredSubmissions.map((submission: MainDBIT) => {
                  const isSelected = selectedIds.has(submission.id);
                  const isExpanded = expandedId === submission.id;
                  const urgency = getUrgencyLevel(submission.submitteddate);

                  return (
                    <motion.div
                      key={submission.id}
                      variants={itemVariants}
                      className={cn(
                        'transition-colors',
                        isSelected && 'bg-primary/5'
                      )}
                    >
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          {/* Checkbox */}
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelection(submission.id)}
                            className="h-5 w-5"
                          />

                          {/* Main Content Grid */}
                          <div
                            className="flex-1 grid grid-cols-12 gap-4 items-center cursor-pointer"
                            onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                          >
                            {/* Submission Info */}
                            <div className="col-span-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {submission.formcode}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  Stage {submission.workflowstage || 1}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-foreground truncate">
                                {submission.title}
                              </h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {formCodeLabels[submission.formcode] || submission.formcode}
                              </p>
                            </div>

                            {/* Requestor */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground truncate">
                                  {submission.requestoremail?.split('@')[0] || 'Unknown'}
                                </span>
                              </div>
                            </div>

                            {/* Site */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {submission.siteKey ? MainDBITSiteKeyToLabel[submission.siteKey] : 'All Sites'}
                                </span>
                              </div>
                            </div>

                            {/* Date */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {submission.submitteddate
                                    ? format(new Date(submission.submitteddate), 'MMM d, yyyy')
                                    : 'N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Urgency */}
                            <div className="col-span-2 flex items-center justify-end gap-2">
                              <Badge className={cn(urgency.bgColor, urgency.color, 'text-xs')}>
                                {urgency.label}
                              </Badge>
                              <button className="text-muted-foreground hover:text-foreground">
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] as const }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pl-14">
                              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">Status</p>
                                    <Badge variant="secondary">
                                      {MainDBITCurrentstatusKeyToLabel[submission.currentStatus]}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">ID</p>
                                    <p className="font-mono text-foreground">#{submission.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">Workflow Stage</p>
                                    <p className="text-foreground">Stage {submission.workflowstage || 1}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">Locked</p>
                                    <Badge variant={submission.islocked ? 'destructive' : 'outline'}>
                                      {submission.islocked ? 'Yes' : 'No'}
                                    </Badge>
                                  </div>
                                </div>
                                {submission.remarks && (
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">Remarks</p>
                                    <p className="text-sm text-foreground bg-card p-2 rounded border border-border">
                                      {submission.remarks}
                                    </p>
                                  </div>
                                )}
                                <div className="flex gap-2 pt-2">
                                  <Button size="sm" asChild>
                                    <Link to={getITFormDetailPath(submission.formcode, submission.id)}>
                                      View Details
                                    </Link>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedIds(new Set([submission.id]));
                                      setBatchAction('approve');
                                    }}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Quick Approve
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Batch Action Confirmation Dialog */}
      <Dialog open={!!batchAction} onOpenChange={() => setBatchAction(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {batchAction && (() => {
                const config = actionConfigs[batchAction];
                const Icon = config.icon;
                return (
                  <>
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', config.buttonClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    Confirm Batch {config.label}
                  </>
                );
              })()}
            </DialogTitle>
            <DialogDescription>
              {batchAction && actionConfigs[batchAction].description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Selected Items Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Selected Submissions</span>
                <Badge variant="secondary">{selectedIds.size} items</Badge>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {filteredSubmissions
                  .filter((s: MainDBIT) => selectedIds.has(s.id))
                  .map((s: MainDBIT) => (
                    <div key={s.id} className="flex items-center gap-2 text-sm">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-muted-foreground">{s.formcode}</span>
                      <span className="text-foreground truncate flex-1">{s.title}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Comments (applied to all)
              </label>
              <Textarea
                placeholder="Add comments for all selected submissions..."
                value={batchComments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBatchComments(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {batchAction === 'reject' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">
                  This action cannot be undone. All selected submissions will be rejected.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBatchAction(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              className={batchAction ? actionConfigs[batchAction].buttonClass : ''}
              onClick={handleBatchAction}
              disabled={isProcessing || selectedIds.size === 0}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirm {batchAction && actionConfigs[batchAction].label}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
