export class Constant {
  constructor(stackEngine) {
    this.stack = stackEngine;
  }

  pi() {
    this.stack.push(Math.PI);
  }

  e() {
    this.stack.push(Math.E);
  }
}
