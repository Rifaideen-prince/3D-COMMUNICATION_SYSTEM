import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Shield,
  Eye,
  Crosshair,
  AlertTriangle,
  Flame,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { EducationalNote } from '../common/EducationalNote';

export const LiveMonitor: React.FC = () => {
  const {
    systemState,
    isTransmitting,
    networkConditions,
    telemetry,
    handoverState,
    triggerEmergency
  } = useSimulation();

  const [activeCamId, setActiveCamId] = useState<'CAM-01' | 'CAM-02' | 'CAM-03'>('CAM-01');
  const [visionMode, setVisionMode] = useState<'NORMAL' | 'IR_THERMAL' | 'EDGE_DETECT'>('NORMAL');
  const [showCrosshairs, setShowCrosshairs] = useState(true);
  const [showMotionBox, setShowMotionBox] = useState(true);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic canvas surveillance visual animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;
    let targetX = 180;
    let targetY = 120;
    let targetVelX = 0.8;
    let targetVelY = 0.4;

    const render = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear background
      if (visionMode === 'IR_THERMAL') {
        // Thermal purple/amber palette
        ctx.fillStyle = '#180728';
        ctx.fillRect(0, 0, w, h);
      } else {
        // Night/Day surveillance dark slate
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, w, h);
      }

      // If camera is OFFLINE or NOT transmitting
      if (!isTransmitting && systemState !== 'STREAMING' && systemState !== 'MOVING' && systemState !== 'EMERGENCY') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Standby test pattern bars
        const barWidth = w / 7;
        const colors = ['#e2e8f0', '#facc15', '#06b6d4', '#22c55e', '#ec4899', '#ef4444', '#3b82f6'];
        colors.forEach((col, idx) => {
          ctx.fillStyle = col;
          ctx.globalAlpha = 0.15;
          ctx.fillRect(idx * barWidth, 40, barWidth, h - 80);
        });
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CAMERA STANDBY / TRANSMISSION PAUSED', w / 2, h / 2 - 10);
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Click "START LIVE TRANSMISSION" above to establish 3G video uplink', w / 2, h / 2 + 15);
        return;
      }

      // Draw simulated surveillance environment
      // Horizon line
      ctx.strokeStyle = visionMode === 'IR_THERMAL' ? '#581c87' : '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.lineTo(w, h * 0.65);
      ctx.stroke();

      // Background buildings / perimeter fence
      ctx.fillStyle = visionMode === 'IR_THERMAL' ? '#3b0764' : '#0a1526';
      ctx.fillRect(40, h * 0.35, 90, h * 0.3);
      ctx.fillRect(150, h * 0.28, 120, h * 0.37);
      ctx.fillRect(290, h * 0.42, 100, h * 0.23);
      ctx.fillRect(420, h * 0.3, 110, h * 0.35);

      // Windows
      ctx.fillStyle = visionMode === 'IR_THERMAL' ? '#f59e0b' : '#38bdf8';
      ctx.globalAlpha = visionMode === 'IR_THERMAL' ? 0.6 : 0.25;
      for (let bx = 50; bx < 120; bx += 20) {
        for (let by = h * 0.38; by < h * 0.6; by += 25) {
          ctx.fillRect(bx, by, 10, 12);
        }
      }
      for (let bx = 165; bx < 250; bx += 25) {
        for (let by = h * 0.32; by < h * 0.6; by += 25) {
          ctx.fillRect(bx, by, 12, 14);
        }
      }
      ctx.globalAlpha = 1.0;

      // Moving Surveillance Target (Vehicle / Patrol subject)
      targetX += targetVelX;
      targetY += targetVelY;
      if (targetX > w - 100 || targetX < 80) targetVelX *= -1;
      if (targetY > h * 0.75 || targetY < h * 0.55) targetVelY *= -1;

      // Draw vehicle / subject body
      ctx.fillStyle = visionMode === 'IR_THERMAL' ? '#ef4444' : '#334155';
      ctx.fillRect(targetX, targetY, 60, 24);
      // Wheels / cabin
      ctx.fillStyle = visionMode === 'IR_THERMAL' ? '#fbbf24' : '#1e293b';
      ctx.fillRect(targetX + 12, targetY - 14, 34, 14);
      ctx.fillRect(targetX + 8, targetY + 22, 12, 6);
      ctx.fillRect(targetX + 40, targetY + 22, 12, 6);

      // Motion Detection Bounding Box
      if (showMotionBox) {
        ctx.strokeStyle = systemState === 'EMERGENCY' ? '#ef4444' : '#22c55e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(targetX - 8, targetY - 20, 76, 52);
        ctx.fillStyle = systemState === 'EMERGENCY' ? '#ef4444' : '#22c55e';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(
          systemState === 'EMERGENCY' ? '⚠ ALERT: TARGET 01' : 'TRACKING: PATROL-V3',
          targetX - 8,
          targetY - 24
        );
      }

      // Surveillance Crosshairs
      if (showCrosshairs) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.lineWidth = 1;
        // Center cross
        ctx.beginPath();
        ctx.moveTo(w / 2 - 20, h / 2);
        ctx.lineTo(w / 2 + 20, h / 2);
        ctx.moveTo(w / 2, h / 2 - 20);
        ctx.lineTo(w / 2, h / 2 + 20);
        ctx.stroke();

        // Corner brackets
        const bSize = 16;
        ctx.beginPath();
        // Top Left
        ctx.moveTo(20, 20 + bSize); ctx.lineTo(20, 20); ctx.lineTo(20 + bSize, 20);
        // Top Right
        ctx.moveTo(w - 20 - bSize, 20); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20, 20 + bSize);
        // Bottom Left
        ctx.moveTo(20, h - 20 - bSize); ctx.lineTo(20, h - 20); ctx.lineTo(20 + bSize, h - 20);
        // Bottom Right
        ctx.moveTo(w - 20 - bSize, h - 20); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20, h - 20 - bSize);
        ctx.stroke();
      }

      // Simulate Radio Fading / Congestion Artifacts
      const isWeak = networkConditions.signalQuality === 'POOR';
      const isCongested = networkConditions.load === 'CONGESTED';

      if (isWeak || isCongested) {
        // Artifact blocks
        const noiseCount = isCongested && isWeak ? 24 : 10;
        for (let i = 0; i < noiseCount; i++) {
          const nx = Math.random() * w;
          const ny = Math.random() * h;
          const nw = 30 + Math.random() * 60;
          const nh = 6 + Math.random() * 12;
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(239, 68, 68, 0.3)';
          ctx.fillRect(nx, ny, nw, nh);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isTransmitting, systemState, visionMode, showCrosshairs, showMotionBox, networkConditions]);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice if Emergency or Congested */}
      {systemState === 'EMERGENCY' && (
        <div className="rounded-xl border border-red-500/80 bg-red-950/80 p-3.5 flex items-center justify-between text-red-200 animate-pulse glow-red">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <strong className="text-white font-mono text-sm block">🚨 EMERGENCY ALERT ENGAGED</strong>
              <span className="text-xs text-red-300">
                Live mobile camera CAMERA-01 transmitting tactical alert. Audio/video queue prioritized over background telemetry.
              </span>
            </div>
          </div>
          <button
            onClick={triggerEmergency}
            className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-white font-mono text-xs font-bold"
          >
            Re-send Strobe
          </button>
        </div>
      )}

      {networkConditions.load === 'CONGESTED' && systemState !== 'EMERGENCY' && (
        <div className="rounded-xl border border-amber-500/80 bg-amber-950/70 p-3.5 flex items-center gap-3 text-amber-200">
          <Shield className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <strong className="text-amber-100 font-semibold block">QoS / Admission Mechanisms Protecting Priority Traffic</strong>
            <span>
              Network load is currently <strong>CONGESTED</strong>. 3G RNC scheduler is throttling low-priority background data to maintain video streaming at 256 kbps.
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Video Stream Left, Telemetry Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Surveillance Screen */}
        <div className="lg:col-span-8 space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl relative">
            {/* Surveillance Feed Top Bar */}
            <div className="bg-slate-950/90 border-b border-slate-800/90 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isTransmitting ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
                  <span className={`font-bold ${isTransmitting ? 'text-red-400' : 'text-slate-500'}`}>
                    {isTransmitting ? 'LIVE REC' : 'STANDBY'}
                  </span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400 font-bold">{activeCamId}</span>
                <span className="text-slate-400 hidden sm:inline">(Patrol Vehicle Unit Alpha)</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="hidden md:inline text-[11px]">H.264 Baseline • CIF 352×288</span>
                <span className="text-slate-600 hidden md:inline">|</span>
                <span className="text-cyan-300 font-bold">{telemetry.bitrateKbps} kbps</span>
              </div>
            </div>

            {/* Video Canvas Viewport */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-cover"
              />

              {/* Scanline Overlay */}
              <div className="absolute inset-0 surveillance-scanlines opacity-50" />

              {/* In-Video HUD Overlays */}
              {isTransmitting && (
                <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between text-xs font-mono select-none">
                  {/* Top Row in Video */}
                  <div className="flex justify-between items-start">
                    <div className="bg-slate-950/80 border border-slate-800/80 px-2.5 py-1 rounded text-cyan-300 flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>Node B: {handoverState.activeCell} ({handoverState.cellASignal} dB)</span>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 px-2.5 py-1 rounded text-emerald-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>QoS: Conversational / Streaming</span>
                    </div>
                  </div>

                  {/* Bottom Row in Video */}
                  <div className="flex justify-between items-end">
                    <div className="bg-slate-950/80 border border-slate-800/80 px-2.5 py-1 rounded text-slate-300 space-y-0.5 text-[11px]">
                      <div>GPS: 37°46'21.4"N 122°24'36.8"W</div>
                      <div>Speed: {handoverState.isMobilityActive ? '42 km/h' : '0 km/h'} • Heading: 184° S</div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 px-2.5 py-1 rounded text-amber-300 text-right text-[11px]">
                      <div>Latency: {telemetry.latencyMs} ms</div>
                      <div>Loss: {telemetry.packetLossPct}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Control Bar */}
            <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Camera Switcher */}
              <div className="flex items-center gap-2">
                {(['CAM-01', 'CAM-02', 'CAM-03'] as const).map(cam => (
                  <button
                    key={cam}
                    onClick={() => setActiveCamId(cam)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                      activeCamId === cam
                        ? 'bg-cyan-600 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cam}
                  </button>
                ))}
              </div>

              {/* Vision Filters */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setVisionMode('NORMAL')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    visionMode === 'NORMAL'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Day/Night
                </button>
                <button
                  onClick={() => setVisionMode('IR_THERMAL')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                    visionMode === 'IR_THERMAL'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  Thermal IR
                </button>
              </div>

              {/* Overlays Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCrosshairs(!showCrosshairs)}
                  className={`p-1.5 rounded text-xs ${showCrosshairs ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-500'}`}
                  title="Toggle Reticle Crosshairs"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowMotionBox(!showMotionBox)}
                  className={`p-1.5 rounded text-xs ${showMotionBox ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}
                  title="Toggle AI Motion Bounding Box"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <EducationalNote
            title="Video Compression & Transmission over 3G"
            topic="Radio Bandwidth & Codec Constraints"
          >
            <p>
              <strong>Why Video is Compressed:</strong> Raw standard-definition video requires tens of megabits per second. WCDMA 3G radio carriers (5 MHz wide) allocate individual mobile camera radio bearers typically between 64 kbps and 384 kbps (256 kbps in this reference design). Advanced compression (H.264 Baseline Profile / MPEG-4) reduces spatial and temporal redundancy, enabling smooth 15–25 fps surveillance streams over wireless channels.
            </p>
          </EducationalNote>
        </div>

        {/* Right Column: System Information Panel (Prompt Section 6) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2 m-0">
                <Activity className="w-4 h-4 text-cyan-400" />
                System Information Panel
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                NODE STATUS: OK
              </span>
            </div>

            {/* Spec items listed in Assignment Requirement */}
            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Connection:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {isTransmitting ? 'CONNECTED' : 'STANDBY'}
                </span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Technology:</span>
                <span className="text-cyan-300 font-semibold">3G / WCDMA FDD</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Bitrate:</span>
                <span className="text-white font-bold">{telemetry.bitrateKbps} kbps</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Latency:</span>
                <span className={`${telemetry.latencyMs > 250 ? 'text-amber-400' : 'text-emerald-300'} font-bold`}>
                  {telemetry.latencyMs} ms
                </span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Packet Loss:</span>
                <span className={`${telemetry.packetLossPct > 3 ? 'text-red-400' : 'text-slate-200'}`}>
                  {telemetry.packetLossPct} %
                </span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Signal:</span>
                <span className={`font-semibold ${
                  networkConditions.signalQuality === 'EXCELLENT' ? 'text-emerald-400' :
                  networkConditions.signalQuality === 'GOOD' ? 'text-cyan-400' :
                  networkConditions.signalQuality === 'FAIR' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {networkConditions.signalQuality} ({networkConditions.signalStrengthDbm} dBm)
                </span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">QoS Class:</span>
                <span className="text-indigo-400 font-bold">HIGH PRIORITY</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Authentication:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  AUTHENTICATED (AKA)
                </span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-400">Session:</span>
                <span className="text-cyan-300 font-bold">
                  {isTransmitting ? 'ACTIVE (PDP CONTEXT)' : 'READY'}
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={triggerEmergency}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Trigger Mobile Emergency Alarm</span>
              </button>

              <div className="text-[11px] text-slate-500 text-center font-mono">
                Active Cell: <strong className="text-slate-300">{handoverState.activeCell}</strong> • Handover Count: <strong className="text-slate-300">{handoverState.handoversCount}</strong>
              </div>
            </div>
          </div>

          <EducationalNote
            title="Interactive Monitoring Latency Target"
            topic="QoS & Operator Response"
            defaultOpen={false}
          >
            <p>
              In mobile surveillance and emergency monitoring, <strong>one-way glass-to-glass latency</strong> should remain under 350 ms. This allows control-room operators to respond dynamically to security intrusions or steer Pan/Tilt/Zoom (PTZ) camera mounts without experiencing disorienting delays.
            </p>
          </EducationalNote>
        </div>
      </div>
    </div>
  );
};
