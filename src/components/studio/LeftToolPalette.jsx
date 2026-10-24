import React, { useState, useEffect } from 'react';

const TABS = [
  { id: 'arch',     icon: '🏛️', label: 'Architecture' },
  { id: 'struct',   icon: '🏗️', label: 'Structure' },
  { id: 'mep',      icon: '⚙️', label: 'MEP Systems' },
  { id: 'furn',     icon: '🛋️', label: 'Furniture' },
  { id: 'annotate', icon: '📐', label: 'Annotate & Measure' },
  { id: 'view',     icon: '🌐', label: 'View & Grid' },
];

const TOOLS_BY_TAB = {
  arch: [
    { id: 'select',  icon: '↖', label: 'Select Element', shortcut: 'S' },
    { id: 'wall',    icon: '▬', label: 'Wall',           shortcut: 'WA' },
    { id: 'door',    icon: '🚪', label: 'Door',           shortcut: 'DR' },
    { id: 'window',  icon: '🪟', label: 'Window',         shortcut: 'WN' },
    { id: 'roof',    icon: '🏠', label: 'Roof',           shortcut: 'RF' },
    { id: 'floor',   icon: '🔲', label: 'Floor Slab',      shortcut: 'FL' },
    { id: 'stair',   icon: '🪜', label: 'Stairs',         shortcut: 'ST' },
    { id: 'railing', icon: '‖', label: 'Railing',        shortcut: 'RL' },
    { id: 'lift',    icon: '🛗', label: 'Elevator Lift',  shortcut: 'LF' },
    { id: 'room',    icon: '🟢', label: 'Room Zone',      shortcut: 'RM' },
  ],
  struct: [
    { id: 'select',  icon: '↖', label: 'Select Element', shortcut: 'S' },
    { id: 'column',  icon: '🟫', label: 'RCC Column',     shortcut: 'CL' },
    { id: 'beam',    icon: '┬', label: 'Concrete Beam',  shortcut: 'BM' },
    { id: 'slab',    icon: '▭', label: 'Structural Slab',shortcut: 'SL' },
    { id: 'foundation', icon: '⬓', label: 'Footing Foundation', shortcut: 'FN' },
    { id: 'steel-beam', icon: '工', label: 'Steel I-Beam', shortcut: 'SB' },
    { id: 'truss',   icon: '▲', label: 'Roof Truss',      shortcut: 'TR' },
  ],
  mep: [
    { id: 'select',  icon: '↖', label: 'Select Element', shortcut: 'S' },
    { id: 'duct',    icon: '▫️', label: 'HVAC Duct',      shortcut: 'DU' },
    { id: 'pipe',    icon: '🔵', label: 'Plumbing Pipe',  shortcut: 'PP' },
    { id: 'hvac',    icon: '📦', label: 'HVAC Unit',      shortcut: 'HV' },
    { id: 'light',   icon: '💡', label: 'Light Fixture',  shortcut: 'LT' },
    { id: 'valve',   icon: '🎛️', label: 'Control Valve',  shortcut: 'VL' },
    { id: 'sprinkler', icon: '🚿', label: 'Fire Sprinkler', shortcut: 'SP' },
  ],
  furn: [
    { id: 'select',  icon: '↖', label: 'Select Element', shortcut: 'S' },
    { id: 'bedroom', icon: '🛏️', label: 'Bed',            shortcut: 'BD' },
    { id: 'living',  icon: '🛋️', label: 'Sofa',           shortcut: 'SO' },
    { id: 'kitchen', icon: '🍳', label: 'Kitchen Counter',shortcut: 'KT' },
    { id: 'bathroom',icon: '🚰', label: 'Bathroom WC',    shortcut: 'BT' },
    { id: 'pool',    icon: '🏊', label: 'Swimming Pool',  shortcut: 'PL' },
  ],
  annotate: [
    { id: 'select',  icon: '↖', label: 'Select Element', shortcut: 'S' },
    { id: 'dim',     icon: '↔', label: 'Dimension Line',  shortcut: 'DI' },
    { id: 'text',    icon: 'T', label: 'Text Label',      shortcut: 'TX' },
    { id: 'tag',     icon: '🏷', label: 'Component Tag',   shortcut: 'TG' },
    { id: 'measure', icon: '📏', label: 'Ruler Measure',  shortcut: 'ME' },
    { id: 'area',    icon: '⬡', label: 'Area Calculator', shortcut: 'AR' },
  ],
  view: [
    { id: 'orbit',   icon: '🌐', label: 'Orbit Cam',      shortcut: 'OR' },
    { id: 'pan',     icon: '✋', label: 'Pan Cam',        shortcut: 'PA' },
    { id: 'zoom',    icon: '🔍', label: 'Zoom Cam',       shortcut: 'Z' },
    { id: 'walkthru',icon: '🚶', label: 'Walkthrough',     shortcut: 'WK' },
    { id: 'snap',    icon: '⊹', label: 'Snap to Grid',    shortcut: 'SN' },
    { id: 'grid',    icon: '⊞', label: 'Toggle Grid Lines',shortcut: 'GR' },
  ],
};

function Tooltip({ label, shortcut }) {
  return (
    <div style={{
      position: 'absolute', left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)',
      background: 'var(--bg-panel)', border: '1px solid var(--border-accent)',
      borderRadius: 8, padding: '6px 10px', whiteSpace: 'nowrap', zIndex: 100,
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
      color: 'var(--text-1)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>{label}</div>
      {shortcut && (
        <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>
          Shortcut: <span style={{ color: 'var(--beige)' }}>{shortcut}</span>
        </div>
      )}
      <div style={{
        position: 'absolute', left: -5, top: '50%',
        width: 8, height: 8, background: 'var(--bg-panel)',
        border: '1px solid var(--border-accent)', borderRight: 'none', borderTop: 'none',
        transform: 'translateY(-50%) rotate(45deg)',
      }} />
    </div>
  );
}

const getStageAllowedTabAndTools = (stage, mode) => {
  if (mode === 'ai') {
    return { allowedTabs: ['arch', 'struct', 'mep', 'furn', 'annotate', 'view'], allowedTools: null };
  }
  switch (stage) {
    case 2: // Site & Grid Setup
      return { allowedTabs: ['view', 'annotate'], allowedTools: ['select', 'dim', 'text', 'tag', 'measure', 'area', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid'] };
    case 3: // Foundation Stage
      return { allowedTabs: ['struct', 'view', 'annotate'], allowedTools: ['select', 'foundation', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 4: // Column Placement
      return { allowedTabs: ['struct', 'view', 'annotate'], allowedTools: ['select', 'column', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 5: // Beam Placement
      return { allowedTabs: ['struct', 'view', 'annotate'], allowedTools: ['select', 'beam', 'steel-beam', 'truss', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 6: // Slab Construction
      return { allowedTabs: ['struct', 'arch', 'view', 'annotate'], allowedTools: ['select', 'slab', 'floor', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 7: // Wall Construction
      return { allowedTabs: ['arch', 'view', 'annotate'], allowedTools: ['select', 'wall', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 8: // Doors & Windows
      return { allowedTabs: ['arch', 'view', 'annotate'], allowedTools: ['select', 'door', 'window', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 9: // Staircase & Lift
      return { allowedTabs: ['arch', 'view', 'annotate'], allowedTools: ['select', 'stair', 'railing', 'lift', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 10: // Roof Design
      return { allowedTabs: ['arch', 'view', 'annotate'], allowedTools: ['select', 'roof', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 11: // MEP
      return { allowedTabs: ['mep', 'view', 'annotate'], allowedTools: ['select', 'duct', 'pipe', 'hvac', 'light', 'valve', 'sprinkler', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 12: // Interior Planning
      return { allowedTabs: ['furn', 'view', 'annotate'], allowedTools: ['select', 'bedroom', 'living', 'kitchen', 'bathroom', 'pool', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid', 'dim', 'measure'] };
    case 13: // Final Validation
      return { allowedTabs: ['view', 'annotate'], allowedTools: ['select', 'dim', 'text', 'tag', 'measure', 'area', 'orbit', 'pan', 'zoom', 'walkthru', 'snap', 'grid'] };
    default:
      return { allowedTabs: ['arch', 'struct', 'mep', 'furn', 'annotate', 'view'], allowedTools: null };
  }
};

export default function LeftToolPalette({
  activeTool, setActiveTool, onWalkthrough,
  showGrid, setShowGrid, snapGrid, setSnapGrid,
  currentStage, mode
}) {
  const [activeTab, setActiveTab] = useState('arch');
  const [hoveredTool, setHoveredTool] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);

  const { allowedTabs, allowedTools } = getStageAllowedTabAndTools(currentStage, mode);

  // Auto-switch tab if it becomes locked
  useEffect(() => {
    if (mode === 'manual' && allowedTabs && !allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
      const firstAllowed = TOOLS_BY_TAB[allowedTabs[0]]?.find(t => !allowedTools || allowedTools.includes(t.id))?.id;
      if (firstAllowed) setActiveTool(firstAllowed);
    }
  }, [currentStage, activeTab, allowedTabs, allowedTools, mode, setActiveTool]);

  const tools = TOOLS_BY_TAB[activeTab] || [];

  return (
    <div style={{
      width: 52, flexShrink: 0,
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto', overflowX: 'visible',
      zIndex: 30,
      position: 'relative',
    }} className="no-scrollbar">

      {/* Tabs list (Vertical group) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 0', width: '100%', alignItems: 'center' }}>
        {TABS.map(tab => {
          const isTabActive = activeTab === tab.id;
          const isTabHovered = hoveredTab === tab.id;
          const isTabLocked = mode === 'manual' && allowedTabs && !allowedTabs.includes(tab.id);

          return (
            <div
              key={tab.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button
                onClick={() => {
                  if (isTabLocked) return;
                  setActiveTab(tab.id);
                  const firstTool = TOOLS_BY_TAB[tab.id]?.find(t => !allowedTools || allowedTools.includes(t.id))?.id;
                  if (firstTool) setActiveTool(firstTool);
                }}
                disabled={isTabLocked}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isTabActive ? 'var(--beige-mid)' : isTabHovered ? 'var(--bg-hover)' : 'transparent',
                  border: `1px solid ${isTabActive ? 'var(--border-accent)' : 'transparent'}`,
                  cursor: isTabLocked ? 'not-allowed' : 'pointer', fontSize: 15,
                  transition: 'all 0.15s ease',
                  opacity: isTabLocked ? 0.3 : 1,
                }}
              >
                {isTabLocked ? '🔒' : tab.icon}
              </button>
              {isTabHovered && (
                <div style={{
                  position: 'absolute', left: 42, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(10,10,10,0.9)', color: 'white', fontSize: 9.5, padding: '4px 8px',
                  borderRadius: 4, whiteSpace: 'nowrap', zIndex: 100, border: '1px solid var(--border)',
                  pointerEvents: 'none', fontWeight: 600, letterSpacing: '0.04em'
                }}>
                  {tab.label} {isTabLocked && '(Locked)'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '4px auto' }} />

      {/* Items for current active tab */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 10 }}>
        {tools.map(tool => {
          const isActive = activeTool === tool.id;
          const isHovered = hoveredTool === tool.id;
          const isToolLocked = mode === 'manual' && allowedTools && !allowedTools.includes(tool.id);

          return (
            <div
              key={tool.id}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}
              onMouseEnter={() => !isToolLocked && setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
            >
              <button
                onClick={() => {
                  if (isToolLocked) return;
                  if (tool.id === 'walkthru') {
                    onWalkthrough?.();
                  } else if (tool.id === 'grid') {
                    setShowGrid?.(g => !g);
                  } else if (tool.id === 'snap') {
                    setSnapGrid?.(s => !s);
                  }
                  setActiveTool(tool.id);
                }}
                disabled={isToolLocked}
                style={{
                  width: 36, height: 36, borderRadius: 8, margin: '1px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive
                    ? 'var(--beige-dim)'
                    : isHovered ? 'var(--bg-hover)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--border-accent)' : 'transparent'}`,
                  color: isToolLocked ? 'var(--text-4)' : isActive ? 'var(--beige)' : isHovered ? 'var(--text-1)' : 'var(--text-3)',
                  cursor: isToolLocked ? 'not-allowed' : 'pointer', fontSize: 13,
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 0 10px rgba(200,184,162,0.2)' : 'none',
                  fontWeight: 700,
                  opacity: isToolLocked ? 0.25 : 1,
                }}
              >
                {tool.icon}
              </button>
              {isHovered && !isToolLocked && <Tooltip label={tool.label} shortcut={tool.shortcut} />}
            </div>
          );
        })}
      </div>

      {/* Bottom active status */}
      <div style={{ marginTop: 'auto', marginBottom: 8, textAlign: 'center' }}>
        <div style={{
          fontSize: 7, fontFamily: 'JetBrains Mono', color: 'var(--text-4)',
          letterSpacing: '0.04em', lineHeight: 1.4, padding: '0 4px',
        }}>
          {(activeTool || 'SELECT').toUpperCase().slice(0, 5)}
        </div>
      </div>
    </div>
  );
}
