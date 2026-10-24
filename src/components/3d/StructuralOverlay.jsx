import React from 'react';
import { Html } from '@react-three/drei';

export function StructuralOverlay({ config }) {
  const { floors = 2, plotWidth = 40, plotDepth = 60 } = config;
  const scale = 0.25;
  const pW = plotWidth * scale;
  const pD = plotDepth * scale;
  const bW = pW * 0.65;
  const bD = pD * 0.65;
  const wallHeight = 2.4;

  const columnPositions = [
    [-bW / 2, -bD / 2],
    [bW / 2, -bD / 2],
    [-bW / 2, bD / 2],
    [bW / 2, bD / 2],
    [0, -bD / 2],
    [0, bD / 2],
    [-bW / 2, 0],
    [bW / 2, 0],
  ];

  return (
    <group>
      {Array.from({ length: floors }).map((_, fIndex) => {
        const floorY = fIndex * wallHeight;

        return (
          <group key={`struct-${fIndex}`} position={[0, floorY, 0]}>
            {/* Load Columns (Green - Passed Load Check) */}
            {columnPositions.map(([cx, cz], i) => (
              <mesh key={`col-${i}`} position={[cx, wallHeight / 2, cz]}>
                <boxGeometry args={[0.3, wallHeight, 0.3]} />
                <meshStandardMaterial color="#00ff9d" emissive="#00ff9d" emissiveIntensity={0.5} wireframe />
              </mesh>
            ))}

            {/* Perimeter Beams */}
            <mesh position={[0, wallHeight, 0]}>
              <boxGeometry args={[bW + 0.1, 0.25, bD + 0.1]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.4} wireframe />
            </mesh>

            {/* Cantilever Warning Span (Red Flagged Span) */}
            {fIndex === 1 && (
              <group position={[bW / 2 + 0.6, wallHeight - 0.2, 0]}>
                <mesh>
                  <boxGeometry args={[1.2, 0.2, bD * 0.5]} />
                  <meshStandardMaterial color="#ff2a6d" emissive="#ff2a6d" emissiveIntensity={0.6} />
                </mesh>
                <Html position={[0, 0.6, 0]} center>
                  <div className="bg-rose-950/90 text-rose-300 border border-rose-500/50 text-xs px-2.5 py-1 rounded-md shadow-lg backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap animate-pulse font-mono">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>⚠️ ALERT: Cantilever Span 4.2m &gt; 3.0m (Reinforcement Required)</span>
                  </div>
                </Html>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
