import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Check if device supports hover (desktop)
    const isDesktop = window.matchMedia('(hover: hover)').matches;
    if (!isDesktop) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    document.body.classList.add('custom-cursor-active');

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0,
      });
    };

    const updateFollower = () => {
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;

      followerX += dx * 0.1;
      followerY += dy * 0.1;

      gsap.to(follower, {
        x: followerX - 15,
        y: followerY - 15,
        duration: 0.3,
        ease: 'power2.out',
      });

      requestAnimationFrame(updateFollower);
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.3 });
      gsap.to(follower, { scale: 1.5, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    };

    // Interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', updateCursor);
    updateFollower();

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-gray-900 dark:bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed w-8 h-8 border-2 border-gray-900 dark:border-white rounded-full pointer-events-none z-[9998] mix-blend-difference transition-all"
        style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

export default CustomCursor;

