import { gsap } from 'gsap';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  element?: HTMLElement;
}

export interface ParticleConfig {
  intensity?: number; // 0-1
  maxParticles?: number;
  autoDisableMobile?: boolean;
  colors?: string[];
  size?: { min: number; max: number };
  speed?: { min: number; max: number };
  lifetime?: { min: number; max: number };
}

export class ParticleEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrame: number | null = null;
  private config: Required<ParticleConfig>;
  private isActive = false;

  constructor(config: ParticleConfig = {}) {
    this.config = {
      intensity: config.intensity ?? 0.5,
      maxParticles: config.maxParticles ?? 50,
      autoDisableMobile: config.autoDisableMobile ?? true,
      colors: config.colors ?? ['#3b82f6', '#8b5cf6', '#ec4899'],
      size: config.size ?? { min: 2, max: 6 },
      speed: config.speed ?? { min: 0.5, max: 2 },
      lifetime: config.lifetime ?? { min: 1000, max: 3000 },
    };

    if (this.config.autoDisableMobile && window.innerWidth < 768) {
      return; // Don't initialize on mobile
    }
  }

  init(container: HTMLElement | string) {
    const target = typeof container === 'string'
      ? document.querySelector(container) as HTMLElement
      : container;

    if (!target) {
      console.warn('ParticleEngine: Container not found');
      return;
    }

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.warn('ParticleEngine: Canvas context not available');
      return;
    }

    // Set canvas size
    const resize = () => {
      if (!this.canvas) return;
      const rect = target.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);

    target.style.position = 'relative';
    target.appendChild(this.canvas);

    this.isActive = true;
    this.animate();
  }

  emit(x: number, y: number, count?: number) {
    if (!this.isActive || !this.ctx) return;

    const particleCount = count || Math.floor(this.config.maxParticles * this.config.intensity);
    
    for (let i = 0; i < particleCount; i++) {
      if (this.particles.length >= this.config.maxParticles) break;

      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = this.random(this.config.speed.min, this.config.speed.max);
      const lifetime = this.random(this.config.lifetime.min, this.config.lifetime.max);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: lifetime,
        maxLife: lifetime,
        size: this.random(this.config.size.min, this.config.size.max),
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
      });
    }
  }

  private animate() {
    if (!this.isActive || !this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // Gravity
      particle.life -= 16; // ~60fps

      if (particle.life <= 0) {
        return false;
      }

      const alpha = particle.life / particle.maxLife;
      this.ctx!.globalAlpha = alpha;
      this.ctx!.fillStyle = particle.color;
      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx!.fill();

      return true;
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  ripple(x: number, y: number, color?: string) {
    if (!this.canvas || !this.ctx) return;

    const ripple = {
      x,
      y,
      radius: 0,
      maxRadius: 100,
      color: color || '#3b82f6',
      alpha: 1,
    };

    gsap.to(ripple, {
      radius: ripple.maxRadius,
      alpha: 0,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        if (!this.ctx || !this.canvas) return;
        this.ctx.save();
        this.ctx.globalAlpha = ripple.alpha;
        this.ctx.strokeStyle = ripple.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      },
    });
  }

  confetti(duration: number = 2000) {
    if (!this.canvas) return;

    const confettiCount = 50;
    const endTime = Date.now() + duration;

    const emitConfetti = () => {
      if (Date.now() > endTime) return;

      const x = Math.random() * this.canvas!.width;
      const y = -10;

      for (let i = 0; i < 5; i++) {
        this.emit(x, y, 1);
      }

      setTimeout(emitConfetti, 100);
    };

    emitConfetti();
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  destroy() {
    this.isActive = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
  }
}

