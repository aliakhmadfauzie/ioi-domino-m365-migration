/**
 * QA Department Dashboard
 * Comprehensive quality assurance tracking with KPIs, audits, defects, CAPAs
 */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Bug,
  FileSearch,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Target,
  AlertCircle,
  Bell,
  Search,
  ChevronRight,
  Building2,
  Activity,
  GraduationCap,
  Eye,
  X,
  MapPin,
  Zap,
  Flame,
  Home,
  Menu,
  Plus,
  FileText,
  ChevronDown,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format, isBefore, addDays } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// QA Module Navigation
const QA_MODULES = [
  { id: 'audits', name: 'Audits', icon: ClipboardCheck, href: '/qa/audits', description: 'Audit scheduling & findings' },
  { id: 'defects', name: 'Defects', icon: Bug, href: '/qa/defects', description: 'Issue tracking & resolution' },
  { id: 'capas', name: 'CAPAs', icon: Target, href: '/qa/capas', description: 'Corrective & preventive actions' },
  { id: 'documents', name: 'Documents', icon: FileSearch, href: '/qa/documents', description: 'SOPs & document control' },
  { id: 'training', name: 'Training', icon: GraduationCap, href: '/qa/training', description: 'Compliance training records' },
  { id: 'reports', name: 'Reports', icon: BarChart3, href: '/qa/reports', description: 'Analytics & exports' },
];

// Mobile Navigation
const MOBILE_NAV = [
  { id: 'home', name: 'Home', icon: Home, href: '/' },
  { id: 'audits', name: 'Audits', icon: ClipboardCheck, href: '/qa/audits' },
  { id: 'defects', name: 'Defects', icon: Bug, href: '/qa/defects' },
  { id: 'capas', name: 'CAPAs', icon: Target, href: '/qa/capas' },
  { id: 'more', name: 'More', icon: Menu, href: '' },
];

// Mock Audits Data
const MOCK_AUDITS = [
  { id: 'AUD-2026-001', name: 'HACCP Annual Review', type: 'Internal', department: 'Production', site: 'PRAI', scheduledDate: '2026-05-15', status: 'Scheduled', leadAuditor: 'Ahmad Razak', score: null, findings: 0 },
  { id: 'AUD-2026-002', name: 'ISO 9001 Surveillance', type: 'External', department: 'QA', site: 'PRAI', scheduledDate: '2026-04-28', status: 'Completed', leadAuditor: 'Sarah Lee', score: 92, findings: 3 },
  { id: 'AUD-2026-003', name: 'Supplier Quality Audit', type: 'Supplier', department: 'Procurement', site: 'JHR', scheduledDate: '2026-05-08', status: 'In Progress', leadAuditor: 'Raj Kumar', score: null, findings: 2 },
  { id: 'AUD-2026-004', name: 'Process Safety Audit', type: 'Process', department: 'Operations', site: 'PRAI', scheduledDate: '2026-04-20', status: 'Completed', leadAuditor: 'Chen Wei', score: 88, findings: 5 },
  { id: 'AUD-2026-005', name: 'Environmental Compliance', type: 'External', department: 'HSE', site: 'JHR', scheduledDate: '2026-05-22', status: 'Scheduled', leadAuditor: 'Lim Mei', score: null, findings: 0 },
];

// Mock Defects Data
const MOCK_DEFECTS = [
  { id: 'DEF-2026-042', title: 'Product viscosity out of spec', type: 'Product', severity: 'Major', priority: 'High', department: 'Production', site: 'PRAI', reportedBy: 'Ali Hassan', reportedDate: '2026-05-01', status: 'Open', assignedTo: 'Raj Kumar' },
  { id: 'DEF-2026-041', title: 'Temperature deviation in reactor', type: 'Process', severity: 'Critical', priority: 'High', department: 'Operations', site: 'PRAI', reportedBy: 'Chen Wei', reportedDate: '2026-04-30', status: 'In Progress', assignedTo: 'Ahmad Razak' },
  { id: 'DEF-2026-040', title: 'Packaging seal integrity failure', type: 'Product', severity: 'Major', priority: 'Medium', department: 'Packaging', site: 'JHR', reportedBy: 'Sarah Lee', reportedDate: '2026-04-28', status: 'Pending Verification', assignedTo: 'Lim Mei' },
  { id: 'DEF-2026-039', title: 'SOP not followed - line changeover', type: 'Process', severity: 'Minor', priority: 'Low', department: 'Production', site: 'PRAI', reportedBy: 'Raj Kumar', reportedDate: '2026-04-25', status: 'Resolved', assignedTo: 'Ali Hassan' },
  { id: 'DEF-2026-038', title: 'Raw material contamination', type: 'Material', severity: 'Critical', priority: 'High', department: 'Warehouse', site: 'JHR', reportedBy: 'Lim Mei', reportedDate: '2026-04-22', status: 'Closed', assignedTo: 'Chen Wei' },
];

// Mock CAPAs Data
const MOCK_CAPAS = [
  { id: 'CAPA-2026-018', title: 'Implement temperature monitoring system', type: 'Corrective', source: 'Audit Finding', priority: 'Critical', department: 'Operations', site: 'PRAI', owner: 'Ahmad Razak', status: 'In Progress', targetDate: '2026-05-20', progress: 65 },
  { id: 'CAPA-2026-017', title: 'Update packaging inspection SOP', type: 'Preventive', source: 'Defect', priority: 'High', department: 'Packaging', site: 'JHR', owner: 'Lim Mei', status: 'Open', targetDate: '2026-05-25', progress: 30 },
  { id: 'CAPA-2026-016', title: 'Supplier qualification enhancement', type: 'Preventive', source: 'Customer Complaint', priority: 'Medium', department: 'Procurement', site: 'PRAI', owner: 'Sarah Lee', status: 'Pending Verification', targetDate: '2026-05-10', progress: 90 },
  { id: 'CAPA-2026-015', title: 'Training program for new SOPs', type: 'Corrective', source: 'Internal Review', priority: 'High', department: 'QA', site: 'PRAI', owner: 'Chen Wei', status: 'In Progress', targetDate: '2026-05-15', progress: 50 },
  { id: 'CAPA-2026-014', title: 'Equipment calibration schedule update', type: 'Preventive', source: 'Regulatory', priority: 'Medium', department: 'Maintenance', site: 'JHR', owner: 'Raj Kumar', status: 'Closed', targetDate: '2026-04-30', progress: 100 },
];

// Mock Documents Data
const MOCK_DOCUMENTS = [
  { id: 'DOC-001', number: 'SOP-QA-001', type: 'SOP', title: 'Incoming Material Inspection', revision: '3.2', status: 'Published', department: 'QA', nextReview: '2026-07-15', author: 'Sarah Lee' },
  { id: 'DOC-002', number: 'SOP-PROD-012', type: 'SOP', title: 'Reactor Operation Procedure', revision: '2.1', status: 'Under Review', department: 'Production', nextReview: '2026-05-10', author: 'Ahmad Razak' },
  { id: 'DOC-003', number: 'WI-QC-005', type: 'Work Instruction', title: 'Viscosity Testing Method', revision: '1.5', status: 'Published', department: 'QC', nextReview: '2026-08-20', author: 'Chen Wei' },
  { id: 'DOC-004', number: 'POL-QA-002', type: 'Policy', title: 'Non-Conformance Management', revision: '4.0', status: 'Draft', department: 'QA', nextReview: '2026-06-01', author: 'Lim Mei' },
  { id: 'DOC-005', number: 'FORM-QA-015', type: 'Form', title: 'CAPA Request Form', revision: '2.0', status: 'Published', department: 'QA', nextReview: '2026-09-30', author: 'Raj Kumar' },
];

// Compliance certifications data
const COMPLIANCE_CERTS = [
  { name: 'ISO 9001', status: 'compliant', score: 92, href: '/qa/reports?cert=iso9001' },
  { name: 'ISO 14001', status: 'compliant', score: 88, href: '/qa/reports?cert=iso14001' },
  { name: 'HACCP', status: 'compliant', score: 95, href: '/qa/reports?cert=haccp' },
  { name: 'GMP', status: 'warning', score: 78, href: '/qa/reports?cert=gmp' },
  { name: 'HALAL', status: 'compliant', score: 100, href: '/qa/reports?cert=halal' },
  { name: 'OHSAS', status: 'compliant', score: 85, href: '/qa/reports?cert=ohsas' },
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

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i: number) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-24 animate-pulse" />
          <Skeleton className="h-4 flex-1 animate-pulse" />
          <Skeleton className="h-6 w-16 rounded-full animate-pulse" />
          <Skeleton className="h-6 w-16 rounded-full animate-pulse" />
          <Skeleton className="h-4 w-20 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function QAIndexPage() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof MOCK_DEFECTS[0] | null>(null);
  const [isLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const openDefects = MOCK_DEFECTS.filter((d: typeof MOCK_DEFECTS[0]) => d.status === 'Open' || d.status === 'In Progress').length;
    const criticalDefects = MOCK_DEFECTS.filter((d: typeof MOCK_DEFECTS[0]) => d.severity === 'Critical' && d.status !== 'Closed').length;
    const overdueCapas = MOCK_CAPAS.filter((c: typeof MOCK_CAPAS[0]) => c.status !== 'Closed' && isBefore(new Date(c.targetDate), new Date())).length;
    const pendingAudits = MOCK_AUDITS.filter((a: typeof MOCK_AUDITS[0]) => a.status === 'Scheduled').length;
    const completedAudits = MOCK_AUDITS.filter((a: typeof MOCK_AUDITS[0]) => a.score !== null);
    const avgAuditScore = completedAudits.length > 0 
      ? completedAudits.reduce((acc: number, a: typeof MOCK_AUDITS[0]) => acc + (a.score || 0), 0) / completedAudits.length 
      : 0;
    const docsNeedingReview = MOCK_DOCUMENTS.filter((d: typeof MOCK_DOCUMENTS[0]) => isBefore(new Date(d.nextReview), addDays(new Date(), 30))).length;
    const activeCapas = MOCK_CAPAS.filter((c: typeof MOCK_CAPAS[0]) => c.status !== 'Closed').length;
    
    return { openDefects, criticalDefects, overdueCapas, pendingAudits, avgAuditScore, docsNeedingReview, activeCapas };
  }, []);

  // Module pending counts
  const getModulePending = (moduleId: string): number => {
    switch (moduleId) {
      case 'audits': return MOCK_AUDITS.filter((a: typeof MOCK_AUDITS[0]) => a.status === 'Scheduled' || a.status === 'In Progress').length;
      case 'defects': return MOCK_DEFECTS.filter((d: typeof MOCK_DEFECTS[0]) => d.status === 'Open' || d.status === 'In Progress').length;
      case 'capas': return MOCK_CAPAS.filter((c: typeof MOCK_CAPAS[0]) => c.status !== 'Closed').length;
      case 'documents': return MOCK_DOCUMENTS.filter((d: typeof MOCK_DOCUMENTS[0]) => d.status === 'Under Review' || d.status === 'Draft').length;
      case 'training': return 8;
      default: return 0;
    }
  };

  // Semantic status classes using design tokens
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'Major': return 'bg-primary text-primary-foreground';
      case 'Minor': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-destructive text-destructive-foreground';
      case 'Pending Verification': return 'bg-secondary text-secondary-foreground';
      case 'Resolved': case 'Completed': return 'bg-accent text-accent-foreground';
      case 'Closed': return 'bg-muted text-muted-foreground';
      case 'Scheduled': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <Flame className="h-3.5 w-3.5 text-destructive" />;
      case 'High': return <Zap className="h-3.5 w-3.5 text-primary" />;
      default: return null;
    }
  };

  // KPI click handlers
  const handleKPIClick = (type: string) => {
    switch (type) {
      case 'defects':
        navigate('/qa/defects?status=Open');
        break;
      case 'capas':
        navigate('/qa/capas?status=Open');
        break;
      case 'audits-score':
        navigate('/qa/audits?status=Completed');
        break;
      case 'audits-pending':
        navigate('/qa/audits?status=Scheduled');
        break;
    }
  };

  // Quick create handler
  const handleQuickCreate = (type: string) => {
    switch (type) {
      case 'defect':
        navigate('/qa/defects/new');
        break;
      case 'capa':
        navigate('/qa/capas/new');
        break;
      case 'audit':
        navigate('/qa/audits/new');
        break;
      case 'document':
        navigate('/qa/documents/new');
        break;
      default:
        toast.info(`Creating new ${type}...`);
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
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">Quality Assurance</h1>
                  <p className="text-xs text-muted-foreground">IOI Acidchem</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search QA..." 
                  className="w-48 pl-9 h-10 text-sm" 
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Mobile Search Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="sm:hidden min-h-[44px] min-w-[44px]"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Quick Create Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="min-h-[44px] gap-1.5">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleQuickCreate('defect')}>
                    <Bug className="h-4 w-4 mr-2" /> New Defect
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleQuickCreate('capa')}>
                    <Target className="h-4 w-4 mr-2" /> New CAPA
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleQuickCreate('audit')}>
                    <ClipboardCheck className="h-4 w-4 mr-2" /> New Audit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleQuickCreate('document')}>
                    <FileText className="h-4 w-4 mr-2" /> New Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative min-h-[44px] min-w-[44px]">
                      <Bell className="h-5 w-5" />
                      {kpis.criticalDefects > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-xs font-bold text-destructive-foreground flex items-center justify-center">
                          {kpis.criticalDefects}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{kpis.criticalDefects} critical issues</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {user?.fullName?.charAt(0) || 'Q'}
                </div>
                <span className="text-sm font-medium hidden md:inline text-foreground">{user?.fullName || 'QA User'}</span>
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
        {/* Critical Alerts */}
        {kpis.criticalDefects > 0 && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {kpis.criticalDefects} Critical Issue{kpis.criticalDefects > 1 ? 's' : ''} Require Immediate Attention
                  </p>
                  <p className="text-sm text-muted-foreground">Temperature deviation, contamination alerts</p>
                </div>
              </div>
              <Button size="sm" variant="destructive" className="min-h-[44px]" asChild>
                <Link to="/qa/defects?severity=Critical">
                  View Issues <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Access Modules */}
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick Access</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QA_MODULES.map((module) => {
              const Icon = module.icon;
              const pending = getModulePending(module.id);
              return (
                <Link key={module.id} to={module.href}>
                  <Card className="group hover:border-primary hover:shadow-md transition-all cursor-pointer h-full min-h-[100px]">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
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

        {/* KPI Cards - Clickable */}
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
                className="border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-all group"
                onClick={() => handleKPIClick('defects')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleKPIClick('defects')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Open Defects</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.openDefects}</p>
                      <p className="text-sm text-destructive flex items-center gap-1 mt-1 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5" /> {kpis.criticalDefects} critical
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                      <Bug className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-l-4 border-l-primary cursor-pointer hover:shadow-md transition-all group"
                onClick={() => handleKPIClick('capas')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleKPIClick('capas')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active CAPAs</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.activeCapas}</p>
                      <p className="text-sm text-primary flex items-center gap-1 mt-1 font-medium">
                        <Clock className="h-3.5 w-3.5" /> {kpis.overdueCapas} overdue
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-l-4 border-l-accent cursor-pointer hover:shadow-md transition-all group"
                onClick={() => handleKPIClick('audits-score')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleKPIClick('audits-score')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Audit Score</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.avgAuditScore.toFixed(0)}%</p>
                      <p className="text-sm text-accent-foreground flex items-center gap-1 mt-1 font-medium">
                        <TrendingUp className="h-3.5 w-3.5" /> +2% vs Q1
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center group-hover:bg-accent/80 transition-colors">
                      <ClipboardCheck className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-l-4 border-l-secondary cursor-pointer hover:shadow-md transition-all group"
                onClick={() => handleKPIClick('audits-pending')}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleKPIClick('audits-pending')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Pending Audits</p>
                      <p className="text-3xl font-bold mt-1 text-foreground">{kpis.pendingAudits}</p>
                      <p className="text-sm text-secondary-foreground flex items-center gap-1 mt-1 font-medium">
                        <Calendar className="h-3.5 w-3.5" /> Next: May 8
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                      <FileSearch className="h-6 w-6 text-secondary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.section>

        {/* Main Content Grid */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
          {/* Recent Defects */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Defects</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qa/defects">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">ID</TableHead>
                      <TableHead className="text-sm">Issue</TableHead>
                      <TableHead className="text-sm">Severity</TableHead>
                      <TableHead className="text-sm">Status</TableHead>
                      <TableHead className="text-sm">Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_DEFECTS.slice(0, 5).map((defect: typeof MOCK_DEFECTS[0]) => (
                      <TableRow
                        key={defect.id}
                        className="cursor-pointer hover:bg-muted/50 min-h-[52px]"
                        onClick={() => { setSelectedItem(defect); setShowDetailModal(true); }}
                      >
                        <TableCell className="text-sm font-mono text-foreground">{defect.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPriorityIcon(defect.priority)}
                            <span className="text-sm truncate max-w-[200px] text-foreground">{defect.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs', getSeverityClass(defect.severity))}>
                            {defect.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs', getStatusClass(defect.status))}>
                            {defect.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{defect.assignedTo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Audits */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Upcoming Audits</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qa/audits"><ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="space-y-3" aria-hidden="true">
                  {[1, 2, 3].map((i: number) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <Skeleton className="h-4 w-32 mb-2 animate-pulse" />
                      <Skeleton className="h-3 w-24 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {MOCK_AUDITS.filter((a: typeof MOCK_AUDITS[0]) => a.status === 'Scheduled' || a.status === 'In Progress').map((audit: typeof MOCK_AUDITS[0]) => (
                    <Link key={audit.id} to={`/qa/audits`}>
                      <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors min-h-[72px]">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">{audit.name}</p>
                            <p className="text-sm text-muted-foreground">{audit.department} • {audit.site}</p>
                          </div>
                          <Badge className={cn('text-xs shrink-0', getStatusClass(audit.status))}>
                            {audit.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {format(new Date(audit.scheduledDate), 'MMM d')}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {audit.leadAuditor}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* CAPAs and Documents Row */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
          {/* Active CAPAs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Active CAPAs</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qa/capas">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {MOCK_CAPAS.filter((c: typeof MOCK_CAPAS[0]) => c.status !== 'Closed').slice(0, 4).map((capa: typeof MOCK_CAPAS[0]) => (
                  <Link key={capa.id} to="/qa/capas">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{capa.id}</span>
                            <Badge variant="outline" className="text-xs">{capa.type}</Badge>
                          </div>
                          <p className="text-sm font-medium truncate mt-1 text-foreground">{capa.title}</p>
                        </div>
                        {getPriorityIcon(capa.priority)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={capa.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-foreground">{capa.progress}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <span>{capa.owner}</span>
                        <span className={cn(isBefore(new Date(capa.targetDate), new Date()) && capa.status !== 'Closed' && 'text-destructive font-medium')}>
                          Due: {format(new Date(capa.targetDate), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Control */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Document Control</CardTitle>
                <Button variant="ghost" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/qa/documents">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {MOCK_DOCUMENTS.slice(0, 4).map((doc: typeof MOCK_DOCUMENTS[0]) => (
                  <Link key={doc.id} to="/qa/documents">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{doc.number}</span>
                            <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                          </div>
                          <p className="text-sm font-medium truncate mt-1 text-foreground">{doc.title}</p>
                        </div>
                        <Badge className={cn(
                          'text-xs shrink-0',
                          doc.status === 'Published' && 'bg-accent text-accent-foreground',
                          doc.status === 'Under Review' && 'bg-primary text-primary-foreground',
                          doc.status === 'Draft' && 'bg-secondary text-secondary-foreground'
                        )}>
                          {doc.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <span>Rev {doc.revision}</span>
                        <span className={cn(isBefore(new Date(doc.nextReview), addDays(new Date(), 30)) && 'text-primary font-medium')}>
                          Review: {format(new Date(doc.nextReview), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Summary */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Compliance Overview</CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {[{ s: 'Compliant', c: 'bg-accent' }, { s: 'Warning', c: 'bg-primary' }, { s: 'Non-Compliant', c: 'bg-destructive' }].map((i: {s: string; c: string}) => (
                    <span key={i.s} className="flex items-center gap-1"><span className={cn('h-2 w-2 rounded-full', i.c)} />{i.s}</span>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { name: 'ISO 9001', status: 'compliant', score: 92 },
                  { name: 'ISO 14001', status: 'compliant', score: 88 },
                  { name: 'HACCP', status: 'compliant', score: 95 },
                  { name: 'GMP', status: 'warning', score: 78 },
                  { name: 'HALAL', status: 'compliant', score: 100 },
                  { name: 'OHSAS', status: 'compliant', score: 85 },
                ].map((cert: {name: string; status: string; score: number}) => (
                  <Card key={cert.name} className={cn(
                    'hover:shadow-md transition-all cursor-pointer',
                    cert.status === 'compliant' && 'border-accent bg-accent/10',
                    cert.status === 'warning' && 'border-primary bg-primary/10',
                    cert.status === 'non-compliant' && 'border-destructive bg-destructive/10'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{cert.name}</span>
                        {cert.status === 'compliant' && <CheckCircle2 className="h-4 w-4 text-accent-foreground" />}
                        {cert.status === 'warning' && <AlertTriangle className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-2xl font-bold text-foreground">{cert.score}%</div>
                      <Progress value={cert.score} className="h-1.5 mt-2" />
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
                      <SheetTitle>QA Modules</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {QA_MODULES.map((module) => {
                        const ModuleIcon = module.icon;
                        return (
                          <Link
                            key={module.id}
                            to={module.href}
                            onClick={() => setShowMobileMenu(false)}
                            className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                              <ModuleIcon className="h-6 w-6 text-primary" />
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
                className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Defect Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selectedItem && (
            <>
              <div className="h-16 bg-gradient-to-r from-destructive to-amber-500 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-10 w-10 text-white/70 hover:text-white hover:bg-white/10" onClick={() => setShowDetailModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute top-2 left-3">
                  <Badge className={cn('text-xs', getSeverityClass(selectedItem.severity))}>
                    {selectedItem.severity}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-mono text-muted-foreground">{selectedItem.id}</p>
                  <h2 className="text-lg font-semibold mt-1 text-foreground">{selectedItem.title}</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium text-foreground">{selectedItem.type}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className={cn('text-xs mt-1', getStatusClass(selectedItem.status))}>
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Site</span>
                    <span className="text-foreground">{selectedItem.site}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Department</span>
                    <span className="text-foreground">{selectedItem.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Reported By</span>
                    <span className="text-foreground">{selectedItem.reportedBy}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date</span>
                    <span className="text-foreground">{format(new Date(selectedItem.reportedDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Assigned To</span>
                    <span className="text-foreground">{selectedItem.assignedTo}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 min-h-[44px]" asChild>
                    <Link to={`/qa/defects/${selectedItem.id}`}>
                      <Eye className="h-4 w-4 mr-1.5" /> View Details
                    </Link>
                  </Button>
                  <Button variant="outline" className="min-h-[44px]" onClick={() => { toast.success('CAPA created!'); setShowDetailModal(false); }}>
                    <Target className="h-4 w-4 mr-1.5" /> Create CAPA
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}