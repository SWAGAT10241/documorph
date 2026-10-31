'use client';

import React, { useState } from 'react';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { ApiEndpoint, ServiceNodeData } from '@/types/documorph';
import {
  Play,
  Terminal,
  Zap,
  ShieldCheck,
  Clock,
  ExternalLink,
  Trash2,
  Plus,
  Edit2,
  Check,
} from 'lucide-react';

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  POST: 'bg-sky-950 text-sky-300 border-sky-800',
  PUT: 'bg-amber-950 text-amber-300 border-amber-800',
  DELETE: 'bg-rose-950 text-rose-300 border-rose-800',
};

interface NodeContentProps {
  node: ServiceNodeData;
}

const SelectedNodeContent: React.FC<NodeContentProps> = ({ node }) => {
  const {
    setSelectedEndpoint,
    setActiveTab,
    runEndpointSimulation,
    isSimulating,
    traceEvents,
    deleteNode,
    updateNodeData,
  } = useDocuMorphStore();

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [editedLabel, setEditedLabel] = useState(node.label);

  const handleTestInPlayground = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setActiveTab('playground');
  };

  const handleSaveLabel = () => {
    if (editedLabel.trim()) {
      updateNodeData(node.id, { label: editedLabel.trim() });
    }
    setIsEditingLabel(false);
  };

  const handleAddEndpoint = () => {
    const newEp: ApiEndpoint = {
      id: `ep-${Date.now()}`,
      name: `Custom Endpoint`,
      method: 'POST',
      path: `/api/v1/${node.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}/action`,
      summary: `Newly created endpoint for ${node.label}`,
      description: 'Editable payload and schema for testing.',
      requestBodySchema: JSON.stringify({ action: 'trigger', timestamp: Date.now() }, null, 2),
      mockResponse: {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        body: { result: 'Action completed', service: node.label },
      },
    };

    updateNodeData(node.id, {
      endpoints: [...(node.endpoints || []), newEp],
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800/80 overflow-y-auto">
      {/* Node Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/50">
            {node.nodeType}
          </span>
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{node.latency}</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{node.sla}</span>
            </span>
            <button
              onClick={() => deleteNode(node.id)}
              className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
              title="Delete Node from Architecture"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editable Node Label */}
        {isEditingLabel ? (
          <div className="flex items-center space-x-1.5 mt-1">
            <input
              type="text"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveLabel()}
              className="bg-slate-950 border border-sky-500 rounded px-2 py-0.5 text-sm font-bold text-slate-100 flex-1 outline-none"
            />
            <button
              onClick={handleSaveLabel}
              className="p-1 bg-sky-600 rounded text-white hover:bg-sky-500"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between group mt-1">
            <h2 className="text-base font-bold text-slate-100">{node.label}</h2>
            <button
              onClick={() => setIsEditingLabel(true)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-200 transition"
              title="Rename Node"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{node.description}</p>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {node.techStack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700/60"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Endpoints Section */}
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Living API Endpoints ({node.endpoints?.length || 0})</span>
            </h3>
            <button
              onClick={handleAddEndpoint}
              className="flex items-center space-x-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition"
              title="Add New Endpoint"
            >
              <Plus className="w-3 h-3" />
              <span>Add Endpoint</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {node.endpoints && node.endpoints.length > 0 ? (
              node.endpoints.map((ep) => (
                <div
                  key={ep.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${
                          METHOD_COLORS[ep.method] || 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-xs font-mono text-slate-200 font-medium truncate max-w-[180px]">
                        {ep.path}
                      </span>
                    </div>

                    <button
                      onClick={() => handleTestInPlayground(ep)}
                      className="flex items-center space-x-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 px-2 py-1 rounded border border-sky-800/40 transition"
                    >
                      <span>Sandbox</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{ep.summary}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Mock: 200 OK Response</span>
                    <button
                      onClick={() => runEndpointSimulation(ep)}
                      disabled={isSimulating}
                      className="text-[10px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                    >
                      <Play className="w-2.5 h-2.5" />
                      <span>Simulate Packet Flow</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No direct public endpoints.</p>
            )}
          </div>
        </div>

        {/* Live Trace Logs */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Trace Stream</span>
          </h3>

          <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 max-h-48 overflow-y-auto font-mono text-[11px] space-y-1.5">
            {traceEvents.length > 0 ? (
              traceEvents.map((ev) => (
                <div key={ev.id} className="text-slate-400 border-b border-slate-900/80 pb-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{ev.timestamp}</span>
                    <span className="text-emerald-400 font-semibold">{ev.status}</span>
                  </div>
                  <div className="text-slate-300 mt-0.5 truncate">{ev.message}</div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-center py-4">No trace events yet. Run a simulation.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NodeInspector: React.FC = () => {
  const { selectedNode } = useDocuMorphStore();

  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
        <Zap className="w-10 h-10 mb-3 text-slate-600 opacity-60" />
        <p className="text-sm font-medium">Select any node on the canvas</p>
        <p className="text-xs text-slate-600 mt-1">
          Inspect endpoints, schemas, dependencies, and run simulated API requests.
        </p>
      </div>
    );
  }

  return <SelectedNodeContent key={selectedNode.id} node={selectedNode} />;
};
