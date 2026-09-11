import React, { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import type { TabId } from './components/common/Navigation';
import { LiveMonitor } from './components/dashboard/LiveMonitor';
import { NetworkArchitecture } from './components/architecture/NetworkArchitecture';
import { QoSPanel } from './components/qos/QoSPanel';
import { MobilitySimulation } from './components/mobility/MobilitySimulation';
import { CapacityCalculator } from './components/calculator/CapacityCalculator';
import { SecurityPanel } from './components/security/SecurityPanel';
import { OperationTimeline } from './components/scenario/OperationTimeline';
import { StatisticsPanel } from './components/analytics/StatisticsPanel';
import { ReferenceSection } from './components/reference/ReferenceSection';
import { EmergencyModal } from './components/emergency/EmergencyModal';
import { Radio } from 'lucide-react';


const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Header */}
      <Header />

      {/* Global Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {activeTab === 'dashboard' && <LiveMonitor />}
        {activeTab === 'architecture' && <NetworkArchitecture />}
        {activeTab === 'qos' && <QoSPanel />}
        {activeTab === 'mobility' && <MobilitySimulation />}
        {activeTab === 'calculator' && <CapacityCalculator />}
        {activeTab === 'security' && <SecurityPanel />}
        {activeTab === 'timeline' && <OperationTimeline />}
        {activeTab === 'analytics' && <StatisticsPanel />}
        {activeTab === 'reference' && <ReferenceSection />}
      </main>

      {/* Global Emergency Modal Dialog */}
      <EmergencyModal />

      {/* Engineering Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 lg:px-8 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Radio className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-300">Design of a 3G Communication System for Real-Time Applications</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>UMTS / WCDMA FDD (3.84 Mcps)</span>
            <span>•</span>
            <span>3GPP TS 23.060 / TS 25.401</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">Academic Simulation Model</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <SimulationProvider>
      <MainContent />
    </SimulationProvider>
  );
}

export default App;
