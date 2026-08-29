/**
 * STR Department Home Page
 * Store Management Dashboard with 5 Module Cards
 * 
 * Follows the 5-screen architecture pattern.
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Warehouse,
  ClipboardList,
  ShoppingBag,
  Trash2,
  ClipboardCheck,
  ArrowRight,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSTRSubmissions, useSTRStats } from '@/hooks/use-str-submissions';
import { STR_MODULES, getSTRStatusInfo } from '@/config/str-constants';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
  Warehouse,
  ClipboardList,
  ShoppingBag,
  Trash2,
  ClipboardCheck,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
} as const;

export default function STRHomePage() {
  const { data: submissions, isLoading: submissionsLoading } = useSTRSubmissions();
  const { data: stats, isLoading: statsLoading } = useSTRStats();
  
  // Calculate module stats
  const moduleStats = useMemo(() => {
    if (!submissions) return {};
    
    const result: Record<string, { total: number; pending: number }> = {};
    
    Object.entries(STR_MODULES).forEach(([moduleId, module]) => {
      const moduleSubmissions = submissions.filter((s) =>
        module.forms.includes(s.FormType)
      );
      result[moduleId] = {
        total: moduleSubmissions.length,
        pending: moduleSubmissions.filter((s) =>
          ['Submitted', 'PendingReview', 'PendingApproval'].includes(s.CurrentStatus)
        ).length,
      };
    });
    
    return result;
  }, [submissions]);
  
  // Recent activity
  const recentActivity = useMemo(() => {
    if (!submissions) return [];
    return [...submissions]
      .sort((a, b) => new Date(b.ModifiedDate).getTime() - new Date(a.ModifiedDate).getTime())
      .slice(0, 5);
  }, [submissions]);
  
  const isLoading = submissionsLoading || statsLoading;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <Warehouse className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Store Management</h1>
                <p className="text-sm text-muted-foreground">
                  Inventory, requisitions, procurement, and compliance
                </p>
              </div>
            </div>
            <Button asChild>
              <Link to="/my-submissions">
                <FileText className="mr-2 h-4 w-4" />
                View All Submissions
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Stats Overview */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card className="border-t-4 border-t-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                      {isLoading ? (
                        <Skeleton className="mt-1 h-8 w-16" />
                      ) : (
                        <p className="text-3xl font-bold text-foreground">{stats?.total || 0}</p>
                      )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-amber-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      {isLoading ? (
                        <Skeleton className="mt-1 h-8 w-16" />
                      ) : (
                        <p className="text-3xl font-bold text-foreground">{stats?.pending || 0}</p>
                      )}
                    </div>
                    <div className="rounded-full bg-accent p-3 dark:bg-accent/30">
                      <Clock className="h-5 w-5 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved</p>
                      {isLoading ? (
                        <Skeleton className="mt-1 h-8 w-16" />
                      ) : (
                        <p className="text-3xl font-bold text-foreground">{stats?.approved || 0}</p>
                      )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-amber-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Returned</p>
                      {isLoading ? (
                        <Skeleton className="mt-1 h-8 w-16" />
                      ) : (
                        <p className="text-3xl font-bold text-foreground">{stats?.returned || 0}</p>
                      )}
                    </div>
                    <div className="rounded-full bg-accent p-3">
                      <AlertCircle className="h-5 w-5 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          {/* Module Cards */}
          <motion.div variants={itemVariants}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Modules</h2>
              <Badge variant="outline" className="text-xs">
                5 Active Modules
              </Badge>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(STR_MODULES).map(([moduleId, module], index) => {
                const IconComponent = iconMap[module.icon as keyof typeof iconMap] || Package;
                const moduleStat = moduleStats[moduleId];
                
                return (
                  <motion.div
                    key={moduleId}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={module.route}>
                      <Card className="group h-full cursor-pointer transition-all hover:shadow-lg">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`rounded-xl p-3 ${module.colorLight}`}>
                              <IconComponent className={`h-6 w-6 ${module.colorText}`} />
                            </div>
                            {moduleStat?.pending > 0 && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {moduleStat.pending} pending
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="mt-4 flex items-center gap-2 text-lg">
                            {module.shortName}
                            <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {module.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {module.forms.length} form types
                            </span>
                            {isLoading ? (
                              <Skeleton className="h-4 w-12" />
                            ) : (
                              <span className="font-medium text-foreground">
                                {moduleStat?.total || 0} records
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/my-submissions">
                      View All
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((item) => {
                      const statusInfo = getSTRStatusInfo(item.CurrentStatus);
                      
                      return (
                        <Link
                          key={item.guid}
                          to={`/submissions/${item.guid}`}
                          className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-medium text-foreground">
                                {item.INO}
                              </p>
                              <Badge variant={statusInfo.badgeVariant} className="text-xs">
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.FormType} • {item.Requestor}
                            </p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.ModifiedDate), { addSuffix: true })}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Quick Stats by Module */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Module Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(STR_MODULES).map(([moduleId, module]) => {
                    const moduleStat = moduleStats[moduleId];
                    const total = moduleStat?.total || 0;
                    const pending = moduleStat?.pending || 0;
                    const completed = total - pending;
                    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    return (
                      <div key={moduleId} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{module.shortName}</span>
                          <span className="text-muted-foreground">
                            {completed}/{total} completed ({completionRate}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full ${module.color} transition-all duration-500`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
