export class ToastMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'info';
    const duration = parseInt(this.getAttribute('duration')) || 3000;
    const position = this.getAttribute('position') || 'top-right';
    const message = this.innerHTML; // Permite HTML en el mensaje
    const closeable = this.hasAttribute('closeable');

    const colors = {
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
    };

    const icon = {
      success: '✔️',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    const positions = {
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
      'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
    };

    const style = `
      :host {
        position: fixed;
        ${positions[position]};
        z-index: 9999;
        display: block;
        animation: fadeIn 0.3s ease-out;
      }

      .toast {
        background: ${colors[type]};
        color: white;
        padding: 0.75rem 1rem;
        margin: 0.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 0.9rem;
        min-width: 250px;
        max-width: 350px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        opacity: 0.95;
        transition: all 0.2s ease;
      }

      .toast:hover {
        opacity: 1;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
      }

      .content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0 4px;
        font-size: 1.2rem;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .close-btn:hover {
        opacity: 1;
      }

      @keyframes fadeIn {
        from { 
          opacity: 0; 
          transform: translateY(${position.includes('bottom') ? '10px' : '-10px'}); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      @keyframes fadeOut {
        to { 
          opacity: 0; 
          transform: translateY(${position.includes('bottom') ? '-10px' : '10px'}); 
        }
      }
    `;

    const closeButton = closeable ? '<button class="close-btn" aria-label="Cerrar notificación">×</button>' : '';

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="toast" role="alert" aria-live="polite">
        <div class="content">
          <span aria-hidden="true">${icon[type]}</span>
          <span>${message}</span>
        </div>
        ${closeButton}
      </div>
    `;

    if (closeable) {
      this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
        this.startRemoval();
      });
    }

    if (duration !== 0) {
      setTimeout(() => this.startRemoval(), duration);
    }
  }

  startRemoval() {
    const toast = this.shadowRoot.querySelector('.toast');
    toast.style.animation = 'fadeOut 0.3s ease-in forwards';
    setTimeout(() => this.remove(), 300);
  }

  disconnectedCallback() {
    if (this.shadowRoot.querySelector('.close-btn')) {
      this.shadowRoot.querySelector('.close-btn').removeEventListener('click', () => this.startRemoval());
    }
  }
}

if (!customElements.get('toast-message')) {
  customElements.define('toast-message', ToastMessage);
}
