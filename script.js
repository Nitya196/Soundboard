(function() {
  // ---- SOUND DEFINITIONS (12 unique sounds) ----
  // Each sound: emoji + label, and a function that returns an AudioBuffer
  // using Web Audio oscillator + noise or simple waveform variations.
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
  // Store active sources so we can stop them
  const activeSources = new Set();

  // Master gain node (volume control)
  let masterGain = null;

  // ----- helper: ensure audio context is running -----
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

  // ----- generate audio buffers for each sound (unique) -----
  function generateSoundBuffer(soundId) {
    const ctx = getAudioContext();
    const sampleRate = ctx.sampleRate;
    const duration = 0.6; // seconds

    // Each sound uses a different waveform / effect
    let buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    let data = buffer.getChannelData(0);

    switch (soundId) {
      case 0: // Bell: sine + harmonics
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 3);
          data[i] = env * (0.6 * Math.sin(2 * Math.PI * 440 * t) + 0.3 * Math.sin(2 * Math.PI * 880 * t) + 0.1 * Math.sin(2 * Math.PI * 1320 * t));
        }
        break;
      case 1: // Melody: sequence of tones (simple)
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let freq = 440 + 150 * Math.sin(2 * Math.PI * 2 * t); // frequency wobble
          let env = Math.exp(-t * 2.5);
          data[i] = env * 0.7 * Math.sin(2 * Math.PI * freq * t);
        }
        break;
      case 2: // Explosion: noise burst with decay
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 8);
          data[i] = env * (Math.random() * 2 - 1) * 0.9;
        }
        break;
      case 3: // Meow: pitch glide
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let freq = 300 + 400 * t; // rising
          let env = Math.sin(Math.PI * t / duration) * 0.8;
          data[i] = env * 0.6 * Math.sin(2 * Math.PI * freq * t);
        }
        break;
      case 4: // Rocket: ascending tone + noise
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let freq = 80 + 600 * t;
          let env = Math.exp(-t * 1.5);
          let tone = 0.5 * Math.sin(2 * Math.PI * freq * t);
          let noise = 0.3 * (Math.random() * 2 - 1) * (1 - t / duration);
          data[i] = env * (tone + noise);
        }
        break;
      case 5: // Guitar: pluck (decaying harmonics)
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 4);
          let sum = 0;
          for (let h = 1; h <= 5; h++) {
            sum += (1 / h) * Math.sin(2 * Math.PI * (110 * h) * t);
          }
          data[i] = env * 0.4 * sum;
        }
        break;
      case 6: // Announce: speech-like buzz
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.sin(Math.PI * t / duration) * 0.9;
          let formant = Math.sin(2 * Math.PI * 300 * t) + 0.5 * Math.sin(2 * Math.PI * 700 * t);
          data[i] = env * 0.5 * formant * (0.5 + 0.5 * Math.sin(2 * Math.PI * 80 * t));
        }
        break;
      case 7: // Alarm: square-like pulsing
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 1.8);
          let pulse = Math.sin(2 * Math.PI * 180 * t) > 0 ? 0.8 : -0.8;
          data[i] = env * 0.7 * pulse;
        }
        break;
      case 8: // Hit: short impact (noise + tone)
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 12);
          let noise = (Math.random() * 2 - 1) * 0.6;
          let tone = 0.4 * Math.sin(2 * Math.PI * 800 * t);
          data[i] = env * (noise + tone);
        }
        break;
      case 9: // Wave: sweeping filter (modulated)
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.sin(Math.PI * t / duration) * 0.8;
          let freq = 200 + 500 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 2 * t));
          data[i] = env * 0.5 * Math.sin(2 * Math.PI * freq * t);
        }
        break;
      case 10: // Piano: decaying harmonic rich
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 2.2);
          let sum = 0;
          for (let h = 1; h <= 4; h++) {
            sum += (1 / h) * Math.sin(2 * Math.PI * (220 * h) * t);
          }
          data[i] = env * 0.5 * sum;
        }
        break;
      case 11: // Zap: fast descending glitch
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          let env = Math.exp(-t * 7);
          let freq = 1200 - 800 * (t / duration);
          let noise = (Math.random() * 2 - 1) * 0.3;
          let tone = 0.6 * Math.sin(2 * Math.PI * freq * t);
          data[i] = env * (tone + noise);
        }
        break;
      default:
        // fallback: simple sine
        for (let i = 0; i < data.length; i++) {
          let t = i / sampleRate;
          data[i] = 0.5 * Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 2);
        }
    }
    return buffer;
  }

  // ---- play a sound by index ----
  function playSound(index) {
    const ctx = getAudioContext();
    if (!ctx) return;

    // generate buffer for this sound
    const buffer = generateSoundBuffer(index);
    if (!buffer) return;

    // create source
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // connect to master gain
    source.connect(masterGain);

    // store source for stop-all
    activeSources.add(source);

    // when sound ends, remove from active set
    source.onended = () => {
      activeSources.delete(source);
      // remove playing style
      const btn = document.querySelector(`.sound-btn[data-index="${index}"]`);
      if (btn) btn.classList.remove('playing');
    };

    // start playback
    source.start(0);

    // visual feedback
    const btn = document.querySelector(`.sound-btn[data-index="${index}"]`);
    if (btn) btn.classList.add('playing');
  }

  // ---- stop all sounds ----
  function stopAllSounds() {
    for (const source of activeSources) {
      try {
        source.stop();
      } catch (_) { /* ignore */ }
      activeSources.delete(source);
    }
    // clear any leftover
    activeSources.clear();
    // remove playing class from all buttons
    document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.remove('playing'));
  }

  // ---- build the grid ----
  function buildGrid() {
    const grid = document.getElementById('soundGrid');
    grid.innerHTML = '';
    soundDefinitions.forEach((def, idx) => {
      const btn = document.createElement('button');
      btn.className = 'sound-btn';
      btn.dataset.index = idx;
      btn.innerHTML = `<span class="emoji">${def.emoji}</span><span class="label">${def.label}</span>`;
      btn.addEventListener('click', () => {
        playSound(idx);
      });
      grid.appendChild(btn);
    });
  }

  // ---- initialize controls ----
  function initControls() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeDisplay = document.getElementById('volumeDisplay');

    // update volume
    function updateVolume() {
      const val = parseFloat(volumeSlider.value);
      if (masterGain) {
        masterGain.gain.value = val;
      }
      volumeDisplay.textContent = Math.round(val * 100) + '%';
    }

    volumeSlider.addEventListener('input', updateVolume);
    // set initial display
    updateVolume();

    // stop all button
    document.getElementById('stopAllBtn').addEventListener('click', stopAllSounds);

    // optional: resume audio context on first user interaction (handled in play)
    // but also resume on any click to the board
    document.querySelector('.soundboard').addEventListener('click', () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }, { once: false });
  }

  // ---- start ----
  buildGrid();
  initControls();

  // ensure audio context can be resumed on first sound play (if autoplay blocked)
  // already handled inside playSound via getAudioContext
})();
