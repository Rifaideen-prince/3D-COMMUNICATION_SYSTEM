import React from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Video,
  Car,
  Sliders,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

import { SCENARIO_STEPS } from '../../data/scenarioData';
import { EducationalNote } from '../common/EducationalNote';

export const OperationTimeline: React.FC = () => {
  const {
    scenarioState,
    runFullScenario,
    pauseScenario,
    jumpToScenarioStep,
    setScenarioSpeed,
    resetSystem
  } = useSimulation();

  const getStepIcon = (num: number) => {
    switch (num) {
      case 1: return Radio;
      case 2: return Video;
      case 3: return Car;
      case 4: return Car;
      case 5: return Sliders;
      case 6: return AlertTriangle;
      case 7: return FileText;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Automated Player Controls */}
      <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
            Automated Scenario Execution Engine
          </span>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1 m-0">
            Real-Time Operation Sequence (7 Stages)
          </h2>
          <p className="text-xs text-slate-400 m-0 mt-0.5">
            Demonstrates the complete lifecycle of 3G mobile video surveillance from camera power-up to mission debrief.
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            id="btn-run-scenario-main"
            onClick={runFullScenario}
            disabled={scenarioState.isRunning}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN FULL SCENARIO</span>
          </button>

          <button
            onClick={pauseScenario}
            disabled={!scenarioState.isRunning}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-xs font-mono">
            <button
              onClick={() => setScenarioSpeed(1)}
              className={`px-2 py-1 rounded ${scenarioState.speed === 1 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
            >
              1x
            </button>
            <button
              onClick={() => setScenarioSpeed(2)}
              className={`px-2 py-1 rounded ${scenarioState.speed === 2 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
            >
              2x Fast
            </button>
          </div>

          <button
            onClick={resetSystem}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Reset Scenario"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar of Currently Active Step */}
      {scenarioState.isRunning && (
        <div className="rounded-xl border border-indigo-500/50 bg-slate-900/90 p-4 shadow-md space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-indigo-300 font-bold">
              Executing Step {scenarioState.currentStepIndex + 1} of 7: {SCENARIO_STEPS[scenarioState.currentStepIndex]?.title}
            </span>
            <span className="text-cyan-400 font-bold">{scenarioState.stepProgress}%</span>
          </div>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-100"
              style={{ width: `${scenarioState.stepProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 7-Step Interactive Vertical Timeline */}
      <div className="space-y-3">
        {SCENARIO_STEPS.map((step, idx) => {
          const Icon = getStepIcon(step.stepNumber);
          const isCurrent = scenarioState.isRunning && scenarioState.currentStepIndex === idx;
          const isCompleted = scenarioState.currentStepIndex > idx;

          return (
            <div
              key={step.stepNumber}
              onClick={() => jumpToScenarioStep(idx)}
              className={`rounded-2xl border p-5 transition-all cursor-pointer select-none ${
                isCurrent
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-[0_0_25px_rgba(99,102,241,0.3)]'
                  : isCompleted
                  ? 'border-emerald-800/80 bg-slate-900/60'
                  : 'border-slate-800/90 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step Icon Badge */}
                <div
                  className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white animate-bounce'
                      : isCompleted
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        STAGE {step.stepNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white font-['Outfit'] m-0">
                        {step.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      State: <strong className="text-cyan-300">{step.expectedState}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed m-0 mb-2">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-500">System Action:</span>
                    <span className="text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {step.systemAction}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EducationalNote
        title="Real-Time Operation Sequence Analysis"
        topic="End-to-End Mission Workflow"
      >
        <p>
          This 7-stage sequence illustrates the end-to-end engineering workflow: establishing radio links and authentication, negotiating guaranteed radio access bearers (256 kbps), preserving the video stream across cell boundaries through soft handover, protecting delay-sensitive media through strict priority queuing under severe congestion, and expediting emergency alarm packets to command personnel.
        </p>
      </EducationalNote>
    </div>
  );
};
