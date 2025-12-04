/**
 * Centralized Animation Configuration
 * Controls global timing, breakpoints, and feature flags for all animations
 */

export interface MotionConfig {
  // Global timing defaults
  timing: {
    defaultDuration: number;
    defaultEase: string;
    staggerBase: number;
  };

  // Breakpoints for disabling heavy effects
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };

  // Feature flags
  features: {
    threeJS: boolean;
    lottie: boolean;
    particles: boolean;
    cursor: boolean;
    parallax: boolean;
  };

  // Performance thresholds
  performance: {
    lowPowerThreshold: number; // CPU cores threshold
    maxParticles: number;
    enableDebug: boolean;
  };

  // Accessibility
  accessibility: {
    respectReducedMotion: boolean;
    reducedMotionDuration: number;
    reducedMotionEase: string;
  };
}

export const defaultMotionConfig: MotionConfig = {
  timing: {
    defaultDuration: 0.8,
    defaultEase: 'power3.out',
    staggerBase: 0.1,
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
  features: {
    threeJS: true,
    lottie: true,
    particles: true,
    cursor: true,
    parallax: true,
  },
  performance: {
    lowPowerThreshold: 4, // cores
    maxParticles: 100,
    enableDebug: false,
  },
  accessibility: {
    respectReducedMotion: true,
    reducedMotionDuration: 0.3,
    reducedMotionEase: 'none',
  },
};

// Load config from localStorage or use defaults
export const loadMotionConfig = (): MotionConfig => {
  if (typeof window === 'undefined') return defaultMotionConfig;

  const stored = localStorage.getItem('motion-config');
  if (stored) {
    try {
      return { ...defaultMotionConfig, ...JSON.parse(stored) };
    } catch {
      return defaultMotionConfig;
    }
  }
  return defaultMotionConfig;
};

// Save config to localStorage
export const saveMotionConfig = (config: Partial<MotionConfig>): void => {
  if (typeof window === 'undefined') return;
  const current = loadMotionConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('motion-config', JSON.stringify(updated));
};

// Get current config
export const getMotionConfig = (): MotionConfig => {
  return loadMotionConfig();
};

