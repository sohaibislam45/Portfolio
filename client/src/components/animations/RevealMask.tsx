import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export type MaskType = 'liquid' | 'radial' | 'polygon' | 'wipe';

export interface RevealMaskProps {
  children: ReactNode;
  maskType?: MaskType;
  duration?: number;
  easing?: string;
  className?: string;
}

/**
 * Reveal Mask Component
 * Uses SVG clipPath or canvas mask for organic reveal animations
 */
export const RevealMask = ({
  children,
  maskType = 'liquid',
  duration = 1.0,
  easing = 'power2.inOut',
  className = '',
}: RevealMaskProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGClipPathElement | null>(null);
  const { prefersReducedMotion } = useMotionSafe();

  useEffect(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion) {
      // Fallback: simple opacity/scale
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
      return;
    }

    const container = containerRef.current;
    const clipId = `reveal-mask-${Math.random().toString(36).substr(2, 9)}`;

    // Create SVG clipPath
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', clipId);

    let maskElement: SVGElement;

    if (maskType === 'liquid') {
      // Liquid blob shape
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const initialPath = 'M 0 0 L 100 0 L 100 100 L 0 100 Z';
      const finalPath = 'M 0 0 Q 50 20, 100 0 T 100 100 Q 50 80, 0 100 Z';
      path.setAttribute('d', initialPath);
      path.setAttribute('transform', 'scale(1)');
      clipPath.appendChild(path);
      maskElement = path;

      // Animate path morph
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        animation: gsap.to(path, {
          attr: { d: finalPath },
          duration,
          ease: easing,
        }),
        toggleActions: 'play none none none',
      });
    } else if (maskType === 'radial') {
      // Radial reveal
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '50');
      circle.setAttribute('cy', '50');
      circle.setAttribute('r', '0');
      clipPath.appendChild(circle);
      maskElement = circle;

      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        animation: gsap.to(circle, {
          attr: { r: 100 },
          duration,
          ease: easing,
        }),
        toggleActions: 'play none none none',
      });
    } else if (maskType === 'polygon') {
      // Polygon wipe
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0,0 0,0 0,100 0,100');
      clipPath.appendChild(polygon);
      maskElement = polygon;

      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        animation: gsap.to(polygon, {
          attr: { points: '0,0 100,0 100,100 0,100' },
          duration,
          ease: easing,
        }),
        toggleActions: 'play none none none',
      });
    } else {
      // Wipe (default)
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', '0');
      rect.setAttribute('height', '100');
      clipPath.appendChild(rect);
      maskElement = rect;

      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        animation: gsap.to(rect, {
          attr: { width: 100 },
          duration,
          ease: easing,
        }),
        toggleActions: 'play none none none',
      });
    }

    defs.appendChild(clipPath);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    // Apply clipPath to container
    container.style.clipPath = `url(#${clipId})`;

    maskRef.current = clipPath;

    return () => {
      svg.remove();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) {
          st.kill();
        }
      });
    };
  }, [maskType, duration, easing, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

