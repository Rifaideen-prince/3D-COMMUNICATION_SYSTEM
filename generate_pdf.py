import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
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
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Running Header
        self.drawString(54, 750, "3G Communication System for Real-Time Applications | Mobile Video Surveillance")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)

        # Running Footer
        self.line(54, 48, 558, 48)
        self.drawString(54, 36, "Confidential - Academic Engineering Specification - UMTS / WCDMA FDD")
        self.drawRightString(558, 36, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename="DESIGN_OF_3G_COMMUNICATION_SYSTEM.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#0f172a") # Dark Slate
    accent_color = colors.HexColor("#0284c7")  # Cyan/Sky
    text_color = colors.HexColor("#1e293b")

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=primary_color,
        alignment=0
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#0369a1"),
        alignment=0
    )

    meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#475569")
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=20,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0369a1"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=text_color,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=text_color,
        leftIndent=12,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0f172a")
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # ==========================================
    # 1. COVER PAGE
    # ==========================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("TECHNICAL SPECIFICATION & ENGINEERING DESIGN", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=9, textColor=accent_color, spaceAfter=8)))
    story.append(Paragraph("Design of a 3G Communication System for Real-Time Applications", title_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Real-Time Mobile Video Surveillance & Emergency Monitoring", subtitle_style))
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=2, color=accent_color, spaceBefore=5, spaceAfter=20))

    meta_text = """
    <b>Domain:</b> Telecommunications Engineering & Mobile Wireless Networks<br/>
    <b>Standard:</b> 3GPP Universal Mobile Telecommunications System (UMTS Release 99/4/5)<br/>
    <b>Air Interface:</b> Wideband Code Division Multiple Access (WCDMA FDD, 3.84 Mcps)<br/>
    <b>Quality of Service:</b> 3GPP TS 23.107 Class-Based Priority Scheduling<br/>
    <b>Security Architecture:</b> 3GPP AKA Mutual Authentication & Kasumi/f8 Ciphering<br/>
    <b>Classification:</b> Academic Project & Educational System Model<br/>
    <b>Date of Issue:</b> September 2026
    """
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 30))

    exec_summary = """
    <b>EXECUTIVE SUMMARY:</b><br/>
    This engineering document presents the rigorous design, mathematical dimensioning, quality of service (QoS) prioritization, and operational protocol lifecycle of a 3rd Generation (3G) wireless communication system tailored specifically for mission-critical, delay-sensitive mobile video surveillance and emergency tactical monitoring. The end-to-end communication chain originates at a vehicle-mounted mobile camera user equipment (UE), traverses a WCDMA radio link to Node B, passes through the Radio Network Controller (RNC) for radio resource management and soft handover coordination, connects via the Serving and Gateway GPRS Support Nodes (SGSN/GGSN) of the 3G Packet Core, and routes across a secure IP network to centralized streaming servers and monitoring terminals.
    """
    story.append(Paragraph(exec_summary, ParagraphStyle('ExecSummary', parent=body_style, backColor=colors.HexColor("#f8fafc"), borderColor=colors.HexColor("#cbd5e1"), borderWidth=1, borderPadding=10, spaceAfter=20)))

    story.append(PageBreak())

    # ==========================================
    # 2. SYSTEM ARCHITECTURE & PATH
    # ==========================================
    story.append(Paragraph("1. System Architecture & End-to-End Communication Path", h1_style))
    story.append(Paragraph(
        "The proposed 3G system enables uninterrupted transmission of compressed digital video, two-way conversational audio, PTZ telemetry, and tactical emergency alarms from mobile patrol units to fixed central command consoles. The primary communication trajectory consists of seven functional blocks:",
        body_style
    ))

    arch_diagram = """
    [Mobile Camera Unit] ---> [Node B] ---> [Radio Network Controller (RNC)] ---> [3G Packet Core (SGSN/GGSN)]
            ---> [Private IP Network / Internet] ---> [Application / Streaming Server] ---> [Monitoring Terminal]
    """
    story.append(Paragraph(arch_diagram.strip(), ParagraphStyle('Diagram', parent=code_style, backColor=colors.HexColor("#f1f5f9"), borderPadding=8, spaceBefore=4, spaceAfter=10)))

    story.append(Paragraph("Functional Interface Specifications:", h2_style))
    story.append(Paragraph("• <b>Uu Radio Interface (UE to Node B):</b> WCDMA 2100 MHz FDD air interface employing direct-sequence spread spectrum (DSSS) with a 3.84 Mcps chip rate and 1500 Hz fast inner-loop power control.", bullet_style))
    story.append(Paragraph("• <b>Iub Interface (Node B to RNC):</b> Transports user data frames and physical layer control signaling via ATM AAL2/AAL5 or IP transport bearers.", bullet_style))
    story.append(Paragraph("• <b>Iu-PS Interface (RNC to 3G Packet Core):</b> Carries packet-switched user traffic (GTP-U tunnels) and Radio Access Network Application Part (RANAP) control signaling to the SGSN.", bullet_style))
    story.append(Paragraph("• <b>Gn / Gi Interface (Packet Core to IP Network):</b> Gn interface tunnels IP packets between SGSN and GGSN via GTP; Gi interface interfaces the GGSN to private IP routing infrastructure.", bullet_style))
    story.append(Paragraph("• <b>Private IP / VPN Transport:</b> Encapsulates streaming traffic across IPsec ESP (Encapsulating Security Payload) tunnels with AES-256 encryption.", bullet_style))
    story.append(Paragraph("• <b>Streaming Session Layer:</b> Employs RTSP (Real-Time Streaming Protocol) for session setup/control and RTP/UDP for low-latency media payload framing.", bullet_style))

    # ==========================================
    # 3. EQUIPMENT TABLE
    # ==========================================
    story.append(Paragraph("2. System Components & Equipment Inventory", h1_style))
    story.append(Paragraph("Table 1 summarizes all primary hardware and software modules comprising the complete system:", body_style))

    equip_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Operational Purpose</b>", body_style), Paragraph("<b>Technical Specifications</b>", body_style)],
        [Paragraph("IP Camera / Mobile Camera Unit", body_style), Paragraph("Captures optical video and ambient audio in moving surveillance patrol vehicles.", body_style), Paragraph("CMOS sensor, CIF (352x288) / QVGA, omni mic, Li-ion pack", body_style)],
        [Paragraph("Hardware Video Encoder", body_style), Paragraph("Compresses raw video frames to fit wireless bandwidth constraints.", body_style), Paragraph("H.264 Baseline Profile / MPEG-4 Part 2, 256 kbps target", body_style)],
        [Paragraph("3G Modem / User Equipment (UE)", body_style), Paragraph("Connects surveillance camera unit to cellular network over WCDMA RF.", body_style), Paragraph("UMTS Band 1 (2100 MHz), QPSK/16QAM, USIM AKA", body_style)],
        [Paragraph("Node B (Base Station)", body_style), Paragraph("Provides physical WCDMA RF layer connectivity and channel transceiver.", body_style), Paragraph("3.84 Mcps chip rate, 1500 Hz inner-loop power control", body_style)],
        [Paragraph("Radio Network Controller (RNC)", body_style), Paragraph("Manages radio resources, admission control, and seamless soft handover.", body_style), Paragraph("RRM algorithms, Active Set combining, QoS scheduler", body_style)],
        [Paragraph("3G Packet Core (SGSN/GGSN)", body_style), Paragraph("Authenticates subscribers, tracks mobility, routes IP packets via GTP.", body_style), Paragraph("3GPP AKA mutual auth, PDP Context activation, DiffServ", body_style)],
        [Paragraph("Application / Streaming Server", body_style), Paragraph("Ingests video streams, manages sessions, archives NVR recordings.", body_style), Paragraph("RTSP/RTP media server, low-latency jitter buffers", body_style)],
        [Paragraph("Monitoring Terminal / PC", body_style), Paragraph("Decodes compressed video in real time for control-room operators.", body_style), Paragraph("GPU hardware decode, PTZ controls, emergency strobe", body_style)]
    ]

    t_equip = Table(equip_data, colWidths=[110, 240, 154])
    t_equip.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_equip)
    story.append(Spacer(1, 10))

    story.append(PageBreak())

    # ==========================================
    # 4. QUALITY OF SERVICE (QoS) & TRAFFIC
    # ==========================================
    story.append(Paragraph("3. Quality of Service (QoS) & Traffic Prioritization", h1_style))
    story.append(Paragraph(
        "Surveillance video and two-way voice are delay-sensitive applications. If cell interference rises, unmanaged background data could induce severe packet jitter, bufferbloat, and visual stutter. To prevent stream degradation, the 3G communication system implements standardized 3GPP TS 23.107 QoS traffic classes:",
        body_style
    ))

    qos_data = [
        [Paragraph("<b>Traffic Class</b>", body_style), Paragraph("<b>Priority</b>", body_style), Paragraph("<b>Delay Tolerance</b>", body_style), Paragraph("<b>Example Application Data</b>", body_style)],
        [Paragraph("Conversational", body_style), Paragraph("<font color='#0284c7'><b>HIGH</b></font>", body_style), Paragraph("&lt; 100 ms", body_style), Paragraph("Two-way operator voice channel (AMR 12.2 kbps)", body_style)],
        [Paragraph("Streaming", body_style), Paragraph("<font color='#0284c7'><b>HIGH</b></font>", body_style), Paragraph("&lt; 150 ms", body_style), Paragraph("Live compressed camera video stream (256 kbps H.264)", body_style)],
        [Paragraph("Interactive", body_style), Paragraph("<font color='#d97706'><b>MEDIUM-HIGH</b></font>", body_style), Paragraph("&lt; 200 ms", body_style), Paragraph("PTZ steering commands, keepalives, signaling", body_style)],
        [Paragraph("Background", body_style), Paragraph("<font color='#64748b'><b>LOW</b></font>", body_style), Paragraph("Unconstrained", body_style), Paragraph("Diagnostic logs, firmware checks, archive sync", body_style)],
        [Paragraph("Emergency Alarm", body_style), Paragraph("<font color='#dc2626'><b>CRITICAL</b></font>", body_style), Paragraph("Immediate (&lt; 20 ms)", body_style), Paragraph("Distress beacon, perimeter tripwire trigger", body_style)]
    ]

    t_qos = Table(qos_data, colWidths=[100, 75, 95, 234])
    t_qos.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_qos)
    story.append(Spacer(1, 10))

    story.append(Paragraph("RNC Queueing & Scheduling Algorithm:", h2_style))
    story.append(Paragraph(
        "The RNC implements Strict Priority Queueing (SPQ) coupled with Deficit Weighted Round Robin (DWRR). Queue #1 (Critical/Conversational) is serviced before Queue #2 (Streaming), which in turn preempts Queue #3 (Background). When cellular cell loading spikes to CONGESTED levels, background packets are queued or intentionally dropped to shield guaranteed 256 kbps video frames from delay.",
        body_style
    ))

    # ==========================================
    # 5. CAPACITY DIMENSIONING
    # ==========================================
    story.append(Paragraph("4. Capacity Calculation & Network Dimensioning", h1_style))
    story.append(Paragraph(
        "Radio access dimensioning dictates how many simultaneous surveillance video streams a given cellular cell can host before interference causes call drops.",
        body_style
    ))

    story.append(Paragraph("Mathematical Formulation:", h2_style))
    story.append(Paragraph("<b>Total Application Traffic = Number of Cameras &times; Bitrate per Camera</b>", ParagraphStyle('Formula', parent=body_style, backColor=colors.HexColor("#f8fafc"), borderPadding=6)))

    story.append(Paragraph("Assignment Reference Case:", h2_style))
    story.append(Paragraph("• Bitrate per Camera = <b>256 kbps</b> (CIF resolution, 15–20 fps, H.264 Baseline Profile)", bullet_style))
    story.append(Paragraph("• Simultaneous Cameras = <b>20 units</b>", bullet_style))
    story.append(Paragraph("• Total Application Traffic = <b>20 &times; 256 kbps = 5,120 kbps = 5.12 Mbps</b>", bullet_style))
    story.append(Paragraph("• Protocol Overhead Factor = <b>1.05 (+5%)</b> for RTP (12B), UDP (8B), and IP (20B) header encapsulations", bullet_style))
    story.append(Paragraph("• Aggregate Uplink Throughput with Overhead = <b>5.38 Mbps</b>", bullet_style))

    disclaimer_text = """
    <b>MANDATORY ACADEMIC & ENGINEERING MARGINS DISCLAIMER:</b><br/>
    <i>\"This calculation is before protocol overhead and network engineering margins. The actual number of supported users depends on cell loading, radio conditions, bearer configuration, spectrum, operator network capacity and selected video quality.\"</i><br/>
    It must be noted that 5.12 Mbps represents the combined application-layer requirement across 20 cameras, not the maximum theoretical capacity of a single WCDMA radio bearer.
    """
    story.append(Paragraph(disclaimer_text, ParagraphStyle('Disc', parent=callout_style, backColor=colors.HexColor("#fffbeb"), borderColor=colors.HexColor("#fde68a"), borderWidth=1, borderPadding=8, spaceBefore=6, spaceAfter=10)))

    # ==========================================
    # 6. MOBILITY & SOFT HANDOVER
    # ==========================================
    story.append(Paragraph("5. Mobility Management & Seamless Soft Handover", h1_style))
    story.append(Paragraph(
        "Surveillance vehicles patrol dynamic geographic zones. In a 3G WCDMA network, handovers are inherently <b>soft</b> (make-before-break). As the patrol vehicle approaches the cell edge between Cell A and Cell B, the mobile UE reports increasing pilot signal strength (CPICH Ec/No) from Node B 2 to the RNC.",
        body_style
    ))
    story.append(Paragraph("• <b>Step 1 (Serving Cell A):</b> UE communicates exclusively with Node B 1 (SIR target maintained at -8.2 dB).", bullet_style))
    story.append(Paragraph("• <b>Step 2 (Cell Boundary Reached):</b> Crossover event detected; pilot signal of Node B 2 exceeds threshold.", bullet_style))
    story.append(Paragraph("• <b>Step 3 (Handover Initiated):</b> RNC adds Node B 2 to the UE Active Set. Downlink frames are transmitted from both base stations, and uplink signals are rake-received and combined at the RNC (macro-diversity).", bullet_style))
    story.append(Paragraph("• <b>Step 4 (Handover Successful):</b> Node B 1 signal fades below cutoff and is removed from the Active Set. Video streaming continues continuously with <b>0 dropped video frames</b>.", bullet_style))

    story.append(PageBreak())

    # ==========================================
    # 7. SECURITY & 3GPP AKA
    # ==========================================
    story.append(Paragraph("6. Security Architecture & 3GPP AKA Authentication", h1_style))
    story.append(Paragraph(
        "Unauthorized access to police or enterprise surveillance streams presents severe operational risks. The system implements end-to-end security:",
        body_style
    ))
    story.append(Paragraph("• <b>Mutual Authentication (3GPP AKA):</b> Challenge-response handshake utilizing RAND, AUTN, and RES verifies both the network's identity to the camera and the camera's USIM identity to the HLR/AuC, defeating IMSI-catcher attacks.", bullet_style))
    story.append(Paragraph("• <b>Air-Interface Confidentiality:</b> Traffic encrypted at the physical/RLC layer using the Kasumi/f8 ciphering algorithm with a 128-bit Cipher Key (CK).", bullet_style))
    story.append(Paragraph("• <b>Core Transport Protection:</b> GGSN traffic routes into an IPsec ESP VPN tunnel with AES-256 encryption, isolating video streams from public Internet routing.", bullet_style))
    story.append(Paragraph("• <b>Role-Based Access & Audit Trail:</b> Operator command sessions, PTZ overrides, and emergency events are logged to an append-only cryptographic audit database.", bullet_style))

    # ==========================================
    # 8. 7-STAGE OPERATION SEQUENCE
    # ==========================================
    story.append(Paragraph("7. Real-Time Operation Sequence (7 Stages)", h1_style))
    story.append(Paragraph("The standard operational lifecycle follows seven synchronized stages:", body_style))

    scenario_data = [
        [Paragraph("<b>Stage</b>", body_style), Paragraph("<b>Operational Event</b>", body_style), Paragraph("<b>Telecommunications Mechanism</b>", body_style)],
        [Paragraph("Stage 1", body_style), Paragraph("Camera Boot & Registration", body_style), Paragraph("UE attaches to Node B; performs 3GPP AKA; activates PDP context with dedicated IP.", body_style)],
        [Paragraph("Stage 2", body_style), Paragraph("Video Stream Inception", body_style), Paragraph("RTSP session initiated; RNC reserves guaranteed 256 kbps Streaming Radio Access Bearer.", body_style)],
        [Paragraph("Stage 3", body_style), Paragraph("Normal Patrol Movement", body_style), Paragraph("Vehicle navigates within Cell A; fast inner-loop power control operates at 1,500 Hz.", body_style)],
        [Paragraph("Stage 4", body_style), Paragraph("Cell Boundary & Handover", body_style), Paragraph("Make-before-break soft handover transfers connection to Cell B with 0 frame drops.", body_style)],
        [Paragraph("Stage 5", body_style), Paragraph("Cellular Congestion Event", body_style), Paragraph("RNC priority queues throttle background logs, preserving guaranteed video stream.", body_style)],
        [Paragraph("Stage 6", body_style), Paragraph("Emergency Alarm Trigger", body_style), Paragraph("Critical distress packet preempts radio buffer, triggering audio-visual operator strobe.", body_style)],
        [Paragraph("Stage 7", body_style), Paragraph("Session Conclusion", body_style), Paragraph("RTSP session teardown; radio resources deallocated; immutable audit log archived.", body_style)]
    ]

    t_scen = Table(scenario_data, colWidths=[65, 160, 279])
    t_scen.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_scen)
    story.append(Spacer(1, 10))

    # ==========================================
    # 9. 3G ADVANTAGES & LIMITATIONS
    # ==========================================
    story.append(Paragraph("8. Comparative Evaluation: 3G vs Modern 4G/5G", h1_style))
    story.append(Paragraph("<b>Advantages of 3G WCDMA:</b>", h2_style))
    story.append(Paragraph("• <b>Wide-Area Mobile Coverage:</b> Established global cellular topology supports long-range highway and rural surveillance.", bullet_style))
    story.append(Paragraph("• <b>Mobility Support:</b> Soft handover prevents stream freezing during vehicular speeds up to 120 km/h.", bullet_style))
    story.append(Paragraph("• <b>QoS-Enabled IP Architecture:</b> Natively routes standard RTP/UDP/IP protocols with delay prioritization.", bullet_style))

    story.append(Paragraph("<b>Engineering Limitations of 3G:</b>", h2_style))
    story.append(Paragraph("• <b>Modest Aggregate Capacity:</b> WCDMA 5 MHz carriers offer 2–14 Mbps aggregate cell throughput, far below LTE (100+ Mbps) or 5G (1+ Gbps).", bullet_style))
    story.append(Paragraph("• <b>Radio Quality Sensitivity:</b> Path loss at cell edges can force video encoders to drop resolution or framerates.", bullet_style))
    story.append(Paragraph("• <b>Power Consumption:</b> Uplink video transmission requires substantial RF amplifier battery power.", bullet_style))

    # ==========================================
    # 10. ACADEMIC REFERENCES
    # ==========================================
    story.append(Paragraph("9. Academic & Standard References", h1_style))
    refs = [
        "<b>3GPP TS 23.060:</b> <i>General Packet Radio Service (GPRS); Service description; Stage 2</i>, 3rd Generation Partnership Project.",
        "<b>3GPP TS 25.401:</b> <i>UTRAN Overall Description</i>, 3rd Generation Partnership Project.",
        "<b>3GPP TS 23.107:</b> <i>Quality of Service (QoS) concept and architecture</i>, 3rd Generation Partnership Project.",
        "<b>ITU-R Recommendation M.1457:</b> <i>Detailed specifications of the radio interfaces of IMT-2000</i>, International Telecommunication Union.",
        "<b>Holma, H. & Toskala, A. (2010):</b> <i>WCDMA for UMTS: HSPA Evolution and LTE (5th Edition)</i>, John Wiley & Sons."
    ]
    for r in refs:
        story.append(Paragraph(r, ParagraphStyle('Ref', parent=body_style, leftIndent=12, spaceAfter=4)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    build_pdf()
