import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ArchitectureTab } from '../src/components/organisms/ArchitectureTab';
import { DepartmentAuditList } from '../src/components/organisms/DepartmentAuditList';
import { JobTitleBenchmarkChart } from '../src/components/organisms/JobTitleBenchmarkChart';
import { KPIPanel } from '../src/components/organisms/KPIPanel';
import { RegionalSalaryTable } from '../src/components/organisms/RegionalSalaryTable';
import { SalaryCurveChart } from '../src/components/organisms/SalaryCurveChart';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('Organisms - Charts & Stats', () => {
  it('ArchitectureTab renders', () => {
    const { container } = render(<ArchitectureTab />);
    expect(container).toBeDefined();
  });

  it('DepartmentAuditList renders', () => {
    const { container } = render(<DepartmentAuditList 
      departmentStats={[{ department: 'IT', avg: 1000, count: 5 }] as any} 
      formatCurrency={(v: any) => String(v)} 
      formatTableCurrency={(v: any) => String(v)} 
    />);
    expect(container).toBeDefined();
  });

  it('JobTitleBenchmarkChart renders', () => {
    const { container } = render(<JobTitleBenchmarkChart 
      jobStats={[{ job_title: 'Dev', count: 10, averageSalary: 100, country: 'USA' }, { job_title: 'QA', count: 10, averageSalary: 100, country: 'UK' }] as any} 
      benchmarkJobTitle="All" 
      setBenchmarkJobTitle={vi.fn()}
      filterOptions={{ jobTitles: ['Dev', 'QA'] } as any}
      formatCurrency={(v: any) => String(v)} 
    />);
    expect(container).toBeDefined();
  });

  it('KPIPanel renders', () => {
    const { container } = render(<KPIPanel 
      summaryStats={{ activeHeadcount: 10, totalBudget: 100, averageSalary: 10, averagePerformance: 0 }}
      formatCurrency={(v: any) => String(v)} 
      formatTableCurrency={(v: any) => String(v)} 
    />);
    expect(container).toBeDefined();
  });

  it('RegionalSalaryTable renders', () => {
    const { container } = render(<RegionalSalaryTable 
      countryStats={[{ country: 'USA', averageSalary: 100, minSalary: 50, maxSalary: 200, count: 10, totalBudget: 1000 }]} 
      formatCurrency={(v: any) => String(v)} 
      formatTableCurrency={(v: any) => String(v)} 
    />);
    expect(container).toBeDefined();
  });

  it('SalaryCurveChart renders', () => {
    const { container } = render(<SalaryCurveChart 
      salaryDistribution={[{ rangeLabel: '0-50', count: 5, rangeOrder: 1 }]} 
    />);
    expect(container).toBeDefined();
  });
});


