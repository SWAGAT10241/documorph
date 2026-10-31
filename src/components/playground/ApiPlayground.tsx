'use client';

import React, { useState } from 'react';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { Play, CheckCircle2, Clock, Send, Code2, Copy, Check } from 'lucide-react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export const ApiPlayground: React.FC = () => {
  const { selectedEndpoint, runEndpointSimulation, isSimulating } = useDocuMorphStore();
  const [requestBody, setRequestBody] = useState<string>(
    selectedEndpoint?.requestBodySchema || '{\n  "query": "ping"\n}'
  );
  const [responseOutput, setResponseOutput] = useState<any>(
    selectedEndpoint?.mockResponse.body || null
  );
  const [copied, setCopied] = useState(false);

  // Sync if endpoint changes
  React.useEffect(() => {
    if (selectedEndpoint) {
      setRequestBody(selectedEndpoint.requestBodySchema || '{\n  "query": "ping"\n}');
      setResponseOutput(selectedEndpoint.mockResponse.body);
    }
  }, [selectedEndpoint]);

  if (!selectedEndpoint) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
        <Code2 className="w-10 h-10 mb-3 text-slate-600 opacity-60" />
        <p className="text-sm font-medium">No Endpoint Selected</p>
        <p className="text-xs text-slate-600 mt-1">
          Pick a service node from the architecture canvas and click "Sandbox".
        </p>
      </div>
    );
  }

  const handleSend = async () => {
    await runEndpointSimulation(selectedEndpoint);
    setResponseOutput(selectedEndpoint.mockResponse.body);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-4 space-y-4">
      {/* Target URL Bar */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
        <span
          className={`text-xs font-bold font-mono px-2.5 py-1 rounded border ${
            selectedEndpoint.method === 'GET'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-sky-950 text-sky-400 border-sky-800'
          }`}
        >
          {selectedEndpoint.method}
        </span>
        <input
          type="text"
          readOnly
          value={`https://api.documorph.internal${selectedEndpoint.path}`}
          className="flex-1 bg-transparent text-xs font-mono text-slate-200 outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isSimulating}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition shadow-lg ${
            isSimulating
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
          }`}
        >
          {isSimulating ? <Play className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>{isSimulating ? 'Tracing...' : 'Send Request'}</span>
        </button>
      </div>

      {/* Editor & Response Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[380px]">
        {/* Request Payload Editor */}
        <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Request Body (JSON)</span>
            <span className="text-[10px] text-slate-500 font-mono">application/json</span>
          </div>
          <div className="flex-1 min-h-[260px] bg-slate-950">
            <MonacoEditor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={requestBody}
              onChange={(val) => setRequestBody(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Response Viewer */}
        <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-300">Response</span>
              <span className="flex items-center space-x-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3" />
                <span>{selectedEndpoint.mockResponse.status} OK</span>
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>38ms</span>
              </span>
              <button
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-slate-200 transition"
                title="Copy Response JSON"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-[260px] bg-slate-950 p-3 font-mono text-xs text-emerald-400 overflow-auto">
            <pre>{JSON.stringify(responseOutput, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
