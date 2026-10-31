'use client';

import React from 'react';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { FileText, Sparkles, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export const DocEditor: React.FC = () => {
  const { markdownDoc, setMarkdownDoc, activeTemplate, setActiveTab } = useDocuMorphStore();

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold text-slate-200">Specification Markdown Source</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('diagram')}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Architecture Graph</span>
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
        <MonacoEditor
          height="100%"
          defaultLanguage="markdown"
          theme="vs-dark"
          value={markdownDoc}
          onChange={(val) => setMarkdownDoc(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};
