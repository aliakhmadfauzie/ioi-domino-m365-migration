/**
 * Escalation Monitor Component
 * 
 * Dashboard panel for monitoring and managing overdue approvals.
 * Shows escalation status, allows manual escalation, and displays SLA warnings.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Clock,
  ChevronRight,
  Zap,
  User,
  Building2,
  RefreshCw,
  Bell,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  Timer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { useEscalationMonitor } from '@/services/workflow-orchestration-service';
import type { EscalationCheckResult } from '@/services/workflow-orchestration-service';
import { toast } from 'sonner';

// =============================================================================
// TYPES
// =============================================================================

interface EscalationMonitorProps {
  className?: string;
  compact?: boolean;
  maxItems?: number;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function EscalationLevelBadge({ level }: { level: EscalationCheckResult['escalationLevel'] }) {
  const config = {
    warning: {
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      icon: Clock,
      label: 'Warning',
    },
    overdue: {
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      icon: AlertTriangle,
      label: 'Overdue',
    },
    critical: {
      className: 'bg-destructive text-destructive-foreground',
      icon: Zap,
      label: 'Critical',
    },
  };
  
  const { className, icon: Icon, label } = config[level];
  
  return (
    <Badge className={cn('flex items-center gap-1', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function EscalationCard({
  escalation,
  onEscalate,
  isProcessing,
}: {
  escalation: EscalationCheckResult;
  onEscalate: (escalation: EscalationCheckResult) => void;
  isProcessing: boolean;
}) {
  const isOverdue = escalation.daysOverdue > 0;
  const progressValue = Math.min(100, (escalation.hoursOverdue / 72) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative"
    >
      <Card className={cn(
        'border-l-4 transition-all hover:shadow-md',
        escalation.escalationLevel === 'critical' && 'border-l-destructive bg-destructive/5',
        escalation.escalationLevel === 'overdue' && 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20',
        escalation.escalationLevel === 'warning' && 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/10',
      )}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-semibold text-primary">
                  {escalation.ticketId}
                </span>
                <EscalationLevelBadge level={escalation.escalationLevel} />
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {escalation.formCode} • {escalation.currentStage}
              </p>
            </div>
            
            {escalation.needsEscalation && escalation.escalationTarget && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={escalation.escalationLevel === 'critical' ? 'destructive' : 'outline'}
                      onClick={() => onEscalate(escalation)}
                      disabled={isProcessing}
                      className="flex-shrink-0"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-1" />
                          Escalate
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Escalate to {escalation.escalationTarget.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {/* Current Approver */}
          {escalation.currentApprover && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {escalation.currentApprover.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {escalation.currentApprover.email}
                </p>
              </div>
            </div>
          )}
          
          {/* Time Info */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Time elapsed</span>
              <span className={cn(
                'font-medium',
                isOverdue ? 'text-destructive' : 'text-foreground'
              )}>
                {isOverdue 
                  ? `${escalation.daysOverdue}d ${escalation.hoursOverdue % 24}h overdue`
                  : `Due ${formatDistanceToNow(escalation.dueDate, { addSuffix: true })}`
                }
              </span>
            </div>
            <Progress 
              value={progressValue} 
              className={cn(
                'h-1.5',
                escalation.escalationLevel === 'critical' && '[&>div]:bg-destructive',
                escalation.escalationLevel === 'overdue' && '[&>div]:bg-orange-500',
                escalation.escalationLevel === 'warning' && '[&>div]:bg-amber-500',
              )}
            />
          </div>
          
          {/* Escalation Target */}
          {escalation.escalationTarget && escalation.needsEscalation && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Will escalate to:</span>
                <span className="font-medium text-foreground">
                  {escalation.escalationTarget.name}
                </span>
                <Badge variant="outline" className="text-[10px] py-0">
                  {escalation.escalationTarget.role}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function EscalationMonitor({
  className,
  compact = false,
  maxItems = 10,
}: EscalationMonitorProps) {
  const {
    escalations,
    criticalEscalations,
    overdueEscalations,
    warningEscalations,
    criticalCount,
    overdueCount,
    warningCount,
    processEscalation,
    processAllCritical,
    isProcessing,
  } = useEscalationMonitor();
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'single' | 'all';
    escalation?: EscalationCheckResult;
  }>({ open: false, type: 'single' });
  
  // Handle single escalation
  const handleEscalate = (escalation: EscalationCheckResult) => {
    setConfirmDialog({ open: true, type: 'single', escalation });
  };
  
  // Handle escalate all critical
  const handleEscalateAll = () => {
    setConfirmDialog({ open: true, type: 'all' });
  };
  
  // Confirm escalation
  const confirmEscalation = async () => {
    try {
      if (confirmDialog.type === 'single' && confirmDialog.escalation) {
        const result = await processEscalation(confirmDialog.escalation);
        if (result.success) {
          toast.success(`Escalated ${confirmDialog.escalation.ticketId} successfully`);
        } else {
          toast.error('Escalation failed');
        }
      } else if (confirmDialog.type === 'all') {
        const results = await processAllCritical();
        const successCount = results.filter((r: { success: boolean }) => r.success).length;
        toast.success(`Escalated ${successCount} of ${results.length} critical items`);
      }
    } catch (error) {
      toast.error('Escalation failed');
    } finally {
      setConfirmDialog({ open: false, type: 'single' });
    }
  };
  
  // Compact view for dashboard widget
  if (compact) {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Escalations
            </CardTitle>
            {criticalCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-destructive/10">
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              <p className="text-[10px] text-muted-foreground">Critical</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-500/10">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{overdueCount}</p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{warningCount}</p>
              <p className="text-[10px] text-muted-foreground">Warning</p>
            </div>
          </div>
          
          {escalations.length > 0 && (
            <Button variant="outline" size="sm" className="w-full mt-3">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Full view
  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Escalation Monitor
            </h2>
            <p className="text-sm text-muted-foreground">
              {escalations.length} items require attention
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEscalateAll}
                disabled={isProcessing}
              >
                <Zap className="h-4 w-4 mr-1" />
                Escalate All Critical ({criticalCount})
              </Button>
            )}
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{escalations.length}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{overdueCount}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{warningCount}</p>
                  <p className="text-sm text-muted-foreground">Warning</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Escalation List */}
        {escalations.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">All Clear!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No items require escalation at this time.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {/* Critical Section */}
              {criticalEscalations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Critical ({criticalCount})
                  </h3>
                  <AnimatePresence>
                    {criticalEscalations.slice(0, maxItems).map((escalation: EscalationCheckResult) => (
                      <EscalationCard
                        key={escalation.formId}
                        escalation={escalation}
                        onEscalate={handleEscalate}
                        isProcessing={isProcessing}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Overdue Section */}
              {overdueEscalations.length > 0 && (
                <div className="space-y-2 mt-6">
                  <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Overdue ({overdueCount})
                  </h3>
                  <AnimatePresence>
                    {overdueEscalations.slice(0, maxItems).map((escalation: EscalationCheckResult) => (
                      <EscalationCard
                        key={escalation.formId}
                        escalation={escalation}
                        onEscalate={handleEscalate}
                        isProcessing={isProcessing}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Warning Section */}
              {warningEscalations.length > 0 && (
                <div className="space-y-2 mt-6">
                  <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Approaching SLA ({warningCount})
                  </h3>
                  <AnimatePresence>
                    {warningEscalations.slice(0, maxItems).map((escalation: EscalationCheckResult) => (
                      <EscalationCard
                        key={escalation.formId}
                        escalation={escalation}
                        onEscalate={handleEscalate}
                        isProcessing={isProcessing}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-destructive" />
              Confirm Escalation
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'single' 
                ? `Are you sure you want to escalate ${confirmDialog.escalation?.ticketId}?`
                : `Are you sure you want to escalate all ${criticalCount} critical items?`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {confirmDialog.type === 'single' && confirmDialog.escalation?.escalationTarget && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Will be escalated to:</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {confirmDialog.escalation.escalationTarget.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {confirmDialog.escalation.escalationTarget.email}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {confirmDialog.escalation.escalationTarget.role}
                  </Badge>
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-4">
              The escalation target will receive an email notification and the request will be reassigned.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({ open: false, type: 'single' })}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmEscalation}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Confirm Escalation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EscalationMonitor;