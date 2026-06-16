// Particles Canvas Animation — Multi-section support
class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = options.count || 45;
    this.connectionDistance = options.connectionDistance || 130;
    this.color = options.color || '0, 119, 182';
    this.highOpacity = options.highOpacity || false;
    this.lastFrameTime = 0;
    this.targetFPS = 30;
    this.frameInterval = 1000 / this.targetFPS;
    this.isVisible = false;
    this.mouseX = -1000;
    this.mouseY = -1000;

    this.setupCanvas();
    this.createParticles();
    this.handleMouse();
    this.observeVisibility();
    requestAnimationFrame((t) => this.animate(t));

    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.createParticles();
    });
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  createParticles() {
    this.particles = [];
    const baseOpacity = this.highOpacity ? 0.5 : 0.3;
    const opacityRange = this.highOpacity ? 0.5 : 0.35;
    const baseRadius = this.highOpacity ? 1.2 : 0.8;
    const radiusRange = this.highOpacity ? 2.5 : 1.8;

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * radiusRange + baseRadius,
        opacity: Math.random() * opacityRange + baseOpacity
      });
    }
  }

  handleMouse() {
    this.canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      this.particles.forEach(p => {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 180) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / 180) * 0.25;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      });
    });

    this.canvas.parentElement.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });
  }

  observeVisibility() {
    const observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(this.canvas);
  }

  drawParticles() {
    this.particles.forEach(p => {
      this.ctx.fillStyle = `rgba(${this.color}, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawConnections() {
    const lineOpacityMult = this.highOpacity ? 0.45 : 0.3;
    const lineWidth = this.highOpacity ? 1.2 : 0.9;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * lineOpacityMult;
          this.ctx.strokeStyle = `rgba(${this.color}, ${opacity})`;
          this.ctx.lineWidth = lineWidth;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // Lignes vers la souris
    if (this.mouseX > 0 && this.mouseY > 0) {
      this.particles.forEach(p => {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.connectionDistance * 1.5) {
          const opacity = (1 - distance / (this.connectionDistance * 1.5)) * 0.35;
          this.ctx.strokeStyle = `rgba(${this.color}, ${opacity})`;
          this.ctx.lineWidth = lineWidth * 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouseX, this.mouseY);
          this.ctx.stroke();
        }
      });
    }
  }

  updateParticles() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      p.vx *= 0.993;
      p.vy *= 0.993;

      p.vx += (Math.random() - 0.5) * 0.1;
      p.vy += (Math.random() - 0.5) * 0.1;

      if (p.x - p.radius < 0 || p.x + p.radius > this.canvas.width) {
        p.vx = -p.vx;
        p.x = Math.max(p.radius, Math.min(this.canvas.width - p.radius, p.x));
      }
      if (p.y - p.radius < 0 || p.y + p.radius > this.canvas.height) {
        p.vy = -p.vy;
        p.y = Math.max(p.radius, Math.min(this.canvas.height - p.radius, p.y));
      }
    });
  }

  animate(timestamp) {
    const elapsed = timestamp - this.lastFrameTime;
    if (elapsed < this.frameInterval) {
      requestAnimationFrame((t) => this.animate(t));
      return;
    }
    this.lastFrameTime = timestamp - (elapsed % this.frameInterval);

    if (document.hidden || !this.isVisible) {
      requestAnimationFrame((t) => this.animate(t));
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();

    requestAnimationFrame((t) => this.animate(t));
  }
}

// Initialize all particle canvases on the page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.particles-section').forEach(canvas => {
    const count = parseInt(canvas.dataset.count) || 45;
    const color = canvas.dataset.color || '0, 119, 182';
    const dist = parseInt(canvas.dataset.distance) || 130;
    const highOpacity = canvas.dataset.opacity === 'high';
    new ParticleSystem(canvas, { count, color, connectionDistance: dist, highOpacity });
  });
});
