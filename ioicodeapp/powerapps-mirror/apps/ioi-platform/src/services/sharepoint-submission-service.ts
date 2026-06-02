/**
 * SharePoint Submission Service
 *
 * Common types shared across form submission services.
 * These are core SharePoint list integration types.
 */

// =============================================================================
// SHARED TYPES
// =============================================================================

/** A person or group picker value from SharePoint */
export interface PersonOrGroup {
  Email: string;
  DisplayName?: string;
  Department?: string;
  JobTitle?: string;
  Id?: string | number;
}

/** Environment tag for deployment context */
export type EnvironmentTag = 'PROD' | 'DEV' | 'TEST' | 'UAT';

/** Base SharePoint submission shape used across all notification and workflow services */
export interface SharePointSubmission {
  GUID: string;
  TicketId: string;
  Title: string;
  FormCode: string;
  CurrentAction: string;
  Priority: string;
  SubmittedDate: string;
  DueDate?: string;
  SubmittedBy: PersonOrGroup;
  FormData: string;
  Department?: string;
  Site?: string;
  Category?: string;
  Status?: string;
  AssignedTo?: PersonOrGroup;
}
