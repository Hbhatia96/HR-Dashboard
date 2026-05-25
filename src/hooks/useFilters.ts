import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  setSearchTerm as rSetSearchTerm,
  setDebouncedSearch as rSetDebouncedSearch,
  setSelectedCountry as rSetSelectedCountry,
  setSelectedDepartment as rSetSelectedDepartment,
  setSelectedJobTitle as rSetSelectedJobTitle,
  setSelectedStatus as rSetSelectedStatus,
  setFilterOptions,
  clearAllFilters
} from '../store/slices/filtersSlice';

export function useFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);

  // Debounce search input to avoid API hammer
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(rSetDebouncedSearch(filters.searchTerm));
    }, 450);
    return () => clearTimeout(timer);
  }, [filters.searchTerm, dispatch]);

  const fetchFiltersMetadata = useCallback(async () => {
    try {
      const res = await fetch('/api/filters');
      if (res.ok) {
        const data = await res.json();
        dispatch(setFilterOptions(data));
      }
    } catch (e) {
      console.error('Failed to load metadata dropdown options:', e);
    }
  }, [dispatch]);

  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
  };

  return {
    searchTerm: filters.searchTerm,
    setSearchTerm: (val: string) => dispatch(rSetSearchTerm(val)),
    debouncedSearch: filters.debouncedSearch,
    selectedCountry: filters.selectedCountry,
    setSelectedCountry: (val: string) => dispatch(rSetSelectedCountry(val)),
    selectedDepartment: filters.selectedDepartment,
    setSelectedDepartment: (val: string) => dispatch(rSetSelectedDepartment(val)),
    selectedJobTitle: filters.selectedJobTitle,
    setSelectedJobTitle: (val: string) => dispatch(rSetSelectedJobTitle(val)),
    selectedStatus: filters.selectedStatus,
    setSelectedStatus: (val: string) => dispatch(rSetSelectedStatus(val)),
    filterOptions: filters.filterOptions,
    fetchFiltersMetadata,
    handleClearAllFilters
  };
}
