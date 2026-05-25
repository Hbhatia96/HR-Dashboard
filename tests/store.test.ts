import { describe, it, expect } from 'vitest';
import { store } from '../src/store';

describe('Store Index', () => {
  it('should initialize the store properly', () => {
    const state = store.getState();
    expect(state).toHaveProperty('filters');
  });
});
