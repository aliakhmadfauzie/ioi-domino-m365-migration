/**
 * useAppParams — Read deep-link parameters passed from Power Automate emails
 * or external links into the Power Apps code-first app.
 *
 * Power Automate flows can generate links like:
 *   {appUrl}#/department/it?formCode=EAF&itemId=123&action=view&status=Submitted
 *
 * This hook parses those params and makes them available to any component
 * for auto-navigation, pre-filling forms, or showing contextual notifications.
 */

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface AppParams {
  /** Form code to navigate to (e.g. EAF, ITSSR, HI) */
  formCode?: string;
  /** SharePoint item ID to view/edit */
  itemId?: number;
  /** Action to perform: view | edit | approve | new */
  action?: 'view' | 'edit' | 'approve' | 'new';
  /** Current status label for context */
  status?: string;
  /** Department scope */
  department?: string;
  /** Notification message to show on arrival */
  notification?: string;
  /** Raw params passthrough */
  [key: string]: string | number | undefined;
}

/**
 * Parse Power Automate deep-link parameters from the URL.
 *
 * Usage:
 * ```tsx
 * const params = useAppParams();
 * if (params.formCode && params.itemId) {
 *   // Navigate to the referenced item
 * }
 * ```
 */
export function useAppParams(): AppParams {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const params: AppParams = {};

    const rawFormCode = searchParams.get('formCode');
    if (rawFormCode) params.formCode = rawFormCode.toUpperCase();

    const rawItemId = searchParams.get('itemId');
    if (rawItemId) {
      const parsed = parseInt(rawItemId, 10);
      if (!isNaN(parsed)) params.itemId = parsed;
    }

    const rawAction = searchParams.get('action');
    if (rawAction && ['view', 'edit', 'approve', 'new'].includes(rawAction)) {
      params.action = rawAction as AppParams['action'];
    }

    const rawStatus = searchParams.get('status');
    if (rawStatus) params.status = rawStatus;

    const rawDept = searchParams.get('department');
    if (rawDept) params.department = rawDept;

    const rawNotification = searchParams.get('notification');
    if (rawNotification) params.notification = decodeURIComponent(rawNotification);

    return params;
  }, [searchParams]);
}

/**
 * Build a deep-link URL for the Power Apps app with context parameters.
 * Used by Power Automate flows to generate email links.
 *
 * @param baseUrl - The app's base URL including hash route
 * @param params - Context parameters to pass
 * @returns Full deep-link URL
 *
 * @example
 * ```typescript
 * buildAppDeepLink('https://apps.powerapps.com/play/e/{envId}/a/{appId}', {
 *   formCode: 'EAF',
 *   itemId: 123,
 *   action: 'view'
 * })
 * // Returns: https://apps.powerapps.com/play/e/{envId}/a/{appId}?formCode=EAF&itemId=123&action=view
 * ```
 */
export function buildAppDeepLink(
  baseUrl: string,
  params: AppParams
): string {
  const search = new URLSearchParams();

  if (params.formCode) search.set('formCode', params.formCode);
  if (params.itemId) search.set('itemId', String(params.itemId));
  if (params.action) search.set('action', params.action);
  if (params.status) search.set('status', params.status);
  if (params.department) search.set('department', params.department);
  if (params.notification) search.set('notification', encodeURIComponent(params.notification));

  const qs = search.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

/**
 * Generate a deep link specifically for the IOI Platform app
 * with the proper Power Apps URL structure.
 */
export function buildIoiDeepLink(params: AppParams): string {
  const baseUrl = `https://apps.powerapps.com/play/e/Default-c6f6218b-5ff2-48b5-9114-f89da23caadb/a/26fddd33-46a8-43ae-a1f2-e90fa3b003bf`;
  return buildAppDeepLink(baseUrl, params);
}
