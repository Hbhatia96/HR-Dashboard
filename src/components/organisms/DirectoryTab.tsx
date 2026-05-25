import React from 'react';
import { ArrowUpDown, Cpu, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Employee, Pagination, FiltersMetadata } from '../../types';
import { DirectoryFilters } from '../molecules/DirectoryFilters';
import { DirectoryPagination } from '../molecules/DirectoryPagination';

interface DirectoryTabProps {
  employees: Employee[];
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearch: string;
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  selectedDepartment: string;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<string>>;
  selectedJobTitle: string;
  setSelectedJobTitle: React.Dispatch<React.SetStateAction<string>>;
  selectedStatus: string;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder: React.Dispatch<React.SetStateAction<'ASC' | 'DESC'>>;
  filterOptions: FiltersMetadata;
  isLoadingList: boolean;
  handleSort: (col: string) => void;
  openAddEmployeeModal: () => void;
  handleClearAllFilters: () => void;
  formatTableCurrency: (val: number) => string;
  setSelectedEmployeeForView: (emp: Employee) => void;
  openEditEmployeeModal: (emp: Employee) => void;
  setEmployeeToDelete: (emp: Employee | null) => void;
}

export function DirectoryTab({
  employees, pagination, setPagination, searchTerm, setSearchTerm, debouncedSearch,
  selectedCountry, setSelectedCountry, selectedDepartment, setSelectedDepartment,
  selectedJobTitle, setSelectedJobTitle, selectedStatus, setSelectedStatus,
  filterOptions, isLoadingList,
  handleSort, openAddEmployeeModal, handleClearAllFilters, formatTableCurrency,
  setSelectedEmployeeForView, openEditEmployeeModal, setEmployeeToDelete
}: DirectoryTabProps) {

  const resetPageCount = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }

  return (
    <section className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
      
      <DirectoryFilters 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} debouncedSearch={debouncedSearch}
        selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
        selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment}
        selectedJobTitle={selectedJobTitle} setSelectedJobTitle={setSelectedJobTitle}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
        filterOptions={filterOptions} handleClearAllFilters={handleClearAllFilters}
        openAddEmployeeModal={openAddEmployeeModal} resetPageCount={resetPageCount}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-medium select-none">
              <th onClick={() => handleSort('id')} className="py-3 px-4 font-mono text-center hover:bg-slate-100 cursor-pointer w-16">
                <div className="flex items-center justify-center gap-1">
                  ID
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th onClick={() => handleSort('name')} className="py-3 px-4 hover:bg-slate-100 cursor-pointer min-w-[200px]">
                <div className="flex items-center gap-1">
                  Employee Full Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th onClick={() => handleSort('job_title')} className="py-3 px-4 hover:bg-slate-100 cursor-pointer">
                <div className="flex items-center gap-1">
                  Designation Title
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th onClick={() => handleSort('department')} className="py-3 px-4 hover:bg-slate-100 cursor-pointer">
                <div className="flex items-center gap-1">
                  Department
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th onClick={() => handleSort('country')} className="py-3 px-4 hover:bg-slate-100 cursor-pointer">
                <div className="flex items-center gap-1">
                  Country
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th onClick={() => handleSort('rating')} className="py-3 px-4 text-center hover:bg-slate-100 cursor-pointer w-28">
                <div className="flex items-center justify-center gap-1">
                  HR Score
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th onClick={() => handleSort('salary')} className="py-3 px-4 text-right bg-emerald-50/20 hover:bg-emerald-50/40 cursor-pointer w-36">
                <div className="flex items-center justify-end gap-1 text-emerald-800">
                  Annual Salary
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th onClick={() => handleSort('status')} className="py-3 px-4 text-center hover:bg-slate-100 cursor-pointer w-28">
                <div className="flex items-center justify-center gap-1">
                  HQ Status
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-center w-28 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {isLoadingList ? (
              Array.from({ length: pagination.limit }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="bg-white even:bg-slate-50/20">
                  <td className="py-3 px-4 text-center"><div className="h-4 w-6 bg-slate-200 animate-pulse rounded mx-auto"></div></td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mb-1"></div>
                    <div className="h-3 w-40 bg-slate-100 animate-pulse rounded"></div>
                  </td>
                  <td className="py-3 px-4"><div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div></td>
                  <td className="py-3 px-4"><div className="h-4 w-20 bg-slate-200 animate-pulse rounded"></div></td>
                  <td className="py-3 px-4"><div className="h-4 w-28 bg-slate-200 animate-pulse rounded"></div></td>
                  <td className="py-3 px-4 text-center"><div className="h-4 w-12 bg-slate-200 animate-pulse rounded mx-auto"></div></td>
                  <td className="py-3 px-4 text-right"><div className="h-4 w-16 bg-slate-200 animate-pulse rounded ml-auto"></div></td>
                  <td className="py-3 px-4 text-center"><div className="h-4 w-16 bg-slate-200 animate-pulse rounded mx-auto"></div></td>
                  <td className="py-3 px-4 text-center"><div className="h-4 w-20 bg-slate-200 animate-pulse rounded mx-auto"></div></td>
                </tr>
              ))
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <AlertCircle className="h-8 w-8 text-slate-300" />
                    <span className="text-sm font-medium text-slate-500">No employees match this specific directory query.</span>
                    <button 
                      onClick={handleClearAllFilters}
                      className="text-xs text-emerald-600 hover:underline font-semibold font-mono cursor-pointer"
                    >
                      Reset Directory Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 even:bg-slate-50/20 transition-all duration-75 group">
                  <td className="py-3 px-4 text-center font-mono text-xs text-slate-400">#{emp.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 leading-tight block group-hover:text-emerald-700 transition-colors">
                      {emp.name}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 mt-0.5 block select-all">{emp.email}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-700">{emp.job_title}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">{emp.department}</td>
                  <td className="py-3 px-4 text-xs text-slate-800 font-medium">{emp.country}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-0.5 bg-slate-100 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                      ⭐ {emp.rating}.0
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs font-bold bg-emerald-50/10 text-emerald-700">
                    {formatTableCurrency(emp.salary)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block text-[10px] font-bold font-sans uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : emp.status === 'On Leave' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                      <button onClick={() => setSelectedEmployeeForView(emp)} className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer" title="Inspect Details">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => openEditEmployeeModal(emp)} className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all cursor-pointer" title="Edit Employee Contract">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setEmployeeToDelete(emp)} className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-rose-600 transition-all cursor-pointer" title="Delete Record">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DirectoryPagination pagination={pagination} setPagination={setPagination} />
      
    </section>
  );
}
