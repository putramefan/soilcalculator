/* ==========================================================================
   SOILS SOUND MODULE - Web Audio API Synthesized Click Feedback
   ========================================================================== */
(function(window){
  'use strict';

  // --- CONFIGURATION OBJECT ---
  var CONFIG = {
    volume: 0.2, // Master volume gain
    reducedMotionMultiplier: 0.5,
    pitchVariation: 0.05, // ±5% random variation
    sounds: {
      click: {
        type: 'sine',
        freqStart: 720,
        freqEnd: 400,
        attack: 0.002, // 2 ms
        decay: 0.048,  // ~50 ms total
        noiseBurst: true,
        noiseDuration: 0.010, // 10 ms
        noiseFilterFreq: 3000,
        noiseGain: 0.12
      },
      back: {
        type: 'triangle',
        freqStart: 500,
        freqEnd: 300,
        attack: 0.002,
        decay: 0.045
      },
      select: {
        type: 'sine',
        freqStart: 800,
        freqEnd: 550,
        attack: 0.0015,
        decay: 0.060
      },
      success: {
        note1: { freq: 520, attack: 0.002, decay: 0.08, startOffset: 0 },
        note2: { freq: 780, attack: 0.002, decay: 0.09, startOffset: 0.07 }
      }
    }
  };

  var SoilsSound = {
    config: CONFIG,
    enabled: true,
    ctx: null,

    init: function() {
      var saved = localStorage.getItem('soils_sound_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    },

    getCtx: function() {
      if (!this.ctx) {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    },

    play: function(type) {
      if (!this.enabled) return;
      var ctx = this.getCtx();
      if (!ctx) return;

      try {
        var now = ctx.currentTime;
        var masterGain = ctx.createGain();
        var effectiveVol = this.config.volume;
        
        // Respect prefers-reduced-motion
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          effectiveVol *= this.config.reducedMotionMultiplier;
        }
        masterGain.gain.setValueAtTime(effectiveVol, now);
        masterGain.connect(ctx.destination);

        // Pitch variation ±5%
        var pVar = (1 - this.config.pitchVariation) + Math.random() * (this.config.pitchVariation * 2);

        if (type === 'back') {
          var cfg = this.config.sounds.back;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = cfg.type;
          osc.frequency.setValueAtTime(cfg.freqStart * pVar, now);
          osc.frequency.exponentialRampToValueAtTime(cfg.freqEnd * pVar, now + cfg.decay);
          
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.8, now + cfg.attack);
          gain.gain.exponentialRampToValueAtTime(0.001, now + cfg.decay);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + cfg.decay + 0.01);

        } else if (type === 'select') {
          var cfg = this.config.sounds.select;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = cfg.type;
          osc.frequency.setValueAtTime(cfg.freqStart * pVar, now);
          osc.frequency.exponentialRampToValueAtTime(cfg.freqEnd * pVar, now + cfg.decay);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.7, now + cfg.attack);
          gain.gain.exponentialRampToValueAtTime(0.001, now + cfg.decay);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + cfg.decay + 0.01);

        } else if (type === 'success') {
          var cfg = this.config.sounds.success;
          
          // Note 1
          var osc1 = ctx.createOscillator();
          var g1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(cfg.note1.freq * pVar, now);
          g1.gain.setValueAtTime(0.001, now);
          g1.gain.linearRampToValueAtTime(0.6, now + cfg.note1.attack);
          g1.gain.exponentialRampToValueAtTime(0.001, now + cfg.note1.decay);
          osc1.connect(g1);
          g1.connect(masterGain);
          osc1.start(now);
          osc1.stop(now + cfg.note1.decay + 0.01);

          // Note 2
          var t2 = now + cfg.note2.startOffset;
          var osc2 = ctx.createOscillator();
          var g2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(cfg.note2.freq * pVar, t2);
          g2.gain.setValueAtTime(0.001, t2);
          g2.gain.linearRampToValueAtTime(0.7, t2 + cfg.note2.attack);
          g2.gain.exponentialRampToValueAtTime(0.001, t2 + cfg.note2.decay);
          osc2.connect(g2);
          g2.connect(masterGain);
          osc2.start(t2);
          osc2.stop(t2 + cfg.note2.decay + 0.01);

        } else {
          // click (default)
          var cfg = this.config.sounds.click;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = cfg.type;
          osc.frequency.setValueAtTime(cfg.freqStart * pVar, now);
          osc.frequency.exponentialRampToValueAtTime(cfg.freqEnd * pVar, now + cfg.decay);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.7, now + cfg.attack);
          gain.gain.exponentialRampToValueAtTime(0.001, now + cfg.decay);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + cfg.decay + 0.01);

          // Noise burst for mechanical "tek" feel
          if (cfg.noiseBurst) {
            try {
              var bufferSize = Math.floor(ctx.sampleRate * cfg.noiseDuration);
              var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
              var data = buffer.getChannelData(0);
              for (var i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
              }
              var noise = ctx.createBufferSource();
              noise.buffer = buffer;
              var noiseFilter = ctx.createBiquadFilter();
              noiseFilter.type = 'highpass';
              noiseFilter.frequency.value = cfg.noiseFilterFreq;

              var noiseGain = ctx.createGain();
              noiseGain.gain.setValueAtTime(cfg.noiseGain, now);
              noiseGain.gain.exponentialRampToValueAtTime(0.001, now + cfg.noiseDuration);

              noise.connect(noiseFilter);
              noiseFilter.connect(noiseGain);
              noiseGain.connect(masterGain);
              noise.start(now);
              noise.stop(now + cfg.noiseDuration + 0.005);
            } catch(e) {}
          }
        }
      } catch (err) {
        // Prevent unhandled errors before interaction
      }
    },

    toggle: function() {
      this.enabled = !this.enabled;
      localStorage.setItem('soils_sound_enabled', this.enabled);
      this.updateToggleButton();
      return this.enabled;
    },

    updateToggleButton: function() {
      var btn = document.getElementById('soils-sound-toggle');
      if (btn) {
        btn.setAttribute('aria-pressed', this.enabled);
        var icon = this.enabled 
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
        btn.innerHTML = icon;
      }
    }
  };

  SoilsSound.init();
  window.SoilsSound = SoilsSound;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      SoilsSound.updateToggleButton();
    });
  } else {
    SoilsSound.updateToggleButton();
  }

  // Single delegated pointerdown listener
  document.addEventListener('pointerdown', function(e) {
    var target = e.target.closest('button, a, [role="button"], .soils-cat-card, .soils-calc-card, .soils-calc-item, .soil-category-card, .soil-popular-card');
    if (!target) return;

    // Handle audio toggle directly
    if (target.id === 'soils-sound-toggle' || target.closest('#soils-sound-toggle')) {
      var enabled = SoilsSound.toggle();
      if (enabled) {
        SoilsSound.play('click');
      }
      return;
    }

    // Explicit override via data-sound="none"
    var soundType = target.getAttribute('data-sound');
    if (soundType === 'none') {
      return;
    }

    // Do not sound for disabled elements
    if (target.disabled || target.getAttribute('aria-disabled') === 'true' || target.classList.contains('disabled')) {
      return;
    }

    // Do not sound for typing in inputs
    if (e.target.closest('input, textarea, select')) {
      return;
    }

    if (!soundType) {
      if (target.id === 'soils-back-to-list' || target.id === 'soils-back-to-cats' || target.classList.contains('soils-back-btn') || target.classList.contains('soils-back-pill-btn') || (target.textContent && /kembali/i.test(target.textContent))) {
        soundType = 'back';
      } else if (target.classList.contains('soil-category-card') || target.classList.contains('soil-popular-card') || target.classList.contains('soils-cat-card') || target.classList.contains('soils-calc-card') || target.classList.contains('soils-calc-item')) {
        soundType = 'select';
      } else {
        soundType = 'click';
      }
    }

    SoilsSound.play(soundType);
  }, { passive: true });

})(window);
