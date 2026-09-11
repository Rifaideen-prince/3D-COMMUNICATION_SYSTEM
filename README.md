# 3G Real-Time Communication System for Mobile Surveillance & Emergency Monitoring

An interactive educational simulation and telecommunications engineering dashboard modeling the end-to-end architecture and protocol flow of a third-generation (3G) wireless network:

$$\text{Mobile Camera Unit} \longrightarrow \text{Node B} \longrightarrow \text{RNC} \longrightarrow \text{3G Packet Core} \longrightarrow \text{Private IP Network} \longrightarrow \text{Application Server} \longrightarrow \text{Monitoring Terminal}$$

---

## 📡 Project Overview

- **Topic**: Design of a 3G Communication System for Real-Time Applications
- **Primary Use Case**: Real-Time Mobile Video Surveillance and Emergency Monitoring
- **Architecture Standard**: 3GPP UMTS Release 99/4/5 with WCDMA FDD (3.84 Mcps chip rate)
- **Quality of Service (QoS)**: Prioritization of delay-sensitive conversational/streaming video (256 kbps H.264) and emergency alarms over best-effort background data
- **Mobility**: WCDMA soft handover (make-before-break Active Set update) across 3 cellular cells (`Cell A`, `Cell B`, `Cell C`)
- **Security**: 3GPP AKA mutual subscriber authentication, Kasumi/f8 air-interface ciphering, and IPsec VPN transport

---

## 🚀 Key Features

1. **Interactive Network Architecture Topology**: 7 interconnected nodes with animated packets labeled `VIDEO`, `AUDIO`, `CONTROL`, `ALARM`, and `BACKGROUND` traveling across all 6 physical and logical interfaces.
2. **Live Surveillance Command Center**: Simulated video canvas with tracking crosshairs, target bounding boxes, Day/Night & Thermal Infrared (IR) modes, and real-time telemetry HUD.
3. **QoS & Priority Queue Simulator**: Priority buffer visualizer, strict preemption scheduler, congestion slider, and dynamic admission control rejection when capacity is exceeded.
4. **Mobility & Soft Handover Simulation**: Visual 3-cell corridor with a moving patrol van, signal crossover tracking, and uninterrupted video delivery.
5. **Capacity Dimensioning Calculator**: Interactive formula calculator based on the $20 \times 256\text{ kbps} = 5.12\text{ Mbps}$ assignment baseline, with protocol overhead analysis and engineering margin disclaimers.
6. **3GPP AKA Security & Audit Trail**: Visual authentication sequence and an immutable security audit log.
7. **Real-Time Operation Sequence**: Automated 7-stage scenario runner (`RUN FULL SCENARIO`) with playback controls (1x / 2x).
8. **Telemetry & Live Charts**: Area charts for throughput over time and line charts for latency and packet loss.
9. **Technical Specs & Literature**: Component inventory table, application requirements matrix, 3G vs 4G/5G analysis, and verified 3GPP/ITU citations.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Rifaideen-prince/3D-COMMUNICATION_SYSTEM.git
   cd 3D-COMMUNICATION_SYSTEM
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📚 Academic References

- **3GPP TS 23.060**: *General Packet Radio Service (GPRS); Service description; Stage 2*
- **3GPP TS 25.401**: *UTRAN Overall Description*
- **3GPP TS 23.107**: *Quality of Service (QoS) concept and architecture*
- **ITU-R Recommendation M.1457**: *Detailed specifications of the radio interfaces of IMT-2000*
- **Holma & Toskala**: *WCDMA for UMTS: HSPA Evolution and LTE*, John Wiley & Sons

---

## 📄 License
MIT License
