export class Logarithmic {
  constructor(stackEngine) {
    this.stack = stackEngine;
  }

  ln() {
    const x = this.stack.pop();
    if (x <= 0) { this.stack.push(x); return 'Logarithm of non-positive number'; }
    this.stack.push(Math.log(x));
  }

  log10() {
    const x = this.stack.pop();
    if (x <= 0) { this.stack.push(x); return 'Logarithm of non-positive number'; }
    this.stack.push(Math.log10(x));
  }

  log2() {
    const x = this.stack.pop();
    if (x <= 0) { this.stack.push(x); return 'Logarithm of non-positive number'; }
    this.stack.push(Math.log2(x));
  }
}
