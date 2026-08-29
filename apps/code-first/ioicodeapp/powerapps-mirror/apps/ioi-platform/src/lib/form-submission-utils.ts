/**
 * Form Submission Utilities
 *
 * Shared utilities extracted from IT form template (new-request.tsx).
 * All IT forms should use these helpers for consistency.
 */

import { toast } from 'sonner';

// =============================================================================
// Retry Helper
// =============================================================================

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 2000;

/**
 * Retry an operation with exponential backoff for transient
 * "data model being updated" errors from the Power Platform.
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  onRetry?: (attempt: number, maxAttempts: number) => void
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Only retry on data model update errors
      if (!errorMessage.includes('data model') && !errorMessage.includes('being updated')) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(1.5, attempt - 1);
        onRetry?.(attempt, MAX_RETRIES);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// =============================================================================
// Ticket ID Generation
// =============================================================================

/**
 * Module-level sequential counter for ticket IDs.
 * Provides a monotonically incrementing sequence number within the current session.
 * Resets on page reload — for production, replace with Power Automate auto-numbering
 * triggered on SharePoint list item creation (see Power Automate setup docs).
 */
let ticketCounter = Date.now() % 100000;

/**
 * Generate a ticket ID in the format: FORMCODE-YYYYMM-SEQ
 *
 * @todo PRODUCTION: Replace this client-side generation with a Power Automate flow
 * that runs on list item creation. The flow should:
 *   1. Trigger: When an item is created in MainDB_IT
 *   2. Read the FormCode column
 *   3. Query the list for the last ticket number with the same FormCode prefix
 *   4. Increment the counter
 *   5. Update the Title column with the new ticket ID
 *
 * Current implementation uses module-level counter for uniqueness within a session.
 */
export function generateTicketId(formCode: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  ticketCounter++;
  const seq = String(ticketCounter).padStart(6, '0');
  return `${formCode}-${year}${month}-${seq}`;
}

// =============================================================================
// Submission Result
// =============================================================================

export interface FormSubmissionResult {
  id: number;
  ticketId: string;
  title: string;
  formcode: string;
  currentStatus: string;
  priority?: string;
  site?: string;
  submittedDate: string;
  requestorEmail: string;
}

// =============================================================================
// Error Handling
// =============================================================================

/**
 * Handle submission errors with user-friendly messages.
 * Returns true if the error was handled (no need to re-throw).
 */
export function handleSubmissionError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes('data model') || errorMessage.includes('being updated')) {
    toast.error('System is temporarily busy. Please wait 30 seconds and try again, or refresh the page.');
    return true;
  }

  if (errorMessage.includes('MainDBITExtAccess') || errorMessage.includes('ExtSupport') || errorMessage.includes('ExtSAP')) {
    toast.error('Failed to save extended details. Main record was saved but may be incomplete. Please contact support if needed.');
    return true;
  }

  if (errorMessage.includes('parent') || errorMessage.includes('child')) {
    toast.error('Data relationship error detected. The record may be incomplete. Please contact support.');
    return true;
  }

  return false;
}

// =============================================================================
// Site Key Mapper
// =============================================================================

export type FormLocation = 'MY-PR' | 'MY-JH' | 'remote';

export function mapLocationToSiteKey(location: string): MainDBITSiteKey {
  switch (location) {
    case 'MY-JH': return 'SiteKey0';  // Johor
    case 'MY-PR': return 'SiteKey2';  // Prai
    default: return 'SiteKey4';        // All Sites (remote)
  }
}

import type { MainDBITSiteKey } from '@/generated/models/main-dbit-model';

// =============================================================================
// Config List Loading State Helper
// =============================================================================

/**
 * Creates a combined loading/error state object for multiple config list queries.
 * Use this in forms that read from multiple SharePoint config lists to show
 * a single loading state or aggregate errors.
 *
 * @example
 * const configState = useConfigLoadingState([
 *   { isLoading: companiesLoading, error: companiesError, name: 'companies' },
 *   { isLoading: departmentsLoading, error: departmentsError, name: 'departments' },
 * ]);
 * // { isLoading: false, hasError: true, errors: ['companies: Network error'], firstError: 'companies: Network error' }
 */
export interface ConfigQueryState {
  isLoading: boolean;
  error: unknown;
  name: string;
}

export interface ConfigLoadingState {
  isLoading: boolean;
  hasError: boolean;
  errors: string[];
  firstError: string | null;
}

export function useConfigLoadingState(queries: ConfigQueryState[]): ConfigLoadingState {
  const isLoading = queries.some((q) => q.isLoading);
  const errors = queries
    .filter((q) => q.error)
    .map((q) => `${q.name}: ${q.error instanceof Error ? q.error.message : String(q.error)}`);
  return {
    isLoading,
    hasError: errors.length > 0,
    errors,
    firstError: errors[0] || null,
  };
}
