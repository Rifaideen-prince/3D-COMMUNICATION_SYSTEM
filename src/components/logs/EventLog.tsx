import React, { useState } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const EventLog: React.FC = () => {
  const { eventLogs, clearLogs } = useSimulation();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredLogs = eventLogs.filter(log => {
    if (filter === 'ALL') return true;
    if (filter === 'EMERGENCY') return log.type === 'EMERGENCY';
    if (filter === 'HANDOVER') return log.type === 'HANDOVER';
    if (filter === 'WARNING') return log.type === 'WARNING';
    if (filter === 'SUCCESS') return log.type === 'SUCCESS';
    return true;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 m-0">
            Real-Time Network Event Log
          </h3>
          <span className="text-[10px] text-slate-500 font-normal">
            ({eventLogs.length} events logged)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-[10px]">
            {['ALL', 'EMERGENCY', 'HANDOVER', 'WARNING', 'SUCCESS'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={clearLogs}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer"
            title="Clear Event Log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Entries Container */}
      <div className="h-48 overflow-y-auto space-y-1 text-xs pr-1 scrollbar-thin">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs">
            No events match the selected filter.
          </div>
        ) : (
          filteredLogs.map(log => {
            let badgeStyle = 'text-cyan-400 bg-cyan-950 border-cyan-800';
            if (log.type === 'EMERGENCY') badgeStyle = 'text-red-400 bg-red-950 border-red-800 animate-pulse font-bold';
            if (log.type === 'HANDOVER') badgeStyle = 'text-indigo-400 bg-indigo-950 border-indigo-800 font-bold';
            if (log.type === 'WARNING') badgeStyle = 'text-amber-400 bg-amber-950 border-amber-800 font-semibold';
            if (log.type === 'SUCCESS') badgeStyle = 'text-emerald-400 bg-emerald-950 border-emerald-800';

            return (
              <div
                key={log.id}
                className="py-1 px-2 rounded hover:bg-slate-800/40 flex items-start gap-2.5 transition-colors"
              >
                <span className="text-slate-500 shrink-0 text-[11px]">
                  [{log.timestamp}]
                </span>
                <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase shrink-0 ${badgeStyle}`}>
                  {log.source}
                </span>
                <span className={`text-[11px] leading-tight ${log.type === 'EMERGENCY' ? 'text-red-300 font-bold' : 'text-slate-300'}`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
