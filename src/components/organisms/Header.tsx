import React from 'react';
import { Building, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'directory' | 'architecture';
  setActiveTab: (tab: 'dashboard' | 'directory' | 'architecture') => void;
  isSeeding: boolean;
  handleRunSeeder: () => void;
}

export function Header({ activeTab, setActiveTab, isSeeding, handleRunSeeder }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-inner">
            <Building className="h-6 w-6" id="hcm-icon" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-2">
              CompInsight Studio
              <span className="text-[10px] uppercase tracking-widest font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                v2.4 Live
              </span>
            </h1>
            <p className="text-xs text-slate-400">Enterprise Compensation Analytics Engine (10K Scale)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            id="tab-dashboard"
          >
            Salary Insights
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${activeTab === 'directory' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            id="tab-directory"
          >
            Employee Directory
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${activeTab === 'architecture' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            id="tab-architecture"
          >
            Design
          </button>
          
          <div className="h-6 w-[1px] bg-slate-700 mx-1 hidden sm:block"></div>

          <button
            onClick={handleRunSeeder}
            disabled={isSeeding}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium border text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95 transition-all ${isSeeding ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Reset Database and reconstruct precisely 10,000 indexed records under 200ms."
            id="reset-db-btn"
          >
            <RefreshCw className={`h-3 w-3 ${isSeeding ? 'animate-spin' : ''}`} />
            Reset & Seed 10K Rows
          </button>
        </div>
      </div>
    </header>
  );
}
