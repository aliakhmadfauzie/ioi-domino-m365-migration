import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Award,
  ChevronRight,
  ArrowLeft,
  Star,
  TrendingUp,
  Users,
  Loader2,
  Calendar,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useHRAppraisalRecordsList } from '@/generated/hooks/use-hrappraisal-records';
import type { HRAppraisalRecords } from '@/generated/models/hr-appraisal-records-model';
import { useUser } from '@/hooks/use-user';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

export default function PerformancePage() {
  const { data: user } = useUser();
  const { data: appraisals, isLoading, error, refetch } = useHRAppraisalRecordsList();

  const safeAppraisals = appraisals || [];

  // Calculate stats from real data
  const stats = useMemo(() => {
    if (safeAppraisals.length === 0) {
      return { avgRating: 0, totalReviews: 0, trend: 0, ratingBreakdown: [] };
    }

    const ratingsWithValues = safeAppraisals.filter((a: HRAppraisalRecords) => a.rating !== undefined && a.rating !== null && a.rating !== '');
    const totalRatings = ratingsWithValues.reduce((sum: number, a: HRAppraisalRecords) => {
      const rating = parseFloat(a.rating || '0');
      return sum + (isNaN(rating) ? 0 : rating);
    }, 0);
    const avgRating = ratingsWithValues.length > 0 ? totalRatings / ratingsWithValues.length : 0;

    // Group by cycle year for trend analysis
    const byCycle: Record<string, number[]> = {};
    safeAppraisals.forEach((a: HRAppraisalRecords) => {
      const cycle = a.cycleYear || 'Unknown';
      if (!byCycle[cycle]) byCycle[cycle] = [];
      if (a.rating) {
        const rating = parseFloat(a.rating);
        if (!isNaN(rating)) byCycle[cycle].push(rating);
      }
    });

    // Calculate distribution for breakdown
    const ratingCounts = [0, 0, 0, 0, 0]; // 1-5 stars
    ratingsWithValues.forEach((a: HRAppraisalRecords) => {
      const rating = Math.round(parseFloat(a.rating || '0'));
      if (!isNaN(rating) && rating >= 1 && rating <= 5) ratingCounts[rating - 1]++;
    });

    const ratingBreakdown = [
      { label: 'Excellent (5)', value: (ratingCounts[4] / Math.max(ratingsWithValues.length, 1)) * 100 },
      { label: 'Good (4)', value: (ratingCounts[3] / Math.max(ratingsWithValues.length, 1)) * 100 },
      { label: 'Satisfactory (3)', value: (ratingCounts[2] / Math.max(ratingsWithValues.length, 1)) * 100 },
      { label: 'Needs Improvement (2)', value: (ratingCounts[1] / Math.max(ratingsWithValues.length, 1)) * 100 },
      { label: 'Unsatisfactory (1)', value: (ratingCounts[0] / Math.max(ratingsWithValues.length, 1)) * 100 },
    ];

    return {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: safeAppraisals.length,
      trend: 5, // Placeholder - would need historical comparison
      ratingBreakdown,
    };
  }, [safeAppraisals]);

  // Get status color
  const getStatusClass = (statusKey: string | undefined) => {
    switch (statusKey) {
      case 'StatusKey1': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'StatusKey2': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'StatusKey3': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      default: return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  const getStatusLabel = (statusKey: string | undefined) => {
    switch (statusKey) {
      case 'StatusKey1': return 'Pending';
      case 'StatusKey2': return 'In Review';
      case 'StatusKey3': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-accent/50 dark:bg-accent/30 border border-accent dark:border-accent"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
              <div>
                <p className="text-sm font-medium text-accent-foreground dark:text-accent-foreground">Connection Issue</p>
                <p className="text-xs text-accent-foreground dark:text-accent-foreground">SharePoint data unavailable</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-accent text-accent-foreground hover:bg-accent"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </motion.div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/hr">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link to="/hr" className="hover:text-foreground transition-colors">HR</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground">Performance Appraisals</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Performance Appraisals</h1>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i: number) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 dark:from-emerald-950/30 dark:to-green-950/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary dark:text-primary">
                      {stats.avgRating || '—'}
                    </p>
                    <p className="text-sm text-primary dark:text-primary">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">+{stats.trend}%</p>
                    <p className="text-sm text-muted-foreground">vs Last Quarter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent dark:bg-accent/30 flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stats.totalReviews}</p>
                    <p className="text-sm text-muted-foreground">Total Appraisals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Rating Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Rating Distribution</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i: number) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats.ratingBreakdown.map((item: { label: string; value: number }) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{Math.round(item.value)}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appraisal Records Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Appraisal Records</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : safeAppraisals.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <Award className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <EmptyTitle>No Appraisals Found</EmptyTitle>
                <EmptyDescription>
                  No appraisal records in the system yet.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Appraisal No</TableHead>
                  <TableHead className="text-xs">Employee</TableHead>
                  <TableHead className="text-xs">Cycle</TableHead>
                  <TableHead className="text-xs">Rating</TableHead>
                  <TableHead className="text-xs">Reviewer</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeAppraisals.slice(0, 10).map((appraisal: HRAppraisalRecords) => (
                  <TableRow key={appraisal.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{appraisal.appraisalNo || '—'}</TableCell>
                    <TableCell className="text-sm">{appraisal.employeeNo || '—'}</TableCell>
                    <TableCell className="text-sm">{appraisal.cycleYear || '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-accent-foreground fill-amber-500" />
                        <span className="font-medium">{appraisal.rating || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {appraisal.reviewerEmail || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-[10px]', getStatusClass(appraisal.statusKey))}>
                        {getStatusLabel(appraisal.statusKey)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
