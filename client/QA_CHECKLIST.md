# Animation System QA Checklist

## General Testing

### Desktop (1920x1080, Chrome/Firefox/Safari)
- [ ] All animations load without errors
- [ ] ScrollTrigger refreshes on window resize
- [ ] No console errors or warnings
- [ ] Animations complete smoothly
- [ ] Performance is acceptable (60fps)

### Mobile (375x667, iOS Safari/Chrome)
- [ ] Heavy effects are disabled
- [ ] Simplified animations work
- [ ] Touch interactions work
- [ ] No performance issues
- [ ] Layout doesn't break

### Reduced Motion
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Instant/simple fallbacks work
- [ ] No jarring movements
- [ ] Content remains accessible

---

## Component-Specific QA

### 1. HeroTimeline

**Expected Behavior**: Hero section pins, timeline scrubs with scroll (text distortion → split-text → 3D → CTA).

**Props to Test**:
- `pinDuration`: '100vh', '80vh', 500
- `scrubSpeed`: 0.1, 0.5, 1.0
- `disablePinMobile`: true, false

**Steps**:
1. Load page with HeroTimeline
2. Scroll down slowly
3. Verify pinning occurs
4. Verify timeline scrubs smoothly
5. Check all data attributes are present

**Reduced Motion**:
- [ ] Pin is disabled
- [ ] Timeline doesn't scrub
- [ ] Simple fade/slide reveal instead

**Mobile**:
- [ ] Pin disabled if `disablePinMobile={true}`
- [ ] No performance issues

**Lighthouse Impact**:
- LCP: May increase if 3D canvas is heavy → Lazy load canvas
- TBT: Minimal if animations are optimized → Use `will-change` sparingly

---

### 2. ParallaxLayer & MultiParallax

**Expected Behavior**: Layers move at different speeds on scroll; pointer follow on desktop.

**Props to Test**:
- `depthFactor`: 0.1, 0.5, 1.0
- `maxOffset`: 50, 100, 200
- `followPointer`: true, false
- `depthFactors`: [0.3, 0.6, 1.0], [0.1, 0.5, 0.9]

**Steps**:
1. Create multi-layer parallax section
2. Scroll page
3. Verify layers move at different speeds
4. Move mouse (desktop) - verify pointer follow
5. Check mobile fallback (vertical only)

**Reduced Motion**:
- [ ] Parallax disabled
- [ ] Static positioning

**Mobile**:
- [ ] Pointer follow disabled
- [ ] Vertical parallax only (mild)
- [ ] No janky movement

**Lighthouse Impact**:
- TBT: Low if using transforms → Use `transform3d`
- Memory: Minimal → Batch updates

---

### 3. SplitText

**Expected Behavior**: Text splits into words/lines/chars and animates in with optional jitter.

**Props to Test**:
- `mode`: 'word', 'line', 'char'
- `stagger`: 0.01, 0.05, 0.1
- `distortionStrength`: 0, 0.3, 0.7

**Steps**:
1. Wrap text in SplitText
2. Scroll to element
3. Verify split and reveal
4. Test all modes
5. Test with/without distortion

**Reduced Motion**:
- [ ] Simple fade/slide
- [ ] No splitting
- [ ] No jitter

**Mobile**:
- [ ] Works correctly
- [ ] No performance issues

**Lighthouse Impact**:
- LCP: Minimal → Text is already in DOM
- TBT: Low → Lightweight animations

---

### 4. ScrubTimeline

**Expected Behavior**: Pinned timeline with stages (Problem → Research → UI → Code → Result).

**Props to Test**:
- `stages`: Array of 3-7 stages
- `progressIndicator`: true, false
- `onStageChange`: Callback function

**Steps**:
1. Create timeline with stages
2. Scroll through timeline
3. Verify pinning
4. Verify stage transitions
5. Check progress indicator
6. Verify lazy-loaded images load

**Reduced Motion**:
- [ ] No pinning
- [ ] Simple fade/slide per stage
- [ ] Progress indicator disabled

**Mobile**:
- [ ] No pinning
- [ ] Fade/slide reveals
- [ ] Images load correctly

**Lighthouse Impact**:
- LCP: May increase if images are heavy → Lazy load
- TBT: Low if optimized → Defer heavy assets

---

### 5. RevealMask

**Expected Behavior**: Content reveals with organic mask animation (liquid/radial/polygon/wipe).

**Props to Test**:
- `maskType`: 'liquid', 'radial', 'polygon', 'wipe'
- `duration`: 0.5, 1.0, 2.0
- `easing`: 'power2.inOut', 'elastic.out'

**Steps**:
1. Wrap content in RevealMask
2. Scroll to element
3. Verify mask animation
4. Test all mask types
5. Check fallback (opacity/scale)

**Reduced Motion**:
- [ ] Simple opacity/scale
- [ ] No mask animation

**Mobile**:
- [ ] Works correctly
- [ ] No performance issues

**Lighthouse Impact**:
- TBT: Low → SVG clipPath is efficient
- Memory: Minimal

---

### 6. LottiePlayer

**Expected Behavior**: Lottie animation plays on enter or scrubs with scroll.

**Props to Test**:
- `src`: Valid Lottie JSON URL
- `playOnEnter`: true, false
- `scrubWithScroll`: true, false
- `poster`: Fallback image

**Steps**:
1. Add LottiePlayer with valid JSON
2. Scroll to element
3. Verify animation plays/scrubs
4. Test poster fallback (invalid URL)
5. Check reduced motion (poster only)

**Reduced Motion**:
- [ ] Shows poster only
- [ ] No animation

**Mobile**:
- [ ] Works if `allowHeavyEffects` is true
- [ ] Falls back to poster if disabled

**Lighthouse Impact**:
- LCP: May increase → Use poster image
- TBT: Low if lazy-loaded → Use intersection observer

**Note**: Requires `lottie-web` package: `npm install lottie-web`

---

### 7. usePhysicsHover

**Expected Behavior**: Springy hover effect with scale and rotation.

**Config to Test**:
- `scale`: 1.05, 1.1, 1.2
- `rotation`: 0, 2, 5
- `instant`: true, false

**Steps**:
1. Apply hook to element
2. Hover over element
3. Verify springy animation
4. Test instant mode
5. Check reduced motion (instant)

**Reduced Motion**:
- [ ] Instant response
- [ ] No spring physics

**Mobile**:
- [ ] Works on touch (tap)
- [ ] No performance issues

**Lighthouse Impact**:
- TBT: Minimal → Lightweight

---

### 8. useDraggable

**Expected Behavior**: Element can be dragged with spring return.

**Steps**:
1. Apply hook to element
2. Click and drag
3. Verify drag movement
4. Release and verify spring return
5. Check reduced motion (disabled)

**Reduced Motion**:
- [ ] Dragging disabled or instant

**Mobile**:
- [ ] Works on touch
- [ ] No conflicts with scroll

**Lighthouse Impact**:
- TBT: Minimal

---

### 9. CursorManager

**Expected Behavior**: Custom cursor with states (default, link, grab, focus).

**Config to Test**:
- `showLabelOnHover`: true, false
- `hideOnTouch`: true, false
- `lerp`: 0.1, 0.15, 0.2

**Steps**:
1. Initialize cursor manager
2. Move mouse
3. Hover over links/buttons
4. Verify state changes
5. Check label display
6. Test on touch device (should hide)

**Reduced Motion**:
- [ ] Cursor disabled or simplified

**Mobile**:
- [ ] Hidden on touch devices

**Lighthouse Impact**:
- TBT: Low → requestAnimationFrame

---

### 10. ParticleEngine

**Expected Behavior**: Particles emit on click, ripple effects, confetti.

**Config to Test**:
- `intensity`: 0.1, 0.5, 1.0
- `maxParticles`: 25, 50, 100
- `autoDisableMobile`: true, false

**Steps**:
1. Initialize engine
2. Click to emit particles
3. Test ripple effect
4. Test confetti
5. Check mobile (should be disabled)

**Reduced Motion**:
- [ ] Particles disabled

**Mobile**:
- [ ] Disabled if `autoDisableMobile={true}`
- [ ] No performance issues if enabled

**Lighthouse Impact**:
- TBT: May increase with many particles → Limit maxParticles
- Memory: Low → Cull off-screen particles

---

### 11. SVG Animation Utilities

**Expected Behavior**: SVG paths draw on reveal, morph between shapes.

**Steps**:
1. Create SVG with paths
2. Use `drawSVGPath` or `revealSVGOnScroll`
3. Verify stroke drawing
4. Test morphing between paths
5. Check reduced motion (instant)

**Reduced Motion**:
- [ ] Instant reveal
- [ ] No drawing animation

**Mobile**:
- [ ] Works correctly
- [ ] No performance issues

**Lighthouse Impact**:
- TBT: Minimal → SVG is efficient

---

## Performance Testing

### Lighthouse Checklist

**LCP (Largest Contentful Paint)**:
- [ ] < 2.5s (Good)
- [ ] Lazy load heavy images/3D assets
- [ ] Use poster images for Lottie
- [ ] Optimize hero images

**TBT (Total Blocking Time)**:
- [ ] < 200ms (Good)
- [ ] Use `will-change` sparingly
- [ ] Batch DOM updates
- [ ] Defer heavy animations

**Memory**:
- [ ] Monitor with performance monitor
- [ ] Clean up animations on unmount
- [ ] Limit particle count
- [ ] Dispose Three.js scenes

### Debug Mode

Enable debug logging:

```typescript
import { getMotionConfig, saveMotionConfig } from '../config/motion-config';

const config = getMotionConfig();
config.performance.enableDebug = true;
saveMotionConfig(config);
```

Check console for:
- [ ] Animation init times
- [ ] Memory usage
- [ ] Performance warnings

---

## Accessibility Testing

### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Focus outlines are visible
- [ ] Animations don't hide focus
- [ ] Tab order is logical

### Screen Readers
- [ ] ARIA labels are present
- [ ] Motion notices are announced
- [ ] Content is accessible without animations

### Motion Preferences
- [ ] `prefers-reduced-motion` is respected
- [ ] Motion controls work
- [ ] Settings persist to localStorage
- [ ] Fallbacks are provided

---

## Integration Testing

### ScrollTrigger Integration
- [ ] ScrollTrigger refreshes on layout changes
- [ ] Works with smooth scroll (Lenis)
- [ ] No conflicts with other ScrollTriggers

### Theme Integration
- [ ] Animations work in light/dark mode
- [ ] Colors adapt to theme
- [ ] No visual glitches on theme switch

### Router Integration
- [ ] Animations clean up on route change
- [ ] No memory leaks
- [ ] ScrollTrigger refreshes on navigation

---

## Browser Compatibility

### Desktop
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

### Mobile
- [ ] iOS Safari (latest)
- [ ] Chrome Mobile (latest)

### Fallbacks
- [ ] Older browsers get simple animations
- [ ] No JavaScript errors
- [ ] Content is still accessible

---

## Known Issues & Mitigations

1. **ScrollTrigger not refreshing**: Call `ScrollTrigger.refresh()` after layout changes
2. **Lottie not loading**: Check JSON URL, install `lottie-web`, verify CORS
3. **Performance on low-end devices**: Disable heavy effects, reduce particle count
4. **Mobile parallax jank**: Use simplified vertical parallax only

---

## Sign-off

**Tested By**: _________________  
**Date**: _________________  
**Browser/Device**: _________________  
**Notes**: _________________

