import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ModeChooser from './components/ModeChooser';
import AIWizard from './components/wizard/AIWizard';
import RevitStudio from './components/studio/RevitStudio';

const defaultConfig = {
  buildingType: 'villa',
  plotWidth: 40,
  plotDepth: 60,
  plotFacing: 'north',
  floors: 2,
  bhk: 3,
  bedrooms: 3,
  bathrooms: 2,
  budgetLevel: 'premium',
  architecturalStyle: 'modern',
  materials: ['concrete', 'brick'],
  climate: 'hot',
  hasPool: false,
  hasSolar: true,
  hasLift: false,
  hasGarden: true,
  hasParking: true,
  hasGym: false,
  hasHomeTheater: false,
  hasBalcony: true,
  hasTerrace: true,
  hasPrayerRoom: false,
  soilType: 'medium',
  generatedByAI: false,
};

export default function App() {
  // Phases: 'welcome' | 'choose' | 'ai-wizard' | 'studio'
  const [phase, setPhase]     = useState('welcome');
  const [mode, setMode]       = useState(null);
  const [config, setConfig]   = useState(defaultConfig);

  /* Welcome → "Start Now" → show mode chooser overlay */
  const handleWelcomeSelect = (sel) => {
    if (sel === 'choose') {
      setPhase('choose');   // show ModeChooser overlay over welcome screen
    } else {
      handleModeSelect(sel);
    }
  };

  /* Mode chooser selects Manual or AI */
  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'ai') {
      setPhase('ai-wizard');
    } else {
      setPhase('studio');
    }
  };

  /* AI Wizard complete */
  const handleWizardComplete = (generatedConfig) => {
    setConfig({ ...defaultConfig, ...generatedConfig, generatedByAI: true });
    setMode('ai');
    setPhase('studio');
  };

  /* Exit studio → back to welcome */
  const handleExitStudio = () => {
    setPhase('welcome');
    setMode(null);
  };

  return (
    <>
      {/* Welcome is always mounted when in welcome/choose phase */}
      {(phase === 'welcome' || phase === 'choose') && (
        <WelcomeScreen onSelect={handleWelcomeSelect} />
      )}

      {/* Mode chooser overlay on top of welcome */}
      {phase === 'choose' && (
        <ModeChooser onSelect={handleModeSelect} />
      )}

      {phase === 'ai-wizard' && (
        <AIWizard
          onComplete={handleWizardComplete}
          onBack={() => setPhase('welcome')}
        />
      )}

      {phase === 'studio' && (
        <RevitStudio
          config={config}
          setConfig={setConfig}
          mode={mode}
          onExit={handleExitStudio}
        />
      )}
    </>
  );
}
