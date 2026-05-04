// Admin Dashboard Page
document.addEventListener('DOMContentLoaded', async () => {
  if (!AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return;
  }

  const user = AdminAuth.getUser();
  document.getElementById('admin-name').textContent = user.prenom || 'Admin';

  // Load stats
  try {
    const stats = await AdminAPI.getStats();
    document.getElementById('stat-messages').textContent = stats.messages;
    document.getElementById('stat-unread').textContent = stats.unreadMessages;
    document.getElementById('stat-services').textContent = stats.services;
    document.getElementById('stat-projects').textContent = stats.projects;
    document.getElementById('stat-articles').textContent = stats.articles;
    document.getElementById('stat-testimonials').textContent = stats.testimonials || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
    Toast.show('Erreur de chargement des statistiques', 'error');
  }

  // Load recent messages
  try {
    const messages = await AdminAPI.getMessages();
    const tbody = document.getElementById('messages-tbody');
    const msgArray = Array.isArray(messages) ? messages : [];
    if (msgArray.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;">Aucun message</td></tr>';
    } else {
      tbody.innerHTML = msgArray.slice(0, 5).map(m => `
        <tr>
          <td>${m.prenom} ${m.nom}</td>
          <td>${m.email}</td>
          <td>${m.objet}</td>
          <td>${new Date(m.createdAt).toLocaleDateString('fr-FR')}</td>
          <td>
            <span style="
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              background: ${m.lu ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 180, 216, 0.2)'};
              color: ${m.lu ? '#4CAF50' : '#00B4D8'};
              font-size: 0.8rem;
            ">${m.statut}</span>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }

  // Auto-refresh stats every 60s
  setInterval(async () => {
    try {
      const stats = await AdminAPI.getStats();
      document.getElementById('stat-messages').textContent = stats.messages;
      document.getElementById('stat-unread').textContent = stats.unreadMessages;
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, 60000);
});
