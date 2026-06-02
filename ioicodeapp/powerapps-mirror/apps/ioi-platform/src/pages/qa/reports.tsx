/**
 * QA Reports & Analytics Page
 * Comprehensive QA metrics and reporting
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BarChart3,
  Download,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Filter,
  RefreshCw,
  Bug,
  Target,
  ClipboardCheck,
  GraduationCap,
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PieChart,
  Activity,
  Printer,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// Chart configs
const defectsChartConfig = {
  defects: { label: 'Defects', color: 'var(--chart-1)' },
  resolved: { label: 'Resolved', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const capaChartConfig = {
  corrective: { label: 'Corrective', color: 'var(--chart-3)' },
  preventive: { label: 'Preventive', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const auditChartConfig = {
  score: { label: 'Audit Score', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const complianceChartConfig = {
  compliance: { label: 'Compliance %', color: 'var(--chart-1)' },
} satisfies ChartConfig;

// Mock Data
const MONTHLY_DEFECTS = [
  { month: 'Jan', defects: 12, resolved: 10 },
  { month: 'Feb', defects: 15, resolved: 13 },
  { month: 'Mar', defects: 8, resolved: 11 },
  { month: 'Apr', defects: 18, resolved: 15 },
  { month: 'May', defects: 5, resolved: 8 },
];

const DEFECT_BY_TYPE = [
  { name: 'Product', value: 35, color: 'var(--chart-1)' },
  { name: 'Process', value: 28, color: 'var(--chart-2)' },
  { name: 'Material', value: 18, color: 'var(--chart-3)' },
  { name: 'Equipment', value: 12, color: 'var(--chart-4)' },
  { name: 'Documentation', value: 7, color: 'var(--chart-5)' },
];

const MONTHLY_CAPAS = [
  { month: 'Jan', corrective: 5, preventive: 3 },
  { month: 'Feb', corrective: 7, preventive: 4 },
  { month: 'Mar', corrective: 4, preventive: 6 },
  { month: 'Apr', corrective: 8, preventive: 5 },
  { month: 'May', corrective: 3, preventive: 4 },
];

const AUDIT_SCORES = [
  { month: 'Jan', score: 88 },
  { month: 'Feb', score: 91 },
  { month: 'Mar', score: 87 },
  { month: 'Apr', score: 92 },
  { month: 'May', score: 90 },
];

const TRAINING_COMPLIANCE = [
  { month: 'Jan', compliance: 82 },
  { month: 'Feb', compliance: 85 },
  { month: 'Mar', compliance: 88 },
  { month: 'Apr', compliance: 84 },
  { month: 'May', compliance: 87 },
];

const SITE_METRICS = [
  { site: 'PRAI', defects: 28, capas: 15, audits: 8, training: 85 },
  { site: 'JHR', defects: 22, capas: 12, audits: 6, training: 82 },
];

const REPORT_TEMPLATES = [
  { id: 'monthly-qa', name: 'Monthly QA Summary', description: 'Comprehensive monthly QA metrics report', icon: BarChart3 },
  { id: 'defect-analysis', name: 'Defect Analysis Report', description: 'Detailed defect trends and root causes', icon: Bug },
  { id: 'capa-status', name: 'CAPA Status Report', description: 'All active and closed CAPAs with timelines', icon: Target },
  { id: 'audit-summary', name: 'Audit Summary Report', description: 'Audit findings and compliance scores', icon: ClipboardCheck },
  { id: 'training-matrix', name: 'Training Compliance Report', description: 'Training status across all departments', icon: GraduationCap },
  { id: 'document-review', name: 'Document Review Status', description: 'Documents due for review', icon: FileSearch },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');
  const [selectedSite, setSelectedSite] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Summary metrics
  const summaryMetrics = useMemo(() => ({
    totalDefects: MONTHLY_DEFECTS.reduce((sum, m) => sum + m.defects, 0),
    resolvedDefects: MONTHLY_DEFECTS.reduce((sum, m) => sum + m.resolved, 0),
    defectTrend: -15, // % change
    activeCAPAs: 12,
    closedCAPAs: 8,
    capaTrend: 5,
    avgAuditScore: 90,
    auditTrend: 2,
    trainingCompliance: 85,
    trainingTrend: 3,
  }), []);

  const handleExport = (format: string) => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const handleGenerateReport = (reportId: string) => {
    toast.success('Report generated! Downloading...');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/qa" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-secondary-foreground dark:text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Reports & Analytics</h1>
                  <p className="text-xs text-muted-foreground">QA Performance Metrics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[160px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="PRAI">PRAI</SelectItem>
                  <SelectItem value="JHR">JHR</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Download className="h-4 w-4 mr-1.5" /> Export
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" /> Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileText className="h-4 w-4 mr-2" /> Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success('Report sent to email')}>
                    <Mail className="h-4 w-4 mr-2" /> Send to Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="defects">Defects</TabsTrigger>
            <TabsTrigger value="capas">CAPAs</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="reports">Report Templates</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Summary KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Defects</p>
                      <p className="text-2xl font-bold">{summaryMetrics.totalDefects}</p>
                      <div className={cn('flex items-center gap-1 text-xs mt-1', summaryMetrics.defectTrend < 0 ? 'text-primary' : 'text-destructive')}>
                        {summaryMetrics.defectTrend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {Math.abs(summaryMetrics.defectTrend)}% vs last period
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                      <Bug className="h-6 w-6 text-destructive dark:text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active CAPAs</p>
                      <p className="text-2xl font-bold">{summaryMetrics.activeCAPAs}</p>
                      <div className={cn('flex items-center gap-1 text-xs mt-1', summaryMetrics.capaTrend > 0 ? 'text-accent-foreground' : 'text-primary')}>
                        {summaryMetrics.capaTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(summaryMetrics.capaTrend)}% vs last period
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                      <Target className="h-6 w-6 text-secondary-foreground dark:text-violet-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Audit Score</p>
                      <p className="text-2xl font-bold">{summaryMetrics.avgAuditScore}%</p>
                      <div className={cn('flex items-center gap-1 text-xs mt-1', summaryMetrics.auditTrend > 0 ? 'text-primary' : 'text-destructive')}>
                        {summaryMetrics.auditTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        +{summaryMetrics.auditTrend}% vs last period
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                      <ClipboardCheck className="h-6 w-6 text-primary dark:text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Training Compliance</p>
                      <p className="text-2xl font-bold">{summaryMetrics.trainingCompliance}%</p>
                      <div className={cn('flex items-center gap-1 text-xs mt-1', summaryMetrics.trainingTrend > 0 ? 'text-primary' : 'text-destructive')}>
                        {summaryMetrics.trainingTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        +{summaryMetrics.trainingTrend}% vs last period
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-secondary-foreground dark:text-secondary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Defects Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Defects Trend</CardTitle>
                  <CardDescription>Monthly defects reported vs resolved</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={defectsChartConfig} className="h-[250px] w-full">
                    <BarChart data={MONTHLY_DEFECTS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="defects" fill="var(--chart-1)" radius={4} />
                      <Bar dataKey="resolved" fill="var(--chart-2)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* CAPA Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">CAPA Trend</CardTitle>
                  <CardDescription>Corrective vs Preventive actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={capaChartConfig} className="h-[250px] w-full">
                    <BarChart data={MONTHLY_CAPAS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="corrective" fill="var(--chart-3)" radius={4} />
                      <Bar dataKey="preventive" fill="var(--chart-4)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Audit Scores Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Audit Score Trend</CardTitle>
                  <CardDescription>Monthly average audit scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={auditChartConfig} className="h-[250px] w-full">
                    <LineChart data={AUDIT_SCORES}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis domain={[80, 100]} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="score" stroke="var(--chart-5)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Training Compliance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Training Compliance</CardTitle>
                  <CardDescription>Monthly compliance percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={complianceChartConfig} className="h-[250px] w-full">
                    <AreaChart data={TRAINING_COMPLIANCE}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis domain={[70, 100]} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="compliance" fill="var(--chart-1)" fillOpacity={0.3} stroke="var(--chart-1)" strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Site Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Site Comparison</CardTitle>
                <CardDescription>Performance metrics by site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {SITE_METRICS.map((site) => (
                    <div key={site.site} className="p-4 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-3">{site.site}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Defects</span>
                          <span className="font-medium">{site.defects}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">CAPAs</span>
                          <span className="font-medium">{site.capas}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Audits</span>
                          <span className="font-medium">{site.audits}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Training</span>
                          <span className="font-medium text-primary">{site.training}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Defects Tab */}
          <TabsContent value="defects" className="mt-6 space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Defects by Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={defectsChartConfig} className="h-[300px] w-full">
                    <BarChart data={MONTHLY_DEFECTS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="defects" fill="var(--chart-1)" radius={4} />
                      <Bar dataKey="resolved" fill="var(--chart-2)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Defects by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DEFECT_BY_TYPE.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--chart-${idx + 1})` }} />
                        <span className="text-sm flex-1">{item.name}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                        <Progress value={item.value} className="w-20 h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CAPAs Tab */}
          <TabsContent value="capas" className="mt-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">CAPA Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={capaChartConfig} className="h-[300px] w-full">
                    <BarChart data={MONTHLY_CAPAS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="corrective" fill="var(--chart-3)" radius={4} />
                      <Bar dataKey="preventive" fill="var(--chart-4)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">CAPA Status Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-destructive/5 dark:bg-destructive/30 border border-destructive/20 dark:border-destructive">
                      <p className="text-sm text-destructive dark:text-destructive">Open</p>
                      <p className="text-3xl font-bold text-destructive dark:text-destructive">4</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/30 border border-secondary dark:border-secondary">
                      <p className="text-sm text-secondary-foreground dark:text-secondary-foreground">In Progress</p>
                      <p className="text-3xl font-bold text-secondary-foreground dark:text-secondary-foreground">8</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/50 dark:bg-accent/30 border border-accent dark:border-accent">
                      <p className="text-sm text-accent-foreground dark:text-accent-foreground">Verification</p>
                      <p className="text-3xl font-bold text-accent-foreground dark:text-accent-foreground">3</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/30 border border-primary/20 dark:border-primary">
                      <p className="text-sm text-primary dark:text-primary">Closed</p>
                      <p className="text-3xl font-bold text-primary dark:text-primary">15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audits Tab */}
          <TabsContent value="audits" className="mt-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Audit Score Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={auditChartConfig} className="h-[300px] w-full">
                    <LineChart data={AUDIT_SCORES}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis domain={[80, 100]} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="score" stroke="var(--chart-5)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Audit Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Total Audits (YTD)</span>
                      <span className="font-semibold">14</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-semibold text-primary">10</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Scheduled</span>
                      <span className="font-semibold text-secondary-foreground">4</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Average Score</span>
                      <span className="font-semibold">90%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Open Findings</span>
                      <span className="font-semibold text-accent-foreground">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Report Templates Tab */}
          <TabsContent value="reports" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TEMPLATES.map((report) => {
                const Icon = report.icon;
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleGenerateReport(report.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm">{report.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" className="flex-1" onClick={() => handleGenerateReport(report.id)}>
                          <Download className="h-3.5 w-3.5 mr-1" /> Generate
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); toast.success('Report scheduled'); }}>
                          <Calendar className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}