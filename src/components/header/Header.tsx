'use client';

import React, { useState } from 'react';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import {
  Layers,
  Upload,
  Play,
  FileText,
  Bot,
  Sparkles,
  ChevronDown,
  BarChart3,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    templates,
    activeTemplate,
    setActiveTemplate,
    activeTab,
    setActiveTab,
    loadCustomTemplate,
  } = useDocuMorphStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customMarkdown, setCustomMarkdown] = useState('');

  const handleCustomUpload = () => {
    if (!customTitle.trim()) return;

    loadCustomTemplate({
      id: `custom-${Date.now()}`,
      title: customTitle,
      tagline: 'Custom Uploaded Specification',
      category: 'User Ingested Spec',
      description: 'Dynamically parsed custom architectural specification and living endpoints.',
      markdownDoc: customMarkdown || `# ${customTitle}\n\nIngested custom documentation.`,
      nodes: [
        {
          id: 'custom-gateway',
          type: 'serviceNode',
          position: { x: 80, y: 150 },
          data: {
            id: 'custom-gateway',
            label: 'Ingested Edge Service',
            nodeType: 'gateway',
            description: 'Auto-extracted microservice from user document.',
            techStack: ['Node.js', 'REST API'],
            status: 'operational',
            latency: '8ms',
            sla: '99.9%',
            endpoints: [
              {
                id: 'ep-custom-1',
                name: 'Custom Endpoint',
                method: 'GET',
                path: '/v1/resource',
                summary: 'Generated from custom input',
                description: 'Ready for interactive testing in sandbox.',
                mockResponse: {
                  status: 200,
                  statusText: 'OK',
                  headers: { 'content-type': 'application/json' },
                  body: { message: 'Custom endpoint live', timestamp: Date.now() },
                },
              },
            ],
          },
        },
      ],
      edges: [],
    });

    setIsUploadModalOpen(false);
    setCustomTitle('');
    setCustomMarkdown('');
  };

  return (
    <>
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-20">
        {/* Left: Branding & Template Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 via-indigo-600 to-rose-500 p-[1.5px] shadow-lg shadow-sky-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-bold text-sm tracking-tight text-slate-100">DocuMorph</h1>
                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 font-mono">
                  v1.0
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Template Picker */}
          <div className="relative">
            <select
              value={activeTemplate.id}
              onChange={(e) => setActiveTemplate(e.target.value)}
              className="appearance-none bg-slate-950/80 hover:bg-slate-950 text-slate-300 text-xs font-medium pl-3 pr-8 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 outline-none transition cursor-pointer"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id} className="bg-slate-900 text-slate-200">
                  {tpl.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'diagram'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Living Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'playground'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden md:inline">API Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'metrics'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline">Grafana View</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'editor'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Markdown Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'copilot'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">AI Co-Pilot</span>
          </button>
        </div>

        {/* Right: Ingest CTA & Hackathon Badge */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingest Spec</span>
          </button>
        </div>
      </header>

      {/* Ingest Spec Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-slate-100">Ingest Technical Document</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Architecture / Project Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Distributed Video Transcoding Service"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Paste Markdown or OpenAPI JSON Specification
              </label>
              <textarea
                rows={6}
                value={customMarkdown}
                onChange={(e) => setCustomMarkdown(e.target.value)}
                placeholder="# System Architecture..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomUpload}
                disabled={!customTitle.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white transition shadow"
              >
                Synthesize Living Graph
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
