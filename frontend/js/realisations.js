// Realisations Page - Fetch and display projects from the API

(function() {
  'use strict';

  console.log('[Realisations] Script loaded');

  var grid = null;
  var loadingState = null;
  var emptyState = null;
  var filterTabs = null;
  var allProjects = [];
  var activeFilter = 'all';

  function init() {
    console.log('[Realisations] init() called');
    grid = document.getElementById('projects-grid');
    loadingState = document.getElementById('loading-state');
    emptyState = document.getElementById('empty-state');
    filterTabs = document.getElementById('filter-tabs');

    console.log('[Realisations] DOM elements:', {
      grid: !!grid,
      loadingState: !!loadingState,
      emptyState: !!emptyState,
      filterTabs: !!filterTabs
    });

    if (!grid || !emptyState || !filterTabs) {
      console.error('[Realisations] Required DOM elements not found');
      return;
    }

    if (typeof API === 'undefined') {
      console.error('[Realisations] API class not available');
      return;
    }

    console.log('[Realisations] API available, calling fetchProjects()');
    fetchProjects();
  }

  // Fetch projects from API
  async function fetchProjects() {
    console.log('[Realisations] Starting fetchProjects, API_BASE:', typeof API_BASE !== 'undefined' ? API_BASE : 'undefined');
    try {
      var response = await API.getProjects();
      console.log('[Realisations] API response:', response);
      allProjects = Array.isArray(response) ? response : (response.data || []);
      console.log('[Realisations] Parsed projects:', allProjects.length);
      renderFilterTabs();
      renderProjects();
    } catch (error) {
      console.error('[Realisations] Error fetching projects:', error);
      showError();
    }
  }

  // Render filter tabs based on project categories
  function renderFilterTabs() {
    console.log('[Realisations] renderFilterTabs called, projects:', allProjects.length);
    var categories = [];
    var seen = {};
    allProjects.forEach(function(p) {
      if (p.categorie && !seen[p.categorie]) {
        seen[p.categorie] = true;
        categories.push(p.categorie);
      }
    });
    console.log('[Realisations] Categories found:', categories);

    var tabsHTML = '<button class="filter-tab active" data-category="all">Tous</button>';
    categories.forEach(function(category) {
      tabsHTML += '<button class="filter-tab" data-category="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
    });

    filterTabs.innerHTML = tabsHTML;
    console.log('[Realisations] Filter tabs rendered');

    // Bind click events
    var tabs = filterTabs.querySelectorAll('.filter-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeFilter = tab.getAttribute('data-category');
        renderProjects();
      });
    });
    console.log('[Realisations] Filter tabs events bound');
  }

  // Render projects grid
  function renderProjects() {
    console.log('[Realisations] renderProjects called, activeFilter:', activeFilter);
    var filtered = activeFilter === 'all'
      ? allProjects
      : allProjects.filter(function(p) { return p.categorie === activeFilter; });

    console.log('[Realisations] Filtered projects:', filtered.length);

    if (!filtered.length) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      console.log('[Realisations] Empty state shown');
      return;
    }

    emptyState.classList.add('hidden');

    var html = filtered.map(function(project, index) {
      var dateStr = project.dateProjets
        ? new Date(project.dateProjets).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
        : '';

      var techs = Array.isArray(project.technologies) ? project.technologies : [];
      var techsHtml = techs.length
        ? '<div class="project-card-techs">' + techs.map(function(t) { return '<span class="project-card-tech">' + escapeHtml(t) + '</span>'; }).join('') + '</div>'
        : '';

      var imgSrc = project.imageUrl || project.image || '';
      var imageHtml = imgSrc
        ? '<img class="project-card-image" src="' + escapeAttr(imgSrc) + '" alt="' + escapeAttr(project.titre) + '" loading="lazy">'
        : '<div class="project-card-image-placeholder">&#128187;</div>';

      var linkHtml = project.lien
        ? '<a href="' + escapeAttr(project.lien) + '" class="project-card-link" target="_blank" rel="noopener noreferrer">Voir le projet &#8594;</a>'
        : '';

      return '<article class="project-card" style="animation: fadeUp 0.4s ease-out ' + (index * 0.1) + 's both;">' +
        imageHtml +
        '<div class="project-card-body">' +
          (project.categorie ? '<span class="project-card-category">' + escapeHtml(project.categorie) + '</span>' : '') +
          '<h3 class="project-card-title">' + escapeHtml(project.titre) + '</h3>' +
          '<p class="project-card-description">' + escapeHtml(project.description || '') + '</p>' +
          techsHtml +
          '<div class="project-card-footer">' +
            (dateStr ? '<span class="project-card-date">' + dateStr + '</span>' : '<span></span>') +
            linkHtml +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    console.log('[Realisations] HTML generated, length:', html.length);
    grid.innerHTML = html;
    console.log('[Realisations] Grid innerHTML set');

    // Re-trigger scroll reveal
    if (window.initScrollReveal) {
      window.initScrollReveal();
      console.log('[Realisations] Scroll reveal re-triggered');
    }
  }

  // Show error state
  function showError() {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    emptyState.innerHTML =
      '<div class="empty-state-icon">&#9888;&#65039;</div>' +
      '<h3>Erreur de chargement</h3>' +
      '<p>Impossible de charger les réalisations. Veuillez réessayer plus tard.</p>';
  }

  // Utility: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Utility: Escape attribute
  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
