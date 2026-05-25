import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { SalaryRangeBucket } from '../../types';

interface SalaryCurveChartProps {
  salaryDistribution: SalaryRangeBucket[];
}

export function SalaryCurveChart({ salaryDistribution }: SalaryCurveChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 lg:col-span-12 xl:col-span-7 flex flex-col h-full">
      <div className="flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 font-sans">Organizational Salary Curve</h3>
            <p className="text-xs text-slate-500">Bell curve showing headcount frequency across standard compensation buckets.</p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-bold">
            Bell Distribution Curve
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={salaryDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="rangeLabel" tick={{ fontSize: 9, fill: '#64748b' }} stroke="#e2e8f0" />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" />
            <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Employees']} contentStyle={{ fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]}>
              {salaryDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.rangeLabel.includes('k - $120k') || entry.rangeLabel.includes('k - $90k') ? '#4f46e5' : '#818cf8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
