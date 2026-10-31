'use client';

import React, { useMemo, useState, useCallback } from 'react';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Connection,
} from '@xyflow/react';
import { ServiceNode } from './ServiceNode';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { CustomNodeType, CustomEdgeType, NodeType } from '@/types/documorph';
import {
  Play,
  RotateCcw,
  Sparkles,
  Plus,
  Layers,
  Server,
  Database,
  Cpu,
  Bot,
  Activity,
  Code2,
  Copy,
  Check,
  Send,
} from 'lucide-react';

const nodeTypes = {
  serviceNode: ServiceNode,
};

export const ArchitectureCanvas: React.FC = () => {
  const {
    activeTemplate,
    selectedNode,
    setSelectedNode,
    isSimulating,
    activeSimulatedEdgeId,
    runEndpointSimulation,
    addNode,
    addEdgeConnection,
    generateWithAiPrompt,
    exportToMermaid,
  } = useDocuMorphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>(activeTemplate.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>(activeTemplate.edges);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mermaidModalOpen, setMermaidModalOpen] = useState(false);
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  // Sync when template changes
  React.useEffect(() => {
    setNodes(activeTemplate.nodes);
    setEdges(activeTemplate.edges);
  }, [activeTemplate, setNodes, setEdges]);

  // Handle drag-and-drop edge connection between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addEdgeConnection(connection.source, connection.target);
      }
    },
    [addEdgeConnection]
  );

  // Dynamically update edge styling during simulation
  const animatedEdges = useMemo(() => {
    return edges.map((edge) => {
      const isSimulated = activeSimulatedEdgeId === edge.id;
      return {
        ...edge,
        animated: isSimulated || edge.animated,
        style: {
          ...edge.style,
          stroke: isSimulated ? '#38bdf8' : '#475569',
          strokeWidth: isSimulated ? 3 : 1.5,
          transition: 'all 0.3s ease',
        },
      };
    });
  }, [edges, activeSimulatedEdgeId]);

  const handleSimulateFirst = () => {
    const firstEp = activeTemplate.nodes[0]?.data.endpoints[0];
    if (firstEp) {
      runEndpointSimulation(firstEp);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    await generateWithAiPrompt(aiPrompt);
    setAiPrompt('');
    setIsGenerating(false);
  };

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(exportToMermaid());
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-2xl shadow-xl">
        <button
          onClick={handleSimulateFirst}
          disabled={isSimulating}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSimulating
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Simulating Trace...' : 'Simulate E2E Flow'}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800" />

        {/* Quick Add Node Palette */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => addNode('gateway')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition"
            title="Add API Gateway"
          >
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">+ Gateway</span>
          </button>

          <button
            onClick={() => addNode('service')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition"
            title="Add Microservice"
          >
            <Server className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">+ Service</span>
          </button>

          <button
            onClick={() => addNode('database')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition"
            title="Add Database"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">+ DB</span>
          </button>

          <button
            onClick={() => addNode('queue')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition"
            title="Add Queue / Kafka"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">+ Queue</span>
          </button>

          <button
            onClick={() => addNode('ai_agent')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition"
            title="Add AI Agent"
          >
            <Bot className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">+ Agent</span>
          </button>

          <button
            onClick={() => addNode('cache')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition"
            title="Add Redis Cache"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">+ Cache</span>
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-800" />

        {/* Export to Mermaid */}
        <button
          onClick={() => setMermaidModalOpen(true)}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition"
          title="Export Mermaid.js Diagram"
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Export Mermaid</span>
        </button>

        <button
          onClick={() => {
            setNodes(activeTemplate.nodes);
            setEdges(activeTemplate.edges);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Reset Canvas Layout"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Bottom AI Architecture Generator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4">
        <div className="flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-2xl">
          <div className="p-1.5 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/50">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="AI Architect: e.g. 'Add Redis cache to Kong Gateway'..."
            className="flex-1 bg-transparent text-xs text-slate-200 px-2 py-1 outline-none placeholder:text-slate-500 font-medium"
          />
          <button
            onClick={handleAiGenerate}
            disabled={!aiPrompt.trim() || isGenerating}
            className="flex items-center space-x-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-md shadow-sky-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="touch-none"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-300" />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.nodeType === 'database') return '#10b981';
            if (n.data?.nodeType === 'ai_agent') return '#f43f5e';
            if (n.data?.nodeType === 'gateway') return '#8b5cf6';
            if (n.data?.nodeType === 'cache') return '#06b6d4';
            return '#0284c7';
          }}
          className="!bg-slate-900/90 !border !border-slate-800 !rounded-lg"
          maskColor="rgba(15, 23, 42, 0.7)"
        />
      </ReactFlow>

      {/* Mermaid Export Modal */}
      {mermaidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-100">Exported Mermaid.js Architecture</h3>
              </div>
              <button
                onClick={() => setMermaidModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 max-h-64 overflow-auto">
              <pre>{exportToMermaid()}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Paste directly into your GitHub Markdown README</span>
              <button
                onClick={handleCopyMermaid}
                className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMermaid ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
