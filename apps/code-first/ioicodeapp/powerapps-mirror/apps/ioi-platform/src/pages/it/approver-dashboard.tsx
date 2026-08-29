/**
 * IT Approver Dashboard
 * 
 * Central hub for approvers to:
 * - View all pending approval requests
 * - Take action (approve/reject/return)
 * - See approval history
 * - Track SLA and escalations
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  FileText,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  User,
  Eye,
  MessageSquare,
  RotateCcw,
  ArrowUpRight,
  Inbox,
  Bell,
  RefreshCcw,
  Edit3,
} from 'lucide-react';
import { format, formatDistanceToNow, isAfter, addDays } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { IGLayout } from '@/components/layout/ig-layout';
import { IGPageHeader } from '@/components/layout/ig-page-header';
import { useUser } from '@/hooks/use-user';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { useMainDBITList, useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useSendEmail } from '@/hooks/use-send-email';
import { useFormRegistry } from '@/hooks/use-admin-config';
import type { MainDBIT, MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import { EditRequestApprovalPanel } from '@/components/workflow/edit-request-approval-panel';
import { usePendingEditRequests } from '@/hooks/use-edit-request';
import { ALL_IT_FORMS, getFormByCode } from '@/lib/it-forms-config';
import { getITFormDetailPath } from '@/lib/it-form-routes';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
} as const;

function getFormIcon(formCode: string): typeof FileText {
  return getFormByCode(formCode)?.icon || FileText;
}

function getFormTitle(formCode: string): string {
  return getFormByCode(formCode)?.name || formCode;
}

const APPROVER_FILTER_FORMS = ALL_IT_FORMS.filter((form) =>
  ['M1', 'M2', 'M3', 'M4', 'M5'].includes(form.module)
);

// Priority colors
const PRIORITY_CONFIG: Record<string, { bg: string; text: string }> = {
  Critical: { bg: 'bg-destructive/10', text: 'text-destructive' },
  High: { bg: 'bg-accent', text: 'text-accent-foreground' },
  Normal: { bg: 'bg-primary/10', text: 'text-primary' },
  Low: { bg: 'bg-secondary', text: 'text-secondary-foreground' },
};

interface ApprovalRequest {
  id: number;
  ticketId: string;
  formCode: string;
  title: string;
  requestorName: string;
  requestorEmail: string;
  submittedDate: Date;
  dueDate: Date;
  priority: string;
  currentStage: string;
  justification: string;
  details: Record<string, string>;
  rawData: MainDBIT;
}

function ApproverDashboardContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { forms: registeredForms } = useFormRegistry();
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate desc'],
  });
  const updateMainDBIT = useUpdateMainDBIT();
  const sendEmail = useSendEmail();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [actionDialogType, setActionDialogType] = useState<'approve' | 'reject' | 'return' | null>(null);
  const [actionComments, setActionComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get pending edit requests
  const { pendingRequests: pendingEditRequests } = usePendingEditRequests();
  
  // Parse submission into ApprovalRequest format
  const parseSubmission = (submission: MainDBIT): ApprovalRequest => {
    let parsedRemarks: Record<string, unknown> = {};
    try {
      if (submission.remarks) parsedRemarks = JSON.parse(submission.remarks);
    } catch {
      // Invalid JSON
    }
    
    return {
      id: submission.id,
      ticketId: submission.title || '',
      formCode: submission.formcode || '',
      title: submission.title || 'Untitled',
      requestorName: (parsedRemarks.requestor as string) || 'Unknown',
      requestorEmail: submission.requestoremail || '',
      submittedDate: new Date(submission.submitteddate || Date.now()),
      dueDate: addDays(new Date(submission.submitteddate || Date.now()), 3), // 3 days SLA
      priority: (parsedRemarks.priority as string) || 'Normal',
      currentStage: (parsedRemarks.currentAction as string) || 'Submitted',
      justification: (parsedRemarks.justification as string) || '',
      details: {
        company: (parsedRemarks.company as string) || '',
        targetUser: (parsedRemarks.targetUser as string) || '',
        application: (parsedRemarks.application as string) || '',
        systemName: (parsedRemarks.systemName as string) || '',
        department: (parsedRemarks.department as string) || '',
      },
      rawData: submission,
    };
  };
  
  // Filter pending approvals for current user
  const pendingApprovals = useMemo(() => {
    const userEmail = user?.userPrincipalName?.toLowerCase() || '';
    
    return submissions
      .filter((s: MainDBIT) => {
        // Only pending status
        const isPending = s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2';
        if (!isPending) return false;
        
        // Check if user is the approver
        let parsedRemarks: Record<string, unknown> = {};
        try {
          if (s.remarks) parsedRemarks = JSON.parse(s.remarks);
        } catch {
          // Invalid JSON
        }
        
        // Check direct approver assignment
        const approverEmail = (parsedRemarks.approverEmail as string) || 
                             (parsedRemarks.departmentHeadEmail as string) || '';
        if (approverEmail.toLowerCase() === userEmail) return true;
        
        // Check manual approver from form registry
        const registeredForm = registeredForms.find((f) => f.formCode === s.formcode);
        if (registeredForm && !registeredForm.autoAssignApprover && 
            registeredForm.manualAssignedApproverEmail?.toLowerCase() === userEmail) {
          return true;
        }
        
        return false;
      })
      .map(parseSubmission);
  }, [submissions, user, registeredForms]);
  
  // Filter by search and form type
  const filteredApprovals = useMemo(() => {
    return pendingApprovals.filter((req: ApprovalRequest) => {
      const matchesSearch = !searchQuery || 
        req.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requestorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesForm = formFilter === 'all' || req.formCode === formFilter;
      return matchesSearch && matchesForm;
    });
  }, [pendingApprovals, searchQuery, formFilter]);
  
  // My submissions (forms I submitted)
  const mySubmissions = useMemo(() => {
    const userEmail = user?.userPrincipalName?.toLowerCase() || '';
    return submissions
      .filter((s: MainDBIT) => s.requestoremail?.toLowerCase() === userEmail)
      .map(parseSubmission);
  }, [submissions, user]);
  
  // Stats
  const stats = {
    pending: pendingApprovals.length,
    overdue: pendingApprovals.filter((r: ApprovalRequest) => isAfter(new Date(), r.dueDate)).length,
    mySubmissions: mySubmissions.length,
    completedToday: submissions.filter((s: MainDBIT) => {
      if (s.currentStatus !== 'CurrentstatusKey3' && s.currentStatus !== 'CurrentstatusKey7') return false;
      const today = new Date();
      const submittedDate = new Date(s.submitteddate || 0);
      return submittedDate.toDateString() === today.toDateString();
    }).length,
    editRequests: pendingEditRequests.length,
  };
  
  // Handle approval action
  const handleAction = async () => {
    if (!selectedRequest) return;
    
    // Validate comments for reject/return
    if ((actionDialogType === 'reject' || actionDialogType === 'return') && !actionComments.trim()) {
      toast.error('Please provide comments');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Parse existing remarks
      let parsedRemarks: Record<string, unknown> = {};
      try {
        if (selectedRequest.rawData.remarks) {
          parsedRemarks = JSON.parse(selectedRequest.rawData.remarks);
        }
      } catch {
        // Invalid JSON
      }
      
      // Determine new status and action
      let newStatusKey: MainDBITCurrentstatusKey | null = null;
      let actionLabel = '';
      
      if (actionDialogType === 'approve') {
        newStatusKey = 'CurrentstatusKey3'; // Approved
        actionLabel = 'Approved';
      } else if (actionDialogType === 'reject') {
        newStatusKey = 'CurrentstatusKey4'; // Rejected
        actionLabel = 'Rejected';
      } else if (actionDialogType === 'return') {
        newStatusKey = 'CurrentstatusKey5'; // Returned
        actionLabel = 'Returned';
      }
      
      // Update the record
      await updateMainDBIT.mutateAsync({
        id: String(selectedRequest.id),
        changedFields: {
          currentStatus: newStatusKey!,
          currentAction: actionLabel.toUpperCase(),
          approvedByName: user?.fullName || '',
          approvedByEmail: user?.userPrincipalName || '',
          hODApproverRemarks: actionComments || selectedRequest.rawData.hODApproverRemarks || '',
        },
      });
      
      // Send email notification
      if (selectedRequest.requestorEmail) {
        try {
          await sendEmail.mutateAsync({
            to: selectedRequest.requestorEmail,
            subject: `[${actionLabel.toUpperCase()}] ${selectedRequest.formCode} Request - ${selectedRequest.ticketId}`,
            body: buildNotificationEmail({
              ticketId: selectedRequest.ticketId,
              formType: selectedRequest.formCode,
              requestorName: selectedRequest.requestorName,
              approverName: user?.fullName || 'Approver',
              status: actionLabel,
              comments: actionComments,
            }),
            importance: actionDialogType === 'approve' ? 'Normal' : 'High',
          });
        } catch (emailErr) {
          console.error('Failed to send notification:', emailErr);
        }
      }
      
      toast.success(`Request ${actionLabel.toLowerCase()} successfully!`);
      refetch();
      
      // Close dialog
      setSelectedRequest(null);
      setActionDialogType(null);
      setActionComments('');
    } catch (err) {
      console.error('Failed to process action:', err);
      toast.error('Failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Open action dialog
  const openActionDialog = (request: ApprovalRequest, type: 'approve' | 'reject' | 'return') => {
    setSelectedRequest(request);
    setActionDialogType(type);
    setActionComments('');
  };
  
  // View request details
  const viewRequestDetails = (request: ApprovalRequest) => {
    navigate(getITFormDetailPath(request.formCode, request.id));
  };
  
  return (
    <IGLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        <IGPageHeader
          title="Approver Dashboard"
          subtitle={`${stats.pending} requests pending approval`}
        />
        
        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Pending</p>
                    <p className="text-xl font-bold text-foreground">{stats.pending}</p>
                  </div>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Overdue</p>
                    <p className="text-xl font-bold text-foreground">{stats.overdue}</p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-secondary">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">My Submissions</p>
                    <p className="text-xl font-bold text-foreground">{stats.mySubmissions}</p>
                  </div>
                  <Send className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Completed Today</p>
                    <p className="text-xl font-bold text-foreground">{stats.completedToday}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Main Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="pending" className="gap-1.5 text-sm">
                    <Inbox className="h-3.5 w-3.5" />
                    Pending
                    {stats.pending > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 min-w-5 text-xs">{stats.pending}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="edit-requests" className="gap-1.5 text-sm">
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Requests
                    {stats.editRequests > 0 && (
                      <Badge className="ml-1 h-5 min-w-5 text-xs bg-[#FFF3E0] text-[#7B3E00]">{stats.editRequests}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="submissions" className="gap-1.5 text-sm">
                    <Send className="h-3.5 w-3.5" />
                    My Submissions
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 h-9 w-48 text-sm"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={formFilter} onValueChange={setFormFilter}>
                  <SelectTrigger className="w-32 h-9 text-sm">
                    <SelectValue placeholder="All Forms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Forms</SelectItem>
                    {APPROVER_FILTER_FORMS.map((form) => (
                      <SelectItem key={form.code} value={form.code}>
                        {form.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => refetch()}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {activeTab === 'pending' && (
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="py-8 text-center">
                    <RefreshCcw className="h-6 w-6 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : filteredApprovals.length === 0 ? (
                  <Empty className="py-10">
                    <EmptyHeader>
                      <CheckCircle2 className="h-10 w-10 text-primary/20 mx-auto mb-3" />
                      <EmptyTitle>All caught up!</EmptyTitle>
                      <EmptyDescription>No pending requests</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-2"
                  >
                    {filteredApprovals.map((request: ApprovalRequest) => {
                      const isOverdue = isAfter(new Date(), request.dueDate);
                      const FormIcon = getFormIcon(request.formCode);
                      const priorityConfig = PRIORITY_CONFIG[request.priority] || PRIORITY_CONFIG.Normal;
                      
                      return (
                        <motion.div key={request.id} variants={itemVariants}>
                          <div className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${isOverdue ? 'border-destructive/50' : 'border-border'}`}>
                            <div className="p-2 rounded-md bg-primary/10 flex-shrink-0">
                              <FormIcon className="h-4 w-4 text-primary" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground truncate">{request.ticketId}</span>
                                <Badge variant="outline" className="text-xs">{request.formCode}</Badge>
                                {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                                <span>{request.requestorName}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(request.submittedDate, { addSuffix: true })}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => viewRequestDetails(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => openActionDialog(request, 'reject')}
                              >
                                Reject
                              </Button>
                              <Button size="sm" className="h-8 text-xs" onClick={() => openActionDialog(request, 'approve')}>
                                Approve
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Edit Requests Tab */}
            {activeTab === 'edit-requests' && (
              <div className="py-4">
                <EditRequestApprovalPanel
                  submissions={submissions.filter((s: MainDBIT) => {
                    // Find submissions with pending edit requests
                    try {
                      if (!s.remarks) return false;
                      const remarks = JSON.parse(s.remarks);
                      return remarks.editRequest?.status === 'PENDING';
                    } catch {
                      return false;
                    }
                  })}
                  approverEmail={user?.userPrincipalName || ''}
                  onViewSubmission={(id) => {
                    const submission = submissions.find((s: MainDBIT) => String(s.id) === String(id));
                    navigate(getITFormDetailPath(submission?.formcode, id));
                  }}
                />
              </div>
            )}
            
            {activeTab === 'submissions' && (
              <AnimatePresence mode="wait">
                {mySubmissions.length === 0 ? (
                  <Empty className="py-16">
                    <EmptyHeader>
                      <Send className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                      <EmptyTitle>No submissions yet</EmptyTitle>
                      <EmptyDescription>Your submitted requests will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                  >
                    {mySubmissions.map((request: ApprovalRequest) => {
                      const FormIcon = getFormIcon(request.formCode);
                      const status = request.rawData.currentStatus || 'CurrentstatusKey1';
                      
                      let statusBadge = {
                        label: 'Submitted',
                        variant: 'secondary' as const,
                      };
                      
                      if (status === 'CurrentstatusKey3' || status === 'CurrentstatusKey7') {
                        statusBadge = { label: 'Approved', variant: 'secondary' as const };
                      } else if (status === 'CurrentstatusKey4') {
                        statusBadge = { label: 'Rejected', variant: 'secondary' as const };
                      } else if (status === 'CurrentstatusKey5') {
                        statusBadge = { label: 'Returned', variant: 'secondary' as const };
                      }
                      
                      return (
                        <motion.div key={request.id} variants={itemVariants}>
                          <Card 
                            className="border hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => viewRequestDetails(request)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-secondary flex-shrink-0">
                                  <FormIcon className="h-5 w-5 text-secondary-foreground" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-foreground truncate">
                                      {request.ticketId}
                                    </h3>
                                    <Badge variant="outline">{request.formCode}</Badge>
                                    <Badge variant={statusBadge.variant}>
                                      {statusBadge.label}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{getFormTitle(request.formCode)}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(request.submittedDate, { addSuffix: true })}</span>
                                  </div>
                                </div>
                                
                                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>

      </div>
      
      {/* Action Dialog */}
      <Dialog open={!!actionDialogType} onOpenChange={(open) => !open && setActionDialogType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialogType === 'approve' && <CheckCircle2 className="h-5 w-5 text-primary" />}
              {actionDialogType === 'reject' && <XCircle className="h-5 w-5 text-destructive" />}
              {actionDialogType === 'return' && <RotateCcw className="h-5 w-5 text-accent-foreground" />}
              {actionDialogType === 'approve' && 'Approve Request'}
              {actionDialogType === 'reject' && 'Reject Request'}
              {actionDialogType === 'return' && 'Return for More Information'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  {actionDialogType === 'approve' && `You are about to approve ${selectedRequest.ticketId}. This will notify the requestor.`}
                  {actionDialogType === 'reject' && `Please provide a reason for rejecting ${selectedRequest.ticketId}.`}
                  {actionDialogType === 'return' && `Please provide feedback for ${selectedRequest.ticketId}.`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              {/* Request Summary */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{selectedRequest.formCode}</Badge>
                  <span className="font-medium">{selectedRequest.ticketId}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted by {selectedRequest.requestorName}
                </p>
              </div>
              
              {/* Comments */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Comments {actionDialogType !== 'approve' && <span className="text-destructive">*</span>}
                </label>
                <Textarea
                  placeholder={actionDialogType === 'approve' 
                    ? 'Optional comments...' 
                    : 'Please provide a reason...'}
                  value={actionComments}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setActionComments(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogType(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isProcessing}
              variant={actionDialogType === 'reject' ? 'destructive' : 'default'}
            >
              {isProcessing ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {actionDialogType === 'approve' && 'Approve'}
                  {actionDialogType === 'reject' && 'Reject'}
                  {actionDialogType === 'return' && 'Return'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IGLayout>
  );
}

export default function ApproverDashboardPage() {
  return (
    <DataReadyGuard loadingMessage="Loading approver dashboard...">
      <ApproverDashboardContent />
    </DataReadyGuard>
  );
}

// Helper to build notification email
function buildNotificationEmail(params: {
  ticketId: string;
  formType: string;
  requestorName: string;
  approverName: string;
  status: string;
  comments?: string;
}): string {
  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    Approved: { bg: '#E8F5E9', border: '#166534', text: '#166534' },
    Rejected: { bg: '#FFEBEE', border: '#B71C1C', text: '#B71C1C' },
    Returned: { bg: '#FFF3E0', border: '#E65100', text: '#E65100' },
  };
  
  const colors = statusColors[params.status] || statusColors.Approved;
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
}
