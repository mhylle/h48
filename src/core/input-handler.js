export class InputHandler {
  constructor(stackEngine) {
    this.stack = stackEngine;
    this.buffer = '';
    this.isNewEntry = true;
    this.liftPending = false;
  }

  appendDigit(digit) {
    if (this.isNewEntry) this.liftStack();
    this.buffer += digit;
  }

  appendDecimal() {
    if (this.isNewEntry) this.liftStack();
    if (!this.buffer) this.buffer = '0';
    if (!this.buffer.includes('.')) this.buffer += '.';
  }

  backspace() {
    this.buffer = this.buffer.slice(0, -1);
  }

  negate() {
    const pivot = this.buffer.includes('e') ? this.buffer.indexOf('e') + 1 : 0;
    const head = this.buffer.slice(0, pivot);
    const tail = this.buffer.slice(pivot);
    this.buffer = head + (tail[0] === '-' ? tail.slice(1) : '-' + tail);
  }

  appendEEX() {
    if (this.isNewEntry) this.liftStack();
    if (this.buffer.includes('e')) return;
    if (!this.buffer) this.buffer = '1';
    this.buffer += 'e';
  }

  commit() {
    if (!this.buffer) return false;
    const value = parseFloat(this.buffer);
    this.liftPending ? (this.stack.stack[0] = value) : this.stack.push(value);
    this.buffer = '';
    this.liftPending = false;
    return true;
  }

  liftStack() {
    this.stack.push(this.stack.peek());
    this.buffer = '';
    this.isNewEntry = false;
    this.liftPending = true;
  }
}
