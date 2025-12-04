import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface FloatingBadgeProps {
  text: string;
  icon?: string;
  position?: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}

const FloatingBadge = ({ text, icon, position, delay = 0 }: FloatingBadgeProps) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (badgeRef.current) {
      // Initial animation - fade in and scale
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          delay: delay,
          ease: 'back.out(1.7)',
        }
      );

      // Continuous floating animation
      gsap.to(badgeRef.current, {
        y: '+=10',
        duration: 2 + Math.random() * 1,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: delay + 0.6,
      });
    }
  }, [delay]);

  return (
    <div
      ref={badgeRef}
      className="absolute opacity-0 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 transition-transform duration-300 z-20"
      style={position}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</span>
    </div>
  );
};

export default FloatingBadge;
