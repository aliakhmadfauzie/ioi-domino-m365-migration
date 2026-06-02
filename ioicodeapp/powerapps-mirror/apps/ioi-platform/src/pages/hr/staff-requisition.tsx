/**
 * Staff Requisition Form (SR)
 * Request for new/replacement staff with approval workflow
 * Supports both PRAI and JHR sites
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  FileText,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  Briefcase,
  User,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';

// Types
interface StaffRequisition {
  id: string;
  requestNo: string;
  requestDate: string;
  requestedBy: string;
  department: string;
  site: 'PRAI' | 'JHR';
  position: string;
  employmentType: 'Permanent' | 'Contract' | 'Part-time' | 'Internship';
  requisitionType: 'New' | 'Replacement' | 'Temporary';
  headcount: number;
  justification: string;
  budgetAllocated: boolean;
  salaryRange: string;
  targetJoinDate: string;
  status: 'Draft' | 'Pending HOD' | 'Pending HR' | 'Pending GM' | 'Approved' | 'Rejected' | 'Cancelled';
  hodApprover?: string;
  hodApprovedDate?: string;
  hrApprover?: string;
  hrApprovedDate?: string;
  gmApprover?: string;
  gmApprovedDate?: string;
  remarks?: string;
  replacementFor?: string;
}

// Mock Data
const MOCK_REQUISITIONS: StaffRequisition[] = [
  {
    id: 'SR-2024-001',
    requestNo: 'SR-2024-001',
    requestDate: '2024-04-15',
    requestedBy: 'Ahmad Razak',
    department: 'Operations',
    site: 'PRAI',
    position: 'Plant Operator',
    employmentType: 'Permanent',
    requisitionType: 'New',
    headcount: 2,
    justification: 'Production expansion requires additional operators for new production line.',
    budgetAllocated: true,
    salaryRange: 'RM 2,500 - RM 3,500',
    targetJoinDate: '2024-06-01',
    status: 'Pending HR',
    hodApprover: 'Tan Wei Ming',
    hodApprovedDate: '2024-04-16',
  },
  {
    id: 'SR-2024-002',
    requestNo: 'SR-2024-002',
    requestDate: '2024-04-18',
    requestedBy: 'Siti Aminah',
    department: 'QA',
    site: 'PRAI',
    position: 'QC Analyst',
    employmentType: 'Permanent',
    requisitionType: 'Replacement',
    headcount: 1,
    justification: 'Replacement for resigned staff. Critical position for quality assurance.',
    budgetAllocated: true,
    salaryRange: 'RM 3,000 - RM 4,000',
    targetJoinDate: '2024-05-15',
    status: 'Approved',
    hodApprover: 'Dr. Lee Wei',
    hodApprovedDate: '2024-04-19',
    hrApprover: 'Nurul Huda',
    hrApprovedDate: '2024-04-20',
    gmApprover: 'Dato\' Ahmad',
    gmApprovedDate: '2024-04-21',
    replacementFor: 'Lim Chee Wei',
  },
  {
    id: 'SR-2024-003',
    requestNo: 'SR-2024-003',
    requestDate: '2024-04-20',
    requestedBy: 'Rajesh Kumar',
    department: 'R&D',
    site: 'PRAI',
    position: 'Research Scientist',
    employmentType: 'Contract',
    requisitionType: 'New',
    headcount: 1,
    justification: 'New R&D project requires specialized expertise in organic chemistry.',
    budgetAllocated: true,
    salaryRange: 'RM 5,000 - RM 7,000',
    targetJoinDate: '2024-07-01',
    status: 'Pending GM',
    hodApprover: 'Dr. Muthu',
    hodApprovedDate: '2024-04-21',
    hrApprover: 'Nurul Huda',
    hrApprovedDate: '2024-04-22',
  },
  {
    id: 'SR-2024-004',
    requestNo: 'SR-2024-004',
    requestDate: '2024-04-22',
    requestedBy: 'Lim Wei Ming',
    department: 'Maintenance',
    site: 'JHR',
    position: 'Electrical Technician',
    employmentType: 'Permanent',
    requisitionType: 'Replacement',
    headcount: 1,
    justification: 'Urgent replacement needed. Staff resigned with immediate effect.',
    budgetAllocated: true,
    salaryRange: 'RM 2,800 - RM 3,800',
    targetJoinDate: '2024-05-01',
    status: 'Pending HOD',
    replacementFor: 'Tan Ah Kow',
  },
  {
    id: 'SR-2024-005',
    requestNo: 'SR-2024-005',
    requestDate: '2024-04-10',
    requestedBy: 'Wong Chee Keong',
    department: 'Finance',
    site: 'PRAI',
    position: 'Accounts Executive',
    employmentType: 'Permanent',
    requisitionType: 'New',
    headcount: 1,
    justification: 'Budget not approved for this fiscal year.',
    budgetAllocated: false,
    salaryRange: 'RM 3,500 - RM 4,500',
    targetJoinDate: '2024-06-01',
    status: 'Rejected',
    hodApprover: 'Dato\' Lim',
    hodApprovedDate: '2024-04-11',
    hrApprover: 'Nurul Huda',
    hrApprovedDate: '2024-04-12',
    gmApprover: 'Dato\' Ahmad',
    gmApprovedDate: '2024-04-13',
    remarks: 'Budget constraints. Re-evaluate in Q3.',
  },
];

const DEPARTMENTS = ['Operations', 'QA', 'QC', 'R&D', 'Maintenance', 'Finance', 'HR', 'IT', 'Logistics', 'Production', 'SHE', 'Marketing'];
const STATUS_OPTIONS = ['All', 'Draft', 'Pending HOD', 'Pending HR', 'Pending GM', 'Approved', 'Rejected', 'Cancelled'];
const SITES = ['All', 'PRAI', 'JHR'];

export default function StaffRequisitionPage() {
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedRequisition, setSelectedRequisition] = useState<StaffRequisition | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Stats
  const stats = useMemo(() => {
    const pending = MOCK_REQUISITIONS.filter((r: StaffRequisition) => r.status.startsWith('Pending')).length;
    const approved = MOCK_REQUISITIONS.filter((r: StaffRequisition) => r.status === 'Approved').length;
    const rejected = MOCK_REQUISITIONS.filter((r: StaffRequisition) => r.status === 'Rejected').length;
    const totalHeadcount = MOCK_REQUISITIONS.filter((r: StaffRequisition) => r.status === 'Approved').reduce((acc: number, r: StaffRequisition) => acc + r.headcount, 0);
    return { pending, approved, rejected, totalHeadcount, total: MOCK_REQUISITIONS.length };
  }, []);

  // Filtered requisitions
  const filteredRequisitions = useMemo(() => {
    return MOCK_REQUISITIONS.filter((r: StaffRequisition) => {
      const matchesSearch = !searchQuery ||
        r.requestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
      const matchesSite = selectedSite === 'All' || r.site === selectedSite;
      
      if (activeTab === 'pending') {
        return matchesSearch && matchesSite && r.status.startsWith('Pending');
      }
      return matchesSearch && matchesStatus && matchesSite;
    });
  }, [searchQuery, selectedStatus, selectedSite, activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-muted text-foreground dark:bg-muted dark:text-muted-foreground';
      case 'Pending HOD': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Pending HR': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Pending GM': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-accent-foreground';
      case 'Approved': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Rejected': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      case 'Cancelled': return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'Rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'Pending HOD':
      case 'Pending HR':
      case 'Pending GM': return <Clock className="h-4 w-4 text-accent-foreground" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/hr/recruitment" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
                <div>
                  <HRBreadcrumb items={[{ label: 'Recruitment', href: '/hr/recruitment' }, { label: 'Staff Requisition' }]} variant="compact" />
                  <h1 className="text-base font-semibold">Staff Requisition</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button onClick={() => setShowNewModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Request
              </Button>
              <div className="flex items-center gap-2 pl-3 border-l">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Requests</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent dark:border-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Pending Approval</p>
                  <p className="text-2xl font-bold mt-1 text-accent-foreground">{stats.pending}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Approved</p>
                  <p className="text-2xl font-bold mt-1 text-primary">{stats.approved}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary dark:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Rejected</p>
                  <p className="text-2xl font-bold mt-1 text-destructive">{stats.rejected}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-destructive dark:text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Headcount Approved</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalHeadcount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending Approval
              {stats.pending > 0 && (
                <span className="ml-2 h-5 w-5 rounded-full bg-accent/500 text-white text-[10px] flex items-center justify-center">
                  {stats.pending}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-sm font-semibold">Staff Requisition Requests</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="h-8 w-40 pl-8 text-xs"
                      />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger className="h-8 w-24 text-xs">
                        <SelectValue placeholder="Site" />
                      </SelectTrigger>
                      <SelectContent>
                        {SITES.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Request No.</TableHead>
                      <TableHead className="text-xs">Position</TableHead>
                      <TableHead className="text-xs">Department</TableHead>
                      <TableHead className="text-xs">Site</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">HC</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequisitions.map((req: StaffRequisition) => (
                      <TableRow
                        key={req.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setSelectedRequisition(req); setShowDetailModal(true); }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(req.status)}
                            <span className="font-mono text-sm">{req.requestNo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{req.position}</p>
                            <p className="text-xs text-muted-foreground">{req.employmentType}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{req.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {req.site}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {req.requisitionType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{req.headcount}</TableCell>
                        <TableCell>
                          <Badge className={cn('text-[10px]', getStatusBadge(req.status))}>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedRequisition(req); setShowDetailModal(true); }}>
                                <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                              </DropdownMenuItem>
                              {req.status.startsWith('Pending') && (
                                <DropdownMenuItem className="text-primary">
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Approve
                                </DropdownMenuItem>
                              )}
                              {req.status.startsWith('Pending') && (
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="h-3.5 w-3.5 mr-2" /> Reject
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Staff Requisition Details</DialogTitle>
            <DialogDescription>Request #{selectedRequisition?.requestNo}</DialogDescription>
          </DialogHeader>
          {selectedRequisition && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedRequisition.position}</h3>
                      <p className="text-sm text-muted-foreground">{selectedRequisition.department} • {selectedRequisition.site}</p>
                    </div>
                  </div>
                  <Badge className={cn('text-xs', getStatusBadge(selectedRequisition.status))}>
                    {selectedRequisition.status}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Request No.</p>
                  <p className="text-sm font-medium font-mono">{selectedRequisition.requestNo}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Request Date</p>
                  <p className="text-sm font-medium">{format(new Date(selectedRequisition.requestDate), 'MMM d, yyyy')}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Requested By</p>
                  <p className="text-sm font-medium">{selectedRequisition.requestedBy}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Employment Type</p>
                  <p className="text-sm font-medium">{selectedRequisition.employmentType}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Requisition Type</p>
                  <p className="text-sm font-medium">{selectedRequisition.requisitionType}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Headcount</p>
                  <p className="text-sm font-medium">{selectedRequisition.headcount}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Salary Range</p>
                  <p className="text-sm font-medium">{selectedRequisition.salaryRange}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Target Join Date</p>
                  <p className="text-sm font-medium">{format(new Date(selectedRequisition.targetJoinDate), 'MMM d, yyyy')}</p>
                </div>
              </div>

              {/* Justification */}
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-2">Justification</p>
                <p className="text-sm">{selectedRequisition.justification}</p>
              </div>

              {/* Approval Timeline */}
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-3">Approval Timeline</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      selectedRequisition.hodApprovedDate ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      {selectedRequisition.hodApprovedDate ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">HOD Approval</p>
                      {selectedRequisition.hodApprover ? (
                        <p className="text-xs text-muted-foreground">
                          {selectedRequisition.hodApprover} • {format(new Date(selectedRequisition.hodApprovedDate!), 'MMM d, yyyy')}
                        </p>
                      ) : (
                        <p className="text-xs text-accent-foreground">Pending</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      selectedRequisition.hrApprovedDate ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      {selectedRequisition.hrApprovedDate ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">HR Approval</p>
                      {selectedRequisition.hrApprover ? (
                        <p className="text-xs text-muted-foreground">
                          {selectedRequisition.hrApprover} • {format(new Date(selectedRequisition.hrApprovedDate!), 'MMM d, yyyy')}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Awaiting</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      selectedRequisition.gmApprovedDate ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      {selectedRequisition.gmApprovedDate ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">GM Approval</p>
                      {selectedRequisition.gmApprover ? (
                        <p className="text-xs text-muted-foreground">
                          {selectedRequisition.gmApprover} • {format(new Date(selectedRequisition.gmApprovedDate!), 'MMM d, yyyy')}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Awaiting</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {selectedRequisition.status.startsWith('Pending') && (
                  <>
                    <Button className="flex-1" onClick={() => { toast.success('Approved!'); setShowDetailModal(false); }}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button variant="destructive" onClick={() => { toast.error('Rejected'); setShowDetailModal(false); }}>
                      <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Request Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Staff Requisition</DialogTitle>
            <DialogDescription>Request for new or replacement staff</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position Title</Label>
                <Input placeholder="e.g., Plant Operator" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRAI">PRAI</SelectItem>
                    <SelectItem value="JHR">JHR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Requisition Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New Position</SelectItem>
                    <SelectItem value="Replacement">Replacement</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Headcount</Label>
                <Input type="number" placeholder="1" min={1} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salary Range (RM)</Label>
                <Input placeholder="e.g., 2,500 - 3,500" />
              </div>
              <div className="space-y-2">
                <Label>Target Join Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Justification</Label>
              <Textarea placeholder="Explain why this position is needed..." rows={4} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { setShowNewModal(false); toast.success('Requisition submitted for approval!'); }}>
                <Send className="h-4 w-4 mr-2" /> Submit Request
              </Button>
              <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
