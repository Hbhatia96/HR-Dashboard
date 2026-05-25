import React from 'react';
import { DepartmentStat } from '../../types';

interface DepartmentAuditListProps {
  departmentStats: DepartmentStat[];
  formatCurrency: (val: number) => string;
  formatTableCurrency: (val: number) => string;
}

export function DepartmentAuditList({ departmentStats, formatCurrency, formatTableCurrency }: DepartmentAuditListProps) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 lg:col-span-12 xl:col-span-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Department Auditing</h3>
            <p className="text-xs text-slate-500">Distribution of payroll allocations across key operating departments.</p>
          </div>
        </div>

        <div className="space-y-3 font-sans">
          {departmentStats.map((dept, index) => {
            const maxBudget = Math.max(...departmentStats.map(d => d.totalBudget), 1);
            const percentOfMax = (dept.totalBudget / maxBudget) * 100;

            return (
              <div key={dept.department} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{dept.department}</span>
                  <span className="font-mono text-slate-500">
                    {dept.count.toLocaleString()} staff &bull; <strong>{formatCurrency(dept.totalBudget)}</strong>
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentOfMax}%`, backgroundColor: index === 0 ? '#4f46e5' : index === 1 ? '#0ea5e9' : index === 2 ? '#10b981' : '#64748b' }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                  <span>Avg Salary: {formatTableCurrency(dept.averageSalary)}</span>
                  <span>Share rank: #{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/40 rounded-lg p-2.5 text-[10px] text-slate-500 font-medium text-center mt-4">
        Full 10,000 organizational structure synced to SQLite disk engine.
      </div>
    </div>
  );
}
