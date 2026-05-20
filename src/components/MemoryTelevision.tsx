import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useWorldStore } from '../store/useWorldStore';
import { CRTScreen } from './CRTScreen';

export const MemoryTelevision = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const transitioning = useWorldStore((state) => state.transitioning);
  const tvRaised = useWorldStore((state) => state.tvRaised);
  const debugMode = useWorldStore((state) => state.debugMode);
  const groupRef = useRef<THREE.Group>(null);
  const tvRef = useRef<THREE.Group>(null);

  // Smoothly interpolate position, rotation, and scale based on active state
  useFrame((state) => {
    if (!groupRef.current || !tvRef.current) return;

    if (debugMode) {
      // Lock TV position, rotation and scale in Debug Mode for stable inspection
      groupRef.current.position.set(0, 0, -2.0);
      groupRef.current.rotation.set(0, 0, 0);
      tvRef.current.scale.set(0.65, 0.65, 0.65);
      return;
    }

    const time = state.clock.getElapsedTime();
    const isHome = currentWorld === 'home';

    // Target configuration for a waist-held retro TV companion
    // If lowered (!tvRaised), it descends smoothly flat out of the way
    let targetY = isHome ? -0.55 : -0.85;
    let targetZ = isHome ? -2.2 : -2.4;
    let targetScale = isHome ? 0.65 : 0.54;
    let targetRotX = isHome ? -0.52 : -0.62; // Tilted up to look down at it

    if (!tvRaised) {
      targetY = isHome ? -1.95 : -2.2; // Placed at the bottom edge
      targetZ = isHome ? -2.3 : -2.5;
      targetScale = isHome ? 0.45 : 0.4;
      targetRotX = isHome ? -1.15 : -1.35; // Slanted almost flat to clear view
    }

    // Idle Sway (subtle breathing animation)
    const swayX = Math.sin(time * 0.8) * 0.015;
    const swayY = Math.cos(time * 1.1) * 0.02 + (transitioning ? Math.sin(time * 60) * 0.015 : 0); // Glitch vibration
    const swayZ = Math.sin(time * 0.5) * 0.01;
    const swayRotZ = Math.sin(time * 0.4) * 0.008;

    // Mouse Parallax (responsive to cursor movement)
    // Disabled when TV is lowered — camera does all the looking in explore mode
    const mouseX = tvRaised ? state.pointer.x : 0;
    const mouseY = tvRaised ? state.pointer.y : 0;
    
    // Smooth interpolation (lerp) toward targets
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseX * 0.15 + swayX, 0.08);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + mouseY * 0.12 + swayY, 0.08);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ + swayZ, 0.08);

    const targetRotationX = targetRotX - mouseY * 0.15;
    const targetRotationY = mouseX * 0.25;
    const targetRotationZ = swayRotZ;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.08);


    const scale = THREE.MathUtils.lerp(tvRef.current.scale.x, targetScale, 0.06);
    tvRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      <group ref={tvRef}>
        {/* Main TV Casing Group */}
        <group rotation={[0, 0, 0]}>
          
          {/* --- SLEEK 2000s CHARCOAL PLASTIC BEZEL/FRONT --- */}
          <group>
            {/* Main bezel flat box */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.9, 0.3]} />
              <meshStandardMaterial 
                color="#26272b" // Elegant matte dark charcoal plastic of the early 2000s Zenith
                roughness={0.65} 
                metalness={0.15}
              />
            </mesh>

            {/* Rounded left edge column */}
            <mesh position={[-1.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 1.9, 16]} />
              <meshStandardMaterial color="#26272b" roughness={0.65} metalness={0.15} />
            </mesh>

            {/* Rounded right edge column */}
            <mesh position={[1.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 1.9, 16]} />
              <meshStandardMaterial color="#26272b" roughness={0.65} metalness={0.15} />
            </mesh>

            {/* Rounded top edge column */}
            <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 2.2, 16]} />
              <meshStandardMaterial color="#26272b" roughness={0.65} metalness={0.15} />
            </mesh>

            {/* Rounded top-left corner sphere */}
            <mesh position={[-1.1, 0.95, 0]} castShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#26272b" roughness={0.65} metalness={0.15} />
            </mesh>

            {/* Rounded top-right corner sphere */}
            <mesh position={[1.1, 0.95, 0]} castShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#26272b" roughness={0.65} metalness={0.15} />
            </mesh>
          </group>

          {/* "zenith" Brand Logo on Top-Left Bezel */}
          <Html
            transform
            distanceFactor={1.5}
            position={[-0.92, 0.78, 0.16]}
            style={{
              color: '#a1a1aa',
              fontFamily: '"Share Tech Mono", monospace, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
              transform: 'translate(-50%, -50%)',
            }}
          >
            zenith
          </Html>

          {/* --- TAPERED BACK CASING (Zenith 2000s shape using a 4-sided cylinder) --- */}
          <mesh position={[0, 0, -0.65]} rotation={[Math.PI / 2, Math.PI / 4, 0]} castShadow>
            {/* args: [radiusTop, radiusBottom, height, radialSegments] */}
            {/* Rotate by 45 deg (PI/4) to align the four corners as a tapered box! */}
            <cylinderGeometry args={[0.85, 1.22, 1.1, 4]} />
            <meshStandardMaterial 
              color="#1b1c20" // Slightly darker back plastic
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>

          {/* Darker vent ribs on the tapered back */}
          {[-0.3, 0, 0.3].map((xOffset, i) => (
            <mesh key={`vent-${i}`} position={[xOffset, 0.45, -0.9]} castShadow>
              <boxGeometry args={[0.08, 0.3, 0.4]} />
              <meshStandardMaterial color="#0b0b0f" roughness={0.9} />
            </mesh>
          ))}

          {/* --- SLIGHTLY CURVED SCREEN FRAME BEZEL (Centered) --- */}
          {/* Bezel inner window for the glass screen */}
          <mesh position={[0, 0.15, 0.16]}>
            <boxGeometry args={[1.88, 1.42, 0.04]} />
            <meshStandardMaterial color="#0d0d12" roughness={0.8} />
          </mesh>

          {/* --- BOTTOM ZENITH DASHBOARD PANEL --- */}
          <group position={[0, -0.7, 0.15]}>
            
            {/* Left Speaker Grill - Slanted custom vertical slits */}
            <group position={[-0.8, 0.05, 0.01]}>
              {/* Dark background backing */}
              <mesh castShadow>
                <boxGeometry args={[0.55, 0.28, 0.01]} />
                <meshStandardMaterial color="#0b0b0f" roughness={0.9} />
              </mesh>
              {/* Vertical slats with progressive heights to match the trapezoidal Zenith grille */}
              {Array.from({ length: 9 }).map((_, j) => {
                const xPos = -0.22 + j * 0.055; // from -0.22 to 0.22
                // Slant: taller on the right (inner side, close to center) and shorter on the left (outer side)
                const height = 0.14 + (j * 0.012); // from 0.14 to 0.236
                const yPos = 0.08 - height / 2; // align top edges, bottom slants down!
                return (
                  <mesh key={`spk-l-slat-${j}`} position={[xPos, yPos, 0.006]}>
                    <boxGeometry args={[0.018, height, 0.006]} />
                    <meshStandardMaterial color="#26272b" roughness={0.7} />
                  </mesh>
                );
              })}
            </group>

            {/* Right Speaker Grill - Slanted custom vertical slits */}
            <group position={[0.8, 0.05, 0.01]}>
              {/* Dark background backing */}
              <mesh castShadow>
                <boxGeometry args={[0.55, 0.28, 0.01]} />
                <meshStandardMaterial color="#0b0b0f" roughness={0.9} />
              </mesh>
              {/* Vertical slats with progressive heights to match the trapezoidal Zenith grille */}
              {Array.from({ length: 9 }).map((_, j) => {
                const xPos = -0.22 + j * 0.055; // from -0.22 to 0.22
                // Slant: tallest at the left (inner side, close to center) and shortest at the right (outer side)
                const height = 0.236 - (j * 0.012); // from 0.236 to 0.14
                const yPos = 0.08 - height / 2; // align top edges, bottom slants down!
                return (
                  <mesh key={`spk-r-slat-${j}`} position={[xPos, yPos, 0.006]}>
                    <boxGeometry args={[0.018, height, 0.006]} />
                    <meshStandardMaterial color="#26272b" roughness={0.7} />
                  </mesh>
                );
              })}
            </group>

            {/* Silver/Chrome Stylized Zenith Logo Emblem (Center aligned above buttons) */}
            <group position={[0, 0.18, 0.02]}>
              {/* Outer oval ring */}
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.055, 0.055, 0.01, 24]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.002]}>
                <cylinderGeometry args={[0.045, 0.045, 0.01, 24]} />
                <meshStandardMaterial color="#0b0b0f" roughness={0.9} />
              </mesh>
              
              {/* Stylized shiny Zenith "Z" badge (lightning bolt-like 3-mesh Z) */}
              <group position={[0, 0, 0.006]}>
                {/* Top bar */}
                <mesh position={[0, 0.02, 0]}>
                  <boxGeometry args={[0.038, 0.006, 0.005]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.05} />
                </mesh>
                {/* Diagonal bar */}
                <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
                  <boxGeometry args={[0.006, 0.042, 0.005]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.05} />
                </mesh>
                {/* Bottom bar */}
                <mesh position={[0, -0.02, 0]}>
                  <boxGeometry args={[0.038, 0.006, 0.005]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.05} />
                </mesh>
              </group>
            </group>

            {/* Tiny printed labels under Z logo */}
            <Html
              transform
              distanceFactor={1.5}
              position={[-0.1, 0.08, 0.022]}
              style={{
                color: '#52525b',
                fontFamily: 'monospace',
                fontSize: '7px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
                transform: 'translate(-50%, -50%)',
              }}
            >
              SDTV
            </Html>
            <Html
              transform
              distanceFactor={1.5}
              position={[0.1, 0.08, 0.022]}
              style={{
                color: '#52525b',
                fontFamily: 'monospace',
                fontSize: '7px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
                transform: 'translate(-50%, -50%)',
              }}
            >
              stereo
            </Html>

            {/* Sleek control buttons under the screen */}
            {/* Power Button (with soft glowing green LED next to it) */}
            <group position={[-0.22, -0.04, 0.02]}>
              <mesh castShadow>
                <boxGeometry args={[0.06, 0.035, 0.015]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.5} />
              </mesh>
              {/* LED Power indicator */}
              <mesh position={[-0.048, 0, 0.01]} castShadow>
                <sphereGeometry args={[0.008, 8, 8]} />
                <meshStandardMaterial 
                  color="#10b981" 
                  emissive="#10b981" 
                  emissiveIntensity={1.2}
                />
              </mesh>
              <Html
                transform
                distanceFactor={1.5}
                position={[0, 0.026, 0.002]}
                style={{
                  color: '#71717a',
                  fontFamily: 'monospace',
                  fontSize: '5px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                POWER
              </Html>
            </group>

            {/* Menu Buttons (sleek rectangular plastic blocks with labels) */}
            {/* Volume Pair */}
            <group position={[-0.06, -0.04, 0.02]}>
              {/* Vol - */}
              <mesh position={[-0.022, 0, 0]} castShadow>
                <boxGeometry args={[0.032, 0.028, 0.012]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.6} />
              </mesh>
              {/* Vol + */}
              <mesh position={[0.022, 0, 0]} castShadow>
                <boxGeometry args={[0.032, 0.028, 0.012]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.6} />
              </mesh>
              <Html
                transform
                distanceFactor={1.5}
                position={[0, 0.026, 0.002]}
                style={{
                  color: '#71717a',
                  fontFamily: 'monospace',
                  fontSize: '5px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                VOLUME
              </Html>
            </group>

            {/* Channel Pair */}
            <group position={[0.06, -0.04, 0.02]}>
              {/* Ch - */}
              <mesh position={[-0.022, 0, 0]} castShadow>
                <boxGeometry args={[0.032, 0.028, 0.012]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.6} />
              </mesh>
              {/* Ch + */}
              <mesh position={[0.022, 0, 0]} castShadow>
                <boxGeometry args={[0.032, 0.028, 0.012]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.6} />
              </mesh>
              <Html
                transform
                distanceFactor={1.5}
                position={[0, 0.026, 0.002]}
                style={{
                  color: '#71717a',
                  fontFamily: 'monospace',
                  fontSize: '5px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                CHANNEL
              </Html>
            </group>

            {/* Inset Front RCA Input Jack Panel */}
            <group position={[0.26, -0.04, 0.01]}>
              {/* Inset background panel */}
              <mesh castShadow>
                <boxGeometry args={[0.22, 0.06, 0.01]} />
                <meshStandardMaterial color="#08080a" roughness={0.9} />
              </mesh>

              {/* RCA ports (Yellow, White, Red cylinders) */}
              {/* Yellow (Video) */}
              <group position={[-0.065, 0, 0.005]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.016, 0.016, 0.012, 12]} />
                  <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.1} />
                </mesh>
                {/* Silver outer metal ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.006]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.003, 12]} />
                  <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.008]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.002, 8]} />
                  <meshStandardMaterial color="#000000" />
                </mesh>
              </group>

              {/* White (Audio L) */}
              <group position={[0, 0, 0.005]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.016, 0.016, 0.012, 12]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.1} />
                </mesh>
                {/* Silver outer ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.006]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.003, 12]} />
                  <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.008]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.002, 8]} />
                  <meshStandardMaterial color="#000000" />
                </mesh>
              </group>

              {/* Red (Audio R) */}
              <group position={[0.065, 0, 0.005]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.016, 0.016, 0.012, 12]} />
                  <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.1} />
                </mesh>
                {/* Silver outer ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.006]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.003, 12]} />
                  <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.008]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.002, 8]} />
                  <meshStandardMaterial color="#000000" />
                </mesh>
              </group>

              {/* RCA Labels */}
              <Html
                transform
                distanceFactor={1.5}
                position={[-0.065, 0.04, 0.005]}
                style={{
                  color: '#71717a',
                  fontFamily: 'monospace',
                  fontSize: '4.5px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                VIDEO
              </Html>
              <Html
                transform
                distanceFactor={1.5}
                position={[0.032, 0.04, 0.005]}
                style={{
                  color: '#71717a',
                  fontFamily: 'monospace',
                  fontSize: '4.5px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                AUDIO L/R
              </Html>
            </group>
          </group>

          {/* --- RE-PROJECTED HTML SCREEN GLASS & CONTAINER (Centered X, raised Y) --- */}
          <group position={[0, 0.15, 0.15]} rotation={[0, 0, 0]}>
            {/* The physical convex screen glass */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[1.84, 1.38]} />
              <meshPhysicalMaterial
                color="#06060c"
                roughness={0.15}
                metalness={0.1}
                transparent
                opacity={0.3}
                transmission={0.85}
                ior={1.52}
                clearcoat={1.0}
                clearcoatRoughness={0.08}
              />
            </mesh>

            {/* Drei HTML Screen Projection Component */}
            {/* Adjusted distanceFactor to fit the wider 1.84 x 1.38 centered screen perfectly! */}
            <Html
              transform
              distanceFactor={2.58}
              position={[0, 0, 0.02]} // Placed slightly in front of the glass mesh to prevent clipping
              style={{
                pointerEvents: 'auto',
              }}
            >
              <CRTScreen />
            </Html>
          </group>
          
        </group>
      </group>
    </group>
  );
};
