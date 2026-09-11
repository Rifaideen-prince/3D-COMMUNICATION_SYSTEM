import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type {
  SystemState,
  Packet,
  PacketType,
  PriorityLevel,
  CongestionLevel,
  SignalQuality,
  NetworkNodeData,
  NetworkConditions,
  LogEntry,
  AuditLogEntry,
  HandoverState,
  SystemTelemetry,
  ChartDataPoint
} from '../types/system';

import { SYSTEM_NODES } from '../data/systemData';
import { SCENARIO_STEPS } from '../data/scenarioData';

interface SimulationContextType {
  systemState: SystemState;
  nodes: NetworkNodeData[];
  selectedNode: NetworkNodeData | null;
  setSelectedNodeId: (id: string | null) => void;
  activeNodePulse: string | null;
  packets: Packet[];
  isTransmitting: boolean;
  isMobilityRunning: boolean;
  handoverState: HandoverState;
  networkConditions: NetworkConditions;
  telemetry: SystemTelemetry;
  eventLogs: LogEntry[];
  auditLogs: AuditLogEntry[];
  chartHistory: ChartDataPoint[];
  scenarioState: {
    isRunning: boolean;
    currentStepIndex: number;
    stepProgress: number;
    speed: number;
  };
  emergencyAlert: {
    isActive: boolean;
    message: string;
    timestamp: string;
  } | null;
  dismissEmergencyAlert: () => void;
  startTransmission: () => void;
  pauseTransmission: () => void;
  resetSystem: () => void;
  triggerEmergency: () => void;
  startMobility: () => void;
  pauseMobility: () => void;
  sendManualPacket: (type: PacketType) => void;
  setCongestion: (level: CongestionLevel) => void;
  setSignalStrength: (dbm: number) => void;
  setActiveCameras: (count: number) => void;
  setCameraBitrate: (kbps: number) => void;
  runFullScenario: () => void;
  pauseScenario: () => void;
  jumpToScenarioStep: (index: number) => void;
  setScenarioSpeed: (speed: number) => void;
  clearLogs: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const INITIAL_CONDITIONS: NetworkConditions = {
  load: 'LOW',
  signalStrengthDbm: -80,
  signalQuality: 'GOOD',
  packetLossPct: 0.1,
  baseLatencyMs: 140,
  jitterMs: 12,
  activeCameras: 1,
  cameraBitrateKbps: 256,
  maxBearerCapacityKbps: 3840 // 15 cameras capacity limit
};

const INITIAL_TELEMETRY: SystemTelemetry = {
  bitrateKbps: 256,
  latencyMs: 142,
  packetLossPct: 0.1,
  packetsSent: 0,
  packetsReceived: 0,
  packetsDropped: 0,
  activeSessions: 1,
  successfulHandovers: 0,
  emergencyAlertsCount: 0,
  queueHighPriorityCount: 0,
  queueLowPriorityCount: 0,
  admissionStatus: 'NORMAL'
};

const INITIAL_HANDOVER: HandoverState = {
  activeCell: 'Cell A',
  targetCell: null,
  status: 'IDLE',
  cellASignal: -8.2, // Ec/No in dB
  cellBSignal: -17.5,
  cellCSignal: -22.0,
  distanceKm: 0.8,
  isMobilityActive: false,
  handoversCount: 0
};

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-0',
    timestamp: '21:00:00',
    source: 'SYSTEM',
    message: 'System initialized. 3G UMTS network architecture standing by.',
    type: 'INFO'
  },
  {
    id: 'log-1',
    timestamp: '21:00:01',
    source: 'NODE-B',
    message: 'WCDMA Carrier 2100 MHz active. 3.84 Mcps chip clock synchronized.',
    type: 'INFO'
  },
  {
    id: 'log-2',
    timestamp: '21:00:02',
    source: 'RNC',
    message: 'Radio Network Controller ready. Radio Bearer pool initialized.',
    type: 'INFO'
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    time: '21:00:01',
    deviceId: 'CAMERA-01',
    user: 'Operator-01',
    action: 'System Boot & Ready Check',
    status: 'SUCCESS',
    details: 'Hardware self-test passed. USIM authenticated.'
  }
];

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemState, setSystemState] = useState<SystemState>('IDLE');
  const [nodes, setNodes] = useState<NetworkNodeData[]>(SYSTEM_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeNodePulse, setActiveNodePulse] = useState<string | null>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [isMobilityRunning, setIsMobilityRunning] = useState<boolean>(false);
  const [handoverState, setHandoverState] = useState<HandoverState>(INITIAL_HANDOVER);
  const [networkConditions, setNetworkConditions] = useState<NetworkConditions>(INITIAL_CONDITIONS);
  const [telemetry, setTelemetry] = useState<SystemTelemetry>(INITIAL_TELEMETRY);
  const [eventLogs, setEventLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [chartHistory, setChartHistory] = useState<ChartDataPoint[]>([]);
  const [scenarioState, setScenarioState] = useState({
    isRunning: false,
    currentStepIndex: 0,
    stepProgress: 0,
    speed: 1
  });
  const [emergencyAlert, setEmergencyAlert] = useState<{
    isActive: boolean;
    message: string;
    timestamp: string;
  } | null>(null);

  const packetIdCounter = useRef(1);
  const nodeSequence = ['camera-unit', 'node-b', 'rnc', 'packet-core', 'private-ip', 'app-server', 'monitoring-terminal'];

  const addLog = useCallback((source: string, message: string, type: LogEntry['type'] = 'INFO', priority: 'HIGH' | 'LOW' = 'LOW') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      source,
      message,
      type,
      priority
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 99)]);
  }, []);

  const addAuditLog = useCallback((deviceId: string, user: string, action: string, status: AuditLogEntry['status'], details: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newAudit: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      time: timeStr,
      deviceId,
      user,
      action,
      status,
      details
    };
    setAuditLogs(prev => [newAudit, ...prev.slice(0, 49)]);
  }, []);

  // Update node statuses according to system state
  useEffect(() => {
    setNodes(prevNodes =>
      prevNodes.map(node => {
        if (systemState === 'IDLE') {
          return { ...node, status: node.id === 'camera-unit' ? 'OFFLINE' : 'READY' };
        }
        if (systemState === 'EMERGENCY') {
          return { ...node, status: 'EMERGENCY' };
        }
        if (systemState === 'CONGESTED') {
          return { ...node, status: node.id === 'rnc' || node.id === 'node-b' ? 'CONGESTED' : 'ACTIVE' };
        }
        if (systemState === 'HANDOVER') {
          return { ...node, status: node.id === 'node-b' || node.id === 'rnc' ? 'HANDOVER' : 'ACTIVE' };
        }
        if (isTransmitting || systemState === 'STREAMING' || systemState === 'MOVING') {
          return { ...node, status: 'ACTIVE' };
        }
        return { ...node, status: 'READY' };
      })
    );
  }, [systemState, isTransmitting]);

  // Handle Admission Control Check
  useEffect(() => {
    const totalRequired = networkConditions.activeCameras * networkConditions.cameraBitrateKbps;
    if (totalRequired > networkConditions.maxBearerCapacityKbps) {
      setTelemetry(prev => ({ ...prev, admissionStatus: 'REJECTED' }));
      addLog('RNC-ADMISSION', `Admission Control: Session rejected for Camera #${networkConditions.activeCameras}. Capacity ${networkConditions.maxBearerCapacityKbps} kbps exceeded.`, 'WARNING', 'HIGH');
    } else {
      setTelemetry(prev => ({ ...prev, admissionStatus: 'NORMAL' }));
    }
  }, [networkConditions.activeCameras, networkConditions.cameraBitrateKbps, networkConditions.maxBearerCapacityKbps, addLog]);

  // Create & Dispatch Packets
  const createPacket = useCallback((type: PacketType, isEmergency = false): Packet => {
    const colors: Record<PacketType, string> = {
      VIDEO: '#06b6d4',      // Cyan
      AUDIO: '#a855f7',      // Purple
      CONTROL: '#f59e0b',    // Amber
      ALARM: '#ef4444',      // Red
      BACKGROUND: '#64748b'  // Slate
    };

    let priority: PriorityLevel = 'HIGH';
    if (type === 'BACKGROUND') priority = 'LOW';
    if (type === 'ALARM' || isEmergency) priority = 'CRITICAL';

    const sizes: Record<PacketType, number> = {
      VIDEO: 1400,
      AUDIO: 160,
      CONTROL: 80,
      ALARM: 64,
      BACKGROUND: 512
    };

    return {
      id: `pkt-${packetIdCounter.current++}`,
      type,
      priority,
      sizeKb: sizes[type],
      currentLink: 0,
      progress: 0,
      sourceNodeId: nodeSequence[0],
      targetNodeId: nodeSequence[1],
      color: colors[type],
      label: type,
      isEmergency
    };
  }, []);

  const sendManualPacket = useCallback((type: PacketType) => {
    const isAlarm = type === 'ALARM';
    const pkt = createPacket(type, isAlarm);
    setPackets(prev => [...prev, pkt]);
    setTelemetry(prev => ({
      ...prev,
      packetsSent: prev.packetsSent + 1,
      queueHighPriorityCount: pkt.priority === 'LOW' ? prev.queueHighPriorityCount : prev.queueHighPriorityCount + 1,
      queueLowPriorityCount: pkt.priority === 'LOW' ? prev.queueLowPriorityCount + 1 : prev.queueLowPriorityCount
    }));
    addLog('CAMERA-01', `Manual ${type} packet dispatched into radio buffer.`, isAlarm ? 'EMERGENCY' : 'INFO', pkt.priority === 'LOW' ? 'LOW' : 'HIGH');
  }, [createPacket, addLog]);

  // Periodic Packet Generator when Transmitting
  useEffect(() => {
    if (!isTransmitting) return;

    const interval = setInterval(() => {
      // Choose packet types based on realistic distribution
      // Mostly video (70%), audio (15%), control (10%), background (5%)
      const rand = Math.random();
      let type: PacketType = 'VIDEO';
      if (rand > 0.85) {
        type = 'AUDIO';
      } else if (rand > 0.75) {
        type = 'CONTROL';
      } else if (rand > 0.65) {
        type = 'BACKGROUND';
      }

      // If congested, drop some background packets to demonstrate QoS protection
      if (networkConditions.load === 'CONGESTED' && type === 'BACKGROUND' && Math.random() > 0.3) {
        setTelemetry(prev => ({
          ...prev,
          packetsDropped: prev.packetsDropped + 1,
          queueLowPriorityCount: Math.max(0, prev.queueLowPriorityCount - 1)
        }));
        return;
      }

      const pkt = createPacket(type);
      setPackets(prev => {
        // Prevent buffer overflow in UI
        if (prev.length > 25) return [...prev.slice(1), pkt];
        return [...prev, pkt];
      });

      setTelemetry(prev => ({
        ...prev,
        packetsSent: prev.packetsSent + 1,
        queueHighPriorityCount: pkt.priority !== 'LOW' ? (prev.queueHighPriorityCount + 1) % 15 : prev.queueHighPriorityCount,
        queueLowPriorityCount: pkt.priority === 'LOW' ? (prev.queueLowPriorityCount + 1) % 12 : prev.queueLowPriorityCount
      }));
    }, networkConditions.load === 'CONGESTED' ? 700 : 450);

    return () => clearInterval(interval);
  }, [isTransmitting, networkConditions.load, createPacket]);

  // Main Packet Physics / Movement Loop
  useEffect(() => {
    if (packets.length === 0) return;

    const animFrame = requestAnimationFrame(() => {
      setPackets(prevPackets => {
        const nextPackets: Packet[] = [];

        for (const pkt of prevPackets) {
          // Speed adjustment based on priority and congestion
          let speed = 0.04;
          if (pkt.priority === 'CRITICAL') speed = 0.07; // Alarm moves faster
          if (pkt.priority === 'LOW' && networkConditions.load === 'CONGESTED') speed = 0.015; // Background delayed
          if (pkt.priority === 'HIGH' && networkConditions.load === 'CONGESTED') speed = 0.035;

          const newProgress = pkt.progress + speed;

          if (newProgress >= 1) {
            // Reached next node
            const nextLink = pkt.currentLink + 1;
            const reachedNodeId = nodeSequence[pkt.currentLink + 1];

            // Trigger node pulse
            setActiveNodePulse(reachedNodeId);
            setTimeout(() => setActiveNodePulse(null), 300);

            if (nextLink >= 6) {
              // Packet reached Monitoring Terminal!
              setTelemetry(prev => ({
                ...prev,
                packetsReceived: prev.packetsReceived + 1,
                queueHighPriorityCount: Math.max(0, prev.queueHighPriorityCount - 1),
                queueLowPriorityCount: Math.max(0, prev.queueLowPriorityCount - 1)
              }));
              // Do not add to nextPackets (consumed)
            } else {
              // Advance to next link
              nextPackets.push({
                ...pkt,
                currentLink: nextLink,
                progress: 0,
                sourceNodeId: nodeSequence[nextLink],
                targetNodeId: nodeSequence[nextLink + 1]
              });
            }
          } else {
            nextPackets.push({
              ...pkt,
              progress: newProgress
            });
          }
        }
        return nextPackets;
      });
    });

    return () => cancelAnimationFrame(animFrame);
  }, [packets, networkConditions.load, nodeSequence]);

  // Mobility & Handover Simulation Loop
  useEffect(() => {
    if (!isMobilityRunning) return;

    const interval = setInterval(() => {
      setHandoverState(prev => {
        let newDist = prev.distanceKm + 0.15;
        if (newDist > 9.0) newDist = 0.5; // Loop route

        // Calculate dynamic signal strengths based on distance
        // Cell A (0 - 3.5 km), Cell B (2.5 - 6.5 km), Cell C (5.5 - 9.0 km)
        const aSig = Math.max(-25, -6.5 - Math.pow(newDist - 1.5, 2) * 1.5);
        const bSig = Math.max(-25, -6.5 - Math.pow(newDist - 4.5, 2) * 1.5);
        const cSig = Math.max(-25, -6.5 - Math.pow(newDist - 7.5, 2) * 1.5);

        let status = prev.status;
        let activeCell = prev.activeCell;
        let targetCell = prev.targetCell;
        let handoversCount = prev.handoversCount;

        // Handover from A to B (near 3.0 km)
        if (activeCell === 'Cell A' && newDist >= 2.8 && newDist <= 3.4) {
          if (status !== 'APPROACHING_BOUNDARY' && status !== 'HANDOVER_INITIATED') {
            status = 'APPROACHING_BOUNDARY';
            addLog('RNC-MOBILITY', 'Camera approaching Cell A / Cell B boundary. Pilot Ec/No crossover detected.', 'INFO');
          }
          if (newDist >= 3.0 && status === 'APPROACHING_BOUNDARY') {
            status = 'HANDOVER_INITIATED';
            targetCell = 'Cell B';
            addLog('RNC-HANDOVER', 'HANDOVER INITIATED: Adding Node B (Cell B) to Active Set (Soft Handover).', 'HANDOVER', 'HIGH');
            setSystemState('HANDOVER');
          }
        } else if (activeCell === 'Cell A' && newDist > 3.4 && status === 'HANDOVER_INITIATED') {
          status = 'HANDOVER_SUCCESSFUL';
          activeCell = 'Cell B';
          targetCell = null;
          handoversCount += 1;
          addLog('RNC-HANDOVER', 'HANDOVER SUCCESSFUL: Connection seamlessly transferred to Cell B. Zero media freeze.', 'SUCCESS', 'HIGH');
          setSystemState(isTransmitting ? 'STREAMING' : 'MOVING');
        }

        // Handover from B to C (near 6.0 km)
        if (activeCell === 'Cell B' && newDist >= 5.8 && newDist <= 6.4) {
          if (newDist >= 6.0 && status !== 'HANDOVER_INITIATED') {
            status = 'HANDOVER_INITIATED';
            targetCell = 'Cell C';
            addLog('RNC-HANDOVER', 'HANDOVER INITIATED: Cell B → Cell C Active Set update.', 'HANDOVER', 'HIGH');
            setSystemState('HANDOVER');
          }
        } else if (activeCell === 'Cell B' && newDist > 6.4 && status === 'HANDOVER_INITIATED') {
          status = 'HANDOVER_SUCCESSFUL';
          activeCell = 'Cell C';
          targetCell = null;
          handoversCount += 1;
          addLog('RNC-HANDOVER', 'HANDOVER SUCCESSFUL: Connection seamlessly transferred to Cell C.', 'SUCCESS', 'HIGH');
          setSystemState(isTransmitting ? 'STREAMING' : 'MOVING');
        }

        return {
          ...prev,
          distanceKm: parseFloat(newDist.toFixed(2)),
          cellASignal: parseFloat(aSig.toFixed(1)),
          cellBSignal: parseFloat(bSig.toFixed(1)),
          cellCSignal: parseFloat(cSig.toFixed(1)),
          activeCell,
          targetCell,
          status,
          handoversCount
        };
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isMobilityRunning, isTransmitting, addLog]);

  // Telemetry & Chart History Generation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toTimeString().split(' ')[0];

      // Base metrics derived from conditions
      let baseBitrate = networkConditions.activeCameras * networkConditions.cameraBitrateKbps;
      let latency = networkConditions.baseLatencyMs + (Math.random() * 8 - 4);
      let loss = networkConditions.packetLossPct;

      if (networkConditions.load === 'MEDIUM') {
        latency += 35;
        loss += 0.8;
      } else if (networkConditions.load === 'HIGH') {
        latency += 90;
        loss += 2.5;
      } else if (networkConditions.load === 'CONGESTED') {
        latency += 180;
        loss += 5.2;
      }

      if (networkConditions.signalQuality === 'POOR') {
        latency += 70;
        loss += 4.0;
      } else if (networkConditions.signalQuality === 'FAIR') {
        latency += 25;
        loss += 1.2;
      }

      // Bitrate split
      const videoRate = isTransmitting ? Math.round(baseBitrate * 0.75) : 0;
      const audioRate = isTransmitting ? Math.round(baseBitrate * 0.12) : 0;
      const controlRate = isTransmitting ? Math.round(baseBitrate * 0.08) : 0;
      const backgroundRate = isTransmitting ? (networkConditions.load === 'CONGESTED' ? 12 : 36) : 0;
      const totalThroughput = videoRate + audioRate + controlRate + backgroundRate;

      setTelemetry(prev => ({
        ...prev,
        bitrateKbps: totalThroughput,
        latencyMs: Math.round(latency),
        packetLossPct: parseFloat(loss.toFixed(1))
      }));

      const newPoint: ChartDataPoint = {
        time: timeLabel,
        videoRate,
        audioRate,
        controlRate,
        backgroundRate,
        totalThroughput,
        latency: Math.round(latency),
        packetLoss: parseFloat(loss.toFixed(1)),
        bufferOccupancy: networkConditions.load === 'CONGESTED' ? 88 : networkConditions.load === 'HIGH' ? 62 : 24
      };

      setChartHistory(prev => [...prev.slice(-19), newPoint]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTransmitting, networkConditions]);

  // Full Scenario Runner Stepper
  useEffect(() => {
    if (!scenarioState.isRunning) return;

    const step = SCENARIO_STEPS[scenarioState.currentStepIndex];
    if (!step) {
      setScenarioState(prev => ({ ...prev, isRunning: false }));
      return;
    }

    const stepInterval = 100;
    const totalTicks = step.durationMs / (stepInterval * scenarioState.speed);
    let currentTick = 0;

    const interval = setInterval(() => {
      currentTick += 1;
      const progress = Math.min(100, Math.round((currentTick / totalTicks) * 100));

      setScenarioState(prev => ({ ...prev, stepProgress: progress }));

      if (currentTick >= totalTicks) {
        clearInterval(interval);

        // Advance to next step
        const nextIndex = scenarioState.currentStepIndex + 1;
        if (nextIndex < SCENARIO_STEPS.length) {
          const nextStep = SCENARIO_STEPS[nextIndex];
          setScenarioState(prev => ({
            ...prev,
            currentStepIndex: nextIndex,
            stepProgress: 0
          }));
          executeScenarioStep(nextStep);
        } else {
          // Completed all steps
          setScenarioState(prev => ({
            ...prev,
            isRunning: false,
            stepProgress: 100
          }));
          addLog('SCENARIO', 'Full 7-stage 3G operational scenario completed successfully.', 'SUCCESS', 'HIGH');
        }
      }
    }, stepInterval);

    return () => clearInterval(interval);
  }, [scenarioState.isRunning, scenarioState.currentStepIndex, scenarioState.speed]);

  const executeScenarioStep = (step: typeof SCENARIO_STEPS[0]) => {
    setSystemState(step.expectedState);
    addLog('SCENARIO', `[Step ${step.stepNumber}/7] ${step.title}: ${step.logMessage}`, 'INFO', 'HIGH');

    switch (step.stepNumber) {
      case 1:
        // Registration & Auth
        setIsTransmitting(false);
        setIsMobilityRunning(false);
        addAuditLog('CAMERA-01', 'Operator-01', 'UE Registration & 3GPP AKA', 'SUCCESS', 'PDP Context IP 10.240.18.42 allocated');
        break;
      case 2:
        // Video start
        setIsTransmitting(true);
        addAuditLog('CAMERA-01', 'Operator-01', 'RTSP Stream Started', 'SUCCESS', 'QoS Streaming Bearer 256 kbps established');
        break;
      case 3:
        // Normal patrol movement
        setIsMobilityRunning(true);
        break;
      case 4:
        // Handover
        setHandoverState(prev => ({
          ...prev,
          distanceKm: 3.2,
          status: 'HANDOVER_INITIATED',
          targetCell: 'Cell B'
        }));
        setTimeout(() => {
          setHandoverState(prev => ({
            ...prev,
            distanceKm: 3.5,
            activeCell: 'Cell B',
            targetCell: null,
            status: 'HANDOVER_SUCCESSFUL',
            handoversCount: prev.handoversCount + 1
          }));
        }, 2000);
        break;
      case 5:
        // Congestion
        setNetworkConditions(prev => ({ ...prev, load: 'CONGESTED' }));
        addLog('RNC-QOS', 'QoS/Admission mechanisms protecting priority traffic against congestion.', 'WARNING', 'HIGH');
        break;
      case 6:
        // Emergency
        triggerEmergency();
        break;
      case 7:
        // Teardown
        setIsTransmitting(false);
        setIsMobilityRunning(false);
        setNetworkConditions(prev => ({ ...prev, load: 'LOW' }));
        addAuditLog('CAMERA-01', 'Operator-01', 'Session Concluded', 'SUCCESS', 'Resources deallocated cleanly.');
        break;
    }
  };

  const startTransmission = () => {
    setIsTransmitting(true);
    setSystemState('STREAMING');
    addLog('STREAMING', 'Live video/audio transmission started. 3G radio uplink active.', 'SUCCESS', 'HIGH');
    addAuditLog('CAMERA-01', 'Operator-01', 'Live Stream Started', 'SUCCESS', 'RTSP/RTP session initiated at 256 kbps');
  };

  const pauseTransmission = () => {
    setIsTransmitting(false);
    setSystemState('CONNECTED');
    addLog('STREAMING', 'Live transmission paused by operator.', 'WARNING');
  };

  const startMobility = () => {
    setIsMobilityRunning(true);
    if (systemState === 'IDLE' || systemState === 'READY') {
      setSystemState('MOVING');
    }
    addLog('MOBILITY', 'Patrol unit mobility started. Traversing cell coverage zones.', 'INFO');
  };

  const pauseMobility = () => {
    setIsMobilityRunning(false);
    addLog('MOBILITY', 'Patrol unit stationary.', 'INFO');
  };

  const triggerEmergency = () => {
    setSystemState('EMERGENCY');
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    setEmergencyAlert({
      isActive: true,
      message: 'Critical emergency alarm tripped by mobile patrol unit CAMERA-01. Priority preemption engaged.',
      timestamp: timeStr
    });

    setTelemetry(prev => ({
      ...prev,
      emergencyAlertsCount: prev.emergencyAlertsCount + 1
    }));

    // Send high-priority alarm packet
    const alarmPkt = createPacket('ALARM', true);
    setPackets(prev => [alarmPkt, ...prev]);

    addLog('EMERGENCY', '🚨 EMERGENCY ALARM: Alarm message received from CAMERA-01 (Priority: HIGH)', 'EMERGENCY', 'HIGH');
    addAuditLog('CAMERA-01', 'Operator-01', 'EMERGENCY ALARM TRIGGERED', 'HIGH PRIORITY', 'Tactical alert broadcast to control room');
  };

  const dismissEmergencyAlert = () => {
    setEmergencyAlert(null);
    if (isTransmitting) {
      setSystemState('STREAMING');
    } else {
      setSystemState('READY');
    }
  };

  const resetSystem = () => {
    setSystemState('IDLE');
    setIsTransmitting(false);
    setIsMobilityRunning(false);
    setPackets([]);
    setHandoverState(INITIAL_HANDOVER);
    setNetworkConditions(INITIAL_CONDITIONS);
    setTelemetry(INITIAL_TELEMETRY);
    setEmergencyAlert(null);
    setScenarioState({
      isRunning: false,
      currentStepIndex: 0,
      stepProgress: 0,
      speed: 1
    });
    addLog('SYSTEM', 'System reset to initial state. Ready for new demonstration.', 'INFO');
  };

  const runFullScenario = () => {
    resetSystem();
    setScenarioState({
      isRunning: true,
      currentStepIndex: 0,
      stepProgress: 0,
      speed: 1
    });
    executeScenarioStep(SCENARIO_STEPS[0]);
  };

  const pauseScenario = () => {
    setScenarioState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const jumpToScenarioStep = (index: number) => {
    if (index >= 0 && index < SCENARIO_STEPS.length) {
      setScenarioState(prev => ({
        ...prev,
        currentStepIndex: index,
        stepProgress: 0
      }));
      executeScenarioStep(SCENARIO_STEPS[index]);
    }
  };

  const setScenarioSpeed = (speed: number) => {
    setScenarioState(prev => ({ ...prev, speed }));
  };

  const setCongestion = (level: CongestionLevel) => {
    setNetworkConditions(prev => ({ ...prev, load: level }));
    addLog('QoS', `Network congestion adjusted to ${level}.`, level === 'CONGESTED' ? 'WARNING' : 'INFO');
  };

  const setSignalStrength = (dbm: number) => {
    let quality: SignalQuality = 'GOOD';
    if (dbm > -70) quality = 'EXCELLENT';
    else if (dbm > -85) quality = 'GOOD';
    else if (dbm > -100) quality = 'FAIR';
    else quality = 'POOR';

    setNetworkConditions(prev => ({
      ...prev,
      signalStrengthDbm: dbm,
      signalQuality: quality
    }));
  };

  const setActiveCameras = (count: number) => {
    setNetworkConditions(prev => ({ ...prev, activeCameras: count }));
  };

  const setCameraBitrate = (kbps: number) => {
    setNetworkConditions(prev => ({ ...prev, cameraBitrateKbps: kbps }));
  };

  const clearLogs = () => {
    setEventLogs([]);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <SimulationContext.Provider
      value={{
        systemState,
        nodes,
        selectedNode,
        setSelectedNodeId,
        activeNodePulse,
        packets,
        isTransmitting,
        isMobilityRunning,
        handoverState,
        networkConditions,
        telemetry,
        eventLogs,
        auditLogs,
        chartHistory,
        scenarioState,
        emergencyAlert,
        dismissEmergencyAlert,
        startTransmission,
        pauseTransmission,
        resetSystem,
        triggerEmergency,
        startMobility,
        pauseMobility,
        sendManualPacket,
        setCongestion,
        setSignalStrength,
        setActiveCameras,
        setCameraBitrate,
        runFullScenario,
        pauseScenario,
        jumpToScenarioStep,
        setScenarioSpeed,
        clearLogs
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
