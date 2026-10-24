import React, { useState } from 'react';

const STYLES = ['Modern', 'Luxury', 'Minimalist', 'Traditional', 'Industrial'];
const BUILDING_TYPES = ['villa', 'apartment', 'mall', 'hospital', 'factory'];

function PropRow({ label, value, editable, onEdit, unit, step = 1 }) {
  return (
    <div className="prop-row">
      <span className="prop-label" style={{ fontSize: 11 }}>{label}</span>
      {editable ? (
        <input
          type="number"
          step={step}
          value={value}
          onChange={e => onEdit(Number(e.target.value))}
          style={{ width: 64, padding: '2px 6px', fontSize: 11, textAlign: 'right', fontFamily: 'monospace' }}
        />
      ) : (
        <span className="prop-value" style={{ fontSize: 11 }}>
          {value}{unit || ''}
        </span>
      )}
    </div>
  );
}

function Section({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 8px', background: 'var(--bg-elevated)', border: 'none',
          borderRadius: 'var(--r-xs)', cursor: 'pointer', marginBottom: open ? 4 : 0,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.07em' }}>
          <span>{icon}</span> {title.toUpperCase()}
        </span>
        <span style={{ fontSize: 9, color: 'var(--text-4)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
      </button>
      {open && (
        <div style={{ padding: '0 6px', marginBottom: 6 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', padding: '5px 0' }}>
      <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 34, height: 18, borderRadius: 9, position: 'relative',
          background: value ? 'var(--cyan)' : 'var(--bg-hover)',
          border: `1px solid ${value ? 'var(--cyan)' : 'var(--border)'}`,
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: value ? 16 : 2,
          width: 12, height: 12, borderRadius: '50%',
          background: value ? '#000' : 'var(--text-3)',
          transition: 'left 0.2s ease',
        }} />
      </button>
    </div>
  );
}

export default function RightSidebar({ config, setConfig, selectedItem, setSelectedItem }) {
  const upd = (key, val) => setConfig(c => ({ ...c, [key]: val }));

  // Edit selected item position
  const handlePositionChange = (axisIndex, val) => {
    if (!selectedItem) return;
    setConfig(c => {
      const updated = (c.placedObjects || []).map(obj => {
        if (obj.id === selectedItem.id) {
          const newPos = [...obj.position];
          newPos[axisIndex] = val;
          return { ...obj, position: newPos };
        }
        return obj;
      });
      // Sync local sidebar state
      const updatedObj = updated.find(obj => obj.id === selectedItem.id);
      if (updatedObj) setSelectedItem(updatedObj);
      return { ...c, placedObjects: updated };
    });
  };

  // Edit selected item custom value (labels, names, text)
  const handleCustomValChange = (val) => {
    if (!selectedItem) return;
    setConfig(c => {
      const updated = (c.placedObjects || []).map(obj => {
        if (obj.id === selectedItem.id) {
          return { ...obj, customVal: val };
        }
        return obj;
      });
      // Sync local sidebar state
      const updatedObj = updated.find(obj => obj.id === selectedItem.id);
      if (updatedObj) setSelectedItem(updatedObj);
      return { ...c, placedObjects: updated };
    });
  };

  // Delete selected item
  const handleDeleteItem = () => {
    if (!selectedItem) return;
    setConfig(c => ({
      ...c,
      placedObjects: (c.placedObjects || []).filter(obj => obj.id !== selectedItem.id)
    }));
    setSelectedItem(null);
  };

  // Duplicate selected item
  const handleDuplicateItem = () => {
    if (!selectedItem) return;
    const newId = Date.now();
    const duplicated = {
      ...selectedItem,
      id: newId,
      position: [selectedItem.position[0] + 1.5, selectedItem.position[1], selectedItem.position[2] + 1.5], // offset slightly
    };
    setConfig(c => ({
      ...c,
      placedObjects: [...(c.placedObjects || []), duplicated]
    }));
    setSelectedItem(duplicated);
  };

  const isElementSelected = selectedItem && typeof selectedItem === 'object' && selectedItem.id;

  return (
    <div style={{
      width: 'var(--right-w)',
      minWidth: 'var(--right-w)',
      background: 'var(--bg-panel)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
      flex: 1,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 10px 8px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.06em' }}>
          PROPERTIES
        </span>
        {isElementSelected && (
          <span className="badge badge-cyan" style={{ fontSize: 9, textTransform: 'uppercase' }}>
            {selectedItem.type}
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }} className="no-scrollbar">
        {/* Selection Status or Inspector */}
        {isElementSelected ? (
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)',
            padding: 12, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--beige)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
              🔍 Element Inspector
            </div>

            <div className="prop-row">
              <span className="prop-label" style={{ fontSize: 11 }}>Element Type</span>
              <span className="prop-value" style={{ fontSize: 11, textTransform: 'capitalize', fontWeight: 600 }}>
                {selectedItem.type}
              </span>
            </div>

            <div className="prop-row">
              <span className="prop-label" style={{ fontSize: 11 }}>Element ID</span>
              <span className="prop-value" style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-3)' }}>
                {selectedItem.id.toString().slice(-6)}
              </span>
            </div>

            {/* Position inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em' }}>COORDINATES</div>
              
              <PropRow label="X Position" value={selectedItem.position[0].toFixed(2)} editable onEdit={v => handlePositionChange(0, v)} step={0.1} />
              <PropRow label="Z Position" value={selectedItem.position[2].toFixed(2)} editable onEdit={v => handlePositionChange(2, v)} step={0.1} />
              
              {/* Elevation Y Position */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                <PropRow label="Elevation (Y)" value={selectedItem.position[1].toFixed(2)} editable onEdit={v => handlePositionChange(1, v)} step={0.05} />
                <input 
                  type="range" 
                  min="-5" 
                  max="15" 
                  step="0.05"
                  value={selectedItem.position[1]} 
                  onChange={e => handlePositionChange(1, Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--cyan)' }} 
                />
              </div>
            </div>

            {/* Custom value input (e.g. Text/Dimension/Tag value) */}
            {selectedItem.customVal !== undefined && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em' }}>PROPERTIES</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-2)' }}>Label Value</span>
                  <input 
                    type="text" 
                    value={selectedItem.customVal} 
                    onChange={e => handleCustomValChange(e.target.value)}
                    style={{ width: 100, padding: '2px 6px', fontSize: 11, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-1)' }} 
                  />
                </div>
              </div>
            )}

            {/* Actions for Selected Object */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
              <button 
                onClick={handleDuplicateItem}
                className="btn-secondary" 
                style={{ fontSize: 10, padding: '6px 4px', justifyContent: 'center', gap: 4, borderRadius: 6 }}
              >
                👯 Duplicate
              </button>
              <button 
                onClick={handleDeleteItem}
                className="btn-secondary" 
                style={{ fontSize: 10, padding: '6px 4px', justifyContent: 'center', gap: 4, borderRadius: 6, borderColor: 'var(--red)', color: 'var(--red)', background: 'rgba(196,112,96,0.05)' }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            padding: 12, marginBottom: 12,
            background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)',
            fontSize: 11, color: 'var(--text-3)', textAlign: 'center',
          }}>
            Click an element in the 3D viewport to inspect and elevate properties.
          </div>
        )}

        {/* Building properties */}
        <Section title="Project Settings" icon="⚙️">
          <div className="prop-row">
            <span className="prop-label" style={{ fontSize: 11 }}>Building Type</span>
            <select
              value={config.buildingType}
              onChange={e => upd('buildingType', e.target.value)}
              style={{ fontSize: 11, padding: '2px 4px', width: 100, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
            >
              {BUILDING_TYPES.map(bt => <option key={bt} value={bt}>{bt.charAt(0).toUpperCase() + bt.slice(1)}</option>)}
            </select>
          </div>
          <PropRow label="Levels / Floors" value={config.floors} editable onEdit={v => upd('floors', Math.max(1, Math.min(30, v)))} />
          <PropRow label="BHK Configuration" value={config.bhk} editable onEdit={v => upd('bhk', Math.max(1, Math.min(10, v)))} />
          <div className="prop-row">
            <span className="prop-label" style={{ fontSize: 11 }}>Style Theme</span>
            <select
              value={config.architecturalStyle}
              onChange={e => upd('architecturalStyle', e.target.value)}
              style={{ fontSize: 11, padding: '2px 4px', width: 100, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
            >
              {STYLES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
            </select>
          </div>
        </Section>

        {/* Site properties */}
        <Section title="Site Dimensions" icon="📐">
          <PropRow label="Plot Width" value={config.plotWidth} editable onEdit={v => upd('plotWidth', Math.max(10, v))} unit=" ft" />
          <PropRow label="Plot Depth" value={config.plotDepth} editable onEdit={v => upd('plotDepth', Math.max(10, v))} unit=" ft" />
          <PropRow label="Total Plot Area" value={(config.plotWidth * config.plotDepth).toFixed(0)} unit=" sqft" />
          <PropRow label="Facing Direction" value={config.plotFacing || 'North'} />
          <PropRow label="Soil Type" value={config.soilType || 'Medium'} />
        </Section>

        {/* Structural settings */}
        <Section title="Structural Rules" icon="🏗️" defaultOpen={false}>
          <PropRow label="Wall Thickness" value="230" unit=" mm" />
          <PropRow label="Column Size" value="450×450" unit=" mm" />
          <PropRow label="Beam Depth" value="450" unit=" mm" />
          <PropRow label="Slab Thickness" value="150" unit=" mm" />
          <PropRow label="Foundation Type" value="Raft Slab" />
          <PropRow label="Concrete Grade" value="M25" />
        </Section>
      </div>

      {/* Export buttons */}
      <div style={{
        padding: '10px 10px', borderTop: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--bg-base)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: 2 }}>EXPORT BIM MODEL</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[
            { label: 'PDF Report', icon: '📄' },
            { label: 'CAD DXF', icon: '📐' },
            { label: 'BIM IFC', icon: '🔗' },
            { label: 'BOQ CSV', icon: '📋' },
          ].map(e => (
            <button
              key={e.label}
              className="btn-secondary"
              style={{ fontSize: 10, padding: '6px 4px', justifyContent: 'center', gap: 4, borderRadius: 6 }}
            >
              <span>{e.icon}</span> {e.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
