import React from 'react';
import { Camera, Sliders, Sparkles, Compass, Calculator, Download, Activity, CheckCircle2 } from 'lucide-react';
import { LandScanningStep } from './LandScanningStep';
import { RequirementsStep } from './RequirementsStep';
import { AIGenerationStep } from './AIGenerationStep';
import { VastuAuditStep } from './VastuAuditStep';
import { CostBOQStep } from './CostBOQStep';
import { CADExportStep } from './CADExportStep';
import { DigitalTwinStep } from './DigitalTwinStep';

export function WizardStepContainer({ currentStep, setCurrentStep, config, setConfig }) {
  const steps = [
    { id: 1, name: 'Land Scan', icon: Camera },
    { id: 2, name: 'Requirements', icon: Sliders },
    { id: 3, name: 'AI Generator', icon: Sparkles },
    { id: 4, name: 'Vastu & Code', icon: Compass },
    { id: 5, name: 'Cost & BOQ', icon: Calculator },
    { id: 6, name: 'CAD Export', icon: Download },
    { id: 7, name: 'Digital Twin', icon: Activity },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-6">
      {/* Step Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 overflow-x-auto gap-2 no-scrollbar">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <button
              key={`step-tab-${step.id}`}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap border ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10 font-bold'
                  : isCompleted
                  ? 'bg-slate-900 text-emerald-400 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/50 text-slate-500 border-slate-900 hover:border-slate-800'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              )}
              <span>{step.id}. {step.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Content */}
      <div className="min-h-[420px]">
        {currentStep === 1 && (
          <LandScanningStep config={config} setConfig={setConfig} onNext={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <RequirementsStep config={config} setConfig={setConfig} onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />
        )}

        {currentStep === 3 && (
          <AIGenerationStep config={config} onNext={() => setCurrentStep(4)} onPrev={() => setCurrentStep(2)} />
        )}

        {currentStep === 4 && (
          <VastuAuditStep config={config} onNext={() => setCurrentStep(5)} onPrev={() => setCurrentStep(3)} />
        )}

        {currentStep === 5 && (
          <CostBOQStep config={config} onNext={() => setCurrentStep(6)} onPrev={() => setCurrentStep(4)} />
        )}

        {currentStep === 6 && (
          <CADExportStep config={config} onNext={() => setCurrentStep(7)} onPrev={() => setCurrentStep(5)} />
        )}

        {currentStep === 7 && (
          <DigitalTwinStep config={config} onPrev={() => setCurrentStep(6)} />
        )}
      </div>
    </div>
  );
}
