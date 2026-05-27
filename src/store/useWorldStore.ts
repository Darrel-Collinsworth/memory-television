import { create } from 'zustand';

export type WorldType = 'home' | 'nostalgia-nihilism' | 'vhs-dreams' | 'portla-worlds';

interface WorldState {
  currentWorld: WorldType;
  transitioning: boolean;
  soundOn: boolean;
  tvRaised: boolean;
  debugMode: boolean;
  hoveredWorld: WorldType | null;
  soundTrigger: { type: 'tick' | 'thunk' | null; id: number };
  setWorld: (world: WorldType) => void;
  setTransitioning: (transitioning: boolean) => void;
  setSoundOn: (soundOn: boolean) => void;
  setTvRaised: (tvRaised: boolean) => void;
  setDebugMode: (debugMode: boolean) => void;
  setHoveredWorld: (world: WorldType | null) => void;
  triggerSound: (type: 'tick' | 'thunk') => void;
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

  setWorld: (world) => set({ currentWorld: world }),
  setTransitioning: (transitioning) => set({ transitioning }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setTvRaised: (tvRaised) => set({ tvRaised }),
  setDebugMode: (debugMode) => set({ debugMode }),
  setHoveredWorld: (world) => set({ hoveredWorld: world }),
  triggerSound: (type) => set((state) => ({ soundTrigger: { type, id: state.soundTrigger.id + 1 } })),

  transitionTo: async (world) => {
    // If we're already transitioning or already in that world, ignore
    if (get().transitioning || get().currentWorld === world) return;

    set({ transitioning: true });

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
