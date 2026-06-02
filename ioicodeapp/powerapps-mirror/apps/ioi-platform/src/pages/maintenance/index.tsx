// Maintenance (Engineering) Department Home - Navigation Hub
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Eye,
  XCircle,
  TrendingUp,
  ChevronRight,
  Wrench,
  AlertCircle,
  Activity,
  RefreshCw,
  ClipboardList,
  Calendar,
  Package,
  Settings,
  Cog,
  HardDrive,
  BarChart3,
  Zap,
  Timer,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/hooks/use-user';
import { DataReadyGuard } from '@/components/data-ready-guard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
} as const;

// Maintenance Modules Configuration
const MAINTENANCE_MODULES = [
  {
    code: 'M1',
    name: 'Work Requests',
    description: 'Corrective maintenance, breakdown reports, urgent repairs',
    icon: ClipboardList,
    path: '/maintenance/work-requests',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: ['WRQ', 'BRK', 'URG', 'COR', 'REP'],
    quickForm: { code: 'WRQ', name: 'Work Request', path: '/maintenance/forms/wrq/new' },
  },
  {
    code: 'M2',
    name: 'Preventive Maintenance',
    description: 'Scheduled maintenance, inspections, PM schedules',
    icon: Calendar,
    path: '/maintenance/preventive',
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    formCodes: ['PM', 'INS', 'SCH', 'CHK', 'LUB'],
    quickForm: { code: 'PM', name: 'PM Schedule', path: '/maintenance/forms/pm/new' },
  },
  {
    code: 'M3',
    name: 'Spare Parts',
    description: 'Parts inventory, requisitions, usage tracking',
    icon: Package,
    path: '/maintenance/spare-parts',
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    formCodes: ['SPR', 'REQ', 'ISS', 'RET', 'STK'],
    quickForm: { code: 'SPR', name: 'Parts Request', path: '/maintenance/forms/spr/new' },
  },
  {
    code: 'M4',
    name: 'Equipment Registry',
    description: 'Asset management, equipment records, maintenance history',
    icon: HardDrive,
    path: '/maintenance/equipment',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: ['EQP', 'REG', 'HIS', 'CAL', 'DOC'],
    quickForm: { code: 'EQP', name: 'Register Equipment', path: '/maintenance/forms/eqp/new' },
  },
];

// Mock data for demo
const mockStats = {
  thisMonth: 189,
  pending: 34,
  completed: 312,
  overdue: 12,
  total: 546,
};

const mockModuleStats = MAINTENANCE_MODULES.map((module, index) => ({
  ...module,
  total: 120 + index * 25,
  pending: 8 + index * 2,
  completed: 95 + index * 18,
  overdue: 2 + index,
  thisMonth: 40 + index * 12,
}));

const mockRecentSubmissions = [
  { id: '1', title: 'WRQ-2024-0456 - Pump Motor Failure', formcode: 'WRQ', status: 'In Progress', submitteddate: '1 hour ago' },
  { id: '2', title: 'PM-2024-0892 - Monthly Inspection Line 3', formcode: 'PM', status: 'Completed', submitteddate: '3 hours ago' },
  { id: '3', title: 'SPR-2024-0234 - Bearing Replacement', formcode: 'SPR', status: 'Pending', submitteddate: '5 hours ago' },
  { id: '4', title: 'EQP-2024-0078 - Compressor Registration', formcode: 'EQP', status: 'Approved', submitteddate: '1 day ago' },
  { id: '5', title: 'BRK-2024-0123 - Conveyor Belt Breakdown', formcode: 'BRK', status: 'Urgent', submitteddate: '2 days ago' },
];

function MaintenanceDepartmentHomeContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const overdueCount = mockStats.overdue;

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-24 md:pb-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary rounded-xl">
              <Wrench className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance & Engineering</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! Select a module below to get started.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/maintenance/forms/wrq/new">
              <Plus className="h-4 w-4 mr-2" />
              New Work Request
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{mockStats.thisMonth}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{mockStats.pending}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{mockStats.completed}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{mockStats.overdue}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{mockStats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Banner */}
      {overdueCount > 0 && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Overdue Work Orders</AlertTitle>
            <AlertDescription>
              {overdueCount} work order{overdueCount > 1 ? 's are' : ' is'} overdue and require{overdueCount === 1 ? 's' : ''} immediate attention.
              <Link to="/maintenance/work-requests?status=overdue" className="ml-2 underline font-medium">
                View overdue items
              </Link>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Module Cards */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Maintenance Modules</h2>
            <p className="text-sm text-muted-foreground">Select a module to view its dashboard and manage work orders</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/maintenance/forms">
              View All Forms
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {mockModuleStats.map((module) => (
            <motion.div
              key={module.code}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                className={`h-full cursor-pointer hover:shadow-lg transition-all border-l-4 ${module.borderClass}`}
                onClick={() => navigate(module.path)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${module.colorClass} shrink-0`}>
                      <module.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">{module.code}</Badge>
                        <CardTitle className="text-lg truncate">{module.name}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium">{module.pending}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium">{module.completed}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">Overdue:</span>
                      <span className="font-medium">{module.overdue}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">{module.thisMonth} this month · {module.total} total</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        navigate(module.quickForm.path);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {module.quickForm.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest work orders and requests</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/my-submissions">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockRecentSubmissions.map((submission) => (
                  <button
                    type="button"
                    key={submission.id}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/submissions/${submission.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium truncate">{submission.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{submission.formcode}</span>
                            <span>•</span>
                            <span>{submission.submitteddate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={submission.status === 'Urgent' ? 'destructive' : 'secondary'}>{submission.status}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>Tools, dashboards, and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link
                  to="/maintenance/schedule"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">PM Schedule</p>
                    <p className="text-sm text-muted-foreground">View maintenance calendar</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/maintenance/equipment"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <Cog className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Equipment List</p>
                    <p className="text-sm text-muted-foreground">Asset registry</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/maintenance/downtime"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Timer className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Downtime Tracker</p>
                    <p className="text-sm text-muted-foreground">Equipment availability</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/maintenance/reports"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Maintenance Reports</p>
                    <p className="text-sm text-muted-foreground">KPIs and analytics</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-50">
        <div className="flex gap-2">
          <Sheet open={submissionsOpen} onOpenChange={setSubmissionsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 min-h-[48px]">
                <Eye className="h-4 w-4 mr-2" />
                Submissions
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Recent Work Orders</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {mockRecentSubmissions.map((submission) => (
                  <button
                    type="button"
                    key={submission.id}
                    className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSubmissionsOpen(false);
                      navigate(`/submissions/${submission.id}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{submission.title}</p>
                      <Badge variant={submission.status === 'Urgent' ? 'destructive' : 'secondary'}>{submission.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{submission.formcode}</p>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/maintenance/forms/wrq/new">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MaintenanceDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading Maintenance dashboard...">
      <MaintenanceDepartmentHomeContent />
    </DataReadyGuard>
  );
}
