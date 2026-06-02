/**
 * QA Defects Tracking Page
 * Log, assign, and resolve quality issues
 */

import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Bug,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Users,
  Building2,
  MapPin,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  X,
  Eye,
  Edit2,
  Trash2,
  Target,
  Activity,
  FileText,
  Zap,
  Flame,
  MessageSquare,
  Paperclip,
  History,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// Types
interface Defect {
  id: string;
  title: string;
  description: string;
  type: 'Product' | 'Process' | 'Material' | 'Equipment' | 'Documentation';
  severity: 'Critical' | 'Major' | 'Minor';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  department: string;
  site: string;
  reportedBy: string;
  reportedDate: string;
  status: 'Open' | 'In Progress' | 'Pending Verification' | 'Resolved' | 'Closed';
  assignedTo: string;
  rootCause?: string;
  correctiveAction?: string;
  dueDate?: string;
  attachments: number;
  comments: number;
}

// Mock Data
const MOCK_DEFECTS: Defect[] = [
  { id: 'DEF-2026-042', title: 'Product viscosity out of spec - Batch 2026-0428', description: 'Viscosity reading of 2450 cP exceeds upper spec limit of 2200 cP. Sample from production line A.', type: 'Product', severity: 'Major', priority: 'High', department: 'Production', site: 'PRAI', reportedBy: 'Ali Hassan', reportedDate: '2026-05-01', status: 'Open', assignedTo: 'Raj Kumar', dueDate: '2026-05-08', attachments: 2, comments: 3 },
  { id: 'DEF-2026-041', title: 'Temperature deviation in reactor R-201', description: 'Temperature spiked to 185°C, exceeding safe operating limit of 180°C. Duration: 12 minutes.', type: 'Process', severity: 'Critical', priority: 'Critical', department: 'Operations', site: 'PRAI', reportedBy: 'Chen Wei', reportedDate: '2026-04-30', status: 'In Progress', assignedTo: 'Ahmad Razak', rootCause: 'Cooling system malfunction', dueDate: '2026-05-05', attachments: 5, comments: 8 },
  { id: 'DEF-2026-040', title: 'Packaging seal integrity failure - Line 3', description: 'Multiple packages showing weak seals. Leak rate exceeding acceptable limits.', type: 'Product', severity: 'Major', priority: 'Medium', department: 'Packaging', site: 'JHR', reportedBy: 'Sarah Lee', reportedDate: '2026-04-28', status: 'Pending Verification', assignedTo: 'Lim Mei', correctiveAction: 'Seal bar temperature adjusted', dueDate: '2026-05-03', attachments: 3, comments: 5 },
  { id: 'DEF-2026-039', title: 'SOP not followed - line changeover procedure', description: 'Operator skipped verification step during product changeover. No contamination detected.', type: 'Process', severity: 'Minor', priority: 'Low', department: 'Production', site: 'PRAI', reportedBy: 'Raj Kumar', reportedDate: '2026-04-25', status: 'Resolved', assignedTo: 'Ali Hassan', correctiveAction: 'Re-training completed', attachments: 1, comments: 2 },
  { id: 'DEF-2026-038', title: 'Raw material contamination - Palm Oil Batch PO-2026-089', description: 'Foreign particle contamination detected during incoming QC. Batch quarantined.', type: 'Material', severity: 'Critical', priority: 'High', department: 'Warehouse', site: 'JHR', reportedBy: 'Lim Mei', reportedDate: '2026-04-22', status: 'Closed', assignedTo: 'Chen Wei', rootCause: 'Supplier handling issue', correctiveAction: 'Supplier CAPA issued, additional inspection added', attachments: 4, comments: 12 },
  { id: 'DEF-2026-037', title: 'Equipment calibration drift - pH meter PH-005', description: 'pH readings showing consistent +0.3 deviation from reference standards.', type: 'Equipment', severity: 'Major', priority: 'Medium', department: 'QC', site: 'PRAI', reportedBy: 'Ahmad Razak', reportedDate: '2026-04-20', status: 'Closed', assignedTo: 'Sarah Lee', correctiveAction: 'Meter recalibrated and certified', attachments: 2, comments: 4 },
  { id: 'DEF-2026-036', title: 'Missing batch record documentation', description: 'Production batch record for B-2026-0415 incomplete. Missing operator signatures.', type: 'Documentation', severity: 'Minor', priority: 'Low', department: 'Production', site: 'JHR', reportedBy: 'Sarah Lee', reportedDate: '2026-04-18', status: 'Closed', assignedTo: 'Ali Hassan', correctiveAction: 'Documentation completed retrospectively', attachments: 1, comments: 3 },
  { id: 'DEF-2026-035', title: 'Color variation in final product - FP-2026-0412', description: 'Visual inspection shows noticeable yellowing compared to standard. Delta E = 3.2', type: 'Product', severity: 'Major', priority: 'High', department: 'Production', site: 'PRAI', reportedBy: 'Chen Wei', reportedDate: '2026-04-15', status: 'In Progress', assignedTo: 'Raj Kumar', rootCause: 'Raw material supplier change', dueDate: '2026-05-10', attachments: 6, comments: 9 },
];

const DEPARTMENTS = ['Production', 'Operations', 'QC', 'QA', 'Packaging', 'Warehouse', 'Maintenance', 'HSE'];
const SITES = ['PRAI', 'JHR'];
const TYPES = ['Product', 'Process', 'Material', 'Equipment', 'Documentation'];
const SEVERITIES = ['Critical', 'Major', 'Minor'];
const STATUSES = ['Open', 'In Progress', 'Pending Verification', 'Resolved', 'Closed'];
const ASSIGNEES = ['Ahmad Razak', 'Sarah Lee', 'Chen Wei', 'Raj Kumar', 'Lim Mei', 'Ali Hassan'];

export default function DefectsPage() {
  const [searchParams] = useSearchParams();
  const initialSeverity = searchParams.get('severity') || 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState(initialSeverity);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSite, setFilterSite] = useState('all');
  const [sortField, setSortField] = useState<'reportedDate' | 'severity' | 'priority'>('reportedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Filter and sort defects
  const filteredDefects = useMemo(() => {
    return MOCK_DEFECTS
      .filter((d) => {
        const matchesSearch = !searchQuery || 
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = filterSeverity === 'all' || d.severity === filterSeverity;
        const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
        const matchesType = filterType === 'all' || d.type === filterType;
        const matchesSite = filterSite === 'all' || d.site === filterSite;
        return matchesSearch && matchesSeverity && matchesStatus && matchesType && matchesSite;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'reportedDate') {
          comparison = new Date(a.reportedDate).getTime() - new Date(b.reportedDate).getTime();
        } else if (sortField === 'severity') {
          const order = { Critical: 3, Major: 2, Minor: 1 };
          comparison = order[a.severity] - order[b.severity];
        } else if (sortField === 'priority') {
          const order = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          comparison = order[a.priority] - order[b.priority];
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [searchQuery, filterSeverity, filterStatus, filterType, filterSite, sortField, sortOrder]);

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_DEFECTS.length,
    open: MOCK_DEFECTS.filter((d) => d.status === 'Open').length,
    inProgress: MOCK_DEFECTS.filter((d) => d.status === 'In Progress').length,
    critical: MOCK_DEFECTS.filter((d) => d.severity === 'Critical' && d.status !== 'Closed').length,
    overdue: MOCK_DEFECTS.filter((d) => d.dueDate && new Date(d.dueDate) < new Date() && d.status !== 'Closed' && d.status !== 'Resolved').length,
  }), []);

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive border-destructive/20 dark:border-destructive';
      case 'Major': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground border-accent dark:border-accent';
      case 'Minor': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground border-secondary dark:border-secondary';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      case 'In Progress': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Pending Verification': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Resolved': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Closed': return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <Flame className="h-3.5 w-3.5 text-destructive" />;
      case 'High': return <Zap className="h-3.5 w-3.5 text-accent-foreground" />;
      case 'Medium': return <AlertCircle className="h-3.5 w-3.5 text-secondary-foreground" />;
      default: return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Product': return <Bug className="h-4 w-4" />;
      case 'Process': return <Activity className="h-4 w-4" />;
      case 'Material': return <FileText className="h-4 w-4" />;
      case 'Equipment': return <Target className="h-4 w-4" />;
      case 'Documentation': return <FileText className="h-4 w-4" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  const handleOpenDetail = (defect: Defect) => {
    setSelectedDefect(defect);
    setShowDetailSheet(true);
    setActiveTab('details');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterSeverity('all');
    setFilterStatus('all');
    setFilterType('all');
    setFilterSite('all');
  };

  const hasActiveFilters = searchQuery || filterSeverity !== 'all' || filterStatus !== 'all' || filterType !== 'all' || filterSite !== 'all';

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
                <div className="h-9 w-9 rounded-lg bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                  <Bug className="h-5 w-5 text-destructive dark:text-destructive" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Defect Tracking</h1>
                  <p className="text-xs text-muted-foreground">{filteredDefects.length} issues</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success('Data refreshed')}>
                <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1.5" /> Export
              </Button>
              <Button size="sm" onClick={() => setShowNewDialog(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> New Defect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('all')}>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-red-500" onClick={() => setFilterStatus('Open')}>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-destructive dark:text-destructive">{stats.open}</p>
              <p className="text-xs text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500" onClick={() => setFilterStatus('In Progress')}>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-secondary-foreground dark:text-secondary-foreground">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-amber-500" onClick={() => setFilterSeverity('Critical')}>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-accent-foreground dark:text-accent-foreground">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-violet-500">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-secondary-foreground dark:text-violet-400">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
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
                  placeholder="Search defects..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  {SEVERITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
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

              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {sortOrder === 'desc' ? <SortDesc className="h-4 w-4 mr-1" /> : <SortAsc className="h-4 w-4 mr-1" />}
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSortField('reportedDate'); setSortOrder('desc'); }}>
                      Date (Newest)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortField('reportedDate'); setSortOrder('asc'); }}>
                      Date (Oldest)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setSortField('severity'); setSortOrder('desc'); }}>
                      Severity (High → Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortField('priority'); setSortOrder('desc'); }}>
                      Priority (High → Low)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode('table')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode('cards')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
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
                        <TableHead>Issue</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-24">Severity</TableHead>
                        <TableHead className="w-32">Status</TableHead>
                        <TableHead className="w-28">Assigned</TableHead>
                        <TableHead className="w-24">Date</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDefects.map((defect) => (
                        <TableRow
                          key={defect.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleOpenDetail(defect)}
                        >
                          <TableCell className="font-mono text-xs">{defect.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(defect.priority)}
                              <span className="font-medium truncate max-w-[300px]">{defect.title}</span>
                              {defect.attachments > 0 && (
                                <Badge variant="outline" className="text-[10px] gap-0.5">
                                  <Paperclip className="h-2.5 w-2.5" /> {defect.attachments}
                                </Badge>
                              )}
                              {defect.comments > 0 && (
                                <Badge variant="outline" className="text-[10px] gap-0.5">
                                  <MessageSquare className="h-2.5 w-2.5" /> {defect.comments}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              {getTypeIcon(defect.type)}
                              <span className="text-xs">{defect.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('text-[10px]', getSeverityClass(defect.severity))}>
                              {defect.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('text-[10px]', getStatusClass(defect.status))}>
                              {defect.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{defect.assignedTo}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(defect.reportedDate), 'MMM d')}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDetail(defect); }}>
                                  <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success('Edit mode'); }}>
                                  <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success('CAPA created!'); }}>
                                  <Target className="h-3.5 w-3.5 mr-2" /> Create CAPA
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredDefects.length === 0 && (
                    <div className="text-center py-12">
                      <Bug className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No defects found</p>
                      <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredDefects.map((defect, idx) => (
                <motion.div
                  key={defect.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, ease: "easeOut" as const }}
                >
                  <Card
                    className={cn(
                      'cursor-pointer hover:shadow-lg transition-all border-l-4',
                      defect.severity === 'Critical' && 'border-l-red-500',
                      defect.severity === 'Major' && 'border-l-amber-500',
                      defect.severity === 'Minor' && 'border-l-blue-500'
                    )}
                    onClick={() => handleOpenDetail(defect)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(defect.priority)}
                          <span className="text-xs font-mono text-muted-foreground">{defect.id}</span>
                        </div>
                        <Badge className={cn('text-[10px]', getStatusClass(defect.status))}>
                          {defect.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-sm line-clamp-2 mb-2">{defect.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={cn('text-[10px]', getSeverityClass(defect.severity))}>
                          {defect.severity}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{defect.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {defect.site}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {defect.assignedTo.split(' ')[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {format(new Date(defect.reportedDate), 'MMM d')}
                        </span>
                      </div>
                      {defect.dueDate && new Date(defect.dueDate) < new Date() && defect.status !== 'Closed' && defect.status !== 'Resolved' && (
                        <div className="mt-2 p-1.5 rounded bg-destructive/5 dark:bg-destructive/30 text-xs text-destructive dark:text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Overdue
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {filteredDefects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Bug className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No defects found</p>
                  <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-full sm:max-w-xl p-0">
          {selectedDefect && (
            <>
              <div className={cn(
                'h-20 relative',
                selectedDefect.severity === 'Critical' && 'bg-gradient-to-r from-red-500 to-red-600',
                selectedDefect.severity === 'Major' && 'bg-gradient-to-r from-amber-500 to-amber-600',
                selectedDefect.severity === 'Minor' && 'bg-gradient-to-r from-blue-500 to-blue-600'
              )}>
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {selectedDefect.severity}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {selectedDefect.type}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setShowDetailSheet(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{selectedDefect.id}</span>
                  <Badge className={cn('text-[10px]', getStatusClass(selectedDefect.status))}>
                    {selectedDefect.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold mb-4">{selectedDefect.title}</h2>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                    <TabsTrigger value="files" className="flex-1">Files ({selectedDefect.attachments})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{selectedDefect.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Department</p>
                            <p className="text-sm font-medium">{selectedDefect.department}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Site</p>
                            <p className="text-sm font-medium">{selectedDefect.site}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Reported By</p>
                            <p className="text-sm font-medium">{selectedDefect.reportedBy}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Assigned To</p>
                            <p className="text-sm font-medium">{selectedDefect.assignedTo}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Reported Date</p>
                            <p className="text-sm font-medium">{format(new Date(selectedDefect.reportedDate), 'MMM d, yyyy')}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-[10px] text-muted-foreground">Due Date</p>
                            <p className={cn('text-sm font-medium', selectedDefect.dueDate && new Date(selectedDefect.dueDate) < new Date() && selectedDefect.status !== 'Closed' && 'text-destructive')}>
                              {selectedDefect.dueDate ? format(new Date(selectedDefect.dueDate), 'MMM d, yyyy') : '—'}
                            </p>
                          </div>
                        </div>

                        {selectedDefect.rootCause && (
                          <div className="p-3 rounded-lg border border-accent bg-accent/50 dark:border-accent dark:bg-accent/30">
                            <p className="text-xs text-accent-foreground dark:text-accent-foreground font-medium mb-1">Root Cause</p>
                            <p className="text-sm">{selectedDefect.rootCause}</p>
                          </div>
                        )}

                        {selectedDefect.correctiveAction && (
                          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 dark:border-primary dark:bg-primary/30">
                            <p className="text-xs text-primary dark:text-primary font-medium mb-1">Corrective Action</p>
                            <p className="text-sm">{selectedDefect.correctiveAction}</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      <div className="space-y-4">
                        {[
                          { action: 'Status changed to In Progress', user: selectedDefect.assignedTo, time: '2 hours ago' },
                          { action: 'Assigned to ' + selectedDefect.assignedTo, user: 'System', time: '1 day ago' },
                          { action: 'Added attachment: investigation_report.pdf', user: selectedDefect.reportedBy, time: '1 day ago' },
                          { action: 'Defect reported', user: selectedDefect.reportedBy, time: formatDistanceToNow(new Date(selectedDefect.reportedDate), { addSuffix: true }) },
                        ].map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                              {item.user.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm">{item.action}</p>
                              <p className="text-xs text-muted-foreground">{item.user} · {item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="files" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      <div className="space-y-2">
                        {[
                          { name: 'investigation_report.pdf', size: '2.4 MB', date: '2 days ago' },
                          { name: 'photo_evidence_1.jpg', size: '1.8 MB', date: '2 days ago' },
                        ].map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size} · {file.date}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button className="flex-1" onClick={() => toast.success('Status updated!')}>
                    Update Status
                  </Button>
                  <Button variant="outline" onClick={() => { toast.success('CAPA created!'); setShowDetailSheet(false); }}>
                    <Target className="h-4 w-4 mr-1.5" /> Create CAPA
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New Defect Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report New Defect</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Brief description of the issue" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Detailed description..." className="mt-1" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select defaultValue="Product">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severity</Label>
                <Select defaultValue="Major">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                <Label>Assign To</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select defaultValue="High">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Defect reported successfully!'); setShowNewDialog(false); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Create Defect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}