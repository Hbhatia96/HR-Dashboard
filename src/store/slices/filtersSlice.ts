import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltersMetadata } from '../../types';

interface FiltersState {
  searchTerm: string;
  debouncedSearch: string;
  selectedCountry: string;
  selectedDepartment: string;
  selectedJobTitle: string;
  selectedStatus: string;
  filterOptions: FiltersMetadata;
}

const initialState: FiltersState = {
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

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setDebouncedSearch: (state, action: PayloadAction<string>) => {
      state.debouncedSearch = action.payload;
    },
    setSelectedCountry: (state, action: PayloadAction<string>) => {
      state.selectedCountry = action.payload;
    },
    setSelectedDepartment: (state, action: PayloadAction<string>) => {
      state.selectedDepartment = action.payload;
    },
    setSelectedJobTitle: (state, action: PayloadAction<string>) => {
      state.selectedJobTitle = action.payload;
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload;
    },
    setFilterOptions: (state, action: PayloadAction<FiltersMetadata>) => {
      state.filterOptions = action.payload;
    },
    clearAllFilters: (state) => {
      state.searchTerm = '';
      state.debouncedSearch = '';
      state.selectedCountry = 'ALL';
      state.selectedDepartment = 'ALL';
      state.selectedJobTitle = 'ALL';
      state.selectedStatus = 'ALL';
    },
  },
});

export const {
  setSearchTerm,
  setDebouncedSearch,
  setSelectedCountry,
  setSelectedDepartment,
  setSelectedJobTitle,
  setSelectedStatus,
  setFilterOptions,
  clearAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
