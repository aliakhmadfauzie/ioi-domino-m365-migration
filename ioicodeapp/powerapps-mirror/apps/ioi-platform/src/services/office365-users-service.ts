import { getClient, type IOperationResult } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../.power/appschemas/dataSourcesInfo';

export interface Office365User {
  id?: string;
  displayName?: string;
  givenName?: string;
  surname?: string;
  mail?: string;
  userPrincipalName?: string;
  department?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  accountEnabled?: boolean;
}

export interface Office365UserListResponse {
  value?: Office365User[];
  '@odata.nextLink'?: string;
}

const client = getClient(dataSourcesInfo);

const OFFICE365_DATA_SOURCE_CANDIDATES = [
  'office365users',
  'Office365Users',
  'shared_office365users',
  '31932564d2aa467fb9e768c6d9163d2b',
  'f0abd25e783a4e8494fbea009df8e075',
];

async function executeWithAvailableDataSource<TParams, TResult>(
  operationName: string,
  parameters?: TParams
): Promise<IOperationResult<TResult>> {
  let lastResult: IOperationResult<TResult> | undefined;

  for (const tableName of OFFICE365_DATA_SOURCE_CANDIDATES) {
    const result = await client.executeAsync<TParams, TResult>({
      connectorOperation: {
        tableName,
        operationName,
        parameters,
      },
    });

    if (result.success) {
      return result;
    }

    lastResult = result;

    const message = result.error?.message || '';
    const canTryNext =
      message.includes('Connection reference not found') ||
      message.includes('Data source not found') ||
      message.includes('ConnectionReferenceNotFound') ||
      message.includes('DataSourceNotFound');

    if (!canTryNext) {
      return result;
    }
  }

  return lastResult ?? {
    success: false,
    data: undefined as TResult,
    error: new Error('Office 365 Users connection reference was not found.'),
  };
}

export class Office365UsersConnectorService {
  static async myProfile(): Promise<IOperationResult<Office365User>> {
    return executeWithAvailableDataSource('MyProfile_V2');
  }

  static async userProfile(userId: string): Promise<IOperationResult<Office365User>> {
    return executeWithAvailableDataSource('UserProfile_V2', {
      userId: userId, // The connector parameter is named userId, not id
    });
  }

  static async searchUsers(
    searchTerm: string,
    top = 50
  ): Promise<IOperationResult<Office365UserListResponse>> {
    // Corrected to utilize the native search string configuration mapping
    return executeWithAvailableDataSource('SearchUserV2', {
      searchTerm: searchTerm.trim(),
      top: top,
    });
  }

  static async allUsers(top = 100): Promise<IOperationResult<Office365UserListResponse>> {
    return executeWithAvailableDataSource('SearchUserV2', {
      searchTerm: '', // Empty search term extracts global list profiles safely
      top: top,
    });
  }

  static async manager(userId: string): Promise<IOperationResult<Office365User>> {
    return executeWithAvailableDataSource('Manager_V2', {
      userId: userId,
    });
  }

  static async directReports(userId: string): Promise<IOperationResult<Office365UserListResponse>> {
    return executeWithAvailableDataSource('DirectReports_V2', {
      userId: userId,
    });
  }
}