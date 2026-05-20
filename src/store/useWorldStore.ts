import { create } from 'zustand';

export type WorldType = 'home' | 'nostalgia-nihilism' | 'vhs-dreams' | 'portla-worlds';

interface WorldState {
  currentWorld: WorldType;
  transitioning: boolean;
  soundOn: boolean;
  tvRaised: boolean;
  debugMode: boolean;
  setWorld: (world: WorldType) => void;
  setTransitioning: (transitioning: boolean) => void;
  setSoundOn: (soundOn: boolean) => void;
  setTvRaised: (tvRaised: boolean) => void;
  setDebugMode: (debugMode: boolean) => void;
  transitionTo: (world: WorldType) => Promise<void>;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  currentWorld: 'home',
  transitioning: false,
  soundOn: false,
  tvRaised: true, // Default raised so user sees TV menu at start
  debugMode: false, // Default off

  setWorld: (world) => set({ currentWorld: world }),
  setTransitioning: (transitioning) => set({ transitioning }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setTvRaised: (tvRaised) => set({ tvRaised }),
  setDebugMode: (debugMode) => set({ debugMode }),

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
