import re, os

base = r'c:\Users\AL_AAF\Project\ioi_Docs\source\dxl\XML_HR_Penang'

for form in ['BSD', 'EEN', 'AWHR', 'CWR', 'DRD', 'CIR']:
    path = os.path.join(base, f'{form}_all_dxl.xml')
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read(80000)  # First 80K

    # CurrentAction values
    ca_vals = set(re.findall(r'CurrentAction\s*:=\s*"([^"]+)"', content))
    ca2_vals = set(re.findall(r'FIELD CA\s*:=\s*"([^"]+)"', content))
    all_ca = sorted(ca_vals | ca2_vals)

    # Keyword lists
    kw_blocks = re.findall(r'<keywords[^>]*>(.*?)</keywords>', content, re.DOTALL)
    choice_lists = []
    for kw in kw_blocks[:6]:
        kws = re.findall(r'<keyword>([^<]+)</keyword>', kw)
        if kws: choice_lists.append(kws)

    # MailSend
    mails = re.findall(r'MailSend\(([^)]+)\)', content)

    print(f'=== {form} ===')
    print(f'  CA states: {all_ca}')
    if choice_lists:
        for cl in choice_lists[:4]:
            print(f'  Choices: {cl[:10]}')
    if mails:
        unique_targets = set()
        for m in mails[:6]:
            parts = m.split(';')
            if parts: unique_targets.add(parts[0].strip()[:40])
        print(f'  Notifications to: {sorted(unique_targets)[:5]}')
    print()
