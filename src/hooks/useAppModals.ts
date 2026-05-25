import React, { useState } from 'react';
import { Employee, FiltersMetadata } from '../types';

export function useAppModals({
  filterOptions,
  fetchSummaryStats,
  fetchFiltersMetadata,
  fetchAnalyticalReports,
  fetchEmployeesList,
  setSeedingSuccess,
  setSeedingMessage,
  pagination,
  debouncedSearch,
  selectedCountry,
  selectedDepartment,
  selectedJobTitle,
  selectedStatus,
  sortBy,
  sortOrder
}: any) {
  // CRUD Operations Modals
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // View Details Modal
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<Employee | null>(null);

  // Add / Edit Employee Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formEmployeeId, setFormEmployeeId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job_title: 'Software Engineer',
    department: 'Engineering',
    country: 'United States',
    salary: 85000,
    status: 'Active' as 'Active' | 'On Leave' | 'Terminated',
    rating: 3,
    hire_date: new Date().toISOString().split('T')[0]
  });

  // Delete Confirmation Modal
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const openAddEmployeeModal = () => {
    setFormMode('add');
    setFormEmployeeId(null);
    setFormData({
      name: '',
      email: '',
      job_title: filterOptions?.jobTitles[0] || 'Software Engineer',
      department: filterOptions?.departments[0] || 'Engineering',
      country: filterOptions?.countries[0] || 'United States',
      salary: 100000,
      status: 'Active',
      rating: 4,
      hire_date: new Date().toISOString().split('T')[0]
    });
    setErrorMessage(null);
    setIsFormModalOpen(true);
  };

  const openEditEmployeeModal = (emp: Employee) => {
    setFormMode('edit');
    setFormEmployeeId(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      job_title: emp.job_title,
      department: emp.department,
      country: emp.country,
      salary: emp.salary,
      status: emp.status,
      rating: emp.rating,
      hire_date: emp.hire_date
    });
    setErrorMessage(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    if (!formData.name.trim()) { setErrorMessage('Employee Full Name is required.'); setIsSubmitting(false); return; }
    if (!formData.email.trim() || !formData.email.includes('@')) { setErrorMessage('Please provide a valid corporate email Address.'); setIsSubmitting(false); return; }
    if (formData.salary <= 0) { setErrorMessage('Salary must be a positive value.'); setIsSubmitting(false); return; }

    try {
      const url = formMode === 'add' ? '/api/employees' : `/api/employees/${formEmployeeId}`;
      const method = formMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsFormModalOpen(false);
        fetchSummaryStats();
        fetchFiltersMetadata();
        fetchAnalyticalReports();
        fetchEmployeesList({
          page: pagination.page, limit: pagination.limit, search: debouncedSearch, country: selectedCountry,
          department: selectedDepartment, jobTitle: selectedJobTitle, status: selectedStatus,
          sortBy, sortOrder
        });
        setSeedingSuccess(true);
        setSeedingMessage(`Successfully ${formMode === 'add' ? 'added new hire' : 'updated staff data'} for ${formData.name}.`);
        setTimeout(() => setSeedingMessage(null), 4000);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Server rejected employee inputs.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit form data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/employees/${employeeToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmployeeToDelete(null);
        fetchSummaryStats();
        fetchAnalyticalReports();
        fetchEmployeesList({
          page: pagination.page, limit: pagination.limit, search: debouncedSearch, country: selectedCountry,
          department: selectedDepartment, jobTitle: selectedJobTitle, status: selectedStatus,
          sortBy, sortOrder
        });
        setSeedingSuccess(true);
        setSeedingMessage('Employee file successfully scrubbed from corporate payroll database.');
        setTimeout(() => setSeedingMessage(null), 4000);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Server error cutting record.');
      }
    } catch (e: any) {
      alert(e.message || 'Network delay error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errorMessage,
    selectedEmployeeForView,
    setSelectedEmployeeForView,
    isFormModalOpen,
    setIsFormModalOpen,
    formMode,
    formData,
    setFormData,
    employeeToDelete,
    setEmployeeToDelete,
    openAddEmployeeModal,
    openEditEmployeeModal,
    handleFormSubmit,
    handleDeleteEmployee
  };
}
