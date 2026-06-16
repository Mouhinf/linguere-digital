// Admin Services Page
document.addEventListener('DOMContentLoaded', async () => {
  if (!AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return;
  }

  const CATEGORIES = ['informatique', 'data-science', 'marketing', 'formation'];
  let currentEditId = null;
  let allServices = [];
  let isLoading = false;

  bindEvents();
  await loadServices();

  function bindEvents() {
    const addBtn = document.getElementById('add-service-btn');
    const modal = document.getElementById('service-modal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const cancelBtnTop = document.getElementById('cancel-btn');
    const cancelBtnBottom = document.getElementById('cancel-btn-bottom');
    const form = document.getElementById('service-form');

    if (addBtn) addBtn.addEventListener('click', () => openModal());
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtnTop) cancelBtnTop.addEventListener('click', closeModal);
    if (cancelBtnBottom) cancelBtnBottom.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleSubmit);
  }

  function openModal(service) {
    service = service || null;
    currentEditId = service ? (service.id || service._id) : null;
    const title = document.getElementById('modal-title');
    const form = document.getElementById('service-form');

    if (service) {
      title.textContent = 'Modifier le service';
      populateForm(service);
    } else {
      title.textContent = 'Nouveau Service';
      form.reset();
      document.getElementById('service-id').value = '';
      document.getElementById('ordre').value = '0';
    }
    document.getElementById('service-modal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('service-modal').style.display = 'none';
    currentEditId = null;
    document.getElementById('service-form').reset();
  }

  function populateForm(service) {
    document.getElementById('service-id').value = service.id || service._id || '';
    document.getElementById('titre').value = service.titre || '';
    document.getElementById('categorie').value = service.categorie || '';
    document.getElementById('description').value = service.description || '';
    document.getElementById('descriptionLongue').value = service.descriptionLongue || '';
    document.getElementById('icone').value = service.icone || '';
    document.getElementById('prix').value = service.prix != null ? service.prix : '';
    document.getElementById('ordre').value = service.ordre != null ? service.ordre : 0;
    document.getElementById('actif').checked = service.actif !== false;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    const form = e.target;
    const data = {
      titre: form.elements['titre'].value.trim(),
      categorie: form.elements['categorie'].value,
      description: form.elements['description'].value.trim(),
      descriptionLongue: form.elements['descriptionLongue'].value.trim(),
      icone: form.elements['icone'].value.trim(),
      prix: parseFloat(form.elements['prix'].value) || 0,
      ordre: parseInt(form.elements['ordre'].value) || 0,
      actif: form.elements['actif'].checked
    };

    if (!data.titre || !data.categorie) {
      Toast.show('Veuillez remplir le titre et la catégorie', 'warning');
      return;
    }

    isLoading = true;
    try {
      if (currentEditId) {
        await AdminAPI.updateService(currentEditId, data);
        Toast.show('Service modifié avec succès', 'success');
      } else {
        await AdminAPI.createService(data);
        Toast.show('Service créé avec succès', 'success');
      }
      closeModal();
      await loadServices();
    } catch (error) {
      Toast.show("Erreur lors de l'enregistrement", 'error');
    } finally {
      isLoading = false;
    }
  }

  async function loadServices() {
    const tbody = document.getElementById('services-tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chargement...</td></tr>';

    try {
      allServices = await AdminAPI.getServices();
      if (!allServices.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucun service trouvé</td></tr>';
        return;
      }

      tbody.innerHTML = allServices.map(s => {
        const sid = s.id || s._id;
        const catLabel = CATEGORIES.find(c => c.toLowerCase() === (s.categorie || '').toLowerCase()) || s.categorie;
        const isActive = s.actif !== false;

        return `<tr data-id="${sid}">
          <td style="font-weight:500;">${escHtml(s.titre)}</td>
          <td><span style="padding:0.2rem 0.5rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:rgba(0,180,216,0.15);color:var(--admin-primary);">${escHtml(catLabel || s.categorie)}</span></td>
          <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(s.description || '-')}</td>
          <td>${s.prix != null ? Number(s.prix).toLocaleString('fr-FR') + ' FCFA' : '-'}</td>
          <td>${s.ordre || 0}</td>
          <td>
            <button class="toggle-status-btn" data-id="${sid}" data-active="${isActive}"
              style="padding:0.25rem 0.65rem;border-radius:20px;border:none;cursor:pointer;font-size:0.8rem;font-weight:600;transition:0.2s;
              background:${isActive ? 'rgba(76,175,80,0.2)' : 'rgba(255,107,107,0.2)'};
              color:${isActive ? '#4CAF50' : '#FF6B6B'};">
              ${isActive ? 'Actif' : 'Inactif'}
            </button>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm btn-outline btn-edit-service" data-id="${sid}">Modifier</button>
              <button class="btn btn-sm btn-danger btn-delete-service" data-id="${sid}" data-title="${escAttr(s.titre)}">Supprimer</button>
            </div>
          </td>
        </tr>`;
      }).join('');

      bindRowActions(tbody);
    } catch (error) {
      Toast.show('Erreur de chargement des services', 'error');
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Erreur de chargement</td></tr>';
    }
  }

  function bindRowActions(tbody) {
    console.log('Binding row actions, buttons found:', tbody.querySelectorAll('.btn-edit-service').length);
    tbody.querySelectorAll('.btn-edit-service').forEach(btn => {
      console.log('Adding click listener to button', btn.getAttribute('data-id'));
      btn.addEventListener('click', (e) => {
        console.log('Edit button clicked', e);
        const sid = btn.getAttribute('data-id');
        console.log('Service ID:', sid, 'allServices:', allServices);
        const found = allServices.find(s => (s.id || s._id) == sid);
        console.log('Found service:', found);
        if (found) openModal(found);
      });
    });

    tbody.querySelectorAll('.btn-delete-service').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const confirmed = await confirmAction(`Supprimer le service "${title}" ?`);
        if (confirmed) {
          try {
            await AdminAPI.deleteService(id);
            Toast.show('Service supprimé', 'success');
            await loadServices();
          } catch (error) {
            Toast.show('Erreur lors de la suppression', 'error');
          }
        }
      });
    });

    tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const isActive = btn.getAttribute('data-active') === 'true';
        try {
          await AdminAPI.updateService(id, { actif: !isActive });
          Toast.show(`Service ${!isActive ? 'activé' : 'désactivé'}`, 'success');
          await loadServices();
        } catch (error) {
          Toast.show('Erreur lors du changement de statut', 'error');
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
