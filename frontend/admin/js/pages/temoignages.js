// Admin Testimonials Page
document.addEventListener('DOMContentLoaded', async () => {
  if (!AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return;
  }

  let currentEditId = null;
  let allTestimonials = [];
  let isLoading = false;

  bindEvents();
  await loadTestimonials();

  function bindEvents() {
    const addBtn = document.getElementById('add-testimonial-btn');
    const overlay = document.getElementById('slide-overlay-testimonial');
    const closeBtn = document.getElementById('slide-panel-testimonial-close');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('testimonial-form');

    if (addBtn) addBtn.addEventListener('click', () => openPanel());
    if (overlay) overlay.addEventListener('click', closePanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (cancelBtn) cancelBtn.addEventListener('click', closePanel);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    if (form) form.addEventListener('submit', handleSubmit);

    setupStarRating();
  }

  function setupStarRating() {
    const container = document.getElementById('star-rating');
    if (!container) return;
    const stars = container.querySelectorAll('.star');

    function updateStars(rating) {
      stars.forEach(star => {
        const val = parseInt(star.getAttribute('for').replace('star-', ''));
        star.classList.toggle('active', val <= rating);
      });
    }

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('for').replace('star-', ''));
        const radio = document.getElementById('star-' + val);
        if (radio) radio.checked = true;
        updateStars(val);
      });
    });

    updateStars(3);
  }

  function getSelectedRating() {
    const checked = document.querySelector('#star-rating input[type="radio"]:checked');
    return checked ? parseInt(checked.value) : 3;
  }

  function setRating(value) {
    const radio = document.getElementById('star-' + value);
    if (radio) radio.checked = true;
    const container = document.getElementById('star-rating');
    if (container) {
      container.querySelectorAll('.star').forEach(star => {
        const val = parseInt(star.getAttribute('for').replace('star-', ''));
        star.classList.toggle('active', val <= value);
      });
    }
  }

  function openPanel(testimonial) {
    testimonial = testimonial || null;
    currentEditId = testimonial ? (testimonial.id || testimonial._id) : null;
    const title = document.getElementById('slide-panel-testimonial-title');
    const btnSubmit = document.getElementById('submit-btn');
    const form = document.getElementById('testimonial-form');

    if (testimonial) {
      title.textContent = 'Modifier le témoignage';
      btnSubmit.textContent = 'Modifier';
      populateForm(testimonial);
    } else {
      title.textContent = 'Ajouter un témoignage';
      btnSubmit.textContent = 'Enregistrer';
      form.reset();
      setRating(5);
    }
    document.getElementById('slide-overlay-testimonial').classList.add('visible');
    document.getElementById('slide-panel-testimonial').classList.add('open');
  }

  function closePanel() {
    document.getElementById('slide-overlay-testimonial').classList.remove('visible');
    document.getElementById('slide-panel-testimonial').classList.remove('open');
    currentEditId = null;
    document.getElementById('testimonial-form').reset();
  }

  function populateForm(testimonial) {
    document.getElementById('nom').value = testimonial.nom || '';
    document.getElementById('entreprise').value = testimonial.entreprise || '';
    document.getElementById('position').value = testimonial.position || '';
    document.getElementById('contenu').value = testimonial.contenu || '';
    document.getElementById('photo').value = testimonial.photo || '';
    document.getElementById('ordre').value = testimonial.ordre != null ? testimonial.ordre : 0;
    document.getElementById('approuve').checked = testimonial.approuve !== false;
    setRating(testimonial.etoiles || 5);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    const data = {
      nom: document.getElementById('nom').value.trim(),
      entreprise: document.getElementById('entreprise').value.trim(),
      position: document.getElementById('position').value.trim(),
      contenu: document.getElementById('contenu').value.trim(),
      photo: document.getElementById('photo').value.trim(),
      etoiles: getSelectedRating(),
      approuve: document.getElementById('approuve').checked,
      ordre: parseInt(document.getElementById('ordre').value) || 0
    };

    if (!data.nom || !data.contenu) {
      Toast.show('Veuillez remplir le nom et le contenu', 'warning');
      return;
    }

    isLoading = true;
    try {
      if (currentEditId) {
        await AdminAPI.updateTestimonial(currentEditId, data);
        Toast.show('Témoignage modifié avec succès', 'success');
      } else {
        await AdminAPI.createTestimonial(data);
        Toast.show('Témoignage créé avec succès', 'success');
      }
      closePanel();
      await loadTestimonials();
    } catch (error) {
      Toast.show("Erreur lors de l'enregistrement", 'error');
    } finally {
      isLoading = false;
    }
  }

  async function loadTestimonials() {
    const tbody = document.getElementById('testimonials-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Chargement...</td></tr>';

    try {
      allTestimonials = await AdminAPI.getTestimonials();
      if (!allTestimonials.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Aucun témoignage trouvé</td></tr>';
        return;
      }

      tbody.innerHTML = allTestimonials.map(t => {
        const tid = t.id || t._id;
        const isApproved = t.approuve !== false;
        const starCount = parseInt(t.etoiles) || 5;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
          starsHtml += `<span style="color:${i < starCount ? '#FFC107' : '#555'};">&#9733;</span>`;
        }
        return `<tr data-id="${tid}">
          <td style="font-weight:500;">${escHtml(t.nom)}</td>
          <td>${escHtml(t.entreprise || '-')}</td>
          <td>${starsHtml}</td>
          <td>
            <button class="toggle-approve-btn" data-id="${tid}" data-approved="${isApproved}"
              style="padding:0.25rem 0.65rem;border-radius:20px;border:none;cursor:pointer;font-size:0.8rem;font-weight:600;transition:0.2s;
              background:${isApproved ? 'rgba(76,175,80,0.2)' : 'rgba(255,107,107,0.2)'};
              color:${isApproved ? '#4CAF50' : '#FF6B6B'};">
              ${isApproved ? 'Approuvé' : 'En attente'}
            </button>
          </td>
          <td>${t.ordre || 0}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm btn-outline btn-edit-testimonial" data-id="${tid}">Modifier</button>
              <button class="btn btn-sm btn-danger btn-delete-testimonial" data-id="${tid}" data-title="${escAttr(t.nom)}">Supprimer</button>
            </div>
          </td>
        </tr>`;
      }).join('');

      bindRowActions(tbody);
    } catch (error) {
      Toast.show('Erreur de chargement des témoignages', 'error');
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Erreur de chargement</td></tr>';
    }
  }

  function bindRowActions(tbody) {
    tbody.querySelectorAll('.btn-edit-testimonial').forEach(btn => {
      btn.addEventListener('click', () => {
        const tid = btn.getAttribute('data-id');
        const found = allTestimonials.find(t => (t.id || t._id) === tid);
        if (found) openPanel(found);
      });
    });

    tbody.querySelectorAll('.btn-delete-testimonial').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const confirmed = await confirmAction(`Supprimer le témoignage de "${title}" ?`);
        if (confirmed) {
          try {
            await AdminAPI.deleteTestimonial(id);
            Toast.show('Témoignage supprimé', 'success');
            await loadTestimonials();
          } catch (error) {
            Toast.show('Erreur lors de la suppression', 'error');
          }
        }
      });
    });

    tbody.querySelectorAll('.toggle-approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const isApproved = btn.getAttribute('data-approved') === 'true';
        try {
          await AdminAPI.updateTestimonial(id, { approuve: !isApproved });
          Toast.show(`Témoignage ${!isApproved ? 'approuvé' : 'désapprouvé'}`, 'success');
          await loadTestimonials();
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
