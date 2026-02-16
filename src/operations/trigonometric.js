export class Trigonometric {
  constructor(stackEngine) {
    this.stack = stackEngine;
  }

  sin() {
    const x = this.stack.pop();
    this.stack.push(Math.sin(x));
  }

  cos() {
    const x = this.stack.pop();
    this.stack.push(Math.cos(x));
  }

  tan() {
    const x = this.stack.pop();
    this.stack.push(Math.tan(x));
  }

  asin() {
    const x = this.stack.pop();
    if (Math.abs(x) > 1) { this.stack.push(x); return 'Domain error'; }
    this.stack.push(Math.asin(x));
  }

  acos() {
    const x = this.stack.pop();
    if (Math.abs(x) > 1) { this.stack.push(x); return 'Domain error'; }
    this.stack.push(Math.acos(x));
  }

  atan() {
    const x = this.stack.pop();
    this.stack.push(Math.atan(x));
  }
}
