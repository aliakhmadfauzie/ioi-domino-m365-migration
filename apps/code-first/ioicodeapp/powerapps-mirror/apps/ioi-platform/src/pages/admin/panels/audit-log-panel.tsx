import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  Eye,
  User,
  FileText,
  Settings,
  CheckCircle2,
  XCircle,
  Activity,
  Shield,
  Edit3,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  RefreshCw,
  Database,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { DateRange } from 'react-day-picker';
import { useWorkflowAuditLogList } from '@/generated/hooks/use-workflow-audit-log';
import type { WorkflowAuditLog } from '@/generated/models/workflow-audit-log-model';

type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT' | 'SUBMIT' | 'EXPORT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DRAFT';
type AuditModule = 'FORM' | 'WORKFLOW' | 'USER' | 'ROLE' | 'SETTING' | 'AUTH' | 'REPORT' | 'IT' | 'HR' | 'QA' | 'ADMIN';
type AuditSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: AuditAction;
  module: AuditModule;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  severity: AuditSeverity;
  details: string;
  oldStatus?: string;
  newStatus?: string;
  siteTag?: string;
}

const ACTION_CONFIG: Record<string, { icon: typeof Activity; color: string; label: string }> = {
  CREATE: { icon: Plus, color: 'text-primary', label: 'Create' },
  UPDATE: { icon: Edit3, color: 'text-primary', label: 'Update' },
  DELETE: { icon: Trash2, color: 'text-destructive', label: 'Delete' },
  VIEW: { icon: Eye, color: 'text-muted-foreground', label: 'View' },
  LOGIN: { icon: LogIn, color: 'text-primary', label: 'Login' },
  LOGOUT: { icon: LogOut, color: 'text-muted-foreground', label: 'Logout' },
  APPROVE: { icon: CheckCircle2, color: 'text-primary', label: 'Approve' },
  APPROVED: { icon: CheckCircle2, color: 'text-primary', label: 'Approved' },
  REJECT: { icon: XCircle, color: 'text-destructive', label: 'Reject' },
  REJECTED: { icon: XCircle, color: 'text-destructive', label: 'Rejected' },
  SUBMIT: { icon: FileText, color: 'text-primary', label: 'Submit' },
  SUBMITTED: { icon: FileText, color: 'text-primary', label: 'Submitted' },
  EXPORT: { icon: Download, color: 'text-muted-foreground', label: 'Export' },
  DRAFT: { icon: Edit3, color: 'text-muted-foreground', label: 'Draft' },
};

const SEVERITY_CONFIG: Record<AuditSeverity, { color: string; bgColor: string; label: string }> = {
  INFO: { color: 'text-primary', bgColor: 'bg-primary/10', label: 'Info' },
  WARNING: { color: 'text-primary', bgColor: 'bg-primary/10', label: 'Warning' },
  ERROR: { color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Error' },
  CRITICAL: { color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Critical' },
};

const MODULE_CONFIG: Record<string, { icon: typeof Activity; label: string }> = {
  FORM: { icon: FileText, label: 'Forms' },
  WORKFLOW: { icon: Activity, label: 'Workflows' },
  USER: { icon: User, label: 'Users' },
  ROLE: { icon: Shield, label: 'Roles' },
  SETTING: { icon: Settings, label: 'Settings' },
  AUTH: { icon: LogIn, label: 'Authentication' },
  REPORT: { icon: Download, label: 'Reports' },
  IT: { icon: Database, label: 'IT' },
  HR: { icon: User, label: 'HR' },
  QA: { icon: CheckCircle2, label: 'QA' },
  ADMIN: { icon: Shield, label: 'Admin' },
};

// Convert SharePoint WorkflowAuditLog to our AuditLogEntry
function mapToAuditEntry(sp: WorkflowAuditLog): AuditLogEntry {
  const action = (sp.newStatus?.toUpperCase() || sp.actionTaken?.toUpperCase() || 'UPDATE') as AuditAction;
  const module = (sp.formCode?.toUpperCase() || 'FORM') as AuditModule;
  
  // Determine severity based on action
  let severity: AuditSeverity = 'INFO';
  if (action === 'DELETE' || action === 'REJECTED' || action === 'REJECT') {
    severity = 'WARNING';
  }
  
  return {
    id: String(sp.id),
    timestamp: sp.timestamp || new Date().toISOString(),
    userId: sp.actorEmail || 'unknown',
    userEmail: sp.actorEmail || 'unknown@ioi.com',
    userName: sp.actorName || 'Unknown User',
    action,
    module,
    resourceType: sp.formCode || 'Form',
    resourceId: sp.siteTag,
    resourceName: sp.title,
    severity,
    details: sp.comment || `${action} action on ${sp.formCode}`,
    oldStatus: sp.oldStatus,
    newStatus: sp.newStatus,
    siteTag: sp.siteTag,
  };
}

export function AuditLogPanel() {
  // Fetch real data from SharePoint
  const { data: rawLogs = [], isLoading, error, refetch } = useWorkflowAuditLogList({
    orderBy: ['timestamp desc'],
  });

  // Transform SharePoint data to our audit log format
  const logs = useMemo(() => rawLogs.map(mapToAuditEntry), [rawLogs]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log: AuditLogEntry) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (log.siteTag?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesAction = selectedAction === 'all' || log.action === selectedAction;
      const matchesModule = selectedModule === 'all' || log.module === selectedModule;
      const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;

      let matchesDateRange = true;
      if (dateRange?.from || dateRange?.to) {
        try {
          const logDate = log.timestamp ? parseISO(log.timestamp) : new Date();
          if (dateRange?.from && !isAfter(logDate, startOfDay(dateRange.from))) {
            matchesDateRange = false;
          }
          if (dateRange?.to && !isBefore(logDate, endOfDay(dateRange.to))) {
            matchesDateRange = false;
          }
        } catch {
          matchesDateRange = true;
        }
      }

      return matchesSearch && matchesAction && matchesModule && matchesSeverity && matchesDateRange;
    });
  }, [logs, searchTerm, selectedAction, selectedModule, selectedSeverity, dateRange]);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Timestamp', 'User', 'Email', 'Action', 'Module', 'Resource', 'Details'];
    const csvRows = [headers.join(',')];
    
    filteredLogs.forEach((log: AuditLogEntry) => {
      const row = [
        log.timestamp,
        `"${log.userName}"`,
        log.userEmail,
        log.action,
        log.module,
        `"${log.resourceName || ''}"`,
        `"${log.details.replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filteredLogs.length} audit log entries`);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Audit log refreshed');
  };

  // Get unique actions and modules from the data
  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((log: AuditLogEntry) => log.action));
    return Array.from(actions) as AuditAction[];
  }, [logs]);

  const uniqueModules = useMemo(() => {
    const modules = new Set(logs.map((log: AuditLogEntry) => log.module));
    return Array.from(modules) as AuditModule[];
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Audit Log</h2>
          <p className="text-sm text-muted-foreground">
            Track all system activities and changes (SharePoint Connected)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Database className="h-3 w-3" />
            SharePoint
          </Badge>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2" disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Error loading audit log</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedAction} onValueChange={setSelectedAction}>
          <SelectTrigger>
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map((action: AuditAction) => (
              <SelectItem key={action} value={action}>
                {ACTION_CONFIG[action]?.label || action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger>
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {uniqueModules.map((module: AuditModule) => (
              <SelectItem key={module} value={module}>
                {MODULE_CONFIG[module]?.label || module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
          <SelectTrigger>
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {(Object.keys(SEVERITY_CONFIG) as AuditSeverity[]).map((sev: AuditSeverity) => (
              <SelectItem key={sev} value={sev}>
                {SEVERITY_CONFIG[sev].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start gap-2 font-normal">
              <CalendarIcon className="h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd')} - {format(dateRange.to, 'LLL dd')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {isLoading ? 'Loading...' : `${filteredLogs.length} entries`}
        </Badge>
        {(selectedAction !== 'all' || selectedModule !== 'all' || selectedSeverity !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAction('all');
              setSelectedModule('all');
              setSelectedSeverity('all');
            }}
            className="h-7 text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading audit log from SharePoint...</p>
        </div>
      )}

      {/* Audit Log Table */}
      {!isLoading && (
        <div className="rounded-lg border border-border">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                  <TableHead className="w-[100px]">Module</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead className="w-[90px]">Severity</TableHead>
                  <TableHead className="w-[80px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <p className="mt-4 text-muted-foreground">No audit log entries found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log: AuditLogEntry) => {
                      const actionConfig = ACTION_CONFIG[log.action] || ACTION_CONFIG.UPDATE;
                      const ActionIcon = actionConfig.icon;
                      const moduleConfig = MODULE_CONFIG[log.module] || MODULE_CONFIG.FORM;
                      const sevConfig = SEVERITY_CONFIG[log.severity];

                      return (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="group hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {log.timestamp ? format(parseISO(log.timestamp), 'MMM d, HH:mm:ss') : '—'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{log.userName}</span>
                              <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn('flex items-center gap-1.5', actionConfig.color)}>
                              <ActionIcon className="h-4 w-4" />
                              <span className="text-sm">{actionConfig.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {moduleConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground">{log.resourceType}</span>
                              {log.resourceName && (
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {log.resourceName}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn('text-xs', sevConfig.color, sevConfig.bgColor)}
                            >
                              {sevConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Audit Log Details
            </DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6 py-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Timestamp</p>
                  <p className="font-medium text-foreground">
                    {selectedLog.timestamp ? format(parseISO(selectedLog.timestamp), 'PPpp') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">User</p>
                  <p className="font-medium text-foreground">{selectedLog.userName}</p>
                  <p className="text-xs text-muted-foreground">{selectedLog.userEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Action</p>
                  <div className="flex items-center gap-1.5">
                    {(() => {
                      const config = ACTION_CONFIG[selectedLog.action] || ACTION_CONFIG.UPDATE;
                      const Icon = config.icon;
                      return <Icon className="h-4 w-4" />;
                    })()}
                    <span className="font-medium">{ACTION_CONFIG[selectedLog.action]?.label || selectedLog.action}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Module</p>
                  <p className="font-medium text-foreground">{MODULE_CONFIG[selectedLog.module]?.label || selectedLog.module}</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-foreground">{selectedLog.details}</p>
              </div>

              {/* Status Changes */}
              {(selectedLog.oldStatus || selectedLog.newStatus) && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Status Change</h4>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card">
                    {selectedLog.oldStatus && (
                      <code className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                        {selectedLog.oldStatus}
                      </code>
                    )}
                    {selectedLog.oldStatus && selectedLog.newStatus && (
                      <span className="text-muted-foreground">→</span>
                    )}
                    {selectedLog.newStatus && (
                      <code className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {selectedLog.newStatus}
                      </code>
                    )}
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Technical Details</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resource ID</span>
                    <span className="font-mono text-foreground">{selectedLog.resourceId || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Site Tag</span>
                    <span className="font-mono text-foreground">{selectedLog.siteTag || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Log ID</span>
                    <span className="font-mono text-foreground">{selectedLog.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}