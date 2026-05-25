import { useState, useCallback } from 'react';
import { Employee, Pagination } from '../types';

interface FetchOptions {
  page: number;
  limit: number;
  search: string;
  country: string;
  department: string;
  jobTitle: string;
  status: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalCount: 0,
    page: 1,
    limit: 15,
    totalPages: 0,
  });
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchEmployeesList = useCallback(async (options: FetchOptions) => {
    setIsLoadingList(true);
    setErrorMessage(null);
    try {
      const queryParams = new URLSearchParams({
        page: options.page.toString(),
        limit: options.limit.toString(),
        search: options.search,
        country: options.country,
        department: options.department,
        jobTitle: options.jobTitle,
        status: options.status,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder
      });

      const res = await fetch(`/api/employees?${queryParams.toString()}`);
      if (res.ok) {
        const body = await res.json();
        setEmployees(body.data);
        setPagination(body.pagination);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || 'Failed to query database records.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network connectivity error.');
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  return {
    employees,
    pagination,
    setPagination,
    isLoadingList,
    listErrorMessage: errorMessage,
    fetchEmployeesList
  };
}
