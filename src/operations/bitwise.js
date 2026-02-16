export class Bitwise {
  constructor(stackEngine) {
    this.stack = stackEngine;
  }

  and() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push((y | 0) & (x | 0));
  }

  or() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push((y | 0) | (x | 0));
  }

  xor() {
    const x = this.stack.pop();
    const y = this.stack.pop();
    this.stack.push((y | 0) ^ (x | 0));
  }

  not() {
    const x = this.stack.pop();
    this.stack.push(~(x | 0));
  }
}
