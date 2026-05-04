// Admin Blog Page
document.addEventListener('DOMContentLoaded', async () => {
  if (!AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return;
  }

  let allPosts = [];

  bindEvents();
  await loadBlogPosts();

  function bindEvents() {
    // Events are handled via inline onclick in the table rows
  }

  async function loadBlogPosts() {
    const tbody = document.getElementById('blog-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chargement...</td></tr>';

    try {
      allPosts = await AdminAPI.getBlogPosts();
      if (!allPosts.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucun article trouvé</td></tr>';
        return;
      }

      tbody.innerHTML = allPosts.map(p => {
        const postId = p.id || p._id;
        const dateStr = p.createdAt || p.date || '';
        const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
        const isPublished = p.publie !== false;

        return `
          <tr data-id="${postId}">
            <td style="font-weight:500;">
              <a href="/admin/blog-edit.html?id=${postId}" style="color:var(--admin-primary);text-decoration:none;" title="${escapeAttr(p.titre)}">
                ${escapeHtml(truncate(p.titre, 50))}
              </a>
            </td>
            <td><span style="padding:0.2rem 0.5rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:rgba(0,180,216,0.15);color:var(--admin-primary);">${escapeHtml(p.categorie || 'Non classé')}</span></td>
            <td>${escapeHtml(p.auteur || '-')}</td>
            <td>
              <button class="toggle-publish-btn" data-id="${postId}" data-published="${isPublished}"
                style="padding:0.25rem 0.65rem;border-radius:20px;border:none;cursor:pointer;font-size:0.8rem;font-weight:600;transition:0.2s;
                background:${isPublished ? 'rgba(76,175,80,0.2)' : 'rgba(255,107,107,0.2)'};
                color:${isPublished ? '#4CAF50' : '#FF6B6B'};">
                ${isPublished ? 'Publié' : 'Brouillon'}
              </button>
            </td>
            <td style="font-size:0.85rem;">${formattedDate}</td>
            <td>${p.vues || 0}</td>
            <td>
              <div class="table-actions">
                <a href="/admin/blog-edit.html?id=${postId}" class="btn btn-sm btn-outline">Modifier</a>
                <button class="btn btn-sm btn-danger btn-delete-post" data-id="${postId}" data-title="${escapeAttr(p.titre)}">Supprimer</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      bindRowActions(tbody);
    } catch (error) {
      Toast.show('Erreur de chargement des articles', 'error');
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Erreur de chargement</td></tr>';
    }
  }

  function bindRowActions(tbody) {
    tbody.querySelectorAll('.toggle-publish-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const isPublished = btn.getAttribute('data-published') === 'true';
        try {
          await AdminAPI.updateBlogPost(id, { publie: !isPublished });
          Toast.show(`Article ${!isPublished ? 'publié' : 'dépublié'}`, 'success');
          await loadBlogPosts();
        } catch (error) {
          Toast.show('Erreur lors du changement de statut', 'error');
        }
      });
    });

    tbody.querySelectorAll('.btn-delete-post').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const confirmed = await confirmAction(`Supprimer l'article "${title}" ?`);
        if (confirmed) {
          try {
            await AdminAPI.deleteBlogPost(id);
            Toast.show('Article supprimé', 'success');
            await loadBlogPosts();
          } catch (error) {
            Toast.show('Erreur lors de la suppression', 'error');
          }
        }
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function truncate(str, max) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '...' : str;
  }
});
