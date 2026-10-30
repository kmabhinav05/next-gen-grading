/**
 * Web Audio API synthesize for liquid wave button hold and feedback
 */
export const playHapticChime = () => {
  try {
    if (localStorage.getItem('pref_sound') === 'false') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {}
};
