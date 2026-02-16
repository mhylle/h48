import { StackEngine } from './core/stack-engine.js';
import { InputHandler } from './core/input-handler.js';
import { Arithmetic } from './operations/arithmetic.js';
import { Trigonometric } from './operations/trigonometric.js';
import { Logarithmic } from './operations/logarithmic.js';
import { Power } from './operations/power.js';
import { Constant } from './operations/constant.js';
import { Misc } from './operations/misc.js';
import { Bitwise } from './operations/bitwise.js';
import { formatValue } from './ui/format-value.js';
import { HistoryStore } from './features/history/history-store.js';
import { HistoryRenderer } from './features/history/history-renderer.js';
import { DisplayRenderer } from './ui/display-renderer.js';
import { ActionDispatcher } from './ui/action-dispatcher.js';
import { ButtonHandler } from './ui/button-handler.js';
import { KeyboardHandler } from './ui/keyboard-handler.js';
import { KEYBOARD_MAP } from './ui/keyboard-map.js';

// 1. Core
const stackEngine = new StackEngine();
const inputHandler = new InputHandler(stackEngine);

// 2. Operations
const arithmetic = new Arithmetic(stackEngine);
const trigonometric = new Trigonometric(stackEngine);
const logarithmic = new Logarithmic(stackEngine);
const power = new Power(stackEngine);
const constant = new Constant(stackEngine);
const misc = new Misc(stackEngine);
const bitwise = new Bitwise(stackEngine);

// 3. Display
const displayRenderer = new DisplayRenderer({ stackEngine, inputHandler, formatValue });

// 4. History
const historyStore = new HistoryStore({ stackEngine, inputHandler });
const historyRenderer = new HistoryRenderer({
  panelElement: document.getElementById('history-panel'),
  listElement: document.getElementById('history-list'),
  clearButton: document.getElementById('history-clear'),
  formatValue,
  onEntryClick: (value) => {
    stackEngine.push(value);
    inputHandler.isNewEntry = true;
    displayRenderer.update();
  },
});

historyRenderer.onClearCallback = () => {
  historyStore.clear();
  historyRenderer.render(historyStore.getEntries());
};

const originalAddEntry = historyStore.addEntry.bind(historyStore);
historyStore.addEntry = function(result) {
  originalAddEntry(result);
  historyRenderer.render(this.getEntries());
};

// 5. Dispatcher
const dispatcher = new ActionDispatcher({ inputHandler, historyStore, displayRenderer });

// 6. Register operations
dispatcher.registerOperation('add', () => arithmetic.add());
dispatcher.registerOperation('subtract', () => arithmetic.subtract());
dispatcher.registerOperation('multiply', () => arithmetic.multiply());
dispatcher.registerOperation('divide', () => arithmetic.divide());

dispatcher.registerOperation('sin', () => trigonometric.sin());
dispatcher.registerOperation('cos', () => trigonometric.cos());
dispatcher.registerOperation('tan', () => trigonometric.tan());
dispatcher.registerOperation('asin', () => trigonometric.asin());
dispatcher.registerOperation('acos', () => trigonometric.acos());
dispatcher.registerOperation('atan', () => trigonometric.atan());

dispatcher.registerOperation('ln', () => logarithmic.ln());
dispatcher.registerOperation('log10', () => logarithmic.log10());
dispatcher.registerOperation('log2', () => logarithmic.log2());

dispatcher.registerOperation('power', () => power.pow());
dispatcher.registerOperation('sqrt', () => power.sqrt());
dispatcher.registerOperation('xrooty', () => power.nthRoot());

dispatcher.registerConstant('pi', () => constant.pi());
dispatcher.registerConstant('e', () => constant.e());

dispatcher.registerOperation('factorial', () => misc.factorial());
dispatcher.registerOperation('mod', () => misc.mod());

dispatcher.registerOperation('and', () => bitwise.and());
dispatcher.registerOperation('or', () => bitwise.or());
dispatcher.registerOperation('xor', () => bitwise.xor());
dispatcher.registerOperation('not', () => bitwise.not());

dispatcher.registerOperation('swap', () => stackEngine.swap());
dispatcher.registerOperation('dup', () => stackEngine.dup());

// 7. Register custom actions
dispatcher.registerAction('digit', (v) => inputHandler.appendDigit(v));
dispatcher.registerAction('decimal', () => inputHandler.appendDecimal());
dispatcher.registerAction('backspace', () => inputHandler.backspace());
dispatcher.registerAction('eex', () => inputHandler.appendEEX());

dispatcher.registerAction('enter', () => {
  inputHandler.buffer ? inputHandler.commit() : stackEngine.dup();
  inputHandler.isNewEntry = true;
});

dispatcher.registerAction('negate', () => {
  if (inputHandler.buffer) {
    inputHandler.negate();
  } else {
    stackEngine.stack[0] = -stackEngine.stack[0];
  }
});

dispatcher.registerAction('drop', () => {
  if (inputHandler.buffer) {
    if (inputHandler.liftPending) stackEngine.drop();
    inputHandler.buffer = '';
    inputHandler.isNewEntry = true;
    inputHandler.liftPending = false;
  } else {
    stackEngine.drop();
  }
});

dispatcher.registerAction('clear', () => {
  stackEngine.clear();
  inputHandler.buffer = '';
  inputHandler.isNewEntry = true;
  inputHandler.liftPending = false;
});

// 8. Bind event handlers
new ButtonHandler({ gridElement: document.querySelector('.button-grid'), dispatcher });
new KeyboardHandler({ dispatcher, inputHandler, keyboardMap: KEYBOARD_MAP });

// 9. Initialize
historyStore.load();
historyRenderer.render(historyStore.getEntries());
displayRenderer.update();
