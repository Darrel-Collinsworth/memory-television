import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// MEMORY FRAGMENT INTERFACE
// ---------------------------------------------------------------------------
export interface MemoryFragment {
  id: string;
  title: string;
  type: 'image-card' | 'photo-plane' | 'abstract-blob' | 'floating-frame' | 'paper-sheet' | 'geometric-artifact' | 'lowpoly-model' | 'vhs-cassette' | 'crt-fragment' | 'collage-stack' | 'ribbon-spool';
  imageUrl?: string;      // Hook for user to add their image assets later
  modelUrl?: string;     // Hook for user to load custom .gltf/.glb models later
  color: string;          // Placeholder base color
  position: [number, number, number]; // Initial anchor position
  scale: [number, number, number] | number;
  driftSpeed: number;     // Linear horizontal drift speed
  driftAmp: number;       // Drift boundaries sway amplitude
  rotationSpeed: [number, number, number]; // Speed of spin on X, Y, Z axes
  bobSpeed: number;       // Vertical floating speed
  bobAmp: number;         // Vertical floating height
  opacity?: number;       // For atmospheric depth
}

// ---------------------------------------------------------------------------
// MEMORY ECOLOGY DATA LIST (24 drifting items)
// ---------------------------------------------------------------------------
const MEMORY_FRAGMENTS: MemoryFragment[] = [
  // --- FOREGROUND: Close-up, highly readable cards and photo planes ---
  {
    id: 'frag-1',
    title: 'First Digital Sketch - 2004',
    type: 'image-card',
    color: '#ecc9a8', // warm sandstone/peach
    position: [-2.8, 1.6, -4.8],
    scale: [0.7, 0.9, 1],
    driftSpeed: 0.12,
    driftAmp: 0.2,
    rotationSpeed: [0.04, 0.08, 0.02],
    bobSpeed: 0.45,
    bobAmp: 0.12,
    opacity: 0.95
  },
  {
    id: 'frag-2',
    title: 'Childhood Yard Silhouette',
    type: 'photo-plane',
    color: '#a8d5e2', // warm sky blue
    position: [2.9, 2.2, -5.2],
    scale: [1.1, 0.6, 1],
    driftSpeed: 0.08,
    driftAmp: 0.15,
    rotationSpeed: [-0.02, 0.06, -0.04],
    bobSpeed: 0.38,
    bobAmp: 0.10,
    opacity: 0.92
  },
  {
    id: 'frag-3',
    title: 'Nostalgic Toy Blocks',
    type: 'lowpoly-model', // Placeholder for toy model from youth
    color: '#e5989b', // soft clay rose
    position: [-1.8, 0.2, -4.2],
    scale: 0.45,
    driftSpeed: 0.15,
    driftAmp: 0.25,
    rotationSpeed: [0.12, 0.05, 0.08],
    bobSpeed: 0.52,
    bobAmp: 0.15,
    opacity: 0.96
  },
  {
    id: 'frag-4',
    title: 'Self-Portrait Sketch',
    type: 'paper-sheet',
    color: '#f7edd2', // vintage paper cream
    position: [1.6, 0.5, -4.5],
    scale: [0.6, 0.8, 1],
    driftSpeed: 0.10,
    driftAmp: 0.18,
    rotationSpeed: [0.06, -0.05, 0.12],
    bobSpeed: 0.40,
    bobAmp: 0.14,
    opacity: 0.94
  },

  // --- MIDGROUND: Drifting art fragments, crystal artifacts, shapes ---
  {
    id: 'frag-5',
    title: 'Voxel Horizon Render',
    type: 'image-card',
    color: '#d6ccd3', // soft lilac
    position: [-4.2, 2.4, -7.5],
    scale: [1.2, 0.8, 1],
    driftSpeed: 0.05,
    driftAmp: 0.35,
    rotationSpeed: [0.01, 0.04, -0.02],
    bobSpeed: 0.32,
    bobAmp: 0.22,
    opacity: 0.85
  },
  {
    id: 'frag-6',
    title: 'Idea Flow - Abstract Blob',
    type: 'abstract-blob',
    color: '#95e1d3', // glowing pastel mint
    position: [4.5, 1.8, -8.2],
    scale: 0.65,
    driftSpeed: 0.06,
    driftAmp: 0.4,
    rotationSpeed: [0.08, 0.12, 0.05],
    bobSpeed: 0.28,
    bobAmp: 0.25,
    opacity: 0.88
  },
  {
    id: 'frag-7',
    title: 'Golden Ratio Prism',
    type: 'geometric-artifact',
    color: '#fce38a', // vibrant golden pastel
    position: [-0.2, 3.4, -6.8],
    scale: 0.4,
    driftSpeed: 0.09,
    driftAmp: 0.2,
    rotationSpeed: [0.15, 0.18, 0.22],
    bobSpeed: 0.6,
    bobAmp: 0.08,
    opacity: 0.90
  },
  {
    id: 'frag-8',
    title: 'Golden Years VHS Tape',
    type: 'vhs-cassette', // Vintage tape cassette
    color: '#ffe5ec', // soft pastel labels
    position: [3.8, 3.1, -7.0],
    scale: 0.75,
    driftSpeed: 0.07,
    driftAmp: 0.28,
    rotationSpeed: [0.05, 0.10, 0.05],
    bobSpeed: 0.35,
    bobAmp: 0.18,
    opacity: 0.86
  },
  {
    id: 'frag-9',
    title: 'Surreal Coast Sketchbook',
    type: 'paper-sheet',
    color: '#eaeaea', // light grey sketch paper
    position: [-3.5, 0.4, -6.5],
    scale: [0.8, 0.5, 1],
    driftSpeed: 0.11,
    driftAmp: 0.3,
    rotationSpeed: [0.08, -0.08, 0.06],
    bobSpeed: 0.44,
    bobAmp: 0.13,
    opacity: 0.88
  },
  {
    id: 'frag-10',
    title: 'Empty Frame of Perspective',
    type: 'floating-frame',
    color: '#ffaaa6', // warm coral peach
    position: [0.3, 0.8, -8.0],
    scale: 0.85,
    driftSpeed: 0.04,
    driftAmp: 0.45,
    rotationSpeed: [-0.04, 0.03, 0.08],
    bobSpeed: 0.25,
    bobAmp: 0.3,
    opacity: 0.82
  },

  // --- BACKGROUND: Distant skylight elements, silhouettes, dream haze ---
  {
    id: 'frag-11',
    title: 'Distant Horizon Memory',
    type: 'photo-plane',
    color: '#e8dbfc', // pale lavender haze
    position: [-6.5, 3.6, -11.5],
    scale: [2.2, 1.2, 1],
    driftSpeed: 0.02,
    driftAmp: 0.6,
    rotationSpeed: [0.01, 0.02, 0.005],
    bobSpeed: 0.18,
    bobAmp: 0.4,
    opacity: 0.45
  },
  {
    id: 'frag-12',
    title: 'Dream Node - Amorphous Wave',
    type: 'abstract-blob',
    color: '#ffd3b6', // soft golden cream
    position: [6.8, 4.2, -12.0],
    scale: 1.15,
    driftSpeed: 0.015,
    driftAmp: 0.8,
    rotationSpeed: [0.03, 0.05, 0.04],
    bobSpeed: 0.15,
    bobAmp: 0.5,
    opacity: 0.40
  },
  {
    id: 'frag-13',
    title: 'Geometric Floating Obelisk',
    type: 'geometric-artifact',
    color: '#d4f0fc', // reflective mist blue
    position: [-5.0, -0.8, -9.5],
    scale: 0.6,
    driftSpeed: 0.03,
    driftAmp: 0.5,
    rotationSpeed: [0.06, 0.08, 0.05],
    bobSpeed: 0.24,
    bobAmp: 0.35,
    opacity: 0.55
  },
  {
    id: 'frag-14',
    title: 'Surreal TV Chassis',
    type: 'crt-fragment', // Vintage CRT cabinet piece
    color: '#d5bdaf', // wood-like warmth
    position: [5.2, -0.5, -10.5],
    scale: 0.9,
    driftSpeed: 0.025,
    driftAmp: 0.65,
    rotationSpeed: [0.02, 0.04, 0.02],
    bobSpeed: 0.20,
    bobAmp: 0.38,
    opacity: 0.50
  },
  {
    id: 'frag-15',
    title: 'Distant Toy Pedestal',
    type: 'lowpoly-model',
    color: '#f7d6e0', // pale pink rose
    position: [1.8, 4.8, -11.0],
    scale: 0.75,
    driftSpeed: 0.02,
    driftAmp: 0.5,
    rotationSpeed: [0.03, 0.06, 0.03],
    bobSpeed: 0.22,
    bobAmp: 0.42,
    opacity: 0.48
  },
  {
    id: 'frag-16',
    title: 'Nostalgic Sky Fragment',
    type: 'image-card',
    color: '#eff9f0', // soft organic white/green
    position: [-1.2, 5.2, -12.5],
    scale: [1.8, 1.4, 1],
    driftSpeed: 0.012,
    driftAmp: 0.75,
    rotationSpeed: [-0.01, 0.03, 0.015],
    bobSpeed: 0.14,
    bobAmp: 0.48,
    opacity: 0.42
  },

  // --- OUTLYING HORIZON SILHOUETTES: Floating objects at the edges of scope ---
  { id: 'frag-17', title: 'Sky Sketch #1', type: 'paper-sheet', color: '#eae4db', position: [-8.5, 1.2, -13.5], scale: [1.5, 1.0, 1], driftSpeed: 0.01, driftAmp: 0.8, rotationSpeed: [0.02, 0.03, 0.04], bobSpeed: 0.12, bobAmp: 0.6, opacity: 0.35 },
  { id: 'frag-18', title: 'Sky Sketch #2', type: 'paper-sheet', color: '#eae4db', position: [8.5, 0.8, -13.5], scale: [1.3, 0.9, 1], driftSpeed: 0.01, driftAmp: 0.8, rotationSpeed: [0.03, -0.02, 0.03], bobSpeed: 0.11, bobAmp: 0.55, opacity: 0.35 },
  { id: 'frag-19', title: 'Ethereal Cloud Orb', type: 'abstract-blob', color: '#ffb3ba', position: [-10, 5, -15], scale: 1.8, driftSpeed: 0.008, driftAmp: 1.0, rotationSpeed: [0.01, 0.02, 0.01], bobSpeed: 0.08, bobAmp: 0.8, opacity: 0.25 },
  { id: 'frag-20', title: 'Ethereal Cloud Crystal', type: 'geometric-artifact', color: '#baffc9', position: [10, 5.5, -15], scale: 1.2, driftSpeed: 0.009, driftAmp: 0.9, rotationSpeed: [0.04, 0.05, 0.03], bobSpeed: 0.09, bobAmp: 0.75, opacity: 0.28 },
  { id: 'frag-21', title: 'Magnetic Ribbons of Memory', type: 'ribbon-spool', color: '#ecc9a8', position: [-12, -2, -14], scale: 2.2, driftSpeed: 0.005, driftAmp: 1.2, rotationSpeed: [0.01, 0.015, 0.005], bobSpeed: 0.06, bobAmp: 0.9, opacity: 0.22 },
  { id: 'frag-22', title: 'Horizon Gate Right', type: 'floating-frame', color: '#bae1ff', position: [12, -2, -14], scale: 2.2, driftSpeed: 0.005, driftAmp: 1.2, rotationSpeed: [0.01, -0.015, 0.005], bobSpeed: 0.06, bobAmp: 0.9, opacity: 0.22 },
  { id: 'frag-23', title: 'Nostalgic Childhood Castle Block', type: 'lowpoly-model', color: '#ffffba', position: [-4, 6.5, -14], scale: 1.4, driftSpeed: 0.007, driftAmp: 1.1, rotationSpeed: [0.02, 0.04, 0.02], bobSpeed: 0.07, bobAmp: 0.85, opacity: 0.32 },
  { id: 'frag-24', title: 'Distant Memory Obelisk 2', type: 'geometric-artifact', color: '#ffdfba', position: [4, 6.8, -14], scale: 1.1, driftSpeed: 0.007, driftAmp: 1.1, rotationSpeed: [0.03, 0.03, 0.05], bobSpeed: 0.07, bobAmp: 0.85, opacity: 0.32 },

  // --- FAR PANORAMIC CLUSTERS: Far Left & Far Right to fill the ~194° view ---
  {
    id: 'frag-25',
    title: 'Sketched Blueprints - 2008',
    type: 'paper-sheet',
    color: '#dbe5df', // blueprint soft cyan-grey
    position: [-4.8, 1.0, -1.5],
    scale: [0.55, 0.75, 1],
    driftSpeed: 0.14,
    driftAmp: 0.18,
    rotationSpeed: [0.08, 0.04, 0.10],
    bobSpeed: 0.48,
    bobAmp: 0.12,
    opacity: 0.93
  },
  {
    id: 'frag-26',
    title: 'First Concert Ticket Stub',
    type: 'image-card',
    color: '#fcd5ce', // peach pink ticket
    position: [4.8, 0.8, -1.2],
    scale: [0.7, 0.5, 1],
    driftSpeed: 0.12,
    driftAmp: 0.20,
    rotationSpeed: [-0.05, 0.08, 0.05],
    bobSpeed: 0.42,
    bobAmp: 0.14,
    opacity: 0.95
  },
  {
    id: 'frag-27',
    title: 'Seattle Memory Stack',
    type: 'collage-stack', // Stacked physical sheets
    color: '#fbc4b6', // soft orange glow photo
    position: [-6.8, 2.4, 0.5],
    scale: [1.1, 1.1, 1],
    driftSpeed: 0.06,
    driftAmp: 0.30,
    rotationSpeed: [0.02, 0.05, -0.01],
    bobSpeed: 0.30,
    bobAmp: 0.20,
    opacity: 0.84
  },
  {
    id: 'frag-28',
    title: 'Old Wooden Train Car - Toy',
    type: 'lowpoly-model',
    color: '#e5989b', // clay rose wooden toy
    position: [7.0, 2.0, 1.5],
    scale: 0.48,
    driftSpeed: 0.08,
    driftAmp: 0.28,
    rotationSpeed: [0.05, 0.09, 0.05],
    bobSpeed: 0.36,
    bobAmp: 0.16,
    opacity: 0.87
  },
  {
    id: 'frag-29',
    title: 'Golden Hoop of Time',
    type: 'floating-frame',
    color: '#ffe5ec', // soft rose frame
    position: [-7.2, 0.2, -2.5],
    scale: 1.1,
    driftSpeed: 0.07,
    driftAmp: 0.35,
    rotationSpeed: [0.04, -0.06, 0.08],
    bobSpeed: 0.33,
    bobAmp: 0.22,
    opacity: 0.82
  },
  {
    id: 'frag-30',
    title: 'Youth Diary Collage',
    type: 'collage-stack', // stacked layers
    color: '#f0ebd8', // vintage parchment
    position: [6.5, -0.5, -2.8],
    scale: [0.85, 0.85, 1],
    driftSpeed: 0.09,
    driftAmp: 0.25,
    rotationSpeed: [-0.06, 0.06, -0.04],
    bobSpeed: 0.38,
    bobAmp: 0.15,
    opacity: 0.88
  },
  {
    id: 'frag-31',
    title: 'Distant Dream Haze - Left',
    type: 'abstract-blob',
    color: '#cdb4db', // soft purple haze
    position: [-12.0, 4.0, 2.0],
    scale: 2.4,
    driftSpeed: 0.015,
    driftAmp: 0.85,
    rotationSpeed: [0.01, 0.03, 0.02],
    bobSpeed: 0.16,
    bobAmp: 0.55,
    opacity: 0.30
  },
  {
    id: 'frag-32',
    title: 'Giant Floating Dial Bezel',
    type: 'crt-fragment', // retro dial fragment
    color: '#ffc8dd', // warm fuchsia
    position: [11.5, 3.5, 0.8],
    scale: 1.8,
    driftSpeed: 0.012,
    driftAmp: 0.90,
    rotationSpeed: [-0.02, 0.04, 0.02],
    bobSpeed: 0.14,
    bobAmp: 0.60,
    opacity: 0.35
  },
  {
    id: 'frag-33',
    title: 'Distant Pillar of Memory',
    type: 'geometric-artifact',
    color: '#bde0fe', // soft pastel blue
    position: [-10.5, -1.2, -3.0],
    scale: 0.85,
    driftSpeed: 0.025,
    driftAmp: 0.70,
    rotationSpeed: [0.05, 0.06, 0.04],
    bobSpeed: 0.22,
    bobAmp: 0.40,
    opacity: 0.48
  },
  {
    id: 'frag-34',
    title: 'Neon Cloud Puff - Right',
    type: 'abstract-blob',
    color: '#a2d2ff', // sky blue neon glow
    position: [10.0, 5.0, -4.0],
    scale: 1.9,
    driftSpeed: 0.020,
    driftAmp: 0.80,
    rotationSpeed: [0.03, 0.05, 0.03],
    bobSpeed: 0.18,
    bobAmp: 0.48,
    opacity: 0.40
  },

  // --- HIGH & LOW CLUSTERS: Vertical expansions for a complete field of depth ---
  {
    id: 'frag-35',
    title: 'High Crystal Prisms',
    type: 'geometric-artifact',
    color: '#ffafcc', // bright magenta prism
    position: [-1.5, 4.2, -6.0],
    scale: 0.5,
    driftSpeed: 0.10,
    driftAmp: 0.22,
    rotationSpeed: [0.12, 0.14, 0.18],
    bobSpeed: 0.50,
    bobAmp: 0.10,
    opacity: 0.91
  },
  {
    id: 'frag-36',
    title: 'High Floating Aura',
    type: 'abstract-blob',
    color: '#ffc6ff', // pastel purple neon
    position: [1.8, 4.6, -5.5],
    scale: 0.7,
    driftSpeed: 0.08,
    driftAmp: 0.32,
    rotationSpeed: [0.06, 0.10, 0.08],
    bobSpeed: 0.34,
    bobAmp: 0.22,
    opacity: 0.85
  },
  {
    id: 'frag-37',
    title: 'Unfinished Canvas Sky',
    type: 'paper-sheet',
    color: '#e2e2e2', // light canvas paper
    position: [0.0, 6.2, -7.5],
    scale: [2.6, 1.6, 1],
    driftSpeed: 0.02,
    driftAmp: 0.55,
    rotationSpeed: [0.04, -0.04, 0.02],
    bobSpeed: 0.20,
    bobAmp: 0.45,
    opacity: 0.38
  },
  {
    id: 'frag-38',
    title: 'Home Movies Cassette',
    type: 'vhs-cassette', // floating VHS tape
    color: '#ffcad4', // soft pastel pink label
    position: [-3.2, -2.2, -3.5],
    scale: 0.8,
    driftSpeed: 0.05,
    driftAmp: 0.30,
    rotationSpeed: [0.02, 0.05, 0.02],
    bobSpeed: 0.25,
    bobAmp: 0.22,
    opacity: 0.76
  },
  {
    id: 'frag-39',
    title: 'Ground Glint Crystal',
    type: 'geometric-artifact',
    color: '#e9ffdb', // glowing yellow-green crystal
    position: [3.4, -2.0, -3.8],
    scale: 0.65,
    driftSpeed: 0.06,
    driftAmp: 0.28,
    rotationSpeed: [0.08, 0.10, 0.06],
    bobSpeed: 0.28,
    bobAmp: 0.18,
    opacity: 0.80
  },
  {
    id: 'frag-40',
    title: 'Floating VHS Tape Spool',
    type: 'ribbon-spool', // tape spool loop
    color: '#a8dadc', // pastel spool core
    position: [-6.0, -3.5, -7.0],
    scale: 1.6,
    driftSpeed: 0.03,
    driftAmp: 0.50,
    rotationSpeed: [0.03, 0.04, 0.03],
    bobSpeed: 0.20,
    bobAmp: 0.35,
    opacity: 0.52
  },

  // --- DEEPER ATMOSPHERIC LAYERS: Distant silhouettes to enhance massive scale ---
  {
    id: 'frag-41',
    title: 'Memory of a Horizon',
    type: 'photo-plane',
    color: '#fbc4b6', // horizon peach silhouette
    position: [-9.0, 3.0, -13.0],
    scale: [3.2, 1.6, 1],
    driftSpeed: 0.010,
    driftAmp: 0.80,
    rotationSpeed: [0.01, 0.02, 0.008],
    bobSpeed: 0.12,
    bobAmp: 0.65,
    opacity: 0.24
  },
  {
    id: 'frag-42',
    title: 'Faded Collage Page',
    type: 'image-card',
    color: '#fceade', // soft parchment silhouette
    position: [9.0, 2.5, -13.0],
    scale: [2.0, 2.4, 1],
    driftSpeed: 0.008,
    driftAmp: 0.75,
    rotationSpeed: [-0.01, 0.02, 0.01],
    bobSpeed: 0.11,
    bobAmp: 0.58,
    opacity: 0.22
  },
  {
    id: 'frag-43',
    title: 'Atmospheric Haze Puff Left',
    type: 'abstract-blob',
    color: '#ffc8dd', // pale pink blob
    position: [-3.0, 6.0, -15.0],
    scale: 3.2,
    driftSpeed: 0.005,
    driftAmp: 0.95,
    rotationSpeed: [0.01, 0.015, 0.01],
    bobSpeed: 0.08,
    bobAmp: 0.85,
    opacity: 0.15
  },
  {
    id: 'frag-44',
    title: 'Atmospheric Haze Puff Right',
    type: 'abstract-blob',
    color: '#ffdfd3', // pale peach blob
    position: [3.0, 5.8, -15.0],
    scale: 3.0,
    driftSpeed: 0.006,
    driftAmp: 0.90,
    rotationSpeed: [0.01, -0.012, 0.01],
    bobSpeed: 0.09,
    bobAmp: 0.80,
    opacity: 0.18
  },
  {
    id: 'frag-45',
    title: 'Deep Abyss Crystal',
    type: 'geometric-artifact',
    color: '#d8e2dc', // soft mist grey crystal
    position: [0.0, -4.5, -12.0],
    scale: 2.0,
    driftSpeed: 0.008,
    driftAmp: 0.80,
    rotationSpeed: [0.03, 0.04, 0.03],
    bobSpeed: 0.10,
    bobAmp: 0.70,
    opacity: 0.20
  }
];

// ---------------------------------------------------------------------------
// MEMORY FRAGMENT FIELD COMPONENT
// ---------------------------------------------------------------------------
export const MemoryFragmentField = () => {
  const fragmentRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    MEMORY_FRAGMENTS.forEach((frag, idx) => {
      const ref = fragmentRefs.current[idx];
      if (!ref) return;

      // 1. GENTLE ORGANIC BOBBING (Y-axis float based on custom bobSpeed and bobAmp)
      const bobOffset = idx * 0.73; // unique offset per fragment to de-synchronize bobbing
      ref.position.y = frag.position[1] + Math.sin(t * frag.bobSpeed + bobOffset) * frag.bobAmp;

      // 2. SLOW drifts and sways in the horizontal plane (X and Z axis sway)
      const swayOffset = idx * 1.48;
      ref.position.x = frag.position[0] + Math.sin(t * frag.driftSpeed + swayOffset) * frag.driftAmp;
      ref.position.z = frag.position[2] + Math.cos(t * frag.driftSpeed * 0.7 + swayOffset) * (frag.driftAmp * 0.4);

      // 3. INDEPENDENT ROTATIONS (spinning slowly on yaw, pitch, and roll)
      ref.rotation.x = t * frag.rotationSpeed[0];
      ref.rotation.y = t * frag.rotationSpeed[1];
      ref.rotation.z = t * frag.rotationSpeed[2];
    });
  });

  return (
    <group>
      {MEMORY_FRAGMENTS.map((frag, idx) => {
        const isScaleArray = Array.isArray(frag.scale);
        const sX = isScaleArray ? (frag.scale as [number, number, number])[0] : (frag.scale as number);
        const sY = isScaleArray ? (frag.scale as [number, number, number])[1] : (frag.scale as number);
        const sZ = isScaleArray ? (frag.scale as [number, number, number])[2] : (frag.scale as number);

        return (
          <group
            key={frag.id}
            ref={(el) => { fragmentRefs.current[idx] = el; }}
            position={frag.position}
          >
            
            {/* ========================================================================= */}
            {/* TYPE 1: IMAGE CARD (Polaroid / Framed Photo card with thick back border)   */}
            {/* ========================================================================= */}
            {frag.type === 'image-card' && (
              <group scale={[sX, sY, sZ]}>
                {/* 1A. Photo backing frame (light paper grey/white) */}
                <mesh castShadow receiveShadow>
                  <planeGeometry args={[1.08, 1.28]} />
                  <meshStandardMaterial
                    color="#fdfdfd"
                    roughness={0.6}
                    metalness={0.05}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* 1B. Actual photo center image area (using flat colorful placeholder) */}
                {/* NOTE FOR FUTURE: To swap with real image asset:
                    1. Use texture loader: const tex = useLoader(TextureLoader, frag.imageUrl);
                    2. Replace map={null} with map={tex}
                */}
                <mesh position={[0, 0.08, 0.005]}>
                  <planeGeometry args={[0.96, 1.0]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.3}
                    metalness={0.1}
                    transparent
                    opacity={frag.opacity ?? 0.95}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Decorative retro Polaroid shadow creasing line at the bottom */}
                <mesh position={[0, -0.48, 0.006]}>
                  <planeGeometry args={[0.92, 0.015]} />
                  <meshBasicMaterial color="#dcdcdc" transparent opacity={frag.opacity ?? 0.8} />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 2: PHOTO PLANE (Simple flat aspect-ratio double-sided sheet)         */}
            {/* ========================================================================= */}
            {frag.type === 'photo-plane' && (
              <group scale={[sX, sY, sZ]}>
                {/* NOTE FOR FUTURE: Swap color with texture map in this meshStandardMaterial */}
                <mesh castShadow receiveShadow>
                  <planeGeometry args={[1, 1]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.4}
                    metalness={0.08}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Fine golden border edge framing to represent physical art sheet */}
                <mesh position={[0, 0, -0.002]}>
                  <planeGeometry args={[1.04, 1.04]} />
                  <meshBasicMaterial
                    color="#d4af37" // soft gold border
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.4}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 3: ABSTRACT BLOB (Glassy, high-gloss organic amorphous shapes)        */}
            {/* ========================================================================= */}
            {frag.type === 'abstract-blob' && (
              <mesh
                castShadow
                scale={[sX, sY, sZ]}
              >
                {/* Low-poly icosahedron represents an organic cloud element or dream node */}
                <icosahedronGeometry args={[1, 1]} />
                <meshPhysicalMaterial
                  color={frag.color}
                  roughness={0.08}
                  metalness={0.12}
                  transmission={0.88} // highly glass-like transparent look
                  ior={1.42}
                  thickness={1.5}
                  clearcoat={1.0}
                  clearcoatRoughness={0.05}
                  transparent
                  opacity={(frag.opacity ?? 0.9) * 0.9}
                />
              </mesh>
            )}

            {/* ========================================================================= */}
            {/* TYPE 4: FLOATING FRAME (Empty geometric structures framing the sky)       */}
            {/* ========================================================================= */}
            {frag.type === 'floating-frame' && (
              <group scale={[sX, sY, sZ]}>
                {/* Hollow ring/frame built using a low-poly torus */}
                <mesh castShadow>
                  <torusGeometry args={[0.72, 0.06, 8, 20]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.5}
                    metalness={0.25}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                  />
                </mesh>
                {/* Faint center cross-hair wireframes representing coordinate space */}
                <mesh rotation={[0, 0, 0]}>
                  <boxGeometry args={[1.3, 0.015, 0.015]} />
                  <meshBasicMaterial color={frag.color} transparent opacity={(frag.opacity ?? 0.8) * 0.3} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <boxGeometry args={[1.3, 0.015, 0.015]} />
                  <meshBasicMaterial color={frag.color} transparent opacity={(frag.opacity ?? 0.8) * 0.3} />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 5: PAPER SHEET (Thin sketch notes / notebook pages)                  */}
            {/* ========================================================================= */}
            {frag.type === 'paper-sheet' && (
              <group scale={[sX, sY, sZ]}>
                {/* Floating paper plate */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1, 1, 0.005]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.9} // extremely rough paper texture
                    metalness={0.0}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Decorative horizontal lines representing notebook rules */}
                {Array.from({ length: 5 }).map((_, lIdx) => {
                  const yPos = 0.35 - lIdx * 0.16;
                  return (
                    <mesh key={`rule-${lIdx}`} position={[0, yPos, 0.0035]}>
                      <planeGeometry args={[0.85, 0.008]} />
                      <meshBasicMaterial color="#a0c0e0" transparent opacity={(frag.opacity ?? 0.9) * 0.45} />
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 6: GEOMETRIC ARTIFACT (Metallic low-poly glinting prisms)            */}
            {/* ========================================================================= */}
            {frag.type === 'geometric-artifact' && (
              <mesh
                castShadow
                scale={[sX, sY, sZ]}
              >
                {/* Tall low-poly bicone/octahedron that reflects golden lights */}
                <octahedronGeometry args={[0.8]} />
                <meshStandardMaterial
                  color={frag.color}
                  roughness={0.06}
                  metalness={0.95} // highly metallic glinting prism
                  transparent
                  opacity={frag.opacity ?? 0.9}
                />
              </mesh>
            )}

            {/* ========================================================================= */}
            {/* TYPE 7: LOWPOLY MODEL PLACEHOLDER (Youth toys / Childhood busts prep)      */}
            {/* ========================================================================= */}
            {frag.type === 'lowpoly-model' && (
              <group scale={[sX, sY, sZ]}>
                
                {/* NOTE FOR FUTURE CUSTOM MODELS:
                    1. Use gltf loader: const { scene } = useGLTF(frag.modelUrl);
                    2. In JSX, render: <primitive object={scene} />
                    3. Delete this custom placeholder group.
                */}
                
                {/* 3D Toy-like Pedestal Bust Combination:
                    Contains a cylinder pedestal, a sphere head, and a cylinder neck/shoulders.
                */}
                <group position={[0, -0.2, 0]}>
                  {/* Pedestal Base */}
                  <mesh castShadow position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.5, 0.6, 0.3, 8]} />
                    <meshStandardMaterial
                      color="#dcd7c9" // warm bone white
                      roughness={0.7}
                      metalness={0.1}
                      transparent
                      opacity={frag.opacity ?? 0.9}
                    />
                  </mesh>

                  {/* Toy Cart/Body Segment */}
                  <mesh castShadow position={[0, 0.05, 0]}>
                    <boxGeometry args={[0.7, 0.4, 0.5]} />
                    <meshStandardMaterial
                      color={frag.color} // warm red/pink clay
                      roughness={0.6}
                      metalness={0.1}
                      transparent
                      opacity={frag.opacity ?? 0.9}
                    />
                  </mesh>

                  {/* Low-poly Round Head Block */}
                  <mesh castShadow position={[0, 0.45, 0]}>
                    <sphereGeometry args={[0.26, 8, 8]} />
                    <meshStandardMaterial
                      color="#8ca1a5" // soft grey slate
                      roughness={0.4}
                      metalness={0.2}
                      transparent
                      opacity={frag.opacity ?? 0.9}
                    />
                  </mesh>

                  {/* Low-poly wheels / pegs representing a childhood pull-toy cart */}
                  {[-0.26, 0.26].map((wheelX, wIdx) => (
                    <mesh
                      key={`wheel-${wIdx}`}
                      castShadow
                      position={[wheelX, -0.22, 0.24]}
                      rotation={[Math.PI / 2, 0, 0]}
                    >
                      <cylinderGeometry args={[0.13, 0.13, 0.08, 6]} />
                      <meshStandardMaterial
                        color="#2b2d42" // dark charcoal plastic
                        roughness={0.9}
                        transparent
                        opacity={frag.opacity ?? 0.9}
                      />
                    </mesh>
                  ))}
                  {[-0.26, 0.26].map((wheelX, wIdx) => (
                    <mesh
                      key={`wheel-b-${wIdx}`}
                      castShadow
                      position={[wheelX, -0.22, -0.24]}
                      rotation={[Math.PI / 2, 0, 0]}
                    >
                      <cylinderGeometry args={[0.13, 0.13, 0.08, 6]} />
                      <meshStandardMaterial
                        color="#2b2d42"
                        roughness={0.9}
                        transparent
                        opacity={frag.opacity ?? 0.9}
                      />
                    </mesh>
                  ))}
                </group>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 8: VHS CASSETTE (Retro floating magnetic cassette tapes)             */}
            {/* ========================================================================= */}
            {frag.type === 'vhs-cassette' && (
              <group scale={[sX, sY, sZ]}>
                {/* VHS Cassette Outer Shell (charcoal black body) */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.9, 0.5, 0.08]} />
                  <meshStandardMaterial
                    color="#151719"
                    roughness={0.7}
                    metalness={0.25}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Left Spool Hub (plastic white circle insert) */}
                <mesh position={[-0.2, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.11, 0.11, 0.005, 10]} />
                  <meshStandardMaterial
                    color="#eaeaea"
                    roughness={0.5}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Right Spool Hub (plastic white circle insert) */}
                <mesh position={[0.2, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.11, 0.11, 0.005, 10]} />
                  <meshStandardMaterial
                    color="#eaeaea"
                    roughness={0.5}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Cassette handwritten label sticker block */}
                <mesh position={[0, -0.12, 0.042]}>
                  <planeGeometry args={[0.62, 0.16]} />
                  <meshStandardMaterial
                    color={frag.color} // customizable color label
                    roughness={0.9}
                    transparent
                    opacity={frag.opacity ?? 0.95}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Window viewport plastic */}
                <mesh position={[0, 0.11, 0.042]}>
                  <planeGeometry args={[0.5, 0.18]} />
                  <meshStandardMaterial
                    color="#0d0d0d"
                    roughness={0.15}
                    metalness={0.8}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.45}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 9: CRT FRAGMENT (Drifting television cabinet shells)                */}
            {/* ========================================================================= */}
            {frag.type === 'crt-fragment' && (
              <group scale={[sX, sY, sZ]}>
                {/* Outer Cabinet frame (tan/wooden retro shell) */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.8, 0.8, 0.3]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.45}
                    metalness={0.15}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Bulbous CRT dark glass front screen */}
                <mesh position={[0, 0.04, 0.09]} scale={[1, 1, 0.55]}>
                  <sphereGeometry args={[0.33, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial
                    color="#1f2226"
                    roughness={0.06}
                    metalness={0.9}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.95}
                  />
                </mesh>
                {/* Analog Dial Control Knob 1 */}
                <mesh position={[0.26, -0.24, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.04, 8]} />
                  <meshStandardMaterial
                    color="#1c1917"
                    roughness={0.6}
                    metalness={0.7}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Analog Dial Control Knob 2 */}
                <mesh position={[0.26, -0.11, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.04, 8]} />
                  <meshStandardMaterial
                    color="#1c1917"
                    roughness={0.6}
                    metalness={0.7}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 10: COLLAGE STACK (Slightly tilted, layered 3D fragments)            */}
            {/* ========================================================================= */}
            {frag.type === 'collage-stack' && (
              <group scale={[sX, sY, sZ]}>
                {/* Background sketch sheet (faded off-white) */}
                <mesh castShadow receiveShadow rotation={[0, 0, 0.04]}>
                  <planeGeometry args={[1.0, 1.25]} />
                  <meshStandardMaterial
                    color="#f6f3eb"
                    roughness={0.8}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Middle photo overlay sheet (tilted slightly opposite) */}
                <mesh position={[-0.04, 0.04, 0.005]} rotation={[0, 0, -0.07]}>
                  <planeGeometry args={[0.82, 0.82]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.35}
                    metalness={0.12}
                    transparent
                    opacity={frag.opacity ?? 0.95}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Small handwritten note card at the bottom */}
                <mesh position={[0.16, -0.26, 0.010]} rotation={[0, 0, 0.10]}>
                  <planeGeometry args={[0.55, 0.38]} />
                  <meshStandardMaterial
                    color="#ece4db"
                    roughness={0.85}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Golden tape adhesive ribbon at the top */}
                <mesh position={[0, 0.55, 0.015]} rotation={[0, 0, -0.12]}>
                  <planeGeometry args={[0.28, 0.08]} />
                  <meshStandardMaterial
                    color="#cca43b" // retro golden tape
                    roughness={0.2}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.7}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 11: RIBBON SPOOL (Winding shiny tape ribbons & spools)                */}
            {/* ========================================================================= */}
            {frag.type === 'ribbon-spool' && (
              <group scale={[sX, sY, sZ]}>
                {/* Winding tape ribbon ring 1 */}
                <mesh castShadow>
                  <torusGeometry args={[0.58, 0.022, 8, 24, Math.PI * 1.75]} />
                  <meshStandardMaterial
                    color="#14110f" // magnetic dark iron-oxide black
                    roughness={0.1}
                    metalness={0.9}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Intersecting secondary ribbon ring 2 */}
                <mesh castShadow rotation={[Math.PI / 4, Math.PI / 4, 0]} position={[0.12, 0.08, 0]}>
                  <torusGeometry args={[0.46, 0.022, 8, 24, Math.PI * 1.5]} />
                  <meshStandardMaterial
                    color="#14110f"
                    roughness={0.1}
                    metalness={0.9}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Central spool spindle hub (plastic base cylinder) */}
                <mesh position={[0, 0, -0.01]} rotation={[0, 0, 0]}>
                  <cylinderGeometry args={[0.11, 0.11, 0.04, 10]} />
                  <meshStandardMaterial
                    color={frag.color} // spool highlight color
                    roughness={0.4}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                  />
                </mesh>
              </group>
            )}

          </group>
        );
      })}
    </group>
  );
};
