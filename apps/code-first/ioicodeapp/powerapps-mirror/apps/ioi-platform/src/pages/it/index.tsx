// IT Department Home - Navigation Hub to Module Dashboards
// Updated to serve as the primary entry point to M1-M4 module home screens

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
  Key,
  Monitor,
  HardDrive,
  Eye,
  Inbox,
  XCircle,
  TrendingUp,
  Server,
  Shield,
  Award,
  Paperclip,
  Star,
  Calendar,
  MapPin,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  Users,
  Activity,
  Loader2,
  RefreshCw,
  Headset,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { MainDBITCurrentstatusKeyToLabel, MainDBITSiteKeyToLabel, type MainDBITCurrentstatusKey, type MainDBITSiteKey, type MainDBIT } from '@/generated/models/main-dbit-model';
import { format, formatDistanceToNow, subDays, startOfMonth, isWithinInterval, differenceInHours, parseISO } from 'date-fns';
import type { LucideIcon } from 'lucide-react';
import { M1_FORMS, M2_FORMS, M3_FORMS, M4_FORMS, M5_FORMS } from '@/lib/it-forms-config';
import { getITFormDetailPath } from '@/lib/it-form-routes';

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

// IT Modules Configuration
const IT_MODULES = [
  {
    code: 'M1',
    name: 'User & Access',
    description: 'VPN access, Notes ID, password resets, folder permissions',
    icon: Key,
    path: '/it/access',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: M1_FORMS.map((form) => form.code),
    quickForm: { code: M1_FORMS[0].code, name: M1_FORMS[0].name, path: `/it/forms/${M1_FORMS[0].code.toLowerCase()}/new` },
  },
  {
    code: 'M2',
    name: 'IT Support & Services',
    description: 'Support tickets, program requests, daily reports, data restoration',
    icon: Headset,
    path: '/it/support',
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    formCodes: M2_FORMS.map((form) => form.code),
    quickForm: { code: 'ITSSR', name: M2_FORMS.find((form) => form.code === 'ITSSR')?.name || 'IT Support Request', path: '/it/forms/itssr/new' },
  },
  {
    code: 'M3',
    name: 'Hardware & Infrastructure',
    description: 'Asset tracking, hardware inventory, server checklists',
    icon: HardDrive,
    path: '/it/hardware',
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    formCodes: M3_FORMS.map((form) => form.code),
    quickForm: { code: M3_FORMS[0].code, name: M3_FORMS[0].name, path: `/it/forms/${M3_FORMS[0].code.toLowerCase()}/new` },
  },
  {
    code: 'M4',
    name: 'SAP & Enterprise',
    description: 'SAP access, transport requests, configuration, UAT sign-offs',
    icon: Server,
    path: '/it/sap',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: M4_FORMS.map((form) => form.code),
    quickForm: { code: M4_FORMS[0].code, name: M4_FORMS[0].name, path: `/it/forms/${M4_FORMS[0].code.toLowerCase()}/new` },
  },
  {
    code: 'M5',
    name: 'IT Documentation',
    description: 'Company policies, IT procedures, training manuals, ISG documents',
    icon: BookOpen,
    path: '/it/documentation',
    colorClass: 'bg-[#059669]',
    borderClass: 'border-l-[#059669]',
    formCodes: M5_FORMS.map((form) => form.code),
    quickForm: { code: 'IOIP', name: M5_FORMS.find((form) => form.code === 'IOIP')?.name || 'IOI Policy', path: '/it/forms/ioip/new' },
  },
];

const ALL_IT_FORMS = [...M1_FORMS, ...M2_FORMS, ...M3_FORMS, ...M4_FORMS, ...M5_FORMS];

function getFormRoute(code: string) {
  return `/it/forms/${code.toLowerCase()}/new`;
}

// Get module stats from submissions
function useModuleStats(submissions: MainDBIT[]) {
  return useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    
    const moduleStats = IT_MODULES.map((module) => {
      const moduleSubmissions = submissions.filter((s: MainDBIT) => {
        const code = s.formcode?.toUpperCase();
        return code && module.formCodes.map((c: string) => c.toUpperCase()).includes(code);
      });
      
      let pending = 0;
      let approved = 0;
      let rejected = 0;
      
      for (const s of moduleSubmissions) {
        const st = s.currentStatus?.toLowerCase() || '';
        if (st === 'currentstatuskey1' || st === 'currentstatuskey2' || st === 'submitted' || st === 'pendinghod' || st === 'pendinghodacceptance') pending++;
        if (st === 'currentstatuskey3' || st === 'currentstatuskey7' || st === 'approved' || st === 'completed') approved++;
        if (st === 'currentstatuskey4' || st === 'rejected') rejected++;
      }
      
      const thisMonth = moduleSubmissions.filter((s: MainDBIT) => {
        if (!s.submitteddate) return false;
        try {
          const submitDate = parseISO(s.submitteddate);
          return isWithinInterval(submitDate, { start: monthStart, end: now });
        } catch {
          return false;
        }
      }).length;
      
      return {
        ...module,
        total: moduleSubmissions.length,
        pending,
        approved,
        rejected,
        thisMonth,
      };
    });
    
    // Aggregate stats
    const totals = moduleStats.reduce(
      (acc, m) => ({
        total: acc.total + m.total,
        pending: acc.pending + m.pending,
        approved: acc.approved + m.approved,
        rejected: acc.rejected + m.rejected,
        thisMonth: acc.thisMonth + m.thisMonth,
      }),
      { total: 0, pending: 0, approved: 0, rejected: 0, thisMonth: 0 }
    );
    
    return { modules: moduleStats, totals };
  }, [submissions]);
}

function ITDepartmentHomePageContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

  // Fetch real data from SharePoint MainDB_IT
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate desc'],
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Calculate module stats
  const { modules: moduleStats, totals } = useModuleStats(submissions);

  // Recent submissions (last 5)
  const recentSubmissions = submissions.slice(0, 5);

  // Alerts - rejected or revision required
  const alertCount = submissions.filter(
    (s: MainDBIT) => {
      const st = s.currentStatus?.toLowerCase() || '';
      return st === 'currentstatuskey4' || st === 'currentstatuskey5' || st === 'rejected' || st === 'revision_requested';
    }
  ).length;

  const selectedModule = activeModule ? IT_MODULES.find((module) => module.code === activeModule) : null;
  const formsForModule = selectedModule
    ? ALL_IT_FORMS.filter((form) => form.module === selectedModule.code)
    : [];

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
              <Monitor className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">IT Department</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! Select a module below to get started.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link to="/it/approver-dashboard">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approver Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </Link>
          </Button>
          <Button variant="secondary" onClick={() => setNewRequestOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </motion.div>

      {/* New request module selector */}
      <Sheet open={newRequestOpen} onOpenChange={(open) => {
        if (!open) setActiveModule(null);
        setNewRequestOpen(open);
      }}>
        <SheetContent side="bottom" className="h-[85vh] sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {selectedModule ? `${selectedModule.name} forms` : 'Select a module'}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {selectedModule ? (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" className="w-fit" onClick={() => setActiveModule(null)}>
                  <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
                  Back to modules
                </Button>
                <div className="grid gap-3">
                  {formsForModule.map((form) => (
                    <button
                      key={form.code}
                      type="button"
                      onClick={() => {
                        setNewRequestOpen(false);
                        setActiveModule(null);
                        navigate(getFormRoute(form.code));
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white/90 p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          <form.icon className="h-6 w-6 text-slate-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{form.name}</p>
                          <p className="text-sm text-muted-foreground">{form.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {IT_MODULES.map((module) => (
                  <button
                    key={module.code}
                    type="button"
                    onClick={() => setActiveModule(module.code)}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${module.colorClass}`}>
                        <module.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{module.name}</p>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Aggregated KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : totals.thisMonth}</div>
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
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : totals.pending}</div>
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
                <p className="text-sm text-muted-foreground">Approved</p>
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : totals.approved}</div>
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
                <p className="text-sm text-muted-foreground">Rejected</p>
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : totals.rejected}</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : totals.total}</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Banner */}
      {alertCount > 0 && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              {alertCount} request{alertCount > 1 ? 's' : ''} need{alertCount === 1 ? 's' : ''} your attention (rejected or revision requested).
              <Link to="/my-submissions?status=action-required" className="ml-2 underline font-medium">
                View now
              </Link>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Module Cards - Primary Navigation */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">IT Modules</h2>
            <p className="text-sm text-muted-foreground">Select a module to view its dashboard and submit requests</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/it/forms">
              View All Forms
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {moduleStats.map((module) => (
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
                      <span className="text-muted-foreground">Approved:</span>
                      <span className="font-medium">{module.approved}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">Rejected:</span>
                      <span className="font-medium">{module.rejected}</span>
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

      {/* Bottom Section: Recent Activity & Quick Links */}
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
                  <CardDescription>Latest submissions across all modules</CardDescription>
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
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : recentSubmissions.length === 0 ? (
                <Empty className="py-8">
                  <EmptyHeader>
                    <EmptyTitle>No submissions yet</EmptyTitle>
                    <EmptyDescription>Create your first IT request</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-2">
                  {recentSubmissions.map((submission: MainDBIT) => (
                    <button
                      type="button"
                      key={submission.id}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(getITFormDetailPath(submission.formcode, submission.id))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium truncate">{submission.title || 'Untitled'}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{submission.formcode}</span>
                              {submission.submitteddate && (
                                <>
                                  <span>•</span>
                                  <span>{formatDistanceToNow(parseISO(submission.submitteddate), { addSuffix: true })}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {MainDBITCurrentstatusKeyToLabel[submission.currentStatus as MainDBITCurrentstatusKey] || 'Draft'}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links & Resources */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>Tools, dashboards, and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link
                  to="/it/approver-dashboard"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Approver Dashboard</p>
                    <p className="text-sm text-muted-foreground">Review and approve pending requests</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/it/triage-dashboard"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">IT Triage Dashboard</p>
                    <p className="text-sm text-muted-foreground">Pending assignments & escalations</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/it/hardware-dashboard"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <HardDrive className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Hardware Dashboard</p>
                    <p className="text-sm text-muted-foreground">Asset inventory and status</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/it/disaster"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                    <Shield className="h-5 w-5 text-destructive-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Disaster Recovery</p>
                    <p className="text-sm text-muted-foreground">DR procedures and checklists</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/it/isg"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <FileText className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">ISG Documentation</p>
                    <p className="text-sm text-muted-foreground">IT Security Guidelines</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/it/attachments"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Attachments</p>
                    <p className="text-sm text-muted-foreground">View all form attachments</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
                      <EmptyDescription>Create your first IT request</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="space-y-2">
                    {recentSubmissions.map((submission: MainDBIT) => (
                      <button
                        type="button"
                        key={submission.id}
                        className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setSubmissionsOpen(false);
                          navigate(getITFormDetailPath(submission.formcode, submission.id));
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{submission.title || 'Untitled'}</p>
                          <Badge variant="secondary">
                            {MainDBITCurrentstatusKeyToLabel[submission.currentStatus as MainDBITCurrentstatusKey] || 'Draft'}
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
          <Button className="flex-1 min-h-[48px]" onClick={() => setNewRequestOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ITDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading IT dashboard...">
      <ITDepartmentHomePageContent />
    </DataReadyGuard>
  );
}
