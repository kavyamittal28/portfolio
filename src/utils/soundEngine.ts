type OscillatorShape = OscillatorType;

class SoundEngine {
  private static instance: SoundEngine;
  private ctx: AudioContext | null = null;
  private _enabled = true;
  private _userGestureReceived = false;

  private constructor() {
    // Listen for the first user gesture to unlock audio
    const unlock = () => {
      this._userGestureReceived = true;
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    document.addEventListener('touchstart', unlock);
  }

  static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  private getContext(): AudioContext | null {
    if (!this._userGestureReceived) return null;

    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTone(
    freq: number,
    duration: number,
    vol: number,
    type: OscillatorShape = 'sine',
  ): void {
    if (!this._enabled) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  hover(): void {
    this.playTone(1200, 0.04, 0.03, 'sine');
  }

  click(): void {
    this.playTone(800, 0.06, 0.06, 'square');
  }

  keypress(): void {
    const freq = 900 + Math.random() * 300;
    this.playTone(freq, 0.025, 0.04, 'square');
  }

  enter(): void {
    this.playTone(400, 0.1, 0.08, 'triangle');
  }

  success(): void {
    if (!this._enabled) return;

    const frequencies = [523, 659, 784];
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 0.06, 'sine');
      }, i * 120);
    });
  }

  boot(index: number): void {
    this.playTone(200 + index * 80, 0.08, 0.05, 'square');
  }

  error(): void {
    this.playTone(200, 0.15, 0.06, 'sawtooth');
  }
}

export const soundEngine = SoundEngine.getInstance();
