import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CapacityCalculator: React.FC = () => {
  const [numCameras, setNumCameras] = useState<number>(20);
  const [bitrateKbps, setBitrateKbps] = useState<number>(256);
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const audioBitrateKbps = 12.2; // AMR-NB codec
  const [includeOverhead, setIncludeOverhead] = useState<boolean>(true);

  // Application Payload
  const videoTrafficKbps = numCameras * bitrateKbps;
  const audioTrafficKbps = includeAudio ? numCameras * audioBitrateKbps : 0;
  const rawPayloadKbps = videoTrafficKbps + audioTrafficKbps;

  // Protocol Overhead (RTP: 12B, UDP: 8B, IP: 20B = 40B per 1400B packet ~ 3.5%)
  const overheadFactor = includeOverhead ? 1.05 : 1.0;
  const totalTrafficKbps = Math.round(rawPayloadKbps * overheadFactor);
  const totalTrafficMbps = (totalTrafficKbps / 1000).toFixed(2);


  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
            3G Network Dimensioning Tool
          </span>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1 m-0">
            Capacity & Application Traffic Calculator
          </h2>
          <p className="text-xs text-slate-400 m-0 mt-0.5">
            Formula: <strong className="font-mono text-cyan-300">Total Traffic = Number of Cameras × Bitrate per Camera</strong>
          </p>
        </div>

        {/* Quick Baseline 20x256 Preset */}
        <button
          onClick={() => {
            setNumCameras(20);
            setBitrateKbps(256);
          }}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-mono font-semibold transition-all cursor-pointer"
        >
          Reset to Assignment Baseline (20 × 256 kbps)
        </button>
      </div>

      {/* Grid: Inputs (Left) and Results / Engineering Margins (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono border-b border-slate-800 pb-3 m-0 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              Dimensioning Input Parameters
            </h3>

            {/* Camera Count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Simultaneous Active Cameras:</span>
                <span className="text-cyan-400 font-bold text-sm">{numCameras} Units</span>
              </div>
              <input
                id="calc-cameras"
                type="range"
                min="1"
                max="50"
                step="1"
                value={numCameras}
                onChange={e => setNumCameras(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Camera</span>
                <span className="text-cyan-400 font-bold">20 (Assignment Baseline)</span>
                <span>50 Cameras</span>
              </div>
            </div>

            {/* Video Bitrate Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Video Bitrate per Camera:</span>
                <span className="text-cyan-400 font-bold text-sm">{bitrateKbps} kbps</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[64, 128, 256, 384].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setBitrateKbps(rate)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      bitrateKbps === rate
                        ? 'bg-cyan-600 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rate} kbps
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                Standard H.264 Baseline surveillance stream is 256 kbps.
              </span>
            </div>

            {/* Audio & Protocol Overhead Options */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3 font-mono text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAudio}
                  onChange={e => setIncludeAudio(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span>Include AMR-NB Two-Way Voice Channel (12.2 kbps / unit)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeOverhead}
                  onChange={e => setIncludeOverhead(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span>Account for RTP / UDP / IP Protocol Overhead (+5%)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Traffic Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono border-b border-slate-800 pb-3 m-0">
              Aggregated Traffic Calculation Results
            </h3>

            {/* Main Calculated Number */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Total Application Traffic Generated
              </span>
              <div className="text-4xl font-extrabold text-cyan-400 font-['Outfit']">
                {totalTrafficMbps} <span className="text-xl text-slate-300">Mbps</span>
              </div>
              <span className="text-xs font-mono text-slate-400 block mt-1">
                ({totalTrafficKbps.toLocaleString()} kbps aggregate uplink throughput)
              </span>
            </div>

            {/* Assignment Baseline Match Box */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-xs font-mono space-y-1 text-emerald-300">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Assignment Reference Case:</span>
              </div>
              <p className="m-0 leading-relaxed text-slate-300 text-[11px]">
                One camera = <strong>256 kbps</strong><br />
                20 simultaneous cameras: <strong>20 × 256 kbps = 5.12 Mbps</strong>
              </p>
            </div>

            {/* Breakdown Table */}
            <div className="font-mono text-xs space-y-2 divide-y divide-slate-800/80">
              <div className="flex justify-between text-slate-400 pt-1">
                <span>Video Payload (H.264):</span>
                <span className="text-slate-200 font-bold">{videoTrafficKbps} kbps</span>
              </div>
              {includeAudio && (
                <div className="flex justify-between text-slate-400 pt-1">
                  <span>Audio Payload (AMR):</span>
                  <span className="text-slate-200 font-bold">{audioTrafficKbps.toFixed(1)} kbps</span>
                </div>
              )}
              {includeOverhead && (
                <div className="flex justify-between text-slate-400 pt-1">
                  <span>RTP / UDP / IP Headers (~5%):</span>
                  <span className="text-slate-200 font-bold">{(totalTrafficKbps - rawPayloadKbps).toFixed(0)} kbps</span>
                </div>
              )}
            </div>

            {/* Mandatory Academic Disclaimer (Prompt Section 10 & 31) */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-900/60 text-[11px] text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Academic & Engineering Notice:</span>
              </div>
              <p className="m-0 leading-relaxed">
                <strong>"This calculation is before protocol overhead and network engineering margins."</strong>
              </p>
              <p className="m-0 leading-relaxed text-slate-400">
                <strong>"The actual number of supported users depends on cell loading, radio conditions, bearer configuration, spectrum, operator network capacity and selected video quality."</strong>
              </p>
              <p className="m-0 leading-relaxed text-slate-500 italic">
                * Note: 5.12 Mbps is an application-layer sum across multiple cameras, not the maximum throughput limit of a single 3G bearer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
