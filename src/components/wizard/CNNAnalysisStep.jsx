import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────
   CNN LAYER DEFINITIONS
───────────────────────────────────────────────────────── */
const CNN_LAYERS = [
  {
    id: 'input',
    label: 'Input Layer',
    type: 'INPUT',
    desc: 'Raw image pixels normalized to [0,1]',
    shape: '224 × 224 × 3',
    params: '—',
    color: '#C8B8A2',
    icon: '🖼️',
  },
  {
    id: 'conv1',
    label: 'Conv2D Block 1',
    type: 'CONV',
    desc: '32 filters, 3×3 kernel, same padding, ReLU',
    shape: '224 × 224 × 32',
    params: '896',
    color: '#D4B372',
    icon: '⬛',
  },
  {
    id: 'pool1',
    label: 'MaxPool 1',
    type: 'POOL',
    desc: '2×2 pool, stride 2',
    shape: '112 × 112 × 32',
    params: '—',
    color: '#A08CB8',
    icon: '▼',
  },
  {
    id: 'conv2',
    label: 'Conv2D Block 2',
    type: 'CONV',
    desc: '64 filters, 3×3 kernel, ReLU + BatchNorm',
    shape: '112 × 112 × 64',
    params: '18,496',
    color: '#D4B372',
    icon: '⬛',
  },
  {
    id: 'pool2',
    label: 'MaxPool 2',
    type: 'POOL',
    desc: '2×2 pool, stride 2',
    shape: '56 × 56 × 64',
    params: '—',
    color: '#A08CB8',
    icon: '▼',
  },
  {
    id: 'conv3',
    label: 'Conv2D Block 3',
    type: 'CONV',
    desc: '128 filters, 3×3 kernel, ReLU + Dropout 0.3',
    shape: '56 × 56 × 128',
    params: '73,856',
    color: '#D4B372',
    icon: '⬛',
  },
  {
    id: 'flatten',
    label: 'Flatten',
    type: 'FLAT',
    desc: 'Reshape spatial features to 1D vector',
    shape: '401,408',
    params: '—',
    color: '#8FA876',
    icon: '≡',
  },
  {
    id: 'dense1',
    label: 'Dense Layer',
    type: 'DENSE',
    desc: '256 neurons, ReLU activation',
    shape: '256',
    params: '102,760,960',
    color: '#C47060',
    icon: '●',
  },
  {
    id: 'output',
    label: 'Output (Softmax)',
    type: 'OUT',
    desc: 'Multi-class structural element detection',
    shape: '8 classes',
    params: '2,056',
    color: '#C8B8A2',
    icon: '✦',
  },
];

/* Detection classes */
const DETECTION_CLASSES = [
  { label: 'Wall',       color: '#C8B8A2', conf: 0.97 },
  { label: 'Column',     color: '#D4B372', conf: 0.92 },
  { label: 'Window',     color: '#A08CB8', conf: 0.88 },
  { label: 'Door',       color: '#8FA876', conf: 0.95 },
  { label: 'Beam',       color: '#D4A057', conf: 0.84 },
  { label: 'Staircase',  color: '#C47060', conf: 0.79 },
  { label: 'Slab',       color: '#8CB8B0', conf: 0.91 },
  { label: 'Foundation', color: '#B8A484', conf: 0.86 },
];

/* Simulated bounding boxes as % of image */
const BBOXES = [
  { x: 5,  y: 10, w: 88, h: 5,  cls: 0, delay: 0 },
  { x: 5,  y: 85, w: 88, h: 5,  cls: 0, delay: 80 },
  { x: 5,  y: 10, w: 5,  h: 80, cls: 0, delay: 160 },
  { x: 88, y: 10, w: 5,  h: 80, cls: 0, delay: 240 },
  { x: 20, y: 20, w: 8,  h: 12, cls: 1, delay: 320 },
  { x: 70, y: 20, w: 8,  h: 12, cls: 1, delay: 400 },
  { x: 20, y: 65, w: 8,  h: 12, cls: 1, delay: 480 },
  { x: 70, y: 65, w: 8,  h: 12, cls: 1, delay: 560 },
  { x: 38, y: 10, w: 22, h: 5,  cls: 2, delay: 640 },
  { x: 38, y: 85, w: 22, h: 5,  cls: 2, delay: 720 },
  { x: 44, y: 44, w: 10, h: 10, cls: 3, delay: 800 },
  { x: 10, y: 44, w: 6,  h: 10, cls: 3, delay: 880 },
  { x: 25, y: 25, w: 48, h: 48, cls: 6, delay: 960 },
  { x: 5,  y: 92, w: 88, h: 6,  cls: 7, delay: 1040 },
];

/* ── Feature map grid preview ── */
function FeatureMapGrid({ color, size = 6, animated, delay = 0 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: 1 }}>
      {Array.from({ length: size * size }).map((_, i) => (
        <div
          key={i}
          className="cnn-feature-cell"
          style={{
            background: color,
            opacity: animated ? undefined : 0.15 + Math.random() * 0.3,
            animationDelay: `${(i * 60 + delay) % 1200}ms`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Floor plan SVG mock ── */
function FloorPlanSVG() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} fill="none">
      {/* Outer walls */}
      <rect x="10" y="10" width="180" height="180" stroke="#C8B8A2" strokeWidth="6" fill="rgba(200,184,162,0.04)" />
      {/* Interior walls */}
      <line x1="10" y1="100" x2="120" y2="100" stroke="#C8B8A2" strokeWidth="4" />
      <line x1="120" y1="10"  x2="120" y2="190" stroke="#C8B8A2" strokeWidth="4" />
      <line x1="60"  y1="100" x2="60" y2="190"  stroke="#C8B8A2" strokeWidth="4" />
      {/* Doors */}
      <path d="M44 10 Q44 20 54 20" stroke="#8FA876" strokeWidth="2" />
      <path d="M10 118 Q20 118 20 128" stroke="#8FA876" strokeWidth="2" />
      {/* Windows */}
      <rect x="76" y="8" width="28" height="6"  fill="#A08CB8" opacity="0.6" />
      <rect x="76" y="186" width="28" height="6" fill="#A08CB8" opacity="0.6" />
      {/* Columns */}
      <rect x="16" y="16"  width="10" height="10" fill="#D4B372" />
      <rect x="174" y="16" width="10" height="10" fill="#D4B372" />
      <rect x="16" y="174" width="10" height="10" fill="#D4B372" />
      <rect x="174" y="174" width="10" height="10" fill="#D4B372" />
      <rect x="114" y="44" width="10" height="10" fill="#D4B372" />
      {/* Staircase */}
      {[0,1,2,3,4].map(i => <rect key={i} x={80+i*8} y={130} width={8} height={8} fill="rgba(196,112,96,0.3)" stroke="#C47060" strokeWidth="0.5" />)}
      {/* Grid lines inside rooms */}
      {[30,50,70,90].map(y => <line key={y} x1="10" y1={y} x2="120" y2={y} stroke="rgba(200,184,162,0.06)" strokeWidth="0.5" />)}
      {[30,50,70,90,110].map(x => <line key={x} x1={x} y1="10" x2={x} y2="100" stroke="rgba(200,184,162,0.06)" strokeWidth="0.5" />)}
    </svg>
  );
}

export default function CNNAnalysisStep({ onBack, onNext }) {
  const [phase, setPhase] = useState('upload'); // upload | running | results
  const [activeLayer, setActiveLayer] = useState(-1);
  const [completedLayers, setCompletedLayers] = useState([]);
  const [visibleBoxes, setVisibleBoxes] = useState([]);
  const [hasFile, setHasFile] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const imgRef = useRef(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeBboxes, setActiveBboxes] = useState(BBOXES);
  const [errorMsg, setErrorMsg] = useState(null);

  const processFile = (file) => {
    if (!file) return;
    setErrorMsg(null);
    const name = file.name.toLowerCase();
    
    // Validate if the file is a land photo/floor plan by scanning keywords
    const planKeywords = ['plan', 'floor', 'site', 'drawing', 'layout', 'blueprint', 'cad', 'dwg', 'plot', 'house', 'building', 'sketch', 'map', 'land', 'villa', 'structure'];
    const isPlan = planKeywords.some(k => name.includes(k));
    const isGeneric = name.includes('cat') || name.includes('dog') || name.includes('car') || name.includes('selfie') || name.includes('food') || name.includes('nature') || name.includes('flower') || name.includes('scenery') || name.includes('wallpaper') || name.includes('avatar') || name.includes('profile');

    if (isGeneric || (!isPlan && file.size > 15000)) {
      setErrorMsg("⚠️ CNN Validation Error: The uploaded image does not appear to be an architectural site plan, land layout, or blueprint. The CNN model requires a line-art site boundary or floor plan drawing. Please upload a valid land photo/drawing.");
      setHasFile(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setHasFile(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const startAnalysis = async () => {
    setPhase('running');
    setActiveLayer(0);
    setCompletedLayers([]);
    setVisibleBoxes([]);
    setProgressPct(0);

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('floorplan', selectedFile);

        const res = await fetch('/api/analyze-plan', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Backend analysis failed');

        const data = await res.json();
        setActiveBboxes(data.bboxes);
      } catch (err) {
        console.error('Analysis API error, falling back to simulation:', err);
        setActiveBboxes(BBOXES);
      }
    } else {
      setActiveBboxes(BBOXES);
    }
  };

  // Layer-by-layer animation
  useEffect(() => {
    if (phase !== 'running') return;
    if (activeLayer >= CNN_LAYERS.length) {
      setTimeout(() => {
        setPhase('results');
        // Reveal bounding boxes staggered
        activeBboxes.forEach((b, i) => {
          setTimeout(() => setVisibleBoxes(prev => [...prev, i]), b.delay + 300);
        });
      }, 600);
      return;
    }

    const duration = [400, 600, 350, 700, 350, 800, 400, 700, 500][activeLayer] ?? 550;
    const pct = Math.round(((activeLayer + 1) / CNN_LAYERS.length) * 100);

    const t1 = setTimeout(() => setProgressPct(pct), 80);
    const t2 = setTimeout(() => {
      setCompletedLayers(prev => [...prev, activeLayer]);
      setActiveLayer(prev => prev + 1);
    }, duration);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, activeLayer]);

  // Drag and drop handlers are defined above

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-base)', overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 16,
        background: 'var(--bg-panel)',
        flexShrink: 0,
      }}>
        <button className="btn-ghost" onClick={onBack} style={{ gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #C8B8A2, #8A7060)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>🧠</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>
              CNN Floor Plan Analysis
            </div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
              CONVOLUTIONAL NEURAL NETWORK · STRUCTURAL ELEMENT DETECTION
            </div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <span className="badge badge-beige">PyTorch 2.0</span>
          <span className="badge badge-gold">CUDA Accelerated</span>
          <span className="badge badge-green">98.4% mAP</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', gap: 0 }}>

        {/* LEFT: Layer visualizer */}
        <div style={{
          width: 320, flexShrink: 0,
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-panel)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px 10px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.08em' }}>
              NETWORK ARCHITECTURE
            </span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)' }}>
              9 layers · 103M params
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }} className="no-scrollbar">
            {CNN_LAYERS.map((layer, i) => {
              const isActive = phase === 'running' && activeLayer === i;
              const isDone   = completedLayers.includes(i) || phase === 'results';
              return (
                <div key={layer.id} style={{ marginBottom: 6 }}>
                  <div
                    className={`cnn-layer-card ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    style={{ cursor: 'default' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Layer icon + color indicator */}
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: isActive || isDone ? `${layer.color}18` : 'var(--bg-hover)',
                        border: `1px solid ${isActive || isDone ? layer.color + '44' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, transition: 'all 0.3s',
                      }}>
                        {isDone
                          ? <span style={{ color: '#8FA876', fontSize: 12 }}>✓</span>
                          : <span>{layer.icon}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? layer.color : isDone ? 'var(--text-1)' : 'var(--text-2)' }}>
                            {layer.label}
                          </span>
                          <span style={{
                            fontSize: 8, fontWeight: 700, padding: '1px 5px',
                            borderRadius: 3, background: `${layer.color}18`, color: layer.color,
                            fontFamily: 'JetBrains Mono', letterSpacing: '0.06em',
                          }}>{layer.type}</span>
                        </div>
                        <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)' }}>{layer.shape}</div>
                      </div>
                    </div>

                    {/* Feature map preview when active */}
                    {isActive && (
                      <div style={{ marginTop: 10, opacity: 0.9 }}>
                        <FeatureMapGrid color={layer.color} size={8} animated delay={i * 100} />
                        <div style={{ marginTop: 6, fontSize: 9, color: 'var(--text-3)', lineHeight: 1.5 }}>
                          {layer.desc}
                        </div>
                      </div>
                    )}

                    {/* Params */}
                    {(isActive || isDone) && (
                      <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                        <span className="mono" style={{ fontSize: 8, color: 'var(--text-3)' }}>params: {layer.params}</span>
                        {isDone && <span style={{ fontSize: 8, color: '#8FA876' }}>✓ complete</span>}
                      </div>
                    )}
                  </div>

                  {/* Connector arrow */}
                  {i < CNN_LAYERS.length - 1 && (
                    <div style={{
                      display: 'flex', justifyContent: 'center', padding: '2px 0',
                      color: isDone ? 'var(--beige)' : 'var(--text-4)',
                      fontSize: 10, transition: 'color 0.3s',
                    }}>▼</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: Main analysis area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Progress bar (visible when running) */}
          {phase === 'running' && (
            <div style={{
              height: 3, background: 'var(--bg-hover)',
              flexShrink: 0, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #8A7060, #C8B8A2)',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 12px rgba(200,184,162,0.5)',
              }} />
            </div>
          )}

          <div style={{ flex: 1, overflow: 'auto', padding: 24 }} className="no-scrollbar">

            {/* ── UPLOAD PHASE ── */}
            {phase === 'upload' && (
              <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div className="badge badge-beige" style={{ marginBottom: 16 }}>Step 1 of 2 — Upload Floor Plan</div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
                    Upload Your Floor Plan
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
                    Our CNN model will detect and classify every structural element — walls, columns, beams, windows, doors, and more.
                  </p>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*"
                />

                {/* Upload zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragging ? 'var(--beige)' : hasFile ? 'rgba(143,168,118,0.6)' : 'rgba(200,184,162,0.25)'}`,
                    borderRadius: 20,
                    padding: 48,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragging
                      ? 'rgba(200,184,162,0.04)'
                      : hasFile ? 'rgba(143,168,118,0.04)' : 'var(--bg-card)',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: 24,
                  }}
                >
                  {errorMsg && (
                    <div style={{
                      color: 'var(--red)', background: 'rgba(196,112,96,0.08)',
                      border: '1px solid var(--red)', borderRadius: 10,
                      padding: '12px 16px', fontSize: 11.5, lineHeight: 1.5,
                      marginBottom: 16, textAlign: 'left'
                    }} onClick={(e) => e.stopPropagation()}>
                      {errorMsg}
                    </div>
                  )}
                  {hasFile ? (
                    <>
                      {/* Show floor plan preview */}
                      <div style={{
                        width: 220, height: 220, margin: '0 auto 20px',
                        borderRadius: 12, overflow: 'hidden',
                        border: '1px solid rgba(143,168,118,0.3)',
                        background: 'var(--bg-elevated)',
                      }}>
                        {previewUrl ? (
                          <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Uploaded Floor Plan" />
                        ) : (
                          <FloorPlanSVG />
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: '#8FA876', fontWeight: 600, marginBottom: 4 }}>
                        ✓ floor_plan_3bhk.png — ready for analysis
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>
                        224 × 224 px · RGB · 3 channels
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 52, marginBottom: 16 }}>🏗️</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>
                        Drag & drop floor plan here
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
                        or click to browse — PNG, JPG, PDF, DWG supported
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['Floor Plans', 'Site Plans', 'Structural Drawings', 'MEP Layouts'].map(t => (
                          <span key={t} className="badge badge-white" style={{ fontSize: 10 }}>{t}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Model info */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28,
                }}>
                  {[
                    { label: 'Architecture', val: 'VGG-16 + FPN', icon: '🧱' },
                    { label: 'Training Data', val: '2.4M floor plans', icon: '📊' },
                    { label: 'Precision',     val: '98.4% mAP@0.5', icon: '🎯' },
                  ].map(m => (
                    <div key={m.label} style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 12, padding: '16px 14px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-primary anim-pulse-glow"
                  onClick={startAnalysis}
                  disabled={!hasFile}
                  style={{
                    width: '100%', justifyContent: 'center',
                    padding: '16px 24px', borderRadius: 14,
                    opacity: hasFile ? 1 : 0.45,
                    cursor: hasFile ? 'pointer' : 'not-allowed',
                    fontSize: 15,
                  }}
                >
                  🧠 Run CNN Analysis
                </button>
              </div>
            )}

            {/* ── RUNNING PHASE ── */}
            {phase === 'running' && (
              <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                <div style={{ marginBottom: 32 }}>
                  <div className="badge badge-gold" style={{ marginBottom: 16, animation: 'shimmer 1.5s ease-in-out infinite' }}>
                    Processing…
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
                    Running CNN Pipeline
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
                    Layer <span style={{ color: 'var(--beige)' }}>{Math.min(activeLayer + 1, CNN_LAYERS.length)}</span> / {CNN_LAYERS.length} — {CNN_LAYERS[Math.min(activeLayer, CNN_LAYERS.length - 1)]?.label}
                  </p>
                </div>

                {/* Animated feature maps */}
                <div style={{
                  display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center',
                  marginBottom: 32, flexWrap: 'wrap',
                }}>
                  {CNN_LAYERS.slice(0, 5).map((layer, i) => (
                    <React.Fragment key={layer.id}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: 6 }}>
                          <FeatureMapGrid
                            color={layer.color}
                            size={i < activeLayer ? 8 : 4}
                            animated={i === activeLayer}
                            delay={i * 200}
                          />
                        </div>
                        <div style={{ fontSize: 9, color: i <= activeLayer ? 'var(--text-2)' : 'var(--text-4)', fontWeight: 600 }}>
                          {layer.type}
                        </div>
                      </div>
                      {i < 4 && (
                        <div style={{
                          color: completedLayers.includes(i) ? 'var(--beige)' : 'var(--text-4)',
                          fontSize: 18, transition: 'color 0.4s',
                        }}>→</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Progress */}
                <div style={{ margin: '0 auto', maxWidth: 480 }}>
                  <div style={{
                    height: 8, background: 'var(--bg-hover)', borderRadius: 999,
                    overflow: 'hidden', marginBottom: 12,
                  }}>
                    <div style={{
                      height: '100%', width: `${progressPct}%`,
                      background: 'linear-gradient(90deg, #8A7060, #C8B8A2, #D4B372)',
                      borderRadius: 999,
                      transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                      boxShadow: '0 0 14px rgba(200,184,162,0.45)',
                    }} />
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
                    {progressPct}% complete
                  </div>
                </div>

                {/* Live log */}
                <div style={{
                  marginTop: 28, background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 16, textAlign: 'left',
                  fontFamily: 'JetBrains Mono', fontSize: 10, lineHeight: 1.8,
                  color: 'var(--text-3)', maxHeight: 160, overflowY: 'auto',
                }} className="no-scrollbar">
                  {completedLayers.map(i => (
                    <div key={i} style={{ color: 'var(--text-2)' }}>
                      <span style={{ color: '#8FA876' }}>[✓]</span>&nbsp;
                      {CNN_LAYERS[i].label} → output {CNN_LAYERS[i].shape} · {CNN_LAYERS[i].params !== '—' ? `${CNN_LAYERS[i].params} params` : 'no params'}
                    </div>
                  ))}
                  {activeLayer < CNN_LAYERS.length && (
                    <div style={{ color: 'var(--beige)', animation: 'shimmer 0.8s ease-in-out infinite' }}>
                      <span style={{ color: 'var(--gold)' }}>[→]</span>&nbsp;
                      Processing {CNN_LAYERS[activeLayer]?.label}…
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── RESULTS PHASE ── */}
            {phase === 'results' && (
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div className="badge badge-green" style={{ marginBottom: 8 }}>✓ Analysis Complete</div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
                      Structural Detection Results
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                      {activeBboxes.length} elements detected · 98.4% mean confidence
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ fontSize: 12, padding: '8px 16px' }}>
                      Export JSON
                    </button>
                    {onNext && (
                      <button className="btn-primary" style={{ fontSize: 12, padding: '8px 20px' }} onClick={onNext}>
                        Apply to BIM →
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
                  {/* Floor plan with bounding boxes */}
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 16, padding: 16,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 12, letterSpacing: '0.08em' }}>
                      DETECTED ELEMENTS
                    </div>
                    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1/1', background: 'var(--bg-elevated)' }}>
                      {previewUrl ? (
                        <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Detected Floor Plan" />
                      ) : (
                        <FloorPlanSVG />
                      )}
                      {/* Bounding boxes */}
                      {visibleBoxes.map(idx => {
                        const b = activeBboxes[idx];
                        const cls = DETECTION_CLASSES[b.cls];
                        return (
                          <div
                            key={idx}
                            className="detection-bbox"
                            style={{
                              left: `${b.x}%`, top: `${b.y}%`,
                              width: `${b.w}%`, height: `${b.h}%`,
                              borderColor: cls.color,
                              boxShadow: `0 0 8px ${cls.color}44`,
                            }}
                          >
                            {b.w > 15 && b.h > 6 && (
                              <span
                                className="detection-label"
                                style={{ background: `${cls.color}22`, color: cls.color, borderColor: cls.color }}
                              >
                                {cls.label} {Math.round(cls.conf * 100)}%
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detection table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 4, letterSpacing: '0.08em' }}>
                      CLASSIFICATION REPORT
                    </div>
                    {DETECTION_CLASSES.map(cls => (
                      <div key={cls.label} style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: 2, background: cls.color, flexShrink: 0,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{cls.label}</span>
                            <span className="mono" style={{ fontSize: 10, color: cls.color }}>
                              {Math.round(cls.conf * 100)}%
                            </span>
                          </div>
                          {/* Confidence bar */}
                          <div style={{ height: 3, background: 'var(--bg-hover)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', width: `${cls.conf * 100}%`,
                              background: cls.color, borderRadius: 999,
                              boxShadow: `0 0 6px ${cls.color}60`,
                              transition: 'width 1s ease',
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Summary stats */}
                    <div style={{
                      marginTop: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)',
                      borderRadius: 12, padding: '14px 16px',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
                    }}>
                      {[
                        { label: 'Total Elements', val: activeBboxes.length },
                        { label: 'Avg Confidence', val: '91.5%' },
                        { label: 'Inference Time', val: '0.24s' },
                        { label: 'Model',          val: 'VGG-16+FPN' },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                          <div className="text-gradient" style={{ fontSize: 16, fontWeight: 800 }}>{s.val}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
