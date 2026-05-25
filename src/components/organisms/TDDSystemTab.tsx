import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertCircle, PlayCircle, Loader2, Code2, RefreshCcw } from 'lucide-react';

export function TDDSystemTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [complete, setComplete] = useState(true);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const isRunningRef = useRef(false);

  const handleRunTests = async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsRunning(true);
    setComplete(false);
    setTestOutput(null);
    setErrorDetails(null);

    try {
      const response = await fetch('/api/tests/run', {
        method: 'POST',
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response (Status: ${response.status})`);
      }

      const data = await response.json();
      
      const resultOutput = (data.stdout || '') + '\n' + (data.stderr || '');
      const cleanOutput = resultOutput.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

      setTestOutput(cleanOutput);
      if (data.error) {
        setErrorDetails(data.error);
      }
    } catch (error: any) {
      setErrorDetails(error.message || 'Failed to trigger test suite');
    } finally {
      isRunningRef.current = false;
      setIsRunning(false);
      setComplete(true);
    }
  };

  // Run automatically on first mount (optional)
  useEffect(() => {
    handleRunTests();
  }, []);

  const parseTestMetrics = (output: string | null) => {
    if (!output) return { total: '--', passed: '--', failed: '--', curCoverage: '--' };

    let passed = 0;
    let failed = 0;
    let total = 0;
    let curCoverage = '--';
    
    // Parse like: Tests:       3 passed, 3 total
    const passedMatch = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
    if (passedMatch) {
      passed = parseInt(passedMatch[1]);
      total = parseInt(passedMatch[2]);
      failed = total - passed;
    } else {
        const testsLine = output.match(/Tests:(.+)/);
        if (testsLine) {
            const failM = testsLine[1].match(/(\d+)\s+failed/);
            if (failM) failed = parseInt(failM[1]);
            const passM = testsLine[1].match(/(\d+)\s+passed/);
            if (passM) passed = parseInt(passM[1]);
            total = failed + passed;
        }
    }

    const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)/);
    if (coverageMatch) {
      curCoverage = coverageMatch[1] + '%';
    }

    return { 
      total: total || (isRunning ? '--' : '0'), 
      passed: passed || (isRunning ? '--' : '0'), 
      failed: failed || '0', 
      curCoverage 
    };
  };

  const metrics = parseTestMetrics(testOutput);

  const testSuites = (() => {
    if (!testOutput) return [];
    const passes = [...testOutput.matchAll(/PASS\s+(src\/.+\.tsx?)/g)];
    const fails = [...testOutput.matchAll(/FAIL\s+(src\/.+\.tsx?)/g)];
    return [
      ...passes.map(p => ({ file: p[1], passed: true })),
      ...fails.map(f => ({ file: f[1], passed: false }))
    ];
  })();

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Test Driven Development (TDD) System</h2>
          <p className="text-xs text-slate-500">Live test runner and core system coverage. Configured with Vitest & React Testing Library.</p>
        </div>
        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-xs disabled:opacity-75"
        >
          {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
          {isRunning ? 'Running Suites...' : 'Run All Tests'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{
          label: 'Total Tests', val: metrics.total, color: 'text-slate-900', bg: 'bg-white'
        }, {
          label: 'Passed', val: metrics.passed, color: 'text-emerald-600', bg: 'bg-emerald-50/50'
        }, {
          label: 'Failed', val: metrics.failed, color: metrics.failed !== '0' && metrics.failed !== '--' ? 'text-rose-600' : 'text-slate-400', bg: 'bg-rose-50/50'
        }, {
          label: 'Code Coverage', val: metrics.curCoverage, color: 'text-violet-600', bg: 'bg-violet-50/50'
        }].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl shadow-xs border border-slate-200/80 ${stat.bg} ${!complete ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">{stat.label}</span>
            <span className={`text-3xl font-mono font-bold ${stat.color}`}>
              {stat.val}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
            <span className="font-display font-semibold text-sm text-slate-800">Test Suites</span>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">All Passing</span>
          </div>
          <div className="divide-y divide-slate-100 flex-1 p-2 font-mono text-xs max-h-[350px] overflow-y-auto">
            {!complete && (
              <div className="p-10 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <span>Executing Vitest Runner...</span>
              </div>
            )}
            {complete && testSuites.length === 0 && (
              <div className="p-10 flex flex-col items-center justify-center text-slate-400 text-center">
                 <span>Test suites will appear here after execution...</span>
              </div>
            )}
            {complete && testSuites.length > 0 && (
              <>
                {testSuites.map((suite, idx) => (
                  <div key={idx} className="p-3 flex items-start gap-3 hover:bg-slate-50">
                    {suite.passed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-slate-700 font-medium">{suite.file}</span>
                      <div className="text-slate-500 mt-1 pl-1 space-y-1 text-[10px]">
                        <div>{suite.passed ? 'All tests passed' : 'Tests failed'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl shadow-xs border border-slate-800 overflow-hidden flex flex-col text-slate-300 font-mono text-xs relative">
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-400" />
              <span>Coverage Report (v8)</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>
          <div className="p-5 flex-1 min-h-[300px] overflow-auto">
            {isRunning ? (
              <div className="animate-pulse space-y-2 opacity-50">
                <div className="h-3 bg-slate-800 w-3/4 rounded"></div>
                <div className="h-3 bg-slate-800 w-1/2 rounded"></div>
                <div className="h-3 bg-slate-800 w-5/6 rounded"></div>
              </div>
            ) : (
              <div className="whitespace-pre text-[11px] leading-relaxed text-slate-300">
                {errorDetails ? (
                  <div className="text-rose-400 mb-4">{errorDetails}</div>
                ) : null}
                {testOutput || 'Waiting for test runner...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
