import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  MoreHorizontal,
  Phone,
  Mail,
  Briefcase,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface ContractWorker {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  contractType: 'Fixed Term' | 'Project-Based' | 'Seasonal' | 'Internship';
  agency: string | null;
  startDate: Date;
  endDate: Date;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Pending Renewal';
  dailyRate: number;
  skills: string[];
  supervisor: string;
}

// Mock data
const mockContractWorkers: ContractWorker[] = [
  {
    id: 'CW-001',
    name: 'Razali bin Ahmad',
    email: 'razali@tempstaff.com',
    phone: '+60 12-345 6789',
    position: 'Production Operator',
    department: 'Production',
    contractType: 'Fixed Term',
    agency: 'TempStaff Solutions',
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-07-15'),
    status: 'Active',
    dailyRate: 80,
    skills: ['Machine Operation', 'Quality Inspection'],
    supervisor: 'Ahmad bin Hassan',
  },
  {
    id: 'CW-002',
    name: 'Nurul Izzah',
    email: 'nurul.izzah@email.com',
    phone: '+60 13-456 7890',
    position: 'QC Inspector',
    department: 'Quality Control',
    contractType: 'Fixed Term',
    agency: 'TempStaff Solutions',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-05-31'),
    status: 'Expiring Soon',
    dailyRate: 90,
    skills: ['Quality Assurance', 'Documentation', 'ISO Standards'],
    supervisor: 'Siti Nurhaliza',
  },
  {
    id: 'CW-003',
    name: 'Amir Shah',
    email: 'amir.shah@contractor.com',
    phone: '+60 14-567 8901',
    position: 'IT Support Technician',
    department: 'IT',
    contractType: 'Project-Based',
    agency: null,
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-08-31'),
    status: 'Active',
    dailyRate: 150,
    skills: ['Network Support', 'Hardware Troubleshooting', 'Windows Server'],
    supervisor: 'Michael Tan',
  },
  {
    id: 'CW-004',
    name: 'Priya Devi',
    email: 'priya.devi@email.com',
    phone: '+60 15-678 9012',
    position: 'HR Assistant',
    department: 'Human Resources',
    contractType: 'Internship',
    agency: null,
    startDate: new Date('2026-03-15'),
    endDate: new Date('2026-09-15'),
    status: 'Active',
    dailyRate: 50,
    skills: ['Data Entry', 'MS Office', 'Communication'],
    supervisor: 'Wong Mei Ling',
  },
  {
    id: 'CW-005',
    name: 'Hafiz Roslan',
    email: 'hafiz.r@tempstaff.com',
    phone: '+60 16-789 0123',
    position: 'Warehouse Helper',
    department: 'Logistics',
    contractType: 'Seasonal',
    agency: 'ManpowerPlus',
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-06-30'),
    status: 'Active',
    dailyRate: 70,
    skills: ['Forklift Operation', 'Inventory Management'],
    supervisor: 'Krishnan Pillai',
  },
  {
    id: 'CW-006',
    name: 'Lee Siew Ling',
    email: 'siewling@email.com',
    phone: '+60 17-890 1234',
    position: 'Accounts Clerk',
    department: 'Finance',
    contractType: 'Fixed Term',
    agency: 'TempStaff Solutions',
    startDate: new Date('2025-10-01'),
    endDate: new Date('2026-04-30'),
    status: 'Pending Renewal',
    dailyRate: 85,
    skills: ['Accounting', 'SAP', 'Excel'],
    supervisor: 'Tan Ah Kow',
  },
];

const departments = [
  'All Departments',
  'Production',
  'Quality Control',
  'IT',
  'Human Resources',
  'Logistics',
  'Finance',
];

const contractTypes = ['All Types', 'Fixed Term', 'Project-Based', 'Seasonal', 'Internship'];

export default function ContractWorkersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredWorkers = mockContractWorkers.filter((worker: ContractWorker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'All Departments' || worker.department === selectedDepartment;
    const matchesType =
      selectedType === 'All Types' || worker.contractType === selectedType;
    const matchesStatus =
      selectedStatus === 'all' ||
      worker.status.toLowerCase().replace(' ', '-') === selectedStatus;
    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  const stats = {
    total: mockContractWorkers.length,
    active: mockContractWorkers.filter((w: ContractWorker) => w.status === 'Active').length,
    expiringSoon: mockContractWorkers.filter((w: ContractWorker) => w.status === 'Expiring Soon').length,
    pendingRenewal: mockContractWorkers.filter((w: ContractWorker) => w.status === 'Pending Renewal').length,
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diff = endDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary/50/10 text-primary dark:text-primary';
      case 'Expiring Soon':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground';
      case 'Expired':
        return 'bg-destructive/10 text-destructive';
      case 'Pending Renewal':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'Fixed Term':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-accent-foreground border-secondary/20';
      case 'Project-Based':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-secondary-foreground border-secondary/20';
      case 'Seasonal':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground border-accent/20';
      case 'Internship':
        return 'bg-primary/50/10 text-primary dark:text-primary border-primary/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleAddWorker = () => {
    toast.success('Contract worker requisition submitted');
    setIsAddDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HRLayout title="Contract Workers" subtitle="Fixed-term and contract staff management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contract Workers Management</h1>
            <p className="text-muted-foreground">
              Manage fixed-term contracts, project staff, and agency workers
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
                  New Requisition
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Fixed Term Contract Requisition</DialogTitle>
                  <DialogDescription>
                    Submit a request for contract/temporary staff
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Position Title</Label>
                      <Input placeholder="e.g., Production Operator" />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.slice(1).map((dept: string) => (
                            <SelectItem key={dept} value={dept.toLowerCase()}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contract Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Term</SelectItem>
                          <SelectItem value="project">Project-Based</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Staff</Label>
                      <Input type="number" placeholder="1" min="1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <Label>Justification</Label>
                    <Input placeholder="Reason for requisition..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Required Skills</Label>
                    <Input placeholder="e.g., Machine Operation, Quality Inspection" />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddWorker}>Submit Requisition</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: 'easeOut' as const }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contract Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Currently engaged</p>
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
                <p className="text-xs text-muted-foreground">Working now</p>
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
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertTriangle className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{stats.expiringSoon}</div>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
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
                <CardTitle className="text-sm font-medium">Pending Renewal</CardTitle>
                <RefreshCw className="h-4 w-4 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-foreground">{stats.pendingRenewal}</div>
                <p className="text-xs text-muted-foreground">Awaiting decision</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, position, or ID..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[160px]">
                  <FileText className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((type: string) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="pending-renewal">Pending Renewal</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Workers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Position / Dept</TableHead>
                  <TableHead>Contract Type</TableHead>
                  <TableHead>Contract Period</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredWorkers.map((worker: ContractWorker, index: number) => {
                    const daysLeft = getDaysRemaining(worker.endDate);
                    return (
                      <motion.tr
                        key={worker.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
                        className="group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(worker.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{worker.name}</p>
                              <p className="text-xs text-muted-foreground">{worker.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{worker.position}</p>
                            <p className="text-sm text-muted-foreground">{worker.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className={getContractTypeColor(worker.contractType)}
                            >
                              {worker.contractType}
                            </Badge>
                            {worker.agency && (
                              <p className="text-xs text-muted-foreground">{worker.agency}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                              {worker.startDate.toLocaleDateString()} -{' '}
                              {worker.endDate.toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={`font-medium ${
                                  daysLeft <= 30
                                    ? 'text-accent-foreground'
                                    : daysLeft <= 0
                                      ? 'text-destructive'
                                      : 'text-foreground'
                                }`}
                              >
                                {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                              </span>
                            </div>
                            <Progress
                              value={Math.min(100, Math.max(0, (daysLeft / 180) * 100))}
                              className="mt-1 h-1.5"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(worker.status)}>
                            {worker.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Contract
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renew Contract
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                {worker.email}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                {worker.phone}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Terminate Contract
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HRLayout>
  );
}
