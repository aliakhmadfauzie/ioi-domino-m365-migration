// Operations Department Home - Navigation Hub
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Factory,
  CalendarCheck,
  Package,
  FileText,
  Users,
  BarChart3,
  Plus,
  Eye,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/hooks/use-user';
import { DataReadyGuard } from '@/components/data-ready-guard';
import type { LucideIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
} as const;

const OPS_MODULES: { code: string; name: string; description: string; icon: LucideIcon; path: string; borderClass: string }[] = [
  { code: 'OPSM1', name: 'Production Planning', description: 'Production schedules, capacity planning, and resource allocation', icon: CalendarCheck, path: '/ops/planning', borderClass: 'border-l-primary' },
  { code: 'OPSM2', name: 'Inventory Control', description: 'Inventory management, stock levels, and material flow', icon: Package, path: '/ops/inventory', borderClass: 'border-l-secondary' },
  { code: 'OPSM3', name: 'Work Orders', description: 'Work order creation, tracking, and completion', icon: FileText, path: '/ops/work-orders', borderClass: 'border-l-accent' },
  { code: 'OPSM4', name: 'Shift Management', description: 'Shift scheduling, handover, and attendance', icon: Users, path: '/ops/shifts', borderClass: 'border-l-primary' },
  { code: 'OPSM5', name: 'Performance Monitoring', description: 'OEE, efficiency tracking, and performance reports', icon: BarChart3, path: '/ops/performance', borderClass: 'border-l-secondary' },
];

function OpsHomeContent() {
  const { data: user } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <Factory className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! Production planning, inventory control, work orders, and performance monitoring.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              Submissions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/ops/planning">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div variants={itemVariants}>
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertTitle>Operations Module</AlertTitle>
          <AlertDescription>
            {OPS_MODULES.length} modules available covering production planning, inventory, work orders, shifts, and performance monitoring.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Modules Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OPS_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.code} className={`border-l-4 ${module.borderClass} hover:shadow-md transition-shadow cursor-pointer`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">{module.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                    <Link to={module.path}>
                      Open Module
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OpsDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading Operations dashboard...">
      <OpsHomeContent />
    </DataReadyGuard>
  );
}
