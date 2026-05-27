import { useEffect, useRef } from 'react';
import { useWorldStore } from '../store/useWorldStore';

export const AudioController = () => {
  const soundOn = useWorldStore((state) => state.soundOn);
  const transitioning = useWorldStore((state) => state.transitioning);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context and Nodes
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(soundOn ? 1 : 0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;
  };

  // Global user interaction gesture listener to unlock Web Audio API in browsers
  useEffect(() => {
    const handleGesture = () => {
      if (!soundOn) return;

      if (!audioCtxRef.current) {
        initAudio();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume()
          .then(() => {
            console.log('AudioContext successfully unlocked via user gesture.');
          })
          .catch((e) => console.warn('Failed to resume AudioContext:', e));
      }
    };

    // Register listeners for common user gestures
    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    window.addEventListener('touchstart', handleGesture);

    // Call it immediately in case browser allows it
    handleGesture();

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [soundOn]);

  // Manage Sound Mute/Unmute state
  useEffect(() => {
    if (soundOn) {
      if (!audioCtxRef.current) {
        initAudio();
      }
      
      const ctx = audioCtxRef.current;
      const masterGain = masterGainRef.current;
      if (ctx && masterGain) {
        if (ctx.state === 'suspended') {
          ctx.resume().catch((e) => console.warn('Failed to resume on sound toggle:', e));
        }
        // Anchoring the current gain value first before ramping is a Web Audio best practice
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.2);
      }
    } else {
      const ctx = audioCtxRef.current;
      const masterGain = masterGainRef.current;
      if (ctx && masterGain) {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      }
    }
  }, [soundOn]);

  // Handle Transition SFX (voltage surge + static burst)
  useEffect(() => {
    // Trigger sound effects only if sound is toggled ON and we start a transition
    if (transitioning && soundOn) {
      if (!audioCtxRef.current) {
        initAudio();
      }

      const ctx = audioCtxRef.current;
      const masterGain = masterGainRef.current;
      if (!ctx || !masterGain) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch((e) => console.warn('Failed to resume on transition:', e));
      }

      try {
        const now = ctx.currentTime;

        // 1. High-voltage sweep sound (Zap/Static swell)
        const zapOsc = ctx.createOscillator();
        zapOsc.type = 'sawtooth';
        zapOsc.frequency.setValueAtTime(80, now);
        zapOsc.frequency.exponentialRampToValueAtTime(1500, now + 0.6);

        // Lowpass filter to shape the zap
        const zapFilter = ctx.createBiquadFilter();
        zapFilter.type = 'lowpass';
        zapFilter.frequency.setValueAtTime(100, now);
        zapFilter.frequency.exponentialRampToValueAtTime(2000, now + 0.6);

        const zapGain = ctx.createGain();
        zapGain.gain.setValueAtTime(0, now);
        zapGain.gain.linearRampToValueAtTime(0.2, now + 0.15); // fade in fast
        zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7); // fade out

        zapOsc.connect(zapFilter);
        zapFilter.connect(zapGain);
        zapGain.connect(masterGain);

        zapOsc.start(now);
        zapOsc.stop(now + 0.75);

        // 2. Heavy static noise burst during transition peak
        const burstGain = ctx.createGain();
        burstGain.gain.setValueAtTime(0, now);
        burstGain.gain.linearRampToValueAtTime(0.15, now + 0.2); // swell peak static
        burstGain.gain.setValueAtTime(0.15, now + 0.55); // maintain peak static
        burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95); // fade out static

        // Create a separate noise source for the transition burst so we filter it differently
        const bufferSize = ctx.sampleRate * 1.5;
        const burstBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = burstBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const burstSrc = ctx.createBufferSource();
        burstSrc.buffer = burstBuffer;

        const burstFilter = ctx.createBiquadFilter();
        burstFilter.type = 'bandpass';
        burstFilter.frequency.setValueAtTime(1200, now);
        burstFilter.Q.setValueAtTime(0.5, now);

        burstSrc.connect(burstFilter);
        burstFilter.connect(burstGain);
        burstGain.connect(masterGain);

        burstSrc.start(now);
        burstSrc.stop(now + 1.2);
        
        // 3. Play a clean mechanical CRT "click"
        const clickOsc = ctx.createOscillator();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(800, now);
        clickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

        const clickGain = ctx.createGain();
        clickGain.gain.setValueAtTime(0.25, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        clickOsc.connect(clickGain);
        clickGain.connect(masterGain);
        clickOsc.start(now);
        clickOsc.stop(now + 0.08);

      } catch (err) {
        console.warn('Audio transition play failed:', err);
      }
    }
  }, [transitioning, soundOn]);

  const soundTrigger = useWorldStore((state) => state.soundTrigger);
  const lastTriggerId = useRef(0);

  const playTickSFX = () => {
    if (!soundOn) return;

    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch((e) => console.warn('Failed to resume on tick:', e));
    }

    try {
      const now = ctx.currentTime;
      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(180, now);
      clickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.015);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(1.0, now);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.06, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      clickOsc.connect(filter);
      filter.connect(clickGain);
      clickGain.connect(masterGain);

      clickOsc.start(now);
      clickOsc.stop(now + 0.02);
    } catch (e) {
      console.warn('Failed to play tick:', e);
    }
  };

  const playThunkSFX = () => {
    if (!soundOn) return;

    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch((e) => console.warn('Failed to resume on thunk:', e));
    }

    try {
      const now = ctx.currentTime;
      
      const thunkOsc = ctx.createOscillator();
      thunkOsc.type = 'triangle';
      thunkOsc.frequency.setValueAtTime(110, now);
      thunkOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

      const thunkGain = ctx.createGain();
      thunkGain.gain.setValueAtTime(0.35, now);
      thunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(220, now);
      clickOsc.frequency.exponentialRampToValueAtTime(60, now + 0.025);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.18, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      const bufferSize = ctx.sampleRate * 0.08;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(160, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      thunkOsc.connect(thunkGain);
      thunkGain.connect(masterGain);

      clickOsc.connect(clickGain);
      clickGain.connect(masterGain);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      thunkOsc.start(now);
      clickOsc.start(now);
      noiseSrc.start(now);

      thunkOsc.stop(now + 0.15);
      clickOsc.stop(now + 0.05);
      noiseSrc.stop(now + 0.08);
    } catch (e) {
      console.warn('Failed to play thunk:', e);
    }
  };

  useEffect(() => {
    if (soundTrigger.type && soundTrigger.id > lastTriggerId.current) {
      lastTriggerId.current = soundTrigger.id;
      if (soundTrigger.type === 'tick') {
        playTickSFX();
      } else if (soundTrigger.type === 'thunk') {
        playThunkSFX();
      }
    }
  }, [soundTrigger, soundOn]);

  // Clean up nodes on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return null; // Silent controller
};
