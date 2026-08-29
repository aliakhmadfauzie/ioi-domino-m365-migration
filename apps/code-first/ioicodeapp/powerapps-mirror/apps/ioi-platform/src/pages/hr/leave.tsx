/**
 * HR Leave Management Page
 * PRD-compliant redesign with enterprise ergonomics layout
 * Uses MainDB_HR SharePoint list with LVE, OWP, FWWPE form codes
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  FileText,
  Paperclip,
  Shield,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

// Import from generated model
import type { MainDBHR } from '@/generated/models/main-dbhr-model';
import { MainDBHRStatusKeyToLabel } from '@/generated/models/main-dbhr-model';
import { useMainDBHR, useCreateMainDBHR, useUpdateMainDBHR } from '@/hooks/use-main-dbhr';
import { useUser } from '@/hooks/use-user';
import { useEmailNotification, generateSubmissionEmailBody, generateStatusUpdateEmailBody } from '@/hooks/use-email-notification';
import { useSendConfirmationEmail } from '@/hooks/use-send-email';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

const LEAVE_FORM_CODES = ['LVE', 'OWP', 'FWWPE'];
const LEAVE_TYPES = [
  { id: 'annual', label: 'Annual Leave', color: 'bg-primary', entitlement: 18 },
  { id: 'medical', label: 'Medical Leave', color: 'bg-success', entitlement: 14 },
  { id: 'emergency', label: 'Emergency Leave', color: 'bg-warning', entitlement: 3 },
  { id: 'unpaid', label: 'Unpaid Leave', color: 'bg-muted', entitlement: 0 },
];

const STATUS_OPTIONS = [
  { id: 'all', label: 'All Status' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

const YEARS = ['2026', '2025', '2024', '2023'];

// Mock leave balance data (would come from user profile/API)
const LEAVE_BALANCES = [
  { type: 'Annual', used: 8, total: 18, color: 'bg-primary' },
  { type: 'Medical', used: 2, total: 14, color: 'bg-success' },
  { type: 'Emergency', used: 1, total: 3, color: 'bg-warning' },
  { type: 'Unpaid', used: 3, total: 0, color: 'bg-muted' },
];

// Mock team leave data for calendar
const TEAM_LEAVE = [
  { name: 'Ahmad Razak', date: new Date(2026, 4, 8), type: 'Annual' },
  { name: 'Siti Aminah', date: new Date(2026, 4, 12), type: 'Medical' },
  { name: 'Kumar Raj', date: new Date(2026, 4, 15), type: 'Annual' },
  { name: 'Lee Wei Ming', date: new Date(2026, 4, 15), type: 'Annual' },
];

// Public holidays
const PUBLIC_HOLIDAYS = [
  { date: new Date(2026, 4, 1), name: 'Labour Day' },
  { date: new Date(2026, 4, 26), name: 'Wesak Day' },
];

// Mock pending approvals for manager view
const PENDING_APPROVALS = [
  {
    id: 'LVE-001',
    employee: 'Ahmad Razak',
    employeeId: 'IOI-1234',
    department: 'Operations',
    type: 'Annual',
    startDate: new Date(2026, 4, 8),
    endDate: new Date(2026, 4, 10),
    days: 3,
    reason: 'Family vacation to Langkawi',
    submittedOn: new Date(2026, 4, 1),
    stage: 'HOD Review',
  },
  {
    id: 'LVE-002',
    employee: 'Siti Aminah',
    employeeId: 'IOI-2345',
    department: 'Finance',
    type: 'Medical',
    startDate: new Date(2026, 4, 12),
    endDate: new Date(2026, 4, 12),
    days: 1,
    reason: 'Medical appointment - specialist follow-up',
    submittedOn: new Date(2026, 4, 2),
    stage: 'HOD Review',
    attachment: 'medical_cert.pdf',
  },
  {
    id: 'LVE-003',
    employee: 'Kumar Raj',
    employeeId: 'IOI-3456',
    department: 'IT',
    type: 'Emergency',
    startDate: new Date(2026, 4, 5),
    endDate: new Date(2026, 4, 5),
    days: 1,
    reason: 'Family emergency - urgent matter',
    submittedOn: new Date(2026, 4, 4),
    stage: 'HR Review',
  },
];

type PendingApproval = typeof PENDING_APPROVALS[number];

// Sites for IOI Acidchem
const SITES = [
  { id: 'prai', label: 'Prai', region: 'Penang' },
  { id: 'johor', label: 'Johor', region: 'Johor' },
];

// Check if user is an approver (HOD or HR)
const checkIsApprover = (userEmail: string | undefined): boolean => {
  // In production, this would check against a role/permission system
  // For now, simulate approvers with specific email patterns
  if (!userEmail) return false;
  const email = userEmail.toLowerCase();
  return email.includes('manager') || email.includes('hod') || email.includes('hr') || email.includes('supervisor');
};

export default function HRLeavePage() {
  const { data: user } = useUser();
  const { data: allSubmissions, isLoading, error } = useMainDBHR();
  const createSubmission = useCreateMainDBHR();
  const updateSubmission = useUpdateMainDBHR();
  const { sendNotification, isSending: isSendingEmail } = useEmailNotification();
  const sendConfirmation = useSendConfirmationEmail();

  // Check if current user is an approver
  const isApprover = checkIsApprover(user?.userPrincipalName);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('2026');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog state with site selection and validation
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [notes, setNotes] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSite, setSelectedSite] = useState('');

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    leaveType?: string;
    dateRange?: string;
    site?: string;
  }>({});

  // Approval dialog state
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
    request: PendingApproval | null;
  }>({ open: false, action: null, request: null });
  const [approvalComment, setApprovalComment] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PendingApproval | null>(null);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Filter to leave form codes
  const submissions = allSubmissions?.filter((s: MainDBHR) =>
    LEAVE_FORM_CODES.includes(s.formcode)
  ) || [];

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s: MainDBHR) => {
      if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (typeFilter !== 'all' && !s.title.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      // Year filter would check submittedon date
      return true;
    });
  }, [submissions, searchQuery, typeFilter]);

  // Calculate days between dates
  const calculateDays = (start: Date | undefined, end: Date | undefined): number => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};

    if (!leaveType) {
      errors.leaveType = 'Please select a leave type';
    }
    if (!dateRange?.from) {
      errors.dateRange = 'Please select leave dates';
    }
    if (!selectedSite) {
      errors.site = 'Please select your work site';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const ticketId = `LVE-${leaveType.toUpperCase()}-${format(dateRange!.from!, 'yyyyMMdd')}`;
    const leaveTypeLabel = LEAVE_TYPES.find(t => t.id === leaveType)?.label || leaveType;
    const dateRangeStr = dateRange?.to
      ? `${format(dateRange.from!, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
      : format(dateRange!.from!, 'MMM d, yyyy');
    const dayCount = calculateDays(dateRange?.from, dateRange?.to);

    try {
      // Create the submission in SharePoint
      await createSubmission.mutateAsync({
        title: ticketId,
        formcode: 'LVE',
        statusKey: 'StatusKey1', // Draft/Pending
        employeeid: user?.objectId || '',
        employeename: user?.fullName || 'Unknown',
        requestoremail: user?.userPrincipalName || '',
        description: notes,
      });

      // Send email notification to approver (HOD)
      // In production, this would fetch the actual approver from the workflow
      const approverEmail = 'hr-approvals@ioiacidchem.com'; // Placeholder - would be resolved from org hierarchy
      const approverName = 'HR Department'; // Placeholder

      const emailBody = generateSubmissionEmailBody({
        ticketId,
        formName: 'Leave Application',
        formCode: 'LVE',
        submittedBy: user?.fullName || 'Unknown',
        submittedByEmail: user?.userPrincipalName || '',
        submittedDate: format(new Date(), 'PPP'),
        approverName,
        approverRole: 'HoD',
        priority: 'Normal',
        justification: notes || `${leaveTypeLabel} leave for ${dayCount} day(s): ${dateRangeStr}`,
      });

      // Try to send email notification (non-blocking)
      sendNotification({
        to: approverEmail,
        subject: `[ACTION REQUIRED] Leave Application - ${ticketId}`,
        body: emailBody,
        formCode: 'LVE',
        notifyType: 'Submission',
      }).catch((emailErr: unknown) => {
        console.warn('Email notification failed:', emailErr);
        // Don't fail the submission if email fails
      });

      // Send confirmation to requestor
      sendConfirmation.mutateAsync({
        ticketId,
        formType: 'Leave Application',
        formTitle: leaveTypeLabel,
        requestorEmail: user?.userPrincipalName || '',
        requestorName: user?.fullName || 'User',
        approverName,
      }).catch((emailErr: unknown) => {
        console.warn('Confirmation email failed:', emailErr);
      });

      toast.success('Leave request submitted successfully', {
        description: `Your ${leaveTypeLabel} leave request has been submitted. Email notifications sent.`,
      });
      setShowNewDialog(false);
      resetForm();
    } catch (err: unknown) {
      toast.error('Failed to submit leave request', {
        description: 'Please check your connection and try again.',
      });
    }
  };

  const resetForm = () => {
    setLeaveType('');
    setNotes('');
    setDateRange(undefined);
    setSelectedSite('');
    setFormErrors({});
  };

  // Handle approval action — writes status update to SharePoint
  const handleApprovalAction = async (action: 'approve' | 'reject') => {
    if (!approvalDialog.request) return;

    try {
      if (action === 'approve') {
        await updateSubmission.mutateAsync({
          id: approvalDialog.request.id,
          changes: {
            statusKey: 'StatusKey3' as MainDBHR['statusKey'], // ApprovedHR
            approverremarks: approvalComment || 'Approved',
          },
        });
        toast.success(`Leave request ${approvalDialog.request.id} approved`, {
          description: `${approvalDialog.request.employee}'s ${approvalDialog.request.type.toLowerCase()} leave has been approved.`,
        });
      } else {
        await updateSubmission.mutateAsync({
          id: approvalDialog.request.id,
          changes: {
            statusKey: 'StatusKey4' as MainDBHR['statusKey'], // Rejected
            approverremarks: approvalComment || 'Rejected',
          },
        });
        toast.error(`Leave request ${approvalDialog.request.id} rejected`, {
          description: `${approvalDialog.request.employee}'s request has been rejected.`,
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to ${action} leave request`, {
        description: errorMessage,
      });
      return;
    }

    setApprovalDialog({ open: false, action: null, request: null });
    setApprovalComment('');
  };

  // Open approval dialog
  const openApprovalDialog = (request: PendingApproval, action: 'approve' | 'reject') => {
    setApprovalDialog({ open: true, action, request });
  };

  // Calendar helpers
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const getLeaveForDay = (date: Date) => {
    return TEAM_LEAVE.filter((leave) => isSameDay(leave.date, date));
  };

  const getHolidayForDay = (date: Date) => {
    return PUBLIC_HOLIDAYS.find((h) => isSameDay(h.date, date));
  };

  // Pending approvals count
  const pendingCount = submissions.filter((s: MainDBHR) => s.statusKey === 'StatusKey1').length;
  const managerPendingCount = PENDING_APPROVALS.length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Navy Header Bar */}
      <div className="bg-[#003366] text-white">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/hr">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <HRBreadcrumb
                  items={[{ label: 'Leave Management' }]}
                  variant="dark"
                />
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-semibold">Leave Management</h1>
                  <Badge className="bg-white/20 text-white text-[9px] px-1.5 py-0 h-4">
                    {LEAVE_FORM_CODES.length} Types
                  </Badge>
                  {managerPendingCount > 0 && (
                    <Badge className="bg-warning text-warning-foreground text-[9px] px-1.5 py-0 h-4 animate-pulse">
                      {managerPendingCount} Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-7 text-[10px] bg-white text-[#003366] hover:bg-white/90 gap-1">
                  <Plus className="h-3 w-3" />
                  Apply for Leave
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base">Apply for Leave</DialogTitle>
                  <DialogDescription className="text-[10px] text-muted-foreground">
                    Submit a new leave request for approval
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-3">
                  {/* Site Selection - NEW */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Work Site <span className="text-destructive">*</span>
                    </Label>
                    <Select value={selectedSite} onValueChange={(val: string) => { setSelectedSite(val); setFormErrors(prev => ({ ...prev, site: undefined })); }}>
                      <SelectTrigger className={cn('h-9 text-xs', formErrors.site && 'border-destructive focus:ring-destructive')}>
                        <SelectValue placeholder="Select your site" />
                      </SelectTrigger>
                      <SelectContent>
                        {SITES.map((site) => (
                          <SelectItem key={site.id} value={site.id} className="text-xs">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {site.label} ({site.region})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.site && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.site}
                      </p>
                    )}
                  </div>

                  {/* Leave Type with inline validation */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-medium">Leave Type <span className="text-destructive">*</span></Label>
                    <Select value={leaveType} onValueChange={(val: string) => { setLeaveType(val); setFormErrors(prev => ({ ...prev, leaveType: undefined })); }}>
                      <SelectTrigger className={cn('h-9 text-xs', formErrors.leaveType && 'border-destructive focus:ring-destructive')}>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAVE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id} className="text-xs">
                            <div className="flex items-center gap-2">
                              <div className={cn('h-2 w-2 rounded-full', type.color)} />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.leaveType && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.leaveType}
                      </p>
                    )}
                  </div>

                  {/* Date Range with inline validation */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-medium">Date Range <span className="text-destructive">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full h-9 justify-start text-left text-xs font-normal',
                            !dateRange && 'text-muted-foreground',
                            formErrors.dateRange && 'border-destructive'
                          )}
                          onClick={() => setFormErrors(prev => ({ ...prev, dateRange: undefined }))}
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
                              </>
                            ) : (
                              format(dateRange.from, 'MMM d, yyyy')
                            )
                          ) : (
                            <span>Select dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.dateRange && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.dateRange}
                      </p>
                    )}
                    {dateRange?.from && dateRange?.to && (
                      <p className="text-[10px] text-muted-foreground">
                        Duration: {calculateDays(dateRange.from, dateRange.to)} day(s)
                      </p>
                    )}
                  </div>

                  {/* Reason / Notes */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-medium">Reason / Notes</Label>
                    <Textarea
                      placeholder="Enter reason for leave..."
                      value={notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                      className="text-xs min-h-[60px] resize-none"
                    />
                  </div>

                  {/* Attachment */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-medium">Attachment (Optional)</Label>
                    <Button variant="outline" className="w-full h-9 text-xs gap-1.5">
                      <Paperclip className="h-3 w-3" />
                      Attach Document
                    </Button>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setShowNewDialog(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="h-7 text-[10px]" onClick={handleSubmit} disabled={createSubmission.isPending}>
                    {createSubmission.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-4 mt-3 p-3 rounded bg-destructive/10 border border-destructive/20">
          <p className="text-[10px] text-destructive">
            <strong>Connection Error:</strong> Unable to connect to MainDB_HR.
          </p>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Leave Balance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {LEAVE_BALANCES.map((balance, idx) => {
            const percentage = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;
            const remaining = balance.total > 0 ? balance.total - balance.used : 0;

            return (
              <motion.div key={balance.type} variants={itemVariants}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-muted-foreground">{balance.type} Leave</span>
                      <div className={cn('h-2 w-2 rounded-full', balance.color)} />
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-xl font-bold text-foreground">
                        {balance.total > 0 ? remaining : balance.used}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {balance.total > 0 ? `/ ${balance.total} days` : 'days taken'}
                      </span>
                    </div>
                    {balance.total > 0 ? (
                      <Progress value={percentage} className="h-1.5" />
                    ) : (
                      <div className="h-1.5 bg-muted rounded-full" />
                    )}
                    <p className="text-[9px] text-muted-foreground mt-1.5">
                      {balance.total > 0 ? `${balance.used} used` : 'No limit'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Approval Workflow Tracker */}
        {pendingCount > 0 && (
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card className="border-0 shadow-sm border-l-4 border-l-warning">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-xs font-semibold">Pending Approvals</span>
                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{pendingCount}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* 4-Stage Pipeline */}
                  {['Submitted', 'HOD Review', 'HR Review', 'Approved'].map((stage, idx) => (
                    <div key={stage} className="flex items-center gap-2 flex-1">
                      <div className={cn(
                        'flex items-center justify-center h-6 w-6 rounded-full text-[9px] font-medium',
                        idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      )}>
                        {idx + 1}
                      </div>
                      <span className={cn(
                        'text-[9px] hidden sm:inline',
                        idx === 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                      )}>
                        {stage}
                      </span>
                      {idx < 3 && <div className="flex-1 h-px bg-border" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="approvals" className="space-y-3">
          <TabsList className="h-8 p-0.5 bg-muted/50">
            <TabsTrigger value="approvals" className="h-7 text-[10px] px-3 gap-1.5 relative">
              <Shield className="h-3 w-3" />
              Pending Approvals
              {managerPendingCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warning text-warning-foreground text-[8px] flex items-center justify-center font-bold">
                  {managerPendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="h-7 text-[10px] px-3 gap-1.5">
              <FileText className="h-3 w-3" />
              My Requests
            </TabsTrigger>
            <TabsTrigger value="calendar" className="h-7 text-[10px] px-3 gap-1.5">
              <CalendarIcon className="h-3 w-3" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="team" className="h-7 text-[10px] px-3 gap-1.5">
              <Users className="h-3 w-3" />
              Team
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab (Manager View) - Role gated */}
          <TabsContent value="approvals" className="space-y-3 mt-0">
            {!isApprover ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <Empty className="py-8">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">Approver Access Only</EmptyTitle>
                      <EmptyDescription className="text-[10px]">
                        This view is reserved for managers and HR personnel with approval authority.
                        Your pending requests are tracked under "My Requests".
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </CardContent>
              </Card>
            ) : PENDING_APPROVALS.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <Empty className="py-8">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">No Pending Approvals</EmptyTitle>
                      <EmptyDescription className="text-[10px]">
                        All leave requests have been processed.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Approval Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="border-0 shadow-sm bg-warning/5 border-l-4 border-l-warning">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-muted-foreground">HOD Review</p>
                          <p className="text-lg font-bold text-warning">{PENDING_APPROVALS.filter((p: PendingApproval) => p.stage === 'HOD Review').length}</p>
                        </div>
                        <Clock className="h-5 w-5 text-warning/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm bg-primary/5 border-l-4 border-l-primary">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-muted-foreground">HR Review</p>
                          <p className="text-lg font-bold text-primary">{PENDING_APPROVALS.filter((p: PendingApproval) => p.stage === 'HR Review').length}</p>
                        </div>
                        <Shield className="h-5 w-5 text-primary/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm bg-success/5 border-l-4 border-l-success">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-muted-foreground">Total Days</p>
                          <p className="text-lg font-bold text-success">{PENDING_APPROVALS.reduce((sum: number, p: PendingApproval) => sum + p.days, 0)}</p>
                        </div>
                        <CalendarIcon className="h-5 w-5 text-success/50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Requests List */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-3 pb-2 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold">Requests Awaiting Your Action</CardTitle>
                      <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                        {PENDING_APPROVALS.length} pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {PENDING_APPROVALS.map((request: PendingApproval) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Employee Info */}
                            <div className="flex items-start gap-3 flex-1">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-primary">
                                  {request.employee.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-semibold">{request.employee}</span>
                                  <Badge variant="outline" className="text-[8px] h-3.5 px-1">
                                    {request.employeeId}
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-muted-foreground mb-1">{request.department}</p>
                                <div className="flex items-center gap-3 text-[9px]">
                                  <span className="flex items-center gap-1">
                                    <div className={cn(
                                      'h-1.5 w-1.5 rounded-full',
                                      request.type === 'Annual' && 'bg-primary',
                                      request.type === 'Medical' && 'bg-success',
                                      request.type === 'Emergency' && 'bg-warning'
                                    )} />
                                    {request.type} Leave
                                  </span>
                                  <span className="text-muted-foreground">
                                    {format(request.startDate, 'MMM d')} - {format(request.endDate, 'MMM d, yyyy')}
                                  </span>
                                  <Badge variant="secondary" className="text-[8px] h-3.5 px-1">
                                    {request.days} day{request.days > 1 ? 's' : ''}
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-muted-foreground mt-1.5 line-clamp-1">
                                  <MessageSquare className="h-2.5 w-2.5 inline mr-1" />
                                  {request.reason}
                                </p>
                                {'attachment' in request && request.attachment && (
                                  <p className="text-[9px] text-primary mt-1 flex items-center gap-1">
                                    <Paperclip className="h-2.5 w-2.5" />
                                    {request.attachment}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Stage & Actions */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'text-[8px] h-4 px-1.5',
                                  request.stage === 'HOD Review' && 'bg-warning/10 text-warning',
                                  request.stage === 'HR Review' && 'bg-primary/10 text-primary'
                                )}
                              >
                                {request.stage}
                              </Badge>
                              {/* Actions - larger touch targets for mobile (44x44px min) */}
                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-10 min-w-[44px] px-3 text-xs gap-1.5"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-10 min-w-[44px] px-3 text-xs gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                                  onClick={() => openApprovalDialog(request, 'approve')}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span className="hidden sm:inline">Approve</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-10 min-w-[44px] px-3 text-xs gap-1.5"
                                  onClick={() => openApprovalDialog(request, 'reject')}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                  <span className="hidden sm:inline">Reject</span>
                                </Button>
                              </div>
                              <p className="text-[8px] text-muted-foreground">
                                Submitted {format(request.submittedOn, 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Leave History Tab */}
          <TabsContent value="history" className="space-y-3 mt-0">
            {/* Filters Row */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      placeholder="Search by reference..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="h-7 text-[10px] pl-7"
                    />
                  </div>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="h-7 w-24 text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year} className="text-[10px]">{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-7 w-28 text-[10px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-[10px]">All Types</SelectItem>
                      {LEAVE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id} className="text-[10px]">{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-7 w-28 text-[10px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id} className="text-[10px]">{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* History Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-[10px] text-muted-foreground">Loading leave records...</span>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle className="text-sm">No Leave Records</EmptyTitle>
                  <EmptyDescription className="text-[10px]">
                    No leave requests found. Apply for leave to get started.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-semibold h-10 pl-3">Reference</TableHead>
                      <TableHead className="text-xs font-semibold h-10 hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-xs font-semibold h-10 hidden md:table-cell">Start</TableHead>
                      <TableHead className="text-xs font-semibold h-10 hidden lg:table-cell">End</TableHead>
                      <TableHead className="text-xs font-semibold h-10 text-center hidden lg:table-cell">Days</TableHead>
                      <TableHead className="text-xs font-semibold h-10">Status</TableHead>
                      <TableHead className="text-xs font-semibold h-10 hidden lg:table-cell">Approver</TableHead>
                      <TableHead className="text-xs font-semibold h-10 w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((form: MainDBHR) => {
                      const statusLabel = form.statusKey ? MainDBHRStatusKeyToLabel[form.statusKey] : 'Unknown';
                      const isPending = form.statusKey === 'StatusKey1';
                      const isApproved = form.statusKey === 'StatusKey2';
                      const isRejected = form.statusKey === 'StatusKey3';

                      return (
                        <TableRow
                          key={form.id}
                          className="hover:bg-muted/30 cursor-pointer"
                          onClick={() => window.location.href = `/submissions/${form.id}`}
                        >
                          <TableCell className="text-xs font-medium pl-3 py-3">{form.title}</TableCell>
                          <TableCell className="text-xs py-3 hidden sm:table-cell">
                            <Badge variant="outline" className="text-[10px] h-5 px-2">{form.formcode}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground py-3 hidden md:table-cell">
                            {form.submittedon && format(new Date(form.submittedon), 'MMM d')}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground py-3 hidden lg:table-cell">
                            {form.submittedon && format(new Date(form.submittedon), 'MMM d')}
                          </TableCell>
                          <TableCell className="text-xs text-center py-3 hidden lg:table-cell">1</TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-[10px] h-5 px-2',
                                isPending && 'bg-warning text-warning-foreground',
                                isApproved && 'bg-success text-success-foreground',
                                isRejected && 'bg-destructive text-destructive-foreground'
                              )}
                            >
                              {isPending && <Clock className="h-3 w-3 mr-1" />}
                              {isApproved && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {isRejected && <XCircle className="h-3 w-3 mr-1" />}
                              {statusLabel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground py-3 hidden lg:table-cell">
                            {form.currentapproverdisplayname || '-'}
                          </TableCell>
                          <TableCell className="py-3">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    {format(calendarMonth, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {/* Days of week header */}
                <div className="grid grid-cols-7 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-[9px] font-medium text-muted-foreground text-center py-1">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-px bg-border rounded overflow-hidden">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startDay }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="bg-muted/30 h-16" />
                  ))}
                  {/* Days of the month */}
                  {daysInMonth.map((day) => {
                    const dayLeaves = getLeaveForDay(day);
                    const holiday = getHolidayForDay(day);
                    const isWeekend = getDay(day) === 0 || getDay(day) === 6;

                    return (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          'bg-card h-16 p-1 cursor-pointer hover:bg-muted/50 transition-colors',
                          isToday(day) && 'ring-1 ring-inset ring-primary',
                          isWeekend && 'bg-muted/20',
                          holiday && 'bg-destructive/5'
                        )}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={cn(
                          'text-[10px] font-medium mb-0.5',
                          isToday(day) && 'text-primary',
                          isWeekend && 'text-muted-foreground',
                          holiday && 'text-destructive'
                        )}>
                          {format(day, 'd')}
                        </div>
                        {holiday && (
                          <div className="text-[8px] text-destructive truncate">
                            {holiday.name}
                          </div>
                        )}
                        {dayLeaves.slice(0, 2).map((leave, idx) => (
                          <div
                            key={idx}
                            className="text-[8px] text-primary-foreground bg-primary/80 rounded px-0.5 truncate mb-0.5"
                          >
                            {leave.name.split(' ')[0]}
                          </div>
                        ))}
                        {dayLeaves.length > 2 && (
                          <div className="text-[8px] text-muted-foreground">
                            +{dayLeaves.length - 2} more
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded bg-primary" />
                    <span className="text-[9px] text-muted-foreground">Team Leave</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded bg-destructive/50" />
                    <span className="text-[9px] text-muted-foreground">Public Holiday</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded ring-1 ring-primary" />
                    <span className="text-[9px] text-muted-foreground">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Schedule Tab */}
          <TabsContent value="team" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-semibold">Team Schedule - {format(calendarMonth, 'MMMM yyyy')}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {TEAM_LEAVE.length === 0 ? (
                    <Empty className="py-8">
                      <EmptyHeader>
                        <EmptyTitle className="text-sm">No Upcoming Leave</EmptyTitle>
                        <EmptyDescription className="text-[10px]">
                          No team members have scheduled leave this month.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    TEAM_LEAVE.map((leave, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-primary">
                              {leave.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium">{leave.name}</p>
                            <p className="text-[9px] text-muted-foreground">{leave.type} Leave</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-medium">{format(leave.date, 'MMM d, yyyy')}</p>
                          <p className="text-[9px] text-muted-foreground">{format(leave.date, 'EEEE')}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open: boolean) => !open && setApprovalDialog({ open: false, action: null, request: null })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              {approvalDialog.action === 'approve' ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Approve Leave Request
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  Reject Leave Request
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground">
              {approvalDialog.action === 'approve'
                ? 'Confirm approval of this leave request.'
                : 'Please provide a reason for rejection.'}
            </DialogDescription>
          </DialogHeader>

          {approvalDialog.request && (
            <div className="py-3 space-y-3">
              <div className="p-3 rounded bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Employee</span>
                  <span className="text-[10px] font-medium">{approvalDialog.request.employee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Leave Type</span>
                  <span className="text-[10px] font-medium">{approvalDialog.request.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Duration</span>
                  <span className="text-[10px] font-medium">
                    {format(approvalDialog.request.startDate, 'MMM d')} - {format(approvalDialog.request.endDate, 'MMM d')} ({approvalDialog.request.days} days)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium">
                  {approvalDialog.action === 'approve' ? 'Comments (Optional)' : 'Reason for Rejection'}
                </Label>
                <Textarea
                  placeholder={approvalDialog.action === 'approve' ? 'Add any comments...' : 'Please provide a reason...'}
                  value={approvalComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApprovalComment(e.target.value)}
                  className="text-xs min-h-[60px] resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px]"
              onClick={() => setApprovalDialog({ open: false, action: null, request: null })}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={cn(
                'h-7 text-[10px]',
                approvalDialog.action === 'approve' ? 'bg-success hover:bg-success/90' : ''
              )}
              variant={approvalDialog.action === 'reject' ? 'destructive' : 'default'}
              onClick={() => approvalDialog.action && handleApprovalAction(approvalDialog.action)}
              disabled={approvalDialog.action === 'reject' && !approvalComment.trim()}
            >
              {approvalDialog.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open: boolean) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Leave Request Details</DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground">
              Review the complete details of this leave request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-3 space-y-4">
              {/* Employee Header */}
              <div className="flex items-center gap-3 p-3 rounded bg-muted/30">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {selectedRequest.employee.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{selectedRequest.employee}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedRequest.department} • {selectedRequest.employeeId}</p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-[10px] text-muted-foreground">Reference</span>
                  <span className="text-[10px] font-mono font-medium">{selectedRequest.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-[10px] text-muted-foreground">Leave Type</span>
                  <Badge variant="secondary" className={cn(
                    'text-[9px] h-4 px-1.5',
                    selectedRequest.type === 'Annual' && 'bg-primary/10 text-primary',
                    selectedRequest.type === 'Medical' && 'bg-success/10 text-success',
                    selectedRequest.type === 'Emergency' && 'bg-warning/10 text-warning'
                  )}>
                    {selectedRequest.type} Leave
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-[10px] text-muted-foreground">Start Date</span>
                  <span className="text-[10px] font-medium">{format(selectedRequest.startDate, 'EEEE, MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-[10px] text-muted-foreground">End Date</span>
                  <span className="text-[10px] font-medium">{format(selectedRequest.endDate, 'EEEE, MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-[10px] text-muted-foreground">Duration</span>
                  <span className="text-[10px] font-medium">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-[10px] text-muted-foreground">Current Stage</span>
                  <Badge variant="secondary" className={cn(
                    'text-[9px] h-4 px-1.5',
                    selectedRequest.stage === 'HOD Review' && 'bg-warning/10 text-warning',
                    selectedRequest.stage === 'HR Review' && 'bg-primary/10 text-primary'
                  )}>
                    {selectedRequest.stage}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-[10px] text-muted-foreground">Submitted On</span>
                  <span className="text-[10px] font-medium">{format(selectedRequest.submittedOn, 'MMM d, yyyy')}</span>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium text-muted-foreground">Reason</Label>
                <p className="text-[10px] p-2 rounded bg-muted/30">{selectedRequest.reason}</p>
              </div>

              {/* Attachment */}
              {'attachment' in selectedRequest && selectedRequest.attachment && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium text-muted-foreground">Attachment</Label>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] w-full gap-1.5">
                    <Paperclip className="h-3 w-3" />
                    {selectedRequest.attachment}
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px]"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="h-7 text-[10px] gap-1 bg-success hover:bg-success/90"
              onClick={() => {
                if (selectedRequest) openApprovalDialog(selectedRequest, 'approve');
                setSelectedRequest(null);
              }}
            >
              <ThumbsUp className="h-3 w-3" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 text-[10px] gap-1"
              onClick={() => {
                if (selectedRequest) openApprovalDialog(selectedRequest, 'reject');
                setSelectedRequest(null);
              }}
            >
              <ThumbsDown className="h-3 w-3" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
