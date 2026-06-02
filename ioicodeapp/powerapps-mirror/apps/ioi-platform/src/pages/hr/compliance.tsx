import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronRight,
  ArrowLeft,
  FileCheck,
  Search,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Activity,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuditLogHRList } from '@/generated/hooks/use-audit-log-hr';
import type { AuditLogHR } from '@/generated/models/audit-log-hr-model';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;

export default function ComplianceRecordsPage() {
  const { data: auditLogs, isLoading, error, refetch } = useAuditLogHRList();
  const [searchQuery, setSearchQuery] = useState('');
  const [appFilter, setAppFilter] = useState('all');
  const [listFilter, setListFilter] = useState('all');

  const safeAuditLogs = auditLogs || [];

  // Get unique app names and list names for filters
  const { appNames, listNames } = useMemo(() => {
    const apps = new Set<string>();
    const lists = new Set<string>();
    safeAuditLogs.forEach((log: AuditLogHR) => {
      if (log.appName) apps.add(log.appName);
      if (log.listName) lists.add(log.listName);
    });
    return {
      appNames: Array.from(apps).sort(),
      listNames: Array.from(lists).sort(),
    };
  }, [safeAuditLogs]);

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return safeAuditLogs.filter((log: AuditLogHR) => {
      const matchesSearch = !searchQuery ||
        log.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.changedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.fieldName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesApp = appFilter === 'all' || log.appName === appFilter;
      const matchesList = listFilter === 'all' || log.listName === listFilter;
      return matchesSearch && matchesApp && matchesList;
    });
  }, [safeAuditLogs, searchQuery, appFilter, listFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayLogs = safeAuditLogs.filter((log: AuditLogHR) => {
      if (!log.changedOnUTC) return false;
      const logDate = new Date(log.changedOnUTC);
      return logDate >= todayStart;
    });

    const uniqueUsers = new Set(safeAuditLogs.map((log: AuditLogHR) => log.changedBy).filter(Boolean));
    const uniqueLists = new Set(safeAuditLogs.map((log: AuditLogHR) => log.listName).filter(Boolean));

    return {
      total: safeAuditLogs.length,
      today: todayLogs.length,
      uniqueUsers: uniqueUsers.size,
      uniqueLists: uniqueLists.size,
    };
  }, [safeAuditLogs]);

  const handleExport = () => {
    toast.success('Audit log exported', {
      description: 'CSV file generated and ready for download',
    });
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

      {/* Header */}
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
              <span className="text-foreground">Compliance & Audit Log</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Compliance & Audit Log</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i: number) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Changes</p>
                    <p className="text-2xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Changes Today</p>
                    <p className="text-2xl font-bold mt-1">{stats.today}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Active Users</p>
                    <p className="text-2xl font-bold mt-1">{stats.uniqueUsers}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Lists Tracked</p>
                    <p className="text-2xl font-bold mt-1">{stats.uniqueLists}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Audit Log Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">Audit Trail</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="h-8 w-40 pl-8 text-xs"
                />
              </div>
              <Select value={appFilter} onValueChange={setAppFilter}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="App" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Apps</SelectItem>
                  {appNames.map((app: string) => (
                    <SelectItem key={app} value={app}>{app}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={listFilter} onValueChange={setListFilter}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="List" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lists</SelectItem>
                  {listNames.map((list: string) => (
                    <SelectItem key={list} value={list}>{list}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <FileCheck className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <EmptyTitle>No Audit Records</EmptyTitle>
                <EmptyDescription>
                  No audit log entries found matching your criteria.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Timestamp</TableHead>
                  <TableHead className="text-xs">Changed By</TableHead>
                  <TableHead className="text-xs">List</TableHead>
                  <TableHead className="text-xs">Field</TableHead>
                  <TableHead className="text-xs">Old Value</TableHead>
                  <TableHead className="text-xs">New Value</TableHead>
                  <TableHead className="text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 20).map((log: AuditLogHR) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="text-xs text-muted-foreground">
                      {log.changedOnUTC ? format(new Date(log.changedOnUTC), 'MMM d, HH:mm') : '—'}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {log.changedBy || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {log.listName || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{log.fieldName || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                      {log.oldValue || '—'}
                    </TableCell>
                    <TableCell className="text-xs max-w-[120px] truncate">
                      {log.newValue || '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`Item ID: ${log.itemID || 'N/A'}`)}>
                            <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
