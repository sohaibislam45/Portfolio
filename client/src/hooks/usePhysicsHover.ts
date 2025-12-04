import { useRef, useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { useMotionSafe } from './useMotionSafe';

export interface PhysicsHoverConfig {
  mass?: number;
  stiffness?: number;
  damping?: number;
  scale?: number;
  rotation?: number;
  instant?: boolean; // For reduced motion
}

const defaultConfig: Required<PhysicsHoverConfig> = {
  mass: 1,
  stiffness: 300,
  damping: 20,
  scale: 1.05,
  rotation: 2,
  instant: false,
};

/**
 * Hook for physics-like hover interactions
 * Provides springy scale and rotation on hover
 */
export const usePhysicsHover = <T extends HTMLElement>(
  config: PhysicsHoverConfig = {}
): RefObject<T> => {
  const elementRef = useRef<T>(null);
  const { prefersReducedMotion } = useMotionSafe();
  const mergedConfig = { ...defaultConfig, ...config, instant: prefersReducedMotion || config.instant };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const { scale, rotation, instant } = mergedConfig;

    if (instant) {
      // Instant response for reduced motion
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          scale: scale,
          duration: 0.1,
          ease: 'none',
        });
      });
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.1,
          ease: 'none',
        });
      });
      return;
    }

    // Physics-based animation
    const hoverTween = gsap.to(element, {
      scale: scale,
      rotation: rotation,
      duration: 0.3,
      ease: 'back.out(1.7)',
      paused: true,
    });

    const leaveTween = gsap.to(element, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
      paused: true,
    });

    element.addEventListener('mouseenter', () => {
      leaveTween.pause();
      hoverTween.restart();
    });

    element.addEventListener('mouseleave', () => {
      hoverTween.pause();
      leaveTween.restart();
    });

    return () => {
      hoverTween.kill();
      leaveTween.kill();
    };
  }, [mergedConfig, prefersReducedMotion]);

  return elementRef;
};

/**
 * Hook for draggable micro-interactions (e.g., gallery thumbnails)
 */
export const useDraggable = <T extends HTMLElement>(
  onDrag?: (x: number, y: number) => void
): RefObject<T> => {
  const elementRef = useRef<T>(null);
  const { prefersReducedMotion } = useMotionSafe();
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      element.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      gsap.to(element, {
        x: deltaX * 0.1,
        y: deltaY * 0.1,
        duration: 0.1,
        ease: 'power2.out',
      });

      if (onDrag) {
        onDrag(deltaX, deltaY);
      }
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      element.style.cursor = 'grab';
      
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    element.style.cursor = 'grab';
    element.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onDrag, prefersReducedMotion]);

  return elementRef;
};

