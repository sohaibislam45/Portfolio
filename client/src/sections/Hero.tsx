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
    // Photo animation - slides in from right with fade and scale
    if (photoRef.current) {
      gsap.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.9, x: 100 },
        { opacity: 0.6, scale: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    // Text container animation - slides in from left
    if (textContainerRef.current) {
      gsap.fromTo(
        textContainerRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
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
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: 'power3.out' }
      );
    }

    // CTA animation - starts at 1.2s
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, delay: 1.2, ease: 'power3.out' }
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

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content - Left Side */}
          <div
            ref={textContainerRef}
            className="flex-1 w-full lg:w-1/2 text-center lg:text-left"
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
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0"
            >
              Building modern web applications with React, Node.js, and MongoDB
            </p>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

          {/* Photo - Right Side */}
          <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center">
            <img
              ref={photoRef}
              src={myPhoto}
              alt="Profile"
              className="w-full max-w-md lg:max-w-lg h-auto object-contain rounded-lg shadow-2xl"
              style={{ 
                opacity: 0,
                transform: 'scale(0.9) translateX(100px)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

