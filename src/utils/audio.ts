/**
 * Sound and Speech utilities for MemoryCare
 * Provides soothing audio prompts and Web Audio API synthesized gentle chimes
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Play a gentle soothing chime (C5 -> E5 -> G5)
   */
  playGentleChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  /**
   * Play a warm celebration sound
   */
  playCelebrationSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Gentle warm arpeggio: C4, G4, C5, E5, G5
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 1.25);
      });
    } catch {}
  }

  /**
   * Play soft tap confirmation
   */
  playSoftTap() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  /**
   * Play bird chirp sound (Web Audio API)
   */
  playBirdChirp() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [0, 0.12, 0.26].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, now + delay);
        osc.frequency.exponentialRampToValueAtTime(3200, now + delay + 0.05);
        osc.frequency.exponentialRampToValueAtTime(2000, now + delay + 0.09);

        gain.gain.setValueAtTime(0.09, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.11);
      });
    } catch {}
  }

  /**
   * Play gentle tea kettle whistle
   */
  playKettleWhistle() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.linearRampToValueAtTime(1450, now + 0.6);
      osc.frequency.linearRampToValueAtTime(1400, now + 1.2);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.35);
    } catch {}
  }

  /**
   * Play gentle raindrops
   */
  playRaindrops() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const drops = [0, 0.08, 0.16, 0.28, 0.4, 0.55];
      drops.forEach((d) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const freq = 600 + Math.random() * 400;
        osc.frequency.setValueAtTime(freq, now + d);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + d + 0.04);

        gain.gain.setValueAtTime(0.06, now + d);
        gain.gain.exponentialRampToValueAtTime(0.001, now + d + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + d);
        osc.stop(now + d + 0.06);
      });
    } catch {}
  }

  /**
   * Play gentle grandfather clock chime (Bong)
   */
  playClockChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, now); // E4

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.85);
    } catch {}
  }

  /**
   * Speak text using Web Speech Synthesis with English or Tamil voice
   */
  speakText(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
      rate?: number;
      lang?: 'en' | 'ta';
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onError?.();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Calm, patient, elder-friendly pacing
    utterance.rate = options?.rate ?? (options?.lang === 'ta' ? 0.82 : 0.86);
    utterance.pitch = 1.0;

    const targetLang = options?.lang || 'en';
    const voices = window.speechSynthesis.getVoices();

    if (targetLang === 'ta') {
      utterance.lang = 'ta-IN';
      const tamilVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ta') ||
          v.name.toLowerCase().includes('tamil') ||
          v.name.toLowerCase().includes('latha') ||
          v.name.toLowerCase().includes('valluvar')
      );
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
    } else {
      utterance.lang = 'en-US';
      const naturalVoice =
        voices.find(
          (v) =>
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Karen')) &&
            v.lang.startsWith('en')
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }
    }

    utterance.onstart = () => {
      this.currentUtterance = utterance;
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      options?.onError?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop speech synthesis
   */
  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const soundService = new AudioManager();
