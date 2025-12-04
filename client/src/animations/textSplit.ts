import { gsap } from 'gsap';

export const splitTextIntoWords = (element: HTMLElement): HTMLElement[] => {
  const text = element.textContent || '';
  const words = text.split(' ');
  element.innerHTML = '';

  const wordElements: HTMLElement[] = [];
  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word + (index < words.length - 1 ? ' ' : '');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';
    element.appendChild(wordSpan);
    wordElements.push(wordSpan);
  });

  return wordElements;
};

export const splitTextIntoLines = (element: HTMLElement): HTMLElement[] => {
  const text = element.textContent || '';
  const lines = text.split('\n').filter((line) => line.trim());
  element.innerHTML = '';

  const lineElements: HTMLElement[] = [];
  lines.forEach((line) => {
    const lineDiv = document.createElement('div');
    lineDiv.textContent = line.trim();
    lineDiv.style.overflow = 'hidden';
    element.appendChild(lineDiv);
    lineElements.push(lineDiv);
  });

  return lineElements;
};

export const animateTextReveal = (
  elements: HTMLElement[],
  options?: {
    delay?: number;
    stagger?: number;
    from?: 'bottom' | 'top' | 'left' | 'right';
  }
) => {
  const { delay = 0, stagger = 0.1, from = 'bottom' } = options || {};

  const fromProps: Record<string, gsap.TweenVars> = {
    bottom: { y: '100%', opacity: 0 },
    top: { y: '-100%', opacity: 0 },
    left: { x: '-100%', opacity: 0 },
    right: { x: '100%', opacity: 0 },
  };

  gsap.fromTo(
    elements,
    fromProps[from],
    {
      ...fromProps[from],
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay,
      stagger,
    }
  );
};

