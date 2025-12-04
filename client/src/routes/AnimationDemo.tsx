import { useState } from 'react';
import { HeroTimeline } from '../components/animations/HeroTimeline';
import { ParallaxLayer, MultiParallax } from '../components/animations/ParallaxLayer';
import { SplitText } from '../components/animations/SplitText';
import { ScrubTimeline } from '../components/animations/ScrubTimeline';
import { RevealMask } from '../components/animations/RevealMask';
import { LottiePlayer } from '../components/animations/LottiePlayer';
import { MotionControls } from '../components/animations/MotionControls';
import { usePhysicsHover, useDraggable } from '../hooks/usePhysicsHover';
import { ParticleEngine } from '../utils/particleEngine';
import { useEffect, useRef } from 'react';
import { drawSVGPath, revealSVGOnScroll } from '../utils/svgAnimation';
import { createCursorManager } from '../utils/cursorManager';

/**
 * Animation Demo Page
 * Showcases all animation components with toggles
 */
export const AnimationDemo = () => {
  const [particleEngine, setParticleEngine] = useState<ParticleEngine | null>(null);
  const buttonRef = usePhysicsHover<HTMLButtonElement>({ scale: 1.1, rotation: 5 });
  const draggableRef = useDraggable<HTMLDivElement>();
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Initialize cursor manager
    const cursorManager = createCursorManager({
      showLabelOnHover: true,
      hideOnTouch: true,
      lerp: 0.15,
    });

    // Initialize particle engine
    if (particleContainerRef.current) {
      const engine = new ParticleEngine({
        intensity: 0.5,
        maxParticles: 50,
        autoDisableMobile: true,
      });
      engine.init(particleContainerRef.current);
      setParticleEngine(engine);
    }

    // Initialize SVG drawing
    if (svgRef.current) {
      revealSVGOnScroll(svgRef.current, {
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }

    return () => {
      cursorManager.destroy();
      particleEngine?.destroy();
    };
  }, []);

  const handleParticleClick = (e: React.MouseEvent) => {
    if (particleEngine) {
      particleEngine.emit(e.clientX, e.clientY, 20);
    }
  };

  const handleRipple = (e: React.MouseEvent) => {
    if (particleEngine) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      particleEngine.ripple(
        e.clientX - rect.left,
        e.clientY - rect.top,
        '#3b82f6'
      );
    }
  };

  const handleConfetti = () => {
    if (particleEngine) {
      particleEngine.confetti(2000);
    }
  };

  const stages = [
    {
      id: 'problem',
      title: 'Problem',
      content: <p>Identifying the core challenge and user pain points.</p>,
    },
    {
      id: 'research',
      title: 'Research',
      content: <p>Conducting user research and market analysis.</p>,
    },
    {
      id: 'ui',
      title: 'UI Design',
      content: <p>Creating intuitive and beautiful user interfaces.</p>,
    },
    {
      id: 'code',
      title: 'Development',
      content: <p>Building robust and performant solutions.</p>,
    },
    {
      id: 'result',
      title: 'Result',
      content: <p>Delivering successful outcomes and measurable impact.</p>,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header with Motion Controls */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Animation Demo</h1>
        <MotionControls />
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {/* Hero Timeline */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">1. Hero Timeline</h2>
          <HeroTimeline pinDuration="80vh" scrubSpeed={0.5} disablePinMobile={true}>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
              <div data-hero-text className="text-6xl font-bold mb-4">
                Hero Section
              </div>
              <div data-hero-split className="text-2xl mb-8">
                <SplitText mode="word" stagger={0.1}>
                  Scroll to see the timeline scrub
                </SplitText>
              </div>
              <div data-hero-canvas className="w-64 h-64 bg-white/20 rounded-lg mb-8" />
              <div data-hero-cta>
                <button
                  ref={buttonRef}
                  onClick={handleParticleClick}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Get Started
                </button>
              </div>
            </div>
          </HeroTimeline>
        </section>

        {/* Parallax Layers */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">2. Multi-Layer Parallax</h2>
          <div className="h-[600px] relative overflow-hidden rounded-lg">
            <MultiParallax depthFactors={[0.3, 0.6, 1.0]} maxOffset={100} followPointer={true}>
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-900 flex items-center justify-center">
                <p className="text-4xl font-bold">Foreground</p>
              </div>
              <div className="absolute inset-0 bg-purple-200 dark:bg-purple-900 flex items-center justify-center opacity-80">
                <p className="text-4xl font-bold">Mid Layer</p>
              </div>
              <div className="absolute inset-0 bg-pink-200 dark:bg-pink-900 flex items-center justify-center opacity-60">
                <p className="text-4xl font-bold">Background</p>
              </div>
            </MultiParallax>
          </div>
        </section>

        {/* SVG Drawing */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">3. SVG Path Drawing</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
            <svg
              ref={svgRef}
              viewBox="0 0 200 100"
              className="w-full h-48"
            >
              <path
                d="M 10 50 Q 50 10, 90 50 T 170 50"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </section>

        {/* Split Text */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">4. Split Text with Distortion</h2>
          <SplitText mode="word" stagger={0.05} distortionStrength={0.3}>
            <h3 className="text-5xl font-bold">This text splits into words with jitter effect</h3>
          </SplitText>
          <SplitText mode="char" stagger={0.02}>
            <h4 className="text-3xl font-semibold">Character by character reveal</h4>
          </SplitText>
        </section>

        {/* Scrub Timeline */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">5. Scrubbed Project Timeline</h2>
          <ScrubTimeline stages={stages} progressIndicator={true} />
        </section>

        {/* Reveal Masks */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">6. Reveal Masks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RevealMask maskType="liquid" duration={1.0}>
              <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                Liquid Mask
              </div>
            </RevealMask>
            <RevealMask maskType="radial" duration={1.0}>
              <div className="h-64 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                Radial Mask
              </div>
            </RevealMask>
            <RevealMask maskType="wipe" duration={1.0}>
              <div className="h-64 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                Wipe Mask
              </div>
            </RevealMask>
          </div>
        </section>

        {/* Particle Effects */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">7. Particle & Ripple Effects</h2>
          <div
            ref={particleContainerRef}
            className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg relative cursor-pointer"
            onClick={handleParticleClick}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl font-semibold">Click for particles</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRipple}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ripple Effect
            </button>
            <button
              onClick={handleConfetti}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Confetti
            </button>
          </div>
        </section>

        {/* Draggable */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">8. Draggable Micro-interactions</h2>
          <div
            ref={draggableRef}
            className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold cursor-grab"
          >
            Drag Me
          </div>
        </section>

        {/* Lottie Player */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">9. Lottie Animation</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
            <LottiePlayer
              src="https://lottie.host/embed/your-lottie-animation.json"
              playOnEnter={true}
              scrubWithScroll={false}
              loop={true}
              poster="/lottie-poster.svg"
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Note: Replace with your Lottie JSON URL
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

