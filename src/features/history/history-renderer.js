export class HistoryRenderer {
  constructor({ panelElement, listElement, clearButton, formatValue, onEntryClick }) {
    this.panel = panelElement;
    this.list = listElement;
    this.formatValue = formatValue;
    this.onEntryClick = onEntryClick;

    clearButton.addEventListener('click', () => this.onClear());
    this._onClear = null;
  }

  set onClearCallback(fn) {
    this._onClear = fn;
  }

  onClear() {
    if (this._onClear) this._onClear();
  }

  render(entries) {
    this.list.innerHTML = '';
    if (!entries.length) { this.panel.style.display = 'none'; return; }
    this.panel.style.display = 'block';
    entries.forEach((entry) => this._renderEntry(entry));
  }

  _renderEntry(entry) {
    const el = document.createElement('div');
    el.className = 'history-entry';
    el.textContent = entry.expression + ' = ' + this.formatValue(entry.result);
    el.addEventListener('click', () => this.onEntryClick(entry.result));
    this.list.appendChild(el);
  }
}
