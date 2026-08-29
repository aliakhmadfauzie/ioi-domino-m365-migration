#!/usr/bin/env node
/**
 * generate-schemas.mjs
 *
 * Reads IT_FieldDefinitions.csv and generates skeleton JSON schema files
 * under powerapps-mirror/apps/ioi-platform/src/form-schemas/.
 *
 * SAFE: never overwrites existing files (existsSync guard).
 * Choice options are left as [] — fill them manually in the JSON.
 *
 * Usage:
 *   node scripts/generate-schemas.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CSV_PATH = join(ROOT, 'docs', 'IT_FieldDefinitions.csv');
const OUT_DIR = join(ROOT, 'powerapps-mirror', 'apps', 'ioi-platform', 'src', 'form-schemas');

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSVLine(line) {
  const results = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      results.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  results.push(current.trim());
  return results;
}

// ── Column indices (0-based, matching header row) ─────────────────────────────
// "Title","ImportKey","FormCode","SectionId","SectionName","FieldId","Label",
// "DominoField","FieldType","Required","ReadOnly","VisibilityRule","DisplayOrder","Notes"
const COL = {
  FORM_CODE: 2,
  SECTION_ID: 3,
  SECTION_NAME: 4,
  FIELD_ID: 5,
  LABEL: 6,
  FIELD_TYPE: 8,
  REQUIRED: 9,
  READ_ONLY: 10,
  VISIBILITY_RULE: 11,
  DISPLAY_ORDER: 12,
  NOTES: 13,
};

// ── Parse CSV ─────────────────────────────────────────────────────────────────

const raw = readFileSync(CSV_PATH, 'utf-8');
const allLines = raw.split(/\r?\n/).filter(l => l.trim());

// Row 0: ListSchema XML — skip
// Row 1: header — skip
const dataLines = allLines.slice(2);

// formCode → sectionId → { sectionName, displayOrder, fields[] }
const formMap = new Map();

let lineNum = 2;
for (const line of dataLines) {
  lineNum++;
  if (!line.trim()) continue;

  const cols = parseCSVLine(line);
  const formCode = cols[COL.FORM_CODE];
  const sectionId = cols[COL.SECTION_ID];
  const sectionName = cols[COL.SECTION_NAME];
  const fieldId = cols[COL.FIELD_ID];
  const label = cols[COL.LABEL];
  const fieldType = cols[COL.FIELD_TYPE];
  const required = cols[COL.REQUIRED] === 'True';
  const readOnly = cols[COL.READ_ONLY] === 'True';
  const visRule = cols[COL.VISIBILITY_RULE] || '';
  const displayOrder = parseInt(cols[COL.DISPLAY_ORDER], 10) || 0;
  const notes = cols[COL.NOTES] || '';

  if (!formCode || !fieldId) continue;

  // Skip always-hidden fields
  if (visRule.startsWith('ShowOnForm=false')) continue;

  // Skip normalization/duplicate sections (SectionName contains "Status Transitions")
  if (sectionName && sectionName.includes('Status Transitions')) continue;

  if (!formMap.has(formCode)) {
    formMap.set(formCode, new Map());
  }
  const sectionMap = formMap.get(formCode);

  if (!sectionMap.has(sectionId)) {
    // Derive section displayOrder from sectionId suffix (e.g. DATAREST_S2 → 2)
    const sectionOrder = parseInt(sectionId.replace(/.*_S/, ''), 10) || 1;
    sectionMap.set(sectionId, {
      sectionId,
      sectionName: sectionName || sectionId,
      displayOrder: sectionOrder,
      fields: [],
    });
  }

  const field = {
    fieldId,
    label: label || fieldId,
    fieldType: fieldType || 'text',
    required,
    displayOrder,
  };

  if (readOnly) field.readOnly = true;
  if (fieldType === 'choice') field.options = [];
  if (notes) field.notes = notes;

  sectionMap.get(sectionId).fields.push(field);
}

// ── Write skeleton JSON files ─────────────────────────────────────────────────

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

let created = 0;
let skipped = 0;

for (const [formCode, sectionMap] of formMap) {
  const outPath = join(OUT_DIR, `${formCode}.json`);

  if (existsSync(outPath)) {
    console.log(`SKIP  ${formCode}.json (already exists)`);
    skipped++;
    continue;
  }

  const sections = [...sectionMap.values()].map(sec => ({
    ...sec,
    fields: [...sec.fields].sort((a, b) => a.displayOrder - b.displayOrder),
  })).sort((a, b) => a.displayOrder - b.displayOrder);

  const schema = {
    formCode,
    title: formCode,
    description: '',
    routeBase: `/it/forms/${formCode.toLowerCase()}`,
    icon: '',
    version: 1,
    sections,
  };

  writeFileSync(outPath, JSON.stringify(schema, null, 2), 'utf-8');
  console.log(`CREATE ${formCode}.json  (${sections.length} sections, ${sections.reduce((n, s) => n + s.fields.length, 0)} fields)`);
  created++;
}

console.log(`\nDone — ${created} created, ${skipped} skipped.`);
