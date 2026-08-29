#!/usr/bin/env node

/**
 * Seed real ITSSR SharePoint data through Microsoft Graph.
 *
 * This script writes directly to:
 * - MainDB_IT
 * - MainDB_IT_Ext_Support
 *
 * It does not use the app's local mock/data client.
 *
 * Required app registration permissions:
 * - Sites.ReadWrite.All, or a Sites.Selected grant for the target site
 *
 * Required environment variables:
 * - AZURE_TENANT_ID
 * - AZURE_CLIENT_ID
 * - AZURE_CLIENT_SECRET
 *
 * Optional environment variables:
 * - SHAREPOINT_HOSTNAME=ioioi.sharepoint.com
 * - SHAREPOINT_SITE_PATH=/sites/ioi-portal-it
 * - MAINDB_IT_LIST_NAME=MainDB_IT
 * - MAINDB_IT_EXT_SUPPORT_LIST_NAME=MainDB_IT_Ext_Support
 *
 * Usage:
 *   node scripts/seed-itssr-sharepoint.mjs
 *   node scripts/seed-itssr-sharepoint.mjs --execute
 *   node scripts/seed-itssr-sharepoint.mjs --execute --count 3
 */

const GRAPH_ROOT = 'https://graph.microsoft.com/v1.0';

const CONFIG = {
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  hostname: process.env.SHAREPOINT_HOSTNAME || 'ioioi.sharepoint.com',
  sitePath: process.env.SHAREPOINT_SITE_PATH || '/sites/ioi-portal-it',
  mainListName: process.env.MAINDB_IT_LIST_NAME || 'MainDB_IT',
  extSupportListName: process.env.MAINDB_IT_EXT_SUPPORT_LIST_NAME || 'MainDB_IT_Ext_Support',
};

const args = new Set(process.argv.slice(2));
const shouldExecute = args.has('--execute');
const countArgIndex = process.argv.indexOf('--count');
const requestedCount =
  countArgIndex >= 0 ? Number(process.argv[countArgIndex + 1] || '0') : undefined;

const PIC_DISPLAY_NAMES = {
  'ravimadhu@ioioleo.com': 'Ravi Madhu',
  'qayyim@ioioleo.com': 'Qayyim',
  'kllit@ioioleo.com': 'KL IT Support',
  'dannylee@ioioleo.com': 'Danny Lee',
  'kelly@ioioleo.com': 'Kelly',
  'fadzli@ioioleo.com': 'Fadzli',
  'cindychew@ioioleo.com': 'Cindy Chew',
  'ecsaw@ioioleo.com': 'EC Saw',
  'taung@ioioleo.com': 'T. Aung',
  'prakash@ioioleo.com': 'Prakash',
  'wstan@ioioleo.com': 'W. Stan',
  'annaooi@ioioleo.com': 'Anna Ooi',
};

const samples = [
  {
    requestorEmail: 'alimigration@ioioi.onmicrosoft.com',
    requestorName: 'Ali Migration',
    site: 'Kuala Lumpur',
    serviceType: 'Software',
    application: 'HCL NOTES',
    assignedToEmail: 'ravimadhu@ioioleo.com',
    secondaryPicEmail: 'qayyim@ioioleo.com',
    problemCategory: 'Access / Authority',
    supportMethod: 'Remote',
    subject: 'MKC5 Connects Authority query',
    description:
      'User query from MKC5 Connects Authority. Please validate access/routing and advise the correct authority flow.',
  },
  {
    requestorEmail: 'ravimadhu@ioioleo.com',
    requestorName: 'Ravi Madhu',
    site: 'Kuala Lumpur',
    serviceType: 'Email',
    application: 'HCL NOTES',
    assignedToEmail: 'ravimadhu@ioioleo.com',
    secondaryPicEmail: 'qayyim@ioioleo.com',
    problemCategory: 'Mail / HCL Notes',
    supportMethod: 'Remote',
    subject: 'HCL Notes mailbox routing verification',
    description:
      'Seed ticket to confirm Email/HCL Notes routing keeps Ravi as primary PIC and Qayyim as backup PIC.',
  },
  {
    requestorEmail: 'qayyim@ioioleo.com',
    requestorName: 'Qayyim',
    site: 'Kuala Lumpur',
    serviceType: 'Software',
    application: 'HCL NOTES',
    assignedToEmail: 'ravimadhu@ioioleo.com',
    secondaryPicEmail: 'qayyim@ioioleo.com',
    problemCategory: 'Application Support',
    supportMethod: 'Remote',
    subject: 'HCL Notes authority confirmation',
    description:
      'Seed ticket involving Qayyim for ITSSR support flow validation. Primary PIC remains Ravi based on HCL Notes routing.',
  },
  {
    requestorEmail: 'alimigration@ioioi.onmicrosoft.com',
    requestorName: 'Ali Migration',
    site: 'Penang',
    serviceType: 'Hardware',
    application: 'Laptop / Desktop',
    assignedToEmail: 'dannylee@ioioleo.com',
    secondaryPicEmail: 'kelly@ioioleo.com',
    problemCategory: 'Hardware',
    supportMethod: 'Onsite',
    subject: 'Laptop docking station intermittently disconnects',
    description:
      'Penang hardware sample to validate location-based routing to Danny Lee with Kelly as backup.',
  },
  {
    requestorEmail: 'ravimadhu@ioioleo.com',
    requestorName: 'Ravi Madhu',
    site: 'Johor',
    serviceType: 'Hardware',
    application: 'Printer',
    assignedToEmail: 'fadzli@ioioleo.com',
    secondaryPicEmail: 'cindychew@ioioleo.com',
    problemCategory: 'Peripheral',
    supportMethod: 'Onsite',
    subject: 'Johor printer queue stuck',
    description:
      'Johor hardware sample to validate site routing to Fadzli and backup routing to Cindy Chew.',
  },
  {
    requestorEmail: 'qayyim@ioioleo.com',
    requestorName: 'Qayyim',
    site: 'Penang',
    serviceType: 'Network',
    application: 'WiFi / LAN',
    assignedToEmail: 'ecsaw@ioioleo.com',
    secondaryPicEmail: 'taung@ioioleo.com',
    problemCategory: 'Network Connectivity',
    supportMethod: 'Onsite',
    subject: 'Penang meeting room WiFi unstable',
    description:
      'Network sample for Penang routing to EC Saw with T. Aung as backup.',
  },
  {
    requestorEmail: 'alimigration@ioioi.onmicrosoft.com',
    requestorName: 'Ali Migration',
    site: 'Johor',
    serviceType: 'Network',
    application: 'VPN',
    assignedToEmail: 'prakash@ioioleo.com',
    secondaryPicEmail: '',
    problemCategory: 'VPN / Remote Access',
    supportMethod: 'Remote',
    subject: 'VPN login succeeds but internal apps timeout',
    description:
      'Johor network sample to validate location-based routing to Prakash.',
  },
  {
    requestorEmail: 'ravimadhu@ioioleo.com',
    requestorName: 'Ravi Madhu',
    site: 'Kuala Lumpur',
    serviceType: 'SAP',
    application: 'SAP S4/HANA',
    assignedToEmail: 'kllit@ioioleo.com',
    secondaryPicEmail: '',
    problemCategory: 'SAP Access',
    supportMethod: 'Remote',
    subject: 'SAP role missing after user transfer',
    description:
      'SAP sample to validate type-level routing to KL IT Support.',
  },
  {
    requestorEmail: 'qayyim@ioioleo.com',
    requestorName: 'Qayyim',
    site: 'Kuala Lumpur',
    serviceType: 'Bank',
    application: 'BANK',
    assignedToEmail: 'kllit@ioioleo.com',
    secondaryPicEmail: '',
    problemCategory: 'Banking System',
    supportMethod: 'Remote',
    subject: 'Bank token reset request',
    description:
      'Bank system sample to validate bank routing to KL IT Support.',
  },
  {
    requestorEmail: 'alimigration@ioioi.onmicrosoft.com',
    requestorName: 'Ali Migration',
    site: 'Johor',
    serviceType: 'Software',
    application: 'SALES PORTAL',
    assignedToEmail: 'cindychew@ioioleo.com',
    secondaryPicEmail: 'annaooi@ioioleo.com',
    problemCategory: 'Application Support',
    supportMethod: 'Remote',
    subject: 'Sales portal customer lookup returns blank',
    description:
      'Sales Portal sample to validate application-specific routing to Cindy Chew and Anna Ooi.',
  },
  {
    requestorEmail: 'ravimadhu@ioioleo.com',
    requestorName: 'Ravi Madhu',
    site: 'Kuala Lumpur',
    serviceType: 'Software',
    application: 'ESKER AP AUTOMATION',
    assignedToEmail: 'wstan@ioioleo.com',
    secondaryPicEmail: 'kllit@ioioleo.com',
    problemCategory: 'Application Support',
    supportMethod: 'Remote',
    subject: 'Esker invoice validation stuck',
    description:
      'Esker sample to validate application-specific routing to W. Stan with KL IT Support as backup.',
  },
  {
    requestorEmail: 'qayyim@ioioleo.com',
    requestorName: 'Qayyim',
    site: 'Penang',
    serviceType: 'Software',
    application: 'WEIGHING SYSTEM',
    assignedToEmail: 'kelly@ioioleo.com',
    secondaryPicEmail: 'dannylee@ioioleo.com',
    problemCategory: 'Weighing System',
    supportMethod: 'Onsite',
    subject: 'Weighbridge transaction not syncing',
    description:
      'Penang weighing system sample to validate location-dependent software routing to Kelly and Danny Lee.',
  },
  {
    requestorEmail: 'alimigration@ioioi.onmicrosoft.com',
    requestorName: 'Ali Migration',
    site: 'Kuala Lumpur',
    serviceType: 'Other',
    application: 'General IT',
    assignedToEmail: 'kllit@ioioleo.com',
    secondaryPicEmail: '',
    problemCategory: 'General IT Support',
    supportMethod: 'Remote',
    subject: 'General IT advisory request',
    description:
      'Fallback ITSSR sample to validate Other routing to KL IT Support.',
  },
];

function requireConfig() {
  const missing = Object.entries({
    AZURE_TENANT_ID: CONFIG.tenantId,
    AZURE_CLIENT_ID: CONFIG.clientId,
    AZURE_CLIENT_SECRET: CONFIG.clientSecret,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

async function graphFetch(pathOrUrl, options = {}) {
  const url = pathOrUrl.startsWith('https://') ? pathOrUrl : `${GRAPH_ROOT}${pathOrUrl}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${options.token || (await getAccessToken())}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message = body?.error?.message || body?.message || text || response.statusText;
    throw new Error(`${options.method || 'GET'} ${url} failed: ${response.status} ${message}`);
  }

  return body;
}

let accessTokenPromise;
async function getAccessToken() {
  if (!accessTokenPromise) {
    accessTokenPromise = fetch(
      `https://login.microsoftonline.com/${CONFIG.tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CONFIG.clientId,
          client_secret: CONFIG.clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
      }
    ).then(async (response) => {
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error_description || body?.error || 'Unable to get Graph token');
      }
      return body.access_token;
    });
  }
  return accessTokenPromise;
}

async function resolveSite() {
  return graphFetch(`/sites/${CONFIG.hostname}:${CONFIG.sitePath}`);
}

async function resolveList(siteId, displayName) {
  const safeName = displayName.replaceAll("'", "''");
  const result = await graphFetch(
    `/sites/${siteId}/lists?$filter=displayName eq '${encodeURIComponent(safeName)}'`
  );
  const list = result.value?.[0];
  if (!list) throw new Error(`List not found on site: ${displayName}`);
  return list;
}

async function createListItem(siteId, listId, fields) {
  return graphFetch(`/sites/${siteId}/lists/${listId}/items`, {
    method: 'POST',
    body: JSON.stringify({ fields }),
  });
}

async function createExtSupportItem(siteId, listId, fields, parentId) {
  const attempts = [
    { ...fields, ParentIDLookupId: String(parentId) },
    { ...fields, ParentIDId: parentId },
    { ...fields, ParentID: parentId },
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      return await createListItem(siteId, listId, attempt);
    } catch (error) {
      lastError = error;
      if (!String(error.message).includes('ParentID')) throw error;
    }
  }
  throw lastError;
}

function makeTicketNumber(index) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `ITSSR-${yyyy}${mm}${dd}-${hh}${min}${ss}-${String(index + 1).padStart(2, '0')}`;
}

function buildPayloads(sample, index) {
  const submittedDate = new Date(Date.now() + index * 1000).toISOString();
  const ticketNo = makeTicketNumber(index);
  const assignedName = PIC_DISPLAY_NAMES[sample.assignedToEmail] || sample.assignedToEmail;
  const secondaryName = sample.secondaryPicEmail
    ? PIC_DISPLAY_NAMES[sample.secondaryPicEmail] || sample.secondaryPicEmail
    : '';
  const secondaryLine = sample.secondaryPicEmail
    ? `Secondary PIC: ${secondaryName} <${sample.secondaryPicEmail}>`
    : null;

  const main = {
    Title: ticketNo,
    FormCode: 'ITSSR',
    CurrentStatus: 'Submitted',
    Status: 'Submitted',
    WorkflowStage: 1,
    SubmittedDate: submittedDate,
    Site: sample.site,
    EnvironmentTag: 'Production',
    Requestor_Email: sample.requestorEmail,
    IsLocked: false,
    Remarks: [
      `Subject: ${sample.subject}`,
      `Requestor: ${sample.requestorName} <${sample.requestorEmail}>`,
      `Application: ${sample.application}`,
      `Primary PIC: ${assignedName} <${sample.assignedToEmail}>`,
      secondaryLine,
      sample.description,
    ].filter(Boolean).join('\n'),
  };

  const ext = {
    ParentFormCode: 'ITSSR',
    ParentSite: sample.site,
    ITSSR_CaseNo: ticketNo,
    ITSSR_ServiceType: sample.serviceType,
    ITSSR_ProblemDescription: sample.description,
    ITSSR_ReportedBy_Email: sample.requestorEmail,
    ITSSR_AssignedTo_Email: sample.assignedToEmail,
    ITSSR_ProblemCategory: sample.problemCategory,
    ITSSR_SupportMethod: sample.supportMethod,
  };

  return { ticketNo, main, ext };
}

async function main() {
  const selectedSamples = samples.slice(
    0,
    requestedCount && requestedCount > 0 ? requestedCount : samples.length
  );

  console.log(
    `${shouldExecute ? 'Executing' : 'Dry run'} ITSSR SharePoint seed for ${selectedSamples.length} record(s).`
  );
  console.log(`Site: https://${CONFIG.hostname}${CONFIG.sitePath}`);
  console.log(`Lists: ${CONFIG.mainListName}, ${CONFIG.extSupportListName}`);

  const payloads = selectedSamples.map(buildPayloads);

  if (!shouldExecute) {
    console.log('\nNo records were written. Re-run with --execute to create these items.\n');
    console.log(JSON.stringify(payloads, null, 2));
    return;
  }

  requireConfig();

  const site = await resolveSite();
  const mainList = await resolveList(site.id, CONFIG.mainListName);
  const extSupportList = await resolveList(site.id, CONFIG.extSupportListName);

  for (const payload of payloads) {
    console.log(`Creating ${payload.ticketNo} in ${CONFIG.mainListName}...`);
    const parent = await createListItem(site.id, mainList.id, payload.main);
    const parentId = parent.fields?.id || parent.fields?.ID || parent.id;

    console.log(`Creating extension row in ${CONFIG.extSupportListName} for parent ${parentId}...`);
    const ext = await createExtSupportItem(site.id, extSupportList.id, payload.ext, parentId);

    console.log(
      `Created ${payload.ticketNo}: MainDB_IT item ${parentId}, EXT item ${ext.fields?.id || ext.fields?.ID || ext.id}`
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
