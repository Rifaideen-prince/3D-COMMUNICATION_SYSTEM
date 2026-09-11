import React from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const EmergencyModal: React.FC = () => {
  const { emergencyAlert, dismissEmergencyAlert } = useSimulation();

  if (!emergencyAlert || !emergencyAlert.isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-full rounded-2xl border-2 border-red-500/80 bg-slate-900/95 p-6 shadow-[0_0_50px_rgba(239,68,68,0.5)] glow-red text-center relative overflow-hidden">
        {/* Top Warning Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Icon & Siren */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-red-400 mb-4 animate-bounce">
          <BellRing className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-red-400 px-2.5 py-1 rounded bg-red-950 border border-red-800 inline-block mb-2">
          CRITICAL PRIORITY ALERT
        </span>

        <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">
          🚨 EMERGENCY ALARM TRIGGERED
        </h3>

        <p className="text-sm font-semibold text-red-200 mb-2">
          Alarm message received from CAMERA-01 (Patrol Van 3)
        </p>

        <div className="rounded-lg bg-slate-950/80 border border-red-900/60 p-3 mb-4 text-xs text-slate-300 text-left space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Timestamp:</span>
            <span className="text-red-300">{emergencyAlert.timestamp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">QoS Traffic Class:</span>
            <span className="text-red-300 font-bold">Priority: HIGH / CRITICAL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">RNC Queue Treatment:</span>
            <span className="text-emerald-400 font-bold">Strict Preemption (Queue #1)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Air Interface:</span>
            <span className="text-cyan-300">Fast PRACH / Dedicated DPCH</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          <strong className="text-slate-200">How it works:</strong> Emergency alarm traffic is strictly prioritized over background data and normal telemetry. The 3G RNC scheduler immediately routes this packet to the core network without buffering delay.
        </p>

        <button
          id="btn-acknowledge-alarm"
          onClick={dismissEmergencyAlert}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Acknowledge & Clear Alarm Strobe</span>
        </button>
      </div>
    </div>
  );
};
