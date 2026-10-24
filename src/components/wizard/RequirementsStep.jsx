import React from 'react';
import { Sliders, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export function RequirementsStep({ config, setConfig, onNext, onPrev }) {
  const styles = [
    { id: 'modern', name: 'Modern Contemporary', desc: 'Sleek glass, timber louvers & cantilever balconies' },
    { id: 'minimalist', name: 'Ultra Minimalist', desc: 'Clean white monolithic geometry with micro-cement' },
    { id: 'traditional', name: 'Kerala / Chettinad Traditional', desc: 'Sloped clay roofs, open courtyard breezeway' },
    { id: 'industrial', name: 'Industrial Loft', desc: 'Exposed structural steel columns, raw concrete & brick' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          Step 2: AI User Requirements & Specs
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize floor count, budget limits, room program, Vastu rules & luxury features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Floors & BHK */}
        <div className="glass-card p-4 space-y-3">
          <label className="text-xs font-mono text-cyan-400 uppercase font-semibold">Number of Floors</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={`floor-opt-${num}`}
                onClick={() => setConfig({ ...config, floors: num })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition border ${
                  config.floors === num
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {num} {num === 1 ? 'Floor (G)' : `Floors (G+${num - 1})`}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 space-y-3">
          <label className="text-xs font-mono text-cyan-400 uppercase font-semibold">Bedrooms (BHK Count)</label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map((bhk) => (
              <button
                key={`bhk-opt-${bhk}`}
                onClick={() => setConfig({ ...config, bhk: bhk })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition border ${
                  config.bhk === bhk
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {bhk} BHK
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Budget Slider */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-cyan-400 uppercase font-semibold">Target Construction Budget</label>
          <span className="text-sm font-bold text-emerald-400 font-mono">₹{config.budgetLakhs} Lakhs</span>
        </div>
        <input
          type="range"
          min="30"
          max="300"
          step="5"
          value={config.budgetLakhs}
          onChange={(e) => setConfig({ ...config, budgetLakhs: Number(e.target.value) })}
          className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>₹30L (Economy)</span>
          <span>₹150L (Premium Villa)</span>
          <span>₹300L (Luxury Mansion)</span>
        </div>
      </div>

      {/* Architectural Style Selection */}
      <div className="space-y-3">
        <label className="text-xs font-mono text-slate-300 uppercase font-semibold block">Architectural Design Style</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {styles.map((style) => (
            <div
              key={style.id}
              onClick={() => setConfig({ ...config, architecturalStyle: style.id })}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                config.architecturalStyle === style.id
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-200">{style.name}</div>
              <div className="text-[11px] text-slate-400 mt-1">{style.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury & Vastu Toggles */}
      <div className="glass-card p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-800/50">
          <input
            type="checkbox"
            checked={config.hasVastu}
            onChange={(e) => setConfig({ ...config, hasVastu: e.target.checked })}
            className="rounded accent-cyan-400"
          />
          <span className="text-xs text-slate-200 font-medium flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Vastu Compliant
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-800/50">
          <input
            type="checkbox"
            checked={config.hasPool}
            onChange={(e) => setConfig({ ...config, hasPool: e.target.checked })}
            className="rounded accent-cyan-400"
          />
          <span className="text-xs text-slate-200 font-medium">🏊 Swimming Pool</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-800/50">
          <input
            type="checkbox"
            checked={config.hasSolar}
            onChange={(e) => setConfig({ ...config, hasSolar: e.target.checked })}
            className="rounded accent-cyan-400"
          />
          <span className="text-xs text-slate-200 font-medium">☀️ Solar Roof Panels</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-800/50">
          <input
            type="checkbox"
            checked={config.hasLift}
            onChange={(e) => setConfig({ ...config, hasLift: e.target.checked })}
            className="rounded accent-cyan-400"
          />
          <span className="text-xs text-slate-200 font-medium">🛗 Home Lift / Elevator</span>
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold"
        >
          &larr; Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition"
        >
          Generate Designs &rarr;
        </button>
      </div>
    </div>
  );
}
