import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Factory,
  Cog,
  ClipboardCheck,
  Package,
  Gauge,
  Wrench,
  BarChart3,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Settings,
  Search,
  Plus,
  ArrowRight,
  Activity,
  Zap,
  ThermometerSun,
  Droplets,
  Menu,
  Home,
  FolderOpen,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMainDBPRDList } from '@/generated/hooks/use-main-dbprd';
import type { MainDBPRD } from '@/generated/models/main-dbprd-model';
import { MainDBPRDSiteKeyToLabel } from '@/generated/models/main-dbprd-model';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

// Production form categories promoted from source analysis.
const formCategories = [
  {
    id: 'inspection',
    code: 'INS',
    title: 'Inspection Records',
    description: 'Equipment and process inspection submissions',
    icon: ClipboardCheck,
    href: '/production/forms?category=sam',
    colorToken: 'primary',
    forms: [
      { code: 'EQUIPREINSP', name: 'Equipment Pre-Inspection Report', priority: 'critical' as const },
      { code: 'FILTCLOTREPL', name: 'Filter Cloth Replacement Record', priority: 'high' as const },
    ],
    pendingCount: 4,
    completedToday: 2,
  },
  {
    id: 'material-stock',
    code: 'MAT',
    title: 'Material & Stock',
    description: 'Material master and stock allocation requests',
    icon: Package,
    href: '/production/forms?category=material',
    colorToken: 'secondary',
    forms: [
      { code: 'SAPMATEMAST', name: 'SAP Material Master Maintenance Request', priority: 'critical' as const },
      { code: 'STOCALLOMEMO', name: 'Stock Allocation Memo', priority: 'high' as const },
    ],
    pendingCount: 3,
    completedToday: 1,
  },
  {
    id: 'ccp',
    code: 'CCP',
    title: 'CCP Monitoring',
    description: 'Critical Control Point inspection & compliance',
    icon: Gauge,
    href: '/production/forms?category=ccp',
    colorToken: 'destructive',
    forms: [
      { code: 'CCP1FILTINSP', name: 'CCP1 Filter Inspection Findings', priority: 'critical' as const },
      { code: 'OPRPCCPFILT', name: 'OPRP/CCP Filter Inspection Record', priority: 'critical' as const },
    ],
    pendingCount: 2,
    completedToday: 3,
  },
  {
    id: 'tank-weighing',
    code: 'TANK',
    title: 'Tank & Weighing',
    description: 'Storage tank and weighing verification records',
    icon: Droplets,
    href: '/production/forms?category=weighing',
    colorToken: 'accent',
    forms: [
      { code: 'STORTANKVERI', name: 'Storage Tank Verification Form', priority: 'high' as const },
      { code: 'STORTANKCLEA', name: 'Storage Tank Cleaning Inspection', priority: 'high' as const },
      { code: 'WEIGSCALVERI', name: 'Weighing Scale Verification', priority: 'medium' as const },
    ],
    pendingCount: 5,
    completedToday: 2,
  },
  {
    id: 'reports',
    code: 'RPT',
    title: 'Production Reports',
    description: 'Promoted production records from Prai and Johor evidence',
    icon: BarChart3,
    href: '/production/forms?category=reports',
    colorToken: 'primary',
    forms: [
      { code: 'TPM', name: 'TPM Database', priority: 'high' as const },
    ],
    pendingCount: 1,
    completedToday: 4,
  },
  {
    id: 'equipment',
    code: 'EQP',
    title: 'Equipment & Process',
    description: 'Drawing, BHT, and TPM production records',
    icon: Settings,
    href: '/production/forms?category=equipment',
    colorToken: 'secondary',
    forms: [
      { code: 'BHTADDI', name: 'BHT Addition Database', priority: 'high' as const },
    ],
    pendingCount: 2,
    completedToday: 1,
  },
];

// Get semantic color classes based on token
function getColorClasses(token: string) {
  switch (token) {
    case 'primary':
      return {
        border: 'border-l-primary',
        bg: 'bg-primary',
        text: 'text-primary-foreground',
        iconBg: 'bg-primary/10',
        iconText: 'text-primary',
      };
    case 'secondary':
      return {
        border: 'border-l-secondary',
        bg: 'bg-secondary',
        text: 'text-secondary-foreground',
        iconBg: 'bg-secondary',
        iconText: 'text-secondary-foreground',
      };
    case 'destructive':
      return {
        border: 'border-l-destructive',
        bg: 'bg-destructive',
        text: 'text-destructive-foreground',
        iconBg: 'bg-destructive/10',
        iconText: 'text-destructive',
      };
    case 'accent':
      return {
        border: 'border-l-accent',
        bg: 'bg-accent',
        text: 'text-accent-foreground',
        iconBg: 'bg-accent',
        iconText: 'text-accent-foreground',
      };
    default:
      return {
        border: 'border-l-muted',
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        iconBg: 'bg-muted',
        iconText: 'text-muted-foreground',
      };
  }
}

// Production lines with live-style data
const productionLines = [
  { id: 'line-a', name: 'Line A - Oleochemicals', status: 'Running' as const, efficiency: 94, output: '2,450 MT', temperature: 185, pressure: 4.2 },
  { id: 'line-b', name: 'Line B - Fatty Acids', status: 'Running' as const, efficiency: 87, output: '1,890 MT', temperature: 165, pressure: 3.8 },
  { id: 'line-c', name: 'Line C - Glycerine', status: 'Maintenance' as const, efficiency: 0, output: '0 MT', temperature: 0, pressure: 0 },
  { id: 'line-d', name: 'Line D - Specialties', status: 'Running' as const, efficiency: 91, output: '980 MT', temperature: 145, pressure: 3.5 },
];

// Quick actions - most used forms
const quickActions = [
  { label: 'New Inspection', href: '/production/forms/EQUIPREINSP/new', icon: ClipboardCheck, code: 'EQUIPREINSP' },
  { label: 'Material Master', href: '/production/forms/SAPMATEMAST/new', icon: Package, code: 'SAPMATEMAST' },
  { label: 'CCP Inspection', href: '/production/forms/CCP1FILTINSP/new', icon: Gauge, code: 'CCP1FILTINSP' },
  { label: 'Stock Memo', href: '/production/forms/STOCALLOMEMO/new', icon: FileText, code: 'STOCALLOMEMO' },
];

// Mobile navigation items
const mobileNavItems = [
  { label: 'Hub', href: '/', icon: Home },
  { label: 'Forms', href: '/production/forms', icon: FolderOpen },
  { label: 'Reports', href: '/production/forms?category=reports', icon: BarChart3 },
  { label: 'Lines', href: '#lines', icon: Activity },
];

type Priority = 'critical' | 'high' | 'medium' | 'low';
type ActivityStatus = 'completed' | 'pending' | 'urgent';
type RecentActivity = { id: string; action: string; user: string; time: string; status: ActivityStatus; line: string };

function getPriorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case 'critical':
      return 'bg-destructive text-destructive-foreground';
    case 'high':
      return 'bg-primary text-primary-foreground';
    case 'medium':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusBadgeClass(status: ActivityStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-accent text-accent-foreground';
    case 'pending':
      return 'bg-secondary text-secondary-foreground';
    case 'urgent':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusIconClass(status: ActivityStatus): string {
  switch (status) {
    case 'completed':
      return 'text-accent-foreground bg-accent';
    case 'pending':
      return 'text-secondary-foreground bg-secondary';
    case 'urgent':
      return 'text-destructive-foreground bg-destructive';
    default:
      return 'text-muted-foreground bg-muted';
  }
}

export default function ProductionDepartmentHomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Connect to SharePoint data
  const { data: prdSubmissions, isLoading } = useMainDBPRDList();

  // Recent activities from SharePoint
  const recentActivities: RecentActivity[] = useMemo(() => {
    if (!prdSubmissions?.length) {
      // Fallback demo data
      return [
        { id: '1', action: 'CCP1 Filter Inspection Findings', user: 'Ahmad Razak', time: '15 min ago', status: 'urgent' as const, line: 'Line B' },
        { id: '2', action: 'TPM Database record completed', user: 'Siti Aminah', time: '1 hour ago', status: 'completed' as const, line: 'Line A' },
        { id: '3', action: 'SAM Stock Allocation Memo submitted', user: 'Lee Wei Ming', time: '2 hours ago', status: 'completed' as const, line: 'QC Lab' },
        { id: '4', action: 'ASMR Production Record submitted', user: 'Muthu Krishnan', time: '3 hours ago', status: 'pending' as const, line: 'Line D' },
        { id: '5', action: 'SAPMMM material request released', user: 'Nor Azizah', time: '4 hours ago', status: 'completed' as const, line: 'Warehouse' },
      ];
    }
    return prdSubmissions.slice(0, 5).map((sub: MainDBPRD) => ({
      id: String(sub.id),
      action: sub.title || sub.formCode || 'Form Submission',
      user: sub.requestorDisplayName || 'Unknown',
      time: sub.submittedOn ? new Date(sub.submittedOn).toLocaleString() : 'Recently',
      status: (sub.statusKey === 'StatusKey3' ? 'completed' : sub.statusKey === 'StatusKey4' ? 'urgent' : 'pending') as ActivityStatus,
      line: sub.siteKey ? MainDBPRDSiteKeyToLabel[sub.siteKey] : 'Prai',
    }));
  }, [prdSubmissions]);

  // Calculate dynamic stats from form categories and SharePoint data
  const stats = useMemo(() => {
    const totalForms = formCategories.reduce((acc: number, cat) => acc + cat.forms.length, 0);
    const pendingReviews = prdSubmissions?.filter((s: MainDBPRD) => s.statusKey === 'StatusKey1').length || 
      formCategories.reduce((acc: number, cat) => acc + cat.pendingCount, 0);
    const completedToday = prdSubmissions?.filter((s: MainDBPRD) => s.statusKey === 'StatusKey3').length || 
      formCategories.reduce((acc: number, cat) => acc + cat.completedToday, 0);
    const alerts = recentActivities.filter((a: RecentActivity) => a.status === 'urgent').length;
    return { totalForms, pendingReviews, completedToday, alerts };
  }, [prdSubmissions, recentActivities]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return formCategories.filter((category) => {
      if (selectedCategory && category.id !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          category.title.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query) ||
          category.forms.some(
            (form) => form.name.toLowerCase().includes(query) || form.code.toLowerCase().includes(query)
          )
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 md:pb-6" aria-hidden="true">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent rounded-xl">
              <Factory className="h-7 w-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Production</h1>
              <p className="text-sm text-muted-foreground">Manufacturing operations, TPM, and process control</p>
            </div>
          </div>
          
          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden h-11 w-11">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Quick Actions</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {
                      navigate(action.href);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <action.icon className="h-5 w-5" />
                    {action.label}
                  </Button>
                ))}
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full h-12 gap-2" 
                    onClick={() => {
                      navigate('/production/forms');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Plus className="h-5 w-5" />
                    All Forms
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop quick actions */}
        <div className="hidden md:flex gap-2 flex-wrap">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              onClick={() => navigate(action.href)}
              className="gap-2 h-10"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
          <Button onClick={() => navigate('/production/forms')} className="gap-2 h-10">
            <Plus className="h-4 w-4" />
            All Forms
          </Button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Forms</p>
                  <p className="text-2xl font-bold">{stats.totalForms}</p>
                  <p className="text-sm text-foreground">6 categories</p>
                </div>
                <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-secondary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                  <p className="text-sm text-muted-foreground">Awaiting approval</p>
                </div>
                <div className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
                  <p className="text-sm text-foreground">+3 from yesterday</p>
                </div>
                <div className="h-11 w-11 rounded-lg bg-accent flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{stats.alerts}</p>
                  <p className="text-sm text-destructive">CCP deviations</p>
                </div>
                <div className="h-11 w-11 rounded-lg bg-destructive flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="forms" className="flex-1 md:flex-none">Forms Library</TabsTrigger>
          <TabsTrigger value="lines" className="flex-1 md:flex-none">Production Lines</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 md:flex-none">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Forms Library Tab */}
        <TabsContent value="forms" className="space-y-6">
          {/* Search and Filter */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms by name or code..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                className="h-11 min-w-[44px]"
              >
                All
              </Button>
              {formCategories.slice(0, 4).map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="h-11 min-w-[44px]"
                >
                  {cat.code}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Form Categories Grid */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => {
              const colors = getColorClasses(category.colorToken);
              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card className={cn('h-full hover:shadow-lg transition-shadow border-l-4', colors.border)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn('h-11 w-11 rounded-lg flex items-center justify-center', colors.iconBg)}>
                            <category.icon className={cn('h-5 w-5', colors.iconText)} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{category.forms.length} forms</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{category.pendingCount} pending</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      {category.forms.slice(0, 4).map((form) => (
                        <Link
                          key={form.code}
                          to={`/production/forms/${form.code}/new`}
                          className="flex items-center justify-between p-2.5 rounded-md hover:bg-muted/50 active:bg-muted transition-colors group min-h-[48px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                            <span className="text-sm">{form.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-xs', getPriorityBadgeClass(form.priority))}>
                              {form.priority}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                      {category.forms.length > 4 && (
                        <Button variant="ghost" className="w-full mt-2 h-11" asChild>
                          <Link to={category.href}>
                            View all {category.forms.length} forms
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

        {/* Production Lines Tab */}
        <TabsContent value="lines" className="space-y-6" id="lines">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
            {productionLines.map((line) => (
              <motion.div key={line.id} variants={itemVariants}>
                <Card className={line.status === 'Maintenance' ? 'opacity-70' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Cog className={cn('h-5 w-5', line.status === 'Running' ? 'text-primary animate-spin' : 'text-muted-foreground')} style={{ animationDuration: '3s' }} />
                        {line.name}
                      </CardTitle>
                      <Badge variant={line.status === 'Running' ? 'default' : 'secondary'}>
                        {line.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {line.status === 'Running' ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Efficiency</span>
                            <span className="text-sm font-medium">{line.efficiency}%</span>
                          </div>
                          <Progress value={line.efficiency} className="h-2" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                              <Activity className="h-4 w-4" />
                              <span className="text-sm">Output</span>
                            </div>
                            <p className="font-semibold">{line.output}</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                              <ThermometerSun className="h-4 w-4" />
                              <span className="text-sm">Temp</span>
                            </div>
                            <p className="font-semibold">{line.temperature}°C</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                              <Droplets className="h-4 w-4" />
                              <span className="text-sm">Pressure</span>
                            </div>
                            <p className="font-semibold">{line.pressure} bar</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Scheduled maintenance in progress</p>
                        <Button 
                          variant="outline" 
                          className="mt-3 h-11"
                          onClick={() => navigate('/production/forms?category=tpm')}
                        >
                          View TPM Schedule
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Today's Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">5,320</p>
                  <p className="text-sm text-muted-foreground">Total Output (MT)</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Gauge className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">90.7%</p>
                  <p className="text-sm text-muted-foreground">Avg. Efficiency</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">3/4</p>
                  <p className="text-sm text-muted-foreground">Lines Running</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">98.2%</p>
                  <p className="text-sm text-muted-foreground">Quality Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity: RecentActivity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors min-h-[60px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2.5 rounded-lg', getStatusIconClass(activity.status))}>
                        {activity.status === 'urgent' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : activity.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user} • {activity.line}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadgeClass(activity.status)}>
                        {activity.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-1 p-2 min-w-[64px] min-h-[56px] rounded-lg hover:bg-muted active:bg-muted/80 transition-colors"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
