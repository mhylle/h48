export class KeyboardHandler {
  constructor({ dispatcher, inputHandler, keyboardMap }) {
    document.addEventListener('keydown', (e) => {
      const k = e.key;
      let action = keyboardMap[k], value;
      if (k >= '0' && k <= '9') { action = 'digit'; value = k; }
      else if (k === 'e') action = inputHandler.buffer ? 'eex' : 'e';
      if (!action) return;
      e.preventDefault();
      dispatcher.dispatch(action, value);
    });
  }
}
