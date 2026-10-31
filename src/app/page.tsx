'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/header/Header';
import { ArchitectureCanvas } from '@/components/canvas/ArchitectureCanvas';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { ApiPlayground } from '@/components/playground/ApiPlayground';
import { DocEditor } from '@/components/editor/DocEditor';
import { MetricsDashboard } from '@/components/observability/MetricsDashboard';
import { MultimodalCopilot } from '@/components/copilot/MultimodalCopilot';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';

const CyberGridBackground3D = dynamic(
  () => import('@/components/canvas3d/CyberGridBackground3D').then((mod) => mod.CyberGridBackground3D),
  { ssr: false }
);

const HologramCanvas3D = dynamic(
  () => import('@/components/canvas3d/HologramCanvas3D').then((mod) => mod.HologramCanvas3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-sky-400 space-y-3">
        <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono font-medium tracking-wider uppercase animate-pulse">
          Initializing WebGL 3D Hologram...
        </span>
      </div>
    ),
  }
);

export default function Home() {
  const { activeTab } = useDocuMorphStore();

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Ambient 3D Cyber Wave Background */}
      <CyberGridBackground3D />

      {/* Universal Top Navigation Header */}
      <Header />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {activeTab === 'diagram' && (
          <div className="flex-1 flex w-full h-full">
            {/* Center Architecture Canvas */}
            <div className="flex-1 h-full relative">
              <ArchitectureCanvas />
            </div>

            {/* Right-Side Interactive Node Inspector */}
            <aside className="w-80 lg:w-96 h-full flex-shrink-0">
              <NodeInspector />
            </aside>
          </div>
        )}

        {activeTab === 'hologram3d' && (
          <div className="flex-1 flex w-full h-full">
            {/* Center 3D Hologram Viewport */}
            <div className="flex-1 h-full relative">
              <HologramCanvas3D />
            </div>

            {/* Right-Side Interactive Node Inspector */}
            <aside className="w-80 lg:w-96 h-full flex-shrink-0 border-l border-slate-800 bg-slate-900/90 backdrop-blur-md">
              <NodeInspector />
            </aside>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="flex-1 h-full">
            <ApiPlayground />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="flex-1 h-full">
            <MetricsDashboard />
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="flex-1 h-full">
            <DocEditor />
          </div>
        )}

        {activeTab === 'copilot' && (
          <div className="flex-1 h-full max-w-4xl mx-auto w-full py-4">
            <MultimodalCopilot />
          </div>
        )}
      </div>
    </main>
  );
}
