// API Configuration
const API_BASE = window.LINGUERE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api');

class API {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          if (window.location.pathname.includes('/admin')) {
            window.location.href = '/admin/login.html';
          }
        }
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  static login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  static logout() {
    localStorage.removeItem('auth_token');
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Contact
  static submitContact(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Public data
  static getServices() {
    return this.request('/services');
  }

  static getProjects(limit) {
    return this.request(`/projects${limit ? '?limit=' + limit : ''}`);
  }

  static getProject(id) {
    return this.request(`/projects/${id}`);
  }

  static getBlogPosts(limit) {
    return this.request(`/blog${limit ? '?limit=' + limit : ''}`);
  }

  static getBlogPost(id) {
    return this.request(`/blog/${id}`);
  }

  static getTestimonials() {
    return this.request('/testimonials');
  }

  // Admin
  static getStats() {
    return this.request('/admin/stats');
  }

  static getAdminServices() {
    return this.request('/admin/services');
  }

  static createService(data) {
    return this.request('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateService(id, data) {
    return this.request(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteService(id) {
    return this.request(`/admin/services/${id}`, { method: 'DELETE' });
  }

  static getAdminProjects() {
    return this.request('/admin/projects');
  }

  static createProject(data) {
    return this.request('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateProject(id, data) {
    return this.request(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteProject(id) {
    return this.request(`/admin/projects/${id}`, { method: 'DELETE' });
  }

  static getAdminBlogPosts() {
    return this.request('/admin/blog');
  }

  static createBlogPost(data) {
    return this.request('/admin/blog', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateBlogPost(id, data) {
    return this.request(`/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteBlogPost(id) {
    return this.request(`/admin/blog/${id}`, { method: 'DELETE' });
  }

  static getAdminTestimonials() {
    return this.request('/admin/testimonials');
  }

  static createTestimonial(data) {
    return this.request('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateTestimonial(id, data) {
    return this.request(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteTestimonial(id) {
    return this.request(`/admin/testimonials/${id}`, { method: 'DELETE' });
  }

  static getMessages(status) {
    return this.request(`/admin/messages${status ? '?status=' + status : ''}`);
  }

  static getMessage(id) {
    return this.request(`/admin/messages/${id}`);
  }

  static markMessageAsRead(id) {
    return this.request(`/admin/messages/${id}/read`, { method: 'PATCH' });
  }

  static deleteMessage(id) {
    return this.request(`/admin/messages/${id}`, { method: 'DELETE' });
  }

  static getSettings(category) {
    return this.request(`/admin/settings/${category}`);
  }

  static updateSettings(category, data) {
    return this.request(`/admin/settings/${category}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static getChartData(type) {
    return this.request(`/admin/stats/${type}`);
  }
}

// Fallback data for offline/demo
const FALLBACK_DATA = {
  services: [
    {
      id: 1,
      titre: 'Développement Web',
      categorie: 'informatique',
      description: 'Solutions web modernes et performantes',
      prix: 1500
    },
    {
      id: 2,
      titre: 'Machine Learning',
      categorie: 'data-science',
      description: 'Intelligence artificielle et analyse de données',
      prix: 2500
    }
  ],
  projects: [
    {
      id: 1,
      titre: 'Portail E-Commerce Dakar',
      description: 'Plateforme de vente en ligne',
      categorie: 'Web'
    }
  ],
  testimonials: [
    {
      id: 1,
      nom: 'Aminata Diallo',
      entreprise: 'Dakar Digital Solutions',
      contenu: 'Excellent service!',
      etoiles: 5
    }
  ]
};
