"""
PUR SharePoint List Audit - PDF Source Comparison
Uses PyMuPDF to extract fields from PDF sources and compare against SharePoint provisioning
"""

import fitz  # PyMuPDF
import json
import re
from pathlib import Path
from collections import defaultdict
from datetime import datetime

BASE = Path(r"c:\Users\AL_AAF\Project\ioi_Docs")
PROV = BASE / "analysis" / "sharepoint-provisioning" / "adm-mkt-pur-field-audit-20260603-023719.json"

# PDF mappings: FormCode -> list of (subfolder, filename)
PDF_MAP = {
    "VCAR2025":     [("Pur", "012_oleObject90.pdf")],
    "VCARPOM":      [("POM", "001_oleObject99.pdf")],
    "MATEEVALMER":  [("Pur", "008_oleObject86.pdf")],
    "NOTIOFCHAN":   [("Pur", "009_oleObject87.pdf")],
    "ECMRECOMATE":  [("Pur", "001_oleObject79.pdf")],
    "MASTOFSERV":   [("Pur", "007_oleObject85.pdf")],
    "TEND":         [("Pur", "002_oleObject80.pdf"), ("Pur", "011_oleObject89.pdf")],
    "VENDAUDIREPO": [("Pur", "013_oleObject91.pdf"), ("Pur", "014_oleObject92.pdf"), ("Pur", "015_oleObject93.pdf")],
    "VENDREGIVRF":  [("Pur", "018_oleObject96.pdf"), ("Pur", "019_oleObject97.pdf"), ("Pur", "020_oleObject98.pdf")],
    "KOSHHALACERT": [("Pur", "005_oleObject83.pdf")],
    "MASTOFAPPR":   [("Pur", "006_oleObject84.pdf")],
    "RSPOVALICHEC": [("Pur", "010_oleObject88.pdf")],
    "VENDDIALREPO": [("Pur", "016_oleObject94.pdf")],
    "VENDCSRASSE":  [("Pur", "003_oleObject81.pdf")],
    "VENDQUALAPPR": [("Pur", "004_oleObject82.pdf"), ("Pur", "017_oleObject95.pdf")],
}

# Expected field counts from SOURCES.md
EXPECTED = {
    "VCAR2025": 108, "VCARPOM": 53, "MATEEVALMER": 44, "NOTIOFCHAN": 39,
    "ECMRECOMATE": 59, "MASTOFSERV": 32, "TEND": 70, "VENDAUDIREPO": 55,
    "VENDREGIVRF": 55, "KOSHHALACERT": 23, "MASTOFAPPR": 8, "RSPOVALICHEC": 14,
    "VENDDIALREPO": 9, "VENDCSRASSE": 20, "VENDQUALAPPR": 40,
}

# Source fields from SOURCES.md (Domino field names)
SOURCE_FIELDS = {
    "VCAR2025": [
        "VCARNo","DateSent","Site","VenName","Requestor1","Dept","CC","HODName","ItemDesc",
        "PONo","DONo","VCARCat","NCDesc","Type","FoodSafety","Attachment1","DateVerified",
        "HODComments","VeriStatus","QAHOD","QADate","QAComment","QAStatus","FINHOD","FINDate",
        "FINComment","FINStatus","DLPName","DLPNotifiedDate","DLPCC","DisVenName","RespondBy",
        "NextReminder","NextReminder1","ReceivedDate","NotifiedDate","DLPPIC","PURAtt","VCARRemark",
        "Cause","Category","AcceptCA","Comment1","ReqComments","VerifiedBy","AcceptDate",
        "PURAccept","By","PURHOD","PURAcceptDate","PURRemarks","Comment1a","Claims",
        "WithdrawComments","AttFIN","VerifiedOn","Body","VerifiedBy_1","NewStatus","FollowUpDate",
        "VerifiedOn_1","Body_1","attach_2","VerifiedBy_1_1","NewStatus_1","CurrentAction",
        "Requestor","AuthorsList","QAMgr","QAAdmin","ISGAdmin","PurHODName","PUR","PURPIC",
        "QA","QA2","PURMail","AEditor1","AEditor2","AEditor3","AEditor4","AEditor5","AEditor6",
        "HOD1","FirstTime","SecondTime","increment1","increment3","SendTo","LockSection1",
        "LockSection2","CAStatus","ActualDate","NewAcceptDate","PURHODDate","NewDateReview",
        "Reminder1","Reminder2","HODRemDate","QARemDate","FINRemDate","OoiRemDate","Mail1",
        "DLPRemDate","Mail2","Mail3","HODNames","COO","ED","Year","Month","INO",
    ],
    "VCARPOM": [
        "VCARNo","VendorName","DateSent","Requestor1","Dept","CC","Recipient1","HOD","ItemDesc",
        "PONo","DONo","NCDesc","Attachment1","DivHead","DateVerified","HODComments","VeriStatus",
        "VendorName1","RespondBy","ReceivedDate","NotifiedDate","VCARRemark","Cause","AcceptCA",
        "ReqComments","VerifiedBy","AcceptDate","PURAccept","By","PURHOD","PURAcceptDate",
        "FollowUp","EmailAddress","PURRemarks","DateSentReq","PURemarks1","Att1","Requestor",
        "AuthorsList","QSCCName","ISGAdmin","WhoCanRead","PurHODName","PUR","MailingList",
        "CurrentAction","AEditor1","AEditor2","AEditor3","AEditor4","HOD1","FirstTime",
        "SecondTime","increment1","Year","Month","INO",
    ],
    "MATEEVALMER": [
        "MERNo","Initiation","Requestor","NameDesc","EvalScope","Endorsement","RemarkEnd","remQA",
        "Approval","txtCom1","StatusApp","nmPIC1E","nmPIC2E","nmPIC3E","nmPIC4E","nmPIC5E",
        "nmProdAppC_1","nmMKTAppC_1","nmQAAppC_1","SubmitApp","SendToTrial","Status1","Status2",
        "Status3","Hide","Hide2","SendToCC","rchtxtReportE_New","nmProdAppC_2","dtDateProdC_1",
        "txtComProdC_1","nmMKTAppC_2","dtDateMKTC_1","txtComMKTC_1","nmQAAppC_2","dtDateQAC_1",
        "txtComQAC_1","MasterlistUpd","WDDate","WDBy","WDAttach","WithdrawnCom","WDStatus",
    ],
    "NOTIOFCHAN": [
        "ChgNum","VCARCat","SubmitEval","sel1","TotalList","txtStatus1","GetTotal","GetApp",
        "Remarks","txtComQAC_1","MasterlistUpd","MERNo","SendCC","WDDate","WDBy","WDAttach",
        "WDRem","CurrentAction","DocAuthor","CDate","Year","Month","INO","Editor1","Editor2",
        "Editor3","Editor4","QAPersonnel","QAHOD","QAAdmin","ISAdmin","PURAdmin","DefCCMails",
        "MailingList","MailingList_1","EditorAssessment","AssessMails","AssessDate","ReminderSent",
        "RemDate","RemPdgApp",
    ],
    "ECMRECOMATE": [
        "NotNum","MaterialName","Qty","Location","PM","AppName","Remarks","Attachment","CC",
        "PreBy","Designation1","PreDate","StatusApp2","ReqBy2","ReqDate2","ReqComment2",
        "StatusApp","ReqDate","ReqComment","SellingPrice","SoldTo","RemarksB","BAttachment",
        "TotalPayment","PreBy_1","Designation1_1","PreDate_1","PreComment_1","StatusAppB",
        "ReqByB","Designation2B","ReqDateB","ReqCommentB","CollectionDate","CollectedBy",
        "Quantity","Location_C","SORequired","SONum","CopyToC","RemarksPUR","SubmittedBy",
        "CompletionStatus","CompletedBy","DateCompleted","AccRemarks","DocAuthor","CDate",
        "CurrentAction","Editor1","Editor2","Editor3","Editor4","AccPIC","ISAdmin",
        "Year","Month","INO","COO","Defcc","PURHOD",
    ],
    "MASTOFSERV": [
        "MSPNo","Department","HOD","Service","Supplier","Scope","VAR","CurrentAction","INO",
        "ISG","PURMGR","PUR","QA","FST","HODEditor","PUREditor","QAEditor","Editor1","Editor2",
        "Editor3","Editor4","Editor5","Reply","RemPIC","SPDD","CLDD","ReminderStatus",
        "RemDate1st","NextRemDate","RenStatus","UpcmgRemDate","Editor1_1",
    ],
    "TEND": [
        "Certificate","Type","Company","Manufacturer","Supplier","ChemicalName","MaterialCode",
        "Category","CompanyBrandName","Country","Status","ExpiryDate","SendTo","Attachment",
        "DocAuthor","CDate","LastEditedBy","LastEditedOn","WDDate","WDBy","WDAttach","WDRemarks",
        "CurrentAction","PUR","MKT","RemTo","RemCC","ISG","RenStatus","RptNum","ProExec",
        "Department","ProTitle","Scope","CAR","Vendor","Name","Remarks","ReqName","ReqPosition",
        "ReqDate","CC","Required","AppRemarks","AppBy","Procurement","Corporate","Services",
        "Manager","AppDate","ReDate_1","ReComm_1","SDStatus","PONumber","SDRem","SDDate",
        "WDReason","CA","Title","Editor1","Editor2","Editor3","Editor4","Editor5","PURAdmin",
        "DefCC","PURHOD","ED","IT","INO","NextRemDate","Servers","ReadersNIU",
    ],
    "VENDAUDIREPO": [
        "VARNos","SendTo1","cc1","VendorName","Location","Purpose","Auditors","DateAudit",
        "Category","Product","ReqAttachment","ReqAttachment_1","ExpireDate","Rem1","PreparedDate",
        "SendTo2","cc2","RepAttachment1","RepAttachment1_1","RepAttachment1_2","RepAttachment1_3",
        "AttachedBy1","AttachedDate1","Reply1","Com1","Att1","ReplyDate1","RepliedBy1","QAApp1",
        "QACom1","Att1_1","AppBy1","AppDate1","Reply2","Com2","Att2","ReplyDate2","RepliedBy2",
        "QAApp2","QACom2","Att2_1","AppBy2","AppDate2","Reply3","Com3","Att3","ReplyDate3",
        "RepliedBy3","QAApp3","QACom3","Att3_1","AppBy3","AppDate3","DocAuthor","CreateDate",
    ],
    "VENDREGIVRF": [
        "Year","CategoryName","VendorName","Period","Year_1","ProductName","Site","Department",
        "IssueCategory","Desc","Attach","CC","PreparedBy","Designation","PreparedDate","NotNum",
        "Date","Comp","Name","Dept","VenName","Att","ACC","VenNo","VenNew","PurOrg",
        "FName","Phone","City","LName","Fax","State","FullName","Street","AcpName","AcpDate",
        "RejBy","RejDate","RejReason","RejBy_1","RejDate_1","RejReason_1","RejBy_2",
        "RejDate_2","RejReason_2","B2Name","B2Post","B2Date","FinName","FinPost","FinDate",
    ],
    "KOSHHALACERT": [
        "Category","Type","ProdName","Supplier","Manufacturer","Remarks","PreparedBy",
        "PreparedDate","LastEditBy","LastEditDate","CurrentAction","IT","PURAdmin","Editor",
        "PURPM","PURRM","PURPC","PURCCP","PURPCM","PURSFM","PUR","QA","RemDate",
    ],
    "MASTOFAPPR": [
        "ProdName","ItemCode","Category","Supplier","Manufacturer","ReachRegistered","IT","QA",
    ],
    "RSPOVALICHEC": [
        "FNO","Company","Year","Month","Suppliers","ExpDate","Status","PreName","PreDate",
        "PreDesg","PreRem","CA","IT","Editor1","INO",
    ],
    "VENDDIALREPO": [
        "txtObj","rTxtAttachImple","ISG","QAAdmin","QA","LP","Editor1","Editor2","PUR",
    ],
    "VENDCSRASSE": [
        "IssueNo","Type","ItemCode","ProName","BrandName","Supplier","Manufacturer","Category",
        "CC2","CC","Authors","Requestor","MGRACCESS","PUR","Obsolete","AEditor1","AEditor2",
        "SecApproval","RevDate","RemDate",
    ],
    "VENDQUALAPPR": [
        "ProdName","ItemCode","Category","PIC","CC","Supplier","Manufacturer","Period",
        "ExpiryDate","Attachment","IT","PUR","PURAdmin","Editor_1","Editor","Year",
        "CategoryName","VendorName","Period","Year_1","ProductName","Site","Department","HOD",
        "AppraisedBy","HODVerifiedBy","ApprDesignation","HODVerDesignation","AppraisedDate",
        "HODVerifiedDate","HODRejectedDate","PreparedBy","PurHODVerifiedBy","PreprDesignation",
        "PurDesignation","PreparedDate","PurHODVerifiedDate","WDBy","WDDate","WDReason",
    ],
}

def load_sp_data():
    with open(PROV, 'r', encoding='utf-8') as f:
        data = json.load(f)
    grouped = defaultdict(list)
    for item in data:
        fc = item.get('FormCode', '')
        if fc:
            grouped[fc].append(item)
    return dict(grouped)

def extract_pdf_text(pdf_path):
    """Extract all text from a PDF using PyMuPDF"""
    text = ""
    try:
        doc = fitz.open(str(pdf_path))
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
    except Exception as e:
        print(f"  ERROR reading {pdf_path.name}: {e}")
    return text

def extract_pdf_widgets(pdf_path):
    """Extract form widgets/fields from PDF"""
    widgets = []
    try:
        doc = fitz.open(str(pdf_path))
        for page in doc:
            for w in page.widgets():
                widgets.append({
                    'name': w.field_name or '',
                    'value': str(w.field_value or ''),
                    'type': w.field_type,
                    'page': page.number + 1,
                })
        doc.close()
    except Exception as e:
        pass
    return widgets

def normalize(s):
    """Normalize a string for comparison"""
    return re.sub(r'[^a-zA-Z0-9]', '', s).lower()

def find_field_in_text(text, field_name):
    """Check if a Domino field name appears in the PDF text"""
    norm = normalize(field_name)
    text_norm = normalize(text)
    return norm in text_norm

def audit_form(form_code, sp_fields, pdf_paths):
    """Audit one form: compare SP provisioning vs PDF source"""
    result = {
        'form_code': form_code,
        'expected': EXPECTED.get(form_code, '?'),
        'sp_data_count': len(sp_fields),
        'pdf_files': [p.name for p in pdf_paths],
        'pdf_widget_count': 0,
        'pdf_text_chars': 0,
        'field_matches': [],
        'field_missing_in_sp': [],
        'field_extra_in_sp': [],
        'type_mismatches': [],
        'choice_as_text': [],
        'number_as_text': [],
    }

    # Collect all PDF text
    all_text = ""
    all_widgets = []
    for p in pdf_paths:
        all_text += extract_pdf_text(p)
        all_widgets.extend(extract_pdf_widgets(p))

    result['pdf_text_chars'] = len(all_text)
    result['pdf_widget_count'] = len(all_widgets)

    # Get source fields from SOURCES.md
    src_fields = SOURCE_FIELDS.get(form_code, [])

    # Get SP SourceField values
    sp_src_fields = {f['SourceField'] for f in sp_fields if f.get('SourceField')}

    # Check each source field
    for sf in src_fields:
        in_sp = sf in sp_src_fields
        in_pdf = find_field_in_text(all_text, sf)
        if in_sp and in_pdf:
            result['field_matches'].append(sf)
        elif in_sp and not in_pdf:
            result['field_extra_in_sp'].append(sf)
        elif not in_sp and in_pdf:
            result['field_missing_in_sp'].append(sf)
        else:
            result['field_missing_in_sp'].append(f"{sf} (NOT IN SP OR PDF)")

    # Check type mismatches
    for f in sp_fields:
        src = f.get('SourceField', '')
        sp_type = f.get('Type', '')
        display = f.get('DisplayName', '')

        # Check if field should be Choice based on source
        src_info = get_source_type(form_code, src)
        if src_info and 'Choice' in src_info and sp_type == 'Text':
            result['choice_as_text'].append({'field': src, 'display': display})

        # Check if field should be Number
        if src_info and 'Number' in src_info and sp_type == 'Text':
            result['number_as_text'].append({'field': src, 'display': display})

    return result

def get_source_type(form_code, field_name):
    """Get the recommended type from SOURCES.md data"""
    choice_fields = {
        "VCAR2025": ["VCARCat","Type","VeriStatus","QAStatus","FINStatus","Category","NewStatus","NewStatus_1","CAStatus"],
        "NOTIOFCHAN": ["VCARCat","txtStatus1"],
        "MASTOFSERV": ["Service","ReminderStatus","RenStatus"],
        "TEND": ["Type","Category","Status","RenStatus","SDStatus"],
        "ECMRECOMATE": ["StatusApp2","StatusApp","StatusAppB","CompletionStatus"],
        "KOSHHALACERT": ["Category","Type"],
        "MASTOFAPPR": ["Category"],
        "RSPOVALICHEC": ["Status"],
        "VENDAUDIREPO": ["Category"],
        "VENDREGIVRF": ["IssueCategory","ACC","VenNew"],
        "VENDCSRASSE": ["Type","Category"],
        "VENDQUALAPPR": ["Category","CategoryName"],
        "MATEEVALMER": ["StatusApp","Status1","Status2","Status3","WDStatus"],
    }
    number_fields = {
        "ECMRECOMATE": ["Qty","SellingPrice","TotalPayment","Quantity"],
        "NOTIOFCHAN": ["TotalList","GetTotal","GetApp"],
        "VENDREGIVRF": ["Phone","Fax"],
        "RSPOVALICHEC": ["FNO"],
    }
    if form_code in choice_fields and field_name in choice_fields[form_code]:
        return "Choice/Text"
    if form_code in number_fields and field_name in number_fields[form_code]:
        return "Number/Text"
    return None

def main():
    print(f"\n{'='*80}")
    print(f"PUR SHAREPOINT LIST AUDIT - PDF SOURCE COMPARISON (PyMuPDF)")
    print(f"{'='*80}")
    print(f"Audit Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"PyMuPDF version: {fitz.__version__}")

    sp_data = load_sp_data()
    print(f"Loaded {len(sp_data)} FormCodes from provisioning JSON\n")

    pdf_base = BASE / "source" / "Project Iventories" / "extracted-embedded-pdfs" / "Penang"

    results = []
    for fc in sorted(PDF_MAP.keys()):
        pdf_paths = []
        for subfolder, fname in PDF_MAP[fc]:
            p = pdf_base / subfolder / fname
            if p.exists():
                pdf_paths.append(p)
            else:
                print(f"  WARNING: {p} not found")

        sp_fields = sp_data.get(fc, [])
        if not sp_fields:
            print(f"  WARNING: No SP data for {fc}")
            continue

        r = audit_form(fc, sp_fields, pdf_paths)
        results.append(r)

        # Print per-form
        match_pct = (len(r['field_matches']) / r['expected'] * 100) if isinstance(r['expected'], int) and r['expected'] > 0 else 0
        print(f"\n{'='*60}")
        print(f"  {fc}")
        print(f"  Expected fields: {r['expected']} | SP columns: {r['sp_data_count']}")
        print(f"  PDF files: {', '.join(r['pdf_files'])}")
        print(f"  PDF text: {r['pdf_text_chars']:,} chars | Widgets: {r['pdf_widget_count']}")
        print(f"  Field matches: {len(r['field_matches'])}/{r['expected']} ({match_pct:.0f}%)")

        if r['field_missing_in_sp']:
            print(f"  MISSING in SP ({len(r['field_missing_in_sp'])}): {', '.join(r['field_missing_in_sp'][:5])}")
        if r['field_extra_in_sp']:
            print(f"  EXTRA in SP (not in PDF text) ({len(r['field_extra_in_sp'])}): {', '.join(r['field_extra_in_sp'][:5])}")
        if r['choice_as_text']:
            print(f"  CHOICE stored as Text ({len(r['choice_as_text'])}): {', '.join([c['field'] for c in r['choice_as_text']])}")
        if r['number_as_text']:
            print(f"  NUMBER stored as Text ({len(r['number_as_text'])}): {', '.join([c['field'] for c in r['number_as_text']])}")

    # Summary table
    print(f"\n\n{'='*80}")
    print(f"SUMMARY TABLE")
    print(f"{'='*80}")
    print(f"{'FormCode':<16} {'Exp':>4} {'SP':>4} {'Match':>6} {'Miss':>5} {'Extra':>5} {'ChTxt':>5} {'NumTxt':>5} {'Widgets':>7} {'PDFText':>8}")
    print(f"{'-'*16} {'-'*4} {'-'*4} {'-'*6} {'-'*5} {'-'*5} {'-'*5} {'-'*5} {'-'*7} {'-'*8}")

    total_expected = 0
    total_sp = 0
    total_match = 0
    total_miss = 0
    total_extra = 0
    total_choice = 0
    total_number = 0

    for r in results:
        exp = r['expected'] if isinstance(r['expected'], int) else 0
        total_expected += exp
        total_sp += r['sp_data_count']
        total_match += len(r['field_matches'])
        total_miss += len(r['field_missing_in_sp'])
        total_extra += len(r['field_extra_in_sp'])
        total_choice += len(r['choice_as_text'])
        total_number += len(r['number_as_text'])

        match_pct = f"{len(r['field_matches'])}/{exp}" if exp else "?"
        print(f"{r['form_code']:<16} {exp:>4} {r['sp_data_count']:>4} {match_pct:>6} {len(r['field_missing_in_sp']):>5} {len(r['field_extra_in_sp']):>5} {len(r['choice_as_text']):>5} {len(r['number_as_text']):>5} {r['pdf_widget_count']:>7} {r['pdf_text_chars']:>8,}")

    print(f"{'-'*16} {'-'*4} {'-'*4} {'-'*6} {'-'*5} {'-'*5} {'-'*5} {'-'*5} {'-'*7} {'-'*8}")
    print(f"{'TOTALS':<16} {total_expected:>4} {total_sp:>4} {total_match:>6} {total_miss:>5} {total_extra:>5} {total_choice:>5} {total_number:>5}")

    print(f"\n{'='*80}")
    print(f"KEY FINDINGS")
    print(f"{'='*80}")
    print(f"  Total expected fields (from SOURCES.md): {total_expected}")
    print(f"  Total SP data columns provisioned:      {total_sp}")
    print(f"  Total field matches (in both SP + PDF): {total_match}")
    print(f"  Total missing from SP:                   {total_miss}")
    print(f"  Total extra in SP (not found in PDF):    {total_extra}")
    print(f"  Total Choice-as-Text type issues:        {total_choice}")
    print(f"  Total Number-as-Text type issues:        {total_number}")
    print(f"  PDF form widgets found across all PDFs:  {sum(r['pdf_widget_count'] for r in results)}")

    # Detailed missing fields
    print(f"\n{'='*80}")
    print(f"DETAILED MISSING/EXTRA FIELDS PER FORM")
    print(f"{'='*80}")
    for r in results:
        has_issues = r['field_missing_in_sp'] or r['field_extra_in_sp'] or r['choice_as_text'] or r['number_as_text']
        if has_issues:
            print(f"\n  {r['form_code']}:")
            if r['field_missing_in_sp']:
                print(f"    MISSING from SP provisioning:")
                for f in r['field_missing_in_sp']:
                    print(f"      - {f}")
            if r['field_extra_in_sp']:
                print(f"    EXTRA in SP (field name not found in PDF text):")
                for f in r['field_extra_in_sp']:
                    print(f"      - {f}")
            if r['choice_as_text']:
                print(f"    CHOICE stored as Text:")
                for c in r['choice_as_text']:
                    print(f"      - {c['field']} ({c['display']})")
            if r['number_as_text']:
                print(f"    NUMBER stored as Text:")
                for n in r['number_as_text']:
                    print(f"      - {n['field']} ({n['display']})")

    return results

if __name__ == "__main__":
    main()
