import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export interface ParallaxLayerProps {
  children: ReactNode;
  depthFactor: number; // 0-1, where 0 = no movement, 1 = full movement
  maxOffset?: number; // px
  followPointer?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Parallax Layer Component
 * Creates a single parallax layer that moves at a different speed on scroll
 * Supports pointer follow on desktop
 */
export const ParallaxLayer = ({
  children,
  depthFactor,
  maxOffset = 100,
  followPointer = false,
  className = '',
  style,
}: ParallaxLayerProps) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isMobile, allowParallax } = useMotionSafe();
  const pointerX = useRef(0);
  const pointerY = useRef(0);

  useEffect(() => {
    if (!layerRef.current) return;
    if (prefersReducedMotion) return;
    if (!allowParallax) {
      // Fallback: simple vertical parallax only
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: layerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const offset = (self.progress - 0.5) * maxOffset * depthFactor;
            gsap.set(layerRef.current, {
              y: offset,
              force3D: true,
            });
          },
        });
      }
      return;
    }

    const layer = layerRef.current;
    let scrollX = 0;
    let scrollY = 0;

    // Scroll-based parallax
    ScrollTrigger.create({
      trigger: layer,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollY = (self.progress - 0.5) * maxOffset * depthFactor;
        updateTransform();
      },
    });

    // Pointer follow (desktop only)
    if (followPointer && !isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = layer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        pointerX.current = (e.clientX - centerX) * depthFactor * 0.1;
        pointerY.current = (e.clientY - centerY) * depthFactor * 0.1;
        updateTransform();
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }

    function updateTransform() {
      const x = followPointer && !isMobile ? pointerX.current : 0;
      const y = scrollY + (followPointer && !isMobile ? pointerY.current : 0);
      
      gsap.set(layer, {
        x,
        y,
        force3D: true,
      });
    }
  }, [depthFactor, maxOffset, followPointer, prefersReducedMotion, isMobile, allowParallax]);

  return (
    <div
      ref={layerRef}
      className={className}
      style={{
        willChange: allowParallax ? 'transform' : 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Multi-layer Parallax Container
 * Wraps multiple ParallaxLayer components with coordinated movement
 */
export interface MultiParallaxProps {
  children: ReactNode;
  depthFactors?: number[]; // [foreground, mid, background]
  maxOffset?: number;
  followPointer?: boolean;
  className?: string;
}

export const MultiParallax = ({
  children,
  depthFactors = [0.3, 0.6, 1.0],
  maxOffset = 100,
  followPointer = false,
  className = '',
}: MultiParallaxProps) => {
  return (
    <div className={`relative ${className}`}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <ParallaxLayer
            key={index}
            depthFactor={depthFactors[index] || 0.5}
            maxOffset={maxOffset}
            followPointer={followPointer}
          >
            {child}
          </ParallaxLayer>
        ))
      ) : (
        <ParallaxLayer
          depthFactor={depthFactors[0] || 0.5}
          maxOffset={maxOffset}
          followPointer={followPointer}
        >
          {children}
        </ParallaxLayer>
      )}
    </div>
  );
};

