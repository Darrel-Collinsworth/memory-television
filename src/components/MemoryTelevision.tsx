import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useWorldStore } from '../store/useWorldStore';
import { CRTScreen } from './CRTScreen';
import { worlds } from '../data/worlds';

export const MemoryTelevision = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const transitioning = useWorldStore((state) => state.transitioning);
  const tvRaised = useWorldStore((state) => state.tvRaised);
  const debugMode = useWorldStore((state) => state.debugMode);
  const hoveredWorld = useWorldStore((state) => state.hoveredWorld);
  const selectedArtifactId = useWorldStore((state) => state.selectedArtifactId);
  const setSelectedArtifactId = useWorldStore((state) => state.setSelectedArtifactId);

  const groupRef = useRef<THREE.Group>(null);
  const tvRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Belt-and-suspenders: whenever the world changes, immediately clear any lingering
  // artifact focus state so the CRT always starts in Exploration Mode in new worlds.
  useEffect(() => {
    setSelectedArtifactId(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorld]);

  // Smoothly lerped color ref for CRT dynamic glow
  const activeColorRef = useRef(new THREE.Color('#2563eb'));

  // Smoothly interpolate position, rotation, and scale based on active state
  useFrame((state) => {
    if (!groupRef.current || !tvRef.current) return;

    if (debugMode) {
      // Lock TV position, rotation and scale in Debug Mode for stable inspection
      groupRef.current.position.set(0, 0.08, -2.0);
      groupRef.current.rotation.set(0, 0, 0);
      tvRef.current.scale.set(0.65, 0.65, 0.65);
      return;
    }

    const time = state.clock.getElapsedTime();
    const isHome = currentWorld === 'home';

    // Target configuration for a waist-held retro TV companion
    // raised Y is slightly higher to prevent bottom cutoff (-0.32 rather than -0.42)
    let targetY = isHome ? -0.32 : -0.42;
    let targetZ = isHome ? -2.15 : -2.35;
    let targetScale = isHome ? 0.64 : 0.54;
    let targetRotX = isHome ? -0.38 : -0.44; // Slanted to look down at it

    if (!tvRaised) {
      targetY = isHome ? -1.85 : -2.1; // Placed at the bottom edge
      targetZ = isHome ? -2.25 : -2.45;
      targetScale = isHome ? 0.44 : 0.38;
      targetRotX = isHome ? -1.15 : -1.35; // Slanted almost flat to clear view
    }

    // --- ARTIFACT FOCUS MODE POSITION POSTURE ---
    const isFocused = selectedArtifactId !== null;
    if (isFocused) {
      targetY = 0.04;      // Center vertically in front of user
      targetZ = -1.78;     // Draw closer for intimate readability
      targetScale = 0.74;  // Enlarge modestly
      targetRotX = -0.12;  // Flatter slant so screen is legible, yet retains 3D depth
    }

    // Overlapping organic drifting (dual overlapping sines/cosines at prime frequencies)
    // Reduce sways by 70% during focus mode to stabilize the screen
    const swayMultiplier = isFocused ? 0.28 : 1.0;
    const swayX = (Math.sin(time * 0.7) * 0.012 + Math.cos(time * 1.1) * 0.008) * swayMultiplier;
    const swayY = (Math.cos(time * 0.9) * 0.015 + Math.sin(time * 1.3) * 0.01 + (transitioning ? Math.sin(time * 65) * 0.015 : 0)) * swayMultiplier;
    const swayZ = (Math.sin(time * 0.5) * 0.008 + Math.cos(time * 0.8) * 0.006) * swayMultiplier;
    const swayRotZ = (Math.sin(time * 0.4) * 0.006 + Math.cos(time * 0.7) * 0.004) * swayMultiplier;

    // Mouse Parallax (responsive to cursor movement)
    // Dampen mouse response slightly in focus mode to keep it readable
    const parallaxDamp = isFocused ? 0.22 : 1.0;
    const mouseX = tvRaised ? state.pointer.x * parallaxDamp : 0;
    const mouseY = tvRaised ? state.pointer.y * parallaxDamp : 0;

    // Relax the interpolation speed slightly during focus mode transitions (700-1200ms)
    // to give a slow, heavy, dreamlike "pull-in" look, settling securely.
    const lerpFactor = isFocused ? 0.045 : 0.08;
    const scaleFactor = isFocused ? 0.035 : 0.06;

    // Smooth interpolation (lerp) toward targets
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseX * 0.12 + swayX, lerpFactor);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + mouseY * 0.1 + swayY, lerpFactor);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ + swayZ, lerpFactor);

    const targetRotationX = targetRotX - mouseY * 0.15;
    const targetRotationY = mouseX * 0.22;
    const targetRotationZ = -mouseX * 0.06 + swayRotZ; // Rotational roll banking!

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, lerpFactor);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, lerpFactor);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, lerpFactor);

    const scale = THREE.MathUtils.lerp(tvRef.current.scale.x, targetScale, scaleFactor);
    tvRef.current.scale.set(scale, scale, scale);

    // Phosphor ambient light color smooth-interpolation
    const targetHex = hoveredWorld 
      ? worlds[hoveredWorld]?.themeColor 
      : (currentWorld !== 'home' ? worlds[currentWorld]?.themeColor : '#2563eb');
    const targetColor = new THREE.Color(targetHex);
    activeColorRef.current.lerp(targetColor, 0.1);

    if (lightRef.current) {
      // Simulate fast CRT flicker by adding high-frequency sin/cos waves
      const flicker = 1.0 + Math.sin(time * 38) * 0.07 + Math.cos(time * 52) * 0.04;
      const baseIntensity = hoveredWorld ? 2.2 : (currentWorld !== 'home' ? 1.8 : 1.2);
      lightRef.current.intensity = baseIntensity * flicker;
      lightRef.current.color.copy(activeColorRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={tvRef}>
        {/* Main TV Casing Group */}
        <group rotation={[0, 0, 0]}>
          
          {/* --- CHUNKY VINTAGE SILVER PLASTIC BEZEL/FRONT --- */}
          <group>
            {/* Main Bezel Casing */}
            <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
              <boxGeometry args={[2.5, 2.05, 0.38]} />
              <meshStandardMaterial 
                color="#c5c7ce" // Satin-silver painted plastic — early 2000s Zenith styling
                roughness={0.48} 
                metalness={0.12}
              />
            </mesh>

            {/* Rounded Bezel Edges to create heavy plastic consumer feeling */}
            {/* Rounded left edge column */}
            <mesh position={[-1.25, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.19, 0.19, 2.05, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>

            {/* Rounded right edge column */}
            <mesh position={[1.25, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.19, 0.19, 2.05, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>

            {/* Rounded top edge column */}
            <mesh position={[0, 1.105, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.19, 0.19, 2.5, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>

            {/* Rounded bottom edge column */}
            <mesh position={[0, -0.945, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.19, 0.19, 2.5, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>

            {/* Spheres at 4 corners */}
            {/* Top-left corner */}
            <mesh position={[-1.25, 1.105, 0]} castShadow>
              <sphereGeometry args={[0.19, 16, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>

            {/* Top-right corner */}
            <mesh position={[1.25, 1.105, 0]} castShadow>
              <sphereGeometry args={[0.19, 16, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>

            {/* Bottom-left corner */}
            <mesh position={[-1.25, -0.945, 0]} castShadow>
              <sphereGeometry args={[0.19, 16, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>

            {/* Bottom-right corner */}
            <mesh position={[1.25, -0.945, 0]} castShadow>
              <sphereGeometry args={[0.19, 16, 16]} />
              <meshStandardMaterial color="#c5c7ce" roughness={0.48} metalness={0.12} />
            </mesh>
          </group>

          {/* --- CUSTOM "BARRYNERVOUS" BRAND PLATE & BADGING (Top Bezel Center) --- */}
          <group position={[0, 0.92, 0.20]}>
            {/* Stylized Italic "B" logo badge */}
            <group position={[-0.45, 0, 0]}>
              {/* Outer oval chrome backing */}
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.045, 0.045, 0.01, 24]} />
                <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.08} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.001]}>
                <cylinderGeometry args={[0.038, 0.038, 0.01, 24]} />
                <meshStandardMaterial color="#111827" roughness={0.9} />
              </mesh>
              
              {/* 3D Italicized "B" structure (composed of double-layered meshes) */}
              <group position={[-0.005, 0, 0.006]}>
                {/* Slanted vertical stem */}
                <mesh position={[-0.015, 0, 0]} rotation={[0, 0, -0.15]} castShadow>
                  <boxGeometry args={[0.008, 0.045, 0.004]} />
                  <meshStandardMaterial color="#f9fafb" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Top loop segment */}
                <mesh position={[0.002, 0.011, 0]} rotation={[0, 0, -0.15]}>
                  <boxGeometry args={[0.024, 0.008, 0.004]} />
                  <meshStandardMaterial color="#f9fafb" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0.01, 0.005, 0]} rotation={[0, 0, -0.15]}>
                  <boxGeometry args={[0.008, 0.02, 0.004]} />
                  <meshStandardMaterial color="#f9fafb" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0.002, 0, 0]} rotation={[0, 0, -0.15]}>
                  <boxGeometry args={[0.024, 0.008, 0.004]} />
                  <meshStandardMaterial color="#f9fafb" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Bottom loop segment */}
                <mesh position={[0.004, -0.012, 0]} rotation={[0, 0, -0.15]}>
                  <boxGeometry args={[0.026, 0.008, 0.004]} />
                  <meshStandardMaterial color="#f9fafb" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0.012, -0.006, 0]} rotation={[0, 0, -0.15]}>
                  <boxGeometry args={[0.008, 0.02, 0.004]} />
                  <meshStandardMaterial color="#f9fafb" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            </group>

            {/* Elegant Italicized "BarryNervous" brand lettering */}
            <Html
              transform
              distanceFactor={1.4}
              position={[0.8, 0.15, 0.01]}
              style={{
                color: '#f3f4f6',
                fontFamily: '"Outfit", "Share Tech Mono", monospace, sans-serif',
                fontSize: '12px',
                fontWeight: '900',
                fontStyle: 'italic',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
                textTransform: 'uppercase',
                // textShadow: '1px 1px 0px #111827, 2px 2px 0px #4b5563',
              }}
            >
              BarryNervous
            </Html>
          </group>

          {/* --- DEEP TAPERED CRT BACK CASING --- */}
          {/* Substantial CRT posterior chassis representing cathode tube depth */}
          <mesh position={[0, 0.08, -0.95]} rotation={[Math.PI / 2, Math.PI / 4, 0]} castShadow>
            <cylinderGeometry args={[1.05, 1.48, 1.7, 4]} />
            <meshStandardMaterial 
              color="#1d1e22" // Classic dark textured high-impact back plastic
              roughness={0.75} 
              metalness={0.1}
            />
          </mesh>

          {/* Ventilation ribs flanking the rear chassis */}
          {[-0.4, -0.2, 0, 0.2, 0.4].map((xOffset, i) => (
            <mesh key={`vent-${i}`} position={[xOffset, 0.65, -1.3]} castShadow>
              <boxGeometry args={[0.08, 0.35, 0.5]} />
              <meshStandardMaterial color="#0c0d10" roughness={0.9} />
            </mesh>
          ))}

          {/* --- SIDE SPEAKER GRILLS (Running Vertically Left & Right of Screen) --- */}
          {/* Left Bezel Speaker Grill */}
          <group position={[-1.08, 0.18, 0.195]}>
            {/* Dark slot backing */}
            <mesh>
              <boxGeometry args={[0.12, 1.25, 0.01]} />
              <meshStandardMaterial color="#0a0b0d" roughness={0.9} />
            </mesh>
            {/* Grated slits */}
            {Array.from({ length: 4 }).map((_, j) => {
              const xPos = -0.045 + j * 0.03;
              return (
                <mesh key={`spk-l-slit-${j}`} position={[xPos, 0, 0.005]}>
                  <boxGeometry args={[0.015, 1.15, 0.005]} />
                  <meshStandardMaterial color="#334155" roughness={0.7} />
                </mesh>
              );
            })}
          </group>

          {/* Right Bezel Speaker Grill */}
          <group position={[1.08, 0.18, 0.195]}>
            {/* Dark slot backing */}
            <mesh>
              <boxGeometry args={[0.12, 1.25, 0.01]} />
              <meshStandardMaterial color="#0a0b0d" roughness={0.9} />
            </mesh>
            {/* Grated slits */}
            {Array.from({ length: 4 }).map((_, j) => {
              const xPos = -0.045 + j * 0.03;
              return (
                <mesh key={`spk-r-slit-${j}`} position={[xPos, 0, 0.005]}>
                  <boxGeometry args={[0.015, 1.15, 0.005]} />
                  <meshStandardMaterial color="#334155" roughness={0.7} />
                </mesh>
              );
            })}
          </group>

          {/* --- INNER SCREEN WINDOW FRAME BEZEL (Centered X, raised Y) --- */}
          <mesh position={[0, 0.18, 0.19]}>
            <boxGeometry args={[1.88, 1.42, 0.04]} />
            <meshStandardMaterial color="#0b0b0e" roughness={0.75} />
          </mesh>

          {/* --- DYNAMIC CRT SCREEN & AMBIENT GLOW --- */}
          {/* Active Ambient PointLight (casts glowing colors onto bezel & atmosphere) */}
          <pointLight
            ref={lightRef}
            position={[0, 0.18, 0.38]}
            distance={3.8}
            decay={1.8}
            castShadow
            shadow-bias={-0.001}
          />

          {/* Mathematically Curved Convex Screen Glass Overlay */}
          <mesh position={[0, 0.18, 0.195]}>
            {/* Rectangular segment of a large sphere for perfect CRT tube glass curvature */}
            <sphereGeometry args={[4.8, 32, 32, Math.PI - 0.1915, 0.383, Math.PI / 2 - 0.1438, 0.2875]} />
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.06}
              metalness={0.12}
              transparent
              opacity={0.16}
              transmission={0.92}
              ior={1.5}
              clearcoat={1.0}
              clearcoatRoughness={0.03}
              depthWrite={false}
            />
          </mesh>

          {/* Flat HTML Screen projection backing */}
          {/* distanceFactor controls the virtual render resolution: higher = sharper text */}
          <group position={[0, 0.18, 0.19]} rotation={[0, 0, 0]}>
            <Html
              transform
              distanceFactor={1.55}
              scale={[0.97, 1.04, 0.58]}
              position={[0, 0.05, 0.01]}
              style={{
                pointerEvents: 'auto',
              }}
            >
              <CRTScreen />
            </Html>
          </group>

          {/* --- BOTTOM TV/VCR COMBO DASHBOARD --- */}
          {/* Lower cabinet containing the mechanical VHS loader slot and physical tactile controls */}
          <group position={[0, -0.73, 0.19]}>
            
            {/* Dashboard Casing Backer Plate */}
            <mesh castShadow>
              <boxGeometry args={[1.84, 0.36, 0.02]} />
              <meshStandardMaterial color="#afb2b9" roughness={0.6} metalness={0.1} />
            </mesh>

            {/* Retro label printouts */}
            <Html
              transform
              distanceFactor={1.4}
              position={[-0.45, 0.14, 0.01]}
              style={{
                color: '#374151',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '5.5px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              HI-FI STEREO
            </Html>
            
            <Html
              transform
              distanceFactor={1.4}
              position={[0.45, 0.14, 0.01]}
              style={{
                color: '#374151',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '5.5px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              TV / VCR COMBO
            </Html>

            {/* --- VHS PLAYER TAPE SLOT & DOOR --- */}
            <group position={[0, 0.04, 0.005]}>
              {/* Outer slot boundary border */}
              <mesh castShadow>
                <boxGeometry args={[0.78, 0.17, 0.015]} />
                <meshStandardMaterial color="#91949c" roughness={0.4} metalness={0.25} />
              </mesh>
              {/* Dark internal loader cavity backing */}
              <mesh position={[0, 0, 0.005]}>
                <boxGeometry args={[0.74, 0.13, 0.01]} />
                <meshStandardMaterial color="#050608" roughness={0.9} />
              </mesh>
              {/* Slanted tape flap door */}
              <mesh position={[0, 0, 0.004]} rotation={[-0.06, 0, 0]}>
                <boxGeometry args={[0.72, 0.12, 0.004]} />
                <meshStandardMaterial color="#121317" roughness={0.7} metalness={0.08} />
              </mesh>
              {/* Indented door line crease */}
              <mesh position={[0, -0.05, 0.006]}>
                <boxGeometry args={[0.7, 0.004, 0.002]} />
                <meshStandardMaterial color="#050608" />
              </mesh>
              {/* Retro instructions printed on the tape door */}
              <Html
                transform
                distanceFactor={1.4}
                position={[0, 0.0, 0.008]}
                style={{
                  color: '#4b5563',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '4.5px',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                INSERT VIDEOCASSETTE ◄
              </Html>
            </group>

            {/* --- VCR MECHANICAL CONTROL STRIP --- */}
            <group position={[0, -0.09, 0.01]}>
              {/* EJECT */}
              <group position={[-0.22, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.046, 0.032, 0.012]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.6} />
                </mesh>
                <Html
                  transform
                  distanceFactor={1.4}
                  position={[0, 0.026, 0.002]}
                  style={{
                    color: '#4b5563',
                    fontFamily: 'monospace',
                    fontSize: '4.2px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  EJECT ⏏
                </Html>
              </group>

              {/* REWIND */}
              <group position={[-0.11, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.046, 0.032, 0.012]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.6} />
                </mesh>
                <Html
                  transform
                  distanceFactor={1.4}
                  position={[0, 0.026, 0.002]}
                  style={{
                    color: '#4b5563',
                    fontFamily: 'monospace',
                    fontSize: '4.2px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  REW ◄◄
                </Html>
              </group>

              {/* PLAY */}
              <group position={[0.0, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.046, 0.032, 0.012]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.6} />
                </mesh>
                <Html
                  transform
                  distanceFactor={1.4}
                  position={[0, 0.026, 0.002]}
                  style={{
                    color: '#4b5563',
                    fontFamily: 'monospace',
                    fontSize: '4.2px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  PLAY ►
                </Html>
              </group>

              {/* FAST-FORWARD */}
              <group position={[0.11, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.046, 0.032, 0.012]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.6} />
                </mesh>
                <Html
                  transform
                  distanceFactor={1.4}
                  position={[0, 0.026, 0.002]}
                  style={{
                    color: '#4b5563',
                    fontFamily: 'monospace',
                    fontSize: '4.2px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  FF ►►
                </Html>
              </group>

              {/* STOP */}
              <group position={[0.22, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.046, 0.032, 0.012]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.6} />
                </mesh>
                <Html
                  transform
                  distanceFactor={1.4}
                  position={[0, 0.026, 0.002]}
                  style={{
                    color: '#4b5563',
                    fontFamily: 'monospace',
                    fontSize: '4.2px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  STOP ■
                </Html>
              </group>

              {/* Orange Tape Status Bulb */}
              <group position={[0.31, 0, 0]}>
                <mesh position={[0, 0, 0.002]} castShadow>
                  <sphereGeometry args={[0.008, 8, 8]} />
                  <meshStandardMaterial 
                    color="#ea580c" 
                    emissive="#ea580c" 
                    emissiveIntensity={0.8}
                  />
                </mesh>
                <Html
                  transform
                  distanceFactor={1.4}
                  position={[0, 0.024, 0.002]}
                  style={{
                    color: '#4b5563',
                    fontFamily: 'monospace',
                    fontSize: '3px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  TAPE IN
                </Html>
              </group>
            </group>

            {/* --- PHYSICAL TELEVISION DIALS (Power button, Volume/Channel oval switches) --- */}
            {/* Round Power Button with green LED */}
            <group position={[-0.64, -0.03, 0.015]}>
              {/* Tactile Red Cap Cylinder */}
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.038, 0.038, 0.015, 24]} />
                <meshStandardMaterial color="#b91c1c" roughness={0.4} />
              </mesh>
              {/* Glowing Active indicator LED */}
              <mesh position={[0.055, 0, 0.005]} castShadow>
                <sphereGeometry args={[0.008, 8, 8]} />
                <meshStandardMaterial 
                  color="#22c55e" 
                  emissive="#22c55e" 
                  emissiveIntensity={1.4}
                />
              </mesh>
              <Html
                transform
                distanceFactor={1.4}
                position={[0, 0.05, 0.002]}
                style={{
                  color: '#374151',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '4.8px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                POWER
              </Html>
            </group>

            {/* Oval Tactile Volume Buttons */}
            <group position={[0.54, 0.03, 0.015]}>
              {/* Oval Vol - */}
              <mesh position={[-0.024, 0, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>
              <mesh position={[-0.024, 0, 0]}>
                <boxGeometry args={[0.032, 0.012, 0.012]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>
              
              {/* Oval Vol + */}
              <mesh position={[0.024, 0, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>
              <mesh position={[0.024, 0, 0]}>
                <boxGeometry args={[0.032, 0.012, 0.012]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>

              <Html
                transform
                distanceFactor={1.4}
                position={[0, 0.03, 0.002]}
                style={{
                  color: '#374151',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '4.5px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                VOL
              </Html>
            </group>

            {/* Oval Tactile Channel Buttons */}
            <group position={[0.54, -0.06, 0.015]}>
              {/* Oval Ch - */}
              <mesh position={[-0.024, 0, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>
              <mesh position={[-0.024, 0, 0]}>
                <boxGeometry args={[0.032, 0.012, 0.012]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>

              {/* Oval Ch + */}
              <mesh position={[0.024, 0, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>
              <mesh position={[0.024, 0, 0]}>
                <boxGeometry args={[0.032, 0.012, 0.012]} />
                <meshStandardMaterial color="#374151" roughness={0.65} />
              </mesh>

              <Html
                transform
                distanceFactor={1.4}
                position={[0, 0.03, 0.002]}
                style={{
                  color: '#374151',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '4.5px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                CH
              </Html>
            </group>

          </group>
          
        </group>
      </group>
    </group>
  );
};
