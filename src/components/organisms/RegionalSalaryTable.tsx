import React from 'react';
import { Globe, AlertCircle } from 'lucide-react';
import { CountryStat } from '../../types';

interface RegionalSalaryTableProps {
  countryStats: CountryStat[];
  formatCurrency: (val: number) => string;
  formatTableCurrency: (val: number) => string;
}

export function RegionalSalaryTable({ countryStats, formatCurrency, formatTableCurrency }: RegionalSalaryTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 lg:col-span-12 xl:col-span-7 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Regional Salary Baselines</h3>
            <p className="text-xs text-slate-500">Aggregate statistics grouped by localized country operational offices.</p>
          </div>
          <Globe className="h-4 w-4 text-slate-400 animate-spin-slow" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3 text-right">Employees</th>
                <th className="py-2.5 px-3 text-right">Min Salary</th>
                <th className="py-2.5 px-3 text-right bg-emerald-50/40 text-emerald-700 font-bold">Average Salary</th>
                <th className="py-2.5 px-3 text-right">Max Salary</th>
                <th className="py-2.5 px-3 text-right">Total Payroll</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {countryStats.map((stat) => (
                <tr key={stat.country} className="hover:bg-slate-50/60 even:bg-slate-50/20 transition-all duration-100 group">
                  <td className="py-3 px-3 font-medium text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-110 transition-transform"></span>
                    {stat.country}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs">{stat.count.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-slate-500">{formatTableCurrency(stat.minSalary)}</td>
                  <td className="py-3 px-3 text-right font-mono text-xs font-bold text-emerald-700 bg-emerald-50/20">{formatTableCurrency(stat.averageSalary)}</td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-slate-500">{formatTableCurrency(stat.maxSalary)}</td>
                  <td className="py-3 px-3 text-right font-mono text-xs font-medium">{formatCurrency(stat.totalBudget)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 mt-4 flex items-start gap-2.5 border border-slate-100">
        <AlertCircle className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-slate-600 leading-normal">
          <strong>HR Strategic Note:</strong> Standard country multipliers apply. Operating countries are set in local ratios. US base multiplier is 1.35x. Singapore and Australia maintain high parity, with APAC operational hubs (India) utilizing standard engineering talent pools scaling base rates.
        </p>
      </div>
    </div>
  );
}
