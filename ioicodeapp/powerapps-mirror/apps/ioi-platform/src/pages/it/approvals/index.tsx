/**
 * IT Approval Dashboard
 * 
 * Central hub for managing IT approval tasks including:
 * - My Tasks (pending my approval)
 * - My Submissions (forms I've submitted)
 * - Team Tasks (delegated/escalated)
 * - Analytics dashboard
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  Users,
  BarChart3,
  Search,
  ChevronRight,
  Bell,
  Calendar,
  Zap,
  ArrowUpRight,
  RefreshCcw,
  Loader2,
} from 'lucide-react';
import { format, formatDistanceToNow, isAfter } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import { IGLayout } from '@/components/layout/ig-layout';
import { IGPageHeader } from '@/components/layout/ig-page-header';
import { useUser } from '@/hooks/use-user';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT, type MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import type { UrgencyLevel, WorkflowStatus, SiteCode } from '@/types/it-approval-workflow';
import { ALL_IT_FORMS, getFormByCode } from '@/lib/it-forms-config';
import { getITFormDetailPath } from '@/lib/it-form-routes';

// =============================================================================
// DATA TYPES
// =============================================================================

interface ApprovalTask {
  id: string;
  recordId: number;
  formCode: string;
  formName: string;
  title: string;
  submitter: string;
  submitterEmail: string;
  submitterDept: string;
  submittedDate: Date;
  currentStage: string;
  dueDate: Date;
  urgency: UrgencyLevel;
  status: WorkflowStatus;
  site: SiteCode;
}

function getFormName(formCode: string): string {
  return getFormByCode(formCode)?.name || formCode;
}

const APPROVAL_FILTER_FORMS = ALL_IT_FORMS.filter((form) =>
  ['M1', 'M2', 'M3', 'M4', 'M5'].includes(form.module)
);

// Map status key to workflow status
function mapToWorkflowStatus(status?: string): WorkflowStatus {
  if (!status) return 'Draft';
  const label = status;
  const statusMap: Record<string, WorkflowStatus> = {
    'Draft': 'Draft',
    'Submitted': 'Submitted',
    'Under_Review': 'InProgress',
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'Completed': 'Completed',
    'Cancelled': 'Closed',
  };
  return statusMap[label] || 'InProgress';
}

// Calculate urgency based on submission date and form type
function calculateUrgency(submittedDate: Date, formCode: string): UrgencyLevel {
  const now = new Date();
  const daysSinceSubmission = Math.floor((now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // RS and ITSSR are typically more urgent
  if (formCode === 'RS' || formCode === 'ITSSR') {
    if (daysSinceSubmission > 2) return 'Critical';
    if (daysSinceSubmission > 1) return 'High';
    return 'Normal';
  }
  
  // Other forms
  if (daysSinceSubmission > 7) return 'Critical';
  if (daysSinceSubmission > 5) return 'High';
  if (daysSinceSubmission > 3) return 'Normal';
  return 'Low';
}

// Calculate due date based on submission and form type
function calculateDueDate(submittedDate: Date, formCode: string): Date {
  const daysToAdd = formCode === 'RS' || formCode === 'ITSSR' ? 1 : 5;
  return new Date(submittedDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
}

// =============================================================================
// HELPERS
// =============================================================================

const getUrgencyConfig = (urgency: UrgencyLevel) => {
  const configs = {
    Low: { bg: 'bg-muted', text: 'text-muted-foreground', icon: Clock },
    Normal: { bg: 'bg-primary/15', text: 'text-primary', icon: CheckCircle },
    High: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertTriangle },
    Critical: { bg: 'bg-red-100', text: 'text-red-800', icon: Zap },
  };
  return configs[urgency];
};

const getStatusConfig = (status: WorkflowStatus) => {
  const configs: Record<WorkflowStatus, { bg: string; text: string; label: string }> = {
    Draft: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Draft' },
    Submitted: { bg: 'bg-secondary', text: 'text-secondary-foreground', label: 'Submitted' },
    InProgress: { bg: 'bg-primary/10', text: 'text-primary', label: 'In Progress' },
    PendingApproval: { bg: 'bg-accent', text: 'text-accent-foreground', label: 'Pending' },
    Approved: { bg: 'bg-primary/10', text: 'text-primary', label: 'Approved' },
    Rejected: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Rejected' },
    Returned: { bg: 'bg-accent', text: 'text-accent-foreground', label: 'Returned' },
    Escalated: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Escalated' },
    Completed: { bg: 'bg-primary/10', text: 'text-primary', label: 'Completed' },
    Closed: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Closed' },
  };
  return configs[status];
};

const getFormIcon = (formCode: string) => {
  return getFormByCode(formCode)?.icon || FileText;
};

// =============================================================================
// STATS CARDS
// =============================================================================

function StatsCards({ pendingCount, overdueCount, submissionsCount, completedCount }: {
  pendingCount: number;
  overdueCount: number;
  submissionsCount: number;
  completedCount: number;
}) {
  const stats = [
    {
      label: 'Pending My Approval',
      value: pendingCount,
      icon: Clock,
      color: 'text-accent-foreground',
      bg: 'bg-accent/20',
    },
    {
      label: 'Overdue Tasks',
      value: overdueCount,
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      label: 'My Submissions',
      value: submissionsCount,
      icon: Send,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Completed This Month',
      value: completedCount,
      icon: CheckCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// =============================================================================
// TASK TABLE
// =============================================================================

function TaskTable({ tasks, onRowClick }: { tasks: ApprovalTask[]; onRowClick: (task: ApprovalTask) => void }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-foreground">Request</TableHead>
            <TableHead className="font-semibold text-foreground">Submitter</TableHead>
            <TableHead className="font-semibold text-foreground">Stage</TableHead>
            <TableHead className="font-semibold text-foreground">Due Date</TableHead>
            <TableHead className="font-semibold text-foreground">Urgency</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: ApprovalTask, index: number) => {
            const isOverdue = isAfter(new Date(), task.dueDate);
            const FormIcon = getFormIcon(task.formCode);
            const urgencyConfig = getUrgencyConfig(task.urgency);
            const statusConfig = getStatusConfig(task.status);
            
            return (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRowClick(task)}
                className="cursor-pointer hover:bg-muted/80 transition-colors border-b"
              >
                <TableCell>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <FormIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate max-w-[200px]" title={task.title}>{task.title}</p>
                      <p className="text-sm text-muted-foreground truncate" title={`${task.id} • ${task.formName}`}>
                        {task.id} • {task.formName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0 max-w-[180px]">
                    <p className="text-sm font-medium text-foreground truncate" title={task.submitter}>{task.submitter}</p>
                    <p className="text-sm text-muted-foreground truncate" title={task.submitterDept}>{task.submitterDept}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{task.currentStage}</span>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-sm">
                            {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                          </span>
                          {isOverdue && <AlertTriangle className="h-3.5 w-3.5" />}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{format(task.dueDate, 'PPP')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Badge className={`${urgencyConfig.bg} ${urgencyConfig.text} border-0`}>
                    {task.urgency}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusConfig.bg} ${statusConfig.text} border-0`}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
      {tasks.length === 0 && (
        <div className="p-12 text-center">
          <CheckCircle className="h-12 w-12 text-primary/20 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="text-sm text-muted-foreground mt-1">No pending tasks at the moment.</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ITApprovalDashboard() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser();
  
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');
  
  // Fetch IT records from SharePoint — only pending/active statuses for efficiency
  const { data: mainRecords = [], isLoading: recordsLoading } = useMainDBITList({
    orderBy: ['submitteddate desc'],
    filter: "currentStatus ne 'CurrentstatusKey3' and currentStatus ne 'CurrentstatusKey2' and currentStatus ne 'CurrentstatusKey6'",
  });
  
  const isLoading = userLoading || recordsLoading;
  const userEmail = user?.userPrincipalName?.toLowerCase();
  
  // Transform SharePoint records to ApprovalTask format
  const allTasks: ApprovalTask[] = useMemo(() => {
    return mainRecords
      .filter((record: MainDBIT) => record.submitteddate) // Only records with submission date
      .map((record: MainDBIT) => {
        const formCode = record.formcode || 'ITSSR';
        const submittedDate = new Date(record.submitteddate!);
        const urgency = calculateUrgency(submittedDate, formCode);
        const status = mapToWorkflowStatus(record.currentStatus);
        
        return {
          id: record.title || `IT-${record.id}`,
          recordId: record.id,
          formCode,
          formName: getFormName(formCode),
          title: record.title || 'Untitled Request',
          submitter: record.requestorName || record.requestoremail?.split('@')[0] || 'Unknown',
          submitterEmail: record.requestoremail || '',
          submitterDept: record.company || '—',
          submittedDate,
          currentStage: MainDBITCurrentstatusKeyToLabel[record.currentStatus as MainDBITCurrentstatusKey] || 'Pending',
          dueDate: calculateDueDate(submittedDate, formCode),
          urgency,
          status,
          site: 'PRAI' as SiteCode,
        };
      });
  }, [mainRecords]);
  
  // Pending tasks - records awaiting approval (not my submissions)
  const pendingTasks = useMemo(() => {
    if (!userEmail) return allTasks.filter((task: ApprovalTask) => {
      return task.status === 'Submitted' || task.status === 'InProgress' || task.status === 'PendingApproval';
    });
    return allTasks.filter((task: ApprovalTask) => {
      const isPending = task.status === 'Submitted' || task.status === 'InProgress' || task.status === 'PendingApproval';
      const isNotMySubmission = task.submitterEmail.toLowerCase() !== userEmail;
      return isPending && isNotMySubmission;
    });
  }, [allTasks, userEmail]);
  
  // My submissions - records I submitted
  const mySubmissions = useMemo(() => {
    if (!userEmail) return [];
    return allTasks.filter((task: ApprovalTask) => {
      return task.submitterEmail.toLowerCase() === userEmail;
    });
  }, [allTasks, userEmail]);
  
  // Completed tasks this month
  const completedThisMonth = useMemo(() => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    return allTasks.filter((task: ApprovalTask) => {
      return task.status === 'Completed' && task.submittedDate >= startOfMonth;
    }).length;
  }, [allTasks]);
  
  // Filter pending tasks
  const filteredPendingTasks = useMemo(() => {
    return pendingTasks.filter((task: ApprovalTask) => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (urgencyFilter !== 'all' && task.urgency !== urgencyFilter) return false;
      if (formFilter !== 'all' && task.formCode !== formFilter) return false;
      return true;
    });
  }, [pendingTasks, searchQuery, urgencyFilter, formFilter]);
  
  // Filter my submissions
  const filteredSubmissions = useMemo(() => {
    return mySubmissions.filter((task: ApprovalTask) => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [mySubmissions, searchQuery]);
  
  const overdueCount = pendingTasks.filter((t: ApprovalTask) => isAfter(new Date(), t.dueDate)).length;
  
  // Form type analytics from actual data
  const formTypeStats = useMemo(() => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyTasks = allTasks.filter((task: ApprovalTask) => task.submittedDate >= startOfMonth);
    const counts: Record<string, number> = {};
    monthlyTasks.forEach((task: ApprovalTask) => {
      counts[task.formCode] = (counts[task.formCode] || 0) + 1;
    });
    
    return Object.entries(counts).map(([code, count]) => ({
      code,
      name: getFormName(code),
      count,
      color: getFormByCode(code) ? 'bg-primary' : 'bg-muted',
    }));
  }, [allTasks]);
  
  const handleRowClick = (task: ApprovalTask) => {
    navigate(getITFormDetailPath(task.formCode, task.recordId));
  };
  
  return (
    <IGLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <IGPageHeader
          title="Approval Dashboard"
          subtitle={isLoading ? 'Loading...' : `Welcome back, ${user?.fullName || 'User'}. You have ${pendingTasks.length} tasks pending your approval.`}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading approval tasks from SharePoint...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <StatsCards
              pendingCount={pendingTasks.length}
              overdueCount={overdueCount}
              submissionsCount={mySubmissions.length}
              completedCount={completedThisMonth}
            />
            
            {/* Main Content */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="pending" className="gap-2">
                        <Clock className="h-4 w-4" />
                        My Tasks
                        <Badge variant="secondary" className="ml-1">{pendingTasks.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="submissions" className="gap-2">
                        <Send className="h-4 w-4" />
                        My Submissions
                        <Badge variant="secondary" className="ml-1">{mySubmissions.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="team" className="gap-2">
                        <Users className="h-4 w-4" />
                        Team Tasks
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Urgency</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={formFilter} onValueChange={setFormFilter}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Form Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Forms</SelectItem>
                        {APPROVAL_FILTER_FORMS.map((form) => (
                          <SelectItem key={form.code} value={form.code}>
                            {form.code} - {form.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {activeTab === 'pending' && (
                  <TaskTable tasks={filteredPendingTasks} onRowClick={handleRowClick} />
                )}
                
                {activeTab === 'submissions' && (
                  <TaskTable tasks={filteredSubmissions} onRowClick={handleRowClick} />
                )}
                
                {activeTab === 'team' && (
                  <div className="p-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">Team Tasks</p>
                    <p className="text-sm text-muted-foreground mt-1">Delegated and team approval tasks will appear here once feature is enabled.</p>
                    <Button variant="outline" className="mt-4" disabled>
                      <Bell className="h-4 w-4 mr-2" />
                      Enable Delegation (Coming Soon)
                    </Button>
                  </div>
                )}
                
                {activeTab === 'analytics' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Approval Rate Card */}
                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          Approval Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Records</span>
                            <span className="font-semibold text-foreground">{allTasks.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Pending Tasks</span>
                            <span className="font-semibold text-primary">{pendingTasks.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Overdue Tasks</span>
                            <span className="font-semibold text-destructive">{overdueCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Completed This Month</span>
                            <span className="font-semibold text-primary">{completedThisMonth}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* By Form Type Card */}
                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          By Form Type (This Month)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {formTypeStats.length > 0 ? (
                            formTypeStats.map((item: { code: string; name: string; count: number; color: string }) => (
                              <div key={item.code} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                <span className="text-sm text-foreground flex-1">{item.name}</span>
                                <span className="text-sm font-medium text-foreground">{item.count}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No submissions this month yet.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bell className="h-4 w-4" />
                <span>Showing {allTasks.length} records from SharePoint</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/it/forms/itssr/new')}>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </>
        )}
      </div>
    </IGLayout>
  );
}
