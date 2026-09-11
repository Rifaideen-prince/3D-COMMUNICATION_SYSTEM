import React from 'react';
import {
  Sliders,
  Shield,
  Layers,
  Send,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { EducationalNote } from '../common/EducationalNote';
import type { CongestionLevel, PacketType } from '../../types/system';

export const QoSPanel: React.FC = () => {
  const {
    networkConditions,
    setCongestion,
    setSignalStrength,
    setActiveCameras,
    telemetry,
    sendManualPacket,
    triggerEmergency
  } = useSimulation();


  const trafficClasses = [
    {
      id: 'video',
      name: 'Real-Time Video',
      priority: 'HIGH',
      type: 'VIDEO' as PacketType,
      umtsClass: 'Streaming / Conversational',
      delayTolerance: '< 150 ms',
      example: 'Live surveillance camera stream (256 kbps H.264)',
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30'
    },
    {
      id: 'audio',
      name: 'Real-Time Audio',
      priority: 'HIGH',
      type: 'AUDIO' as PacketType,
      umtsClass: 'Conversational',
      delayTolerance: '< 100 ms',
      example: 'Operator two-way voice channel (AMR 12.2 kbps)',
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/30'
    },
    {
      id: 'control',
      name: 'Control & Signalling',
      priority: 'HIGH',
      type: 'CONTROL' as PacketType,
      umtsClass: 'Interactive',
      delayTolerance: '< 200 ms',
      example: 'Camera PTZ commands, start/stop, keepalives',
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/30'
    },
    {
      id: 'background',
      name: 'Background Data',
      priority: 'LOW',
      type: 'BACKGROUND' as PacketType,
      umtsClass: 'Background',
      delayTolerance: 'Unconstrained (Best-Effort)',
      example: 'Device diagnostic logs, firmware status, archive sync',
      color: 'text-slate-400 border-slate-700 bg-slate-900/40'
    }
  ];

  const congestionLevels: CongestionLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CONGESTED'];

  return (
    <div className="space-y-6">
      {/* Top Banner Notice when Congested */}
      {networkConditions.load === 'CONGESTED' && (
        <div className="rounded-xl border border-amber-500/80 bg-amber-950/70 p-4 text-amber-200 flex items-start gap-3 shadow-lg">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="text-sm font-bold text-amber-100 font-mono m-0 mb-1">
              QoS / Admission Mechanisms Protecting Priority Traffic
            </h4>
            <p className="m-0 leading-relaxed">
              Network load is currently <strong>CONGESTED</strong>. Low-priority background telemetry is throttled and queued, ensuring real-time video (256 kbps) and tactical audio packets traverse the WCDMA radio bearer without bufferbloat.
            </p>
          </div>
        </div>
      )}

      {/* Admission Control Rejection Banner */}
      {telemetry.admissionStatus === 'REJECTED' && (
        <div className="rounded-xl border border-red-500/80 bg-red-950/80 p-4 text-red-200 flex items-start gap-3 shadow-lg glow-red">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="text-sm font-bold text-white font-mono m-0 mb-1">
              Admission Control: New High-Priority Session Rejected Due to Insufficient Capacity
            </h4>
            <p className="m-0 leading-relaxed font-mono">
              Attempted cameras: <strong className="text-white">{networkConditions.activeCameras}</strong> × {networkConditions.cameraBitrateKbps} kbps = <strong>{networkConditions.activeCameras * networkConditions.cameraBitrateKbps} kbps</strong>. Maximum reserved radio bearer threshold is <strong>{networkConditions.maxBearerCapacityKbps} kbps</strong>. RNC blocks extra camera sessions to preserve QoS for existing live streams.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Traffic Classes & Generator (Left), Congestion & Queues (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Traffic Classes Interactive Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  3GPP TS 23.107 Standard
                </span>
                <h3 className="text-base font-bold text-white font-['Outfit'] mt-1 m-0">
                  UMTS Traffic Prioritization Classes
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                4 Standard Classes
              </span>
            </div>

            {/* Table of Traffic Classes */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Traffic Class</th>
                    <th className="pb-2 font-semibold">Priority</th>
                    <th className="pb-2 font-semibold">Delay Target</th>
                    <th className="pb-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {trafficClasses.map(tc => (
                    <tr key={tc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="font-bold text-slate-100">{tc.name}</div>
                        <div className="text-[11px] text-slate-400 font-sans">{tc.example}</div>
                      </td>
                      <td className="py-3 pr-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tc.color}`}>
                          {tc.priority}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-slate-300">
                        {tc.delayTolerance}
                      </td>
                      <td className="py-3">
                        <button
                          id={`btn-inject-${tc.id}`}
                          onClick={() => sendManualPacket(tc.type)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-200 border border-slate-700 text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Send
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Emergency Alarm Row */}
                  <tr className="bg-red-950/30 border-t border-red-900/60">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-red-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                        Emergency Alarm
                      </div>
                      <div className="text-[11px] text-red-200 font-sans">Tactical distress signal / motion intrusion alarm</div>
                    </td>
                    <td className="py-3 pr-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900 text-red-200 border border-red-600">
                        CRITICAL
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-red-300 font-bold">
                      Immediate (&lt; 20 ms)
                    </td>
                    <td className="py-3">
                      <button
                        id="btn-trigger-alarm-table"
                        onClick={triggerEmergency}
                        className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-sans font-bold shadow transition-all cursor-pointer"
                      >
                        Trigger
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <EducationalNote
            title="Why Quality of Service (QoS) is Required"
            topic="Differentiated Scheduling"
          >
            <p>
              <strong>Traffic Prioritization Principle:</strong> Real-time video, audio, and emergency control traffic are delay-sensitive; excessive jitter or delay renders live surveillance unusable. Background data (telemetry logs, software updates) can tolerate seconds of delay. By implementing strict priority queueing (PQ) or weighted fair queueing (WFQ) at the RNC and GGSN, delay-sensitive media packets are always served before background traffic.
            </p>
          </EducationalNote>
        </div>

        {/* Right Column: Priority Queues & Congestion Sliders */}
        <div className="lg:col-span-5 space-y-4">
          {/* Priority Queue Visualizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2 m-0">
                <Layers className="w-4 h-4 text-cyan-400" />
                RNC Scheduling Priority Buffers
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Strict Priority Scheduler
              </span>
            </div>

            {/* High Priority Queue Buffer */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span className="text-cyan-400">Queue #1: High Priority (Video / Audio / Alarms)</span>
                <span>{telemetry.queueHighPriorityCount} packets</span>
              </div>
              <div className="h-4 bg-slate-950 rounded border border-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, telemetry.queueHighPriorityCount * 8)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Serviced immediately upon arrival. Low delay & low jitter.
              </span>
            </div>

            {/* Low Priority Queue Buffer */}
            <div className="space-y-1.5 font-mono text-xs pt-2">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span className="text-slate-400">Queue #2: Low Priority (Background Data)</span>
                <span>{telemetry.queueLowPriorityCount} packets</span>
              </div>
              <div className="h-4 bg-slate-950 rounded border border-slate-800 overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${
                    networkConditions.load === 'CONGESTED' ? 'bg-amber-500' : 'bg-slate-600'
                  }`}
                  style={{ width: `${Math.min(100, telemetry.queueLowPriorityCount * 10)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                {networkConditions.load === 'CONGESTED'
                  ? 'Buffering / Dropped under congestion to shield real-time streams.'
                  : 'Serviced when Queue #1 is empty.'}
              </span>
            </div>
          </div>

          {/* Network Conditions Control Panel (Prompt Section 8) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2 m-0">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Network Conditions & Radio Channel
              </h3>
            </div>

            {/* Network Load Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold block">
                Network Load / Cellular Cell Congestion:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {congestionLevels.map(lvl => (
                  <button
                    key={lvl}
                    id={`btn-load-${lvl.toLowerCase()}`}
                    onClick={() => setCongestion(lvl)}
                    className={`py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                      networkConditions.load === lvl
                        ? lvl === 'CONGESTED'
                          ? 'bg-red-600 text-white shadow-md'
                          : lvl === 'HIGH'
                          ? 'bg-amber-600 text-white'
                          : 'bg-cyan-600 text-slate-950'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Signal Strength Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Radio Signal Strength:</span>
                <span className="text-cyan-300 font-bold">{networkConditions.signalStrengthDbm} dBm ({networkConditions.signalQuality})</span>
              </div>
              <input
                id="slider-signal"
                type="range"
                min="-110"
                max="-60"
                step="5"
                value={networkConditions.signalStrengthDbm}
                onChange={e => setSignalStrength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Admission Control Slider (Number of Active Cameras) */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Active Cameras (Admission Test):</span>
                <span className="text-white font-bold">{networkConditions.activeCameras} Units ({networkConditions.activeCameras * networkConditions.cameraBitrateKbps} kbps)</span>
              </div>
              <input
                id="slider-active-cameras"
                type="range"
                min="1"
                max="25"
                step="1"
                value={networkConditions.activeCameras}
                onChange={e => setActiveCameras(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Threshold: 15 cameras (3840 kbps). Exceeding triggers Admission Rejection.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
