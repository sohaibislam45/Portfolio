import { gsap } from 'gsap';

export type CursorState = 'default' | 'link' | 'grab' | 'focus';

export interface CursorConfig {
  showLabelOnHover?: boolean;
  hideOnTouch?: boolean;
  lerp?: number; // 0-1, smoothing factor
}

interface CursorManager {
  setState: (state: CursorState, label?: string) => void;
  register: (selector: string, state: CursorState, label?: string) => void;
  unregister: (selector: string) => void;
  destroy: () => void;
}

class CursorManagerImpl implements CursorManager {
  private cursor: HTMLElement | null = null;
  private label: HTMLElement | null = null;
  private currentState: CursorState = 'default';
  private currentLabel: string = '';
  private config: Required<CursorConfig>;
  private mouseX = 0;
  private mouseY = 0;
  private cursorX = 0;
  private cursorY = 0;
  private animationFrame: number | null = null;
  private registeredSelectors: Map<string, { state: CursorState; label?: string }> = new Map();

  constructor(config: CursorConfig = {}) {
    this.config = {
      showLabelOnHover: config.showLabelOnHover ?? true,
      hideOnTouch: config.hideOnTouch ?? true,
      lerp: config.lerp ?? 0.15,
    };

    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (this.config.hideOnTouch && 'ontouchstart' in window) return;

    // Create cursor element
    this.cursor = document.createElement('div');
    this.cursor.id = 'custom-cursor';
    this.cursor.className = 'fixed pointer-events-none z-[9999] w-6 h-6 rounded-full border-2 border-current transition-transform duration-300';
    this.cursor.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(this.cursor);

    // Create label element
    if (this.config.showLabelOnHover) {
      this.label = document.createElement('div');
      this.label.id = 'cursor-label';
      this.label.className = 'fixed pointer-events-none z-[10000] px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-sm rounded opacity-0 transition-opacity duration-300';
      this.label.style.transform = 'translate(-50%, -100%)';
      document.body.appendChild(this.label);
    }

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Animate cursor position
    this.animate();

    // Register default selectors
    this.register('a, button, [role="button"]', 'link');
    this.register('[draggable="true"], .draggable', 'grab');
  }

  private animate() {
    if (!this.cursor) return;

    // Smooth interpolation
    this.cursorX += (this.mouseX - this.cursorX) * this.config.lerp;
    this.cursorY += (this.mouseY - this.cursorY) * this.config.lerp;

    gsap.set(this.cursor, {
      x: this.cursorX,
      y: this.cursorY,
    });

    if (this.label) {
      gsap.set(this.label, {
        x: this.cursorX,
        y: this.cursorY - 20,
      });
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  setState(state: CursorState, label?: string) {
    this.currentState = state;
    this.currentLabel = label || '';

    if (!this.cursor) return;

    // Update cursor appearance based on state
    const stateClasses: Record<CursorState, string> = {
      default: 'scale-100',
      link: 'scale-150 bg-current opacity-20',
      grab: 'scale-125 rotate-45',
      focus: 'scale-150 border-2 border-blue-500',
    };

    this.cursor.className = `fixed pointer-events-none z-[9999] w-6 h-6 rounded-full border-2 border-current transition-transform duration-300 ${stateClasses[state]}`;
    this.cursor.style.transform = 'translate(-50%, -50%)';

    // Update label
    if (this.label) {
      if (label && this.config.showLabelOnHover) {
        this.label.textContent = label;
        gsap.to(this.label, { opacity: 1, duration: 0.2 });
      } else {
        gsap.to(this.label, { opacity: 0, duration: 0.2 });
      }
    }
  }

  register(selector: string, state: CursorState, label?: string) {
    this.registeredSelectors.set(selector, { state, label });

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.setState(state, label);
      });
      el.addEventListener('mouseleave', () => {
        this.setState('default');
      });
    });
  }

  unregister(selector: string) {
    this.registeredSelectors.delete(selector);
    // Note: Event listeners would need to be manually removed in a full implementation
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.cursor?.remove();
    this.label?.remove();
    this.cursor = null;
    this.label = null;
  }
}

// Singleton instance
let cursorInstance: CursorManager | null = null;

export const createCursorManager = (config?: CursorConfig): CursorManager => {
  if (cursorInstance) {
    return cursorInstance;
  }
  cursorInstance = new CursorManagerImpl(config);
  return cursorInstance;
};

export const getCursorManager = (): CursorManager | null => {
  return cursorInstance;
};

