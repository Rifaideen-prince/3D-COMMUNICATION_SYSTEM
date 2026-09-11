import React from 'react';
import {
  Camera,
  Radio,
  Cpu,
  Server,
  Globe,
  HardDrive,
  Monitor,
  Maximize2
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { NodeDetailModal } from './NodeDetailModal';
import { EducationalNote } from '../common/EducationalNote';

export const NetworkArchitecture: React.FC = () => {
  const {
    nodes,
    selectedNode,
    setSelectedNodeId,
    activeNodePulse,
    packets,
    isTransmitting,
    sendManualPacket,
    triggerEmergency
  } = useSimulation();


  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'camera-unit': return Camera;
      case 'node-b': return Radio;
      case 'rnc': return Cpu;
      case 'packet-core': return Server;
      case 'private-ip': return Globe;
      case 'app-server': return HardDrive;
      case 'monitoring-terminal': return Monitor;
      default: return Radio;
    }
  };

  const getLinkInterface = (index: number) => {
    switch (index) {
      case 0: return { label: 'Uu Air Interface', desc: 'WCDMA 2100 MHz FDD • 3.84 Mcps' };
      case 1: return { label: 'Iub Interface', desc: 'Node B ↔ RNC ATM / IP Bearer' };
      case 2: return { label: 'Iu-PS Interface', desc: 'Packet-Switched RANAP / GTP-U' };
      case 3: return { label: 'Gn / Gi Interface', desc: 'Secure GGSN IP Gateway' };
      case 4: return { label: 'IPsec / VPN', desc: 'Private Leased Transport Tunnel' };
      case 5: return { label: 'LAN / Video Bus', desc: 'RTSP / RTP H.264 Stream Fan-out' };
      default: return { label: 'IP Transport', desc: 'Standard Routing' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Architecture Summary Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
              End-to-End 3G Communication Path
            </span>
            <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1 m-0">
              System Architecture & Real-Time Packet Trajectory
            </h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Click any node to inspect internal components, protocols, and telecommunications functions.
            </p>
          </div>

          {/* Quick manual sender */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Dispatch Packet:</span>
            <button
              id="btn-send-video"
              onClick={() => sendManualPacket('VIDEO')}
              className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-mono font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              + Video
            </button>
            <button
              id="btn-send-audio"
              onClick={() => sendManualPacket('AUDIO')}
              className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700 text-xs font-mono font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              + Audio
            </button>
            <button
              id="btn-send-control"
              onClick={() => sendManualPacket('CONTROL')}
              className="px-2.5 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700 text-xs font-mono font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              + Control
            </button>
            <button
              id="btn-send-bg"
              onClick={() => sendManualPacket('BACKGROUND')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-mono font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              + Background
            </button>
            <button
              id="btn-send-alarm"
              onClick={triggerEmergency}
              className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-600 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer glow-red"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              🚨 Alarm
            </button>
          </div>
        </div>

        {/* Interactive 7-Node Diagram with Traveling Packets */}
        <div className="relative overflow-x-auto pb-6 pt-2 scrollbar-thin">
          <div className="min-w-[1020px] flex items-center justify-between gap-2 px-2">
            {nodes.map((node, index) => {
              const Icon = getNodeIcon(node.id);
              const isPulsing = activeNodePulse === node.id;
              const isCamera = node.id === 'camera-unit';
              const link = getLinkInterface(index);

              return (
                <React.Fragment key={node.id}>
                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative w-36 sm:w-40 rounded-xl p-3.5 border transition-all cursor-pointer select-none group shrink-0 ${
                      isPulsing
                        ? 'border-cyan-400 bg-cyan-950/70 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-105'
                        : node.status === 'EMERGENCY'
                        ? 'border-red-500 bg-red-950/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : node.status === 'CONGESTED'
                        ? 'border-amber-500/70 bg-amber-950/50'
                        : 'border-slate-800 bg-slate-950/90 hover:border-cyan-500/60 hover:bg-slate-900'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            node.status === 'ACTIVE'
                              ? 'bg-emerald-400 animate-pulse'
                              : node.status === 'EMERGENCY'
                              ? 'bg-red-500 animate-ping'
                              : node.status === 'CONGESTED'
                              ? 'bg-amber-400 animate-pulse'
                              : 'bg-slate-600'
                          }`}
                        />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                          {node.status}
                        </span>
                      </div>
                      <Maximize2 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${isPulsing ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-cyan-400 border border-slate-800'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-['Outfit'] m-0 leading-tight">
                          {node.shortName}
                        </h4>
                      </div>
                    </div>

                    {/* Subtitle / Role */}
                    <p className="text-[10px] text-slate-400 font-mono line-clamp-2 m-0 mb-2 leading-tight">
                      {node.subtitle}
                    </p>

                    {/* Sub-components for Camera Unit (Prompt section 16) */}
                    {isCamera && (
                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[9px] font-mono text-slate-400">
                        <span className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">Camera</span>
                        <span className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">Mic</span>
                        <span className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">H.264</span>
                        <span className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">3G Modem</span>
                      </div>
                    )}
                  </div>

                  {/* Connecting Link with Traveling Packets */}
                  {index < nodes.length - 1 && (
                    <div className="relative flex-1 min-w-[50px] max-w-[90px] h-16 flex flex-col items-center justify-center">
                      {/* Interface Name Tag */}
                      <span className="text-[9px] font-mono text-slate-500 mb-1 whitespace-nowrap">
                        {link.label}
                      </span>

                      {/* Cable Line */}
                      <div className="relative w-full h-1 bg-slate-800 rounded overflow-hidden">
                        {isTransmitting && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[pulse_1.5s_ease-in-out_infinite]" />
                        )}
                      </div>

                      {/* Traveling Packets along this link */}
                      <div className="absolute inset-0 pointer-events-none flex items-center">
                        {packets
                          .filter(pkt => pkt.currentLink === index)
                          .map(pkt => (
                            <div
                              key={pkt.id}
                              className="absolute transform -translate-y-1/2 transition-all duration-75"
                              style={{
                                left: `${Math.min(92, Math.max(8, pkt.progress * 100))}%`,
                                top: '50%'
                              }}
                            >
                              <span
                                className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg uppercase whitespace-nowrap ${
                                  pkt.isEmergency
                                    ? 'bg-red-600 text-white animate-bounce glow-red'
                                    : 'text-slate-950 font-extrabold'
                                }`}
                                style={{ backgroundColor: pkt.isEmergency ? '#ef4444' : pkt.color }}
                              >
                                {pkt.label}
                              </span>
                            </div>
                          ))}
                      </div>

                      <span className="text-[8px] font-mono text-slate-600 mt-1 whitespace-nowrap text-center">
                        {link.desc.split('•')[0]}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Live Legend of Packet Types */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-400 font-semibold">Packet Types & Priorities:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
              <span className="text-slate-300">VIDEO (High Priority, 1400B)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
              <span className="text-slate-300">AUDIO (High Priority, 160B)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-slate-300">CONTROL (High Priority, 80B)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-ping" />
              <span className="text-red-400 font-bold">ALARM (Critical Priority, 64B)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
              <span className="text-slate-400">BACKGROUND (Low Priority, 512B)</span>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            Packets in Flight: <strong className="text-cyan-400">{packets.length}</strong>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <EducationalNote
        title="WCDMA Physical Layer & Core Transport Chain"
        topic="Radio Access & Packet-Switched Core"
      >
        <p>
          <strong>Uu Interface (Air Interface):</strong> Uses Wideband CDMA (WCDMA) with 3.84 Mcps chip rate and direct sequence spreading. The camera unit transmits over a dedicated physical uplink channel.
        </p>
        <p>
          <strong>RNC & 3G Packet Core:</strong> The Radio Network Controller (RNC) manages radio resources and executes seamless soft handover. The 3G Packet Core (SGSN/GGSN) establishes a Packet Data Protocol (PDP) context, routing standard IP surveillance streams into the private control network.
        </p>
      </EducationalNote>

      {/* Inspector Modal */}
      <NodeDetailModal
        node={selectedNode}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
};
