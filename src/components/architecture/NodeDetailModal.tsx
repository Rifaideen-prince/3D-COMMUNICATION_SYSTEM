import React from 'react';
import { X, CheckCircle2, Radio } from 'lucide-react';
import type { NetworkNodeData } from '../../types/system';


interface NodeDetailModalProps {
  node: NetworkNodeData | null;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-2xl w-full rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Node Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
            <Radio className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-800">
              {node.category}
            </span>
            <h3 className="text-xl font-bold text-white font-['Outfit'] mt-1 mb-0.5">
              {node.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono m-0">
              {node.subtitle} • Status: <span className="text-emerald-400 font-bold">{node.status}</span>
            </p>
          </div>
        </div>

        {/* Core Sections */}
        <div className="space-y-4 text-xs">
          {/* Purpose */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs uppercase font-mono text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
              <span>🎯 Component Purpose</span>
            </h4>
            <p className="text-slate-200 leading-relaxed m-0">
              {node.purpose}
            </p>
          </div>

          {/* Role in Real-Time Communication */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-900/50">
            <h4 className="text-xs uppercase font-mono text-cyan-300 font-bold mb-1.5 flex items-center gap-1.5">
              <span>⚡ Role in Real-Time Communication</span>
            </h4>
            <p className="text-slate-300 leading-relaxed m-0">
              {node.roleInRealTime}
            </p>
          </div>

          {/* Main Functions */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs uppercase font-mono text-slate-300 font-bold mb-2">
              ⚙️ Main Telecommunications Functions
            </h4>
            <ul className="space-y-1.5 text-slate-300 m-0 pl-1">
              {node.functions.map((func, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{func}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Subcomponents if present (e.g., Camera, Mic, Encoder, 3G Modem, Battery) */}
          {node.subComponents && node.subComponents.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <h4 className="text-xs uppercase font-mono text-slate-300 font-bold mb-2">
                📦 Internal Subcomponents & Hardware Modules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {node.subComponents.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Handled */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs uppercase font-mono text-slate-300 font-bold mb-1.5">
              📊 Data & Protocols Handled
            </h4>
            <p className="text-slate-300 leading-relaxed m-0 mb-2">
              {node.dataHandled}
            </p>
            {node.protocols && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {node.protocols.map((proto, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                    {proto}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Technical Specs */}
          {node.specs && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <h4 className="text-xs uppercase font-mono text-slate-300 font-bold mb-2">
                📐 Engineering Parameters & Radio Specs
              </h4>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                {Object.entries(node.specs).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-slate-900/90 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">{key}</span>
                    <span className="text-cyan-300 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
