import { useState, useCallback } from 'react';
import { 
  SummaryStats, 
  CountryStat, 
  JobStat, 
  DepartmentStat, 
  SalaryRangeBucket 
} from '../types';

export function useAnalytics() {
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    activeHeadcount: 0,
    totalBudget: 0,
    averageSalary: 0,
    averagePerformance: 0,
  });
  const [countryStats, setCountryStats] = useState<CountryStat[]>([]);
  const [jobStats, setJobStats] = useState<JobStat[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [salaryDistribution, setSalaryDistribution] = useState<SalaryRangeBucket[]>([]);
  
  const [benchmarkJobTitle, setBenchmarkJobTitle] = useState('Software Engineer');

  const fetchSummaryStats = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/summary');
      if (res.ok) {
        const data = await res.json();
        setSummaryStats(data);
      }
    } catch (e) {
      console.error('Failed to load summary payroll metrics:', e);
    }
  }, []);

  const fetchAnalyticalReports = useCallback(async () => {
    try {
      const [countriesRes, deptsRes, distRes, jobsRes] = await Promise.all([
        fetch('/api/analytics/country-stats'),
        fetch('/api/analytics/department-stats'),
        fetch('/api/analytics/salary-distribution'),
        fetch(`/api/analytics/job-stats?jobTitle=${encodeURIComponent(benchmarkJobTitle)}`)
      ]);

      if (countriesRes.ok) setCountryStats(await countriesRes.json());
      if (deptsRes.ok) setDepartmentStats(await deptsRes.json());
      if (distRes.ok) setSalaryDistribution(await distRes.json());
      if (jobsRes.ok) setJobStats(await jobsRes.json());
    } catch (e) {
      console.error('Failed to collect analytic reports:', e);
    }
  }, [benchmarkJobTitle]);

  return {
    summaryStats,
    countryStats,
    jobStats,
    departmentStats,
    salaryDistribution,
    benchmarkJobTitle,
    setBenchmarkJobTitle,
    fetchSummaryStats,
    fetchAnalyticalReports
  };
}
