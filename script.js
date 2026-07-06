(function() {
  // ---- 12 SONG DEFINITIONS (musical compositions) ----
  const soundDefinitions = [
    { emoji: '🎵', label: 'Happy Melody' },
    { emoji: '🎸', label: 'Rock Riff' },
    { emoji: '🎹', label: 'Piano Solo' },
    { emoji: '🎻', label: 'String Quartet' },
    { emoji: '🎷', label: 'Jazz Sax' },
    { emoji: '🥁', label: 'Drum Beat' },
    { emoji: '🎺', label: 'Trumpet Fanfare' },
    { emoji: '🎸', label: 'Acoustic Guitar' },
    { emoji: '🎹', label: 'Synth Wave' },
    { emoji: '🎻', label: 'Cello' },
    { emoji: '🎵', label: 'Folk Tune' },
    { emoji: '🎶', label: 'Ambient' }
  ];

  // ---- Web Audio setup ----
  let audioCtx = null;
  let masterGain = null;

  // Store all sound instances
  const soundInstances = [];

  // ---- helper: get audio context ----
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = parseFloat(document.getElementById('volumeSlider').value);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // ---- Generate SONG-like audio (6-10 seconds) ----
  function generateSongBuffer(songId) {
    const ctx = getAudioContext();
    const sampleRate = ctx.sampleRate;
    // Fixed duration for each song (6-10 seconds)
    const durations = [8, 7, 9, 8, 7, 6, 8, 9, 7, 8, 7, 9];
    const duration = durations[songId] || 7;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Musical note frequencies
    const notes = [262, 294, 330, 349, 392, 440, 494, 523];
    
    switch (songId) {
      case 0: // Happy Melody - upbeat pattern
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.15) * 0.8;
          let melody = 0;
          // Play a simple melody
          for (let n = 0; n < 4; n++) {
            let noteIndex = (Math.floor(t * 2) + n) % notes.length;
            let freq = notes[noteIndex];
            let noteDuration = 0.5;
            let notePhase = (t % noteDuration) / noteDuration;
            if (notePhase < 0.5) {
              melody += 0.25 * Math.sin(2 * Math.PI * freq * t + n);
            }
          }
          let harmony = 0.3 * Math.sin(2 * Math.PI * 392 * t) + 0.2 * Math.sin(2 * Math.PI * 523 * t);
          left[i] = env * (melody + harmony * 0.5);
          right[i] = left[i] * 0.9;
        }
        break;

      case 1: // Rock Riff - distorted guitar style
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.12) * 0.9;
          let riff = 0;
          let freq = 196 + 40 * Math.sin(2 * Math.PI * 0.8 * t);
          // Distortion effect
          let clean = Math.sin(2 * Math.PI * freq * t);
          let distorted = Math.tanh(clean * 3) * 0.7;
          let rhythm = 0.5 + 0.5 * Math.sin(2 * Math.PI * 2 * t);
          riff = distorted * rhythm;
          left[i] = env * riff;
          right[i] = left[i] * 0.85;
        }
        break;

      case 2: // Piano Solo - classical style
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.1) * 0.7;
          let melody = 0;
          let pattern = [0, 2, 4, 5, 4, 2, 0];
          for (let n = 0; n < pattern.length; n++) {
            let noteIndex = pattern[n];
            let freq = notes[noteIndex + 2];
            let noteStart = n * 0.8;
            if (t > noteStart && t < noteStart + 0.7) {
              let noteEnv = Math.exp(-(t - noteStart) * 6);
              melody += 0.2 * noteEnv * Math.sin(2 * Math.PI * freq * (t - noteStart));
            }
          }
          let bass = 0.15 * Math.sin(2 * Math.PI * 131 * t) * Math.exp(-t * 0.1);
          left[i] = env * (melody + bass);
          right[i] = left[i] * 0.9;
        }
        break;

      case 3: // String Quartet - rich harmonies
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.08) * 0.8;
          let chord = 0;
          let freqs = [262, 330, 392, 523];
          for (let f of freqs) {
            chord += 0.15 * Math.sin(2 * Math.PI * f * t);
          }
          // Add vibrato
          let vibrato = 1 + 0.02 * Math.sin(2 * Math.PI * 5 * t);
          left[i] = env * chord * vibrato;
          right[i] = left[i] * 0.95;
        }
        break;

      case 4: // Jazz Sax - smooth jazz
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.09) * 0.8;
          let freq = 294 + 30 * Math.sin(2 * Math.PI * 0.7 * t);
          let tone = Math.sin(2 * Math.PI * freq * t);
          // Add harmonic overtones for sax-like sound
          let overtone1 = 0.3 * Math.sin(2 * Math.PI * freq * 2 * t);
          let overtone2 = 0.15 * Math.sin(2 * Math.PI * freq * 3 * t);
          let sax = tone + overtone1 + overtone2;
          // Amplitude modulation
          let am = 0.8 + 0.2 * Math.sin(2 * Math.PI * 2.5 * t);
          left[i] = env * sax * am;
          right[i] = left[i] * 0.9;
        }
        break;

      case 5: // Drum Beat - rhythm pattern
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let beat = 0;
          // Kick drum on 1 and 3
          if (Math.floor(t * 2) % 2 === 0) {
            let kickEnv = Math.exp(-(t % 0.5) * 20);
            beat += 0.6 * kickEnv * (Math.random() * 0.2 + 0.8);
          }
          // Snare on 2 and 4
          if (Math.floor(t * 2) % 2 === 1) {
            let snareEnv = Math.exp(-(t % 0.5) * 15);
            beat += 0.4 * snareEnv * (Math.random() * 0.3 + 0.7);
          }
          // Hi-hat
          let hat = 0.15 * (Math.random() * 2 - 1) * Math.exp(-(t % 0.25) * 30);
          left[i] = beat + hat;
          right[i] = left[i] * 0.95;
        }
        break;

      case 6: // Trumpet Fanfare - bold and bright
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.07) * 0.9;
          let melody = 0;
          let fanfare = [0, 4, 7, 4, 0, 4, 7, 4];
          for (let n = 0; n < fanfare.length; n++) {
            let noteIndex = fanfare[n];
            let freq = notes[noteIndex + 1];
            let noteStart = n * 0.7;
            if (t > noteStart && t < noteStart + 0.6) {
              let noteEnv = Math.exp(-(t - noteStart) * 5);
              // Add brightness with overtones
              let fundamental = Math.sin(2 * Math.PI * freq * (t - noteStart));
              let overtone = 0.3 * Math.sin(2 * Math.PI * freq * 2 * (t - noteStart));
              melody += 0.3 * noteEnv * (fundamental + overtone);
            }
          }
          left[i] = env * melody;
          right[i] = left[i] * 0.9;
        }
        break;

      case 7: // Acoustic Guitar - fingerpicking
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.08) * 0.8;
          let strum = 0;
          let strings = [196, 247, 294, 392, 494, 659];
          for (let s = 0; s < strings.length; s++) {
            let strumTime = s * 0.15;
            if (t > strumTime && t < strumTime + 0.2) {
              let decay = Math.exp(-(t - strumTime) * 10);
              strum += 0.1 * decay * Math.sin(2 * Math.PI * strings[s] * (t - strumTime));
            }
          }
          left[i] = env * strum;
          right[i] = left[i] * 0.85;
        }
        break;

      case 8: // Synth Wave - electronic
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.1) * 0.8;
          let freq = 330 + 80 * Math.sin(2 * Math.PI * 0.3 * t);
          // Sawtooth-like wave
          let saw = 0;
          for (let h = 1; h <= 8; h++) {
            saw += (1 / h) * Math.sin(2 * Math.PI * freq * h * t);
          }
          // LFO modulation
          let lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.5 * t);
          left[i] = env * saw * 0.4 * lfo;
          right[i] = left[i] * 0.9;
        }
        break;

      case 9: // Cello - deep and rich
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.06) * 0.8;
          let freq = 131;
          let tone = 0;
          for (let h = 1; h <= 6; h++) {
            tone += (1 / (h * 1.2)) * Math.sin(2 * Math.PI * freq * h * t);
          }
          // Add vibrato
          let vibrato = 1 + 0.015 * Math.sin(2 * Math.PI * 4 * t);
          left[i] = env * tone * 0.5 * vibrato;
          right[i] = left[i] * 0.95;
        }
        break;

      case 10: // Folk Tune - simple and melodic
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.09) * 0.8;
          let melody = 0;
          let tune = [0, 2, 4, 5, 4, 2, 0, -2, 0, 2, 4, 5];
          for (let n = 0; n < tune.length; n++) {
            let noteIndex = tune[n] + 4;
            if (noteIndex >= 0 && noteIndex < notes.length) {
              let freq = notes[noteIndex];
              let noteStart = n * 0.5;
              if (t > noteStart && t < noteStart + 0.45) {
                let noteEnv = Math.exp(-(t - noteStart) * 8);
                melody += 0.2 * noteEnv * Math.sin(2 * Math.PI * freq * (t - noteStart));
              }
            }
          }
          left[i] = env * melody;
          right[i] = left[i] * 0.9;
        }
        break;

      case 11: // Ambient - atmospheric
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.03) * 0.7;
          let pad = 0;
          let freqs = [196, 247, 330, 440];
          for (let f of freqs) {
            pad += 0.15 * Math.sin(2 * Math.PI * f * t + 0.5 * Math.sin(2 * Math.PI * 0.2 * t));
          }
          // Add evolving texture
          let texture = 0.1 * (Math.random() * 2 - 1) * Math.exp(-t * 0.5);
          left[i] = env * (pad + texture);
          right[i] = left[i] * 0.95;
        }
        break;

      default:
        for (let i = 0; i < left.length; i++) {
          let t = i / sampleRate;
          left[i] = 0.3 * Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 0.1);
          right[i] = left[i];
        }
    }
    return buffer;
  }

  // ---- Sound class with FIXED pause ----
  class SoundInstance {
    constructor(index) {
      this.index = index;
      this.buffer = null;
      this.source = null;
      this.startTime = 0;
      this.pausedTime = 0;
      this.isPlaying = false;
      this.isPaused = false;
      this.animationFrame = null;
      this.card = null;
      this.progressFill = null;
      this.playBtn = null;
      this.pauseBtn = null;
      this.stopBtn = null;
      
      this.generateBuffer();
    }

    generateBuffer() {
      this.buffer = generateSongBuffer(this.index);
    }

    setUI(card, progressFill, playBtn, pauseBtn, stopBtn) {
      this.card = card;
      this.progressFill = progressFill;
      this.playBtn = playBtn;
      this.pauseBtn = pauseBtn;
      this.stopBtn = stopBtn;
      this.updateButtons();
    }

    play() {
      const ctx = getAudioContext();
      if (!ctx || !this.buffer) return;

      // If we have a paused source, resume it
      if (this.isPaused && this.source) {
        // The source is still connected but stopped, we need to create a new one
        // because Web Audio sources can only be started once
        const oldSource = this.source;
        oldSource.disconnect();
        this.source = null;
        this.isPaused = false;
        // Now fall through to create a new source from the paused position
      }

      // If we already have a playing source, stop it first
      if (this.source && this.isPlaying) {
        this.stop();
      }

      // Create new source
      this.source = ctx.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(masterGain);
      
      // Start from paused position or beginning
      const startOffset = this.pausedTime || 0;
      this.startTime = ctx.currentTime - startOffset;
      this.isPlaying = true;
      this.isPaused = false;

      // Store reference for cleanup
      const self = this;
      this.source.onended = function() {
        // Only reset if it's not paused (paused will have its own handler)
        if (!self.isPaused) {
          self.isPlaying = false;
          self.pausedTime = 0;
          self.updateButtons();
          self.stopProgressUpdate();
          self.card.classList.remove('playing');
          if (self.progressFill) {
            self.progressFill.style.width = '100%';
          }
        }
      };

      try {
        this.source.start(0, startOffset);
        this.updateButtons();
        this.startProgressUpdate();
        this.card.classList.add('playing');
      } catch (e) {
        console.error('Error playing sound:', e);
        this.isPlaying = false;
        this.isPaused = false;
        this.updateButtons();
      }
    }

    pause() {
      if (!this.isPlaying || this.isPaused) return;
      const ctx = getAudioContext();
      if (!ctx || !this.source) return;

      // Calculate elapsed time
      this.pausedTime = ctx.currentTime - this.startTime;
      
      // Stop the source
      try {
        this.source.stop();
        this.source.disconnect();
      } catch (_) {}
      this.source = null;
      
      this.isPlaying = false;
      this.isPaused = true;
      this.updateButtons();
      this.stopProgressUpdate();
      this.card.classList.remove('playing');
      
      // Keep progress bar at current position
      const percent = (this.pausedTime / this.buffer.duration) * 100;
      if (this.progressFill) {
        this.progressFill.style.width = Math.min(percent, 100) + '%';
      }
    }

    stop() {
      if (this.source) {
        try {
          this.source.stop();
          this.source.disconnect();
        } catch (_) {}
        this.source = null;
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.pausedTime = 0;
      this.updateButtons();
      this.stopProgressUpdate();
      this.card.classList.remove('playing');
      if (this.progressFill) {
        this.progressFill.style.width = '0%';
      }
    }

    updateButtons() {
      if (!this.playBtn || !this.pauseBtn || !this.stopBtn) return;
      
      this.playBtn.disabled = this.isPlaying && !this.isPaused;
      this.pauseBtn.disabled = !this.isPlaying || this.isPaused;
      this.stopBtn.disabled = !this.isPlaying && !this.isPaused;
      
      this.playBtn.classList.toggle('active', this.isPaused);
      this.pauseBtn.classList.toggle('active', this.isPlaying && !this.isPaused);
      this.stopBtn.classList.toggle('active', this.isPlaying || this.isPaused);
    }

    startProgressUpdate() {
      this.stopProgressUpdate();
      this.updateProgress();
    }

    updateProgress() {
      if (!this.isPlaying || this.isPaused) {
        this.stopProgressUpdate();
        return;
      }
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const elapsed = ctx.currentTime - this.startTime;
      const duration = this.buffer.duration;
      const percent = Math.min((elapsed / duration) * 100, 100);
      
      if (this.progressFill) {
        this.progressFill.style.width = percent + '%';
      }
      
      if (percent < 100) {
        this.animationFrame = requestAnimationFrame(() => this.updateProgress());
      } else {
        this.stopProgressUpdate();
        // Ensure it reaches 100%
        if (this.progressFill) {
          this.progressFill.style.width = '100%';
        }
        this.isPlaying = false;
        this.pausedTime = 0;
        this.updateButtons();
        this.card.classList.remove('playing');
      }
    }

    stopProgressUpdate() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }

    getDuration() {
      return this.buffer ? this.buffer.duration : 0;
    }
  }

  // ---- Build the grid ----
  function buildGrid() {
    const grid = document.getElementById('soundGrid');
    grid.innerHTML = '';
    
    soundDefinitions.forEach((def, idx) => {
      const sound = new SoundInstance(idx);
      soundInstances.push(sound);

      const card = document.createElement('div');
      card.className = 'sound-card';
      card.innerHTML = `
        <div class="emoji">${def.emoji}</div>
        <div class="label">${def.label}</div>
        <div class="controls-row">
          <button class="play-btn" title="Play">▶</button>
          <button class="pause-btn" title="Pause" disabled>⏸</button>
          <button class="stop-btn" title="Stop" disabled>⏹</button>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      `;

      const playBtn = card.querySelector('.play-btn');
      const pauseBtn = card.querySelector('.pause-btn');
      const stopBtn = card.querySelector('.stop-btn');
      const progressFill = card.querySelector('.progress-fill');

      sound.setUI(card, progressFill, playBtn, pauseBtn, stopBtn);

      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        getAudioContext();
        sound.play();
      });

      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.pause();
      });

      stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.stop();
      });

      grid.appendChild(card);
    });
  }

  // ---- Stop all sounds ----
  function stopAllSounds() {
    soundInstances.forEach(sound => sound.stop());
  }

  // ---- Init controls ----
  function initControls() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeDisplay = document.getElementById('volumeDisplay');

    function updateVolume() {
      const val = parseFloat(volumeSlider.value);
      if (masterGain) {
        masterGain.gain.value = val;
      }
      volumeDisplay.textContent = Math.round(val * 100) + '%';
    }

    volumeSlider.addEventListener('input', updateVolume);
    updateVolume();

    document.getElementById('stopAllBtn').addEventListener('click', stopAllSounds);

    // Resume audio context on any click
    document.querySelector('.soundboard').addEventListener('click', () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    });
  }

  // ---- Start ----
  buildGrid();
  initControls();
})();
