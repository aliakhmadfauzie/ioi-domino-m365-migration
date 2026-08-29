import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Wrench,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  XCircle,
  AlertTriangle,
  Flame,
  Eye,
  CalendarCheck,
  FileSpreadsheet,
  Inbox,
  Search,
  Gauge,
  Activity,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

interface FormConfig {
  code: string;
  sharePointCode: string;
  name: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  isFrequent: boolean;
  icon: LucideIcon;
  description: string;
}

interface FormCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  colorClass: string;
  borderClass: string;
  forms: FormConfig[];
}

// Form categories for MTR department
const formCategories: FormCategory[] = [
  {
    id: 'failure-analysis',
    name: 'Failure Analysis & Reporting',
    icon: AlertTriangle,
    colorClass: 'bg-destructive',
    borderClass: 'border-l-destructive',
    forms: [
      {
        code: 'FAR',
        sharePointCode: 'FAILANALREPO',
        name: 'Failure Analysis Report',
        priority: 'critical',
        isFrequent: true,
        icon: AlertTriangle,
        description: 'Equipment failure root cause analysis and corrective actions (IMS Critical)',
      },
    ],
  },
  {
    id: 'planning',
    name: 'Maintenance Planning',
    icon: CalendarCheck,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      {
        code: 'MTP',
        sharePointCode: 'MAINPLAN',
        name: 'Maintenance Plan',
        priority: 'high',
        isFrequent: true,
        icon: CalendarCheck,
        description: 'Preventive and predictive maintenance scheduling',
      },
      {
        code: 'PMD',
        sharePointCode: 'PLANMAINDOCU',
        name: 'Plant Maintenance Documentation',
        priority: 'medium',
        isFrequent: false,
        icon: FileSpreadsheet,
        description: 'Plant equipment maintenance records and history',
      },
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency Procedures',
    icon: Flame,
    colorClass: 'bg-destructive',
    borderClass: 'border-l-destructive',
    forms: [
      {
        code: 'MECP',
        sharePointCode: 'MTNEMERCHAN',
        name: 'MTN Emergency Change Procedure',
        priority: 'critical',
        isFrequent: true,
        icon: Flame,
        description: 'Emergency maintenance change requests and approvals',
      },
    ],
  },
  {
    id: 'inspection',
    name: 'Equipment Inspection',
    icon: Eye,
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    forms: [
      {
        code: 'EPI',
        sharePointCode: 'EQUIPREINSP',
        name: 'Equipment Pre-Inspection',
        priority: 'high',
        isFrequent: true,
        icon: Eye,
        description: 'Pre-operation equipment safety and readiness checks',
      },
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

export default function MTRDepartmentHomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalForms = formCategories.reduce((acc: number, cat: FormCategory) => acc + cat.forms.length, 0);
    return {
      totalForms,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      totalSubmissions: 0,
    };
  }, []);

  // Filter categories based on search and selection
  const filteredCategories = useMemo(() => {
    return formCategories.filter((category: FormCategory) => {
      if (selectedCategory && category.id !== selectedCategory) return false;
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          category.forms.some(
            (form: FormConfig) => form.name.toLowerCase().includes(query) || form.code.toLowerCase().includes(query)
          )
        );
      }
      return true;
    });
  }, [debouncedSearch, selectedCategory]);

  // Get frequent forms across all categories
  const frequentForms = useMemo(() => {
    return formCategories
      .flatMap((cat: FormCategory) =>
        cat.forms.filter((f: FormConfig) => f.isFrequent).map((f: FormConfig) => ({ ...f, category: cat.name, colorClass: cat.colorClass }))
      )
      .slice(0, 8);
  }, []);

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
            <div className="p-2.5 bg-amber-500 rounded-xl">
              <Wrench className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          </div>
          <p className="text-muted-foreground">Equipment maintenance, failure analysis, energy efficiency & plant upkeep</p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/mtr/forms/far/new">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Connection Banner */}
      <motion.div variants={itemVariants}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>SharePoint Connection Required</AlertTitle>
          <AlertDescription>
            Connect the <strong>ioi-portal-mtr</strong> SharePoint site via the Data panel to enable live submission tracking.
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
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
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
                <p className="text-2xl font-bold">{stats.approvedCount}</p>
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
                <p className="text-2xl font-bold">{stats.rejectedCount}</p>
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

      {/* Quick Access Forms */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Quick Access Forms</CardTitle>
                <CardDescription>Access maintenance forms with one click</CardDescription>
              </div>
              <Badge variant="secondary">{frequentForms.length} forms</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {frequentForms.map((form: FormConfig & { category: string; colorClass: string }) => {
                const FormIcon = form.icon;
                return (
                  <Link
                    key={form.code}
                    to={`/mtr/forms/${form.code.toLowerCase()}/new`}
                    className="flex items-center gap-4 p-4 min-h-[80px] rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98] group"
                  >
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${form.colorClass}`}>
                      <FormIcon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{form.code}</p>
                      <p className="text-sm text-muted-foreground truncate">{form.name}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="forms">Forms Library</TabsTrigger>
          <TabsTrigger value="dashboard">Maintenance Dashboard</TabsTrigger>
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
              {formCategories.map((cat: FormCategory) => (
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
            <motion.div variants={containerVariants} className="grid md:grid-cols-1 lg:grid-cols-1 gap-4">
              {filteredCategories.map((category: FormCategory) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card className={`h-full hover:shadow-lg transition-shadow border-l-4 ${category.borderClass}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${category.colorClass}`}>
                          <category.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.forms.length} form{category.forms.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {category.forms.map((form: FormConfig) => {
                        const FormIcon = form.icon;
                        return (
                          <Link
                            key={form.code}
                            to={`/mtr/forms/${form.code.toLowerCase()}/new`}
                            className="flex items-center gap-4 p-4 min-h-[72px] rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors active:scale-[0.98] group"
                          >
                            <div className="p-2 rounded-lg bg-muted">
                              <FormIcon className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                                <span className="font-medium">{form.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{form.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {getPriorityBadge(form.priority)}
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Maintenance Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Open Failures</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <CalendarCheck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">18</p>
                    <p className="text-sm text-muted-foreground">Scheduled PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                    <Flame className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Emergency Changes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <Activity className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">97.2%</p>
                    <p className="text-sm text-muted-foreground">Equipment Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Failure Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Recent Failure Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { equipment: 'Pump Station A3', reported: '2024-03-14 09:30', status: 'investigation', severity: 'critical' },
                    { equipment: 'Conveyor Belt B7', reported: '2024-03-13 14:15', status: 'rca', severity: 'high' },
                    { equipment: 'Compressor Unit 2', reported: '2024-03-12 11:00', status: 'capa', severity: 'medium' },
                  ].map((report: { equipment: string; reported: string; status: string; severity: string }, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{report.equipment}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{report.reported}</span>
                        </div>
                      </div>
                      <Badge variant={report.severity === 'critical' ? 'destructive' : report.severity === 'high' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  Upcoming Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { equipment: 'Boiler Unit 1', type: 'PM', scheduled: '2024-03-16', technician: 'Ahmad Rahman' },
                    { equipment: 'Motor Generator Set', type: 'Inspection', scheduled: '2024-03-17', technician: 'Lee Wei Ming' },
                    { equipment: 'Heat Exchanger A', type: 'Calibration', scheduled: '2024-03-18', technician: 'Raj Kumar' },
                  ].map((task: { equipment: string; type: string; scheduled: string; technician: string }, index: number) => (
                    <div key={index} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{task.equipment}</p>
                        <Badge variant="secondary">{task.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" />
                          <span>{task.scheduled}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{task.technician}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-accent-foreground" />
                Equipment Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { category: 'Pumps & Motors', operational: 45, maintenance: 3, down: 1, total: 49 },
                  { category: 'Compressors', operational: 12, maintenance: 1, down: 0, total: 13 },
                  { category: 'Conveyors', operational: 28, maintenance: 2, down: 1, total: 31 },
                  { category: 'Heat Exchangers', operational: 18, maintenance: 0, down: 0, total: 18 },
                ].map((cat: { category: string; operational: number; maintenance: number; down: number; total: number }, index: number) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <p className="font-medium mb-3">{cat.category}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Operational</span>
                        <span className="font-medium text-primary">{cat.operational}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">In Maintenance</span>
                        <span className="font-medium text-secondary-foreground">{cat.maintenance}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Down</span>
                        <span className="font-medium text-destructive">{cat.down}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uptime</span>
                          <span className="font-bold">{Math.round((cat.operational / cat.total) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <Empty className="py-12">
                  <EmptyHeader>
                    <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <EmptyTitle>Connect SharePoint</EmptyTitle>
                    <EmptyDescription>Add the ioi-portal-mtr site to view submissions</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/mtr/forms/far/new">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
