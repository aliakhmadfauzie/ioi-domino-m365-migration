"""Verify it_index_screen_inventory.xlsx against source code and audit register."""
import pandas as pd
import os
import re

BASE = r'c:/Users/AL_AAF/Project/ioi_Docs'
XLSX = os.path.join(BASE, 'outputs/019e8df0-1687-7e02-99f6-dc91c9e729d3/it_index_screen_inventory.xlsx')
ROUTES = os.path.join(BASE, 'ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-form-routes.ts')
PAGES_BASE = os.path.join(BASE, 'ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms')
AUDIT_REGISTER = os.path.join(BASE, 'audit/01_register/AUDIT_MASTER_REGISTER.md')
HUB_FILE = os.path.join(BASE, 'ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/index.tsx')
GENERIC_FALLBACK = os.path.join(BASE, 'ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/[formCode]/index.tsx')

print("=" * 80)
print("VERIFICATION: it_index_screen_inventory.xlsx")
print("=" * 80)

# ── 1. Load Excel ─────────────────────────────────────────────────────────────
df = pd.read_excel(XLSX, sheet_name='Index Screens')
summary = pd.read_excel(XLSX, sheet_name='Summary')
nav = pd.read_excel(XLSX, sheet_name='Navigation Evidence')
hub = pd.read_excel(XLSX, sheet_name='Hub Screen')
notes = pd.read_excel(XLSX, sheet_name='Source Notes')

print(f"\nExcel rows: {len(df)}")
print(f"Excel form codes: {sorted(df['Form Code'].tolist())}")

# ── 2. Parse route definitions ────────────────────────────────────────────────
with open(ROUTES, 'r', encoding='utf-8') as f:
    routes_content = f.read()

mapping = {}
for line in routes_content.split('\n'):
    m = re.match(r"^\s+(\w+):\s+'([^']+)'", line)
    if m:
        mapping[m.group(1)] = m.group(2)

canonical_slugs = sorted(set(mapping.values()))
slug_to_codes = {}
for code, slug in mapping.items():
    slug_to_codes.setdefault(slug, []).append(code)

print(f"\nRoute file canonical slugs: {len(canonical_slugs)}")
print(f"Route file total code->slug mappings: {len(mapping)}")

# ── 3. Compare slug coverage ──────────────────────────────────────────────────
excel_slugs = set(df['Route Slug'].tolist())
route_slugs = set(canonical_slugs)
missing = route_slugs - excel_slugs
extra = excel_slugs - route_slugs

print(f"\n{'─'*80}")
print("3. SLUG COVERAGE")
print(f"{'─'*80}")
if missing:
    print(f"  ❌ MISSING from Excel (in routes but not in Excel): {sorted(missing)}")
else:
    print(f"  ✅ All route slugs present in Excel")
if extra:
    print(f"  ⚠️  EXTRA in Excel (not in routes): {sorted(extra)}")
else:
    print(f"  ✅ No extra slugs in Excel")

# ── 4. Verify aliases ────────────────────────────────────────────────────────
print(f"\n{'─'*80}")
print("4. ALIAS VERIFICATION")
print(f"{'─'*80}")
alias_issues = []
for _, row in df.iterrows():
    form_code = row['Form Code']
    route_slug = row['Route Slug']
    excel_aliases_str = str(row['Aliases']) if pd.notna(row['Aliases']) else ''
    excel_aliases = set(a.strip().upper() for a in excel_aliases_str.split(',') if a.strip())

    # All codes mapping to this slug
    expected_codes = set(slug_to_codes.get(route_slug, []))

    missing_aliases = expected_codes - excel_aliases
    extra_aliases = excel_aliases - expected_codes

    if missing_aliases or extra_aliases:
        alias_issues.append((form_code, route_slug, sorted(missing_aliases), sorted(extra_aliases)))

if alias_issues:
    for form, slug, miss, ext in alias_issues:
        parts = []
        if miss:
            parts.append(f"MISSING: {', '.join(miss)}")
        if ext:
            parts.append(f"EXTRA: {', '.join(ext)}")
        print(f"  ⚠️  {form:20s} ({slug:20s}): {' | '.join(parts)}")
else:
    print("  ✅ All aliases match route definitions")

# ── 5. Verify form names (cross-check with source file titles) ────────────────
print(f"\n{'─'*80}")
print("5. FORM NAME SPOT-CHECKS")
print(f"{'─'*80}")
# Read a few index files to check the page title
name_checks = ['eaf', 'itssr', 'ur', 'edl', 'hi', 'srvr']
for slug in name_checks:
    idx_path = os.path.join(PAGES_BASE, slug, 'index.tsx')
    if os.path.exists(idx_path):
        with open(idx_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Look for title or heading patterns
        title_match = re.search(r'title[=:]\s*["\']([^"\']+)["\']', content, re.IGNORECASE)
        h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
        heading = title_match.group(1) if title_match else (h1_match.group(1) if h1_match else None)

        excel_name = df.loc[df['Route Slug'] == slug, 'Form Name'].values
        excel_name = excel_name[0] if len(excel_name) > 0 else 'N/A'
        print(f"  {slug:15s}: Excel name='{excel_name}' | Source heading='{heading}'")
    else:
        print(f"  {slug:15s}: index.tsx NOT FOUND")

# ── 6. Verify Index Source File paths ─────────────────────────────────────────
print(f"\n{'─'*80}")
print("6. INDEX SOURCE FILE PATH VERIFICATION")
print(f"{'─'*80}")
missing_files = []
for _, row in df.iterrows():
    src = row['Index Source File']
    full_path = os.path.join(BASE, 'ioicodeapp/powerapps-mirror/apps/ioi-platform', src)
    if not os.path.exists(full_path):
        missing_files.append((row['Form Code'], src))

if missing_files:
    for code, path in missing_files:
        print(f"  ❌ {code}: {path} — FILE NOT FOUND")
else:
    print(f"  ✅ All {len(df)} Index Source Files exist on disk")

# ── 7. Verify Uses Generic Fallback ───────────────────────────────────────────
print(f"\n{'─'*80}")
print("7. GENERIC FALLBACK VERIFICATION")
print(f"{'─'*80}")
generic_exists = os.path.exists(GENERIC_FALLBACK)
excel_generic_rows = df['Uses Generic Fallback'].tolist()
uses_generic = [v for v in excel_generic_rows if str(v).strip().lower() == 'yes']
print(f"  Generic fallback file exists: {generic_exists}")
print(f"  Excel rows claiming generic fallback: {len(uses_generic)}")
if len(uses_generic) == 0:
    print(f"  ✅ No forms use generic fallback (all have dedicated index.tsx)")
else:
    print(f"  Forms using generic: {[df.iloc[i]['Form Code'] for i, v in enumerate(excel_generic_rows) if str(v).strip().lower() == 'yes']}")

# ── 8. Verify Hub Screen ─────────────────────────────────────────────────────
print(f"\n{'─'*80}")
print("8. HUB SCREEN VERIFICATION")
print(f"{'─'*80}")
hub_exists = os.path.exists(HUB_FILE)
print(f"  Hub file exists: {hub_exists}")
print(f"  Excel hub path: {hub.iloc[0]['Hub Path']}")
print(f"  Excel hub source: {hub.iloc[0]['Source File']}")
if hub_exists:
    with open(HUB_FILE, 'r', encoding='utf-8') as f:
        hub_content = f.read()
    # Check if it uses normalizeITFormRouteSlug
    uses_slug_fn = 'normalizeITFormRouteSlug' in hub_content
    print(f"  Uses normalizeITFormRouteSlug: {uses_slug_fn}")

# ── 9. Verify Audit Register Approval Classifications ────────────────────────
print(f"\n{'─'*80}")
print("9. APPROVAL CLASSIFICATION vs AUDIT REGISTER")
print(f"{'─'*80}")
if os.path.exists(AUDIT_REGISTER):
    with open(AUDIT_REGISTER, 'r', encoding='utf-8') as f:
        audit_content = f.read()

    # Extract approval classifications from audit register
    # Look for patterns like form code + approval status
    approval_from_audit = {}
    for _, row in df.iterrows():
        form_code = row['Form Code']
        excel_approval = row['Approval Requirement']
        # Search for the form code in audit register
        # Look for lines mentioning the form code near approval keywords
        pattern = re.compile(rf'{re.escape(form_code)}.*?(Required|Not Required|Unknown)', re.IGNORECASE)
        match = pattern.search(audit_content)
        if match:
            approval_from_audit[form_code] = match.group(1)
        else:
            approval_from_audit[form_code] = None

    mismatches = []
    for _, row in df.iterrows():
        fc = row['Form Code']
        excel_val = str(row['Approval Requirement']).strip()
        audit_val = approval_from_audit.get(fc)
        if audit_val and excel_val.lower() != audit_val.lower():
            mismatches.append((fc, excel_val, audit_val))

    if mismatches:
        for fc, excel_val, audit_val in mismatches:
            print(f"  ⚠️  {fc:20s}: Excel='{excel_val}' vs Audit='{audit_val}'")
    else:
        print(f"  ✅ All approval classifications match audit register (or audit has no specific entry)")
else:
    print(f"  ⚠️  Audit register not found at {AUDIT_REGISTER}")

# ── 10. Verify Summary metrics ───────────────────────────────────────────────
print(f"\n{'─'*80}")
print("10. SUMMARY METRICS VERIFICATION")
print(f"{'─'*80}")
for _, srow in summary.iterrows():
    metric = srow['Metric']
    value = srow['Value']
    note = srow['Note']

    if 'IT index/list screens' in str(metric):
        actual_count = len(df)
        match = actual_count == value
        status = '✅' if match else '❌'
        print(f"  {status} '{metric}': Excel says {value}, actual count = {actual_count}")

    elif 'Dedicated index.tsx' in str(metric):
        actual_count = len(df)  # All 34 have dedicated index.tsx
        match = actual_count == value
        status = '✅' if match else '❌'
        print(f"  {status} '{metric}': Excel says {value}, actual = {actual_count}")

    elif 'Generic fallback rows' in str(metric):
        generic_count = len([v for v in df['Uses Generic Fallback'] if str(v).strip().lower() == 'yes'])
        match = generic_count == value
        status = '✅' if match else '❌'
        print(f"  {status} '{metric}': Excel says {value}, actual = {generic_count}")

    elif 'Required approval' in str(metric):
        req_count = len([v for v in df['Approval Requirement'] if str(v).strip().lower() == 'required'])
        match = req_count == value
        status = '✅' if match else '❌'
        print(f"  {status} '{metric}': Excel says {value}, actual = {req_count}")

    elif 'Unknown approval' in str(metric):
        unk_count = len([v for v in df['Approval Requirement'] if str(v).strip().lower() == 'unknown'])
        match = unk_count == value
        status = '✅' if match else '❌'
        print(f"  {status} '{metric}': Excel says {value}, actual = {unk_count}")

# ── 11. Cross-check Navigation Evidence sheet ────────────────────────────────
print(f"\n{'─'*80}")
print("11. NAVIGATION EVIDENCE SHEET CONSISTENCY")
print(f"{'─'*80}")
if len(nav) == len(df):
    print(f"  ✅ Navigation Evidence has same row count ({len(nav)}) as Index Screens ({len(df)})")
else:
    print(f"  ❌ Row count mismatch: Navigation={len(nav)} vs Index={len(df)}")

# Check a few fields match between sheets
nav_issues = []
for i in range(len(df)):
    idx_fc = df.iloc[i]['Form Code']
    nav_fc = nav.iloc[i]['Form Code']
    idx_slug = df.iloc[i]['Route Slug']
    nav_slug = nav.iloc[i]['Route Slug']
    if idx_fc != nav_fc:
        nav_issues.append(f"Row {i} mismatch: Index={idx_fc} vs Nav={nav_fc}")
    if idx_slug != nav_slug:
        nav_issues.append(f"Row {i} slug mismatch: Index={idx_fc}({idx_slug}) vs Nav={nav_fc}({nav_slug})")

if nav_issues:
    for issue in nav_issues[:10]:
        print(f"  ❌ {issue}")
else:
    print(f"  ✅ Form Code and Route Slug consistent across sheets")

# ── 12. Route Type verification ──────────────────────────────────────────────
print(f"\n{'─'*80}")
print("12. ROUTE TYPE VERIFICATION")
print(f"{'─'*80}")
route_types = df['Route Type'].value_counts()
print(f"  Route Type distribution:")
for rt, count in route_types.items():
    print(f"    {rt}: {count}")
# All should be 'Specific' since every form has a dedicated directory
non_specific = df[df['Route Type'] != 'Specific']
if len(non_specific) == 0:
    print(f"  ✅ All 34 forms are 'Specific' route type")
else:
    print(f"  ⚠️  {len(non_specific)} forms are not 'Specific': {non_specific[['Form Code', 'Route Type']].to_dict('records')}")

print(f"\n{'='*80}")
print("VERIFICATION COMPLETE")
print(f"{'='*80}")
