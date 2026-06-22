// Advanced Animations - Intersection Observer and effects

class AnimationController {
  constructor() {
    this.observer = null;
    this.staggerDelay = 100;
    this.init();
  }

  init() {
    this.setupObserver();
    this.attachEventListeners();
  }

  setupObserver() {
    const options = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      this.observer.observe(el);
    });

    // Observe staggered children
    document.querySelectorAll('.stagger-children').forEach(parent => {
      parent.querySelectorAll(':scope > *').forEach((child, index) => {
        child.style.setProperty('--stagger-index', `${index * this.staggerDelay}ms`);
        this.observer.observe(child);
      });
    });
  }

  animateElement(element) {
    const classList = element.className;

    if (classList.includes('reveal-scale')) {
      element.style.animation = 'scaleIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    } else if (classList.includes('reveal-left')) {
      element.style.animation = 'fadeLeft 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards';
    } else if (classList.includes('reveal-right')) {
      element.style.animation = 'fadeRight 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards';
    } else {
      element.style.animation = 'fadeUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }
  }

  attachEventListeners() {
    // Hover lift effect for glass cards
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Button ripple effect
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.createRipple(e, btn);
      });
    });
  }

  createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (event.clientX - element.offsetLeft - radius) + 'px';
    circle.style.top = (event.clientY - element.offsetTop - radius) + 'px';
    circle.classList.add('ripple');
    circle.style.cssText += `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: rippleAnimation 600ms ease-out;
    `;

    element.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  observeNewElements() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      if (!el.hasObserver) {
        el.hasObserver = true;
        this.observer.observe(el);
      }
    });
  }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  new AnimationController();

  // Add ripple animation keyframe if not exists
  if (!document.querySelector('style[data-ripple]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ripple', 'true');
    style.textContent = `
      @keyframes rippleAnimation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
});

// Number animation on scroll
function animateNumbers() {
  const numbers = document.querySelectorAll('[data-count]');
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.getAttribute('data-count'));
        countUp(entry.target, target, 2000);
      }
    });
  }, observerOptions);

  numbers.forEach(num => observer.observe(num));
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(animateNumbers, 500);
});

// Parallax effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-parallax') || 0.5;
      const yPos = window.scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
});

// Typewriter effect
class Typewriter {
  constructor(element, texts, speed = 80) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.start();
  }

  type() {
    const text = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = text.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = text.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let speed = this.speed;

    if (!this.isDeleting && this.charIndex === text.length) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      speed = 500;
    }

    setTimeout(() => this.type(), speed);
  }

  start() {
    this.type();
  }
}

// Initialize typewriter if element exists
document.addEventListener('DOMContentLoaded', () => {
  const typewriterElement = document.querySelector('[data-typewriter]');
  if (typewriterElement) {
    const texts = typewriterElement.getAttribute('data-typewriter').split('|');
    new Typewriter(typewriterElement, texts, 80);
  }
});

// Confetti animation
function createConfetti() {
  const confettiPieces = 50;
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < confettiPieces; i++) {
    const confetti = document.createElement('div');
    const colors = ['#00B4D8', '#0077B6', '#00D4F5', '#03045E'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${randomColor};
      left: ${Math.random() * 100}%;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '0' : '50%'};
      animation: confettiFall ${2 + Math.random() * 1}s linear forwards;
      opacity: 1;
    `;
    container.appendChild(confetti);
  }

  // Add animation
  if (!document.querySelector('style[data-confetti]')) {
    const style = document.createElement('style');
    style.setAttribute('data-confetti', 'true');
    style.textContent = `
      @keyframes confettiFall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 3000);
}

// Export for use in other scripts
window.AnimationUtils = {
  countUp,
  createConfetti,
  Typewriter
};
