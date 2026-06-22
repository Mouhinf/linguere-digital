// API URL Configuration
// Auto-detects current domain in production, falls back to localhost in dev

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.LINGUERE_API_URL = 'http://localhost:3001/api';
} else {
  window.LINGUERE_API_URL = window.location.origin + '/api';
}
