import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export interface LottiePlayerProps {
  src: string; // URL to Lottie JSON file
  playOnEnter?: boolean;
  scrubWithScroll?: boolean;
  className?: string;
  poster?: string; // Fallback static image
  loop?: boolean;
  autoplay?: boolean;
}

/**
 * Lottie Animation Player Component
 * Supports play/pause/scrub via ScrollTrigger
 * Falls back to static SVG poster if Lottie fails to load
 */
export const LottiePlayer = ({
  src,
  playOnEnter = true,
  scrubWithScroll = false,
  className = '',
  poster,
  loop = true,
  autoplay = false,
}: LottiePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const [error, setError] = useState(false);
  const animationRef = useRef<any>(null);
  const { prefersReducedMotion, allowHeavyEffects } = useMotionSafe();

  useEffect(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion || !allowHeavyEffects) {
      // Show static poster
      setError(true);
      return;
    }

    // Dynamically load lottie-web
    const loadLottie = async () => {
      try {
        const lottie = await import('lottie-web');
        const Lottie = lottie.default;

        const animation = Lottie.loadAnimation({
          container: containerRef.current!,
          renderer: 'svg',
          loop,
          autoplay,
          path: src,
        });

        animationRef.current = animation;
        setLottieLoaded(true);

        // ScrollTrigger integration
        if (scrubWithScroll) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              animation.goToAndStop(progress * animation.totalFrames, true);
            },
          });
        } else if (playOnEnter) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top 80%',
            animation: gsap.to({}, {
              duration: 0.1,
              onStart: () => {
                animation.play();
              },
            }),
            toggleActions: 'play none none none',
          });
        }
      } catch (err) {
        console.warn('LottiePlayer: Failed to load animation', err);
        setError(true);
      }
    };

    loadLottie();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === containerRef.current) {
          st.kill();
        }
      });
    };
  }, [src, playOnEnter, scrubWithScroll, loop, autoplay, prefersReducedMotion, allowHeavyEffects]);

  if (error && poster) {
    return (
      <div className={className}>
        <img src={poster} alt="Animation poster" className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: '200px' }}
    />
  );
};

