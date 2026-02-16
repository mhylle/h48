import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from '../core/stack-engine.js';
import { Arithmetic } from './arithmetic.js';

describe('Arithmetic', () => {
  let stack;
  let ops;

  beforeEach(() => {
    stack = new StackEngine();
    ops = new Arithmetic(stack);
  });

  it('adds X and Y', () => {
    stack.push(3);
    stack.push(5);
    ops.add();
    expect(stack.peek()).toBe(8);
  });

  it('subtracts X from Y', () => {
    stack.push(10);
    stack.push(3);
    ops.subtract();
    expect(stack.peek()).toBe(7);
  });

  it('multiplies Y by X', () => {
    stack.push(4);
    stack.push(5);
    ops.multiply();
    expect(stack.peek()).toBe(20);
  });

  it('divides Y by X', () => {
    stack.push(10);
    stack.push(4);
    ops.divide();
    expect(stack.peek()).toBe(2.5);
  });

  it('returns error on division by zero', () => {
    stack.push(10);
    stack.push(0);
    const err = ops.divide();
    expect(err).toBe('Division by zero');
    expect(stack.peek()).toBe(0);
  });
});
