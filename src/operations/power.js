export class Power {
  constructor(stackEngine) {
    this.stack = stackEngine;
  }

  pow() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push(Math.pow(y, x));
  }

  sqrt() {
    const x = this.stack.pop();
    if (x < 0) { this.stack.push(x); return 'Square root of negative number'; }
    this.stack.push(Math.sqrt(x));
  }

  nthRoot() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push(Math.pow(y, 1 / x));
  }
}
