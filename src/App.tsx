import React, { useState, useEffect } from 'react';
import { Database, Cpu } from 'lucide-react';

// Atomic Components
import { Header } from './components/organisms/Header';
import { StatusBar } from './components/organisms/StatusBar';
import { KPIPanel } from './components/organisms/KPIPanel';
import { ArchitectureTab } from './components/organisms/ArchitectureTab';
import { DashboardTab } from './components/organisms/DashboardTab';
import { DirectoryTab } from './components/organisms/DirectoryTab';
import { FormModal } from './components/organisms/FormModal';
import { ViewProfileModal } from './components/organisms/ViewProfileModal';
import { DeleteConfirmModal } from './components/organisms/DeleteConfirmModal';

// Shared Utils & Hooks
import { formatCurrency, formatTableCurrency } from './utils/formatters';
import { useFilters } from './hooks/useFilters';
import { useAnalytics } from './hooks/useAnalytics';
import { useEmployees } from './hooks/useEmployees';
import { useAppSeeder } from './hooks/useAppSeeder';
import { useAppModals } from './hooks/useAppModals';

import { TDDSystemTab } from './components/organisms/TDDSystemTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory' | 'architecture' | 'tdd'>('dashboard');

  const {
    searchTerm, setSearchTerm, debouncedSearch,
    selectedCountry, setSelectedCountry,
    selectedDepartment, setSelectedDepartment,
    selectedJobTitle, setSelectedJobTitle,
    selectedStatus, setSelectedStatus,
    filterOptions, fetchFiltersMetadata, handleClearAllFilters
  } = useFilters();

  const {
    summaryStats, countryStats, jobStats, departmentStats, salaryDistribution,
    benchmarkJobTitle, setBenchmarkJobTitle,
    fetchSummaryStats, fetchAnalyticalReports
  } = useAnalytics();

  const {
    employees, pagination, setPagination,
    isLoadingList, fetchEmployeesList
  } = useEmployees();

  // Sorting
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Load seeder logic
  const { isSeeding, seedingMessage, seedingSuccess, setSeedingMessage, handleRunSeeder } = useAppSeeder({
    fetchFiltersMetadata, fetchSummaryStats, fetchAnalyticalReports, fetchEmployeesList,
    activeTab, pagination, setPagination,
    debouncedSearch, selectedCountry, selectedDepartment, selectedJobTitle, selectedStatus,
    sortBy, sortOrder
  });

  // Load modal logic
  const {
    isSubmitting, errorMessage,
    selectedEmployeeForView, setSelectedEmployeeForView,
    isFormModalOpen, setIsFormModalOpen,
    formMode, formData, setFormData,
    employeeToDelete, setEmployeeToDelete,
    openAddEmployeeModal, openEditEmployeeModal,
    handleFormSubmit, handleDeleteEmployee
  } = useAppModals({
    filterOptions, fetchSummaryStats, fetchFiltersMetadata, fetchAnalyticalReports, fetchEmployeesList,
    setSeedingSuccess: () => {}, // Handled directly if needed, but omitted since seeder hook manages its state
    setSeedingMessage,
    pagination, debouncedSearch, selectedCountry, selectedDepartment, selectedJobTitle, selectedStatus,
    sortBy, sortOrder
  });

  // Bootup
  useEffect(() => {
    fetchFiltersMetadata();
    fetchSummaryStats();
    fetchAnalyticalReports();
  }, [fetchFiltersMetadata, fetchSummaryStats, fetchAnalyticalReports]);

  // Handle Fetching list
  useEffect(() => {
    if (activeTab === 'directory') {
      fetchEmployeesList({
        page: pagination.page, limit: pagination.limit, search: debouncedSearch,
        country: selectedCountry, department: selectedDepartment, jobTitle: selectedJobTitle, status: selectedStatus,
        sortBy, sortOrder
      });
    }
  }, [activeTab, fetchEmployeesList, pagination.page, pagination.limit, debouncedSearch, selectedCountry, selectedDepartment, selectedJobTitle, selectedStatus, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSeeding={isSeeding}
        handleRunSeeder={handleRunSeeder}
      />

      <StatusBar
        seedingMessage={seedingMessage}
        seedingSuccess={seedingSuccess}
        isSeeding={isSeeding}
        setSeedingMessage={setSeedingMessage}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <KPIPanel
          summaryStats={summaryStats}
          formatCurrency={formatCurrency}
          formatTableCurrency={formatTableCurrency}
        />

        {activeTab === 'dashboard' && (
          <DashboardTab
            countryStats={countryStats}
            jobStats={jobStats}
            departmentStats={departmentStats}
            salaryDistribution={salaryDistribution}
            benchmarkJobTitle={benchmarkJobTitle}
            setBenchmarkJobTitle={setBenchmarkJobTitle}
            filterOptions={filterOptions}
            formatCurrency={formatCurrency}
            formatTableCurrency={formatTableCurrency}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryTab
            employees={employees}
            pagination={pagination}
            setPagination={setPagination}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            debouncedSearch={debouncedSearch}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedJobTitle={selectedJobTitle}
            setSelectedJobTitle={setSelectedJobTitle}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterOptions={filterOptions}
            isLoadingList={isLoadingList}
            handleSort={handleSort}
            openAddEmployeeModal={openAddEmployeeModal}
            handleClearAllFilters={handleClearAllFilters}
            formatTableCurrency={formatTableCurrency}
            setSelectedEmployeeForView={setSelectedEmployeeForView}
            openEditEmployeeModal={openEditEmployeeModal}
            setEmployeeToDelete={setEmployeeToDelete}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureTab />}
        
        {activeTab === 'tdd' && <TDDSystemTab />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left text-xs text-slate-500">
            &copy; 2026 <strong>CompInsight Studio</strong> &bull; Crafted specifically for senior HR Audit managers.
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 tracking-wider uppercase font-medium">
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded">
              <Database className="h-3 w-3 text-emerald-500" />
              Engine: Relational SQLite Index v3
            </span>
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded">
              <Cpu className="h-3 w-3 text-emerald-500" />
              Scale: 10,000 active rows
            </span>
          </div>
        </div>
      </footer>

      <FormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        filterOptions={filterOptions}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        handleFormSubmit={handleFormSubmit}
      />
      
      <ViewProfileModal 
        selectedEmployeeForView={selectedEmployeeForView}
        setSelectedEmployeeForView={setSelectedEmployeeForView}
        openEditEmployeeModal={openEditEmployeeModal}
        setEmployeeToDelete={setEmployeeToDelete}
        formatCurrency={formatCurrency}
        formatTableCurrency={formatTableCurrency}
        countryStats={countryStats}
      />
      
      <DeleteConfirmModal 
        employeeToDelete={employeeToDelete}
        setEmployeeToDelete={setEmployeeToDelete}
        handleDeleteEmployee={handleDeleteEmployee}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
