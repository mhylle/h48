import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActionDispatcher } from './action-dispatcher.js';

describe('ActionDispatcher', () => {
  let dispatcher;
  let inputHandler;
  let historyStore;
  let displayRenderer;

  beforeEach(() => {
    inputHandler = {
      buffer: '',
      isNewEntry: false,
      commit: vi.fn(),
    };
    historyStore = {
      beforeAction: vi.fn(),
      afterAction: vi.fn(),
    };
    displayRenderer = {
      clearStatus: vi.fn(),
      showError: vi.fn(),
      update: vi.fn(),
    };
    dispatcher = new ActionDispatcher({ inputHandler, historyStore, displayRenderer });
  });

  it('registerOperation wraps commit -> call -> isNewEntry', () => {
    const opFn = vi.fn();
    dispatcher.registerOperation('add', opFn);
    dispatcher.dispatch('add');

    expect(inputHandler.commit).toHaveBeenCalled();
    expect(opFn).toHaveBeenCalled();
    expect(inputHandler.isNewEntry).toBe(true);
  });

  it('registerOperation propagates error', () => {
    dispatcher.registerOperation('divide', () => 'Division by zero');
    dispatcher.dispatch('divide');

    expect(displayRenderer.showError).toHaveBeenCalledWith('Division by zero');
  });

  it('registerConstant commits buffer only if present', () => {
    inputHandler.buffer = '42';
    dispatcher.registerConstant('pi', vi.fn());
    dispatcher.dispatch('pi');

    expect(inputHandler.commit).toHaveBeenCalled();
    expect(inputHandler.isNewEntry).toBe(true);
  });

  it('registerAction allows custom handler', () => {
    const handler = vi.fn();
    dispatcher.registerAction('custom', handler);
    dispatcher.dispatch('custom', '5');

    expect(handler).toHaveBeenCalledWith('5');
  });

  it('calls beforeAction and afterAction hooks', () => {
    dispatcher.registerOperation('add', vi.fn());
    dispatcher.dispatch('add');

    expect(historyStore.beforeAction).toHaveBeenCalledWith('add');
    expect(historyStore.afterAction).toHaveBeenCalledWith('add', undefined);
  });

  it('silently ignores unknown actions', () => {
    dispatcher.dispatch('unknown');
    expect(displayRenderer.update).not.toHaveBeenCalled();
  });

  it('calls displayRenderer.update after dispatch', () => {
    dispatcher.registerOperation('add', vi.fn());
    dispatcher.dispatch('add');

    expect(displayRenderer.update).toHaveBeenCalled();
  });
});
