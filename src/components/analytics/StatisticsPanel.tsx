import React from 'react';
import {
  BarChart3,
  Activity,
  Send,
  Download,
  AlertTriangle,
  Car,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useSimulation } from '../../context/SimulationContext';
import { EventLog } from '../logs/EventLog';

export const StatisticsPanel: React.FC = () => {
  const { telemetry, chartHistory, networkConditions, handoverState } = useSimulation();

  const kpis = [
    {
      label: 'Active Cameras',
      value: `${networkConditions.activeCameras} Units`,
      sub: 'Simultaneous surveillance streams',
      icon: Activity,
      color: 'text-cyan-400'
    },
    {
      label: 'Current Bitrate',
      value: `${telemetry.bitrateKbps} kbps`,
      sub: 'Uplink throughput',
      icon: Zap,
      color: 'text-emerald-400'
    },
    {
      label: 'Average Latency',
      value: `${telemetry.latencyMs} ms`,
      sub: 'One-way transport delay',
      icon: Clock,
      color: telemetry.latencyMs > 250 ? 'text-amber-400' : 'text-cyan-400'
    },
    {
      label: 'Packet Loss',
      value: `${telemetry.packetLossPct} %`,
      sub: 'Air-interface & core drop rate',
      icon: TrendingUp,
      color: telemetry.packetLossPct > 3 ? 'text-red-400' : 'text-slate-200'
    },
    {
      label: 'Packets Transmitted',
      value: telemetry.packetsSent.toLocaleString(),
      sub: `${telemetry.packetsReceived.toLocaleString()} delivered`,
      icon: Send,
      color: 'text-indigo-400'
    },
    {
      label: 'Packets Dropped',
      value: telemetry.packetsDropped.toLocaleString(),
      sub: 'Low-priority throttled',
      icon: Download,
      color: telemetry.packetsDropped > 0 ? 'text-amber-400' : 'text-slate-400'
    },
    {
      label: 'Successful Handovers',
      value: `${handoverState.handoversCount} Events`,
      sub: 'WCDMA soft handovers',
      icon: Car,
      color: 'text-blue-400'
    },
    {
      label: 'Emergency Alerts',
      value: `${telemetry.emergencyAlertsCount}`,
      sub: 'Critical priority strobes',
      icon: AlertTriangle,
      color: telemetry.emergencyAlertsCount > 0 ? 'text-red-400' : 'text-slate-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md font-mono"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                  {kpi.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
              <div className={`text-xl font-extrabold ${kpi.color} font-['Outfit']`}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Throughput breakdown over time */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2 m-0">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              Traffic Throughput Over Time (kbps)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live Window (20s)</span>
          </div>

          <div className="h-56 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVideo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAudio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Area type="monotone" dataKey="videoRate" name="Video Stream" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVideo)" />
                <Area type="monotone" dataKey="audioRate" name="Audio Voice" stroke="#a855f7" fillOpacity={1} fill="url(#colorAudio)" />
                <Area type="monotone" dataKey="backgroundRate" name="Background Data" stroke="#64748b" fill="#334155" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Latency & Packet Loss over time */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2 m-0">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Latency (ms) & Packet Loss (%) Telemetry
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live Window (20s)</span>
          </div>

          <div className="h-56 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#f59e0b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="packetLoss" name="Packet Loss (%)" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-Time Event Log */}
      <EventLog />
    </div>
  );
};
