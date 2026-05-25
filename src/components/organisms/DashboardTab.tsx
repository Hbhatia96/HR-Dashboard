import React from 'react';
import { CountryStat, JobStat, DepartmentStat, SalaryRangeBucket, FiltersMetadata } from '../../types';
import { RegionalSalaryTable } from './RegionalSalaryTable';
import { JobTitleBenchmarkChart } from './JobTitleBenchmarkChart';
import { SalaryCurveChart } from './SalaryCurveChart';
import { DepartmentAuditList } from './DepartmentAuditList';

interface DashboardTabProps {
  countryStats: CountryStat[];
  jobStats: JobStat[];
  departmentStats: DepartmentStat[];
  salaryDistribution: SalaryRangeBucket[];
  benchmarkJobTitle: string;
  setBenchmarkJobTitle: (title: string) => void;
  filterOptions: FiltersMetadata;
  formatCurrency: (val: number) => string;
  formatTableCurrency: (val: number) => string;
}

export function DashboardTab({
  countryStats,
  jobStats,
  departmentStats,
  salaryDistribution,
  benchmarkJobTitle,
  setBenchmarkJobTitle,
  filterOptions,
  formatCurrency,
  formatTableCurrency
}: DashboardTabProps) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SalaryCurveChart 
          salaryDistribution={salaryDistribution} 
        />
        
        <JobTitleBenchmarkChart 
          jobStats={jobStats} 
          benchmarkJobTitle={benchmarkJobTitle} 
          setBenchmarkJobTitle={setBenchmarkJobTitle} 
          filterOptions={filterOptions} 
          formatCurrency={formatCurrency} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <RegionalSalaryTable 
          countryStats={countryStats} 
          formatCurrency={formatCurrency} 
          formatTableCurrency={formatTableCurrency} 
        />
        
        <DepartmentAuditList 
          departmentStats={departmentStats} 
          formatCurrency={formatCurrency} 
          formatTableCurrency={formatTableCurrency} 
        />
      </div>
    </section>
  );
}
