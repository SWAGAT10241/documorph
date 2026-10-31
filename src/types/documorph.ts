import { Node, Edge } from '@xyflow/react';

export type NodeType =
  | 'gateway'
  | 'service'
  | 'database'
  | 'queue'
  | 'ai_agent'
  | 'auth'
  | 'cache'
  | 'external_api';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  headers?: Record<string, string>;
  queryParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  requestBodySchema?: string; // JSON string
  mockResponse: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
  };
}

export interface ServiceNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  nodeType: NodeType;
  description: string;
  techStack: string[];
  status: 'operational' | 'degraded' | 'simulating';
  latency: string;
  sla: string;
  endpoints: ApiEndpoint[];
  databaseSchema?: Record<string, string[]>;
  upstreamDependencies?: string[];
  downstreamDependencies?: string[];
}

export interface TraceEvent {
  id: string;
  timestamp: string;
  sourceNodeId: string;
  targetNodeId: string;
  method: string;
  path: string;
  durationMs: number;
  status: number;
  message: string;
}

export type CustomNodeType = Node<ServiceNodeData>;
export type CustomEdgeType = Edge;

export interface DocTemplate {
  id: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  markdownDoc: string;
  nodes: CustomNodeType[];
  edges: CustomEdgeType[];
}
