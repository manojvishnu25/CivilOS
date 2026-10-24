import React, { useEffect, useState } from 'react';

function SnapToggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0 8px', height: '100%', border: 'none', background: 'transparent',
        color: active ? 'var(--text-1)' : 'var(--text-4)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, cursor: 'pointer',
        fontWeight: active ? 700 : 400, letterSpacing: '0.04em',
        borderRight: '1px solid var(--border)',
        transition: 'color 0.2s',
      }}
    >
      {label}
    </button>
  );
}

export default function BottomStatusBar({
  activeTool, coords, viewMode, viewportMode, showGrid, config,
  isWalkthrough, fps,
  snapOrtho, setSnapOrtho,
  snapPolar, setSnapPolar,
  snapGrid, setSnapGrid,
  saveStatus,
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);



  const sep = (
    <div style={{ width: 1, height: '60%', background: 'var(--border)', flexShrink: 0 }} />
  );

  const cell = (content, color = 'var(--text-3)') => (
    <div style={{
      padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
      color, flexShrink: 0,
    }}>
      {content}
    </div>
  );

  const viewLabel = viewportMode === 'plan' ? 'PLAN VIEW'
    : viewportMode === 'section' ? 'SECTION'
    : isWalkthrough ? '🚶 WALKTHROUGH'
    : `3D · ${(viewMode || 'ARCH').toUpperCase()}`;

  return (
    <div style={{
      height: 26,
      background: 'var(--bg-panel)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 4px', gap: 0,
      flexShrink: 0, overflow: 'hidden',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, userSelect: 'none',
      color: 'var(--text-1)',
    }}>
      {/* Status dot + READY */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px', borderRight: '1px solid var(--border)' }}>
        <div className="status-dot" style={{ width: 5, height: 5, background: '#10b981' }} />
        <span style={{ color: '#10b981', fontWeight: 700 }}>READY</span>
      </div>

      {/* Active tool */}
      {cell(<>TOOL: <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{(activeTool || 'SELECT').toUpperCase()}</span></>, 'var(--text-3)')}
      {sep}

      {/* Viewport mode */}
      {cell(<span style={{ color: '#3b82f6', fontWeight: 700 }}>{viewLabel}</span>)}
      {sep}

      {/* Coordinates */}
      <div style={{ padding: '0 10px', display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-3)' }}>
        <span>X: <span style={{ color: '#ef4444' }}>{coords?.x?.toFixed(2) || '0.00'}</span></span>
        <span>Y: <span style={{ color: '#10b981' }}>{coords?.y?.toFixed(2) || '0.00'}</span></span>
        <span>Z: <span style={{ color: '#3b82f6' }}>{coords?.z?.toFixed(2) || '0.00'}</span></span>
      </div>
      {sep}

      {/* Scale */}
      {cell('SCALE 1:100')}
      {sep}
      {cell('mm | FT')}
      {sep}

      {/* AutoCAD-style snap toggles */}
      <SnapToggle label="ORTHO" active={snapOrtho} onClick={() => setSnapOrtho?.(v => !v)} />
      <SnapToggle label="POLAR" active={snapPolar} onClick={() => setSnapPolar?.(v => !v)} />
      <SnapToggle label="OSNAP" active={true} onClick={() => {}} />
      <SnapToggle label={showGrid ? 'GRID ✓' : 'GRID'} active={showGrid} onClick={() => {}} />
      <SnapToggle label="BIM" active={true} onClick={() => {}} />

      {sep}
      {cell(<span style={{ color: '#10b981' }}>ISO 19650</span>)}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Building info */}
      {cell(<>
        <span style={{ color: 'var(--text-4)' }}>{config.buildingType?.toUpperCase()} ·</span>
        <span style={{ color: 'var(--text-1)' }}> {config.floors}F · {config.bhk}BHK</span>
      </>)}
      {sep}

      {/* AutoSave */}
      {cell(
        saveStatus === 'saving' ? '💾 SAVING...' : saveStatus === 'saved' ? '💾 SAVED' : '☁ SYNCED',
        saveStatus === 'saving' ? '#3b82f6' : saveStatus === 'saved' ? '#10b981' : 'var(--text-4)'
      )}
      {sep}

      {/* FPS — only in 3D */}
      {viewportMode === '3d' && cell(
        <><span style={{ color: (fps || 60) >= 50 ? '#10b981' : (fps || 60) >= 30 ? '#f59e0b' : '#ef4444' }}>{fps || 60}</span> FPS</>,
        'var(--text-3)'
      )}

      {sep}

      {/* ANN status */}
      {cell(
        <><span style={{ animation: 'shimmer 2s ease-in-out infinite' }}>🧠</span> ANN</>,
        '#8b5cf6'
      )}

      {/* Time */}
      {cell(time, 'var(--text-4)')}
    </div>
  );
}
