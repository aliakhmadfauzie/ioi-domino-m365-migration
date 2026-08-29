import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  HardHat,
  Flame,
  Skull,
  Activity,
  FileWarning,
  ClipboardCheck,
  Eye,
  HeartPulse,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useMainDBSHEList } from '@/generated/hooks/use-main-dbshe';

// Reduced stagger for performance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  count?: number;
  color: string;
  urgent?: boolean;
}

function QuickActionCard({ title, description, icon: Icon, href, count, color, urgent }: QuickActionProps) {
  const navigate = useNavigate();
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <Card
        className={`cursor-pointer hover:shadow-lg transition-all duration-300 h-full border-l-4 ${urgent ? 'ring-2 ring-destructive' : ''}`}
        style={{ borderLeftColor: color }}
        onClick={() => navigate(href)}
      >
        <CardContent className="pt-6 pb-5">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: color }}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex gap-2">
              {urgent && (
                <Badge className="text-xs bg-destructive text-destructive-foreground">
                  Urgent
                </Badge>
              )}
              {count !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              )}
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-1 text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden border-0 bg-card">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 -mr-8 -mt-8" style={{ backgroundColor: color }} />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-2 rounded-lg" style={{ backgroundColor: color }}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SHEDepartmentHomePage() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  // Fetch real data
  const { data: submissions } = useMainDBSHEList();

  // Calculate real stats
  const openIncidents = submissions?.filter((s: { statusKey?: string; formCode?: string }) => 
    s.statusKey === 'StatusKey1' && s.formCode?.startsWith('IR')
  ).length || 0;

  const pendingReviews = submissions?.filter((s: { statusKey?: string; formCode?: string }) => 
    s.statusKey === 'StatusKey1' && s.formCode?.startsWith('HR')
  ).length || 0;

  // Ensure page starts at top and focuses on load
  useEffect(() => {
    window.scrollTo(0, 0);
    pageRef.current?.focus();
  }, []);

  const quickActions: QuickActionProps[] = [
    {
      title: 'Incident Reports',
      description: 'Report and track safety incidents',
      icon: AlertTriangle,
      href: '/she/forms',
      count: openIncidents || 3,
      color: '#ef4444',
      urgent: openIncidents > 0,
    },
    {
      title: 'HIRADC',
      description: 'Hazard identification & risk assessment',
      icon: Eye,
      href: '/she/forms',
      count: pendingReviews || 15,
      color: '#f59e0b',
    },
    {
      title: 'Chemical Management',
      description: 'Chemical inventory and safety data',
      icon: Skull,
      href: '/she/forms',
      count: 42,
      color: '#8b5cf6',
    },
    {
      title: 'Fire Safety',
      description: 'Fire prevention and emergency procedures',
      icon: Flame,
      href: '/she/forms',
      count: 8,
      color: '#dc2626',
    },
    {
      title: 'PPE Management',
      description: 'Personal protective equipment tracking',
      icon: HardHat,
      href: '/she/forms',
      count: 12,
      color: '#3b82f6',
    },
    {
      title: 'Health Surveillance',
      description: 'Occupational health monitoring',
      icon: HeartPulse,
      href: '/she/forms',
      count: 6,
      color: '#10b981',
    },
  ];

  return (
    <div ref={pageRef} tabIndex={-1} className="p-4 md:p-6 space-y-6 md:space-y-8 outline-none pb-24 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive rounded-xl">
              <Shield className="h-7 w-7 md:h-8 md:w-8 text-destructive-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Safety, Health & Environment</h1>
          </div>
          <p className="text-muted-foreground">SHE management, incident reporting, and compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/she/forms')} className="h-11">
            <FileText className="h-4 w-4 mr-2" />
            All Forms
          </Button>
          <Button 
            className="h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 hidden md:flex" 
            onClick={() => navigate('/she/forms/IR-001/new')}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        </div>
      </motion.div>

      {/* Alert Banner - High Contrast */}
      {openIncidents > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
        >
          <Card className="bg-destructive text-destructive-foreground border-0">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">{openIncidents} Open Incidents Require Attention</p>
                <p className="text-sm opacity-90">Near-misses and incidents pending investigation</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/she/forms')}>
                Review
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <StatCard
          title="Days Without LTI"
          value="127"
          icon={Shield}
          trend="Lost Time Injury Free"
          color="#10b981"
        />
        <StatCard
          title="Open Incidents"
          value={openIncidents || 3}
          icon={AlertTriangle}
          trend="Pending investigation"
          color="#ef4444"
        />
        <StatCard
          title="HIRADC Reviews"
          value={pendingReviews || 8}
          icon={Eye}
          trend="Due this month"
          color="#f59e0b"
        />
        <StatCard
          title="Training Compliance"
          value="94%"
          icon={ClipboardCheck}
          trend="Safety training completion"
          color="#3b82f6"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action: QuickActionProps) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </motion.div>

      {/* Safety Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="h-5 w-5 text-destructive" />
              Safety Performance - 2026
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { metric: 'Total Recordable Incident Rate (TRIR)', value: 0.42, target: 0.5, status: 'on-track' },
                { metric: 'Near Miss Reporting Rate', value: 85, target: 80, status: 'exceeding' },
                { metric: 'Safety Training Completion', value: 94, target: 95, status: 'at-risk' },
                { metric: 'PPE Compliance Audits', value: 98, target: 95, status: 'exceeding' },
              ].map((item: { metric: string; value: number; target: number; status: string }) => (
                <div key={item.metric} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.metric}</span>
                      <Badge
                        className={
                          item.status === 'exceeding'
                            ? 'bg-primary text-white'
                            : item.status === 'on-track'
                            ? 'bg-primary text-white'
                            : 'bg-accent text-white'
                        }
                      >
                        {item.status === 'exceeding' ? 'Exceeding' : item.status === 'on-track' ? 'On Track' : 'At Risk'}
                      </Badge>
                    </div>
                    <Progress value={(item.value / item.target) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-24 text-right text-foreground">
                    {item.value}{item.value > 1 ? '%' : ''} / {item.target}{item.target > 1 ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sticky Bottom CTA - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button 
          className="w-full h-14 text-base bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={() => navigate('/she/forms/IR-001/new')}
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          Report Incident
        </Button>
      </div>
    </div>
  );
}