/**
 * QC (Quality Control) Department Dashboard
 * Laboratory management, testing, specifications, and quality actions
 */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Beaker,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  BarChart3,
  AlertCircle,
  Bell,
  Search,
  ChevronRight,
  Building2,
  Activity,
  Target,
  FlaskConical,
  Microscope,
  FileSearch,
  TestTube,
  Award,
  Thermometer,
  Home,
  Menu,
  Plus,
  Users,
  Zap,
  Flame,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format, isBefore, addDays } from 'date-fns';
import { useUser } from '@/hooks/use-user';

// QC Module Navigation
const QC_MODULES = [
  { id: 'laboratory', name: 'Laboratory', icon: Microscope, href: '/qc/laboratory', description: 'Equipment & calibration' },
  { id: 'specifications', name: 'Specifications', icon: FileSearch, href: '/qc/specifications', description: 'Product data sheets' },
  { id: 'testing', name: 'Testing', icon: TestTube, href: '/qc/testing', description: 'Results & OOS reports' },
  { id: 'certificates', name: 'Certificates', icon: Award, href: '/qc/certificates', description: 'Compliance docs' },
  { id: 'actions', name: 'Quality Actions', icon: Target, href: '/qc/actions', description: 'PQCAR & PAR' },
  { id: 'info', name: 'QC Info', icon: BarChart3, href: '/qc/info', description: 'Sampling & reports' },
];

// Mobile Navigation
const MOBILE_NAV = [
  { id: 'home', name: 'Home', icon: Home, href: '/' },
  { id: 'laboratory', name: 'Lab', icon: Microscope, href: '/qc/laboratory' },
  { id: 'testing', name: 'Testing', icon: TestTube, href: '/qc/testing' },
  { id: 'actions', name: 'Actions', icon: Target, href: '/qc/actions' },
  { id: 'more', name: 'More', icon: Menu, href: '' },
];

// Mock Lab Equipment Data
const MOCK_LAB_EQUIPMENT = [
  { id: 'LAB-001', name: 'HPLC System - Agilent 1260', type: 'Chromatography', calibrationDate: '2026-04-15', nextCalibration: '2026-07-15', status: 'Calibrated', location: 'Lab A - PRAI' },
  { id: 'LAB-002', name: 'Gas Chromatograph - Shimadzu', type: 'Chromatography', calibrationDate: '2026-03-20', nextCalibration: '2026-06-20', status: 'Calibrated', location: 'Lab A - PRAI' },
  { id: 'LAB-003', name: 'Spectrophotometer UV-VIS', type: 'Spectroscopy', calibrationDate: '2026-02-10', nextCalibration: '2026-05-10', status: 'Due Soon', location: 'Lab B - PRAI' },
  { id: 'LAB-004', name: 'pH Meter - Mettler Toledo', type: 'Analytical', calibrationDate: '2026-04-01', nextCalibration: '2026-05-01', status: 'Overdue', location: 'Lab C - JHR' },
  { id: 'LAB-005', name: 'Viscometer - Brookfield', type: 'Physical', calibrationDate: '2026-04-20', nextCalibration: '2026-07-20', status: 'Calibrated', location: 'Lab B - PRAI' },
];

// Mock Testing Results Data
const MOCK_TESTING_RESULTS = [
  { id: 'TEST-2026-158', product: 'Oleic Acid 90%', batchNo: 'OA-2026-0512', testType: 'Full Analysis', status: 'Completed', result: 'Pass', analyst: 'Ahmad Razak', completedDate: '2026-05-05', specs: { acidValue: 0.3, iodine: 85, color: 2.1 } },
  { id: 'TEST-2026-157', product: 'Stearic Acid Triple Pressed', batchNo: 'SA-2026-0418', testType: 'Full Analysis', status: 'In Progress', result: 'Pending', analyst: 'Sarah Lee', completedDate: null, specs: null },
  { id: 'TEST-2026-156', product: 'Glycerin 99.7% USP', batchNo: 'GL-2026-0325', testType: 'Purity Check', status: 'OOS Investigation', result: 'Fail', analyst: 'Chen Wei', completedDate: '2026-05-04', specs: { purity: 99.2, water: 0.3, ash: 0.01 } },
  { id: 'TEST-2026-155', product: 'Palm Kernel Oil', batchNo: 'PKO-2026-0512', testType: 'Microbiology', status: 'Completed', result: 'Pass', analyst: 'Lim Mei', completedDate: '2026-05-03', specs: null },
  { id: 'TEST-2026-154', product: 'Lauric Acid 99%', batchNo: 'LA-2026-0501', testType: 'COA Generation', status: 'Pending Review', result: 'Pass', analyst: 'Raj Kumar', completedDate: '2026-05-02', specs: { purity: 99.1, color: 1.5, odor: 'Typical' } },
];

// Mock OOS Reports Data
const MOCK_OOS_REPORTS = [
  { id: 'OOS-2026-012', product: 'Glycerin 99.7% USP', batchNo: 'GL-2026-0325', parameter: 'Purity', specLimit: '≥99.5%', actualResult: '99.2%', status: 'Investigation', assignedTo: 'Chen Wei', openDate: '2026-05-04', severity: 'Critical' },
  { id: 'OOS-2026-011', product: 'Oleic Acid 90%', batchNo: 'OA-2026-0498', parameter: 'Acid Value', specLimit: '≤0.5 mg KOH/g', actualResult: '0.6 mg KOH/g', status: 'CAPA Required', assignedTo: 'Ahmad Razak', openDate: '2026-04-28', severity: 'Major' },
  { id: 'OOS-2026-010', product: 'Stearic Acid', batchNo: 'SA-2026-0401', parameter: 'Color', specLimit: '≤3.0 R', actualResult: '3.5 R', status: 'Resolved', assignedTo: 'Sarah Lee', openDate: '2026-04-20', severity: 'Minor' },
];

// Mock Specifications Data
const MOCK_SPECIFICATIONS = [
  { id: 'SPEC-001', code: 'PDS-OA-001', product: 'Oleic Acid 90%', revision: '5.0', status: 'Current', lastReview: '2026-03-15', nextReview: '2026-09-15' },
  { id: 'SPEC-002', code: 'PDS-SA-001', product: 'Stearic Acid Triple Pressed', revision: '4.2', status: 'Under Review', lastReview: '2026-01-20', nextReview: '2026-05-10' },
  { id: 'SPEC-003', code: 'PDS-GL-001', product: 'Glycerin 99.7% USP', revision: '6.1', status: 'Current', lastReview: '2026-04-01', nextReview: '2026-10-01' },
  { id: 'SPEC-004', code: 'PDS-PKO-001', product: 'Palm Kernel Oil', revision: '3.0', status: 'Draft', lastReview: '2025-12-10', nextReview: '2026-05-15' },
];

// Mock Quality Actions Data
const MOCK_QUALITY_ACTIONS = [
  { id: 'PQCAR-2026-008', title: 'Implement enhanced purity testing protocol', type: 'PQCAR', source: 'OOS-2026-012', priority: 'Critical', product: 'Glycerin 99.7% USP', owner: 'Chen Wei', status: 'In Progress', targetDate: '2026-05-20', progress: 45 },
  { id: 'PAR-2026-015', title: 'Update color measurement SOP', type: 'PAR', source: 'Trend Analysis', priority: 'Medium', product: 'All Products', owner: 'Sarah Lee', status: 'Open', targetDate: '2026-05-30', progress: 20 },
  { id: 'PQCAR-2026-007', title: 'Acid value control improvement', type: 'PQCAR', source: 'OOS-2026-011', priority: 'High', product: 'Oleic Acid 90%', owner: 'Ahmad Razak', status: 'Pending Verification', targetDate: '2026-05-15', progress: 85 },
  { id: 'PAR-2026-014', title: 'Equipment calibration frequency review', type: 'PAR', source: 'Internal Review', priority: 'Low', product: 'N/A', owner: 'Raj Kumar', status: 'Closed', targetDate: '2026-04-30', progress: 100 },
];

// Loading skeleton component
function KPISkeleton() {
  return (
    <Card className="border-l-4 border-l-muted" aria-hidden="true">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 animate-pulse" />
            <Skeleton className="h-8 w-16 animate-pulse" />
            <Skeleton className="h-3 w-20 animate-pulse" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function QCIndexPage() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const equipmentDue = MOCK_LAB_EQUIPMENT.filter((e: typeof MOCK_LAB_EQUIPMENT[0]) => 
      e.status === 'Due Soon' || e.status === 'Overdue'
    ).length;
    const overdueEquipment = MOCK_LAB_EQUIPMENT.filter((e: typeof MOCK_LAB_EQUIPMENT[0]) => 
      e.status === 'Overdue'
    ).length;
    const pendingTests = MOCK_TESTING_RESULTS.filter((t: typeof MOCK_TESTING_RESULTS[0]) => 
      t.status === 'In Progress' || t.status === 'Pending Review'
    ).length;
    const oosOpen = MOCK_OOS_REPORTS.filter((o: typeof MOCK_OOS_REPORTS[0]) => 
      o.status !== 'Resolved'
    ).length;
    const criticalOOS = MOCK_OOS_REPORTS.filter((o: typeof MOCK_OOS_REPORTS[0]) => 
      o.severity === 'Critical' && o.status !== 'Resolved'
    ).length;
    const specsNeedingReview = MOCK_SPECIFICATIONS.filter((s: typeof MOCK_SPECIFICATIONS[0]) => 
      s.status === 'Under Review' || s.status === 'Draft'
    ).length;
    const activeActions = MOCK_QUALITY_ACTIONS.filter((a: typeof MOCK_QUALITY_ACTIONS[0]) => 
      a.status !== 'Closed'
    ).length;
    const passRate = Math.round(
      (MOCK_TESTING_RESULTS.filter((t: typeof MOCK_TESTING_RESULTS[0]) => t.result === 'Pass').length / 
       MOCK_TESTING_RESULTS.filter((t: typeof MOCK_TESTING_RESULTS[0]) => t.result !== 'Pending').length) * 100
    );
    
    return { equipmentDue, overdueEquipment, pendingTests, oosOpen, criticalOOS, specsNeedingReview, activeActions, passRate };
  }, []);

  // Module pending counts
  const getModulePending = (moduleId: string): number => {
    switch (moduleId) {
      case 'laboratory': return MOCK_LAB_EQUIPMENT.filter((e: typeof MOCK_LAB_EQUIPMENT[0]) => e.status === 'Due Soon' || e.status === 'Overdue').length;
      case 'testing': return MOCK_TESTING_RESULTS.filter((t: typeof MOCK_TESTING_RESULTS[0]) => t.status === 'In Progress' || t.status === 'Pending Review').length;
      case 'specifications': return MOCK_SPECIFICATIONS.filter((s: typeof MOCK_SPECIFICATIONS[0]) => s.status === 'Under Review' || s.status === 'Draft').length;
      case 'actions': return MOCK_QUALITY_ACTIONS.filter((a: typeof MOCK_QUALITY_ACTIONS[0]) => a.status !== 'Closed').length;
      default: return 0;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Overdue': case 'OOS Investigation': case 'CAPA Required': return 'bg-destructive text-destructive-foreground';
      case 'Due Soon': case 'In Progress': case 'Investigation': return 'bg-accent/500 text-white dark:bg-accent';
      case 'Pending Review': case 'Open': case 'Under Review': case 'Draft': return 'bg-secondary/500 text-white dark:bg-primary';
      case 'Calibrated': case 'Completed': case 'Pass': case 'Current': case 'Resolved': case 'Closed': case 'Pending Verification': return 'bg-primary/50 text-white dark:bg-primary';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'Major': return 'bg-accent/500 text-white';
      case 'Minor': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <Flame className="h-3.5 w-3.5 text-destructive" />;
      case 'High': return <Zap className="h-3.5 w-3.5 text-accent-foreground" />;
      default: return null;
    }
  };

  // Single orchestrated entrance animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                  <Beaker className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">Quality Control</h1>
                  <p className="text-xs text-muted-foreground">IOI Acidchem</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="w-48 pl-9 h-10 text-sm" 
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative min-h-[44px] min-w-[44px]">
                      <Bell className="h-5 w-5" />
                      {kpis.criticalOOS > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-xs font-bold text-destructive-foreground flex items-center justify-center">
                          {kpis.criticalOOS}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{kpis.criticalOOS} critical OOS issues</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-2 pl-3 border-l">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-white">
                  {user?.fullName?.charAt(0) || 'Q'}
                </div>
                <span className="text-sm font-medium hidden md:inline text-foreground">{user?.fullName || 'QC User'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Critical OOS Alerts */}
        {kpis.criticalOOS > 0 && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {kpis.criticalOOS} Critical OOS Issue{kpis.criticalOOS > 1 ? 's' : ''} Require Investigation
                  </p>
                  <p className="text-sm text-muted-foreground">Out of specification results need immediate attention</p>
                </div>
              </div>
              <Button size="sm" variant="destructive" className="min-h-[44px]" asChild>
                <Link to="/qc/testing?status=OOS">
                  View OOS <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Equipment Calibration Alert */}
        {kpis.overdueEquipment > 0 && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-lg bg-accent/50 dark:bg-accent/30 border border-accent dark:border-accent"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {kpis.overdueEquipment} Equipment Overdue for Calibration
                  </p>
                  <p className="text-sm text-muted-foreground">Schedule calibration to maintain compliance</p>
                </div>
              </div>
              <Button size="sm" className="min-h-[44px] bg-accent hover:bg-accent text-white" asChild>
                <Link to="/qc/laboratory?status=Overdue">
                  View Equipment <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Access Modules */}
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick Access</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QC_MODULES.map((module) => {
              const Icon = module.icon;
              const pending = getModulePending(module.id);
              return (
                <Link key={module.id} to={module.href}>
                  <Card className="group hover:border-primary hover:shadow-md transition-all cursor-pointer h-full min-h-[100px]">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-secondary-foreground transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{module.name}</span>
                      {pending > 0 && (
                        <Badge variant="secondary" className="text-xs">{pending} active</Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* KPI Cards */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <KPISkeleton />
              <KPISkeleton />
              <KPISkeleton />
              <KPISkeleton />
            </>
          ) : (
            <>
              <Card 
                className="border-l-4 border-l-sky-500 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => navigate('/qc/testing')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate('/qc/testing')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Pass Rate</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.passRate}%</p>
                      <p className="text-sm text-secondary-foreground dark:text-primary flex items-center gap-1 mt-1 font-medium">
                        <TrendingUp className="h-3.5 w-3.5" /> +2.5% vs last month
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <CheckCircle2 className="h-6 w-6 text-secondary-foreground dark:text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-all group"
                onClick={() => navigate('/qc/testing?status=OOS')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate('/qc/testing?status=OOS')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Open OOS</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.oosOpen}</p>
                      <p className="text-sm text-destructive flex items-center gap-1 mt-1 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5" /> {kpis.criticalOOS} critical
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => navigate('/qc/laboratory')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate('/qc/laboratory')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Calibration Due</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.equipmentDue}</p>
                      <p className="text-sm text-accent-foreground dark:text-accent-foreground flex items-center gap-1 mt-1 font-medium">
                        <Clock className="h-3.5 w-3.5" /> {kpis.overdueEquipment} overdue
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-accent/500/10 flex items-center justify-center group-hover:bg-accent/500/20 transition-colors">
                      <Thermometer className="h-6 w-6 text-accent-foreground dark:text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-l-4 border-l-violet-500 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => navigate('/qc/actions')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate('/qc/actions')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active Actions</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.activeActions}</p>
                      <p className="text-sm text-secondary-foreground dark:text-violet-400 flex items-center gap-1 mt-1 font-medium">
                        <Target className="h-3.5 w-3.5" /> PQCAR & PAR
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/500/10 flex items-center justify-center group-hover:bg-secondary/500/20 transition-colors">
                      <Target className="h-6 w-6 text-secondary-foreground dark:text-violet-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.section>

        {/* Main Content Grid */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
          {/* Recent Testing Results */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Testing Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="min-h-[36px]" asChild>
                    <Link to="/qc/forms/lwr/new">
                      <Plus className="h-4 w-4 mr-1" /> New LWR
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="min-h-[36px]" asChild>
                    <Link to="/qc/testing">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm">ID</TableHead>
                    <TableHead className="text-sm">Product / Batch</TableHead>
                    <TableHead className="text-sm">Test Type</TableHead>
                    <TableHead className="text-sm">Status</TableHead>
                    <TableHead className="text-sm">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TESTING_RESULTS.slice(0, 5).map((test: typeof MOCK_TESTING_RESULTS[0]) => (
                    <TableRow
                      key={test.id}
                      className="cursor-pointer hover:bg-muted/50 min-h-[52px]"
                      onClick={() => navigate(`/qc/testing/${test.id}`)}
                    >
                      <TableCell className="text-sm font-mono text-foreground">{test.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{test.product}</p>
                          <p className="text-xs text-muted-foreground">{test.batchNo}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{test.testType}</TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', getStatusClass(test.status))}>
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', 
                          test.result === 'Pass' ? 'bg-primary/50 text-white' : 
                          test.result === 'Fail' ? 'bg-destructive text-destructive-foreground' : 
                          'bg-secondary text-secondary-foreground'
                        )}>
                          {test.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* OOS Reports */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">OOS Investigations</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qc/testing?status=OOS"><ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {MOCK_OOS_REPORTS.map((oos: typeof MOCK_OOS_REPORTS[0]) => (
                  <Link key={oos.id} to="/qc/testing">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors min-h-[72px]">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{oos.id}</span>
                            <Badge className={cn('text-xs', getSeverityClass(oos.severity))}>
                              {oos.severity}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate mt-1 text-foreground">{oos.product}</p>
                        </div>
                        <Badge className={cn('text-xs shrink-0', getStatusClass(oos.status))}>
                          {oos.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{oos.parameter}: {oos.actualResult}</span>
                        <span>{oos.assignedTo}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Equipment & Actions Row */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
          {/* Lab Equipment Calibration */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Equipment Calibration Status</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qc/laboratory">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {MOCK_LAB_EQUIPMENT.slice(0, 4).map((equipment: typeof MOCK_LAB_EQUIPMENT[0]) => (
                  <Link key={equipment.id} to="/qc/laboratory">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{equipment.id}</span>
                            <Badge variant="outline" className="text-xs">{equipment.type}</Badge>
                          </div>
                          <p className="text-sm font-medium truncate mt-1 text-foreground">{equipment.name}</p>
                        </div>
                        <Badge className={cn('text-xs shrink-0', getStatusClass(equipment.status))}>
                          {equipment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{equipment.location}</span>
                        <span>Next: {format(new Date(equipment.nextCalibration), 'MMM d')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Actions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Quality Actions</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qc/actions">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {MOCK_QUALITY_ACTIONS.filter((a: typeof MOCK_QUALITY_ACTIONS[0]) => a.status !== 'Closed').slice(0, 3).map((action: typeof MOCK_QUALITY_ACTIONS[0]) => (
                  <Link key={action.id} to="/qc/actions">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{action.id}</span>
                            <Badge variant="outline" className="text-xs">{action.type}</Badge>
                            {getPriorityIcon(action.priority)}
                          </div>
                          <p className="text-sm font-medium truncate mt-1 text-foreground">{action.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={action.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-foreground">{action.progress}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{action.owner}</span>
                        <span className={cn(isBefore(new Date(action.targetDate), new Date()) && action.status !== 'Closed' && 'text-destructive font-medium')}>
                          Due: {format(new Date(action.targetDate), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Specifications */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Product Specifications</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qc/specifications">Manage All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_SPECIFICATIONS.map((spec: typeof MOCK_SPECIFICATIONS[0]) => (
                  <Card key={spec.id} className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-muted-foreground">{spec.code}</span>
                        <Badge className={cn('text-xs', getStatusClass(spec.status))}>
                          {spec.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{spec.product}</p>
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span>Rev {spec.revision}</span>
                        <span className={cn(isBefore(new Date(spec.nextReview), addDays(new Date(), 14)) && 'text-accent-foreground dark:text-accent-foreground font-medium')}>
                          Review: {format(new Date(spec.nextReview), 'MMM d')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t lg:hidden z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            if (item.id === 'more') {
              return (
                <Sheet key={item.id} open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                  <SheetTrigger asChild>
                    <button className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-3 py-2 text-muted-foreground">
                      <Icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.name}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto max-h-[60vh]">
                    <SheetHeader>
                      <SheetTitle>QC Modules</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {QC_MODULES.map((module) => {
                        const ModuleIcon = module.icon;
                        return (
                          <Link
                            key={module.id}
                            to={module.href}
                            onClick={() => setShowMobileMenu(false)}
                            className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                              <ModuleIcon className="h-6 w-6 text-secondary-foreground" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{module.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              );
            }
            return (
              <Link
                key={item.id}
                to={item.href}
                className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-3 py-2 text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}