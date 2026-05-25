import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Employee } from '../../types';
import { ModalPortal } from '../atoms/ModalPortal';

interface DeleteConfirmModalProps {
  employeeToDelete: Employee | null;
  setEmployeeToDelete: (employee: Employee | null) => void;
  handleDeleteEmployee: () => void;
  isSubmitting: boolean;
}

export function DeleteConfirmModal({
  employeeToDelete,
  setEmployeeToDelete,
  handleDeleteEmployee,
  isSubmitting
}: DeleteConfirmModalProps) {
  if (!employeeToDelete) return null;

  return (
    <ModalPortal>
      <div className="relative z-50" aria-labelledby="delete-modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/60 transition-opacity" aria-hidden="true" onClick={() => setEmployeeToDelete(null)}></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-rose-100">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertCircle className="h-6 w-6 text-rose-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-display font-medium text-slate-900" id="delete-modal-title">
                  Terminate Employee File
                </h3>
                <div className="mt-2 text-sm text-slate-500 space-y-2 leading-relaxed">
                  <p>
                    Are you sure you wish to completely expunge the record for <strong className="text-slate-900 font-semibold">{employeeToDelete.name}</strong> from the corporate index?
                  </p>
                  <p className="text-[11px] font-mono bg-rose-50 text-rose-800 p-2 rounded">
                    This action will immediately execute a DELETE SQL operation. It cannot be recovered.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              className="w-full inline-flex font-mono uppercase tracking-widest text-xs justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-xs cursor-pointer"
              onClick={handleDeleteEmployee}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Termination'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex font-mono uppercase tracking-widest text-xs justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-xs cursor-pointer"
              onClick={() => setEmployeeToDelete(null)}
            >
              Cancel
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
