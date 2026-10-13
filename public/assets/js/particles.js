import { hasHardwareAcceleration } from "./hardware-acceleration.js";

export function initializeParticles() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !hasHardwareAcceleration()) return () => {};

  const existingCanvas = document.querySelector(".ambient-particles");
  if (existingCanvas) {
    existingCanvas.remove();
  }

  const canvas = document.createElement("canvas");
  canvas.className = "ambient-particles";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let width, height;
  let particles = [];
  let isRunning = true;
  let animationFrameId = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedY = -(Math.random() * 0.2 + 0.1);
      this.opacity = Math.random() * 0.3 + 0.05;
    }
    update() {
      this.y += this.speedY;
      if (this.y < 0) {
        this.y = height;
        this.x = Math.random() * width;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(120, 144, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(window.innerWidth / 20, 50);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  const onResize = () => {
    resize();
    initParticles();
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else {
      isRunning = true;
      animate();
    }
  };

  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);

  resize();
  initParticles();
  animate();

  return () => {
    isRunning = false;
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    canvas.remove();
  };
}
