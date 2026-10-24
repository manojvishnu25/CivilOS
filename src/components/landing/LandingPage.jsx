import React, { useEffect, useRef, useState } from 'react';

export default function LandingPage({ onCTA }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Subtle beige particle canvas overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.25 + 0.05),
      r: Math.random() * 1.4 + 0.3,
      o: Math.random() * 0.35 + 0.08,
      c: Math.random() > 0.5 ? '200,184,162' : Math.random() > 0.5 ? '212,179,114' : '184,164,132',
    }));

    // Blueprint scan lines
    const lines = Array.from({ length: 18 }, () => ({
      x1: Math.random(), y1: Math.random(),
      x2: Math.random(), y2: Math.random(),
      p: Math.random(), spd: Math.random() * 0.003 + 0.001,
      o: Math.random() * 0.055 + 0.015,
    }));

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fine beige grid overlay
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = 'rgba(200,184,162,0.025)';
      for (let x = 0; x < w; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // Animated blueprint lines
      lines.forEach(l => {
        l.p = l.p + l.spd;
        if (l.p > 1) {
          l.x1 = Math.random(); l.y1 = Math.random();
          l.x2 = Math.random(); l.y2 = Math.random();
          l.p = 0; l.o = Math.random() * 0.055 + 0.015;
        }
        const cx = (l.x1 + (l.x2 - l.x1) * l.p) * w;
        const cy = (l.y1 + (l.y2 - l.y1) * l.p) * h;
        ctx.beginPath();
        ctx.moveTo(l.x1 * w, l.y1 * h);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(200,184,162,${l.o})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.o += (Math.random() - 0.5) * 0.025;
        p.o = Math.max(0.05, Math.min(0.45, p.o));
        if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`;
        ctx.fill();
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#0A0A0A' }}>

      {/* ── Hero image background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      }} />

      {/* Dark gradient overlays for text legibility */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.92) 100%)',
      }} />
      {/* Left/right vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.65) 100%)',
      }} />

      {/* Particle + grid canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block', zIndex: 2, pointerEvents: 'none' }} />

      {/* Warm scan-line texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'linear-gradient(transparent 50%, rgba(200,184,162,0.008) 50%)',
        backgroundSize: '100% 3px',
      }} />

      {/* ── Top Nav ── */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 44px', zIndex: 20,
        borderBottom: '1px solid rgba(200,184,162,0.08)',
        background: 'linear-gradient(180deg, rgba(10,10,10,0.70) 0%, transparent 100%)',
        backdropFilter: 'blur(4px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: 'linear-gradient(135deg, #C8B8A2, #8A7060)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(200,184,162,0.35)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: '#F5EFE6' }}>
              Build<span style={{ color: '#C8B8A2' }}>Mind</span> AI
            </div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>
              CIVIL ENGINEERING PLATFORM v3.0
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Features', 'Documentation', 'Pricing', 'About'].map(item => (
            <button key={item} className="btn-ghost" style={{ fontSize: 13 }}>{item}</button>
          ))}
          <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 20px' }}>Sign In</button>
        </div>
      </nav>

      {/* ── Hero Content ── */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 24px',
      }}>
        {/* Badge */}
        <div
          className={`badge badge-beige ${visible ? 'anim-fade-up' : ''}`}
          style={{ marginBottom: 26, opacity: visible ? 1 : 0, fontSize: 11, padding: '5px 16px', gap: 8 }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--beige)', display: 'inline-block',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }} />
          World's First AI-Powered Civil Engineering Platform
        </div>

        {/* Main heading */}
        <h1
          className={`text-gradient-hero ${visible ? 'anim-fade-up delay-100' : ''}`}
          style={{
            fontSize: 'clamp(42px, 7vw, 88px)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 1.04,
            textAlign: 'center',
            marginBottom: 18,
            opacity: visible ? 1 : 0,
          }}
        >
          Welcome to<br />BuildMind AI
        </h1>

        {/* Tagline */}
        <p
          className={`text-gradient ${visible ? 'anim-fade-up delay-200' : ''}`}
          style={{
            fontSize: 'clamp(15px, 2.2vw, 22px)',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textAlign: 'center',
            marginBottom: 14,
            opacity: visible ? 1 : 0,
            textTransform: 'uppercase',
          }}
        >
          Design. Simulate. Construct.
        </p>

        <p
          className={visible ? 'anim-fade-up delay-300' : ''}
          style={{
            fontSize: 15, color: 'var(--text-2)', textAlign: 'center',
            maxWidth: 560, lineHeight: 1.75, marginBottom: 52,
            opacity: visible ? 1 : 0,
          }}
        >
          An enterprise-grade BIM platform with real-time AI, CNN-powered floor plan analysis,
          full 3D walkthroughs, structural analysis, and automated construction documentation.
        </p>

        {/* CTA Buttons */}
        <div
          className={visible ? 'anim-fade-up delay-400' : ''}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52, opacity: visible ? 1 : 0 }}
        >
          <button
            className="btn-primary anim-pulse-glow"
            style={{ fontSize: 15, padding: '15px 38px', borderRadius: 14 }}
            onClick={() => onCTA('start')}
          >
            <span>▶</span> Start Designing
          </button>
          <button
            className="btn-primary"
            style={{
              fontSize: 15, padding: '15px 38px', borderRadius: 14,
              background: 'linear-gradient(135deg, #332E28, #221E1A)',
              color: 'var(--beige)',
              border: '1px solid rgba(200,184,162,0.3)',
            }}
            onClick={() => onCTA('ai')}
          >
            <span>🧠</span> Design with AI
          </button>
          <button className="btn-secondary" style={{ fontSize: 15, padding: '15px 28px', borderRadius: 14 }}>
            <span>▷</span> Watch Demo
          </button>
        </div>

        {/* Feature tags */}
        <div
          className={visible ? 'anim-fade-up delay-500' : ''}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', opacity: visible ? 1 : 0 }}
        >
          {[
            { label: 'BIM 360',          color: '#C8B8A2' },
            { label: 'AutoCAD',          color: '#D4B372' },
            { label: 'Revit-Style',      color: '#8FA876' },
            { label: 'CNN Analysis',     color: '#A08CB8' },
            { label: '3D Walkthrough',   color: '#C8B8A2' },
            { label: 'Real-Time',        color: '#C47060' },
            { label: 'AI Copilot',       color: '#D4A057' },
            { label: 'IFC Export',       color: '#8FA876' },
          ].map(f => (
            <span
              key={f.label}
              className="badge"
              style={{
                background: `${f.color}12`,
                color: f.color,
                border: `1px solid ${f.color}30`,
                fontSize: 10.5,
              }}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom Stats Bar ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        borderTop: '1px solid rgba(200,184,162,0.12)',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 64, padding: '16px 40px', zIndex: 20,
      }}>
        {[
          { val: '50,000+', label: 'Buildings Designed' },
          { val: '120+',    label: 'Countries' },
          { val: '99.9%',   label: 'Uptime SLA' },
          { val: '< 2s',    label: 'AI Generation' },
          { val: 'ISO 19650', label: 'BIM Standard' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div className="text-gradient" style={{ fontSize: 18, fontWeight: 800 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
