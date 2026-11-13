// Pure Web Audio API SFX + Real MP3 Playlist Engine + Ambient Corner Sparkler

export interface PlaylistSong {
  id: string;
  number: number;
  title: string;
  artist: string;
  defaultSrc: string;
  keywords: string[];
}

const FIXED_OPENING_SONGS: Omit<PlaylistSong, 'number'>[] = [
  {
    id: 'my-love-mine-all-mine',
    title: 'My Love Mine All Mine',
    artist: 'Mitski',
    defaultSrc: '/assets/aistudio/Mitski_-_My_Love_Mine_All_Mine_0c792f3d.mp3',
    keywords: ['my love mine all mine', 'mitski', '07'],
  },
  {
    id: 'birds-of-a-feather',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    defaultSrc: '/assets/aistudio/Billie_Eilish_-_BIRDS_OF_A_FEATHER_81331326.mp3',
    keywords: ['birds of a feather', 'billie eilish', '06'],
  },
  {
    id: 'falling-in-love-feels-like',
    title: 'this is what falling in love feels like',
    artist: 'JVKE',
    defaultSrc: '/assets/aistudio/JVKE_-_this_is_what_falling_in_love_feels_like_461fc29d.mp3',
    keywords: ['falling in love', 'jvke', '04'],
  },
];

const SHUFFLED_POOL_SONGS: Omit<PlaylistSong, 'number'>[] = [
  {
    id: 'pretty-little-baby',
    title: 'Pretty Little Baby',
    artist: 'Connie Francis',
    defaultSrc: '/assets/aistudio/Connie_Francis_-_Pretty_Little_Baby_9226e901.mp3',
    keywords: ['pretty little baby', 'connie francis', '01'],
  },
  {
    id: 'glue-song',
    title: 'Glue Song',
    artist: 'beabadoobee',
    defaultSrc: '/assets/aistudio/beabadoobee_-_Glue_Song_9804b94e.mp3',
    keywords: ['glue song', 'beabadoobee', '02'],
  },
  {
    id: 'sofia',
    title: 'Sofia',
    artist: 'Clairo',
    defaultSrc: '/assets/aistudio/Clairo_-_Sofia_edaceb39.mp3',
    keywords: ['sofia', 'clairo', '03'],
  },
  {
    id: 'they-dont-know-about-us',
    title: "They Don't Know About Us",
    artist: 'One Direction',
    defaultSrc: '/assets/aistudio/One_Direction_-_They_Don_t_Know_About_Us_b685f600.mp3',
    keywords: ['dont know about us', "don't know about us", 'one direction', '05'],
  },
  {
    id: 'i-need-u-yaeow',
    title: 'I Need U',
    artist: 'yaeow',
    defaultSrc: '/assets/aistudio/yaeow_-_I_Need_U_b1733f10.mp3',
    keywords: ['i need u', 'yaeow', '08'],
  },
  {
    id: 'nothing-bruno-major',
    title: 'Nothing',
    artist: 'Bruno Major',
    defaultSrc: '/assets/aistudio/Bruno_Major_-_Nothing_4572bf93.mp3',
    keywords: ['nothing', 'bruno major', '09'],
  },
  {
    id: 'here-with-me',
    title: 'Here With Me',
    artist: 'd4vd',
    defaultSrc: '/assets/aistudio/d4vd_-_Here_With_Me_b87e8d4b.mp3',
    keywords: ['here with me', 'd4vd', '10'],
  },
  {
    id: 'sweet-cas',
    title: 'Sweet',
    artist: 'Cigarettes After Sex',
    defaultSrc: '/assets/aistudio/Cigarettes_After_Sex_-_Sweet_0932e9f8.mp3',
    keywords: ['sweet', 'cigarettes after sex', '11'],
  },
];

function buildInitialPlaylist(): PlaylistSong[] {
  const rest = [...SHUFFLED_POOL_SONGS];
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...FIXED_OPENING_SONGS, ...rest].map((song, idx) => ({
    ...song,
    number: idx + 1,
  }));
}

export const PLAYLIST_SONGS: PlaylistSong[] = buildInitialPlaylist();

// Keep backward-compatible type alias if needed
export type LofiTrack = PlaylistSong;

export type SparklerAudioMode = 'background' | 'foreground';

export interface MusicPlayerSnapshot {
  playing: boolean;
  volume: number;
  track: PlaylistSong;
  trackIndex: number;
}

class CozySoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  // Continuous Sparkler Audio State (runs softly in corner, rises gently when foregrounded)
  private sparklerSource: AudioBufferSourceNode | null = null;
  private sparklerGain: GainNode | null = null;
  private sparklerPopTimer: ReturnType<typeof setTimeout> | null = null;
  private sparklerMode: SparklerAudioMode = 'background';

  // Real MP3 Playlist Audio Engine
  private audioEl: HTMLAudioElement | null = null;
  private trackIndex = 0;
  private musicVolume = 0.05;
  private musicPlaying = false;
  private wantAutoplay = true;
  private listeners = new Set<(snap: MusicPlayerSnapshot) => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = this.musicVolume;

    audio.addEventListener('play', () => {
      this.musicPlaying = true;
      this.emitMusicSnapshot();
    });

    audio.addEventListener('pause', () => {
      this.musicPlaying = false;
      this.emitMusicSnapshot();
    });

    audio.addEventListener('ended', () => {
      this.nextTrack(true);
    });

    audio.addEventListener('error', () => {
      this.musicPlaying = false;
      this.emitMusicSnapshot();
    });

    this.audioEl = audio;
    this.loadCurrentTrackSource(false);
  }

  public subscribeMusic(listener: (snap: MusicPlayerSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getMusicSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getMusicSnapshot(): MusicPlayerSnapshot {
    return {
      playing: this.musicPlaying,
      volume: this.musicVolume,
      track: this.getCurrentTrack(),
      trackIndex: this.trackIndex,
    };
  }

  private emitMusicSnapshot() {
    const snap = this.getMusicSnapshot();
    this.listeners.forEach((fn) => fn(snap));
  }

  private loadCurrentTrackSource(autoPlay: boolean) {
    if (!this.audioEl) return;
    const song = this.getCurrentTrack();
    this.audioEl.src = song.defaultSrc;
    this.audioEl.volume = this.musicVolume;
    this.audioEl.load();

    if (autoPlay && this.enabled) {
      void this.tryPlayAudio();
    } else {
      this.emitMusicSnapshot();
    }
  }

  private async tryPlayAudio(): Promise<boolean> {
    if (!this.audioEl || !this.enabled) return false;
    try {
      this.audioEl.volume = this.musicVolume;
      await this.audioEl.play();
      this.musicPlaying = true;
      this.emitMusicSnapshot();
      return true;
    } catch {
      this.musicPlaying = false;
      this.emitMusicSnapshot();
      return false;
    }
  }

  public getCurrentTrack(): PlaylistSong {
    return PLAYLIST_SONGS[this.trackIndex % PLAYLIST_SONGS.length];
  }

  public startMusic() {
    this.wantAutoplay = true;
    if (!this.enabled) return;
    void this.tryPlayAudio();
  }

  public pauseMusic() {
    this.wantAutoplay = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.musicPlaying = false;
    this.emitMusicSnapshot();
  }

  public toggleMusic() {
    if (this.musicPlaying) {
      this.pauseMusic();
    } else {
      this.startMusic();
    }
  }

  public selectTrack(index: number, autoPlay = true) {
    this.trackIndex = ((index % PLAYLIST_SONGS.length) + PLAYLIST_SONGS.length) % PLAYLIST_SONGS.length;
    this.wantAutoplay = autoPlay;
    this.loadCurrentTrackSource(autoPlay && this.enabled);
  }

  public nextTrack(forcePlay = false): PlaylistSong {
    this.trackIndex = (this.trackIndex + 1) % PLAYLIST_SONGS.length;
    const shouldPlay = forcePlay || this.wantAutoplay || this.musicPlaying;
    this.loadCurrentTrackSource(shouldPlay && this.enabled);
    return this.getCurrentTrack();
  }

  public prevTrack(): PlaylistSong {
    this.trackIndex =
      (this.trackIndex - 1 + PLAYLIST_SONGS.length) % PLAYLIST_SONGS.length;
    const shouldPlay = this.wantAutoplay || this.musicPlaying;
    this.loadCurrentTrackSource(shouldPlay && this.enabled);
    return this.getCurrentTrack();
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.musicVolume;
    }
    this.emitMusicSnapshot();
  }

  public resumeAudioIfNeeded() {
    if (!this.enabled) return;
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    if (!this.sparklerSource) {
      this.ensureSparklerRunning(this.sparklerMode);
    }
    if (this.wantAutoplay && !this.musicPlaying) {
      void this.tryPlayAudio();
    }
  }

  public setEnabled(next: boolean) {
    this.enabled = next;
    if (!next) {
      this.stopSparklerLoop();
      if (this.audioEl) {
        this.audioEl.pause();
      }
      this.musicPlaying = false;
      this.emitMusicSnapshot();
    } else {
      this.ensureSparklerRunning(this.sparklerMode);
      if (this.wantAutoplay) {
        void this.tryPlayAudio();
      }
    }
  }

  public isEnabled() {
    return this.enabled;
  }

  private getContext(ignoreEnabled = false): AudioContext | null {
    if ((!this.enabled && !ignoreEnabled) || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  // Gentle morning songbird trill
  public playBirdChirp() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { start: 0, f1: 2100, f2: 2750, dur: 0.11 },
      { start: 0.14, f1: 2450, f2: 3100, dur: 0.09 },
      { start: 0.28, f1: 2650, f2: 2300, dur: 0.14 },
    ];

    notes.forEach(({ start, f1, f2, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f1, now + start);
      osc.frequency.exponentialRampToValueAtTime(f2, now + start + dur);

      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.045, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    });
  }

  // Soft parchment / storybook paper rustle
  public playPaperRustle() {
    const ctx = this.getContext();
    if (!ctx) return;

    const duration = 0.16;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1900, ctx.currentTime);
    filter.Q.setValueAtTime(1.4, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  // Light kitten pawsteps along the sky bridge
  public playWalkSteps() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const stepOffsets = [0, 0.14, 0.28, 0.42, 0.56];

    stepOffsets.forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = idx % 2 === 0 ? 370 : 420;
      osc.frequency.setValueAtTime(baseFreq, now + offset);
      osc.frequency.exponentialRampToValueAtTime(190, now + offset + 0.055);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.036, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.08);
    });
  }

  // Expressive two-formant synthesized kitten "Mee-oww~"
  public playKittenMeow() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const dur = 0.44;

    const carrier = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const formant = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(520, now);
    carrier.frequency.exponentialRampToValueAtTime(920, now + 0.13);
    carrier.frequency.exponentialRampToValueAtTime(610, now + dur);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(1040, now);
    harmonic.frequency.exponentialRampToValueAtTime(1840, now + 0.13);
    harmonic.frequency.exponentialRampToValueAtTime(1220, now + dur);

    formant.type = 'bandpass';
    formant.Q.setValueAtTime(3.2, now);
    formant.frequency.setValueAtTime(1400, now);
    formant.frequency.exponentialRampToValueAtTime(2200, now + 0.13);
    formant.frequency.exponentialRampToValueAtTime(900, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.06);
    gain.gain.setValueAtTime(0.08, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.35, now);

    carrier.connect(formant);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(formant);
    formant.connect(gain);
    gain.connect(ctx.destination);

    carrier.start(now);
    harmonic.start(now);
    carrier.stop(now + dur + 0.02);
    harmonic.stop(now + dur + 0.02);
  }

  // Interactive Heart charm pop
  public playHeartPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(390, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.36);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Interactive Star bell chime
  public playStarChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [880, 1174.66, 1567.98].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.055);
      gain.gain.setValueAtTime(0.001, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.045, now + idx * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.42);
    });
  }

  // Real Party-Popper / Confetti Cannon SFX (punchy THWUMP-POP + paper flutter crackles + festive sparkle)
  public playConfettiPopper() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Two staggered cannon thwumps (left & right cannons!)
    [0, 0.16].forEach((offset) => {
      const t = now + offset;
      // Low pressurized cannon punch
      const punch = ctx.createOscillator();
      const punchGain = ctx.createGain();
      punch.type = 'sine';
      punch.frequency.setValueAtTime(220, t);
      punch.frequency.exponentialRampToValueAtTime(52, t + 0.14);
      punchGain.gain.setValueAtTime(0.28, t);
      punchGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      punch.connect(punchGain);
      punchGain.connect(ctx.destination);
      punch.start(t);
      punch.stop(t + 0.2);

      // Sharp pressurized confetti blast burst
      const blastDur = 0.24;
      const blastBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * blastDur), ctx.sampleRate);
      const ch = blastBuf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) {
        const env = Math.pow(1 - i / ch.length, 2.2);
        ch[i] = (Math.random() * 2 - 1) * env;
      }
      const blast = ctx.createBufferSource();
      blast.buffer = blastBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1600, t);
      bp.Q.setValueAtTime(0.75, t);
      const bg = ctx.createGain();
      bg.gain.setValueAtTime(0.22, t);
      bg.gain.exponentialRampToValueAtTime(0.001, t + blastDur);
      blast.connect(bp);
      bp.connect(bg);
      bg.connect(ctx.destination);
      blast.start(t);
    });

    // 2. Fluttering papery confetti rain cascades
    for (let k = 0; k < 14; k++) {
      const ft = now + 0.12 + k * 0.065 + Math.random() * 0.04;
      const fDur = 0.04 + Math.random() * 0.04;
      const fBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * fDur), ctx.sampleRate);
      const d = fBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.sin((i / d.length) * Math.PI);
      }
      const fSrc = ctx.createBufferSource();
      fSrc.buffer = fBuf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(2400 + Math.random() * 2200, ft);
      const fg = ctx.createGain();
      fg.gain.setValueAtTime(0.035 + Math.random() * 0.03, ft);
      fSrc.connect(hp);
      hp.connect(fg);
      fg.connect(ctx.destination);
      fSrc.start(ft);
    }

    // 3. Uplifting celebratory chime fanfare
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    fanfare.forEach((freq, idx) => {
      const t = now + 0.08 + idx * 0.065;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.055, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.68);
    });
  }

  // Lootbox charge-up anticipation shimmer (~1.4s ascending glow)
  public playLootboxBuildup() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const shimmerNotes = [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77];

    shimmerNotes.forEach((freq, idx) => {
      const t = now + idx * 0.16;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.04, t + 0.15);

      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.025 + idx * 0.005, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  // Continuous Corner/Fullscreen Sparkler Audio (background = soft corner hum; foreground = full forefront sparkle)
  public setSparklerMode(mode: SparklerAudioMode) {
    this.sparklerMode = mode;
    if (!this.enabled) return;

    if (!this.sparklerSource) {
      this.ensureSparklerRunning(mode);
      return;
    }

    if (this.sparklerGain && this.ctx) {
      const target = mode === 'foreground' ? 0.020 : 0.0028;
      this.sparklerGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.sparklerGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.12);
    }

    if (mode === 'foreground') {
      this.playSparklerIgniteChime();
    }
  }

  private playSparklerIgniteChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [659.25, 987.77, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      g.gain.setValueAtTime(0.001, now + idx * 0.05);
      g.gain.exponentialRampToValueAtTime(0.018, now + idx * 0.05 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.34);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.38);
    });
  }

  public ensureSparklerRunning(mode: SparklerAudioMode = this.sparklerMode) {
    this.sparklerMode = mode;
    if (!this.enabled) return;
    if (this.sparklerSource) {
      this.setSparklerMode(mode);
      return;
    }

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const totalSec = 10.0;
    const fadeSec = 1.5;
    const sr = ctx.sampleRate;
    const totalSamples = Math.floor(sr * totalSec);
    const fadeSamples = Math.floor(sr * fadeSec);

    const raw = new Float32Array(totalSamples + fadeSamples);
    let lastOut = 0;
    for (let i = 0; i < raw.length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.06 * white) / 1.06;
      raw[i] = white * 0.55 + lastOut * 0.85;
    }

    const buffer = ctx.createBuffer(1, totalSamples, sr);
    const out = buffer.getChannelData(0);

    for (let i = 0; i < totalSamples; i++) {
      if (i < fadeSamples) {
        const t = i / fadeSamples;
        const fadeIn = Math.sin(t * Math.PI * 0.5);
        const fadeOut = Math.cos(t * Math.PI * 0.5);
        out[i] = raw[i] * fadeIn + raw[totalSamples + i] * fadeOut;
      } else {
        out[i] = raw[i];
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(2200, now);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(7600, now);

    const gain = ctx.createGain();
    const initialGain = mode === 'foreground' ? 0.020 : 0.0028;
    gain.gain.setValueAtTime(0.0005, now);
    gain.gain.linearRampToValueAtTime(initialGain, now + 0.25);

    noise.connect(hp);
    hp.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    this.sparklerSource = noise;
    this.sparklerGain = gain;

    const scheduleCrackle = () => {
      if (!this.sparklerSource || !this.enabled) return;
      const c = this.getContext();
      if (!c) return;
      const t = c.currentTime;
      const isForeground = this.sparklerMode === 'foreground';

      const popDur = 0.014 + Math.random() * 0.022;
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * popDur), c.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 2);
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2800 + Math.random() * 3400, t);
      bp.Q.setValueAtTime(1.8, t);
      const g = c.createGain();
      const baseVol = isForeground
        ? 0.008 + Math.random() * 0.014
        : 0.0012 + Math.random() * 0.0022;
      g.gain.setValueAtTime(baseVol, t);
      src.connect(bp);
      bp.connect(g);
      g.connect(c.destination);
      src.start(t);

      this.sparklerPopTimer = setTimeout(
        scheduleCrackle,
        isForeground ? 48 + Math.random() * 140 : 140 + Math.random() * 280
      );
    };
    this.sparklerPopTimer = setTimeout(scheduleCrackle, 80);

    if (mode === 'foreground') {
      this.playSparklerIgniteChime();
    }
  }

  public startSparklerLoop() {
    this.ensureSparklerRunning('foreground');
  }

  public stopSparklerLoop() {
    if (this.sparklerPopTimer) {
      clearTimeout(this.sparklerPopTimer);
      this.sparklerPopTimer = null;
    }
    if (this.sparklerGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.sparklerGain.gain.cancelScheduledValues(t);
        this.sparklerGain.gain.setTargetAtTime(0.0001, t, 0.04);
      } catch {
        // Ignore
      }
    }
    if (this.sparklerSource) {
      const src = this.sparklerSource;
      setTimeout(() => {
        try {
          src.stop();
          src.disconnect();
        } catch {
          // Ignore
        }
      }, 110);
      this.sparklerSource = null;
    }
    this.sparklerGain = null;
  }

  // Joyful gift unwrap fanfare
  public playGiftSparkle() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];

    freqs.forEach((freq, idx) => {
      const start = now + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.06, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.56);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.6);
    });
  }

  // Lush sweeping chord for crossing the Cloud Gate into Part 2
  public playChapterTransition() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chord = [392.0, 493.88, 587.33, 739.99, 987.77];

    chord.forEach((freq, idx) => {
      const start = now + idx * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0005, start);
      gain.gain.exponentialRampToValueAtTime(0.048, start + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 1.2);
    });
  }

  // Gentle airy chime for opening the map
  public playMapOpen() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [440, 554.37, 659.25];

    freqs.forEach((freq, idx) => {
      const start = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.04, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.38);
    });
  }
}

export const soundEngine = new CozySoundEngine();
