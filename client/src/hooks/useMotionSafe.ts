import { useState, useEffect } from 'react';
import { getMotionConfig } from '../config/motion-config';

export interface MotionSafeState {
  prefersReducedMotion: boolean;
  isLowPower: boolean;
  isMobile: boolean;
  isTablet: boolean;
  allowHeavyEffects: boolean;
  allowParallax: boolean;
  allowParticles: boolean;
  allowCursor: boolean;
}

/**
 * Hook to check motion preferences, device capabilities, and screen size
 * Returns booleans for safe animation decisions
 */
export const useMotionSafe = (): MotionSafeState => {
  const [state, setState] = useState<MotionSafeState>(() => {
    if (typeof window === 'undefined') {
      return {
        prefersReducedMotion: false,
        isLowPower: false,
        isMobile: false,
        isTablet: false,
        allowHeavyEffects: false,
        allowParallax: false,
        allowParticles: false,
        allowCursor: false,
      };
    }

    const config = getMotionConfig();
    const width = window.innerWidth;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = width < config.breakpoints.mobile;
    const isTablet = width >= config.breakpoints.mobile && width < config.breakpoints.desktop;
    
    // Check for low power device (heuristic: cores < threshold)
    const isLowPower = navigator.hardwareConcurrency 
      ? navigator.hardwareConcurrency < config.performance.lowPowerThreshold
      : false;

    const allowHeavyEffects = !prefersReducedMotion && !isLowPower && width >= config.breakpoints.mobile;
    const allowParallax = config.features.parallax && !prefersReducedMotion && !isMobile;
    const allowParticles = config.features.particles && allowHeavyEffects;
    const allowCursor = config.features.cursor && !isMobile;

    return {
      prefersReducedMotion,
      isLowPower,
      isMobile,
      isTablet,
      allowHeavyEffects,
      allowParallax,
      allowParticles,
      allowCursor,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const config = getMotionConfig();
    
    const updateState = () => {
      const width = window.innerWidth;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = width < config.breakpoints.mobile;
      const isTablet = width >= config.breakpoints.mobile && width < config.breakpoints.desktop;
      const isLowPower = navigator.hardwareConcurrency 
        ? navigator.hardwareConcurrency < config.performance.lowPowerThreshold
        : false;

      const allowHeavyEffects = !prefersReducedMotion && !isLowPower && width >= config.breakpoints.mobile;
      const allowParallax = config.features.parallax && !prefersReducedMotion && !isMobile;
      const allowParticles = config.features.particles && allowHeavyEffects;
      const allowCursor = config.features.cursor && !isMobile;

      setState({
        prefersReducedMotion,
        isLowPower,
        isMobile,
        isTablet,
        allowHeavyEffects,
        allowParallax,
        allowParticles,
        allowCursor,
      });
    };

    // Media query listeners
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotion = () => updateState();
    reducedMotionQuery.addEventListener('change', handleReducedMotion);

    // Resize listener
    window.addEventListener('resize', updateState);

    // Initial update
    updateState();

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotion);
      window.removeEventListener('resize', updateState);
    };
  }, []);

  return state;
};

