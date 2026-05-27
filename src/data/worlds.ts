import { WORLD_ARTWORKS } from './artifacts';

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
  id: 'nostalgia-nihilism' | 'vhs-dreams' | 'portland-worlds';
  title: string;
  subtitle: string;
  channel: string;
  themeColor: string;
  fogColor: string;
  backgroundColor: string;
  ambientIntensity: number;
  artworks: ArtworkData[];
  // TV Guide fields
  guideAbbrev: string;   // Short network label, e.g. "N.N.", "VHS", "PORT"
  tagline: string;       // One-line emotional description
  previewVideo: string;  // Path to looping preview video (put in public/videos/). Empty = CSS fallback.
  previewColor: string;  // CSS color shown when no video is set
  airTime: string;       // Fake broadcast time for the guide
  rating: string;        // Content rating badge, e.g. "TV-MA", "NR"
}

// Helper to map global ArtifactData into the legacy ArtworkData format (slicing scale to 2D)
const mapWorldArtworks = (worldId: string): ArtworkData[] => {
  const list = WORLD_ARTWORKS[worldId] || [];
  return list.map((art) => {
    // default scale fallback
    let s2d: [number, number] = [2, 2];
    if (art.scale) {
      if (Array.isArray(art.scale)) {
        s2d = [art.scale[0], art.scale[1]];
      } else {
        s2d = [art.scale, art.scale];
      }
    }
    return {
      id: art.id,
      title: art.title,
      year: art.year || '2026',
      medium: art.medium || 'Digital Medium',
      color: art.color,
      position: art.position,
      rotation: art.rotation || [0, 0, 0],
      scale: s2d
    };
  });
};

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
    previewVideo: '',
    previewColor: '#1a0208',
    airTime: '9:00 PM',
    rating: 'TV-MA',
    artworks: mapWorldArtworks('nostalgia-nihilism')
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
    previewVideo: '',
    previewColor: '#130820',
    airTime: '11:00 PM',
    rating: 'TV-14',
    artworks: mapWorldArtworks('vhs-dreams')
  },
  'portland-worlds': {
    id: 'portland-worlds',
    title: 'PORTLAND WORLDS',
    subtitle: 'Preserving 16 years of Maine memories',
    channel: 'CH 03',
    themeColor: '#10b981', // Emerald / Cyan-Green
    fogColor: '#040d0a',
    backgroundColor: '#020605',
    ambientIntensity: 0.2,
    guideAbbrev: 'PORT',
    tagline: 'Preserving 16 years of Maine memories.',
    previewVideo: '',
    previewColor: '#031208',
    airTime: '12:00 AM',
    rating: 'NR',
    artworks: mapWorldArtworks('portland-worlds')
  }
};
