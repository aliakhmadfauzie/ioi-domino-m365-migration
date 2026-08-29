import { getClient as getPowerAppsClient } from "@microsoft/power-apps/data";
import powerConfig from "../../power.config.json";
import type { IOperationOptions } from "./common/types";

export type ClientResult<T = unknown> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: Error };

type ApiParamDef = {
  name: string;
  in: string;
  required: boolean;
  type: string;
};

type ApiDef = {
  path: string;
  method: string;
  parameters: ApiParamDef[];
};

type DataSourceInfo = {
  tableId: string;
  dataSourceType: "Connector";
  apis: Record<string, ApiDef | never>;
};

/** Minimal connector operation type matching the SDK's IDataOperation */
export type ConnectorDataOperation<TParams = unknown> = {
  connectorOperation: {
    tableName: string;
    operationName: string;
    parameters?: TParams;
  };
};

type DataSourcesInfo = Record<string, DataSourceInfo>;
type PowerConfig = {
  connectionReferences?: Record<
    string,
    {
      dataSets?: Record<
        string,
        {
          dataSources?: Record<string, { tableName: string }>;
        }
      >;
    }
  >;
};

const normalizeSourceName = (name: string) => name.replace(/[^a-z0-9]/gi, "").toLowerCase();

const dataSourcesInfo: DataSourcesInfo = {};
const normalizedSourceLookup: Record<string, string> = {};

for (const connectionReference of Object.values((powerConfig as PowerConfig).connectionReferences ?? {})) {
  for (const dataSet of Object.values(connectionReference.dataSets ?? {})) {
    for (const [sourceName, sourceConfig] of Object.entries(dataSet.dataSources ?? {})) {
      dataSourcesInfo[sourceName] = {
        tableId: sourceConfig.tableName,
        dataSourceType: "Connector",
        apis: {},
      };
      normalizedSourceLookup[normalizeSourceName(sourceName)] = sourceName;
    }
  }
}

function resolveSourceName(sourceName: string): string {
  return normalizedSourceLookup[normalizeSourceName(sourceName)] ?? sourceName;
}

// Office 365 Users connector for M365 user search via executeAsync
// Uses the shared_office365users connector registered in power.config.json
dataSourcesInfo['office365users'] = {
  tableId: 'users',
  dataSourceType: 'Connector',
  apis: {
    SearchUser: {
      path: '/v2/users',
      method: 'GET',
      parameters: [
        { name: 'searchTerm', in: 'query', required: true, type: 'string' },
      ],
    },
  },
};
normalizedSourceLookup['office365users'] = 'office365users';

const powerAppsClient = getPowerAppsClient(dataSourcesInfo);

function logFailedOperation(operation: string, sourceName: string, result: ClientResult<unknown>, details?: unknown) {
  if (result.success) {
    return;
  }

  console.warn(`[PowerAppsData] ${operation} failed for "${sourceName}": ${JSON.stringify({
    error: result.error?.message ?? result.error,
    details,
  })}`);
}

function logThrownOperation(operation: string, sourceName: string, error: unknown, details?: unknown) {
  console.error(`[PowerAppsData] ${operation} threw for "${sourceName}": ${JSON.stringify({
    error: error instanceof Error ? error.message : String(error),
    details,
  })}`);
}

function logRetrieveMultipleSuccess(sourceName: string, result: ClientResult<unknown>, details?: unknown) {
  if (!result.success) {
    return;
  }

  const count = Array.isArray(result.data) ? result.data.length : null;
  console.log(`[PowerAppsData] retrieveMultipleRecordsAsync success for "${sourceName}": ${JSON.stringify({
    count,
    details,
  })}`);
}

function toPowerAppsOptions(options?: IOperationOptions) {
  if (!options) {
    return undefined;
  }

  const { expand: _expand, orderBy, ...supportedOptions } = options;
  return {
    ...supportedOptions,
    orderBy: typeof orderBy === "string" ? [orderBy] : orderBy,
  };
}

const localClient = {
  async createRecordAsync(source: string, _record: unknown): Promise<ClientResult<unknown>> {
    return {
      success: false,
      error: new Error(`Power Apps data client is unavailable locally for "${source}". No mock data was returned.`),
    };
  },
  async updateRecordAsync(
    source: string,
    _id: string,
    _changedFields: unknown
  ): Promise<ClientResult<unknown>> {
    return {
      success: false,
      error: new Error(`Power Apps data client is unavailable locally for "${source}". No mock data was returned.`),
    };
  },
  async deleteRecordAsync(source: string, _id: string): Promise<ClientResult<void>> {
    return {
      success: false,
      error: new Error(`Power Apps data client is unavailable locally for "${source}". No mock data was returned.`),
    };
  },
  async retrieveRecordAsync(source: string, _id: string): Promise<ClientResult<unknown>> {
    return {
      success: false,
      error: new Error(`Power Apps data client is unavailable locally for "${source}". No mock data was returned.`),
    };
  },
  async retrieveMultipleRecordsAsync(
    source: string,
    _options?: IOperationOptions
  ): Promise<ClientResult<unknown[]>> {
    return {
      success: false,
      error: new Error(`Power Apps data client is unavailable locally for "${source}". No mock data was returned.`),
    };
  },
  async executeAsync<TParams = unknown, TResult = unknown>(
    operation: ConnectorDataOperation<TParams>
  ): Promise<ClientResult<TResult>> {
    const opName = operation.connectorOperation?.tableName ?? 'unknown';
    return {
      success: false,
      error: new Error(`Power Apps data client is unavailable locally for "${opName}". No mock data was returned.`),
    };
  },
};

const powerAppsHostedClient = {
  async createRecordAsync(sourceName: string, record: unknown) {
    const resolvedSourceName = resolveSourceName(sourceName);
    try {
      const result = await powerAppsClient.createRecordAsync(resolvedSourceName, record);
      logFailedOperation('createRecordAsync', resolvedSourceName, result as ClientResult<unknown>);
      return result;
    } catch (error) {
      logThrownOperation('createRecordAsync', resolvedSourceName, error);
      throw error;
    }
  },
  async updateRecordAsync(sourceName: string, id: string, changedFields: unknown) {
    const resolvedSourceName = resolveSourceName(sourceName);
    try {
      const result = await powerAppsClient.updateRecordAsync(resolvedSourceName, id, changedFields);
      logFailedOperation('updateRecordAsync', resolvedSourceName, result as ClientResult<unknown>, { id });
      return result;
    } catch (error) {
      logThrownOperation('updateRecordAsync', resolvedSourceName, error, { id });
      throw error;
    }
  },
  async deleteRecordAsync(sourceName: string, id: string) {
    const resolvedSourceName = resolveSourceName(sourceName);
    try {
      const result = await powerAppsClient.deleteRecordAsync(resolvedSourceName, id);
      logFailedOperation('deleteRecordAsync', resolvedSourceName, result as ClientResult<unknown>, { id });
      return result;
    } catch (error) {
      logThrownOperation('deleteRecordAsync', resolvedSourceName, error, { id });
      throw error;
    }
  },
  async retrieveRecordAsync(sourceName: string, id: string, options?: IOperationOptions) {
    const resolvedSourceName = resolveSourceName(sourceName);
    try {
      const result = await powerAppsClient.retrieveRecordAsync(resolvedSourceName, id, toPowerAppsOptions(options));
      logFailedOperation('retrieveRecordAsync', resolvedSourceName, result as ClientResult<unknown>, { id, options });
      return result;
    } catch (error) {
      logThrownOperation('retrieveRecordAsync', resolvedSourceName, error, { id, options });
      throw error;
    }
  },
  async retrieveMultipleRecordsAsync(sourceName: string, options?: IOperationOptions) {
    const resolvedSourceName = resolveSourceName(sourceName);
    const normalizedOptions = toPowerAppsOptions(options);
    try {
      const result = await powerAppsClient.retrieveMultipleRecordsAsync(resolvedSourceName, normalizedOptions);
      logRetrieveMultipleSuccess(resolvedSourceName, result as ClientResult<unknown>, {
        options: normalizedOptions,
      });
      logFailedOperation('retrieveMultipleRecordsAsync', resolvedSourceName, result as ClientResult<unknown>, {
        options: normalizedOptions,
      });
      return result;
    } catch (error) {
      logThrownOperation('retrieveMultipleRecordsAsync', resolvedSourceName, error, { options: normalizedOptions });
      throw error;
    }
  },
  async executeAsync<TParams = unknown, TResult = unknown>(
    operation: ConnectorDataOperation<TParams>
  ) {
    const operationInfo = operation.connectorOperation;
    const details = {
      operationName: operationInfo.operationName,
      parameters: operationInfo.parameters,
    };
    try {
      const result = await powerAppsClient.executeAsync(
        operation as Parameters<typeof powerAppsClient.executeAsync>[0]
      ) as ClientResult<TResult>;
      logFailedOperation('executeAsync', operationInfo.tableName, result as ClientResult<unknown>, details);
      return result;
    } catch (error) {
      logThrownOperation('executeAsync', operationInfo.tableName, error, details);
      throw error;
    }
  },
};

function isLocalHost() {
  return (
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
  );
}

export function getClient() {
  return import.meta.env.DEV || isLocalHost() ? localClient : powerAppsHostedClient;
}
