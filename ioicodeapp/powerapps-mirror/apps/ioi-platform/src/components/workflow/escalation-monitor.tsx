/**
 * Escalation Monitor Component
 * 
 * Background monitor that checks for SLA breaches and triggers escalations.
 * Can be placed in the app layout to run continuously.
 * 
 * Features:
 * - Periodic SLA checks (configurable interval)
 * - Automatic escalation processing
 * - Notification triggers on escalation
 * - Stats display for admin dashboards
 */

import { useEffect, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEscalationEngine, type EscalationRequest, type EscalationResult } from '@/services/escalation-engine';
import { useWorkflowNotifications, type WorkflowNotificationConfig, buildNotificationConfigFromForm } from '@/hooks/use-workflow-notifications';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  RefreshCw,
  Zap,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

// =============================================================================
// TYPES
// =============================================================================

interface EscalationMonitorProps {
  /** Check interval in milliseconds (default: 5 minutes) */
  checkInterval?: number;
  /** Whether to auto-process escalations */
  autoProcess?: boolean;
  /** Whether to show the stats widget */
  showStats?: boolean;
  /** Callback when escalations are detected */
  onEscalationsDetected?: (count: number) => void;
}

interface MonitorState {
  lastCheck: Date | null;
  isChecking: boolean;
  pendingEscalations: EscalationRequest[];
  processedCount: number;
  errorCount: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EscalationMonitor({
  checkInterval = 5 * 60 * 1000, // 5 minutes
  autoProcess = false,
  showStats = true,
  onEscalationsDetected,
}: EscalationMonitorProps) {
  const queryClient = useQueryClient();
  const { stats, checkForEscalations, processEscalation, isProcessing } = useEscalationEngine();
  const { notifyEscalation } = useWorkflowNotifications();
  const { data: submissions = [] } = useMainDBITList();
  
  const [monitorState, setMonitorState] = useState<MonitorState>({
    lastCheck: null,
    isChecking: false,
    pendingEscalations: [],
    processedCount: 0,
    errorCount: 0,
  });
  
  /**
   * Build notification config from submission and escalation result
   */
  const buildEscalationNotificationConfig = useCallback((
    submission: MainDBIT,
    item: EscalationRequest
  ): WorkflowNotificationConfig => {
    return {
      formcode: item.formCode,
      formId: item.formId,
      formTitle: item.ticketId,
      submitter: {
        email: submission.requestoremail || '',
        name: submission.requestoremail?.split('@')[0] || 'Submitter',
      },
      currentStage: {
        key: `stage_${item.currentEscalationLevel}`,
        name: 'Pending Approval',
        order: item.currentEscalationLevel,
      },
      currentApprover: {
        id: item.currentApprover.id,
        email: item.currentApprover.email,
        name: item.currentApprover.name,
        role: 'Approver',
      },
      site: submission.siteKey,
    };
  }, []);
  
  /**
   * Run escalation check
   */
  const runCheck = useCallback(async () => {
    setMonitorState((prev: MonitorState) => ({ ...prev, isChecking: true }));
    
    try {
      const escalations = await checkForEscalations();
      
      setMonitorState((prev: MonitorState) => ({
        ...prev,
        lastCheck: new Date(),
        isChecking: false,
        pendingEscalations: escalations,
      }));
      
      if (escalations.length > 0) {
        onEscalationsDetected?.(escalations.length);
        
        if (autoProcess) {
          // Process critical escalations automatically
          const criticalItems = escalations.filter((e: EscalationRequest) => e.currentEscalationLevel >= 2);
          for (const item of criticalItems) {
            try {
              const result = await processEscalation(item);
              if (result.success) {
                setMonitorState((prev: MonitorState) => ({
                  ...prev,
                  processedCount: prev.processedCount + 1,
                }));
                
                // Find submission for notification config
                const submission = (submissions as MainDBIT[]).find(
                  (s: MainDBIT) => String(s.id) === item.formId
                );
                
                if (submission && result.escalatedTo) {
                  const config = buildEscalationNotificationConfig(submission, item);
                  await notifyEscalation(config, {
                    email: result.escalatedTo.email,
                    name: result.escalatedTo.name,
                  });
                }
              }
            } catch (error) {
              setMonitorState((prev: MonitorState) => ({
                ...prev,
                errorCount: prev.errorCount + 1,
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error('[EscalationMonitor] Check failed:', error);
      setMonitorState((prev: MonitorState) => ({
        ...prev,
        isChecking: false,
        errorCount: prev.errorCount + 1,
      }));
    }
  }, [checkForEscalations, processEscalation, autoProcess, onEscalationsDetected, submissions, notifyEscalation, buildEscalationNotificationConfig]);
  
  /**
   * Manual trigger for processing all pending escalations
   */
  const processAllPending = useCallback(async () => {
    const { pendingEscalations } = monitorState;
    let processed = 0;
    
    for (const item of pendingEscalations) {
      try {
        const result = await processEscalation(item);
        if (result.success) {
          processed++;
          
          // Find submission and send notification
          const submission = (submissions as MainDBIT[]).find(
            (s: MainDBIT) => String(s.id) === item.formId
          );
          
          if (submission && result.escalatedTo) {
            const config = buildEscalationNotificationConfig(submission, item);
            await notifyEscalation(config, {
              email: result.escalatedTo.email,
              name: result.escalatedTo.name,
            });
          }
        }
      } catch (error) {
        console.error('[EscalationMonitor] Process failed:', error);
      }
    }
    
    toast.success(`Processed ${processed} of ${pendingEscalations.length} escalations`);
    
    // Refresh data
    await queryClient.invalidateQueries({ queryKey: ['main-dbit'] });
    setMonitorState((prev: MonitorState) => ({
      ...prev,
      pendingEscalations: [],
      processedCount: prev.processedCount + processed,
    }));
  }, [monitorState, processEscalation, queryClient, submissions, notifyEscalation, buildEscalationNotificationConfig]);
  
  // Set up periodic check
  useEffect(() => {
    // Initial check on mount
    runCheck();
    
    // Set up interval
    const intervalId = setInterval(runCheck, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [runCheck, checkInterval]);
  
  if (!showStats) {
    return null; // Silent monitor - no UI
  }
  
  const hasIssues = stats.warningCount > 0 || stats.criticalCount > 0;
  
  return (
    <Card className={cn(
      'p-4 transition-all',
      hasIssues ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20' : 'border-border'
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            hasIssues ? 'bg-amber-500/20' : 'bg-primary/10'
          )}>
            {hasIssues ? (
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Clock className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">SLA Monitor</h3>
            <p className="text-xs text-muted-foreground">
              {monitorState.lastCheck 
                ? `Last check: ${monitorState.lastCheck.toLocaleTimeString()}`
                : 'Initializing...'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={runCheck}
            disabled={monitorState.isChecking}
          >
            <RefreshCw className={cn(
              'h-4 w-4',
              monitorState.isChecking && 'animate-spin'
            )} />
          </Button>
          {monitorState.pendingEscalations.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={processAllPending}
              disabled={isProcessing}
            >
              <Zap className="h-4 w-4 mr-1" />
              Process All
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-background border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.warningCount}</p>
        </div>
        
        <div className="p-3 rounded-lg bg-background border border-border">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{stats.criticalCount}</p>
        </div>
        
        <div className="p-3 rounded-lg bg-background border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total Overdue</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalOverdue}</p>
        </div>
        
        <div className="p-3 rounded-lg bg-background border border-border">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Avg Overdue</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.avgTimeOverdue.toFixed(1)}h
          </p>
        </div>
      </div>
      
      {/* Pending Escalations */}
      {monitorState.pendingEscalations.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {monitorState.pendingEscalations.length} items pending escalation
              </span>
            </div>
            <Badge variant="outline" className="text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-600">
              Action Required
            </Badge>
          </div>
          <div className="mt-2 space-y-1">
            {monitorState.pendingEscalations.slice(0, 3).map((item: EscalationRequest) => (
              <div key={item.formId} className="text-xs text-amber-700 dark:text-amber-300">
                • {item.ticketId} - {Math.round(item.hoursOverdue)}h overdue
              </div>
            ))}
            {monitorState.pendingEscalations.length > 3 && (
              <div className="text-xs text-amber-600 dark:text-amber-400">
                ...and {monitorState.pendingEscalations.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Status Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Processed: {monitorState.processedCount} | Errors: {monitorState.errorCount}
        </span>
        <span>
          Next check in {Math.round(checkInterval / 60000)} min
        </span>
      </div>
    </Card>
  );
}

export default EscalationMonitor;
