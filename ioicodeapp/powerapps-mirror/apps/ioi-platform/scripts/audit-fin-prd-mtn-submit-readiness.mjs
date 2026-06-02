import fs from 'fs';
import path from 'path';

const appRoot = process.cwd();

const expected = {
  FIN: {
    service: 'src/generated/services/main-dbfin-service.ts',
    schema: '.power/schemas/sharepointonline/maindb_fin.Schema.json',
    dataSourceAliases: ['MainDBFIN', 'maindb_fin'],
    dataSourceKey: 'maindb_fin',
    requiredFields: ['Title', 'Status', 'Department', 'FormCode'],
    promotedCodes: ['CAR', 'CMF_A', 'INSUCLAI', 'RSES', 'VENDREGIFINA', 'EARF'],
    indexFiles: ['src/pages/finance/index.tsx', 'src/pages/finance/forms/index.tsx'],
    routeFile: 'src/routes/fin-routes.tsx',
    readFile: 'src/pages/finance/forms/[formCode]/index.tsx',
    readMarkers: ['useMainDBFINList', 'MainDB_FIN', "filter: `FormCode eq '", 'SharePoint Table Rows'],
    routeMarkers: ['FINFormDatabaseView', 'path="forms/:formCode"'],
    submitFile: 'src/pages/finance/forms/new.tsx',
    submitMarkers: ['useCreateMainDBFIN', 'getSharePointFinanceFormCode', 'Omit<MainDBFIN', 'navigate(`/fin/forms/${getSharePointFinanceFormCode(formCode)}`)'],
    blockedSubmitMarkers: ['JSON.stringify(formData)', 'MainDB_IT'],
    pnpCodes: ['CAR', 'CMF_A', 'INSUCLAI', 'RSES', 'VENDREGIFINA', 'EARF'],
  },
  PRD: {
    service: 'src/generated/services/main-dbprd-service.ts',
    schema: '.power/schemas/sharepointonline/maindb_prd.Schema.json',
    dataSourceAliases: ['MainDBPRD', 'maindb_prd'],
    dataSourceKey: 'maindb_prd',
    requiredFields: ['Title', 'Status', 'Department', 'FormCode', 'FormID'],
    promotedCodes: [
      'TPM',
      'BHTADDI',
      'FILTCLOTREPL',
      'OPRPCCPFILT',
      'STOCALLOMEMO',
      'STORTANKCLEA',
      'WEIGSCALVERI',
      'EQUIPREINSP',
      'SAPMATEMAST',
      'CCP1FILTINSP',
      'STORTANKVERI',
    ],
    indexFiles: ['src/pages/production/index.tsx', 'src/pages/production/forms/index.tsx'],
    routeFile: 'src/routes/production-routes.tsx',
    readFile: 'src/pages/production/forms/[formCode]/index.tsx',
    readMarkers: ['useMainDBPRDList', 'MainDB_PRD', "filter: `FormCode eq '", 'SharePoint Table Rows'],
    routeMarkers: ['ProductionFormDatabaseView', 'path="forms/:formCode"'],
    submitFile: 'src/pages/production/forms/new.tsx',
    submitMarkers: ['useCreateMainDBPRD', 'getSharePointProductionFormCode', 'Omit<MainDBPRD', 'navigate(`/production/forms/${getSharePointProductionFormCode(formCode)}`)'],
    blockedSubmitMarkers: ['JSON.stringify(formData)', 'MainDB_IT'],
    pnpCodes: [
      'TPM',
      'BHTADDI',
      'FILTCLOTREPL',
      'OPRPCCPFILT',
      'STOCALLOMEMO',
      'STORTANKCLEA',
      'WEIGSCALVERI',
      'EQUIPREINSP',
      'SAPMATEMAST',
      'CCP1FILTINSP',
      'STORTANKVERI',
    ],
  },
  MTN: {
    service: 'src/generated/services/main-dbmtn-service.ts',
    schema: '.power/schemas/sharepointonline/maindb_mtn.Schema.json',
    dataSourceAliases: ['MainDBMTN', 'maindb_mtn'],
    dataSourceKey: 'maindb_mtn',
    requiredFields: ['Title'],
    promotedCodes: ['FAILANALREPO', 'MAINPLAN', 'MTNEMERCHAN', 'EQUIPREINSP', 'PLANMAINDOCU'],
    routeCodes: ['FAR', 'MTP', 'PMD', 'MECP', 'EPI'],
    indexFiles: ['src/pages/mtr/index.tsx', 'src/pages/mtr/forms/index.tsx'],
    routeFile: 'src/routes/mtr-routes.tsx',
    readFile: 'src/pages/mtr/forms/[formCode]/index.tsx',
    readMarkers: ['useMainDBMTNList', 'MainDB_MTN', "filter: `FormCode eq '", 'SharePoint Table Rows'],
    routeMarkers: ['MTRFormDatabaseView', 'path="forms/:formCode"'],
    submitFile: 'src/pages/mtr/forms/new.tsx',
    submitMarkers: ['useCreateMainDBMTN', 'buildMainDBMTNRecord', 'Omit<MainDBMTN', 'navigate(`/mtr/forms/${formConfig.code.toLowerCase()}`)'],
    blockedSubmitMarkers: ['console.log(\'Simulated form submission', 'simulate', 'MainDB_IT'],
    pnpCodes: ['FAILANALREPO', 'MAINPLAN', 'MTNEMERCHAN', 'EQUIPREINSP', 'PLANMAINDOCU'],
  },
};

const checks = [];

function readText(relativePath) {
  return fs.readFileSync(path.join(appRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function normalizeName(value) {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function check(name, passed, detail = '') {
  checks.push({ name, passed, detail });
}

function collectPowerConfigDataSources() {
  const config = readJson('power.config.json');
  const names = new Set();
  const normalized = new Map();

  for (const connectionReference of Object.values(config.connectionReferences ?? {})) {
    for (const dataSet of Object.values(connectionReference.dataSets ?? {})) {
      for (const sourceName of Object.keys(dataSet.dataSources ?? {})) {
        names.add(sourceName);
        normalized.set(normalizeName(sourceName), sourceName);
      }
    }
  }

  return { names, normalized };
}

function getSchemaFields(relativePath) {
  const schema = readJson(relativePath);
  const properties = schema.schema?.items?.properties ?? {};
  const required = schema.schema?.items?.required ?? [];
  return {
    fields: new Set(Object.keys(properties)),
    required,
  };
}

function extractMappedFields(serviceSource) {
  return [
    ...new Set(
      [...serviceSource.matchAll(/setIfDefined\(out, '([^']+)'/g)].map((match) => match[1])
    ),
  ];
}

function extractDataSourceName(serviceSource) {
  return serviceSource.match(/const DATA_SOURCE_NAME = '([^']+)'/)?.[1];
}

function assertCodesInFiles(department, files, codes) {
  for (const file of files) {
    const source = readText(file);
    const missing = codes.filter((code) => !source.includes(code));
    check(`${department} promoted codes present in ${file}`, missing.length === 0, missing.join(', '));
  }
}

function assertSubmitMarkers(department, file, requiredMarkers, blockedMarkers) {
  const source = readText(file);
  const missingRequired = requiredMarkers.filter((marker) => !source.includes(marker));
  const presentBlocked = blockedMarkers.filter((marker) => source.includes(marker));
  check(`${department} submit page uses generated SharePoint create path`, missingRequired.length === 0, missingRequired.join(', '));
  check(`${department} submit page has no stale/simulated storage markers`, presentBlocked.length === 0, presentBlocked.join(', '));
}

function assertReadView(department, file, requiredMarkers) {
  const source = readText(file);
  const missingRequired = requiredMarkers.filter((marker) => !source.includes(marker));
  check(`${department} database view reads SharePoint-backed table rows`, missingRequired.length === 0, missingRequired.join(', '));
}

function assertRouteMarkers(department, file, requiredMarkers) {
  const source = readText(file);
  const missingRequired = requiredMarkers.filter((marker) => !source.includes(marker));
  check(`${department} routes expose form-code database view`, missingRequired.length === 0, missingRequired.join(', '));
}

function assertLibraryViewLinks(department, files) {
  for (const file of files) {
    const source = readText(file);
    if (!file.includes('/forms/index.tsx')) continue;
    check(`${department} forms library exposes View Rows action`, source.includes('View Rows'), file);
  }
}

function extractMasterSharePointCodes(owner) {
  const masterRegisterPath = path.resolve(
    appRoot,
    '..',
    '..',
    '..',
    '..',
    'source_analysis',
    '10_master_app_sources',
    'MASTER_SHAREPOINT_DESIGN_REGISTER.md'
  );
  const source = fs.readFileSync(masterRegisterPath, 'utf8');
  const codes = [];

  for (const line of source.split(/\r?\n/)) {
    const cells = line
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 8 || cells[2] !== owner) continue;
    const code = cells[5];
    if (code && code !== 'FormCode' && !codes.includes(code)) {
      codes.push(code);
    }
  }

  return codes;
}

const powerSources = collectPowerConfigDataSources();
const pnpScriptPath = path.resolve(appRoot, '..', '..', '..', '..', 'scripts', 'sharepoint', 'Test-FinPrdMtnSubmissions.ps1');
const pnpScript = fs.existsSync(pnpScriptPath) ? fs.readFileSync(pnpScriptPath, 'utf8') : '';

for (const [department, config] of Object.entries(expected)) {
  const service = readText(config.service);
  const dataSourceName = extractDataSourceName(service);
  const schema = getSchemaFields(config.schema);
  const mappedFields = extractMappedFields(service);
  const missingMappedFields = mappedFields.filter((field) => !schema.fields.has(field));
  const missingRequiredFields = config.requiredFields.filter((field) => !mappedFields.includes(field));
  const resolvedSource = powerSources.normalized.get(normalizeName(dataSourceName ?? ''));

  check(
    `${department} service data source resolves to power.config entry`,
    Boolean(dataSourceName && resolvedSource === config.dataSourceKey),
    `service=${dataSourceName ?? '(missing)'} resolved=${resolvedSource ?? '(missing)'} expected=${config.dataSourceKey}`
  );
  check(`${department} service maps only exported SharePoint fields`, missingMappedFields.length === 0, missingMappedFields.join(', '));
  check(`${department} service maps required SharePoint fields`, missingRequiredFields.length === 0, missingRequiredFields.join(', '));
  check(`${department} exported schema includes required fields`, config.requiredFields.every((field) => schema.required.includes(field)), `schema required=${schema.required.join(', ')}`);

  const masterCodes = extractMasterSharePointCodes(department);
  const missingMasterCodes = masterCodes.filter((code) => !config.pnpCodes.includes(code));
  const extraCodes = config.pnpCodes.filter((code) => !masterCodes.includes(code));
  check(
    `${department} expected codes match source_analysis/10_master_app_sources master SharePoint register`,
    missingMasterCodes.length === 0 && extraCodes.length === 0,
    `missing=${missingMasterCodes.join(', ') || '-'} extra=${extraCodes.join(', ') || '-'}`
  );

  assertCodesInFiles(department, config.indexFiles, config.promotedCodes);
  assertSubmitMarkers(department, config.submitFile, config.submitMarkers, config.blockedSubmitMarkers);
  assertReadView(department, config.readFile, config.readMarkers);
  assertRouteMarkers(department, config.routeFile, config.routeMarkers);
  assertLibraryViewLinks(department, config.indexFiles);

  const missingPnpCodes = config.pnpCodes.filter((code) => {
    const quotedCode = new RegExp(`["']${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
    return !quotedCode.test(pnpScript);
  });
  check(`${department} live verification script covers promoted SharePoint codes`, missingPnpCodes.length === 0, missingPnpCodes.join(', '));
}

const maintenanceRoutes = readText('src/routes/maintenance-routes.tsx');
const directMaintenanceRouteMarkers = [
  "@/pages/maintenance/forms/far/new",
  "@/pages/maintenance/forms/mtp/new",
  "@/pages/maintenance/forms/mecp/new",
  "@/pages/maintenance/forms/epi/new",
];
check(
  'Legacy maintenance routes redirect to MTR instead of old direct pages',
  directMaintenanceRouteMarkers.every((marker) => !maintenanceRoutes.includes(marker)) &&
    maintenanceRoutes.includes('<Navigate to="/mtr/forms" replace />'),
  directMaintenanceRouteMarkers.filter((marker) => maintenanceRoutes.includes(marker)).join(', ')
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  const status = item.passed ? 'PASS' : 'FAIL';
  const suffix = item.detail ? ` - ${item.detail}` : '';
  console.log(`${status} ${item.name}${suffix}`);
}

if (failed.length > 0) {
  console.error(`\nFIN/PRD/MTN readiness audit failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log(`\nFIN/PRD/MTN readiness audit passed: ${checks.length} checks.`);
