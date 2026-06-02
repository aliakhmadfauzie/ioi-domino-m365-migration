import html
import io
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd() / ".codex-docx-deps"))

from docx import Document
from docx.oxml.ns import qn
from docx.table import Table as DocxTable
from docx.text.paragraph import Paragraph as DocxParagraph
from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


INPUT = Path(r"C:\Users\aliak\Downloads\IOI_Dataverse_vs_SharePoint_Proposal_Strengthened.docx")
OUTPUT = Path(r"C:\Users\aliak\Downloads\IOI_Dataverse_vs_SharePoint_Proposal_Strengthened.pdf")


def iter_block_items(parent):
    body = parent.element.body
    for child in body.iterchildren():
        if child.tag == qn("w:p"):
            yield DocxParagraph(child, parent)
        elif child.tag == qn("w:tbl"):
            yield DocxTable(child, parent)


def para_text(paragraph):
    return "".join(run.text for run in paragraph.runs).strip()


def rel_ids_in_paragraph(paragraph):
    ids = []
    for blip in paragraph._p.xpath(".//a:blip"):
        rid = blip.get(qn("r:embed"))
        if rid:
            ids.append(rid)
    return ids


def add_image_flowable(story, part, rid, max_width):
    image_part = part.related_parts.get(rid)
    if not image_part:
        return
    data = image_part.blob
    with PILImage.open(io.BytesIO(data)) as im:
        width_px, height_px = im.size
    ratio = height_px / max(width_px, 1)
    width = max_width
    height = width * ratio
    story.append(Image(io.BytesIO(data), width=width, height=height))
    story.append(Spacer(1, 0.08 * inch))


def make_styles():
    base = getSampleStyleSheet()
    base.add(ParagraphStyle("CoverOrg", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=16, leading=20, alignment=TA_CENTER, textColor=colors.HexColor("#1F4D78"), spaceAfter=8))
    base.add(ParagraphStyle("CoverTitle", parent=base["Title"], fontName="Helvetica-Bold", fontSize=22, leading=26, alignment=TA_CENTER, textColor=colors.HexColor("#0B2545"), spaceAfter=12))
    base.add(ParagraphStyle("BodyTight", parent=base["BodyText"], fontName="Helvetica", fontSize=9.2, leading=12, spaceAfter=5))
    base.add(ParagraphStyle("H1Blue", parent=base["Heading1"], fontName="Helvetica-Bold", fontSize=15, leading=18, textColor=colors.HexColor("#1F4D78"), spaceBefore=12, spaceAfter=6))
    base.add(ParagraphStyle("H2Blue", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=colors.HexColor("#1F4D78"), spaceBefore=9, spaceAfter=4))
    base.add(ParagraphStyle("Caption", parent=base["Italic"], fontName="Helvetica-Oblique", fontSize=8.2, leading=10, alignment=TA_CENTER, textColor=colors.HexColor("#595959"), spaceAfter=7))
    return base


def style_for_paragraph(text, paragraph, styles):
    name = getattr(paragraph.style, "name", "") if paragraph.style else ""
    if text.startswith("SECTION ") or text.startswith("APPENDIX ") or text == "POST-BUILD TESTING POSITION":
        return styles["H1Blue"]
    if name.startswith("Heading 1"):
        return styles["H1Blue"]
    if name.startswith("Heading 2") or text in {
        "Why This Recommendation Matters",
        "Summary Position",
        "How the Lists Are Connected Today",
        "Full Rollout SharePoint List Projection",
        "Specific ITSSR Evidence",
        "SharePoint-to-Dataverse Mapping",
        "Implementation Principle",
    }:
        return styles["H2Blue"]
    if text.startswith("Figure ") or text.startswith("Table "):
        return styles["Caption"]
    if text in {"IOI OLEOCHEMICAL SDN BHD", "Lotus Domino to Microsoft Power Platform Migration"}:
        return styles["CoverOrg"]
    if text in {"TECHNICAL RECOMMENDATION", "Microsoft Dataverse as the Primary Data Layer", "A Case for Moving Beyond SharePoint Lists"}:
        return styles["CoverTitle"]
    return styles["BodyTight"]


def build_table(docx_table, max_width):
    data = []
    max_cols = max((len(row.cells) for row in docx_table.rows), default=0)
    if max_cols == 0:
        return None
    col_width = max_width / max_cols
    for row in docx_table.rows:
        cells = []
        for cell in row.cells:
            text = "\n".join(p.text.strip() for p in cell.paragraphs if p.text.strip())
            cells.append(Paragraph(html.escape(text), ParagraphStyle("Cell", fontName="Helvetica", fontSize=6.7, leading=8)))
        while len(cells) < max_cols:
            cells.append("")
        data.append(cells[:max_cols])
    table = Table(data, colWidths=[col_width] * max_cols, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E8EEF5")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1F4D78")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#A6A6A6")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return table


def main():
    docx = Document(INPUT)
    styles = make_styles()
    page_width, _ = letter
    max_width = page_width - 1.4 * inch
    story = []

    for block in iter_block_items(docx):
        if isinstance(block, DocxParagraph):
            for rid in rel_ids_in_paragraph(block):
                add_image_flowable(story, docx.part, rid, max_width=max_width)
            text = para_text(block)
            if not text:
                continue
            story.append(Paragraph(html.escape(text), style_for_paragraph(text, block, styles)))
            if text == "Prepared by: Ali Akhmad Fauzie  |  May 2026":
                story.append(PageBreak())
        elif isinstance(block, DocxTable):
            table = build_table(block, max_width)
            if table:
                story.append(table)
                story.append(Spacer(1, 0.12 * inch))

    pdf = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
        title="IOI Dataverse vs SharePoint Proposal",
    )
    pdf.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    main()
