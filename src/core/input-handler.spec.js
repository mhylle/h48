import { describe, it, expect, beforeEach } from 'vitest';
import { StackEngine } from './stack-engine.js';
import { InputHandler } from './input-handler.js';

describe('InputHandler', () => {
  let stack;
  let input;

  beforeEach(() => {
    stack = new StackEngine();
    input = new InputHandler(stack);
  });

  it('appends digits to buffer', () => {
    input.isNewEntry = false;
    input.appendDigit('5');
    input.appendDigit('3');
    expect(input.buffer).toBe('53');
  });

  it('lifts stack on first digit when isNewEntry', () => {
    stack.push(42);
    input.isNewEntry = true;
    input.appendDigit('5');
    expect(input.buffer).toBe('5');
    expect(stack.stack[1]).toBe(42);
  });

  it('appends decimal with leading zero if buffer empty', () => {
    input.isNewEntry = false;
    input.appendDecimal();
    expect(input.buffer).toBe('0.');
  });

  it('does not add second decimal', () => {
    input.isNewEntry = false;
    input.buffer = '3.14';
    input.appendDecimal();
    expect(input.buffer).toBe('3.14');
  });

  it('removes last character on backspace', () => {
    input.buffer = '123';
    input.backspace();
    expect(input.buffer).toBe('12');
  });

  it('negates number', () => {
    input.buffer = '42';
    input.negate();
    expect(input.buffer).toBe('-42');
  });

  it('toggles negate off', () => {
    input.buffer = '-42';
    input.negate();
    expect(input.buffer).toBe('42');
  });

  it('negates exponent part when EEX present', () => {
    input.buffer = '1e5';
    input.negate();
    expect(input.buffer).toBe('1e-5');
  });

  it('appends EEX with default mantissa 1', () => {
    input.isNewEntry = false;
    input.appendEEX();
    expect(input.buffer).toBe('1e');
  });

  it('does not add second EEX', () => {
    input.isNewEntry = false;
    input.buffer = '1e';
    input.appendEEX();
    expect(input.buffer).toBe('1e');
  });

  it('commits buffer to stack X', () => {
    input.isNewEntry = false;
    input.buffer = '42';
    input.liftPending = false;
    const result = input.commit();
    expect(result).toBe(true);
    expect(stack.peek()).toBe(42);
    expect(input.buffer).toBe('');
  });

  it('overwrites X when liftPending', () => {
    stack.push(99);
    input.buffer = '42';
    input.liftPending = true;
    input.commit();
    expect(stack.peek()).toBe(42);
  });

  it('returns false when buffer is empty', () => {
    expect(input.commit()).toBe(false);
  });

  it('liftStack pushes peek and sets flags', () => {
    stack.push(7);
    input.liftStack();
    expect(stack.stack[0]).toBe(7);
    expect(stack.stack[1]).toBe(7);
    expect(input.buffer).toBe('');
    expect(input.isNewEntry).toBe(false);
    expect(input.liftPending).toBe(true);
  });
});
