import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '../../types';

interface DirectoryPaginationProps {
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}

export function DirectoryPagination({ pagination, setPagination }: DirectoryPaginationProps) {
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="py-3.5 px-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
      <span className="text-xs text-slate-500">
        Found <strong>{pagination.totalCount.toLocaleString()}</strong> records &bull; Page{' '}
        <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
      </span>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handlePrevPage}
          disabled={pagination.page <= 1}
          className={`p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-all ${
            pagination.page <= 1 ? 'opacity-40 cursor-not-allowed hover:bg-white text-slate-400' : ''
          }`}
          id="page-prev"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {(() => {
            const { page, totalPages } = pagination;
            const pages = [];
            
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              if (page <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
              } else if (page >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
              } else {
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
              }
            }

            return pages.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-slate-400 text-xs">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNum as number }))}
                  className={`px-3 py-1 text-xs font-medium font-mono rounded-md border transition-all cursor-pointer ${
                    pagination.page === pageNum
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {pageNum}
                </button>
              );
            });
          })()}
        </div>

        <button
          onClick={handleNextPage}
          disabled={pagination.page >= pagination.totalPages}
          className={`p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-all ${
            pagination.page >= pagination.totalPages ? 'opacity-40 cursor-not-allowed hover:bg-white text-slate-400' : ''
          }`}
          id="page-next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
