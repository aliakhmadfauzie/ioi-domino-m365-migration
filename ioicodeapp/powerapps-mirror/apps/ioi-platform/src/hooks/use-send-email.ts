/**
 * Send Email Hook
 *
 * Provides email sending functionality for workflow notifications.
 * Uses Office 365 Outlook connector via the generated service.
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Office365OutlookService } from '@/generated/services/outlook-email-service';
import type { ClientSendHtmlMessage } from '@/generated/models/outlook-email-model';

// =============================================================================
// TYPES
// =============================================================================

export interface SendEmailRequest {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  body: string;
  importance?: 'Low' | 'Normal' | 'High';
  isHtml?: boolean;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for sending emails via Office 365 Outlook connector (PRODUCTION)
 */
export function useSendEmail() {
  return useMutation<SendEmailResult, Error, SendEmailRequest>({
    mutationFn: async (request: SendEmailRequest): Promise<SendEmailResult> => {
      console.log('[Email] Sending email via Office 365:', {
        to: request.to,
        subject: request.subject,
        importance: request.importance || 'Normal',
      });

      try {
        // Build the email message for Office 365 connector
        const emailMessage: ClientSendHtmlMessage = {
          To: Array.isArray(request.to) ? request.to : [request.to],
          Subject: request.subject,
          Body: request.body,
          Importance: (request.importance as ClientSendHtmlMessage['Importance']) || 'Normal',
        };

        // Add CC if provided
        if (request.cc) {
          emailMessage.Cc = Array.isArray(request.cc) ? request.cc : [request.cc];
        }

        // Add BCC if provided
        if (request.bcc) {
          emailMessage.Bcc = Array.isArray(request.bcc) ? request.bcc : [request.bcc];
        }

        // Send email via Office 365 Outlook connector (generated service)
        await Office365OutlookService.SendEmailV2(emailMessage);

        console.log('[Email] Email sent successfully');
        return {
          success: true,
          messageId: `MSG-${Date.now()}`,
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
        console.error('[Email] Exception during email send:', error);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    onError: (error: Error) => {
      console.error('[Email] Send failed:', error);
      toast.error(`Failed to send email: ${error.message}`);
    },
  });
}

/**
 * Hook for sending batch emails
 */
export function useSendBatchEmails() {
  const sendEmail = useSendEmail();

  return useMutation<SendEmailResult[], Error, SendEmailRequest[]>({
    mutationFn: async (requests: SendEmailRequest[]): Promise<SendEmailResult[]> => {
      const results: SendEmailResult[] = [];

      for (const request of requests) {
        try {
          const result = await sendEmail.mutateAsync(request);
          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return results;
    },
  });
}

/**
 * Hook for sending approval notification emails (wrapper for useSendEmail)
 */
export function useSendApprovalEmail() {
  const sendEmail = useSendEmail();

  return useMutation<SendEmailResult, Error, {
    ticketId: string;
    formType: string;
    formTitle: string;
    requestorName: string;
    requestorEmail: string;
    approverEmail: string;
    approverName: string;
    justification: string;
    additionalDetails?: Record<string, string>;
    cc?: string;
  }>({
    mutationFn: async (params): Promise<SendEmailResult> => {
      const subject = `[ACTION REQUIRED] ${params.formType} Approval - ${params.ticketId}`;
      const body = `
        <h2>Approval Request: ${params.ticketId}</h2>
        <p>Dear ${params.approverName},</p>
        <p>A new ${params.formTitle} request requires your approval.</p>
        <table>
          <tr><td><strong>Request ID:</strong></td><td>${params.ticketId}</td></tr>
          <tr><td><strong>Requestor:</strong></td><td>${params.requestorName}</td></tr>
          <tr><td><strong>Justification:</strong></td><td>${params.justification}</td></tr>
        </table>
      `;

      return sendEmail.mutateAsync({
        to: params.approverEmail,
        cc: params.cc,
        subject,
        body,
        importance: 'High',
        isHtml: true,
      });
    },
  });
}

/**
 * Hook for sending confirmation emails to requestors
 */
export function useSendConfirmationEmail() {
  const sendEmail = useSendEmail();

  return useMutation<SendEmailResult, Error, {
    ticketId: string;
    formType: string;
    formTitle: string;
    requestorEmail: string;
    requestorName: string;
    approverName: string;
  }>({
    mutationFn: async (params): Promise<SendEmailResult> => {
      const subject = `[SUBMITTED] ${params.formType} Request - ${params.ticketId}`;
      const body = `
        <h2>Request Submitted: ${params.ticketId}</h2>
        <p>Dear ${params.requestorName},</p>
        <p>Your ${params.formTitle} request has been submitted and is pending approval from ${params.approverName}.</p>
        <p>Reference Number: <strong>${params.ticketId}</strong></p>
      `;

      return sendEmail.mutateAsync({
        to: params.requestorEmail,
        subject,
        body,
        importance: 'Normal',
        isHtml: true,
      });
    },
  });
}

export default useSendEmail;
