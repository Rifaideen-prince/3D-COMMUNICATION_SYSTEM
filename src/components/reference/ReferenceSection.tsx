import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Layers,
  Cpu,
  HelpCircle
} from 'lucide-react';
import {
  EQUIPMENT_TABLE,
  APPLICATION_REQUIREMENTS,
  ADVANTAGES_LIMITATIONS,
  TECH_PRIMER,
  ACADEMIC_REFERENCES
} from '../../data/systemData';


export const ReferenceSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
          Academic Engineering Reference
        </span>
        <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1 m-0">
          3G Communication System Specifications & Academic Literature
        </h2>
        <p className="text-xs text-slate-400 m-0 mt-0.5">
          Based on 3GPP UMTS Release 99/4/5 standards, ITU IMT-2000 recommendations, and network engineering literature.
        </p>
      </div>

      {/* Equipment Table (Prompt Section 15) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2 m-0">
            <Cpu className="w-4 h-4 text-cyan-400" />
            System Components & Equipment Inventory
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            8 Primary Modules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5 font-semibold w-1/4">Component</th>
                <th className="pb-2.5 font-semibold w-1/2">Purpose & Operational Role</th>
                <th className="pb-2.5 font-semibold w-1/4">Standard Technical Specifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {EQUIPMENT_TABLE.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pr-3 font-bold text-cyan-300">
                    {item.component}
                  </td>
                  <td className="py-3 pr-3 text-slate-300 font-sans text-xs leading-relaxed">
                    {item.purpose}
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {item.specs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Requirements Table (Prompt Section 17) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2 m-0">
            <Layers className="w-4 h-4 text-cyan-400" />
            Application Requirements Matrix
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Real-Time Mobile Surveillance & Emergency Monitoring
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {APPLICATION_REQUIREMENTS.map((req, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                {req.label}
              </span>
              <div className="text-xs font-bold text-white font-mono">
                {req.value}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans m-0">
                {req.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Advantages & Limitations of 3G (Prompt Section 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advantages */}
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono m-0">
              Advantages of 3G for Real-Time Surveillance
            </h3>
          </div>
          <div className="space-y-3">
            {ADVANTAGES_LIMITATIONS.advantages.map((adv, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-emerald-900/40 space-y-1">
                <h4 className="text-xs font-bold text-emerald-300 font-mono m-0">
                  ✔ {adv.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed m-0 font-sans">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div className="rounded-2xl border border-amber-500/40 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <XCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono m-0">
              Engineering Limitations & 4G/5G Comparison
            </h3>
          </div>
          <div className="space-y-3">
            {ADVANTAGES_LIMITATIONS.limitations.map((lim, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-amber-900/40 space-y-1">
                <h4 className="text-xs font-bold text-amber-300 font-mono m-0">
                  ⚠ {lim.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed m-0 font-sans">
                  {lim.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Information Primer (Prompt Section 19) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2 m-0">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            3G / UMTS / WCDMA Terminology Primer
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Core Telecommunications Concepts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TECH_PRIMER.map((term, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-cyan-300 font-mono block">
                {term.term}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans m-0">
                {term.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic References (Prompt Section 30) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2 m-0">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Verified Academic & Standard References
          </h3>
          <span className="text-[11px] font-mono text-slate-400">3GPP / ITU-R Standards</span>
        </div>

        <div className="space-y-3">
          {ACADEMIC_REFERENCES.map((ref, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <div className="font-bold text-cyan-300">{ref.standard}</div>
                <div className="text-white font-medium font-sans text-xs mt-0.5">{ref.title}</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">{ref.notes}</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                {ref.publisher}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Disclaimer (Prompt Section 31) */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono text-slate-400 space-y-1.5 text-center">
        <span className="text-cyan-400 font-bold uppercase tracking-wider block">
          Academic Simulation Notice
        </span>
        <p className="m-0 max-w-2xl mx-auto">
          "This is an educational simulation based on the proposed 3G architecture. It demonstrates the technical principles of WCDMA radio access, packet core transport, QoS prioritization, and mobility management rather than establishing a live cellular operator connection."
        </p>
      </div>
    </div>
  );
};
