import { useState, useEffect } from 'react';

interface Settings {
  soundOn: boolean;
  celebrationOn: boolean;
}

const defaultSettings: Settings = {
  soundOn: true,
  celebrationOn: true,
};

// Global state to avoid prop drilling in simple app
let globalSettings: Settings = { ...defaultSettings };
const listeners = new Set<(s: Settings) => void>();

try {
  const saved = localStorage.getItem('math_hero_settings');
  if (saved) {
    globalSettings = JSON.parse(saved);
  }
} catch (e) {
  console.error('Could not load settings', e);
}

function updateGlobalSettings(newSettings: Settings) {
  globalSettings = newSettings;
  try {
    localStorage.setItem('math_hero_settings', JSON.stringify(globalSettings));
  } catch (e) {
    console.error('Could not save settings', e);
  }
  listeners.forEach(l => l(globalSettings));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(globalSettings);

  useEffect(() => {
    listeners.add(setSettings);
    return () => {
      listeners.delete(setSettings);
    };
  }, []);

  const toggleSound = () => updateGlobalSettings({ ...globalSettings, soundOn: !globalSettings.soundOn });
  const toggleCelebration = () => updateGlobalSettings({ ...globalSettings, celebrationOn: !globalSettings.celebrationOn });

  return { settings, toggleSound, toggleCelebration };
}
