// Bug Reports Hook - SharePoint IssueAndBugTracker integration

import { useMemo } from 'react';
import { useUser } from '@/hooks/use-user';
import {
  useIssueAndBugTrackerList,
  useCreateIssueAndBugTracker,
} from '@/generated/hooks/use-issue-and-bug-tracker';
import {
  IssueAndBugTrackerPriorityKeyToLabel,
  IssueAndBugTrackerStatusKeyToLabel,
} from '@/generated/models/issue-and-bug-tracker-model';
import type {
  IssueAndBugTracker,
  IssueAndBugTrackerPriorityKey,
  IssueAndBugTrackerStatusKey,
} from '@/generated/models/issue-and-bug-tracker-model';
import type { BugReport, BugReportInput, BugStats, BugSeverity, BugStatus } from './types';

// Map local severity to SharePoint priority key
const severityToPriorityKey: Record<BugSeverity, IssueAndBugTrackerPriorityKey> = {
  critical: 'PriorityKey0',
  major: 'PriorityKey1',
  minor: 'PriorityKey2',
  cosmetic: 'PriorityKey3',
};

// Map SharePoint priority key to local severity
const priorityKeyToSeverity: Record<IssueAndBugTrackerPriorityKey, BugSeverity> = {
  PriorityKey0: 'critical',
  PriorityKey1: 'major',
  PriorityKey2: 'minor',
  PriorityKey3: 'cosmetic',
};

// Map local status to SharePoint status key
const statusToStatusKey: Record<BugStatus, IssueAndBugTrackerStatusKey> = {
  new: 'StatusKey0',
  'in-progress': 'StatusKey1',
  resolved: 'StatusKey2',
  closed: 'StatusKey2', // Map to Completed
  wontfix: 'StatusKey6',
};

// Map SharePoint status key to local status
const statusKeyToStatus: Record<IssueAndBugTrackerStatusKey, BugStatus> = {
  StatusKey0: 'new',
  StatusKey1: 'in-progress',
  StatusKey2: 'resolved',
  StatusKey3: 'in-progress', // Blocked -> in-progress
  StatusKey4: 'closed', // Duplicate -> closed
  StatusKey5: 'wontfix', // By design -> wontfix
  StatusKey6: 'wontfix',
};

// Generate bug ID from numeric ID
const formatBugId = (id: number): string => `BUG-${String(id).padStart(3, '0')}`;

// Transform SharePoint record to local BugReport type
const transformToBugReport = (item: IssueAndBugTracker): BugReport => {
  // Parse metadata from comment field (JSON stored there)
  let metadata: {
    category?: string;
    currentPage?: string;
    stepsToReproduce?: string;
    screenshot?: string;
    attachments?: BugReport['attachments'];
    assignedTo?: BugReport['assignedTo'];
    reportedBy?: string;
    browserInfo?: string;
    reportedAt?: string;
    updatedAt?: string;
  } = {};
  
  try {
    if (item.comment) {
      metadata = JSON.parse(item.comment);
    }
  } catch {
    // If comment is plain text, use it as part of description
  }

  return {
    id: formatBugId(item.id),
    title: item.title,
    description: item.issueDescription || '',
    severity: item.priorityKey ? priorityKeyToSeverity[item.priorityKey] : 'minor',
    category: (metadata.category as BugReport['category']) || 'other',
    status: item.statusKey ? statusKeyToStatus[item.statusKey] : 'new',
    currentPage: metadata.currentPage || '/',
    stepsToReproduce: metadata.stepsToReproduce,
    screenshot: metadata.screenshot,
    attachments: metadata.attachments,
    reportedBy: metadata.reportedBy || 'Unknown',
    reportedAt: metadata.reportedAt ? new Date(metadata.reportedAt) : new Date(),
    updatedAt: metadata.updatedAt ? new Date(metadata.updatedAt) : new Date(),
    assignedTo: metadata.assignedTo,
    browserInfo: metadata.browserInfo,
  };
};

// Calculate stats from reports
const calculateStats = (reports: BugReport[]): BugStats => {
  return {
    total: reports.length,
    new: reports.filter((r: BugReport) => r.status === 'new').length,
    inProgress: reports.filter((r: BugReport) => r.status === 'in-progress').length,
    resolved: reports.filter((r: BugReport) => r.status === 'resolved').length,
    closed: reports.filter((r: BugReport) => r.status === 'closed').length,
  };
};

// Main hook for bug reports
export function useBugReports() {
  const { data: spItems = [], isLoading, error, refetch } = useIssueAndBugTrackerList();

  const reports = useMemo(() => {
    return [...spItems]
      .sort((a, b) => b.id - a.id)
      .map(transformToBugReport);
  }, [spItems]);

  const stats = useMemo(() => calculateStats(reports), [reports]);

  return {
    reports,
    stats,
    isLoading,
    error,
    refetch,
  };
}

// Hook for submitting bug reports
export function useSubmitBugReport() {
  const { data: user } = useUser();
  const createMutation = useCreateIssueAndBugTracker();

  return {
    ...createMutation,
    mutateAsync: async (input: BugReportInput) => {
      const now = new Date().toISOString();
      const reportedBy = user?.fullName || 'Anonymous User';
      
      // Calculate total size of attachments
      let totalAttachmentSize = 0;
      if (input.attachments) {
        totalAttachmentSize = input.attachments.reduce((sum, a) => sum + (a.dataUrl?.length || 0), 0);
      }
      if (input.screenshot) {
        totalAttachmentSize += input.screenshot.length;
      }
      
      // SharePoint comment field limit is ~63,999 characters
      // Base64 encoding increases size by ~33%, so we need to be conservative
      const MAX_COMMENT_SIZE = 60000;
      const METADATA_OVERHEAD = 1000; // Space for other metadata fields
      const availableSpace = MAX_COMMENT_SIZE - METADATA_OVERHEAD;
      
      // Log for debugging
      console.log('[BugTracker] Submitting report:', {
        title: input.title,
        hasScreenshot: !!input.screenshot,
        screenshotSize: input.screenshot?.length || 0,
        attachmentsCount: input.attachments?.length || 0,
        totalAttachmentSize,
        availableSpace,
      });
      
      // Decide what to include based on size constraints
      let screenshotToStore = input.screenshot;
      let attachmentsToStore = input.attachments;
      let sizeLimitWarning: string | undefined;
      
      if (totalAttachmentSize > availableSpace) {
        console.warn('[BugTracker] Attachments exceed size limit, applying compression strategy');
        
        // Priority: screenshot first, then attachments by size (smallest first)
        let usedSpace = 0;
        
        // Try to keep screenshot if it fits
        if (input.screenshot && input.screenshot.length < availableSpace * 0.7) {
          screenshotToStore = input.screenshot;
          usedSpace += input.screenshot.length;
        } else if (input.screenshot) {
          // Screenshot too large - store reference only
          screenshotToStore = '[Screenshot too large - captured but not stored]';
          sizeLimitWarning = 'Screenshot was too large to store fully.';
          console.warn('[BugTracker] Screenshot too large, storing reference only');
        }
        
        // Try to include attachments that fit
        if (input.attachments && input.attachments.length > 0) {
          const sortedAttachments = [...input.attachments].sort((a, b) => 
            (a.dataUrl?.length || 0) - (b.dataUrl?.length || 0)
          );
          
          const fittingAttachments: typeof input.attachments = [];
          for (const attachment of sortedAttachments) {
            const attachmentSize = attachment.dataUrl?.length || 0;
            if (usedSpace + attachmentSize < availableSpace) {
              fittingAttachments.push(attachment);
              usedSpace += attachmentSize;
            } else {
              // Store metadata without dataUrl for attachments that don't fit
              fittingAttachments.push({
                ...attachment,
                dataUrl: '[File too large - metadata only]',
              });
              sizeLimitWarning = (sizeLimitWarning || '') + ' Some attachments were too large to store fully.';
              console.warn('[BugTracker] Attachment too large:', attachment.name);
            }
          }
          attachmentsToStore = fittingAttachments;
        }
      }
      
      // Store additional metadata in the comment field as JSON
      const metadata = {
        category: input.category,
        currentPage: input.currentPage,
        stepsToReproduce: input.stepsToReproduce,
        screenshot: screenshotToStore,
        attachments: attachmentsToStore,
        assignedTo: input.assignedTo,
        reportedBy,
        browserInfo: navigator.userAgent,
        reportedAt: now,
        updatedAt: now,
        sizeLimitWarning,
      };

      const metadataJson = JSON.stringify(metadata);
      console.log('[BugTracker] Metadata JSON size:', metadataJson.length, 'characters');
      
      if (metadataJson.length > MAX_COMMENT_SIZE) {
        console.error('[BugTracker] Metadata still too large after compression:', metadataJson.length);
        // Last resort: strip large data entirely
        const minimalMetadata = {
          category: input.category,
          currentPage: input.currentPage,
          stepsToReproduce: input.stepsToReproduce,
          screenshot: input.screenshot ? '[Screenshot captured but not stored due to size limits]' : undefined,
          attachments: input.attachments?.map(a => ({
            id: a.id,
            name: a.name,
            size: a.size,
            type: a.type,
            dataUrl: '[Not stored due to size limits]',
          })),
          assignedTo: input.assignedTo,
          reportedBy,
          browserInfo: navigator.userAgent,
          reportedAt: now,
          updatedAt: now,
          sizeLimitWarning: 'Attachments were too large to store. Please describe the issue in detail.',
        };
        
        const result = await createMutation.mutateAsync({
          title: input.title,
          issueDescription: input.description,
          priorityKey: severityToPriorityKey[input.severity],
          statusKey: 'StatusKey0', // New
          department: 'Platform',
          formCode: 'BUG',
          comment: JSON.stringify(minimalMetadata),
        });
        
        console.log('[BugTracker] Report submitted with minimal metadata');
        return transformToBugReport(result);
      }

      const result = await createMutation.mutateAsync({
        title: input.title,
        issueDescription: input.description,
        priorityKey: severityToPriorityKey[input.severity],
        statusKey: 'StatusKey0', // New
        department: 'Platform', // Default department for bug reports
        formCode: 'BUG',
        comment: metadataJson,
      });

      console.log('[BugTracker] Report submitted successfully');
      return transformToBugReport(result);
    },
  };
}

// Hook for getting a single bug report
export function useBugReport(id: string) {
  const { reports } = useBugReports();
  return useMemo(() => reports.find((r: BugReport) => r.id === id), [reports, id]);
}
