// Shared Module Home Layout for IT Department
// Provides consistent structure across M1-M4 module dashboards

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import {
  ArrowLeft,
  Plus,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calendar,
  RefreshCw,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { FormNavigationDialog } from '@/components/it/form-navigation-dialog';
import {
  MainDBITCurrentstatusKeyToLabel,
  type MainDBITCurrentstatusKey,
  type MainDBIT,
} from '@/generated/models/main-dbit-model';
import { statusConfig } from '@/lib/status-utils';
import { getITFormDetailPath } from '@/lib/it-form-routes';
import { format, formatDistanceToNow, parseISO, startOfMonth, isWithinInterval, subDays } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
} as const;

export interface ModuleQuickAction {
  code: string;
  name: string;
  icon: LucideIcon;
  path: string; // Database view path
  newPath?: string; // New submission form path
  colorClass: string;
  isFrequent?: boolean;
}

export interface ModuleHomeLayoutProps {
  moduleCode: 'M1' | 'M2' | 'M3' | 'M4';
  moduleName: string;
  moduleDescription: string;
  moduleIcon: LucideIcon;
  colorClass: string; // e.g., 'bg-primary'
  borderClass: string; // e.g., 'border-l-primary'
  formCodes: string[]; // Form codes that belong to this module (EAF, NIR, RS, etc.)
  quickActions: ModuleQuickAction[];
  submissions: MainDBIT[];
  isLoading: boolean;
  onRefresh?: () => void;
  children?: React.ReactNode; // Module-specific analytics section
}

export function ModuleHomeLayout({
  moduleCode,
  moduleName,
  moduleDescription,
  moduleIcon: ModuleIcon,
  colorClass,
  borderClass,
  formCodes,
  quickActions,
  submissions,
  isLoading,
  onRefresh,
  children,
}: ModuleHomeLayoutProps) {
  const navigate = useNavigate();
  const { data: user } = useUser();

  // Dialog state for form navigation
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ModuleQuickAction | null>(null);

  // Filter submissions to only those matching this module's form codes
  const moduleSubmissions = useMemo(() => {
    return submissions.filter((s: MainDBIT) => {
      const code = s.formcode?.toUpperCase();
      return code && formCodes.map((c: string) => c.toUpperCase()).includes(code);
    });
  }, [submissions, formCodes]);

  // Calculate stats from filtered submissions
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const last7Days = subDays(now, 7);

    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let inProgress = 0;

    for (const s of moduleSubmissions) {
      if (s.currentStatus === 'CurrentstatusKey1') pending++; // Submitted
      if (s.currentStatus === 'CurrentstatusKey2') inProgress++; // Under Review
      if (s.currentStatus === 'CurrentstatusKey3' || s.currentStatus === 'CurrentstatusKey7') approved++;
      if (s.currentStatus === 'CurrentstatusKey4') rejected++;
    }

    // This month
    const thisMonth = moduleSubmissions.filter((s: MainDBIT) => {
      if (!s.submitteddate) return false;
      try {
        const submitDate = parseISO(s.submitteddate);
        return isWithinInterval(submitDate, { start: monthStart, end: now });
      } catch {
        return false;
      }
    }).length;

    // Last 7 days
    const last7 = moduleSubmissions.filter((s: MainDBIT) => {
      if (!s.submitteddate) return false;
      try {
        const submitDate = parseISO(s.submitteddate);
        return isWithinInterval(submitDate, { start: last7Days, end: now });
      } catch {
        return false;
      }
    }).length;

    return {
      total: moduleSubmissions.length,
      pending,
      inProgress,
      approved,
      rejected,
      awaitingAction: pending + inProgress,
      thisMonth,
      last7Days: last7,
    };
  }, [moduleSubmissions]);

  // Recent submissions (last 8)
  const recentSubmissions = useMemo(() => {
    return [...moduleSubmissions]
      .sort((a: MainDBIT, b: MainDBIT) => {
        const dateA = a.submitteddate ? new Date(a.submitteddate).getTime() : 0;
        const dateB = b.submitteddate ? new Date(b.submitteddate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 8);
  }, [moduleSubmissions]);

  // Form code distribution
  const formDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of moduleSubmissions) {
      const code = s.formcode || 'Unknown';
      counts[code] = (counts[code] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [moduleSubmissions]);

  // Alerts - rejected or revision requested
  const alerts = useMemo(() => {
    return moduleSubmissions
      .filter((s: MainDBIT) => s.currentStatus === 'CurrentstatusKey4' || s.currentStatus === 'CurrentstatusKey5')
      .slice(0, 3);
  }, [moduleSubmissions]);

  // Count user's own submissions
  const mySubmissionsCount = useMemo(() => {
    if (!user?.userPrincipalName) return 0;
    const userEmail = user.userPrincipalName.toLowerCase();
    return moduleSubmissions.filter((s: MainDBIT) =>
      s.requestoremail?.toLowerCase() === userEmail
    ).length;
  }, [moduleSubmissions, user?.userPrincipalName]);

  // Count user's pending tasks (where user is an approver)
  const myPendingTasksCount = useMemo(() => {
    if (!user?.userPrincipalName) return 0;
    const userEmail = user.userPrincipalName.toLowerCase();
    // Filter for pending items where user is potentially an approver
    // In a real implementation, this would check against actual workflow assignments
    return moduleSubmissions.filter((s: MainDBIT) => {
      const isPending = s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2';
      const isNotInitiator = s.requestoremail?.toLowerCase() !== userEmail;
      return isPending && isNotInitiator;
    }).length;
  }, [moduleSubmissions, user?.userPrincipalName]);

  // Handle form card click - open dialog
  const handleFormClick = (action: ModuleQuickAction) => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  function getStatusBadge(statusKey: string | null | undefined) {
    const label = statusKey
      ? (MainDBITCurrentstatusKeyToLabel[statusKey as MainDBITCurrentstatusKey] ?? statusKey)
      : 'Draft';
    const cfg = statusKey ? statusConfig[statusKey as MainDBITCurrentstatusKey] : undefined;
    if (cfg) {
      return (
        <Badge
          variant="secondary"
          className={`${cfg.color} ${cfg.bgColor} border-0 font-medium`}
        >
          {label}
        </Badge>
      );
    }
    // Fallback for unknown statuses
    return <Badge variant="outline">{label}</Badge>;
  }

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (window.history.state?.idx > 0) {
                  navigate(-1);
                } else {
                  navigate('/it');
                }
              }}
              className="-ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className={`p-2.5 rounded-xl ${colorClass}`}>
              <ModuleIcon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{moduleCode}</Badge>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{moduleName}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{moduleDescription}</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to={`/my-submissions`}>
              <Eye className="h-4 w-4 mr-2" />
              My Submissions
            </Link>
          </Button>
          {quickActions[0] && (
            <Button asChild>
              <Link to={quickActions[0].path}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Module Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className={`${borderClass} border-l-4`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Module Summary</CardTitle>
                <CardDescription>Overview of all {moduleCode} submissions</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">{stats.total} Total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : stats.awaitingAction}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting Action</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Clock className="h-3 w-3 text-secondary-foreground" />
                  <span className="text-xs text-muted-foreground">Pending + In Progress</span>
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : stats.approved}</div>
                <p className="text-xs text-muted-foreground mt-1">Approved</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground">All time</span>
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/10">
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : stats.rejected}</div>
                <p className="text-xs text-muted-foreground mt-1">Rejected</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <XCircle className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-muted-foreground">Need attention</span>
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/30">
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground mt-1">This Month</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-accent-foreground" />
                  <span className="text-xs text-muted-foreground">Submissions</span>
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : stats.last7Days}</div>
                <p className="text-xs text-muted-foreground mt-1">Last 7 Days</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Recent activity</span>
                </div>
              </div>
            </div>

            {/* My Submissions vs Tasks Summary */}
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to={`/my-submissions`}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">My Submissions</p>
                      <p className="text-xs text-muted-foreground">Requests you've submitted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{mySubmissionsCount}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link
                  to={`/it/approvals?module=${moduleCode.toLowerCase()}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Pending Approvals</p>
                      <p className="text-xs text-muted-foreground">Awaiting your review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{myPendingTasksCount}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>


      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Create a new request for this module</CardDescription>
              </div>
              <Badge variant="secondary">{quickActions.length} forms</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button
                  type="button"
                  key={action.code}
                  onClick={() => handleFormClick(action)}
                  className="flex items-center gap-3 p-4 min-h-[56px] rounded-lg border bg-card hover:bg-accent/50 transition-all text-left w-full group"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${action.colorClass}`}>
                    <action.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{action.code}</p>
                    <p className="text-sm text-muted-foreground truncate">{action.name}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Recent Submissions
                  </CardTitle>
                  <CardDescription>Latest {moduleCode} requests from SharePoint</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/my-submissions`}>
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i: number) => (
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
                    <EmptyDescription>Create your first {moduleName} request</EmptyDescription>
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
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <FileText className="h-5 w-5 text-primary-foreground" />
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
                        {getStatusBadge(submission.currentStatus)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Distribution & Alerts */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Form Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Form Distribution</CardTitle>
              <CardDescription>Submissions by form type</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : formDistribution.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              ) : (
                <div className="space-y-3">
                  {formDistribution.map(([code, count]) => (
                    <div key={code} className="flex items-center gap-4">
                      <Badge variant="outline" className="w-16 justify-center font-mono">{code}</Badge>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colorClass}`}
                          style={{ width: `${Math.min((count / stats.total) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Requires Attention
              </CardTitle>
              <CardDescription>Rejected or revision requested</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i: number) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">No alerts - all on track!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert: MainDBIT) => (
                    <div key={alert.id} className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{alert.title || 'Untitled'}</p>
                        <Badge variant="destructive" className="text-xs">
                          {MainDBITCurrentstatusKeyToLabel[alert.currentStatus as MainDBITCurrentstatusKey]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {alert.formcode} • {alert.requestoremail?.split('@')[0] || 'Unknown'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Module-specific analytics section (passed as children) */}
      {children && <motion.div variants={itemVariants}>{children}</motion.div>}

      {/* Bottom action buttons - hidden when bottom nav is visible */}

      {/* Form Navigation Dialog */}
      {selectedAction && (
        <FormNavigationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          formCode={selectedAction.code}
          formName={selectedAction.name}
          formIcon={selectedAction.icon}
          colorClass={selectedAction.colorClass}
          databasePath={selectedAction.path}
          newPath={selectedAction.newPath}
          mySubmissionsCount={mySubmissionsCount}
          myPendingTasksCount={myPendingTasksCount}
        />
      )}
    </motion.div>
  );
}
