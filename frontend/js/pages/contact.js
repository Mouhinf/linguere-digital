// Contact page specific functionality

async function initContact() {
  const form = document.getElementById('contact-form');
  const toastContainer = document.getElementById('toast-container');
  
  if (!form) return;

  // Create toast container if it doesn't exist
  if (!toastContainer) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
    document.body.appendChild(container);
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    `;
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        showToast('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
        form.reset();
      } else {
        showToast(result.error || 'Erreur lors de l\'envoi du message.', 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showToast('Erreur de connexion. Veuillez réessayer.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Add toast animations
if (!document.querySelector('style[data-toast]')) {
  const style = document.createElement('style');
  style.setAttribute('data-toast', 'true');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', initContact);
