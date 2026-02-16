import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StackEngine } from '../../core/stack-engine.js';
import { InputHandler } from '../../core/input-handler.js';
import { HistoryStore } from './history-store.js';

describe('HistoryStore', () => {
  let stack;
  let input;
  let store;

  beforeEach(() => {
    stack = new StackEngine();
    input = new InputHandler(stack);
    store = new HistoryStore({ stackEngine: stack, inputHandler: input });
    // Mock localStorage
    global.localStorage = {
      _data: {},
      getItem(key) { return this._data[key] || null; },
      setItem(key, value) { this._data[key] = value; },
      removeItem(key) { delete this._data[key]; },
    };
  });

  it('records tokens on beforeAction for recordable actions', () => {
    input.buffer = '42';
    store.beforeAction('add');
    expect(store.tokens).toEqual(['42']);
  });

  it('records ENTER token', () => {
    input.buffer = '5';
    store.beforeAction('enter');
    expect(store.tokens).toEqual(['5', 'ENTER']);
  });

  it('ignores non-recordable actions', () => {
    store.beforeAction('swap');
    expect(store.tokens).toEqual([]);
  });

  it('skips buffer capture for pi and e constants', () => {
    store.beforeAction('pi');
    expect(store.tokens).toEqual([]);
  });

  it('creates entry on afterAction', () => {
    stack.push(8);
    store.tokens = ['5', 'ENTER', '3'];
    store.afterAction('add', undefined);
    expect(store.entries).toHaveLength(1);
    expect(store.entries[0].expression).toBe('5 ENTER 3 +');
    expect(store.entries[0].result).toBe(8);
  });

  it('clears tokens on error', () => {
    store.tokens = ['5'];
    store.afterAction('divide', 'Division by zero');
    expect(store.tokens).toEqual([]);
    expect(store.entries).toHaveLength(0);
  });

  it('caps entries at 100', () => {
    for (let i = 0; i < 105; i++) {
      stack.push(i);
      store.tokens = [String(i)];
      store.afterAction('add', undefined);
    }
    expect(store.entries).toHaveLength(100);
  });

  it('clear removes all entries', () => {
    store.entries = [{ expression: 'test', result: 1, timestamp: 0 }];
    store.clear();
    expect(store.entries).toEqual([]);
    expect(store.tokens).toEqual([]);
  });

  it('save and load round-trips entries', () => {
    stack.push(42);
    store.tokens = ['40', '2'];
    store.afterAction('add', undefined);
    const saved = store.entries.slice();

    store.entries = [];
    store.load();
    expect(store.entries).toEqual(saved);
  });
});
