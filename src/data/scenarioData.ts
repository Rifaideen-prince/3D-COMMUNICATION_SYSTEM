import type { ScenarioStep } from '../types/system';

export const SCENARIO_STEPS: ScenarioStep[] = [
  {
    stepNumber: 1,
    title: 'Camera Boot & 3G UE Registration',
    subtitle: 'Step 1: Network Attachment & PDP Context',
    description: 'The mobile surveillance camera powers on. Its internal 3G modem registers with Node B, performs 3GPP AKA mutual authentication with the 3G Packet Core, and activates a Packet Data Protocol (PDP) context for IP connectivity.',
    systemAction: 'UE Registration → 3GPP AKA Authentication → PDP Context Established',
    expectedState: 'CONNECTED',
    logMessage: 'UE registered with Node B; PDP context activated with IP 10.240.18.42',
    durationMs: 4000
  },
  {
    stepNumber: 2,
    title: 'Video Stream Start & QoS Reservation',
    subtitle: 'Step 2: Radio Access Bearer Allocation',
    description: 'The camera initiates an RTSP session with the Application Streaming Server. The RNC allocates a high-priority Streaming Radio Access Bearer (RAB) with guaranteed bitrate of 256 kbps to support delay-sensitive video frames.',
    systemAction: 'RTSP Setup → RAB Allocation (256 kbps) → Video Encoding Activated',
    expectedState: 'STREAMING',
    logMessage: 'RAB established (Guaranteed 256 kbps); RTSP video streaming commenced',
    durationMs: 4500
  },
  {
    stepNumber: 3,
    title: 'Normal Mobile Patrol & Link Maintenance',
    subtitle: 'Step 3: Stable Wireless Operation',
    description: 'The surveillance vehicle navigates within Cell A. Node B and UE perform fast inner-loop power control at 1,500 Hz to combat Rayleigh fading and maintain optimal signal-to-interference ratio (SIR).',
    systemAction: 'Power Control (1500 Hz) → Continuous Media Uplink → Telemetry Synced',
    expectedState: 'MOVING',
    logMessage: 'Patrol unit moving within Cell A; SIR target satisfied at -8.2 dB Ec/No',
    durationMs: 4000
  },
  {
    stepNumber: 4,
    title: 'Cell Boundary Reached & Seamless Handover',
    subtitle: 'Step 4: WCDMA Soft Handover Execution',
    description: 'The vehicle approaches the cell edge between Cell A and Cell B. The RNC detects increasing pilot signal strength from Node B 2 and performs a make-before-break soft handover, transferring the stream seamlessly without dropping video.',
    systemAction: 'Active Set Update → Node B 2 Added → Handover Completed',
    expectedState: 'HANDOVER',
    logMessage: 'Soft handover successful: Cell A → Cell B (0 dropped video frames)',
    durationMs: 4500
  },
  {
    stepNumber: 5,
    title: 'Network Congestion & QoS Traffic Protection',
    subtitle: 'Step 5: Differentiated Traffic Prioritization',
    description: 'Heavy background data bursts occur across the cellular cell. The RNC and Packet Core enforce strict priority queuing: low-priority telemetry packets are buffered/throttled while real-time surveillance video and audio pass without delay.',
    systemAction: 'Congestion Detected → Priority Queue Active → Real-time Streams Shielded',
    expectedState: 'CONGESTED',
    logMessage: 'QoS priority queuing active: Video/Audio protected; background data queued',
    durationMs: 4500
  },
  {
    stepNumber: 6,
    title: 'Emergency Alarm Trigger & Expedited Dispatch',
    subtitle: 'Step 6: Critical Event Preemption',
    description: 'An emergency alert is tripped on the mobile patrol unit. An ALARM packet is stamped with CRITICAL priority, instantly preempting all normal traffic in the RNC queue and alerting the central monitoring console within milliseconds.',
    systemAction: 'Emergency Button → High-Priority Alarm Packet → Operator Strobe Alert',
    expectedState: 'EMERGENCY',
    logMessage: '🚨 CRITICAL: Emergency alarm received from CAMERA-01 (Priority: HIGH)',
    durationMs: 5000
  },
  {
    stepNumber: 7,
    title: 'Session Teardown & Secure Audit Archiving',
    subtitle: 'Step 7: Resource Release & Audit Logging',
    description: 'The operator concludes the emergency mission. The RTSP session closes cleanly, the RNC deallocates the radio bearer back to the pool, and an encrypted audit log of the mission is committed to the central server.',
    systemAction: 'Session Teardown → RAB Deallocation → Security Audit Committed',
    expectedState: 'SESSION_END',
    logMessage: 'Mission concluded; radio bearer released; secure audit log archived',
    durationMs: 4000
  }
];
