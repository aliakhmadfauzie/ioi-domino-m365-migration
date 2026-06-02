// Real-time KPI Dashboard - Connected to SharePoint Data Sources
// Aggregates data from IT, HR, QA, STR, SHE, FIN, and Production departments

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Activity,
  Users,
  Monitor,
  Beaker,
  Warehouse,
  Shield,
  DollarSign,
  Factory,
  Building2,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, PieChart as RePieChart, Pie, Cell, Line, LineChart, ResponsiveContainer } from 'recharts';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBHRList } from '@/generated/hooks/use-main-dbhr';
import { useMainDBQAList } from '@/generated/hooks/use-main-dbqa';
import { useMainDBSTRList } from '@/generated/hooks/use-main-dbstr';
import { useMainDBSHEList } from '@/generated/hooks/use-main-dbshe';
import { useMainDBFINList } from '@/generated/hooks/use-main-dbfin';
import { useMainDBPRDList } from '@/generated/hooks/use-main-dbprd';
import { useUser } from '@/hooks/use-user';
import { useQueryClient } from '@tanstack/react-query';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBHR } from '@/generated/models/main-dbhr-model';
import type { MainDBQA } from '@/generated/models/main-dbqa-model';
import type { MainDBSTR } from '@/generated/models/main-dbstr-model';
import type { MainDBSHE } from '@/generated/models/main-dbshe-model';
import type { MainDBFIN } from '@/generated/models/main-dbfin-model';
import type { MainDBPRD } from '@/generated/models/main-dbprd-model';
import { format, subDays, isAfter, startOfMonth, startOfWeek, differenceInDays, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
} as const;

// Department configuration
interface DepartmentConfig {
  code: string;
  name: string;
  icon: LucideIcon;
  gradient: string;
  color: string;
}

const DEPARTMENTS: DepartmentConfig[] = [
  { code: 'IT', name: 'Information Technology', icon: Monitor, gradient: 'from-blue-600 to-indigo-600', color: 'hsl(var(--chart-1))' },
  { code: 'HR', name: 'Human Resources', icon: Users, gradient: 'from-rose-500 to-pink-600', color: 'hsl(var(--chart-2))' },
  { code: 'QA', name: 'Quality Assurance', icon: Beaker, gradient: 'from-emerald-500 to-teal-600', color: 'hsl(var(--chart-3))' },
  { code: 'STR', name: 'Stores', icon: Warehouse, gradient: 'from-sky-500 to-cyan-600', color: 'hsl(var(--chart-4))' },
  { code: 'SHE', name: 'Safety, Health & Environment', icon: Shield, gradient: 'from-red-500 to-rose-600', color: 'hsl(var(--chart-5))' },
  { code: 'FIN', name: 'Finance', icon: DollarSign, gradient: 'from-green-500 to-emerald-600', color: 'hsl(var(--chart-1))' },
  { code: 'PRD', name: 'Production', icon: Factory, gradient: 'from-amber-500 to-orange-600', color: 'hsl(var(--chart-2))' },
];

const chartConfig = {
  submitted: { label: 'Submitted', color: 'hsl(var(--chart-1))' },
  approved: { label: 'Approved', color: 'hsl(var(--chart-2))' },
  rejected: { label: 'Rejected', color: 'hsl(var(--chart-3))' },
  pending: { label: 'Pending', color: 'hsl(var(--chart-4))' },
  completed: { label: 'Completed', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

const statusChartConfig = {
  draft: { label: 'Draft', color: 'hsl(var(--muted))' },
  submitted: { label: 'Submitted', color: 'hsl(var(--chart-1))' },
  underReview: { label: 'Under Review', color: 'hsl(var(--chart-4))' },
  approved: { label: 'Approved', color: 'hsl(var(--chart-2))' },
  rejected: { label: 'Rejected', color: 'hsl(var(--destructive))' },
  completed: { label: 'Completed', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

type TimeRange = '7d' | '30d' | '90d' | 'all';

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  try {
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getStatusKey(item: { currentStatus?: string; statusKey?: string }): string {
  return item.currentStatus || item.statusKey || '';
}

function isSubmitted(statusKey: string): boolean {
  return statusKey === 'CurrentstatusKey1' || statusKey === 'StatusKey1';
}

function isUnderReview(statusKey: string): boolean {
  return statusKey === 'CurrentstatusKey2' || statusKey === 'StatusKey2';
}

function isApproved(statusKey: string): boolean {
  return statusKey === 'CurrentstatusKey3' || statusKey === 'StatusKey3';
}

function isRejected(statusKey: string): boolean {
  return statusKey === 'CurrentstatusKey4' || statusKey === 'StatusKey4';
}

function isCompleted(statusKey: string): boolean {
  return statusKey === 'CurrentstatusKey7' || statusKey === 'StatusKey5';
}

function isPending(statusKey: string): boolean {
  return isSubmitted(statusKey) || isUnderReview(statusKey);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: user } = useUser();

  // Fetch data from all departments
  const { data: itData = [], isLoading: itLoading } = useMainDBITList();
  const { data: hrData = [], isLoading: hrLoading } = useMainDBHRList();
  const { data: qaData = [], isLoading: qaLoading } = useMainDBQAList();
  const { data: strData = [], isLoading: strLoading } = useMainDBSTRList();
  const { data: sheData = [], isLoading: sheLoading } = useMainDBSHEList();
  const { data: finData = [], isLoading: finLoading } = useMainDBFINList();
  const { data: prdData = [], isLoading: prdLoading } = useMainDBPRDList();

  const isLoading = itLoading || hrLoading || qaLoading || strLoading || sheLoading || finLoading || prdLoading;

  // Time range filter
  const filterByTimeRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case 'all':
      default:
        startDate = new Date(2020, 0, 1); // Far past date
    }
    return startDate;
  }, [timeRange]);

  // Combine all data with department tagging
  const allData = useMemo(() => {
    type TaggedRecord = {
      id: number;
      department: string;
      statusKey: string;
      submittedDate: Date | null;
      title: string;
    };

    const tagged: TaggedRecord[] = [];

    // IT data
    (itData as MainDBIT[]).forEach((item: MainDBIT) => {
      tagged.push({
        id: item.id,
        department: 'IT',
        statusKey: item.currentStatus || '',
        submittedDate: parseDate(item.submitteddate),
        title: item.title,
      });
    });

    // HR data
    (hrData as MainDBHR[]).forEach((item: MainDBHR) => {
      tagged.push({
        id: item.id,
        department: 'HR',
        statusKey: item.statusKey || '',
        submittedDate: parseDate(item.submittedon),
        title: item.title,
      });
    });

    // QA data
    (qaData as MainDBQA[]).forEach((item: MainDBQA) => {
      tagged.push({
        id: item.id,
        department: 'QA',
        statusKey: item.statusKey || '',
        submittedDate: parseDate(item.submittedDate),
        title: item.title,
      });
    });

    // STR data
    (strData as MainDBSTR[]).forEach((item: MainDBSTR) => {
      tagged.push({
        id: item.id,
        department: 'STR',
        statusKey: item.statusKey || '',
        submittedDate: parseDate(item.submittedOn),
        title: item.title,
      });
    });

    // SHE data
    (sheData as MainDBSHE[]).forEach((item: MainDBSHE) => {
      tagged.push({
        id: item.id,
        department: 'SHE',
        statusKey: item.statusKey || '',
        submittedDate: parseDate(item.submittedDate),
        title: item.title,
      });
    });

    // FIN data
    (finData as MainDBFIN[]).forEach((item: MainDBFIN) => {
      tagged.push({
        id: item.id,
        department: 'FIN',
        statusKey: item.statusKey || '',
        submittedDate: parseDate(item.submittedOn),
        title: item.title,
      });
    });

    // PRD data
    (prdData as MainDBPRD[]).forEach((item: MainDBPRD) => {
      tagged.push({
        id: item.id,
        department: 'PRD',
        statusKey: item.statusKey || '',
        submittedDate: parseDate(item.submittedOn),
        title: item.title,
      });
    });

    return tagged;
  }, [itData, hrData, qaData, strData, sheData, finData, prdData]);

  // Filtered data by time range
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      if (!item.submittedDate) return timeRange === 'all';
      return isAfter(item.submittedDate, filterByTimeRange);
    });
  }, [allData, filterByTimeRange, timeRange]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const total = filteredData.length;
    const pending = filteredData.filter((d) => isPending(d.statusKey)).length;
    const approved = filteredData.filter((d) => isApproved(d.statusKey)).length;
    const rejected = filteredData.filter((d) => isRejected(d.statusKey)).length;
    const completed = filteredData.filter((d) => isCompleted(d.statusKey)).length;

    // Calculate approval rate (approved / (approved + rejected))
    const decidedCount = approved + rejected;
    const approvalRate = decidedCount > 0 ? Math.round((approved / decidedCount) * 100) : 0;

    // Calculate average processing time for completed items
    let totalDays = 0;
    let processedCount = 0;
    filteredData
      .filter((d) => isApproved(d.statusKey) || isCompleted(d.statusKey))
      .forEach((item) => {
        if (item.submittedDate) {
          const daysDiff = differenceInDays(new Date(), item.submittedDate);
          if (daysDiff >= 0 && daysDiff < 365) {
            totalDays += daysDiff;
            processedCount++;
          }
        }
      });
    const avgProcessingDays = processedCount > 0 ? Math.round(totalDays / processedCount) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      completed,
      approvalRate,
      avgProcessingDays,
    };
  }, [filteredData]);

  // Department breakdown
  const departmentStats = useMemo(() => {
    const stats = DEPARTMENTS.map((dept) => {
      const deptData = filteredData.filter((d) => d.department === dept.code);
      const total = deptData.length;
      const pending = deptData.filter((d) => isPending(d.statusKey)).length;
      const approved = deptData.filter((d) => isApproved(d.statusKey)).length;
      const rejected = deptData.filter((d) => isRejected(d.statusKey)).length;
      const completed = deptData.filter((d) => isCompleted(d.statusKey)).length;
      return {
        ...dept,
        total,
        pending,
        approved,
        rejected,
        completed,
      };
    });
    return stats.sort((a, b) => b.total - a.total);
  }, [filteredData]);

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const submitted = filteredData.filter((d) => isSubmitted(d.statusKey)).length;
    const underReview = filteredData.filter((d) => isUnderReview(d.statusKey)).length;
    const approved = filteredData.filter((d) => isApproved(d.statusKey)).length;
    const rejected = filteredData.filter((d) => isRejected(d.statusKey)).length;
    const completed = filteredData.filter((d) => isCompleted(d.statusKey)).length;

    return [
      { name: 'Submitted', value: submitted, fill: 'hsl(var(--chart-1))' },
      { name: 'Under Review', value: underReview, fill: 'hsl(var(--chart-4))' },
      { name: 'Approved', value: approved, fill: 'hsl(var(--chart-2))' },
      { name: 'Rejected', value: rejected, fill: 'hsl(var(--destructive))' },
      { name: 'Completed', value: completed, fill: 'hsl(var(--chart-3))' },
    ].filter((s) => s.value > 0);
  }, [filteredData]);

  // Trend data (last 7 days)
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

      const daySubmissions = allData.filter((item) => {
        if (!item.submittedDate) return false;
        return item.submittedDate >= dayStart && item.submittedDate <= dayEnd;
      });

      days.push({
        date: format(date, 'EEE'),
        fullDate: format(date, 'MMM d'),
        submissions: daySubmissions.length,
        pending: daySubmissions.filter((d) => isPending(d.statusKey)).length,
        approved: daySubmissions.filter((d) => isApproved(d.statusKey)).length,
      });
    }
    return days;
  }, [allData]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['mainDBIT-list'] }),
      queryClient.invalidateQueries({ queryKey: ['mainDBHR-list'] }),
      queryClient.invalidateQueries({ queryKey: ['mainDBQA-list'] }),
      queryClient.invalidateQueries({ queryKey: ['mainDBSTR-list'] }),
      queryClient.invalidateQueries({ queryKey: ['mainDBSHE-list'] }),
      queryClient.invalidateQueries({ queryKey: ['mainDBFIN-list'] }),
      queryClient.invalidateQueries({ queryKey: ['mainDBPRD-list'] }),
    ]);
    setIsRefreshing(false);
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {getGreeting()}, {user?.fullName || 'there'}!
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {user?.userPrincipalName || 'Analytics Dashboard'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(val: TimeRange) => setTimeRange(val)}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button size="sm" onClick={() => navigate('/')} className="gap-2">
                <Building2 className="h-4 w-4" />
                Hub
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-8 space-y-6">
        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i: number) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-10 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid gap-4 grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Total Submissions */}
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500" />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Submissions</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{kpis.total.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs">
                    <Badge variant="secondary" className="text-xs">
                      {timeRange === 'all' ? 'All time' : `Last ${timeRange.replace('d', ' days')}`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pending Approvals */}
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/approvals')}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{kpis.pending.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Awaiting action</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Approval Rate */}
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Approval Rate</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{kpis.approvalRate}%</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={kpis.approvalRate} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Avg Processing Time */}
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg. Processing</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{kpis.avgProcessingDays}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-violet-600" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    days average
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Submission Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0, 0, 1] as const }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  7-Day Submission Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" />
                      <YAxis axisLine={false} tickLine={false} className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="submissions"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0, 0, 1] as const }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="flex items-center justify-center">
                    <ChartContainer config={statusChartConfig} className="h-[200px] w-full max-w-[300px]">
                      <RePieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie
                          data={statusDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {statusDistribution.map((entry, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ChartContainer>
                    <div className="flex flex-col gap-2 ml-4">
                      {statusDistribution.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 text-sm">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Department Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.2, 0, 0, 1] as const }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Department Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {departmentStats.filter((d) => d.total > 0).map((dept) => {
                    const Icon = dept.icon;
                    const pendingPercent = dept.total > 0 ? Math.round((dept.pending / dept.total) * 100) : 0;
                    const approvedPercent = dept.total > 0 ? Math.round((dept.approved / dept.total) * 100) : 0;

                    return (
                      <div
                        key={dept.code}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/${dept.code.toLowerCase()}`)}
                      >
                        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br', dept.gradient)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-foreground">{dept.name}</span>
                            <div className="flex items-center gap-2 text-xs">
                              {dept.pending > 0 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  {dept.pending} pending
                                </Badge>
                              )}
                              <span className="font-semibold text-foreground">{dept.total}</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${approvedPercent}%` }}
                            />
                            <div
                              className="h-full bg-amber-500"
                              style={{ width: `${pendingPercent}%` }}
                            />
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    );
                  })}
                  {departmentStats.filter((d) => d.total > 0).length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No submissions in selected time range</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.2, 0, 0, 1] as const }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/10">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{kpis.approved}</p>
                  <p className="text-xs text-muted-foreground mt-1">Approved</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-destructive">{kpis.rejected}</p>
                  <p className="text-xs text-muted-foreground mt-1">Rejected</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{kpis.completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{DEPARTMENTS.filter((d) => (departmentStats.find((s) => s.code === d.code)?.total ?? 0) > 0).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active Depts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <MobileBottomNav variant="hub" />
    </div>
  );
}