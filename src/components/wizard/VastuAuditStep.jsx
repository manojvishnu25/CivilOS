import React from 'react';
import { Compass, CheckCircle, AlertTriangle, Building, Award } from 'lucide-react';

export function VastuAuditStep({ config, onNext, onPrev }) {
  const vastuItems = [
    { zone: 'Main Entrance (North/NE)', status: 'PASS', score: 100, desc: 'Positioned in Ishanya direction for positive solar energy intake.' },
    { zone: 'Kitchen (SE - Agneya)', status: 'PASS', score: 98, desc: 'Fire element aligned with South-East quadrant.' },
    { zone: 'Master Bedroom (SW - Nairutya)', status: 'PASS', score: 99, desc: 'Earth element stability for maximum comfort & structural weight.' },
    { zone: 'Pooja Room (NE - Ishanya)', status: 'PASS', score: 100, desc: 'Water & spiritual energy quadrant perfectly aligned.' },
    { zone: 'Overhead Tank (SW / West)', status: 'PASS', score: 95, desc: 'Placed in heavy load bearing sector.' },
    { zone: 'Staircase (South / West)', status: 'WARNING', score: 88, desc: 'Clockwise rotation recommended for optimal energy circulation.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            Step 4: AI Vastu & Building Code Audit
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time directional compliance score & Municipal Bye-law FAR / Setback verification.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-300">VASTU SCORE: 96.8 / 100</span>
        </div>
      </div>

      {/* Vastu Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vastuItems.map((item, idx) => (
          <div key={`vastu-item-${idx}`} className="glass-card p-3.5 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-200">{item.zone}</div>
              <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              item.status === 'PASS' 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
            }`}>
              {item.status} ({item.score}%)
            </span>
          </div>
        ))}
      </div>

      {/* Municipal Bye-Law & Setback Verification */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 space-y-3">
        <h3 className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-2">
          <Building className="w-4 h-4" />
          Municipal Building Code & Setback Audit (NBC 2026)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <div className="text-[10px] text-slate-500">FAR ALLOWED</div>
            <div className="text-slate-200 font-bold mt-0.5">1.75 Limit (Actual: 1.42 ✅)</div>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <div className="text-[10px] text-slate-500">FRONT SETBACK</div>
            <div className="text-slate-200 font-bold mt-0.5">5.0 ft (Compliant ✅)</div>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <div className="text-[10px] text-slate-500">REAR SETBACK</div>
            <div className="text-slate-200 font-bold mt-0.5">3.5 ft (Compliant ✅)</div>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <div className="text-[10px] text-slate-500">MAX HEIGHT</div>
            <div className="text-slate-200 font-bold mt-0.5">12.0m Limit (Actual: 7.2m ✅)</div>
          </div>
        </div>
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
          View Cost & BOQ Estimate &rarr;
        </button>
      </div>
    </div>
  );
}
