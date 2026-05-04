// Toast Notification System
class Toast {
  static show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container') || this.createContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${this.getIcon(type)}</div>
      <div class="toast-content">${message}</div>
      <div class="toast-close" onclick="this.parentElement.remove()">×</div>
      <div class="toast-progress" style="animation: progress ${duration}ms linear forwards;"></div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  static createContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
  }

  static getIcon(type) {
    const icons = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    return icons[type] || icons.info;
  }
}

// Add toast styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--admin-surface-2, #0D0D2B);
    border: 1px solid var(--admin-glass-border, rgba(0, 180, 216, 0.2));
    color: var(--admin-gray-1, #E8E8F0);
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 300ms ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .toast-success { border-left: 4px solid #4CAF50; }
  .toast-error { border-left: 4px solid #FF6B6B; }
  .toast-warning { border-left: 4px solid #FFC107; }
  .toast-info { border-left: 4px solid #00B4D8; }
  
  .toast-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }
  
  .toast-content { flex: 1; font-size: 0.9rem; }
  
  .toast-close {
    cursor: pointer;
    padding: 0 4px;
    font-size: 1.2rem;
    opacity: 0.6;
    transition: opacity 200ms;
  }
  
  .toast-close:hover { opacity: 1; }
  
  .toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: var(--admin-primary, #00B4D8);
    animation: progress 3s linear forwards;
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
document.head.appendChild(toastStyle);

// Confirmation Dialog
function confirmAction(message = 'Êtes-vous sûr de vouloir effectuer cette action ?') {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.innerHTML = `
      <div class="confirm-overlay"></div>
      <div class="confirm-content">
        <h3>Confirmation</h3>
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="btn-confirm btn-cancel">Annuler</button>
          <button class="btn-confirm btn-continue">Confirmer</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    const style = document.createElement('style');
    style.textContent = `
      .confirm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9998;
      }
      .confirm-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--admin-surface-2, #0D0D2B);
        border: 1px solid var(--admin-glass-border, rgba(0, 180, 216, 0.2));
        border-radius: 12px;
        padding: 2rem;
        z-index: 9999;
        max-width: 400px;
        width: 90%;
        text-align: center;
      }
      .confirm-content h3 {
        color: var(--admin-primary, #00B4D8);
        margin-bottom: 1rem;
      }
      .confirm-content p {
        color: var(--admin-gray-1, #E8E8F0);
        margin-bottom: 2rem;
      }
      .confirm-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
      .btn-confirm {
        padding: 0.5rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 200ms;
      }
      .btn-cancel {
        background: transparent;
        border: 1px solid var(--admin-gray-3, #808090);
        color: var(--admin-gray-2, #B0B0C0);
      }
      .btn-cancel:hover {
        border-color: var(--admin-gray-1, #E8E8F0);
        color: var(--admin-white, #FFFFFF);
      }
      .btn-continue {
        background: var(--admin-primary, #00B4D8);
        border: none;
        color: var(--admin-white, #FFFFFF);
      }
      .btn-continue:hover {
        background: var(--admin-primary-bright, #00D4F5);
      }
    `;
    document.head.appendChild(style);
    
    modal.querySelector('.btn-cancel').onclick = () => {
      modal.remove();
      resolve(false);
    };
    
    modal.querySelector('.btn-continue').onclick = () => {
      modal.remove();
      resolve(true);
    };
    
    modal.querySelector('.confirm-overlay').onclick = () => {
      modal.remove();
      resolve(false);
    };
  });
}

// Export
window.Toast = Toast;
window.confirmAction = confirmAction;
