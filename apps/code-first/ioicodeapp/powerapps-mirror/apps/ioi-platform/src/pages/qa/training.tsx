/**
 * QA Training Records Page
 * Compliance training management and tracking
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  GraduationCap,
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
  ChevronRight,
  AlertCircle,
  MoreHorizontal,
  FileText,
  BookOpen,
  Award,
  UserCheck,
  UserX,
  RefreshCw,
  Mail,
  Bell,
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
import { format, isBefore, addDays } from 'date-fns';
import { toast } from 'sonner';

// Types
interface TrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  site: string;
  documentId: string;
  documentNumber: string;
  documentTitle: string;
  trainingType: 'Initial' | 'Refresher' | 'Update';
  status: 'Pending' | 'Completed' | 'Overdue' | 'Scheduled';
  scheduledDate: string;
  completionDate?: string;
  dueDate: string;
  trainer?: string;
  score?: number;
  passed?: boolean;
  certificationExpiry?: string;
}

interface TrainingMatrix {
  documentId: string;
  documentNumber: string;
  documentTitle: string;
  department: string;
  totalAssigned: number;
  completed: number;
  pending: number;
  overdue: number;
  complianceRate: number;
}

// Mock Data
const MOCK_TRAINING: TrainingRecord[] = [
  {
    id: 'TR-2026-001',
    employeeId: 'EMP-001',
    employeeName: 'Ahmad Razak',
    department: 'Operations',
    site: 'PRAI',
    documentId: 'DOC-001',
    documentNumber: 'SOP-QA-001',
    documentTitle: 'Incoming Material Inspection',
    trainingType: 'Refresher',
    status: 'Pending',
    scheduledDate: '2026-05-10',
    dueDate: '2026-05-15',
  },
  {
    id: 'TR-2026-002',
    employeeId: 'EMP-002',
    employeeName: 'Sarah Lee',
    department: 'QA',
    site: 'PRAI',
    documentId: 'DOC-002',
    documentNumber: 'SOP-PROD-012',
    documentTitle: 'Reactor Operation Procedure',
    trainingType: 'Initial',
    status: 'Completed',
    scheduledDate: '2026-04-20',
    completionDate: '2026-04-20',
    dueDate: '2026-04-25',
    trainer: 'Chen Wei',
    score: 95,
    passed: true,
  },
  {
    id: 'TR-2026-003',
    employeeId: 'EMP-003',
    employeeName: 'Chen Wei',
    department: 'Production',
    site: 'PRAI',
    documentId: 'DOC-003',
    documentNumber: 'WI-QC-005',
    documentTitle: 'Viscosity Testing Method',
    trainingType: 'Update',
    status: 'Overdue',
    scheduledDate: '2026-04-28',
    dueDate: '2026-04-30',
  },
  {
    id: 'TR-2026-004',
    employeeId: 'EMP-004',
    employeeName: 'Raj Kumar',
    department: 'Procurement',
    site: 'JHR',
    documentId: 'DOC-004',
    documentNumber: 'POL-QA-002',
    documentTitle: 'Non-Conformance Management',
    trainingType: 'Initial',
    status: 'Scheduled',
    scheduledDate: '2026-05-12',
    dueDate: '2026-05-20',
  },
  {
    id: 'TR-2026-005',
    employeeId: 'EMP-005',
    employeeName: 'Lim Mei',
    department: 'Packaging',
    site: 'JHR',
    documentId: 'DOC-001',
    documentNumber: 'SOP-QA-001',
    documentTitle: 'Incoming Material Inspection',
    trainingType: 'Refresher',
    status: 'Completed',
    scheduledDate: '2026-04-15',
    completionDate: '2026-04-15',
    dueDate: '2026-04-20',
    trainer: 'Ahmad Razak',
    score: 88,
    passed: true,
  },
  {
    id: 'TR-2026-006',
    employeeId: 'EMP-006',
    employeeName: 'Ali Hassan',
    department: 'Production',
    site: 'PRAI',
    documentId: 'DOC-002',
    documentNumber: 'SOP-PROD-012',
    documentTitle: 'Reactor Operation Procedure',
    trainingType: 'Refresher',
    status: 'Pending',
    scheduledDate: '2026-05-08',
    dueDate: '2026-05-10',
  },
  {
    id: 'TR-2026-007',
    employeeId: 'EMP-007',
    employeeName: 'Wong Mei Ling',
    department: 'QC',
    site: 'PRAI',
    documentId: 'DOC-003',
    documentNumber: 'WI-QC-005',
    documentTitle: 'Viscosity Testing Method',
    trainingType: 'Initial',
    status: 'Completed',
    scheduledDate: '2026-04-25',
    completionDate: '2026-04-25',
    dueDate: '2026-04-28',
    trainer: 'Sarah Lee',
    score: 92,
    passed: true,
  },
  {
    id: 'TR-2026-008',
    employeeId: 'EMP-001',
    employeeName: 'Ahmad Razak',
    department: 'Operations',
    site: 'PRAI',
    documentId: 'DOC-005',
    documentNumber: 'SOP-HSE-003',
    documentTitle: 'Emergency Response Procedure',
    trainingType: 'Update',
    status: 'Overdue',
    scheduledDate: '2026-04-22',
    dueDate: '2026-04-25',
  },
];

const MOCK_MATRIX: TrainingMatrix[] = [
  {
    documentId: 'DOC-001',
    documentNumber: 'SOP-QA-001',
    documentTitle: 'Incoming Material Inspection',
    department: 'QA',
    totalAssigned: 15,
    completed: 12,
    pending: 2,
    overdue: 1,
    complianceRate: 80,
  },
  {
    documentId: 'DOC-002',
    documentNumber: 'SOP-PROD-012',
    documentTitle: 'Reactor Operation Procedure',
    department: 'Production',
    totalAssigned: 25,
    completed: 22,
    pending: 3,
    overdue: 0,
    complianceRate: 88,
  },
  {
    documentId: 'DOC-003',
    documentNumber: 'WI-QC-005',
    documentTitle: 'Viscosity Testing Method',
    department: 'QC',
    totalAssigned: 8,
    completed: 5,
    pending: 1,
    overdue: 2,
    complianceRate: 62.5,
  },
  {
    documentId: 'DOC-004',
    documentNumber: 'POL-QA-002',
    documentTitle: 'Non-Conformance Management',
    department: 'QA',
    totalAssigned: 30,
    completed: 28,
    pending: 2,
    overdue: 0,
    complianceRate: 93.3,
  },
  {
    documentId: 'DOC-005',
    documentNumber: 'SOP-HSE-003',
    documentTitle: 'Emergency Response Procedure',
    department: 'HSE',
    totalAssigned: 50,
    completed: 42,
    pending: 5,
    overdue: 3,
    complianceRate: 84,
  },
];

const DEPARTMENTS = ['Operations', 'Production', 'QA', 'QC', 'Packaging', 'Warehouse', 'Maintenance', 'Procurement', 'HSE'];
const SITES = ['PRAI', 'JHR'];

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterSite, setFilterSite] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<TrainingRecord | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [activeView, setActiveView] = useState<'records' | 'matrix'>('records');

  // Filter records
  const filteredRecords = useMemo(() => {
    return MOCK_TRAINING.filter((r: TrainingRecord) => {
      const matchesSearch = !searchQuery ||
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchesDepartment = filterDepartment === 'all' || r.department === filterDepartment;
      const matchesSite = filterSite === 'all' || r.site === filterSite;
      return matchesSearch && matchesStatus && matchesDepartment && matchesSite;
    });
  }, [searchQuery, filterStatus, filterDepartment, filterSite]);

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_TRAINING.length,
    completed: MOCK_TRAINING.filter((r: TrainingRecord) => r.status === 'Completed').length,
    pending: MOCK_TRAINING.filter((r: TrainingRecord) => r.status === 'Pending' || r.status === 'Scheduled').length,
    overdue: MOCK_TRAINING.filter((r: TrainingRecord) => r.status === 'Overdue').length,
    complianceRate: Math.round(
      (MOCK_TRAINING.filter((r: TrainingRecord) => r.status === 'Completed').length / MOCK_TRAINING.length) * 100
    ),
    avgScore: Math.round(
      MOCK_TRAINING.filter((r: TrainingRecord) => r.score).reduce((sum: number, r: TrainingRecord) => sum + (r.score || 0), 0) /
      MOCK_TRAINING.filter((r: TrainingRecord) => r.score).length
    ),
  }), []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Pending': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Scheduled': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Overdue': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getTrainingTypeClass = (type: string) => {
    switch (type) {
      case 'Initial': return 'bg-secondary text-secondary-foreground dark:bg-violet-900/30 dark:text-violet-400';
      case 'Refresher': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Update': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-primary dark:text-primary';
    if (rate >= 70) return 'text-accent-foreground dark:text-accent-foreground';
    return 'text-destructive dark:text-destructive';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'Pending': return <Clock className="h-4 w-4 text-accent-foreground" />;
      case 'Scheduled': return <Calendar className="h-4 w-4 text-secondary-foreground" />;
      case 'Overdue': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

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
                <div className="h-9 w-9 rounded-lg bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Training Records</h1>
                  <p className="text-xs text-muted-foreground">Compliance Training Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => toast.success('Reminders sent!')}>
                <Bell className="h-4 w-4 mr-1.5" /> Send Reminders
              </Button>
              <Button onClick={() => setShowAssignDialog(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> Assign Training
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <UserCheck className="h-8 w-8 text-primary dark:text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-accent-foreground dark:text-accent-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                </div>
                <UserX className="h-8 w-8 text-destructive dark:text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Compliance</p>
                  <p className="text-2xl font-bold">{stats.complianceRate}%</p>
                </div>
                <Award className="h-8 w-8 text-secondary-foreground dark:text-secondary-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">{stats.avgScore}%</p>
                </div>
                <BookOpen className="h-8 w-8 text-violet-200 dark:text-violet-800" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Alert */}
        {stats.overdue > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-destructive/5 dark:bg-destructive/30 border border-destructive/20 dark:border-destructive"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive dark:text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive dark:text-destructive">
                    {stats.overdue} Overdue Training Assignment{stats.overdue > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-destructive dark:text-destructive">Immediate action required</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10 dark:border-destructive dark:text-destructive"
                onClick={() => setFilterStatus('Overdue')}
              >
                View Overdue
              </Button>
            </div>
          </motion.div>
        )}

        {/* View Toggle & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Tabs value={activeView} onValueChange={(v: string) => setActiveView(v as 'records' | 'matrix')}>
                <TabsList>
                  <TabsTrigger value="records">Training Records</TabsTrigger>
                  <TabsTrigger value="matrix">Training Matrix</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex-1" />

              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
                  {DEPARTMENTS.map((dept: string) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSite} onValueChange={setFilterSite}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {SITES.map((site: string) => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content based on active view */}
        {activeView === 'records' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Due Date</TableHead>
                    <TableHead className="w-[80px]">Score</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record: TrainingRecord) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => { setSelectedRecord(record); setShowDetailSheet(true); }}
                    >
                      <TableCell className="font-mono text-xs">{record.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{record.employeeName}</p>
                          <p className="text-xs text-muted-foreground">{record.department} • {record.site}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{record.documentTitle}</p>
                          <p className="text-xs text-muted-foreground font-mono">{record.documentNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-[10px]', getTrainingTypeClass(record.trainingType))}>
                          {record.trainingType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(record.status)}
                          <Badge className={cn('text-[10px]', getStatusClass(record.status))}>
                            {record.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(record.dueDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.score ? (
                          <span className={record.passed ? 'text-primary' : 'text-destructive'}>
                            {record.score}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedRecord(record); setShowDetailSheet(true); }}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" /> Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.success('Marked as complete')}>
                              <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Complete
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Training Matrix by Document</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead className="w-[100px]">Dept</TableHead>
                    <TableHead className="w-[80px] text-center">Total</TableHead>
                    <TableHead className="w-[80px] text-center">Done</TableHead>
                    <TableHead className="w-[80px] text-center">Pending</TableHead>
                    <TableHead className="w-[80px] text-center">Overdue</TableHead>
                    <TableHead className="w-[150px]">Compliance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MATRIX.map((item: TrainingMatrix) => (
                    <TableRow key={item.documentId}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{item.documentTitle}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.documentNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.department}</TableCell>
                      <TableCell className="text-center text-sm font-medium">{item.totalAssigned}</TableCell>
                      <TableCell className="text-center text-sm text-primary">{item.completed}</TableCell>
                      <TableCell className="text-center text-sm text-accent-foreground">{item.pending}</TableCell>
                      <TableCell className="text-center text-sm text-destructive">{item.overdue}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.complianceRate} className="h-2 flex-1" />
                          <span className={cn('text-xs font-medium w-10', getComplianceColor(item.complianceRate))}>
                            {item.complianceRate.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-full sm:max-w-md p-0">
          {selectedRecord && (
            <ScrollArea className="h-full">
              <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setShowDetailSheet(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute top-2 left-4 flex gap-2">
                  <Badge className={cn('text-[10px]', getTrainingTypeClass(selectedRecord.trainingType))}>
                    {selectedRecord.trainingType}
                  </Badge>
                  <Badge className={cn('text-[10px]', getStatusClass(selectedRecord.status))}>
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{selectedRecord.id}</p>
                  <h2 className="text-lg font-semibold mt-1">{selectedRecord.employeeName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedRecord.department} • {selectedRecord.site}</p>
                </div>

                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{selectedRecord.documentTitle}</p>
                        <p className="text-xs text-muted-foreground font-mono">{selectedRecord.documentNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                      <Calendar className="h-3.5 w-3.5" /> Scheduled
                    </span>
                    <span className="text-sm">{format(new Date(selectedRecord.scheduledDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                      <Clock className="h-3.5 w-3.5" /> Due Date
                    </span>
                    <span className="text-sm">{format(new Date(selectedRecord.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                  {selectedRecord.completionDate && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                      </span>
                      <span className="text-sm">{format(new Date(selectedRecord.completionDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {selectedRecord.trainer && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                        <Users className="h-3.5 w-3.5" /> Trainer
                      </span>
                      <span className="text-sm">{selectedRecord.trainer}</span>
                    </div>
                  )}
                  {selectedRecord.score !== undefined && (
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                        <Award className="h-3.5 w-3.5" /> Score
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-medium', selectedRecord.passed ? 'text-primary' : 'text-destructive')}>
                          {selectedRecord.score}%
                        </span>
                        {selectedRecord.passed !== undefined && (
                          <Badge className={selectedRecord.passed ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}>
                            {selectedRecord.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {selectedRecord.status !== 'Completed' ? (
                    <>
                      <Button className="flex-1" onClick={() => toast.success('Marked as complete')}>
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark Complete
                      </Button>
                      <Button variant="outline" onClick={() => toast.success('Reminder sent')}>
                        <Mail className="h-4 w-4 mr-1.5" /> Remind
                      </Button>
                    </>
                  ) : (
                    <Button className="flex-1" variant="outline">
                      <Download className="h-4 w-4 mr-1.5" /> Download Certificate
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Assign Training Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Training</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select document" /></SelectTrigger>
                <SelectContent>
                  {MOCK_MATRIX.map((doc: TrainingMatrix) => (
                    <SelectItem key={doc.documentId} value={doc.documentId}>
                      {doc.documentNumber} - {doc.documentTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Training Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initial">Initial</SelectItem>
                    <SelectItem value="Refresher">Refresher</SelectItem>
                    <SelectItem value="Update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select dept" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept: string) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Training assigned!'); setShowAssignDialog(false); }}>
              Assign Training
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}