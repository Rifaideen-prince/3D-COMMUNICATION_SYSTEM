import React from 'react';
import {
  Radio,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  FastForward,
  Navigation as NavIcon
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';


export const Header: React.FC = () => {
  const {
    systemState,
    isTransmitting,
    isMobilityRunning,
    startTransmission,
    pauseTransmission,
    triggerEmergency,
    startMobility,
    pauseMobility,
    runFullScenario,
    resetSystem,
    scenarioState
  } = useSimulation();

  const getStateBadge = () => {
    switch (systemState) {
      case 'IDLE':
        return { text: 'SYSTEM READY (IDLE)', color: 'bg-slate-800 text-slate-300 border-slate-700' };
      case 'REGISTERING':
      case 'AUTHENTICATING':
        return { text: 'AUTHENTICATING (3GPP AKA)', color: 'bg-amber-950/60 text-amber-300 border-amber-800 animate-pulse' };
      case 'CONNECTED':
        return { text: 'PDP CONTEXT ACTIVE', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' };
      case 'STREAMING':
        return { text: 'LIVE 3G STREAMING (256 kbps)', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]' };
      case 'MOVING':
        return { text: 'MOBILE PATROL ACTIVE', color: 'bg-blue-950/70 text-blue-300 border-blue-700' };
      case 'HANDOVER':
        return { text: 'WCDMA SOFT HANDOVER', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-500 animate-pulse' };
      case 'CONGESTED':
        return { text: 'CONGESTION (QoS PROTECTED)', color: 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse' };
      case 'EMERGENCY':
        return { text: '🚨 CRITICAL EMERGENCY ALARM', color: 'bg-red-950/90 text-red-300 border-red-600 glow-red' };
      case 'SESSION_END':
        return { text: 'SESSION CONCLUDED', color: 'bg-purple-950/70 text-purple-300 border-purple-700' };
      default:
        return { text: systemState, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getStateBadge();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Title & Brand */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/20 border border-cyan-500/40 text-cyan-400 shadow-inner">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white font-['Outfit'] m-0">
                3G Real-Time Communication System
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-400 border border-cyan-800/80">
                Simulation / Educational Model
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium m-0 flex items-center gap-2">
              <span>Real-Time Mobile Video Surveillance & Emergency Monitoring</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline font-mono text-slate-400">UMTS / WCDMA FDD</span>
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
          {/* Current State Indicator */}
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${badge.color}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>{badge.text}</span>
          </div>

          {/* Start/Pause Live Transmission */}
          <button
            id="btn-live-transmission"
            onClick={isTransmitting ? pauseTransmission : startTransmission}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isTransmitting
                ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40'
                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isTransmitting ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Stream
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Start Live Transmission
              </>
            )}
          </button>

          {/* Full Scenario Runner */}
          <button
            id="btn-full-scenario"
            onClick={runFullScenario}
            disabled={scenarioState.isRunning}
            className="px-3 py-1.5 rounded-lg font-medium text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Run complete 7-stage operational sequence"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Run Full Scenario</span>
          </button>

          {/* Mobility Toggle */}
          <button
            id="btn-toggle-mobility"
            onClick={isMobilityRunning ? pauseMobility : startMobility}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all border ${
              isMobilityRunning
                ? 'bg-blue-600/25 text-blue-300 border-blue-500/50'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <NavIcon className={`w-3.5 h-3.5 ${isMobilityRunning ? 'animate-spin' : ''}`} />
            <span>{isMobilityRunning ? 'Patrol Active' : 'Start Mobility'}</span>
          </button>

          {/* Trigger Emergency Alarm */}
          <button
            id="btn-trigger-emergency"
            onClick={triggerEmergency}
            className="px-3.5 py-1.5 rounded-lg font-bold text-xs bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-[0_0_18px_rgba(239,68,68,0.5)] transition-all animate-bounce hover:animate-none cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 fill-current" />
            <span>Trigger Emergency Alarm</span>
          </button>

          {/* Reset System */}
          <button
            id="btn-reset-system"
            onClick={resetSystem}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
            title="Reset simulation to initial state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
