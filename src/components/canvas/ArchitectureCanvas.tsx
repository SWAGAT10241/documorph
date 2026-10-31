'use client';

import React, { useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import { ServiceNode } from './ServiceNode';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { CustomNodeType, CustomEdgeType } from '@/types/documorph';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

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
  } = useDocuMorphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>(activeTemplate.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>(activeTemplate.edges);

  // Sync when template changes
  React.useEffect(() => {
    setNodes(activeTemplate.nodes);
    setEdges(activeTemplate.edges);
  }, [activeTemplate, setNodes, setEdges]);

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

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Floating Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl">
        <button
          onClick={handleSimulateFirst}
          disabled={isSimulating}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isSimulating
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Simulating Trace...' : 'Simulate E2E Flow'}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800" />

        <button
          onClick={() => {
            setNodes(activeTemplate.nodes);
            setEdges(activeTemplate.edges);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Reset Canvas Positions"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Simulation status pill */}
      {isSimulating && (
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-amber-950/80 border border-amber-600/40 text-amber-200 px-3 py-1.5 rounded-full text-xs shadow-xl animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Live Packet Traversal Active</span>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        onPaneClick={() => {}}
        className="touch-none"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-300" />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.nodeType === 'database') return '#10b981';
            if (n.data?.nodeType === 'ai_agent') return '#f43f5e';
            if (n.data?.nodeType === 'gateway') return '#8b5cf6';
            return '#0284c7';
          }}
          className="!bg-slate-900/90 !border !border-slate-800 !rounded-lg"
          maskColor="rgba(15, 23, 42, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};
