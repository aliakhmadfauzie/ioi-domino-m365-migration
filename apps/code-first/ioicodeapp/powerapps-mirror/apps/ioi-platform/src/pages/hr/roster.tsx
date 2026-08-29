import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Sun,
  Moon,
  Sunrise,
  Plus,
  Download,
  Building2,
  UserCheck,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { HRLayout } from '@/components/hr/hr-layout';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type ShiftType = 'morning' | 'afternoon' | 'night' | 'off' | 'leave';

interface ShiftAssignment {
  staffId: string;
  staffName: string;
  department: string;
  shifts: Record<string, ShiftType>;
}

interface NightDutyFinding {
  id: string;
  date: Date;
  shift: string;
  supervisor: string;
  finding: string;
  severity: 'Minor' | 'Major' | 'Critical';
  status: 'Open' | 'Resolved';
  area: string;
}

// Mock data
const mockShiftAssignments: ShiftAssignment[] = [
  {
    staffId: 'EMP-001',
    staffName: 'Ahmad bin Hassan',
    department: 'Production Line A',
    shifts: {
      'Mon': 'morning',
      'Tue': 'morning',
      'Wed': 'morning',
      'Thu': 'afternoon',
      'Fri': 'afternoon',
      'Sat': 'off',
      'Sun': 'off',
    },
  },
  {
    staffId: 'EMP-002',
    staffName: 'Lim Wei Chen',
    department: 'Production Line A',
    shifts: {
      'Mon': 'afternoon',
      'Tue': 'afternoon',
      'Wed': 'night',
      'Thu': 'night',
      'Fri': 'night',
      'Sat': 'off',
      'Sun': 'off',
    },
  },
  {
    staffId: 'EMP-003',
    staffName: 'Raj Kumar',
    department: 'Production Line A',
    shifts: {
      'Mon': 'night',
      'Tue': 'night',
      'Wed': 'off',
      'Thu': 'morning',
      'Fri': 'morning',
      'Sat': 'morning',
      'Sun': 'off',
    },
  },
  {
    staffId: 'EMP-004',
    staffName: 'Siti Aminah',
    department: 'Production Line B',
    shifts: {
      'Mon': 'morning',
      'Tue': 'morning',
      'Wed': 'morning',
      'Thu': 'morning',
      'Fri': 'morning',
      'Sat': 'off',
      'Sun': 'off',
    },
  },
  {
    staffId: 'EMP-005',
    staffName: 'Michael Tan',
    department: 'Maintenance',
    shifts: {
      'Mon': 'morning',
      'Tue': 'afternoon',
      'Wed': 'afternoon',
      'Thu': 'night',
      'Fri': 'off',
      'Sat': 'morning',
      'Sun': 'leave',
    },
  },
  {
    staffId: 'EMP-006',
    staffName: 'Wong Mei Ling',
    department: 'QC',
    shifts: {
      'Mon': 'morning',
      'Tue': 'morning',
      'Wed': 'morning',
      'Thu': 'morning',
      'Fri': 'morning',
      'Sat': 'off',
      'Sun': 'off',
    },
  },
];

const mockNightFindings: NightDutyFinding[] = [
  {
    id: 'NDF-001',
    date: new Date('2026-05-05'),
    shift: 'Night Shift (10pm-6am)',
    supervisor: 'Ahmad bin Hassan',
    finding: 'Fire exit blocked by pallets in Section B',
    severity: 'Critical',
    status: 'Open',
    area: 'Warehouse B',
  },
  {
    id: 'NDF-002',
    date: new Date('2026-05-04'),
    shift: 'Night Shift (10pm-6am)',
    supervisor: 'Lim Wei Chen',
    finding: 'Temperature fluctuation in cold storage',
    severity: 'Major',
    status: 'Resolved',
    area: 'Cold Storage',
  },
  {
    id: 'NDF-003',
    date: new Date('2026-05-03'),
    shift: 'Night Shift (10pm-6am)',
    supervisor: 'Raj Kumar',
    finding: 'Machine #3 unusual noise reported',
    severity: 'Minor',
    status: 'Open',
    area: 'Production Line A',
  },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const departments = ['All Areas', 'Production Line A', 'Production Line B', 'Maintenance', 'QC', 'Warehouse'];

export default function RosterPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('All Areas');
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isAddFindingOpen, setIsAddFindingOpen] = useState(false);

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    return days.map((dayName: string, index: number) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        day: dayName,
        date: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
      };
    });
  };

  const weekDates = getWeekDates();

  const getShiftIcon = (shift: ShiftType) => {
    switch (shift) {
      case 'morning':
        return <Sunrise className="h-4 w-4" />;
      case 'afternoon':
        return <Sun className="h-4 w-4" />;
      case 'night':
        return <Moon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getShiftColor = (shift: ShiftType) => {
    switch (shift) {
      case 'morning':
        return 'bg-accent dark:bg-accent/30 text-accent-foreground dark:text-accent-foreground border-accent dark:border-accent';
      case 'afternoon':
        return 'bg-accent dark:bg-accent/30 text-accent-foreground dark:text-accent-foreground border-accent dark:border-accent';
      case 'night':
        return 'bg-secondary dark:bg-secondary/30 text-secondary-foreground dark:text-secondary-foreground border-secondary dark:border-secondary';
      case 'off':
        return 'bg-muted text-muted-foreground border-border';
      case 'leave':
        return 'bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary border-primary/20 dark:border-primary';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getShiftLabel = (shift: ShiftType) => {
    switch (shift) {
      case 'morning':
        return '6am-2pm';
      case 'afternoon':
        return '2pm-10pm';
      case 'night':
        return '10pm-6am';
      case 'off':
        return 'Off';
      case 'leave':
        return 'Leave';
      default:
        return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-destructive text-destructive-foreground';
      case 'Major':
        return 'bg-accent/500 text-white';
      case 'Minor':
        return 'bg-secondary/500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredAssignments = mockShiftAssignments.filter((assignment: ShiftAssignment) =>
    selectedDepartment === 'All Areas' || assignment.department === selectedDepartment
  );

  const shiftCounts = {
    morning: filteredAssignments.filter((a: ShiftAssignment) => 
      Object.values(a.shifts).filter((s: ShiftType) => s === 'morning').length > 0
    ).length,
    afternoon: filteredAssignments.filter((a: ShiftAssignment) => 
      Object.values(a.shifts).filter((s: ShiftType) => s === 'afternoon').length > 0
    ).length,
    night: filteredAssignments.filter((a: ShiftAssignment) => 
      Object.values(a.shifts).filter((s: ShiftType) => s === 'night').length > 0
    ).length,
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  const handleAddShift = () => {
    toast.success('Shift assignment created');
    setIsAddShiftOpen(false);
  };

  const handleAddFinding = () => {
    toast.success('Night duty finding reported');
    setIsAddFindingOpen(false);
  };

  return (
    <HRLayout title="Duty Roster" subtitle="Shift scheduling and night duty management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Duty Roster & Shift Management</h1>
            <p className="text-muted-foreground">
              Schedule and manage employee shifts across all departments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Shift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Shift Assignment</DialogTitle>
                  <DialogDescription>
                    Assign a shift to an employee for the selected week
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
                        <SelectItem value="emp3">Raj Kumar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day: string) => (
                            <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Shift</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (6am-2pm)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (2pm-10pm)</SelectItem>
                          <SelectItem value="night">Night (10pm-6am)</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddShiftOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddShift}>Add Shift</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
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
                <div className="text-2xl font-bold">{filteredAssignments.length}</div>
                <p className="text-xs text-muted-foreground">Scheduled this week</p>
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
                <CardTitle className="text-sm font-medium">Morning Shift</CardTitle>
                <Sunrise className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{shiftCounts.morning}</div>
                <p className="text-xs text-muted-foreground">6:00 AM - 2:00 PM</p>
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
                <CardTitle className="text-sm font-medium">Afternoon Shift</CardTitle>
                <Sun className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{shiftCounts.afternoon}</div>
                <p className="text-xs text-muted-foreground">2:00 PM - 10:00 PM</p>
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
                <CardTitle className="text-sm font-medium">Night Shift</CardTitle>
                <Moon className="h-4 w-4 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-foreground">{shiftCounts.night}</div>
                <p className="text-xs text-muted-foreground">10:00 PM - 6:00 AM</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="roster" className="space-y-4">
          <TabsList>
            <TabsTrigger value="roster">Weekly Roster</TabsTrigger>
            <TabsTrigger value="findings">
              Night Duty Findings
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {mockNightFindings.filter((f: NightDutyFinding) => f.status === 'Open').length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roster" className="space-y-4">
            {/* Week Navigation */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[200px]">
                      <Building2 className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: string) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {weekDates[0].date} {weekDates[0].month} - {weekDates[6].date} {weekDates[6].month} 2026
                      </span>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>
                    Today
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Roster Grid */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="w-[200px] p-4 text-left font-medium">Employee</th>
                        {weekDates.map((date: { day: string; date: number; month: string }) => (
                          <th key={date.day} className="min-w-[100px] p-4 text-center">
                            <div className="text-sm font-medium">{date.day}</div>
                            <div className="text-xs text-muted-foreground">
                              {date.date} {date.month}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment: ShiftAssignment, index: number) => (
                        <motion.tr
                          key={assignment.staffId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
                          className="border-b last:border-0"
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{assignment.staffName}</p>
                              <p className="text-sm text-muted-foreground">{assignment.department}</p>
                            </div>
                          </td>
                          {days.map((day: string) => (
                            <td key={day} className="p-2 text-center">
                              <div
                                className={`mx-auto flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${getShiftColor(assignment.shifts[day])}`}
                              >
                                {getShiftIcon(assignment.shifts[day])}
                                <span>{getShiftLabel(assignment.shifts[day])}</span>
                              </div>
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Shift Legend */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-muted-foreground">Legend:</span>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 rounded-md border px-2 py-1 ${getShiftColor('morning')}`}>
                  <Sunrise className="h-3 w-3" />
                  <span>Morning</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 rounded-md border px-2 py-1 ${getShiftColor('afternoon')}`}>
                  <Sun className="h-3 w-3" />
                  <span>Afternoon</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 rounded-md border px-2 py-1 ${getShiftColor('night')}`}>
                  <Moon className="h-3 w-3" />
                  <span>Night</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`rounded-md border px-2 py-1 ${getShiftColor('off')}`}>
                  <span>Off</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`rounded-md border px-2 py-1 ${getShiftColor('leave')}`}>
                  <span>Leave</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="findings" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isAddFindingOpen} onOpenChange={setIsAddFindingOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Report Finding
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Night Duty Finding</DialogTitle>
                    <DialogDescription>
                      Log any issues or observations from the night shift
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Area</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prod-a">Production Line A</SelectItem>
                          <SelectItem value="prod-b">Production Line B</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="cold">Cold Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Severity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Finding Description</Label>
                      <Input placeholder="Describe the finding..." />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddFindingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddFinding}>Submit</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockNightFindings.map((finding: NightDutyFinding, index: number) => (
                <motion.div
                  key={finding.id}
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
                              finding.severity === 'Critical'
                                ? 'bg-destructive/10'
                                : finding.severity === 'Major'
                                  ? 'bg-accent/500/10'
                                  : 'bg-secondary/500/10'
                            }`}
                          >
                            <AlertCircle
                              className={`h-5 w-5 ${
                                finding.severity === 'Critical'
                                  ? 'text-destructive'
                                  : finding.severity === 'Major'
                                    ? 'text-accent-foreground'
                                    : 'text-secondary-foreground'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{finding.id}</span>
                              <Badge className={getSeverityColor(finding.severity)}>
                                {finding.severity}
                              </Badge>
                              <Badge variant={finding.status === 'Open' ? 'outline' : 'secondary'}>
                                {finding.status}
                              </Badge>
                            </div>
                            <p className="mt-1">{finding.finding}</p>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                {finding.area}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {finding.shift}
                              </span>
                              <span className="flex items-center gap-1">
                                <UserCheck className="h-3.5 w-3.5" />
                                {finding.supervisor}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {finding.date.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {finding.status === 'Open' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success('Finding marked as resolved')}
                          >
                            Mark Resolved
                          </Button>
                        )}
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
