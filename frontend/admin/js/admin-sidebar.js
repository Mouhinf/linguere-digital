class AdminSidebar {
  static navItems = [
    { path: '/admin/dashboard.html', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/services.html', label: 'Services', icon: 'services' },
    { path: '/admin/projets.html', label: 'Projets', icon: 'projects' },
    { path: '/admin/blog.html', label: 'Blog', icon: 'blog' },
    { path: '/admin/temoignages.html', label: 'Témoignages', icon: 'testimonials' },
    { path: '/admin/messages.html', label: 'Messages', icon: 'messages', badge: true },
    { path: '/admin/parametres.html', label: 'Paramètres', icon: 'settings' },
  ];

  static icons = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    services: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 12v.01"/></svg>',
    projects: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    testimonials: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    messages: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  };

  static logo = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"/><path d="M2 12h20"/></svg>';

  static init() {
    if (document.querySelector('.admin-sidebar')) return;

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', () => AdminSidebar.close());

    const sidebar = document.createElement('aside');
    sidebar.className = 'admin-sidebar';
    // Add an id for accessibility (aria-controls) and easier targeting
    sidebar.id = 'admin-sidebar';
    // Mark as hidden for screen readers by default
    sidebar.setAttribute('aria-hidden', 'true');
    sidebar.innerHTML = AdminSidebar.render();

    const topbar = document.createElement('header');
    topbar.className = 'admin-topbar';
    topbar.innerHTML = AdminSidebar.renderTopbar();

    const existingLayout = document.querySelector('.admin-layout');
    const content = document.querySelector('.admin-content');

    if (existingLayout && content) {
      // Layout already exists in HTML — insert overlay first so the sidebar sits above it
      existingLayout.insertBefore(overlay, existingLayout.firstChild);
      existingLayout.insertBefore(sidebar, overlay.nextSibling);
      existingLayout.insertBefore(topbar, sidebar.nextSibling);
    } else if (content) {
      // No layout wrapper — create one and append overlay, then sidebar, then topbar
      const layout = document.createElement('div');
      layout.className = 'admin-layout';
      content.parentNode.insertBefore(layout, content);
      layout.appendChild(overlay);
      layout.appendChild(sidebar);
      layout.appendChild(topbar);
    } else {
      // Fallback: prepend topbar then sidebar then overlay to body (overlay still before sidebar)
      document.body.prepend(topbar);
      document.body.prepend(sidebar);
      document.body.prepend(overlay);
    }

    AdminSidebar.setActive();
    AdminSidebar.updateAdminInfo();
    AdminSidebar.updateMessageBadge();

    // Initialize focus helpers for accessibility
    AdminSidebar._focusable = [];
    AdminSidebar._lastFocused = null;

    if (content) {
      content.setAttribute('role', 'main');
      content.setAttribute('aria-label', 'Contenu principal');
    }

    // Keep overlay positioning in sync when resizing (helps mobile/desktop differences)
    window.addEventListener('resize', () => AdminSidebar._adjustOverlay(), { passive: true });
  }

  static render() {
    // Safely get user info - AdminAuth might not be loaded yet
    let user = {};
    try {
      if (typeof AdminAuth !== 'undefined') {
        user = AdminAuth.getUser() || {};
      }
    } catch (e) {
      console.warn('AdminSidebar: Could not get user info', e);
    }
    const brandName = 'Linguère Digital';

    return `
      <div class="sidebar-header">
        <div class="sidebar-header-logo">${AdminSidebar.logo}</div>
        <div class="sidebar-header-text">
          <span class="sidebar-header-brand">${brandName}</span>
        </div>
        <button class="sidebar-close-btn" aria-label="Fermer le menu" onclick="AdminSidebar.close()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <ul class="sidebar-nav" role="navigation" aria-label="Navigation principale">
        ${AdminSidebar.navItems.map(item => `
          <li>
            <a href="${item.path}" data-path="${item.path}" class="sidebar-link">
              ${AdminSidebar.icons[item.icon] || ''}
              <span>${item.label}</span>
              ${item.badge ? '<span class="badge-count" id="messages-badge" aria-label="Messages non lus">0</span>' : ''}
            </a>
          </li>
        `).join('')}
      </ul>
      <div class="sidebar-footer">
        <div class="admin-info">
          <div class="admin-avatar" aria-hidden="true">${(user.prenom || 'A')[0].toUpperCase()}</div>
          <div>
            <div class="admin-name">${user.prenom || 'Admin'} ${user.nom || ''}</div>
            <div class="admin-email">${user.email || ''}</div>
          </div>
        </div>
        <button class="btn-logout" id="sidebar-logout-btn" onclick="AdminAuth.logout()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Déconnexion
        </button>
      </div>
    `;
  }

  static renderTopbar() {
    const currentPath = window.location.pathname;
    const currentItem = AdminSidebar.navItems.find(item =>
      currentPath.includes(item.path.split('/').pop())
    );
    const title = currentItem ? currentItem.label : 'Dashboard';

    return `
      <button class="btn-toggle-sidebar" aria-label="Ouvrir le menu" aria-expanded="false" id="menu-toggle-btn" aria-controls="admin-sidebar" onclick="AdminSidebar.toggle()">
        <span class="hamburger" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div class="topbar-title">${title}</div>
      <div class="topbar-actions">
        <button class="btn-topbar-icon notification-btn" aria-label="Notifications" id="topbar-notif-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="badge-count" id="topbar-notif-badge" style="position:absolute;top:-4px;right:-6px;font-size:0.65rem;padding:0.1rem 0.35rem;display:none;">0</span>
        </button>
        <button class="btn-topbar-icon" aria-label="Paramètres" onclick="window.location.href='/admin/parametres.html'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>
    `;
  }

  static setActive() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.sidebar-link');

    links.forEach(link => {
      const linkPath = link.getAttribute('data-path');
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');

      if (linkPath) {
        const linkFile = linkPath.split('/').pop();
        const currentFile = currentPath.split('/').pop();
        if (linkFile && currentFile && linkFile === currentFile) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      }
    });

    this.updateTopbarTitle();
  }

  static updateTopbarTitle() {
    const titleEl = document.querySelector('.topbar-title');
    if (!titleEl) return;

    const currentPath = window.location.pathname;
    const currentItem = AdminSidebar.navItems.find(item =>
      currentPath.includes(item.path.split('/').pop())
    );
    titleEl.textContent = currentItem ? currentItem.label : 'Dashboard';
  }

  static toggle() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('open');

    if (isOpen) {
      AdminSidebar.close();
    } else {
      AdminSidebar.open();
    }
  }

  static open() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    // Ensure overlay doesn't cover the sidebar area (so clicks inside sidebar don't close it)
    AdminSidebar._adjustOverlay();
    document.body.style.overflow = 'hidden';

    const toggleBtn = document.getElementById('menu-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      // reflect attribute for CSS open state
      toggleBtn.setAttribute('aria-pressed', 'true');
    }

    // Accessibility: mark sidebar visible to AT and prepare focus trap
    if (sidebar) {
      sidebar.setAttribute('aria-hidden', 'false');
      sidebar.setAttribute('tabindex', '-1');
    }

    // remember last focused element so we can restore focus when closing
    AdminSidebar._lastFocused = document.activeElement;
    AdminSidebar._updateFocusable();

    // Focus the close button for accessibility
    const closeBtn = document.querySelector('.sidebar-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  static close() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    // Reset overlay positioning to default (remove all inline positioning we may have applied)
    try {
      if (overlay) {
        overlay.style.removeProperty('left');
        overlay.style.removeProperty('right');
        overlay.style.removeProperty('top');
        overlay.style.removeProperty('bottom');
        overlay.style.removeProperty('position');
      }
    } catch (e) {
      // ignore
    }
    document.body.style.overflow = '';

    const toggleBtn = document.getElementById('menu-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }

    // Accessibility: mark sidebar hidden to AT
    if (sidebar) {
      sidebar.setAttribute('aria-hidden', 'true');
      sidebar.removeAttribute('tabindex');
    }

    // restore focus to last focused element (or the toggle button)
    try {
      if (AdminSidebar._lastFocused && typeof AdminSidebar._lastFocused.focus === 'function') {
        AdminSidebar._lastFocused.focus();
      } else if (toggleBtn) {
        toggleBtn.focus();
      }
    } catch (e) {
      // ignore
    }
  }

  // Adjust overlay bounds so it doesn't overlap the sidebar. This keeps the
  // visible overlay (which applies a blur) off the sidebar itself and prevents
  // accidental clicks on the overlay when interacting with the menu.
  static _adjustOverlay() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) return;

    if (sidebar && sidebar.classList.contains('open')) {
      // Use the actual sidebar width so it works across breakpoints
      const rect = sidebar.getBoundingClientRect();
      const width = Math.max(0, Math.round(rect.width));
      // Position the overlay to start after the sidebar
      overlay.style.left = width + 'px';
      overlay.style.top = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
      overlay.style.position = 'fixed';
    } else {
      // Restore default (inset: 0 from CSS)
      overlay.style.removeProperty('left');
      overlay.style.removeProperty('right');
      overlay.style.removeProperty('top');
      overlay.style.removeProperty('bottom');
      overlay.style.removeProperty('position');
    }
  }

  // Close on Escape key when sidebar is open
  static _handleKeydown(e) {
    // Escape always closes the sidebar when open
    if (e.key === 'Escape') {
      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        AdminSidebar.close();
      }
      return;
    }

    // Simple focus trap while sidebar is open: keep Tab within sidebar
    if (e.key === 'Tab') {
      const sidebar = document.querySelector('.admin-sidebar');
      if (!sidebar || !sidebar.classList.contains('open')) return;

      AdminSidebar._updateFocusable();
      const focusable = AdminSidebar._focusable || [];
      if (focusable.length === 0) {
        // nothing to focus inside sidebar
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === sidebar) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  // Collect focusable elements inside the sidebar for the focus trap
  static _updateFocusable() {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) {
      AdminSidebar._focusable = [];
      return;
    }
    const nodes = sidebar.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const list = Array.prototype.filter.call(nodes, function (n) {
      return n && !n.disabled && n.offsetParent !== null;
    });
    // ensure close button is first
    const close = sidebar.querySelector('.sidebar-close-btn');
    if (close) {
      AdminSidebar._focusable = [close].concat(list.filter(el => el !== close));
    } else {
      AdminSidebar._focusable = list;
    }
  }

  static updateAdminInfo() {
    // Safely get user info - AdminAuth might not be loaded yet
    let user = {};
    try {
      if (typeof AdminAuth !== 'undefined') {
        user = AdminAuth.getUser() || {};
      }
    } catch (e) {
      console.warn('AdminSidebar: Could not get user info', e);
      return;
    }

    const nameEl = document.querySelector('.sidebar-footer .admin-name');
    const emailEl = document.querySelector('.sidebar-footer .admin-email');
    const avatarEl = document.querySelector('.sidebar-footer .admin-avatar');

    if (nameEl) nameEl.textContent = `${user.prenom || 'Admin'} ${user.nom || ''}`;
    if (emailEl) emailEl.textContent = user.email || '';
    if (avatarEl) avatarEl.textContent = (user.prenom || 'A')[0].toUpperCase();
  }

  static async updateMessageBadge() {
    try {
      const messages = await AdminAPI.getMessages('non-lu');
      const unreadCount = Array.isArray(messages)
        ? messages.filter(m => !m.lu && m.statut !== 'archivé').length
        : (typeof messages === 'object' ? (messages.unreadCount || messages.unread || 0) : 0);

      const badge = document.getElementById('messages-badge');
      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? '' : 'none';
      }

      const topbarBadge = document.getElementById('topbar-notif-badge');
      if (topbarBadge) {
        topbarBadge.textContent = unreadCount;
        topbarBadge.style.display = unreadCount > 0 ? '' : 'none';
      }
    } catch (error) {
      console.error('Error updating message badge:', error);
    }
  }

  static startBadgePolling(intervalMs = 30000) {
    AdminSidebar.updateMessageBadge();
    setInterval(() => AdminSidebar.updateMessageBadge(), intervalMs);
  }

  static navigateTo(path) {
    window.location.href = path;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const isLoginPage = window.location.pathname.includes('login.html');
  if (isLoginPage) return;

  // Defer initialization using setTimeout to avoid race condition with admin-auth.js
  // AdminAuth.requireAuth() runs on DOMContentLoaded and may redirect
  setTimeout(() => {
    // Auth check is handled by admin-auth.js — skip to avoid race condition
    AdminSidebar.init();

    if (typeof AdminAPI !== 'undefined') {
      AdminSidebar.startBadgePolling();
    }
  }, 50);
  // Global keydown for accessibility (Escape closes sidebar)
  document.addEventListener('keydown', AdminSidebar._handleKeydown);
});

window.AdminSidebar = AdminSidebar;
