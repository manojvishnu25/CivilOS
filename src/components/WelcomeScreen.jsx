import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   WelcomeScreen — Ultra-Detailed 3D Exploding House
───────────────────────────────────────────────────────────── */

const EXTRA_CSS = `
.lux-text {
  font-family: 'Times New Roman', Times, serif;
  color: #FFFFFF;
}
.lux-accent {
  color: #D4AF37; /* Classic Gold */
}
.layer-label {
  color: #D4AF37;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  letter-spacing: 0.25em;
  white-space: nowrap;
  background: rgba(4,4,5,0.9);
  padding: 6px 12px;
  border: 1px solid rgba(212,175,55,0.4);
  border-radius: 4px;
  backdrop-filter: blur(4px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s;
}
.layer-label.visible {
  opacity: 1;
}
`;

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function Person(props) {
  return (
    <group {...props}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 1]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#f5cba7" roughness={0.6} />
      </mesh>
    </group>
  );
}

function StylizedCloud(props) {
  return (
    <group {...props}>
      <mesh position={[-2, 0, 0]}><sphereGeometry args={[2, 16, 16]} /><meshStandardMaterial color="#e2e8f0" transparent opacity={0.15} roughness={1} /></mesh>
      <mesh position={[1.5, 0.5, -1]}><sphereGeometry args={[2.8, 16, 16]} /><meshStandardMaterial color="#e2e8f0" transparent opacity={0.15} roughness={1} /></mesh>
      <mesh position={[0, -0.5, 1]}><sphereGeometry args={[1.8, 16, 16]} /><meshStandardMaterial color="#e2e8f0" transparent opacity={0.15} roughness={1} /></mesh>
      <mesh position={[3, -0.2, 1.5]}><sphereGeometry args={[1.5, 16, 16]} /><meshStandardMaterial color="#e2e8f0" transparent opacity={0.15} roughness={1} /></mesh>
    </group>
  );
}

function ExplodingHouse() {
  const groupRef = useRef();
  const roofRef = useRef();
  const foundRef = useRef();
  const planRef = useRef();
  
  const wallL = useRef();
  const wallR = useRef();
  const wallF = useRef();
  const wallB = useRef();

  const [explodedLR, setExplodedLR] = useState(false);
  const [explodedUD, setExplodedUD] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = t % 12; // 12 second loop

    let progressLR = 0;
    let progressUD = 0;
    
    if (cycle > 1 && cycle <= 2.5) {
      progressLR = (cycle - 1) / 1.5;
    } else if (cycle > 2.5 && cycle <= 4) {
      progressLR = 1;
      progressUD = (cycle - 2.5) / 1.5;
    } else if (cycle > 4 && cycle <= 7) {
      progressLR = 1;
      progressUD = 1;
    } else if (cycle > 7 && cycle <= 8.5) {
      progressLR = 1;
      progressUD = 1 - (cycle - 7) / 1.5;
    } else if (cycle > 8.5 && cycle <= 10) {
      progressLR = 1 - (cycle - 8.5) / 1.5;
      progressUD = 0;
    } else {
      progressLR = 0;
      progressUD = 0;
    }

    const easeLR = easeInOutCubic(Math.max(0, Math.min(progressLR, 1)));
    const easeUD = easeInOutCubic(Math.max(0, Math.min(progressUD, 1)));
    
    if (explodedLR !== (easeLR > 0.5)) setExplodedLR(easeLR > 0.5);
    if (explodedUD !== (easeUD > 0.5)) setExplodedUD(easeUD > 0.5);

    // Slowly rotate the entire house in place
    if (groupRef.current) {
      groupRef.current.rotation.y -= 0.15 * (1 / 60); // Assuming ~60fps
    }

    // Left/Right split (Walls fly outward)
    if (wallL.current) wallL.current.position.x = -2 - easeLR * 2.5;
    if (wallR.current) wallR.current.position.x = 2 + easeLR * 2.5;
    if (wallF.current) wallF.current.position.z = 2 + easeLR * 2.5;
    if (wallB.current) wallB.current.position.z = -2 - easeLR * 2.5;

    // Up/Down split (Roof and Foundation)
    if (roofRef.current) roofRef.current.position.y = 1.2 + easeUD * 1.6;
    if (foundRef.current) foundRef.current.position.y = -1.5 + easeUD * -1.0;
    if (planRef.current) planRef.current.position.y = -2.2 + easeUD * -1.8;
  });

  return (
    <group ref={groupRef} position={[8, -1.5, 0]}>
      {/* ── 1. ROOF ── */}
      <group ref={roofRef} position={[0, 1.5, 0]}>
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[3.8, 1.8, 4]} />
          <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
        {/* Roof Overhang Base */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[4.8, 0.2, 4.8]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.4} />
        </mesh>
        <Html position={[0, 2, 0]} center className={`layer-label ${explodedUD ? 'visible' : ''}`}>
          ROOF & OVERHANG
        </Html>
      </group>

      {/* ── 2. WALLS (Split LR/FB) ── */}
      <group>
        {/* Left Wall - Architectural Wood Louvers */}
        <group ref={wallL} position={[-2, 0, 0]}>
          <mesh><boxGeometry args={[0.1, 2.8, 4]} /><meshStandardMaterial color="#1a202c" /></mesh>
          {Array.from({length: 10}).map((_, i) => (
            <mesh key={i} position={[-0.1, 0, -1.8 + i*0.4]}>
              <boxGeometry args={[0.05, 2.8, 0.15]} />
              <meshStandardMaterial color="#8B5A2B" roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* Right Wall - Concrete with Neon Trim */}
        <group ref={wallR} position={[2, 0, 0]}>
          <mesh position={[0, 0.8, 0]}><boxGeometry args={[0.2, 1.2, 4]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
          <mesh position={[0, -0.8, 0]}><boxGeometry args={[0.2, 1.2, 4]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
          <mesh position={[0, 0, -1.5]}><boxGeometry args={[0.2, 2.8, 1]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
          <mesh position={[0, 0, 1.5]}><boxGeometry args={[0.2, 2.8, 1]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
          <mesh position={[0, 0, 0]}><boxGeometry args={[0.05, 1.4, 2]} /><meshPhysicalMaterial color="#88ccff" transmission={0.9} opacity={0.5} transparent roughness={0.1} /></mesh>
          <mesh position={[0.11, -0.1, 0]}><boxGeometry args={[0.02, 0.05, 4]} /><meshBasicMaterial color="#00e5ff" /></mesh>
          <Html position={[1.5, 0, 0]} center className={`layer-label ${explodedLR ? 'visible' : ''}`}>
            FACADE & GLAZING
          </Html>
        </group>

        {/* Front Wall - Full Glass Curtain Wall */}
        <group ref={wallF} position={[0, 0, 2]}>
          <mesh><boxGeometry args={[3.8, 2.8, 0.1]} /><meshPhysicalMaterial color="#88ccff" transmission={0.9} opacity={0.6} transparent roughness={0.1} /></mesh>
          {/* Mullions */}
          <mesh position={[0, 0, 0.1]}><boxGeometry args={[3.8, 0.1, 0.05]} /><meshStandardMaterial color="#1a202c" /></mesh>
          <mesh position={[-1.2, 0, 0.1]}><boxGeometry args={[0.1, 2.8, 0.05]} /><meshStandardMaterial color="#1a202c" /></mesh>
          <mesh position={[1.2, 0, 0.1]}><boxGeometry args={[0.1, 2.8, 0.05]} /><meshStandardMaterial color="#1a202c" /></mesh>
        </group>

        {/* Back Wall - Stone / Concrete Panel */}
        <group ref={wallB} position={[0, 0, -2]}>
          <mesh><boxGeometry args={[3.8, 2.8, 0.2]} /><meshStandardMaterial color="#4a5568" /></mesh>
          {/* Architectural Trim */}
          <mesh position={[0, 0.5, -0.15]}><boxGeometry args={[3.8, 0.5, 0.1]} /><meshStandardMaterial color="#1a202c" /></mesh>
          <mesh position={[0, -1, -0.15]}><boxGeometry args={[3.8, 0.2, 0.1]} /><meshStandardMaterial color="#D4AF37" /></mesh>
        </group>
      </group>

      {/* ── 3. INTERIOR (Always visible) ── */}
      <group position={[0, -1.3, 0]}>
        {/* Floor */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.8, 0.1, 3.8]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.7} />
        </mesh>
        {/* Bed */}
        <mesh position={[-1, 0.3, -1]}>
          <boxGeometry args={[1.5, 0.5, 1.5]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Table */}
        <mesh position={[1, 0.4, 1]}>
          <boxGeometry args={[1.2, 0.6, 0.8]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        {/* Sofa */}
        <mesh position={[-1, 0.4, 1.2]}>
          <boxGeometry args={[1.8, 0.5, 0.6]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        {/* Interior Plant */}
        <mesh position={[1.5, 0.5, -1.5]}><cylinderGeometry args={[0.2, 0.1, 0.8]} /><meshStandardMaterial color="#4ade80" /></mesh>
        <Html position={[0, 0.5, 0]} center className={`layer-label ${(explodedLR && !explodedUD) ? 'visible' : ''}`}>
          FURNISHED INTERIOR
        </Html>
      </group>

      {/* ── 4. FOUNDATION ── */}
      <group ref={foundRef} position={[0, -1.5, 0]}>
        <mesh>
          <boxGeometry args={[4.4, 0.5, 4.4]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
        <Html position={[3, 0, 0]} center className={`layer-label ${explodedUD ? 'visible' : ''}`}>
          STRUCTURAL FOUNDATION
        </Html>
      </group>

      {/* ── 5. BLUEPRINT PLAN ── */}
      <group ref={planRef} position={[0, -2.2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial color="#001122" side={THREE.DoubleSide} />
        </mesh>
        <Grid position={[0, 0.01, 0]} args={[6, 6]} cellColor="#00E5FF" sectionColor="#0055AA" fadeDistance={15} />
        <Html position={[0, -0.5, 3.5]} center className={`layer-label ${explodedUD ? 'visible' : ''}`}>
          BIM FLOOR PLAN
        </Html>
      </group>

      {/* ── SCALE FIGURE ── */}
      <Person position={[-3.5, -1.3, 2]} />
    </group>
  );
}

export default function WelcomeScreen({ onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{EXTRA_CSS}</style>

      <div style={{
        width: '100vw', height: '100vh',
        position: 'relative', overflow: 'hidden',
        background: '#040405',
      }}>

        {/* ── 1. Dynamic Background Elements ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 4, 16], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {/* Stars */}
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            
            {/* Massive Glowing Moon */}
            <mesh position={[12, 18, -35]}>
              <sphereGeometry args={[4, 64, 64]} />
              <meshBasicMaterial color="#fff0d4" />
              <pointLight intensity={3} distance={100} color="#fff0d4" />
            </mesh>

            {/* Realistic Clouds near the Moon */}
            <StylizedCloud position={[8, 16, -30]} scale={2} />
            <StylizedCloud position={[16, 20, -40]} scale={3} />
            <StylizedCloud position={[0, 22, -25]} scale={1.5} />

            {/* Very faint background grid */}
            <Grid position={[0, -4, 0]} args={[100, 100]} cellColor="#ffffff" sectionColor="#ffffff" cellThickness={0.5} sectionThickness={1} fadeDistance={40} opacity={0.05} transparent />

            <ExplodingHouse />
            
            <ContactShadows position={[8, -3.9, 0]} resolution={1024} scale={20} blur={2.5} opacity={0.6} far={10} color="#000000" />
            {/* Camera sits perfectly still, house rotates in place */}
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} target={[2, -1.5, 0]} />
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* Glassmorphism gradient overlays for depth */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'radial-gradient(circle at 30% 50%, transparent 30%, rgba(4,4,5,0.95) 90%)', pointerEvents: 'none' }} />
        
        {/* ── 2. Top Navigation ── */}
        <nav style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '35px 70px', zIndex: 20, pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 52, height: 52, border: '1px solid rgba(212, 175, 55, 0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(212, 175, 55, 0.05)',
              backdropFilter: 'blur(10px)',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <div className="lux-text" style={{ fontSize: 26, letterSpacing: '0.15em' }}>
                AI CIVIL<span className="lux-accent">OS</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4em', marginTop: 6 }}>
                ENTERPRISE ARCHITECTURE
              </div>
            </div>
          </div>
        </nav>

        {/* ── 3. Main Center Content (Left Side) ── */}
        <div style={{
          position: 'absolute', top: '50%', left: '8%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          
          <div style={{ marginBottom: 50 }}>
            <h1 className="lux-text" style={{
              fontSize: 'clamp(50px, 6vw, 90px)',
              fontWeight: 400, margin: 0, lineHeight: 1.05,
              letterSpacing: '0.02em',
              textShadow: '0 10px 40px rgba(0,0,0,0.8)',
            }}>
              Design The<br /><span className="lux-accent" style={{ fontStyle: 'italic' }}>Future</span>
            </h1>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.5)',
              marginTop: 24, letterSpacing: '0.45em',
              fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
            }}>
              The Pinnacle of Digital Engineering
            </p>
          </div>

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onSelect('choose')}
            style={{
              position: 'relative', cursor: 'pointer',
              transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.3, 1)',
              transform: `translateZ(${hovered ? 20 : 0}px) scale(${hovered ? 1.05 : 1})`,
            }}
          >
            <div style={{
              padding: '24px 60px',
              background: hovered ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
              border: hovered ? '1px solid rgba(212,175,55,0.8)' : '1px solid rgba(212,175,55,0.3)',
              backdropFilter: 'blur(25px)',
              boxShadow: hovered ? '0 30px 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(212,175,55,0.1)' : '0 20px 40px rgba(0,0,0,0.5)',
              transition: 'all 0.4s ease',
            }}>
              <div className="lux-text" style={{ fontSize: 18, letterSpacing: '0.25em', color: hovered ? '#FFFFFF' : 'rgba(255,255,255,0.9)' }}>
                INITIALIZE
              </div>
            </div>
            <div style={{ position: 'absolute', top: -8, left: '50%', width: 1, height: 16, background: '#D4AF37', transition: 'height 0.4s', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', bottom: -8, left: '50%', width: 1, height: 16, background: '#D4AF37', transition: 'height 0.4s', transform: 'translateX(-50%)' }} />
          </div>

        </div>

      </div>
    </>
  );
}
