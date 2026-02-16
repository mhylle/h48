import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from '../core/stack-engine.js';
import { Misc } from './misc.js';

describe('Misc', () => {
  let stack;
  let ops;

  beforeEach(() => {
    stack = new StackEngine();
    ops = new Misc(stack);
  });

  it('computes 0! = 1', () => {
    stack.push(0);
    ops.factorial();
    expect(stack.peek()).toBe(1);
  });

  it('computes 5! = 120', () => {
    stack.push(5);
    ops.factorial();
    expect(stack.peek()).toBe(120);
  });

  it('returns error for negative factorial', () => {
    stack.push(-3);
    const err = ops.factorial();
    expect(err).toBe('Invalid factorial argument');
    expect(stack.peek()).toBe(-3);
  });

  it('returns error for non-integer factorial', () => {
    stack.push(3.5);
    const err = ops.factorial();
    expect(err).toBe('Invalid factorial argument');
    expect(stack.peek()).toBe(3.5);
  });

  it('returns error for factorial > 170', () => {
    stack.push(171);
    const err = ops.factorial();
    expect(err).toBe('Factorial overflow');
    expect(stack.peek()).toBe(171);
  });

  it('computes mod', () => {
    stack.push(10);
    stack.push(3);
    ops.mod();
    expect(stack.peek()).toBe(1);
  });

  it('returns error for mod by zero', () => {
    stack.push(10);
    stack.push(0);
    const err = ops.mod();
    expect(err).toBe('Division by zero');
  });
});
