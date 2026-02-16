export class Misc {
  constructor(stackEngine) {
    this.stack = stackEngine;
  }

  factorial() {
    const x = this.stack.pop();
    if (x < 0 || !Number.isInteger(x)) { this.stack.push(x); return 'Invalid factorial argument'; }
    if (x > 170) { this.stack.push(x); return 'Factorial overflow'; }
    this.stack.push(this._compute(x));
  }

  _compute(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  mod() {
    if (this.stack.peek() === 0) return 'Division by zero';
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push(y % x);
  }
}
