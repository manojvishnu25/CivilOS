import React, { useState } from 'react';
import { Mic, Send, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AIVoiceAssistant({ config, setConfig }) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const presets = [
    { label: '2-Floor 4-BHK Vastu Villa (₹70 Lakhs)', prompt: 'Design a 2-floor 4-BHK home under ₹70 lakh with modern style, pool, solar roof and Vastu compliance.', floors: 2, bhk: 4, budgetLakhs: 70, style: 'modern', pool: true },
    { label: 'Minimalist 3-Floor Luxury Mansion (₹150 Lakhs)', prompt: 'Generate a 3-floor luxury minimalist house with lift, solar roof, and pool.', floors: 3, bhk: 5, budgetLakhs: 150, style: 'minimalist', pool: true, lift: true },
    { label: 'Traditional Kerala Courtyard House (₹50 Lakhs)', prompt: 'Design a single-floor Kerala traditional sloped roof home with Vastu compliance.', floors: 1, bhk: 3, budgetLakhs: 50, style: 'traditional', pool: false },
  ];

  const handleVoiceSim = () => {
    setIsListening(true);
    setPrompt('Listening to voice input...');
    setTimeout(() => {
      setIsListening(false);
      applyPreset(presets[0]);
    }, 1800);
  };

  const applyPreset = (p) => {
    setPrompt(p.prompt);
    setConfig((prev) => ({
      ...prev,
      floors: p.floors || prev.floors,
      bhk: p.bhk || prev.bhk,
      budgetLakhs: p.budgetLakhs || prev.budgetLakhs,
      architecturalStyle: p.style || prev.architecturalStyle,
      hasPool: p.pool !== undefined ? p.pool : prev.hasPool,
      hasLift: p.lift !== undefined ? p.lift : prev.hasLift,
      hasVastu: true
    }));

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (prompt.toLowerCase().includes('3-floor') || prompt.toLowerCase().includes('3 floor')) {
      setConfig((prev) => ({ ...prev, floors: 3 }));
    }
    if (prompt.toLowerCase().includes('50 lakh') || prompt.toLowerCase().includes('50l')) {
      setConfig((prev) => ({ ...prev, budgetLakhs: 50 }));
    }
    if (prompt.toLowerCase().includes('traditional')) {
      setConfig((prev) => ({ ...prev, architecturalStyle: 'traditional' }));
    }

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/30 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          AI CIVIL ARCHITECT CO-PILOT (VOICE & NATURAL LANGUAGE)
        </span>
        <span className="text-[10px] text-slate-400 font-mono">LLM PROMPT PARSER READY</span>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Speak or type e.g., "Design a 2-floor, 3-bedroom home under ₹70 lakh with Vastu compliance..."'
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          {isListening && (
            <span className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] text-rose-400 font-mono animate-pulse">
              <Volume2 className="w-3.5 h-3.5" /> Recording...
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleVoiceSim}
          disabled={isListening}
          className={`p-2.5 rounded-xl border transition ${
            isListening
              ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border-slate-700'
          }`}
          title="Click to speak prompt"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="submit"
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20"
        >
          <Send className="w-3.5 h-3.5" /> Parse AI
        </button>
      </form>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="text-[10px] font-mono text-slate-500 self-center">PRESETS:</span>
        {presets.map((p, idx) => (
          <button
            key={`preset-${idx}`}
            onClick={() => applyPreset(p)}
            className="text-[10px] font-mono bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 px-2.5 py-1 rounded-lg transition"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
