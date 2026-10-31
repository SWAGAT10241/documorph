import { create } from 'zustand';
import {
  ApiEndpoint,
  DocTemplate,
  ServiceNodeData,
  TraceEvent,
  SpanTrace,
  ServiceTelemetry,
  CustomNodeType,
  CustomEdgeType,
  NodeType,
} from '@/types/documorph';
import { SHOWCASE_TEMPLATES } from '@/data/showcaseTemplates';

interface DocuMorphStore {
  templates: DocTemplate[];
  activeTemplate: DocTemplate;
  setActiveTemplate: (templateId: string) => void;
  selectedNode: ServiceNodeData | null;
  setSelectedNode: (node: ServiceNodeData | null) => void;
  selectedEndpoint: ApiEndpoint | null;
  setSelectedEndpoint: (endpoint: ApiEndpoint | null) => void;
  activeTab: 'diagram' | 'editor' | 'playground' | 'metrics' | 'copilot';
  setActiveTab: (tab: 'diagram' | 'editor' | 'playground' | 'metrics' | 'copilot') => void;
  isSimulating: boolean;
  activeSimulatedEdgeId: string | null;
  traceEvents: TraceEvent[];
  spans: SpanTrace[];
  telemetryList: ServiceTelemetry[];
  addTraceEvent: (event: TraceEvent) => void;
  clearTraceEvents: () => void;
  runEndpointSimulation: (endpoint: ApiEndpoint) => Promise<void>;
  markdownDoc: string;
  setMarkdownDoc: (content: string) => void;
  loadCustomTemplate: (template: DocTemplate) => void;

  // Architecture Diagram Creator & Editor Actions
  addNode: (nodeType: NodeType, customLabel?: string) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, updates: Partial<ServiceNodeData>) => void;
  addEdgeConnection: (sourceId: string, targetId: string) => void;
  deleteEdge: (edgeId: string) => void;
  generateWithAiPrompt: (prompt: string) => Promise<void>;
  exportToMermaid: () => string;
}

const buildInitialSpans = (template: DocTemplate): SpanTrace[] => {
  let currentOffset = 0;
  return template.nodes.map((node, i) => {
    const duration = i === 0 ? 8 : i === template.nodes.length - 1 ? 45 : Math.floor(Math.random() * 30) + 12;
    const span: SpanTrace = {
      id: `span-${node.id}`,
      name: `${node.data.nodeType.toUpperCase()}::${node.data.label}`,
      service: node.data.label,
      durationMs: duration,
      offsetMs: currentOffset,
      status: 'ok',
      tags: {
        'service.name': node.data.label,
        'node.type': node.data.nodeType,
        'http.status_code': '200',
        'telemetry.sdk': 'opentelemetry',
      },
    };
    currentOffset += Math.floor(duration * 0.7);
    return span;
  });
};

const buildTelemetryList = (template: DocTemplate): ServiceTelemetry[] => {
  return template.nodes.map((n) => ({
    serviceId: n.id,
    serviceName: n.data.label,
    rps: Math.floor(Math.random() * 850) + 120,
    p95LatencyMs: parseInt(n.data.latency, 10) || Math.floor(Math.random() * 25) + 5,
    errorRate: parseFloat((Math.random() * 0.04).toFixed(3)),
    cpuPercent: Math.floor(Math.random() * 35) + 15,
    memoryMb: Math.floor(Math.random() * 380) + 120,
    status: 'healthy',
  }));
};

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
      spans: buildInitialSpans(template),
      telemetryList: buildTelemetryList(template),
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
  spans: buildInitialSpans(SHOWCASE_TEMPLATES[0]),
  telemetryList: buildTelemetryList(SHOWCASE_TEMPLATES[0]),
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
      spans: buildInitialSpans(custom),
      telemetryList: buildTelemetryList(custom),
    }));
  },

  // Add Node to Canvas
  addNode: (nodeType: NodeType, customLabel?: string) => {
    const { activeTemplate } = get();
    const id = `node-${Date.now()}`;
    const defaultLabels: Record<NodeType, string> = {
      gateway: 'API Gateway Proxy',
      service: 'Compute Microservice',
      database: 'Relational Database',
      queue: 'Kafka Event Bus',
      ai_agent: 'Gemini Agent Brain',
      auth: 'Auth0 Shield',
      cache: 'Redis Memory Cache',
      external_api: 'External Webhook Provider',
    };

    const label = customLabel || defaultLabels[nodeType] || 'New Service';
    const xOffset = (activeTemplate.nodes.length % 4) * 280 + 100;
    const yOffset = Math.floor(activeTemplate.nodes.length / 4) * 220 + 120;

    const newNode: CustomNodeType = {
      id,
      type: 'serviceNode',
      position: { x: xOffset, y: yOffset },
      data: {
        id,
        label,
        nodeType,
        description: `Newly provisioned ${nodeType} service ready for living specification and testing.`,
        techStack: nodeType === 'cache' ? ['Redis', 'In-Memory'] : nodeType === 'database' ? ['PostgreSQL', 'Prisma'] : ['TypeScript', 'Node.js'],
        status: 'operational',
        latency: nodeType === 'cache' ? '2ms' : '15ms',
        sla: '99.9%',
        endpoints: [
          {
            id: `ep-${id}`,
            name: `Query ${label}`,
            method: nodeType === 'database' || nodeType === 'cache' ? 'GET' : 'POST',
            path: `/api/v1/${nodeType}/${id.slice(-4)}`,
            summary: `Automated test route for ${label}`,
            description: `Interactively testable endpoint in DocuMorph sandbox.`,
            mockResponse: {
              status: 200,
              statusText: 'OK',
              headers: { 'content-type': 'application/json' },
              body: { success: true, node: label, timestamp: Date.now() },
            },
          },
        ],
      },
    };

    const updatedTemplate = {
      ...activeTemplate,
      nodes: [...activeTemplate.nodes, newNode],
    };

    set({
      activeTemplate: updatedTemplate,
      selectedNode: newNode.data,
      selectedEndpoint: newNode.data.endpoints[0],
      telemetryList: buildTelemetryList(updatedTemplate),
    });
  },

  // Delete Node from Canvas
  deleteNode: (nodeId: string) => {
    const { activeTemplate, selectedNode } = get();
    const updatedNodes = activeTemplate.nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = activeTemplate.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

    const updatedTemplate = {
      ...activeTemplate,
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    set({
      activeTemplate: updatedTemplate,
      selectedNode: selectedNode?.id === nodeId ? updatedNodes[0]?.data || null : selectedNode,
      telemetryList: buildTelemetryList(updatedTemplate),
    });
  },

  // Update Node Data
  updateNodeData: (nodeId: string, updates: Partial<ServiceNodeData>) => {
    const { activeTemplate, selectedNode } = get();
    const updatedNodes = activeTemplate.nodes.map((n) => {
      if (n.id === nodeId) {
        return {
          ...n,
          data: { ...n.data, ...updates },
        };
      }
      return n;
    });

    const updatedTemplate = {
      ...activeTemplate,
      nodes: updatedNodes,
    };

    const updatedSelectedNode = selectedNode?.id === nodeId ? { ...selectedNode, ...updates } : selectedNode;

    set({
      activeTemplate: updatedTemplate,
      selectedNode: updatedSelectedNode,
    });
  },

  // Add Edge Connection
  addEdgeConnection: (sourceId: string, targetId: string) => {
    const { activeTemplate } = get();
    if (sourceId === targetId) return;

    // Check if edge already exists
    const exists = activeTemplate.edges.some((e) => e.source === sourceId && e.target === targetId);
    if (exists) return;

    const sourceNode = activeTemplate.nodes.find((n) => n.id === sourceId);
    const targetNode = activeTemplate.nodes.find((n) => n.id === targetId);

    const newEdge: CustomEdgeType = {
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      animated: true,
      label: `${sourceNode?.data.label || 'source'} ➔ ${targetNode?.data.label || 'target'}`,
    };

    set({
      activeTemplate: {
        ...activeTemplate,
        edges: [...activeTemplate.edges, newEdge],
      },
    });
  },

  // Delete Edge
  deleteEdge: (edgeId: string) => {
    const { activeTemplate } = get();
    set({
      activeTemplate: {
        ...activeTemplate,
        edges: activeTemplate.edges.filter((e) => e.id !== edgeId),
      },
    });
  },

  // AI Prompt Architecture Generator
  generateWithAiPrompt: async (prompt: string) => {
    const { activeTemplate, addNode, addEdgeConnection } = get();
    const lower = prompt.toLowerCase();

    if (lower.includes('cache') || lower.includes('redis')) {
      addNode('cache', 'Redis Distributed Cache');
      const lastNode = get().activeTemplate.nodes[get().activeTemplate.nodes.length - 1];
      const gatewayNode = activeTemplate.nodes.find((n) => n.data.nodeType === 'gateway');
      if (gatewayNode && lastNode) {
        addEdgeConnection(gatewayNode.id, lastNode.id);
      }
    } else if (lower.includes('auth') || lower.includes('security')) {
      addNode('auth', 'OAuth2 / JWT Verifier');
      const lastNode = get().activeTemplate.nodes[get().activeTemplate.nodes.length - 1];
      const gatewayNode = activeTemplate.nodes.find((n) => n.data.nodeType === 'gateway');
      if (gatewayNode && lastNode) {
        addEdgeConnection(gatewayNode.id, lastNode.id);
      }
    } else if (lower.includes('queue') || lower.includes('kafka') || lower.includes('event')) {
      addNode('queue', 'RabbitMQ Event Stream');
      const lastNode = get().activeTemplate.nodes[get().activeTemplate.nodes.length - 1];
      const serviceNode = activeTemplate.nodes.find((n) => n.data.nodeType === 'service');
      if (serviceNode && lastNode) {
        addEdgeConnection(serviceNode.id, lastNode.id);
      }
    } else {
      addNode('service', 'Worker Microservice');
      const lastNode = get().activeTemplate.nodes[get().activeTemplate.nodes.length - 1];
      const firstNode = activeTemplate.nodes[0];
      if (firstNode && lastNode) {
        addEdgeConnection(firstNode.id, lastNode.id);
      }
    }
  },

  // Export current graph to Mermaid.js diagram code
  exportToMermaid: () => {
    const { activeTemplate } = get();
    let mermaid = 'graph TD\n';

    activeTemplate.nodes.forEach((n) => {
      mermaid += `  ${n.id}["${n.data.label} (${n.data.nodeType})"]\n`;
    });

    activeTemplate.edges.forEach((e) => {
      const label = typeof e.label === 'string' ? `|${e.label}|` : '';
      mermaid += `  ${e.source} -->${label} ${e.target}\n`;
    });

    return mermaid;
  },

  runEndpointSimulation: async (endpoint: ApiEndpoint) => {
    set({ isSimulating: true });
    const { activeTemplate, addTraceEvent } = get();

    const hostNode = activeTemplate.nodes.find((n) =>
      n.data.endpoints.some((e) => e.id === endpoint.id)
    );
    const hostNodeId = hostNode ? hostNode.id : activeTemplate.nodes[0]?.id;

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

    const newSpans: SpanTrace[] = [
      {
        id: `span-root-${Date.now()}`,
        name: `HTTP ${endpoint.method} ${endpoint.path}`,
        service: hostNode?.data.label || 'API Gateway',
        durationMs: 140,
        offsetMs: 0,
        status: 'ok',
        tags: { 'http.method': endpoint.method, 'http.route': endpoint.path, 'net.peer.name': 'client' },
      },
    ];

    let runningOffset = 6;
    const relatedEdges = activeTemplate.edges.filter((e) => e.source === hostNodeId);

    if (relatedEdges.length > 0) {
      for (const edge of relatedEdges) {
        set({ activeSimulatedEdgeId: edge.id });
        await new Promise((r) => setTimeout(r, 450));

        const targetNode = activeTemplate.nodes.find((n) => n.id === edge.target);
        const duration = Math.floor(Math.random() * 25) + 12;

        addTraceEvent({
          id: `ev-${Date.now()}-${edge.id}`,
          timestamp: new Date().toLocaleTimeString(),
          sourceNodeId: edge.source,
          targetNodeId: edge.target,
          method: 'INTERNAL',
          path: typeof edge.label === 'string' ? edge.label : 'data-bus',
          durationMs: duration,
          status: 200,
          message: `Forwarded payload to [${targetNode?.data.label || edge.target}]`,
        });

        newSpans.push({
          id: `span-${edge.id}-${Date.now()}`,
          name: `${edge.label || 'INTERNAL'} ➔ ${targetNode?.data.label || edge.target}`,
          service: targetNode?.data.label || 'Worker Service',
          durationMs: duration,
          offsetMs: runningOffset,
          status: 'ok',
          tags: { 'peer.service': targetNode?.data.label || edge.target, 'span.kind': 'client' },
        });

        runningOffset += Math.floor(duration * 0.8);
      }
    } else {
      await new Promise((r) => setTimeout(r, 600));
    }

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

    set({
      isSimulating: false,
      activeSimulatedEdgeId: null,
      spans: newSpans,
      telemetryList: buildTelemetryList(activeTemplate),
    });
  },
}));
