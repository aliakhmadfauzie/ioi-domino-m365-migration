import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  Clock,
  Star,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  FileText,
  CheckCircle2,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Intern {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  department: string;
  supervisor: string;
  startDate: Date;
  endDate: Date;
  status: 'Active' | 'Completed' | 'Pending Start' | 'Terminated';
  type: 'Industrial Training' | 'IOI Scholar' | 'Summer Intern' | 'Graduate Trainee';
  performanceRating: number | null;
  completionProgress: number;
  allowance: number;
  ojtModules: { name: string; completed: boolean }[];
}

// Mock data
const mockInterns: Intern[] = [
  {
    id: 'INT-001',
    name: 'Nurul Amirah binti Razak',
    email: 'nurul.amirah@student.usm.my',
    phone: '+60 12-111 2222',
    university: 'Universiti Sains Malaysia',
    program: 'BSc Chemical Engineering',
    department: 'Production',
    supervisor: 'Ahmad bin Hassan',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-08-31'),
    status: 'Active',
    type: 'Industrial Training',
    performanceRating: 4.2,
    completionProgress: 45,
    allowance: 800,
    ojtModules: [
      { name: 'Safety Induction', completed: true },
      { name: 'Quality Systems', completed: true },
      { name: 'Production Processes', completed: false },
      { name: 'Equipment Operation', completed: false },
    ],
  },
  {
    id: 'INT-002',
    name: 'Muhammad Haziq bin Ismail',
    email: 'haziq.ismail@student.utm.my',
    phone: '+60 13-222 3333',
    university: 'Universiti Teknologi Malaysia',
    program: 'BEng Mechanical Engineering',
    department: 'Maintenance',
    supervisor: 'Michael Tan',
    startDate: new Date('2026-02-15'),
    endDate: new Date('2026-07-15'),
    status: 'Active',
    type: 'IOI Scholar',
    performanceRating: 4.5,
    completionProgress: 60,
    allowance: 1200,
    ojtModules: [
      { name: 'Safety Induction', completed: true },
      { name: 'Maintenance Fundamentals', completed: true },
      { name: 'Preventive Maintenance', completed: true },
      { name: 'Troubleshooting', completed: false },
    ],
  },
  {
    id: 'INT-003',
    name: 'Tan Wei Lin',
    email: 'weilin.tan@student.um.edu.my',
    phone: '+60 14-333 4444',
    university: 'Universiti Malaya',
    program: 'BSc Food Science',
    department: 'Quality Control',
    supervisor: 'Siti Nurhaliza',
    startDate: new Date('2026-01-10'),
    endDate: new Date('2026-06-10'),
    status: 'Active',
    type: 'Industrial Training',
    performanceRating: 4.0,
    completionProgress: 75,
    allowance: 800,
    ojtModules: [
      { name: 'Safety Induction', completed: true },
      { name: 'Lab Procedures', completed: true },
      { name: 'Quality Testing', completed: true },
      { name: 'Documentation', completed: true },
      { name: 'Audit Preparation', completed: false },
    ],
  },
  {
    id: 'INT-004',
    name: 'Priya Nair',
    email: 'priya.nair@student.upm.edu.my',
    phone: '+60 15-444 5555',
    university: 'Universiti Putra Malaysia',
    program: 'BSc Human Resource Management',
    department: 'Human Resources',
    supervisor: 'Wong Mei Ling',
    startDate: new Date('2026-05-15'),
    endDate: new Date('2026-10-15'),
    status: 'Pending Start',
    type: 'Summer Intern',
    performanceRating: null,
    completionProgress: 0,
    allowance: 700,
    ojtModules: [
      { name: 'Safety Induction', completed: false },
      { name: 'HR Systems', completed: false },
      { name: 'Recruitment Process', completed: false },
      { name: 'Employee Relations', completed: false },
    ],
  },
  {
    id: 'INT-005',
    name: 'Ahmad Firdaus bin Yusof',
    email: 'firdaus.yusof@graduate.ioi.com',
    phone: '+60 16-555 6666',
    university: 'Universiti Kebangsaan Malaysia',
    program: 'MBA Operations Management',
    department: 'Operations',
    supervisor: 'Dato\'  Lim Ah Kow',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2026-08-31'),
    status: 'Active',
    type: 'Graduate Trainee',
    performanceRating: 4.7,
    completionProgress: 70,
    allowance: 3500,
    ojtModules: [
      { name: 'Company Overview', completed: true },
      { name: 'Department Rotations', completed: true },
      { name: 'Project Management', completed: true },
      { name: 'Leadership Training', completed: false },
      { name: 'Strategic Planning', completed: false },
    ],
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
  'Operations',
];

const internTypes = [
  'All Types',
  'Industrial Training',
  'IOI Scholar',
  'Summer Intern',
  'Graduate Trainee',
];

export default function InternshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredInterns = mockInterns.filter((intern: Intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'All Departments' || intern.department === selectedDepartment;
    const matchesType = selectedType === 'All Types' || intern.type === selectedType;
    const matchesStatus =
      selectedStatus === 'all' ||
      intern.status.toLowerCase().replace(' ', '-') === selectedStatus;
    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  const stats = {
    total: mockInterns.length,
    active: mockInterns.filter((i: Intern) => i.status === 'Active').length,
    ioiScholars: mockInterns.filter((i: Intern) => i.type === 'IOI Scholar').length,
    pendingStart: mockInterns.filter((i: Intern) => i.status === 'Pending Start').length,
    avgRating:
      mockInterns
        .filter((i: Intern) => i.performanceRating !== null)
        .reduce((sum: number, i: Intern) => sum + (i.performanceRating || 0), 0) /
      mockInterns.filter((i: Intern) => i.performanceRating !== null).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary/50/10 text-primary dark:text-primary';
      case 'Completed':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-secondary-foreground';
      case 'Pending Start':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground';
      case 'Terminated':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Industrial Training':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-accent-foreground border-secondary/20';
      case 'IOI Scholar':
        return 'bg-accent/500/10 text-accent-foreground dark:text-accent-foreground border-accent/20';
      case 'Summer Intern':
        return 'bg-secondary/500/10 text-secondary-foreground dark:text-secondary-foreground border-secondary/20';
      case 'Graduate Trainee':
        return 'bg-primary/50/10 text-primary dark:text-primary border-primary/20';
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

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating
              ? 'fill-amber-400 text-accent-foreground'
              : i <= rating + 0.5
                ? 'fill-amber-400/50 text-accent-foreground'
                : 'text-muted-foreground/30'
          }`}
        />
      );
    }
    return stars;
  };

  const handleAddIntern = () => {
    toast.success('Intern application submitted');
    setIsAddDialogOpen(false);
  };

  return (
    <HRLayout title="Internship Program" subtitle="Industrial trainees and IOI scholars">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Internship Program</h1>
            <p className="text-muted-foreground">
              Manage industrial trainees, IOI scholars, and graduate programs
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
                  New Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Intern Application</DialogTitle>
                  <DialogDescription>
                    Register a new intern or trainee for the program
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="student@university.edu.my" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>University</Label>
                      <Input placeholder="e.g., Universiti Malaya" />
                    </div>
                    <div className="space-y-2">
                      <Label>Program of Study</Label>
                      <Input placeholder="e.g., BSc Chemical Engineering" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Internship Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="industrial">Industrial Training</SelectItem>
                          <SelectItem value="scholar">IOI Scholar</SelectItem>
                          <SelectItem value="summer">Summer Intern</SelectItem>
                          <SelectItem value="graduate">Graduate Trainee</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Supervisor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sup1">Ahmad bin Hassan</SelectItem>
                        <SelectItem value="sup2">Siti Nurhaliza</SelectItem>
                        <SelectItem value="sup3">Michael Tan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddIntern}>Submit Application</Button>
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
                <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All programs</p>
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
                <p className="text-xs text-muted-foreground">Currently training</p>
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
                <CardTitle className="text-sm font-medium">IOI Scholars</CardTitle>
                <Award className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{stats.ioiScholars}</div>
                <p className="text-xs text-muted-foreground">Scholarship holders</p>
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
                <CardTitle className="text-sm font-medium">Pending Start</CardTitle>
                <Clock className="h-4 w-4 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-foreground">{stats.pendingStart}</div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
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
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
                <div className="flex mt-1">{getRatingStars(stats.avgRating)}</div>
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
                  placeholder="Search by name, university, or ID..."
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
                <SelectTrigger className="w-[180px]">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {internTypes.map((type: string) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending-start">Pending Start</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interns Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredInterns.map((intern: Intern, index: number) => (
              <motion.div
                key={intern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(intern.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{intern.name}</CardTitle>
                          <CardDescription className="text-xs">{intern.id}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookOpen className="mr-2 h-4 w-4" />
                            OJT Progress
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            {intern.email}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            {intern.phone}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getTypeColor(intern.type)}>
                        {intern.type}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(intern.status)}>
                        {intern.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{intern.university}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{intern.program}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{intern.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {intern.startDate.toLocaleDateString()} -{' '}
                          {intern.endDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {intern.performanceRating !== null && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rating:</span>
                        <div className="flex">{getRatingStars(intern.performanceRating)}</div>
                        <span className="text-sm font-medium">
                          {intern.performanceRating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">OJT Progress</span>
                        <span className="font-medium">{intern.completionProgress}%</span>
                      </div>
                      <Progress value={intern.completionProgress} className="h-2" />
                      <div className="flex flex-wrap gap-1">
                        {intern.ojtModules.map((module: { name: string; completed: boolean }) => (
                          <Badge
                            key={module.name}
                            variant="outline"
                            className={`text-xs ${
                              module.completed
                                ? 'bg-primary/50/10 text-primary dark:text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {module.completed ? (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            ) : (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {module.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </HRLayout>
  );
}
