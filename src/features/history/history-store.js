export class HistoryStore {
  constructor({ stackEngine, inputHandler }) {
    this.stackEngine = stackEngine;
    this.inputHandler = inputHandler;
    this.entries = [];
    this.maxEntries = 100;
    this.tokens = [];
    this.storageKey = 'statr-history';
    this.recordableActions = new Set([
      'add', 'subtract', 'multiply', 'divide',
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'ln', 'log10', 'log2', 'power', 'sqrt', 'xrooty',
      'pi', 'e', 'factorial', 'mod', 'and', 'or', 'xor', 'not',
    ]);
    this.actionLabels = {
      add: '+', subtract: '\u2212', multiply: '\u00d7', divide: '\u00f7',
      power: 'x^y', xrooty: 'x\u221ay', factorial: 'n!',
      mod: 'mod', and: 'AND', or: 'OR', xor: 'XOR', not: 'NOT',
      pi: '\u03c0', sqrt: '\u221a',
    };
  }

  beforeAction(action) {
    if (action === 'enter') {
      if (this.inputHandler.buffer) this.tokens.push(this.inputHandler.buffer);
      this.tokens.push('ENTER');
      return;
    }
    if (!this.recordableActions.has(action)) return;
    if (action === 'pi' || action === 'e') return;
    if (this.inputHandler.buffer) this.tokens.push(this.inputHandler.buffer);
  }

  afterAction(action, error) {
    if (!this.recordableActions.has(action)) return;
    if (error) { this.tokens = []; return; }
    this.tokens.push(this.actionLabels[action] || action);
    this.addEntry(this.stackEngine.peek());
  }

  addEntry(result) {
    this.entries.unshift({
      expression: this.tokens.join(' '),
      result,
      timestamp: Date.now(),
    });
    if (this.entries.length > this.maxEntries) this.entries.pop();
    this.tokens = [];
    this.save();
  }

  getEntries() {
    return this.entries;
  }

  save() {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.entries)); }
    catch (e) { /* in-memory only */ }
  }

  load() {
    try { this.entries = JSON.parse(localStorage.getItem(this.storageKey)) || []; }
    catch (e) { this.entries = []; }
  }

  clear() {
    this.entries = [];
    this.tokens = [];
    try { localStorage.removeItem(this.storageKey); }
    catch (e) { /* ignore */ }
  }
}
