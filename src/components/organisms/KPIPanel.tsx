import React from 'react';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { SummaryStats } from '../../types';
import { KPICard } from '../atoms/KPICard';

interface KPIPanelProps {
  summaryStats: SummaryStats;
  formatCurrency: (val: number) => string;
  formatTableCurrency: (val: number) => string;
}

export function KPIPanel({ summaryStats, formatCurrency, formatTableCurrency }: KPIPanelProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        label="Active Headcount"
        value={summaryStats.activeHeadcount.toLocaleString()}
        sublabel={<span className="text-emerald-600 font-medium">Excludes {10000 - summaryStats.activeHeadcount} Terminated Rows</span>}
        icon={<Users className="h-5 w-5" />}
        iconBgClass="bg-slate-100"
        iconTextClass="text-slate-600"
      />

      <KPICard
        label="Total Payroll Budget"
        value={formatCurrency(summaryStats.totalBudget)}
        sublabel="Indexed Annual Active Payroll"
        icon={<DollarSign className="h-5 w-5" />}
        iconBgClass="bg-emerald-50"
        iconTextClass="text-emerald-700"
      />

      <KPICard
        label="Average Annual Salary"
        value={formatTableCurrency(summaryStats.averageSalary)}
        sublabel={<span className="text-emerald-600 font-medium">Weighted Global Standard</span>}
        icon={<TrendingUp className="h-5 w-5" />}
        iconBgClass="bg-violet-50"
        iconTextClass="text-violet-700"
      />

      <KPICard
        label="Average Performance"
        value={`${summaryStats.averagePerformance} / 5.0`}
        sublabel={
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span 
                key={s} 
                className={`h-1 cursor-default rounded-full transition-all duration-300 ${s <= Math.round(summaryStats.averagePerformance) ? 'bg-amber-400 w-3' : 'bg-slate-200 w-1.5'}`}
              />
            ))}
          </div>
        }
        icon={<Award className="h-5 w-5" />}
        iconBgClass="bg-amber-50"
        iconTextClass="text-amber-700"
      />
    </section>
  );
}
