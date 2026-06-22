// Components - Navbar, Footer, and common elements injection

class ComponentLoader {
  static async loadNavbar() {
    const skipLink = '<a href="#main-content" class="skip-link">Aller au contenu principal</a>';
    const navbar = `
      <nav class="navbar" role="navigation" aria-label="Navigation principale">
        <a href="/" class="navbar-logo">
          <img src="/assets/logo.png" alt="Linguère Digital Logo" class="navbar-logo-img">
          Linguère Digital
        </a>

        <ul class="nav-links" role="menubar">
          <li role="none"><a href="/" data-section="home" role="menuitem">Accueil</a></li>
          <li role="none"><a href="/about.html" role="menuitem">À Propos</a></li>
          <li class="nav-dropdown" role="none">
            <a href="/services.html" class="nav-dropdown-toggle" role="menuitem" aria-haspopup="true" aria-expanded="false">Services</a>
            <ul class="dropdown-menu" role="menu">
              <li role="none"><a href="/services/informatique.html" role="menuitem">Informatique</a></li>
              <li role="none"><a href="/services/data-science.html" role="menuitem">Data Science</a></li>
              <li role="none"><a href="/services/marketing.html" role="menuitem">Marketing Digital</a></li>
              <li role="none"><a href="/services/formation.html" role="menuitem">Formation</a></li>
            </ul>
          </li>
          <li role="none"><a href="/realisations.html" role="menuitem">Réalisations</a></li>
          <li role="none"><a href="/blog.html" role="menuitem">Blog</a></li>
          <li role="none"><a href="/contact.html" role="menuitem">Contact</a></li>
        </ul>

        <button class="hamburger" aria-label="Ouvrir le menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    `;

    const container = document.createElement('div');
    container.innerHTML = navbar;
    document.body.insertBefore(container.firstElementChild, document.body.firstChild);
    document.body.insertAdjacentHTML('afterbegin', skipLink);

    // Mobile dropdown toggle
    this.initMobileDropdown();

    // Initialize navbar interactions now that DOM has the navbar
    if (typeof initNavbar === 'function') {
      initNavbar();
    }
  }

  static initMobileDropdown() {
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    if (!dropdownToggles.length) return;

    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        // Only intercept on mobile (when hamburger is visible)
        const hamburger = document.querySelector('.hamburger');
        if (hamburger && window.getComputedStyle(hamburger).display !== 'none') {
          e.preventDefault();
          e.stopPropagation();
          const parent = toggle.closest('.nav-dropdown');
          if (parent) {
            parent.classList.toggle('active');
            toggle.setAttribute('aria-expanded', parent.classList.contains('active'));
          }
        }
      });
    });
  }

  static async loadFooter() {
    const footer = `
      <footer role="contentinfo">
        <div class="footer-content container">
          <div class="footer-section">
            <div class="footer-logo">
              <img src="/assets/logo.png" alt="Linguère Digital Logo" class="footer-logo-img">
              <span>Linguère Digital</span>
            </div>
            <p>Transformons votre vision digitale en réalité. L'innovation au cœur de l'Afrique.</p>
            <div class="social-links" aria-label="Réseaux sociaux">
              <a href="https://facebook.com/linguere" class="social-link" title="Facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://x.com/linguere" class="social-link" title="X (Twitter)" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/linguere" class="social-link" title="LinkedIn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://instagram.com/linguere" class="social-link" title="Instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h3>Services</h3>
            <ul>
              <li><a href="/services/informatique.html">Développement Web</a></li>
              <li><a href="/services/informatique.html">Génie Logiciel</a></li>
              <li><a href="/services/data-science.html">Machine Learning</a></li>
              <li><a href="/services/marketing.html">Marketing Digital</a></li>
              <li><a href="/services/formation.html">Formation Professionnelle</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Entreprise</h3>
            <ul>
              <li><a href="/about.html">À Propos</a></li>
              <li><a href="/blog.html">Blog & Actualités</a></li>
              <li><a href="/realisations.html">Nos Projets</a></li>
              <li><a href="/contact.html">Contact</a></li>
              <li><a href="#">Mentions Légales</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Contact</h3>
            <p><strong>Email:</strong> linguere660@gmail.com</p>
            <p><strong>Téléphone:</strong> +221 77 612 60 31 / +221 78 660 24 24</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/221786602424" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary);">+221 78 660 24 24</a></p>
            <p><strong>Adresse:</strong> Malika, Dakar, Sénégal</p>
            <p><strong>Horaires:</strong> Lun-Ven 09:00-18:00</p>
          </div>
        </div>

        <div class="footer-bottom container-fluid">
          <p>&copy; ${new Date().getFullYear()} Linguère Digital Innovation. Tous droits réservés.</p>
          <ul class="footer-links">
            <li><a href="#">Politique de Confidentialité</a></li>
            <li><a href="#">Conditions d'Utilisation</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </footer>

      <a href="https://wa.me/221786602424" class="whatsapp-float" title="Chat WhatsApp" target="_blank" rel="noopener noreferrer" aria-label="Contacter via WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12.05 2.054c-5.473 0-9.927 4.454-9.927 9.927 0 1.752.457 3.462 1.326 4.965L2.054 21.946l5.137-1.349a9.904 9.904 0 004.858 1.26h.001c5.473 0 9.927-4.454 9.927-9.927 0-2.653-1.031-5.147-2.907-7.023A9.858 9.858 0 0012.05 2.054zm0 18.183c-1.498 0-2.967-.403-4.248-1.166l-.305-.182-3.164.831.846-3.087-.198-.316a8.24 8.24 0 01-1.264-4.383c0-4.54 3.695-8.235 8.235-8.235 2.201 0 4.27.858 5.825 2.413a8.183 8.183 0 012.41 5.824c0 4.54-3.695 8.235-8.235 8.235h-.102z"/>
        </svg>
      </a>

      <a href="#" class="back-to-top" title="Retour en haut" aria-label="Retour en haut de page">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </a>
    `;

    document.body.insertAdjacentHTML('beforeend', footer);

    // Initialize back-to-top button now that it exists in the DOM
    if (typeof initBackToTop === 'function') {
      initBackToTop();
    }
  }

  static async loadAll() {
    try {
      await this.loadNavbar();
      await this.loadFooter();
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }
}

// Auto-load components on all pages
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('nav.navbar')) {
    ComponentLoader.loadAll();
  }
});
