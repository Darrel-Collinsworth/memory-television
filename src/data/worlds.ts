export interface ArtworkData {
  id: string;
  title: string;
  year: string;
  medium: string;
  color: string;
  // Standard positions to place floating artwork frames around the camera
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number];
}

export interface WorldData {
  id: 'nostalgia-nihilism' | 'vhs-dreams' | 'portla-worlds';
  title: string;
  subtitle: string;
  channel: string;
  themeColor: string;
  fogColor: string;
  backgroundColor: string;
  ambientIntensity: number;
  artworks: ArtworkData[];
}

export const worlds: Record<string, WorldData> = {
  'nostalgia-nihilism': {
    id: 'nostalgia-nihilism',
    title: 'NOSTALGIA NIHILISM',
    subtitle: 'A monuments to forgotten digital dust',
    channel: 'CH 01',
    themeColor: '#ff2d55', // Crimson
    fogColor: '#0a0507',
    backgroundColor: '#050203',
    ambientIntensity: 0.15,
    artworks: [
      {
        id: 'nn-1',
        title: 'Broken Frame Buffer',
        year: '2024',
        medium: 'Generative CSS Mesh & Deconstructed PNG',
        color: '#ff2d55',
        position: [-2.5, 0.8, -3.5],
        rotation: [0, 0.4, 0],
        scale: [1.8, 2.4]
      },
      {
        id: 'nn-2',
        title: 'Null Pointer Echo',
        year: '2025',
        medium: 'Floating Shards & Volumetric Projection',
        color: '#8b0000',
        position: [2.5, 1.2, -3.2],
        rotation: [0, -0.4, 0],
        scale: [2.2, 1.6]
      },
      {
        id: 'nn-3',
        title: 'The Great Decelerator',
        year: '2026',
        medium: 'Monolithic Structure & CRT Scanline Feedback',
        color: '#ff4c4c',
        position: [0, 2.5, -4.5],
        rotation: [0.1, 0, 0],
        scale: [3.0, 1.8]
      }
    ]
  },
  'vhs-dreams': {
    id: 'vhs-dreams',
    title: 'VHS DREAMS',
    subtitle: 'Nostalgic synthwave tape-loop horizons',
    channel: 'CH 02',
    themeColor: '#d946ef', // Neon Fuchsia / Pink
    fogColor: '#0c0714',
    backgroundColor: '#05030a',
    ambientIntensity: 0.25,
    artworks: [
      {
        id: 'vd-1',
        title: 'Outrun Terminal',
        year: '2024',
        medium: 'Glowing Grid Matrix',
        color: '#d946ef',
        position: [-2.8, 1.0, -3.0],
        rotation: [0, 0.5, 0],
        scale: [2.2, 1.8]
      },
      {
        id: 'vd-2',
        title: 'Tape Warp 1989',
        year: '2025',
        medium: 'Flickering Phosphor Raster',
        color: '#06b6d4', // Cyan
        position: [2.8, 0.7, -3.0],
        rotation: [0, -0.5, 0],
        scale: [1.8, 2.2]
      },
      {
        id: 'vd-3',
        title: 'Luminous Sunset Memory',
        year: '2026',
        medium: 'Holographic Wireframe Grid & VHS Static',
        color: '#f43f5e', // Hot pink
        position: [0, 2.2, -4.0],
        rotation: [0.1, 0, 0],
        scale: [2.5, 2.5]
      }
    ]
  },
  'portla-worlds': {
    id: 'portla-worlds',
    title: 'PORTL& WORLDS',
    subtitle: 'Ethereal organic crystal dimensions',
    channel: 'CH 03',
    themeColor: '#10b981', // Emerald / Cyan-Green
    fogColor: '#040d0a',
    backgroundColor: '#020605',
    ambientIntensity: 0.2,
    artworks: [
      {
        id: 'pw-1',
        title: 'Emerald Monolith Resonance',
        year: '2025',
        medium: 'Floating Hyper-Crystalline Structure',
        color: '#10b981',
        position: [-2.6, 0.5, -3.2],
        rotation: [0, 0.45, 0],
        scale: [2.0, 2.0]
      },
      {
        id: 'pw-2',
        title: 'Sacred Gilded Octahedron',
        year: '2025',
        medium: 'Golden Ratio Spline Mapping',
        color: '#fbbf24', // Gold
        position: [2.6, 1.4, -3.2],
        rotation: [0, -0.45, 0],
        scale: [2.0, 2.0]
      },
      {
        id: 'pw-3',
        title: 'The Portal Entrance',
        year: '2026',
        medium: 'Vortical Fluid Dynamics Simulation',
        color: '#06b6d4', // Cyan
        position: [0, 2.4, -4.5],
        rotation: [0.1, 0, 0],
        scale: [2.8, 1.8]
      }
    ]
  }
};
