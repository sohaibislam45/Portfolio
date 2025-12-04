/**
 * Animation Registry
 * Runtime registry for toggling heavy animation modules
 * Supports localStorage persistence
 */

export type AnimationModule = 'threejs' | 'lottie' | 'particles' | 'cursor' | 'parallax';

interface ModuleState {
  enabled: boolean;
  initialized: boolean;
}

class AnimationRegistry {
  private modules: Map<AnimationModule, ModuleState> = new Map();
  private listeners: Map<AnimationModule, Set<() => void>> = new Map();

  constructor() {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('animation-registry');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          Object.entries(data).forEach(([key, value]) => {
            this.modules.set(key as AnimationModule, {
              enabled: (value as ModuleState).enabled,
              initialized: false,
            });
          });
        } catch {
          // Ignore parse errors
        }
      }
    }

    // Initialize all modules as enabled by default
    const defaultModules: AnimationModule[] = ['threejs', 'lottie', 'particles', 'cursor', 'parallax'];
    defaultModules.forEach((module) => {
      if (!this.modules.has(module)) {
        this.modules.set(module, { enabled: true, initialized: false });
      }
    });
  }

  isEnabled(module: AnimationModule): boolean {
    return this.modules.get(module)?.enabled ?? true;
  }

  setEnabled(module: AnimationModule, enabled: boolean) {
    const current = this.modules.get(module) || { enabled: true, initialized: false };
    this.modules.set(module, { ...current, enabled });
    this.saveToStorage();
    this.notifyListeners(module);
  }

  isInitialized(module: AnimationModule): boolean {
    return this.modules.get(module)?.initialized ?? false;
  }

  setInitialized(module: AnimationModule, initialized: boolean) {
    const current = this.modules.get(module) || { enabled: true, initialized: false };
    this.modules.set(module, { ...current, initialized });
  }

  subscribe(module: AnimationModule, callback: () => void) {
    if (!this.listeners.has(module)) {
      this.listeners.set(module, new Set());
    }
    this.listeners.get(module)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(module)?.delete(callback);
    };
  }

  private notifyListeners(module: AnimationModule) {
    this.listeners.get(module)?.forEach((callback) => callback());
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    const data: Record<string, ModuleState> = {};
    this.modules.forEach((state, module) => {
      data[module] = { enabled: state.enabled, initialized: state.initialized };
    });
    localStorage.setItem('animation-registry', JSON.stringify(data));
  }

  getAllStates(): Record<AnimationModule, boolean> {
    const states: Record<string, boolean> = {};
    this.modules.forEach((state, module) => {
      states[module] = state.enabled;
    });
    return states as Record<AnimationModule, boolean>;
  }
}

// Singleton instance
let registryInstance: AnimationRegistry | null = null;

export const getAnimationRegistry = (): AnimationRegistry => {
  if (!registryInstance) {
    registryInstance = new AnimationRegistry();
  }
  return registryInstance;
};

