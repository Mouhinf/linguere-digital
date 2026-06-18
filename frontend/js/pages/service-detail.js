(async function() {
  const category = window.CATEGORY || 'informatique';
  const meta = window.META || { title: 'Service', subtitle: '', icon: '' };

  document.title = meta.title + ' | Linguère Digital';
  document.getElementById('hero-title').textContent = meta.title;
  document.getElementById('hero-subtitle').textContent = meta.subtitle;
  document.getElementById('breadcrumb-name').textContent = meta.title;

  let allServices = [];

  try {
    const res = await API.getServices();
    allServices = (res.data || []).filter(s => s.categorie === category && s.actif);

    const grid = document.getElementById('services-grid');
    const serviceSelect = document.getElementById('f-service');

    if (allServices.length === 0) {
      grid.innerHTML = `
        <div class="empty-state reveal">
          <div class="empty-state__icon">${meta.icon}</div>
          <h3>Aucun service disponible</h3>
          <p>Cette catégorie est en cours de préparation. Contactez-nous pour en savoir plus.</p>
          <a href="/contact.html" class="btn btn-primary">Nous Contacter</a>
        </div>`;
      if (typeof initScrollReveal === 'function') initScrollReveal();
      return;
    }

    grid.innerHTML = allServices.map((s, i) => {
      const isFeatured = i === 0;
      const option = document.createElement('option');
      option.value = s.titre;
      option.textContent = s.titre;
      serviceSelect.appendChild(option);

      return `
        <div class="glass-card svc-card reveal ${isFeatured ? 'svc-card--featured' : ''}" style="animation-delay:${i * 0.08}s">
          ${isFeatured ? '<span class="svc-card__badge">Populaire</span>' : ''}
          <h3 class="svc-card__title">${s.titre}</h3>
          <p class="svc-card__desc">${s.description || ''}</p>
          ${s.prix ? `
            <div class="svc-card__price">
              <span class="svc-card__price-currency">FCFA</span>
              <span class="svc-card__price-amount">${Number(s.prix).toLocaleString('fr-FR')}</span>
            </div>` : ''}
          <a href="/contact.html?service=${encodeURIComponent(s.titre)}" class="btn btn-outline btn-sm svc-card__btn">Demander un Devis</a>
        </div>`;
    }).join('');

    const preService = new URLSearchParams(window.location.search).get('service');
    if (preService) serviceSelect.value = preService;

    updateWhatsAppLink();
    if (typeof initScrollReveal === 'function') initScrollReveal();
  } catch (err) {
    console.error('Failed to load services:', err);
    document.getElementById('services-grid').innerHTML = `
      <div class="empty-state">
        <h3>Erreur de chargement</h3>
        <p>Veuillez réessayer plus tard.</p>
      </div>`;
  }

  function updateWhatsAppLink() {
    const service = document.getElementById('f-service').value;
    const prenom = document.getElementById('f-prenom').value;
    const nom = document.getElementById('f-nom').value;
    const message = document.getElementById('f-message').value;

    let text = `Bonjour Linguère Digital !\n`;
    if (prenom || nom) text += `Je suis ${prenom} ${nom}.\n`;
    if (service) text += `Je suis intéressé(e) par le service : *${service}*.\n`;
    if (message) text += `\n${message}`;

    document.getElementById('whatsapp-btn').href = `https://wa.me/221786602424?text=${encodeURIComponent(text)}`;
  }

  ['f-prenom', 'f-nom', 'f-service', 'f-message'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateWhatsAppLink);
    document.getElementById(id).addEventListener('change', updateWhatsAppLink);
  });

  document.getElementById('service-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
      prenom: document.getElementById('f-prenom').value,
      nom: document.getElementById('f-nom').value,
      email: document.getElementById('f-email').value,
      telephone: document.getElementById('f-telephone').value,
      service: document.getElementById('f-service').value,
      objet: `Demande de devis - ${document.getElementById('f-service').value || meta.title}`,
      message: document.getElementById('f-message').value,
      _honey: ''
    };
    try {
      await API.submitContact(data);
      document.getElementById('service-form').style.display = 'none';
      document.getElementById('form-success').classList.add('show');
    } catch (err) {
      alert('Erreur lors de l\'envoi. Veuillez réessayer ou contactez-nous par WhatsApp.');
    }
  });
})();
