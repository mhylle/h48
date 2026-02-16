import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from './stack-engine.js';

describe('StackEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new StackEngine();
  });

  it('initializes with all zeros', () => {
    expect(engine.stack).toEqual([0, 0, 0, 0]);
  });

  it('push shifts stack up and T falls off', () => {
    engine.stack = [1, 2, 3, 4];
    engine.push(5);
    expect(engine.stack).toEqual([5, 1, 2, 3]);
  });

  it('pop shifts stack down and T duplicates', () => {
    engine.stack = [1, 2, 3, 4];
    const value = engine.pop();
    expect(value).toBe(1);
    expect(engine.stack).toEqual([2, 3, 4, 4]);
  });

  it('peek returns X without modifying stack', () => {
    engine.stack = [42, 0, 0, 0];
    expect(engine.peek()).toBe(42);
    expect(engine.stack).toEqual([42, 0, 0, 0]);
  });

  it('swap exchanges X and Y only', () => {
    engine.stack = [1, 2, 3, 4];
    engine.swap();
    expect(engine.stack).toEqual([2, 1, 3, 4]);
  });

  it('dup pushes copy of X', () => {
    engine.stack = [5, 1, 2, 3];
    engine.dup();
    expect(engine.stack).toEqual([5, 5, 1, 2]);
  });

  it('drop pops and discards (T duplicates)', () => {
    engine.stack = [1, 2, 3, 4];
    engine.drop();
    expect(engine.stack).toEqual([2, 3, 4, 4]);
  });

  it('clear resets all registers to 0', () => {
    engine.stack = [1, 2, 3, 4];
    engine.clear();
    expect(engine.stack).toEqual([0, 0, 0, 0]);
  });
});
