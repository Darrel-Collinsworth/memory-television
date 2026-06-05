# Progress Log — Memory Television

_Last updated: 2026-06-05 (Desktop, Claude/Loop2)_

---

## ✅ Completed

### Core 3D Experience
- [x] React Three Fiber canvas setup with FOV 45° camera at origin
- [x] Post-processing stack: Bloom, ChromaticAberration, Noise, Vignette
- [x] Full-screen static glitch transition overlay between worlds
- [x] Atmospheric dust particles (DustParticles.tsx)
- [x] Mouse parallax camera controller (CameraController.tsx)
- [x] Debug mode (OrbitControls + locked TV position)

### MemoryTelevision (3D TV Model)
- [x] Full 3D TV/VCR combo model built in Three.js geometry (no external 3D assets)
  - Silver plastic bezel with rounded edges/corners using cylinders + spheres
  - Deep tapered CRT back casing
  - Side speaker grills
  - Inner screen window frame
  - VHS slot door with "INSERT VIDEOCASSETTE" label
  - VCR control strip: EJECT, REW, PLAY, FF, STOP buttons + TAPE IN LED
  - Power button (red) with green LED indicator
  - VOL and CH oval tactile buttons
  - "BarryNervous" brand plate with italic B logo badge
- [x] Smooth lerp animation between all TV postures (home/world/focus/raised/lowered)
- [x] Organic dual-sine sway (reduced 72% in focus mode for readability)
- [x] Mouse parallax (damped 78% in focus mode)
- [x] CRT phosphor point light with flickering + color interpolation based on active world
- [x] Convex glass sphere overlay on screen (meshPhysicalMaterial with transmission)

### CRT Screen (HTML inside 3D)
- [x] Html transform with distanceFactor={1.55} for sharp text rendering
- [x] Three screen modes: TV Guide (home) / World Info / Artifact Focus
- [x] Escape key exits focus mode
- [x] CRT scanline overlay (horizontal lines only — RGB fringe removed for readability)
- [x] Phosphor flicker animation

### TV Guide Screen (home world)
- [x] Full 90s cable TV guide aesthetic (VT323 font, dark blue, yellow accents)
- [x] Live clock (updates every second)
- [x] Three half-hour time slots
- [x] Channel rows with program grids and rating badges
- [x] Left info panel (program description on hover)
- [x] Right preview box (SMPTE color bars fallback, video slot ready)
- [x] Hover/select interaction with sound triggers
- [x] Footer ticker (marquee scroll, contained in overflow-hidden wrapper)

### Artifact System
- [x] Centralized `src/data/artifacts.ts` database
- [x] Full `ArtifactData` schema with broadcast metadata fields
- [x] 45 hub world drifting fragments with nostalgic descriptions
- [x] World artwork entries for all 3 channel worlds
- [x] `InspectableArtifact.tsx` — reusable click-to-inspect wrapper for any 3D object
- [x] Artifact Focus Mode on CRT: dual-column VCR catalog broadcast screen
  - Left: type-based emoji glyph with color glow
  - Right: title, type badge, year, medium, description
  - Bottom table: signal status, channel, condition, archive ID, memory type, source
  - "RETURN TO EXPLORATION" button
- [x] Non-selected artifacts dim to 22% opacity + drift outward in focus mode (eased)
- [x] ESC key to exit focus mode

### Hub World
- [x] Procedural sunset sky dome (canvas texture gradient)
- [x] Floating island (stone cylinder + mossy top + satellite rocks)
- [x] Floating memory cards (placeholder frames)
- [x] Ambient glowing orbs drifting through sky
- [x] Distance haze clouds
- [x] 45 drifting memory fragments (MemoryFragmentField.tsx) reading from artifacts.ts

### Channel Worlds
- [x] Nostalgia Nihilism: dark industrial pillars + floating glowing cubes
- [x] VHS Dreams: retro synthwave sun + wireframe toruses
- [x] Portland Worlds: golden torus ring + emerald crystal octahedra
- [x] Floating holographic artwork panels (HTML + Three.js plane) per world
- [x] World-specific lighting, fog, ambient intensity

### State Management
- [x] Zustand store with atomic transitions
- [x] `transitionTo()` — resets focus state + TV posture on every world change
- [x] Belt-and-suspenders: `useEffect` in MemoryTelevision clears focus on world change
- [x] `setSelectedArtifactId()` auto-manages TV raise/lower based on context

### Audio
- [x] Procedural Web Audio API sounds (tick + thunk) via AudioController.tsx
- [x] Sound toggle in HUD
- [x] Sounds on hover/click/channel-change

### Naming / Data
- [x] Renamed `portla-worlds` → `portland-worlds` everywhere (was a typo)
- [x] TV Guide updated to `portland-worlds`
- [x] World type union updated in useWorldStore

### Visual Polish
- [x] Focus backdrop: `backdrop-filter: blur(1px)` (user-tuned — was 2.5px, too blurry)
- [x] Bloom: 0 in focus mode, 0.18 home, 0.45 world, 2.5 transition
- [x] Chromatic aberration: off in focus mode, 0.0012 normal
- [x] `filter: blur()` removed from crt-pulse animation keyframes
- [x] RGB color fringe removed from CRT scanline overlay

---

## 🔲 Planned / Not Started

### Nostalgia Nihilism World — Full Redesign
- [ ] 360° equirectangular photo mapped to interior sphere (real studio photos)
- [ ] Voice narration system: Darrel's recorded voice plays via CRT on world entry
- [ ] "▶ PLAY TRANSMISSION" button on CRT for opt-in audio
- [ ] Room ambience audio layer (studio floor sound, room tone)
- [ ] Real drifting artifacts tied to the studio/painting series (30 paintings)
- [ ] Photo-realistic fragments from the actual space overlaid in 3D

### VHS Dreams World
- [ ] Design direction TBD — currently has placeholder geometry

### Portland Worlds
- [ ] Design direction TBD — currently has placeholder geometry

### Real Asset Integration (all worlds)
- [ ] Real artwork images for floating panels (currently procedural CSS placeholder)
- [ ] Real photos for hub memory fragments
- [ ] Preview videos for TV Guide channel rows

### CRT Narration System
- [ ] Voice audio playback triggered from CRT (Web Audio API or HTML audio)
- [ ] World-entry narration screen on the CRT "NOW AIRING" view
- [ ] Short poetic text + optional audio for each world

### Minor Cleanup
- [ ] Resolve Vite Fast Refresh warning for MEMORY_FRAGMENTS in MemoryFragmentField.tsx
- [ ] Ticker text sometimes clips on right edge (partial fix applied, may need revisit)

---

## 🐛 Known Issues

| Issue | Status | Notes |
|---|---|---|
| CRT focus mode blur | ✅ Fixed | Was backdrop-filter on DOM overlay above Canvas |
| Focus state persisting on world change | ✅ Fixed | useEffect belt-and-suspenders in MemoryTelevision |
| Ticker overflow right edge | ✅ Mostly fixed | ticker-track wrapper added, user may still see minor clip |
| MemoryFragmentField Fast Refresh warning | 🔲 Low priority | Stale MEMORY_FRAGMENTS export reference |
