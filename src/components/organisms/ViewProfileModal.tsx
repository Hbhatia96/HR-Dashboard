import React from 'react';
import { X, Award, Building, Mail, Globe, Calendar, TrendingUp, DollarSign, Edit, Trash2 } from 'lucide-react';
import { SalaryReferenceCompare } from '../atoms/SalaryReferenceCompare';
import { Employee, CountryStat } from '../../types';
import { ModalPortal } from '../atoms/ModalPortal';

interface ViewProfileModalProps {
  selectedEmployeeForView: Employee | null;
  setSelectedEmployeeForView: (employee: Employee | null) => void;
  openEditEmployeeModal: (employee: Employee) => void;
  setEmployeeToDelete: (employee: Employee | null) => void;
  formatCurrency: (value: number) => string;
  formatTableCurrency: (value: number) => string;
  countryStats: CountryStat[];
}

export function ViewProfileModal({
  selectedEmployeeForView,
  setSelectedEmployeeForView,
  openEditEmployeeModal,
  setEmployeeToDelete,
  formatCurrency,
  formatTableCurrency,
  countryStats
}: ViewProfileModalProps) {
  if (!selectedEmployeeForView) return null;

  return (
    <ModalPortal>
      <div className="relative z-50" aria-labelledby="view-modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/60 transition-opacity" aria-hidden="true" onClick={() => setSelectedEmployeeForView(null)}></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-100">
          
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-slate-900 text-white rounded-full flex flex-col items-center justify-center font-display shadow-inner">
                <span className="text-xl font-bold">{selectedEmployeeForView.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight leading-none" id="view-modal-title">
                  {selectedEmployeeForView.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-slate-200/60 text-slate-700 text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                    #ID-{selectedEmployeeForView.id.toString().padStart(5, '0')}
                  </span>
                  <span className={`inline-block text-[10px] font-bold font-sans uppercase tracking-widest px-2 py-0.5 rounded ${
                    selectedEmployeeForView.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : selectedEmployeeForView.status === 'On Leave' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-500'
                  }`}>
                    {selectedEmployeeForView.status}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedEmployeeForView(null)}
              className="rounded-full p-2 bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6 font-sans">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
                    Professional Identity
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Designation</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedEmployeeForView.job_title}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Department Sector</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedEmployeeForView.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Corporate Contact</p>
                        <a href={`mailto:${selectedEmployeeForView.email}`} className="text-sm font-mono font-medium text-emerald-700 hover:underline">
                          {selectedEmployeeForView.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
                    Compensation & Logistics
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                      <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Annual Base Salary</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-mono font-bold text-emerald-900">
                          {formatCurrency(selectedEmployeeForView.salary)}
                        </span>
                        <span className="text-xs font-medium text-emerald-700 font-sans">
                          USD
                        </span>
                      </div>
                      <div className="mt-1">
                        <SalaryReferenceCompare employee={selectedEmployeeForView} countryStats={countryStats} />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-start gap-2.5">
                        <Globe className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Office Region</p>
                          <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedEmployeeForView.country}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Hire Date</p>
                          <p className="text-sm font-mono font-medium text-slate-900 mt-0.5">{selectedEmployeeForView.hire_date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <TrendingUp className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">HR Performance Rating</p>
                        <div className="flex gap-1 mt-1.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span 
                              key={s} 
                              className={`h-2 rounded-sm transition-all duration-300 ${s <= selectedEmployeeForView.rating ? 'bg-amber-400 w-6' : 'bg-slate-200 w-3'}`}
                            />
                          ))}
                          <span className="ml-1 text-xs font-mono font-bold text-slate-700">
                            {selectedEmployeeForView.rating}.0 / 5.0
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Internal Auditable Record
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedEmployeeForView(null);
                  openEditEmployeeModal(selectedEmployeeForView);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md text-xs font-medium text-slate-700 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer"
              >
                <Edit className="h-3 w-3" /> Edit File
              </button>
              <button
                onClick={() => {
                  setSelectedEmployeeForView(null);
                  setEmployeeToDelete(selectedEmployeeForView);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 shadow-sm rounded-md text-xs font-medium text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3 w-3" /> Terminate Record
              </button>
            </div>
          </div>

          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
