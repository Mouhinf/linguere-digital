// Admin Settings Page
document.addEventListener('DOMContentLoaded', async () => {
  if (!AdminAuth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return;
  }

  let activeTab = 'profil';
  let isLoading = false;
  let settingsData = {};

  bindEvents();
  await initTabContent('profil');

  function bindEvents() {
    document.querySelectorAll('#settings-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === activeTab) return;
        switchTab(tab);
      });
    });
  }

  function switchTab(tabKey) {
    // Update tab buttons
    document.querySelectorAll('#settings-tabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    });
    activeTab = tabKey;
    initTabContent(tabKey);
  }

  async function initTabContent(tab) {
    const container = document.getElementById('tab-content-area');
    container.innerHTML = '<div class="text-center text-muted" style="padding:2rem;">Chargement...</div>';

    switch (tab) {
      case 'profil': await renderProfilTab(container); break;
      case 'entreprise': await renderEntrepriseTab(container); break;
      case 'reseaux': await renderReseauxTab(container); break;
      case 'seo': await renderSEOTab(container); break;
      case 'systeme': await renderSystemeTab(container); break;
    }
  }

  async function renderProfilTab(container) {
    const user = AdminAuth.getUser();
    container.innerHTML = `
      <h3 class="admin-card-header" style="margin:-1.5rem -1.5rem 1.25rem;padding:0 0 0.75rem;border-bottom:1px solid var(--admin-glass-border);">
        Informations du profil
      </h3>
      <form id="form-settings-profil" style="display:flex;flex-direction:column;gap:1rem;max-width:500px;">
        <div class="form-group">
          <label for="profil-nom" class="form-label">Nom</label>
          <input type="text" id="profil-nom" class="form-control" name="nom" value="${escapeAttr(user.nom || '')}">
        </div>
        <div class="form-group">
          <label for="profil-prenom" class="form-label">Prénom</label>
          <input type="text" id="profil-prenom" class="form-control" name="prenom" value="${escapeAttr(user.prenom || '')}">
        </div>
        <div class="form-group">
          <label for="profil-email" class="form-label">Email</label>
          <input type="email" id="profil-email" class="form-control" name="email" value="${escapeAttr(user.email || '')}">
        </div>
        <div class="form-group">
          <label for="profil-password" class="form-label">Nouveau mot de passe</label>
          <input type="password" id="profil-password" class="form-control" name="password" placeholder="Laisser vide pour ne pas changer">
        </div>
        <div class="form-group">
          <label for="profil-password-confirm" class="form-label">Confirmer le mot de passe</label>
          <input type="password" id="profil-password-confirm" class="form-control" name="password_confirmation">
        </div>
        <button type="submit" class="btn btn-primary" style="align-self:flex-start;">Enregistrer</button>
      </form>
    `;

    container.querySelector('#form-settings-profil').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isLoading) return;
      const form = e.target;
      const password = form.elements['password'].value;
      if (password && password !== form.elements['password_confirmation'].value) {
        Toast.show('Les mots de passe ne correspondent pas', 'warning');
        return;
      }
      isLoading = true;
      try {
        await AdminAPI.updateProfile({
          nom: form.elements['nom'].value,
          prenom: form.elements['prenom'].value,
          email: form.elements['email'].value,
          ...(password && { password }),
          password_confirmation: password || undefined,
        });
        Toast.show('Profil mis à jour avec succès', 'success');
      } catch (error) {
        Toast.show('Erreur lors de la mise à jour du profil', 'error');
      } finally {
        isLoading = false;
      }
    });
  }

  async function renderEntrepriseTab(container) {
    let data = settingsData.entreprise || {};
    if (!Object.keys(data).length) {
      try {
        data = await AdminAPI.getSettings('entreprise');
        settingsData.entreprise = data;
      } catch (error) {
        data = {};
      }
    }

    container.innerHTML = `
      <h3 class="admin-card-header" style="margin:-1.5rem -1.5rem 1.25rem;padding:0 0 0.75rem;border-bottom:1px solid var(--admin-glass-border);">
        Informations de l'entreprise
      </h3>
      <form id="form-settings-entreprise" style="display:flex;flex-direction:column;gap:1rem;max-width:600px;">
        <div class="form-group">
          <label for="ent-nom" class="form-label">Nom de l'entreprise</label>
          <input type="text" id="ent-nom" class="form-control" name="nom" value="${escapeAttr(data.nom || '')}">
        </div>
        <div class="form-group">
          <label for="ent-adresse" class="form-label">Adresse</label>
          <input type="text" id="ent-adresse" class="form-control" name="adresse" value="${escapeAttr(data.adresse || '')}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="ent-telephone" class="form-label">Téléphone</label>
            <input type="tel" id="ent-telephone" class="form-control" name="telephone" value="${escapeAttr(data.telephone || '')}">
          </div>
          <div class="form-group">
            <label for="ent-email" class="form-label">Email</label>
            <input type="email" id="ent-email" class="form-control" name="email" value="${escapeAttr(data.email || '')}">
          </div>
        </div>
        <div class="form-group">
          <label for="ent-horaires" class="form-label">Horaires</label>
          <input type="text" id="ent-horaires" class="form-control" name="horaires" value="${escapeAttr(data.horaires || '')}" placeholder="Ex: Lun-Ven 8h-18h">
        </div>
        <div class="form-group">
          <label for="ent-description" class="form-label">Description</label>
          <textarea id="ent-description" class="form-control" name="description" rows="3">${escapeHtml(data.description || '')}</textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="align-self:flex-start;">Enregistrer</button>
      </form>
    `;

    container.querySelector('#form-settings-entreprise').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isLoading) return;
      const form = e.target;
      const dataToSave = {
        nom: form.elements['nom'].value,
        adresse: form.elements['adresse'].value,
        telephone: form.elements['telephone'].value,
        email: form.elements['email'].value,
        horaires: form.elements['horaires'].value,
        description: form.elements['description'].value,
      };
      isLoading = true;
      try {
        const result = await AdminAPI.updateSettings('entreprise', dataToSave);
        settingsData.entreprise = result;
        Toast.show('Paramètres entreprise enregistrés', 'success');
      } catch (error) {
        Toast.show('Erreur lors de l\'enregistrement', 'error');
      } finally {
        isLoading = false;
      }
    });
  }

  async function renderReseauxTab(container) {
    let data = settingsData.reseaux || {};
    if (!Object.keys(data).length) {
      try {
        data = await AdminAPI.getSettings('reseaux');
        settingsData.reseaux = data;
      } catch (error) {
        data = {};
      }
    }

    const fields = [
      { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
      { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
      { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
      { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
      { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
      { key: 'whatsapp', label: 'WhatsApp', placeholder: '+221...' },
    ];

    container.innerHTML = `
      <h3 class="admin-card-header" style="margin:-1.5rem -1.5rem 1.25rem;padding:0 0 0.75rem;border-bottom:1px solid var(--admin-glass-border);">
        Réseaux sociaux
      </h3>
      <form id="form-settings-reseaux" style="display:flex;flex-direction:column;gap:1rem;max-width:500px;">
        ${fields.map(f => `
          <div class="form-group">
            <label for="social-${f.key}" class="form-label">${f.label}</label>
            <input type="url" id="social-${f.key}" class="form-control" name="${f.key}" placeholder="${f.placeholder}" value="${escapeAttr(data[f.key] || '')}">
          </div>
        `).join('')}
        <button type="submit" class="btn btn-primary" style="align-self:flex-start;">Enregistrer</button>
      </form>
    `;

    container.querySelector('#form-settings-reseaux').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isLoading) return;
      const form = e.target;
      const dataToSave = {};
      fields.forEach(f => { dataToSave[f.key] = form.elements[f.key].value; });
      isLoading = true;
      try {
        const result = await AdminAPI.updateSettings('reseaux', dataToSave);
        settingsData.reseaux = result;
        Toast.show('Réseaux sociaux enregistrés', 'success');
      } catch (error) {
        Toast.show('Erreur lors de l\'enregistrement', 'error');
      } finally {
        isLoading = false;
      }
    });
  }

  async function renderSEOTab(container) {
    let data = settingsData.seo || {};
    if (!Object.keys(data).length) {
      try {
        data = await AdminAPI.getSettings('seo');
        settingsData.seo = data;
      } catch (error) {
        data = {};
      }
    }

    container.innerHTML = `
      <h3 class="admin-card-header" style="margin:-1.5rem -1.5rem 1.25rem;padding:0 0 0.75rem;border-bottom:1px solid var(--admin-glass-border);">
        Paramètres SEO
      </h3>
      <form id="form-settings-seo" style="display:flex;flex-direction:column;gap:1rem;max-width:600px;">
        <div class="form-group">
          <label for="seo-metaTitle" class="form-label">Meta titre (max 70 caractères)</label>
          <input type="text" id="seo-metaTitle" class="form-control" name="metaTitle" maxlength="70" value="${escapeAttr(data.metaTitle || '')}" oninput="updateSeoPreview()">
          <div class="form-hint"><span id="metaTitle-count">${(data.metaTitle || '').length}</span>/70</div>
        </div>
        <div class="form-group">
          <label for="seo-metaDescription" class="form-label">Meta description (max 160 caractères)</label>
          <textarea id="seo-metaDescription" class="form-control" name="metaDescription" maxlength="160" rows="2" oninput="updateSeoPreview()">${escapeHtml(data.metaDescription || '')}</textarea>
          <div class="form-hint"><span id="metaDesc-count">${(data.metaDescription || '').length}</span>/160</div>
        </div>
        <div class="form-group">
          <label for="seo-gaId" class="form-label">Google Analytics ID</label>
          <input type="text" id="seo-gaId" class="form-control" name="gaId" placeholder="UA-XXXXXXXXX-X ou G-XXXXXXXXXX" value="${escapeAttr(data.gaId || '')}">
        </div>
        <div class="form-group">
          <label for="seo-fbPixelId" class="form-label">Facebook Pixel ID</label>
          <input type="text" id="seo-fbPixelId" class="form-control" name="fbPixelId" placeholder="XXXXXXXXXXXXXXXXXX" value="${escapeAttr(data.fbPixelId || '')}">
        </div>

        <div style="margin-top:1rem;padding:1rem;border-radius:var(--admin-radius);background:var(--admin-surface);border:1px solid var(--admin-glass-border);">
          <div style="font-size:0.7rem;color:var(--admin-gray-3);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.5px;">Aperçu Google</div>
          <div id="seo-preview-title" style="color:#8ab4f8;font-size:1.1rem;line-height:1.3;margin-bottom:0.2rem;cursor:pointer;">${escapeHtml(data.metaTitle || 'Linguère Digital')}</div>
          <div id="seo-preview-url" style="color:var(--admin-success);font-size:0.8rem;margin-bottom:0.2rem;">lingueredigital.com</div>
          <div id="seo-preview-desc" style="color:var(--admin-gray-3);font-size:0.85rem;line-height:1.4;">${escapeHtml(data.metaDescription || 'Agence digitale à Dakar - Services web, mobile et IA')}</div>
        </div>

        <button type="submit" class="btn btn-primary" style="align-self:flex-start;margin-top:0.5rem;">Enregistrer</button>
      </form>
    `;

    container.querySelector('#form-settings-seo').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isLoading) return;
      const form = e.target;
      const dataToSave = {
        metaTitle: form.elements['metaTitle'].value,
        metaDescription: form.elements['metaDescription'].value,
        gaId: form.elements['gaId'].value,
        fbPixelId: form.elements['fbPixelId'].value,
      };
      isLoading = true;
      try {
        const result = await AdminAPI.updateSettings('seo', dataToSave);
        settingsData.seo = result;
        Toast.show('Paramètres SEO enregistrés', 'success');
      } catch (error) {
        Toast.show('Erreur lors de l\'enregistrement', 'error');
      } finally {
        isLoading = false;
      }
    });

    // Live SEO preview
    const metaTitleInput = container.querySelector('#seo-metaTitle');
    const metaDescInput = container.querySelector('#seo-metaDescription');
    if (metaTitleInput) {
      metaTitleInput.addEventListener('input', () => {
        const count = container.querySelector('#metaTitle-count');
        if (count) count.textContent = metaTitleInput.value.length;
      });
    }
    if (metaDescInput) {
      metaDescInput.addEventListener('input', () => {
        const count = container.querySelector('#metaDesc-count');
        if (count) count.textContent = metaDescInput.value.length;
      });
    }
  }

  async function renderSystemeTab(container) {
    container.innerHTML = `
      <h3 class="admin-card-header" style="margin:-1.5rem -1.5rem 1.25rem;padding:0 0 0.75rem;border-bottom:1px solid var(--admin-glass-border);">
        Paramètres système
      </h3>
      <div style="display:flex;flex-direction:column;gap:1.25rem;max-width:500px;">
        <div class="form-group flex-between">
          <div>
            <label class="form-label" style="margin-bottom:0.25rem;">Mode maintenance</label>
            <p class="form-hint" style="margin-top:0;">Afficher une page de maintenance aux visiteurs</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="maintenance-mode">
            <span class="toggle-track"></span>
            <span class="toggle-label">Activer</span>
          </label>
        </div>
        <div class="form-group flex-between">
          <div>
            <label class="form-label" style="margin-bottom:0.25rem;">Mode débogage</label>
            <p class="form-hint" style="margin-top:0;">Afficher les erreurs détaillées</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="debug-mode">
            <span class="toggle-track"></span>
            <span class="toggle-label">Activer</span>
          </label>
        </div>
        <div class="form-group flex-between">
          <div>
            <label class="form-label" style="margin-bottom:0.25rem;">Notifications par email</label>
            <p class="form-hint" style="margin-top:0;">Recevoir un email à chaque nouveau message</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="email-notif" checked>
            <span class="toggle-track"></span>
            <span class="toggle-label">Activer</span>
          </label>
        </div>
        <hr style="border:none;border-top:1px solid var(--admin-glass-border);margin:0.5rem 0;">
        <div style="display:flex;gap:0.75rem;">
          <button class="btn btn-primary" id="save-system-btn">Enregistrer</button>
          <button class="btn btn-outline" id="clear-cache-btn">Vider le cache</button>
        </div>
      </div>
    `;

    container.querySelector('#save-system-btn').addEventListener('click', async () => {
      if (isLoading) return;
      isLoading = true;
      try {
        await AdminAPI.updateSettings('systeme', {
          maintenance: container.querySelector('#maintenance-mode').checked,
          debug: container.querySelector('#debug-mode').checked,
          emailNotif: container.querySelector('#email-notif').checked,
        });
        Toast.show('Paramètres système enregistrés', 'success');
      } catch (error) {
        Toast.show('Erreur lors de l\'enregistrement', 'error');
      } finally {
        isLoading = false;
      }
    });

    container.querySelector('#clear-cache-btn').addEventListener('click', async () => {
      const confirmed = await confirmAction('Vider le cache du site ?');
      if (confirmed) {
        try {
          await AdminAPI.clearCache();
          Toast.show('Cache vidé avec succès', 'success');
        } catch (error) {
          Toast.show('Erreur lors du vidage du cache', 'error');
        }
      }
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
});
