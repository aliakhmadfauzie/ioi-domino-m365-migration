// Governance Hub - Entry Point
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Shield,
  FileSearch,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight,
  BarChart3,
  Calendar,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { IGFooterBar } from '@/components/layout/ig-footer-bar';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
} as const;

// Governance modules
const modules = [
  {
    id: 'audit',
    title: 'Audit Monitoring',
    description: 'Compliance heatmap & tracking',
    icon: FileSearch,
    href: '/governance/audit',
    stats: { label: 'Active Audits', value: '12' },
    color: 'bg-[#003366]',
  },
  {
    id: 'policies',
    title: 'Policy Management',
    description: 'Document control & versioning',
    icon: FileText,
    href: '/governance/policies',
    stats: { label: 'Total Policies', value: '156' },
    color: 'bg-[#006a6a]',
  },
  {
    id: 'compliance',
    title: 'Compliance Checklists',
    description: 'Self-assessment & certification',
    icon: ClipboardCheck,
    href: '/governance/compliance',
    stats: { label: 'Pending Reviews', value: '8' },
    color: 'bg-[#1a365d]',
  },
];

// KPI summary
const kpis = [
  { label: 'Overall Compliance', value: 94.2, target: 95, trend: '+1.3%', status: 'good' },
  { label: 'Audit Findings Closed', value: 87, target: 100, trend: '+5', status: 'warning' },
  { label: 'Policy Reviews On Track', value: 92, target: 100, trend: '-2%', status: 'good' },
  { label: 'Risk Score', value: 2.4, target: 3, trend: '-0.2', status: 'good' },
];

// Recent activity
const recentActivity = [
  { id: 1, type: 'audit', action: 'ISO 45001 audit completed', user: 'Lee Ming Hao', time: '2 hours ago', status: 'success' },
  { id: 2, type: 'policy', action: 'Data Protection Policy v2.5 pending review', user: 'Nurul Huda', time: '4 hours ago', status: 'pending' },
  { id: 3, type: 'finding', action: 'Critical finding escalated - Labor Law compliance', user: 'System', time: '6 hours ago', status: 'critical' },
  { id: 4, type: 'audit', action: 'ISO 9001 audit scheduled for next week', user: 'Ahmad Razak', time: '1 day ago', status: 'info' },
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'audit': return FileSearch;
    case 'policy': return FileText;
    case 'finding': return AlertTriangle;
    default: return ClipboardCheck;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'success': return 'bg-[#006a6a]/10 text-[#006a6a]';
    case 'pending': return 'bg-[#d97706]/10 text-[#d97706]';
    case 'critical': return 'bg-[#ba1a1a]/10 text-[#ba1a1a]';
    case 'info': return 'bg-[#003366]/10 text-[#003366]';
    default: return 'bg-muted text-muted-foreground';
  }
}

export default function GovernanceHomePage() {
  return (
    <div className="min-h-screen bg-[#f9f9fe] pb-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#003366] via-[#003366] to-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
            className="flex items-start justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="ig-heading-xl">Corporate Governance</h1>
                  <p className="ig-data-text text-white/70">Audit, Compliance & Policy Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/30 text-white hover:bg-white/10 gap-2"
                onClick={() => toast.info('Generating compliance reports...')}
              >
                <BarChart3 className="h-4 w-4" />
                Reports
              </Button>
              <Button 
                size="sm" 
                className="bg-white text-[#003366] hover:bg-white/90 gap-2"
                onClick={() => toast.info('Audit scheduling wizard coming soon')}
              >
                <Calendar className="h-4 w-4" />
                Schedule Audit
              </Button>
            </div>
          </motion.div>

          {/* KPI Bar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-4 mt-6"
          >
            {kpis.map((kpi) => (
              <motion.div
                key={kpi.label}
                variants={cardVariants}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="ig-label-caps text-[9px] text-white/60">{kpi.label}</span>
                  <Badge 
                    className={cn(
                      'text-[9px] border-0',
                      kpi.status === 'good' ? 'bg-[#006a6a]/30 text-[#4ade80]' : 'bg-[#d97706]/30 text-[#fbbf24]'
                    )}
                  >
                    {kpi.trend}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="ig-kpi text-2xl text-white">
                    {typeof kpi.value === 'number' && kpi.value < 10 ? kpi.value.toFixed(1) : Math.round(kpi.value)}
                  </span>
                  <span className="ig-data-text-sm text-white/50">/ {kpi.target}</span>
                </div>
                <Progress 
                  value={(kpi.value / kpi.target) * 100} 
                  className="h-1 mt-2 bg-white/20 [&>div]:bg-white/80" 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Module Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-6 mb-8"
        >
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <motion.div key={module.id} variants={cardVariants}>
                <Link to={module.href}>
                  <Card className="ig-bento-card group cursor-pointer transition-all hover:shadow-lg hover:border-[#003366]/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', module.color)}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#003366] group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="ig-heading-md text-foreground mb-1">{module.title}</h3>
                      <p className="ig-data-text-sm text-muted-foreground mb-4">{module.description}</p>
                      <div className="flex items-center gap-2 pt-4 border-t border-border">
                        <span className="ig-label-caps text-[9px] text-muted-foreground">{module.stats.label}</span>
                        <span className="ig-kpi text-lg text-[#003366]">{module.stats.value}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] as const }}
        >
          <Card className="ig-bento-card">
            <CardHeader className="ig-bento-card-header px-6 py-4">
              <Clock className="h-4 w-4" />
              <span>Recent Activity</span>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      'flex items-center gap-4 px-6 py-4',
                      index !== recentActivity.length - 1 && 'border-b border-border'
                    )}
                  >
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', getStatusColor(activity.status))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="ig-data-text text-foreground">{activity.action}</p>
                      <p className="ig-data-text-sm text-muted-foreground">
                        by {activity.user} • {activity.time}
                      </p>
                    </div>
                    {activity.status === 'critical' && (
                      <Badge className="bg-[#ba1a1a] text-white border-0 ig-label-caps text-[9px]">
                        Attention Required
                      </Badge>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer Bar */}
      <IGFooterBar activeAudit="ISO 45001 • ISO 9001" syncStatus="synced" lastSync="2 mins ago" />
    </div>
  );
}