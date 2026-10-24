import React, { useState } from 'react';

const TREE_DATA = {
  Views: {
    icon: '👁️',
    items: [
      { icon: '🏠', label: '3D View — Architectural', active: true },
      { icon: '📐', label: 'Floor Plan — Level 1' },
      { icon: '📐', label: 'Floor Plan — Level 2' },
      { icon: '📏', label: 'Elevation — North' },
      { icon: '📏', label: 'Elevation — South' },
      { icon: '✂️', label: 'Section A-A' },
      { icon: '✂️', label: 'Section B-B' },
    ],
  },
  Sheets: {
    icon: '📄',
    items: [
      { icon: '📄', label: 'A01 — Architectural Plan' },
      { icon: '📄', label: 'S01 — Structural Layout' },
      { icon: '📄', label: 'M01 — MEP Plan' },
      { icon: '📄', label: 'E01 — Electrical' },
    ],
  },
  Levels: {
    icon: '↕️',
    items: [
      { icon: '⬛', label: 'Foundation Level (-3.0m)' },
      { icon: '⬜', label: 'Ground Floor (±0.0m)', active: true },
      { icon: '⬜', label: 'First Floor (+3.0m)' },
      { icon: '⬜', label: 'Second Floor (+6.0m)' },
      { icon: '▫️', label: 'Roof Level (+9.0m)' },
    ],
  },
  Families: {
    icon: '📦',
    items: [
      { icon: '🚪', label: 'Doors' },
      { icon: '🪟', label: 'Windows' },
      { icon: '🪑', label: 'Furniture' },
      { icon: '💡', label: 'Lighting Fixtures' },
      { icon: '⚙️', label: 'MEP Equipment' },
    ],
  },
  Materials: {
    icon: '🧱',
    items: [
      { icon: '🧱', label: 'Brick — Exterior' },
      { icon: '🪨', label: 'Concrete — Structural' },
      { icon: '🔮', label: 'Glass — Curtain Wall' },
      { icon: '🪵', label: 'Wood — Interior' },
      { icon: '⚙️', label: 'Steel — Structural' },
    ],
  },
  Schedules: {
    icon: '📊',
    items: [
      { icon: '📋', label: 'Room Schedule' },
      { icon: '🚪', label: 'Door Schedule' },
      { icon: '🪟', label: 'Window Schedule' },
      { icon: '💰', label: 'Cost Summary' },
      { icon: '📦', label: 'Material Takeoff' },
    ],
  },
  'AI Suggestions': {
    icon: '🤖',
    items: [
      { icon: '⚠️', label: 'Beam depth too small', color: '#f59e0b' },
      { icon: '✅', label: 'Foundation: Raft recommended', color: '#10b981' },
      { icon: '💡', label: 'Add NE ventilation opening', color: '#C8B8A2' },
      { icon: '⚠️', label: 'Wall thickness: 230mm min', color: '#f59e0b' },
      { icon: '✅', label: 'Vastu: East entrance optimal', color: '#10b981' },
    ],
  },
};

function TreeSection({ name, data, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 8px', background: 'transparent', border: 'none', cursor: 'pointer',
          borderRadius: 'var(--r-xs)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em' }}>
          <span>{data.icon}</span> {name.toUpperCase()}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-4)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
          ▶
        </span>
      </button>
      {open && (
        <div style={{ marginLeft: 4, marginBottom: 4 }}>
          {data.items.map((item, i) => (
            <div
              key={i}
              className={`tree-item ${item.active ? 'active' : ''}`}
              style={{ color: item.color || undefined }}
            >
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeftSidebar({ config, selectedItem }) {
  const [filter, setFilter] = useState('');

  return (
    <div style={{
      width: 'var(--left-w)',
      minWidth: 'var(--left-w)',
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 10px 8px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.06em' }}>
            PROJECT BROWSER
          </span>
          <button className="btn-icon" title="New View">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ fontSize: 11, padding: '5px 8px' }}
        />
      </div>

      {/* Project info card */}
      <div style={{
        margin: 8, padding: 10,
        background: 'var(--bg-elevated)',
        borderRadius: 10, border: '1px solid var(--border)',
        fontSize: 11,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'var(--text-3)' }}>Project</span>
          <span style={{ color: 'var(--cyan)', fontWeight: 700, fontFamily: 'monospace' }}>BM-2025-001</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'var(--text-3)' }}>Type</span>
          <span style={{ color: 'var(--text-1)', fontWeight: 600, textTransform: 'capitalize' }}>
            {config.buildingType}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'var(--text-3)' }}>Plot</span>
          <span style={{ color: 'var(--text-1)', fontFamily: 'monospace', fontSize: 10 }}>
            {config.plotWidth}×{config.plotDepth}ft
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-3)' }}>Floors</span>
          <span style={{ color: 'var(--text-1)', fontFamily: 'monospace' }}>G+{config.floors - 1}</span>
        </div>
        {config.generatedByAI && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <span className="badge badge-purple" style={{ fontSize: 9.5 }}>✨ AI Generated</span>
          </div>
        )}
      </div>

      {/* Tree */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 6px' }} className="no-scrollbar">
        {Object.entries(TREE_DATA).map(([name, data], i) => (
          <TreeSection key={name} name={name} data={data} defaultOpen={i < 2} />
        ))}
      </div>

      {/* Bottom: Phase indicator */}
      <div style={{
        padding: '8px 10px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-base)',
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 4 }}>CONSTRUCTION PHASE</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['Design', 'Permit', 'Build', 'Finish'].map((p, i) => (
            <div key={p} style={{
              flex: 1, padding: '3px 4px', textAlign: 'center',
              background: i === 0 ? 'var(--cyan-dim)' : 'var(--bg-elevated)',
              border: `1px solid ${i === 0 ? 'var(--border-accent)' : 'var(--border)'}`,
              borderRadius: 4, fontSize: 8.5, fontWeight: 700,
              color: i === 0 ? 'var(--cyan)' : 'var(--text-4)',
            }}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
