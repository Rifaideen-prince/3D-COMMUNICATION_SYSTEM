import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Lock,
  FileText,
  CheckCircle2,
  Shield,
  Clock
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { EducationalNote } from '../common/EducationalNote';

export const SecurityPanel: React.FC = () => {
  const { auditLogs } = useSimulation();
  const [activeStep, setActiveStep] = useState<number>(4);

  const securityPipeline = [

    {
      id: 1,
      title: '1. Mobile Camera (USIM)',
      desc: 'USIM hardware security module holds IMSI and permanent root key (K).'
    },
    {
      id: 2,
      title: '2. 3GPP AKA Authentication',
      desc: 'SGSN / HLR challenge with RAND and AUTN; camera computes RES and session keys (CK, IK).'
    },
    {
      id: 3,
      title: '3. Authorization & PDP Context',
      desc: 'GGSN verifies subscriber profile; allocates private IP address inside dedicated APN.'
    },
    {
      id: 4,
      title: '4. Secure Air Interface (Kasumi/f8)',
      desc: 'WCDMA Uu air interface ciphering using 128-bit Cipher Key (CK).'
    },
    {
      id: 5,
      title: '5. IPsec Core VPN Tunnel',
      desc: 'AES-256 encrypted tunnel shields traffic traversing terrestrial private IP network.'
    },
    {
      id: 6,
      title: '6. Monitoring Center & Audit',
      desc: 'Role-based access control (RBAC), operator login, and immutable security audit logs.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
            3GPP Security Architecture
          </span>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1 m-0">
            Authentication, Confidentiality & Audit Trail
          </h2>
          <p className="text-xs text-slate-300 m-0 mt-0.5">
            Demonstrating 3GPP AKA mutual authentication, air-interface ciphering, IPsec tunneling, and operator access controls.
          </p>
        </div>

        {/* Security Summary Badge */}
        <div className="px-3 py-1.5 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-600 text-xs font-mono font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SESSION: FULLY ENCRYPTED</span>
        </div>
      </div>

      {/* Security Status Indicators (Prompt Section 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Subscriber:</span>
          <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            AUTHENTICATED
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Authorization:</span>
          <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            AUTHORIZED
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Session:</span>
          <span className="text-cyan-400 font-bold text-sm flex items-center gap-1.5 mt-1">
            <Lock className="w-3.5 h-3.5" />
            SECURE (CK/IK)
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Access Control:</span>
          <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-1">
            <Shield className="w-3.5 h-3.5" />
            ENABLED (RBAC)
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-slate-400 block text-[10px] uppercase">Audit Logging:</span>
          <span className="text-indigo-400 font-bold text-sm flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5" />
            ACTIVE
          </span>
        </div>
      </div>

      {/* Visual Security Flow: Camera → Auth → Authz → Secure Session → Encrypted Traffic → Monitoring Center */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono border-b border-slate-800 pb-3 m-0 flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" />
          End-to-End Security Lifecycle
        </h3>

        {/* Step-by-Step Flow Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {securityPipeline.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveStep(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                activeStep === item.id
                  ? 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold text-white font-mono m-0">
                  {item.title}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed m-0 font-sans">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Log Table (Prompt Section 13) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2 m-0">
            <FileText className="w-4 h-4 text-cyan-400" />
            Security & Operational Audit Log
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Immutable Audit Trail
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Time</th>
                <th className="pb-2 font-semibold">Device ID</th>
                <th className="pb-2 font-semibold">User / Operator</th>
                <th className="pb-2 font-semibold">Action</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 pr-3 text-slate-400">{log.time}</td>
                  <td className="py-2.5 pr-3 text-cyan-300 font-bold">{log.deviceId}</td>
                  <td className="py-2.5 pr-3 text-slate-200">{log.user}</td>
                  <td className="py-2.5 pr-3 text-white font-medium">{log.action}</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : log.status === 'HIGH PRIORITY'
                          ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400 text-[11px] font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EducationalNote
        title="Why Subscriber Authentication is Required"
        topic="Security Principles"
      >
        <p>
          <strong>Access Control & Confidentiality:</strong> In mobile surveillance and public safety applications, unauthorized devices must never be allowed to spoof camera feeds or access the internal police/security network. 
        </p>
        <p>
          <strong>3GPP AKA (Authentication & Key Agreement):</strong> Establishes mutual trust: the camera verifies the network is legitimate (preventing rogue base stations), and the network verifies the camera's USIM credentials. During this handshake, cryptographic Cipher Keys (CK) and Integrity Keys (IK) are derived to encrypt all video packets over the wireless air interface.
        </p>
      </EducationalNote>
    </div>
  );
};
