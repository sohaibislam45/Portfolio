import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface SVGDrawOptions {
  duration?: number;
  ease?: string;
  delay?: number;
  reverse?: boolean;
}

export interface SVGMorphOptions {
  duration?: number;
  ease?: string;
  delay?: number;
  morphEnabled?: boolean;
}

/**
 * Animate SVG stroke drawing
 * @param svgElement - SVG element or selector
 * @param options - Animation options
 */
export const drawSVGPath = (
  svgElement: SVGElement | string,
  options: SVGDrawOptions = {}
): gsap.core.Timeline => {
  const {
    duration = 1.5,
    ease = 'power2.inOut',
    delay = 0,
    reverse = false,
  } = options;

  const svg = typeof svgElement === 'string' 
    ? document.querySelector(svgElement) as SVGElement
    : svgElement;

  if (!svg) {
    console.warn('SVG element not found for drawSVGPath');
    return gsap.timeline();
  }

  const paths = svg.querySelectorAll('path, line, polyline, polygon');
  const tl = gsap.timeline({ delay });

  paths.forEach((path) => {
    const length = (path as SVGPathElement).getTotalLength();
    (path as SVGPathElement).style.strokeDasharray = `${length}`;
    (path as SVGPathElement).style.strokeDashoffset = `${length}`;

    tl.to(path, {
      strokeDashoffset: reverse ? length : 0,
      duration,
      ease,
    }, 0);
  });

  return tl;
};

/**
 * Morph between two SVG shapes
 * @param fromPath - Source path element
 * @param toPath - Target path element
 * @param options - Animation options
 */
export const morphSVGPath = (
  fromPath: SVGPathElement | string,
  toPath: SVGPathElement | string,
  options: SVGMorphOptions = {}
): gsap.core.Timeline => {
  const {
    duration = 1.0,
    ease = 'power2.inOut',
    delay = 0,
    morphEnabled = true,
  } = options;

  if (!morphEnabled) {
    return gsap.timeline({ delay });
  }

  const from = typeof fromPath === 'string'
    ? document.querySelector(fromPath) as SVGPathElement
    : fromPath;
  const to = typeof toPath === 'string'
    ? document.querySelector(toPath) as SVGPathElement
    : toPath;

  if (!from || !to) {
    console.warn('SVG path elements not found for morphSVGPath');
    return gsap.timeline({ delay });
  }

  const fromD = from.getAttribute('d') || '';
  const toD = to.getAttribute('d') || '';

  return gsap.timeline({ delay })
    .to(from, {
      attr: { d: toD },
      duration,
      ease,
    });
};

/**
 * Create scroll-triggered SVG reveal
 */
export const revealSVGOnScroll = (
  svgElement: SVGElement | string,
  options: SVGDrawOptions & { trigger?: string | Element } = {}
): ScrollTrigger => {
  const { trigger, ...drawOptions } = options;
  const svg = typeof svgElement === 'string'
    ? document.querySelector(svgElement) as SVGElement
    : svgElement;

  if (!svg) {
    console.warn('SVG element not found for revealSVGOnScroll');
    return {} as ScrollTrigger;
  }

  const tl = drawSVGPath(svg, drawOptions);

  return ScrollTrigger.create({
    trigger: trigger || svg,
    start: 'top 80%',
    animation: tl,
    toggleActions: 'play none none reverse',
  });
};

