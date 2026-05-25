import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { FormModal } from '../src/components/organisms/FormModal';
import { DeleteConfirmModal } from '../src/components/organisms/DeleteConfirmModal';
import { ViewProfileModal } from '../src/components/organisms/ViewProfileModal';
import { Header } from '../src/components/organisms/Header';
import { StatusBar } from '../src/components/organisms/StatusBar';

vi.mock('../src/components/atoms/ModalPortal', () => ({
  ModalPortal: ({ children }: any) => <div>{children}</div>
}));

describe('Organisms - Modals & Header', () => {
  it('FormModal renders add mode', async () => {
    const props: any = {
      isOpen: true,
      formMode: 'add' as const,
      selectedEmployee: null,
      formData: { email: '', salary: 10, hire_date: '' },
      setFormData: vi.fn(),
      filterOptions: { countries: ['US'], departments: ['IT'], jobTitles: ['Dev'], statuses: ['Active'] },
      onClose: vi.fn(),
      fetchData: vi.fn(),
      setFetchError: vi.fn()
    };
    const { container, findByText } = render(<FormModal {...props} />);
    const submitBtn = await findByText('Commit File');
    expect(await findByText('Onboard New Employee Record')).toBeDefined();

    const inputs = container.querySelectorAll('input');
    if (inputs[0]) fireEvent.change(inputs[0], { target: { value: 'Test User' } });
    if (inputs[1]) fireEvent.change(inputs[1], { target: { value: 'a@a.com' } });
    if (inputs[2]) fireEvent.change(inputs[2], { target: { value: '2000' } });
    inputs.forEach(input => {
      if (input.type === 'date') fireEvent.change(input, { target: { value: '2023-01-01' } });
    });

    const selects = container.querySelectorAll('select');
    if (selects[0]) fireEvent.change(selects[0], { target: { value: 'IT' } });
    if (selects[1]) fireEvent.change(selects[1], { target: { value: 'Dev' } });
    if (selects[2]) fireEvent.change(selects[2], { target: { value: 'US' } });
    if (selects[3]) fireEvent.change(selects[3], { target: { value: 'Terminated' } });
    if (selects[4]) fireEvent.change(selects[4], { target: { value: '5' } });
    
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    fireEvent.click(submitBtn);
    
    // form errors
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: 'Failed' }) });
    fireEvent.click(submitBtn);

    // exception
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));
    fireEvent.click(submitBtn);

    const closeBtn = container.querySelector('.lucide-x')?.parentElement;
    if (closeBtn) fireEvent.click(closeBtn);
    fireEvent.click(await findByText('Cancel'));
    
    // Test backdrop click
    const backdrop = container.querySelector('.fixed.inset-0.bg-slate-900\\/60');
    if (backdrop) fireEvent.click(backdrop);
  });

  it('FormModal renders edit mode', async () => {
    const props: any = {
      isOpen: true,
      formMode: 'edit' as const,
      selectedEmployee: { id: 1, name: 'John', email: 'j@e.com', job_title: 'Dev', department: 'IT', country: 'USA', salary: 1000, hire_date: '2022-01-01', status: 'Active' } as any,
      formData: { name: 'John' },
      setFormData: vi.fn(),
      filterOptions: { countries: [], departments: [], jobTitles: [], statuses: [] },
      onClose: vi.fn(),
      fetchData: vi.fn(),
      setFetchError: vi.fn()
    };
    const { findByText } = render(<FormModal {...props} />);
    expect(await findByText('Amend Employee Registry File')).toBeDefined();
  });

  it('DeleteConfirmModal renders and handles interactions', async () => {
    const props = {
      employeeToDelete: { id: 1, name: 'John Doe' } as any,
      setEmployeeToDelete: vi.fn(),
      handleDeleteEmployee: vi.fn(),
      isSubmitting: false
    };
    // Need to test without employee as well
    render(<DeleteConfirmModal {...props} employeeToDelete={null} />);

    const { container, findByText } = render(<DeleteConfirmModal {...props} />);
    
    const confirmBtn = await findByText('Confirm Termination');
    fireEvent.click(confirmBtn);

    const cancelBtn = await findByText('Cancel');
    fireEvent.click(cancelBtn);

    // Test backdrop click
    const backdrop = container.querySelector('.fixed.inset-0.bg-slate-900\\/60');
    if (backdrop) fireEvent.click(backdrop);
  });

  it('ViewProfileModal renders and handles closing', async () => {
    const props = {
      selectedEmployeeForView: { id: 1, name: 'John', email: 'j@e.com', job_title: 'Dev', department: 'IT', country: 'United States', salary: 1000, hire_date: '2022', status: 'Active' } as any,
      setSelectedEmployeeForView: vi.fn(),
      openEditEmployeeModal: vi.fn(),
      setEmployeeToDelete: vi.fn(),
      countryStats: [{ country: 'United States', averageSalary: 110000 }] as any,
      formatCurrency: (val: any) => val.toString(),
      formatTableCurrency: (val: any) => val.toString()
    };
    render(<ViewProfileModal {...props} selectedEmployeeForView={null} />);

    const { container, getByText } = render(<ViewProfileModal {...props} />);
    
    fireEvent.click(getByText('Edit File'));
    fireEvent.click(getByText('Terminate Record'));

    // Test backdrop click
    const backdrop = container.querySelector('.fixed.inset-0.bg-slate-900\\/60');
    if (backdrop) fireEvent.click(backdrop);
  });

  it('Header renders', () => {
    const { getByText } = render(<Header activeTab="dashboard" setActiveTab={vi.fn()} isSeeding={false} handleRunSeeder={vi.fn()} />);
    expect(getByText('CompInsight Studio')).toBeDefined();
    
    fireEvent.click(getByText('Salary Insights'));
    fireEvent.click(getByText('Employee Directory'));
    fireEvent.click(getByText('Design'));
    fireEvent.click(getByText('Reset & Seed 10K Rows'));
  });

  it('StatusBar renders', () => {
    render(<StatusBar seedingMessage="OK" seedingSuccess={true} isSeeding={false} setSeedingMessage={vi.fn()} />);
  });
});










