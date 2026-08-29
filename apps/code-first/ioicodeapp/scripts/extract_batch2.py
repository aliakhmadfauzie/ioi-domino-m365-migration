import subprocess, sys

# Run the existing analyzer on the next 4 forms
code = '''
import re, os

def extract_forms_text(filepath):
    with open(filepath, 'rb') as f:
        raw = f.read()
    content = raw.decode('utf-8', errors='replace')
    
    base = os.path.basename(filepath).replace('_all_dxl.xml', '')
    db_match = re.search(r"title='([^']*)'", content)
    db_title = db_match.group(1) if db_match else 'Unknown'
    db_title = db_title.replace('&amp;', '&')
    
    form_blocks = []
    pattern = re.compile(r"<form\\s+name='([^']*)'")
    for m in pattern.finditer(content):
        fname = m.group(1)
        start = m.start()
        depth = 1
        search_from = m.end()
        end_pos = m.end()
        while search_from < len(content) and depth > 0:
            next_open = content.find('<form ', search_from)
            next_close = content.find('</form>', search_from)
            if next_close == -1:
                break
            if next_open != -1 and next_open < next_close:
                depth += 1
                search_from = next_open + 6
            else:
                depth -= 1
                search_from = next_close + 7
                if depth == 0:
                    end_pos = next_close + 7
        if depth == 0:
            block = content[start:end_pos]
            form_blocks.append((fname, block))
    return base, db_title, form_blocks

def extract_fields_from_block(block):
    seen = set()
    fields = []
    for m in re.finditer(r"<field[^>]*?>", block):
        fblock = m.group()
        name_m = re.search(r"name='([^']*)'", fblock)
        type_m = re.search(r"type='([^']*)'", fblock)
        if name_m and type_m:
            fname = name_m.group(1)
            ftype = type_m.group(1)
            if fname not in seen:
                seen.add(fname)
                fields.append({'name': fname, 'type': ftype})
    return fields

def extract_code_events(block):
    events = set()
    for m in re.finditer(r"<code\\s+event='([^']*)'", block):
        events.add(m.group(1))
    return sorted(events)

def extract_subforms(block):
    subs = set()
    for m in re.finditer(r"<subform[^>]*?name='([^']*)'", block):
        subs.add(m.group(1))
    return sorted(subs)

folder = 'XML FILE/XML_HR_Penang'
files = ['DRD_all_dxl.xml', 'EEN_all_dxl.xml', 'EPDU_all_dxl.xml', 'EPHR_all_dxl.xml']

type_map = {
    'text': 'Text', 'datetime': 'Date/Time', 'number': 'Number',
    'richtext': 'Rich Text', 'names': 'Person/Name', 'authors': 'Author',
    'readers': 'Reader', 'keyword': 'Choice/Keyword', 'time': 'Time'
}

for f in files:
    path = os.path.join(folder, f)
    name, title, form_blocks = extract_forms_text(path)
    
    print(f"\\n{'='*70}")
    print(f"FORM: {name}")
    print(f"DATABASE: {title}")
    print(f"{'='*70}")
    
    for fname, block in form_blocks:
        fields = extract_fields_from_block(block)
        events = extract_code_events(block)
        subforms = extract_subforms(block)
        
        print(f"\\n  === Form: {fname} ===")
        if subforms:
            print(f"  Subforms: {', '.join(subforms)}")
        
        type_counts = {}
        for fld in fields:
            t = fld['type']
            type_counts[t] = type_counts.get(t, 0) + 1
        
        print(f"  Fields: {len(fields)} total")
        print(f"  Types: {type_counts}")
        if events:
            print(f"  Code events: {', '.join(events)}")
        
        if fields:
            print(f"\\n  {'Field Name':35s} {'Type':20s}")
            print(f"  {'-'*35} {'-'*20}")
            for fld in fields:
                mapped = type_map.get(fld['type'], fld['type'].title())
                print(f"  {fld['name']:35s} {mapped:20s}")
    
    print()
'''

with open('scripts/_batch2_runner.py', 'w') as f:
    f.write(code)

result = subprocess.run([sys.executable, 'scripts/_batch2_runner.py'], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[:2000])
