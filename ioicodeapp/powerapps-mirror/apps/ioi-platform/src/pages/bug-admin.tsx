// Bug Admin Dashboard - Full bug report management interface
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Bug,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  User,
  Calendar,
  Monitor,
  Loader2,
  ArrowUpDown,
  Eye,
  Play,
  Check,
  Ban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { toast } from 'sonner';
import { useIssueAndBugTrackerList, useUpdateIssueAndBugTracker } from '@/generated/hooks/use-issue-and-bug-tracker';
import {
  IssueAndBugTrackerPriorityKeyToLabel,
  IssueAndBugTrackerStatusKeyToLabel,
} from '@/generated/models/issue-and-bug-tracker-model';
import type {
  IssueAndBugTracker,
  IssueAndBugTrackerPriorityKey,
  IssueAndBugTrackerStatusKey,
} from '@/generated/models/issue-and-bug-tracker-model';

// Priority configuration with semantic colors
const priorityConfig: Record<IssueAndBugTrackerPriorityKey, { label: string; variant: 'destructive' | 'default' | 'secondary' | 'outline' }> = {
  PriorityKey0: { label: 'Critical', variant: 'destructive' },
  PriorityKey1: { label: 'High', variant: 'default' },
  PriorityKey2: { label: 'Normal', variant: 'secondary' },
  PriorityKey3: { label: 'Low', variant: 'outline' },
};

// Status configuration
const statusConfig: Record<IssueAndBugTrackerStatusKey, { label: string; icon: typeof Bug; className: string }> = {
  StatusKey0: { label: 'New', icon: Bug, className: 'text-primary' },
  StatusKey1: { label: 'In Progress', icon: Play, className: 'text-amber-600' },
  StatusKey2: { label: 'Completed', icon: CheckCircle2, className: 'text-emerald-600' },
  StatusKey3: { label: 'Blocked', icon: XCircle, className: 'text-destructive' },
  StatusKey4: { label: 'Duplicate', icon: AlertTriangle, className: 'text-muted-foreground' },
  StatusKey5: { label: 'By Design', icon: Check, className: 'text-muted-foreground' },
  StatusKey6: { label: "Won't Fix", icon: Ban, className: 'text-muted-foreground' },
};

// Parse metadata from comment field
function parseMetadata(comment?: string): Record<string, unknown> {
  if (!comment) return {};
  try {
    return JSON.parse(comment);
  } catch {
    return {};
  }
}

type SortField = 'id' | 'title' | 'priorityKey' | 'statusKey' | 'reportedAt';
type SortDirection = 'asc' | 'desc';

export default function BugAdminDashboardPage() {
  const { data: bugs = [], isLoading, error, refetch } = useIssueAndBugTrackerList();
  const updateMutation = useUpdateIssueAndBugTracker();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Detail modal state
  const [selectedBug, setSelectedBug] = useState<IssueAndBugTracker | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Status update state
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComment, setUpdateComment] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    const total = bugs.length;
    const newCount = bugs.filter((b: IssueAndBugTracker) => b.statusKey === 'StatusKey0').length;
    const inProgress = bugs.filter((b: IssueAndBugTracker) => b.statusKey === 'StatusKey1').length;
    const completed = bugs.filter((b: IssueAndBugTracker) => b.statusKey === 'StatusKey2').length;
    const blocked = bugs.filter((b: IssueAndBugTracker) => b.statusKey === 'StatusKey3').length;
    const critical = bugs.filter((b: IssueAndBugTracker) => b.priorityKey === 'PriorityKey0').length;
    return { total, newCount, inProgress, completed, blocked, critical };
  }, [bugs]);

  // Filtered and sorted bugs
  const filteredBugs = useMemo(() => {
    let result = [...bugs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((b: IssueAndBugTracker) =>
        b.title.toLowerCase().includes(query) ||
        b.issueDescription?.toLowerCase().includes(query) ||
        b.department?.toLowerCase().includes(query)
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((b: IssueAndBugTracker) => b.priorityKey === priorityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((b: IssueAndBugTracker) => b.statusKey === statusFilter);
    }

    // Sort
    result.sort((a: IssueAndBugTracker, b: IssueAndBugTracker) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortField) {
        case 'id':
          aVal = a.id;
          bVal = b.id;
          break;
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'priorityKey':
          aVal = a.priorityKey || '';
          bVal = b.priorityKey || '';
          break;
        case 'statusKey':
          aVal = a.statusKey || '';
          bVal = b.statusKey || '';
          break;
        case 'reportedAt':
          const metaA = parseMetadata(a.comment);
          const metaB = parseMetadata(b.comment);
          aVal = (metaA.reportedAt as string) || '';
          bVal = (metaB.reportedAt as string) || '';
          break;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [bugs, searchQuery, priorityFilter, statusFilter, sortField, sortDirection]);

  // Toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d: SortDirection) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: IssueAndBugTrackerStatusKey) => {
    if (!selectedBug) return;

    setIsUpdating(true);
    try {
      // Parse existing metadata and add update info
      const existingMeta = parseMetadata(selectedBug.comment);
      const updatedMeta = {
        ...existingMeta,
        updatedAt: new Date().toISOString(),
        updateComment: updateComment || undefined,
        previousStatus: selectedBug.statusKey,
      };

      await updateMutation.mutateAsync({
        id: String(selectedBug.id),
        changedFields: {
          statusKey: newStatus,
          comment: JSON.stringify(updatedMeta),
        },
      });

      toast.success(`Bug #${selectedBug.id} status updated to ${IssueAndBugTrackerStatusKeyToLabel[newStatus]}`);
      setIsDetailOpen(false);
      setSelectedBug(null);
      setUpdateComment('');
      refetch();
    } catch (err) {
      toast.error('Failed to update bug status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle priority update
  const handlePriorityUpdate = async (newPriority: IssueAndBugTrackerPriorityKey) => {
    if (!selectedBug) return;

    setIsUpdating(true);
    try {
      const existingMeta = parseMetadata(selectedBug.comment);
      const updatedMeta = {
        ...existingMeta,
        updatedAt: new Date().toISOString(),
        previousPriority: selectedBug.priorityKey,
      };

      await updateMutation.mutateAsync({
        id: String(selectedBug.id),
        changedFields: {
          priorityKey: newPriority,
          comment: JSON.stringify(updatedMeta),
        },
      });

      toast.success(`Bug #${selectedBug.id} priority updated to ${IssueAndBugTrackerPriorityKeyToLabel[newPriority]}`);
      refetch();
    } catch (err) {
      toast.error('Failed to update priority');
    } finally {
      setIsUpdating(false);
    }
  };

  // Open detail modal
  const openDetail = (bug: IssueAndBugTracker) => {
    setSelectedBug(bug);
    setIsDetailOpen(true);
    setUpdateComment('');
  };

  // Stats cards animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Empty className="py-20">
          <EmptyHeader>
            <EmptyTitle>Failed to load bug reports</EmptyTitle>
            <EmptyDescription>There was an error fetching the bug tracker data.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bug className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Bug Tracker Admin</h1>
                <p className="text-sm text-muted-foreground">Manage and resolve reported issues</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <Bug className="h-8 w-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New</p>
                    <p className="text-2xl font-bold text-foreground">{stats.newCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In Progress</p>
                    <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</p>
                    <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blocked</p>
                    <p className="text-2xl font-bold text-foreground">{stats.blocked}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Critical</p>
                    <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bugs by title, description, or department..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-40">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {Object.entries(IssueAndBugTrackerPriorityKeyToLabel).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.entries(IssueAndBugTrackerStatusKeyToLabel).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bug Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredBugs.length === 0 ? (
              <Empty className="py-20">
                <EmptyHeader>
                  <EmptyTitle>No bugs found</EmptyTitle>
                  <EmptyDescription>
                    {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No bug reports have been submitted yet'}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-20">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 -ml-3 gap-1 font-medium"
                          onClick={() => toggleSort('id')}
                        >
                          ID
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 -ml-3 gap-1 font-medium"
                          onClick={() => toggleSort('title')}
                        >
                          Title
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-28">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 -ml-3 gap-1 font-medium"
                          onClick={() => toggleSort('priorityKey')}
                        >
                          Priority
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-32">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 -ml-3 gap-1 font-medium"
                          onClick={() => toggleSort('statusKey')}
                        >
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-28">Department</TableHead>
                      <TableHead className="w-36">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 -ml-3 gap-1 font-medium"
                          onClick={() => toggleSort('reportedAt')}
                        >
                          Reported
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredBugs.map((bug: IssueAndBugTracker, index: number) => {
                        const meta = parseMetadata(bug.comment);
                        const reportedAt = meta.reportedAt ? new Date(meta.reportedAt as string) : null;
                        const StatusIcon = bug.statusKey ? statusConfig[bug.statusKey]?.icon || Bug : Bug;
                        const statusClass = bug.statusKey ? statusConfig[bug.statusKey]?.className || '' : '';

                        return (
                          <motion.tr
                            key={bug.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="group hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              #{bug.id}
                            </TableCell>
                            <TableCell>
                              <div className="max-w-md">
                                <p className="font-medium text-foreground truncate">{bug.title}</p>
                                {bug.issueDescription && (
                                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                                    {bug.issueDescription.substring(0, 80)}...
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {bug.priorityKey && (
                                <Badge variant={priorityConfig[bug.priorityKey]?.variant || 'secondary'}>
                                  {IssueAndBugTrackerPriorityKeyToLabel[bug.priorityKey]}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <StatusIcon className={cn('h-4 w-4', statusClass)} />
                                <span className="text-sm text-foreground">
                                  {bug.statusKey ? IssueAndBugTrackerStatusKeyToLabel[bug.statusKey] : 'Unknown'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {bug.department || '—'}
                              </span>
                            </TableCell>
                            <TableCell>
                              {reportedAt ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-sm text-muted-foreground cursor-help">
                                        {formatDistanceToNow(reportedAt, { addSuffix: true })}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {format(reportedAt, 'PPpp')}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="text-sm text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetail(bug)}
                                className="gap-1.5"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bug Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBug && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">BUG-{String(selectedBug.id).padStart(3, '0')}</p>
                    <DialogTitle className="text-lg mt-1">{selectedBug.title}</DialogTitle>
                  </div>
                  {selectedBug.priorityKey && (
                    <Badge variant={priorityConfig[selectedBug.priorityKey]?.variant || 'secondary'}>
                      {IssueAndBugTrackerPriorityKeyToLabel[selectedBug.priorityKey]}
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Description */}
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
                  <p className="mt-2 text-foreground whitespace-pre-wrap">
                    {selectedBug.issueDescription || 'No description provided'}
                  </p>
                </div>

                {/* Metadata grid */}
                {(() => {
                  const meta = parseMetadata(selectedBug.comment);
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                          <User className="h-3 w-3" /> Reported By
                        </Label>
                        <p className="text-sm text-foreground">{(meta.reportedBy as string) || 'Unknown'}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" /> Reported At
                        </Label>
                        <p className="text-sm text-foreground">
                          {meta.reportedAt ? format(new Date(meta.reportedAt as string), 'PPpp') : '—'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                          <ExternalLink className="h-3 w-3" /> Page
                        </Label>
                        <p className="text-sm text-foreground font-mono">{(meta.currentPage as string) || '/'}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                          <Monitor className="h-3 w-3" /> Browser
                        </Label>
                        <p className="text-sm text-foreground truncate" title={(meta.browserInfo as string) || ''}>
                          {(meta.browserInfo as string)?.substring(0, 40) || '—'}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Steps to reproduce */}
                {(() => {
                  const meta = parseMetadata(selectedBug.comment);
                  if (meta.stepsToReproduce) {
                    return (
                      <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Steps to Reproduce</Label>
                        <p className="mt-2 text-sm text-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">
                          {meta.stepsToReproduce as string}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Screenshot */}
                {(() => {
                  const meta = parseMetadata(selectedBug.comment);
                  if (meta.screenshot) {
                    return (
                      <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Screenshot</Label>
                        <div className="mt-2 rounded-lg overflow-hidden border">
                          <img
                            src={meta.screenshot as string}
                            alt="Bug screenshot"
                            className="w-full h-auto max-h-64 object-contain bg-muted"
                          />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Status & Priority Update */}
                <div className="border-t pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Update Status</Label>
                      <Select
                        value={selectedBug.statusKey || ''}
                        onValueChange={(val: string) => handleStatusUpdate(val as IssueAndBugTrackerStatusKey)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(IssueAndBugTrackerStatusKeyToLabel).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Update Priority</Label>
                      <Select
                        value={selectedBug.priorityKey || ''}
                        onValueChange={(val: string) => handlePriorityUpdate(val as IssueAndBugTrackerPriorityKey)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(IssueAndBugTrackerPriorityKeyToLabel).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                      <MessageSquare className="h-3 w-3 inline mr-1" />
                      Add Comment (optional)
                    </Label>
                    <Textarea
                      placeholder="Add a note about this update..."
                      value={updateComment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdateComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
