# Architecture — Memory Television

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + TypeScript (Vite) |
| 3D Rendering | React Three Fiber (`@react-three/fiber`) |
| 3D Helpers | `@react-three/drei` (Html, OrbitControls) |
| Post-Processing | `@react-three/postprocessing` (Bloom, ChromaticAberration, Noise, Vignette) |
| State Management | Zustand (`src/store/useWorldStore.ts`) |
| Styling | Vanilla CSS (`src/index.css`) — no Tailwind |
| Fonts | VT323 (monospace CRT), Outfit, Share Tech Mono (Google Fonts) |
| Package Manager | npm |
| Dev Server | Vite @ `localhost:5173/memory-television/` |

---

## File Structure

```
src/
├── App.tsx                    # Root — Canvas setup, post-processing, HUD overlay, static overlays
├── Experience.tsx             # 3D scene root — lighting, fog, Camera controller, scene routing
├── index.css                  # ALL styles (34KB+) — CRT, HUD, TV Guide, artifact screen, etc.
├── main.tsx                   # Entry point
│
├── store/
│   └── useWorldStore.ts       # Zustand global state (world, transitioning, tvRaised, selectedArtifactId, etc.)
│
├── data/
│   ├── artifacts.ts           # CENTRALIZED artifact database — ArtifactData schema + HUB_ARTIFACTS (45) + WORLD_ARTWORKS
│   └── worlds.ts              # World configs (title, colors, fog, TV guide fields) — reads from artifacts.ts
│
└── components/
    ├── MemoryTelevision.tsx   # 3D TV model + Html CRT screen mount — handles all TV animation/positioning
    ├── CRTScreen.tsx          # React HTML content inside the TV — routes between TVGuide / World / Focus screens
    ├── TVGuideScreen.tsx      # The 90s cable TV guide UI (home world screen)
    ├── HubEnvironment.tsx     # Hub world: sky dome, floating island, memory cards, ambient orbs
    ├── MemoryFragmentField.tsx # 45 drifting hub artifacts (reads from HUB_ARTIFACTS in artifacts.ts)
    ├── InspectableArtifact.tsx # Reusable wrapper — makes any 3D object clickable/inspectable via CRT
    ├── WorldScene.tsx         # Channel world renderer (geometry + WORLD_ARTWORKS panels)
    ├── CameraController.tsx   # Mouse parallax camera panning
    ├── DustParticles.tsx      # Floating atmospheric dust
    └── AudioController.tsx    # Procedural audio (tick/thunk sounds)
```

---

## Global State (useWorldStore)

```typescript
currentWorld: 'home' | 'nostalgia-nihilism' | 'vhs-dreams' | 'portland-worlds'
transitioning: boolean           // true during channel-change static overlay
tvRaised: boolean                // true = TV visible, false = lowered/exploration mode
selectedArtifactId: string|null  // null = no focus, string = artifact broadcast screen
soundOn: boolean
debugMode: boolean               // enables OrbitControls + locks TV position for inspection
hoveredWorld: WorldType | null   // for TV glow color reaction
```

**Key behaviors:**
- `transitionTo(world)` — async, triggers static glitch, resets selectedArtifactId + tvRaised atomically
- `setSelectedArtifactId(id)` — auto-raises TV on select, auto-lowers on deselect (except at home)
- `MemoryTelevision.tsx` has a `useEffect` on `currentWorld` that calls `setSelectedArtifactId(null)` — belt-and-suspenders focus state reset on every world change

---

## ArtifactData Schema

```typescript
interface ArtifactData {
  id: string;
  worldId: 'home' | 'nostalgia-nihilism' | 'vhs-dreams' | 'portland-worlds';
  title: string;
  type: 'image-card' | 'photo-plane' | 'abstract-blob' | 'floating-frame' |
        'paper-sheet' | 'geometric-artifact' | 'lowpoly-model' | 'vhs-cassette' |
        'crt-fragment' | 'collage-stack' | 'ribbon-spool' | 'artwork';
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;

  // Drift physics (hub fragments only)
  driftSpeed?: number; driftAmp?: number;
  rotationSpeed?: [number, number, number];
  bobSpeed?: number; bobAmp?: number; opacity?: number;

  // CRT broadcast card metadata
  year?: string; medium?: string;
  archiveId?: string;       // e.g. "ARC-2004-DL"
  signalStatus?: string;    // e.g. "SIGNAL LOCKED", "DECODING"
  condition?: string;       // e.g. "Slightly Warped", "Pristine"
  memoryType?: string;      // e.g. "Childhood Yard", "Tape Loop"
  channelLabel?: string;    // e.g. "CH 03 - PORTLAND"
  shortDescription?: string;// Nostalgic storytelling text
}
```

---

## CRT Screen HTML Rendering

The CRT content is HTML rendered via `@react-three/drei`'s `<Html transform>` inside the 3D scene.

**Key config in MemoryTelevision.tsx:**
```jsx
<Html transform distanceFactor={1.55} scale={[0.97, 1.04, 0.58]} position={[0, 0.05, 0.01]}>
  <CRTScreen />
</Html>
```

- `distanceFactor` controls render resolution — higher = sharper text. Currently `1.55`.
- `scale` Z-axis `0.58` compensates for 3D perspective distortion on the TV plane.
- The `.crt-screen-wrapper` CSS is `512px × 384px`.

---

## Post-Processing Stack (App.tsx)

```
Bloom → ChromaticAberration → Noise → Vignette
```

Focus mode overrides:
- `bloomIntensity = 0` (fully off when artifact selected)
- `aberrationOffset = [0, 0]` (fully off when artifact selected)
- `vignetteAmount = 0.38`

The `.focus-backdrop` DOM overlay uses `backdrop-filter: blur(1px)` when active — user tuned this to `1px` for subtle depth without blurring the TV.

---

## TV Animation Postures (MemoryTelevision.tsx useFrame)

| State | Y | Z | Scale | RotX |
|---|---|---|---|---|
| Home raised | -0.32 | -2.15 | 0.64 | -0.38 |
| Home lowered | -1.85 | -2.25 | 0.44 | -1.15 |
| World raised | -0.42 | -2.35 | 0.54 | -0.44 |
| World lowered | -2.1 | -2.45 | 0.38 | -1.35 |
| Artifact Focus | 0.04 | -1.78 | 0.74 | -0.12 |

All transitions use `THREE.MathUtils.lerp` with factor `0.045` (focus) or `0.08` (normal).

---

## Known Quirks / Watch Outs

- Conda PATH warning in PowerShell on shell init — harmless, ignore it
- `MemoryFragmentField.tsx` may show a Vite Fast Refresh warning about `MEMORY_FRAGMENTS` export — stale reference from before data was centralized, low priority cleanup
- The `Html` CRT screen is rendered as a real DOM element composited into 3D — `backdrop-filter` on any DOM overlay above the Canvas will blur the entire scene including the TV
- No real image assets yet — all artifact visuals are procedural CSS/Three.js geometry. Real images/textures to come when Darrel provides assets.
