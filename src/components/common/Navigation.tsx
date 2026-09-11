import React from 'react';
import {
  Video,
  Network,
  Sliders,
  Car,
  Calculator,
  ShieldCheck,
  Clock,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export type TabId =
  | 'dashboard'
  | 'architecture'
  | 'qos'
  | 'mobility'
  | 'calculator'
  | 'security'
  | 'timeline'
  | 'analytics'
  | 'reference';

interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { handoverState, telemetry } = useSimulation();

  const tabs = [
    {
      id: 'dashboard' as TabId,
      label: 'Live Surveillance',
      icon: Video,
      badge: telemetry.bitrateKbps > 0 ? `${telemetry.bitrateKbps} kbps` : null,
      badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800'
    },
    {
      id: 'architecture' as TabId,
      label: '3G Architecture & Packets',
      icon: Network,
      badge: telemetry.packetsSent > 0 ? `${telemetry.packetsSent} pkts` : null,
      badgeColor: 'bg-blue-950 text-blue-400 border border-blue-800'
    },
    {
      id: 'qos' as TabId,
      label: 'QoS & Congestion',
      icon: Sliders,
      badge: telemetry.admissionStatus === 'REJECTED' ? 'REJECTED' : null,
      badgeColor: 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
    },
    {
      id: 'mobility' as TabId,
      label: 'Mobility & Handover',
      icon: Car,
      badge: handoverState.status === 'HANDOVER_INITIATED' ? 'HANDOVER' : handoverState.activeCell,
      badgeColor: handoverState.status === 'HANDOVER_INITIATED' ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse' : 'bg-slate-800 text-slate-300'
    },
    {
      id: 'calculator' as TabId,
      label: 'Capacity Calculator',
      icon: Calculator,
      badge: '5.12 Mbps Model',
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'security' as TabId,
      label: 'Security & 3GPP AKA',
      icon: ShieldCheck,
      badge: 'Mutual Auth',
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800'
    },
    {
      id: 'timeline' as TabId,
      label: 'Operation Scenario',
      icon: Clock,
      badge: '7 Stages',
      badgeColor: 'bg-indigo-950 text-indigo-400 border border-indigo-800'
    },
    {
      id: 'analytics' as TabId,
      label: 'Telemetry & Charts',
      icon: BarChart3,
      badge: `${telemetry.latencyMs} ms`,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'reference' as TabId,
      label: 'Specs & 3G Guide',
      icon: BookOpen,
      badge: 'Standards',
      badgeColor: 'bg-slate-800 text-slate-400'
    }
  ];

  return (
    <div className="bg-slate-900/80 border-b border-slate-800 sticky top-[65px] z-30 px-4 lg:px-8 backdrop-blur overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
