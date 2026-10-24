import React, { useState } from 'react';

const RIBBON_TABS = [
  'File', 'Edit', 'View', 'Architecture', 'Structure', 'MEP',
  'Insert', 'Annotate', 'Analyze', 'Manage', 'Collaborate', 'Render', 'AI',
];

const TAB_TOOLS = {
  Architecture: [
    { group: 'Build', tools: [
      { id: 'wall', icon: '▬', label: 'Wall' },
      { id: 'door', icon: '🚪', label: 'Door' },
      { id: 'window', icon: '🪟', label: 'Window' },
      { id: 'roof', icon: '△', label: 'Roof' },
      { id: 'floor', icon: '▱', label: 'Floor' },
      { id: 'ceiling', icon: '⬒', label: 'Ceiling' },
    ]},
    { group: 'Circulation', tools: [
      { id: 'stair', icon: '⫶', label: 'Stairs' },
      { id: 'ramp', icon: '⌒', label: 'Ramp' },
      { id: 'railing', icon: '⫼', label: 'Railing' },
      { id: 'lift', icon: '⬆', label: 'Lift' },
    ]},
    { group: 'Room', tools: [
      { id: 'room', icon: '⬜', label: 'Room' },
      { id: 'curtain', icon: '⬚', label: 'Curtain Wall' },
      { id: 'column', icon: '▮', label: 'Column' },
    ]},
  ],
  Structure: [
    { group: 'Foundation', tools: [
      { id: 'foundation', icon: '⊓', label: 'Foundation' },
      { id: 'footing', icon: '⊔', label: 'Footing' },
      { id: 'pile', icon: '↧', label: 'Pile' },
      { id: 'raft', icon: '▭', label: 'Raft Slab' },
    ]},
    { group: 'Frame', tools: [
      { id: 'beam', icon: '━', label: 'Beam' },
      { id: 'col', icon: '│', label: 'Column' },
      { id: 'slab', icon: '▬', label: 'Slab' },
      { id: 'rebar', icon: '⊞', label: 'Rebar' },
    ]},
    { group: 'Steel', tools: [
      { id: 'steel-beam', icon: '⊢', label: 'Steel Beam' },
      { id: 'connection', icon: '⊕', label: 'Connection' },
      { id: 'truss', icon: '⋈', label: 'Truss' },
    ]},
  ],
  MEP: [
    { group: 'HVAC', tools: [
      { id: 'duct', icon: '▭', label: 'Duct' },
      { id: 'hvac', icon: '❄', label: 'HVAC Unit' },
      { id: 'grille', icon: '⊟', label: 'Air Grille' },
    ]},
    { group: 'Electrical', tools: [
      { id: 'cable', icon: '⌇', label: 'Cable Tray' },
      { id: 'panel', icon: '⊞', label: 'DB Panel' },
      { id: 'light', icon: '💡', label: 'Light' },
      { id: 'switch', icon: '⊙', label: 'Switch' },
    ]},
    { group: 'Plumbing', tools: [
      { id: 'pipe', icon: '○', label: 'Pipe' },
      { id: 'valve', icon: '◈', label: 'Valve' },
      { id: 'sprinkler', icon: '⊛', label: 'Sprinkler' },
      { id: 'drain', icon: '⊖', label: 'Drain' },
    ]},
  ],
  Analyze: [
    { group: 'Structural', tools: [
      { id: 'load', icon: '⬇', label: 'Load' },
      { id: 'stress', icon: '⚡', label: 'Stress' },
      { id: 'deflect', icon: '↙', label: 'Deflection' },
    ]},
    { group: 'Environmental', tools: [
      { id: 'sun', icon: '☀', label: 'Sun Study' },
      { id: 'wind', icon: '💨', label: 'Wind CFD' },
      { id: 'rain', icon: '🌧', label: 'Rain Flow' },
      { id: 'thermal', icon: '🌡', label: 'Thermal' },
    ]},
    { group: 'Seismic', tools: [
      { id: 'quake', icon: '⚡', label: 'Earthquake' },
      { id: 'soil', icon: '🔲', label: 'Soil Analysis' },
    ]},
  ],
  View: [
    { group: 'Views', tools: [
      { id: 'plan', icon: '⬒', label: 'Floor Plan' },
      { id: 'section', icon: '✂', label: 'Section' },
      { id: 'elevation', icon: '↑', label: 'Elevation' },
      { id: '3d', icon: '◈', label: '3D View' },
    ]},
    { group: 'Display', tools: [
      { id: 'wireframe', icon: '⬚', label: 'Wireframe' },
      { id: 'shaded', icon: '⬛', label: 'Shaded' },
      { id: 'render', icon: '◆', label: 'Realistic' },
      { id: 'xray', icon: '◻', label: 'X-Ray' },
    ]},
  ],
  Annotate: [
    { group: 'Measure', tools: [
      { id: 'dim', icon: '↔', label: 'Dimension' },
      { id: 'area', icon: '⬜', label: 'Area Tag' },
      { id: 'level', icon: '↕', label: 'Level' },
    ]},
    { group: 'Text', tools: [
      { id: 'text', icon: 'T', label: 'Text Note' },
      { id: 'keynote', icon: '#', label: 'Keynote' },
      { id: 'tag', icon: '🏷', label: 'Tag' },
    ]},
  ],
  Render: [
    { group: 'Render', tools: [
      { id: 'render-4k', icon: '🎨', label: '4K Render' },
      { id: 'render-8k', icon: '✨', label: '8K Render' },
      { id: 'night', icon: '🌙', label: 'Night View' },
      { id: 'sunset', icon: '🌅', label: 'Sunset' },
      { id: 'drone', icon: '🚁', label: 'Drone View' },
    ]},
  ],
  AI: [
    { group: 'Generate', tools: [
      { id: 'ai-gen', icon: '✨', label: 'AI Generate' },
      { id: 'ai-opt', icon: '⚡', label: 'Optimize' },
      { id: 'ai-vastu', icon: '🧭', label: 'Vastu AI' },
      { id: 'ai-cost', icon: '💰', label: 'Cost AI' },
      { id: 'ai-struct', icon: '🏗️', label: 'Structure AI' },
    ]},
    { group: 'Export', tools: [
      { id: 'ai-boq', icon: '📋', label: 'BOQ Report' },
      { id: 'ai-dwg', icon: '📐', label: 'DWG Export' },
      { id: 'ai-ifc', icon: '🔗', label: 'IFC Export' },
      { id: 'ai-pdf', icon: '📄', label: 'PDF Report' },
    ]},
  ],
  Manage: [
    { group: 'Project', tools: [
      { id: 'settings', icon: '⚙', label: 'Settings' },
      { id: 'phases', icon: '📅', label: 'Phases' },
      { id: 'links', icon: '🔗', label: 'Links' },
    ]},
  ],
  Collaborate: [
    { group: 'Team', tools: [
      { id: 'share', icon: '👥', label: 'Share' },
      { id: 'sync', icon: '☁', label: 'Cloud Sync' },
      { id: 'comment', icon: '💬', label: 'Comments' },
      { id: 'approve', icon: '✅', label: 'Approvals' },
    ]},
  ],
  Insert: [
    { group: 'Family', tools: [
      { id: 'family', icon: '📦', label: 'Load Family' },
      { id: 'import', icon: '↓', label: 'Import DWG' },
      { id: 'link', icon: '🔗', label: 'Link Revit' },
    ]},
  ],
  File: [
    { group: 'Project', tools: [
      { id: 'new', icon: '➕', label: 'New' },
      { id: 'save', icon: '💾', label: 'Save' },
      { id: 'load', icon: '📂', label: 'Load' },
    ]}
  ],
  Edit: [
    { group: 'Edit', tools: [
      { id: 'undo', icon: '↩', label: 'Undo' },
      { id: 'redo', icon: '↪', label: 'Redo' },
      { id: 'copy', icon: '⧉', label: 'Copy' },
      { id: 'paste', icon: '📋', label: 'Paste' },
      { id: 'mirror', icon: '⟷', label: 'Mirror' },
      { id: 'array', icon: '⊞', label: 'Array' },
    ]},
  ],
};

const VIEW_MODES = [
  { id: 'architectural', label: '3D Arch',   icon: '🏛️', color: 'var(--beige)' },
  { id: 'structural',   label: 'BIM Struct', icon: '🏗️', color: '#8FA876' },
  { id: 'mep',          label: 'MEP',        icon: '⚙️', color: '#8CB8B0' },
  { id: 'vastu',        label: 'Vastu',      icon: '🧭', color: '#D4B372' },
  { id: 'sunlight',     label: 'Sun',        icon: '☀️', color: '#D4A057' },
  { id: 'airflow',      label: 'CFD',        icon: '💨', color: '#A08CB8' },
];

export default function RibbonToolbar({
  activeTab, setActiveTab, activeTool, setActiveTool,
  viewMode, setViewMode, config, setConfig,
  activeFloorCutaway, setActiveFloorCutaway,
  sunTime, setSunTime, isWalkthrough, setIsWalkthrough,
  leftOpen, setLeftOpen, rightOpen, setRightOpen,
  aiPanelOpen, setAiPanelOpen,
  showGrid, setShowGrid, showShadows, setShowShadows,
  viewportMode, setViewportMode,
  onExit, onNew, onSave, onLoad,
}) {
  const [buildingType, setBuildingType] = useState(config.buildingType);
  const tools = TAB_TOOLS[activeTab] || [];

  const setBType = (t) => {
    setBuildingType(t);
    setConfig(c => ({ ...c, buildingType: t }));
  };

  return (
    <div style={{
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      {/* Top bar: Brand + Tab row + quick actions */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        borderBottom: '1px solid var(--border)',
        height: 36,
      }}>
        {/* Brand */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 16px', borderRight: '1px solid var(--border)',
          cursor: 'pointer', minWidth: 160,
        }} onClick={onExit}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'linear-gradient(135deg, #C8B8A2, #8A7060)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
            </svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-1)' }}>
            AI <span style={{ color: 'var(--beige)' }}>CivilOS</span>
          </span>
        </div>

        {/* Quick New Project Button */}
        <button
          className="btn-icon"
          title="New Project"
          onClick={onNew}
          style={{
            borderRight: '1px solid var(--border)',
            padding: '0 12px',
            fontSize: 12,
            cursor: 'pointer',
            background: 'transparent',
            borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
            color: 'var(--text-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
        >
          ➕
        </button>

        {/* Ribbon tabs */}
        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, overflowX: 'auto' }} className="no-scrollbar">
          {RIBBON_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0 14px',
                fontSize: 12,
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? 'var(--cyan)' : 'var(--text-2)',
                background: activeTab === tab ? 'var(--bg-elevated)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--cyan)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.18s',
                whiteSpace: 'nowrap',
                marginBottom: -1,
              }}
            >
              {tab === 'AI' ? '✨ AI' : tab}
            </button>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '0 12px', borderLeft: '1px solid var(--border)',
        }}>
          <button className="btn-icon" title="Toggle Left Panel" onClick={() => setLeftOpen(v => !v)}
            style={{ color: leftOpen ? 'var(--cyan)' : 'var(--text-3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <button className="btn-icon" title="Toggle Right Panel" onClick={() => setRightOpen(v => !v)}
            style={{ color: rightOpen ? 'var(--cyan)' : 'var(--text-3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>
          <button className="btn-icon" title="AI Assistant" onClick={() => setAiPanelOpen(v => !v)}
            style={{ color: aiPanelOpen ? '#8b5cf6' : 'var(--text-3)' }}>
            🤖
          </button>
          <div className="divider-v" />
          <div className="status-dot" />
          <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>LIVE</span>
        </div>
      </div>

      {/* Tool panel row */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        padding: '4px 8px', gap: 4, minHeight: 72,
        overflowX: 'auto',
      }} className="no-scrollbar">

        {/* View mode switches — always visible */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 3, padding: '4px 10px 4px 4px',
          borderRight: '1px solid var(--border)', minWidth: 'max-content',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.1em' }}>VIEW MODE</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {VIEW_MODES.map(vm => (
              <button
                key={vm.id}
                className={`btn-tool ${viewMode === vm.id ? 'active' : ''}`}
                onClick={() => setViewMode(vm.id)}
                style={{ fontSize: 9, padding: '4px 8px', minWidth: 52 }}
              >
                <span style={{ fontSize: 14 }}>{vm.icon}</span>
                <span style={{ color: viewMode === vm.id ? vm.color : undefined }}>{vm.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Building type */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 3, padding: '4px 10px 4px 8px',
          borderRight: '1px solid var(--border)', minWidth: 'max-content',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.1em' }}>BUILDING TYPE</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[
              { id: 'villa', icon: '🏡', label: 'Villa' },
              { id: 'apartment', icon: '🏢', label: 'Apt' },
              { id: 'mall', icon: '🛍️', label: 'Mall' },
              { id: 'hospital', icon: '🏥', label: 'Hosp' },
              { id: 'factory', icon: '🏭', label: 'Factory' },
            ].map(bt => (
              <button
                key={bt.id}
                className={`btn-tool ${config.buildingType === bt.id ? 'active' : ''}`}
                onClick={() => setBType(bt.id)}
                style={{ fontSize: 9, padding: '4px 8px', minWidth: 48 }}
              >
                <span style={{ fontSize: 14 }}>{bt.icon}</span>
                <span>{bt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Walk / orbit */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 3, padding: '4px 10px 4px 8px',
          borderRight: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.1em' }}>NAVIGATION</span>
          <div style={{ display: 'flex', gap: 3 }}>
            <button
              className={`btn-tool ${!isWalkthrough ? 'active' : ''}`}
              onClick={() => setIsWalkthrough(false)}
              style={{ fontSize: 9, padding: '4px 10px' }}
            >
              <span style={{ fontSize: 14 }}>🌐</span>
              <span>Orbit</span>
            </button>
            <button
              className={`btn-tool ${isWalkthrough ? 'active' : ''}`}
              onClick={() => setIsWalkthrough(true)}
              style={{
                fontSize: 9, padding: '4px 10px',
                background: isWalkthrough ? 'rgba(16,185,129,0.15)' : undefined,
                color: isWalkthrough ? 'var(--green)' : undefined,
                borderColor: isWalkthrough ? 'var(--border-green)' : undefined,
              }}
            >
              <span style={{ fontSize: 14 }}>🚶</span>
              <span>Walk</span>
            </button>
          </div>
        </div>

        {/* Floor cutaway */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 3, padding: '4px 10px 4px 8px',
          borderRight: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.1em' }}>FLOOR CUTAWAY</span>
          <div style={{ display: 'flex', gap: 3 }}>
            <button
              className={`btn-tool ${activeFloorCutaway === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFloorCutaway('all')}
              style={{ fontSize: 9, padding: '4px 10px' }}
            >
              <span style={{ fontSize: 14 }}>⬛</span>
              <span>All</span>
            </button>
            {Array.from({ length: config.floors }).map((_, f) => (
              <button
                key={f}
                className={`btn-tool ${activeFloorCutaway === f + 1 ? 'active' : ''}`}
                onClick={() => setActiveFloorCutaway(f + 1)}
                style={{ fontSize: 9, padding: '4px 8px', minWidth: 36 }}
              >
                <span style={{ fontSize: 14 }}>L{f + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sun time slider if sunlight mode */}
        {viewMode === 'sunlight' && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 12px 4px 8px',
            borderRight: '1px solid var(--border)', minWidth: 140,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.1em' }}>
              ☀ SUN TIME: {sunTime}:00
            </span>
            <input type="range" min="6" max="18" value={sunTime}
              onChange={e => setSunTime(Number(e.target.value))} style={{ marginTop: 4 }} />
          </div>
        )}

        {/* Grid / Shadows toggles */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 3, padding: '4px 10px 4px 8px',
          borderRight: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.1em' }}>DISPLAY</span>
          <div style={{ display: 'flex', gap: 3 }}>
            <button className={`btn-tool ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid(v => !v)} style={{ fontSize: 9, padding: '4px 10px' }}>
              <span style={{ fontSize: 14 }}>⊞</span><span>Grid</span>
            </button>
            <button className={`btn-tool ${showShadows ? 'active' : ''}`} onClick={() => setShowShadows(v => !v)} style={{ fontSize: 9, padding: '4px 10px' }}>
              <span style={{ fontSize: 14 }}>◐</span><span>Shadows</span>
            </button>
          </div>
        </div>

        {/* Tab-specific tools */}
        {tools.map((grp, gi) => (
          <React.Fragment key={grp.group}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 3,
              padding: '4px 10px 4px 8px',
              borderRight: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.1em' }}>
                {grp.group.toUpperCase()}
              </span>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: grp.tools.length > 4 ? 240 : 160 }}>
                {grp.tools.map(t => (
                  <button
                    key={t.id}
                    className={`btn-tool ${activeTool === t.id ? 'active' : ''}`}
                    onClick={() => {
                      const id = t.id;
                      if (id === 'new') {
                        onNew?.();
                      } else if (id === 'save') {
                        onSave?.();
                      } else if (id === 'load') {
                        onLoad?.();
                      } else if (id === 'plan') {
                        setViewportMode('plan');
                      } else if (id === 'section' || id === 'elevation') {
                        setViewportMode('section');
                      } else if (id === '3d') {
                        setViewportMode('3d');
                      } else if (id === 'wireframe') {
                        setViewMode('structural');
                      } else if (id === 'shaded' || id === 'render') {
                        setViewMode('architectural');
                      } else if (id === 'xray') {
                        setViewMode('mep');
                      } else if (id === 'sun') {
                        setViewMode('sunlight');
                      } else if (id === 'wind' || id === 'rain') {
                        setViewMode('airflow');
                      } else if (id === 'thermal') {
                        setViewMode('mep');
                      } else if (id === 'quake') {
                        setViewMode('structural');
                      } else if (id === 'ai-vastu') {
                        setViewMode('vastu');
                      } else if (id === 'ai-struct') {
                        setViewMode('structural');
                      } else if (id === 'ai-gen') {
                        setAiPanelOpen(true);
                      } else if (id === 'ai-opt') {
                        setConfig(c => ({ ...c, hasSolar: true, hasGarden: true }));
                      } else if (id === 'night') {
                        setSunTime(20);
                        setViewMode('sunlight');
                      } else if (id === 'sunset') {
                        setSunTime(18);
                        setViewMode('sunlight');
                      } else if (id === 'drone') {
                        setIsWalkthrough(true);
                      } else if (id === 'settings') {
                        setRightOpen(true);
                      } else if (id === 'share') {
                        alert("🔗 Project link generated & shared with team!");
                      } else if (id === 'sync') {
                        onSave?.();
                      } else if (id === 'ai-dwg') {
                        const blob = new Blob(["AI CivilOS AutoCAD DWG Export\nProject: " + config.buildingType], { type: "application/octet-stream" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `project-${config.buildingType}-drawing.dwg`;
                        link.click();
                        URL.revokeObjectURL(url);
                      } else if (id === 'ai-ifc') {
                        const blob = new Blob(["AI CivilOS openBIM IFC Export\nProject: " + config.buildingType], { type: "application/octet-stream" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `project-${config.buildingType}-model.ifc`;
                        link.click();
                        URL.revokeObjectURL(url);
                      } else if (id === 'ai-boq') {
                        const csvContent = "BOQ Report,Qty,Unit,Cost\nCement,420,bags,1.8L\nSteel,4.2,MT,2.5L\nBricks,28000,units,1.4L\nTotal,,,78.4L";
                        const blob = new Blob([csvContent], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `project-${config.buildingType}-boq.csv`;
                        link.click();
                        URL.revokeObjectURL(url);
                      } else if (id === 'ai-pdf') {
                        alert("📄 Compiling full project specification sheet... PDF Export starting.");
                        const blob = new Blob(["AI CivilOS Project Specification Report\n\nBuilding Type: " + config.buildingType.toUpperCase() + "\nFloors: " + config.floors + "\nStyle: " + config.architecturalStyle], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `project-${config.buildingType}-specs.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                      } else {
                        setActiveTool(id);
                      }
                    }}
                    title={t.label}
                    style={{ fontSize: 9, padding: '4px 8px', minWidth: 44 }}
                  >
                    <span style={{ fontSize: 14, fontFamily: 'monospace' }}>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
