import { useWorldStore } from './store/useWorldStore';
import { worlds } from './data/worlds';
import { MemoryTelevision } from './components/MemoryTelevision';
import { WorldScene } from './components/WorldScene';
import { DustParticles } from './components/DustParticles';
import { OrbitControls } from '@react-three/drei';
import { CameraController } from './components/CameraController';
import { HubEnvironment } from './components/HubEnvironment';

// Hub sky color — deep reddish sunset red that blends perfectly with the gradient horizon
const HUB_SKY = '#b22b3b';

export const Experience = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const debugMode = useWorldStore((state) => state.debugMode);

  const isHome = currentWorld === 'home';

  // Fog: hub gets an open, warm sky palette; worlds keep their close atmospheric fog
  const fogColor = debugMode
    ? '#22222b'
    : isHome
    ? HUB_SKY
    : worlds[currentWorld].fogColor;

  // Hub fog is much deeper so the floating cards at 6–9 units are visible
  const fogNear = debugMode ? 50  : isHome ? 10  : 2.5;
  const fogFar  = debugMode ? 200 : isHome ? 26  : 9.0;

  return (
    <>
      {/* --- SCENE BACKGROUND & FOG --- */}
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* --- DEBUG MODE OVERRIDES --- */}
      {debugMode ? (
        <>
          <ambientLight intensity={2.2} color="#ffffff" />
          <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
          <OrbitControls makeDefault />
        </>
      ) : isHome ? (
        <>
          {/* Hub base ambient — HubEnvironment adds its own richer lights on top */}
          <ambientLight intensity={1.2} color="#f8f0e8" />

          {/* Warm key light on the CRT TV so it pops against the bright bg */}
          <directionalLight
            position={[1.5, 2.5, 2.0]}
            intensity={1.4}
            color="#ffe8c8"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Soft spotlight down onto TV screen */}
          <spotLight
            position={[0, 4, 0.5]}
            angle={0.45}
            penumbra={1}
            intensity={2.2}
            color="#fff4e8"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
        </>
      ) : (
        <>
          {/* World-mode lighting (unchanged) */}
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[1.5, 2.5, 2.0]}
            intensity={1.0}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight
            position={[0, 4, 0.5]}
            angle={0.45}
            penumbra={1}
            intensity={1.5}
            color={worlds[currentWorld].themeColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
        </>
      )}

      {/* Floor grid — only visible in world/debug modes, hidden in hub */}
      {!isHome && (
        <gridHelper
          args={[40, 40, debugMode ? '#444455' : '#111118', debugMode ? '#222233' : '#07070a']}
          position={[0, -1.8, 0]}
        />
      )}

      {/* --- HUB ENVIRONMENT (only in home/hub mode) --- */}
      {isHome && !debugMode && <HubEnvironment />}

      {/* --- ATMOSPHERIC FLOATING DUST --- */}
      {!debugMode && (
        <DustParticles
          count={isHome ? 60 : 180}
          size={isHome ? 0.028 : 0.035}
          speed={isHome ? 0.03 : 0.06}
          areaSize={isHome ? 12 : 8.5}
        />
      )}

      {/* --- CAMERA PAN CONTROLLER --- */}
      <CameraController />

      {/* --- CRT TV COMPANION --- */}
      <MemoryTelevision />

      {/* --- ARTIST WORLD PORTAL SCENES --- */}
      <WorldScene />
    </>
  );
};
