import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { ModalPortal } from '../atoms/ModalPortal';

interface FilterOptions {
  countries: string[];
  departments: string[];
  jobTitles: string[];
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: 'add' | 'edit';
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  filterOptions: FilterOptions;
  errorMessage: string | null;
  isSubmitting: boolean;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export function FormModal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  filterOptions,
  errorMessage,
  isSubmitting,
  handleFormSubmit
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="relative z-50" aria-labelledby="form-modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-slate-900/60 transition-opacity" aria-hidden="true" onClick={onClose}></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg font-sans border border-slate-100">
          
          <div className="bg-slate-950 px-5 py-4 flex items-center justify-between">
            <h3 className="text-base font-display font-bold text-white" id="form-modal-title">
              {formMode === 'add' ? 'Onboard New Employee Record' : 'Amend Employee Registry File'}
            </h3>
            <button 
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border-b border-rose-100 px-5 py-2.5 flex items-start gap-2 text-xs text-rose-800 font-medium">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="px-5 py-5 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Johnathan Smith"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 font-sans text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Corporate Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. johnathan.smith@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Department</label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev: any) => ({ ...prev, department: val }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="" disabled>Select Department</option>
                    {filterOptions.departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Job Designation</label>
                  <select
                    value={formData.job_title || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, job_title: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="" disabled>Select Job</option>
                    {filterOptions.jobTitles.map(j => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3.5">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Country of Office</label>
                  <select
                    value={formData.country || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="" disabled>Select Country</option>
                    {filterOptions.countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Salary Rate (USD Annual)</label>
                  <input
                    type="number"
                    value={formData.salary || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g. 110000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                    required
                    min="1"
                  />
                </div>

              </div>

              <div className="grid grid-cols-3 gap-3">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Hire Date</label>
                  <input
                    type="date"
                    value={formData.hire_date || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, hire_date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs text-slate-700 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">HQ Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">HR Rating Grade</label>
                  <select
                    value={formData.rating || 3}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, rating: parseInt(e.target.value) || 3 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="1">⭐ 1.5 Star</option>
                    <option value="2">⭐⭐ 2.5 Star</option>
                    <option value="3">⭐⭐⭐ 3.5 Star</option>
                    <option value="4">⭐⭐⭐⭐ 4.5 Star</option>
                    <option value="5">⭐⭐⭐⭐⭐ Elite</option>
                  </select>
                </div>

              </div>

            </div>

            <div className="bg-slate-50 px-5 py-3.5 flex items-center justify-end gap-2.5 border-t border-slate-150">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 hover:bg-slate-200 rounded-md text-xs text-slate-700 transition-colors uppercase font-mono tracking-widest font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-xs font-mono font-semibold tracking-widest uppercase transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting File...' : 'Commit File'}
              </button>
            </div>
          </form>

          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
