import fs from 'node:fs';
import path from 'node:path';

const appRoot = process.cwd();
const configPath = path.join(appRoot, 'power.config.json');
const auditPathArg = process.argv.find((arg) => arg.startsWith('--audit='));
const auditPath = auditPathArg
  ? path.resolve(appRoot, auditPathArg.slice('--audit='.length))
  : path.resolve(appRoot, '..', '..', '..', '..', 'analysis', 'sharepoint-provisioning', 'sharepoint-list-audit.latest.json');
const dryRun = process.argv.includes('--dry-run');

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

function encodedSiteKey(siteUrl) {
  return encodeURIComponent(encodeURIComponent(siteUrl));
}

function isGuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

const configText = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(stripJsonComments(configText));
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const rows = Array.isArray(audit) ? audit : [];
const validRows = rows.filter((row) => isGuid(String(row.ListId ?? '')));

if (validRows.length === 0) {
  throw new Error(`No valid ListId values found in ${auditPath}. Run provisioning without -DryRun first.`);
}

const sharePointRef = Object.values(config.connectionReferences ?? {}).find(
  (ref) => ref.id === '/providers/Microsoft.PowerApps/apis/shared_sharepointonline' && ref.dataSets
);
if (!sharePointRef) throw new Error('No SharePoint connection reference with dataSets found in power.config.json');

let changed = 0;
for (const row of validRows) {
  const siteUrl = canonicalSiteUrl(row.SiteUrl);
  const dataSetEntry = Object.entries(sharePointRef.dataSets).find(([key]) => canonicalSiteUrl(key) === siteUrl);
  const dataSetKey = dataSetEntry?.[0] ?? encodedSiteKey(row.SiteUrl);
  if (!sharePointRef.dataSets[dataSetKey]) {
    sharePointRef.dataSets[dataSetKey] = { dataSources: {} };
  }

  const sourceKey = row.DataSourceKey;
  const current = sharePointRef.dataSets[dataSetKey].dataSources[sourceKey];
  if (!current || current.tableName !== row.ListId) {
    sharePointRef.dataSets[dataSetKey].dataSources[sourceKey] = { tableName: row.ListId };
    changed++;
  }

  if (!sharePointRef.dataSources.includes(sourceKey)) {
    sharePointRef.dataSources.push(sourceKey);
    changed++;
  }
}

console.log(`Power config updates needed: ${changed}`);
if (dryRun) {
  console.log('Dry run only. No file was written.');
} else if (changed > 0) {
  const backupPath = `${configPath}.${new Date().toISOString().replace(/[:.]/g, '-')}.bak`;
  fs.copyFileSync(configPath, backupPath);
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`Updated ${configPath}`);
  console.log(`Backup written to ${backupPath}`);
} else {
  console.log('No changes required.');
}
