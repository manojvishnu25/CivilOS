import React from 'react';
import { Cpu, Camera, Building2, Sparkles, Layers, ShieldCheck, Sun, Wind } from 'lucide-react';

export function Header({ 
  config, 
  setConfig, 
  viewMode, 
  setViewMode, 
  activeFloorCutaway, 
  setActiveFloorCutaway,
  sunTime,
  setSunTime
}) {
  const buildingTypes = [
    { id: 'villa', label: '🏡 Villa / House' },
    { id: 'apartment', label: '🏢 Apartment' },
    { id: 'mall', label: '🛍️ Commercial Mall' },
    { id: 'hospital', label: '🏥 Smart Hospital' },
    { id: 'factory', label: '🏭 Eco Factory' }
  ];

  return (
    <header className="w-full glass-panel border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-20 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-slate-100 tracking-wide font-mono">
              AI Civil<span className="text-cyan-400">OS</span>
            </h1>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-full">
              BuildAI v2.4
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            "Scan your land. Get your dream home designed in minutes."
          </p>
        </div>
      </div>

      {/* Universal Building Selector */}
      <div className="hidden lg:flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
        {buildingTypes.map((b) => (
          <button
            key={b.id}
            onClick={() => setConfig({ ...config, buildingType: b.id })}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              config.buildingType === b.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* 3D View Mode Toggles */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setViewMode('architectural')}
          className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition flex items-center gap-1.5 ${
            viewMode === 'architectural'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> 3D Render
        </button>

        <button
          onClick={() => setViewMode('structural')}
          className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition flex items-center gap-1.5 ${
            viewMode === 'structural'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> BIM Structural
        </button>

        <button
          onClick={() => setViewMode('mep')}
          className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition flex items-center gap-1.5 ${
            viewMode === 'mep'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> MEP Overlay
        </button>

        <button
          onClick={() => setViewMode('vastu')}
          className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition flex items-center gap-1.5 ${
            viewMode === 'vastu'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Vastu Grid
        </button>

        <button
          onClick={() => setViewMode('sunlight')}
          className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition flex items-center gap-1.5 ${
            viewMode === 'sunlight'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" /> Sunlight
        </button>

        <button
          onClick={() => setViewMode('airflow')}
          className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition flex items-center gap-1.5 ${
            viewMode === 'airflow'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-cyan-400" /> Airflow CFD
        </button>
      </div>

      {/* Sunlight Time Slider (shown when sunlight mode active) */}
      {viewMode === 'sunlight' && (
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-amber-500/40 text-xs">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-amber-300 font-bold">{sunTime}:00 HRS</span>
          <input
            type="range"
            min="6"
            max="18"
            value={sunTime}
            onChange={(e) => setSunTime(Number(e.target.value))}
            className="w-24 accent-amber-400 cursor-pointer"
          />
        </div>
      )}

      {/* Floor Cutaway Switcher */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
        <span className="text-slate-500 px-1.5">FLOOR:</span>
        <button
          onClick={() => setActiveFloorCutaway('all')}
          className={`px-2 py-1 rounded ${activeFloorCutaway === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          ALL
        </button>
        {Array.from({ length: config.floors }).map((_, f) => (
          <button
            key={`cutaway-${f + 1}`}
            onClick={() => setActiveFloorCutaway(f + 1)}
            className={`px-2 py-1 rounded ${activeFloorCutaway === f + 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            L{f + 1}
          </button>
        ))}
      </div>
    </header>
  );
}
