import React from 'react';
import { Search, X, Plus } from 'lucide-react';
import { FiltersMetadata } from '../../types';

interface DirectoryFiltersProps {
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
  filterOptions: FiltersMetadata;
  handleClearAllFilters: () => void;
  openAddEmployeeModal: () => void;
  resetPageCount: () => void;
}

export function DirectoryFilters({
  searchTerm, setSearchTerm, debouncedSearch, selectedCountry, setSelectedCountry,
  selectedDepartment, setSelectedDepartment, selectedJobTitle, setSelectedJobTitle,
  selectedStatus, setSelectedStatus, filterOptions, handleClearAllFilters, openAddEmployeeModal, resetPageCount
}: DirectoryFiltersProps) {

  return (
    <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 max-w-lg relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, or exact job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
            id="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddEmployeeModal}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors active:scale-98 cursor-pointer shadow-sm"
            id="add-employee-trigger"
          >
            <Plus className="h-4 w-4" />
            Onboard Employee
          </button>
          
          <button
            onClick={handleClearAllFilters}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium px-3.5 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            id="clear-filters-btn"
          >
            Reset Directory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Geographic Region</label>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => { setSelectedCountry(e.target.value); resetPageCount(); }}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:outline-none cursor-pointer focus:border-emerald-500"
              id="filter-country"
            >
              <option value="ALL">All Countries ({filterOptions.countries.length})</option>
              {filterOptions.countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Corporate Department</label>
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => { setSelectedDepartment(e.target.value); resetPageCount(); }}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:outline-none cursor-pointer focus:border-emerald-500"
              id="filter-department"
            >
              <option value="ALL">All Departments ({filterOptions.departments.length})</option>
              {filterOptions.departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Job Title Position</label>
          <div className="relative">
            <select
              value={selectedJobTitle}
              onChange={(e) => { setSelectedJobTitle(e.target.value); resetPageCount(); }}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:outline-none cursor-pointer focus:border-emerald-500"
              id="filter-job-title"
            >
              <option value="ALL">All Job Titles ({filterOptions.jobTitles.length})</option>
              {filterOptions.jobTitles.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">HR Registry Status</label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); resetPageCount(); }}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:outline-none cursor-pointer focus:border-emerald-500"
              id="filter-status"
            >
              <option value="ALL">All Job Statuses</option>
              <option value="Active">Active Duty</option>
              <option value="On Leave">On Sabbatical / Leave</option>
              <option value="Terminated">Terminated File</option>
            </select>
          </div>
        </div>
      </div>

      {(debouncedSearch || selectedCountry !== 'ALL' || selectedDepartment !== 'ALL' || selectedJobTitle !== 'ALL' || selectedStatus !== 'ALL') && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">Applied Filters:</span>
          {debouncedSearch && (
            <span className="text-[10px] font-sans font-medium bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              Keyword: &quot;{debouncedSearch}&quot;
              <X className="h-2.5 w-2.5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setSearchTerm('')} />
            </span>
          )}
          {selectedCountry !== 'ALL' && (
            <span className="text-[10px] font-sans font-medium bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              Country: {selectedCountry}
              <X className="h-2.5 w-2.5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setSelectedCountry('ALL')} />
            </span>
          )}
          {selectedDepartment !== 'ALL' && (
            <span className="text-[10px] font-sans font-medium bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              Department: {selectedDepartment}
              <X className="h-2.5 w-2.5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setSelectedDepartment('ALL')} />
            </span>
          )}
          {selectedJobTitle !== 'ALL' && (
            <span className="text-[10px] font-sans font-medium bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              Job Title: {selectedJobTitle}
              <X className="h-2.5 w-2.5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setSelectedJobTitle('ALL')} />
            </span>
          )}
          {selectedStatus !== 'ALL' && (
            <span className="text-[10px] font-sans font-medium bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              Status: {selectedStatus}
              <X className="h-2.5 w-2.5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setSelectedStatus('ALL')} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
