import { create } from 'zustand';

export type WorldType = 'home' | 'nostalgia-nihilism' | 'vhs-dreams' | 'portland-worlds';

interface WorldState {
  currentWorld: WorldType;
  transitioning: boolean;
  soundOn: boolean;
  tvRaised: boolean;
  debugMode: boolean;
  hoveredWorld: WorldType | null;
  soundTrigger: { type: 'tick' | 'thunk' | null; id: number };
  selectedArtifactId: string | null;
  setWorld: (world: WorldType) => void;
  setTransitioning: (transitioning: boolean) => void;
  setSoundOn: (soundOn: boolean) => void;
  setTvRaised: (tvRaised: boolean) => void;
  setDebugMode: (debugMode: boolean) => void;
  setHoveredWorld: (world: WorldType | null) => void;
  triggerSound: (type: 'tick' | 'thunk') => void;
  setSelectedArtifactId: (id: string | null) => void;
  transitionTo: (world: WorldType) => Promise<void>;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  currentWorld: 'home',
  transitioning: false,
  soundOn: true,
  tvRaised: true, // Default raised so user sees TV menu at start
  debugMode: false, // Default off
  hoveredWorld: null,
  soundTrigger: { type: null, id: 0 },
  selectedArtifactId: null,

  setWorld: (world) => set({ currentWorld: world }),
  setTransitioning: (transitioning) => set({ transitioning }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setTvRaised: (tvRaised) => set((state) => ({ 
    tvRaised,
    // If the TV is explicitly lowered, clear the active focused artifact instantly
    selectedArtifactId: !tvRaised ? null : state.selectedArtifactId
  })),
  setDebugMode: (debugMode) => set({ debugMode }),
  setHoveredWorld: (world) => set({ hoveredWorld: world }),
  triggerSound: (type) => set((state) => ({ soundTrigger: { type, id: state.soundTrigger.id + 1 } })),
  setSelectedArtifactId: (id) => set((state) => ({ 
    selectedArtifactId: id,
    // Auto-raise TV when selecting an artifact. When exiting focus mode:
    // - If in home (hub world), keep it raised so the VCR guide is visible.
    // - If in a channel/immersive world, auto-lower it back to exploration mode posture.
    tvRaised: id !== null ? true : (state.currentWorld === 'home')
  })),

  transitionTo: async (world) => {
    // ALWAYS reset focus state and TV posture immediately on any channel/world transition call
    set({ 
      selectedArtifactId: null,
      tvRaised: world === 'home'
    });

    // If we're already transitioning or already in that world, ignore actual transition
    if (get().transitioning || get().currentWorld === world) return;

    set({ 
      transitioning: true 
    });

    // Wait for the analog static/glitch transition to peak (700ms)
    await new Promise((resolve) => setTimeout(resolve, 750));

    set({ 
      currentWorld: world,
      // Auto-raise TV when going back home, or auto-lower TV when entering an immersive world
      tvRaised: world === 'home'
    });

    // Let the screen settle down and fade the static back out (750ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    set({ transitioning: false });
  },
}));
