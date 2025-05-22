export class ToastMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'info';
    const duration = parseInt(this.getAttribute('duration')) || 3000;
    const message = this.textContent;

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
        animation: fadeIn 0.3s ease-out, fadeOut 0.3s ease-in ${
          duration - 300
        }ms forwards;
        background: ${colors[type]};
        color: white;
        padding: 0.75rem 1rem;
        margin: 0.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-family: sans-serif;
        font-size: 0.9rem;
        max-width: 300px;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeOut {
        to { opacity: 0; transform: translateY(-10px); }
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div>${icon[type]} ${message}</div>
    `;

    setTimeout(() => this.remove(), duration);
  }
}

if (!customElements.get('toast-message')) {
  customElements.define('toast-message', ToastMessage);
}
