import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from '../core/stack-engine.js';
import { Trigonometric } from './trigonometric.js';

describe('Trigonometric', () => {
  let stack;
  let ops;

  beforeEach(() => {
    stack = new StackEngine();
    ops = new Trigonometric(stack);
  });

  it('computes sin', () => {
    stack.push(Math.PI / 2);
    ops.sin();
    expect(stack.peek()).toBeCloseTo(1, 10);
  });

  it('computes cos', () => {
    stack.push(0);
    ops.cos();
    expect(stack.peek()).toBe(1);
  });

  it('computes tan', () => {
    stack.push(Math.PI / 4);
    ops.tan();
    expect(stack.peek()).toBeCloseTo(1, 10);
  });

  it('computes asin', () => {
    stack.push(1);
    ops.asin();
    expect(stack.peek()).toBeCloseTo(Math.PI / 2, 10);
  });

  it('returns domain error for asin with |x| > 1', () => {
    stack.push(2);
    const err = ops.asin();
    expect(err).toBe('Domain error');
    expect(stack.peek()).toBe(2);
  });

  it('computes acos', () => {
    stack.push(0);
    ops.acos();
    expect(stack.peek()).toBeCloseTo(Math.PI / 2, 10);
  });

  it('returns domain error for acos with |x| > 1', () => {
    stack.push(-1.5);
    const err = ops.acos();
    expect(err).toBe('Domain error');
    expect(stack.peek()).toBe(-1.5);
  });

  it('computes atan', () => {
    stack.push(1);
    ops.atan();
    expect(stack.peek()).toBeCloseTo(Math.PI / 4, 10);
  });
});
