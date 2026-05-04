// Main JavaScript - Navbar, scroll effects, and utilities

// Navbar scroll effect
let navbarInitialized = false;

function initNavbar() {
  // Prevent double initialization
  if (navbarInitialized) return;

  const navbar = document.querySelector('nav.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!navbar || !hamburger || !navLinks) {
    console.warn('initNavbar: missing elements', {
      navbar: !!navbar,
      hamburger: !!hamburger,
      navLinks: !!navLinks
    });
    return;
  }

  navbarInitialized = true;

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    // Lock/unlock body scroll
    if (isActive) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // Close mobile dropdown when menu closes
    hamburger.setAttribute('aria-expanded', isActive);

    if (!isActive) {
      const dropdowns = navLinks.querySelectorAll('.nav-dropdown.active');
      dropdowns.forEach(d => d.classList.remove('active'));
    }
  });

  // Close menu on link click
  const links = navLinks.querySelectorAll('a:not(.nav-dropdown-toggle)');
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');

      // Close mobile dropdowns
      const dropdowns = navLinks.querySelectorAll('.nav-dropdown.active');
      dropdowns.forEach(d => d.classList.remove('active'));
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      const dropdowns = navLinks.querySelectorAll('.nav-dropdown.active');
      dropdowns.forEach(d => d.classList.remove('active'));
    }
  });

  // Active state based on current page
  updateActiveNavLink();
}

function updateActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace(/\//g, ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Intersection Observer for scroll reveal animations (delegates to AnimationController if available)
function initScrollReveal() {
  // AnimationController in animations.js handles reveal animations
  // This function is kept for pages that don't load animations.js
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

// Back to top button
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Page loader
function showLoader() {
  let loader = document.getElementById('page-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(8, 8, 24, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    `;
    document.body.appendChild(loader);
  }
  loader.innerHTML = '<div class="spinner"></div>';
  loader.style.display = 'flex';
}

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

// Format numbers with commas
function formatNumber(num) {
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value);
}

// Count up animation
function countUp(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const update = () => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
    } else {
      element.textContent = formatNumber(Math.floor(current));
      requestAnimationFrame(update);
    }
  };

  update();
}

// Scroll to element
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle function
function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      func.apply(this, args);
      lastCall = now;
    }
  };
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // initNavbar() is called by components.js after navbar injection
  // Only call it here if navbar already exists in HTML (not injected)
  if (document.querySelector('nav.navbar')) {
    initNavbar();
  }
  initScrollReveal();
  initBackToTop();
  hideLoader();

  // Prevent body scroll when modal is open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.remove();
      });
    }
  });
});

// Handle page transitions
window.addEventListener('beforeunload', () => {
  // Show loader only if navigating to different domain
  if (event.type === 'beforeunload') {
    // showLoader();
  }
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      scrollToElement(href);
    }
  }
});

// Log performance metrics using modern Performance API
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    const navEntry = performance.getEntriesByType('navigation')[0];
    
    if (navEntry) {
      const domReady = Math.round(navEntry.domContentLoadedEventEnd);
      const loadTime = Math.round(navEntry.loadEventEnd || performance.now());
      console.log(`Page loaded in ${loadTime}ms (DOM ready: ${domReady}ms)`);
    } else {
      // Fallback for older browsers
      const loadTime = Math.round(performance.now());
      console.log(`Page loaded in ~${loadTime}ms`);
    }
  });
});
