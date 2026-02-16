export class StackEngine {
  constructor() {
    this.stack = [0, 0, 0, 0];
  }

  push(value) {
    this.stack[3] = this.stack[2];
    this.stack[2] = this.stack[1];
    this.stack[1] = this.stack[0];
    this.stack[0] = value;
  }

  pop() {
    const value = this.stack[0];
    this.stack[0] = this.stack[1];
    this.stack[1] = this.stack[2];
    this.stack[2] = this.stack[3];
    return value;
  }

  peek() {
    return this.stack[0];
  }

  swap() {
    const temp = this.stack[0];
    this.stack[0] = this.stack[1];
    this.stack[1] = temp;
  }

  dup() {
    this.push(this.stack[0]);
  }

  drop() {
    this.pop();
  }

  clear() {
    this.stack = [0, 0, 0, 0];
  }
}
