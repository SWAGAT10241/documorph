'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ServiceNodeData } from '@/types/documorph';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { Server, Database, Layers, Bot, Shield, Cpu, Activity } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  gateway: <Layers className="w-4 h-4 text-violet-400" />,
  service: <Server className="w-4 h-4 text-sky-400" />,
  database: <Database className="w-4 h-4 text-emerald-400" />,
  queue: <Cpu className="w-4 h-4 text-amber-400" />,
  ai_agent: <Bot className="w-4 h-4 text-rose-400" />,
  auth: <Shield className="w-4 h-4 text-indigo-400" />,
  cache: <Activity className="w-4 h-4 text-cyan-400" />,
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  gateway: 'bg-violet-950/80 text-violet-300 border-violet-800/60',
  service: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
  database: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
  queue: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
  ai_agent: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
  auth: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
  cache: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
};

export const ServiceNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ServiceNodeData;
  const { selectedNode, setSelectedNode, isSimulating } = useDocuMorphStore();
  const isCurrentSelected = selectedNode?.id === nodeData.id || selected;

  return (
    <div
      onClick={() => setSelectedNode(nodeData)}
      className={`min-w-[240px] max-w-[280px] rounded-xl p-3.5 transition-all duration-200 cursor-pointer text-left border shadow-lg ${
        isCurrentSelected
          ? 'bg-slate-900/95 border-sky-500 shadow-sky-500/20 ring-2 ring-sky-500/40'
          : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-sky-500 !w-2.5 !h-2.5 !border-2 !border-slate-900"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-slate-800/90 border border-slate-700/60">
            {TYPE_ICONS[nodeData.nodeType] || <Server className="w-4 h-4 text-slate-400" />}
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
              TYPE_BADGE_COLORS[nodeData.nodeType] || 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {nodeData.nodeType.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSimulating ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isSimulating ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">{nodeData.latency}</span>
        </div>
      </div>

      <h3 className="font-semibold text-slate-100 text-sm leading-tight mb-1">{nodeData.label}</h3>
      <p className="text-slate-400 text-xs line-clamp-2 mb-2.5 leading-relaxed">
        {nodeData.description}
      </p>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {nodeData.techStack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700/50"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Endpoints pill count */}
      {nodeData.endpoints && nodeData.endpoints.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>{nodeData.endpoints.length} active endpoint(s)</span>
          <span className="text-sky-400 hover:text-sky-300 font-medium text-[10px]">Inspect →</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-sky-500 !w-2.5 !h-2.5 !border-2 !border-slate-900"
      />
    </div>
  );
};
