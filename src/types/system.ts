export type SystemState =
  | 'IDLE'
  | 'READY'
  | 'REGISTERING'
  | 'AUTHENTICATING'
  | 'CONNECTED'
  | 'STREAMING'
  | 'MOVING'
  | 'HANDOVER'
  | 'CONGESTED'
  | 'EMERGENCY'
  | 'SESSION_END';

export type PacketType = 'VIDEO' | 'AUDIO' | 'CONTROL' | 'ALARM' | 'BACKGROUND';

export type PriorityLevel = 'HIGH' | 'LOW' | 'CRITICAL';

export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CONGESTED';

export type SignalQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export interface Packet {
  id: string;
  type: PacketType;
  priority: PriorityLevel;
  sizeKb: number;
  currentLink: number; // 0 to 5
  progress: number;    // 0 to 1
  sourceNodeId: string;
  targetNodeId: string;
  color: string;
  label: string;
  isEmergency?: boolean;
}

export interface NetworkNodeData {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  category: 'User Equipment' | 'Radio Access Network' | 'Core Network' | 'Transport' | 'Application' | 'Terminal';
  status: 'OFFLINE' | 'READY' | 'ACTIVE' | 'CONGESTED' | 'EMERGENCY' | 'HANDOVER';
  purpose: string;
  functions: string[];
  dataHandled: string;
  roleInRealTime: string;
  subComponents?: string[];
  protocols?: string[];
  specs?: Record<string, string>;
}

export interface NetworkConditions {
  load: CongestionLevel;
  signalStrengthDbm: number;
  signalQuality: SignalQuality;
  packetLossPct: number;
  baseLatencyMs: number;
  jitterMs: number;
  activeCameras: number;
  cameraBitrateKbps: number;
  maxBearerCapacityKbps: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'EMERGENCY' | 'HANDOVER' | 'SECURITY';
  priority?: 'HIGH' | 'LOW';
}

export interface AuditLogEntry {
  id: string;
  time: string;
  deviceId: string;
  user: string;
  action: string;
  status: 'SUCCESS' | 'DENIED' | 'HIGH PRIORITY' | 'ACTIVE';
  details: string;
}

export interface HandoverState {
  activeCell: 'Cell A' | 'Cell B' | 'Cell C';
  targetCell: 'Cell A' | 'Cell B' | 'Cell C' | null;
  status: 'IDLE' | 'APPROACHING_BOUNDARY' | 'BOUNDARY_REACHED' | 'HANDOVER_INITIATED' | 'HANDOVER_SUCCESSFUL';
  cellASignal: number; // Ec/No in dB (e.g. -6 to -18)
  cellBSignal: number;
  cellCSignal: number;
  distanceKm: number;  // 0 to 10
  isMobilityActive: boolean;
  handoversCount: number;
}

export interface ScenarioStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  systemAction: string;
  expectedState: SystemState;
  logMessage: string;
  durationMs: number;
}

export interface SystemTelemetry {
  bitrateKbps: number;
  latencyMs: number;
  packetLossPct: number;
  packetsSent: number;
  packetsReceived: number;
  packetsDropped: number;
  activeSessions: number;
  successfulHandovers: number;
  emergencyAlertsCount: number;
  queueHighPriorityCount: number;
  queueLowPriorityCount: number;
  admissionStatus: 'NORMAL' | 'REJECTED';
}

export interface ChartDataPoint {
  time: string;
  videoRate: number;
  audioRate: number;
  controlRate: number;
  backgroundRate: number;
  totalThroughput: number;
  latency: number;
  packetLoss: number;
  bufferOccupancy: number;
}
