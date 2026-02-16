import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from '../core/stack-engine.js';
import { Constant } from './constant.js';

describe('Constant', () => {
  let stack;
  let ops;

  beforeEach(() => {
    stack = new StackEngine();
    ops = new Constant(stack);
  });

  it('pushes pi', () => {
    ops.pi();
    expect(stack.peek()).toBe(Math.PI);
  });

  it('pushes e', () => {
    ops.e();
    expect(stack.peek()).toBe(Math.E);
  });
});
