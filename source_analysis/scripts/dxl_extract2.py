import re, os

base = r'c:\Users\AL_AAF\Project\ioi_Docs\source\dxl\XML_HR_Penang'

# Read deeper for CWR and AWHR
for form in ['CWR', 'AWHR']:
    path = os.path.join(base, f'{form}_all_dxl.xml')
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    ca_vals = set(re.findall(r'CurrentAction\s*:=\s*"([^"]+)"', content))
    ca2_vals = set(re.findall(r'FIELD CA\s*:=\s*"([^"]+)"', content))
    all_ca = sorted(ca_vals | ca2_vals)

    kw_blocks = re.findall(r'<keywords[^>]*>(.*?)</keywords>', content, re.DOTALL)
    choice_lists = []
    for kw in kw_blocks[:8]:
        kws = re.findall(r'<keyword>([^<]+)</keyword>', kw)
        if kws: choice_lists.append(kws)

    mails = re.findall(r'MailSend\(([^)]+)\)', content)
    unique_targets = set()
    for m in mails:
        parts = m.split(';')
        for p in parts:
            t = p.strip().split(',')[0].strip()[:40]
            if t: unique_targets.add(t)

    print(f'=== {form} (FULL READ) ===')
    print(f'  CA states: {all_ca}')
    if choice_lists:
        for cl in choice_lists[:5]:
            print(f'  Choices: {cl[:12]}')
    print(f'  Notifications to: {sorted(unique_targets)[:8]}')
    print()
