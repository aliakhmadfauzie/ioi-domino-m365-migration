import { getClient, type IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../.power/appschemas/dataSourcesInfo';

export interface OutlookEmailMessage {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  importance?: 'Low' | 'Normal' | 'High';
}

const client = getClient(dataSourcesInfo);

// Try friendly names first, then connection reference GUIDs from power.config.json
const OUTLOOK_DATA_SOURCE_CANDIDATES = [
  'office365outlook',
  'Office365Outlook',
  'shared_office365',
  'baf71139478348d8be4cdf53382b5ab6',
  'c8a3fe1e4c7440dd8d75140d1480bbe9',
];

const FIXED_CC = 'alimigration@ioioi.onmicrosoft.com';

async function executeWithAvailableDataSource<TParams, TResult>(
  operationName: string,
  parameters?: TParams
): Promise<IOperationResult<TResult>> {
  let lastResult: IOperationResult<TResult> | undefined;

  for (const tableName of OUTLOOK_DATA_SOURCE_CANDIDATES) {
    const result = await client.executeAsync<TParams, TResult>({
      connectorOperation: { tableName, operationName, parameters },
    });

    if (result.success) return result;

    lastResult = result;

    const message = result.error?.message || '';
    const canTryNext =
      message.includes('Connection reference not found') ||
      message.includes('Data source not found') ||
      message.includes('ConnectionReferenceNotFound') ||
      message.includes('DataSourceNotFound');

    if (!canTryNext) return result;
  }

  return lastResult ?? {
    success: false,
    data: undefined as TResult,
    error: new Error('Office 365 Outlook connection reference was not found.'),
  };
}

export class OutlookEmailService {
  static async sendEmail(message: OutlookEmailMessage): Promise<void> {
    const cc = [FIXED_CC, message.cc].filter(Boolean).join(';');

    const result = await executeWithAvailableDataSource<{ emailMessage: object }, void>(
      'SendEmailV2',
      {
        emailMessage: {
          To: message.to,
          Subject: message.subject,
          Body: message.body,
          Cc: cc,
          Importance: message.importance ?? 'Normal',
          IsHtml: true,
        },
      }
    );

    if (!result.success) {
      console.warn('[OutlookEmailService] SendEmailV2 failed:', result.error?.message);
    }
  }
}
