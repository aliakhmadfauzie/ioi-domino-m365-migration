/**
 * HR Disciplinary Cases Page
 * Manage disciplinary actions, investigations, and outcomes
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Scale,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  FileText,
  Shield,
  Gavel,
  Flag,
  Lock,
  MessageSquare,
  UserX,
  AlertOctagon,
  History,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// Types
interface DisciplinaryCase {
  id: string;
  caseNo: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  category: 'Misconduct' | 'Poor Performance' | 'Attendance' | 'Safety Violation' | 'Policy Violation' | 'Others';
  severity: 'Minor' | 'Major' | 'Gross';
  status: 'Open' | 'Under Investigation' | 'Pending Decision' | 'Closed' | 'Appeal';
  outcome?: 'Verbal Warning' | 'Written Warning' | 'Final Warning' | 'Suspension' | 'Termination' | 'No Action' | 'Pending';
  incidentDate: string;
  reportedDate: string;
  reportedBy: string;
  investigator?: string;
  description: string;
  witnesses?: string[];
  closedDate?: string;
  remarks?: string;
  timeline: { date: string; action: string; by: string }[];
}

// Mock Data
const MOCK_CASES: DisciplinaryCase[] = [
  {
    id: 'DC001',
    caseNo: 'DC-2024-001',
    employeeId: 'E001',
    employeeName: 'Ahmad Razak',
    department: 'Production',
    position: 'Machine Operator',
    category: 'Attendance',
    severity: 'Minor',
    status: 'Closed',
    outcome: 'Verbal Warning',
    incidentDate: '2024-03-10',
    reportedDate: '2024-03-11',
    reportedBy: 'Supervisor Lim',
    investigator: 'HR Admin',
    description: 'Repeated late coming (5 instances in March 2024)',
    closedDate: '2024-03-20',
    timeline: [
      { date: '2024-03-11', action: 'Case reported', by: 'Supervisor Lim' },
      { date: '2024-03-12', action: 'Investigation started', by: 'HR Admin' },
      { date: '2024-03-15', action: 'Employee interview conducted', by: 'HR Admin' },
      { date: '2024-03-20', action: 'Verbal warning issued', by: 'HR Manager' },
    ],
  },
  {
    id: 'DC002',
    caseNo: 'DC-2024-002',
    employeeId: 'E015',
    employeeName: 'Muthu Selvam',
    department: 'Logistics',
    position: 'Warehouse Assistant',
    category: 'Safety Violation',
    severity: 'Major',
    status: 'Under Investigation',
    incidentDate: '2024-04-08',
    reportedDate: '2024-04-08',
    reportedBy: 'Safety Officer',
    investigator: 'HR Manager',
    description: 'Operating forklift without valid license. Near-miss incident reported.',
    witnesses: ['Tan Wei Ming', 'Raj Kumar'],
    timeline: [
      { date: '2024-04-08', action: 'Incident reported', by: 'Safety Officer' },
      { date: '2024-04-09', action: 'Investigation initiated', by: 'HR Manager' },
      { date: '2024-04-10', action: 'Witness statements collected', by: 'HR Manager' },
    ],
  },
  {
    id: 'DC003',
    caseNo: 'DC-2024-003',
    employeeId: 'E022',
    employeeName: 'Siti Fatimah',
    department: 'QA',
    position: 'QC Inspector',
    category: 'Poor Performance',
    severity: 'Minor',
    status: 'Pending Decision',
    incidentDate: '2024-03-25',
    reportedDate: '2024-03-28',
    reportedBy: 'QA Manager',
    investigator: 'HR Admin',
    description: 'Consistent errors in quality inspection reports. Training provided but no improvement.',
    timeline: [
      { date: '2024-03-28', action: 'Performance issue reported', by: 'QA Manager' },
      { date: '2024-04-01', action: 'Performance review meeting', by: 'HR Admin' },
      { date: '2024-04-05', action: 'PIP discussion initiated', by: 'HR Manager' },
    ],
  },
  {
    id: 'DC004',
    caseNo: 'DC-2024-004',
    employeeId: 'E045',
    employeeName: 'Lee Wei Ming',
    department: 'Maintenance',
    position: 'Technician',
    category: 'Misconduct',
    severity: 'Major',
    status: 'Closed',
    outcome: 'Written Warning',
    incidentDate: '2024-02-20',
    reportedDate: '2024-02-21',
    reportedBy: 'Maintenance Supervisor',
    investigator: 'HR Manager',
    description: 'Unauthorized use of company vehicle for personal purposes.',
    closedDate: '2024-03-05',
    timeline: [
      { date: '2024-02-21', action: 'Incident reported', by: 'Maintenance Supervisor' },
      { date: '2024-02-22', action: 'Investigation started', by: 'HR Manager' },
      { date: '2024-02-28', action: 'Domestic inquiry conducted', by: 'Panel' },
      { date: '2024-03-05', action: 'Written warning issued', by: 'HR Director' },
    ],
  },
  {
    id: 'DC005',
    caseNo: 'DC-2024-005',
    employeeId: 'E067',
    employeeName: 'Nurul Huda',
    department: 'Finance',
    position: 'Accounts Executive',
    category: 'Policy Violation',
    severity: 'Minor',
    status: 'Open',
    incidentDate: '2024-04-15',
    reportedDate: '2024-04-16',
    reportedBy: 'IT Department',
    description: 'Unauthorized software installation on company computer.',
    timeline: [
      { date: '2024-04-16', action: 'Case opened', by: 'IT Department' },
    ],
  },
];

const CATEGORIES = ['All', 'Misconduct', 'Poor Performance', 'Attendance', 'Safety Violation', 'Policy Violation', 'Others'];
const STATUS_OPTIONS = ['All', 'Open', 'Under Investigation', 'Pending Decision', 'Closed', 'Appeal'];
const SEVERITY_OPTIONS = ['All', 'Minor', 'Major', 'Gross'];

export default function DisciplinaryPage() {
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  // Stats
  const stats = useMemo(() => {
    const open = MOCK_CASES.filter((c: DisciplinaryCase) => c.status === 'Open' || c.status === 'Under Investigation').length;
    const pending = MOCK_CASES.filter((c: DisciplinaryCase) => c.status === 'Pending Decision').length;
    const closed = MOCK_CASES.filter((c: DisciplinaryCase) => c.status === 'Closed').length;
    const byCategory: Record<string, number> = {};
    MOCK_CASES.forEach((c: DisciplinaryCase) => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    });
    return { total: MOCK_CASES.length, open, pending, closed, byCategory };
  }, []);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return MOCK_CASES.filter((c: DisciplinaryCase) => {
      const matchesSearch = !searchQuery ||
        c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
      const matchesSeverity = selectedSeverity === 'All' || c.severity === selectedSeverity;
      
      if (activeTab === 'active') {
        return matchesSearch && matchesCategory && matchesSeverity && c.status !== 'Closed';
      }
      if (activeTab === 'closed') {
        return matchesSearch && matchesCategory && matchesSeverity && c.status === 'Closed';
      }
      return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
    });
  }, [searchQuery, selectedCategory, selectedStatus, selectedSeverity, activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Under Investigation': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Pending Decision': return 'bg-secondary text-secondary-foreground dark:bg-violet-900/30 dark:text-violet-400';
      case 'Closed': return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
      case 'Appeal': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'border-accent text-accent-foreground dark:border-accent dark:text-accent-foreground';
      case 'Major': return 'border-accent text-accent-foreground dark:border-accent dark:text-accent-foreground';
      case 'Gross': return 'border-destructive/30 text-destructive dark:border-destructive dark:text-destructive';
      default: return 'border-border text-muted-foreground';
    }
  };

  const getOutcomeBadge = (outcome?: string) => {
    if (!outcome) return null;
    switch (outcome) {
      case 'Verbal Warning': return 'bg-accent text-accent-foreground';
      case 'Written Warning': return 'bg-accent text-accent-foreground';
      case 'Final Warning': return 'bg-destructive/10 text-destructive';
      case 'Suspension': return 'bg-destructive/10 text-destructive';
      case 'Termination': return 'bg-destructive text-destructive';
      case 'No Action': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/hr" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-destructive dark:text-destructive" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Disciplinary Cases</h1>
                  <p className="text-xs text-muted-foreground">Manage investigations & actions</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowNewCaseModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Case
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
        {/* Confidentiality Notice */}
        <div className="p-4 rounded-lg bg-destructive/5 dark:bg-destructive/30 border border-destructive/20 dark:border-destructive flex items-center gap-3">
          <Lock className="h-5 w-5 text-destructive dark:text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive dark:text-destructive">Confidential Information</p>
            <p className="text-xs text-destructive dark:text-destructive">This page contains sensitive employee data. Handle with strict confidentiality.</p>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Cases</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-destructive dark:text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent dark:border-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Open Cases</p>
                  <p className="text-2xl font-bold mt-1 text-accent-foreground dark:text-accent-foreground">{stats.open}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <AlertOctagon className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-violet-200 dark:border-violet-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Pending Decision</p>
                  <p className="text-2xl font-bold mt-1 text-secondary-foreground dark:text-violet-400">{stats.pending}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-secondary-foreground dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Closed</p>
                  <p className="text-2xl font-bold mt-1">{stats.closed}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary dark:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cases by Category */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Cases by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="px-4 py-2 rounded-lg border hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-medium">{category}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active" className="relative">
              Active Cases
              {stats.open > 0 && (
                <span className="ml-2 h-5 w-5 rounded-full bg-accent/500 text-white text-[10px] flex items-center justify-center">
                  {stats.open}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="closed">Closed Cases</TabsTrigger>
            <TabsTrigger value="all">All Cases</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-sm font-semibold">Disciplinary Cases</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="h-8 w-40 pl-8 text-xs"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITY_OPTIONS.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Case No.</TableHead>
                      <TableHead className="text-xs">Employee</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs">Severity</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Outcome</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((caseItem: DisciplinaryCase) => (
                      <TableRow
                        key={caseItem.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setSelectedCase(caseItem); setShowDetailModal(true); }}
                      >
                        <TableCell className="font-mono text-xs">{caseItem.caseNo}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{caseItem.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{caseItem.department}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{caseItem.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-[10px]', getSeverityBadge(caseItem.severity))}>
                            {caseItem.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-[10px]', getStatusBadge(caseItem.status))}>
                            {caseItem.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {caseItem.outcome ? (
                            <Badge className={cn('text-[10px]', getOutcomeBadge(caseItem.outcome))}>
                              {caseItem.outcome}
                            </Badge>
                          ) : '—'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(caseItem.incidentDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedCase(caseItem); setShowDetailModal(true); }}>
                                <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-3.5 w-3.5 mr-2" /> Update Case
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <History className="h-3.5 w-3.5 mr-2" /> View Timeline
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="h-3.5 w-3.5 mr-2" /> Export Report
                              </DropdownMenuItem>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{selectedCase?.caseNo}</span>
              Disciplinary Case Details
            </DialogTitle>
          </DialogHeader>
          {selectedCase && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-card border flex items-center justify-center">
                      <UserX className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedCase.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedCase.position} • {selectedCase.department}</p>
                    </div>
                  </div>
                </div>

                {/* Case Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{selectedCase.category}</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Severity</p>
                    <Badge variant="outline" className={cn('text-[10px] mt-1', getSeverityBadge(selectedCase.severity))}>
                      {selectedCase.severity}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className={cn('text-[10px] mt-1', getStatusBadge(selectedCase.status))}>
                      {selectedCase.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Outcome</p>
                    {selectedCase.outcome ? (
                      <Badge className={cn('text-[10px] mt-1', getOutcomeBadge(selectedCase.outcome))}>
                        {selectedCase.outcome}
                      </Badge>
                    ) : <p className="text-sm">Pending</p>}
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Incident Date</p>
                    <p className="text-sm font-medium">{format(new Date(selectedCase.incidentDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Reported By</p>
                    <p className="text-sm font-medium">{selectedCase.reportedBy}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                    {selectedCase.description}
                  </p>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Case Timeline</h4>
                  <div className="space-y-3">
                    {selectedCase.timeline.map((event: { date: string; action: string; by: string }, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          {i < selectedCase.timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium">{event.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.date), 'MMM d, yyyy')} • {event.by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Edit className="h-4 w-4 mr-2" /> Update Case
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* New Case Modal */}
      <Dialog open={showNewCaseModal} onOpenChange={setShowNewCaseModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report New Case</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Input placeholder="Search employee..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c: string) => c !== 'All').map((c: string) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {SEVERITY_OPTIONS.filter((s: string) => s !== 'All').map((s: string) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Incident Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the incident in detail..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Witnesses (optional)</Label>
              <Input placeholder="Names of witnesses" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { setShowNewCaseModal(false); toast.success('Case reported!'); }}>
                Submit Case
              </Button>
              <Button variant="outline" onClick={() => setShowNewCaseModal(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
