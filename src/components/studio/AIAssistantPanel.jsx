import React, { useState, useRef, useEffect } from 'react';

const QUICK_PROMPTS = [
  'Add one more floor',
  'Add swimming pool',
  'Show structural view',
  'Show MEP overlay',
  'Make Vastu compliant',
  'Show sunlight study',
  'Add solar panels',
  'Enter building walkthrough',
  'Generate BOQ report',
  'Estimate materials',
  'Suggest beam sizes',
  'Optimize ventilation',
  'Reduce cost by 15%',
];

const AI_RESPONSES = {
  'add one more floor': '✅ Floor added! The structure now has an additional level. Checking load-bearing capacity... Beam depth suggested: 500mm for G+3.',
  'add swimming pool': '✅ Swimming pool added to the backyard. Pool dimensions: 10×5m. Waterproofing layer auto-added.',
  'show structural view': '✅ Switched to Structural view. Showing columns, beams, and foundation layout.',
  'show mep overlay': '✅ MEP overlay enabled. HVAC, electrical, and plumbing systems are now visible.',
  'make vastu compliant': '✅ Vastu analysis complete. Main entrance facing East — optimal. Kitchen moved to Southeast. Puja room placed NE.',
  'show sunlight study': '✅ Sun Study mode activated. Adjust the time slider to simulate sunlight at different hours.',
  'add solar panels': '✅ Solar panels added to rooftop. Estimated generation: 8 kWp. Annual savings: ~₹45,000.',
  'generate boq report': '📋 BOQ Generated! Found 284 line items. Total estimate: ₹78.4 Lakhs. Downloading report...',
  'estimate materials': '📦 Material Takeoff: Cement: 420 bags | Steel: 4.2 MT | Bricks: 28,000 units | Aggregate: 85m³',
  'suggest beam sizes': '🏗️ AI Recommendation: Main beam L-beam 250×450mm, Secondary beams 200×350mm. All within IS 456 limits.',
  'optimize ventilation': '💨 Cross-ventilation optimized! Added NE windows. Air flow improved by 34%. Cooling load reduced by 18%.',
  'reduce cost by 15%': '💰 Cost optimization: Switch outer walls to AAC blocks (-8%), Use M20 grade for non-load areas (-5%), Optimize tile layout (-2%). Savings: ₹11.7L',
};

function getAIResponse(input) {
  const key = Object.keys(AI_RESPONSES).find(k => input.toLowerCase().includes(k));
  return key
    ? AI_RESPONSES[key]
    : `🤖 Processing: "${input}"... \n\nBased on site analysis and current BIM model, I recommend reviewing structural loads before making this change. Shall I proceed with auto-calculation?`;
}

const STAGES_DETAILS = {
  1: {
    title: "Project Initialization",
    instructions: "Initialize your design parameters. Check the building type, floor count, and style in the Project Settings panel (Right Sidebar).",
    why: "Establishing core building constraints allows the structural engine to prepare the correct foundation grids and material calculations.",
    verify: (placed, config) => true,
    countText: () => "Setup Complete ✓"
  },
  2: {
    title: "Site & Grid Setup",
    instructions: "Configure the plot size and facing direction in the Project Settings panel.",
    why: "Proper site boundary setup ensures the foundation conforms to local setback rules and defines spatial limits.",
    verify: (placed, config) => true,
    countText: () => "Verification complete ✓"
  },
  3: {
    title: "Foundation Construction",
    instructions: "Select the 'Structure' tab (🏗️), choose Footing Foundation (⬓), and place at least 4 foundation pads on your site grid.",
    why: "Foundations distribute structural weight safely to the load-bearing strata of the soil, preventing differential settlement.",
    verify: (placed) => placed.filter(o => ['foundation', 'footing', 'pile', 'raft'].includes(o.type)).length >= 4,
    countText: (placed) => `Placed: ${placed.filter(o => ['foundation', 'footing', 'pile', 'raft'].includes(o.type)).length} / 4`
  },
  4: {
    title: "Column Placement",
    instructions: "Select Concrete Column (🟫) in the Structure tab. Place at least 4 columns at grid intersection points.",
    why: "Columns act as structural backbones, carrying axial compression loads from floor slabs down to the foundation footings.",
    verify: (placed) => placed.filter(o => ['column', 'col'].includes(o.type)).length >= 4,
    countText: (placed) => `Placed: ${placed.filter(o => ['column', 'col'].includes(o.type)).length} / 4`
  },
  5: {
    title: "Beam Connections",
    instructions: "Select Concrete Beam (┬) or Steel I-Beam (工) in the Structure tab. Place at least 4 beams spanning between columns.",
    why: "Beams resist bending moments and shear stresses, linking columns together to form a rigid structural frame.",
    verify: (placed) => placed.filter(o => ['beam', 'steel-beam', 'truss'].includes(o.type)).length >= 4,
    countText: (placed) => `Placed: ${placed.filter(o => ['beam', 'steel-beam', 'truss'].includes(o.type)).length} / 4`
  },
  6: {
    title: "Slab Construction",
    instructions: "Select Slab (▭) in the Structure tab. Place at least 1 slab element to establish your floor platform.",
    why: "Slabs serve as horizontal floor platforms that carry active live loads (residents, furniture) and transfer them to the beams.",
    verify: (placed) => placed.filter(o => ['slab', 'floor', 'ceiling'].includes(o.type)).length >= 1,
    countText: (placed) => `Placed: ${placed.filter(o => ['slab', 'floor', 'ceiling'].includes(o.type)).length} / 1`
  },
  7: {
    title: "Wall Framing",
    instructions: "Select Wall (▬) in the Architecture tab. Draw at least 4 wall segments to map out room enclosures.",
    why: "Walls divide internal living spaces and provide envelope protection, insulation, and acoustic privacy.",
    verify: (placed) => placed.filter(o => o.type === 'wall').length >= 4,
    countText: (placed) => `Placed: ${placed.filter(o => o.type === 'wall').length} / 4`
  },
  8: {
    title: "Doors & Windows",
    instructions: "Install openings in your walls: place at least 1 Door (🚪) and 2 Windows (🪟) from the Architecture tab.",
    why: "Doors facilitate circulation access, while windows satisfy mandatory daylight factors and support air exchange.",
    verify: (placed) => {
      const d = placed.filter(o => o.type === 'door').length;
      const w = placed.filter(o => o.type === 'window').length;
      return d >= 1 && w >= 2;
    },
    countText: (placed) => {
      const d = placed.filter(o => o.type === 'door').length;
      const w = placed.filter(o => o.type === 'window').length;
      return `Doors: ${d}/1, Windows: ${w}/2`;
    }
  },
  9: {
    title: "Staircase & Vertical Circulation",
    instructions: "Place a Staircase (🪜) or Elevator Lift (🛗) from the Architecture tab to support levels access.",
    why: "Standard stairs require riser limits (max 150mm) and treads (min 250mm) to ensure safe, comfortable level changes.",
    verify: (placed) => placed.filter(o => ['stair', 'lift'].includes(o.type)).length >= 1,
    countText: (placed) => `Placed: ${placed.filter(o => ['stair', 'lift'].includes(o.type)).length} / 1`
  },
  10: {
    title: "Roof Installation",
    instructions: "Select Roof (🏠) from the Architecture tab and place at least 1 roof component to enclose the top level.",
    why: "Roofs shelter the structure, keeping out rainfall and directing stormwater drainage away from the building core.",
    verify: (placed) => placed.filter(o => o.type === 'roof').length >= 1,
    countText: (placed) => `Placed: ${placed.filter(o => o.type === 'roof').length} / 1`
  },
  11: {
    title: "MEP Systems Integration",
    instructions: "Select MEP tab (⚙️). Place at least 3 nodes (Ducts ▫️, Plumbing pipes 🔵, or Lighting fixtures 💡).",
    why: "Mechanical, electrical, and plumbing layers build active life support infrastructure for water, power, and climate.",
    verify: (placed) => placed.filter(o => ['duct', 'pipe', 'light', 'valve', 'sprinkler', 'hvac'].includes(o.type)).length >= 3,
    countText: (placed) => `Placed: ${placed.filter(o => ['duct', 'pipe', 'light', 'valve', 'sprinkler', 'hvac'].includes(o.type)).length} / 3`
  },
  12: {
    title: "Interior & Furnishing",
    instructions: "Select Furniture tab (🛋️). Place at least 3 elements (beds 🛏️, sofas 🛋️, kitchen counters 🍳, or toilets 🚰).",
    why: "Interior furnishing defines room functionality, zoning boundaries, and maintains comfortable clearance paths.",
    verify: (placed) => placed.filter(o => ['bedroom', 'living', 'kitchen', 'bathroom', 'pool'].includes(o.type)).length >= 3,
    countText: (placed) => `Placed: ${placed.filter(o => ['bedroom', 'living', 'kitchen', 'bathroom', 'pool'].includes(o.type)).length} / 3`
  },
  13: {
    title: "Final BIM Audit Report",
    instructions: "Ask the AI assistant to 'run final validation check' to compile code compliance and Vastu report.",
    why: "A professional validation audit cross-checks local building setbacks, structural frame connectivity, and material costings.",
    verify: () => true,
    countText: () => "Verification complete ✓"
  }
};

export default function AIAssistantPanel({ config, onCommand, isWalkthrough, currentStage, setCurrentStage, maxStage, setMaxStage, mode }) {
  const [messages, setMessages] = useState(() => {
    if (mode === 'manual') {
      return [
        {
          role: 'ai',
          text: `👷 **Welcome to AI-Guided Manual BIM Construction!**\n\nI will act as your virtual Civil Engineer and Vastu consultant to guide you step-by-step from the first foundation footing to the final MEP systems.\n\nTo begin, what type of building would you like to construct? Please select a type in the **Project Settings** panel on the right (or ask me for recommendations here):\n• 🏡 **Residential Villa/House** (Best for Vastu rules & spatial comfort)\n• 🏢 **Apartment Complex** (Multistory structural frame validation)\n• 🏥 **Hospital / Clinic** (Wide corridors and sanitary plumbing layouts)\n• 🏭 **Industrial Factory / Warehouse** (High steel trusses & MEP ducts)\n\nOnce you have selected a building type and site dimensions, click **Verify & Proceed** above to start the Site Setup!`,
        }
      ];
    }
    return [
      {
        role: 'ai',
        text: `👋 Hello! I'm your **BuildMind AI Assistant**.\n\nI can help you:\n• Modify the building design\n• Analyze structural integrity\n• Estimate costs & materials\n• Generate reports & drawings\n• Make Vastu recommendations\n\nWhat would you like to do?`,
      },
    ];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setTyping(true);
    onCommand?.(text);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: updatedMessages,
          config: config,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error status');
      }

      const data = await response.json();
      setTyping(false);
      setMessages(m => [...m, { role: 'ai', text: data.text }]);
    } catch (err) {
      console.error('Failed to query AI assistant backend:', err);
      setTyping(false);
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Connection lost. Running in offline backup mode.\n\n' + getAIResponse(text) }]);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div style={{
      width: 'var(--right-w)',
      minWidth: 'var(--right-w)',
      background: 'var(--bg-panel)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
      borderTop: '1px solid var(--border)',
      flex: collapsed ? 'none' : 1,
      maxHeight: collapsed ? 36 : undefined,
      transition: 'max-height 0.3s ease',
    }}>
      {/* Header */}
      <div
        style={{
          padding: '8px 10px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', flexShrink: 0,
          background: 'rgba(139,92,246,0.06)',
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14 }}>🤖</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.05em' }}>
            AI COPILOT
          </span>
          {typing && (
            <div style={{ display: 'flex', gap: 3 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 4, height: 4, borderRadius: '50%', background: '#8b5cf6',
                  animation: `typing-dot 1.4s ease-in-out ${i * 0.16}s infinite`,
                }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="badge badge-purple" style={{ fontSize: 8.5 }}>GPT-4o</span>
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{collapsed ? '▲' : '▼'}</span>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Construction Guide Card */}
          {mode === 'manual' && STAGES_DETAILS[currentStage] && (() => {
            const currentDetails = STAGES_DETAILS[currentStage];
            const placed = config?.placedObjects || [];
            const canProceed = currentDetails.verify(placed, config);
            
            const handleProceed = () => {
              if (currentStage === 13) {
                sendMessage("check my design for mistakes");
                alert("🎉 Congratulations! Your manually designed BIM Model has been successfully finalized. I am starting the final structural, building code, and Vastu compliance audit in the chat Copilot panel below!");
                return;
              }
              if (canProceed && currentStage < 13) {
                const next = currentStage + 1;
                setCurrentStage(next);
                if (next > maxStage) {
                  setMaxStage(next);
                }
              }
            };

            return (
              <div style={{
                margin: '10px 10px 2px', padding: 12,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.06))',
                border: '1.5px solid var(--border-purple)', borderRadius: 12,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--beige)', letterSpacing: '0.05em' }}>
                    👷 CIVIL ENGINEER GUIDANCE
                  </span>
                  <span className="badge badge-purple" style={{ fontSize: 8.5 }}>
                    STAGE {currentStage} / 13
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)' }}>
                  {currentDetails.title}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-2)', lineHeight: 1.4 }}>
                  👉 {currentDetails.instructions}
                </div>
                
                <div style={{
                  background: 'rgba(255,255,255,0.03)', padding: '5px 8px',
                  borderRadius: 6, border: '1px solid var(--border)',
                  fontSize: 9, color: 'var(--text-3)', fontStyle: 'italic', lineHeight: 1.3
                }}>
                  💡 <strong>Why:</strong> {currentDetails.why}
                </div>
                
                {currentDetails.countText && (
                  <div style={{
                    fontSize: 9.5, fontWeight: 600,
                    color: canProceed ? 'var(--green)' : 'var(--red)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginTop: 2
                  }}>
                    <span>STATUS: {canProceed ? 'Requirement Met ✓' : 'Incomplete ✗'}</span>
                    <span style={{ fontFamily: 'monospace' }}>({currentDetails.countText(placed)})</span>
                  </div>
                )}

                <button
                  onClick={handleProceed}
                  disabled={currentStage < 13 ? !canProceed : false}
                  style={{
                    marginTop: 4, width: '100%', padding: '6px 10px',
                    background: (currentStage === 13 || canProceed) ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'var(--bg-hover)',
                    color: (currentStage === 13 || canProceed) ? '#000' : 'var(--text-4)',
                    border: 'none', borderRadius: 6, fontSize: 9.5, fontWeight: 700,
                    cursor: (currentStage === 13 || canProceed) ? 'pointer' : 'default', transition: 'all 0.2s',
                    boxShadow: (currentStage === 13 || canProceed) ? '0 4px 10px rgba(139,92,246,0.2)' : 'none'
                  }}
                >
                  {currentStage === 13 ? 'BIM Model Finalized ✓' : 'Verify & Proceed to Next Stage →'}
                </button>
              </div>
            );
          })()}

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }} className="no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'msg-user' : 'msg-ai'}>
                {msg.role === 'ai' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                    <span style={{ fontSize: 12 }}>🤖</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.05em' }}>BUILD AI</span>
                  </div>
                )}
                <div style={{
                  fontSize: 12, color: msg.role === 'user' ? 'var(--text-1)' : 'var(--text-2)',
                  lineHeight: 1.6, whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="msg-ai">
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>🤖</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8b5cf6' }}>BUILD AI</span>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6',
                      animation: `typing-dot 1.4s ease-in-out ${i * 0.16}s infinite`,
                    }} />
                  ))}
                  <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 4 }}>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div style={{
            padding: '6px 10px',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: 5, overflowX: 'auto', flexShrink: 0,
          }} className="no-scrollbar">
            {QUICK_PROMPTS.slice(0, 6).map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                style={{
                  padding: '3px 8px', borderRadius: 999,
                  background: 'var(--purple-dim)', border: '1px solid var(--border-purple)',
                  color: '#8b5cf6', fontSize: 9.5, fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.18s ease',
                  fontFamily: 'inherit',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '8px 10px',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: 6, alignItems: 'flex-end',
            background: 'var(--bg-base)', flexShrink: 0,
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask AI anything about your building..."
              rows={2}
              style={{
                flex: 1, fontSize: 11, padding: '7px 10px', resize: 'none',
                borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-elevated)', color: 'var(--text-1)',
                fontFamily: 'inherit', lineHeight: 1.5, outline: 'none',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: input.trim() ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'var(--bg-elevated)',
                border: '1px solid var(--border)', cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, transition: 'all 0.2s',
              }}
            >
              ↑
            </button>
          </div>
        </>
      )}
    </div>
  );
}
