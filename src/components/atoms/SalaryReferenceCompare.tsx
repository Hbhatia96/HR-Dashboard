import React from 'react';
import { Employee, CountryStat } from '../../types';

interface SalaryReferenceCompareProps {
  employee: Employee;
  countryStats: CountryStat[];
}

export function SalaryReferenceCompare({ employee, countryStats }: SalaryReferenceCompareProps) {
  const regionalAvgObject = countryStats.find(c => c.country === employee.country);
  if (!regionalAvgObject) return null;
  const regionalAvg = regionalAvgObject.averageSalary;
  const ratio = employee.salary / regionalAvg;
  const percentDiff = Math.abs(Math.round((ratio - 1) * 100));

  if (ratio > 1.25) {
    return (
      <span className="text-xs text-emerald-600 font-medium font-mono">
        (+{percentDiff}% above country avg)
      </span>
    );
  } else if (ratio < 0.75) {
    return (
      <span className="text-xs text-rose-600 font-medium font-mono">
        (-{percentDiff}% below country avg)
      </span>
    );
  } else {
    return (
      <span className="text-xs text-gray-500 font-medium font-mono">
        (Aligned with regional average)
      </span>
    );
  }
}
