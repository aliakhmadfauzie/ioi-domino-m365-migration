import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search, User, Mail, Building2, Clock, Calendar, ChevronRight,
  Loader2, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Timer, Zap,
  MessageSquare, ArrowLeft, Headset, RefreshCw, BarChart3, Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { EmployeePicker } from '@/components/employee-picker';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';

import { useMainDBITExtSupportList } from '@/generated/hooks/use-main-dbit-ext-support';
import { useUserRolesITList } from '@/generated/hooks/use-user-roles-it';
import { useUser } from '@/hooks/use-user';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import {
  MainDBITSiteKeyToLabel,
  type MainDBITSiteKey,
  type MainDBIT,
} from '@/generated/models/main-dbit-model';
import { getITFormDetailPath } from '@/lib/it-form-routes';
import {
  getITSSRPIC,
  getITSSRPICDisplayName,
  SITE_KEY_TO_ROUTING_LOCATION,
  type ITSSRPICConfig,
} from '@/config/itssr-pic-routing';
import { canTriageITSR } from '@/config/it-roles';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
} as const;

// Service type configurations
const SERVICE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Software', label: 'Software' },
  { value: 'Network', label: 'Network' },
  { value: 'Email', label: 'Email' },
  { value: 'SAP', label: 'SAP' },
  { value: 'Bank', label: 'Bank' },
  { value: 'Other', label: 'Other' },
];

// Priority levels
const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'High', label: 'High', color: 'bg-destructive text-destructive-foreground' },
  { value: 'Medium', label: 'Medium', color: 'bg-secondary text-secondary-foreground' },
  { value: 'Low', label: 'Low', color: 'bg-muted text-muted-foreground' },
];

// Problem categories for IT classification
const PROBLEM_CATEGORIES = [
  'Hardware Failure',
  'Software Bug',
  'Network Connectivity',
  'Access Permission',
  'Email Configuration',
  'SAP Error',
  'Security Issue',
  'Performance',
  'Training Request',
  'Other',
];

// Support methods
const SUPPORT_METHODS = [
  { value: 'OnSite', label: 'On-Site' },
  { value: 'Remote', label: 'Remote Desktop' },
  { value: 'Phone', label: 'Phone Support' },
  { value: 'Email', label: 'Email' },
  { value: 'Others', label: 'Others' },
];

// Classification levels
const CLASSIFICATIONS = [
  { value: 'High', label: 'High', description: 'Critical - Affects business operations' },
  { value: 'Medium', label: 'Medium', description: 'Important - Needs attention soon' },
  { value: 'Low', label: 'Low', description: 'Minor - Can be scheduled' },
];

interface TriageTicket {
  id: number;
  title: string;
  formcode: string;
  requestorEmail?: string;
  siteKey?: MainDBITSiteKey;
  currentStatus: string;
  submitteddate?: string;
  remarks?: string;
  serviceType?: string;
  application?: string;
  priority?: string;
  assignedTo?: string;
  hoursWaiting: number;
  isEscalated: boolean;
  pic: ITSSRPICConfig | null;
}

function ITTriageDashboardContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<TriageTicket | null>(null);
  const [assignSheetOpen, setAssignSheetOpen] = useState(false);

  // Assignment form state
  const [assignedTo, setAssignedTo] = useState('');
  const [problemCategory, setProblemCategory] = useState('');
  const [classification, setClassification] = useState('');
  const [supportMethod, setSupportMethod] = useState('');
  const [itRemarks, setItRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current user identity
  const { data: user } = useUser();
  const userEmail = user?.userPrincipalName?.toLowerCase();

  // IT role check — fetch all roles, filter client-side
  const { data: allRoles = [] } = useUserRolesITList();
  const isITAdmin = useMemo(() => {
    if (!userEmail) return false;
    return allRoles.some(
      (r) =>
        r.userEmail?.toLowerCase() === userEmail &&
        r.isActive !== false &&
        canTriageITSR(r.roleCodeKey)
    );
  }, [allRoles, userEmail]);

  // Fetch all ITSSR requests
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    filter: "formcode eq 'ITSSR'",
    orderBy: ['submitteddate desc'],
  });

  // Fetch ext-support records to get service type per ticket
  const { data: extSupportRecords = [] } = useMainDBITExtSupportList({
    filter: "parentFormCode eq 'ITSSR'",
  });

  // Index ext support by parent record id for O(1) joins
  const extSupportByParentId = useMemo(() => {
    const map = new Map<number, typeof extSupportRecords[0]>();
    extSupportRecords.forEach((r) => {
      if (r.parentRecord?.id) map.set(r.parentRecord.id, r);
    });
    return map;
  }, [extSupportRecords]);

  const updateMutation = useUpdateMainDBIT();

  // My Submissions: current user's own ITSSR records
  const mySubmissions = useMemo(() => {
    if (!userEmail) return submissions;
    return submissions.filter(
      (s: MainDBIT) => s.requestoremail?.toLowerCase() === userEmail
    );
  }, [submissions, userEmail]);

  // Process tickets with escalation info + PIC routing (IT Admin triage view)
  const processedTickets = useMemo((): TriageTicket[] => {
    const now = new Date();
    return submissions
      .filter((s: MainDBIT) =>
        s.currentStatus === 'PendingIT' || s.currentStatus === 'In Progress' || s.currentStatus === 'PendingITPIC'
      )
      .map((s: MainDBIT) => {
        const submittedDate = s.submitteddate ? parseISO(s.submitteddate) : now;
        const hoursWaiting = differenceInHours(now, submittedDate);
        const ext = extSupportByParentId.get(s.id);
        const serviceType = ext?.iTSSRServiceType;
        const location = s.siteKey ? SITE_KEY_TO_ROUTING_LOCATION[s.siteKey] : undefined;
        const pic = getITSSRPIC(serviceType, undefined, location ?? undefined);
        return {
          id: s.id,
          title: s.title,
          formcode: s.formcode,
          requestorEmail: s.requestoremail,
          siteKey: s.siteKey,
          currentStatus: s.currentStatus,
          submitteddate: s.submitteddate,
          remarks: s.remarks,
          serviceType,
          hoursWaiting,
          isEscalated: hoursWaiting >= 2 && s.currentStatus === 'PendingIT',
          pic,
        };
      });
  }, [submissions, extSupportByParentId]);

  // Filter tickets — apply PIC routing: only show tickets routed to the current user.
  // If a ticket has no specific routing (pic is null), show it to all IT admins.
  const filteredTickets = useMemo(() => {
    return processedTickets.filter((ticket: TriageTicket) => {
      // PIC routing: only show if routed to current user (or unrouted)
      if (userEmail && ticket.pic) {
        const emailL = userEmail.toLowerCase();
        const isPrimary = ticket.pic.primaryPIC.toLowerCase() === emailL;
        const isSecondary = ticket.pic.secondaryPIC?.toLowerCase() === emailL;
        if (!isPrimary && !isSecondary) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          ticket.title?.toLowerCase().includes(query) ||
          ticket.requestorEmail?.toLowerCase().includes(query) ||
          ticket.formcode?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (serviceFilter !== 'all' && ticket.serviceType !== serviceFilter) return false;
      if (siteFilter !== 'all') {
        const siteKeyMapping: Record<string, MainDBITSiteKey> = {
          'Johor': 'SiteKey0',
          'Penang': 'SiteKey1',
          'Prai': 'SiteKey1',
          'KL': 'SiteKey2',
        };
        if (ticket.siteKey !== siteKeyMapping[siteFilter]) return false;
      }
      return true;
    });
  }, [processedTickets, searchQuery, serviceFilter, siteFilter, userEmail]);

  // Stats
  const stats = useMemo(() => {
    const total = processedTickets.length;
    const escalated = processedTickets.filter((t: TriageTicket) => t.isEscalated).length;
    const pendingAssignment = processedTickets.filter(
      (t: TriageTicket) => t.currentStatus === 'PendingIT'
    ).length;
    const inProgress = processedTickets.filter(
      (t: TriageTicket) => t.currentStatus === 'In Progress' || t.currentStatus === 'PendingITPIC'
    ).length;
    const avgWaitTime =
      total > 0
        ? Math.round(
            processedTickets.reduce((sum: number, t: TriageTicket) => sum + t.hoursWaiting, 0) /
              total
          )
        : 0;
    return { total, escalated, pendingAssignment, inProgress, avgWaitTime };
  }, [processedTickets]);

  // Handle ticket assignment
  const handleAssign = async () => {
    if (!selectedTicket || !assignedTo) {
      toast.error('Please select an IT staff member');
      return;
    }
    setIsSubmitting(true);
    try {
      // Preserve existing remarks and append assignment info
      const existingRemarks = selectedTicket.remarks || '';
      const assignmentEntry = `\n--- Assignment by ${user?.userPrincipalName || 'IT Admin'} on ${new Date().toISOString()} ---\nAssigned To: ${assignedTo}\nCategory: ${problemCategory}\nClassification: ${classification}\nSupport: ${supportMethod}${itRemarks ? `\nIT Notes: ${itRemarks}` : ''}`;
      const newRemarks = existingRemarks + assignmentEntry;

      await updateMutation.mutateAsync({
        id: String(selectedTicket.id),
        changedFields: {
          currentStatus: 'In Progress',
          remarks: newRemarks,
        },
      });
      toast.success('Ticket assigned successfully', {
        description: `Ticket ${selectedTicket.title} has been assigned`,
      });
      setAssignSheetOpen(false);
      setSelectedTicket(null);
      resetAssignForm();
      refetch();
    } catch (error: unknown) {
      toast.error('Failed to assign ticket', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssignForm = () => {
    setAssignedTo('');
    setProblemCategory('');
    setClassification('');
    setSupportMethod('');
    setItRemarks('');
  };

  const openAssignSheet = (ticket: TriageTicket) => {
    setSelectedTicket(ticket);
    // Pre-fill assignedTo with the routed PIC's email
    if (ticket.pic?.primaryPIC) {
      setAssignedTo(ticket.pic.primaryPIC);
    }
    setAssignSheetOpen(true);
  };

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/it">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary rounded-xl">
                <Headset className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">IT Triage Dashboard</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Manage pending assignments and escalations
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/it/forms/itssr/new">
              <Headset className="h-4 w-4 mr-2" />
              New ITSSR
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Main Tabs: My Submissions / My Actions */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue={isITAdmin ? 'actions' : 'submissions'} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="submissions" className="gap-2">
              <User className="h-4 w-4" />
              My Submissions
              {mySubmissions.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {mySubmissions.length}
                </Badge>
              )}
            </TabsTrigger>
            {isITAdmin && (
              <TabsTrigger value="actions" className="gap-2">
                <Headset className="h-4 w-4" />
                My Actions
                {stats.total > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {stats.total}
                  </Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          {/* My Submissions Tab */}
          <TabsContent value="submissions">
            <MySubmissionsList
              submissions={mySubmissions}
              isLoading={isLoading}
              onView={(id: number) => {
                const submission = mySubmissions.find((s: MainDBIT) => s.id === id);
                navigate(getITFormDetailPath(submission?.formcode, id));
              }}
            />
          </TabsContent>

          {/* My Actions Tab — IT Admin only */}
          {isITAdmin && (
            <TabsContent value="actions">
              {/* Escalation Alert */}
              {stats.escalated > 0 && (
                <div className="mb-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Escalation Alert</AlertTitle>
                    <AlertDescription>
                      {stats.escalated} ticket{stats.escalated > 1 ? 's have' : ' has'} been waiting
                      for more than 2 hours without assignment. Please review and assign immediately.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <div className="text-2xl font-bold">
                          {isLoading ? <Skeleton className="h-8 w-12" /> : stats.pendingAssignment}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Clock className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <div className="text-2xl font-bold">
                          {isLoading ? <Skeleton className="h-8 w-12" /> : stats.inProgress}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Escalated</p>
                        <div className="text-2xl font-bold text-destructive">
                          {isLoading ? <Skeleton className="h-8 w-12" /> : stats.escalated}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Queue</p>
                        <div className="text-2xl font-bold">
                          {isLoading ? <Skeleton className="h-8 w-12" /> : stats.total}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-2 md:col-span-1">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Wait</p>
                        <div className="text-2xl font-bold">
                          {isLoading ? <Skeleton className="h-8 w-12" /> : `${stats.avgWaitTime}h`}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Timer className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title, requestor, or ticket ID..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Service Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={siteFilter} onValueChange={setSiteFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sites</SelectItem>
                          <SelectItem value="Johor">Johor</SelectItem>
                          <SelectItem value="Penang">Penang / Prai</SelectItem>
                          <SelectItem value="KL">Kuala Lumpur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inner Tabs: Pending / Escalated / All */}
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Assignment
                    {stats.pendingAssignment > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {stats.pendingAssignment}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="escalated" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Escalated
                    {stats.escalated > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {stats.escalated}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="all" className="gap-2">
                    <Users className="h-4 w-4" />
                    All Queue
                    <Badge variant="outline" className="ml-1">
                      {stats.total}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                  <TicketList
                    tickets={filteredTickets.filter(
                      (t: TriageTicket) =>
                        t.currentStatus === 'PendingIT' && !t.isEscalated
                    )}
                    isLoading={isLoading}
                    onAssign={openAssignSheet}
                    onViewDetails={(ticket: TriageTicket) => navigate(getITFormDetailPath(ticket.formcode, ticket.id))}
                  />
                </TabsContent>
                <TabsContent value="escalated">
                  <TicketList
                    tickets={filteredTickets.filter((t: TriageTicket) => t.isEscalated)}
                    isLoading={isLoading}
                    onAssign={openAssignSheet}
                    onViewDetails={(ticket: TriageTicket) => navigate(getITFormDetailPath(ticket.formcode, ticket.id))}
                    showEscalation
                  />
                </TabsContent>
                <TabsContent value="all">
                  <TicketList
                    tickets={filteredTickets}
                    isLoading={isLoading}
                    onAssign={openAssignSheet}
                    onViewDetails={(ticket: TriageTicket) => navigate(getITFormDetailPath(ticket.formcode, ticket.id))}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>

      {/* Assignment Sheet */}
      <Sheet open={assignSheetOpen} onOpenChange={setAssignSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Assign Ticket</SheetTitle>
            <SheetDescription>
              Assign this support request to an IT staff member
            </SheetDescription>
          </SheetHeader>

          {selectedTicket && (
            <ScrollArea className="h-[calc(100vh-180px)] mt-6">
              <div className="space-y-6 pr-4">
                {/* Ticket Summary */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{selectedTicket.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTicket.formcode}-{selectedTicket.id}
                      </p>
                    </div>
                    {selectedTicket.isEscalated && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Escalated
                      </Badge>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{selectedTicket.requestorEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedTicket.siteKey
                          ? MainDBITSiteKeyToLabel[selectedTicket.siteKey]
                          : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Waiting: {selectedTicket.hoursWaiting}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedTicket.submitteddate
                          ? format(parseISO(selectedTicket.submitteddate), 'dd MMM yyyy')
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Routed PIC info */}
                  {selectedTicket.pic && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Routed PIC
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {getITSSRPICDisplayName(selectedTicket.pic.primaryPIC)}
                          </span>
                          <span className="text-muted-foreground">
                            ({selectedTicket.pic.primaryPIC})
                          </span>
                        </div>
                        {selectedTicket.pic.secondaryPIC && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Backup: {getITSSRPICDisplayName(selectedTicket.pic.secondaryPIC)}</span>
                          </div>
                        )}
                        {selectedTicket.pic.description && (
                          <p className="text-sm text-muted-foreground">{selectedTicket.pic.description}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Assignment Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Assign To <span className="text-destructive">*</span>
                    </Label>
                    <EmployeePicker
                      value={assignedTo}
                      onChange={(email: string) => setAssignedTo(email)}
                      placeholder="Select IT staff member..."
                      departmentFilter="IT"
                    />
                    {selectedTicket.pic?.primaryPIC && assignedTo === selectedTicket.pic.primaryPIC && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        Pre-filled from PIC routing
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Problem Category</Label>
                    <Select value={problemCategory} onValueChange={setProblemCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PROBLEM_CATEGORIES.map((cat: string) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Classification</Label>
                    <Select value={classification} onValueChange={setClassification}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSIFICATIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex flex-col">
                              <span>{c.label}</span>
                              <span className="text-xs text-muted-foreground">{c.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Support Method</Label>
                    <Select value={supportMethod} onValueChange={setSupportMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="How will this be resolved?" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">IT Remarks</Label>
                    <Textarea
                      placeholder="Add internal notes for the assigned IT staff..."
                      value={itRemarks}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItRemarks(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setAssignSheetOpen(false);
                      resetAssignForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAssign}
                    disabled={!assignedTo || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Assign Ticket
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}

// My Submissions Component
interface MySubmissionsListProps {
  submissions: MainDBIT[];
  isLoading: boolean;
  onView: (id: number) => void;
}

function MySubmissionsList({ submissions, isLoading, onView }: MySubmissionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i: number) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <Empty>
            <EmptyHeader>
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <EmptyTitle>No Submissions Yet</EmptyTitle>
              <EmptyDescription>
                You have not submitted any IT service requests yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((s: MainDBIT) => {
        const statusLabel = s.currentStatus || 'Unknown';
        const isApproved =
          statusLabel === 'Approved' || 
          statusLabel === 'Resolved' ||
          statusLabel === 'Accepted';
        const isRejected =
          statusLabel === 'Rejected' || 
          statusLabel === 'Withdrawn' ||
          statusLabel === 'Closed';

        return (
          <Card key={s.id} className="transition-all hover:shadow-md cursor-pointer" onClick={() => onView(s.id)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    isApproved
                      ? 'bg-primary'
                      : isRejected
                      ? 'bg-destructive'
                      : 'bg-secondary'
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  ) : isRejected ? (
                    <XCircle className="h-6 w-6 text-destructive-foreground" />
                  ) : (
                    <Clock className="h-6 w-6 text-secondary-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{s.title || 'Untitled Request'}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>
                      {s.formcode}-{s.id}
                    </span>
                    {s.submitteddate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(s.submitteddate), 'dd MMM yyyy')}
                      </span>
                    )}
                    {s.siteKey && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {MainDBITSiteKeyToLabel[s.siteKey]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      isApproved ? 'default' : isRejected ? 'destructive' : 'secondary'
                    }
                  >
                    {s.currentStatus === 'CurrentstatusKey3' ? 'Draft' :
                     s.currentStatus === 'PendingIT' ? 'Pending' :
                     s.currentStatus === 'PendingITPIC' ? 'Pending PIC' :
                     statusLabel.replace(/_/g, ' ')}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onView(s.id); }} className="h-10">
                    <ChevronRight className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Ticket List Component
interface TicketListProps {
  tickets: TriageTicket[];
  isLoading: boolean;
  onAssign: (ticket: TriageTicket) => void;
  onViewDetails: (ticket: TriageTicket) => void;
  showEscalation?: boolean;
}

function TicketList({ tickets, isLoading, onAssign, onViewDetails, showEscalation }: TicketListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i: number) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <Empty>
            <EmptyHeader>
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <EmptyTitle>
                {showEscalation ? 'No Escalated Tickets' : 'No Pending Tickets'}
              </EmptyTitle>
              <EmptyDescription>
                {showEscalation
                  ? 'All tickets are being handled within SLA'
                  : 'All tickets have been assigned'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket: TriageTicket) => (
        <Card
          key={ticket.id}
          className={`transition-all hover:shadow-md ${
            ticket.isEscalated ? 'border-l-4 border-l-destructive' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Status Icon */}
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  ticket.isEscalated
                    ? 'bg-destructive'
                    : (ticket.currentStatus === 'In Progress' || ticket.currentStatus === 'PendingITPIC')
                    ? 'bg-primary'
                    : 'bg-secondary'
                }`}
              >
                {ticket.isEscalated ? (
                  <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                ) : (ticket.currentStatus === 'In Progress' || ticket.currentStatus === 'PendingITPIC') ? (
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                ) : (
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                )}
              </div>

              {/* Ticket Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{ticket.title || 'Untitled Request'}</p>
                  {ticket.isEscalated && (
                    <Badge variant="destructive" className="shrink-0">
                      <Zap className="h-3 w-3 mr-1" />
                      {ticket.hoursWaiting}h overdue
                    </Badge>
                  )}
                  {ticket.serviceType && (
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {ticket.serviceType}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {ticket.requestorEmail || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {ticket.siteKey ? MainDBITSiteKeyToLabel[ticket.siteKey] : 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {ticket.submitteddate
                      ? formatDistanceToNow(parseISO(ticket.submitteddate), { addSuffix: true })
                      : 'Unknown'}
                  </span>
                  {ticket.pic && (
                    <span className="flex items-center gap-1 text-primary">
                      <User className="h-3 w-3" />
                      PIC: {getITSSRPICDisplayName(ticket.pic.primaryPIC)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={(ticket.currentStatus === 'In Progress' || ticket.currentStatus === 'PendingITPIC') ? 'default' : 'secondary'}>
                  {ticket.currentStatus === 'PendingIT' ? 'Pending' :
                   ticket.currentStatus === 'PendingITPIC' ? 'Pending PIC' :
                   ticket.currentStatus.replace(/_/g, ' ')}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(ticket)}
                >
                  View
                </Button>
                {ticket.currentStatus === 'PendingIT' && (
                  <Button
                    size="sm"
                    onClick={() => onAssign(ticket)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ITTriageDashboardPage() {
  return (
    <DataReadyGuard loadingMessage="Loading triage dashboard...">
      <ITTriageDashboardContent />
    </DataReadyGuard>
  );
}
