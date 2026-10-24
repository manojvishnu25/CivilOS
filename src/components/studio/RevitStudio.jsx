import React, { useState, useEffect } from 'react';
import RibbonToolbar from './RibbonToolbar';
import LeftToolPalette from './LeftToolPalette';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import BottomStatusBar from './BottomStatusBar';
import AIAssistantPanel from './AIAssistantPanel';
import PlanView from './PlanView';
import { Canvas3D } from '../3d/Canvas3D';

/* ── Viewport tab bar ─────────────────────────────────── */
function ViewportTabBar({ active, setActive, isWalkthrough, setIsWalkthrough }) {
  const tabs = [
    { id: '3d',      label: '3D View',    icon: '🏛️' },
    { id: 'plan',    label: 'Plan View',  icon: '📐' },
    { id: 'section', label: 'Section',    icon: '✂️' },
  ];

  return (
    <div style={{
      position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 4, zIndex: 20,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--border)', borderRadius: 12, padding: '4px 6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            setActive(tab.id);
            if (tab.id !== '3d' && isWalkthrough) setIsWalkthrough(false);
          }}
          style={{
            padding: '5px 14px', borderRadius: 8,
            background: active === tab.id ? 'var(--beige-dim)' : 'transparent',
            color: active === tab.id ? 'var(--beige)' : 'var(--text-3)',
            border: `1px solid ${active === tab.id ? 'var(--border-accent)' : 'transparent'}`,
            cursor: 'pointer', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'all 0.2s ease', letterSpacing: '0.04em',
            boxShadow: active === tab.id ? '0 0 12px rgba(200,184,162,0.15)' : 'none',
          }}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

const STAGES_LIST = [
  { id: 1, label: "Init" },
  { id: 2, label: "Setup" },
  { id: 3, label: "Found" },
  { id: 4, label: "Col" },
  { id: 5, label: "Beam" },
  { id: 6, label: "Slab" },
  { id: 7, label: "Wall" },
  { id: 8, label: "Open" },
  { id: 9, label: "Stair" },
  { id: 10, label: "Roof" },
  { id: 11, label: "MEP" },
  { id: 12, label: "Interior" },
  { id: 13, label: "Audit" },
];

function ProgressTrackerBar({ currentStage, setCurrentStage, maxStage, setMaxStage, mode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 20px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)',
      width: '100%', overflowX: 'auto', flexShrink: 0, gap: 8
    }} className="no-scrollbar">
      {STAGES_LIST.map((stage) => {
        const isCompleted = stage.id < maxStage;
        const isActive = stage.id === currentStage;
        const isLocked = stage.id > maxStage && mode === 'manual';

        return (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => {
                if (!isLocked) setCurrentStage(stage.id);
              }}
              disabled={isLocked}
              style={{
                width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isCompleted ? '#8FA876' : isActive ? 'var(--cyan)' : 'var(--bg-elevated)',
                border: `1.5px solid ${isCompleted ? '#8FA876' : isActive ? 'var(--cyan)' : 'var(--border)'}`,
                color: isCompleted || isActive ? '#0A0A0A' : 'var(--text-3)',
                fontSize: 9, fontWeight: 700, cursor: isLocked ? 'default' : 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isActive ? '0 0 10px rgba(0,212,255,0.25)' : 'none',
              }}
            >
              {isCompleted ? '✓' : isLocked ? '🔒' : stage.id}
            </button>
            <span style={{
              fontSize: 9, fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--cyan)' : isCompleted ? 'var(--text-1)' : 'var(--text-4)',
              letterSpacing: '0.04em', textTransform: 'uppercase'
            }}>
              {stage.label}
            </span>
            {stage.id < 13 && (
              <div style={{
                width: 14, height: 1.5,
                background: isCompleted ? '#8FA876' : 'var(--border)',
                marginLeft: 4
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const BLUEPRINTS = [
  {
    name: "Vastu Residential Villa",
    buildingType: "villa",
    plotWidth: 40,
    plotDepth: 60,
    plotFacing: "north",
    floors: 2,
    bhk: 3,
    level: "Beginner",
    icon: "🏡",
    desc: "Design a customized, Vastu-compliant family home. Focus on room placement, structural grids, and stairs.",
    tags: ["Vastu Shastra", "Standard RCC Frame", "Natural Ventilation"]
  },
  {
    name: "Multi-Story Apartment Block",
    buildingType: "apartment",
    plotWidth: 60,
    plotDepth: 80,
    plotFacing: "east",
    floors: 4,
    bhk: 8,
    level: "Intermediate",
    icon: "🏢",
    desc: "Erect a high-rise structure. Focus on vertical columns spacing, elevator lift shafts, and structural slabs.",
    tags: ["RCC Grid Columns", "Elevator Shafts", "Fire Safety Stairs"]
  },
  {
    name: "Healthcare Center & Hospital",
    buildingType: "hospital",
    plotWidth: 80,
    plotDepth: 100,
    plotFacing: "north",
    floors: 3,
    bhk: 12,
    level: "Advanced",
    icon: "🏥",
    desc: "Build a medical clinic. Focus on accessibility, wide corridors, mechanical ventilation, and sanitation plumbing.",
    tags: ["2m Safety Corridors", "MEP Gas Piping", "HVAC Climate Control"]
  },
  {
    name: "Industrial Factory & Warehouse",
    buildingType: "factory",
    plotWidth: 100,
    plotDepth: 150,
    plotFacing: "west",
    floors: 1,
    bhk: 1,
    level: "Expert",
    icon: "🏭",
    desc: "Erect a heavy industrial plant. Focus on deep footing foundations, high steel I-beams, and roof truss spans.",
    tags: ["High Clearance", "Raft Foundations", "Heavy Overhead Ducts"]
  }
];

export default function RevitStudio({ config, setConfig, mode, onExit }) {
  const [currentStage, setCurrentStage]       = useState(mode === 'manual' ? 1 : 13);
  const [maxStage, setMaxStage]               = useState(mode === 'manual' ? 1 : 13);
  const [viewMode, setViewMode]               = useState('architectural');
  const [viewportMode, setViewportMode]       = useState('3d');    // '3d' | 'plan' | 'section'
  const [activeTool, setActiveTool]           = useState('select');
  const [activeTab, setActiveTab]             = useState('Architecture');
  const [activeFloorCutaway, setActiveFloor]  = useState('all');
  const [sunTime, setSunTime]                 = useState(12);
  const [leftOpen, setLeftOpen]               = useState(true);
  const [rightOpen, setRightOpen]             = useState(true);
  const [aiPanelOpen, setAiPanelOpen]         = useState(true);
  const [selectedItem, setSelectedItem]       = useState(null);
  const [isWalkthrough, setIsWalkthrough]     = useState(false);
  const [coords, setCoords]                   = useState({ x: 0, y: 0, z: 0 });
  const [fps, setFps]                         = useState(60);
  const [showGrid, setShowGrid]               = useState(true);
  const [showShadows, setShowShadows]         = useState(true);
  const [snapOrtho, setSnapOrtho]             = useState(false);
  const [snapPolar, setSnapPolar]             = useState(false);
  const [snapGrid, setSnapGrid]               = useState(true);

  const [saveStatus, setSaveStatus]           = useState('synced'); // synced | saving | saved
  const [showLoadModal, setShowLoadModal]     = useState(false);
  const [projectsList, setProjectsList]       = useState([]);

  // Debounced auto-save function
  const saveProject = async (projConfig, forceStatus = null) => {
    if (forceStatus) setSaveStatus(forceStatus);
    else setSaveStatus('saving');
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projConfig),
      });
      const savedProj = await res.json();
      
      // Update config with the ID returned if not already set
      if (!projConfig.id && savedProj.id) {
        setConfig(c => ({ ...c, id: savedProj.id }));
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('synced'), 1500);
    } catch (err) {
      console.error('Failed to save project:', err);
      setSaveStatus('synced');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      saveProject(config);
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [config]);

  const handleManualSave = () => {
    saveProject(config, 'saving');
  };

  const handleLoadClick = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjectsList(data);
      setShowLoadModal(true);
    } catch (err) {
      console.error('Failed to load projects list:', err);
    }
  };

  const handleNewProject = () => {
    if (window.confirm("Create a new project? All unsaved drawing changes will be reset.")) {
      setConfig({
        buildingType: 'villa',
        plotWidth: 40,
        plotDepth: 60,
        plotFacing: 'north',
        floors: 2,
        bhk: 3,
        bedrooms: 3,
        bathrooms: 2,
        budgetLevel: 'premium',
        architecturalStyle: 'modern',
        materials: ['concrete', 'brick'],
        climate: 'hot',
        hasPool: false,
        hasSolar: true,
        hasLift: false,
        hasGarden: true,
        hasParking: true,
        hasGym: false,
        hasHomeTheater: false,
        hasBalcony: true,
        hasTerrace: true,
        hasPrayerRoom: false,
        soilType: 'medium',
        generatedByAI: false,
        placedObjects: [],
        name: "New BIM Project"
      });
      setActiveTool('select');
      setViewMode('architectural');
      setViewportMode('3d');
    }
  };

  const handleAICommand = (cmd) => {
    const lower = cmd.toLowerCase();
    if (lower.includes('floor') && lower.includes('add')) {
      setConfig(c => ({ ...c, floors: Math.min(20, c.floors + 1) }));
    } else if (lower.includes('pool')) {
      setConfig(c => ({ ...c, hasPool: true }));
    } else if (lower.includes('solar')) {
      setConfig(c => ({ ...c, hasSolar: true }));
    } else if (lower.includes('structural')) {
      setViewMode('structural');
    } else if (lower.includes('mep')) {
      setViewMode('mep');
    } else if (lower.includes('vastu')) {
      setViewMode('vastu');
    } else if (lower.includes('sunlight')) {
      setViewMode('sunlight');
    } else if (lower.includes('plan view') || lower.includes('2d')) {
      setViewportMode('plan');
    } else if (lower.includes('walkthrough') || lower.includes('walk')) {
      setViewportMode('3d'); setIsWalkthrough(true);
    } else if (lower.includes('3d') || lower.includes('render')) {
      setViewMode('architectural'); setViewportMode('3d');
    }
  };

  const handleSelectTemplate = (bp) => {
    setConfig(c => ({
      ...c,
      buildingType: bp.buildingType,
      plotWidth: bp.plotWidth,
      plotDepth: bp.plotDepth,
      plotFacing: bp.plotFacing,
      floors: bp.floors,
      bhk: bp.bhk,
      name: bp.name,
      generatedByAI: false,
    }));
    setCurrentStage(2);
    setMaxStage(2);
  };

  return (
    <div className={(mode === 'manual' || mode === 'ai') ? 'light-theme' : ''} style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
      background: (mode === 'manual' || mode === 'ai') ? '#FFFFFF' : 'var(--bg-base)', overflow: 'hidden', color: 'var(--text-1)',
    }}>
      {/* Full-Screen Project Suggestions Selector */}
      {mode === 'manual' && currentStage === 1 && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: '#FFFFFF',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '40px 20px', fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ maxWidth: 1000, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--beige)', letterSpacing: '0.25em' }}>
              STAGE 1: PROJECT INITIALIZATION
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.02em' }}>
              Choose Your Construction Project
            </h2>
            <p style={{ fontSize: 13, color: '#666', maxWidth: 600, margin: '0 auto 30px' }}>
              Select a curated engineering blueprint. Your virtual Civil Engineer will guide you step-by-step through foundations, columns, beams, slabs, walls, doors, stairs, roofs, and MEP systems.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {BLUEPRINTS.map((bp) => (
                <button
                  key={bp.name}
                  onClick={() => handleSelectTemplate(bp)}
                  style={{
                    background: '#FFFFFF', border: '1.5px solid #EAEAEA', borderRadius: 16,
                    padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column',
                    gap: 12, cursor: 'pointer', transition: 'all 0.25s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--beige)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(200,184,162,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#EAEAEA';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{bp.icon}</span>
                    <span className="badge badge-purple" style={{ fontSize: 8.5, border: '1px solid var(--border)' }}>
                      {bp.level}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>
                      {bp.name}
                    </h3>
                    <span style={{ fontSize: 9, color: 'var(--beige)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {bp.plotWidth}ft × {bp.plotDepth}ft • {bp.floors} {bp.floors === 1 ? 'Floor' : 'Floors'}
                    </span>
                  </div>
                  <p style={{ fontSize: 10.5, color: '#666', lineHeight: 1.5, margin: 0 }}>
                    {bp.desc}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto', paddingTop: 8 }}>
                    {bp.tags.map(t => (
                      <span key={t} style={{ fontSize: 8, background: '#F5F5F5', color: '#555', padding: '3px 6px', borderRadius: 4, fontWeight: 500 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Ribbon Toolbar */}
      <RibbonToolbar
        activeTab={activeTab}            setActiveTab={setActiveTab}
        activeTool={activeTool}          setActiveTool={setActiveTool}
        viewMode={viewMode}              setViewMode={setViewMode}
        config={config}                  setConfig={setConfig}
        activeFloorCutaway={activeFloorCutaway} setActiveFloorCutaway={setActiveFloor}
        sunTime={sunTime}                setSunTime={setSunTime}
        isWalkthrough={isWalkthrough}    setIsWalkthrough={setIsWalkthrough}
        leftOpen={leftOpen}              setLeftOpen={setLeftOpen}
        rightOpen={rightOpen}            setRightOpen={setRightOpen}
        aiPanelOpen={aiPanelOpen}        setAiPanelOpen={setAiPanelOpen}
        showGrid={showGrid}              setShowGrid={setShowGrid}
        showShadows={showShadows}        setShowShadows={setShowShadows}
        viewportMode={viewportMode}      setViewportMode={setViewportMode}
        onExit={onExit}
        onNew={handleNewProject}
        onSave={handleManualSave}
        onLoad={handleLoadClick}
      />

      {/* Progress Tracker Bar */}
      <ProgressTrackerBar
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        maxStage={maxStage}
        setMaxStage={setMaxStage}
        mode={mode}
      />

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ── Left Tool Palette (always visible) */}
        <LeftToolPalette
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onWalkthrough={() => { setViewportMode('3d'); setIsWalkthrough(v => !v); }}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          snapGrid={snapGrid}
          setSnapGrid={setSnapGrid}
          currentStage={currentStage}
          mode={mode}
        />

        {/* ── Left BIM Sidebar */}
        {leftOpen && (
          <LeftSidebar
            config={config} setConfig={setConfig}
            selectedItem={selectedItem} setSelectedItem={setSelectedItem}
            viewMode={viewMode}
          />
        )}

        {/* ── Center Viewport ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: (mode === 'manual' || mode === 'ai') ? '#FFFFFF' : 'var(--bg-base)' }}>

          {/* Viewport tab bar — floats above center */}
          <ViewportTabBar
            active={viewportMode} setActive={setViewportMode}
            isWalkthrough={isWalkthrough} setIsWalkthrough={setIsWalkthrough}
          />

          {/* ── 3D Canvas */}
          {viewportMode === '3d' && (
            <Canvas3D
              config={config}
              mode={mode}
              viewMode={viewMode}
              activeFloorCutaway={activeFloorCutaway}
              sunTime={sunTime}
              isWalkthrough={isWalkthrough}
              setIsWalkthrough={setIsWalkthrough}
              showGrid={showGrid}
              showShadows={showShadows}
              onCoordsChange={setCoords}
              onFpsChange={setFps}
              activeTool={activeTool}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              onPlaceObject={(type, position, customVal) => {
                setConfig(c => ({
                  ...c,
                  placedObjects: [...(c.placedObjects || []), { id: Date.now(), type, position, customVal }]
                }));
              }}
            />
          )}

          {/* ── Plan / Section View */}
          {(viewportMode === 'plan' || viewportMode === 'section') && (
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <PlanView config={config} mode={mode} />
            </div>
          )}

          {/* Walkthrough overlay hint */}
          {isWalkthrough && viewportMode === '3d' && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', zIndex: 20, textAlign: 'center',
            }}>
              <div className="viewport-badge" style={{ padding: '8px 20px', marginBottom: 10 }}>
                🚶 WALKTHROUGH — Click to lock pointer, WASD to move
              </div>
              <div className="viewport-badge" style={{ fontSize: 10 }}>
                Mouse: Look&nbsp;|&nbsp;WASD: Move&nbsp;|&nbsp;Q/E: Up/Down&nbsp;|&nbsp;Esc: Exit
              </div>
            </div>
          )}
        </div>

        {/* ── Right Sidebar + AI Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', width: 'var(--right-w)' }}>
          {aiPanelOpen && (
            <AIAssistantPanel
              config={config}
              onCommand={handleAICommand}
              isWalkthrough={isWalkthrough}
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
              maxStage={maxStage}
              setMaxStage={setMaxStage}
              mode={mode}
            />
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <BottomStatusBar
        activeTool={activeTool}
        coords={coords}
        fps={fps}
        viewMode={viewMode}
        viewportMode={viewportMode}
        showGrid={showGrid}
        config={config}
        isWalkthrough={isWalkthrough}
        snapOrtho={snapOrtho}   setSnapOrtho={setSnapOrtho}
        snapPolar={snapPolar}   setSnapPolar={setSnapPolar}
        snapGrid={snapGrid}     setSnapGrid={setSnapGrid}
        saveStatus={saveStatus}
      />

      {/* Load Project Modal */}
      {showLoadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--bg-panel)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 24, width: '90%', maxWidth: 500,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-1)' }}>Load Saved Project</h3>
              <button className="btn-ghost" onClick={() => setShowLoadModal(false)} style={{ padding: '4px 8px' }}>✕</button>
            </div>
            
            <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
              {projectsList.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-4)' }}>No saved projects found.</div>
              ) : (
                projectsList.map(proj => (
                  <div 
                    key={proj.id}
                    onClick={() => {
                      setConfig(proj);
                      setShowLoadModal(false);
                    }}
                    style={{
                      padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.02)', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.2s',
                    }}
                    className="project-load-item"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--beige)';
                      e.currentTarget.style.background = 'rgba(200, 184, 162, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{proj.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        {proj.floors} Floors • {proj.bhk} BHK • {proj.architecturalStyle} style
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--text-4)' }}>
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
