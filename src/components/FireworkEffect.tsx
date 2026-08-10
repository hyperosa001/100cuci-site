"use client";

import { useEffect } from "react";

const COOLDOWN_MS = 500;
const MAX_PARTICLES = 300;

const COLOR_SCHEMES: readonly string[][] = [
  ["#FFD700", "#FFA500", "#FF8C00"],
  ["#FF4444", "#FF6666", "#FF8888"],
  ["#4169E1", "#6495ED", "#87CEEB"],
  ["#32CD32", "#90EE90", "#98FB98"],
  ["#9370DB", "#BA55D3", "#DDA0DD"],
  ["#FF69B4", "#FFB6C1", "#FFC0CB"],
  ["#F0E68C", "#FFFFE0", "#FFFACD"],
];

class FireworkParticle {
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  friction: number;
  brightness: number;

  constructor(x: number, y: number, color: string, angle: number, speed: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.01;
    this.size = Math.random() * 1.5 + 1.5;
    this.gravity = 0.15;
    this.friction = 0.98;
    this.brightness = 1;
  }

  update() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;
    this.brightness -= 0.01;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;

    if (this.alpha > 0.5) {
      ctx.shadowBlur = 30;
      ctx.shadowColor = this.color;
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function createFirework(particles: FireworkParticle[], x: number, y: number) {
  const scheme = COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];
  const particleCount = 40;
  const angleStep = (Math.PI * 2) / particleCount;

  for (let i = 0; i < particleCount; i++) {
    const angle = angleStep * i + (Math.random() - 0.5) * 0.3;
    const speed = Math.random() * 1.5 + 2;
    const color = scheme[Math.floor(Math.random() * scheme.length)];
    particles.push(new FireworkParticle(x, y, color, angle, speed));
  }
}

/** Click fireworks — same particle burst as 100cuci.com (#firework-canvas). */
export function FireworkEffect() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "firework-canvas";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      canvas.remove();
      return;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const particles: FireworkParticle[] = [];
    let lastClick = 0;
    let rafId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    const onClick = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastClick < COOLDOWN_MS) return;
      if (particles.length > MAX_PARTICLES) return;

      lastClick = now;
      createFirework(particles, event.clientX, event.clientY);
    };

    document.body.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, []);

  return null;
}
