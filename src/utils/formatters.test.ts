import { describe, it, expect } from 'vitest';
import { formatCurrency, formatTableCurrency } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats billions correctly', () => {
      expect(formatCurrency(1500000000)).toBe('$1.50B');
    });

    it('formats millions correctly', () => {
      expect(formatCurrency(2500000)).toBe('$2.5M');
    });

    it('formats thousands correctly', () => {
      expect(formatCurrency(50000)).toBe('$50,000');
    });
  });

  describe('formatTableCurrency', () => {
    it('formats numbers to USD correctly', () => {
      expect(formatTableCurrency(123456)).toBe('$123,456');
    });
  });
});
