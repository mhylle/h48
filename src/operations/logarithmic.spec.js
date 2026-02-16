import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from '../core/stack-engine.js';
import { Logarithmic } from './logarithmic.js';

describe('Logarithmic', () => {
  let stack;
  let ops;

  beforeEach(() => {
    stack = new StackEngine();
    ops = new Logarithmic(stack);
  });

  it('computes ln', () => {
    stack.push(Math.E);
    ops.ln();
    expect(stack.peek()).toBeCloseTo(1, 10);
  });

  it('computes log10', () => {
    stack.push(100);
    ops.log10();
    expect(stack.peek()).toBeCloseTo(2, 10);
  });

  it('computes log2', () => {
    stack.push(8);
    ops.log2();
    expect(stack.peek()).toBeCloseTo(3, 10);
  });

  it('returns error for ln of non-positive', () => {
    stack.push(-1);
    const err = ops.ln();
    expect(err).toBe('Logarithm of non-positive number');
    expect(stack.peek()).toBe(-1);
  });

  it('returns error for log10 of zero', () => {
    stack.push(0);
    const err = ops.log10();
    expect(err).toBe('Logarithm of non-positive number');
    expect(stack.peek()).toBe(0);
  });

  it('returns error for log2 of negative', () => {
    stack.push(-5);
    const err = ops.log2();
    expect(err).toBe('Logarithm of non-positive number');
    expect(stack.peek()).toBe(-5);
  });
});
