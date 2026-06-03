import os, json, glob

schema_dir = "c:/Users/AL_AAF/Project/ioi_Docs/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas"
print("=== People fields with actual SharePoint column names ===")
print()

for fpath in sorted(glob.glob(os.path.join(schema_dir, "*.json"))):
    fname = os.path.basename(fpath)
    with open(fpath) as f:
        try:
            data = json.load(f)
        except:
            continue
    form_code = data.get("formCode", fname.replace(".json", ""))
    people_fields = []
    for section in data.get("sections", []):
        for field in section.get("fields", []):
            if field.get("fieldType") == "people":
                spcol = field.get("spColumn", "")
                spTable = field.get("spTable", "MainDB_IT")
                label = field.get("label", "")
                field_id = field.get("fieldId", "")
                people_fields.append({
                    "label": label,
                    "fieldId": field_id,
                    "spColumn": spcol,
                    "spTable": spTable
                })
    if people_fields:
        print(f"{form_code}:")
        for pf in people_fields:
            sptable = pf["spTable"]
            spcol = pf["spColumn"] if pf["spColumn"] else "(no spColumn)"
            print("  [" + sptable + "] " + spcol + ": " + pf["label"] + " (" + pf["fieldId"] + ")")
        print()
