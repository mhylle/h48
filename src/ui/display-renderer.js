export class DisplayRenderer {
  constructor({ stackEngine, inputHandler, formatValue }) {
    this.stackEngine = stackEngine;
    this.inputHandler = inputHandler;
    this.formatValue = formatValue;
    this.statusElement = document.getElementById('status-line');
  }

  update() {
    const s = this.stackEngine.stack;
    const show = (id, val) => {
      document.querySelector(`#${id} .value`).textContent = val;
    };
    show('stack-t', this.formatValue(s[3]));
    show('stack-z', this.formatValue(s[2]));
    show('stack-y', this.formatValue(s[1]));
    show('stack-x', this.inputHandler.buffer || this.formatValue(s[0]));
  }

  showError(message) {
    this.statusElement.textContent = 'Error: ' + message;
    setTimeout(() => { this.statusElement.textContent = ''; }, 3000);
  }

  clearStatus() {
    this.statusElement.textContent = '';
  }
}
