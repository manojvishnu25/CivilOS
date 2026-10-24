import React, { useState } from 'react';
import CNNAnalysisStep from './CNNAnalysisStep';

const STEPS = [
  'Building Type', 'Land Details', 'Rooms & Spaces',
  'Style', 'Materials', 'Budget', 'Climate', 'CNN Analysis', 'Generate',
];

const BUILDING_TYPES = [
  { id: 'house', icon: '🏠', label: 'House' },
  { id: 'apartment', icon: '🏢', label: 'Apartment' },
  { id: 'villa', icon: '🏡', label: 'Villa' },
  { id: 'hospital', icon: '🏥', label: 'Hospital' },
  { id: 'school', icon: '🏫', label: 'School' },
  { id: 'mall', icon: '🛍️', label: 'Mall' },
  { id: 'office', icon: '🏗️', label: 'Office' },
  { id: 'factory', icon: '🏭', label: 'Factory' },
  { id: 'warehouse', icon: '🏬', label: 'Warehouse' },
  { id: 'hotel', icon: '🏨', label: 'Hotel' },
  { id: 'custom', icon: '⚙️', label: 'Custom' },
];

const STYLES = [
  { id: 'modern', label: 'Modern', icon: '◻️' },
  { id: 'luxury', label: 'Luxury', icon: '👑' },
  { id: 'contemporary', label: 'Contemporary', icon: '⬡' },
  { id: 'traditional', label: 'Traditional', icon: '🏛️' },
  { id: 'minimal', label: 'Minimal', icon: '○' },
  { id: 'industrial', label: 'Industrial', icon: '⚙️' },
  { id: 'scandinavian', label: 'Scandinavian', icon: '❄️' },
  { id: 'japanese', label: 'Japanese', icon: '⛩️' },
  { id: 'mediterranean', label: 'Mediterranean', icon: '🌊' },
  { id: 'classic', label: 'Classic', icon: '🏛️' },
];

const MATERIALS = [
  { id: 'brick', label: 'Brick', icon: '🧱', color: '#ef4444' },
  { id: 'concrete', label: 'Concrete', icon: '🪨', color: '#6b7280' },
  { id: 'steel', label: 'Steel', icon: '⚙️', color: '#94a3b8' },
  { id: 'wood', label: 'Wood', icon: '🪵', color: '#78350f' },
  { id: 'aac', label: 'AAC Block', icon: '🔲', color: '#e2e8f0' },
  { id: 'glass', label: 'Glass', icon: '💎', color: '#0ea5e9' },
  { id: 'composite', label: 'Composite', icon: '🔩', color: '#8b5cf6' },
  { id: 'eco', label: 'Eco-Friendly', icon: '🌿', color: '#10b981' },
];

const CLIMATES = [
  { id: 'hot', label: 'Hot & Dry', icon: '☀️' },
  { id: 'cold', label: 'Cold', icon: '❄️' },
  { id: 'rainy', label: 'Rainy / Humid', icon: '🌧️' },
  { id: 'snow', label: 'Snowfall', icon: '❄️' },
  { id: 'coastal', label: 'Coastal', icon: '🌊' },
  { id: 'earthquake', label: 'Earthquake Zone', icon: '⚡' },
  { id: 'wind', label: 'High Wind Zone', icon: '💨' },
];

const BUDGET_LEVELS = [
  { id: 'low', label: 'Economy', sub: '₹800–1200/sqft', color: '#10b981' },
  { id: 'medium', label: 'Standard', sub: '₹1200–1800/sqft', color: '#0ea5e9' },
  { id: 'premium', label: 'Premium', sub: '₹1800–2800/sqft', color: '#8b5cf6' },
  { id: 'luxury', label: 'Luxury', sub: '₹2800–4500/sqft', color: '#f59e0b' },
  { id: 'ultra', label: 'Ultra Luxury', sub: '₹4500+/sqft', color: '#ef4444' },
];

const ROOMS = [
  'Bedrooms', 'Bathrooms', 'Kitchen', 'Dining', 'Living Room',
  'Balcony', 'Parking', 'Garden', 'Swimming Pool', 'Home Theater',
  'Gym', 'Terrace', 'Office Room', 'Prayer Room', 'Store Room',
  'Laundry', 'Lift', 'Staircase',
];

const FACINGS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const SOIL_TYPES = ['Hard Rock', 'Medium', 'Soft Clay', 'Sandy', 'Fill'];

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 80 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? 'var(--beige)' : active ? 'rgba(200,184,162,0.15)' : 'var(--bg-elevated)',
                border: `2px solid ${done ? 'var(--beige)' : active ? 'var(--beige)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? '#0A0A0A' : active ? 'var(--beige)' : 'var(--text-3)',
                fontSize: 12, fontWeight: 700, transition: 'all 0.3s ease',
                boxShadow: active ? '0 0 15px rgba(200,184,162,0.30)' : 'none',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: active ? 'var(--beige)' : done ? 'var(--text-2)' : 'var(--text-4)',
                whiteSpace: 'nowrap', letterSpacing: '0.02em',
              }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 20,
                background: done ? 'var(--beige)' : 'var(--border)',
                transition: 'background 0.3s ease',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`wizard-chip ${selected ? 'selected' : ''}`}
      style={{ userSelect: 'none' }}
    >
      {children}
    </button>
  );
}

export default function AIWizard({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [genPhase, setGenPhase] = useState(0);
  const [data, setData] = useState({
    buildingType: 'villa',
    plotWidth: 40,
    plotDepth: 60,
    plotFacing: 'north',
    soilType: 'medium',
    cornerPlot: false,
    floors: 2,
    bhk: 3,
    rooms: ['Bedrooms', 'Bathrooms', 'Kitchen', 'Living Room', 'Parking'],
    style: 'modern',
    materials: ['concrete', 'brick'],
    budgetLevel: 'premium',
    climate: 'hot',
  });

  const toggle = (key, val) => {
    const arr = data[key] || [];
    setData(d => ({
      ...d,
      [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val],
    }));
  };

  const next = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  const handleGenerate = () => {
    setGenerating(true);
    const phases = [
      'Analyzing site parameters...', 'Generating floor plan...', 'Placing structural elements...',
      'Designing MEP systems...', 'Optimizing room layout...', 'Applying architectural style...',
      'Rendering 3D model...', 'Finalizing BIM data...',
    ];
    let p = 0;
    const interval = setInterval(() => {
      p++;
      setGenPhase(p);
      if (p >= phases.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete({
            buildingType: data.buildingType,
            plotWidth: data.plotWidth,
            plotDepth: data.plotDepth,
            floors: data.floors,
            bhk: data.bhk,
            budgetLevel: data.budgetLevel,
            architecturalStyle: data.style,
            materials: data.materials,
            climate: data.climate,
            plotFacing: data.plotFacing,
            soilType: data.soilType,
            hasPool: data.rooms.includes('Swimming Pool'),
            hasGym: data.rooms.includes('Gym'),
            hasHomeTheater: data.rooms.includes('Home Theater'),
            hasGarden: data.rooms.includes('Garden'),
            hasParking: data.rooms.includes('Parking'),
            hasBalcony: data.rooms.includes('Balcony'),
            hasTerrace: data.rooms.includes('Terrace'),
            hasPrayerRoom: data.rooms.includes('Prayer Room'),
            hasLift: data.rooms.includes('Lift'),
            hasSolar: true,
          });
        }, 600);
      }
    }, 600);
  };

  const GEN_PHASES = [
    'Analyzing site parameters...', 'Generating floor plan...', 'Placing structural elements...',
    'Designing MEP systems...', 'Optimizing room layout...', 'Applying architectural style...',
    'Rendering 3D model...', 'Finalizing BIM data...',
  ];

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: 'var(--bg-base)', display: 'flex', flexDirection: 'column',
    }}>
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(20px)',
        padding: '14px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-ghost" onClick={onBack}>← Back</button>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--beige)' }}>AI Design Wizard</span>
        </div>
        <div className="badge badge-beige">Step {step + 1} of {STEPS.length}</div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 60px 40px', zIndex: 10, position: 'relative' }}>
        <StepIndicator current={step} />

        {/* STEP 0: Building Type */}
        {step === 0 && (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>What do you want to build?</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Select the type of structure you want to design</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {BUILDING_TYPES.map(bt => (
                <button
                  key={bt.id}
                  onClick={() => setData(d => ({ ...d, buildingType: bt.id }))}
                  className={`wizard-step-btn ${data.buildingType === bt.id ? 'selected' : ''}`}
                  style={{ flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 16px', textAlign: 'center' }}
                >
                  <span style={{ fontSize: 32 }}>{bt.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{bt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Land Details */}
        {step === 1 && (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Land Details</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Tell us about your plot / site</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Plot Length (feet)
                </label>
                <input type="number" value={data.plotWidth}
                  onChange={e => setData(d => ({ ...d, plotWidth: Number(e.target.value) }))}
                  style={{ padding: '10px 14px', width: '100%', fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Plot Width (feet)
                </label>
                <input type="number" value={data.plotDepth}
                  onChange={e => setData(d => ({ ...d, plotDepth: Number(e.target.value) }))}
                  style={{ padding: '10px 14px', width: '100%', fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Plot Area (auto)
                </label>
                <input type="text" readOnly
                  value={`${(data.plotWidth * data.plotDepth).toFixed(0)} sq ft (${((data.plotWidth * data.plotDepth) * 0.0929).toFixed(1)} m²)`}
                  style={{ padding: '10px 14px', width: '100%', fontSize: 13, color: 'var(--beige)' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Facing Direction
                </label>
                <select value={data.plotFacing} onChange={e => setData(d => ({ ...d, plotFacing: e.target.value }))}
                  style={{ padding: '10px 14px', width: '100%', fontSize: 14 }}>
                  {FACINGS.map(f => <option key={f} value={f.toLowerCase().replace('-', '')}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Soil Type
                </label>
                <select value={data.soilType} onChange={e => setData(d => ({ ...d, soilType: e.target.value }))}
                  style={{ padding: '10px 14px', width: '100%', fontSize: 14 }}>
                  {SOIL_TYPES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 28 }}>
                <input type="checkbox" id="corner"
                  checked={data.cornerPlot}
                  onChange={e => setData(d => ({ ...d, cornerPlot: e.target.checked }))}
                  style={{ width: 18, height: 18 }} />
                <label htmlFor="corner" style={{ fontSize: 14, color: 'var(--text-1)', cursor: 'pointer' }}>
                  Corner Plot
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Rooms & Spaces */}
        {step === 2 && (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Rooms & Spaces</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Select all spaces you want in your building</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Number of Floors
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1,2,3,4,5,6,7,8,10,12,15].map(n => (
                    <button key={n}
                      onClick={() => setData(d => ({ ...d, floors: n }))}
                      style={{
                        width: 38, height: 38, borderRadius: 8,
                        background: data.floors === n ? 'var(--cyan)' : 'var(--bg-elevated)',
                        border: `1px solid ${data.floors === n ? 'var(--cyan)' : 'var(--border)'}`,
                        color: data.floors === n ? '#000' : 'var(--text-2)',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      }}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  BHK Configuration
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1,2,3,4,5,6].map(n => (
                    <button key={n}
                      onClick={() => setData(d => ({ ...d, bhk: n }))}
                      style={{
                        padding: '8px 14px', borderRadius: 8,
                        background: data.bhk === n ? 'var(--cyan)' : 'var(--bg-elevated)',
                        border: `1px solid ${data.bhk === n ? 'var(--cyan)' : 'var(--border)'}`,
                        color: data.bhk === n ? '#000' : 'var(--text-2)',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      }}>{n}BHK</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ROOMS.map(r => (
                <Chip key={r} selected={data.rooms.includes(r)} onClick={() => toggle('rooms', r)}>
                  {r}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Style */}
        {step === 3 && (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Architectural Style</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Choose the visual aesthetic for your building</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setData(d => ({ ...d, style: s.id }))}
                  className={`wizard-step-btn ${data.style === s.id ? 'selected' : ''}`}
                >
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Materials */}
        {step === 4 && (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Primary Materials</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Select construction materials (multiple allowed)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {MATERIALS.map(m => {
                const sel = data.materials.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle('materials', m.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '18px 20px', borderRadius: 14,
                      background: sel ? `${m.color}15` : 'var(--bg-elevated)',
                      border: `2px solid ${sel ? m.color + '60' : 'var(--border)'}`,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      color: sel ? m.color : 'var(--text-2)',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{m.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: sel ? m.color : 'var(--text-1)' }}>
                        {m.label}
                      </div>
                      {sel && <div style={{ fontSize: 10, color: m.color, marginTop: 2 }}>✓ Selected</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Budget */}
        {step === 5 && (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Budget Range</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Select your construction budget tier</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 600 }}>
              {BUDGET_LEVELS.map(b => {
                const sel = data.budgetLevel === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setData(d => ({ ...d, budgetLevel: b.id }))}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '20px 24px', borderRadius: 14,
                      background: sel ? `${b.color}12` : 'var(--bg-elevated)',
                      border: `2px solid ${sel ? b.color + '60' : 'var(--border)'}`,
                      cursor: 'pointer', transition: 'all 0.25s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: sel ? b.color : 'var(--bg-hover)',
                        border: `2px solid ${b.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}>
                        {sel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#000' }} />}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: sel ? b.color : 'var(--text-1)' }}>{b.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{b.sub}</div>
                      </div>
                    </div>
                    {sel && <div className="badge" style={{ background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}40` }}>Selected</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Climate */}
        {step === 6 && (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Climate Zone</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Climate affects structural design, materials, and ventilation</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {CLIMATES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setData(d => ({ ...d, climate: c.id }))}
                  className={`wizard-step-btn ${data.climate === c.id ? 'selected' : ''}`}
                >
                  <span style={{ fontSize: 28 }}>{c.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Generate */}
        {step === 8 && (
          <div className="anim-fade-up" style={{ textAlign: 'center', padding: '20px 0' }}>
            {!generating ? (
              <>
                <div style={{ fontSize: 72, marginBottom: 24, animation: 'float 3s ease-in-out infinite' }}>🏗️</div>
                <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Ready to Generate!</h2>
                <p style={{ color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 32px' }}>
                  Your AI will create a complete 3D BIM model with floor plans, structural elements,
                  MEP systems, material schedules, and cost estimates.
                </p>

                {/* Summary */}
                <div className="glass-card" style={{ maxWidth: 500, margin: '0 auto 36px', padding: 24, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, marginBottom: 14, color: 'var(--cyan)' }}>Design Summary</div>
                  {[
                    ['Building Type', data.buildingType.toUpperCase()],
                    ['Plot Size', `${data.plotWidth}ft × ${data.plotDepth}ft`],
                    ['Floors', `G+${data.floors - 1} (${data.floors} floors)`],
                    ['Configuration', `${data.bhk} BHK`],
                    ['Style', data.style.charAt(0).toUpperCase() + data.style.slice(1)],
                    ['Budget', BUDGET_LEVELS.find(b => b.id === data.budgetLevel)?.label],
                    ['Climate', CLIMATES.find(c => c.id === data.climate)?.label],
                  ].map(([k, v]) => (
                    <div key={k} className="prop-row">
                      <span className="prop-label">{k}</span>
                      <span className="prop-value" style={{ color: 'var(--cyan)' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-primary anim-pulse-glow"
                  style={{ fontSize: 18, padding: '18px 52px', borderRadius: 16 }}
                  onClick={handleGenerate}
                >
                  ✨ Generate Smart Building
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                {/* Animated rings */}
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '2px solid transparent', borderTopColor: 'var(--cyan)',
                    animation: 'spin-slow 1.5s linear infinite',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 12, borderRadius: '50%',
                    border: '2px solid transparent', borderTopColor: 'rgba(0,212,255,0.5)',
                    animation: 'spin-slow-rev 2s linear infinite',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 24, borderRadius: '50%',
                    border: '2px solid transparent', borderTopColor: 'rgba(0,212,255,0.3)',
                    animation: 'spin-slow 3s linear infinite',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 36,
                  }}>
                    🤖
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: 'var(--cyan)' }}>
                    AI is Building Your Design
                  </h3>
                  <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                    {GEN_PHASES[Math.min(genPhase, GEN_PHASES.length - 1)]}
                  </p>
                </div>

                {/* Progress */}
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{
                    height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      background: 'linear-gradient(90deg, var(--cyan), #4080ff)',
                      width: `${(genPhase / GEN_PHASES.length) * 100}%`,
                      transition: 'width 0.5s ease',
                      boxShadow: '0 0 12px rgba(0,212,255,0.5)',
                    }} />
                  </div>
                  <div style={{
                    marginTop: 8, fontSize: 11, color: 'var(--text-3)',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span className="mono">{Math.round((genPhase / GEN_PHASES.length) * 100)}% complete</span>
                    <span className="mono">Step {genPhase}/{GEN_PHASES.length}</span>
                  </div>
                </div>

                {/* Phase list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 400 }}>
                  {GEN_PHASES.map((ph, i) => (
                    <div key={ph} style={{
                      display: 'flex', alignItems: 'center', gap: 10, fontSize: 12,
                      color: i < genPhase ? 'var(--text-2)' : i === genPhase ? 'var(--beige)' : 'var(--text-4)',
                      transition: 'color 0.3s',
                    }}>
                      <span>{i < genPhase ? '✓' : i === genPhase ? '⟳' : '○'}</span>
                      <span>{ph}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CNN Analysis Step (full-screen takeover) */}
      {step === STEPS.indexOf('CNN Analysis') && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, top: 49 }}>
          <CNNAnalysisStep
            onBack={prev}
            onNext={next}
          />
        </div>
      )}

      {/* Navigation */}
      {!generating && step !== STEPS.indexOf('CNN Analysis') && (
        <div style={{
          borderTop: '1px solid var(--border)',
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          padding: '16px 60px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 10,
        }}>
          <button className="btn-secondary" onClick={step === 0 ? onBack : prev}>
            ← {step === 0 ? 'Back to Modes' : 'Previous'}
          </button>
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-4)' }}>
            {step + 1} / {STEPS.length} — {STEPS[step]}
          </div>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={next}>
              Next: {STEPS[step + 1]} →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleGenerate}>
              ✨ Generate Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}
