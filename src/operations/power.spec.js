import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from '../core/stack-engine.js';
import { Power } from './power.js';

describe('Power', () => {
  let stack;
  let ops;

  beforeEach(() => {
    stack = new StackEngine();
    ops = new Power(stack);
  });

  it('computes Y^X', () => {
    stack.push(2);
    stack.push(10);
    ops.pow();
    expect(stack.peek()).toBe(1024);
  });

  it('computes sqrt', () => {
    stack.push(144);
    ops.sqrt();
    expect(stack.peek()).toBe(12);
  });

  it('returns error for sqrt of negative', () => {
    stack.push(-4);
    const err = ops.sqrt();
    expect(err).toBe('Square root of negative number');
    expect(stack.peek()).toBe(-4);
  });

  it('computes nth root', () => {
    stack.push(27);
    stack.push(3);
    ops.nthRoot();
    expect(stack.peek()).toBeCloseTo(3, 10);
  });
});
