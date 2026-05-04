// Admin Projects Page
document.addEventListener('DOMContentLoaded', async function() {
  if (!AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return;
  }

  var currentEditId = null;
  var allProjects = [];
  var isLoading = false;

  bindEvents();
  await loadProjects();

  function bindEvents() {
    const addBtn = document.getElementById('add-project-btn');
    const overlay = document.getElementById('project-modal');
    const closeBtn = overlay ? overlay.querySelector('.modal-close') : null;
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('project-form');

    if (addBtn) addBtn.addEventListener('click', () => openModal());
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleSubmit);

    setupTagInput();
  }

  function setupTagInput() {
    const input = document.getElementById('technologies');
    if (!input) return;

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }

  function openModal(project) {
    project = project || null;
    currentEditId = project ? (project.id || project._id) : null;
    const title = document.getElementById('modal-title');
    const form = document.getElementById('project-form');

    if (project) {
      title.textContent = 'Modifier le projet';
      populateForm(project);
    } else {
      title.textContent = 'Nouveau Projet';
      form.reset();
      document.getElementById('project-id').value = '';
      document.getElementById('image-url').value = '';
      document.getElementById('technologies').value = '';
    }
    document.getElementById('project-modal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('project-modal').style.display = 'none';
    currentEditId = null;
    document.getElementById('project-form').reset();
  }

  function populateForm(project) {
    document.getElementById('project-id').value = project.id || project._id || '';
    document.getElementById('titre').value = project.titre || '';
    document.getElementById('categorie').value = project.categorie || '';
    document.getElementById('description').value = project.description || '';
    document.getElementById('descriptionLongue').value = project.contenuComplet || project.descriptionLongue || '';
    document.getElementById('image-url').value = project.imageUrl || '';
    document.getElementById('technologies').value = Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || '');
    document.getElementById('lien-projet').value = project.lien || '';
    document.getElementById('date-projet').value = project.dateProjets ? project.dateProjets.slice(0, 10) : '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    const technologiesStr = document.getElementById('technologies').value.trim();
    const technologies = technologiesStr ? technologiesStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    const data = {
      titre: document.getElementById('titre').value.trim(),
      categorie: document.getElementById('categorie').value,
      description: document.getElementById('description').value.trim(),
      contenuComplet: document.getElementById('descriptionLongue').value.trim(),
      imageUrl: document.getElementById('image-url').value.trim(),
      technologies: technologies,
      client: document.getElementById('lien-projet').value.trim(),
      dateProjets: document.getElementById('date-projet').value,
      lien: document.getElementById('lien-projet').value.trim(),
      publie: true
    };

    if (!data.titre || !data.categorie) {
      Toast.show('Veuillez remplir le titre et la catégorie', 'warning');
      return;
    }

    isLoading = true;
    try {
      if (currentEditId) {
        await AdminAPI.updateProject(currentEditId, data);
        Toast.show('Projet modifié avec succès', 'success');
      } else {
        await AdminAPI.createProject(data);
        Toast.show('Projet créé avec succès', 'success');
      }
      closeModal();
      await loadProjects();
    } catch (error) {
      Toast.show("Erreur lors de l'enregistrement", 'error');
    } finally {
      isLoading = false;
    }
  }

  async function loadProjects() {
    const tbody = document.getElementById('projects-tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chargement...</td></tr>';

    try {
      allProjects = await AdminAPI.getProjects();
      if (!allProjects.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucun projet trouvé</td></tr>';
        return;
      }

      tbody.innerHTML = allProjects.map(p => {
        const pid = p.id || p._id;
        const dateStr = p.dateProjets ? new Date(p.dateProjets).toLocaleDateString('fr-FR') : '-';
        const isPublished = p.publie !== false;
        const techs = Array.isArray(p.technologies) ? p.technologies.slice(0, 3).map(t =>
          `<span style="padding:0.15rem 0.5rem;border-radius:20px;font-size:0.7rem;font-weight:600;background:rgba(0,180,216,0.15);color:var(--admin-primary);margin-right:0.25rem;">${escHtml(t)}</span>`
        ).join('') : '-';
        const imgHtml = p.imageUrl
          ? `<img src="${escAttr(p.imageUrl)}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:6px;border:1px solid var(--admin-glass-border);">`
          : '<div style="width:48px;height:48px;border-radius:6px;background:var(--admin-glass);display:flex;align-items:center;justify-content:center;color:var(--admin-gray-3);font-size:0.7rem;">Aucune</div>';

        return `<tr data-id="${pid}">
          <td>${imgHtml}</td>
          <td style="font-weight:500;">${escHtml(p.titre)}</td>
          <td><span style="padding:0.2rem 0.5rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:rgba(0,180,216,0.15);color:var(--admin-primary);">${escHtml(p.categorie || 'Non classé')}</span></td>
          <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(p.description || '-')}</td>
          <td>${techs}</td>
          <td style="font-size:0.85rem;">${dateStr}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm btn-outline btn-edit-project" data-id="${pid}">Modifier</button>
              <button class="btn btn-sm btn-danger btn-delete-project" data-id="${pid}" data-title="${escAttr(p.titre)}">Supprimer</button>
            </div>
          </td>
        </tr>`;
      }).join('');

      bindRowActions(tbody);
    } catch (error) {
      Toast.show('Erreur de chargement des projets', 'error');
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Erreur de chargement</td></tr>';
    }
  }

  function bindRowActions(tbody) {
    tbody.querySelectorAll('.btn-edit-project').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-id');
        const found = allProjects.find(p => (p.id || p._id) === pid);
        if (found) openModal(found);
      });
    });

    tbody.querySelectorAll('.btn-delete-project').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const confirmed = await confirmAction(`Supprimer le projet "${title}" ?`);
        if (confirmed) {
          try {
            await AdminAPI.deleteProject(id);
            Toast.show('Projet supprimé', 'success');
            await loadProjects();
          } catch (error) {
            Toast.show('Erreur lors de la suppression', 'error');
          }
        }
      });
    });
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
