import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  sublabel?: string | React.ReactNode;
  icon: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
}

export function KPICard({ label, value, sublabel, icon, iconBgClass, iconTextClass }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4.5 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">{label}</span>
        <span className="text-3xl font-display font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        {sublabel && (
          <div className="text-[10px] text-slate-500">{sublabel}</div>
        )}
      </div>
      <div className={`rounded-xl p-3 ${iconBgClass} ${iconTextClass}`}>
        {icon}
      </div>
    </div>
  );
}
