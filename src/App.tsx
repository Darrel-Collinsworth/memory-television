import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { useWorldStore } from './store/useWorldStore';
import { worlds } from './data/worlds';
import { Experience } from './Experience';
import { AudioController } from './components/AudioController';
import './index.css';

export default function App() {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const transitioning = useWorldStore((state) => state.transitioning);
  const soundOn = useWorldStore((state) => state.soundOn);
  const setSoundOn = useWorldStore((state) => state.setSoundOn);
  const tvRaised = useWorldStore((state) => state.tvRaised);
  const setTvRaised = useWorldStore((state) => state.setTvRaised);
  const debugMode = useWorldStore((state) => state.debugMode);
  const setDebugMode = useWorldStore((state) => state.setDebugMode);

  const isHome = currentWorld === 'home';
  const activeWorld = isHome ? null : worlds[currentWorld];

  // Dynamic chromatic aberration offset during scene transition
  const aberrationOffset: [number, number] = transitioning 
    ? [0.018, 0.018] 
    : [0.0012, 0.0012];

  // Dynamic bloom intensity during transition peak
  // Hub is bright — dial back bloom & vignette so they don't crush the pastels
  const bloomIntensity = transitioning ? 2.5 : isHome ? 0.18 : 0.45;
  const vignetteAmount = transitioning ? 1.5 : isHome ? 0.55 : 1.1;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: isHome ? '#b22b3b' : '#050508' }}>
      
      {/* --- R3F FULLSCREEN 3D CANVAS --- */}
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 20,
            position: [0, 0, 0] // Camera at origin. TV and worlds are placed in front
          }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={[isHome ? '#b22b3b' : worlds[currentWorld].fogColor]} />

            {/* Core Scene Experience */}
            <Experience />

            {/* Atmospheric Post-Processing Stack */}
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.12} 
                luminanceSmoothing={0.9} 
                height={300} 
                intensity={bloomIntensity} 
              />
              <ChromaticAberration offset={aberrationOffset} />
              <Noise opacity={0.03} />
              <Vignette
                offset={isHome ? 0.25 : 0.1}
                darkness={vignetteAmount}
                eskil={false}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* --- GLOBAL PROCEDURAL AUDIO CONTROLLER --- */}
      <AudioController />

      {/* --- VOLUMETRIC ROOM VIGNETTE LAYER --- */}
      <div className="volumetric-vignette" />

      {/* --- FULLSCREEN STATIC GLITCH TRANSITION --- */}
      <div className={`fullscreen-static-overlay ${transitioning ? 'active' : ''}`}>
        <div className="static-noise-bg" />
        <div className="transition-h-line" />
      </div>

      {/* --- GLASSMORPHIC HUD CONTROL OVERLAY --- */}
      <div className="hud-overlay">
        
        {/* HUD Header */}
        <header className="hud-header">
          <div className="hud-title-container">
            <h1 className="hud-title">
              {isHome ? 'MEMORY TELEVISION' : activeWorld?.title}
            </h1>
            <p className="hud-subtitle">
              {isHome 
                ? 'SURREAL ARCHIVE PROTO-PORTAL' 
                : `CHANNEL SECURED: ${activeWorld?.subtitle}`}
            </p>
          </div>

          <div className="hud-controls hud-interactive">
            {/* Debug Mode Toggle */}
            <button 
              className={`hud-button ${debugMode ? 'active' : ''}`}
              onClick={() => setDebugMode(!debugMode)}
            >
              <span>{debugMode ? '🛠️ DEBUG ON' : '🛠️ DEBUG OFF'}</span>
            </button>

            {/* Ambient Audio Toggle */}
            <button 
              className={`hud-button ${soundOn ? 'active' : ''}`}
              onClick={() => setSoundOn(!soundOn)}
            >
              <span>{soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF'}</span>
            </button>
          </div>
        </header>

        {/* --- GLASSMORPHIC HUD TOGGLE TAB --- */}
        <div className="crt-toggle-tab-container hud-interactive">
          <button 
            className={`crt-toggle-tab theme-${currentWorld}`}
            onClick={() => setTvRaised(!tvRaised)}
          >
            <span>{tvRaised ? 'LOWER CRT' : 'RAISE CRT'}</span>
            <span className={`crt-tab-chevron ${tvRaised ? 'raised' : ''}`}>▲</span>
          </button>
        </div>

        {/* HUD Footer */}
        <footer className="hud-footer">
          <div className="hud-instructions">
            {isHome ? (
              <>
                {tvRaised
                  ? <>Look down at the <strong>CRT companion</strong> in your hands. Click a channel to enter a world — or <strong>lower the CRT</strong> to look around this memory space.</>
                  : <>Move your mouse to <strong>look around</strong> the memory sky. Raise the CRT to browse channels and enter a world.</>
                }
              </>
            ) : (
              <>
                {tvRaised
                  ? <>Now exploring <strong>{activeWorld?.title}</strong>. Lower the CRT to explore — then move your mouse to the screen edges to look around at the artwork panels.</>
                  : <>Move your mouse to the <strong>screen edges</strong> to pan the camera and explore floating artwork. Raise the CRT companion to return to channels.</>
                }
              </>
            )}

          </div>

          <div className="hud-telemetry">
            <div>MEM_TV.SYS: OK</div>
            <div style={{ color: activeWorld ? activeWorld.themeColor : '#55ff55' }}>
              SOURCE: {isHome ? 'ARCHIVE_ROOM' : activeWorld?.id.toUpperCase()}
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}
