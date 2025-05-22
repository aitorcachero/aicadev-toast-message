export class ToastMessage extends HTMLElement {
  static toasts = {
    'top-right': [],
    'top-left': [],
    'top-center': [],
    'bottom-right': [],
    'bottom-left': [],
    'bottom-center': [],
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'info';
    const duration = parseInt(this.getAttribute('duration')) || 3000;
    const position = this.getAttribute('position') || 'top-right';
    const message = this.innerHTML;
    const closeable = this.hasAttribute('closeable');

    // Añadir este toast al array correspondiente
    ToastMessage.toasts[position].push(this);
    this.style.position = 'fixed';
    this.style.zIndex = '9999';
    this.style[position.includes('bottom') ? 'bottom' : 'top'] = '20px';
    if (position.includes('left')) this.style.left = '20px';
    else if (position.includes('right')) this.style.right = '20px';
    else (this.style.left = '50%'), (this.style.transform = 'translateX(-50%)');

    this.updateToastPositions(position);

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

    const style = `
      :host {
        display: block;
        animation: fadeIn 0.3s ease-out;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      .toast {
        background: ${colors[type]};
        color: white;
        padding: 0.75rem 1rem;
        margin: 0.5rem 0;
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
      }

      .toast.fade-out {
        opacity: 0;
        transform: translateX(100%);
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
          transform: translateY(${
            position.includes('bottom') ? '10px' : '-10px'
          });
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

    const closeButton = closeable
      ? '<button class="close-btn" aria-label="Cerrar notificación">×</button>'
      : '';

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
      this.shadowRoot
        .querySelector('.close-btn')
        .addEventListener('click', () => {
          this.startRemoval();
        });
    }

    if (duration !== 0) {
      setTimeout(() => this.startRemoval(), duration);
    }
  }

  updateToastPositions(position) {
    const spacing = 10;
    const height = 80; // Altura aproximada del toast + margen
    const toasts = ToastMessage.toasts[position];
    const isTop = position.startsWith('top');

    toasts.forEach((toast, i) => {
      const offset = i * (height + spacing);
      toast.style.transform = `translateY(${isTop ? offset : -offset}px)`;
    });
  }

  startRemoval() {
    const toast = this.shadowRoot.querySelector('.toast');
    const position = this.getAttribute('position') || 'top-right';

    toast.classList.add('fade-out');

    setTimeout(() => {
      const index = ToastMessage.toasts[position].indexOf(this);
      if (index > -1) {
        ToastMessage.toasts[position].splice(index, 1);
        this.remove();
        this.updateRemainingToasts(position);
      }
    }, 300);
  }

  updateRemainingToasts(position) {
    const toasts = ToastMessage.toasts[position];
    toasts.forEach((t) => t.updateToastPositions(position));
  }

  disconnectedCallback() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.removeEventListener('click', () => this.startRemoval());
    }
  }
}

if (!customElements.get('toast-message')) {
  customElements.define('toast-message', ToastMessage);
}
