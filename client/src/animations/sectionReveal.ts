import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const revealSection = (
  element: HTMLElement | null,
  options?: {
    trigger?: string | HTMLElement;
    start?: string;
    end?: string;
    once?: boolean;
  }
) => {
  if (!element) return;

  const {
    trigger = element,
    start = 'top 80%',
    end = 'bottom 20%',
    once = true,
  } = options || {};

  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start,
        end,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    }
  );
};

export const revealStaggerChildren = (
  parent: HTMLElement | null,
  childrenSelector: string,
  options?: {
    start?: string;
    stagger?: number;
  }
) => {
  if (!parent) return;

  const { start = 'top 80%', stagger = 0.1 } = options || {};

  const children = parent.querySelectorAll(childrenSelector);

  gsap.fromTo(
    Array.from(children),
    {
      opacity: 0,
      y: 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger,
      scrollTrigger: {
        trigger: parent,
        start,
      },
    }
  );
};

