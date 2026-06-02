import xml.etree.ElementTree as ET
import os

ns = {'dxl': 'http://www.lotus.com/dxl'}

def extract_form_info(filepath):
    base = os.path.basename(filepath).replace('_all_dxl.xml', '')
    tree = ET.parse(filepath)
    root = tree.getroot()
    
    db_title = root.get('title', '')
    
    forms = []
    for form in root.findall('.//dxl:form', ns):
        fname = form.get('name', '')
        
        # Get field info
        fields = []
        for field in form.findall('.//dxl:field', ns):
            fname_field = field.get('name', '')
            ftype = field.get('type', '')
            fields.append({
                'name': fname_field,
                'type': ftype,
            })
        
        # Get LotusScript code events
        codes = []
        for code_el in form.findall('.//dxl:code', ns):
            evt = code_el.get('event', '')
            content = code_el.text or ''
            if content.strip():
                codes.append({'event': evt, 'content': content.strip()[:500]})
        
        forms.append({
            'name': fname,
            'fields': fields,
            'codes': codes
        })
    
    return base, db_title, forms

folder = 'XML FILE/XML_HR_Penang'
files = ['AWHR_all_dxl.xml', 'BSD_all_dxl.xml', 'CIR_all_dxl.xml', 'CWR_all_dxl.xml']

for f in files:
    path = os.path.join(folder, f)
    name, title, forms = extract_form_info(path)
    print("=" * 70)
    print(f"FORM: {name}")
    print(f"DATABASE: {title}")
    print("=" * 70)
    for form in forms:
        print(f"\n  --- Form: {form['name']} ---")
        if form['fields']:
            print(f"    Fields ({len(form['fields'])}):")
            for fld in form['fields']:
                print(f"      {fld['name']:35s} type={fld['type']}")
        if form['codes']:
            print(f"    Code events:")
            for c in form['codes']:
                print(f"      event={c['event']}")
    print()
