import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

// ── Helpers ──────────────────────────────────────────────────────────────────
function Box({ pos, size, color, roughness = 0.5, metalness = 0, opacity = 1, wireframe = false, emissive, emissiveIntensity = 0, castShadow = true, receiveShadow = true }) {
  return (
    <mesh position={pos} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        transparent={opacity < 1}
        opacity={opacity}
        wireframe={wireframe}
        emissive={emissive || color}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
      />
    </mesh>
  );
}

function Cylinder({ pos, args, color, roughness = 0.5, metalness = 0, castShadow = true }) {
  return (
    <mesh position={pos} castShadow={castShadow}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function RoomLabel({ pos, text, color = '#C8B8A2' }) {
  return (
    <Html position={pos} center>
      <div style={{
        background: 'rgba(6,8,16,0.9)',
        border: `1px solid ${color}40`,
        color: color,
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        padding: '3px 10px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        backdropFilter: 'blur(8px)',
        fontWeight: 700,
        letterSpacing: '0.05em',
      }}>
        {text}
      </div>
    </Html>
  );
}

// ── Exported 3D Assets for Manual Placement ───────────────────────────────────

export function Sofa3D({ pos = [0, 0, 0] }) {
  return (
    <group position={pos}>
      <Box pos={[0, 0.2, 0]} size={[1.8, 0.4, 0.8]} color="#4a5568" roughness={0.8} />
      <Box pos={[0, 0.5, -0.35]} size={[1.8, 0.5, 0.1]} color="#4a5568" roughness={0.8} />
      <Box pos={[-0.85, 0.45, 0]} size={[0.1, 0.4, 0.8]} color="#4a5568" roughness={0.8} />
      <Box pos={[0.85, 0.45, 0]} size={[0.1, 0.4, 0.8]} color="#4a5568" roughness={0.8} />
      {/* Coffee table */}
      <group position={[0, 0, 1.2]}>
        <Box pos={[0, 0.2, 0]} size={[0.8, 0.05, 0.4]} color="#78350f" roughness={0.5} />
        <Box pos={[-0.3, 0.1, -0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
        <Box pos={[0.3, 0.1, -0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
        <Box pos={[-0.3, 0.1, 0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
        <Box pos={[0.3, 0.1, 0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
      </group>
      {/* TV screen */}
      <Box pos={[0, 0.65, 3]} size={[1.2, 0.7, 0.04]} color="#0a0f1e" roughness={0.1} metalness={0.8} emissive="#0a0f1e" emissiveIntensity={0.02} />
    </group>
  );
}

export function Bed3D({ pos = [0, 0, 0] }) {
  return (
    <group position={pos}>
      <Box pos={[0, 0.25, 0]} size={[1.6, 0.3, 2.0]} color="#e2e8f0" roughness={0.8} />
      <Box pos={[0, 0.55, -0.95]} size={[1.6, 0.6, 0.1]} color="#78350f" roughness={0.5} />
      <Box pos={[-0.4, 0.44, -0.7]} size={[0.5, 0.12, 0.35]} color="#f8fafc" roughness={0.9} />
      <Box pos={[0.4, 0.44, -0.7]} size={[0.5, 0.12, 0.35]} color="#f8fafc" roughness={0.9} />
      {[[-0.75, -0.85], [-0.75, 0.85], [0.75, -0.85], [0.75, 0.85]].map(([x, z], i) => (
        <Box key={i} pos={[x, 0.08, z]} size={[0.06, 0.16, 0.06]} color="#92400e" roughness={0.3} />
      ))}
      <Box pos={[1.2, 0.25, -0.6]} size={[0.35, 0.5, 0.35]} color="#1e293b" roughness={0.5} />
      <Cylinder pos={[1.2, 0.55, -0.6]} args={[0.06, 0.06, 0.3, 12]} color="#94a3b8" metalness={0.7} roughness={0.2} />
      <Cylinder pos={[1.2, 0.75, -0.6]} args={[0.15, 0.08, 0.2, 12]} color="#fef3c7" roughness={0.9} />
    </group>
  );
}

export function Kitchen3D({ pos = [0, 0, 0] }) {
  return (
    <group position={pos}>
      <Box pos={[0, 0.45, 0]} size={[0.55, 0.9, 2.5]} color="#374151" roughness={0.3} />
      <Box pos={[0, 0.91, 0]} size={[0.6, 0.04, 2.6]} color="#6b7280" roughness={0.2} metalness={0.3} />
      <Cylinder pos={[0, 0.93, 0.6]} args={[0.12, 0.14, 0.1, 16]} color="#94a3b8" metalness={0.8} roughness={0.2} />
      <Box pos={[0, 2.0, 0]} size={[0.55, 0.8, 2.5]} color="#374151" roughness={0.4} />
    </group>
  );
}

export function Bathroom3D({ pos = [0, 0, 0] }) {
  return (
    <group position={pos}>
      <Box pos={[0, 0.2, 0]} size={[0.35, 0.38, 0.52]} color="#f1f5f9" roughness={0.3} />
      <Box pos={[0, 0.4, -0.18]} size={[0.35, 0.08, 0.2]} color="#e2e8f0" roughness={0.3} />
      <Box pos={[1, 0.45, 0]} size={[0.4, 0.9, 0.85]} color="#e2e8f0" roughness={0.3} />
      <Cylinder pos={[1, 0.82, 0]} args={[0.18, 0.2, 0.12, 16]} color="#f1f5f9" roughness={0.2} metalness={0.1} />
    </group>
  );
}

export function Pool3D({ pos = [0, 0, 0], size = [4, 2.5] }) {
  return (
    <group position={pos}>
      <Box pos={[0, -0.04, 0]} size={[size[0] + 0.2, 0.08, size[1] + 0.2]} color="#6b7280" />
      <Box pos={[0, 0.01, 0]} size={[size[0], 0.02, size[1]]} color="#0284c7" opacity={0.85} roughness={0.05} metalness={0.1} />
      <Box pos={[0, 0.03, size[1]/2 + 0.1]} size={[size[0] + 0.2, 0.06, 0.2]} color="#94a3b8" roughness={0.3} />
      <RoomLabel pos={[0, 0.3, 0]} text="🏊 POOL" color="#0ea5e9" />
    </group>
  );
}

// ── Interior: Villa Ground Floor ──────────────────────────────────────────────
function VillaInterior({ bW, bD, wallH, viewMode, isWalkthrough, bhkCount = 2, floorIndex = 0, floors = 2 }) {
  const wallT = 0.15;
  const wallColor = '#d4c9b5';
  const floorColor = '#b8a99a';
  const ceilColor = '#e8e0d8';
  const showInterior = isWalkthrough || viewMode === 'architectural';

  const transparent = viewMode === 'mep' || viewMode === 'vastu';
  const matProps = {
    color: wallColor,
    roughness: 0.6,
    wireframe: viewMode === 'structural',
    opacity: transparent ? 0.18 : 0.92,
  };

  // Determine bedrooms on this floor
  const bedroomsOnThisFloor = [];
  for (let i = 1; i <= bhkCount; i++) {
    if ((i - 1) % floors === floorIndex) {
      bedroomsOnThisFloor.push(i);
    }
  }

  // Predefined slot offsets for up to 10 bedrooms on a single floor
  const slots = [
    { x: -bW * 0.25, z: -bD * 0.28 },
    { x: bW * 0.28,  z: -bD * 0.28 },
    { x: bW * 0.28,  z: bD * 0.22  },
    { x: -bW * 0.25, z: -bD * 0.02 },
    { x: bW * 0.28,  z: -bD * 0.02 },
    { x: 0,          z: -bD * 0.28 },
    { x: 0,          z: -bD * 0.02 },
    { x: -bW * 0.1,  z: bD * 0.22  },
    { x: bW * 0.1,   z: bD * 0.22  },
    { x: 0,          z: bD * 0.1   }
  ];

  return (
    <group>
      {/* Floors */}
      <Box pos={[0, 0.02, 0]} size={[bW, 0.04, bD]} color={floorColor} roughness={0.7} receiveShadow castShadow={false} />

      {/* Ceiling */}
      <Box pos={[0, wallH - 0.05, 0]} size={[bW, 0.05, bD]} color={ceilColor} roughness={0.4} receiveShadow={false} />

      {/* INTERIOR WALLS — dividing the floor plan */}
      {/* Living / Bedroom divide (horizontal wall) */}
      <Box pos={[0, wallH / 2, -bD * 0.15]} size={[bW, wallH, wallT]} {...matProps} />

      {/* Kitchen / Living divide (vertical wall) */}
      {floorIndex === 0 && (
        <Box pos={[bW * 0.2, wallH / 2, bD * 0.15]} size={[wallT, wallH, bD * 0.4]} {...matProps} />
      )}

      {/* Bathroom wall */}
      <Box pos={[-bW * 0.32, wallH / 2, bD * 0.2]} size={[bW * 0.36, wallH, wallT]} {...matProps} />

      {/* Room Labels */}
      {floorIndex === 0 ? (
        <>
          <RoomLabel pos={[-bW * 0.2, wallH * 0.5, bD * 0.3]} text="🛋️  LIVING ROOM" color="#C8B8A2" />
          <RoomLabel pos={[bW * 0.32, wallH * 0.5, bD * 0.3]} text="🍳  KITCHEN" color="#D4B372" />
        </>
      ) : (
        <RoomLabel pos={[-bW * 0.2, wallH * 0.5, bD * 0.3]} text="🏢  FAMILY LOUNGE" color="#C8B8A2" />
      )}
      <RoomLabel pos={[-bW * 0.38, wallH * 0.5, bD * 0.35]} text={`🛃  BATHROOM L${floorIndex + 1}`} color="#8CB8B0" />

      {/* Dynamically placed Bedroom Labels */}
      {bedroomsOnThisFloor.map((bedNum, j) => {
        const slot = slots[j];
        if (!slot) return null;
        return (
          <RoomLabel
            key={`bed-lbl-${bedNum}`}
            pos={[slot.x, wallH * 0.5, slot.z]}
            text={bedNum === 1 ? "🛏️  MASTER BEDROOM" : `🛏️  BEDROOM ${bedNum}`}
            color="#A08CB8"
          />
        );
      })}

      {/* ── FURNITURE: Living Room (Ground Floor only) ─────────────── */}
      {floorIndex === 0 && (
        <>
          {/* Sofa */}
          <group position={[-bW * 0.18, 0, bD * 0.2]}>
            <Box pos={[0, 0.2, 0]} size={[1.8, 0.4, 0.8]} color="#4a5568" roughness={0.8} />
            <Box pos={[0, 0.5, -0.35]} size={[1.8, 0.5, 0.1]} color="#4a5568" roughness={0.8} />
            <Box pos={[-0.85, 0.45, 0]} size={[0.1, 0.4, 0.8]} color="#4a5568" roughness={0.8} />
            <Box pos={[0.85, 0.45, 0]} size={[0.1, 0.4, 0.8]} color="#4a5568" roughness={0.8} />
          </group>

          {/* Coffee table */}
          <group position={[-bW * 0.18, 0, bD * 0.3]}>
            <Box pos={[0, 0.2, 0]} size={[0.8, 0.05, 0.4]} color="#78350f" roughness={0.5} />
            <Box pos={[-0.3, 0.1, -0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
            <Box pos={[0.3, 0.1, -0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
            <Box pos={[-0.3, 0.1, 0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
            <Box pos={[0.3, 0.1, 0.15]} size={[0.05, 0.2, 0.05]} color="#92400e" roughness={0.4} />
          </group>

          {/* TV stand */}
          <Box pos={[-bW * 0.18, 0.15, bD * 0.08]} size={[1.4, 0.3, 0.3]} color="#1e293b" roughness={0.3} metalness={0.4} />
          {/* TV screen */}
          <Box pos={[-bW * 0.18, 0.65, bD * 0.08]} size={[1.2, 0.7, 0.04]} color="#0a0f1e" roughness={0.1} metalness={0.8} emissive="#0a0f1e" emissiveIntensity={0.02} />

          {/* ── FURNITURE: Kitchen ─────────────────── */}
          {/* Counter */}
          <Box pos={[bW * 0.32, 0.45, bD * 0.18]} size={[0.55, 0.9, 0.55]} color="#374151" roughness={0.3} />
          <Box pos={[bW * 0.32, 0.91, bD * 0.18]} size={[0.6, 0.04, 0.6]} color="#6b7280" roughness={0.2} metalness={0.3} />
          {/* Sink */}
          <Cylinder pos={[bW * 0.32, 0.93, bD * 0.18]} args={[0.12, 0.14, 0.1, 16]} color="#94a3b8" metalness={0.8} roughness={0.2} />
          {/* Upper cabinets */}
          <Box pos={[bW * 0.32, wallH * 0.65, bD * 0.08]} size={[0.55, wallH * 0.3, 0.3]} color="#374151" roughness={0.4} />
        </>
      )}

      {/* ── FURNITURE: Dynamically placed Beds ─────────── */}
      {bedroomsOnThisFloor.map((bedNum, j) => {
        const slot = slots[j];
        if (!slot) return null;
        return (
          <Bed3D key={`bed-3d-${bedNum}`} pos={[slot.x, 0, slot.z]} />
        );
      })}

      {/* ── BATHROOM ──────────────────────────── */}
      {/* Toilet */}
      <group position={[-bW * 0.38, 0, bD * 0.28]}>
        <Box pos={[0, 0.2, 0]} size={[0.35, 0.38, 0.52]} color="#f1f5f9" roughness={0.3} />
        <Box pos={[0, 0.4, -0.18]} size={[0.35, 0.08, 0.2]} color="#e2e8f0" roughness={0.3} />
      </group>
      {/* Sink basin */}
      <Cylinder pos={[-bW * 0.38, 0.82, bD * 0.15]} args={[0.18, 0.2, 0.12, 16]} color="#f1f5f9" roughness={0.2} metalness={0.1} />
      <Box pos={[-bW * 0.38, 0.45, bD * 0.15]} size={[0.4, 0.9, 0.35]} color="#e2e8f0" roughness={0.3} />

      {/* ── DOOR FRAMES ───────────────────────── */}
      {/* Front door frame */}
      <Box pos={[-bW * 0.05, wallH * 0.4, bD / 2 - wallT / 2]} size={[0.9, wallH * 0.8, wallT + 0.02]} color="#7c3aed" opacity={0.15} />

      {/* ── INTERIOR LIGHTING FIXTURES ────────── */}
      {[
        [-bW * 0.18, bD * 0.22],
        [bW * 0.3, bD * 0.25],
        [-bW * 0.1, -bD * 0.25],
        [bW * 0.28, -bD * 0.28],
        [-bW * 0.38, bD * 0.22],
      ].map(([lx, lz], i) => (
        <group key={i} position={[lx, wallH - 0.1, lz]}>
          <Cylinder pos={[0, 0, 0]} args={[0.12, 0.12, 0.04, 16]} color="#1e293b" roughness={0.3} metalness={0.8} />
          <pointLight position={[0, -0.05, 0]} intensity={0.5} color="#fffae0" distance={4} castShadow={false} />
        </group>
      ))}
    </group>
  );
}

// ── Apartment Tower ───────────────────────────────────────────────────────────
function ApartmentTower({ pW, pD, wallH, floors, viewMode, activeFloorCutaway }) {
  const aptFloors = Math.max(5, floors + 3);
  const bW = pW * 0.72;
  const bD = pD * 0.72;
  const transparent = viewMode === 'mep' || viewMode === 'vastu';

  return (
    <group>
      <Box pos={[0, -0.05, 0]} size={[pW + 4, 0.1, pD + 4]} color="#040810" roughness={0.9} receiveShadow castShadow={false} />

      {Array.from({ length: aptFloors }).map((_, f) => {
        if (activeFloorCutaway !== 'all' && activeFloorCutaway < f + 1) return null;
        const fY = f * wallH;
        return (
          <group key={f} position={[0, fY, 0]}>
            <Box pos={[0, 0.1, 0]} size={[bW + 0.6, 0.2, bD + 0.6]} color="#1e293b" />
            <Box pos={[0, wallH / 2 + 0.1, 0]} size={[bW, wallH - 0.2, bD]} color="#94a3b8"
              roughness={0.4} wireframe={viewMode === 'structural'}
              opacity={transparent ? 0.25 : 1} />
            {/* Glass balcony */}
            <Box pos={[0, wallH / 2, bD / 2 + 0.5]} size={[bW * 0.8, wallH * 0.5, 0.04]}
              color="#38bdf8" opacity={0.55} roughness={0.1} />
            {/* Floor windows */}
            <Box pos={[bW / 2 + 0.02, wallH * 0.5, 0]} size={[0.04, wallH * 0.7, bD * 0.5]}
              color="#38bdf8" opacity={0.6} roughness={0.05} />
          </group>
        );
      })}

      {/* Rooftop */}
      <group position={[0, aptFloors * wallH, 0]}>
        <Box pos={[0, 0.1, 0]} size={[bW * 0.9, 0.2, bD * 0.9]} color="#064e3b" />
        <RoomLabel pos={[0, 1.5, 0]} text={`🏢 APARTMENT TOWER — G+${aptFloors - 1}`} color="#10b981" />
      </group>
    </group>
  );
}

// ── Villa / House (Full Detail) ───────────────────────────────────────────────
function Villa({ pW, pD, wallH, config, viewMode, activeFloorCutaway, isWalkthrough }) {
  const { floors = 2, hasPool, hasSolar, buildingType } = config;
  const bW = pW * 0.65;
  const bD = pD * 0.65;
  const transparent = viewMode === 'mep' || viewMode === 'vastu';
  const wireframe = viewMode === 'structural';

  const wallColor = useMemo(() => {
    if (config.architecturalStyle === 'minimalist') return '#e2e8f0';
    if (config.architecturalStyle === 'traditional') return '#d97706';
    if (config.architecturalStyle === 'industrial') return '#334155';
    if (config.architecturalStyle === 'luxury') return '#d4af37';
    return '#f0ede8';
  }, [config.architecturalStyle]);

  return (
    <group>
      {/* Ground terrain */}
      <Box pos={[0, -0.06, 0]} size={[pW + 6, 0.12, pD + 6]} color="#060810" roughness={0.95} castShadow={false} receiveShadow />

      {/* Paved area / courtyard */}
      <Box pos={[0, -0.01, 0]} size={[pW + 2, 0.02, pD + 2]} color="#1a2040" roughness={0.7} castShadow={false} receiveShadow />

      {/* Garden / lawn */}
      <Box pos={[-pW * 0.28, 0.01, pD * 0.28]} size={[pW * 0.38, 0.02, pD * 0.32]} color="#0f3d20" roughness={0.9} receiveShadow />

      {/* Driveway */}
      <Box pos={[pW * 0.28, 0.01, pD * 0.3]} size={[pW * 0.28, 0.02, pD * 0.38]} color="#1e293b" roughness={0.6} receiveShadow />

      {/* Boundary wall */}
      <Box pos={[0, 0.4, pD / 2 + 0.5]} size={[pW + 2, 0.8, 0.25]} color="#374151" roughness={0.7} />
      <Box pos={[0, 0.4, -pD / 2 - 0.5]} size={[pW + 2, 0.8, 0.25]} color="#374151" roughness={0.7} />
      <Box pos={[pW / 2 + 0.5, 0.4, 0]} size={[0.25, 0.8, pD + 2]} color="#374151" roughness={0.7} />
      <Box pos={[-pW / 2 - 0.5, 0.4, 0]} size={[0.25, 0.8, pD + 2]} color="#374151" roughness={0.7} />

      {/* Gate */}
      <Box pos={[pW * 0.1, 0.7, pD / 2 + 0.5]} size={[1.6, 0.8, 0.08]} color="#1e40af" roughness={0.3} metalness={0.7} />
      <Box pos={[pW * 0.28, 1.2, pD / 2 + 0.5]} size={[0.15, 1.8, 0.15]} color="#374151" roughness={0.4} />
      <Box pos={[-pW * 0.05, 1.2, pD / 2 + 0.5]} size={[0.15, 1.8, 0.15]} color="#374151" roughness={0.4} />

      {/* Trees */}
      {[[-pW * 0.35, pD * 0.38], [-pW * 0.22, pD * 0.42], [-pW * 0.42, pD * 0.15]].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <Cylinder pos={[0, 0.5, 0]} args={[0.1, 0.12, 1.0, 8]} color="#4a3728" roughness={0.9} />
          <mesh position={[0, 1.5, 0]} castShadow>
            <sphereGeometry args={[0.7, 8, 6]} />
            <meshStandardMaterial color={['#064e3b', '#065f46', '#047857'][i]} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Swimming pool */}
      {hasPool && (
        <group position={[-pW * 0.32, 0, -pD * 0.26]}>
          <Box pos={[0, -0.04, 0]} size={[pW * 0.36, 0.08, pD * 0.24]} color="#6b7280" />
          <Box pos={[0, 0.01, 0]} size={[pW * 0.33, 0.02, pD * 0.21]} color="#0284c7" opacity={0.85} roughness={0.05} metalness={0.1} />
          {/* Pool edge */}
          <Box pos={[0, 0.03, pD * 0.115]} size={[pW * 0.36, 0.06, 0.12]} color="#94a3b8" roughness={0.3} />
          <RoomLabel pos={[0, 0.3, 0]} text="🏊 POOL" color="#0ea5e9" />
        </group>
      )}

      {/* Car in driveway */}
      <group position={[pW * 0.28, 0, pD * 0.18]}>
        <Box pos={[0, 0.35, 0]} size={[1.25, 0.7, 2.8]} color="#0284c7" metalness={0.8} roughness={0.15} />
        <Box pos={[0, 0.8, -0.3]} size={[1.1, 0.45, 1.4]} color="#020c1a" metalness={0.9} roughness={0.05} opacity={0.88} />
        {/* Wheels */}
        {[[-0.55, -0.4, 0.9], [0.55, -0.4, 0.9], [-0.55, -0.4, -0.9], [0.55, -0.4, -0.9]].map(([x, y, z], i) => (
          <group key={i} position={[x, y + 0.35, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 0.2, 12]} />
              <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Headlights */}
        <Box pos={[-0.45, 0.32, 1.41]} size={[0.2, 0.1, 0.02]} color="#fffde7" emissive="#fffde7" emissiveIntensity={0.6} roughness={0.05} />
        <Box pos={[0.45, 0.32, 1.41]} size={[0.2, 0.1, 0.02]} color="#fffde7" emissive="#fffde7" emissiveIntensity={0.6} roughness={0.05} />
      </group>

      {/* BUILDING FLOORS */}
      {Array.from({ length: floors }).map((_, f) => {
        if (activeFloorCutaway !== 'all' && activeFloorCutaway < f + 1) return null;
        const floorY = f * wallH;
        return (
          <group key={f} position={[0, floorY, 0]}>
            {/* Floor slab */}
            <Box pos={[0, 0.12, 0]} size={[bW + 0.5, 0.24, bD + 0.5]} color="#1e293b" roughness={0.4} />

            {/* Columns at corners and mid */}
            {[[-bW / 2 + 0.2, -bD / 2 + 0.2], [bW / 2 - 0.2, -bD / 2 + 0.2],
              [-bW / 2 + 0.2, bD / 2 - 0.2], [bW / 2 - 0.2, bD / 2 - 0.2],
              [0, -bD / 2 + 0.2], [0, bD / 2 - 0.2],
              [-bW / 2 + 0.2, 0], [bW / 2 - 0.2, 0]
            ].map(([cx, cz], ci) => (
              <Box key={ci} pos={[cx, wallH / 2 + 0.12, cz]} size={[0.3, wallH, 0.3]}
                color="#334155" roughness={0.3} wireframe={wireframe}
                opacity={transparent ? 0.3 : 1} />
            ))}

            {/* Outer walls */}
            {/* Front */}
            <Box pos={[0, wallH / 2 + 0.12, bD / 2]} size={[bW, wallH, 0.2]} color={wallColor}
              roughness={0.6} wireframe={wireframe} opacity={transparent ? 0.2 : 1} />
            {/* Back */}
            <Box pos={[0, wallH / 2 + 0.12, -bD / 2]} size={[bW, wallH, 0.2]} color={wallColor}
              roughness={0.6} wireframe={wireframe} opacity={transparent ? 0.2 : 1} />
            {/* Left */}
            <Box pos={[-bW / 2, wallH / 2 + 0.12, 0]} size={[0.2, wallH, bD]} color={wallColor}
              roughness={0.6} wireframe={wireframe} opacity={transparent ? 0.2 : 1} />
            {/* Right */}
            <Box pos={[bW / 2, wallH / 2 + 0.12, 0]} size={[0.2, wallH, bD]} color={wallColor}
              roughness={0.6} wireframe={wireframe} opacity={transparent ? 0.2 : 1} />

            {/* Large front window panel */}
            <Box pos={[bW * 0.08, wallH * 0.55 + 0.12, bD / 2 + 0.01]}
              size={[bW * 0.45, wallH * 0.55, 0.04]}
              color="#38bdf8" opacity={0.5} roughness={0.05} metalness={0.2} />

            {/* Right side windows */}
            <Box pos={[bW / 2 + 0.01, wallH * 0.55 + 0.12, bD * 0.15]}
              size={[0.04, wallH * 0.45, bD * 0.28]} color="#38bdf8" opacity={0.55} roughness={0.05} />

            {/* Accent louvers / shading fins */}
            {Array.from({ length: 5 }).map((_, li) => (
              <Box key={li} pos={[bW / 2 + 0.12, wallH * 0.4 + 0.12 + li * 0.25, bD * 0.18]}
                size={[0.18, 0.04, bD * 0.25]} color="#78350f" roughness={0.7} />
            ))}

            {/* Balcony (upper floors) */}
            {f > 0 && (
              <group position={[0, 0.55, bD / 2 + 0.65]}>
                <Box pos={[0, -0.08, 0]} size={[bW * 0.75, 0.15, 0.9]} color="#1e293b" />
                <Box pos={[0, 0.35, 0.4]} size={[bW * 0.75, 0.75, 0.04]} color="#94a3b8" opacity={0.45} roughness={0.05} />
                {/* Railing posts */}
                {Array.from({ length: 7 }).map((_, ri) => (
                  <Box key={ri} pos={[-bW * 0.35 + ri * (bW * 0.75 / 6), 0.35, 0.4]}
                    size={[0.04, 0.75, 0.04]} color="#64748b" roughness={0.5} />
                ))}
              </group>
            )}

            {/* Front door (ground floor only) */}
            {f === 0 && (
              <group position={[-bW * 0.04, 0, bD / 2]}>
                <Box pos={[0, wallH * 0.42, 0]} size={[0.85, wallH * 0.84, 0.22]} color="#78350f" roughness={0.5} />
                {/* Door knob */}
                <Cylinder pos={[0.3, wallH * 0.4, 0.12]} args={[0.04, 0.04, 0.08, 8]} color="#f59e0b" metalness={0.9} roughness={0.1} />
                {/* Door frame */}
                <Box pos={[0, wallH * 0.84, 0.12]} size={[0.92, 0.12, 0.24]} color="#334155" roughness={0.4} />
              </group>
            )}

            {/* Portico / entrance canopy (ground floor) */}
            {f === 0 && (
              <group position={[0, wallH + 0.12, bD / 2 + 0.5]}>
                <Box pos={[0, 0, 0]} size={[bW * 0.5, 0.15, 1.2]} color="#1e293b" roughness={0.4} />
              </group>
            )}

            {/* Interior rooms (all floors) */}
            <VillaInterior
              bW={bW - 0.4}
              bD={bD - 0.4}
              wallH={wallH}
              viewMode={viewMode}
              isWalkthrough={isWalkthrough}
              bhkCount={config.bhk || 2}
              floorIndex={f}
              floors={floors}
            />
          </group>
        );
      })}

      {/* ROOF */}
      {(activeFloorCutaway === 'all' || activeFloorCutaway >= floors) && (
        <group position={[0, floors * wallH, 0]}>
          {/* Main roof slab */}
          <Box pos={[0, 0.12, 0]} size={[bW * 1.05, 0.24, bD * 1.05]} color="#1e293b" roughness={0.5} />

          {/* Parapet walls */}
          <Box pos={[0, 0.7, bD * 0.525]} size={[bW * 1.05, 1.0, 0.18]} color={wallColor} roughness={0.6} />
          <Box pos={[0, 0.7, -bD * 0.525]} size={[bW * 1.05, 1.0, 0.18]} color={wallColor} roughness={0.6} />
          <Box pos={[-bW * 0.525, 0.7, 0]} size={[0.18, 1.0, bD * 1.05]} color={wallColor} roughness={0.6} />
          <Box pos={[bW * 0.525, 0.7, 0]} size={[0.18, 1.0, bD * 1.05]} color={wallColor} roughness={0.6} />

          {/* Solar panels */}
          {hasSolar && (
            <group position={[0, 0.35, -bD * 0.18]} rotation={[-0.18, 0, 0]}>
              <Box pos={[0, 0, 0]} size={[bW * 0.42, 0.04, bD * 0.28]} color="#0f172a" roughness={0.1} metalness={0.9} />
              <Box pos={[0, 0.025, 0]} size={[bW * 0.40, 0.01, bD * 0.26]} color="#0284c7" emissive="#0284c7" emissiveIntensity={0.15} metalness={0.8} />
              {/* Solar panel grid lines */}
              {Array.from({ length: 4 }).map((_, si) => (
                <Box key={`sh${si}`} pos={[(-bW * 0.2 + si * (bW * 0.4 / 3)), 0.03, 0]}
                  size={[0.02, 0.02, bD * 0.26]} color="#1e3a5f" />
              ))}
              {Array.from({ length: 3 }).map((_, si) => (
                <Box key={`sv${si}`} pos={[0, 0.03, (-bD * 0.13 + si * (bD * 0.26 / 2))]}
                  size={[bW * 0.40, 0.02, 0.02]} color="#1e3a5f" />
              ))}
            </group>
          )}

          {/* Water tank */}
          <Cylinder pos={[bW * 0.22, 0.8, -bD * 0.2]} args={[0.45, 0.5, 1.2, 16]} color="#e2e8f0" metalness={0.4} roughness={0.3} />
          <Cylinder pos={[bW * 0.22, 1.5, -bD * 0.2]} args={[0.47, 0.47, 0.1, 16]} color="#94a3b8" metalness={0.5} roughness={0.2} />

          {/* Rooftop label */}
          <RoomLabel pos={[0, 1.5, 0]} text="🏠 ROOF TERRACE" color="#f59e0b" />
        </group>
      )}
    </group>
  );
}

// ── Hospital ──────────────────────────────────────────────────────────────────
function Hospital({ pW, pD, wallH, viewMode }) {
  const bW = pW * 0.8, bD = pD * 0.7;
  const transparent = viewMode === 'mep' || viewMode === 'vastu';
  return (
    <group>
      <Box pos={[0, -0.05, 0]} size={[pW + 4, 0.1, pD + 4]} color="#040810" roughness={0.9} castShadow={false} />
      <Box pos={[0, wallH * 1.5, 0]} size={[bW, wallH * 3, bD]} color="#f8fafc" roughness={0.3}
        wireframe={viewMode === 'structural'} opacity={transparent ? 0.25 : 1} />
      <group position={[0, wallH * 2.2, bD / 2 + 0.1]}>
        <Box pos={[0, 0, 0]} size={[1.5, 0.35, 0.05]} color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        <Box pos={[0, 0, 0]} size={[0.35, 1.5, 0.05]} color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
      </group>
      <group position={[0, wallH * 3 + 0.1, 0]}>
        <Cylinder pos={[0, 0, 0]} args={[2.5, 2.5, 0.1, 32]} color="#334155" roughness={0.6} />
        <RoomLabel pos={[0, 0.4, 0]} text="🚁 HELIPAD" color="#f59e0b" />
      </group>
      <RoomLabel pos={[0, wallH * 3 + 1.5, 0]} text="🏥 SMART HOSPITAL" color="#ef4444" />
    </group>
  );
}

// ── Mall ──────────────────────────────────────────────────────────────────────
function Mall({ pW, pD, wallH, viewMode }) {
  const bW = pW * 0.85, bD = pD * 0.85;
  const transparent = viewMode === 'mep' || viewMode === 'vastu';
  return (
    <group>
      <Box pos={[0, -0.05, 0]} size={[pW + 4, 0.1, pD + 4]} color="#040810" roughness={0.9} castShadow={false} />
      <Box pos={[0, wallH, 0]} size={[bW, wallH * 2, bD]} color="#0f172a" roughness={0.2} metalness={0.8}
        wireframe={viewMode === 'structural'} opacity={transparent ? 0.25 : 1} />
      <mesh position={[0, wallH * 2 + 0.8, 0]}>
        <sphereGeometry args={[bW * 0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#00f0ff" transparent opacity={0.65} roughness={0.1} metalness={0.2} emissive="#00d4ff" emissiveIntensity={0.2} />
      </mesh>
      <Box pos={[0, wallH * 0.8, bD / 2 + 0.02]} size={[bW * 0.8, wallH * 1.2, 0.04]}
        color="#38bdf8" opacity={0.65} roughness={0.05} />
      <RoomLabel pos={[0, wallH * 2.5 + 1, 0]} text="🛍️ COMMERCIAL MALL" color="#f59e0b" />
    </group>
  );
}

// ── Factory ───────────────────────────────────────────────────────────────────
function Factory({ pW, pD, wallH, viewMode }) {
  const bW = pW * 0.85, bD = pD * 0.8;
  return (
    <group>
      <Box pos={[0, -0.05, 0]} size={[pW + 4, 0.1, pD + 4]} color="#040810" roughness={0.9} castShadow={false} />
      <Box pos={[0, wallH, 0]} size={[bW, wallH * 1.6, bD]} color="#334155" metalness={0.6} roughness={0.4}
        wireframe={viewMode === 'structural'} />
      {[-bW / 4, 0, bW / 4].map((rx, i) => (
        <Box key={i} pos={[rx, wallH * 1.8 + 0.4, 0]} size={[bW * 0.28, 0.8, bD * 0.88]} color="#475569" metalness={0.8} roughness={0.3} />
      ))}
      <Cylinder pos={[bW / 3, wallH * 2.4, -bD / 3]} args={[0.28, 0.36, 2.8, 16]} color="#64748b" metalness={0.9} roughness={0.2} />
      <Cylinder pos={[-bW / 3, wallH * 2.2, bD / 4]} args={[0.22, 0.28, 2.2, 16]} color="#64748b" metalness={0.9} roughness={0.2} />
      <RoomLabel pos={[0, wallH * 3, 0]} text="🏭 ECO FACTORY" color="#10b981" />
    </group>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function ProceduralBuilding({ config, viewMode, activeFloorCutaway, isWalkthrough }) {
  const { buildingType = 'villa', plotWidth = 40, plotDepth = 60, floors = 2 } = config;
  const scale = 0.28;
  const pW = plotWidth * scale;
  const pD = plotDepth * scale;
  const wallH = 2.8;

  if (buildingType === 'apartment') {
    return <ApartmentTower pW={pW} pD={pD} wallH={wallH} floors={floors} viewMode={viewMode} activeFloorCutaway={activeFloorCutaway} />;
  }
  if (buildingType === 'mall') {
    return <Mall pW={pW} pD={pD} wallH={wallH} viewMode={viewMode} />;
  }
  if (buildingType === 'hospital') {
    return <Hospital pW={pW} pD={pD} wallH={wallH} viewMode={viewMode} />;
  }
  if (buildingType === 'factory') {
    return <Factory pW={pW} pD={pD} wallH={wallH} viewMode={viewMode} />;
  }
  return (
    <Villa
      pW={pW} pD={pD} wallH={wallH}
      config={config} viewMode={viewMode}
      activeFloorCutaway={activeFloorCutaway}
      isWalkthrough={isWalkthrough}
    />
  );
}

// Keep old export name for backward compatibility
export function ProceduralHouse(props) {
  return <ProceduralBuilding {...props} />;
}

export function PlacedObject3D({ type, pos, customVal, isSelected }) {
  const wallT = 0.15;
  const wallH = 2.8;
  return (
    <group position={pos}>
      {isSelected && (() => {
        let size = [2.0, 2.0, 2.0];
        let offset = [0, 1.0, 0];
        if (type === 'column' || type === 'col') { size = [0.6, 3.0, 0.6]; offset = [0, 1.4, 0]; }
        else if (type === 'wall') { size = [0.4, 3.0, 3.2]; offset = [0, 1.5, 0]; }
        else if (type === 'door') { size = [1.0, 2.3, 0.3]; offset = [0, 1.15, 0]; }
        else if (type === 'window') { size = [1.4, 1.4, 0.25]; offset = [0, 1.2, 0]; }
        else if (type === 'beam' || type === 'steel-beam') { size = [3.2, 0.4, 0.3]; offset = [0, 2.6, 0]; }
        else if (type === 'slab' || type === 'floor' || type === 'ceiling' || type === 'roof') { size = [4.2, 0.2, 4.2]; offset = [0, type === 'ceiling' ? 2.7 : type === 'floor' || type === 'slab' ? 0.05 : 0.2, 0]; }
        else if (type === 'foundation' || type === 'footing') { size = [2.2, 1.0, 2.2]; offset = [0, -0.3, 0]; }
        
        return (
          <mesh position={offset}>
            <boxGeometry args={size} />
            <meshBasicMaterial color="#D4B372" wireframe transparent opacity={0.8} />
          </mesh>
        );
      })()}
      {/* Architecture */}
      {type === 'wall' && <Box pos={[0, wallH / 2, 0]} size={[0.25, wallH, 3]} color="#f0ede8" roughness={0.7} />}
      {type === 'door' && (
        <group>
          <Box pos={[0, 1.05, 0]} size={[0.85, 2.1, 0.1]} color="#78350f" roughness={0.6} />
          <Cylinder pos={[0.3, 1.0, 0.07]} args={[0.03, 0.03, 0.06, 8]} color="#f59e0b" metalness={0.9} roughness={0.1} />
        </group>
      )}
      {type === 'window' && (
        <group>
          <Box pos={[0, 1.2, 0]} size={[1.2, 1.2, 0.08]} color="#64748b" roughness={0.4} />
          <Box pos={[0, 1.2, 0]} size={[1.1, 1.1, 0.09]} color="#38bdf8" opacity={0.6} transparent roughness={0.05} />
        </group>
      )}
      {type === 'roof' && <Box pos={[0, 0.2, 0]} size={[3, 0.4, 3]} color="#b91c1c" roughness={0.6} />}
      {type === 'floor' && <Box pos={[0, 0.05, 0]} size={[4, 0.1, 4]} color="#b8a99a" roughness={0.8} />}
      {type === 'ceiling' && <Box pos={[0, 2.7, 0]} size={[4, 0.05, 4]} color="#e8e0d8" roughness={0.5} />}
      {type === 'stair' && (
        <group>
          {[0, 1, 2, 3, 4].map(i => (
            <Box key={i} pos={[0, 0.15 + i * 0.3, -0.6 + i * 0.4]} size={[1.2, 0.3, 0.4]} color="#475569" roughness={0.5} />
          ))}
        </group>
      )}
      {type === 'ramp' && (
        <group rotation={[-0.2, 0, 0]} position={[0, 0.3, 0]}>
          <Box pos={[0, 0, 0]} size={[1.2, 0.08, 3.5]} color="#475569" roughness={0.6} />
        </group>
      )}
      {type === 'railing' && (
        <group>
          <Box pos={[0, 0.8, 0]} size={[2.0, 0.05, 0.05]} color="#1e293b" />
          {[-0.8, -0.4, 0, 0.4, 0.8].map((rx, idx) => (
            <Box key={idx} pos={[rx, 0.4, 0]} size={[0.04, 0.8, 0.04]} color="#334155" />
          ))}
        </group>
      )}
      {type === 'lift' && <Box pos={[0, 1.5, 0]} size={[1.8, 3.0, 1.8]} color="#0f172a" metalness={0.7} roughness={0.2} />}
      {type === 'room' && <Box pos={[0, 0.01, 0]} size={[3.5, 0.02, 3.5]} color="#059669" opacity={0.3} transparent />}
      {type === 'curtain' && <Box pos={[0, 1.4, 0]} size={[0.08, 2.8, 3.0]} color="#38bdf8" opacity={0.4} transparent metalness={0.3} />}
      {type === 'column' && <Cylinder pos={[0, 1.4, 0]} args={[0.2, 0.2, 2.8, 12]} color="#475569" roughness={0.5} />}

      {/* Structure */}
      {type === 'foundation' && <Box pos={[0, -0.4, 0]} size={[2.0, 0.8, 2.0]} color="#4b5563" roughness={0.9} />}
      {type === 'footing' && <Box pos={[0, -0.2, 0]} size={[1.5, 0.4, 1.5]} color="#475569" roughness={0.9} />}
      {type === 'pile' && <Cylinder pos={[0, -1.5, 0]} args={[0.15, 0.15, 3.0, 8]} color="#374151" roughness={0.9} />}
      {type === 'raft' && <Box pos={[0, -0.1, 0]} size={[5.0, 0.2, 5.0]} color="#374151" roughness={0.9} />}
      {type === 'beam' && <Box pos={[0, 2.6, 0]} size={[3.0, 0.3, 0.2]} color="#4b5563" roughness={0.8} />}
      {type === 'col' && <Box pos={[0, 1.4, 0]} size={[0.25, 2.8, 0.25]} color="#4b5563" roughness={0.8} />}
      {type === 'slab' && <Box pos={[0, 0.05, 0]} size={[3.0, 0.1, 3.0]} color="#475569" roughness={0.8} />}
      {type === 'rebar' && <Box pos={[0, 0.05, 0]} size={[2.0, 0.08, 2.0]} color="#b91c1c" wireframe />}
      {type === 'steel-beam' && <Box pos={[0, 2.6, 0]} size={[3.0, 0.25, 0.15]} color="#475569" metalness={0.8} roughness={0.2} />}
      {type === 'connection' && <Box pos={[0, 2.6, 0]} size={[0.3, 0.3, 0.3]} color="#94a3b8" metalness={0.9} roughness={0.1} />}
      {type === 'truss' && (
        <group>
          <Box pos={[0, 2.6, 0]} size={[3.0, 0.08, 0.08]} color="#334155" metalness={0.7} />
          <Box pos={[0, 2.0, 0]} size={[3.0, 0.08, 0.08]} color="#334155" metalness={0.7} />
          <Box pos={[-0.8, 2.3, 0]} size={[0.08, 0.6, 0.08]} color="#334155" metalness={0.7} />
          <Box pos={[0.8, 2.3, 0]} size={[0.08, 0.6, 0.08]} color="#334155" metalness={0.7} />
          {/* Diagonals */}
          <group position={[-0.4, 2.3, 0]} rotation={[0, 0, 0.3]}>
            <Box pos={[0, 0, 0]} size={[1.0, 0.05, 0.05]} color="#334155" metalness={0.7} />
          </group>
          <group position={[0.4, 2.3, 0]} rotation={[0, 0, -0.3]}>
            <Box pos={[0, 0, 0]} size={[1.0, 0.05, 0.05]} color="#334155" metalness={0.7} />
          </group>
        </group>
      )}

      {/* MEP */}
      {type === 'duct' && <Box pos={[0, 2.4, 0]} size={[3.0, 0.35, 0.45]} color="#94a3b8" metalness={0.8} roughness={0.3} />}
      {type === 'hvac' && <Box pos={[0, 0.45, 0]} size={[0.9, 0.9, 0.9]} color="#cbd5e1" metalness={0.5} roughness={0.4} />}
      {type === 'grille' && <Box pos={[0, 2.4, 0]} size={[0.4, 0.02, 0.4]} color="#e2e8f0" roughness={0.2} />}
      {type === 'cable' && <Box pos={[0, 2.5, 0]} size={[3.0, 0.05, 0.3]} color="#64748b" wireframe />}
      {type === 'panel' && <Box pos={[0, 1.2, 0.08]} size={[0.6, 0.8, 0.18]} color="#475569" metalness={0.6} roughness={0.3} />}
      {type === 'light' && (
        <group>
          <Cylinder pos={[0, 2.5, 0]} args={[0.08, 0.08, 0.4, 8]} color="#475569" />
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
      {type === 'switch' && <Box pos={[0, 1.1, 0.02]} size={[0.08, 0.12, 0.02]} color="#f8fafc" roughness={0.2} />}
      {type === 'pipe' && <Cylinder pos={[0, 0.8, 0]} args={[0.06, 0.06, 1.6, 8]} color="#0ea5e9" metalness={0.7} roughness={0.2} />}
      {type === 'valve' && (
        <group>
          <Cylinder pos={[0, 0.8, 0]} args={[0.06, 0.06, 0.6, 8]} color="#0ea5e9" metalness={0.7} />
          <Cylinder pos={[0, 1.1, 0]} args={[0.18, 0.18, 0.04, 8]} color="#ef4444" metalness={0.4} />
        </group>
      )}
      {type === 'sprinkler' && (
        <group>
          <Cylinder pos={[0, 2.65, 0]} args={[0.02, 0.02, 0.1, 8]} color="#94a3b8" />
          <Box pos={[0, 2.58, 0]} size={[0.06, 0.04, 0.06]} color="#ef4444" />
        </group>
      )}
      {type === 'drain' && <Box pos={[0, 0.01, 0]} size={[0.3, 0.01, 0.3]} color="#475569" roughness={0.4} />}

      {/* Original placed room items */}
      {type === 'bedroom' && <Bed3D pos={[0, 0, 0]} />}
      {type === 'living' && <Sofa3D pos={[0, 0, 0]} />}
      {type === 'kitchen' && <Kitchen3D pos={[0, 0, 0]} />}
      {type === 'bathroom' && <Bathroom3D pos={[0, 0, 0]} />}
      {type === 'pool' && <Pool3D pos={[0, 0, 0]} />}
    </group>
  );
}
