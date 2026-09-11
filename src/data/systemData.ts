import type { NetworkNodeData } from '../types/system';

export const SYSTEM_NODES: NetworkNodeData[] = [
  {
    id: 'camera-unit',
    name: 'Mobile Camera Unit',
    shortName: 'Mobile Camera',
    subtitle: 'Edge Capture & 3G UE',
    category: 'User Equipment',
    status: 'READY',
    purpose: 'Captures raw high-definition video and ambient audio, compresses the media into optimized digital streams, and transmits via 3G modem.',
    functions: [
      'Visual & audio sensor acquisition (Camera sensor & directional mic)',
      'Hardware video encoding (H.264 Baseline Profile / MPEG-4 Part 2)',
      'Packetization into RTP/UDP/IP payloads',
      '3G/WCDMA User Equipment (UE) modem transmission',
      'Power management via internal high-capacity battery'
    ],
    dataHandled: 'Raw uncompressed video frames (RGB/YUV), compressed video bitstream (256 kbps baseline), encoded audio packets, telemetry & GPS metadata.',
    roleInRealTime: 'Originates delay-sensitive video, audio, and emergency alarm packets. Controls encoder bitrates based on radio channel feedback.',
    subComponents: ['Optical Lens & CCD/CMOS Sensor', 'Omni Microphone', 'Hardware Video Encoder', '3G WCDMA Modem (UE)', 'Li-ion Battery Pack'],
    protocols: ['H.264 / AVC', 'AMR Voice Codec', 'RTP / RTCP', '3GPP RRC (Radio Resource Control)'],
    specs: {
      'Default Bitrate': '256 kbps',
      'Resolution': 'CIF (352 × 288) / QVGA (320 × 240)',
      'Frame Rate': '15 - 25 fps',
      'RF Modulation': 'QPSK / 16QAM (WCDMA Uplink)'
    }
  },
  {
    id: 'node-b',
    name: 'Node B (Base Station)',
    shortName: 'Node B',
    subtitle: 'WCDMA Radio Access',
    category: 'Radio Access Network',
    status: 'READY',
    purpose: 'Provides physical WCDMA radio layer connectivity between mobile camera units and the fixed terrestrial radio network.',
    functions: [
      'WCDMA radio frequency transmission and reception (5 MHz carrier)',
      'Spreading and despreading using orthogonal channelization codes (OVSF)',
      'Inner-loop fast power control (1,500 Hz slot rate)',
      'Air interface modulation, demodulation, and channel coding',
      'Physical layer measurements (CPICH Ec/No, RSSI, SIR)'
    ],
    dataHandled: 'Air interface radio frames, WCDMA chip-level symbols (3.84 Mcps), dedicated physical channels (DPCH/PRACH).',
    roleInRealTime: 'Ensures reliable low-latency wireless transmission over the wireless link and monitors instantaneous channel fading.',
    subComponents: ['Radio Transceiver (TRX)', 'Power Amplifiers', 'Duplexer & Antennas', 'Baseband DSP Unit', 'Iub Interface Unit'],
    protocols: ['WCDMA FDD 2.1 GHz', 'Iub Interface (Node B ↔ RNC)', 'ATM / IP Transport'],
    specs: {
      'Chip Rate': '3.84 Mcps',
      'Carrier Bandwidth': '5 MHz',
      'Power Control': '1,500 Hz (Fast inner-loop)',
      'Duplexing': 'FDD (Frequency Division Duplex)'
    }
  },
  {
    id: 'rnc',
    name: 'Radio Network Controller (RNC)',
    shortName: 'RNC',
    subtitle: 'Radio Resource Management',
    category: 'Radio Access Network',
    status: 'READY',
    purpose: 'Governs all radio resources across multiple Node Bs, coordinates seamless handovers, and manages admission control.',
    functions: [
      'Radio Resource Management (RRM) & dynamic channel allocation',
      'Soft handover and harder handover control between cells',
      'Admission control for new real-time voice and video sessions',
      'Outer-loop power control and packet scheduling',
      'Radio Link Control (RLC) and MAC layer multiplexing',
      'Radio Access Bearer (RAB) establishment and QoS mapping'
    ],
    dataHandled: 'RLC protocol data units (PDUs), radio signaling messages (NBAP, RRC, RANAP), user payload frames over Iub/Iu-PS.',
    roleInRealTime: 'Critical brain of the radio network: prioritizes real-time media streams and executes seamless soft handover without dropping surveillance video.',
    subComponents: ['Call Control Processor', 'Frame Processing Unit', 'ATM/IP Switch Fabric', 'Iub/Iur/Iu Interface Processors'],
    protocols: ['RANAP (Iu-PS)', 'NBAP (Iub)', 'RRC (Air interface)', 'RLC / MAC'],
    specs: {
      'Handover Mechanism': 'Seamless Soft Handover (Active Set)',
      'QoS Scheduling': 'Strict Priority & Weighted Fair Queueing',
      'Interface to Core': 'Iu-PS (Packet-Switched)'
    }
  },
  {
    id: 'packet-core',
    name: '3G Packet Core (SGSN / GGSN)',
    shortName: '3G Packet Core',
    subtitle: 'Serving & Gateway GPRS Nodes',
    category: 'Core Network',
    status: 'READY',
    purpose: 'Performs packet-switched routing, subscriber authentication, mobility management, and QoS enforcement.',
    functions: [
      'SGSN: Mobility management, location tracking, and logical link control',
      'GGSN: Gateway to external IP networks, IP address allocation (DHCP/Radius)',
      '3GPP AKA mutual subscriber authentication and cryptographic ciphering',
      'Packet Data Protocol (PDP) context activation & management',
      'Differentiated Services (DiffServ) QoS tagging & traffic policing'
    ],
    dataHandled: 'GTP-U (GPRS Tunneling Protocol User plane) tunnels, IP packets, charging records (CDRs), subscriber credentials.',
    roleInRealTime: 'Enforces end-to-end QoS, maintains IP address persistence during cross-RNC mobility, and blocks unauthorized camera connections.',
    subComponents: ['SGSN (Serving GPRS Support Node)', 'GGSN (Gateway GPRS Support Node)', 'HLR/AuC Database Connector', 'GTP Engine'],
    protocols: ['GTP-U / GTP-C', 'Iu-PS Interface', 'Gn Interface', 'Gi Interface (IP Gateway)'],
    specs: {
      'Authentication': '3GPP AKA (Mutual Authentication)',
      'Tunneling': 'GTP (GPRS Tunneling Protocol)',
      'QoS Classes': 'Conversational, Streaming, Interactive, Background'
    }
  },
  {
    id: 'private-ip',
    name: 'Private IP Network / Internet',
    shortName: 'Private IP Network',
    subtitle: 'Secure Core Transport',
    category: 'Transport',
    status: 'READY',
    purpose: 'Transports routed IP packets securely across private leased lines or encrypted VPN tunnels to the application server.',
    functions: [
      'IP packet routing and high-speed multi-gigabit switching',
      'IPsec VPN tunneling for end-to-end data confidentiality',
      'DiffServ / MPLS Traffic Engineering (QoS preservation)',
      'Firewall filtering and perimeter security defense'
    ],
    dataHandled: 'Encapsulated IPsec ESP packets, RTP/RTCP surveillance video streams, RTSP signaling messages.',
    roleInRealTime: 'Maintains bounded latency and low packet loss across the wide area network, shielding streams from public internet congestion.',
    subComponents: ['Edge Routers', 'IPsec VPN Concentrator', 'Next-Gen Firewall', 'Optical Backbone Links'],
    protocols: ['IPv4 / IPv6', 'IPsec (ESP, IKEv2)', 'DiffServ / DSCP (EF, AF41, BE)', 'BGP / OSPF'],
    specs: {
      'Encryption': 'AES-256 / SHA-256 (IPsec)',
      'Latency Target': '< 40 ms terrestrial transport',
      'Jitter': '< 5 ms'
    }
  },
  {
    id: 'app-server',
    name: 'Application / Streaming Server',
    shortName: 'Streaming Server',
    subtitle: 'Session & Media Gateway',
    category: 'Application',
    status: 'READY',
    purpose: 'Terminates camera streaming sessions, distributes live feeds to authorized monitoring terminals, and records footage.',
    functions: [
      'RTSP/SIP session initiation, teardown, and heartbeat monitoring',
      'RTP media packet ingestion and jitter buffer smoothing',
      'Stream fan-out and re-transmission to multiple operator consoles',
      'Emergency alarm processing, notification dispatch, and event logging',
      'High-reliability NVR (Network Video Recording) storage archiving'
    ],
    dataHandled: 'Inbound RTP streams, outbound replicated unicast/multicast streams, RTSP commands, alarm event webhooks.',
    roleInRealTime: 'Acts as the central relay point for real-time monitoring; detects packet drop and triggers rapid rate adaptation.',
    subComponents: ['RTSP/RTMP Media Server', 'Session Controller', 'Event Dispatch Engine', 'Storage Controller (NVR)'],
    protocols: ['RTSP', 'RTP / RTCP', 'WebSocket', 'HTTPS / TLS'],
    specs: {
      'Stream Latency': 'Buffer latency 50 - 150 ms',
      'Concurrency': 'Multi-camera ingestion',
      'Alarm Dispatch': '< 20 ms internal latency'
    }
  },
  {
    id: 'monitoring-terminal',
    name: 'Monitoring Terminal / Center',
    shortName: 'Monitoring Console',
    subtitle: 'Operator Display & PTZ Control',
    category: 'Terminal',
    status: 'READY',
    purpose: 'Decodes compressed video in real time, displays live surveillance feeds to control-room operators, and facilitates emergency command.',
    functions: [
      'Hardware-accelerated H.264/MPEG-4 video decoding',
      'Low-latency multi-channel surveillance matrix display',
      'Audio playback and two-way voice channel to mobile unit',
      'Camera PTZ (Pan/Tilt/Zoom) control commands transmission',
      'Emergency alert audio-visual popups and operator dispatch interface'
    ],
    dataHandled: 'Decoded video frames, audio samples, operator control commands, real-time diagnostic telemetry.',
    roleInRealTime: 'Final consumer of the surveillance stream and origin of operator commands. Requires ultra-low end-to-end latency for responsive monitoring.',
    subComponents: ['Workstation GPU Decoder', 'Ultra-Wide Operator Displays', 'PTZ Joystick Controller', 'Audio Headset / Intercom'],
    protocols: ['RTSP Client', 'RTP Decoder', 'Pelco-D / ONVIF Control', 'HTTPS'],
    specs: {
      'Glass-to-Glass Latency': '180 - 350 ms end-to-end target',
      'Display Output': 'Full 1080p/4K multi-view',
      'Alarm Notification': 'Instant audible/visual strobe'
    }
  }
];

export const EQUIPMENT_TABLE = [
  {
    component: 'IP Camera / Mobile Camera Unit',
    purpose: 'Capture video and audio at mobile locations, vehicles, or portable field stations.',
    specs: 'Lens, sensor, microphone, battery unit, integrated telemetry'
  },
  {
    component: 'Video Encoder',
    purpose: 'Compress media for wireless transmission to fit 3G bandwidth constraints.',
    specs: 'H.264 Baseline Profile / MPEG-4 Part 2, target 256 kbps'
  },
  {
    component: '3G Modem / User Equipment (UE)',
    purpose: 'Connect camera to 3G network over WCDMA radio interface.',
    specs: 'UMTS FDD Band 1 (2100 MHz), QPSK/16QAM, USIM authentication'
  },
  {
    component: 'Node B (Radio Base Station)',
    purpose: 'Provide WCDMA radio connectivity and physical layer transmission.',
    specs: '3.84 Mcps chip rate, fast inner-loop power control at 1500 Hz'
  },
  {
    component: 'Radio Network Controller (RNC)',
    purpose: 'Manage radio resources, admission control, and seamless mobility/handover.',
    specs: 'RRM algorithms, Active Set soft handover, RAB QoS mapping'
  },
  {
    component: '3G Packet Core (SGSN / GGSN)',
    purpose: 'Authentication, mobility support, and IP packet transport with QoS enforcement.',
    specs: '3GPP AKA, PDP Context activation, GTP tunneling, DiffServ policing'
  },
  {
    component: 'Application / Streaming Server',
    purpose: 'Manage sessions, ingest streams, and distribute video to authorized terminals.',
    specs: 'RTSP/RTP media server, session control, alarm dispatch, NVR archiving'
  },
  {
    component: 'Monitoring PC / Display Terminal',
    purpose: 'Decode and display live video for control-room operators and command staff.',
    specs: 'GPU hardware decode, multi-view display, PTZ controls, alarm strobe'
  }
];

export const APPLICATION_REQUIREMENTS = [
  {
    label: 'Target Application',
    value: 'Real-time mobile video surveillance and emergency monitoring',
    details: 'Continuous remote surveillance of mobile patrols, emergency response vehicles, and security assets.'
  },
  {
    label: 'Primary Users',
    value: 'Mobile camera units, control-room operators, field personnel',
    details: 'Coordinated operational personnel requiring synchronized audio-visual awareness.'
  },
  {
    label: 'Traffic Types',
    value: 'Live compressed video + audio + control messages + alarms',
    details: 'Mixed media consisting of high-throughput video, conversational audio, and sporadic high-priority alarm signalling.'
  },
  {
    label: 'Latency Target',
    value: 'Preferably low enough for interactive monitoring (< 350 ms)',
    details: 'Interactive control of cameras and rapid tactical response to emergency incidents.'
  },
  {
    label: 'Availability Requirement',
    value: 'Continuous coverage with mobility and handover support',
    details: 'Unbroken live video feed as patrol vehicles navigate across cellular coverage areas.'
  },
  {
    label: 'Security Requirements',
    value: 'Subscriber authentication, confidentiality, access control, audit logs',
    details: '3GPP AKA mutual authentication, air-interface encryption, IPsec VPN core transport, role-based operator access.'
  },
  {
    label: 'QoS Architecture',
    value: 'Priority for real-time media and alarms over background data',
    details: 'Strict priority queueing and admission control to prevent non-critical traffic from stalling surveillance.'
  }
];

export const ADVANTAGES_LIMITATIONS = {
  advantages: [
    {
      title: 'Wide-Area Mobile Coverage',
      desc: 'Extensive cellular infrastructure allows surveillance units to operate throughout metropolitan, suburban, and rural highways.'
    },
    {
      title: 'Suitable for Moving Users and Vehicles',
      desc: 'Seamless handover protocols enable high-speed patrol vans and airborne assets to stream without manual reconnection.'
    },
    {
      title: 'Packet Services Support IP-Based Multimedia',
      desc: 'UMTS packet-switched core (SGSN/GGSN) natively routes standard IP protocols (RTP, UDP, RTSP, HTTPS).'
    },
    {
      title: 'Mobility and Handover Maintain Connectivity',
      desc: 'WCDMA soft handover (make-before-break) prevents packet burst loss and stream freezing across cell boundaries.'
    },
    {
      title: 'QoS Prioritization for Delay-Sensitive Traffic',
      desc: 'Standardized 3GPP QoS traffic classes ensure live video, audio, and emergency alarms override background telemetry.'
    },
    {
      title: 'Standard IP Server & Terminal Integration',
      desc: 'Connects effortlessly to standard video management software (VMS), RTSP media gateways, and commercial displays.'
    }
  ],
  limitations: [
    {
      title: 'Substantially Less Capacity Than Modern 4G/5G',
      desc: '3G WCDMA carrier bandwidth (5 MHz) offers modest aggregate cell throughput (several Mbps) compared to 100+ Mbps in LTE/5G.'
    },
    {
      title: 'Video Quality Highly Dependent on Radio Conditions',
      desc: 'Adverse path loss, deep shadowing, and cell-edge interference can force video encoding down to low bitrates and frame drops.'
    },
    {
      title: 'Latency & Packet Loss Increase Under Heavy Congestion',
      desc: 'When cell interference rises near pole capacity, packet re-transmissions cause jitter and noticeable video latency.'
    },
    {
      title: 'High Power Consumption for Mobile Transmitters',
      desc: 'Continuous uplink video encoding and RF transmission demand substantial battery power from portable surveillance gear.'
    },
    {
      title: '4G/5G More Suitable for Large-Scale Deployments',
      desc: 'Contemporary city-wide surveillance fleets require the massive throughput, MIMO, and ultra-low latency of 4G LTE and 5G NR.'
    }
  ]
};

export const TECH_PRIMER = [
  {
    term: '3G (Third Generation)',
    definition: 'International mobile telecommunications standard (IMT-2000) that introduced packet-switched mobile broadband and multimedia services.'
  },
  {
    term: 'WCDMA (Wideband Code Division Multiple Access)',
    definition: 'The primary 3G air interface technology using 5 MHz wide radio carriers and direct-sequence spread spectrum with 3.84 Mcps chip rate.'
  },
  {
    term: 'UMTS (Universal Mobile Telecommunications System)',
    definition: 'The 3GPP successor standard to GSM, integrating UTRAN radio access with an evolved GPRS packet-switched core.'
  },
  {
    term: 'UTRAN (UMTS Terrestrial Radio Access Network)',
    definition: 'The radio sub-network architecture consisting of Node Bs (base stations) and RNCs (Radio Network Controllers).'
  },
  {
    term: 'Node B',
    definition: 'The 3G radio base station providing physical layer RF transceiver capabilities and rapid 1500 Hz inner-loop power control.'
  },
  {
    term: 'RNC (Radio Network Controller)',
    definition: 'The intelligent controller governing radio resource allocation, admission control, code assignment, and handover execution.'
  },
  {
    term: 'Packet-Switched Core (SGSN / GGSN)',
    definition: 'Core network nodes routing IP packets directly between the mobile camera unit and external data networks without circuit reservation.'
  },
  {
    term: '3GPP QoS Classes',
    definition: 'Four standardized traffic classes: Conversational (lowest delay, e.g. audio), Streaming (e.g. video), Interactive (control), and Background (logs).'
  },
  {
    term: 'Soft Handover',
    definition: 'A make-before-break handover in WCDMA where the mobile camera is simultaneously connected to two or more Node Bs, selecting the best signal.'
  },
  {
    term: '3GPP AKA (Authentication & Key Agreement)',
    definition: 'Cryptographic challenge-response mutual authentication protocol between the camera USIM card and the core network HLR/AuC.'
  }
];

export const ACADEMIC_REFERENCES = [
  {
    standard: '3GPP TS 23.060',
    title: 'General Packet Radio Service (GPRS); Service description; Stage 2',
    publisher: '3rd Generation Partnership Project (3GPP)',
    notes: 'Defines SGSN/GGSN packet routing, PDP context establishment, and mobility management procedures.'
  },
  {
    standard: '3GPP TS 25.401',
    title: 'UTRAN Overall Description',
    publisher: '3rd Generation Partnership Project (3GPP)',
    notes: 'Details Node B and RNC architectural responsibilities, Iub/Iu-PS interfaces, and radio resource management.'
  },
  {
    standard: '3GPP TS 23.107',
    title: 'Quality of Service (QoS) concept and architecture',
    publisher: '3rd Generation Partnership Project (3GPP)',
    notes: 'Standardizes the four UMTS QoS traffic classes (Conversational, Streaming, Interactive, Background).'
  },
  {
    standard: 'ITU-R Recommendation M.1457',
    title: 'Detailed specifications of the radio interfaces of International Mobile Telecommunications-2000 (IMT-2000)',
    publisher: 'International Telecommunication Union (ITU-R)',
    notes: 'International regulatory baseline defining WCDMA FDD as an approved IMT-2000 3G standard.'
  },
  {
    standard: 'Holma, H. & Toskala, A. (2010)',
    title: 'WCDMA for UMTS: HSPA Evolution and LTE (5th Edition)',
    publisher: 'John Wiley & Sons',
    notes: 'Foundational textbook on radio access engineering, soft handover mechanisms, and uplink capacity.'
  }
];
