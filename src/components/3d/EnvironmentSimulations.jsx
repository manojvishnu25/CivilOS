import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function EnvironmentSimulations({ sunTime = 12, viewMode }) {
  // Convert 24h sun time (06:00 to 18:00) into sun angle position
  const sunAngle = ((sunTime - 6) / 12) * Math.PI; // 0 to PI
  const sunX = Math.cos(sunAngle) * 25;
  const sunY = Math.sin(sunAngle) * 20 + 2;
  const sunZ = 10;

  // Particle airflow points
  const particleGroupRef = useRef();

  useFrame((_, delta) => {
    if (particleGroupRef.current && viewMode === 'airflow') {
      particleGroupRef.current.children.forEach((p, idx) => {
        p.position.z += delta * (2 + (idx % 3));
        if (p.position.z > 12) p.position.z = -12;
      });
    }
  });

  return (
    <group>
      {/* Dynamic Sun Position Light */}
      <directionalLight
        position={[sunX, sunY, sunZ]}
        intensity={sunY > 0 ? Math.max(0.2, (sunY / 20) * 1.8) : 0.05}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <ambientLight intensity={0.4} />

      {/* Sun Visual Mesh */}
      {viewMode === 'sunlight' && (
        <mesh position={[sunX, sunY, sunZ]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial color="#ffb800" />
        </mesh>
      )}

      {/* CFD Airflow Particles */}
      {viewMode === 'airflow' && (
        <group ref={particleGroupRef}>
          {Array.from({ length: 30 }).map((_, i) => {
            const px = ((i % 5) - 2) * 2;
            const py = 1 + (i % 3) * 1.2;
            const pz = -12 + (i * 0.8) % 24;

            return (
              <mesh key={`particle-${i}`} position={[px, py, pz]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} opacity={0.7} transparent />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
