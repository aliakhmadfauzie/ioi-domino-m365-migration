/**
 * Microsoft 365 / Office365Users connector wrapper.
 *
 * Delegates to the shared_office365users connector registered in
 * power.config.json via getClient().executeAsync().
 *
 * All calls are logged through the debug logger when debug mode is active.
 */
import { getClient } from '../../app-gen-sdk/data';
import { logReadEvent, logError } from '@/debug/debugLogger';
import type { DataResult } from './dataTypes';

export interface M365User {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
}

const SOURCE_KEY = 'office365users';

export const m365Client = {
  /**
   * Search for users via the Office 365 Users connector.
   * searchTerm matches displayName, UPN, or email prefix.
   */
  async searchUsers(
    searchTerm: string,
    context: { screenId: string; userId?: string }
  ): Promise<DataResult<M365User[]>> {
    const client = getClient();
    const start = performance.now();

    try {
      const result = await client.executeAsync<{ searchTerm: string }, M365User[]>({
        connectorOperation: {
          tableName: SOURCE_KEY,
          operationName: 'SearchUser',
          parameters: { searchTerm },
        },
      });
      const durationMs = Math.round(performance.now() - start);

      if (!result.success) {
        const errorMessage = result.error?.message ?? 'M365 search failed';
        logError({
          screenId: context.screenId,
          sourceKey: SOURCE_KEY,
          error: errorMessage,
          context: 'searchUsers',
        });
        return { success: false, error: errorMessage, durationMs };
      }

      const users = (result.data ?? []) as M365User[];
      logReadEvent({
        screenId: context.screenId,
        sourceKey: SOURCE_KEY,
        listName: 'M365 Users (Office365Users connector)',
        recordCount: users.length,
        durationMs,
        success: true,
        userId: context.userId,
      });

      return { success: true, data: users, durationMs };
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      const message = err instanceof Error ? err.message : String(err);
      logError({ screenId: context.screenId, sourceKey: SOURCE_KEY, error: message });
      return { success: false, error: message, durationMs };
    }
  },
};
