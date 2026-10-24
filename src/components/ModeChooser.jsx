import React, { useState } from 'react';

export default function ModeChooser({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  const MODES = [
    {
      id: 'manual',
      icon: '🏛️',
      label: 'Manual BIM',
      sub: 'Professional Engineering Suite',
    },
    {
      id: 'ai',
      icon: '✨',
      label: 'AI Architect',
      sub: 'Generative Design Copilot',
    },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(10, 10, 12, 0.7)',
      backdropFilter: 'blur(12px)',
      animation: 'title-reveal 0.5s ease-out forwards',
    }}>
      <div style={{
        background: 'rgba(20, 20, 22, 0.85)',
        border: '1px solid rgba(212, 175, 55, 0.3)', /* Gold */
        padding: '50px 60px',
        maxWidth: 600, width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        <div style={{ 
          fontSize: 10, fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)', 
          letterSpacing: '0.3em', marginBottom: 20, 
        }}>
          SELECT WORKFLOW
        </div>
        <h2 style={{ 
          fontSize: 32, fontWeight: 400, color: '#FFFFFF', 
          fontFamily: "'Times New Roman', Times, serif", 
          letterSpacing: '0.05em', marginBottom: 40 
        }}>
          How will you <span style={{ color: '#D4AF37', fontStyle: 'italic' }}>design</span> today?
        </h2>

        <div style={{ display: 'flex', gap: 24 }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(m.id)}
              style={{
                flex: 1, padding: '30px 20px', cursor: 'pointer',
                background: hovered === m.id ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hovered === m.id ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
                transition: 'all 0.4s ease',
                textAlign: 'center',
              }}
            >
              <div style={{ 
                fontSize: 28, marginBottom: 16,
                transform: hovered === m.id ? 'scale(1.1)' : 'none',
                transition: 'transform 0.4s ease'
              }}>
                {m.icon}
              </div>
              <div style={{ 
                fontSize: 20, fontWeight: 400, color: '#FFFFFF', 
                fontFamily: "'Times New Roman', Times, serif", 
                marginBottom: 10, letterSpacing: '0.05em' 
              }}>
                {m.label}
              </div>
              <div style={{ 
                fontSize: 10, color: hovered === m.id ? '#D4AF37' : 'rgba(255,255,255,0.5)', 
                fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em',
                transition: 'color 0.4s ease'
              }}>
                {m.sub.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
