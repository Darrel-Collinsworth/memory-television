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
  // TV Guide fields
  guideAbbrev: string;   // Short network label, e.g. "N.N.", "VHS", "P&W"
  tagline: string;       // One-line emotional description
  previewVideo: string;  // Path to looping preview video (put in public/videos/). Empty = CSS fallback.
  previewColor: string;  // CSS color shown when no video is set
  airTime: string;       // Fake broadcast time for the guide
  rating: string;        // Content rating badge, e.g. "TV-MA", "NR"
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
    guideAbbrev: 'N.N.',
    tagline: 'A monument to forgotten digital dust.',
    previewVideo: '',          // Drop nn-preview.mp4 in public/videos/ when ready
    previewColor: '#1a0208',   // Deep crimson — fallback when no video
    airTime: '9:00 PM',
    rating: 'TV-MA',
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
    guideAbbrev: 'VHS',
    tagline: 'Nostalgic tape-loop memory horizons.',
    previewVideo: '',          // Drop vhs-preview.mp4 in public/videos/ when ready
    previewColor: '#130820',   // Deep purple — fallback when no video
    airTime: '11:00 PM',
    rating: 'TV-14',
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
    guideAbbrev: 'P&W',
    tagline: 'Ethereal organic crystal dimensions.',
    previewVideo: '',          // Drop pw-preview.mp4 in public/videos/ when ready
    previewColor: '#031208',   // Deep emerald — fallback when no video
    airTime: '12:00 AM',
    rating: 'NR',
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
