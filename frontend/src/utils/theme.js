// Theme and Dark/Light Mode Management Utility

export const getStoredTheme = () => {
  return localStorage.getItem('pref_theme') || 'cream';
};

export const getStoredMode = () => {
  return localStorage.getItem('pref_mode') || 'light';
};

export const applyColorMode = (mode) => {
  const targetMode = mode === 'dark' ? 'dark' : 'light';
  localStorage.setItem('pref_mode', targetMode);

  if (targetMode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Reactive events for real-time synchronization across components
  window.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode: targetMode } }));
  window.dispatchEvent(new Event('theme-changed'));
  return targetMode;
};

export const toggleColorMode = () => {
  const current = getStoredMode();
  const next = current === 'dark' ? 'light' : 'dark';
  return applyColorMode(next);
};
