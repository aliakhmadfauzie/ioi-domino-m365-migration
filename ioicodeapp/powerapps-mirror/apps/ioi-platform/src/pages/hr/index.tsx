// HR Department Home - Matches IT Department UI Template

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Users,
  Briefcase,
  Heart,
  Eye,
  Inbox,
  XCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Shield,
  Calendar,
  MapPin,
  BarChart3,
  AlertTriangle,
  Building2,
  UserCheck,
  GraduationCap,
  Network,
  Paperclip,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/hooks/use-user';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { useMainDBHRList } from '@/generated/hooks/use-main-dbhr';
import { MainDBHRStatusKeyToLabel, type MainDBHRStatusKey } from '@/generated/models/main-dbhr-model';
import type { LucideIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.02 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

// Form categories matching HR forms config structure
const formCategories = [
  {
    id: 'recruitment',
    name: 'Recruitment & Hiring',
    icon: Briefcase,
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    forms: [
      { code: 'SR', name: 'Staff Requisition', priority: 'critical', isFrequent: true, route: '/hr/sr' },
      { code: 'CWR', name: 'Contract Worker Request', priority: 'high', isFrequent: true, route: '/hr/cwr' },
      { code: 'FTCR', name: 'Fixed Term Contract Request', priority: 'high', isFrequent: false, route: '/hr/ftcr' },
      { code: 'INTERVIEWDB', name: 'Interview Database', priority: 'medium', isFrequent: false, route: '/hr/interview-db' },
      { code: 'JD', name: 'Job Description Form', priority: 'high', isFrequent: true, route: '/hr/jd' },
      { code: 'INTERN', name: 'Internship Application', priority: 'medium', isFrequent: false, route: '/hr/intern' },
    ],
  },
  {
    id: 'leave',
    name: 'Leave & Attendance',
    icon: Calendar,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'LVE', name: 'Leave Application 2025', priority: 'critical', isFrequent: true, route: '/hr/lve' },
      { code: 'OWP', name: 'Overtime & Work Pass', priority: 'high', isFrequent: true, route: '/hr/owp' },
      { code: 'FWWPE', name: 'Flexible Work Arrangement', priority: 'medium', isFrequent: false, route: '/hr/fwwpe' },
    ],
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: Heart,
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    forms: [
      { code: 'CIR', name: 'Cafeteria Inspection', priority: 'high', isFrequent: true, route: '/hr/cafeteria' },
      { code: 'HEALTHINFO', name: 'Health Information Form', priority: 'high', isFrequent: true, route: '/hr/healthinfo' },
      { code: 'MCL', name: 'Medical Claim Form', priority: 'high', isFrequent: true, route: '/hr/mcl' },
      { code: 'HSE', name: 'Health & Safety Report', priority: 'medium', isFrequent: false, route: '/hr/hse' },
    ],
  },
  {
    id: 'performance',
    name: 'Performance & Training',
    icon: Award,
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    forms: [
      { code: 'PAF', name: 'Performance Appraisal Form', priority: 'critical', isFrequent: true, route: '/hr/paf' },
      { code: 'TMPU', name: 'Training & Development Plan', priority: 'high', isFrequent: true, route: '/hr/tmpu' },
      { code: 'HRAPR', name: 'HR Annual Performance Review', priority: 'high', isFrequent: false, route: '/hr/hrapr' },
    ],
  },
  {
    id: 'employee',
    name: 'Employee Records',
    icon: Users,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'EPDU', name: 'Employee Personal Data Update', priority: 'high', isFrequent: true, route: '/hr/epdu' },
      { code: 'HRINFO', name: 'HR Information Sheet', priority: 'medium', isFrequent: false, route: '/hr/hrinfo' },
      { code: 'GDSN', name: 'General Data Subject Notification', priority: 'medium', isFrequent: false, route: '/hr/gdsn' },
    ],
  },
  {
    id: 'documents',
    name: 'Documents & Forms',
    icon: FileText,
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    forms: [
      { code: 'BSD', name: 'Backup Staff Declaration', priority: 'high', isFrequent: true, route: '/hr/bsd' },
      { code: 'NDF', name: 'New Document Form', priority: 'medium', isFrequent: false, route: '/hr/ndf' },
      { code: 'ESF', name: 'Employee Separation Form', priority: 'high', isFrequent: false, route: '/hr/esf' },
      { code: 'EEN', name: 'Employee Exit Notification', priority: 'high', isFrequent: false, route: '/hr/een' },
    ],
  },
];

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">critical</Badge>;
    case 'high':
      return <Badge variant="default">high</Badge>;
    case 'medium':
      return <Badge variant="secondary">medium</Badge>;
    default:
      return <Badge variant="outline">low</Badge>;
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-primary" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    default:
      return <div className="h-4 w-4 rounded-full bg-muted" />;
  }
}

function HRDepartmentHomePageContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

  // Fetch real data from SharePoint
  const { data: submissions = [], isLoading } = useMainDBHRList({
    orderBy: ['submittedon desc'],
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalForms = formCategories.reduce((acc: number, cat) => acc + cat.forms.length, 0);
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    for (const s of submissions) {
      if (s.statusKey === 'StatusKey1' || s.statusKey === 'StatusKey2') {
        pendingCount++;
      } else if (s.statusKey === 'StatusKey3') {
        approvedCount++;
      } else if (s.statusKey === 'StatusKey4') {
        rejectedCount++;
      }
    }

    return {
      totalForms,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalSubmissions: submissions.length,
    };
  }, [submissions]);

  // Filter categories based on search and selection
  const filteredCategories = useMemo(() => {
    return formCategories.filter((category) => {
      if (selectedCategory && category.id !== selectedCategory) return false;
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          category.forms.some(
            (form) => form.name.toLowerCase().includes(query) || form.code.toLowerCase().includes(query)
          )
        );
      }
      return true;
    });
  }, [debouncedSearch, selectedCategory]);

  // Get frequent forms across all categories
  const frequentForms = useMemo(() => {
    return formCategories
      .flatMap((cat) =>
        cat.forms.filter((f) => f.isFrequent).map((f) => ({ ...f, category: cat.name, colorClass: cat.colorClass }))
      )
      .slice(0, 8);
  }, []);

  // Recent submissions (last 5)
  const recentSubmissions = submissions.slice(0, 5);

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
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">HR Department</h1>
          </div>
          <p className="text-muted-foreground">Recruitment, leave management, health & employee records</p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/hr/bsd">
              <ClipboardList className="h-4 w-4 mr-2" />
              BSD
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/hr/esf">
              <Paperclip className="h-4 w-4 mr-2" />
              ESF
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              Submissions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/hr/lve">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Connection Banner */}
      <motion.div variants={itemVariants}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>SharePoint Connected</AlertTitle>
          <AlertDescription>
            Connected to <strong>MainDB_HR (PRAI)</strong> SharePoint site. {submissions.length} submissions loaded.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{isLoading ? '...' : stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{isLoading ? '...' : stats.approvedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{isLoading ? '...' : stats.rejectedCount}</p>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Forms</p>
                <p className="text-2xl font-bold">{stats.totalForms}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Frequent Forms - Quick Access */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Frequently Used Forms</CardTitle>
                <CardDescription>Quick access to the forms you use most</CardDescription>
              </div>
              <Badge variant="secondary">{frequentForms.length} forms</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {frequentForms.map((form) => (
                <Link
                  key={form.code}
                  to={form.route}
                  className="flex items-center gap-3 p-4 min-h-[56px] rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${form.colorClass}`}>
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{form.code}</p>
                    <p className="text-sm text-muted-foreground truncate">{form.name}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="forms">Forms Library</TabsTrigger>
          <TabsTrigger value="workforce">Workforce Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          {/* Search and Filter */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms by name or code..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                className="min-h-[44px] whitespace-nowrap"
                onClick={() => setSelectedCategory(null)}
              >
                All ({stats.totalForms})
              </Button>
              {formCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  className="min-h-[44px] whitespace-nowrap"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name.split(' ')[0]}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Form Categories Grid */}
          {filteredCategories.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>No forms found</EmptyTitle>
                <EmptyDescription>Try adjusting your search or filter criteria</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card className={`h-full hover:shadow-lg transition-shadow border-l-4 ${category.borderClass}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${category.colorClass}`}>
                          <category.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.forms.length} forms</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {category.forms.slice(0, 5).map((form) => (
                        <Link
                          key={form.code}
                          to={form.route}
                          className="flex items-center justify-between p-3 min-h-[48px] rounded-md bg-card hover:bg-accent hover:text-accent-foreground transition-colors active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                            <span className="text-sm truncate">{form.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getPriorityBadge(form.priority)}
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                      {category.forms.length > 5 && (
                        <Button variant="ghost" size="sm" className="w-full mt-2 min-h-[44px]" asChild>
                          <Link to={`/hr/forms?category=${category.id}`}>
                            View all {category.forms.length} forms
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="workforce" className="space-y-6">
          {/* Workforce Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">847</p>
                    <p className="text-sm text-muted-foreground">Total Headcount</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Open Positions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Pending Exits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">94.2%</p>
                    <p className="text-sm text-muted-foreground">Retention Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Department Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Production', category: 'Operations', count: 245, percentage: 29, location: 'MY-PR', trend: 'up' },
                    { name: 'Engineering', category: 'Technical', count: 156, percentage: 18, location: 'MY-PR', trend: 'up' },
                    { name: 'Quality Assurance', category: 'Operations', count: 98, percentage: 12, location: 'MY-PR', trend: 'stable' },
                    { name: 'Supply Chain', category: 'Logistics', count: 87, percentage: 10, location: 'MY-PR', trend: 'down' },
                    { name: 'Administration', category: 'Support', count: 65, percentage: 8, location: 'MY-PR', trend: 'stable' },
                  ].map((dept, index: number) => (
                    <div key={dept.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{dept.name}</p>
                          {getTrendIcon(dept.trend)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{dept.category}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{dept.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{dept.count}</p>
                        <p className="text-xs text-muted-foreground">{dept.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recruitment Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Recruitment Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { position: 'Senior Process Engineer', department: 'Engineering', stage: 'Interview', daysOpen: 14 },
                    { position: 'QA Supervisor', department: 'Quality', stage: 'Offer', daysOpen: 21 },
                    { position: 'Production Operator', department: 'Production', stage: 'Screening', daysOpen: 7 },
                    { position: 'HR Executive', department: 'HR', stage: 'Interview', daysOpen: 10 },
                  ].map((job) => (
                    <div key={job.position} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{job.position}</p>
                        <Badge variant={job.stage === 'Offer' ? 'default' : 'secondary'}>
                          {job.stage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{job.department}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{job.daysOpen} days open</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Training Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Upcoming Training Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { program: 'Safety Awareness 2025', participants: 45, date: '2025-06-15', completion: 65 },
                  { program: 'Leadership Development', participants: 12, date: '2025-06-20', completion: 40 },
                  { program: 'Technical Skills Update', participants: 28, date: '2025-07-01', completion: 20 },
                ].map((training) => (
                  <div key={training.program} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">
                        {training.participants} enrolled
                      </Badge>
                      <span className="font-mono text-sm">{training.date}</span>
                    </div>
                    <p className="font-medium text-sm">{training.program}</p>
                    <p className="text-xs text-muted-foreground mt-1">Completion: {training.completion}%</p>
                    <Progress value={training.completion} className="h-1.5 mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* HR Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                HR Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">12d</p>
                  <p className="text-sm text-muted-foreground">Avg Time to Hire</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">92%</p>
                  <p className="text-sm text-muted-foreground">Onboarding Completion</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">4.6</p>
                  <p className="text-sm text-muted-foreground">Employee Satisfaction</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">234</p>
                  <p className="text-sm text-muted-foreground">Forms This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Mobile CTA */}
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
                <SheetTitle>Recent Submissions</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                {recentSubmissions.length === 0 ? (
                  <Empty className="py-12">
                    <EmptyHeader>
                      <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <EmptyTitle>No submissions yet</EmptyTitle>
                      <EmptyDescription>Create your first HR request</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="space-y-2">
                    {recentSubmissions.map((submission) => (
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
                          <p className="font-medium truncate">{submission.title || 'Untitled'}</p>
                          <Badge variant="secondary">
                            {MainDBHRStatusKeyToLabel[submission.statusKey as MainDBHRStatusKey] || 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{submission.formcode}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/hr/lve">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function HRDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading HR dashboard...">
      <HRDepartmentHomePageContent />
    </DataReadyGuard>
  );
}
