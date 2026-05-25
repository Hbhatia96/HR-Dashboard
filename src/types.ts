export interface Employee {
  id: number;
  name: string;
  email: string;
  job_title: string;
  department: string;
  country: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  hire_date: string;
  rating: number;
}

export interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeResponse {
  data: Employee[];
  pagination: Pagination;
}

export interface SummaryStats {
  activeHeadcount: number;
  totalBudget: number;
  averageSalary: number;
  averagePerformance: number;
}

export interface CountryStat {
  country: string;
  count: number;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
  totalBudget: number;
}

export interface JobStat {
  job_title: string;
  country: string;
  count: number;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
}

export interface DepartmentStat {
  department: string;
  count: number;
  averageSalary: number;
  totalBudget: number;
}

export interface SalaryRangeBucket {
  rangeLabel: string;
  count: number;
  rangeOrder: number;
}

export interface FiltersMetadata {
  countries: string[];
  departments: string[];
  jobTitles: string[];
}
