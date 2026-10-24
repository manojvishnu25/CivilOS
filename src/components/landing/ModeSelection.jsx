import React, { useState } from 'react';

const MANUAL_TOOLS = [
  'Wall', 'Door', 'Window', 'Column', 'Beam', 'Foundation',
  'Roof', 'Floor', 'Staircase', 'MEP', 'Electrical', 'Structural',
];
const AI_FEATURES = [
  'Floor Plan', 'Structural Design', 'Interior', 'Exterior',
  '3D BIM Model', 'Cost Estimation', 'Timeline', 'Material Report',
];

export default function ModeSelection({ onSelect, onBack }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden',
      background: 'var(--bg-base)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Animated background */}
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.45 }} />
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,184,162,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Back nav */}
      <nav style={{
        padding: '22px 44px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 10,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(16px)',
      }}>
        <button className="btn-ghost" onClick={onBack} style={{ fontSize: 13, gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #C8B8A2, #8A7060)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(200,184,162,0.28)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>
            Build<span style={{ color: 'var(--beige)' }}>Mind</span> AI
          </span>
        </div>
      </nav>

      {/* Center content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 40px', zIndex: 10,
      }}>
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="badge badge-beige" style={{ marginBottom: 16, fontSize: 11 }}>
            Select Your Workflow
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 900,
            letterSpacing: '-0.03em', marginBottom: 12, color: 'var(--text-1)',
          }}>
            How would you like to build today?
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)' }}>
            Choose your design workflow — professional BIM tools or AI-assisted generation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, width: '100%', maxWidth: 1020, alignItems: 'stretch' }}>

          {/* ── Card 1: Manual ── */}
          <div
            className="anim-fade-up delay-200"
            onMouseEnter={() => setHovered('manual')}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1, borderRadius: 24,
              background: hovered === 'manual'
                ? 'linear-gradient(145deg, rgba(212,160,87,0.07), rgba(34,30,26,0.96))'
                : 'rgba(34,30,26,0.88)',
              border: `1px solid ${hovered === 'manual' ? 'rgba(212,160,87,0.45)' : 'var(--border)'}`,
              backdropFilter: 'blur(24px)',
              padding: '44px 36px',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.2,0.8,0.3,1)',
              transform: hovered === 'manual' ? 'translateY(-8px) scale(1.01)' : 'none',
              boxShadow: hovered === 'manual' ? '0 30px 80px rgba(212,160,87,0.12)' : 'var(--shadow-md)',
            }}
            onClick={() => onSelect('manual')}
          >
            <div style={{
              width: 72, height: 72, borderRadius: 20, marginBottom: 28,
              background: hovered === 'manual' ? 'rgba(212,160,87,0.12)' : 'rgba(200,184,162,0.04)',
              border: `1px solid ${hovered === 'manual' ? 'rgba(212,160,87,0.38)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.35s ease',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke={hovered === 'manual' ? '#D4A057' : 'var(--text-2)'} strokeWidth="1.5" style={{ transition: 'all 0.3s' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>

            <div className="badge badge-orange" style={{ marginBottom: 14 }}>Professional BIM</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10, color: 'var(--text-1)' }}>
              Manual Design
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 28 }}>
              Full professional BIM workflow. Create every wall, column, beam, foundation,
              and MEP system exactly like Autodesk Revit — with complete control.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
              {MANUAL_TOOLS.map(t => (
                <span key={t} className="badge badge-orange" style={{ fontSize: 10 }}>{t}</span>
              ))}
            </div>

            <button
              className="btn-primary"
              style={{
                width: '100%', justifyContent: 'center', padding: '14px 24px', borderRadius: 14,
                background: hovered === 'manual'
                  ? 'linear-gradient(135deg, #D4A057, #A07030)'
                  : 'linear-gradient(135deg, #2A2520, #1A1714)',
                color: hovered === 'manual' ? '#0A0A0A' : 'var(--text-2)',
                border: `1px solid ${hovered === 'manual' ? 'rgba(212,160,87,0.3)' : 'var(--border)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              Start Manual Design →
            </button>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 12, padding: '20px 0',
          }}>
            <div style={{ width: 1, flex: 1, background: 'var(--border)' }} />
            <span style={{
              fontSize: 11, color: 'var(--text-3)', fontWeight: 700,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 999, padding: '6px 14px', letterSpacing: '0.06em',
            }}>OR</span>
            <div style={{ width: 1, flex: 1, background: 'var(--border)' }} />
          </div>

          {/* ── Card 2: AI ── */}
          <div
            className="anim-fade-up delay-300"
            onMouseEnter={() => setHovered('ai')}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1, borderRadius: 24,
              background: hovered === 'ai'
                ? 'linear-gradient(145deg, rgba(200,184,162,0.07), rgba(34,30,26,0.96))'
                : 'rgba(34,30,26,0.88)',
              border: `1px solid ${hovered === 'ai' ? 'rgba(200,184,162,0.45)' : 'var(--border)'}`,
              backdropFilter: 'blur(24px)',
              padding: '44px 36px',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.2,0.8,0.3,1)',
              transform: hovered === 'ai' ? 'translateY(-8px) scale(1.01)' : 'none',
              boxShadow: hovered === 'ai' ? '0 30px 80px rgba(200,184,162,0.10)' : 'var(--shadow-md)',
            }}
            onClick={() => onSelect('ai')}
          >
            <div style={{
              width: 72, height: 72, borderRadius: 20, marginBottom: 28,
              background: hovered === 'ai' ? 'rgba(200,184,162,0.10)' : 'rgba(200,184,162,0.04)',
              border: `1px solid ${hovered === 'ai' ? 'rgba(200,184,162,0.38)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.35s ease',
              position: 'relative',
            }}>
              <span style={{ fontSize: 36, animation: hovered === 'ai' ? 'float-slow 3s ease-in-out infinite' : 'none' }}>
                🧠
              </span>
              {hovered === 'ai' && (
                <div style={{
                  position: 'absolute', inset: -8, borderRadius: 28,
                  border: '1px solid rgba(200,184,162,0.28)',
                  animation: 'spin-slow 5s linear infinite',
                  borderTopColor: 'transparent',
                }} />
              )}
            </div>

            <div className="badge badge-beige" style={{ marginBottom: 14 }}>AI-Powered + CNN</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10, color: 'var(--text-1)' }}>
              AI Design Assistant
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 28 }}>
              Describe your dream building. Our AI + CNN instantly creates floor plans, structural
              designs, detects elements, and generates complete 3D BIM models from your requirements.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
              {AI_FEATURES.map(f => (
                <span key={f} className="badge badge-beige" style={{ fontSize: 10 }}>{f}</span>
              ))}
              <span className="badge badge-purple" style={{ fontSize: 10 }}>CNN Analysis</span>
            </div>

            <button
              className="btn-primary anim-pulse-glow"
              style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', borderRadius: 14 }}
            >
              Generate with AI →
            </button>
          </div>
        </div>

        <p className="anim-fade-up delay-500" style={{ marginTop: 32, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
          Both modes give you access to the full BIM studio · Switch anytime · CNN analysis included in AI mode
        </p>
      </div>
    </div>
  );
}
