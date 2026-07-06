(function() {
  // ---- 12 UNIQUE SOUND DEFINITIONS (5-10 seconds each) ----
  const soundDefinitions = [
    { emoji: '🔔', label: 'Bell' },
    { emoji: '🎵', label: 'Melody' },
    { emoji: '💥', label: 'Explosion' },
    { emoji: '🐱', label: 'Meow' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '🎸', label: 'Guitar' },
    { emoji: '📢', label: 'Announce' },
    { emoji: '⏰', label: 'Alarm' },
    { emoji: '🎯', label: 'Hit' },
    { emoji: '🌊', label: 'Wave' },
    { emoji: '🎹', label: 'Piano' },
    { emoji: '⚡', label: 'Zap' }
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

  // ---- generate LONG audio buffers (5-10 seconds) ----
  function generateSoundBuffer(soundId) {
    const ctx = getAudioContext();
    const sampleRate = ctx.sampleRate;
    // Random duration between 5-10 seconds
    const duration = 5 + Math.random() * 5;
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    switch (soundId) {
      case 0: // Bell: long ringing with harmonics
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.8);
          data[i] = env * (0.5 * Math.sin(2 * Math.PI * 440 * t) + 
                          0.3 * Math.sin(2 * Math.PI * 880 * t) + 
                          0.15 * Math.sin(2 * Math.PI * 1320 * t) +
                          0.05 * Math.sin(2 * Math.PI * 1760 * t));
        }
        break;
        
      case 1: // Melody: rising and falling pattern
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.sin(Math.PI * t / duration) * 0.8;
          let freq = 440 + 200 * Math.sin(2 * Math.PI * 0.5 * t);
          data[i] = env * 0.6 * Math.sin(2 * Math.PI * freq * t);
        }
        break;
        
      case 2: // Explosion: noise with long decay
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 1.2);
          data[i] = env * (Math.random() * 2 - 1) * 0.9;
        }
        break;
        
      case 3: // Meow: pitch bend up and down
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.sin(Math.PI * t / duration) * 0.8;
          let freq = 300 + 500 * Math.sin(2 * Math.PI * 0.3 * t);
          data[i] = env * 0.5 * Math.sin(2 * Math.PI * freq * t);
        }
        break;
        
      case 4: // Rocket: ascending with noise
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.5);
          let freq = 80 + 600 * (t / duration);
          let tone = 0.5 * Math.sin(2 * Math.PI * freq * t);
          let noise = 0.3 * (Math.random() * 2 - 1) * env;
          data[i] = env * (tone + noise);
        }
        break;
        
      case 5: // Guitar: pluck with harmonics
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.7);
          let sum = 0;
          for (let h = 1; h <= 6; h++) {
            sum += (1 / h) * Math.sin(2 * Math.PI * (110 * h) * t);
          }
          data[i] = env * 0.3 * sum;
        }
        break;
        
      case 6: // Announce: speech-like modulation
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.sin(Math.PI * t / duration) * 0.9;
          let formant = Math.sin(2 * Math.PI * 350 * t) + 0.5 * Math.sin(2 * Math.PI * 800 * t);
          let modulation = 0.5 + 0.5 * Math.sin(2 * Math.PI * 2 * t);
          data[i] = env * 0.4 * formant * modulation;
        }
        break;
        
      case 7: // Alarm: pulsing square wave
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.3);
          let pulse = Math.sin(2 * Math.PI * 200 * t) > 0 ? 0.8 : -0.8;
          let amplitude = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.5 * t);
          data[i] = env * 0.6 * pulse * amplitude;
        }
        break;
        
      case 8: // Hit: impact with long tail
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.9);
          let noise = (Math.random() * 2 - 1) * 0.5;
          let tone = 0.3 * Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 1.5);
          data[i] = env * (noise + tone);
        }
        break;
        
      case 9: // Wave: sweeping filter effect
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.sin(Math.PI * t / duration) * 0.8;
          let freq = 150 + 600 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.8 * t));
          data[i] = env * 0.5 * Math.sin(2 * Math.PI * freq * t);
        }
        break;
        
      case 10: // Piano: rich harmonic decay
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.6);
          let sum = 0;
          for (let h = 1; h <= 5; h++) {
            sum += (1 / h) * Math.sin(2 * Math.PI * (220 * h) * t);
          }
          data[i] = env * 0.4 * sum;
        }
        break;
        
      case 11: // Zap: descending glitch
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 0.8);
          let freq = 1500 - 1000 * (t / duration);
          let noise = (Math.random() * 2 - 1) * 0.2;
          let tone = 0.5 * Math.sin(2 * Math.PI * freq * t);
          data[i] = env * (tone + noise);
        }
        break;
        
      default:
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          data[i] = 0.5 * Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 0.5);
        }
    }
    return buffer;
  }

  // ---- Sound class for individual control ----
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
      this.buffer = generateSoundBuffer(this.index);
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

      // If paused, resume from where we left off
      if (this.isPaused && this.source) {
        this.source.start(0, this.pausedTime);
        this.isPaused = false;
        this.isPlaying = true;
        this.startTime = ctx.currentTime - this.pausedTime;
        this.updateButtons();
        this.startProgressUpdate();
        this.card.classList.add('playing');
        return;
      }

      // Stop any existing playback
      this.stop();

      this.source = ctx.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(masterGain);
      
      this.startTime = ctx.currentTime;
      this.pausedTime = 0;
      this.isPlaying = true;
      this.isPaused = false;

      this.source.onended = () => {
        this.isPlaying = false;
        this.isPaused = false;
        this.updateButtons();
        this.stopProgressUpdate();
        this.card.classList.remove('playing');
        if (this.progressFill) {
          this.progressFill.style.width = '100%';
        }
      };

      this.source.start(0);
      this.updateButtons();
      this.startProgressUpdate();
      this.card.classList.add('playing');
    }

    pause() {
      if (!this.isPlaying || this.isPaused) return;
      const ctx = getAudioContext();
      if (!ctx || !this.source) return;

      this.pausedTime = ctx.currentTime - this.startTime;
      this.source.stop();
      this.source.disconnect();
      this.source = null;
      this.isPlaying = false;
      this.isPaused = true;
      this.updateButtons();
      this.stopProgressUpdate();
      this.card.classList.remove('playing');
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
    }

    startProgressUpdate() {
      this.stopProgressUpdate();
      this.updateProgress();
    }

    updateProgress() {
      if (!this.isPlaying || this.isPaused) return;
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

      playBtn.addEventListener('click', () => {
        getAudioContext();
        sound.play();
      });

      pauseBtn.addEventListener('click', () => {
        sound.pause();
      });

      stopBtn.addEventListener('click', () => {
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
