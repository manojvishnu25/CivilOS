import React, { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, PointerLockControls, Html, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ProceduralBuilding, Bed3D, Sofa3D, Kitchen3D, Bathroom3D, Pool3D, PlacedObject3D } from './ProceduralHouse';
import { StructuralOverlay } from './StructuralOverlay';
import { MEPOverlay } from './MEPOverlay';
import { VastuOverlay } from './VastuOverlay';
import { EnvironmentSimulations } from './EnvironmentSimulations';

// ── Walkthrough Movement Controller (Pointer Lock) ─────────────────────────
function WalkthroughController({ active, canvasRef }) {
  const { camera, gl } = useThree();
  const keys = useRef({});
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  useEffect(() => {
    if (!active) return;
    camera.position.set(0, 1.7, 2);
    euler.current.set(-0.1, 0, 0);
    camera.quaternion.setFromEuler(euler.current);
  }, [active, camera]);

  useEffect(() => {
    if (!active) return;
    const canvas = gl.domElement;

    const onKeyDown = (e) => { keys.current[e.code] = true; };
    const onKeyUp   = (e) => { keys.current[e.code] = false; };

    const onMouseMove = (e) => {
      if (document.pointerLockElement !== canvas) return;
      euler.current.y -= e.movementX * 0.002;
      euler.current.x -= e.movementY * 0.002;
      euler.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.current.x));
    };

    const onClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      }
    };

    const onEscKey = (e) => {
      if (e.code === 'Escape' && document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
    };

    canvas.addEventListener('click',    onClick);
    window.addEventListener('keydown',  onKeyDown);
    window.addEventListener('keyup',    onKeyUp);
    window.addEventListener('keydown',  onEscKey);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      canvas.removeEventListener('click',    onClick);
      window.removeEventListener('keydown',  onKeyDown);
      window.removeEventListener('keyup',    onKeyUp);
      window.removeEventListener('keydown',  onEscKey);
      window.removeEventListener('mousemove', onMouseMove);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };
  }, [active, gl]);

  useFrame((_, delta) => {
    if (!active) return;
    const speed = 4 * delta;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0; dir.normalize();
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));

    if (keys.current['KeyW'] || keys.current['ArrowUp'])    camera.position.addScaledVector(dir, speed);
    if (keys.current['KeyS'] || keys.current['ArrowDown'])  camera.position.addScaledVector(dir, -speed);
    if (keys.current['KeyA'] || keys.current['ArrowLeft'])  camera.position.addScaledVector(right, -speed);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) camera.position.addScaledVector(right, speed);
    if (keys.current['KeyQ']) camera.position.y += speed * 0.5;
    if (keys.current['KeyE']) camera.position.y -= speed * 0.5;

    camera.position.y = Math.max(0.5, Math.min(12, camera.position.y));
    camera.quaternion.setFromEuler(euler.current);
  });

  return null;
}

// ── Orbit restore on mode switch ─────────────────────────────────────────────
function OrbitReset({ active }) {
  const { camera } = useThree();
  useEffect(() => {
    if (!active) {
      camera.position.set(15, 12, 18);
      camera.lookAt(0, 3, 0);
    }
  }, [active, camera]);
  return null;
}

// ── Coordinate Reporter ───────────────────────────────────────────────────────
function CoordReporter({ onCoordsChange, onFpsChange }) {
  const { camera } = useThree();
  const fpsRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useFrame(() => {
    frameCountRef.current++;
    const now = Date.now();
    if (now - lastTimeRef.current >= 500) {
      const fps = Math.round(frameCountRef.current / ((now - lastTimeRef.current) / 1000));
      fpsRef.current = fps;
      onFpsChange?.(fps);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      onCoordsChange?.({
        x: parseFloat(camera.position.x.toFixed(2)),
        y: parseFloat(camera.position.y.toFixed(2)),
        z: parseFloat(camera.position.z.toFixed(2)),
      });
    }
  });
  return null;
}

// ── View mode selector overlay ────────────────────────────────────────────────
const VIEW_MODES = [
  { id: 'architectural', label: '3D',    icon: '🏛️', color: '#C8B8A2' },
  { id: 'structural',   label: 'BIM',   icon: '🏗️', color: '#8FA876' },
  { id: 'mep',          label: 'MEP',   icon: '⚙️', color: '#8CB8B0' },
  { id: 'vastu',        label: 'Vastu', icon: '🧭', color: '#D4B372' },
  { id: 'sunlight',     label: 'Sun',   icon: '☀️', color: '#D4A057' },
  { id: 'airflow',      label: 'CFD',   icon: '💨', color: '#A08CB8' },
];

export function Canvas3D({
  config, viewMode, activeFloorCutaway, sunTime,
  isWalkthrough, setIsWalkthrough,
  showGrid, showShadows,
  onCoordsChange, onFpsChange,
  activeTool, onPlaceObject,
  mode,
  selectedItem, setSelectedItem,
}) {
  const canvasRef = useRef(null);
  const [snapshot, setSnapshot] = useState(false);
  const glRef = useRef(null);

  const [measureStart, setMeasureStart] = useState(null);
  const [measureHover, setMeasureHover] = useState(null);
  const [measureEnd, setMeasureEnd] = useState(null);

  const getMouseButtons = () => {
    if (activeTool === 'pan') {
      return { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
    }
    if (activeTool === 'zoom') {
      return { LEFT: THREE.MOUSE.DOLLY, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    }
    return { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  };

  const takeSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `BuildMind_3D_${config.buildingType}_${viewMode}.png`;
    link.click();
    setSnapshot(true);
    setTimeout(() => setSnapshot(false), 1500);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={canvasRef}>
      <Canvas
        shadows={showShadows}
        camera={{ position: [15, 12, 18], fov: 55, near: 0.1, far: 500 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        style={{ background: (mode === 'manual' || mode === 'ai') ? '#FFFFFF' : 'var(--bg-base)' }}
      >
        <Suspense fallback={null}>
          <CoordReporter onCoordsChange={onCoordsChange} onFpsChange={onFpsChange} />

          {/* Environment */}
          <EnvironmentSimulations sunTime={sunTime} viewMode={viewMode} />

          {/* Ambient + directional */}
          <ambientLight intensity={viewMode === 'sunlight' ? 0.2 : 0.5} color="#c8d8ff" />
          <directionalLight
            position={[20, 30, 10]}
            intensity={viewMode === 'sunlight' ? 1.5 : 1.0}
            castShadow={showShadows}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={100}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.3} color="#4080ff" />
          <pointLight position={[10, 5, 10]} intensity={0.2} color="#ff8040" />

          {/* Building */}
          {config.generatedByAI ? (
            <ProceduralBuilding
              config={config}
              viewMode={viewMode}
              activeFloorCutaway={activeFloorCutaway}
              isWalkthrough={isWalkthrough}
            />
          ) : (
            <group>
              {/* Plot slab */}
              <mesh position={[0, -0.01, 0]} receiveShadow>
                <boxGeometry args={[config.plotWidth * 0.28, 0.02, config.plotDepth * 0.28]} />
                <meshStandardMaterial color="#EAEAEF" roughness={0.8} />
              </mesh>
              {/* Plot outline border */}
              <mesh position={[0, 0.005, 0]}>
                <boxGeometry args={[config.plotWidth * 0.28 + 0.1, 0.01, config.plotDepth * 0.28 + 0.1]} />
                <meshBasicMaterial color="#C8B8A2" wireframe />
              </mesh>
            </group>
          )}

          {/* Placed Objects */}
          {config.placedObjects && config.placedObjects.map(obj => (
            <group
              key={obj.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(obj);
              }}
            >
              <PlacedObject3D
                type={obj.type}
                pos={obj.position}
                customVal={obj.customVal}
                isSelected={selectedItem && selectedItem.id === obj.id}
              />
            </group>
          ))}

          {/* Interactive Placement Ground Plane (also handles measurement, text annotations, etc.) */}
          {activeTool && !['select', 'multisel', 'orbit', 'pan', 'zoom', 'walkthru', 'grid', 'snap'].includes(activeTool) && (
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, 0.01, 0]} 
              onPointerMove={(e) => {
                if (activeTool === 'measure' && measureStart) {
                  setMeasureHover([e.point.x, 0.05, e.point.z]);
                }
              }}
              onPointerDown={(e) => {
                if (e.button === 0) {
                  e.stopPropagation();
                  
                  if (activeTool === 'measure') {
                    if (!measureStart) {
                      setMeasureStart([e.point.x, 0.05, e.point.z]);
                      setMeasureEnd(null);
                    } else {
                      setMeasureEnd({
                        start: measureStart,
                        end: [e.point.x, 0.05, e.point.z],
                        id: Date.now()
                      });
                      setMeasureStart(null);
                      setMeasureHover(null);
                    }
                  } else if (['text', 'tag', 'dim'].includes(activeTool)) {
                    let promptVal = "";
                    if (activeTool === 'text') {
                      promptVal = prompt("Enter text label:") || "Text Note";
                    } else if (activeTool === 'tag') {
                      promptVal = prompt("Enter tag name:") || "TAG";
                    } else {
                      promptVal = "DIM: " + (5 + Math.floor(Math.random() * 25)) + " ft";
                    }
                    onPlaceObject?.(activeTool, [e.point.x, 0.1, e.point.z], promptVal);
                  } else {
                    onPlaceObject?.(activeTool, [e.point.x, 0, e.point.z]);
                  }
                }
              }}
            >
              <planeGeometry args={[200, 200]} />
              <meshBasicMaterial visible={false} />
            </mesh>
          )}

          {/* Real-time Measurement Rendering */}
          {activeTool === 'measure' && measureStart && measureHover && (
            <group>
              <mesh position={measureStart}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
              <mesh position={measureHover}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
              {/* Measure line */}
              <mesh position={[
                (measureStart[0] + measureHover[0]) / 2,
                0.05,
                (measureStart[2] + measureHover[2]) / 2
              ]} rotation={[0, -Math.atan2(measureHover[2] - measureStart[2], measureHover[0] - measureStart[0]), 0]}>
                <boxGeometry args={[
                  Math.sqrt((measureHover[0]-measureStart[0])**2 + (measureHover[2]-measureStart[2])**2),
                  0.02,
                  0.02
                ]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
              {/* Floating label */}
              {(() => {
                const distFeet = (Math.sqrt((measureHover[0]-measureStart[0])**2 + (measureHover[2]-measureStart[2])**2) / 0.28).toFixed(1);
                return (
                  <Html position={[
                    (measureStart[0] + measureHover[0]) / 2,
                    0.4,
                    (measureStart[2] + measureHover[2]) / 2
                  ]} center>
                    <div style={{ background: '#ef4444', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
                      📐 {distFeet} ft
                    </div>
                  </Html>
                );
              })()}
            </group>
          )}

          {/* Last Completed Measurement Rendering */}
          {activeTool === 'measure' && measureEnd && (
            <group>
              <mesh position={measureEnd.start}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
              <mesh position={measureEnd.end}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
              {/* Line */}
              <mesh position={[
                (measureEnd.start[0] + measureEnd.end[0]) / 2,
                0.05,
                (measureEnd.start[2] + measureEnd.end[2]) / 2
              ]} rotation={[0, -Math.atan2(measureEnd.end[2] - measureEnd.start[2], measureEnd.end[0] - measureEnd.start[0]), 0]}>
                <boxGeometry args={[
                  Math.sqrt((measureEnd.end[0]-measureEnd.start[0])**2 + (measureEnd.end[2]-measureEnd.start[2])**2),
                  0.02,
                  0.02
                ]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
              {/* Floating label */}
              {(() => {
                const distFeet = (Math.sqrt((measureEnd.end[0]-measureEnd.start[0])**2 + (measureEnd.end[2]-measureEnd.start[2])**2) / 0.28).toFixed(1);
                return (
                  <Html position={[
                    (measureEnd.start[0] + measureEnd.end[0]) / 2,
                    0.4,
                    (measureEnd.start[2] + measureEnd.end[2]) / 2
                  ]} center>
                    <div style={{ background: '#10b981', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
                      📐 {distFeet} ft
                    </div>
                  </Html>
                );
              })()}
            </group>
          )}

          {/* Overlays */}
          {viewMode === 'structural' && <StructuralOverlay config={config} />}
          {viewMode === 'mep' && <MEPOverlay config={config} />}
          {viewMode === 'vastu' && <VastuOverlay config={config} />}

          {/* Shadows */}
          {showShadows && (
            <ContactShadows
              position={[0, -0.06, 0]}
              opacity={0.5} scale={50} blur={20} far={12}
              resolution={512} color="#000011"
            />
          )}

          {/* Grid */}
          {showGrid && (
            <Grid
              infiniteGrid
              cellSize={1}
              sectionSize={5}
              sectionColor="#C4C9D0"
              cellColor="#E0E4E8"
              fadeDistance={50}
              fadeStrength={1.5}
              position={[0, -0.02, 0]}
            />
          )}

          {/* Camera controllers */}
          <WalkthroughController active={isWalkthrough} canvasRef={glRef} />
          <OrbitReset active={isWalkthrough} />

          {!isWalkthrough && (
            <OrbitControls
              makeDefault
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2 - 0.02}
              maxDistance={80}
              minDistance={1}
              target={[0, 4, 0]}
              enableDamping
              dampingFactor={0.08}
              mouseButtons={getMouseButtons()}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Top-left: Status badge */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8, zIndex: 10, flexWrap: 'wrap' }}>
        <div className="viewport-badge" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'shimmer 1.5s ease-in-out infinite' }} />
          <span style={{ color: 'var(--beige)', fontWeight: 700 }}>WebGL 3D ENGINE</span>
          <span style={{ color: 'var(--text-4)' }}>|</span>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>{viewMode?.toUpperCase()}</span>
        </div>
        {isWalkthrough && (
          <div className="viewport-badge" style={{ color: '#C8B8A2', border: '1px solid rgba(200,184,162,0.4)' }}>
            🚶 WALKTHROUGH — Click to Look Around
          </div>
        )}
      </div>

      {/* Top-right: Controls */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>
        {/* Walk / Orbit toggle */}
        <button
          onClick={() => setIsWalkthrough(v => !v)}
          style={{
            padding: '7px 14px', borderRadius: 10,
            background: isWalkthrough ? 'rgba(143,168,118,0.15)' : 'var(--bg-panel)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isWalkthrough ? 'rgba(143,168,118,0.45)' : 'var(--border)'}`,
            color: isWalkthrough ? '#8FA876' : 'var(--text-2)',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace',
            transition: 'all 0.2s ease',
          }}
        >
          {isWalkthrough ? '🌐 Exit Walk' : '🚶 Enter Building'}
        </button>

        {/* Snapshot */}
        <button
          onClick={takeSnapshot}
          className="viewport-badge"
          style={{
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            background: snapshot ? 'rgba(16,185,129,0.2)' : 'var(--bg-panel)',
            border: `1px solid ${snapshot ? 'rgba(16,185,129,0.5)' : 'var(--border)'}`,
            color: snapshot ? '#10b981' : 'var(--text-2)',
            transition: 'all 0.25s ease',
          }}
        >
          📷 {snapshot ? 'Captured!' : 'Capture 3D'}
        </button>
      </div>

      {/* Bottom-left: Controls guide */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 10 }}>
        <div className="viewport-badge">
          {isWalkthrough
            ? '🖱️ Hold+Drag: Look | WASD/Arrows: Move | Q/E: Up/Down'
            : '🖱️ Drag: Orbit | Right-Drag: Pan | Scroll: Zoom | Double-click: Focus'
          }
        </div>
      </div>

      {/* Bottom-right: View mode quick switch */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12, zIndex: 10,
        display: 'flex', gap: 4,
      }}>
        {VIEW_MODES.map(vm => (
          <button
            key={vm.id}
            title={vm.label}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: viewMode === vm.id ? `${vm.color}20` : 'var(--bg-panel)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${viewMode === vm.id ? vm.color + '60' : 'var(--border)'}`,
              cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {vm.icon}
          </button>
        ))}
      </div>

      {/* Walkthrough crosshair */}
      {isWalkthrough && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 5,
        }}>
          <div style={{ position: 'relative', width: 20, height: 20 }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(200,184,162,0.75)', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(200,184,162,0.75)', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, borderRadius: '50%', background: 'rgba(200,184,162,0.9)', transform: 'translate(-50%,-50%)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
