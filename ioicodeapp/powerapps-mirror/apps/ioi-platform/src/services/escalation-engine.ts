/**
 * Escalation Engine Service
 * 
 * Monitors approval SLAs and triggers escalations when thresholds are breached.
 * Features:
 * - Configurable SLA thresholds per form type
 * - Multi-level escalation paths
 * - Automatic notification on escalation
 * - Escalation history tracking
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useCreateApprovalRecords } from '@/generated/hooks/use-approval-records';
import { useSendEmail } from '@/hooks/use-send-email';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { ApproverInfo } from '@/hooks/use-approver-matrix';

// =============================================================================
// TYPES
// =============================================================================

export interface EscalationThresholds {
  warning: number;   // Hours before warning
  critical: number;  // Hours before critical
  autoEscalate: number; // Hours before auto-escalation
}

export interface EscalationConfig {
  formCode: string;
  thresholds: EscalationThresholds;
  escalationPath: ApproverRole[];
  notifySubmitterOnEscalation: boolean;
}

export type ApproverRole = 'Approver' | 'HoD' | 'Manager' | 'ExecutiveDirector';

export interface EscalationRequest {
  formId: string;
  formCode: string;
  ticketId: string;
  currentApprover: {
    id: string;
    name: string;
    email: string;
  };
  hoursOverdue: number;
  currentEscalationLevel: number;
}

export interface EscalationResult {
  success: boolean;
  escalatedTo?: {
    id: string;
    name: string;
    email: string;
    role: ApproverRole;
  };
  notificationsSent: string[];
  message: string;
}

export interface EscalationStats {
  warningCount: number;
  criticalCount: number;
  escalatedToday: number;
  totalOverdue: number;
  avgTimeOverdue: number;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const DEFAULT_THRESHOLDS: EscalationThresholds = {
  warning: 24,
  critical: 48,
  autoEscalate: 72,
};

const FORM_ESCALATION_CONFIG: Record<string, Partial<EscalationConfig>> = {
  EAF: {
    thresholds: { warning: 24, critical: 48, autoEscalate: 72 },
    escalationPath: ['Approver', 'HoD', 'Manager', 'ExecutiveDirector'],
  },
  NIR: {
    thresholds: { warning: 16, critical: 32, autoEscalate: 48 },
    escalationPath: ['HoD', 'Manager'],
  },
  RS: {
    thresholds: { warning: 4, critical: 8, autoEscalate: 24 },
    escalationPath: ['Approver', 'Manager'],
  },
  ITSSR: {
    thresholds: { warning: 8, critical: 24, autoEscalate: 48 },
    escalationPath: ['Approver', 'HoD', 'Manager'],
  },
};

// Default escalation targets by level
const ESCALATION_TARGETS: Record<number, { role: ApproverRole; fallbackEmail: string }> = {
  1: { role: 'HoD', fallbackEmail: 'hod.it@ioi.com' },
  2: { role: 'Manager', fallbackEmail: 'it.manager@ioi.com' },
  3: { role: 'ExecutiveDirector', fallbackEmail: 'ed@ioi.com' },
};

// =============================================================================
// HELPERS
// =============================================================================

function getThresholdsForForm(formCode: string): EscalationThresholds {
  return FORM_ESCALATION_CONFIG[formCode]?.thresholds || DEFAULT_THRESHOLDS;
}

function getEscalationLevel(hoursOverdue: number, thresholds: EscalationThresholds): number {
  if (hoursOverdue >= thresholds.autoEscalate) return 3;
  if (hoursOverdue >= thresholds.critical) return 2;
  if (hoursOverdue >= thresholds.warning) return 1;
  return 0;
}

function buildEscalationEmail(
  ticketId: string,
  formCode: string,
  hoursOverdue: number,
  currentApprover: string,
  escalationLevel: number
): { subject: string; body: string } {
  const urgencyLabel = escalationLevel >= 3 ? 'CRITICAL' : escalationLevel >= 2 ? 'URGENT' : 'ATTENTION REQUIRED';
  
  return {
    subject: `[${urgencyLabel}] Escalation: ${ticketId} - ${formCode} Request Overdue`,
    body: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #F5F5F5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #9B2F23; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 600;">
                ⚠️ Approval Escalation - ${urgencyLabel}
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                IOI IT Portal - ${formCode}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <div style="background-color: #FDEDEA; border: 1px solid #9B2F23; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #9B2F23; font-weight: 600;">
                  Request ${ticketId} has been overdue for ${Math.round(hoursOverdue)} hours.
                </p>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden;">
                <tr style="background-color: #FAFAFA;">
                  <td colspan="2" style="padding: 12px; font-weight: 600; border-bottom: 1px solid #E0E0E0;">Escalation Details</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #5C5C5C;">Ticket ID</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; font-weight: 600; color: #9B2F23;">${ticketId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #5C5C5C;">Form Type</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0;">${formCode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #5C5C5C;">Previous Approver</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0;">${currentApprover}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #5C5C5C;">Hours Overdue</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #9B2F23; font-weight: 600;">${Math.round(hoursOverdue)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: #5C5C5C;">Escalation Level</td>
                  <td style="padding: 8px 12px; font-weight: 600;">${escalationLevel}</td>
                </tr>
              </table>
              
              <div style="margin-top: 24px; padding: 16px; background-color: #FFF3E0; border-left: 4px solid #7B3E00; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #7B3E00; font-weight: 600;">Action Required</p>
                <p style="margin: 8px 0 0 0; color: #5C5C5C; font-size: 14px;">
                  Please review and action this request immediately to prevent further escalation.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://apps.powerapps.com/ioi-it-portal/approvals" 
                   style="display: inline-block; padding: 12px 32px; background-color: #9B2F23; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Review Request Now
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background-color: #FAFAFA; border-radius: 0 0 12px 12px; border-top: 1px solid #E0E0E0;">
              <p style="margin: 0; color: #5C5C5C; font-size: 12px;">
                This is an automated escalation notification from the IOI IT Portal.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}

// =============================================================================
// REACT HOOKS
// =============================================================================

/**
 * Hook for escalation engine functionality
 */
export function useEscalationEngine() {
  const queryClient = useQueryClient();
  const { data: submissions = [] } = useMainDBITList();
  const createApprovalRecord = useCreateApprovalRecords();
  const sendEmail = useSendEmail();
  
  // Calculate stats from submissions
  const stats = useMemo((): EscalationStats => {
    const now = new Date();
    let warningCount = 0;
    let criticalCount = 0;
    let totalOverdue = 0;
    let totalOverdueHours = 0;
    
    (submissions as MainDBIT[]).forEach((sub: MainDBIT) => {
      if (sub.currentStatus === 'CurrentstatusKey1' || sub.currentStatus === 'CurrentstatusKey2') {
        if (!sub.submitteddate) return;
        
        const submittedDate = new Date(sub.submitteddate);
        const hoursOld = (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60);
        const thresholds = getThresholdsForForm(sub.formcode);
        
        if (hoursOld >= thresholds.critical) {
          criticalCount++;
          totalOverdue++;
          totalOverdueHours += hoursOld - thresholds.warning;
        } else if (hoursOld >= thresholds.warning) {
          warningCount++;
          totalOverdue++;
          totalOverdueHours += hoursOld - thresholds.warning;
        }
      }
    });
    
    return {
      warningCount,
      criticalCount,
      escalatedToday: 0, // Would need to track this separately
      totalOverdue,
      avgTimeOverdue: totalOverdue > 0 ? totalOverdueHours / totalOverdue : 0,
    };
  }, [submissions]);
  
  // Check for items needing escalation
  const checkForEscalations = useCallback(async () => {
    const now = new Date();
    const itemsNeedingEscalation: EscalationRequest[] = [];
    
    (submissions as MainDBIT[]).forEach((sub: MainDBIT) => {
      if (sub.currentStatus !== 'CurrentstatusKey1' && sub.currentStatus !== 'CurrentstatusKey2') {
        return;
      }
      
      if (!sub.submitteddate) return;
      
      const submittedDate = new Date(sub.submitteddate);
      const hoursOld = (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60);
      const thresholds = getThresholdsForForm(sub.formcode);
      
      if (hoursOld >= thresholds.autoEscalate) {
        itemsNeedingEscalation.push({
          formId: String(sub.id),
          formCode: sub.formcode,
          ticketId: sub.title,
          currentApprover: {
            id: '',
            name: sub.requestoremail?.split('@')[0] || 'Unknown',
            email: sub.requestoremail || '',
          },
          hoursOverdue: hoursOld - thresholds.warning,
          currentEscalationLevel: getEscalationLevel(hoursOld, thresholds),
        });
      }
    });
    
    return itemsNeedingEscalation;
  }, [submissions]);
  
  // Process a single escalation
  const processEscalation = useCallback(async (
    request: EscalationRequest
  ): Promise<EscalationResult> => {
    const notificationsSent: string[] = [];
    
    try {
      const nextLevel = Math.min(request.currentEscalationLevel + 1, 3);
      const target = ESCALATION_TARGETS[nextLevel];
      
      // Create escalation record
      await createApprovalRecord.mutateAsync({
        stagename: `Escalation Level ${nextLevel}`,
        formid: request.formId,
        formcode: request.formCode,
        actionbyid: 'SYSTEM',
        actionbyname: 'Auto-Escalation System',
        actiondate: new Date().toISOString(),
        actionKey: 'ActionKey3',
        comments: `Auto-escalated after ${Math.round(request.hoursOverdue)} hours overdue. Previous assignee: ${request.currentApprover.name}`,
      });
      
      // Send notification
      const { subject, body } = buildEscalationEmail(
        request.ticketId,
        request.formCode,
        request.hoursOverdue,
        request.currentApprover.name,
        nextLevel
      );
      
      await sendEmail.mutateAsync({
        to: target.fallbackEmail,
        subject,
        body,
        importance: 'High',
      });
      notificationsSent.push(target.fallbackEmail);
      
      // Notify previous approver
      if (request.currentApprover.email) {
        await sendEmail.mutateAsync({
          to: request.currentApprover.email,
          subject: `[Notice] ${request.ticketId} Has Been Escalated`,
          body: `The request ${request.ticketId} has been escalated due to SLA breach. Please review immediately.`,
          importance: 'High',
        });
        notificationsSent.push(request.currentApprover.email);
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['main-dbit'] });
      await queryClient.invalidateQueries({ queryKey: ['approval-records'] });
      
      toast.success(`Escalated ${request.ticketId} to Level ${nextLevel}`);
      
      return {
        success: true,
        escalatedTo: {
          id: target.fallbackEmail,
          name: target.role,
          email: target.fallbackEmail,
          role: target.role,
        },
        notificationsSent,
        message: `Successfully escalated to Level ${nextLevel}`,
      };
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Escalation failed';
      toast.error(message);
      return {
        success: false,
        notificationsSent,
        message,
      };
    }
  }, [createApprovalRecord, sendEmail, queryClient]);
  
  // Bulk escalate all critical items
  const processAllCriticalEscalations = useCallback(async () => {
    const items = await checkForEscalations();
    const criticalItems = items.filter((i: EscalationRequest) => i.currentEscalationLevel >= 2);
    
    const results = await Promise.all(
      criticalItems.map((item: EscalationRequest) => processEscalation(item))
    );
    
    const successCount = results.filter((r: EscalationResult) => r.success).length;
    toast.success(`Processed ${successCount} of ${criticalItems.length} escalations`);
    
    return results;
  }, [checkForEscalations, processEscalation]);
  
  return {
    stats,
    checkForEscalations,
    processEscalation,
    processAllCriticalEscalations,
    isProcessing: createApprovalRecord.isPending || sendEmail.isPending,
  };
}

export default useEscalationEngine;