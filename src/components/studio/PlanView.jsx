import React, { useMemo, useState } from 'react';

/* ────────────────────────────────────────────────────────────
   PlanView — SVG 2D orthographic floor plan
   Rendered from the same `config` object as the 3D model.
   Supports: villa, apartment, and generic buildings.
──────────────────────────────────────────────────────────── */

const SCALE = 10;          // 1 foot → 10 SVG units
const WALL_T = 8;          // wall thickness in SVG units
const WALL_CLR  = '#1A1A1A';    // near-black walls
const ANN_CLR   = '#2C3E50';    // dark annotation text
const DIM_CLR   = '#34495E';    // dimension lines
const ROOM_CLR  = '#2C3E50';    // room labels
const COL_CLR   = '#1A1A1A';    // columns (solid black)
const WINDOW_CLR= '#5B8DB8';    // windows (blue glazing)
const PAPER     = '#FFFFFF';    // paper background
const BEIGE     = '#C8B8A2';    // beige accent
const GOLD      = '#D4B372';    // gold accent
const GRID_CLR  = 'rgba(0,0,0,0.06)';

/* ── Helpers ── */
const ft = v => v * SCALE;

function Wall({ x, y, w, h, color = WALL_CLR, opacity = 1 }) {
  return <rect x={x} y={y} width={w} height={h} fill={color} opacity={opacity} rx="0" />;
}

function DimLine({ x1, y1, x2, y2, label, vertical }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const offset = 18;
  return (
    <g className="dim-line">
      <line x1={x1} y1={y1} x2={vertical ? x1 - offset : x1} y2={vertical ? y1 : y1 - offset} stroke={DIM_CLR} strokeWidth="0.4" opacity="0.55" />
      <line x1={x2} y1={y2} x2={vertical ? x2 - offset : x2} y2={vertical ? y2 : y2 - offset} stroke={DIM_CLR} strokeWidth="0.4" opacity="0.55" />
      <line
        x1={vertical ? x1 - offset : x1} y1={vertical ? y1 : y1 - offset}
        x2={vertical ? x2 - offset : x2} y2={vertical ? y2 : y2 - offset}
        stroke={DIM_CLR} strokeWidth="0.5" opacity="0.7"
        markerStart="url(#arrow-start)" markerEnd="url(#arrow-end)"
      />
      <text
        x={vertical ? mx - offset - 6 : mx}
        y={vertical ? my : y1 - offset - 4}
        fontSize="7" fill={DIM_CLR} opacity="0.85"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        transform={vertical ? `rotate(-90, ${mx - offset - 6}, ${my})` : undefined}
      >{label}</text>
    </g>
  );
}

function RoomLabel({ cx, cy, name, area, color = ROOM_CLR }) {
  return (
    <g>
      <text x={cx} y={cy - 4} fontSize="8.5" fill={color} textAnchor="middle" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.85">{name}</text>
      {area && <text x={cx} y={cy + 8} fontSize="6.5" fill={color} textAnchor="middle" opacity="0.55" fontFamily="JetBrains Mono, monospace">{area}</text>}
    </g>
  );
}

function DoorArc({ x, y, size = 28, rotate = 0 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      <line x1="0" y1="0" x2={size} y2="0" stroke={WALL_CLR} strokeWidth="1.2" opacity="0.9" />
      <path d={`M 0 0 A ${size} ${size} 0 0 1 ${size * 0.707} ${-size * 0.707}`}
        fill="none" stroke={DIM_CLR} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
    </g>
  );
}

function WindowSegment({ x, y, w, horizontal }) {
  if (horizontal) {
    return (
      <g>
        <rect x={x} y={y} width={w} height={WALL_T} fill={PAPER} />
        <line x1={x} y1={y + WALL_T * 0.2} x2={x + w} y2={y + WALL_T * 0.2} stroke={WINDOW_CLR} strokeWidth="0.8" opacity="0.9" />
        <line x1={x} y1={y + WALL_T * 0.5}  x2={x + w} y2={y + WALL_T * 0.5}  stroke={WINDOW_CLR} strokeWidth="1.4" opacity="1" />
        <line x1={x} y1={y + WALL_T * 0.8} x2={x + w} y2={y + WALL_T * 0.8} stroke={WINDOW_CLR} strokeWidth="0.8" opacity="0.9" />
      </g>
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={WALL_T} height={w} fill={PAPER} />
      <line x1={x + WALL_T * 0.2} y1={y} x2={x + WALL_T * 0.2} y2={y + w} stroke={WINDOW_CLR} strokeWidth="0.8" opacity="0.9" />
      <line x1={x + WALL_T * 0.5}  y1={y} x2={x + WALL_T * 0.5}  y2={y + w} stroke={WINDOW_CLR} strokeWidth="1.4" opacity="1" />
      <line x1={x + WALL_T * 0.8} y1={y} x2={x + WALL_T * 0.8} y2={y + w} stroke={WINDOW_CLR} strokeWidth="0.8" opacity="0.9" />
    </g>
  );
}

function Column({ cx, cy, size = 10 }) {
  return (
    <g>
      <rect x={cx - size/2} y={cy - size/2} width={size} height={size} fill={COL_CLR} opacity="1" />
      <rect x={cx - size/2 + 1.5} y={cy - size/2 + 1.5} width={size - 3} height={size - 3} fill="none" stroke={PAPER} strokeWidth="1" opacity="0.6" />
    </g>
  );
}

function FurnitureRect({ x, y, w, h, label, color = 'rgba(0,0,0,0.04)', stroke = 'rgba(0,0,0,0.25)' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} stroke={stroke} strokeWidth="0.7" rx="1" />
      {label && <text x={x + w/2} y={y + h/2 + 3} fontSize="5.5" fill={ANN_CLR} textAnchor="middle" opacity="0.6" fontFamily="Inter">{label}</text>}
    </g>
  );
}

/* ── Villa Floor Plan ─────────────────────────────────── */
function VillaFloorPlan({ config, padX, padY }) {
  const pW = ft(config.plotWidth || 40);
  const pD = ft(config.plotDepth || 60);
  const bW = pW * 0.82;
  const bD = pD * 0.80;
  const ox = padX + (pW - bW) / 2;
  const oy = padY + (pD - bD) / 2;
  const wt = WALL_T;

  // Room areas (approx sq ft)
  const livingArea = `${Math.round(bW * 0.48 * bD * 0.42 / SCALE / SCALE)} sqft`;
  const kitchenArea = `${Math.round(bW * 0.28 * bD * 0.38 / SCALE / SCALE)} sqft`;
  const bedroom1Area = `${Math.round(bW * 0.45 * bD * 0.52 / SCALE / SCALE)} sqft`;
  const bedroom2Area = `${Math.round(bW * 0.28 * bD * 0.52 / SCALE / SCALE)} sqft`;
  const bathArea = `${Math.round(bW * 0.24 * bD * 0.18 / SCALE / SCALE)} sqft`;

  const dvX = ox + bW * 0.52; // Vertical divider
  const dhY = oy + bD * 0.44; // Horizontal divider

  return (
    <g>
      {/* ── Plot boundary (dashed) */}
      <rect x={padX} y={padY} width={pW} height={pD}
        fill="none" stroke="rgba(200,184,162,0.15)" strokeWidth="0.8" strokeDasharray="6 4" />

      {config.generatedByAI && (
        <>
          {/* ── Outer walls */}
          <Wall x={ox}           y={oy}           w={bW}  h={wt}  />  {/* North */}
          <Wall x={ox}           y={oy+bD-wt}     w={bW}  h={wt}  />  {/* South */}
          <Wall x={ox}           y={oy}           w={wt}  h={bD}  />  {/* West */}
          <Wall x={ox+bW-wt}     y={oy}           w={wt}  h={bD}  />  {/* East */}

      {/* ── Interior walls */}
      {/* Main H divider (Living vs Bedrooms) */}
      <Wall x={ox+wt}        y={dhY}          w={bW-wt*2}  h={wt} color={BEIGE} opacity={0.55} />
      {/* V divider (Living vs Kitchen) */}
      <Wall x={dvX}          y={oy+wt}        w={wt}       h={dhY-oy-wt} color={BEIGE} opacity={0.55} />
      {/* Bathroom wall (south of living, west side) */}
      <Wall x={ox+wt}        y={dhY}          w={bW*0.26}  h={wt} color={BEIGE} opacity={0.55} />
      {/* Bedroom divider */}
      <Wall x={dvX}          y={dhY+wt}       w={wt}       h={bD*0.52-wt} color={BEIGE} opacity={0.55} />

      {/* ── Columns (structural) */}
      {[[ox, oy], [ox+bW, oy], [ox, oy+bD], [ox+bW, oy+bD],
        [dvX, oy], [dvX, oy+bD], [dvX, dhY]].map(([cx, cy], i) => (
        <Column key={i} cx={cx} cy={cy} size={10} />
      ))}

      {/* ── Doors */}
      <DoorArc x={ox + bW * 0.38} y={oy + bD - wt} size={26} rotate={-90} />  {/* Main entrance */}
      <DoorArc x={dvX} y={dhY + 4}  size={22} rotate={0} />
      <DoorArc x={ox + bW * 0.15} y={dhY} size={20} rotate={180} />

      {/* ── Windows */}
      <WindowSegment x={ox + bW * 0.12} y={oy} w={30} horizontal />   {/* North-Living */}
      <WindowSegment x={ox + bW * 0.65} y={oy} w={24} horizontal />   {/* North-Kitchen */}
      <WindowSegment x={ox + bW * 0.15} y={oy+bD-wt} w={36} horizontal />  {/* South-Living */}
      <WindowSegment x={ox + bW * 0.62} y={oy+bD-wt} w={28} horizontal />  {/* South-Bed2 */}
      <WindowSegment x={ox}             y={oy+bD*0.3} w={28} horizontal={false} />  {/* West */}
      <WindowSegment x={ox+bW-wt}       y={oy+bD*0.55} w={24} horizontal={false} /> {/* East */}

      {/* ── Furniture */}
      {/* Living room */}
      <FurnitureRect x={ox+bW*0.08} y={oy+bD*0.08} w={50} h={22} label="Sofa" />
      <FurnitureRect x={ox+bW*0.08} y={oy+bD*0.24} w={24} h={14} label="Table" />
      {/* TV */}
      <FurnitureRect x={ox+bW*0.1} y={oy+bD*0.38} w={40} h={6} label="TV" color="rgba(160,140,184,0.12)" stroke="rgba(160,140,184,0.4)" />
      {/* Kitchen */}
      <FurnitureRect x={dvX+wt+2} y={oy+wt+2} w={12} h={bD*0.38} label="" color="rgba(212,179,114,0.1)" stroke="rgba(212,179,114,0.35)" />
      <FurnitureRect x={dvX+wt+2} y={oy+wt+2} w={bW*0.22} h={12} label="Counter" color="rgba(212,179,114,0.1)" stroke="rgba(212,179,114,0.35)" />
      {/* Bathroom */}
      <FurnitureRect x={ox+bW*0.05} y={oy+bD*0.42+wt} w={18} h={12} label="WC" color="rgba(160,140,184,0.1)" stroke="rgba(160,140,184,0.3)" />

      {/* Dynamically placed beds */}
      {(() => {
        const bhk = config.bhk || 2;
        const floors = config.floors || 2;
        const bedroomsOnGround = [];
        for (let i = 1; i <= bhk; i++) {
          if ((i - 1) % floors === 0) bedroomsOnGround.push(i);
        }
        const slots2D = [
          { cx: bW * 0.23, cy: bD * 0.72 }, // back-left
          { cx: bW * 0.76, cy: bD * 0.72 }, // back-right
          { cx: bW * 0.23, cy: bD * 0.50 }, // mid-left
          { cx: bW * 0.76, cy: bD * 0.50 }, // mid-right
          { cx: bW * 0.50, cy: bD * 0.72 }, // back-mid
          { cx: bW * 0.50, cy: bD * 0.50 }, // mid-mid
          { cx: bW * 0.23, cy: bD * 0.35 }, 
          { cx: bW * 0.76, cy: bD * 0.35 }, 
          { cx: bW * 0.50, cy: bD * 0.35 }, 
          { cx: bW * 0.50, cy: bD * 0.60 }, 
        ];

        return (
          <>
            {bedroomsOnGround.map((bedNum, j) => {
              const slot = slots2D[j];
              if (!slot) return null;
              return (
                <FurnitureRect
                  key={`bed-furn-${bedNum}`}
                  x={ox + slot.cx - 16}
                  y={oy + slot.cy - 12}
                  w={32}
                  h={24}
                  label={bedNum === 1 ? "Master Bed" : `Bed ${bedNum}`}
                />
              );
            })}

            {/* Additional dynamically placed bedroom divider walls */}
            {bedroomsOnGround.length > 2 && (
              <Wall x={ox + bW * 0.45} y={dhY+wt} w={wt} h={bD*0.52-wt} color={BEIGE} opacity={0.55} />
            )}
            {bedroomsOnGround.length > 4 && (
              <Wall x={ox+wt} y={dhY + bD * 0.26} w={bW-wt*2} h={wt} color={BEIGE} opacity={0.55} />
            )}

            {/* ── Room labels */}
            <RoomLabel cx={ox + bW * 0.25} cy={oy + bD * 0.22} name="LIVING ROOM"  area={livingArea}  color="#1A3A5C" />
            <RoomLabel cx={dvX + bW * 0.12} cy={oy + bD * 0.18} name="KITCHEN"     area={kitchenArea} color="#1A3A5C" />
            <RoomLabel cx={ox + bW * 0.12} cy={dhY + wt * 3}     name="BATH"       area={bathArea}     color="#1A3A4C" />

            {/* Dynamically placed Bedroom labels */}
            {bedroomsOnGround.map((bedNum, j) => {
              const slot = slots2D[j];
              if (!slot) return null;
              const areaStr = `${Math.round(bW * 0.25 * bD * 0.22 / SCALE / SCALE)} sqft`;
              return (
                <RoomLabel
                  key={`bed-lbl-${bedNum}`}
                  cx={ox + slot.cx}
                  cy={oy + slot.cy + 10}
                  name={bedNum === 1 ? "MASTER BED" : `BEDROOM ${bedNum}`}
                  area={areaStr}
                  color="#2C1A5C"
                />
              );
            })}
          </>
        );
      })()}
        </>
      )}

      {/* Placed manual objects */}
      {config.placedObjects && config.placedObjects.map(obj => {
        const pW3d = (config.plotWidth || 40) * 0.28;
        const pD3d = (config.plotDepth || 60) * 0.28;
        const bW3d = pW3d * 0.65;
        const bD3d = pD3d * 0.65;
        
        const rx = obj.position[0] / bW3d;
        const rz = obj.position[2] / bD3d;
        
        const svgX = (ox + bW / 2) + rx * bW;
        const svgY = (oy + bD / 2) + rz * bD;

        if (obj.type === 'text') {
          return (
            <g key={obj.id}>
              <rect x={svgX - 25} y={svgY - 6} width={50} height={12} fill="white" stroke="#7c3aed" strokeWidth="0.5" rx="2" />
              <text x={svgX} y={svgY + 2.5} fontSize="6" fill="#111" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
                💬 {obj.customVal || 'Text'}
              </text>
            </g>
          );
        }
        if (obj.type === 'tag') {
          return (
            <g key={obj.id}>
              <rect x={svgX - 20} y={svgY - 6} width={40} height={12} fill="#7c3aed" rx="2" />
              <text x={svgX} y={svgY + 2.5} fontSize="6" fill="white" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🏷️ {obj.customVal || 'Tag'}
              </text>
            </g>
          );
        }
        if (obj.type === 'dim') {
          return (
            <g key={obj.id}>
              <rect x={svgX - 25} y={svgY - 6} width={50} height={12} fill="#0ea5e9" rx="2" />
              <text x={svgX} y={svgY + 2.5} fontSize="6.5" fill="white" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                ↔️ {obj.customVal || 'Dim'}
              </text>
            </g>
          );
        }

        if (obj.type === 'column' || obj.type === 'col') {
          return <Column key={obj.id} cx={svgX} cy={svgY} size={8} />;
        }
        if (obj.type === 'wall') {
          return <rect key={obj.id} x={svgX - 25} y={svgY - 3} width={50} height={6} fill={WALL_CLR} rx="0" />;
        }
        if (obj.type === 'door') {
          return <DoorArc key={obj.id} x={svgX - 8} y={svgY} size={16} rotate={0} />;
        }
        if (obj.type === 'window') {
          return <WindowSegment key={obj.id} x={svgX - 16} y={svgY - 3} w={32} horizontal />;
        }
        if (obj.type === 'beam' || obj.type === 'steel-beam') {
          return <line key={obj.id} x1={svgX - 25} y1={svgY} x2={svgX + 25} y2={svgY} stroke={DIM_CLR} strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />;
        }
        if (obj.type === 'slab' || obj.type === 'floor' || obj.type === 'ceiling') {
          return <rect key={obj.id} x={svgX - 24} y={svgY - 24} width={48} height={48} fill="none" stroke={BEIGE} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />;
        }
        if (obj.type === 'roof') {
          return <rect key={obj.id} x={svgX - 26} y={svgY - 26} width={52} height={52} fill="rgba(185, 28, 28, 0.05)" stroke="#b91c1c" strokeWidth="0.8" opacity="0.8" rx="2" />;
        }
        if (obj.type === 'stair') {
          return (
            <g key={obj.id} transform={`translate(${svgX - 12}, ${svgY - 16})`}>
              <rect x="0" y="0" width={24} height={32} fill="none" stroke={WALL_CLR} strokeWidth="0.8" />
              {[0, 6.4, 12.8, 19.2, 25.6].map(sy => (
                <line key={sy} x1="0" y1={sy} x2={24} y2={sy} stroke={WALL_CLR} strokeWidth="0.6" />
              ))}
            </g>
          );
        }
        if (obj.type === 'room') {
          return (
            <g key={obj.id}>
              <rect x={svgX - 35} y={svgY - 35} width={70} height={70} fill="rgba(5, 150, 105, 0.02)" stroke="#059669" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x={svgX} y={svgY + 2.5} fontSize="6" fill="#059669" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ROOM ZONE
              </text>
            </g>
          );
        }
        if (obj.type === 'bedroom') {
          return <FurnitureRect key={obj.id} x={svgX - 14} y={svgY - 10} w={28} h={20} label="Bed" />;
        }
        if (obj.type === 'living') {
          return <FurnitureRect key={obj.id} x={svgX - 18} y={svgY - 8} w={36} h={16} label="Sofa" />;
        }
        if (obj.type === 'kitchen') {
          return <FurnitureRect key={obj.id} x={svgX - 12} y={svgY - 12} w={24} h={24} label="Counter" color="rgba(212,179,114,0.1)" stroke="rgba(212,179,114,0.35)" />;
        }
        if (obj.type === 'bathroom') {
          return <FurnitureRect key={obj.id} x={svgX - 10} y={svgY - 10} w={20} h={20} label="WC" color="rgba(160,140,184,0.1)" stroke="rgba(160,140,184,0.3)" />;
        }
        if (obj.type === 'pool') {
          return <FurnitureRect key={obj.id} x={svgX - 30} y={svgY - 20} w={60} h={40} label="🏊 POOL" color="rgba(2, 132, 199, 0.08)" stroke="#0284c7" />;
        }

        // MEP elements
        if (obj.type === 'duct') {
          return <rect key={obj.id} x={svgX - 25} y={svgY - 4} width={50} height={8} fill="rgba(148, 163, 184, 0.15)" stroke="#94a3b8" strokeWidth="0.8" />;
        }
        if (obj.type === 'pipe') {
          return <line key={obj.id} x1={svgX - 25} y1={svgY} x2={svgX + 25} y2={svgY} stroke="#0ea5e9" strokeWidth="1.5" />;
        }
        if (obj.type === 'light') {
          return (
            <g key={obj.id} transform={`translate(${svgX}, ${svgY})`}>
              <circle cx="0" cy="0" r="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#f59e0b" strokeWidth="0.5" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#f59e0b" strokeWidth="0.5" />
            </g>
          );
        }

        // Default generic node
        return (
          <g key={obj.id} transform={`translate(${svgX}, ${svgY})`}>
            <circle cx="0" cy="0" r="7" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="0.8" />
            <text x="0" y="2" fontSize="5.5" fill="#8b5cf6" textAnchor="middle" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
              {obj.type.substring(0, 2).toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* ── Compass rose (top-right) */}
      <g transform={`translate(${padX + pW + 24}, ${padY + 16})`}>
        <circle cx="0" cy="0" r="14" fill="none" stroke={DIM_CLR} strokeWidth="0.8" opacity="0.5" />
        <text x="0" y="-16" fontSize="8" fill={ANN_CLR} textAnchor="middle" fontWeight="700">N</text>
        <polygon points="0,-12 3,2 0,0 -3,2" fill={WALL_CLR} opacity="0.9" />
        <polygon points="0,12 3,-2 0,0 -3,-2" fill={DIM_CLR} opacity="0.4" />
      </g>
    </g>
  );
}

/* ── Section View ──────────────────────────────────────── */
function SectionView({ config, padX, padY, viewW, viewH }) {
  const floors = config.floors || 2;
  const floorH = 32;
  const bW = ft(config.plotWidth || 40) * 0.82;
  const oy = padY + viewH - 40;
  const ox = padX + 20;

  return (
    <g>
      {/* Ground line */}
      <line x1={padX} y1={oy} x2={padX + viewW - 20} y2={oy} stroke="rgba(200,184,162,0.3)" strokeWidth="1" />

      {config.generatedByAI && (
        <>
          {/* Foundation */}
          <rect x={ox} y={oy} width={bW} height={16} fill="rgba(212,179,114,0.2)" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
          <text x={ox + bW/2} y={oy + 11} fontSize="7" fill={GOLD} textAnchor="middle" fontFamily="JetBrains Mono">FOUNDATION</text>

          {/* Floors */}
          {Array.from({ length: floors }).map((_, i) => {
            const fy = oy - (i + 1) * floorH;
            return (
              <g key={i}>
                <rect x={ox} y={fy} width={bW} height={floorH} fill="rgba(200,184,162,0.04)" stroke={BEIGE} strokeWidth="0.8" opacity="0.7" />
                <line x1={ox} y1={fy + floorH} x2={ox + bW} y2={fy + floorH} stroke={BEIGE} strokeWidth="1.2" opacity="0.6" />
                {/* Windows */}
                <rect x={ox + bW * 0.15} y={fy + 8} width={20} height={14} fill="rgba(160,140,184,0.2)" stroke="#A08CB8" strokeWidth="0.8" />
                <rect x={ox + bW * 0.55} y={fy + 8} width={20} height={14} fill="rgba(160,140,184,0.2)" stroke="#A08CB8" strokeWidth="0.8" />
                {/* Door (ground floor only) */}
                {i === 0 && <rect x={ox + bW * 0.42} y={fy + 12} width={14} height={floorH - 12} fill="rgba(200,184,162,0.1)" stroke={BEIGE} strokeWidth="0.8" />}
                {/* Floor label */}
                <text x={ox - 14} y={fy + floorH / 2 + 3} fontSize="7" fill={BEIGE} textAnchor="middle" opacity="0.6" fontFamily="JetBrains Mono">
                  {i === 0 ? 'GF' : `F${i}`}
                </text>
                {/* Height dim */}
                <text x={ox + bW + 10} y={fy + 18} fontSize="6.5" fill={BEIGE} opacity="0.55" fontFamily="JetBrains Mono">
                  {(i + 1) * 3.0}m
                </text>
              </g>
            );
          })}

          {/* Roof */}
          <polygon
            points={`${ox},${oy - floors * floorH} ${ox + bW/2},${oy - floors * floorH - 28} ${ox + bW},${oy - floors * floorH}`}
            fill="rgba(200,184,162,0.06)" stroke={BEIGE} strokeWidth="1" opacity="0.8"
          />

          {/* Hasl label */}
          <text x={ox + bW + 10} y={oy - floors * floorH - 14} fontSize="6.5" fill={BEIGE} opacity="0.55" fontFamily="JetBrains Mono">
            +{(floors * 3 + 2.8).toFixed(1)}m
          </text>
        </>
      )}
    </g>
  );
}

/* ── Main PlanView Component ──────────────────────────── */
const VIEWS = ['plan', 'section'];

export default function PlanView({ config, mode }) {
  const [activeView, setActiveView] = useState('plan');
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showDims, setShowDims] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);

  const PAD = 60;
  const pW = ft(config.plotWidth || 40);
  const pD = ft(config.plotDepth || 60);
  const COMPASS_W = 50;
  const viewW = pW + PAD * 2 + COMPASS_W;
  const viewH = pD + PAD * 2;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: (mode === 'manual' || mode === 'ai') ? '#FFFFFF' : '#0A0A0A', overflow: 'hidden' }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)', flexShrink: 0, flexWrap: 'wrap',
      }}>
        {/* View switch tabs */}
        <div style={{ display: 'flex', gap: 4, marginRight: 12 }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => setActiveView(v)} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              background: activeView === v ? 'var(--beige-dim)' : 'transparent',
              color: activeView === v ? 'var(--beige)' : 'var(--text-3)',
              border: `1px solid ${activeView === v ? 'var(--border-accent)' : 'transparent'}`,
              cursor: 'pointer', letterSpacing: '0.06em',
              transition: 'all 0.2s',
            }}>
              {v === 'plan' ? '📐 PLAN' : '✂️ SECTION'}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        {/* Toggles */}
        {[
          { label: 'Grid', state: showGrid, toggle: setShowGrid },
          { label: 'Dims', state: showDims, toggle: setShowDims },
          { label: 'Furniture', state: showFurniture, toggle: setShowFurniture },
        ].map(t => (
          <button key={t.label} onClick={() => t.toggle(s => !s)} style={{
            padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer',
            background: t.state ? 'var(--beige-dim)' : 'transparent',
            color: t.state ? 'var(--beige)' : 'var(--text-4)',
            border: `1px solid ${t.state ? 'var(--border-accent)' : 'var(--border)'}`,
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14 }}>−</button>
          <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2.5, z + 0.1))} style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14 }}>+</button>
          <button onClick={() => setZoom(1)} style={{ padding: '0 8px', height: 24, borderRadius: 4, background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-3)', cursor: 'pointer', fontSize: 9 }}>FIT</button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--text-4)' }}>SCALE 1:100 | mm | ISO 19650</span>
          <span className="badge badge-beige" style={{ fontSize: 8 }}>
            {(config.plotWidth || 40)} × {(config.plotDepth || 60)} ft plot
          </span>
        </div>
      </div>

      {/* ── SVG Canvas ── */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (mode === 'manual' || mode === 'ai') ? '#FFFFFF' : '#0A0A0A' }}>
        <svg
          width={viewW * zoom}
          height={viewH * zoom}
          viewBox={`0 0 ${viewW} ${viewH}`}
          style={{ display: 'block' }}
        >
          <defs>
            {/* Arrow markers for dim lines */}
            <marker id="arrow-start" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto-start-reverse">
              <polygon points="0,0 5,2.5 0,5" fill={BEIGE} opacity="0.6" />
            </marker>
            <marker id="arrow-end" markerWidth="5" markerHeight="5" refX="0" refY="2.5" orient="auto">
              <polygon points="0,0 5,2.5 0,5" fill={BEIGE} opacity="0.6" />
            </marker>
            {/* Hatch pattern */}
            <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(200,184,162,0.12)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background — white paper */}
          <rect x="0" y="0" width={viewW} height={viewH} fill={PAPER} />

          {/* Subtle title border shadow */}
          <rect x="2" y="2" width={viewW - 4} height={viewH - 4} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />

          {/* Grid */}
          {showGrid && (
            <g opacity="0.7">
              {Array.from({ length: Math.ceil(viewW / 10) + 1 }).map((_, i) => (
                <line key={`vg${i}`} x1={i * 10} y1={0} x2={i * 10} y2={viewH} stroke={GRID_CLR} strokeWidth="0.3" />
              ))}
              {Array.from({ length: Math.ceil(viewH / 10) + 1 }).map((_, i) => (
                <line key={`hg${i}`} x1={0} y1={i * 10} x2={viewW} y2={i * 10} stroke={GRID_CLR} strokeWidth="0.3" />
              ))}
              {Array.from({ length: Math.ceil(viewW / 50) + 1 }).map((_, i) => (
                <line key={`vmg${i}`} x1={i * 50} y1={0} x2={i * 50} y2={viewH} stroke="rgba(0,0,0,0.10)" strokeWidth="0.5" />
              ))}
              {Array.from({ length: Math.ceil(viewH / 50) + 1 }).map((_, i) => (
                <line key={`hmg${i}`} x1={0} y1={i * 50} x2={viewW} y2={i * 50} stroke="rgba(0,0,0,0.10)" strokeWidth="0.5" />
              ))}
            </g>
          )}

          {/* Main plan or section */}
          {activeView === 'plan' && (
            <VillaFloorPlan config={config} padX={PAD} padY={PAD} />
          )}
          {activeView === 'section' && (
            <SectionView config={config} padX={PAD} padY={PAD} viewW={viewW - PAD} viewH={viewH - PAD * 0.5} />
          )}

          {/* Dimension lines */}
          {showDims && activeView === 'plan' && (() => {
            const ox = PAD + (pW - pW * 0.82) / 2;
            const oy = PAD + (pD - pD * 0.80) / 2;
            const bW = pW * 0.82, bD = pD * 0.80;
            return (
              <g>
                {config.generatedByAI && (
                  <>
                    <DimLine x1={ox} y1={PAD - 10} x2={ox + bW} y2={PAD - 10} label={`${config.plotWidth * 0.82} ft`} />
                    <DimLine x1={PAD - 10} y1={oy} x2={PAD - 10} y2={oy + bD} label={`${config.plotDepth * 0.80} ft`} vertical />
                  </>
                )}
                <DimLine x1={PAD} y1={PAD - 28} x2={PAD + pW} y2={PAD - 28} label={`${config.plotWidth} ft plot`} />
              </g>
            );
          })()}

          {/* Title block */}
          <g transform={`translate(${viewW - COMPASS_W - 10}, ${viewH - 80})`}>
            <rect x="0" y="0" width={COMPASS_W + 10} height="78" fill={PAPER} stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" rx="0" />
            <text x="5" y="13" fontSize="7.5" fill={WALL_CLR} fontWeight="700" fontFamily="JetBrains Mono">AI CivilOS</text>
            <line x1="0" y1="17" x2={COMPASS_W + 10} y2="17" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            {[
              [`Type: ${(config.buildingType || 'villa').toUpperCase()}`, 26],
              [`Floors: ${config.floors || 2}`, 36],
              [`BHK: ${config.bhk || 3}`, 46],
              [`Style: ${(config.architecturalStyle || 'modern').toUpperCase()}`, 56],
              ['Scale: 1:100', 66],
            ].map(([t, y]) => (
              <text key={t} x="5" y={y} fontSize="6" fill={ANN_CLR} fontFamily="JetBrains Mono">{t}</text>
            ))}
          </g>

          {/* Scale bar */}
          <g transform={`translate(${PAD}, ${viewH - 22})`}>
            {[0, 1, 2, 3, 4].map(i => (
              <rect key={i} x={i * 20} y="0" width="20" height="6"
                fill={i % 2 === 0 ? WALL_CLR : PAPER}
                stroke={WALL_CLR} strokeWidth="0.5" opacity="0.85"
              />
            ))}
            <text x="0"  y="15" fontSize="6" fill={ANN_CLR} textAnchor="middle" fontFamily="JetBrains Mono">0</text>
            <text x="40" y="15" fontSize="6" fill={ANN_CLR} textAnchor="middle" fontFamily="JetBrains Mono">20 ft</text>
            <text x="80" y="15" fontSize="6" fill={ANN_CLR} textAnchor="middle" fontFamily="JetBrains Mono">40 ft</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
