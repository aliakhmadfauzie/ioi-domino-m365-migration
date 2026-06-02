import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye,
  Calendar,
  Edit3,
  Mail,
  User,
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
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useUser } from '@/hooks/use-user';
import { PageLoading } from '@/components/page-loading';
import { DataReadyGuard } from '@/components/data-ready-guard';
import {
  MainDBITCurrentstatusKeyToLabel,
  type MainDBIT,
} from '@/generated/models/main-dbit-model';
import { getModuleWorkflow } from '@/config/module-workflows';
import { format } from 'date-fns';
import { EditRequestModal } from '@/components/workflow/edit-request-modal';
import {
  hasActiveEditRequest,
  isSubmissionEditable,
} from '@/hooks/use-edit-request';
import { statusConfig, isPendingStatus } from '@/lib/status-utils';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import { getITFormDetailPath } from '@/lib/it-form-routes';

const getStatusIcon = (statusKey: string) => {
  const cfg = statusConfig[statusKey as MainDBITCurrentstatusKey];
  if (!cfg || cfg.type === 'initial') return <FileText className="h-4 w-4" />;
  if (cfg.type === 'in-progress') return <Clock className="h-4 w-4" />;
  if (statusKey === 'CurrentstatusKey2' || statusKey === 'CurrentstatusKey6') return <XCircle className="h-4 w-4" />;
  return <CheckCircle className="h-4 w-4" />;
};

// Terminal-positive statuses: Active, Approved, Sent, Verified
const TERMINAL_POSITIVE_KEYS = new Set(['CurrentstatusKey0', 'CurrentstatusKey1', 'CurrentstatusKey4', 'CurrentstatusKey5']);

function MySubmissionsContent() {
  const { data: user, isLoading: userLoading } = useUser();

  // Use OData filter for delegation safety — fetches only the current user's submissions
  const userEmail = user?.userPrincipalName;
  const { data: allSubmissions = [], isLoading: submissionsLoading, error: submissionsError } = useMainDBITList({
    filter: userEmail ? `Requestor_Email eq '${userEmail.replace(/'/g, "''")}'` : undefined,
    orderBy: ['submitteddate desc'],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Edit request modal state
  const [editRequestModalOpen, setEditRequestModalOpen] = useState(false);
  const [selectedSubmissionForEdit, setSelectedSubmissionForEdit] = useState<MainDBIT | null>(null);
  const isLoading = userLoading || submissionsLoading;

  // Debug logging — only in dev mode, no PII
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[DEBUG] My Submissions: total records fetched:', allSubmissions.length);
    }
  }, [allSubmissions.length]);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Read formCode from URL query param: /my-submissions?form=EAF
  const [searchParams] = useSearchParams();
  const activeFormCode = searchParams.get('form') || '';

  // Get module workflow config if a specific form is selected
  const activeWorkflow = useMemo(() => {
    if (!activeFormCode) return null;
    return getModuleWorkflow(activeFormCode);
  }, [activeFormCode]);

  // Build dynamic status filter options from workflow stages
  const statusOptions = useMemo(() => {
    if (activeWorkflow) {
      // Use workflow stage names mapped to currentStatus labels
      const stageKeys = activeWorkflow.stages.map((s) => s.key);
      return [
        { value: 'all', label: 'All Statuses' },
        ...stageKeys.map((key) => ({
          value: key,
          label: activeWorkflow.stages.find((s) => s.key === key)?.name || key,
        })),
        { value: 'terminal', label: 'Terminal / Completed' },
      ];
    }
    // Default: use the full 60-status list as before
    return [
      { value: 'all', label: 'All Statuses' },
      { value: 'CurrentstatusKey3', label: 'Draft' },
      { value: 'pending', label: 'In Progress (any stage)' },
      { value: 'CurrentstatusKey1', label: 'Approved' },
      { value: 'CurrentstatusKey0', label: 'Active' },
      { value: 'CurrentstatusKey4', label: 'Sent' },
      { value: 'CurrentstatusKey5', label: 'Verified' },
      { value: 'CurrentstatusKey2', label: 'Closed' },
      { value: 'CurrentstatusKey6', label: 'Withdrawn' },
    ];
  }, [activeWorkflow]);

  // Get display name for the active form
  const formDisplayName = useMemo(() => {
    if (!activeFormCode) return 'My Submissions';
    const wf = getModuleWorkflow(activeFormCode);
    return wf?.name || activeFormCode;
  }, [activeFormCode]);

  // Helper: get status color from workflow stage
  function getStatusStyle(status: string): { bg: string; text: string; label: string } {
    // First try workflow stages
    if (activeWorkflow) {
      const stage = activeWorkflow.stages.find((s) => s.key === status);
      if (stage) {
        const isTerminal = activeWorkflow.terminalStageKeys.includes(stage.key);
        const isInitial = stage.key === activeWorkflow.initialStageKey;
        return {
          bg: isTerminal ? 'bg-green-100' : isInitial ? 'bg-slate-100' : 'bg-amber-100',
          text: isTerminal ? 'text-green-800' : isInitial ? 'text-slate-600' : 'text-amber-800',
          label: stage.name,
        };
      }
    }
    // Fallback to status key lookup
    const cfg = statusConfig[status as MainDBITCurrentstatusKey];
    if (cfg) return { bg: cfg.bgColor, text: cfg.color, label: MainDBITCurrentstatusKeyToLabel[status as MainDBITCurrentstatusKey] || status };
    return { bg: 'bg-slate-100', text: 'text-slate-600', label: status || 'Unknown' };
  }

  // Filter submissions for current user
  const mySubmissions = useMemo(() => {
    const userEmail = user?.userPrincipalName?.toLowerCase()?.trim();
    const userNamePart = userEmail?.split('@')[0] || '';

    if (!userEmail) {
      return [];
    }

    const filtered = allSubmissions.filter((s: MainDBIT) => {
      // Hide ITSSR — has its own dedicated screens (list, detail, new)
      if (s.formcode === 'ITSSR') return false;
      // First apply formCode filter if active
      if (activeFormCode && s.formcode !== activeFormCode) return false;

      const requestorEmail = s.requestoremail?.toLowerCase()?.trim() || '';
      const requestorNamePart = requestorEmail.split('@')[0];

      const exactMatch = requestorEmail === userEmail;
      const usernameMatch = requestorNamePart && userNamePart && requestorNamePart === userNamePart;

      return exactMatch || usernameMatch;
    });

    return filtered;
  }, [allSubmissions, user, activeFormCode]);

  // Apply filters
  const filteredSubmissions = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return mySubmissions.filter((s: MainDBIT) => {
      const matchesSearch =
        String(s.title || '').toLowerCase().includes(query) ||
        String(s.formcode || '').toLowerCase().includes(query);

      // Dynamic status matching
      let matchesStatus = statusFilter === 'all';
      if (!matchesStatus) {
        if (activeWorkflow) {
          // Match against workflow stage keys
          matchesStatus = s.currentStatus === statusFilter;
          if (statusFilter === 'terminal') {
            matchesStatus = activeWorkflow.terminalStageKeys.includes(s.currentStatus);
          }
        } else {
          // Legacy matching
          matchesStatus =
            (statusFilter === 'pending' && isPendingStatus(s.currentStatus)) ||
            s.currentStatus === statusFilter;
        }
      }

      return matchesSearch && matchesStatus;
    });
  }, [mySubmissions, searchTerm, statusFilter, activeWorkflow]);

  // Stats — aligned with 60-status model
  const stats = useMemo(() => {
    const pending = mySubmissions.filter((s: MainDBIT) => isPendingStatus(s.currentStatus)).length;
    const draft   = mySubmissions.filter((s: MainDBIT) => s.currentStatus === 'CurrentstatusKey3').length;
    const done    = mySubmissions.filter((s: MainDBIT) => TERMINAL_POSITIVE_KEYS.has(s.currentStatus)).length;
    const closed  = mySubmissions.filter((s: MainDBIT) =>
      s.currentStatus === 'CurrentstatusKey2' || s.currentStatus === 'CurrentstatusKey6'
    ).length;
    return { draft, pending, done, closed, total: mySubmissions.length };
  }, [mySubmissions]);

  // Show error state if data fetch failed
  if (submissionsError) {
    if (import.meta.env.DEV) console.error('[DEBUG] Error fetching submissions:', submissionsError);
    return (
      <div className="p-6">
        <Card className="bg-white border-destructive elevation-1">
          <CardContent className="p-6">
            <h2 className="text-section-heading text-destructive mb-2">Error Loading Submissions</h2>
            <p className="text-body-md text-muted-foreground mb-4">
              Failed to fetch data from SharePoint. This could be due to:
            </p>
            <ul className="list-disc list-inside text-body-sm text-muted-foreground space-y-1 mb-4">
              <li>SharePoint list permissions issue</li>
              <li>Network connectivity problem</li>
              <li>SDK configuration issue</li>
            </ul>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
              {JSON.stringify(submissionsError, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoading message="Loading submissions..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Personalized Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
        className="bg-primary rounded-xl p-5 elevation-1"
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {getGreeting()}, {user?.fullName || 'there'}!
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              {activeFormCode ? (
                <><span className="font-semibold text-white/90">{formDisplayName}</span> — My Submissions</>
              ) : (
                <>{user?.userPrincipalName || 'Guest'} — My Submissions</>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid gap-4 grid-cols-2 md:grid-cols-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
      >
        <Card className="bg-white border-border elevation-1">
          <CardContent className="pt-4 pb-4">
            <p className="text-meta text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-section-heading text-foreground mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-border elevation-1">
          <CardContent className="pt-4 pb-4">
            <p className="text-meta text-muted-foreground uppercase tracking-wider">Draft</p>
            <p className="text-section-heading text-foreground mt-1">{stats.draft}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-border elevation-1">
          <CardContent className="pt-4 pb-4">
            <p className="text-meta text-amber-700 uppercase tracking-wider">In Progress</p>
            <p className="text-section-heading text-foreground mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-border elevation-1">
          <CardContent className="pt-4 pb-4">
            <p className="text-meta text-emerald-700 uppercase tracking-wider">Approved</p>
            <p className="text-section-heading text-foreground mt-1">{stats.done}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-border elevation-1">
          <CardContent className="pt-4 pb-4">
            <p className="text-meta text-muted-foreground uppercase tracking-wider">Closed</p>
            <p className="text-section-heading text-foreground mt-1">{stats.closed}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <Card className="bg-white border-border elevation-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[160px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or form code..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-9 bg-muted border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-muted border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="bg-white border-border elevation-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-section-heading text-foreground">
              {activeFormCode ? formDisplayName : 'All Submissions'}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {filteredSubmissions.length} of {mySubmissions.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <AnimatePresence mode="popLayout">
            {filteredSubmissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Empty className="py-12">
                  <EmptyHeader>
                    <EmptyTitle>No submissions found</EmptyTitle>
                    <EmptyDescription>
                      {mySubmissions.length === 0
                        ? activeFormCode
                          ? `You haven't submitted any ${formDisplayName} requests yet.`
                          : "You haven't made any submissions yet."
                        : 'No submissions match your current filters.'}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {filteredSubmissions.map((submission: MainDBIT, index: number) => {
                  const statusStyle = getStatusStyle(submission.currentStatus);
                  const detailPath = getITFormDetailPath(submission.formcode, submission.id);
                  const editPath = `${detailPath}?edit=true`;
                  // Parse submitter info
                  const submitterName = submission.requestorName || submission.requestoremail?.split('@')[0] || 'Unknown';
                  const submitterEmail = submission.requestoremail || '';
                  // Extract extra info from remarks (approvers, assignee)
                  let assigneeName = '';
                  let assigneeEmail = '';
                  try {
                    const remarksData = JSON.parse(submission.remarks || '{}');
                    if (remarksData.approvers?.approver?.email) {
                      assigneeEmail = remarksData.approvers.approver.email;
                      assigneeName = remarksData.approvers.approver.name || assigneeEmail;
                    }
                  } catch { /* remarks not JSON, ignore */ }

                  return (
                    <motion.div
                      key={submission.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.03, ease: [0.2, 0, 0, 1] as const }}
                    >
                      <Link to={detailPath} className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-muted transition-standard border border-transparent hover:border-border cursor-pointer group">
                        {/* Status indicator dot + icon */}
                        <div className={`hidden sm:flex h-12 w-12 items-center justify-center rounded-full ${statusStyle.bg}`}>
                          {statusStyle.label === 'Draft' ? <FileText className={`h-5 w-5 ${statusStyle.text}`} /> :
                           statusStyle.label === 'Completed' || statusStyle.label === 'Closed' ? <CheckCircle className={`h-5 w-5 ${statusStyle.text}`} /> :
                           <Clock className={`h-5 w-5 ${statusStyle.text}`} />}
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-label-lg text-foreground truncate font-semibold">{submission.title}</h3>
                            <Badge className={`${statusStyle.bg} ${statusStyle.text} border-0`}>
                              {statusStyle.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-muted-foreground">
                            <span className="font-medium text-foreground/80">{submission.formcode || 'N/A'}</span>
                            <Separator orientation="vertical" className="h-4 shrink-0" />
                            <span className="flex items-center gap-1 min-w-0">
                              <User className="h-3.5 w-3.5 shrink-0" />
                              <span title={submitterEmail} className="truncate">{submitterName}</span>
                            </span>
                            {submitterEmail && (
                              <>
                                <Separator orientation="vertical" className="h-4" />
                                <a href={`mailto:${submitterEmail}`} className="flex items-center gap-1 text-primary hover:text-primary/80 hover:underline" title={`Email ${submitterEmail}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                  <Mail className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline text-sm">{submitterEmail}</span>
                                </a>
                              </>
                            )}
                            {submission.submitteddate && (
                              <>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(submission.submitteddate), 'MMM dd, yyyy')}
                                </span>
                              </>
                            )}
                          </div>
                          {/* Assignee line */}
                          {assigneeEmail && (
                            <div className="flex items-center gap-2 mt-1.5 text-xs">
                              <span className="text-muted-foreground">Assigned to:</span>
                              <a href={`mailto:${assigneeEmail}`} className="flex items-center gap-1 text-amber-700 hover:text-amber-900 hover:underline" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <User className="h-3 w-3" />
                                {assigneeName || assigneeEmail}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {TERMINAL_POSITIVE_KEYS.has(submission.currentStatus) &&
                            !hasActiveEditRequest(submission.remarks) &&
                            !isSubmissionEditable(submission.remarks) && (
                            <Button
                              variant="ghost"
                              size="default"
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSubmissionForEdit(submission);
                                setEditRequestModalOpen(true);
                              }}
                              className="text-muted-foreground hover:text-foreground h-11"
                            >
                              <Edit3 className="h-4 w-4 mr-1.5" />
                              Request Edit
                            </Button>
                          )}
                          {isSubmissionEditable(submission.remarks) && (
                            <Link to={editPath} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                              <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground h-11">
                                <Edit3 className="h-4 w-4 mr-1.5" />
                                Edit Now
                              </Button>
                            </Link>
                          )}
                          <Link to={detailPath}>
                            <Button variant="outline" size="default" className="text-foreground border-primary/30 hover:bg-primary/5 hover:border-primary h-11">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Edit Request Modal */}
      {selectedSubmissionForEdit && user?.userPrincipalName && (
        <EditRequestModal
          open={editRequestModalOpen}
          onOpenChange={setEditRequestModalOpen}
          submission={selectedSubmissionForEdit}
          userEmail={user.userPrincipalName}
        />
      )}
    </div>
  );
}

// Export with DataReadyGuard wrapper
export default function MySubmissionsPage() {
  return (
    <DataReadyGuard loadingMessage="Loading your submissions...">
      <MySubmissionsContent />
    </DataReadyGuard>
  );
}
