import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeIdRef = useRef(0);

  useEffect(() => {
    if (containerRef.current) {
      const circles = containerRef.current.querySelectorAll('.animated-circle');
      
      circles.forEach((circle, index) => {
        const element = circle as HTMLElement;
        const duration = 10 + Math.random() * 10;
        const delay = index * 0.5;
        
        // Create floating animation for circles
        if (element.classList.contains('rounded-full')) {
          gsap.to(element, {
            y: '+=100',
            x: '+=50',
            rotation: 360,
            duration: duration,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: delay,
          });
        } else {
          // Different animation for geometric shapes
          gsap.to(element, {
            y: '+=60',
            x: '+=30',
            rotation: index % 2 === 0 ? 180 : -180,
            duration: duration * 0.8,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: delay,
          });
        }
        
        // Opacity pulse - higher base opacity for geometric shapes
        const baseOpacity = element.classList.contains('rounded-full') 
          ? 0.05 + Math.random() * 0.15 
          : 0.15 + Math.random() * 0.25;
        
        gsap.to(element, {
          opacity: baseOpacity,
          duration: 2 + Math.random() * 2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: delay,
        });
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient circles */}
      <div className="animated-circle absolute w-64 h-64 rounded-full bg-gradient-to-br from-primary-400/20 to-primary-600/20 blur-3xl top-10 left-10" />
      <div className="animated-circle absolute w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/15 to-pink-400/15 blur-3xl bottom-20 right-20" />
      <div className="animated-circle absolute w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/15 to-cyan-400/15 blur-3xl top-1/2 left-1/3" />
      
      {/* Geometric shapes - Triangles */}
      <div className="animated-circle absolute w-40 h-40 top-20 right-10" style={{ opacity: 0.25 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="triangle-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon
            points="50,10 90,90 10,90"
            fill="url(#triangle-gradient-bg)"
          />
        </svg>
      </div>

      {/* Geometric shapes - Hexagons */}
      <div className="animated-circle absolute w-48 h-48 bottom-32 left-16" style={{ opacity: 0.25 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="hexagon-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 90,30 90,70 50,95 10,70 10,30"
            fill="url(#hexagon-gradient-bg)"
          />
        </svg>
      </div>

      {/* Geometric shapes - Squares */}
      <div className="animated-circle absolute w-32 h-32 top-1/3 right-1/4" style={{ opacity: 0.25 }}>
        <div
          className="w-full h-full border-2 border-primary-400/50 rotate-45"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(59, 130, 246, 0.3))',
          }}
        />
      </div>

      {/* Geometric shapes - Diamond */}
      <div className="animated-circle absolute w-36 h-36 bottom-1/4 right-1/3" style={{ opacity: 0.25 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="diamond-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 95,50 50,95 5,50"
            fill="url(#diamond-gradient-bg)"
          />
        </svg>
      </div>

      {/* Geometric shapes - Pentagon */}
      <div className="animated-circle absolute w-44 h-44 top-1/2 right-1/5" style={{ opacity: 0.25 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="pentagon-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon
            points="50,10 90,40 75,85 25,85 10,40"
            fill="url(#pentagon-gradient-bg)"
          />
        </svg>
      </div>

      {/* Geometric shapes - Star */}
      <div className="animated-circle absolute w-36 h-36 top-1/4 left-1/4" style={{ opacity: 0.25 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="star-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 61,38 95,38 68,57 79,90 50,70 21,90 32,57 5,38 39,38"
            fill="url(#star-gradient-bg)"
          />
        </svg>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
           style={{
             backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }}
      />
    </div>
  );
};

export default AnimatedBackground;
