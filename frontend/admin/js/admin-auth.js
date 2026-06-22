// Admin Auth Module
class AdminAuth {
  static getToken() {
    return localStorage.getItem('auth_token');
  }

  static getUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/admin/login.html';
      return false;
    }
    return true;
  }

  static logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login.html';
  }

  static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    };
  }
}

// Auto-check auth on admin pages
document.addEventListener('DOMContentLoaded', () => {
  const isLoginPage = window.location.pathname.includes('login.html');
  if (!isLoginPage && !AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
  }
});
