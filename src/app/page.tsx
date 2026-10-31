'use client';

import React from 'react';
import { Header } from '@/components/header/Header';
import { ArchitectureCanvas } from '@/components/canvas/ArchitectureCanvas';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { ApiPlayground } from '@/components/playground/ApiPlayground';
import { DocEditor } from '@/components/editor/DocEditor';
import { MultimodalCopilot } from '@/components/copilot/MultimodalCopilot';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';

export default function Home() {
  const { activeTab } = useDocuMorphStore();

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Universal Top Navigation Header */}
      <Header />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
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

        {activeTab === 'playground' && (
          <div className="flex-1 h-full">
            <ApiPlayground />
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
