import fs from 'node:fs';
import path from 'node:path';

const appRoot = process.cwd();
const configPath = path.join(appRoot, 'power.config.json');
const outputPath = path.join(appRoot, '..', '..', '..', '..', 'analysis', 'power-config-audit.json');

const requiredSources = [
  ['https://ioioi.sharepoint.com/sites/ioi-portal-it', 'maindb_it'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-it', 'maindb_it_jhr'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-it', 'maindb_it_ext_policy'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-hr', 'maindb_hr'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-hr', 'maindb_hr_jhr'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-qa', 'maindb_qa'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-qa', 'maindb_qc'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-qa', 'maindb_qa_jhr'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-qa', 'maindb_qc_jhr'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-fin', 'maindb_fin'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-prd', 'maindb_prd'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-she', 'maindb_she'],
  ['https://ioioi.sharepoint.com/sites/ioi-portal-str', 'maindb_str'],
];

function stripJsonComments(input) {
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const n = input[i + 1];
    if (inString) {
      out += c;
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      out += c;
      continue;
    }
    if (c === '/' && n === '/') {
      while (i < input.length && input[i] !== '\n') i++;
      out += '\n';
      continue;
    }
    if (c === '/' && n === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) i++;
      i++;
      continue;
    }
    out += c;
  }
  return out;
}

function canonicalSiteUrl(raw) {
  let value = raw;
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }
  return value.replace(/\/$/, '').toLowerCase();
}

function isGuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

const config = JSON.parse(stripJsonComments(fs.readFileSync(configPath, 'utf8')));
const sources = [];

for (const [connectionRefId, ref] of Object.entries(config.connectionReferences ?? {})) {
  for (const [siteKey, site] of Object.entries(ref.dataSets ?? {})) {
    const siteUrl = canonicalSiteUrl(siteKey);
    for (const [sourceKey, source] of Object.entries(site.dataSources ?? {})) {
      sources.push({
        connectionRefId,
        siteUrl,
        sourceKey,
        tableName: String(source.tableName ?? ''),
        tableNameIsGuid: isGuid(String(source.tableName ?? '')),
      });
    }
  }
}

const issues = [];
for (const source of sources) {
  if (source.tableName === '00000000-0000-0000-0000-000000000000') {
    issues.push({ type: 'placeholder-guid', ...source });
  } else if (!source.tableNameIsGuid) {
    issues.push({ type: 'non-guid-table-name', ...source });
  }
}

for (const [siteUrl, sourceKey] of requiredSources) {
  const found = sources.find((source) => source.siteUrl === canonicalSiteUrl(siteUrl) && source.sourceKey === sourceKey);
  if (!found) {
    issues.push({ type: 'missing-core-source', siteUrl: canonicalSiteUrl(siteUrl), sourceKey });
  }
}

const duplicateGroups = new Map();
for (const source of sources) {
  const key = `${source.siteUrl}::${source.sourceKey}`;
  const group = duplicateGroups.get(key) ?? [];
  group.push(source);
  duplicateGroups.set(key, group);
}
for (const [key, group] of duplicateGroups.entries()) {
  if (group.length > 1) {
    issues.push({ type: 'duplicate-source-key', key, entries: group });
  }
}

const result = {
  generatedAt: new Date().toISOString(),
  configPath,
  sourceCount: sources.length,
  issueCount: issues.length,
  issues,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`Power config audit: ${sources.length} sources, ${issues.length} issues`);
console.log(`Audit written to ${outputPath}`);
for (const issue of issues.slice(0, 20)) {
  console.log(`- ${issue.type}: ${issue.siteUrl ?? issue.key} ${issue.sourceKey ?? ''} ${issue.tableName ?? ''}`);
}
if (issues.length > 20) console.log(`... ${issues.length - 20} more issue(s)`);

if (process.argv.includes('--strict') && issues.length > 0) {
  process.exitCode = 1;
}
