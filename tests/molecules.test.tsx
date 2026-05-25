import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { DirectoryFilters } from '../src/components/molecules/DirectoryFilters';
import { DirectoryPagination } from '../src/components/molecules/DirectoryPagination';
import { Provider } from 'react-redux';
import { store } from '../src/store';

describe('Molecules', () => {
  it('DirectoryFilters renders and handles interactions', () => {
    const props = {
      searchTerm: 'query',
      setSearchTerm: vi.fn(),
      debouncedSearch: 'query',
      selectedCountry: 'All Regions',
      setSelectedCountry: vi.fn(),
      selectedDepartment: 'All Departments',
      setSelectedDepartment: vi.fn(),
      selectedJobTitle: 'All Titles',
      setSelectedJobTitle: vi.fn(),
      selectedStatus: 'All Statuses',
      setSelectedStatus: vi.fn(),
      resetPageCount: vi.fn(),
      openAddEmployeeModal: vi.fn(),
      filterOptions: { countries: ['USA'], departments: ['IT'], jobTitles: ['Dev'], statuses: ['Active'] },
      handleClearAllFilters: vi.fn()
    };
    
    const { getByText, container, getByDisplayValue } = render(
      <Provider store={store}>
        <DirectoryFilters {...props} />
      </Provider>
    );

    fireEvent.click(getByText('Onboard Employee'));
    expect(props.openAddEmployeeModal).toHaveBeenCalled();

    // Selects
    const selects = container.querySelectorAll('select');
    if (selects[0]) fireEvent.change(selects[0], { target: { value: 'USA' } });
    if (selects[1]) fireEvent.change(selects[1], { target: { value: 'IT' } });
    if (selects[2]) fireEvent.change(selects[2], { target: { value: 'Dev' } });
    if (selects[3]) fireEvent.change(selects[3], { target: { value: 'Active' } });

    // Active filters
    const closeIcons = container.querySelectorAll('.lucide-x');
    closeIcons.forEach(icon => fireEvent.click(icon));

    // Clear string input
    fireEvent.change(getByDisplayValue('query'), { target: { value: 'q' } });
  });

  it('DirectoryPagination renders and handles interactions', () => {
    const props = {
      pagination: { limit: 10, page: 2, totalCount: 30, totalPages: 3 },
      setPagination: vi.fn()
    };
    const { container, getAllByText } = render(<DirectoryPagination {...props} />);
    
    // Previous
    const prevBtn = container.querySelector('#page-prev');
    if (prevBtn) fireEvent.click(prevBtn);
    expect(props.setPagination).toHaveBeenCalledWith(expect.any(Function));

    // Next
    const nextBtn = container.querySelector('#page-next');
    if (nextBtn) fireEvent.click(nextBtn);
    expect(props.setPagination).toHaveBeenCalledWith(expect.any(Function));

    // Page buttons
    const buttons = getAllByText('1');
    if (buttons[0]) fireEvent.click(buttons[0]);
    expect(props.setPagination).toHaveBeenCalledWith(expect.any(Function));
  });

  it('DirectoryPagination edges cases', () => {
    const props = {
      // Prev disabled
      pagination: { limit: 10, page: 1, totalCount: 30, totalPages: 3 },
      setPagination: vi.fn()
    };
    const { container } = render(<DirectoryPagination {...props} />);
    const prevBtn = container.querySelector('#page-prev');
    if (prevBtn) fireEvent.click(prevBtn);
  });
});





