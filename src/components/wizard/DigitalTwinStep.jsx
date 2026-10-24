import React, { useState } from 'react';
import { Activity, Zap, AlertTriangle, ShieldCheck, Flame, Radio, Wrench } from 'lucide-react';

export function DigitalTwinStep({ config, onPrev }) {
  const [emergencyMode, setEmergencyMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            Step 7: Living Digital Twin & IoT Operation Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time post-construction telemetry: Structural health strain, HVAC energy, smart leak detection & emergency routing.
          </p>
        </div>

        <button
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition flex items-center gap-2 ${
            emergencyMode
              ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-600/40'
              : 'bg-slate-900 text-rose-400 border-rose-500/40 hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          {emergencyMode ? 'EMERGENCY MODE ACTIVE (EVAC PATH ON)' : 'SIMULATE EMERGENCY EVACUATION'}
        </button>
      </div>

      {/* Sensor Dashboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-3 font-mono border-l-4 border-emerald-400">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> STRUCTURAL STRAIN
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-1">12.4 MPa (Nominal)</div>
          <div className="text-[9px] text-slate-500 mt-0.5">32 Fiber-Optic Sensors OK</div>
        </div>

        <div className="glass-card p-3 font-mono border-l-4 border-cyan-400">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> SOLAR POWER YIELD
          </div>
          <div className="text-sm font-bold text-cyan-400 mt-1">5.8 kW / hr</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Battery Storage: 94%</div>
        </div>

        <div className="glass-card p-3 font-mono border-l-4 border-amber-400">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-amber-400" /> PREDICTIVE MAINTENANCE
          </div>
          <div className="text-sm font-bold text-amber-400 mt-1">Filter Service (14 Days)</div>
          <div className="text-[9px] text-slate-500 mt-0.5">HVAC Compressor Unit 1</div>
        </div>

        <div className="glass-card p-3 font-mono border-l-4 border-rose-400">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-rose-400" /> LEAK DETECTION
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">0 Leaks Detected</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Acoustic Sensors Active</div>
        </div>
      </div>

      {/* Digital Twin Live Log Stream */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
        <div className="text-cyan-400 font-bold flex items-center justify-between">
          <span>LIVE TELEMETRY STREAM (NODE ID: TWIN-88219)</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            STREAMING (60 Hz)
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-[11px] text-slate-300 h-36 overflow-y-auto">
          <div className="flex justify-between text-slate-500">
            <span>[12:05:01.04] SENSOR_NODE_04</span>
            <span className="text-emerald-400">Roof Slab Deflection: 0.8mm (Limit: 5.0mm)</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>[12:05:02.18] SOLAR_INVERTER</span>
            <span className="text-cyan-400">Grid Feed Active: +4.2 kW Exported</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>[12:05:03.42] HVAC_ZONE_2</span>
            <span className="text-slate-300">Ambient Temp: 23.5°C | Air Flow: 420 CFM</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>[12:05:04.90] WATER_FLOW_MAIN</span>
            <span className="text-emerald-400">Pressure: 3.2 Bar (Stable)</span>
          </div>
          {emergencyMode && (
            <div className="flex justify-between text-rose-400 font-bold bg-rose-950/40 p-1 rounded">
              <span>[12:05:05.10] EMERGENCY_BEACON</span>
              <span>Evacuation Lights & Stairwell Pressurization Activated!</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold"
        >
          &larr; Back to CAD Export
        </button>
      </div>
    </div>
  );
}
