/**
 * Performance Utilities
 * Helpers for lazy-loading, intersection observers, and performance monitoring
 */

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  tbt?: number; // Total Blocking Time
  memory?: number; // Memory usage in MB
  initTime?: number; // Animation init time in ms
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: Map<string, IntersectionObserver> = new Map();

  /**
   * Lazy-initialize animation when element enters viewport
   */
  lazyInit(
    element: HTMLElement | string,
    initCallback: () => void,
    options: IntersectionObserverInit = {}
  ): () => void {
    const target = typeof element === 'string'
      ? document.querySelector(element) as HTMLElement
      : element;

    if (!target) {
      console.warn('PerformanceMonitor: Element not found for lazy init');
      return () => {};
    }

    const startTime = performance.now();
    const key = `lazy-${Math.random().toString(36).substr(2, 9)}`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initCallback();
            const initTime = performance.now() - startTime;
            this.metrics.set(key, { initTime });
            observer.disconnect();
            this.observers.delete(key);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(target);
    this.observers.set(key, observer);

    // Return cleanup function
    return () => {
      observer.disconnect();
      this.observers.delete(key);
    };
  }

  /**
   * Measure LCP (Largest Contentful Paint)
   */
  measureLCP(): Promise<number> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        resolve(0);
        return;
      }

      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime || 0);
          observer.disconnect();
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Timeout after 10s
        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 10000);
      } catch {
        resolve(0);
      }
    });
  }

  /**
   * Measure TBT (Total Blocking Time)
   */
  measureTBT(): Promise<number> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        resolve(0);
        return;
      }

      try {
        let totalBlockingTime = 0;

        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (entry.duration > 50) {
              totalBlockingTime += entry.duration - 50;
            }
          });
        });

        observer.observe({ entryTypes: ['longtask'] });

        // Measure for 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(totalBlockingTime);
        }, 5000);
      } catch {
        resolve(0);
      }
    });
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): number | null {
    if (typeof window === 'undefined') return null;
    const memory = (performance as any).memory;
    if (!memory) return null;
    return memory.usedJSHeapSize / 1048576; // Convert to MB
  }

  /**
   * Log performance metrics for debugging
   */
  logMetrics(componentName: string) {
    const metrics = this.metrics.get(componentName);
    const memory = this.getMemoryUsage();

    if (metrics || memory) {
      console.log(`[Performance] ${componentName}:`, {
        ...metrics,
        memory: memory ? `${memory.toFixed(2)} MB` : 'N/A',
      });
    }
  }

  /**
   * Check if device is low-power
   */
  isLowPowerDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = this.getMemoryUsage();
    return cores < 4 || (memory !== null && memory < 100);
  }
}

// Singleton instance
let monitorInstance: PerformanceMonitor | null = null;

export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
};

/**
 * Check if heavy effects should be enabled
 */
export const shouldEnableHeavyEffects = (
  breakpoint: number = 768,
  allowHeavyEffects: boolean = true,
  prefersReducedMotion: boolean = false
): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth >= breakpoint &&
    allowHeavyEffects &&
    !prefersReducedMotion &&
    !getPerformanceMonitor().isLowPowerDevice()
  );
};

