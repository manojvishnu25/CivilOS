import React, { useState } from 'react';
import { Camera, MapPin, Cpu, CheckCircle2, RotateCw } from 'lucide-react';

export function LandScanningStep({ config, setConfig, onNext }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  const triggerScanSim = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            Step 1: AI LiDAR & Drone Land Scanning
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture plot topography, contour elevation, boundary coordinates & surrounding setbacks.
          </p>
        </div>
        <button
          onClick={triggerScanSim}
          disabled={isScanning}
          className="px-3.5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 rounded-lg text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? `Scanning LiDAR (${scanProgress}%)...` : 'Re-scan Land Plot'}
        </button>
      </div>

      {/* Scanning Status Card */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 relative overflow-hidden">
        {isScanning && (
          <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="text-xs font-mono text-cyan-300 font-bold">GENERATING 3D TERRAIN DIGITAL TWIN...</div>
            <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">GPS COORDINATES</div>
            <div className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              12.9716° N, 77.5946° E
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">TERRAIN SLOPE</div>
            <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">
              1.2° Gentle Gradient
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">SOIL BEARING CAPACITY</div>
            <div className="text-sm font-bold text-cyan-400 mt-1 font-mono">
              210 kN/m² (Dense Clay)
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">SCAN DENSITY</div>
            <div className="text-sm font-bold text-amber-400 mt-1 font-mono">
              2.4M LiDAR Points
            </div>
          </div>
        </div>
      </div>

      {/* Plot Dimensions Input */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
          Plot Geometry Specs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Plot Width (Frontage ft)</label>
            <input
              type="number"
              value={config.plotWidth}
              onChange={(e) => setConfig({ ...config, plotWidth: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Plot Depth (Length ft)</label>
            <input
              type="number"
              value={config.plotDepth}
              onChange={(e) => setConfig({ ...config, plotDepth: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg text-xs text-slate-300 flex items-center justify-between">
          <span>Total Land Area: <strong className="text-cyan-400 font-mono">{config.plotWidth * config.plotDepth} sq.ft</strong> ({((config.plotWidth * config.plotDepth) / 43560).toFixed(3)} Acres)</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono"><CheckCircle2 className="w-3.5 h-3.5" /> 3D Digital Twin Ready</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition"
        >
          Continue to Step 2: Requirements &rarr;
        </button>
      </div>
    </div>
  );
}
