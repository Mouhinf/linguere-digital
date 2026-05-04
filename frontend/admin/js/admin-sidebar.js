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
    sidebar.innerHTML = AdminSidebar.render();

    const topbar = document.createElement('header');
    topbar.className = 'admin-topbar';
    topbar.innerHTML = AdminSidebar.renderTopbar();

    const existingLayout = document.querySelector('.admin-layout');
    const content = document.querySelector('.admin-content');

    if (existingLayout && content) {
      // Layout already exists in HTML — just prepend sidebar, overlay, topbar
      existingLayout.insertBefore(sidebar, existingLayout.firstChild);
      existingLayout.insertBefore(overlay, sidebar.nextSibling);
      existingLayout.insertBefore(topbar, overlay.nextSibling);
    } else if (content) {
      // No layout wrapper — create one
      const layout = document.createElement('div');
      layout.className = 'admin-layout';
      content.parentNode.insertBefore(layout, content);
      layout.appendChild(sidebar);
      layout.appendChild(overlay);
      layout.appendChild(topbar);
    } else {
      document.body.prepend(sidebar);
      document.body.prepend(overlay);
      document.body.prepend(topbar);
    }

    AdminSidebar.setActive();
    AdminSidebar.updateAdminInfo();
    AdminSidebar.updateMessageBadge();

    if (content) {
      content.setAttribute('role', 'main');
      content.setAttribute('aria-label', 'Contenu principal');
    }
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
          <span class="sidebar-header-sub">Administration</span>
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
      <button class="btn-toggle-sidebar" aria-label="Menu" id="menu-toggle-btn" onclick="AdminSidebar.toggle()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
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
    document.body.style.overflow = 'hidden';

    const toggleBtn = document.getElementById('menu-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  static close() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';

    const toggleBtn = document.getElementById('menu-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
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
});

window.AdminSidebar = AdminSidebar;