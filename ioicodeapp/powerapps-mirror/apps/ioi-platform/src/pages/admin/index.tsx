import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  GitBranch,
  FileText,
  Users,
  Settings,
  Activity,
  TrendingUp,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAdminStats, useAdminActiveTab } from '@/hooks/use-admin-config';
import { ApprovalRoutingPanel } from './panels/approval-routing-panel';
import { UserRolesPanel } from './panels/user-roles-panel';
import { FormRegistryPanel } from './panels/form-registry-panel';
import { WorkflowManagementPanel } from './panels/workflow-management-panel';
import { SystemSettingsPanel } from './panels/system-settings-panel';
import { AuditLogPanel } from './panels/audit-log-panel';
import { DataSourceMappingPanel } from './panels/data-source-mapping-panel';
import { UserProfilesPanel } from './panels/user-profiles-panel';
import { UserCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
} as const;

export default function AdminDashboardPage() {
  const stats = useAdminStats();
  const [activeTab, setActiveTab] = useAdminActiveTab();

  const statCards = [
    {
      title: 'Approval Rules',
      value: stats.totalRules,
      active: stats.activeRules,
      icon: GitBranch,
    },
    {
      title: 'Workflows',
      value: stats.totalWorkflows,
      active: stats.activeWorkflows,
      icon: Activity,
    },
    {
      title: 'Form Registry',
      value: stats.totalForms,
      active: stats.activeForms,
      icon: FileText,
    },
    {
      title: 'Role Assignments',
      value: stats.totalRoleAssignments,
      active: stats.activeRoleAssignments,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Global Administrator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Central configuration management for all IOI applications
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              System Online
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-primary font-medium">{stat.active}</span> active
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
              <TabsTrigger value="routing" className="gap-2 data-[state=active]:bg-background">
                <GitBranch className="h-4 w-4" />
                Approval Routing
              </TabsTrigger>
              <TabsTrigger value="workflows" className="gap-2 data-[state=active]:bg-background">
                <Activity className="h-4 w-4" />
                Workflows
              </TabsTrigger>
              <TabsTrigger value="forms" className="gap-2 data-[state=active]:bg-background">
                <FileText className="h-4 w-4" />
                Form Registry
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-2 data-[state=active]:bg-background">
                <Users className="h-4 w-4" />
                User Roles
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-background">
                <Settings className="h-4 w-4" />
                System Settings
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2 data-[state=active]:bg-background">
                <Clock className="h-4 w-4" />
                Audit Log
              </TabsTrigger>
              <TabsTrigger value="datasources" className="gap-2 data-[state=active]:bg-background">
                <Database className="h-4 w-4" />
                Data Sources
              </TabsTrigger>
              <TabsTrigger value="profiles" className="gap-2 data-[state=active]:bg-background">
                <UserCircle className="h-4 w-4" />
                User Profiles
              </TabsTrigger>
              <Link
                to="/admin/forms"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-background"
              >
                <Wrench className="h-4 w-4" />
                Form Builder
              </Link>
            </TabsList>

            <Card className="border-border">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="routing" className="mt-0">
                      <ApprovalRoutingPanel />
                    </TabsContent>

                    <TabsContent value="workflows" className="mt-0">
                      <WorkflowManagementPanel />
                    </TabsContent>

                    <TabsContent value="forms" className="mt-0">
                      <FormRegistryPanel />
                    </TabsContent>

                    <TabsContent value="roles" className="mt-0">
                      <UserRolesPanel />
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0">
                      <SystemSettingsPanel />
                    </TabsContent>

                    <TabsContent value="audit" className="mt-0">
                      <AuditLogPanel />
                    </TabsContent>

                    <TabsContent value="datasources" className="mt-0">
                      <DataSourceMappingPanel />
                    </TabsContent>

                    <TabsContent value="profiles" className="mt-0">
                      <UserProfilesPanel />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}