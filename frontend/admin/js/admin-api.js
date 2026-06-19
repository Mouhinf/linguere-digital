// Admin API Module
const ADMIN_API_BASE = window.LINGUERE_API_URL
  ? `${window.LINGUERE_API_URL.replace('/api', '')}/api/admin`
  : (window.location.hostname === 'localhost' ? 'http://localhost:3001/api/admin' : '/api/admin');

class AdminAPI {
  static async request(endpoint, options = {}) {
    const url = `${ADMIN_API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/admin/login.html';
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  // Stats
  static getStats() {
    return this.request('/stats');
  }

  // Services
  static getServices() {
    return this.request('/services');
  }

  static createService(data) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateService(id, data) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteService(id) {
    return this.request(`/services/${id}`, { method: 'DELETE' });
  }

  // Projects
  static getProjects() {
    return this.request('/projects');
  }

  static createProject(data) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateProject(id, data) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteProject(id) {
    return this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  // Blog
  static getBlogPosts() {
    return this.request('/blog');
  }

  static createBlogPost(data) {
    return this.request('/blog', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateBlogPost(id, data) {
    return this.request(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteBlogPost(id) {
    return this.request(`/blog/${id}`, { method: 'DELETE' });
  }

  // Testimonials
  static getTestimonials() {
    return this.request('/testimonials');
  }

  static createTestimonial(data) {
    return this.request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static updateTestimonial(id, data) {
    return this.request(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static deleteTestimonial(id) {
    return this.request(`/testimonials/${id}`, { method: 'DELETE' });
  }

  // Messages
  static getMessages(status) {
    return this.request(`/messages${status ? '?status=' + status : ''}`);
  }

  static markMessageAsRead(id) {
    return this.request(`/messages/${id}/read`, { method: 'PATCH' });
  }

  static updateMessageStatus(id, statut) {
    return this.request(`/messages/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ statut })
    });
  }

  static deleteMessage(id) {
    return this.request(`/messages/${id}`, { method: 'DELETE' });
  }

  // Settings
  static getSettings(category) {
    return this.request(`/settings/${category}`);
  }

  static updateSettings(category, data) {
    return this.request(`/settings/${category}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Profile
  static updateProfile(data) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Cache
  static clearCache() {
    return this.request('/cache/clear', { method: 'POST' });
  }
}
