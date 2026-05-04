// Home page specific functionality

async function loadFeaturedProjects() {
  const container = document.getElementById('featured-projects');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/projects?limit=3`);
    const projects = await response.json();
    const projectArray = Array.isArray(projects) ? projects : (projects.data || []);

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
    const testimonials = await response.json();

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
              <h4>${testimonial.nom}</h4>
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
    const posts = await response.json();

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

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProjects();
  loadTestimonials();
  loadBlogPosts();
});
