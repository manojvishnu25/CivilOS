import React from 'react';
import { Html } from '@react-three/drei';

export function VastuOverlay({ config }) {
  const { plotWidth = 40, plotDepth = 60 } = config;
  const scale = 0.25;
  const pW = plotWidth * scale;
  const pD = plotDepth * scale;

  const zones = [
    { name: 'N (North)', room: 'Living / Main Entrance', score: '98%', color: '#00ff9d', pos: [0, 0.05, pD / 2.2] },
    { name: 'NE (Ishanya)', room: 'Pooja & Water Tank', score: '100%', color: '#00ff9d', pos: [pW / 2.2, 0.05, pD / 2.2] },
    { name: 'E (East)', room: 'Foyer / Verandah', score: '95%', color: '#00ff9d', pos: [pW / 2.2, 0.05, 0] },
    { name: 'SE (Agneya)', room: 'Kitchen & Generator', score: '97%', color: '#00ff9d', pos: [pW / 2.2, 0.05, -pD / 2.2] },
    { name: 'S (South)', room: 'Staircase / Store', score: '92%', color: '#ffb800', pos: [0, 0.05, -pD / 2.2] },
    { name: 'SW (Nairutya)', room: 'Master Bedroom', score: '99%', color: '#00ff9d', pos: [-pW / 2.2, 0.05, -pD / 2.2] },
    { name: 'W (West)', room: 'Children Bedroom', score: '90%', color: '#00ff9d', pos: [-pW / 2.2, 0.05, 0] },
    { name: 'NW (Vayavya)', room: 'Guest Room / Garage', score: '94%', color: '#00ff9d', pos: [-pW / 2.2, 0.05, pD / 2.2] },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Vastu Ground Grid Compass Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[pW * 0.6, pW * 0.65, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </mesh>

      {/* Center Brahmasthan Highlight (Must be open & clean) */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.02, 32]} />
        <meshStandardMaterial color="#00ff9d" opacity={0.3} transparent emissive="#00ff9d" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.2, 0]} center>
        <div className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[10px] px-2 py-0.5 rounded font-mono shadow">
          ✨ Brahmasthan (Sanctum Core: Clear)
        </div>
      </Html>

      {/* Directional Zone Markers */}
      {zones.map((zone, idx) => (
        <group key={`vastu-zone-${idx}`} position={zone.pos}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.02, 16]} />
            <meshStandardMaterial color={zone.color} opacity={0.3} transparent emissive={zone.color} emissiveIntensity={0.3} />
          </mesh>
          <Html position={[0, 0.3, 0]} center>
            <div className="bg-slate-950/90 text-slate-100 border border-slate-700 text-[10px] p-1.5 rounded shadow-lg backdrop-blur-sm whitespace-nowrap">
              <div className="font-bold text-cyan-400">{zone.name}</div>
              <div className="text-[9px] text-slate-300">{zone.room}</div>
              <div className="text-[9px] text-emerald-400 font-mono">Vastu: {zone.score}</div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
