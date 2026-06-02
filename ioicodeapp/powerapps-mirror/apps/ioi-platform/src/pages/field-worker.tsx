import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Wrench,
  ClipboardList,
  Shield,
  Clock,
  CheckCircle2,
  ChevronRight,
  FileText,
  Activity,
  Zap,
  Bell,
  MapPin,
  RefreshCw,
  Home,
  User,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';

// Field worker quick actions - optimized for one-handed mobile use
const quickActions = [
  {
    id: 'production',
    label: 'Production',
    icon: Activity,
    color: 'bg-emerald-600',
    route: '/prod/forms',
    description: 'Log production data',
  },
  {
    id: 'safety',
    label: 'Safety Report',
    icon: Shield,
    color: 'bg-amber-600',
    route: '/she/forms',
    description: 'Report safety issues',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    color: 'bg-blue-600',
    route: '/mtr/forms',
    description: 'Equipment requests',
  },
  {
    id: 'quality',
    label: 'Quality',
    icon: ClipboardList,
    color: 'bg-purple-600',
    route: '/qc/forms',
    description: 'QC inspections',
  },
];

// Mock alerts for demonstration
const mockAlerts = [
  {
    id: '1',
    type: 'critical',
    title: 'Safety Stand-Down',
    message: 'Hot work permit required for Area B3',
    time: '10 min ago',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Equipment Alert',
    message: 'Compressor C-102 maintenance due',
    time: '1 hour ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'Shift Update',
    message: 'Production target adjusted to 850 bbl/d',
    time: '2 hours ago',
  },
];

// Mock pending tasks
const mockPendingTasks = [
  {
    id: '1',
    title: 'Daily Production Log',
    formCode: 'PROD-DPL',
    dueIn: '2 hours',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Safety Observation Card',
    formCode: 'SHE-SOC',
    dueIn: 'Today',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Equipment Inspection',
    formCode: 'MTR-EI',
    dueIn: 'Tomorrow',
    priority: 'low',
  },
];

// Mock recent submissions
const mockRecentSubmissions = [
  {
    id: '1',
    title: 'Production Log - Morning',
    status: 'approved',
    time: 'Yesterday',
  },
  {
    id: '2',
    title: 'Equipment Request',
    status: 'pending',
    time: '2 days ago',
  },
  {
    id: '3',
    title: 'Safety Observation',
    status: 'approved',
    time: '3 days ago',
  },
];

export default function FieldWorkerPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'tasks' | 'recent'>('alerts');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const firstName = useMemo(() => {
    if (!user?.fullName) return 'Operator';
    return user.fullName.split(' ')[0];
  }, [user?.fullName]);

  const currentShift = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Morning Shift';
    if (hour >= 14 && hour < 22) return 'Afternoon Shift';
    return 'Night Shift';
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <Zap className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive';
      case 'medium':
        return 'border-l-amber-500';
      default:
        return 'border-l-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact header - optimized for mobile */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setShowMenu(!showMenu)}
            >
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Hi, {firstName}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {currentShift}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={handleRefresh}
          >
            <RefreshCw className={cn('h-5 w-5 text-muted-foreground', isRefreshing && 'animate-spin')} />
          </Button>
        </div>

        {/* Slide-down menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col gap-2">
                <Button variant="ghost" className="justify-start gap-3 h-12" onClick={() => { navigate('/'); setShowMenu(false); }}>
                  <Home className="h-5 w-5" />
                  <span>Full Platform</span>
                </Button>
                <Button variant="ghost" className="justify-start gap-3 h-12" onClick={() => { navigate('/my-submissions'); setShowMenu(false); }}>
                  <FileText className="h-5 w-5" />
                  <span>My Submissions</span>
                </Button>
                <Button variant="ghost" className="justify-start gap-3 h-12" onClick={() => { navigate('/help'); setShowMenu(false); }}>
                  <User className="h-5 w-5" />
                  <span>Help & Support</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-auto px-4 py-4 pb-32">
        {/* Quick Actions Grid - Large touch targets */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
              >
                <button
                  onClick={() => navigate(action.route)}
                  className={cn(
                    'w-full h-28 rounded-xl flex flex-col items-center justify-center gap-2 text-white shadow-lg active:scale-95 transition-transform',
                    action.color
                  )}
                >
                  <action.icon className="h-8 w-8" />
                  <span className="font-semibold text-base">{action.label}</span>
                  <span className="text-xs opacity-80">{action.description}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tabs for Alerts/Tasks/Recent */}
        <section>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
            {[
              { id: 'alerts', label: 'Alerts', count: mockAlerts.length },
              { id: 'tasks', label: 'Tasks', count: mockPendingTasks.length },
              { id: 'recent', label: 'Recent', count: mockRecentSubmissions.length },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="gap-2 shrink-0"
              >
                {tab.label}
                <Badge variant="secondary" className={cn('h-5 px-1.5 text-xs', activeTab === tab.id && 'bg-primary-foreground/20 text-primary-foreground')}>
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {mockAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-destructive">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{alert.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {mockPendingTasks.map((task) => (
                  <Card key={task.id} className={cn('border-l-4', getPriorityColor(task.priority))}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{task.formCode}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="shrink-0">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.dueIn}
                          </Badge>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'recent' && (
              <motion.div
                key="recent"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {mockRecentSubmissions.map((sub) => (
                  <Card key={sub.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {sub.status === 'approved' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-500" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{sub.title}</p>
                            <p className="text-xs text-muted-foreground">{sub.time}</p>
                          </div>
                        </div>
                        {getStatusBadge(sub.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-12 mt-2"
                  onClick={() => navigate('/my-submissions')}
                >
                  View All Submissions
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Bottom action bar - thumb-reachable */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 safe-area-inset-bottom">
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 h-14 text-base gap-2"
            onClick={() => navigate('/prod/forms')}
          >
            <Plus className="h-5 w-5" />
            New Form
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14"
            onClick={() => navigate('/my-submissions')}
          >
            <FileText className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}