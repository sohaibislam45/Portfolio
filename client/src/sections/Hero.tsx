import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Canvas } from '@react-three/fiber';
import Button from '../components/Button';
import HeroBackground from '../components/HeroBackground';
import FloatingBadge from '../components/FloatingBadge';
import AnimatedBackground from '../components/AnimatedBackground';
import myPhoto from '../assets/myPhoto.png';

interface HeroProps {
  enableThreeJS?: boolean;
}

const Hero = ({ enableThreeJS = false }: HeroProps) => {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Photo container animation - slides in from left (desktop) or bottom (mobile)
    if (photoRef.current) {
      const isMobile = window.innerWidth < 1024;
      gsap.fromTo(
        photoRef.current,
        { 
          opacity: 0, 
          x: isMobile ? 0 : -100, 
          y: isMobile ? 50 : 0,
          scale: 0.9 
        },
        { 
          opacity: 1, 
          x: 0, 
          y: 0,
          scale: 1, 
          duration: 1, 
          ease: 'power3.out', 
          delay: 0.2 
        }
      );
    }

    // Photo image animation - fades in and scales
    if (photoImgRef.current) {
      gsap.fromTo(
        photoImgRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.4 }
      );
    }

    // Text container animation - slides in from right (desktop) or bottom (mobile)
    if (textContainerRef.current) {
      const isMobile = window.innerWidth < 1024;
      gsap.fromTo(
        textContainerRef.current,
        { 
          opacity: 0, 
          x: isMobile ? 0 : 100,
          y: isMobile ? 30 : 0
        },
        { 
          opacity: 1, 
          x: 0,
          y: 0,
          duration: 1, 
          ease: 'power3.out', 
          delay: 0.3 
        }
      );
    }

    // Typing effect for heading with cursor
    const typeWriter = (element: HTMLElement, text: string, speed: number, delay: number, callback?: () => void) => {
      if (!element) return;
      
      element.innerHTML = '';
      element.style.opacity = '1';
      
      // Add blinking cursor
      const cursor = document.createElement('span');
      cursor.className = 'inline-block w-0.5 h-[1em] bg-current ml-1';
      cursor.style.animation = 'blink 1s infinite';
      element.appendChild(cursor);
      
      let i = 0;
      const textSpan = document.createElement('span');
      element.insertBefore(textSpan, cursor);
      
      const type = () => {
        if (i < text.length) {
          textSpan.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          // Remove cursor when done
          cursor.remove();
          if (callback) {
            callback();
          }
        }
      };
      
      setTimeout(type, delay);
    };

    // Type line 1
    if (line1Ref.current) {
      typeWriter(line1Ref.current, 'Creating digital', 80, 500);
    }
    
    // Type line 2
    if (line2Ref.current) {
      const line1Length = 'Creating digital'.length;
      const line1Delay = 500 + (line1Length * 80) + 300; // Wait for line 1 + pause
      typeWriter(line2Ref.current, 'experience', 80, line1Delay);
    }

    // Subheading animation
    if (subheadingRef.current) {
      gsap.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: 'power3.out' }
      );
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.1, ease: 'power3.out' }
      );
    }

    // Enhanced interactive mouse-follow effects (desktop only)
    if (sectionRef.current && window.innerWidth >= 1024) {
      let mouseX = 0;
      let mouseY = 0;
      let followerX = 0;
      let followerY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const { innerWidth, innerHeight } = window;
        
        // Parallax effects
        const xPercent = (mouseX / innerWidth - 0.5) * 20;
        const yPercent = (mouseY / innerHeight - 0.5) * 20;
        
        if (photoRef.current) {
          gsap.to(photoRef.current, {
            x: xPercent,
            y: yPercent,
            duration: 1.5,
            ease: 'power1.out',
          });
        }
        
        if (textContainerRef.current) {
          gsap.to(textContainerRef.current, {
            x: -xPercent * 0.5,
            y: -yPercent * 0.5,
            duration: 1.5,
            ease: 'power1.out',
          });
        }

        // Cursor follower (glow effect)
        if (cursorFollowerRef.current) {
          followerX += (mouseX - followerX) * 0.15;
          followerY += (mouseY - followerY) * 0.15;
          
          gsap.to(cursorFollowerRef.current, {
            x: followerX - 150,
            y: followerY - 150,
            duration: 0.8,
            ease: 'power2.out',
          });
        }

        // Create particles on mouse move
        if (particlesRef.current && Math.random() > 0.7) {
          createParticle(mouseX, mouseY);
        }
      };

      // Create floating particles
      const createParticle = (x: number, y: number) => {
        if (!particlesRef.current) return;
        
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 rounded-full bg-primary-400/30 pointer-events-none';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particlesRef.current.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        
        gsap.to(particle, {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity,
          opacity: 0,
          scale: 0,
          duration: 1 + Math.random(),
          ease: 'power2.out',
          onComplete: () => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          },
        });
      };

      // Enhanced hover effects on interactive elements
      const handleElementHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'BUTTON' || target.closest('button')) {
          if (cursorFollowerRef.current) {
            gsap.to(cursorFollowerRef.current, {
              scale: 1.5,
              opacity: 0.6,
              duration: 0.3,
            });
          }
        }
      };

      const handleElementLeave = () => {
        if (cursorFollowerRef.current) {
          gsap.to(cursorFollowerRef.current, {
            scale: 1,
            opacity: 0.3,
            duration: 0.3,
          });
        }
      };

      sectionRef.current.addEventListener('mousemove', handleMouseMove);
      sectionRef.current.addEventListener('mouseenter', handleElementHover);
      sectionRef.current.addEventListener('mouseleave', handleElementLeave);
      
      // Initialize cursor follower position
      if (cursorFollowerRef.current) {
        gsap.to(cursorFollowerRef.current, {
          opacity: 0.3,
          duration: 0.5,
          delay: 0.5,
        });
      }
      
      return () => {
        if (sectionRef.current) {
          sectionRef.current.removeEventListener('mousemove', handleMouseMove);
          sectionRef.current.removeEventListener('mouseenter', handleElementHover);
          sectionRef.current.removeEventListener('mouseleave', handleElementLeave);
        }
      };
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skills = [
    { text: 'React', icon: '⚛️', position: { top: '15%', right: '10%' } },
    { text: 'Node.js', icon: '🟢', position: { top: '30%', right: '5%' } },
    { text: 'TypeScript', icon: '🔷', position: { bottom: '25%', right: '15%' } },
    { text: 'MongoDB', icon: '🍃', position: { bottom: '40%', right: '8%' } },
  ];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 mt-16 md:mt-20"
    >
      {/* Cursor follower glow effect */}
      <div
        ref={cursorFollowerRef}
        className="hidden lg:block fixed w-[300px] h-[300px] rounded-full bg-gradient-to-r from-primary-400/20 via-blue-400/20 to-purple-400/20 blur-3xl pointer-events-none z-0"
        style={{ opacity: 0 }}
      />

      {/* Particles container */}
      <div ref={particlesRef} className="hidden lg:block fixed inset-0 pointer-events-none z-10" />

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Three.js Background */}
      {enableThreeJS && (
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <HeroBackground />
          </Canvas>
        </div>
      )}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center min-h-[85vh] md:min-h-[80vh]">
          {/* Left Side - Photo */}
          <div
            ref={photoRef}
            className="relative opacity-0 flex items-center justify-center lg:justify-start"
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 via-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              {/* Photo container */}
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl border-4 border-white/50 dark:border-gray-700/50">
                <img
                  ref={photoImgRef}
                  src={myPhoto}
                  alt="Profile"
                  className="w-full max-w-lg h-auto object-cover opacity-0 scale-110 transition-transform duration-700 group-hover:scale-105"
                  style={{ aspectRatio: '4/5', maxHeight: '600px' }}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-400/20 rounded-full blur-xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
            </div>
          </div>

          {/* Right Side - Content */}
          <div
            ref={textContainerRef}
            className="relative opacity-0 flex flex-col justify-center space-y-6 w-full min-w-0 overflow-hidden pr-4 md:pr-8 lg:pr-12"
          >
            {/* Glassmorphism content card */}
            <div className="relative p-8 md:p-10 lg:p-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 w-full max-w-full overflow-hidden">
              {/* Badge above heading */}
              <div className="inline-block mb-4 px-4 py-2 bg-primary-100/80 dark:bg-primary-900/40 rounded-full">
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  Full Stack Developer
                </span>
              </div>

              {/* Heading with gradient */}
              <h1
                className="text-5xl font-bold mb-6 leading-tight break-words w-full"
              >
                <span 
                  ref={line1Ref}
                  className="block bg-gradient-to-r from-gray-900 via-primary-600 to-blue-600 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent"
                  style={{ opacity: 0 }}
                >
                  {/* Text will be typed by animation */}
                </span>
                <span 
                  ref={line2Ref}
                  className="block bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 dark:from-primary-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mt-1"
                  style={{ opacity: 0 }}
                >
                  {/* Text will be typed by animation */}
                </span>
              </h1>

              {/* Subheading */}
              <p
                ref={subheadingRef}
                className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-xl"
                style={{ opacity: 0 }}
              >
                Building modern web applications with{' '}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  React
                </span>
                ,{' '}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  Node.js
                </span>
                , and{' '}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  MongoDB
                </span>
                . Crafting beautiful, performant solutions that users love.
              </p>

              {/* CTA Buttons */}
              <div
                ref={ctaRef}
                className="flex flex-col sm:flex-row gap-4"
                style={{ opacity: 0 }}
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection('projects')}
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  View Projects
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('contact')}
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  Contact Me
                </Button>
              </div>
            </div>

            {/* Floating skill badges - Desktop only */}
            <div className="hidden lg:block">
              {skills.map((skill, index) => (
                <FloatingBadge
                  key={index}
                  text={skill.text}
                  icon={skill.icon}
                  position={skill.position}
                  delay={1.3 + index * 0.2}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with animated arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center gap-2 group transition-all duration-300 hover:scale-110"
          aria-label="Scroll to about section"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex items-start justify-center p-2 group-hover:border-primary-500 dark:group-hover:border-primary-400 transition-colors">
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 animate-arrow-bounce transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Hero;