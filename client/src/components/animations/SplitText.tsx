import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export type SplitMode = 'word' | 'line' | 'char';

export interface SplitTextProps {
  children: ReactNode;
  mode?: SplitMode;
  stagger?: number;
  distortionStrength?: number; // 0-1
  className?: string;
  onComplete?: () => void;
}

/**
 * Enhanced Split Text Component
 * Splits text into words/lines/chars with optional distortion/jitter overlay
 */
export const SplitText = ({
  children,
  mode = 'word',
  stagger = 0.05,
  distortionStrength = 0,
  className = '',
  onComplete,
}: SplitTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isLowPower } = useMotionSafe();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const text = container.textContent || '';
    
    // Clear container
    container.innerHTML = '';

    // Safe fallback for reduced motion or low power
    if (prefersReducedMotion || isLowPower) {
      container.textContent = text;
      gsap.fromTo(
        container,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'none', onComplete }
      );
      return;
    }

    // Split text based on mode
    let elements: HTMLElement[] = [];

    if (mode === 'word') {
      const words = text.split(' ');
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + (index < words.length - 1 ? ' ' : '');
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        container.appendChild(span);
        elements.push(span);
      });
    } else if (mode === 'line') {
      const lines = text.split('\n').filter((l) => l.trim());
      lines.forEach((line) => {
        const div = document.createElement('div');
        div.textContent = line.trim();
        div.style.overflow = 'hidden';
        container.appendChild(div);
        elements.push(div);
      });
    } else if (mode === 'char') {
      const chars = text.split('');
      chars.forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        container.appendChild(span);
        elements.push(span);
      });
    }

    // Animate reveal
    const tl = gsap.timeline({ onComplete });

    // Primary text slide
    tl.fromTo(
      elements,
      {
        y: '100%',
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger,
      }
    );

    // Distortion/jitter overlay (if enabled)
    if (distortionStrength > 0 && elements.length > 0) {
      elements.forEach((el, index) => {
        const jitter = distortionStrength * 10;
        gsap.to(el, {
          x: `+=${(Math.random() - 0.5) * jitter}`,
          y: `+=${(Math.random() - 0.5) * jitter}`,
          duration: 0.1,
          repeat: 3,
          yoyo: true,
          ease: 'power1.inOut',
          delay: stagger * index + 0.3,
        });
      });
    }

    // Scroll trigger reveal
    ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      animation: tl,
      toggleActions: 'play none none none',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) {
          st.kill();
        }
      });
    };
  }, [children, mode, stagger, distortionStrength, prefersReducedMotion, isLowPower, onComplete]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

