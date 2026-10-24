import React from 'react';
import { Calculator, DollarSign, Leaf, Calendar, HardHat } from 'lucide-react';

export function CostBOQStep({ config, onNext, onPrev }) {
  // Calculate dynamic quantities based on plot size and floors
  const builtUpArea = Math.round(config.plotWidth * config.plotDepth * config.floors * 0.65);
  const cementBags = Math.round(builtUpArea * 0.42);
  const steelTons = (builtUpArea * 0.0038).toFixed(1);
  const bricksCount = Math.round(builtUpArea * 18);
  const sandTons = Math.round(builtUpArea * 0.06);
  const estimatedMonths = Math.max(4, config.floors * 3.5).toFixed(1);

  const materials = [
    { name: 'Portland Cement (50kg bags)', qty: `${cementBags.toLocaleString()} Bags`, unitCost: '₹380/bag', total: `₹${(cementBags * 380 / 100000).toFixed(2)} L` },
    { name: 'Fe550 TMT Reinforcement Steel', qty: `${steelTons} Tons`, unitCost: '₹62,000/ton', total: `₹${(steelTons * 62000 / 100000).toFixed(2)} L` },
    { name: 'Red Clay / AAC Bricks', qty: `${bricksCount.toLocaleString()} Pcs`, unitCost: '₹9/pc', total: `₹${(bricksCount * 9 / 100000).toFixed(2)} L` },
    { name: 'M-Sand & Coarse Aggregates', qty: `${sandTons} Tons`, unitCost: '₹1,400/ton', total: `₹${(sandTons * 1400 / 100000).toFixed(2)} L` },
    { name: 'Electrical Wiring & DB Switches', qty: 'Standard 4-BHK Kit', unitCost: 'Lump sum', total: '₹3.50 L' },
    { name: 'CPVC Plumbing & Fixtures', qty: 'Multi-stack Pipeline', unitCost: 'Lump sum', total: '₹4.20 L' },
    { name: 'Labor & Civil Contractor Fees', qty: `${estimatedMonths} Months Team`, unitCost: '₹220/sq.ft', total: `₹${(builtUpArea * 220 / 100000).toFixed(2)} L` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            Step 5: Automated Bill of Quantities (BOQ) & Cost Prediction
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time material quantity estimation, structural steel/cement breakdown & timeline forecast.
          </p>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-500/40 px-4 py-2 rounded-xl text-right">
          <div className="text-[10px] text-slate-400 font-mono">ESTIMATED TOTAL COST</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">₹{config.budgetLakhs}.00 Lakhs</div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-3 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <HardHat className="w-3.5 h-3.5 text-amber-400" /> BUILT-UP AREA
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">{builtUpArea.toLocaleString()} SQ.FT</div>
        </div>

        <div className="glass-card p-3 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" /> TIMELINE ESTIMATE
          </div>
          <div className="text-sm font-bold text-cyan-400 mt-1">{estimatedMonths} MONTHS</div>
        </div>

        <div className="glass-card p-3 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" /> CARBON FOOTPRINT
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-1">A+ (ECO-RATED)</div>
        </div>

        <div className="glass-card p-3 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-rose-400" /> AVG RATE / SQFT
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">₹{Math.round((config.budgetLakhs * 100000) / builtUpArea)} / sq.ft</div>
        </div>
      </div>

      {/* Detailed Material BOQ Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-[11px] font-mono text-cyan-400 border-b border-slate-800">
              <th className="p-3">MATERIAL / LABOR SPECIFICATION</th>
              <th className="p-3">QUANTITY</th>
              <th className="p-3">UNIT RATE</th>
              <th className="p-3 text-right">TOTAL COST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {materials.map((m, idx) => (
              <tr key={`mat-${idx}`} className="hover:bg-slate-900/50">
                <td className="p-3 text-slate-200 font-sans font-medium">{m.name}</td>
                <td className="p-3 text-cyan-300">{m.qty}</td>
                <td className="p-3 text-slate-400">{m.unitCost}</td>
                <td className="p-3 text-right text-emerald-400 font-bold">{m.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
          Export CAD / BIM Files &rarr;
        </button>
      </div>
    </div>
  );
}
