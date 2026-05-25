import { describe, it, expect } from 'vitest';
import reducer, {
  setSearchTerm,
  setDebouncedSearch,
  setSelectedCountry,
  setSelectedDepartment,
  setSelectedJobTitle,
  setSelectedStatus,
  clearAllFilters
} from './filtersSlice';

describe('filtersSlice reducer', () => {
  const initialState = {
    searchTerm: '',
    debouncedSearch: '',
    selectedCountry: 'ALL',
    selectedDepartment: 'ALL',
    selectedJobTitle: 'ALL',
    selectedStatus: 'ALL',
    filterOptions: {
      countries: [],
      departments: [],
      jobTitles: [],
    },
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSearchTerm', () => {
    const actual = reducer(initialState, setSearchTerm('John Doe'));
    expect(actual.searchTerm).toEqual('John Doe');
  });

  it('should handle setDebouncedSearch', () => {
    const actual = reducer(initialState, setDebouncedSearch('John'));
    expect(actual.debouncedSearch).toEqual('John');
  });

  it('should handle setSelectedCountry', () => {
    const actual = reducer(initialState, setSelectedCountry('United States'));
    expect(actual.selectedCountry).toEqual('United States');
  });

  it('should handle setSelectedDepartment', () => {
    const actual = reducer(initialState, setSelectedDepartment('Engineering'));
    expect(actual.selectedDepartment).toEqual('Engineering');
  });

  it('should handle setSelectedJobTitle', () => {
    const actual = reducer(initialState, setSelectedJobTitle('Developer'));
    expect(actual.selectedJobTitle).toEqual('Developer');
  });

  it('should handle setSelectedStatus', () => {
    const actual = reducer(initialState, setSelectedStatus('Active'));
    expect(actual.selectedStatus).toEqual('Active');
  });

  it('should handle clearAllFilters', () => {
    const modifiedState = {
      ...initialState,
      searchTerm: 'test',
      selectedCountry: 'Canada',
    };
    const actual = reducer(modifiedState, clearAllFilters());
    expect(actual.searchTerm).toEqual('');
    expect(actual.selectedCountry).toEqual('ALL');
  });
});
