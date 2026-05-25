import { useState } from 'react';

export function useAppSeeder({
  fetchFiltersMetadata,
  fetchSummaryStats,
  fetchAnalyticalReports,
  fetchEmployeesList,
  activeTab,
  pagination,
  setPagination,
  debouncedSearch,
  selectedCountry,
  selectedDepartment,
  selectedJobTitle,
  selectedStatus,
  sortBy,
  sortOrder
}: any) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingMessage, setSeedingMessage] = useState<string | null>(null);
  const [seedingSuccess, setSeedingSuccess] = useState<boolean | null>(null);

  const handleRunSeeder = async () => {
    setIsSeeding(true);
    setSeedingMessage('Deleting existing table, generating names, initializing index matrices, and bulk loading exactly 10,000 corporate records...');
    setSeedingSuccess(null);
    const start = Date.now();
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        const elapsed = Date.now() - start;
        setSeedingSuccess(true);
        setSeedingMessage(`Database reconstructed! Successfully simulated and indexed 10,000 corporate records in ${elapsed}ms.`);
        fetchFiltersMetadata();
        fetchSummaryStats();
        fetchAnalyticalReports();
        if (activeTab === 'directory') {
          setPagination((prev: any) => ({ ...prev, page: 1 }));
          fetchEmployeesList({
            page: 1, limit: pagination.limit, search: debouncedSearch, country: selectedCountry,
            department: selectedDepartment, jobTitle: selectedJobTitle, status: selectedStatus,
            sortBy, sortOrder
          });
        }
      } else {
        const err = await res.json();
        setSeedingSuccess(false);
        setSeedingMessage(err.error || 'Internal container indexing failed.');
      }
    } catch (err: any) {
      setSeedingSuccess(false);
      setSeedingMessage(err.message || 'Seeder connection timeout.');
    } finally {
      setIsSeeding(false);
    }
  };

  return {
    isSeeding,
    seedingMessage,
    seedingSuccess,
    setSeedingMessage,
    handleRunSeeder
  };
}
