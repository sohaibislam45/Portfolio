import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export interface TimelineStage {
  id: string;
  title: string;
  content: ReactNode;
  trigger?: string; // CSS selector for trigger element
}

export interface ScrubTimelineProps {
  stages: TimelineStage[];
  progressIndicator?: boolean;
  className?: string;
  onStageChange?: (stageId: string, index: number) => void;
}

/**
 * Scrubbed Project Timeline Component
 * Creates a pinned scroll timeline with animated stage transitions
 * Used for project case studies: Problem → Research → UI → Code → Result
 */
export const ScrubTimeline = ({
  stages,
  progressIndicator = true,
  className = '',
  onStageChange,
}: ScrubTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isMobile } = useMotionSafe();

  useEffect(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion || isMobile) {
      // Fallback: simple fade/slide reveals
      const stageElements = containerRef.current.querySelectorAll('[data-stage]');
      stageElements.forEach((stage, index) => {
        ScrollTrigger.create({
          trigger: stage,
          start: 'top 80%',
          animation: gsap.fromTo(
            stage,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          ),
          toggleActions: 'play none none none',
        });
      });
      return;
    }

    const container = containerRef.current;
    const stageElements = container.querySelectorAll('[data-stage]');
    const totalStages = stages.length;

    // Create master timeline
    const masterTl = gsap.timeline({ paused: true });

    stageElements.forEach((stageEl, index) => {
      const stage = stages[index];
      if (!stage) return;

      // Stage reveal animation
      const stageTl = gsap.timeline();
      
      // Content parallax
      const content = stageEl.querySelector('[data-stage-content]');
      const images = stageEl.querySelectorAll('[data-stage-image]');

      stageTl.fromTo(
        stageEl,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      if (content) {
        stageTl.fromTo(
          content,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );
      }

      // Lazy load images when stage enters
      if (images.length > 0) {
        images.forEach((img) => {
          const imgEl = img as HTMLImageElement;
          if (imgEl.dataset.src && !imgEl.src) {
            stageTl.call(() => {
              imgEl.src = imgEl.dataset.src;
            }, undefined, index * 0.2);
          }
        });
      }

      masterTl.add(stageTl, index * 0.5);
    });

    // Progress indicator
    if (progressIndicator && progressRef.current) {
      masterTl.to(progressRef.current, {
        width: '100%',
        duration: masterTl.duration(),
        ease: 'none',
      }, 0);
    }

    // ScrollTrigger pin and scrub
    const totalDuration = totalStages * 500; // Approximate duration in pixels

    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${totalDuration}`,
      pin: true,
      scrub: 0.5,
      animation: masterTl,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentStageIndex = Math.floor(progress * totalStages);
        const currentStage = stages[currentStageIndex];
        
        if (currentStage && onStageChange) {
          onStageChange(currentStage.id, currentStageIndex);
        }
      },
    });

    return () => {
      masterTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) {
          st.kill();
        }
      });
    };
  }, [stages, progressIndicator, prefersReducedMotion, isMobile, onStageChange]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {progressIndicator && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
          <div
            ref={progressRef}
            className="h-full bg-blue-500 dark:bg-blue-400"
            style={{ width: '0%' }}
          />
        </div>
      )}
      
      {stages.map((stage, index) => (
        <div
          key={stage.id}
          data-stage={stage.id}
          className="min-h-screen flex items-center justify-center p-8"
        >
          <div data-stage-content className="max-w-4xl">
            <h2 className="text-4xl font-bold mb-4">{stage.title}</h2>
            <div>{stage.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

