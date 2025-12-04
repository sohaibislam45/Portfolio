# Animation System Documentation

## Overview

This document describes the comprehensive animation system built for the portfolio website. All animations are designed to be reusable, performant, accessible, and mobile-friendly.

## Table of Contents

1. [Components & Hooks](#components--hooks)
2. [Configuration](#configuration)
3. [Usage Examples](#usage-examples)
4. [Performance & Lazy Loading](#performance--lazy-loading)
5. [Accessibility](#accessibility)
6. [Mobile Behavior](#mobile-behavior)
7. [Troubleshooting](#troubleshooting)

---

## Components & Hooks

### 1. HeroTimeline

**Purpose**: Pins hero section and scrubs GSAP timeline in sync with scroll.

**Props**:
- `pinDuration` (number | string): Scroll distance for pinning. Default: `'100vh'`
- `scrubSpeed` (number): Scrub speed 0-1. Default: `0.5`
- `disablePinMobile` (boolean): Disable pinning on mobile. Default: `true`
- `className` (string): Additional CSS classes
- `onComplete` (function): Callback when timeline completes

**Usage**:
```tsx
<HeroTimeline pinDuration="80vh" scrubSpeed={0.5}>
  <div data-hero-text>Text</div>
  <div data-hero-split>Split text</div>
  <div data-hero-canvas>3D Canvas</div>
  <div data-hero-cta>CTA Button</div>
</HeroTimeline>
```

---

### 2. ParallaxLayer & MultiParallax

**Purpose**: Creates parallax layers that move at different speeds on scroll and pointer move.

**Props**:
- `depthFactor` (number): Movement factor 0-1. Default: `0.5`
- `maxOffset` (number): Maximum offset in pixels. Default: `100`
- `followPointer` (boolean): Enable pointer follow. Default: `false`
- `depthFactors` (number[]): Array of factors for multi-layer. Default: `[0.3, 0.6, 1.0]`

**Usage**:
```tsx
<ParallaxLayer depthFactor={0.5} maxOffset={100} followPointer={true}>
  <div>Content</div>
</ParallaxLayer>

<MultiParallax depthFactors={[0.3, 0.6, 1.0]} maxOffset={100}>
  <div>Foreground</div>
  <div>Mid</div>
  <div>Background</div>
</MultiParallax>
```

---

### 3. SplitText

**Purpose**: Splits text into words/lines/chars with optional distortion/jitter.

**Props**:
- `mode` ('word' | 'line' | 'char'): Split mode. Default: `'word'`
- `stagger` (number): Stagger delay. Default: `0.05`
- `distortionStrength` (number): Jitter strength 0-1. Default: `0`
- `className` (string): Additional CSS classes
- `onComplete` (function): Callback on completion

**Usage**:
```tsx
<SplitText mode="word" stagger={0.1} distortionStrength={0.3}>
  <h1>Animated Heading</h1>
</SplitText>
```

---

### 4. ScrubTimeline

**Purpose**: Pinned scroll timeline for project case studies.

**Props**:
- `stages` (TimelineStage[]): Array of stage objects
- `progressIndicator` (boolean): Show progress bar. Default: `true`
- `className` (string): Additional CSS classes
- `onStageChange` (function): Callback on stage change

**Usage**:
```tsx
<ScrubTimeline
  stages={[
    { id: 'problem', title: 'Problem', content: <p>...</p> },
    { id: 'solution', title: 'Solution', content: <p>...</p> },
  ]}
  progressIndicator={true}
/>
```

---

### 5. RevealMask

**Purpose**: SVG/Canvas mask reveals with organic animations.

**Props**:
- `maskType` ('liquid' | 'radial' | 'polygon' | 'wipe'): Mask type. Default: `'liquid'`
- `duration` (number): Animation duration. Default: `1.0`
- `easing` (string): GSAP easing. Default: `'power2.inOut'`
- `className` (string): Additional CSS classes

**Usage**:
```tsx
<RevealMask maskType="liquid" duration={1.0}>
  <div>Content to reveal</div>
</RevealMask>
```

---

### 6. LottiePlayer

**Purpose**: Lottie animation wrapper with ScrollTrigger support.

**Props**:
- `src` (string): URL to Lottie JSON
- `playOnEnter` (boolean): Play on scroll enter. Default: `true`
- `scrubWithScroll` (boolean): Scrub with scroll. Default: `false`
- `loop` (boolean): Loop animation. Default: `true`
- `autoplay` (boolean): Autoplay. Default: `false`
- `poster` (string): Fallback image URL

**Usage**:
```tsx
<LottiePlayer
  src="/animations/hero.json"
  playOnEnter={true}
  scrubWithScroll={false}
  poster="/animations/hero-poster.svg"
/>
```

---

### 7. usePhysicsHover

**Purpose**: Spring-based hover interactions.

**Config**:
- `mass` (number): Physics mass. Default: `1`
- `stiffness` (number): Spring stiffness. Default: `300`
- `damping` (number): Damping. Default: `20`
- `scale` (number): Hover scale. Default: `1.05`
- `rotation` (number): Hover rotation. Default: `2`
- `instant` (boolean): Instant response. Default: `false`

**Usage**:
```tsx
const buttonRef = usePhysicsHover({ scale: 1.1, rotation: 5 });
<button ref={buttonRef}>Hover Me</button>
```

---

### 8. useDraggable

**Purpose**: Draggable micro-interactions.

**Usage**:
```tsx
const draggableRef = useDraggable((x, y) => {
  console.log('Dragged:', x, y);
});
<div ref={draggableRef}>Drag Me</div>
```

---

### 9. CursorManager

**Purpose**: Custom cursor with contextual states.

**Usage**:
```tsx
import { createCursorManager } from '../utils/cursorManager';

const cursorManager = createCursorManager({
  showLabelOnHover: true,
  hideOnTouch: true,
  lerp: 0.15,
});

// Register cursor states
cursorManager.register('a, button', 'link', 'Click me');
cursorManager.register('.draggable', 'grab');
```

---

### 10. ParticleEngine

**Purpose**: Particle and ripple effects.

**Usage**:
```tsx
import { ParticleEngine } from '../utils/particleEngine';

const engine = new ParticleEngine({
  intensity: 0.5,
  maxParticles: 50,
  autoDisableMobile: true,
});

engine.init('#container');
engine.emit(x, y, 20); // Emit particles
engine.ripple(x, y, '#3b82f6'); // Ripple effect
engine.confetti(2000); // Confetti for 2s
```

---

### 11. SVG Animation Utilities

**Purpose**: SVG path drawing and morphing.

**Usage**:
```tsx
import { drawSVGPath, morphSVGPath, revealSVGOnScroll } from '../utils/svgAnimation';

// Draw SVG path
drawSVGPath('#svg-element', { duration: 1.5, ease: 'power2.inOut' });

// Morph between paths
morphSVGPath('#path1', '#path2', { duration: 1.0 });

// Reveal on scroll
revealSVGOnScroll('#svg-element', {
  duration: 1.5,
  trigger: '#trigger-element',
});
```

---

## Configuration

### Motion Config

Located in `client/src/config/motion-config.ts`:

```typescript
{
  timing: {
    defaultDuration: 0.8,
    defaultEase: 'power3.out',
    staggerBase: 0.1,
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
  features: {
    threeJS: true,
    lottie: true,
    particles: true,
    cursor: true,
    parallax: true,
  },
  performance: {
    lowPowerThreshold: 4,
    maxParticles: 100,
    enableDebug: false,
  },
  accessibility: {
    respectReducedMotion: true,
    reducedMotionDuration: 0.3,
    reducedMotionEase: 'none',
  },
}
```

### useMotionSafe Hook

Returns motion-safe state:

```tsx
const {
  prefersReducedMotion,
  isLowPower,
  isMobile,
  isTablet,
  allowHeavyEffects,
  allowParallax,
  allowParticles,
  allowCursor,
} = useMotionSafe();
```

---

## Performance & Lazy Loading

### Lazy Initialization

Heavy features (Three.js, ParticleEngine, Lottie) lazy-initialize when:
- Viewport width >= breakpoint
- `allowHeavyEffects` is true
- `prefersReducedMotion` is false

### Intersection Observer

Use `getPerformanceMonitor().lazyInit()`:

```tsx
import { getPerformanceMonitor } from '../utils/performanceUtils';

useEffect(() => {
  const cleanup = getPerformanceMonitor().lazyInit(
    '#heavy-element',
    () => {
      // Initialize heavy animation
    },
    { rootMargin: '50px' }
  );
  return cleanup;
}, []);
```

### Debug Mode

Enable debug logging:

```typescript
import { getMotionConfig, saveMotionConfig } from '../config/motion-config';

const config = getMotionConfig();
config.performance.enableDebug = true;
saveMotionConfig(config);
```

---

## Accessibility

### Motion Controls

Add `MotionControls` component to header/settings:

```tsx
import { MotionControls } from '../components/animations/MotionControls';

<MotionControls />
```

Users can toggle:
- **Full Motion**: All animations enabled
- **Reduced Motion**: Simplified animations, no particles
- **Motion Off**: All animations disabled

### prefers-reduced-motion

All components automatically respect `prefers-reduced-motion`:
- Disables scrubbing/pinning
- Uses instant/simple animations
- Falls back to opacity/scale reveals

### Keyboard Navigation

All animated content remains keyboard-focusable. Focus outlines are never hidden.

### ARIA Notices

Add ARIA notices for time-based content:

```tsx
<div role="region" aria-label="Animated content">
  <p className="sr-only">
    This section contains animated content. Reduce motion in your OS preferences to disable.
  </p>
  {/* Animated content */}
</div>
```

---

## Mobile Behavior

On widths < 768px:

- **Cursor**: Disabled (hidden on touch devices)
- **Particles**: Disabled (autoDisableMobile: true)
- **Parallax**: Simplified vertical translate only
- **Pinned Timelines**: Replaced with fade/slide reveals
- **Pointer Follow**: Disabled

### Disable on Mobile

Use `disableOnMobile` prop or check `isMobile` from `useMotionSafe()`:

```tsx
const { isMobile } = useMotionSafe();

if (isMobile) {
  // Use simplified animation
}
```

---

## Troubleshooting

### ScrollTrigger not refreshing

Call `ScrollTrigger.refresh()` after layout changes:

```tsx
useEffect(() => {
  ScrollTrigger.refresh();
}, [dependencies]);
```

### Animations not working

1. Check `useMotionSafe()` state
2. Verify motion config
3. Check browser console for errors
4. Ensure GSAP/ScrollTrigger are registered

### Performance issues

1. Enable debug mode to check init times
2. Reduce particle count
3. Disable heavy effects on low-power devices
4. Use lazy initialization

### Lottie not loading

1. Check JSON URL is accessible
2. Verify `lottie-web` is installed: `npm install lottie-web`
3. Check browser console for CORS errors
4. Ensure poster fallback is provided

---

## Demo Page

Visit `/animation-demo` to see all animations in action with toggles and examples.

---

## Quick Reference

| Component | File | Props Count | Defaults |
|-----------|------|-------------|----------|
| HeroTimeline | `components/animations/HeroTimeline.tsx` | 5 | pinDuration: '100vh', scrubSpeed: 0.5 |
| ParallaxLayer | `components/animations/ParallaxLayer.tsx` | 5 | depthFactor: 0.5, maxOffset: 100 |
| SplitText | `components/animations/SplitText.tsx` | 5 | mode: 'word', stagger: 0.05 |
| ScrubTimeline | `components/animations/ScrubTimeline.tsx` | 3 | progressIndicator: true |
| RevealMask | `components/animations/RevealMask.tsx` | 4 | maskType: 'liquid', duration: 1.0 |
| LottiePlayer | `components/animations/LottiePlayer.tsx` | 6 | playOnEnter: true, loop: true |
| usePhysicsHover | `hooks/usePhysicsHover.ts` | 6 | scale: 1.05, rotation: 2 |
| ParticleEngine | `utils/particleEngine.ts` | 7 | maxParticles: 50, intensity: 0.5 |

---

## Support

For issues or questions, check:
1. Browser console for errors
2. Performance monitor debug logs
3. Motion config in localStorage
4. Animation registry state

