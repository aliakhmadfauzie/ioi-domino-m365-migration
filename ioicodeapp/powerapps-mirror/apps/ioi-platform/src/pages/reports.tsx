import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { PageLoading } from '@/components/page-loading';

const COLORS = ['#166534', '#1752A8', '#5A4A00', '#9B2F23', '#7B3E00', '#424242'];

// Form code display names
const formCodeLabels: Record<string, string> = {
  'ITSSR': 'IT Support Request',
  'EAF': 'External Access Form',
  'NIR': 'Notes ID Request',
  'RS': 'Reset Password',
  'UR': 'User ID Requisition',
  'SFAR': 'Share Folder Access',
  'HI': 'Hardware Inventory',
  'ITSC': 'Server Checklist',
  'PRF': 'Program Request',
};

export default function ReportsPage() {
  const { data: submissions = [], isLoading } = useMainDBITList();


  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      draft: 0,
      submitted: 0,
      inReview: 0,
      approved: 0,
      rejected: 0,
      returned: 0,
    };

    submissions.forEach((s: MainDBIT) => {
      switch (s.currentStatus) {
        case 'CurrentstatusKey0': counts.draft++; break;
        case 'CurrentstatusKey1': counts.submitted++; break;
        case 'CurrentstatusKey2': counts.inReview++; break;
        case 'CurrentstatusKey3': counts.approved++; break;
        case 'CurrentstatusKey4': counts.rejected++; break;
        case 'CurrentstatusKey5': counts.returned++; break;
      }
    });

    return [
      { name: 'Approved', value: counts.approved, fill: '#166534' },
      { name: 'In Review', value: counts.submitted + counts.inReview, fill: '#1752A8' },
      { name: 'Rejected', value: counts.rejected, fill: '#9B2F23' },
      { name: 'Returned', value: counts.returned, fill: '#7B3E00' },
      { name: 'Draft', value: counts.draft, fill: '#424242' },
    ].filter(item => item.value > 0);
  }, [submissions]);

  // Calculate submissions by form type
  const submissionsByForm = useMemo(() => {
    const byForm: Record<string, number> = {};

    submissions.forEach((s: MainDBIT) => {
      const code = s.formcode || 'Unknown';
      byForm[code] = (byForm[code] || 0) + 1;
    });

    return Object.entries(byForm)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [submissions]);

  // Calculate approval rate
  const approvalRate = useMemo(() => {
    const approved = submissions.filter((s: MainDBIT) => s.currentStatus === 'CurrentstatusKey3').length;
    const total = submissions.filter((s: MainDBIT) => 
      s.currentStatus === 'CurrentstatusKey3' || s.currentStatus === 'CurrentstatusKey4'
    ).length;
    return total > 0 ? Math.round((approved / total) * 100) : 0;
  }, [submissions]);

  const chartConfig: ChartConfig = {
    count: {
      label: 'Submissions',
      color: 'var(--chart-1)',
    },
  };

  if (isLoading) {
    return <PageLoading message="Loading reports..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary text-white">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Platform performance insights</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid gap-4 md:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-xs text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvalRate}%</p>
                <p className="text-xs text-muted-foreground">Approval Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Clock className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {submissions.filter((s: MainDBIT) => s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(formCodeLabels).length}</p>
                <p className="text-xs text-muted-foreground">Active Forms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Submissions by Form Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Submissions by Form Type</CardTitle>
              <CardDescription>Number of submissions per form code</CardDescription>
            </CardHeader>
            <CardContent>
              {submissionsByForm.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[250px]">
                  <BarChart data={submissionsByForm} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' as const }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Current submission status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {statusDistribution.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {statusDistribution.map((item, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}