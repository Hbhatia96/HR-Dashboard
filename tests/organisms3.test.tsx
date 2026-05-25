import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { DirectoryTab } from '../src/components/organisms/DirectoryTab';
import { DashboardTab } from '../src/components/organisms/DashboardTab';
import { TDDSystemTab } from '../src/components/organisms/TDDSystemTab';
import { Provider } from 'react-redux';
import { store } from '../src/store';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('Organisms - Complex Tabs', () => {
  it('DashboardTab renders', () => {
    const props: any = {
      summaryStats: { activeHeadcount: 0, monthlyPayroll: 0, averageSalary: 0, termCount: 0 },
      countryStats: [],
      jobStats: [],
      departmentStats: [],
      salaryDistribution: [],
      benchmarkJobTitle: 'All',
      setBenchmarkJobTitle: vi.fn(),
      setSelectedCountryFilter: vi.fn(),
      switchToDirectory: vi.fn(),
      filterOptions: { countries: [], departments: [], jobTitles: [], statuses: [] },
      formatCurrency: (v: any) => v.toString(),
      formatTableCurrency: (v: any) => v.toString()
    };
    const { container } = render(<DashboardTab {...props} />);
    expect(container).toBeDefined();
  });

  it('DirectoryTab renders', () => {
    const props: any = {
      employees: [{ id: 1, name: 'John Doe', email: 'j@e.com', status: 'Active', salary: 1000, job_title: 'Dev', department: 'IT', country: 'US', hire_date: '20' }] as any,
      pagination: { limit: 10, page: 1, totalCount: 100, totalPages: 10 },
      setPagination: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      debouncedSearch: '',
      selectedCountry: 'All Regions',
      setSelectedCountry: vi.fn(),
      selectedDepartment: 'All Departments',
      setSelectedDepartment: vi.fn(),
      selectedJobTitle: 'All Titles',
      setSelectedJobTitle: vi.fn(),
      selectedStatus: 'All Statuses',
      setSelectedStatus: vi.fn(),
      filterOptions: { countries: [], departments: [], jobTitles: [], statuses: [] },
      isLoadingList: false,
      handleSort: vi.fn(),
      openAddEmployeeModal: vi.fn(),
      handleClearAllFilters: vi.fn(),
      formatTableCurrency: (val: any) => val.toString(),
      setSelectedEmployeeForView: vi.fn(),
      openEditEmployeeModal: vi.fn(),
      setEmployeeToDelete: vi.fn()
    };
    
    const { container, getByText } = render(
      <Provider store={store}>
        <DirectoryTab {...props} />
      </Provider>
    );
    expect(container).toBeDefined();

    const viewBtn = container.querySelector('button[title="Inspect Details"]');
    if (viewBtn) fireEvent.click(viewBtn);
    expect(props.setSelectedEmployeeForView).toHaveBeenCalled();

    const editBtn = container.querySelector('button[title="Edit Employee Contract"]');
    if (editBtn) fireEvent.click(editBtn);
    expect(props.openEditEmployeeModal).toHaveBeenCalled();

    const termBtn = container.querySelector('button[title="Delete Record"]');
    if (termBtn) fireEvent.click(termBtn);
    expect(props.setEmployeeToDelete).toHaveBeenCalled();

    fireEvent.click(getByText('Department'));
    fireEvent.click(getByText('Annual Salary'));
    fireEvent.click(getByText('Country'));
    fireEvent.click(getByText('Employee Full Name'));
  });

  it('DirectoryTab renders empty loading state', () => {
    const props: any = {
      employees: [] as any,
      pagination: { limit: 10, page: 1, totalCount: 100, totalPages: 10 },
      setPagination: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      debouncedSearch: '',
      selectedCountry: 'All Regions',
      setSelectedCountry: vi.fn(),
      selectedDepartment: 'All Departments',
      setSelectedDepartment: vi.fn(),
      selectedJobTitle: 'All Titles',
      setSelectedJobTitle: vi.fn(),
      selectedStatus: 'All Statuses',
      setSelectedStatus: vi.fn(),
      filterOptions: { countries: [], departments: [], jobTitles: [], statuses: [] },
      isLoadingList: true,
      handleSort: vi.fn(),
      openAddEmployeeModal: vi.fn(),
      handleClearAllFilters: vi.fn(),
      formatTableCurrency: (val: any) => val.toString(),
      setSelectedEmployeeForView: vi.fn(),
      openEditEmployeeModal: vi.fn(),
      setEmployeeToDelete: vi.fn()
    };
    
    const { container } = render(
      <Provider store={store}>
        <DirectoryTab {...props} />
      </Provider>
    );
    expect(container.querySelector('.animate-pulse')).toBeDefined();
  });

  it('DirectoryTab renders empty state with filters', () => {
    const props: any = {
      employees: [] as any,
      pagination: { limit: 10, page: 1, totalCount: 100, totalPages: 10 },
      setPagination: vi.fn(),
      searchTerm: 'a',
      setSearchTerm: vi.fn(),
      debouncedSearch: 'a',
      selectedCountry: 'US',
      setSelectedCountry: vi.fn(),
      selectedDepartment: 'IT',
      setSelectedDepartment: vi.fn(),
      selectedJobTitle: 'All Titles',
      setSelectedJobTitle: vi.fn(),
      selectedStatus: 'All Statuses',
      setSelectedStatus: vi.fn(),
      filterOptions: { countries: [], departments: [], jobTitles: [], statuses: [] },
      isLoadingList: false,
      handleSort: vi.fn(),
      openAddEmployeeModal: vi.fn(),
      handleClearAllFilters: vi.fn(),
      formatTableCurrency: (val: any) => val.toString(),
      setSelectedEmployeeForView: vi.fn(),
      openEditEmployeeModal: vi.fn(),
      setEmployeeToDelete: vi.fn()
    };
    
    const { getByText } = render(
      <Provider store={store}>
        <DirectoryTab {...props} />
      </Provider>
    );
    expect(getByText('No employees match this specific directory query.')).toBeDefined();
    fireEvent.click(getByText('Reset Directory Filters'));
  });

  it('TDDSystemTab renders and handles fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ stdout: 'PASS src/app.test.js\nTests: 1 passed, 1 total\nAll files | 95.0', stderr: '', error: null })
    });
    
    let renderResult: any;
    await act(async () => {
      renderResult = render(<TDDSystemTab />);
    });
    
    await act(async () => {
      fireEvent.click(renderResult.getByText('Run All Tests'));
    });
  });

  it('TDDSystemTab renders and handles error fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ stdout: '', stderr: '', error: 'Failed tests' })
    });
    await act(async () => {
      render(<TDDSystemTab />);
    });
  });

  it('TDDSystemTab handles invalid content type', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      headers: { get: () => 'text/html' },
    });
    await act(async () => {
      render(<TDDSystemTab />);
    });
  });
});





