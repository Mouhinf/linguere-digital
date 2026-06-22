// Home page specific functionality

async function loadFeaturedProjects() {
  const container = document.getElementById('featured-projects');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/projects?limit=3`);
    const result = await response.json();
    const projectArray = Array.isArray(result) ? result : (result.data || []);

    if (projectArray.length > 0) {
      container.innerHTML = projectArray.map(project => {
        const imageUrl = project.imageUrl || project.image || '';
        const techs = Array.isArray(project.technologies) ? project.technologies : [];
        const techsHtml = techs.length 
          ? techs.map(t => `<span class="project-tech-tag">${escHtml(t)}</span>`).join('')
          : '';

        return `
          <article class="home-project-card glass-card">
            <div class="home-project-image">
              ${imageUrl 
                ? `<img src="${escAttr(imageUrl)}" alt="${escAttr(project.titre)}" loading="lazy">`
                : `<div class="home-project-placeholder">🖥️</div>`
              }
              <div class="home-project-overlay">
                <a href="/realisations.html" class="btn btn-sm">Voir le projet</a>
              </div>
            </div>
            <div class="home-project-content">
              ${project.categorie ? `<span class="home-project-category">${escHtml(project.categorie)}</span>` : ''}
              <h3>${escHtml(project.titre)}</h3>
              <p>${project.description ? escHtml(project.description.substring(0, 120)) + '...' : ''}</p>
              ${techsHtml ? `<div class="home-project-techs">${techsHtml}</div>` : ''}
            </div>
          </article>
        `;
      }).join('');
    } else {
      container.innerHTML = '<p class="text-center">Aucun projet disponible pour le moment.</p>';
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    container.innerHTML = '<p class="text-center">Erreur lors du chargement des projets.</p>';
  }
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function loadTestimonials() {
  const container = document.getElementById('testimonials-carousel');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/testimonials`);
    const result = await response.json();
    const testimonials = Array.isArray(result) ? result : (result.data || []);

    if (testimonials && testimonials.length > 0) {
      container.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card glass-card">
          <div class="testimonial-content">
            <p>"${testimonial.contenu}"</p>
          </div>
          <div class="testimonial-author">
            <div class="author-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="author-info">
              <h3 class="testimonial-name">${testimonial.nom}</h3>
              <p>${testimonial.entreprise || ''}</p>
              <div class="stars">${'★'.repeat(testimonial.etoiles || 5)}${'☆'.repeat(5 - (testimonial.etoiles || 5))}</div>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="text-center">Aucun témoignage disponible pour le moment.</p>';
    }
  } catch (error) {
    console.error('Error loading testimonials:', error);
    container.innerHTML = '<p class="text-center">Erreur lors du chargement des témoignages.</p>';
  }
}

async function loadBlogPosts() {
  const container = document.getElementById('featured-blog');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/blog?limit=3`);
    const result = await response.json();
    const posts = Array.isArray(result) ? result : (result.data || []);

    if (posts && posts.length > 0) {
      container.innerHTML = posts.map(post => {
        const imageUrl = post.imageUrl || post.image || '';
        const description = post.resume || post.metaDescription || '';
        const dateStr = post.createdAt 
          ? new Date(post.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
          : '';

        return `
          <article class="home-blog-card glass-card">
            <div class="home-blog-image">
              ${imageUrl 
                ? `<img src="${escAttr(imageUrl)}" alt="${escAttr(post.titre)}" loading="lazy">`
                : `<div class="home-blog-placeholder">📝</div>`
              }
            </div>
            <div class="home-blog-content">
              ${post.categorie ? `<span class="home-blog-category">${escHtml(post.categorie)}</span>` : ''}
              <h3>${escHtml(post.titre)}</h3>
              <p>${description ? escHtml(description.substring(0, 100)) + '...' : ''}</p>
              <div class="home-blog-meta">
                <span class="home-blog-date">${dateStr}</span>
              </div>
              <a href="/blog-article.html?id=${post.id}" class="btn btn-outline btn-sm">Lire la suite</a>
            </div>
          </article>
        `;
      }).join('');
    } else {
      container.innerHTML = '<p class="text-center">Aucun article de blog disponible pour le moment.</p>';
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    container.innerHTML = '<p class="text-center">Erreur lors du chargement des articles.</p>';
  }
}

async function loadHomeServices() {
  const container = document.getElementById('home-services-container');
  if (!container) return;

  try {
    console.log('Loading home services, API_BASE:', API_BASE);
    const response = await fetch(`${API_BASE}/services`);
    console.log('Home services response:', response.status);
    const result = await response.json();
    console.log('Home services result:', result);
    const services = result.data || result;

    if (!services || services.length === 0) {
      container.innerHTML = '<div class="text-center" style="grid-column:1/-1;padding:2rem;"><p class="text-muted">Aucun service disponible</p></div>';
      return;
    }

    const categoryIcons = {
      'informatique': '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>',
      'data-science': '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 16.1A6.5 6.5 0 0 0 20 7a6.5 6.5 0 0 0-10.6 1M5 20a6.5 6.5 0 0 0 9-5.9A9 9 0 0 1 3 12"/></svg>',
      'marketing': '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 17l4 4 8-8M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      'formation': '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z"/></svg>'
    };

    const categoryLinks = {
      'informatique': '/services/informatique.html',
      'data-science': '/services/data-science.html',
      'marketing': '/services/marketing.html',
      'formation': '/services/formation.html'
    };

    container.innerHTML = services.map((service, index) => {
      const icon = categoryIcons[service.categorie] || categoryIcons['informatique'];
      const link = categoryLinks[service.categorie] || '#';
      const delay = index * 0.1;
      return `
        <div class="service-card glass-card reveal" style="animation-delay: ${delay}s;">
          <div class="service-icon">${icon}</div>
          <h3>${escHtml(service.titre || '')}</h3>
          <p>${escHtml(service.description || '')}</p>
          <a href="${link}" class="btn btn-outline btn-sm">En savoir plus</a>
        </div>
      `;
    }).join('');

    if (window.initScrollReveal) {
      window.initScrollReveal();
    }
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<div class="text-center" style="grid-column:1/-1;padding:2rem;"><p class="text-muted">Erreur de chargement des services</p></div>';
  }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  loadHomeServices();
  loadFeaturedProjects();
  loadTestimonials();
  loadBlogPosts();
});
