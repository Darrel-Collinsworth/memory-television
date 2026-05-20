import { useWorldStore } from './store/useWorldStore';
import { worlds } from './data/worlds';
import { MemoryTelevision } from './components/MemoryTelevision';
import { WorldScene } from './components/WorldScene';
import { DustParticles } from './components/DustParticles';
import { OrbitControls } from '@react-three/drei';
import { CameraController } from './components/CameraController';

export const Experience = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const debugMode = useWorldStore((state) => state.debugMode);

  // Dynamic environmental properties
  const isHome = currentWorld === 'home';
  
  // In debug mode, we override fog color and make it bright white or completely clear it
  const fogColor = debugMode ? '#22222b' : (isHome ? '#050508' : worlds[currentWorld].fogColor);
  const fogNear = debugMode ? 50 : 2.5;
  const fogFar = debugMode ? 200 : 9.0;
  
  return (
    <>
      {/* --- DYNAMIC RETRO-ATMOSPHERIC FOG --- */}
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* --- BASE SCENE LIGHTS & DEBUG OVERRIDES --- */}
      {debugMode ? (
        <>
          {/* Super bright flat ambient lighting for visual debugging */}
          <ambientLight intensity={2.2} color="#ffffff" />
          <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
          
          {/* OrbitControls allow free navigation around the TV mesh and spatial bounds */}
          <OrbitControls makeDefault />
        </>
      ) : (
        <>
          <ambientLight intensity={isHome ? 0.75 : 0.45} />
          
          {/* Front-right Key directional light to bring out TV depth & textures */}
          <directionalLight
            position={[1.5, 2.5, 2.0]}
            intensity={isHome ? 2.0 : 1.0}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Volumetric spotlight shining down onto the handheld CRT TV */}
          <spotLight
            position={[0, 4, 0.5]}
            angle={0.45}
            penumbra={1}
            intensity={isHome ? 3.5 : 1.5}
            color={isHome ? '#fff' : worlds[currentWorld].themeColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
        </>
      )}

      {/* Subtle floor grid to ground the user in spatial geometry */}
      <gridHelper 
        args={[40, 40, debugMode ? '#444455' : '#111118', debugMode ? '#222233' : '#07070a']} 
        position={[0, -1.8, 0]} 
      />

      {/* --- ATMOSPHERIC FLOATING DUST --- */}
      {!debugMode && (
        <DustParticles 
          count={isHome ? 120 : 180} 
          size={0.035} 
          speed={0.06} 
          areaSize={8.5} 
        />
      )}

      {/* --- EDGE-ZONE CAMERA PAN CONTROLLER --- */}
      <CameraController />

      {/* --- THE EXPLORATION CRT COMPANION (Handheld) --- */}
      <MemoryTelevision />

      {/* --- PORTAL ARTIST WORLDS (Dynamic environmental geometry & floating frames) --- */}
      <WorldScene />
    </>
  );
};
