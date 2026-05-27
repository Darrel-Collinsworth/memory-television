import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MemoryFragmentField } from './MemoryFragmentField';
import { useWorldStore } from '../store/useWorldStore';

// ---------------------------------------------------------------------------
// MEMORY CARD DATA
// Each card is a floating image-frame placeholder. When you're ready,
// swap `color` for a real texture URL and render <meshBasicMaterial map={...}>
// or a <Html> overlay with a real photo/artwork.
// ---------------------------------------------------------------------------
interface MemoryCard {
  id: string;
  label: string;
  sublabel: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  frameColor: string;
  scale: [number, number]; // [width, height]
  floatSpeed: number;
  floatAmp: number;
  floatOffset: number;
}

const MEMORY_CARDS: MemoryCard[] = [
  {
    id: 'mem-1',
    label: 'A Memory',
    sublabel: 'childhood · placeholder',
    position: [-3.6, 1.0, -6.5],
    rotation: [0, 0.28, 0.04],
    color: '#d4b8f0',     // soft lavender
    frameColor: '#c4a0e8',
    scale: [1.6, 2.0],
    floatSpeed: 0.38,
    floatAmp: 0.12,
    floatOffset: 0,
  },
  {
    id: 'mem-2',
    label: 'A Feeling',
    sublabel: 'warmth · placeholder',
    position: [3.8, 0.7, -6.2],
    rotation: [0, -0.32, -0.03],
    color: '#f0d0b0',     // warm peach
    frameColor: '#e8b888',
    scale: [1.5, 1.9],
    floatSpeed: 0.44,
    floatAmp: 0.14,
    floatOffset: 1.3,
  },
  {
    id: 'mem-3',
    label: 'A Place',
    sublabel: 'somewhere far · placeholder',
    position: [0, 2.2, -8.5],
    rotation: [0.06, 0, 0],
    color: '#b0d8c8',     // soft mint
    frameColor: '#88c4aa',
    scale: [2.6, 1.6],
    floatSpeed: 0.30,
    floatAmp: 0.10,
    floatOffset: 2.2,
  },
  {
    id: 'mem-4',
    label: 'A Sound',
    sublabel: 'echoing · placeholder',
    position: [-5.2, 0.3, -5.2],
    rotation: [0, 0.52, 0.05],
    color: '#f0e0b0',     // soft gold
    frameColor: '#e8c878',
    scale: [1.3, 1.7],
    floatSpeed: 0.42,
    floatAmp: 0.13,
    floatOffset: 0.9,
  },
  {
    id: 'mem-5',
    label: 'A Dream',
    sublabel: 'recurring · placeholder',
    position: [5.2, 1.2, -5.8],
    rotation: [0.03, -0.48, -0.04],
    color: '#b8d0f0',     // sky periwinkle
    frameColor: '#90b4e8',
    scale: [1.8, 1.4],
    floatSpeed: 0.35,
    floatAmp: 0.11,
    floatOffset: 1.9,
  },
];

// ---------------------------------------------------------------------------
// AMBIENT ORBS — pure atmosphere, no content. These are the soft glowing
// specks that drift through the memory sky to make it feel alive.
// ---------------------------------------------------------------------------
interface AmbientOrb {
  id: string;
  position: [number, number, number];
  color: string;
  emissive: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  bobAmp: number;
}

const AMBIENT_ORBS: AmbientOrb[] = [
  { id: 'orb-1', position: [-5, 3.5, -9],  color: '#f8e8d8', emissive: '#f0d0b0', size: 0.18, orbitRadius: 0.4, orbitSpeed: 0.22, orbitOffset: 0,    bobAmp: 0.3 },
  { id: 'orb-2', position: [6.5, 2.5, -11],color: '#e8d8f8', emissive: '#d0b8f0', size: 0.13, orbitRadius: 0.3, orbitSpeed: 0.18, orbitOffset: 2.4,   bobAmp: 0.25 },
  { id: 'orb-3', position: [-2, 4.5, -10], color: '#d8f0e8', emissive: '#b0e8cc', size: 0.10, orbitRadius: 0.5, orbitSpeed: 0.28, orbitOffset: 1.1,   bobAmp: 0.4 },
  { id: 'orb-4', position: [2.5, 5, -9],   color: '#f8f0d8', emissive: '#f0e0a0', size: 0.15, orbitRadius: 0.35,orbitSpeed: 0.20, orbitOffset: 3.2,   bobAmp: 0.2 },
  { id: 'orb-5', position: [-7, 1.5, -8],  color: '#d8e8f8', emissive: '#a8c8f0', size: 0.12, orbitRadius: 0.45,orbitSpeed: 0.25, orbitOffset: 4.5,   bobAmp: 0.35 },
  { id: 'orb-6', position: [0.5, 3, -12],  color: '#f8d8e8', emissive: '#f0a8c8', size: 0.09, orbitRadius: 0.3, orbitSpeed: 0.32, orbitOffset: 0.7,   bobAmp: 0.28 },
];

// ---------------------------------------------------------------------------
// SMALL FLOATING ISLAND ROCKS — drift gently around the main island
// ---------------------------------------------------------------------------
const ISLAND_ROCKS = [
  { id: 'rock-1', position: [-2.2, -1.5, -2.0] as [number,number,number], scale: [0.4, 0.2, 0.35] as [number,number,number], bobOffset: 0    },
  { id: 'rock-2', position: [2.5,  -1.4, -1.8] as [number,number,number], scale: [0.3, 0.15, 0.28] as [number,number,number], bobOffset: 1.4  },
  { id: 'rock-3', position: [-0.5, -1.6, -2.8] as [number,number,number], scale: [0.25, 0.12, 0.22] as [number,number,number], bobOffset: 2.8 },
  { id: 'rock-4', position: [1.8,  -1.7, -3.2] as [number,number,number], scale: [0.35, 0.18, 0.3] as [number,number,number], bobOffset: 0.7  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
export const HubEnvironment = () => {
  const cardGroupRef   = useRef<THREE.Group>(null);
  const cardRefs       = useRef<(THREE.Group | null)[]>([]);
  const orbRefs        = useRef<(THREE.Mesh | null)[]>([]);
  const rockRefs       = useRef<(THREE.Mesh | null)[]>([]);
  const islandRef      = useRef<THREE.Group>(null);

  const selectedArtifactId = useWorldStore((state) => state.selectedArtifactId);
  const lightDamp = selectedArtifactId ? 0.70 : 1.0;

  // Generate a beautiful, oddly nostalgic sunset gradient texture procedurally via code.
  // This keeps loading extremely snappy (0ms assets delay) and perfectly performant.
  const skyTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Nostalgic vertical sunset gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0.0, '#292569');  // Top of sky: violet blue
    grad.addColorStop(0.35, '#8f4c8b'); // Upper middle: warm magenta lavender
    grad.addColorStop(0.70, '#e36e59'); // Lower middle: pinkish orange
    grad.addColorStop(1.0, '#b22b3b');  // Bottom horizon: deep reddish sunset red

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);


  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle slow drift for the whole card group
    if (cardGroupRef.current) {
      cardGroupRef.current.rotation.y = Math.sin(t * 0.06) * 0.018;
    }

    // Individual card float — each has its own speed/amplitude/offset
    MEMORY_CARDS.forEach((card, i) => {
      const ref = cardRefs.current[i];
      if (!ref) return;
      ref.position.y = card.position[1] + Math.sin(t * card.floatSpeed + card.floatOffset) * card.floatAmp;
      // Gentle sway
      ref.rotation.z = card.rotation[2] + Math.sin(t * card.floatSpeed * 0.6 + card.floatOffset) * 0.012;
    });

    // Ambient orbs — small orbit + bob
    AMBIENT_ORBS.forEach((orb, i) => {
      const ref = orbRefs.current[i];
      if (!ref) return;
      ref.position.x = orb.position[0] + Math.cos(t * orb.orbitSpeed + orb.orbitOffset) * orb.orbitRadius;
      ref.position.y = orb.position[1] + Math.sin(t * orb.orbitSpeed * 1.3 + orb.orbitOffset) * orb.bobAmp;
      ref.position.z = orb.position[2] + Math.sin(t * orb.orbitSpeed + orb.orbitOffset) * orb.orbitRadius * 0.5;
    });

    // Floating rocks around island
    ISLAND_ROCKS.forEach((rock, i) => {
      const ref = rockRefs.current[i];
      if (!ref) return;
      ref.position.y = rock.position[1] + Math.sin(t * 0.35 + rock.bobOffset) * 0.08;
      ref.rotation.y = t * 0.08 + rock.bobOffset;
    });

    // Island gentle sway
    if (islandRef.current) {
      islandRef.current.rotation.z = Math.sin(t * 0.15) * 0.005;
    }
  });

  return (
    <group>
      {/* ---------------------------------------------------------------- */}
      {/* HUB LIGHTING — warm, ethereal, multi-directional                  */}
      {/* ---------------------------------------------------------------- */}

      {/* Sky hemisphere: warm golden sky above, soft earth-cream below */}
      <hemisphereLight
        args={['#c8d8f0', '#e8d4b8', 0.9 * lightDamp]}
      />

      {/* Main warm sun — upper right, golden hour feel */}
      <directionalLight
        position={[8, 14, 4]}
        intensity={1.6 * lightDamp}
        color="#ffe8c0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Cool sky-fill from upper left — gives depth and separation */}
      <directionalLight
        position={[-6, 8, -3]}
        intensity={0.5 * lightDamp}
        color="#d0e4f8"
      />

      {/* Soft lavender bounce from below — fills shadows warmly */}
      <pointLight
        position={[0, -1.5, -3]}
        intensity={0.8 * lightDamp}
        distance={12}
        color="#e8d0f8"
      />

      {/* ---------------------------------------------------------------- */}
      {/* SKY DOME — large inverted sphere, reads as the horizon/atmosphere */}
      {/* The fog in Experience.tsx blends geometry into this sky color     */}
      {/* ---------------------------------------------------------------- */}
      <mesh>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial map={skyTexture || undefined} side={THREE.BackSide} />
      </mesh>


      {/* ---------------------------------------------------------------- */}
      {/* FLOATING ISLAND                                                    */}
      {/* ---------------------------------------------------------------- */}
      <group ref={islandRef} position={[0, -2.0, -2.0]}>

        {/* Main island body — warm stone, slightly tapered disc */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2.6, 2.2, 0.55, 40]} />
          <meshStandardMaterial
            color="#c4b49a"
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>

        {/* Top surface — mossy/grassy soft sage layer */}
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <cylinderGeometry args={[2.58, 2.58, 0.08, 40]} />
          <meshStandardMaterial
            color="#a8c49a"
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>

        {/* Underside — slightly darker stone */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[2.2, 1.6, 0.15, 40]} />
          <meshStandardMaterial color="#a09080" roughness={0.9} />
        </mesh>



        {/* Soft mossy bump — central raised bit */}
        <mesh position={[0.3, 0.35, 0.4]} castShadow>
          <sphereGeometry args={[0.6, 16, 12]} />
          <meshStandardMaterial color="#98b888" roughness={0.95} />
        </mesh>
        <mesh position={[-0.5, 0.32, -0.2]} castShadow>
          <sphereGeometry args={[0.4, 12, 10]} />
          <meshStandardMaterial color="#a0c090" roughness={0.95} />
        </mesh>
      </group>

      {/* Floating satellite rocks around the island */}
      {ISLAND_ROCKS.map((rock, i) => (
        <mesh
          key={rock.id}
          ref={(el) => { rockRefs.current[i] = el; }}
          position={rock.position}
          scale={rock.scale}
          castShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#b8a890" roughness={0.9} />
        </mesh>
      ))}

      {/* ---------------------------------------------------------------- */}
      {/* FLOATING MEMORY CARDS                                             */}
      {/* Modular placeholder frames — replace color/label with real images */}
      {/* ---------------------------------------------------------------- */}
      <group ref={cardGroupRef}>
        {MEMORY_CARDS.map((card, i) => (
          <group
            key={card.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            position={card.position}
            rotation={card.rotation}
          >
            {/* Card fill (the "image" area) */}
            <mesh>
              <planeGeometry args={card.scale} />
              <meshStandardMaterial
                color={card.color}
                roughness={0.3}
                metalness={0.05}
                transparent
                opacity={0.82}
              />
            </mesh>

            {/* Thin frame border — slightly raised in front */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[card.scale[0] + 0.06, card.scale[1] + 0.06]} />
              <meshStandardMaterial
                color={card.frameColor}
                roughness={0.4}
                metalness={0.1}
                transparent
                opacity={0.65}
              />
            </mesh>

            {/* Soft inner glow plane */}
            <mesh position={[0, 0, 0.005]}>
              <planeGeometry args={[card.scale[0] - 0.1, card.scale[1] - 0.1]} />
              <meshBasicMaterial
                color={card.color}
                transparent
                opacity={0.25}
              />
            </mesh>

            {/* Label cluster — bottom of card */}
            <group position={[0, -card.scale[1] / 2 + 0.18, 0.02]}>
              {/* Label background pill */}
              <mesh>
                <planeGeometry args={[card.scale[0] - 0.1, 0.28]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.22} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* AMBIENT ORBS — soft drifting light specks                        */}
      {/* ---------------------------------------------------------------- */}
      {AMBIENT_ORBS.map((orb, i) => (
        <mesh
          key={orb.id}
          ref={(el) => { orbRefs.current[i] = el; }}
          position={orb.position}
        >
          <sphereGeometry args={[orb.size, 10, 10]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.emissive}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.0}
            transparent
            opacity={0.75}
          />
        </mesh>
      ))}

      {/* ---------------------------------------------------------------- */}
      {/* DISTANCE HAZE CLOUDS — simple stretched spheres for atmosphere   */}
      {/* ---------------------------------------------------------------- */}
      {[
        { pos: [-8, 2, -14] as [number,number,number],  s: [3.0, 0.7, 2.0] as [number,number,number], op: 0.12 },
        { pos: [9, 3, -13] as [number,number,number],   s: [2.5, 0.6, 1.8] as [number,number,number], op: 0.10 },
        { pos: [0, 4.5, -16] as [number,number,number], s: [4.0, 0.8, 2.5] as [number,number,number], op: 0.09 },
        { pos: [-5, 1.5, -16] as [number,number,number],s: [2.0, 0.5, 1.5] as [number,number,number], op: 0.08 },
      ].map((cloud, i) => (
        <mesh key={`cloud-${i}`} position={cloud.pos} scale={cloud.s}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color="#f0eef8" transparent opacity={cloud.op} />
        </mesh>
      ))}

      {/* ---------------------------------------------------------------- */}
      {/* MEMORY FRAGMENT FIELD / ECOLOGY SYSTEM                            */}
      {/* ---------------------------------------------------------------- */}
      <MemoryFragmentField />
    </group>
  );
};
