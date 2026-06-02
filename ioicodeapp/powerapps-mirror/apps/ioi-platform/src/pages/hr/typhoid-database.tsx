import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Syringe,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { HRLayout } from '@/components/hr/hr-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

type VaccinationStatus = 'Current' | 'Due Soon' | 'Overdue' | 'Not Required';

interface Employee {
  id: string;
  name: string;
  department: string;
  site: string;
  lastVaccination: string;
  nextDue: string;
  status: VaccinationStatus;
  batchNo: string;
}

const mockEmployees: Employee[] = [
  {
    id: 'IOI-10001',
    name: 'Ahmad Bin Hassan',
    department: 'Production',
    site: 'Prai',
    lastVaccination: '2024-08-15',
    nextDue: '2027-08-15',
    status: 'Current',
    batchNo: 'TYP-2024-001',
  },
  {
    id: 'IOI-10002',
    name: 'Siti Aminah',
    department: 'QC',
    site: 'Prai',
    lastVaccination: '2022-06-20',
    nextDue: '2025-06-20',
    status: 'Due Soon',
    batchNo: 'TYP-2022-045',
  },
  {
    id: 'IOI-10003',
    name: 'Rajesh Kumar',
    department: 'Logistics',
    site: 'Johor',
    lastVaccination: '2021-03-10',
    nextDue: '2024-03-10',
    status: 'Overdue',
    batchNo: 'TYP-2021-012',
  },
  {
    id: 'IOI-10004',
    name: 'Tan Wei Ming',
    department: 'IT',
    site: 'Prai',
    lastVaccination: '-',
    nextDue: '-',
    status: 'Not Required',
    batchNo: '-',
  },
  {
    id: 'IOI-10005',
    name: 'Nurul Huda',
    department: 'Production',
    site: 'Johor',
    lastVaccination: '2024-01-05',
    nextDue: '2027-01-05',
    status: 'Current',
    batchNo: 'TYP-2024-003',
  },
  {
    id: 'IOI-10006',
    name: 'Mohamad Ali',
    department: 'QA',
    site: 'Prai',
    lastVaccination: '2023-09-12',
    nextDue: '2026-09-12',
    status: 'Current',
    batchNo: 'TYP-2023-078',
  },
];

function StatusBadge({ status }: { status: VaccinationStatus }) {
  const variants: Record<VaccinationStatus, { className: string; icon: React.ReactNode }> = {
    Current: {
      className: 'bg-accent text-accent-foreground',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    'Due Soon': {
      className: 'bg-primary/10 text-primary border border-primary/20',
      icon: <Clock className="h-3 w-3" />,
    },
    Overdue: {
      className: 'bg-destructive text-destructive-foreground',
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    'Not Required': {
      className: 'bg-secondary text-secondary-foreground',
      icon: null,
    },
  };

  const variant = variants[status];

  return (
    <Badge className={`gap-1 ${variant.className}`}>
      {variant.icon}
      {status}
    </Badge>
  );
}

export default function TyphoidDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSite, setFilterSite] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredEmployees = mockEmployees.filter((emp: Employee) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSite = filterSite === 'all' || emp.site.toLowerCase() === filterSite;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    const matchesDept = filterDepartment === 'all' || emp.department.toLowerCase() === filterDepartment;
    return matchesSearch && matchesSite && matchesStatus && matchesDept;
  });

  const stats = {
    total: mockEmployees.length,
    current: mockEmployees.filter((e: Employee) => e.status === 'Current').length,
    dueSoon: mockEmployees.filter((e: Employee) => e.status === 'Due Soon').length,
    overdue: mockEmployees.filter((e: Employee) => e.status === 'Overdue').length,
  };

  return (
    <HRLayout title="Typhoid Vaccination Database">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/50/10 rounded-lg">
                <Syringe className="h-6 w-6 text-primary" />
              </div>
              Typhoid/NPRA Vaccination Database (TNDB)
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage employee vaccination records for regulatory compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync NPRA
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tracked</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <User className="h-6 w-6 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-3xl font-bold text-primary">{stats.current}</p>
                  </div>
                  <div className="p-3 bg-primary/10 dark:bg-primary/30 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Due Soon</p>
                    <p className="text-3xl font-bold text-primary">{stats.dueSoon}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-destructive/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-3xl font-bold text-destructive">{stats.overdue}</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filter Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterSite} onValueChange={setFilterSite}>
                <SelectTrigger>
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="prai">Prai</SelectItem>
                  <SelectItem value="johor">Johor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="qc">QC</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Due Soon">Due Soon</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Not Required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vaccination Records</CardTitle>
            <CardDescription>
              {filteredEmployees.length} of {mockEmployees.length} employees shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Last Vaccination
                    </div>
                  </TableHead>
                  <TableHead>Batch No.</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp: Employee) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.id}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{emp.site}</Badge>
                    </TableCell>
                    <TableCell>{emp.lastVaccination}</TableCell>
                    <TableCell className="font-mono text-sm">{emp.batchNo}</TableCell>
                    <TableCell>{emp.nextDue}</TableCell>
                    <TableCell>
                      <StatusBadge status={emp.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HRLayout>
  );
}
