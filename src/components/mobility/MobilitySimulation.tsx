import React from 'react';
import {
  Car,
  Radio,
  Play,
  Pause
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { EducationalNote } from '../common/EducationalNote';

export const MobilitySimulation: React.FC = () => {
  const {
    handoverState,
    isMobilityRunning,
    startMobility,
    pauseMobility
  } = useSimulation();


  // Cell boundary threshold status display
  const getHandoverBadge = () => {
    switch (handoverState.status) {
      case 'APPROACHING_BOUNDARY':
        return { text: 'CELL BOUNDARY APPROACHING', color: 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse' };
      case 'BOUNDARY_REACHED':
        return { text: 'CELL BOUNDARY REACHED', color: 'bg-amber-950 text-amber-200 border-amber-600 animate-pulse' };
      case 'HANDOVER_INITIATED':
        return { text: 'HANDOVER INITIATED (Active Set Update)', color: 'bg-indigo-950 text-indigo-300 border-indigo-500 animate-pulse' };
      case 'HANDOVER_SUCCESSFUL':
        return { text: 'HANDOVER SUCCESSFUL (Seamless)', color: 'bg-emerald-950 text-emerald-300 border-emerald-500' };
      default:
        return { text: `LINK STABLE (${handoverState.activeCell})`, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getHandoverBadge();

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="rounded-xl border border-blue-500/50 bg-blue-950/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-900/60 text-blue-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-['Outfit'] m-0">
              WCDMA Soft Handover & Mobile Surveillance Simulation
            </h3>
            <p className="text-xs text-slate-300 m-0 mt-0.5">
              Radio network maintains uninterrupted real-time video stream as the surveillance patrol moves across cellular cells.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-start-mobility-panel"
            onClick={isMobilityRunning ? pauseMobility : startMobility}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              isMobilityRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-lg'
            }`}
          >
            {isMobilityRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isMobilityRunning ? 'Pause Patrol' : 'START MOBILITY'}</span>
          </button>
        </div>
      </div>

      {/* Interactive 3-Cell Radio Map Visualization */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              Hexagonal Cell Layout (UMTS UTRAN)
            </span>
            <h4 className="text-base font-bold text-white font-['Outfit'] mt-1 m-0">
              Cell A ↔ Cell B ↔ Cell C Handover Corridor
            </h4>
          </div>

          {/* Current Handover State Badge */}
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${badge.color}`}>
            {badge.text}
          </div>
        </div>

        {/* Visual Cell Map Graphic */}
        <div className="relative w-full h-72 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden telecom-grid flex items-center justify-around px-8">
          {/* Cell A Coverage Circle */}
          <div
            className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${
              handoverState.activeCell === 'Cell A'
                ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                : 'border-slate-800 bg-slate-900/20'
            }`}
          >
            <div className="p-3 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 mb-2">
              <Radio className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white font-mono">Cell A</span>
            <span className="text-[10px] text-slate-400 font-mono">Node B 1 (BS-01)</span>
            <span className="text-xs font-mono text-cyan-300 font-bold mt-1">
              {handoverState.cellASignal} dB Ec/No
            </span>
          </div>

          {/* Cell B Coverage Circle */}
          <div
            className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-dashed flex flex-col items-center justify-center -ml-16 sm:-ml-20 transition-all duration-500 ${
              handoverState.activeCell === 'Cell B'
                ? 'border-indigo-400 bg-indigo-950/20 shadow-[0_0_30px_rgba(99,102,241,0.25)]'
                : 'border-slate-800 bg-slate-900/20'
            }`}
          >
            <div className="p-3 rounded-full bg-slate-900 border border-slate-700 text-indigo-400 mb-2">
              <Radio className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white font-mono">Cell B</span>
            <span className="text-[10px] text-slate-400 font-mono">Node B 2 (BS-02)</span>
            <span className="text-xs font-mono text-indigo-300 font-bold mt-1">
              {handoverState.cellBSignal} dB Ec/No
            </span>
          </div>

          {/* Cell C Coverage Circle */}
          <div
            className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-dashed flex flex-col items-center justify-center -ml-16 sm:-ml-20 transition-all duration-500 ${
              handoverState.activeCell === 'Cell C'
                ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_30px_rgba(34,197,94,0.25)]'
                : 'border-slate-800 bg-slate-900/20'
            }`}
          >
            <div className="p-3 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 mb-2">
              <Radio className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white font-mono">Cell C</span>
            <span className="text-[10px] text-slate-400 font-mono">Node B 3 (BS-03)</span>
            <span className="text-xs font-mono text-emerald-300 font-bold mt-1">
              {handoverState.cellCSignal} dB Ec/No
            </span>
          </div>

          {/* Moving Mobile Surveillance Patrol Unit (Van) */}
          <div
            className="absolute z-20 flex flex-col items-center transition-all duration-300"
            style={{
              left: `${Math.min(90, Math.max(10, (handoverState.distanceKm / 9.0) * 100))}%`,
              top: '60%'
            }}
          >
            <div className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse flex items-center gap-1">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500 mt-1 whitespace-nowrap">
              CAMERA-01 ({handoverState.distanceKm} km)
            </span>
          </div>
        </div>

        {/* Handover Telemetry Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Active Serving Cell</span>
            <span className="text-cyan-300 font-bold text-sm">{handoverState.activeCell}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Target Handover Candidate</span>
            <span className="text-amber-300 font-bold text-sm">
              {handoverState.targetCell || 'None (Link Stable)'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Successful Handovers</span>
            <span className="text-emerald-400 font-bold text-sm">{handoverState.handoversCount} Events</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Video Continuity</span>
            <span className="text-cyan-400 font-bold text-sm">0 dropped frames</span>
          </div>
        </div>
      </div>

      <EducationalNote
        title="Why Handover is Required & WCDMA Soft Handover"
        topic="Mobility Management"
      >
        <p>
          <strong>Continuity during Mobility:</strong> When a mobile camera unit moves out of coverage of Cell A and into Cell B, the radio network must transfer the connection seamlessly.
        </p>
        <p>
          <strong>Soft Handover (Make-Before-Break):</strong> Unlike traditional hard handovers that disconnect before reconnecting, WCDMA utilizes <em>soft handover</em>. The mobile camera connects simultaneously to Node B 1 and Node B 2 within the overlap zone (Active Set). The RNC combines frames from both base stations, ensuring the live surveillance video never freezes or drops during vehicle movement.
        </p>
      </EducationalNote>
    </div>
  );
};
