(async function() {
  const category = window.CATEGORY || 'informatique';
  const meta = window.META || { title: 'Service', subtitle: '' };

  document.title = meta.title + ' | Linguère Digital';
  document.getElementById('hero-title').textContent = meta.title;
  document.getElementById('hero-subtitle').textContent = meta.subtitle;
  document.getElementById('breadcrumb-name').textContent = meta.title;

  let allServices = [];

  try {
    const res = await API.getServices();
    allServices = (res.data || []).filter(s => s.categorie === category && s.actif);

    if (allServices.length === 0) {
      document.getElementById('services-grid').innerHTML = `
        <div style="text-align:center;padding:3rem;grid-column:1/-1;color:var(--color-gray-2)">
          <p style="margin-bottom:1.5rem;">Aucun service disponible dans cette catégorie pour le moment.</p>
          <a href="/contact.html" class="btn btn-primary">Nous Contacter pour en savoir plus</a>
        </div>`;
      return;
    }

    const serviceSelect = document.getElementById('f-service');

    document.getElementById('services-grid').innerHTML = allServices.map((s, i) => {
      const features = (s.descriptionLongue || s.description || '').split('\n').filter(Boolean);
      const isFeatured = i === 0;

      const option = document.createElement('option');
      option.value = s.titre;
      option.textContent = s.titre;
      serviceSelect.appendChild(option);

      return `
        <div class="service-card ${isFeatured ? 'service-card--featured' : ''} reveal" style="animation-delay:${i * 0.1}s">
          <h3 class="service-card__name">${s.titre}</h3>
          ${s.prix ? `
            <div class="price-tag ${allServices.length > 2 ? 'price-tag--small' : ''}">
              <span class="price-tag__currency">FCFA</span>
              <span class="price-tag__amount">${Number(s.prix).toLocaleString('fr-FR')}</span>
            </div>` : ''}
          <div class="service-card__features">
            ${features.length > 0 ? `
              <ul class="features-list">
                ${features.map(f => `<li class="features-list__item"><span class="features-list__check"></span><span>${f.trim()}</span></li>`).join('')}
              </ul>` : `<p style="color:var(--color-gray-2)">${s.description || ''}</p>`}
          </div>
          <a href="/contact.html?service=${encodeURIComponent(s.titre)}" class="service-card__cta">Demander un Devis</a>
        </div>`;
    }).join('');

    const preService = new URLSearchParams(window.location.search).get('service');
    if (preService) serviceSelect.value = preService;

    updateWhatsAppLink();

    if (typeof initScrollReveal === 'function') initScrollReveal();
  } catch (err) {
    console.error('Failed to load services:', err);
    document.getElementById('services-grid').innerHTML = `
      <div style="text-align:center;padding:3rem;grid-column:1/-1;color:var(--color-gray-2)">
        <p>Impossible de charger les services. Veuillez réessayer plus tard.</p>
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
