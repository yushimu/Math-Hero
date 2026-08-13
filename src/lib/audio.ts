class AudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  playCorrect() {
    this.playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
  }

  playLevelUp() {
    this.playTone(440, 'triangle', 0.1, 0.1); // A4
    setTimeout(() => this.playTone(554.37, 'triangle', 0.1, 0.1), 150); // C#5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.3, 0.1), 300); // E5
  }

  playAchievement() {
    this.playTone(587.33, 'square', 0.1, 0.05); // D5
    setTimeout(() => this.playTone(739.99, 'square', 0.1, 0.05), 100); // F#5
    setTimeout(() => this.playTone(880, 'square', 0.3, 0.05), 200); // A5
  }
}

export const audioEngine = new AudioEngine();
