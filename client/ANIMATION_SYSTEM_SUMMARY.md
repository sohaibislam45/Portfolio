# Animation System - Component Summary

## Numbered List of Components/Hooks/Utilities

1. **HeroTimeline** - Pins hero section and scrubs GSAP timeline in sync with scroll (text distortion → split-text → 3D transform → CTA reveal)

2. **ParallaxLayer** - Single parallax layer that moves at different speeds on scroll and pointer move

3. **MultiParallax** - Container for multiple coordinated parallax layers (foreground, mid, background)

4. **SplitText** - Splits text into words/lines/chars with optional distortion/jitter overlay animation

5. **ScrubTimeline** - Pinned scroll timeline for project case studies with animated stage transitions

6. **RevealMask** - SVG/Canvas mask reveals with organic wipe animations (liquid/radial/polygon/wipe)

7. **LottiePlayer** - Lottie animation wrapper with ScrollTrigger play/pause/scrub support

8. **usePhysicsHover** - Hook for springy hover interactions with scale and rotation

9. **useDraggable** - Hook for draggable micro-interactions with spring return

10. **CursorManager** - Custom cursor system with contextual states (default, link, grab, focus)

11. **ParticleEngine** - Particle and ripple effects engine for micro-interactions

12. **SVG Animation Utilities** - Functions for SVG path drawing and morphing (drawSVGPath, morphSVGPath, revealSVGOnScroll)

13. **useMotionSafe** - Hook that returns motion preferences, device capabilities, and screen size checks

14. **MotionControls** - UI component for toggling motion preferences (Full/Reduced/Off)

15. **AnimationRegistry** - Runtime registry for toggling heavy animation modules with localStorage persistence

16. **PerformanceMonitor** - Utilities for lazy-loading, intersection observers, and performance metrics

---

## Props/Config Tables

### HeroTimeline

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| pinDuration | number \| string | '100vh' | Scroll distance for pinning (px or viewport units) |
| scrubSpeed | number | 0.5 | Scrub speed 0-1 (lower = smoother) |
| disablePinMobile | boolean | true | Disable pinning on mobile devices |
| className | string | '' | Additional CSS classes |
| onComplete | function | undefined | Callback when timeline completes |

### ParallaxLayer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| depthFactor | number | 0.5 | Movement factor 0-1 (0 = no movement, 1 = full) |
| maxOffset | number | 100 | Maximum offset in pixels |
| followPointer | boolean | false | Enable pointer follow on desktop |
| className | string | '' | Additional CSS classes |
| style | CSSProperties | undefined | Inline styles |

### MultiParallax

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| depthFactors | number[] | [0.3, 0.6, 1.0] | Array of depth factors for each layer |
| maxOffset | number | 100 | Maximum offset in pixels |
| followPointer | boolean | false | Enable pointer follow |
| className | string | '' | Additional CSS classes |

### SplitText

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| mode | 'word' \| 'line' \| 'char' | 'word' | Split mode |
| stagger | number | 0.05 | Stagger delay between elements |
| distortionStrength | number | 0 | Jitter/distortion strength 0-1 |
| className | string | '' | Additional CSS classes |
| onComplete | function | undefined | Callback on completion |

### ScrubTimeline

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| stages | TimelineStage[] | [] | Array of stage objects (id, title, content) |
| progressIndicator | boolean | true | Show progress bar |
| className | string | '' | Additional CSS classes |
| onStageChange | function | undefined | Callback on stage change (stageId, index) |

### RevealMask

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| maskType | 'liquid' \| 'radial' \| 'polygon' \| 'wipe' | 'liquid' | Mask animation type |
| duration | number | 1.0 | Animation duration in seconds |
| easing | string | 'power2.inOut' | GSAP easing function |
| className | string | '' | Additional CSS classes |

### LottiePlayer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | required | URL to Lottie JSON file |
| playOnEnter | boolean | true | Play animation on scroll enter |
| scrubWithScroll | boolean | false | Scrub animation with scroll |
| className | string | '' | Additional CSS classes |
| poster | string | undefined | Fallback static image URL |
| loop | boolean | true | Loop animation |
| autoplay | boolean | false | Autoplay on load |

### usePhysicsHover Config

| Config | Type | Default | Description |
|--------|------|---------|-------------|
| mass | number | 1 | Physics mass |
| stiffness | number | 300 | Spring stiffness |
| damping | number | 20 | Damping factor |
| scale | number | 1.05 | Hover scale multiplier |
| rotation | number | 2 | Hover rotation in degrees |
| instant | boolean | false | Instant response (no physics) |

### ParticleEngine Config

| Config | Type | Default | Description |
|--------|------|---------|-------------|
| intensity | number | 0.5 | Particle intensity 0-1 |
| maxParticles | number | 50 | Maximum particle count |
| autoDisableMobile | boolean | true | Auto-disable on mobile |
| colors | string[] | ['#3b82f6', '#8b5cf6', '#ec4899'] | Particle colors |
| size | {min, max} | {2, 6} | Particle size range |
| speed | {min, max} | {0.5, 2} | Particle speed range |
| lifetime | {min, max} | {1000, 3000} | Particle lifetime in ms |

### CursorManager Config

| Config | Type | Default | Description |
|--------|------|---------|-------------|
| showLabelOnHover | boolean | true | Show label on hover |
| hideOnTouch | boolean | true | Hide on touch devices |
| lerp | number | 0.15 | Smoothing factor 0-1 |

### SVG Animation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| duration | number | 1.5 | Animation duration |
| ease | string | 'power2.inOut' | GSAP easing |
| delay | number | 0 | Delay before animation |
| reverse | boolean | false | Reverse animation (drawSVGPath) |
| morphEnabled | boolean | true | Enable morphing (morphSVGPath) |

---

## Motion Config Object (JSON)

```json
{
  "timing": {
    "defaultDuration": 0.8,
    "defaultEase": "power3.out",
    "staggerBase": 0.1
  },
  "breakpoints": {
    "mobile": 768,
    "tablet": 1024,
    "desktop": 1280
  },
  "features": {
    "threeJS": true,
    "lottie": true,
    "particles": true,
    "cursor": true,
    "parallax": true
  },
  "performance": {
    "lowPowerThreshold": 4,
    "maxParticles": 100,
    "enableDebug": false
  },
  "accessibility": {
    "respectReducedMotion": true,
    "reducedMotionDuration": 0.3,
    "reducedMotionEase": "none"
  }
}
```

---

## QA Checklist & Demo Page Instructions

### Demo Page Access

1. Navigate to `/animation-demo` route in the application
2. All animation components are showcased with interactive examples
3. Use the Motion Controls dropdown in the header to toggle motion preferences

### Testing Steps

#### Desktop Testing (1920x1080)
1. Open `/animation-demo` in Chrome/Firefox/Safari
2. Scroll through each section slowly
3. Interact with hover effects, buttons, and draggable elements
4. Verify all animations complete smoothly
5. Check browser console for errors
6. Test Motion Controls (Full/Reduced/Off)

#### Mobile Testing (375x667)
1. Open `/animation-demo` on mobile device or emulator
2. Verify heavy effects are disabled (particles, cursor)
3. Check simplified animations work
4. Test touch interactions
5. Verify no performance issues

#### Reduced Motion Testing
1. Enable `prefers-reduced-motion` in OS settings
2. Reload page
3. Verify animations are simplified or disabled
4. Check Motion Controls reflect reduced motion
5. Verify content remains accessible

### Component-Specific QA

**HeroTimeline**:
- Scroll to hero section
- Verify pinning occurs
- Check timeline scrubs with scroll
- Verify all data attributes work (data-hero-text, data-hero-split, etc.)

**ParallaxLayer**:
- Scroll parallax section
- Verify layers move at different speeds
- Move mouse (desktop) - check pointer follow
- Test mobile (vertical parallax only)

**SplitText**:
- Scroll to split text sections
- Verify text splits correctly
- Test word/line/char modes
- Check distortion effect (if enabled)

**ScrubTimeline**:
- Scroll through timeline
- Verify pinning and stage transitions
- Check progress indicator updates
- Verify lazy-loaded images load

**RevealMask**:
- Scroll to mask sections
- Verify mask animations (liquid/radial/polygon/wipe)
- Check fallback on reduced motion

**ParticleEngine**:
- Click in particle container
- Verify particles emit
- Test ripple and confetti buttons
- Check mobile (should be disabled)

**LottiePlayer**:
- Scroll to Lottie section
- Verify animation plays (if valid JSON provided)
- Check poster fallback (if JSON invalid)

**usePhysicsHover**:
- Hover over button with physics hover
- Verify springy animation
- Test instant mode (reduced motion)

**useDraggable**:
- Click and drag draggable element
- Verify drag movement
- Check spring return on release

**CursorManager**:
- Move mouse around page
- Hover over links/buttons
- Verify cursor state changes
- Check label display (if enabled)

### Lighthouse Checklist

**LCP (Largest Contentful Paint)**:
- Target: < 2.5s
- Mitigation: Lazy load heavy images/3D assets, use poster images for Lottie

**TBT (Total Blocking Time)**:
- Target: < 200ms
- Mitigation: Use `will-change` sparingly, batch DOM updates, defer heavy animations

**Memory**:
- Monitor with performance monitor debug mode
- Clean up animations on unmount
- Limit particle count
- Dispose Three.js scenes properly

### Accessibility Verification

- [ ] All interactive elements are keyboard-focusable
- [ ] Focus outlines are visible and not hidden by animations
- [ ] `prefers-reduced-motion` is respected
- [ ] Motion controls work and persist to localStorage
- [ ] ARIA labels are present where needed
- [ ] Content is accessible without animations

---

## Accessibility Fallback Behavior

All animation components automatically respect user motion preferences and provide appropriate fallbacks:

### prefers-reduced-motion

When `prefers-reduced-motion: reduce` is detected:

1. **HeroTimeline**: Pin and scrub are disabled; simple fade/slide reveal instead
2. **ParallaxLayer**: Parallax movement is disabled; static positioning
3. **SplitText**: Text splitting is disabled; simple fade/slide reveal
4. **ScrubTimeline**: Pinning is disabled; simple fade/slide per stage
5. **RevealMask**: Mask animation is disabled; simple opacity/scale reveal
6. **LottiePlayer**: Animation is disabled; shows static poster image
7. **usePhysicsHover**: Physics are disabled; instant response mode
8. **useDraggable**: Dragging is disabled or instant
9. **ParticleEngine**: Particles are disabled
10. **CursorManager**: Cursor is disabled or simplified

### Motion Controls

Users can manually override motion preferences via the `MotionControls` component:

- **Full Motion**: All animations enabled (if device supports)
- **Reduced Motion**: Simplified animations, particles disabled, shorter durations
- **Motion Off**: All animations disabled

Settings persist to `localStorage` and override system preferences.

### Low-Power Devices

Components automatically detect low-power devices (based on CPU cores and memory) and:
- Disable heavy effects (Three.js, particles)
- Use simplified animations
- Reduce particle counts
- Skip pointer-follow parallax

### Mobile Devices

On mobile (< 768px width):
- Cursor is hidden (touch devices)
- Particles are auto-disabled
- Parallax is simplified to vertical-only
- Pinned timelines are replaced with fade/slide reveals
- Pointer-follow is disabled

All fallbacks ensure content remains fully accessible and functional, just with reduced or no motion.

---

## File Structure

```
client/src/
├── components/animations/
│   ├── HeroTimeline.tsx
│   ├── ParallaxLayer.tsx
│   ├── SplitText.tsx
│   ├── ScrubTimeline.tsx
│   ├── RevealMask.tsx
│   ├── LottiePlayer.tsx
│   ├── MotionControls.tsx
│   └── index.ts
├── hooks/
│   ├── useMotionSafe.ts
│   └── usePhysicsHover.ts
├── utils/
│   ├── svgAnimation.ts
│   ├── cursorManager.ts
│   ├── particleEngine.ts
│   ├── animationRegistry.ts
│   └── performanceUtils.ts
├── config/
│   └── motion-config.ts
└── routes/
    └── AnimationDemo.tsx
```

---

## Integration Points

### Existing Project Integration

1. **Hero Section**: Replace existing hero with `HeroTimeline` wrapper
2. **Portfolio Showcase**: Use `MultiParallax` for layered effects
3. **Project Pages**: Use `ScrubTimeline` for case study timelines
4. **Buttons/CTAs**: Apply `usePhysicsHover` hook
5. **Gallery**: Use `useDraggable` for thumbnail interactions
6. **Header**: Add `MotionControls` component
7. **Global Cursor**: Initialize `CursorManager` in App.tsx

### ScrollTrigger Integration

All components that use ScrollTrigger automatically:
- Refresh on window resize
- Clean up on unmount
- Work with smooth scroll (Lenis)
- Respect reduced motion preferences

### Theme Integration

Animations work with existing light/dark theme:
- Colors adapt via CSS variables
- No visual glitches on theme switch
- Cursor colors match theme

---

## Performance Summary

### Likely Impacts

1. **LCP**: May increase if 3D canvas or large images are in hero → Mitigation: Lazy load, use poster images
2. **TBT**: Minimal if optimized → Mitigation: Use transforms, batch updates, defer heavy animations
3. **Memory**: Low for most components → Mitigation: Limit particles, dispose Three.js scenes, clean up on unmount

### Quick Remediation Tips

1. **Slow LCP**: Lazy load hero 3D canvas, use intersection observer
2. **High TBT**: Reduce particle count, disable heavy effects on low-power devices
3. **Memory Leaks**: Ensure all animations clean up on unmount, dispose Three.js scenes
4. **Mobile Performance**: Use `autoDisableMobile` flags, simplify animations

---

## Next Steps

1. Install `lottie-web` if using LottiePlayer: `npm install lottie-web`
2. Add demo route to router (already added to App.tsx)
3. Test all components in `/animation-demo`
4. Integrate components into existing sections
5. Customize motion config for your needs
6. Add SVG assets for divider/logo animations
7. Test on target devices and browsers

---

## Support & Documentation

- Full documentation: `ANIMATION_SYSTEM.md`
- QA checklist: `QA_CHECKLIST.md`
- Demo page: `/animation-demo`
- Config file: `client/src/config/motion-config.ts`

