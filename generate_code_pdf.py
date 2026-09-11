import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Preformatted
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 750, "3G Real-Time Communication System | Complete Standalone Source Code")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        self.line(54, 48, 558, 48)
        self.drawString(54, 36, "Standalone Executable HTML - Zero Dependencies")
        self.drawRightString(558, 36, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_code_pdf():
    pdf_filename = "3G_COMMUNICATION_SYSTEM_COMPLETE_CODE.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    with open("3G_COMMUNICATION_SYSTEM_STANDALONE.html", "r", encoding="utf-8") as f:
        code_lines = f.readlines()

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CodeTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=6
    )
    desc_style = ParagraphStyle(
        'CodeDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )

    story = [
        Paragraph("3G Communication System: Complete Source Code", title_style),
        Paragraph("File: <code>3G_COMMUNICATION_SYSTEM_STANDALONE.html</code> • Self-contained Single-File Executable Application (React 18, Tailwind CSS, Canvas Simulation, State Machine, QoS Queues, Soft Handover, and Capacity Calculator).", desc_style),
        Spacer(1, 10)
    ]

    # Chunk code into ~60 lines per page for clean rendering
    chunk_size = 62
    for i in range(0, len(code_lines), chunk_size):
        chunk = code_lines[i:i + chunk_size]
        formatted_chunk = []
        for line_num, line in enumerate(chunk, start=i + 1):
            formatted_chunk.append(f"{line_num:4d} | {line}")
        
        pre = Preformatted("".join(formatted_chunk), styles['Code'])
        pre.style.fontName = 'Courier'
        pre.style.fontSize = 6.2
        pre.style.leading = 7.8
        pre.style.textColor = colors.HexColor("#1e293b")
        story.append(pre)
        if i + chunk_size < len(code_lines):
            story.append(PageBreak())

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {pdf_filename}")

if __name__ == "__main__":
    build_code_pdf()
