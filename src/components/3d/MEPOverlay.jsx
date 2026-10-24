import React from 'react';
import { Html } from '@react-three/drei';

export function MEPOverlay({ config }) {
  const { floors = 2, plotWidth = 40, plotDepth = 60 } = config;
  const scale = 0.25;
  const pW = plotWidth * scale;
  const pD = plotDepth * scale;
  const bW = pW * 0.65;
  const bD = pD * 0.65;
  const wallHeight = 2.4;

  return (
    <group position={[0, 0, 0]}>
      {/* ELECTRICAL CONDUIT (Cyan Glow Lines) */}
      <mesh position={[0, wallHeight * floors - 0.2, 0]}>
        <boxGeometry args={[bW * 0.8, 0.05, bD * 0.8]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
      </mesh>

      {/* PLUMBING PIPES (Blue Supply & Red Drain) */}
      {/* Main Vertical Riser */}
      <mesh position={[bW / 3, (floors * wallHeight) / 2, -bD / 3]}>
        <cylinderGeometry args={[0.08, 0.08, floors * wallHeight + 1, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>

      {/* Drain Riser */}
      <mesh position={[bW / 3 + 0.3, (floors * wallHeight) / 2, -bD / 3]}>
        <cylinderGeometry args={[0.1, 0.1, floors * wallHeight + 1, 16]} />
        <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.6} />
      </mesh>

      {/* HVAC DUCTING (Magenta Trunk) */}
      <mesh position={[0, wallHeight * floors - 0.5, 0]}>
        <boxGeometry args={[bW * 0.9, 0.15, 0.25]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.5} />
      </mesh>

      {/* MEP Labels */}
      <Html position={[0, wallHeight * floors + 0.5, 0]} center>
        <div className="bg-slate-900/90 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-1 rounded shadow-lg font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>MEP ROUTING ENGINE ACTIVE (E-01 | P-02 | H-01)</span>
        </div>
      </Html>
    </group>
  );
}
