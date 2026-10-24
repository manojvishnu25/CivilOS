import React, { useState } from 'react';
import { Cpu, Layers, Sparkles, RefreshCw, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AIGenerationStep({ config, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Step 3: AI Neural Design Synthesis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generative Diffusion AI model synthesizing 2D floor plans, 3D structural mesh & MEP nodes.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          Regenerate Layout
        </button>
      </div>

      {/* Neural AI Pipeline Card */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> AI MODEL: ARCH-DIFFUSION-v4.2
          </span>
          <span className="text-emerald-400 font-bold">100% LATENT SPACE CONVERGENCE</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-slate-900/80 rounded border border-emerald-500/40 text-[11px]">
            <div className="text-emerald-400 font-mono font-bold">✅ Room Program</div>
            <div className="text-slate-400 mt-0.5">{config.bhk} BHK + Living + Modular Kitchen</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded border border-cyan-500/40 text-[11px]">
            <div className="text-cyan-400 font-mono font-bold">✅ Structural Mesh</div>
            <div className="text-slate-400 mt-0.5">RCC Frame / 8 Main Load Columns</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded border border-amber-500/40 text-[11px]">
            <div className="text-amber-400 font-mono font-bold">✅ Elevation Render</div>
            <div className="text-slate-400 mt-0.5">{config.architecturalStyle.toUpperCase()} Style</div>
          </div>
        </div>
      </div>

      {/* 2D Floor Plan Interactive Preview */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-slate-300 uppercase font-bold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            2D Architectural Floor Plan (Level 1)
          </h3>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
            SCALE 1:100
          </span>
        </div>

        {/* Blueprint Visual Representation */}
        <div className="w-full h-56 bg-slate-900 border border-slate-700 rounded-lg blueprint-grid relative p-4 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/80">
            NORTH ⬆️ (MAIN ENTRANCE FACING)
          </div>

          <div className="grid grid-cols-3 gap-2 h-full my-4">
            <div className="border-2 border-cyan-400/80 bg-cyan-950/30 p-2 rounded flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyan-300 font-bold">LIVING ROOM</span>
              <span className="text-[9px] font-mono text-slate-400">18'0" x 14'0"</span>
            </div>

            <div className="border-2 border-emerald-400/80 bg-emerald-950/30 p-2 rounded flex flex-col justify-between">
              <span className="text-[10px] font-mono text-emerald-300 font-bold">MODULAR KITCHEN</span>
              <span className="text-[9px] font-mono text-slate-400">12'0" x 10'0" (SE)</span>
            </div>

            <div className="border-2 border-cyan-400/80 bg-cyan-950/30 p-2 rounded flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyan-300 font-bold">POOJA ROOM</span>
              <span className="text-[9px] font-mono text-slate-400">8'0" x 6'0" (NE)</span>
            </div>

            <div className="border-2 border-amber-400/80 bg-amber-950/30 p-2 rounded flex flex-col justify-between">
              <span className="text-[10px] font-mono text-amber-300 font-bold">MASTER BEDROOM</span>
              <span className="text-[9px] font-mono text-slate-400">16'0" x 14'0" (SW)</span>
            </div>

            <div className="border-2 border-slate-600 bg-slate-950/50 p-2 rounded flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-300 font-bold">DINING AREA</span>
              <span className="text-[9px] font-mono text-slate-400">14'0" x 12'0"</span>
            </div>

            <div className="border-2 border-cyan-400/80 bg-cyan-950/30 p-2 rounded flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyan-300 font-bold">BEDROOM 2</span>
              <span className="text-[9px] font-mono text-slate-400">14'0" x 12'0" (NW)</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>SETBACK: Front 5ft | Rear 3ft | Side 3ft</span>
            <span className="text-cyan-400">CLICK 3D VIEWPORT TO ROTATE MODEL</span>
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
          View Vastu & Code Audit &rarr;
        </button>
      </div>
    </div>
  );
}
