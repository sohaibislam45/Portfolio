import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Canvas } from '@react-three/fiber';
import { splitTextIntoWords, animateTextReveal } from '../animations/textSplit';
import Button from '../components/Button';
import HeroBackground from '../components/HeroBackground';

interface HeroProps {
  enableThreeJS?: boolean;
}

const Hero = ({ enableThreeJS = false }: HeroProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      const words = splitTextIntoWords(headingRef.current);
      animateTextReveal(words, { delay: 0.2, stagger: 0.1, from: 'bottom' });
    }

    if (subheadingRef.current) {
      gsap.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' }
      );
    }

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

      <div className="container mx-auto px-6 relative z-10 text-center">
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
    </section>
  );
};

export default Hero;

