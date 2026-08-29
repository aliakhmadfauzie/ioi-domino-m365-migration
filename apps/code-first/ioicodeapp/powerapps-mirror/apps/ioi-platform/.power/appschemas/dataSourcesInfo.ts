type IApiDefinition = {
  path: string;
  method: string;
  parameters: Array<{ name: string; in: string; required: boolean; type: string }>;
  responseInfo?: Record<string, unknown>;
};

type IDataSourceInfo = {
  tableId: string;
  version?: string;
  primaryKey?: string;
  dataSourceType?: string;
  apis: { [key: string]: IApiDefinition };
};

const office365UsersApis: IDataSourceInfo['apis'] = {
  MyProfile_V2: {
    path: '/v1.0/me',
    method: 'GET',
    parameters: [
      { name: '$select', in: 'query', required: false, type: 'string' },
    ],
  },
  UserProfile_V2: {
    path: '/v1.0/users/{id}',
    method: 'GET',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string' },
      { name: '$select', in: 'query', required: false, type: 'string' },
    ],
  },
  SearchUserV2: {
    path: '/v1.0/users',
    method: 'GET',
    parameters: [
      { name: '$filter', in: 'query', required: false, type: 'string' },
      { name: '$select', in: 'query', required: false, type: 'string' },
      { name: '$top', in: 'query', required: false, type: 'integer' },
    ],
  },
  Manager_V2: {
    path: '/v1.0/users/{id}/manager',
    method: 'GET',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string' },
      { name: '$select', in: 'query', required: false, type: 'string' },
    ],
  },
  DirectReports_V2: {
    path: '/v1.0/users/{id}/directReports',
    method: 'GET',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string' },
      { name: '$select', in: 'query', required: false, type: 'string' },
      { name: '$top', in: 'query', required: false, type: 'integer' },
    ],
  },
};

const office365UsersDataSource: IDataSourceInfo = {
  tableId: 'office365users',
  dataSourceType: 'Connector',
  apis: office365UsersApis,
};

const office365OutlookDataSource: IDataSourceInfo = {
  tableId: 'office365outlook',
  dataSourceType: 'Connector',
  apis: {
    SendEmailV2: {
      path: '/v2/Mail',
      method: 'POST',
      parameters: [
        { name: 'emailMessage', in: 'body', required: true, type: 'object' },
      ],
    },
  },
};

export const dataSourcesInfo: Record<string, IDataSourceInfo> = {
  // The runtime connection metadata for code apps can key connector references by
  // generated datasource name or by the concrete connection reference id. Keep the
  // aliases pointed at the same Office 365 Users API metadata so the service can
  // try the runtime's actual key without falling back to seeded users.
  office365users: office365UsersDataSource,
  Office365Users: office365UsersDataSource,
  shared_office365users: office365UsersDataSource,
  '31932564d2aa467fb9e768c6d9163d2b': office365UsersDataSource,
  'f0abd25e783a4e8494fbea009df8e075': office365UsersDataSource,
  // Office 365 Outlook connector — aliased under every name the runtime may use.
  // If your connection reference GUID is different, add it here.
  office365outlook: office365OutlookDataSource,
  Office365Outlook: office365OutlookDataSource,
  shared_office365: office365OutlookDataSource,
  baf71139478348d8be4cdf53382b5ab6: office365OutlookDataSource,
  c8a3fe1e4c7440dd8d75140d1480bbe9: office365OutlookDataSource,
  maindb_it: {
    tableId: 'b1de9795-563e-48c3-99a3-1430234dc6e2',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_it_ext_support: {
    tableId: '37a03d3f-7403-4302-97fc-0d816de938ba',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr: {
    tableId: 'cefc8188-ca5d-41e4-8a88-a912214f5c23',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_een: {
    tableId: '13ea64b2-575c-42a4-ab50-14b78a5f2458',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_epdu: {
    tableId: 'c4ba9c20-9cbf-438f-bc53-d667c45e52db',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_ephr: {
    tableId: 'b81829dd-90ae-423b-af06-0df1e7236a22',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_esf: {
    tableId: 'a3694789-9305-45ee-9266-b50d152b236b',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_ftcr: {
    tableId: '551fc5a3-8a8d-48a5-8b63-d7fd6adcdc4b',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_fwwpe: {
    tableId: '036f2b53-497f-49be-a260-0b59ed2dca3d',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_fwwpd: {
    tableId: 'b882590e-73f5-4d48-9b2f-6a8f1bac5e9b',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_gdsn: {
    tableId: 'f6f4e86f-1bed-4a8c-b63d-7118f68f89d4',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_healthinfo: {
    tableId: '37d6ea8c-b8cc-4b85-88f4-3904f220e1b7',
    dataSourceType: 'Connector',
    apis: {}
  },
  maindb_hr_ext_hrapr: {
    tableId: '73e50516-bdd7-48fe-9649-9d57acd1106b',
    dataSourceType: 'Connector',
    apis: {}
  },
  hr_fwwpd_hostelrecords: {
    tableId: 'ee584083-f49a-4fd8-98a1-796bc7887916',
    dataSourceType: 'Connector',
    apis: {}
  },
  hr_fwwpd_insurancedeductions: {
    tableId: '318e81e8-857e-4f21-b2dd-3926b80cdbae',
    dataSourceType: 'Connector',
    apis: {}
  },
  hr_fwwpd_complianceassets: {
    tableId: 'c2dc91b7-891e-4d44-9c64-bc1b07449577',
    dataSourceType: 'Connector',
    apis: {}
  },
  hr_migrationreminderlog: {
    tableId: '0174fd8f-fc59-4355-bda6-ca5b4f4c609e',
    dataSourceType: 'Connector',
    apis: {}
  },
  config_employeedirectory: {
    tableId: 'e2228ba4-6743-45ee-bcb5-487fbb9209ca',
    dataSourceType: 'Connector',
    apis: {}
  },
};
