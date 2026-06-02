/**
 * QA Audit Management Page
 * Schedule audits, track findings, manage CAPAs
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Users,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Eye,
  Edit2,
  Target,
  FileText,
  MoreHorizontal,
  ChevronRight,
  CalendarDays,
  User,
  BarChart3,
  TrendingUp,
  ListChecks,
  AlertCircle,
  CheckSquare,
  XCircle,
  Minus,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { toast } from 'sonner';

// Types
interface AuditFinding {
  id: string;
  description: string;
  category: 'Observation' | 'Minor NC' | 'Major NC' | 'OFI';
  status: 'Open' | 'In Progress' | 'Closed';
  capaId?: string;
}

interface Audit {
  id: string;
  name: string;
  type: 'Internal' | 'External' | 'Supplier' | 'Process' | 'Regulatory';
  department: string;
  site: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  leadAuditor: string;
  team: string[];
  scope: string;
  score?: number;
  findings: AuditFinding[];
  standard?: string;
}

// Mock Data
const MOCK_AUDITS: Audit[] = [
  { 
    id: 'AUD-2026-001', 
    name: 'HACCP Annual Review', 
    type: 'Internal', 
    department: 'Production', 
    site: 'PRAI', 
    scheduledDate: '2026-05-15', 
    status: 'Scheduled', 
    leadAuditor: 'Ahmad Razak', 
    team: ['Sarah Lee', 'Chen Wei'],
    scope: 'HACCP plan verification, CCP monitoring, corrective actions review',
    standard: 'HACCP',
    findings: []
  },
  { 
    id: 'AUD-2026-002', 
    name: 'ISO 9001 Surveillance Audit', 
    type: 'External', 
    department: 'QA', 
    site: 'PRAI', 
    scheduledDate: '2026-04-28', 
    completedDate: '2026-04-28',
    status: 'Completed', 
    leadAuditor: 'Bureau Veritas', 
    team: ['Ahmad Razak', 'Sarah Lee'],
    scope: 'Quality management system, process controls, documentation',
    score: 92,
    standard: 'ISO 9001:2015',
    findings: [
      { id: 'F-001', description: 'Document control procedure needs update for electronic records', category: 'Minor NC', status: 'In Progress', capaId: 'CAPA-2026-019' },
      { id: 'F-002', description: 'Training records incomplete for 2 operators', category: 'Observation', status: 'Open' },
      { id: 'F-003', description: 'Calibration schedule optimization opportunity', category: 'OFI', status: 'Open' },
    ]
  },
  { 
    id: 'AUD-2026-003', 
    name: 'Supplier Quality Audit - PT Sinar', 
    type: 'Supplier', 
    department: 'Procurement', 
    site: 'JHR', 
    scheduledDate: '2026-05-08', 
    status: 'In Progress', 
    leadAuditor: 'Raj Kumar', 
    team: ['Lim Mei'],
    scope: 'Supplier QMS, process capability, delivery performance',
    findings: [
      { id: 'F-004', description: 'Storage conditions for raw materials inadequate', category: 'Major NC', status: 'Open' },
      { id: 'F-005', description: 'Pest control records missing for Q1', category: 'Minor NC', status: 'Open' },
    ]
  },
  { 
    id: 'AUD-2026-004', 
    name: 'Process Safety Audit - Reactor Area', 
    type: 'Process', 
    department: 'Operations', 
    site: 'PRAI', 
    scheduledDate: '2026-04-20', 
    completedDate: '2026-04-20',
    status: 'Completed', 
    leadAuditor: 'Chen Wei', 
    team: ['Ali Hassan', 'Ahmad Razak'],
    scope: 'HAZOP review, safety interlocks, emergency procedures',
    score: 88,
    findings: [
      { id: 'F-006', description: 'Emergency shower inspection overdue', category: 'Minor NC', status: 'Closed', capaId: 'CAPA-2026-017' },
      { id: 'F-007', description: 'P&ID drawings not current revision', category: 'Minor NC', status: 'In Progress', capaId: 'CAPA-2026-018' },
      { id: 'F-008', description: 'SOP review for reactor startup incomplete', category: 'Major NC', status: 'In Progress', capaId: 'CAPA-2026-016' },
      { id: 'F-009', description: 'Consider adding redundant temperature sensor', category: 'OFI', status: 'Open' },
      { id: 'F-010', description: 'Operator communication protocol improvement', category: 'Observation', status: 'Closed' },
    ]
  },
  { 
    id: 'AUD-2026-005', 
    name: 'Environmental Compliance Audit', 
    type: 'Regulatory', 
    department: 'HSE', 
    site: 'JHR', 
    scheduledDate: '2026-05-22', 
    status: 'Scheduled', 
    leadAuditor: 'DOE Inspector', 
    team: ['Lim Mei', 'Raj Kumar'],
    scope: 'Waste management, effluent treatment, air emissions, permits',
    standard: 'EQA 1974',
    findings: []
  },
  { 
    id: 'AUD-2026-006', 
    name: 'HALAL Certification Audit', 
    type: 'External', 
    department: 'Production', 
    site: 'PRAI', 
    scheduledDate: '2026-06-10', 
    status: 'Scheduled', 
    leadAuditor: 'JAKIM Auditor', 
    team: ['Ahmad Razak', 'Sarah Lee'],
    scope: 'Halal compliance, ingredient traceability, cleaning procedures',
    standard: 'MS 1500:2019',
    findings: []
  },
  { 
    id: 'AUD-2026-007', 
    name: 'Internal GMP Audit Q2', 
    type: 'Internal', 
    department: 'Production', 
    site: 'JHR', 
    scheduledDate: '2026-04-10', 
    completedDate: '2026-04-10',
    status: 'Completed', 
    leadAuditor: 'Sarah Lee', 
    team: ['Chen Wei'],
    scope: 'Good manufacturing practices, hygiene, personnel',
    score: 94,
    findings: [
      { id: 'F-011', description: 'Hand washing station soap dispenser empty', category: 'Observation', status: 'Closed' },
    ]
  },
];

const DEPARTMENTS = ['Production', 'Operations', 'QA', 'QC', 'HSE', 'Procurement', 'Maintenance', 'Warehouse'];
const SITES = ['PRAI', 'JHR'];
const TYPES = ['Internal', 'External', 'Supplier', 'Process', 'Regulatory'];
const STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const AUDITORS = ['Ahmad Razak', 'Sarah Lee', 'Chen Wei', 'Raj Kumar', 'Lim Mei', 'Ali Hassan'];

export default function AuditsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSite, setFilterSite] = useState('all');
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('details');

  // Filter audits
  const filteredAudits = useMemo(() => {
    return MOCK_AUDITS.filter((a) => {
      const matchesSearch = !searchQuery || 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchesType = filterType === 'all' || a.type === filterType;
      const matchesSite = filterSite === 'all' || a.site === filterSite;
      return matchesSearch && matchesStatus && matchesType && matchesSite;
    });
  }, [searchQuery, filterStatus, filterType, filterSite]);

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_AUDITS.length,
    scheduled: MOCK_AUDITS.filter((a) => a.status === 'Scheduled').length,
    inProgress: MOCK_AUDITS.filter((a) => a.status === 'In Progress').length,
    completed: MOCK_AUDITS.filter((a) => a.status === 'Completed').length,
    avgScore: Math.round(MOCK_AUDITS.filter((a) => a.score).reduce((acc, a) => acc + (a.score || 0), 0) / MOCK_AUDITS.filter((a) => a.score).length),
    openFindings: MOCK_AUDITS.flatMap((a) => a.findings).filter((f) => f.status !== 'Closed').length,
  }), []);

  // Calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getAuditsForDay = (day: Date) => {
    return MOCK_AUDITS.filter((a) => isSameDay(new Date(a.scheduledDate), day));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-secondary text-secondary-foreground dark:bg-violet-900/30 dark:text-violet-400';
      case 'In Progress': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Completed': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Cancelled': return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Internal': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'External': return 'bg-secondary text-secondary-foreground dark:bg-violet-900/30 dark:text-violet-400';
      case 'Supplier': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Process': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Regulatory': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getFindingCategoryClass = (category: string) => {
    switch (category) {
      case 'Major NC': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      case 'Minor NC': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Observation': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'OFI': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-primary dark:text-primary';
    if (score >= 80) return 'text-accent-foreground dark:text-accent-foreground';
    return 'text-destructive dark:text-destructive';
  };

  const handleOpenDetail = (audit: Audit) => {
    setSelectedAudit(audit);
    setShowDetailSheet(true);
    setActiveTab('details');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterType('all');
    setFilterSite('all');
  };

  const hasActiveFilters = searchQuery || filterStatus !== 'all' || filterType !== 'all' || filterSite !== 'all';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/qa" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 text-secondary-foreground dark:text-violet-400" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Audit Management</h1>
                  <p className="text-xs text-muted-foreground">{filteredAudits.length} audits</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1.5" /> Export
              </Button>
              <Button size="sm" onClick={() => setShowNewDialog(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> Schedule Audit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Audits</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-secondary-foreground dark:text-violet-400">{stats.scheduled}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-secondary-foreground dark:text-secondary-foreground">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary dark:text-primary">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-accent-foreground dark:text-accent-foreground">{stats.avgScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-destructive dark:text-destructive">{stats.openFindings}</p>
              <p className="text-xs text-muted-foreground">Open Findings</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audits..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filterSite} onValueChange={setFilterSite}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}

              <div className="ml-auto flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode('list')}
                >
                  <ListChecks className="h-4 w-4 mr-1" /> List
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarDays className="h-4 w-4 mr-1" /> Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-28">ID</TableHead>
                        <TableHead>Audit</TableHead>
                        <TableHead className="w-28">Type</TableHead>
                        <TableHead className="w-24">Site</TableHead>
                        <TableHead className="w-28">Date</TableHead>
                        <TableHead className="w-28">Status</TableHead>
                        <TableHead className="w-20">Score</TableHead>
                        <TableHead className="w-24">Findings</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAudits.map((audit) => (
                        <TableRow
                          key={audit.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleOpenDetail(audit)}
                        >
                          <TableCell className="font-mono text-xs">{audit.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{audit.name}</p>
                              <p className="text-xs text-muted-foreground">{audit.department} · {audit.leadAuditor}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('text-[10px]', getTypeClass(audit.type))}>
                              {audit.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{audit.site}</TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(audit.scheduledDate), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('text-[10px]', getStatusClass(audit.status))}>
                              {audit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {audit.score ? (
                              <span className={cn('font-semibold', getScoreColor(audit.score))}>
                                {audit.score}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {audit.findings.length > 0 ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">{audit.findings.length}</span>
                                {audit.findings.some((f) => f.category === 'Major NC' && f.status !== 'Closed') && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDetail(audit); }}>
                                  <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success('Edit mode'); }}>
                                  <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success('Report generated!'); }}>
                                  <FileText className="h-3.5 w-3.5 mr-2" /> Generate Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredAudits.length === 0 && (
                    <div className="text-center py-12">
                      <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No audits found</p>
                      <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {format(currentMonth, 'MMMM yyyy')}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2" />
                    ))}
                    {calendarDays.map((day) => {
                      const dayAudits = getAuditsForDay(day);
                      return (
                        <div
                          key={day.toISOString()}
                          className={cn(
                            'min-h-[80px] p-1 border rounded-lg',
                            isToday(day) && 'bg-secondary/50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
                            !isSameMonth(day, currentMonth) && 'opacity-50'
                          )}
                        >
                          <div className={cn(
                            'text-xs font-medium mb-1',
                            isToday(day) && 'text-secondary-foreground dark:text-violet-400'
                          )}>
                            {format(day, 'd')}
                          </div>
                          <div className="space-y-0.5">
                            {dayAudits.slice(0, 2).map((audit) => (
                              <div
                                key={audit.id}
                                className={cn(
                                  'text-[10px] px-1 py-0.5 rounded truncate cursor-pointer',
                                  getStatusClass(audit.status)
                                )}
                                onClick={() => handleOpenDetail(audit)}
                              >
                                {audit.name}
                              </div>
                            ))}
                            {dayAudits.length > 2 && (
                              <div className="text-[10px] text-muted-foreground px-1">
                                +{dayAudits.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-full sm:max-w-xl p-0">
          {selectedAudit && (
            <>
              <div className={cn(
                'h-20 relative',
                selectedAudit.status === 'Completed' && 'bg-gradient-to-r from-primary/50 to-emerald-600',
                selectedAudit.status === 'In Progress' && 'bg-gradient-to-r from-blue-500 to-blue-600',
                selectedAudit.status === 'Scheduled' && 'bg-gradient-to-r from-violet-500 to-violet-600',
                selectedAudit.status === 'Cancelled' && 'bg-gradient-to-r from-zinc-500 to-zinc-600'
              )}>
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {selectedAudit.type}
                  </Badge>
                  {selectedAudit.standard && (
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {selectedAudit.standard}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setShowDetailSheet(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {selectedAudit.score && (
                  <div className="absolute bottom-3 right-4 text-right">
                    <p className="text-xs text-white/70">Score</p>
                    <p className="text-2xl font-bold text-white">{selectedAudit.score}%</p>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{selectedAudit.id}</span>
                  <Badge className={cn('text-[10px]', getStatusClass(selectedAudit.status))}>
                    {selectedAudit.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold mb-4">{selectedAudit.name}</h2>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                    <TabsTrigger value="findings" className="flex-1">Findings ({selectedAudit.findings.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Scope</p>
                          <p className="text-sm">{selectedAudit.scope}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Department</p>
                            <p className="text-sm font-medium">{selectedAudit.department}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Site</p>
                            <p className="text-sm font-medium">{selectedAudit.site}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Lead Auditor</p>
                            <p className="text-sm font-medium">{selectedAudit.leadAuditor}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Team</p>
                            <p className="text-sm font-medium">{selectedAudit.team.join(', ')}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Scheduled Date</p>
                            <p className="text-sm font-medium">{format(new Date(selectedAudit.scheduledDate), 'MMM d, yyyy')}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Completed Date</p>
                            <p className="text-sm font-medium">
                              {selectedAudit.completedDate ? format(new Date(selectedAudit.completedDate), 'MMM d, yyyy') : '—'}
                            </p>
                          </div>
                        </div>

                        {selectedAudit.score && (
                          <div className="p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">Audit Score</p>
                              <span className={cn('text-xl font-bold', getScoreColor(selectedAudit.score))}>
                                {selectedAudit.score}%
                              </span>
                            </div>
                            <Progress value={selectedAudit.score} className="h-2" />
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="findings" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      {selectedAudit.findings.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="h-10 w-10 mx-auto text-primary mb-2" />
                          <p className="text-muted-foreground">No findings recorded</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Findings Summary */}
                          <div className="grid grid-cols-4 gap-2 mb-4">
                            {['Major NC', 'Minor NC', 'Observation', 'OFI'].map((cat) => {
                              const count = selectedAudit.findings.filter((f) => f.category === cat).length;
                              return (
                                <div key={cat} className="p-2 rounded border text-center">
                                  <p className="text-lg font-bold">{count}</p>
                                  <p className="text-[10px] text-muted-foreground">{cat}</p>
                                </div>
                              );
                            })}
                          </div>

                          {selectedAudit.findings.map((finding) => (
                            <div key={finding.id} className="p-3 rounded-lg border">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={cn('text-[10px]', getFindingCategoryClass(finding.category))}>
                                    {finding.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-[10px]">
                                    {finding.status}
                                  </Badge>
                                </div>
                                {finding.capaId && (
                                  <Badge variant="outline" className="text-[10px] gap-1">
                                    <Target className="h-2.5 w-2.5" /> {finding.capaId}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">{finding.description}</p>
                              {!finding.capaId && finding.status !== 'Closed' && (
                                <Button variant="link" size="sm" className="px-0 mt-2" onClick={() => toast.success('CAPA created!')}>
                                  <Plus className="h-3 w-3 mr-1" /> Create CAPA
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button className="flex-1" onClick={() => toast.success('Report generated!')}>
                    <FileText className="h-4 w-4 mr-1.5" /> Generate Report
                  </Button>
                  <Button variant="outline" onClick={() => toast.success('Edit mode')}>
                    <Edit2 className="h-4 w-4 mr-1.5" /> Edit
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New Audit Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Audit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Audit Name</Label>
              <Input id="name" placeholder="e.g., ISO 9001 Internal Audit Q2" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select defaultValue="Internal">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Site</Label>
                <Select defaultValue="PRAI">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select defaultValue="Production">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lead Auditor</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select auditor" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDITORS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scheduled Date</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label>Standard (Optional)</Label>
                <Input placeholder="e.g., ISO 9001:2015" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Scope</Label>
              <Input placeholder="Audit scope and objectives" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Audit scheduled!'); setShowNewDialog(false); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Schedule Audit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}