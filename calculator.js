// statr - RPN Scientific Calculator

// === STACK ENGINE ===
const StackEngine = {
  stack: [0, 0, 0, 0],

  push(value) {
    this.stack[3] = this.stack[2];
    this.stack[2] = this.stack[1];
    this.stack[1] = this.stack[0];
    this.stack[0] = value;
  },

  pop() {
    const value = this.stack[0];
    this.stack[0] = this.stack[1];
    this.stack[1] = this.stack[2];
    this.stack[2] = this.stack[3];
    return value;
  },

  peek() {
    return this.stack[0];
  },

  swap() {
    const temp = this.stack[0];
    this.stack[0] = this.stack[1];
    this.stack[1] = temp;
  },

  dup() {
    this.push(this.stack[0]);
  },

  drop() {
    this.pop();
  },

  clear() {
    this.stack = [0, 0, 0, 0];
  },
};

// === OPERATIONS (ADR-0005: category sub-objects) ===
const Operations = {
  arithmetic: {
    add() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push(y + x);
    },

    subtract() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push(y - x);
    },

    multiply() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push(y * x);
    },

    divide() {
      if (StackEngine.peek() === 0) return 'Division by zero';
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push(y / x);
    },
  },

  trig: {
    sin() {
      const x = StackEngine.pop();
      StackEngine.push(Math.sin(x));
    },

    cos() {
      const x = StackEngine.pop();
      StackEngine.push(Math.cos(x));
    },

    tan() {
      const x = StackEngine.pop();
      StackEngine.push(Math.tan(x));
    },

    asin() {
      const x = StackEngine.pop();
      if (Math.abs(x) > 1) { StackEngine.push(x); return 'Domain error'; }
      StackEngine.push(Math.asin(x));
    },

    acos() {
      const x = StackEngine.pop();
      if (Math.abs(x) > 1) { StackEngine.push(x); return 'Domain error'; }
      StackEngine.push(Math.acos(x));
    },

    atan() {
      const x = StackEngine.pop();
      StackEngine.push(Math.atan(x));
    },
  },

  log: {
    ln() {
      const x = StackEngine.pop();
      if (x <= 0) { StackEngine.push(x); return 'Logarithm of non-positive number'; }
      StackEngine.push(Math.log(x));
    },

    log10() {
      const x = StackEngine.pop();
      if (x <= 0) { StackEngine.push(x); return 'Logarithm of non-positive number'; }
      StackEngine.push(Math.log10(x));
    },

    log2() {
      const x = StackEngine.pop();
      if (x <= 0) { StackEngine.push(x); return 'Logarithm of non-positive number'; }
      StackEngine.push(Math.log2(x));
    },
  },

  power: {
    pow() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push(Math.pow(y, x));
    },

    sqrt() {
      const x = StackEngine.pop();
      if (x < 0) { StackEngine.push(x); return 'Square root of negative number'; }
      StackEngine.push(Math.sqrt(x));
    },

    nthRoot() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push(Math.pow(y, 1 / x));
    },
  },

  constant: {
    pi() {
      StackEngine.push(Math.PI);
    },

    e() {
      StackEngine.push(Math.E);
    },
  },

  misc: {
    factorial() {
      const x = StackEngine.pop();
      if (x < 0 || !Number.isInteger(x)) { StackEngine.push(x); return 'Invalid factorial argument'; }
      if (x > 170) { StackEngine.push(x); return 'Factorial overflow'; }
      StackEngine.push(Operations.misc._computeFactorial(x));
    },

    _computeFactorial(n) {
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    },

    mod() {
      if (StackEngine.peek() === 0) return 'Division by zero';
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push(y % x);
    },
  },

  bitwise: {
    and() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push((y | 0) & (x | 0));
    },

    or() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push((y | 0) | (x | 0));
    },

    xor() {
      const x = StackEngine.pop();
      const y = StackEngine.pop();
      StackEngine.push((y | 0) ^ (x | 0));
    },

    not() {
      const x = StackEngine.pop();
      StackEngine.push(~(x | 0));
    },
  },
};

// === INPUT HANDLER ===
const InputHandler = {
  buffer: '',
  isNewEntry: true,
  liftPending: false,

  appendDigit(digit) {
    if (this.isNewEntry) this.liftStack();
    this.buffer += digit;
  },

  appendDecimal() {
    if (this.isNewEntry) this.liftStack();
    if (!this.buffer) this.buffer = '0';
    if (!this.buffer.includes('.')) this.buffer += '.';
  },

  backspace() {
    this.buffer = this.buffer.slice(0, -1);
  },

  negate() {
    const pivot = this.buffer.includes('e') ? this.buffer.indexOf('e') + 1 : 0;
    const head = this.buffer.slice(0, pivot);
    const tail = this.buffer.slice(pivot);
    this.buffer = head + (tail[0] === '-' ? tail.slice(1) : '-' + tail);
  },

  appendEEX() {
    if (this.isNewEntry) this.liftStack();
    if (this.buffer.includes('e')) return;
    if (!this.buffer) this.buffer = '1';
    this.buffer += 'e';
  },

  commit() {
    if (!this.buffer) return false;
    const value = parseFloat(this.buffer);
    this.liftPending ? (StackEngine.stack[0] = value) : StackEngine.push(value);
    this.buffer = '';
    this.liftPending = false;
    return true;
  },

  liftStack() {
    StackEngine.push(StackEngine.peek());
    this.buffer = '';
    this.isNewEntry = false;
    this.liftPending = true;
  },
};

// === HISTORY MANAGER ===
const HistoryManager = {
  entries: [],
  maxEntries: 100,
  tokens: [],
  storageKey: 'statr-history',
  recordableActions: new Set([
    'add', 'subtract', 'multiply', 'divide',
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'ln', 'log10', 'log2', 'power', 'sqrt', 'xrooty',
    'pi', 'e', 'factorial', 'mod', 'and', 'or', 'xor', 'not',
  ]),
  actionLabels: {
    add: '+', subtract: '−', multiply: '×', divide: '÷',
    power: 'x^y', xrooty: 'x√y', factorial: 'n!',
    mod: 'mod', and: 'AND', or: 'OR', xor: 'XOR', not: 'NOT',
    pi: 'π', sqrt: '√',
  },

  beforeAction(action) {
    if (action === 'enter') {
      if (InputHandler.buffer) this.tokens.push(InputHandler.buffer);
      this.tokens.push('ENTER');
      return;
    }
    if (!this.recordableActions.has(action)) return;
    if (action === 'pi' || action === 'e') return;
    if (InputHandler.buffer) this.tokens.push(InputHandler.buffer);
  },

  afterAction(action, error) {
    if (!this.recordableActions.has(action)) return;
    if (error) { this.tokens = []; return; }
    this.tokens.push(this.actionLabels[action] || action);
    this._addEntry(StackEngine.peek());
  },

  save() {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.entries)); }
    catch (e) { /* in-memory only */ }
  },

  load() {
    try { this.entries = JSON.parse(localStorage.getItem(this.storageKey)) || []; }
    catch (e) { this.entries = []; }
    this.render();
  },

  clear() {
    this.entries = [];
    this.tokens = [];
    try { localStorage.removeItem(this.storageKey); }
    catch (e) { /* ignore */ }
    this.render();
  },

  render() {
    const panel = document.getElementById('history-panel');
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    if (!this.entries.length) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    this.entries.forEach((entry) => this._renderEntry(list, entry));
  },

  _addEntry(result) {
    this.entries.unshift({ expression: this.tokens.join(' '), result, timestamp: Date.now() });
    if (this.entries.length > this.maxEntries) this.entries.pop();
    this.tokens = [];
    this.save();
    this.render();
  },

  _renderEntry(list, entry) {
    const el = document.createElement('div');
    el.className = 'history-entry';
    el.textContent = entry.expression + ' = ' + UIController.formatValue(entry.result);
    el.addEventListener('click', () => {
      StackEngine.push(entry.result);
      InputHandler.isNewEntry = true;
      UIController.updateDisplay();
    });
    list.appendChild(el);
  },
};

// === KEYBOARD MAP ===
const KEYBOARD_MAP = {
  '.': 'decimal', Enter: 'enter', '+': 'add', '-': 'subtract',
  '*': 'multiply', '/': 'divide', Backspace: 'backspace', Escape: 'clear',
  s: 'sin', S: 'asin', c: 'cos', C: 'acos', t: 'tan', T: 'atan',
  l: 'ln', L: 'log10', '^': 'power', q: 'sqrt', p: 'pi',
  '!': 'factorial', '%': 'mod', x: 'swap', d: 'dup', n: 'negate',
  '&': 'and', '|': 'or', '~': 'not',
};

// === UI CONTROLLER ===
const UIController = {
  init() {
    this.bindButtons();
    this.bindKeyboard();
    HistoryManager.load();
    this.updateDisplay();
    document.getElementById('history-clear').addEventListener('click', () => HistoryManager.clear());
  },

  bindButtons() {
    const grid = document.querySelector('.button-grid');
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) this.handleAction(btn.dataset.action, btn.dataset.value);
    });
  },

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      const k = e.key;
      let action = KEYBOARD_MAP[k], value;
      if (k >= '0' && k <= '9') { action = 'digit'; value = k; }
      else if (k === 'e') action = InputHandler.buffer ? 'eex' : 'e';
      if (!action) return;
      e.preventDefault();
      this.handleAction(action, value);
    });
  },

  updateDisplay() {
    const s = StackEngine.stack;
    const show = (id, val) => (document.querySelector(`#${id} .value`).textContent = val);
    show('stack-t', this.formatValue(s[3]));
    show('stack-z', this.formatValue(s[2]));
    show('stack-y', this.formatValue(s[1]));
    show('stack-x', InputHandler.buffer || this.formatValue(s[0]));
  },

  formatValue(value) {
    if (!isFinite(value)) return String(value);
    if (Number.isInteger(value) && Math.abs(value) < 1e12) return String(value);
    return Number(value.toPrecision(12)).toString();
  },

  showError(message) {
    const el = document.getElementById('status-line');
    el.textContent = 'Error: ' + message;
    setTimeout(() => { el.textContent = ''; }, 3000);
  },

  handleAction(action, value) {
    document.getElementById('status-line').textContent = '';
    const handler = this.dispatch[action];
    if (!handler) return;
    HistoryManager.beforeAction(action);
    const error = handler(value);
    if (error) this.showError(error);
    HistoryManager.afterAction(action, error);
    this.updateDisplay();
  },

  dispatch: {
    digit: (v) => InputHandler.appendDigit(v),
    decimal: () => InputHandler.appendDecimal(),
    backspace: () => InputHandler.backspace(),
    eex: () => InputHandler.appendEEX(),

    enter: () => {
      InputHandler.buffer ? InputHandler.commit() : StackEngine.dup();
      InputHandler.isNewEntry = true;
    },

    negate: () => {
      if (InputHandler.buffer) {
        InputHandler.negate();
      } else {
        StackEngine.stack[0] = -StackEngine.stack[0];
      }
    },

    // --- Arithmetic ---
    add: () => {
      InputHandler.commit();
      Operations.arithmetic.add();
      InputHandler.isNewEntry = true;
    },

    subtract: () => {
      InputHandler.commit();
      Operations.arithmetic.subtract();
      InputHandler.isNewEntry = true;
    },

    multiply: () => {
      InputHandler.commit();
      Operations.arithmetic.multiply();
      InputHandler.isNewEntry = true;
    },

    divide: () => {
      InputHandler.commit();
      const err = Operations.arithmetic.divide();
      InputHandler.isNewEntry = true;
      return err;
    },

    // --- Trigonometric ---
    sin: () => {
      InputHandler.commit();
      Operations.trig.sin();
      InputHandler.isNewEntry = true;
    },

    cos: () => {
      InputHandler.commit();
      Operations.trig.cos();
      InputHandler.isNewEntry = true;
    },

    tan: () => {
      InputHandler.commit();
      Operations.trig.tan();
      InputHandler.isNewEntry = true;
    },

    asin: () => {
      InputHandler.commit();
      const err = Operations.trig.asin();
      InputHandler.isNewEntry = true;
      return err;
    },

    acos: () => {
      InputHandler.commit();
      const err = Operations.trig.acos();
      InputHandler.isNewEntry = true;
      return err;
    },

    atan: () => {
      InputHandler.commit();
      Operations.trig.atan();
      InputHandler.isNewEntry = true;
    },

    // --- Logarithmic ---
    ln: () => {
      InputHandler.commit();
      const err = Operations.log.ln();
      InputHandler.isNewEntry = true;
      return err;
    },

    log10: () => {
      InputHandler.commit();
      const err = Operations.log.log10();
      InputHandler.isNewEntry = true;
      return err;
    },

    log2: () => {
      InputHandler.commit();
      const err = Operations.log.log2();
      InputHandler.isNewEntry = true;
      return err;
    },

    // --- Power/Root ---
    power: () => {
      InputHandler.commit();
      Operations.power.pow();
      InputHandler.isNewEntry = true;
    },

    sqrt: () => {
      InputHandler.commit();
      const err = Operations.power.sqrt();
      InputHandler.isNewEntry = true;
      return err;
    },

    xrooty: () => {
      InputHandler.commit();
      Operations.power.nthRoot();
      InputHandler.isNewEntry = true;
    },

    // --- Constants ---
    pi: () => {
      if (InputHandler.buffer) InputHandler.commit();
      Operations.constant.pi();
      InputHandler.isNewEntry = true;
    },

    e: () => {
      if (InputHandler.buffer) InputHandler.commit();
      Operations.constant.e();
      InputHandler.isNewEntry = true;
    },

    // --- Misc ---
    factorial: () => {
      InputHandler.commit();
      const err = Operations.misc.factorial();
      InputHandler.isNewEntry = true;
      return err;
    },

    mod: () => {
      InputHandler.commit();
      const err = Operations.misc.mod();
      InputHandler.isNewEntry = true;
      return err;
    },

    // --- Bitwise ---
    and: () => {
      InputHandler.commit();
      Operations.bitwise.and();
      InputHandler.isNewEntry = true;
    },

    or: () => {
      InputHandler.commit();
      Operations.bitwise.or();
      InputHandler.isNewEntry = true;
    },

    xor: () => {
      InputHandler.commit();
      Operations.bitwise.xor();
      InputHandler.isNewEntry = true;
    },

    not: () => {
      InputHandler.commit();
      Operations.bitwise.not();
      InputHandler.isNewEntry = true;
    },

    // --- Stack ---
    swap: () => {
      InputHandler.commit();
      StackEngine.swap();
      InputHandler.isNewEntry = true;
    },

    dup: () => {
      InputHandler.commit();
      StackEngine.dup();
      InputHandler.isNewEntry = true;
    },

    drop: () => {
      if (InputHandler.buffer) {
        if (InputHandler.liftPending) StackEngine.drop();
        InputHandler.buffer = '';
        InputHandler.isNewEntry = true;
        InputHandler.liftPending = false;
      } else {
        StackEngine.drop();
      }
    },

    clear: () => {
      StackEngine.clear();
      InputHandler.buffer = '';
      InputHandler.isNewEntry = true;
      InputHandler.liftPending = false;
    },
  },
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => UIController.init());
