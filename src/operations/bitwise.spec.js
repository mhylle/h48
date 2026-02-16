import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from '../core/stack-engine.js';
import { Bitwise } from './bitwise.js';

describe('Bitwise', () => {
  let stack;
  let ops;

  beforeEach(() => {
    stack = new StackEngine();
    ops = new Bitwise(stack);
  });

  it('computes AND', () => {
    stack.push(12);
    stack.push(10);
    ops.and();
    expect(stack.peek()).toBe(8);
  });

  it('computes OR', () => {
    stack.push(12);
    stack.push(10);
    ops.or();
    expect(stack.peek()).toBe(14);
  });

  it('computes XOR', () => {
    stack.push(12);
    stack.push(10);
    ops.xor();
    expect(stack.peek()).toBe(6);
  });

  it('computes NOT with 32-bit truncation', () => {
    stack.push(0);
    ops.not();
    expect(stack.peek()).toBe(-1);
  });

  it('truncates to 32-bit integers', () => {
    stack.push(3.7);
    stack.push(5.2);
    ops.and();
    expect(stack.peek()).toBe(1);
  });
});
