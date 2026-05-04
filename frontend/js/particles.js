// Particles Canvas Animation
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.lines = [];
    this.particleCount = 60;
    this.connectionDistance = 120;
    this.lastFrameTime = 0;
    this.targetFPS = 30;
    this.frameInterval = 1000 / this.targetFPS;

    this.setupCanvas();
    this.createParticles();
    this.handleMouse();
    requestAnimationFrame((t) => this.animate(t));

    window.addEventListener('resize', () => this.setupCanvas());
  }

  setupCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  handleMouse() {
    let mouseX = this.canvas.width / 2;
    let mouseY = this.canvas.height / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Attract particles towards mouse
      this.particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / maxDistance) * 0.3;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      });
    });
  }

  drawParticles() {
    this.particles.forEach(p => {
      this.ctx.fillStyle = `rgba(0, 180, 216, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.3;
          this.ctx.strokeStyle = `rgba(0, 180, 216, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  updateParticles() {
    this.particles.forEach(p => {
      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;

      // Apply friction
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Add slight random movement
      p.vx += (Math.random() - 0.5) * 0.1;
      p.vy += (Math.random() - 0.5) * 0.1;

      // Bounce off walls
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
    // Throttle to target FPS to avoid blocking main thread
    const elapsed = timestamp - this.lastFrameTime;
    if (elapsed < this.frameInterval) {
      requestAnimationFrame((t) => this.animate(t));
      return;
    }
    this.lastFrameTime = timestamp - (elapsed % this.frameInterval);

    // Stop rendering if tab is not visible
    if (document.hidden) {
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

// Initialize particles if canvas exists
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('particles-canvas')) {
    new ParticleSystem('particles-canvas');
  }
});
