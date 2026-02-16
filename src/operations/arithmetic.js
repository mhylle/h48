export class Arithmetic {
  constructor(stackEngine) {
    this.stack = stackEngine;
  }

  add() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push(y + x);
  }

  subtract() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push(y - x);
  }

  multiply() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push(y * x);
  }

  divide() {
    if (this.stack.peek() === 0) return 'Division by zero';
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push(y / x);
  }
}
