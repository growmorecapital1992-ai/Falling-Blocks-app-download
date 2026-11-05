/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('falling_blocks_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    } catch {
      // LocalStorage fallback
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem('falling_blocks_muted', String(this.muted));
    } catch {}
    if (!this.muted) {
      this.playTone(660, 0.08, 'square', 0.1);
    }
    return this.muted;
  }

  public playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    volume: number = 0.12,
    pitchEnd?: number
  ) {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      if (pitchEnd !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, pitchEnd), now + duration);
      }

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio failures
    }
  }

  public playMove() {
    this.playTone(360, 0.03, 'square', 0.06, 280);
  }

  public playRotate() {
    this.playTone(480, 0.05, 'square', 0.08, 640);
  }

  public playSoftDrop() {
    this.playTone(240, 0.02, 'square', 0.04);
  }

  public playDrop() {
    this.playTone(190, 0.06, 'triangle', 0.16, 70);
  }

  public playHardDrop() {
    this.playTone(180, 0.09, 'triangle', 0.25, 45);
  }

  public playHold() {
    this.playTone(520, 0.06, 'square', 0.08, 700);
  }

  public playLineClear(lines: number) {
    if (this.muted) return;
    if (lines >= 4) {
      this.playTetris();
      return;
    }
    // Multi-note arpeggio based on lines
    const notes = lines === 1 
      ? [523, 659] 
      : lines === 2 
        ? [523, 659, 784] 
        : [440, 554, 659, 880];
    
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.09, 'square', 0.12);
      }, idx * 60);
    });
  }

  public playTetris() {
    if (this.muted) return;
    // Triumphant 8-bit fanfare
    const fanfare = [
      { f: 523, d: 0.08 },
      { f: 659, d: 0.08 },
      { f: 784, d: 0.08 },
      { f: 1046, d: 0.25 },
    ];
    fanfare.forEach((n, idx) => {
      setTimeout(() => {
        this.playTone(n.f, n.d, 'square', 0.16);
      }, idx * 75);
    });
  }

  public playLevelUp() {
    if (this.muted) return;
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.07, 'square', 0.14);
      }, idx * 65);
    });
  }

  public playGameOver() {
    if (this.muted) return;
    const notes = [330, 311, 293, 277, 200];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.14, 'sawtooth', 0.15, freq * 0.8);
      }, idx * 110);
    });
  }

  public playButton() {
    this.playTone(580, 0.04, 'square', 0.06);
  }
}

export const sound = new SoundEngine();
