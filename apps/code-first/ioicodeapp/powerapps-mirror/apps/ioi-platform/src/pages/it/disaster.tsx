import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, Shield, CheckCircle2, AlertTriangle, Clock, Server, ChevronDown, RefreshCw, Calendar, Database, HardDrive, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InMemoryDataBanner } from '@/generated/components/in-memory-data-banner';
import { HAS_IN_MEMORY_TABLES } from '@/generated/hooks';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
} as const;

interface SystemInfo {
  name: string;
  status: 'Protected' | 'Partial' | 'At Risk';
  coverage: number;
  lastBackup: string;
  backupSize: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string;
}

export default function DisasterRecoveryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // DR metrics - would connect to IT monitoring system
  const drStatus = {
    lastBackup: '2 hours ago',
    rpo: '4 hours',
    rto: '8 hours',
    nextTest: 'May 15, 2026',
  };

  const systems: SystemInfo[] = [
    { 
      name: 'Email & Exchange', 
      status: 'Protected', 
      coverage: 100,
      lastBackup: '1 hour ago',
      backupSize: '2.4 TB',
      icon: Mail,
      details: 'Full mailbox backup with 15-minute incremental snapshots. Geo-redundant storage in Azure Southeast Asia.',
    },
    { 
      name: 'SharePoint Online', 
      status: 'Protected', 
      coverage: 100,
      lastBackup: '30 minutes ago',
      backupSize: '8.7 TB',
      icon: FileText,
      details: 'Document libraries and site collections backed up with version history. 90-day retention policy.',
    },
    { 
      name: 'SAP ERP', 
      status: 'Protected', 
      coverage: 95,
      lastBackup: '4 hours ago',
      backupSize: '1.2 TB',
      icon: Database,
      details: 'Database snapshots every 4 hours. Transaction logs backed up every 15 minutes.',
    },
    { 
      name: 'File Servers', 
      status: 'Protected', 
      coverage: 98,
      lastBackup: '2 hours ago',
      backupSize: '15.3 TB',
      icon: HardDrive,
      details: 'Prai and Johor file servers with cross-site replication. Shadow copies enabled.',
    },
    { 
      name: 'Development Servers', 
      status: 'Partial', 
      coverage: 75,
      lastBackup: '12 hours ago',
      backupSize: '450 GB',
      icon: Server,
      details: 'Non-production systems with daily backup schedule. Some dev environments excluded.',
    },
  ];

  const overallCoverage = Math.round(systems.reduce((acc: number, sys: SystemInfo) => acc + sys.coverage, 0) / systems.length);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Protected':
        return <Badge className="bg-accent text-accent-foreground">Protected</Badge>;
      case 'Partial':
        return <Badge variant="secondary">Partial</Badge>;
      case 'At Risk':
        return <Badge variant="destructive">At Risk</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6" aria-hidden="true">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-7 w-48" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i: number) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-6 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <InMemoryDataBanner
        show={HAS_IN_MEMORY_TABLES}
        message="DR metrics shown are for demonstration. Connect to your monitoring system for live data."
        className="bg-secondary text-secondary-foreground border-border"
      />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Link to="/it">
          <Button variant="ghost" size="icon" className="h-11 w-11">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/it" className="hover:text-foreground transition-colors">IT</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Disaster Recovery</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Disaster Recovery</h1>
        </div>
      </motion.div>

      {/* Status Overview */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-accent bg-accent/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center">
                <Shield className="h-7 w-7 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">DR Status: Active</h2>
                  <Badge className="bg-accent text-accent-foreground">
                    All Systems Protected
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Last backup completed {drStatus.lastBackup}
                </p>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Run Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{drStatus.rpo}</p>
                <p className="text-sm text-muted-foreground">RPO Target</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{drStatus.rto}</p>
                <p className="text-sm text-muted-foreground">RTO Target</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overallCoverage}%</p>
                <p className="text-sm text-muted-foreground">Overall Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{drStatus.nextTest}</p>
                <p className="text-sm text-muted-foreground">Next DR Test</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Systems Coverage */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">System Coverage</h3>
              <Badge variant="outline" className="text-xs">
                {systems.length} Systems Monitored
              </Badge>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {systems.map((system: SystemInfo) => {
                  const IconComponent = system.icon;
                  const isExpanded = expandedSystem === system.name;
                  
                  return (
                    <Collapsible
                      key={system.name}
                      open={isExpanded}
                      onOpenChange={() => setExpandedSystem(isExpanded ? null : system.name)}
                    >
                      <motion.div
                        layout
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <CollapsibleTrigger asChild>
                          <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors min-h-[56px]">
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                              <IconComponent className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-foreground font-medium">{system.name}</span>
                                {getStatusBadge(system.status)}
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <Progress 
                                  value={system.coverage} 
                                  className="h-2 flex-1 max-w-[200px]"
                                />
                                <span className="text-sm font-semibold text-foreground">{system.coverage}%</span>
                              </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/30">
                            <div className="grid grid-cols-2 gap-4 pt-4">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Backup</p>
                                <p className="text-sm font-medium text-foreground mt-1">{system.lastBackup}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Backup Size</p>
                                <p className="text-sm font-medium text-foreground mt-1">{system.backupSize}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Details</p>
                              <p className="text-sm text-foreground mt-1">{system.details}</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button variant="outline" size="sm">View Logs</Button>
                              <Button variant="outline" size="sm">Run Backup</Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </motion.div>
                    </Collapsible>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Banner */}
      <motion.div variants={itemVariants}>
        <Card className="border-border bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Demo Data</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This page displays demonstration DR metrics. To show live data, connect to your IT monitoring 
                  system (Azure Backup, Veeam, or similar) via the SharePoint list or API integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border sm:hidden z-50">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12" asChild>
            <Link to="/it">Back to IT</Link>
          </Button>
          <Button className="flex-1 h-12 gap-2">
            <RefreshCw className="h-4 w-4" />
            Run Backup
          </Button>
        </div>
      </div>
    </motion.div>
  );
}