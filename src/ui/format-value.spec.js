import { describe, it, expect } from 'vitest';
import { formatValue } from './format-value.js';

describe('formatValue', () => {
  it('formats integers below 1e12 as plain strings', () => {
    expect(formatValue(42)).toBe('42');
    expect(formatValue(0)).toBe('0');
    expect(formatValue(-100)).toBe('-100');
  });

  it('formats Infinity', () => {
    expect(formatValue(Infinity)).toBe('Infinity');
    expect(formatValue(-Infinity)).toBe('-Infinity');
  });

  it('formats NaN', () => {
    expect(formatValue(NaN)).toBe('NaN');
  });

  it('formats float with 12 significant digits', () => {
    const result = formatValue(Math.PI);
    expect(result).toBe('3.14159265359');
  });

  it('formats non-integer large numbers with toPrecision(12)', () => {
    const result = formatValue(1.5e15);
    expect(result).toBe('1500000000000000');
  });
});
