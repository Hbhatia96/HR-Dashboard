import React from 'react';
import { Cpu } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { JobStat, FiltersMetadata } from '../../types';

interface JobTitleBenchmarkChartProps {
  jobStats: JobStat[];
  benchmarkJobTitle: string;
  setBenchmarkJobTitle: (title: string) => void;
  filterOptions: FiltersMetadata;
  formatCurrency: (val: number) => string;
}

export function JobTitleBenchmarkChart({ 
  jobStats, benchmarkJobTitle, setBenchmarkJobTitle, filterOptions, formatCurrency 
}: JobTitleBenchmarkChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 lg:col-span-12 xl:col-span-5 flex flex-col h-full">
      <div className="flex flex-col shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Job Title Benchmarking</h3>
            <p className="text-xs text-slate-500">Analyze average regional salaries.</p>
          </div>
          <div>
            <select
              value={benchmarkJobTitle}
              onChange={(e) => setBenchmarkJobTitle(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2.5 text-xs text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[200px]"
              id="benchmark-title-select"
            >
              {filterOptions.jobTitles && filterOptions.jobTitles.length > 0 ? (
                filterOptions.jobTitles.map((t) => <option key={`jtb-${t}`} value={t}>{t}</option>)
              ) : (
                <>
                  <option key="se" value="Software Engineer">Software Engineer</option>
                  <option key="pm" value="Product Manager">Product Manager</option>
                  <option key="tl" value="Technical Lead">Tech Lead</option>
                  <option key="em" value="Engineering Manager">Engineering Manager</option>
                  <option key="ux" value="UX Designer">UX Designer</option>
                  <option key="hr" value="HR Manager">HR Manager</option>
                </>
              )}
            </select>
          </div>
        </div>

        {jobStats.length > 0 ? (
          <div className="flex-1 min-h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={jobStats} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="country" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" tickFormatter={(tick) => '$' + (tick / 1000) + 'k'} />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Average Salary']} contentStyle={{ fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <Bar dataKey="averageSalary" radius={[4, 4, 0, 0]}>
                  {jobStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.country === 'United States' ? '#059669' : '#0f172a'} />
                  ))}
                </Bar>

              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 min-h-[250px] flex flex-col items-center justify-center text-slate-400 gap-2">
            <Cpu className="h-8 w-8 animate-spin text-slate-300" />
            <span className="text-xs font-mono">Running query aggregate on index...</span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-3.5 space-y-2 mt-4">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Benchmarked Countries list</span>
        <div className="flex flex-wrap gap-1.5">
          {jobStats.map((stat) => (
            <span key={stat.country} className="text-[10px] font-mono bg-slate-100 text-slate-600 py-0.5 px-2 rounded">
              {stat.country}: <strong>{formatCurrency(stat.averageSalary)}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
