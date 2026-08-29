/**
 * HR Training Database Page
 * Covers: TE (Training Entry), TM (Training Matrix), TR (Training Records)
 * Training Applications, OJT Tracking, Training Bond Management
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  FileText,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  Mail,
  Building2,
  User,
  RefreshCw,
  X,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';

// Types
interface TrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  trainingType: 'Internal' | 'External' | 'OJT' | 'E-Learning';
  trainingTitle: string;
  provider: string;
  startDate: string;
  endDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Pending Approval';
  score?: number;
  certificate?: boolean;
  bondRequired?: boolean;
  bondEndDate?: string;
  cost?: number;
  remarks?: string;
}

interface TrainingMatrix {
  competency: string;
  required: boolean;
  completed: boolean;
  dueDate?: string;
  lastCompleted?: string;
}

// Mock Data
const MOCK_TRAINING_RECORDS: TrainingRecord[] = [
  { id: 'TR001', employeeId: 'E001', employeeName: 'Ahmad Razak', department: 'Operations', trainingType: 'External', trainingTitle: 'HACCP Level 2 Certification', provider: 'SIRIM', startDate: '2024-04-15', endDate: '2024-04-17', status: 'Completed', score: 92, certificate: true, bondRequired: true, bondEndDate: '2026-04-17', cost: 2500 },
  { id: 'TR002', employeeId: 'E002', employeeName: 'Siti Aminah', department: 'QA', trainingType: 'Internal', trainingTitle: 'ISO 9001 Awareness', provider: 'Internal QMS Team', startDate: '2024-04-20', endDate: '2024-04-20', status: 'Completed', score: 88, certificate: false },
  { id: 'TR003', employeeId: 'E003', employeeName: 'Rajesh Kumar', department: 'R&D', trainingType: 'External', trainingTitle: 'GMP Advanced Course', provider: 'Malaysian Pharmaceutical Society', startDate: '2024-05-10', endDate: '2024-05-12', status: 'Scheduled', bondRequired: true, cost: 3500 },
  { id: 'TR004', employeeId: 'E004', employeeName: 'Lim Wei Ming', department: 'Production', trainingType: 'OJT', trainingTitle: 'Chemical Handling Procedures', provider: 'Safety Dept', startDate: '2024-04-01', endDate: '2024-04-30', status: 'In Progress' },
  { id: 'TR005', employeeId: 'E005', employeeName: 'Nurul Huda', department: 'HR', trainingType: 'E-Learning', trainingTitle: 'Data Privacy & PDPA', provider: 'LinkedIn Learning', startDate: '2024-04-05', endDate: '2024-04-05', status: 'Completed', score: 95, certificate: true },
  { id: 'TR006', employeeId: 'E006', employeeName: 'Tan Ah Kow', department: 'Maintenance', trainingType: 'External', trainingTitle: 'Electrical Safety Certification', provider: 'Suruhanjaya Tenaga', startDate: '2024-05-20', endDate: '2024-05-22', status: 'Pending Approval', bondRequired: true, cost: 1800 },
  { id: 'TR007', employeeId: 'E007', employeeName: 'Farah Idris', department: 'Finance', trainingType: 'Internal', trainingTitle: 'SAP Financial Reporting', provider: 'IT Dept', startDate: '2024-04-25', endDate: '2024-04-26', status: 'Completed', score: 90 },
  { id: 'TR008', employeeId: 'E008', employeeName: 'Muthu Selvam', department: 'Logistics', trainingType: 'External', trainingTitle: 'Forklift Operation License', provider: 'CIDB', startDate: '2024-03-15', endDate: '2024-03-16', status: 'Completed', score: 85, certificate: true },
];

const MOCK_MATRIX: TrainingMatrix[] = [
  { competency: 'Safety Induction', required: true, completed: true, lastCompleted: '2024-01-15' },
  { competency: 'Fire Safety', required: true, completed: true, lastCompleted: '2024-02-20' },
  { competency: 'Chemical Handling', required: true, completed: false, dueDate: '2024-05-30' },
  { competency: 'GMP Basics', required: true, completed: true, lastCompleted: '2023-11-10' },
  { competency: 'ISO 9001 Awareness', required: true, completed: false, dueDate: '2024-06-15' },
  { competency: 'First Aid', required: false, completed: true, lastCompleted: '2024-03-05' },
];

const TRAINING_TYPES = ['All', 'Internal', 'External', 'OJT', 'E-Learning'];
const STATUS_OPTIONS = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Pending Approval'];

export default function TrainingPage() {
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<TrainingRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewTrainingModal, setShowNewTrainingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('records');

  // Stats
  const stats = useMemo(() => {
    const completed = MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.status === 'Completed').length;
    const inProgress = MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.status === 'In Progress').length;
    const scheduled = MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.status === 'Scheduled').length;
    const pendingApproval = MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.status === 'Pending Approval').length;
    const totalCost = MOCK_TRAINING_RECORDS.reduce((acc: number, r: TrainingRecord) => acc + (r.cost || 0), 0);
    const withBond = MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.bondRequired).length;
    const avgScore = MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.score).reduce((acc: number, r: TrainingRecord) => acc + (r.score || 0), 0) / MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.score).length;
    return { completed, inProgress, scheduled, pendingApproval, totalCost, withBond, avgScore, total: MOCK_TRAINING_RECORDS.length };
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => {
      const matchesSearch = !searchQuery ||
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.trainingTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || r.trainingType === selectedType;
      const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'In Progress': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Scheduled': return 'bg-secondary text-secondary-foreground dark:bg-violet-900/30 dark:text-violet-400';
      case 'Pending Approval': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Cancelled': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Internal': return 'border-secondary text-secondary-foreground dark:border-secondary dark:text-secondary-foreground';
      case 'External': return 'border-secondary text-secondary-foreground dark:border-secondary dark:text-accent-foreground';
      case 'OJT': return 'border-accent text-accent-foreground dark:border-accent dark:text-accent-foreground';
      case 'E-Learning': return 'border-primary/30 text-primary dark:border-primary dark:text-primary';
      default: return 'border-border text-muted-foreground';
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
                <div className="h-9 w-9 rounded-lg bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-secondary-foreground dark:text-violet-400" />
                </div>
                <div>
                  <HRBreadcrumb items={[{ label: 'Training Database' }]} variant="compact" />
                  <h1 className="text-base font-semibold">Training Database</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowNewTrainingModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Training
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
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Training</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                  <p className="text-xs text-primary dark:text-primary flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> {stats.completed} completed
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-secondary-foreground dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">In Progress</p>
                  <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
                  <p className="text-xs text-secondary-foreground dark:text-secondary-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> Active sessions
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Pending Approval</p>
                  <p className="text-2xl font-bold mt-1">{stats.pendingApproval}</p>
                  <p className="text-xs text-accent-foreground dark:text-accent-foreground flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3" /> Needs action
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent-foreground dark:text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Avg. Score</p>
                  <p className="text-2xl font-bold mt-1">{stats.avgScore.toFixed(0)}%</p>
                  <p className="text-xs text-primary dark:text-primary flex items-center gap-1 mt-1">
                    <Award className="h-3 w-3" /> Above target
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary dark:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="records">Training Records</TabsTrigger>
            <TabsTrigger value="matrix">Training Matrix</TabsTrigger>
            <TabsTrigger value="bonds">Training Bonds</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-sm font-semibold">Training Records</CardTitle>
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
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRAINING_TYPES.map((t: string) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Employee</TableHead>
                      <TableHead className="text-xs">Training</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Score</TableHead>
                      <TableHead className="text-xs w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record: TrainingRecord) => (
                      <TableRow
                        key={record.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setSelectedRecord(record); setShowDetailModal(true); }}
                      >
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{record.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{record.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium max-w-[200px] truncate">{record.trainingTitle}</p>
                            <p className="text-xs text-muted-foreground">{record.provider}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-[10px]', getTypeBadge(record.trainingType))}>
                            {record.trainingType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(record.startDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-[10px]', getStatusBadge(record.status))}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {record.score ? `${record.score}%` : '—'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedRecord(record); setShowDetailModal(true); }}>
                                <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                              </DropdownMenuItem>
                              {record.certificate && (
                                <DropdownMenuItem>
                                  <Download className="h-3.5 w-3.5 mr-2" /> Download Certificate
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

          <TabsContent value="matrix" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Competency Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {MOCK_MATRIX.map((item: TrainingMatrix) => (
                    <div key={item.competency} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center',
                          item.completed ? 'bg-primary/10 dark:bg-primary/30' : 'bg-accent dark:bg-accent/30'
                        )}>
                          {item.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-primary dark:text-primary" />
                          ) : (
                            <Clock className="h-4 w-4 text-accent-foreground dark:text-accent-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.competency}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.completed ? `Completed ${format(new Date(item.lastCompleted!), 'MMM d, yyyy')}` : `Due ${format(new Date(item.dueDate!), 'MMM d, yyyy')}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.required && <Badge variant="secondary" className="text-[10px]">Required</Badge>}
                        <Badge className={cn('text-[10px]', item.completed ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground')}>
                          {item.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bonds" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Training Bonds</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Employee</TableHead>
                      <TableHead className="text-xs">Training</TableHead>
                      <TableHead className="text-xs">Cost</TableHead>
                      <TableHead className="text-xs">Bond End Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_TRAINING_RECORDS.filter((r: TrainingRecord) => r.bondRequired).map((record: TrainingRecord) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{record.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{record.department}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{record.trainingTitle}</TableCell>
                        <TableCell className="text-sm font-medium">RM {record.cost?.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {record.bondEndDate ? format(new Date(record.bondEndDate), 'MMM d, yyyy') : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-[10px]', getStatusBadge(record.status))}>
                            {record.status}
                          </Badge>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Training Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold">{selectedRecord.trainingTitle}</h3>
                <p className="text-sm text-muted-foreground">{selectedRecord.provider}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Employee</p>
                  <p className="text-sm font-medium">{selectedRecord.employeeName}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{selectedRecord.department}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Training Type</p>
                  <Badge variant="outline" className={cn('text-[10px] mt-1', getTypeBadge(selectedRecord.trainingType))}>
                    {selectedRecord.trainingType}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={cn('text-[10px] mt-1', getStatusBadge(selectedRecord.status))}>
                    {selectedRecord.status}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">{format(new Date(selectedRecord.startDate), 'MMM d, yyyy')}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="text-sm font-medium">{format(new Date(selectedRecord.endDate), 'MMM d, yyyy')}</p>
                </div>
                {selectedRecord.score && (
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-sm font-medium">{selectedRecord.score}%</p>
                  </div>
                )}
                {selectedRecord.cost && (
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="text-sm font-medium">RM {selectedRecord.cost.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {selectedRecord.bondRequired && (
                <div className="p-4 rounded-lg border border-accent bg-accent/50 dark:border-accent dark:bg-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-accent-foreground dark:text-accent-foreground" />
                    <span className="text-sm font-medium text-accent-foreground dark:text-accent-foreground">Training Bond</span>
                  </div>
                  <p className="text-xs text-accent-foreground dark:text-accent-foreground">
                    Bond expires: {selectedRecord.bondEndDate ? format(new Date(selectedRecord.bondEndDate), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => toast.success('Certificate downloaded!')}>
                  <Download className="h-4 w-4 mr-2" /> Download Certificate
                </Button>
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Training Modal */}
      <Dialog open={showNewTrainingModal} onOpenChange={setShowNewTrainingModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Training Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Training Title</Label>
              <Input placeholder="Enter training title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Training Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {['Internal', 'External', 'OJT', 'E-Learning'].map((t: string) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input placeholder="Training provider" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estimated Cost (RM)</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea placeholder="Additional notes..." />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { setShowNewTrainingModal(false); toast.success('Training application submitted!'); }}>
                Submit Application
              </Button>
              <Button variant="outline" onClick={() => setShowNewTrainingModal(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
