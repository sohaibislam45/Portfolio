import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export interface HeroTimelineProps {
  children: ReactNode;
  pinDuration?: number | string; // px or percentage like "100vh"
  scrubSpeed?: number; // 0-1
  disablePinMobile?: boolean;
  className?: string;
  onComplete?: () => void;
}

/**
 * Hero Timeline Component
 * Pins hero section and scrubs GSAP timeline in sync with scroll
 * Supports: text distortion → split-text reveal → 3D transform → CTA reveal
 */
export const HeroTimeline = ({
  children,
  pinDuration = '100vh',
  scrubSpeed = 0.5,
  disablePinMobile = true,
  className = '',
  onComplete,
}: HeroTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { prefersReducedMotion, isMobile, allowHeavyEffects } = useMotionSafe();

  useEffect(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion) return;
    if (isMobile && disablePinMobile) return;

    const container = containerRef.current;
    const elements = {
      text: container.querySelector('[data-hero-text]'),
      splitText: container.querySelector('[data-hero-split]'),
      canvas: container.querySelector('[data-hero-canvas]'),
      cta: container.querySelector('[data-hero-cta]'),
    };

    // Create timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: onComplete,
    });

    // Text distortion phase
    if (elements.text) {
      tl.to(elements.text, {
        filter: 'blur(10px)',
        opacity: 0.5,
        duration: 0.3,
      });
    }

    // Split text reveal
    if (elements.splitText) {
      const words = elements.splitText.querySelectorAll('span, div');
      tl.fromTo(
        words,
        {
          y: '100%',
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
        },
        '-=0.2'
      );
    }

    // 3D canvas transform
    if (elements.canvas && allowHeavyEffects) {
      tl.to(elements.canvas, {
        scale: 1.05,
        rotationY: 5,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.3');
    }

    // CTA reveal
    if (elements.cta) {
      tl.fromTo(
        elements.cta,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.2'
      );
    }

    timelineRef.current = tl;

    // ScrollTrigger pin and scrub
    const pinValue = typeof pinDuration === 'string' 
      ? pinDuration 
      : `${pinDuration}px`;

    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${pinValue}`,
      pin: true,
      scrub: scrubSpeed,
      animation: tl,
      onUpdate: (self) => {
        // Optional: emit progress events
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) {
          st.kill();
        }
      });
    };
  }, [pinDuration, scrubSpeed, disablePinMobile, prefersReducedMotion, isMobile, allowHeavyEffects, onComplete]);

  // Refresh ScrollTrigger on layout changes
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

