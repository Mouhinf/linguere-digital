// Blog Page - Fetch and display blog posts from the API

(function() {
  'use strict';

  console.log('[Blog] Script loaded');

  var grid = null;
  var loadingState = null;
  var emptyState = null;
  var filterTabs = null;
  var allPosts = [];
  var activeFilter = 'all';

  function init() {
    console.log('[Blog] init() called');
    grid = document.getElementById('blog-grid');
    loadingState = document.getElementById('loading-state');
    emptyState = document.getElementById('empty-state');
    filterTabs = document.getElementById('filter-tabs');

    console.log('[Blog] DOM elements:', {
      grid: !!grid,
      loadingState: !!loadingState,
      emptyState: !!emptyState,
      filterTabs: !!filterTabs
    });

    if (!grid || !emptyState || !filterTabs) {
      console.error('[Blog] Required DOM elements not found');
      return;
    }

    if (typeof API === 'undefined') {
      console.error('[Blog] API class not available');
      return;
    }

    console.log('[Blog] API available, calling fetchBlogPosts()');
    fetchBlogPosts();
  }

  // Fetch blog posts from API
  async function fetchBlogPosts() {
    try {
      var response = await API.getBlogPosts();
      allPosts = Array.isArray(response) ? response : (response.data || []);
      renderFilterTabs();
      renderBlogPosts();
    } catch (error) {
      console.error('[Blog] Error fetching blog posts:', error);
      showError();
    }
  }

  // Render filter tabs based on post categories
  function renderFilterTabs() {
    var categories = [];
    var seen = {};
    allPosts.forEach(function(p) {
      if (p.categorie && !seen[p.categorie]) {
        seen[p.categorie] = true;
        categories.push(p.categorie);
      }
    });

    var tabsHTML = '<button class="filter-tab active" data-category="all">Tous</button>';
    categories.forEach(function(category) {
      tabsHTML += '<button class="filter-tab" data-category="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
    });

    filterTabs.innerHTML = tabsHTML;

    // Bind click events
    var tabs = filterTabs.querySelectorAll('.filter-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeFilter = tab.getAttribute('data-category');
        renderBlogPosts();
      });
    });
  }

  // Render blog posts grid
  function renderBlogPosts() {
    var filtered = activeFilter === 'all'
      ? allPosts
      : allPosts.filter(function(p) { return p.categorie === activeFilter; });

    if (!filtered.length) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    var html = filtered.map(function(post, index) {
      var dateStr = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

      var tags = Array.isArray(post.tags) ? post.tags : [];
      var tagsHtml = tags.length
        ? '<div class="blog-card-tags">' + tags.map(function(t) { return '<span class="blog-card-tag">' + escapeHtml(t) + '</span>'; }).join('') + '</div>'
        : '';

      var description = post.resume || post.metaDescription || '';
      var imgSrc = post.imageUrl || post.image || '';
      var imageHtml = imgSrc
        ? '<img class="blog-card-image" src="' + escapeAttr(imgSrc) + '" alt="' + escapeAttr(post.titre) + '" loading="lazy">'
        : '<div class="blog-card-image-placeholder">&#128221;</div>';

      return '<article class="blog-card" style="animation: fadeUp 0.4s ease-out ' + (index * 0.1) + 's both;">' +
        imageHtml +
        '<div class="blog-card-body">' +
          (post.categorie ? '<span class="blog-card-category">' + escapeHtml(post.categorie) + '</span>' : '') +
          '<h3 class="blog-card-title">' + escapeHtml(post.titre) + '</h3>' +
          '<p class="blog-card-description">' + escapeHtml(description) + '</p>' +
          tagsHtml +
          '<div class="blog-card-footer">' +
            '<div class="blog-card-meta">' +
              (dateStr ? '<span class="blog-card-date">' + dateStr + '</span>' : '') +
              (post.auteur ? '<span class="blog-card-author">Par ' + escapeHtml(post.auteur) + '</span>' : '') +
            '</div>' +
            '<a href="/blog-article.html?id=' + post.id + '" class="blog-card-link">Lire la suite &#8594;</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    grid.innerHTML = html;

    // Re-trigger scroll reveal
    if (window.initScrollReveal) {
      window.initScrollReveal();
    }
  }

  // Show error state
  function showError() {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    emptyState.innerHTML =
      '<div class="empty-state-icon">&#9888;&#65039;</div>' +
      '<h3>Erreur de chargement</h3>' +
      '<p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>';
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
