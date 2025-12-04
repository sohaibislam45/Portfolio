import { useState, useEffect } from 'react';
import { getMotionConfig, saveMotionConfig } from '../../config/motion-config';
import { getAnimationRegistry } from '../../utils/animationRegistry';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export type MotionLevel = 'full' | 'reduced' | 'off';

export interface MotionControlsProps {
  className?: string;
}

/**
 * Motion Controls Component
 * Visible control in settings/header to toggle motion preferences
 * Persists to localStorage
 */
export const MotionControls = ({ className = '' }: MotionControlsProps) => {
  const [motionLevel, setMotionLevel] = useState<MotionLevel>('full');
  const [isOpen, setIsOpen] = useState(false);
  const { prefersReducedMotion } = useMotionSafe();
  const registry = getAnimationRegistry();

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('motion-level');
    if (stored && ['full', 'reduced', 'off'].includes(stored)) {
      setMotionLevel(stored as MotionLevel);
      applyMotionLevel(stored as MotionLevel);
    } else if (prefersReducedMotion) {
      setMotionLevel('reduced');
      applyMotionLevel('reduced');
    }
  }, [prefersReducedMotion]);

  const applyMotionLevel = (level: MotionLevel) => {
    const config = getMotionConfig();
    
    if (level === 'off') {
      // Disable all animations
      config.features.threeJS = false;
      config.features.lottie = false;
      config.features.particles = false;
      config.features.cursor = false;
      config.features.parallax = false;
      config.accessibility.respectReducedMotion = true;
    } else if (level === 'reduced') {
      // Reduce motion
      config.features.particles = false;
      config.timing.defaultDuration = config.accessibility.reducedMotionDuration;
      config.timing.defaultEase = config.accessibility.reducedMotionEase;
      config.accessibility.respectReducedMotion = true;
    } else {
      // Full motion
      config.features.threeJS = true;
      config.features.lottie = true;
      config.features.particles = true;
      config.features.cursor = true;
      config.features.parallax = true;
    }

    saveMotionConfig(config);

    // Update registry
    Object.keys(config.features).forEach((key) => {
      registry.setEnabled(key as any, (config.features as any)[key]);
    });

    localStorage.setItem('motion-level', level);
  };

  const handleLevelChange = (level: MotionLevel) => {
    setMotionLevel(level);
    applyMotionLevel(level);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        aria-label="Motion controls"
        aria-expanded={isOpen}
      >
        Motion: {motionLevel}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-2 min-w-[200px] z-50">
          <button
            onClick={() => handleLevelChange('full')}
            className={`w-full text-left px-3 py-2 rounded ${
              motionLevel === 'full'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Full Motion
          </button>
          <button
            onClick={() => handleLevelChange('reduced')}
            className={`w-full text-left px-3 py-2 rounded ${
              motionLevel === 'reduced'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Reduced Motion
          </button>
          <button
            onClick={() => handleLevelChange('off')}
            className={`w-full text-left px-3 py-2 rounded ${
              motionLevel === 'off'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Motion Off
          </button>
        </div>
      )}
    </div>
  );
};

