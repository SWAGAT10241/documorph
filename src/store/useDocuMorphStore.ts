import { create } from 'zustand';
import { ApiEndpoint, DocTemplate, ServiceNodeData, TraceEvent } from '@/types/documorph';
import { SHOWCASE_TEMPLATES } from '@/data/showcaseTemplates';

interface DocuMorphStore {
  templates: DocTemplate[];
  activeTemplate: DocTemplate;
  setActiveTemplate: (templateId: string) => void;
  selectedNode: ServiceNodeData | null;
  setSelectedNode: (node: ServiceNodeData | null) => void;
  selectedEndpoint: ApiEndpoint | null;
  setSelectedEndpoint: (endpoint: ApiEndpoint | null) => void;
  activeTab: 'diagram' | 'editor' | 'playground' | 'copilot';
  setActiveTab: (tab: 'diagram' | 'editor' | 'playground' | 'copilot') => void;
  isSimulating: boolean;
  activeSimulatedEdgeId: string | null;
  traceEvents: TraceEvent[];
  addTraceEvent: (event: TraceEvent) => void;
  clearTraceEvents: () => void;
  runEndpointSimulation: (endpoint: ApiEndpoint) => Promise<void>;
  markdownDoc: string;
  setMarkdownDoc: (content: string) => void;
  loadCustomTemplate: (template: DocTemplate) => void;
}

export const useDocuMorphStore = create<DocuMorphStore>((set, get) => ({
  templates: SHOWCASE_TEMPLATES,
  activeTemplate: SHOWCASE_TEMPLATES[0],
  setActiveTemplate: (templateId) => {
    const template = get().templates.find((t) => t.id === templateId) || SHOWCASE_TEMPLATES[0];
    const firstNode = template.nodes[0]?.data || null;
    const firstEp = firstNode?.endpoints[0] || null;
    set({
      activeTemplate: template,
      markdownDoc: template.markdownDoc,
      selectedNode: firstNode,
      selectedEndpoint: firstEp,
      activeSimulatedEdgeId: null,
      traceEvents: [],
    });
  },
  selectedNode: SHOWCASE_TEMPLATES[0].nodes[0].data,
  setSelectedNode: (node) => {
    set({
      selectedNode: node,
      selectedEndpoint: node?.endpoints[0] || null,
    });
  },
  selectedEndpoint: SHOWCASE_TEMPLATES[0].nodes[0].data.endpoints[0] || null,
  setSelectedEndpoint: (endpoint) => set({ selectedEndpoint: endpoint }),
  activeTab: 'diagram',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isSimulating: false,
  activeSimulatedEdgeId: null,
  traceEvents: [],
  addTraceEvent: (event) => set((state) => ({ traceEvents: [event, ...state.traceEvents].slice(0, 50) })),
  clearTraceEvents: () => set({ traceEvents: [] }),
  markdownDoc: SHOWCASE_TEMPLATES[0].markdownDoc,
  setMarkdownDoc: (content) => set({ markdownDoc: content }),
  loadCustomTemplate: (custom) => {
    set((state) => ({
      templates: [custom, ...state.templates],
      activeTemplate: custom,
      markdownDoc: custom.markdownDoc,
      selectedNode: custom.nodes[0]?.data || null,
      selectedEndpoint: custom.nodes[0]?.data.endpoints[0] || null,
    }));
  },
  runEndpointSimulation: async (endpoint: ApiEndpoint) => {
    set({ isSimulating: true });
    const { activeTemplate, addTraceEvent } = get();

    // Find the node that hosts this endpoint
    const hostNode = activeTemplate.nodes.find((n) =>
      n.data.endpoints.some((e) => e.id === endpoint.id)
    );

    const hostNodeId = hostNode ? hostNode.id : activeTemplate.nodes[0]?.id;

    // Initial dispatch event
    addTraceEvent({
      id: `ev-${Date.now()}-1`,
      timestamp: new Date().toLocaleTimeString(),
      sourceNodeId: 'client-browser',
      targetNodeId: hostNodeId,
      method: endpoint.method,
      path: endpoint.path,
      durationMs: 4,
      status: 200,
      message: `Request initiated for [${endpoint.method}] ${endpoint.path}`,
    });

    // Animate edges sequentially
    const relatedEdges = activeTemplate.edges.filter((e) => e.source === hostNodeId);

    if (relatedEdges.length > 0) {
      for (const edge of relatedEdges) {
        set({ activeSimulatedEdgeId: edge.id });
        await new Promise((r) => setTimeout(r, 600));

        const targetNode = activeTemplate.nodes.find((n) => n.id === edge.target);
        addTraceEvent({
          id: `ev-${Date.now()}-${edge.id}`,
          timestamp: new Date().toLocaleTimeString(),
          sourceNodeId: edge.source,
          targetNodeId: edge.target,
          method: 'INTERNAL',
          path: typeof edge.label === 'string' ? edge.label : 'data-bus',
          durationMs: Math.floor(Math.random() * 25) + 10,
          status: 200,
          message: `Forwarded payload to [${targetNode?.data.label || edge.target}]`,
        });
      }
    } else {
      await new Promise((r) => setTimeout(r, 700));
    }

    // Final response event
    addTraceEvent({
      id: `ev-${Date.now()}-done`,
      timestamp: new Date().toLocaleTimeString(),
      sourceNodeId: hostNodeId,
      targetNodeId: 'client-browser',
      method: endpoint.method,
      path: endpoint.path,
      durationMs: 42,
      status: endpoint.mockResponse.status,
      message: `200 OK Response streamed back. Process completed successfully.`,
    });

    set({ isSimulating: false, activeSimulatedEdgeId: null });
  },
}));
