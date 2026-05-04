// Admin Messages Page
document.addEventListener('DOMContentLoaded', async () => {
  if (!AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return;
  }

  let allMessages = [];
  let currentFilter = 'all';

  bindEvents();
  await loadMessages();

  function bindEvents() {
    const exportBtn = document.getElementById('export-csv-btn');
    const overlay = document.getElementById('slide-overlay-message');
    const closeBtn = document.getElementById('slide-panel-message-close');
    const closePanelBtn = document.getElementById('close-panel-btn');

    if (exportBtn) exportBtn.addEventListener('click', exportCSV);
    if (overlay) overlay.addEventListener('click', closeDetailPanel);
    if (closeBtn) closeBtn.addEventListener('click', closeDetailPanel);
    if (closePanelBtn) closePanelBtn.addEventListener('click', closeDetailPanel);

    document.querySelectorAll('#status-filter .view-toggle-btn').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#status-filter .view-toggle-btn').forEach(p => {
          p.classList.remove('active');
        });
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter');
        renderTable();
      });
    });
  }

  async function loadMessages() {
    const tbody = document.getElementById('messages-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Chargement...</td></tr>';

    try {
      allMessages = await AdminAPI.getMessages();
      renderTable();
      updateUnreadBadge();
    } catch (error) {
      Toast.show('Erreur de chargement des messages', 'error');
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Erreur de chargement</td></tr>';
    }
  }

  function getFilteredMessages() {
    switch (currentFilter) {
      case 'unread':
        return allMessages.filter(m => !m.lu && (!m.statut || m.statut.toLowerCase() === 'non lu'));
      case 'read':
        return allMessages.filter(m => m.lu || (m.statut && m.statut.toLowerCase() === 'lu'));
      default:
        return allMessages;
    }
  }

  function updateUnreadBadge() {
    const badge = document.getElementById('unread-badge');
    if (!badge) return;
    const unread = allMessages.filter(m => !m.lu && (!m.statut || m.statut.toLowerCase() === 'non lu')).length;
    badge.textContent = `${unread} non lu${unread > 1 ? 's' : ''}`;
    badge.style.display = unread > 0 ? '' : 'none';
  }

  function renderTable() {
    const tbody = document.getElementById('messages-tbody');
    const filtered = getFilteredMessages();

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Aucun message trouvé</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(m => {
      const mid = m.id || m._id;
      const isRead = m.lu || (m.statut && m.statut.toLowerCase() === 'lu');
      const dateStr = m.createdAt
        ? new Date(m.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '-';
      const sender = ((m.prenom || '') + ' ' + (m.nom || '')).trim() || 'Anonyme';

      return `<tr class="msg-row ${!isRead ? 'msg-unread' : ''}" data-id="${mid}"
                style="${!isRead ? 'font-weight:600;' : ''}cursor:pointer;">
        <td>${escHtml(sender)}</td>
        <td>${escHtml(m.email || '-')}</td>
        <td>${escHtml(m.objet || '-')}</td>
        <td style="font-size:0.85rem;">${dateStr}</td>
        <td>
          <span style="padding:0.25rem 0.55rem;border-radius:20px;font-size:0.8rem;font-weight:600;
            background:${isRead ? 'rgba(76,175,80,0.2)' : 'rgba(0,180,216,0.2)'};
            color:${isRead ? '#4CAF50' : '#00B4D8'};">
            ${isRead ? 'Lu' : 'Non lu'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-danger btn-delete-msg" data-id="${mid}" data-sender="${escAttr(sender)}">
              Supprimer
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('.msg-row').forEach(row => {
      row.addEventListener('click', () => {
        const mid = row.getAttribute('data-id');
        const message = allMessages.find(m => (m.id || m._id) === mid);
        if (message) openDetailPanel(message);
      });
    });

    tbody.querySelectorAll('.btn-delete-msg').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const senderName = btn.getAttribute('data-sender');
        const confirmed = await confirmAction(`Supprimer le message de "${senderName}" ?`);
        if (confirmed) {
          try {
            await AdminAPI.deleteMessage(id);
            Toast.show('Message supprimé', 'success');
            await loadMessages();
          } catch (error) {
            Toast.show('Erreur lors de la suppression', 'error');
          }
        }
      });
    });
  }

  async function openDetailPanel(message) {
    const panel = document.getElementById('slide-panel-message');
    const overlay = document.getElementById('slide-overlay-message');
    const content = document.getElementById('slide-panel-message-content');
    const mid = message.id || message._id;
    const isRead = message.lu || (message.statut && message.statut.toLowerCase() === 'lu');
    const sender = ((message.prenom || '') + ' ' + (message.nom || '')).trim() || 'Anonyme';
    const dateStr = message.createdAt ? new Date(message.createdAt).toLocaleString('fr-FR') : '-';

    content.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--admin-primary);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.1rem;">
            ${escHtml(sender.charAt(0).toUpperCase())}
          </div>
          <div>
            <div style="font-weight:600;color:var(--admin-gray-1);">${escHtml(sender)}</div>
            <div style="font-size:0.8rem;color:var(--admin-gray-3);">${escHtml(message.email || '-')}</div>
          </div>
        </div>
      </div>
      <div style="margin-bottom:1rem;">
        <div style="font-size:0.75rem;color:var(--admin-gray-3);margin-bottom:0.3rem;text-transform:uppercase;letter-spacing:0.5px;">Objet</div>
        <div style="font-weight:600;color:var(--admin-primary);">${escHtml(message.objet || 'Sans objet')}</div>
      </div>
      <div style="margin-bottom:1rem;">
        <div style="font-size:0.75rem;color:var(--admin-gray-3);margin-bottom:0.3rem;text-transform:uppercase;letter-spacing:0.5px;">Date</div>
        <div style="color:var(--admin-gray-2);">${dateStr}</div>
      </div>
      <div style="margin-bottom:1rem;">
        <div style="font-size:0.75rem;color:var(--admin-gray-3);margin-bottom:0.3rem;text-transform:uppercase;letter-spacing:0.5px;">Message</div>
        <div style="background:var(--admin-surface);padding:1rem;border-radius:8px;color:var(--admin-gray-1);white-space:pre-wrap;line-height:1.6;border:1px solid var(--admin-glass-border);">
          ${escHtml(message.message || message.contenu || '')}
        </div>
      </div>
    `;

    overlay.classList.add('visible');
    panel.classList.add('open');

    if (!isRead) {
      try {
        await AdminAPI.markMessageAsRead(mid);
        const msg = allMessages.find(m => (m.id || m._id) === mid);
        if (msg) { msg.lu = true; msg.statut = 'Lu'; }
        updateUnreadBadge();
        renderTable();
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  }

  function closeDetailPanel() {
    document.getElementById('slide-overlay-message').classList.remove('visible');
    document.getElementById('slide-panel-message').classList.remove('open');
  }

  function exportCSV() {
    const filtered = getFilteredMessages();
    if (!filtered.length) {
      Toast.show('Aucun message à exporter', 'warning');
      return;
    }

    const headers = ['Nom', 'Email', 'Objet', 'Message', 'Date', 'Statut'];
    const csvRows = [headers.map(h => `"${h}"`).join(',')];

    filtered.forEach(m => {
      const sender = ((m.prenom || '') + ' ' + (m.nom || '')).trim();
      const isRead = m.lu || (m.statut && m.statut.toLowerCase() === 'lu');
      const dateStr = m.createdAt ? new Date(m.createdAt).toISOString() : '';
      const msg = (m.message || m.contenu || '').replace(/"/g, '""');
      csvRows.push([
        `"${sender.replace(/"/g, '""')}"`,
        `"${(m.email || '').replace(/"/g, '""')}"`,
        `"${(m.objet || '').replace(/"/g, '""')}"`,
        `"${msg}"`,
        `"${dateStr}"`,
        `"${isRead ? 'Lu' : 'Non lu'}"`
      ].join(','));
    });

    const bom = '\uFEFF';
    const csvContent = bom + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `messages_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    Toast.show('Export CSV terminé', 'success');
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
