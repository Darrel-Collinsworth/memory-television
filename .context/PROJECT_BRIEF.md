# Project Brief — Memory Television
## by Darrel Collinsworth

---

## What This Is

**Memory Television** is an immersive, interactive 3D web experience — part personal archive, part surreal art installation, part digital memoir. It is built as an artist portfolio/experience site, but it operates more like interactive installation art than a traditional gallery or portfolio.

The project lives at the intersection of:
- **Interactive documentary**
- **Preserved emotional architecture**
- **Speculative media design**
- **Digital anthropology**

---

## The Core Concept

The user inhabits a first-person 3D environment where they hold a **vintage CRT television companion** (a TV/VCR combo, modeled in 3D) in their hands. This TV is the only interface — it is the narrator, archivist, guide, tuner, broadcaster, and mediator between the viewer and the archive.

**The worlds exist silently. The CRT interprets them. The CRT broadcasts memory.**

---

## The CRT Television System

The CRT companion (`MemoryTelevision.tsx`) floats in front of the user in 3D space. It has three states:

1. **Exploration Mode** — TV lowered, user looks around the world freely
2. **Navigation Mode** — TV raised, shows the TV Guide (home) or "NOW AIRING" world info
3. **Artifact Focus Mode** — TV raised and enlarged, shows the Artifact Broadcast Screen with full metadata for a selected memory artifact

The CRT is styled as a late-90s/early-2000s TV/VCR combo with a silver bezel, woodgrain-style back, VHS slot, tactile buttons, and a "BarryNervous" brand plate.

---

## The Worlds / Channels

The experience has a **Hub World** (home) and **three channel worlds** accessible via the TV Guide:

### Hub World (home)
- A floating island in a warm nostalgic sunset sky
- 45 memory fragments drift through the space — physical artifacts, sketches, VHS tapes, geometric objects — each inspectable via the CRT
- Sky is a procedural gradient: violet blue → magenta lavender → pinkish orange → deep red horizon

### CH 01 — Nostalgia Nihilism
- **Creative brief:** A preserved emotional memory-space, not a gallery. Based on real 360° captures of Darrel's actual studio/workspace as he prepares to leave Portland, Maine after 16 years.
- **Feeling:** "Recently departed" — creative energy still lingers. Paintings, process materials, VHS fragments, notes, childhood imagery drift unnaturally through the space as if the room is reconstructing memories in real time.
- **Tone:** Warm, reflective, surreal, nostalgic, emotionally intimate
- **Voice narration planned:** Darrel's actual recorded voice (conversational, unscripted, short) plays via the CRT — talking about what the space meant, the loneliness, learning to love himself, the paintings made there
- **360° photo environment:** Equirectangular photo mapped to interior sphere — the actual studio at various stages of being emptied
- Theme color: Crimson `#ff2d55`

### CH 02 — VHS Dreams
- Synthwave tape-loop memory horizons
- Neon fuchsia/pink aesthetic, wireframe toruses, retro sun
- Theme color: Neon Fuchsia `#d946ef`

### CH 03 — Portland Worlds
- Preserving 16 years of Maine memories
- Emerald/cyan-green, golden ring, crystal prisms
- Renamed from `portla-worlds` to `portland-worlds` (corrected typo)
- Theme color: Emerald `#10b981`

---

## The Artifact System

Every inspectable object is an `ArtifactData` (defined in `src/data/artifacts.ts`). When selected, the CRT shows a **Retro VCR Broadcast Screen** with:
- Title, type badge, year, medium
- Short nostalgic description
- Signal status, channel label, condition, archive ID, memory type
- "RETURN TO EXPLORATION" button

The broadcast screen uses deliberate archival/broadcast language — feels like recovering a transmission, not viewing a gallery piece.

---

## Key Creative Rules
1. The CRT is the ONLY voice in the room — worlds themselves are silent
2. Narration is SHORT, poetic, observational, emotionally grounded — NOT lore dumps
3. Darrel's actual voice only — no AI voice, no cinematic trailer narration
4. The room backdrop remains quiet and contemplative — the TV interprets it
5. "Recovered transmissions from a life" is the emotional register to maintain
