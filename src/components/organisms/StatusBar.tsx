import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface StatusBarProps {
  seedingMessage: string | null;
  seedingSuccess: boolean | null;
  isSeeding: boolean;
  setSeedingMessage: (msg: string | null) => void;
}

export function StatusBar({ seedingMessage, seedingSuccess, isSeeding, setSeedingMessage }: StatusBarProps) {
  if (!seedingMessage) return null;

  return (
    <div className="bg-slate-900 border-b border-emerald-500/20 py-3 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <div className="mt-0.5">
          {isSeeding ? (
            <Cpu className="h-4 w-4 text-emerald-400 animate-pulse" />
          ) : seedingSuccess ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400" />
          )}
        </div>
        <div className="flex-1">
          <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 block font-medium">
            {isSeeding ? 'Database Engine Activity Log' : 'Notification Callback'}
          </span>
          <p className="text-sm font-mono text-slate-200 mt-0.5">{seedingMessage}</p>
        </div>
        <button onClick={() => setSeedingMessage(null)} className="text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
