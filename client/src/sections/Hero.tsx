import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Canvas } from '@react-three/fiber';
import { splitTextIntoWords, animateTextReveal } from '../animations/textSplit';
import Button from '../components/Button';
import HeroBackground from '../components/HeroBackground';
import myPhoto from '../assets/myPhoto.png';

interface HeroProps {
  enableThreeJS?: boolean;
}

const Hero = ({ enableThreeJS = false }: HeroProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Photo animation - fades in and scales
    if (photoRef.current) {
      gsap.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 0.5, scale: 1, duration: 0.8, ease: 'power3.out' }
      );
    }

    // Text container animation - fades in
    if (textContainerRef.current) {
      gsap.fromTo(
        textContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
    }

    // Heading animation - starts at 0.2s
    if (headingRef.current) {
      const words = splitTextIntoWords(headingRef.current);
      animateTextReveal(words, { delay: 0.2, stagger: 0.1, from: 'bottom' });
    }

    // Subheading animation - starts at 0.8s
    if (subheadingRef.current) {
      gsap.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' }
      );
    }

    // CTA animation - starts at 1.2s
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power3.out' }
      );
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800"
    >
      {enableThreeJS && (
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <HeroBackground />
          </Canvas>
        </div>
      )}

      {/* Background Photo - Centered */}
      <img
        ref={photoRef}
        src={myPhoto}
        alt="Profile"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        style={{ 
          opacity: 0,
          zIndex: 1,
          transform: 'scale(0.95)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div
          ref={textContainerRef}
          style={{ opacity: 0 }}
        >
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Full Stack Developer
          </h1>
          <p
            ref={subheadingRef}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Building modern web applications with React, Node.js, and MongoDB
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
            >
              View Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
            >
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

