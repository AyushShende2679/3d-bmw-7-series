/**
 * Web Audio API BMW TwinPower Turbo V8 Sound Engine
 * Synthesizes engine ignition, idle rumble, dynamic throttle revs, BMW startup chime, and UI haptics.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isInitialized = false;
    this.isRunning = false;
    this.rpm = 800; // Idle RPM
    this.targetRpm = 800;
    
    // Audio Nodes
    this.masterGain = null;
    this.osc1 = null;
    this.osc2 = null;
    this.oscSub = null;
    this.noiseNode = null;
    this.filter = null;
    this.distortion = null;
    this.engineGain = null;
    this.ambientGain = null;
    this.animFrame = null;
    this.isMuted = false;
  }

  init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.ctx.destination);

      // Ambient background low drone
      this.initAmbientDrone();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  initAmbientDrone() {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    this.ambientGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(110, this.ctx.currentTime);

    this.ambientGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    osc.start();
  }

  // Play BMW Iconic Start-Up Chime & Ignition Roar
  playBmwWelcomeSequence() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Futuristic BMW Chime / Harmonic Chord
    const freqs = [220, 330, 440, 660]; // A minor / Bavarian luxury chord
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 1.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + 0.15 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + 2.5);
    });

    // 2. TwinPower Turbo V8 Ignition & Rev Surge
    setTimeout(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      this.playStarterCrank(t);

      // Brief cinematic throttle surge up to 3,500 RPM on startup
      setTimeout(() => {
        if (!this.isRunning) {
          this.startEngine();
          this.setThrottle(0.65);
          setTimeout(() => {
            this.setThrottle(0.0);
            this.triggerExhaustPop();
          }, 850);
        }
      }, 500);
    }, 400);
  }

  // Play subtle futuristic UI hover tick
  playUiTick(pitch = 1200) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {}
  }

  // Start BMW TwinPower Turbo V8 Engine
  startEngine() {
    this.init();
    if (!this.ctx) return;
    if (this.isRunning) return;

    this.isRunning = true;
    const now = this.ctx.currentTime;

    // 1. Starter motor crank sequence
    this.playStarterCrank(now);

    // 2. Main engine node graph
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.001, now);
    this.engineGain.gain.exponentialRampToValueAtTime(0.35, now + 0.7);

    // Filter to simulate engine block & exhaust resonance
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(250, now);
    this.filter.Q.setValueAtTime(2.5, now);

    // WaveShaper distortion for V8 aggressive exhaust bite
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(18);

    // Primary Cylinder Oscillators (V8 harmonic representation)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(28, now);

    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(56, now);

    this.oscSub = this.ctx.createOscillator();
    this.oscSub.type = 'sine';
    this.oscSub.frequency.setValueAtTime(14, now);

    // Turbocharger spool noise
    this.initTurboNoise();

    // Connect node chain
    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);
    this.oscSub.connect(this.filter);

    this.filter.connect(this.distortion);
    this.distortion.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.osc1.start(now);
    this.osc2.start(now);
    this.oscSub.start(now);

    this.startRpmLoop();
  }

  playStarterCrank(time) {
    const crankOsc = this.ctx.createOscillator();
    const crankGain = this.ctx.createGain();

    crankOsc.type = 'square';
    crankOsc.frequency.setValueAtTime(15, time);
    crankOsc.frequency.linearRampToValueAtTime(32, time + 0.5);

    crankGain.gain.setValueAtTime(0.2, time);
    crankGain.gain.exponentialRampToValueAtTime(0.001, time + 0.65);

    crankOsc.connect(crankGain);
    crankGain.connect(this.masterGain);

    crankOsc.start(time);
    crankOsc.stop(time + 0.65);
  }

  initTurboNoise() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    this.turboFilter = this.ctx.createBiquadFilter();
    this.turboFilter.type = 'bandpass';
    this.turboFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    this.turboFilter.Q.setValueAtTime(4, this.ctx.currentTime);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

    this.noiseNode.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);

    this.noiseNode.start();
  }

  makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 20;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  setThrottle(intensity) {
    if (!this.isRunning) return;
    const clamped = Math.max(0, Math.min(1, intensity));
    this.targetRpm = 800 + clamped * 6200;
  }

  triggerExhaustPop() {
    if (!this.ctx || !this.isRunning || this.isMuted) return;
    const count = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        const popFilter = this.ctx.createBiquadFilter();

        popOsc.type = 'sawtooth';
        popOsc.frequency.setValueAtTime(45 + Math.random() * 40, now);

        popFilter.type = 'lowpass';
        popFilter.frequency.setValueAtTime(300, now);

        popGain.gain.setValueAtTime(0.35 + Math.random() * 0.2, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        popOsc.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(this.masterGain);

        popOsc.start(now);
        popOsc.stop(now + 0.085);
      }, i * (50 + Math.random() * 40));
    }
  }

  startRpmLoop() {
    const update = () => {
      if (!this.isRunning) return;

      const prevRpm = this.rpm;
      const rate = this.targetRpm > this.rpm ? 0.12 : 0.07;
      this.rpm += (this.targetRpm - this.rpm) * rate;

      if (prevRpm > 4500 && this.targetRpm <= 1200 && prevRpm - this.rpm > 150) {
        if (Math.random() > 0.6) this.triggerExhaustPop();
      }

      if (this.ctx && this.osc1 && this.filter) {
        const now = this.ctx.currentTime;
        const fundamental = (this.rpm / 60) * 2;

        this.osc1.frequency.setValueAtTime(fundamental, now);
        this.osc2.frequency.setValueAtTime(fundamental * 2, now);
        this.oscSub.frequency.setValueAtTime(fundamental * 0.5, now);

        const filterFreq = 180 + (this.rpm / 7000) * 1200;
        this.filter.frequency.setValueAtTime(filterFreq, now);

        if (this.turboGain && this.turboFilter) {
          const turboIntensity = Math.max(0, (this.rpm - 2200) / 4800);
          this.turboGain.gain.setValueAtTime(0.01 + turboIntensity * 0.14, now);
          this.turboFilter.frequency.setValueAtTime(1400 + turboIntensity * 1600, now);
        }

        const volume = 0.3 + (this.rpm / 7000) * 0.35;
        this.engineGain.gain.setValueAtTime(volume, now);
      }

      this.animFrame = requestAnimationFrame(update);
    };

    update();
  }

  stopEngine() {
    if (!this.isRunning) return;
    this.isRunning = false;
    cancelAnimationFrame(this.animFrame);

    if (this.ctx && this.engineGain) {
      const now = this.ctx.currentTime;
      this.engineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      setTimeout(() => {
        try {
          if (this.osc1) this.osc1.stop();
          if (this.osc2) this.osc2.stop();
          if (this.oscSub) this.oscSub.stop();
          if (this.noiseNode) this.noiseNode.stop();
        } catch (e) {}
      }, 450);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const audioSynth = new AudioSynthesizer();
