import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Building2,
  TrendingUp,
  TrendingDown,
  UserX,
  Timer,
  Bell,
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  scheduledIn: string;
  actualIn: string | null;
  scheduledOut: string;
  actualOut: string | null;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Half Day';
  lateMinutes: number;
  remarks: string;
}

interface LateNotification {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  scheduledIn: string;
  actualIn: string;
  lateMinutes: number;
  reason: string;
  status: 'Pending' | 'Acknowledged' | 'Warning Issued';
  occurrenceCount: number;
}

// Mock data
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    employeeId: 'EMP-001',
    employeeName: 'Ahmad bin Hassan',
    department: 'Production',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: '07:55',
    scheduledOut: '17:00',
    actualOut: '17:05',
    status: 'Present',
    lateMinutes: 0,
    remarks: '',
  },
  {
    id: 'ATT-002',
    employeeId: 'EMP-002',
    employeeName: 'Lim Wei Chen',
    department: 'Production',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: '08:25',
    scheduledOut: '17:00',
    actualOut: null,
    status: 'Late',
    lateMinutes: 25,
    remarks: 'Traffic jam reported',
  },
  {
    id: 'ATT-003',
    employeeId: 'EMP-003',
    employeeName: 'Siti Nurhaliza',
    department: 'Quality Control',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: null,
    scheduledOut: '17:00',
    actualOut: null,
    status: 'Absent',
    lateMinutes: 0,
    remarks: 'No notification',
  },
  {
    id: 'ATT-004',
    employeeId: 'EMP-004',
    employeeName: 'Raj Kumar',
    department: 'Maintenance',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: '08:00',
    scheduledOut: '17:00',
    actualOut: null,
    status: 'Present',
    lateMinutes: 0,
    remarks: '',
  },
  {
    id: 'ATT-005',
    employeeId: 'EMP-005',
    employeeName: 'Wong Mei Ling',
    department: 'Human Resources',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: null,
    scheduledOut: '17:00',
    actualOut: null,
    status: 'On Leave',
    lateMinutes: 0,
    remarks: 'Annual Leave - Approved',
  },
  {
    id: 'ATT-006',
    employeeId: 'EMP-006',
    employeeName: 'Michael Tan',
    department: 'IT',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: '08:10',
    scheduledOut: '17:00',
    actualOut: null,
    status: 'Late',
    lateMinutes: 10,
    remarks: 'Car breakdown',
  },
];

const mockLateNotifications: LateNotification[] = [
  {
    id: 'LCN-001',
    employeeId: 'EMP-002',
    employeeName: 'Lim Wei Chen',
    department: 'Production',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: '08:25',
    lateMinutes: 25,
    reason: 'Heavy traffic due to accident on highway',
    status: 'Pending',
    occurrenceCount: 3,
  },
  {
    id: 'LCN-002',
    employeeId: 'EMP-006',
    employeeName: 'Michael Tan',
    department: 'IT',
    date: new Date('2026-05-06'),
    scheduledIn: '08:00',
    actualIn: '08:10',
    lateMinutes: 10,
    reason: 'Car battery issue, had to call roadside assistance',
    status: 'Acknowledged',
    occurrenceCount: 1,
  },
  {
    id: 'LCN-003',
    employeeId: 'EMP-010',
    employeeName: 'Arun Selvam',
    department: 'Maintenance',
    date: new Date('2026-05-05'),
    scheduledIn: '08:00',
    actualIn: '08:45',
    lateMinutes: 45,
    reason: 'Public transport delay',
    status: 'Warning Issued',
    occurrenceCount: 5,
  },
];

const departments = [
  'All Departments',
  'Production',
  'Quality Control',
  'Maintenance',
  'Human Resources',
  'IT',
  'Finance',
  'Logistics',
];

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const filteredRecords = mockAttendanceRecords.filter((record: AttendanceRecord) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'All Departments' || record.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === 'all' ||
      record.status.toLowerCase().replace(' ', '-') === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: mockAttendanceRecords.length,
    present: mockAttendanceRecords.filter((r: AttendanceRecord) => r.status === 'Present').length,
    late: mockAttendanceRecords.filter((r: AttendanceRecord) => r.status === 'Late').length,
    absent: mockAttendanceRecords.filter((r: AttendanceRecord) => r.status === 'Absent').length,
    onLeave: mockAttendanceRecords.filter((r: AttendanceRecord) => r.status === 'On Leave').length,
    attendanceRate: Math.round(
      ((mockAttendanceRecords.filter((r: AttendanceRecord) => r.status === 'Present' || r.status === 'Late').length) /
        mockAttendanceRecords.filter((r: AttendanceRecord) => r.status !== 'On Leave').length) *
        100
    ),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-primary/50/10 text-primary dark:text-primary';
      case 'Late':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground';
      case 'Absent':
        return 'bg-destructive/10 text-destructive';
      case 'On Leave':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-secondary-foreground';
      case 'Half Day':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-accent-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getNotificationStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground';
      case 'Acknowledged':
        return 'bg-primary/50/10 text-primary dark:text-primary';
      case 'Warning Issued':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAcknowledge = (id: string) => {
    toast.success('Late notification acknowledged');
  };

  const handleIssueWarning = (id: string) => {
    toast.success('Warning letter issued');
  };

  return (
    <HRLayout title="Attendance Management" subtitle="Daily attendance and late notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
            <p className="text-muted-foreground">
              Track daily attendance, late arrivals, and absences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Report Late
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Late Coming Notification</DialogTitle>
                  <DialogDescription>
                    Submit a notification for late arrival
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Employee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp1">Ahmad bin Hassan</SelectItem>
                        <SelectItem value="emp2">Lim Wei Chen</SelectItem>
                        <SelectItem value="emp3">Siti Nurhaliza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" defaultValue={selectedDate} />
                    </div>
                    <div className="space-y-2">
                      <Label>Actual Arrival Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Input placeholder="Explain the reason for late arrival..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast.success('Late notification submitted');
                        setIsReportDialogOpen(false);
                      }}
                    >
                      Submit
                    </Button>
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
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Expected today</p>
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
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.present}</div>
                <p className="text-xs text-muted-foreground">On time</p>
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
                <CardTitle className="text-sm font-medium">Late</CardTitle>
                <Timer className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{stats.late}</div>
                <p className="text-xs text-muted-foreground">Arrived late</p>
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
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <UserX className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
                <p className="text-xs text-muted-foreground">Not present</p>
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
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">Today's rate</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
            <TabsTrigger value="late">
              Late Notifications
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {mockLateNotifications.filter((n: LateNotification) => n.status === 'Pending').length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                    className="w-[180px]"
                  />
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
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Scheduled In</TableHead>
                      <TableHead>Actual In</TableHead>
                      <TableHead>Late (mins)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record: AttendanceRecord, index: number) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(record.employeeName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{record.employeeName}</p>
                              <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {record.scheduledIn}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.actualIn ? (
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              {record.actualIn}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.lateMinutes > 0 ? (
                            <span className="font-medium text-accent-foreground">
                              +{record.lateMinutes}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {record.remarks || '-'}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="late" className="space-y-4">
            <div className="space-y-4">
              {mockLateNotifications.map((notification: LateNotification, index: number) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, ease: 'easeOut' as const }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              notification.occurrenceCount >= 5
                                ? 'bg-destructive/10'
                                : notification.occurrenceCount >= 3
                                  ? 'bg-accent/500/10'
                                  : 'bg-secondary/500/10'
                            }`}
                          >
                            <Timer
                              className={`h-5 w-5 ${
                                notification.occurrenceCount >= 5
                                  ? 'text-destructive'
                                  : notification.occurrenceCount >= 3
                                    ? 'text-accent-foreground'
                                    : 'text-secondary-foreground'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{notification.employeeName}</span>
                              <Badge variant="outline">{notification.employeeId}</Badge>
                              <Badge
                                variant="secondary"
                                className={getNotificationStatusColor(notification.status)}
                              >
                                {notification.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {notification.department} • Late by {notification.lateMinutes} minutes
                            </p>
                            <p className="mt-2">
                              <span className="font-medium">Reason:</span> {notification.reason}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {notification.date.toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Scheduled: {notification.scheduledIn} → Actual:{' '}
                                {notification.actualIn}
                              </span>
                              <span
                                className={`flex items-center gap-1 font-medium ${
                                  notification.occurrenceCount >= 5
                                    ? 'text-destructive'
                                    : notification.occurrenceCount >= 3
                                      ? 'text-accent-foreground'
                                      : 'text-foreground'
                                }`}
                              >
                                <AlertTriangle className="h-3.5 w-3.5" />
                                {notification.occurrenceCount} occurrences this month
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {notification.status === 'Pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAcknowledge(notification.id)}
                              >
                                Acknowledge
                              </Button>
                              {notification.occurrenceCount >= 3 && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleIssueWarning(notification.id)}
                                >
                                  Issue Warning
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
}
