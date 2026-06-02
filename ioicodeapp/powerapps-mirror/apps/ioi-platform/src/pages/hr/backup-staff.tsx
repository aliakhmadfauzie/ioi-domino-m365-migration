import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Calendar,
  Shield,
  UserCheck,
  Info,
  Clock,
} from 'lucide-react';
import { HRLayout } from '@/components/hr/hr-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface BackupAssignment {
  id: string;
  primaryStaffId: string;
  primaryStaffName: string;
  primaryPosition: string;
  primaryDepartment: string;
  backupStaffId: string;
  backupStaffName: string;
  backupPosition: string;
  backupDepartment: string;
  competencyLevel: 'Fully Trained' | 'Partial' | 'In Training';
  lastCoverage: Date | null;
  totalCoverages: number;
  status: 'Active' | 'Pending Review' | 'Expired';
  validFrom: Date;
  validUntil: Date;
  notes: string;
}

interface CoverageGap {
  position: string;
  department: string;
  reason: string;
  priority: 'Critical' | 'High' | 'Medium';
}

// Mock data
const mockBackupAssignments: BackupAssignment[] = [
  {
    id: 'BSD-001',
    primaryStaffId: 'EMP-001',
    primaryStaffName: 'Ahmad bin Hassan',
    primaryPosition: 'Production Supervisor',
    primaryDepartment: 'Production',
    backupStaffId: 'EMP-015',
    backupStaffName: 'Lim Wei Chen',
    backupPosition: 'Senior Operator',
    backupDepartment: 'Production',
    competencyLevel: 'Fully Trained',
    lastCoverage: new Date('2026-04-15'),
    totalCoverages: 12,
    status: 'Active',
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    notes: 'Completed all supervisory training modules',
  },
  {
    id: 'BSD-002',
    primaryStaffId: 'EMP-002',
    primaryStaffName: 'Siti Nurhaliza',
    primaryPosition: 'QC Manager',
    primaryDepartment: 'Quality Control',
    backupStaffId: 'EMP-022',
    backupStaffName: 'Raj Kumar',
    backupPosition: 'Senior QC Analyst',
    backupDepartment: 'Quality Control',
    competencyLevel: 'Fully Trained',
    lastCoverage: new Date('2026-04-20'),
    totalCoverages: 8,
    status: 'Active',
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    notes: 'ISO auditor certified',
  },
  {
    id: 'BSD-003',
    primaryStaffId: 'EMP-003',
    primaryStaffName: 'Michael Tan',
    primaryPosition: 'Maintenance Engineer',
    primaryDepartment: 'Maintenance',
    backupStaffId: 'EMP-031',
    backupStaffName: 'Arun Selvam',
    backupPosition: 'Technician',
    backupDepartment: 'Maintenance',
    competencyLevel: 'Partial',
    lastCoverage: new Date('2026-03-10'),
    totalCoverages: 5,
    status: 'Pending Review',
    validFrom: new Date('2025-07-01'),
    validUntil: new Date('2026-06-30'),
    notes: 'Needs additional PLC training',
  },
  {
    id: 'BSD-004',
    primaryStaffId: 'EMP-004',
    primaryStaffName: 'Wong Mei Ling',
    primaryPosition: 'HR Executive',
    primaryDepartment: 'Human Resources',
    backupStaffId: 'EMP-041',
    backupStaffName: 'Sarah Abdullah',
    backupPosition: 'HR Assistant',
    backupDepartment: 'Human Resources',
    competencyLevel: 'In Training',
    lastCoverage: null,
    totalCoverages: 0,
    status: 'Active',
    validFrom: new Date('2026-03-01'),
    validUntil: new Date('2027-02-28'),
    notes: 'Currently in OJT program',
  },
  {
    id: 'BSD-005',
    primaryStaffId: 'EMP-005',
    primaryStaffName: 'Krishnan Pillai',
    primaryPosition: 'Logistics Coordinator',
    primaryDepartment: 'Logistics',
    backupStaffId: 'EMP-052',
    backupStaffName: 'Lee Chong Wei',
    backupPosition: 'Warehouse Assistant',
    backupDepartment: 'Logistics',
    competencyLevel: 'Partial',
    lastCoverage: new Date('2026-04-01'),
    totalCoverages: 3,
    status: 'Active',
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    notes: 'Forklift license obtained',
  },
];

const mockCoverageGaps: CoverageGap[] = [
  {
    position: 'Plant Manager',
    department: 'Operations',
    reason: 'No qualified backup identified',
    priority: 'Critical',
  },
  {
    position: 'Safety Officer',
    department: 'SHE',
    reason: 'Backup staff on long leave',
    priority: 'Critical',
  },
  {
    position: 'IT Manager',
    department: 'IT',
    reason: 'Assignment expired',
    priority: 'High',
  },
  {
    position: 'Finance Controller',
    department: 'Finance',
    reason: 'Backup competency insufficient',
    priority: 'Medium',
  },
];

const departments = [
  'All Departments',
  'Production',
  'Quality Control',
  'Maintenance',
  'Human Resources',
  'Logistics',
  'IT',
  'Finance',
  'SHE',
  'Operations',
];

export default function BackupStaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredAssignments = mockBackupAssignments.filter((assignment: BackupAssignment) => {
    const matchesSearch =
      assignment.primaryStaffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.backupStaffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.primaryPosition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'All Departments' ||
      assignment.primaryDepartment === selectedDepartment;
    const matchesStatus =
      selectedStatus === 'all' ||
      assignment.status.toLowerCase().replace(' ', '-') === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: mockBackupAssignments.length,
    active: mockBackupAssignments.filter((a: BackupAssignment) => a.status === 'Active').length,
    pendingReview: mockBackupAssignments.filter((a: BackupAssignment) => a.status === 'Pending Review').length,
    fullyTrained: mockBackupAssignments.filter((a: BackupAssignment) => a.competencyLevel === 'Fully Trained').length,
    coverageRate: Math.round(
      (mockBackupAssignments.filter((a: BackupAssignment) => a.status === 'Active').length /
        (mockBackupAssignments.length + mockCoverageGaps.length)) *
        100
    ),
  };

  const getCompetencyColor = (level: string) => {
    switch (level) {
      case 'Fully Trained':
        return 'bg-primary/50/10 text-primary dark:text-primary border-primary/20';
      case 'Partial':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground border-accent/20';
      case 'In Training':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-secondary-foreground border-secondary/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary/50/10 text-primary dark:text-primary';
      case 'Pending Review':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground';
      case 'Expired':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-destructive/10 text-destructive';
      case 'High':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground';
      case 'Medium':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleAddAssignment = () => {
    toast.success('Backup assignment created successfully');
    setIsAddDialogOpen(false);
  };

  return (
    <HRLayout title="Backup Staff Database" subtitle="Staff coverage and backup assignments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Backup Staff Database</h1>
            <p className="text-muted-foreground">
              Manage backup coverage assignments for business continuity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Backup Assignment</DialogTitle>
                  <DialogDescription>
                    Assign a backup staff member to cover for a primary position
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Staff</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emp1">Ahmad bin Hassan</SelectItem>
                          <SelectItem value="emp2">Siti Nurhaliza</SelectItem>
                          <SelectItem value="emp3">Michael Tan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Backup Staff</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select backup" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bk1">Lim Wei Chen</SelectItem>
                          <SelectItem value="bk2">Raj Kumar</SelectItem>
                          <SelectItem value="bk3">Arun Selvam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valid From</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Valid Until</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Competency Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully">Fully Trained</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="training">In Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input placeholder="Additional notes..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAssignment}>Create Assignment</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: 'easeOut' as const }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Backup pairs configured</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: 'easeOut' as const }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Ready for coverage</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: 'easeOut' as const }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <RefreshCw className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{stats.pendingReview}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ease: 'easeOut' as const }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fully Trained</CardTitle>
                <UserCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fullyTrained}</div>
                <p className="text-xs text-muted-foreground">Competency verified</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: 'easeOut' as const }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coverage Rate</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.coverageRate}%</div>
                <Progress value={stats.coverageRate} className="mt-2 h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs for Assignments and Gaps */}
        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assignments">Backup Assignments</TabsTrigger>
            <TabsTrigger value="gaps">
              Coverage Gaps
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {mockCoverageGaps.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or position..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[200px]">
                      <Building2 className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: string) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[160px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending-review">Pending Review</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Assignments Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Primary Staff</TableHead>
                      <TableHead>Backup Staff</TableHead>
                      <TableHead>Competency</TableHead>
                      <TableHead>Last Coverage</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredAssignments.map((assignment: BackupAssignment, index: number) => (
                        <motion.tr
                          key={assignment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
                          className="group"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{assignment.primaryStaffName}</p>
                              <p className="text-sm text-muted-foreground">
                                {assignment.primaryPosition}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {assignment.primaryDepartment}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{assignment.backupStaffName}</p>
                              <p className="text-sm text-muted-foreground">
                                {assignment.backupPosition}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getCompetencyColor(assignment.competencyLevel)}
                            >
                              {assignment.competencyLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {assignment.lastCoverage ? (
                              <div className="flex items-center gap-1.5 text-sm">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                {assignment.lastCoverage.toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              {assignment.validUntil.toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getStatusColor(assignment.status)}
                            >
                              {assignment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-xs">
                                  <p className="font-medium">Notes</p>
                                  <p className="text-sm">{assignment.notes}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Total coverages: {assignment.totalCoverages}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Coverage Gaps Requiring Attention
                </CardTitle>
                <CardDescription>
                  Positions without adequate backup coverage that need immediate action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCoverageGaps.map((gap: CoverageGap, index: number) => (
                    <motion.div
                      key={gap.position}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, ease: 'easeOut' as const }}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            gap.priority === 'Critical'
                              ? 'bg-destructive/10'
                              : gap.priority === 'High'
                                ? 'bg-accent/500/10'
                                : 'bg-secondary/500/10'
                          }`}
                        >
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              gap.priority === 'Critical'
                                ? 'text-destructive'
                                : gap.priority === 'High'
                                  ? 'text-accent-foreground'
                                  : 'text-secondary-foreground'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{gap.position}</p>
                          <p className="text-sm text-muted-foreground">{gap.department}</p>
                          <p className="text-sm text-muted-foreground">{gap.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(gap.priority)}>
                          {gap.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Assign Backup
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
}
