import { DocTemplate } from '@/types/documorph';

export const SHOWCASE_TEMPLATES: DocTemplate[] = [
  {
    id: 'ai-agent-mcp-pipeline',
    title: 'Autonomous Multi-Tool AI Agent Pipeline',
    tagline: 'Orchestrated Agentic Reasoning with Multimodal Tools & Memory Lake',
    category: 'AI & Agentic Systems',
    description:
      'High-performance agentic architecture featuring Gemini 2.0 reasoning loops, vector memory recall, MCP (Model Context Protocol) tool execution, and guardrail verification.',
    markdownDoc: `# 🤖 Autonomous Multi-Tool AI Agent Architecture Spec

## Executive Overview
This specification details an enterprise-grade agentic runtime that decomposes natural language goals into executable multi-step plans with strict safety verification.

### Core Data Flow
1. **Client Interface / REST Gateway:** Ingests user prompts and session context.
2. **Guardrail & Moderation Service:** Scans inputs for prompt injections, safety policies, and credential leaks.
3. **Agent Orchestrator:** Maintains conversation context and executes iterative ReAct (Reason + Act) loops.
4. **Pinecone Vector Memory:** Fetches semantic embeddings and relevant historical interaction turns.
5. **Gemini 2.0 Multimodal Reasoner:** Evaluates context, generates step-by-step logic, and issues tool-call intents.
6. **MCP Tool Broker:** Dispatches tool executions to sandboxed Docker containers, SQL databases, and web search APIs.
7. **Telemetry & Audit Ledger:** Logs step latencies, token consumption, and confidence scores.
`,
    nodes: [
      {
        id: 'client-gateway',
        type: 'serviceNode',
        position: { x: 50, y: 180 },
        data: {
          id: 'client-gateway',
          label: 'Client API Gateway',
          nodeType: 'gateway',
          description: 'Reverse proxy handling client SSE streams, rate limiting, and session tokens.',
          techStack: ['Next.js', 'FastAPI', 'Envoy'],
          status: 'operational',
          latency: '4ms',
          sla: '99.99%',
          endpoints: [
            {
              id: 'ep-agent-session',
              name: 'Start Agent Session',
              method: 'POST',
              path: '/api/v1/agent/session',
              summary: 'Initialize a stateful agent session with conversation history',
              description: 'Allocates an ephemeral session state and connects WebSocket stream.',
              requestBodySchema: JSON.stringify(
                {
                  userId: 'usr_849204',
                  goal: 'Analyze Q3 revenue report and draft executive summary',
                  toolsAllowed: ['web_search', 'python_runner', 'sql_query'],
                  temperature: 0.2,
                },
                null,
                2
              ),
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json', 'x-trace-id': 'tr_ag_9941a' },
                body: {
                  sessionId: 'sess_9924810a',
                  status: 'ready',
                  activeHarness: 'Gemini-2.0-Flash',
                  allocatedTools: 3,
                  quotaRemaining: 9850,
                },
              },
            },
          ],
        },
      },
      {
        id: 'guardrail-service',
        type: 'serviceNode',
        position: { x: 300, y: 80 },
        data: {
          id: 'guardrail-service',
          label: 'Guardrail & Prompt Shield',
          nodeType: 'auth',
          description: 'Zero-latency security engine inspecting inputs for jailbreaks and PII.',
          techStack: ['Rust', 'Llama-Guard-3', 'Regex Rules'],
          status: 'operational',
          latency: '9ms',
          sla: '99.95%',
          endpoints: [
            {
              id: 'ep-guardrail-scan',
              name: 'Scan Input Payload',
              method: 'POST',
              path: '/api/v1/guardrails/inspect',
              summary: 'Evaluate prompt safety and filter sensitive tokens',
              description: 'Checks vector distance from known jailbreak patterns.',
              requestBodySchema: JSON.stringify(
                {
                  text: 'Please write a script to summarize the attached PDF document.',
                  riskThreshold: 0.85,
                },
                null,
                2
              ),
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                body: {
                  verdict: 'PASSED',
                  piiDetected: false,
                  jailbreakConfidence: 0.002,
                  sanitizedText: 'Please write a script to summarize the attached PDF document.',
                },
              },
            },
          ],
        },
      },
      {
        id: 'agent-orchestrator',
        type: 'serviceNode',
        position: { x: 300, y: 280 },
        data: {
          id: 'agent-orchestrator',
          label: 'Agent Orchestrator (ReAct)',
          nodeType: 'service',
          description: 'Coordinates reasoning iterations, tool dispatching, and error recovery.',
          techStack: ['Python', 'LangGraph', 'Redis'],
          status: 'operational',
          latency: '22ms',
          sla: '99.9%',
          endpoints: [
            {
              id: 'ep-orchestrator-step',
              name: 'Execute Reasoning Step',
              method: 'POST',
              path: '/api/v1/orchestrator/step',
              summary: 'Run single thought-action-observation cycle',
              description: 'Evaluates next tool invocation or generates final response.',
              requestBodySchema: JSON.stringify(
                {
                  sessionId: 'sess_9924810a',
                  stepIndex: 3,
                  lastObservation: 'Retrieved 14 transactions totaling $412,000 from SQL database.',
                },
                null,
                2
              ),
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                body: {
                  nextAction: 'CALL_TOOL',
                  toolTarget: 'chart_generator',
                  toolInput: { dataSeries: [120000, 140000, 152000], title: 'Q3 Revenue Trend' },
                  confidence: 0.96,
                },
              },
            },
          ],
        },
      },
      {
        id: 'vector-memory',
        type: 'serviceNode',
        position: { x: 580, y: 80 },
        data: {
          id: 'vector-memory',
          label: 'Vector Memory & Context Store',
          nodeType: 'database',
          description: 'HNSW vector database indexing semantic embeddings of docs and past sessions.',
          techStack: ['Pinecone', 'OpenAI Text-Embedding-3', 'Redis'],
          status: 'operational',
          latency: '15ms',
          sla: '99.99%',
          endpoints: [
            {
              id: 'ep-vector-search',
              name: 'Semantic Vector Query',
              method: 'POST',
              path: '/api/v1/memory/query',
              summary: 'Retrieve top-k relevant knowledge chunks',
              description: 'Cosine similarity search across embedded knowledge documents.',
              requestBodySchema: JSON.stringify(
                {
                  query: 'What was our Q3 EBITDA margin target?',
                  topK: 3,
                  namespace: 'financial_reports_2026',
                },
                null,
                2
              ),
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                body: {
                  matches: [
                    { id: 'chunk_891', score: 0.924, text: 'Q3 EBITDA margin achieved was 24.8%.' },
                    { id: 'chunk_892', score: 0.881, text: 'FY26 Guidance set EBITDA target at 23-25%.' },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        id: 'gemini-reasoner',
        type: 'serviceNode',
        position: { x: 580, y: 280 },
        data: {
          id: 'gemini-reasoner',
          label: 'Gemini 2.0 Multimodal Brain',
          nodeType: 'ai_agent',
          description: 'High-throughput reasoning model evaluating multimodal inputs & planning actions.',
          techStack: ['Google Gemini API', 'Gemini 2.0 Flash', 'Function Calling'],
          status: 'operational',
          latency: '240ms',
          sla: '99.9%',
          endpoints: [
            {
              id: 'ep-gemini-plan',
              name: 'Generate Plan & Function Calls',
              method: 'POST',
              path: '/api/v1/ai/generate_plan',
              summary: 'Infers multi-tool plan from prompt and visual attachments',
              description: 'Returns structured JSON plan adhering to OpenAPI schemas.',
              requestBodySchema: JSON.stringify(
                {
                  model: 'gemini-2.0-flash',
                  messages: [{ role: 'user', content: 'Generate quarterly variance chart.' }],
                  tools: ['sql_query', 'chart_generator'],
                },
                null,
                2
              ),
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                body: {
                  candidates: [
                    {
                      content: {
                        role: 'model',
                        parts: [
                          {
                            functionCall: {
                              name: 'chart_generator',
                              args: { chartType: 'bar', labels: ['Jul', 'Aug', 'Sep'] },
                            },
                          },
                        ],
                      },
                    },
                  ],
                  usageMetadata: { promptTokenCount: 342, candidatesTokenCount: 48 },
                },
              },
            },
          ],
        },
      },
      {
        id: 'mcp-tool-broker',
        type: 'serviceNode',
        position: { x: 860, y: 180 },
        data: {
          id: 'mcp-tool-broker',
          label: 'MCP Tool Execution Broker',
          nodeType: 'queue',
          description: 'Secure sandboxed tool broker executing SQL queries, web searches, and Python.',
          techStack: ['Model Context Protocol (MCP)', 'Docker', 'PostgreSQL'],
          status: 'operational',
          latency: '110ms',
          sla: '99.8%',
          endpoints: [
            {
              id: 'ep-mcp-invoke',
              name: 'Invoke MCP Tool',
              method: 'POST',
              path: '/api/v1/mcp/invoke',
              summary: 'Execute external tool via standard MCP specification',
              description: 'Executes within isolated container boundary with network restrictions.',
              requestBodySchema: JSON.stringify(
                {
                  serverName: 'data-analytics-server',
                  toolName: 'generate_revenue_plot',
                  arguments: { format: 'svg', theme: 'dark' },
                },
                null,
                2
              ),
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                body: {
                  toolOutput: '<svg width="600" height="300">...</svg>',
                  executionDurationMs: 84,
                  exitCode: 0,
                },
              },
            },
          ],
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'client-gateway', target: 'guardrail-service', animated: true, label: 'inspect prompt' },
      { id: 'e2-3', source: 'guardrail-service', target: 'agent-orchestrator', animated: true, label: 'verified clean' },
      { id: 'e3-4', source: 'agent-orchestrator', target: 'vector-memory', animated: true, label: 'recall context' },
      { id: 'e3-5', source: 'agent-orchestrator', target: 'gemini-reasoner', animated: true, label: 'stream context' },
      { id: 'e5-6', source: 'gemini-reasoner', target: 'mcp-tool-broker', animated: true, label: 'dispatch tool' },
    ],
  },
  {
    id: 'ecommerce-microservices',
    title: 'Modern E-Commerce Event-Driven Architecture',
    tagline: 'Fault-Tolerant Microservices with Distributed Ledger & Payment Webhooks',
    category: 'Distributed Systems',
    description:
      'Cloud-native e-commerce topology utilizing API Gateway, Auth0 token verification, product catalog cache, resilient Kafka event bus, and Stripe checkout hooks.',
    markdownDoc: `# 🛒 Cloud-Native E-Commerce Platform Architecture

## System Topography
This architecture handles 50,000 requests/sec with active-active failover and zero data loss on financial checkout events.

### Primary Services
- **Kong Edge Gateway:** Handles SSL termination, CORS, and JWT validation.
- **Product Catalog Service:** High-speed read path powered by Redis read-through caching.
- **Order & Cart Service:** Manages transactional state in PostgreSQL with optimistic locking.
- **Kafka Event Stream:** Publishes purchase order events to asynchronously notify warehouse & shipping systems.
- **Stripe Payment Gateway:** Handles 3D-Secure 2.0 payment processing and asynchronous webhook receipts.
`,
    nodes: [
      {
        id: 'kong-gateway',
        type: 'serviceNode',
        position: { x: 50, y: 150 },
        data: {
          id: 'kong-gateway',
          label: 'Kong API Gateway',
          nodeType: 'gateway',
          description: 'Edge API gateway handling routing, throttling, and TLS termination.',
          techStack: ['Kong', 'Nginx', 'OpenResty'],
          status: 'operational',
          latency: '2ms',
          sla: '99.99%',
          endpoints: [
            {
              id: 'ep-checkout',
              name: 'Submit Checkout Order',
              method: 'POST',
              path: '/v1/checkout/orders',
              summary: 'Initiate order processing and generate payment intent',
              description: 'Validates cart items and routes to Order Service.',
              requestBodySchema: JSON.stringify(
                {
                  customerId: 'cust_019481',
                  items: [{ sku: 'PROD-MACBOOK-M4', quantity: 1, unitPrice: 1999.0 }],
                  currency: 'USD',
                },
                null,
                2
              ),
              mockResponse: {
                status: 201,
                statusText: 'Created',
                headers: { 'content-type': 'application/json' },
                body: {
                  orderId: 'ord_990141a',
                  paymentIntentSecret: 'pi_3MtwBwLkdIwHu7ix28a_secret',
                  totalAmount: 1999.0,
                  currency: 'USD',
                  status: 'requires_payment_method',
                },
              },
            },
          ],
        },
      },
      {
        id: 'catalog-service',
        type: 'serviceNode',
        position: { x: 320, y: 50 },
        data: {
          id: 'catalog-service',
          label: 'Catalog & Inventory Service',
          nodeType: 'service',
          description: 'Manages product metadata, SKU pricing, and warehouse real-time stock levels.',
          techStack: ['Go', 'gRPC', 'Redis', 'PostgreSQL'],
          status: 'operational',
          latency: '6ms',
          sla: '99.95%',
          endpoints: [
            {
              id: 'ep-get-product',
              name: 'Get Product Details',
              method: 'GET',
              path: '/v1/catalog/products/PROD-MACBOOK-M4',
              summary: 'Fetch live stock and specs for a product',
              description: 'Hits Redis cluster; falls back to Read Replica DB.',
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'cache-control': 'public, max-age=60', 'content-type': 'application/json' },
                body: {
                  sku: 'PROD-MACBOOK-M4',
                  name: 'MacBook Pro 16" M4 Max',
                  stockRemaining: 42,
                  price: 1999.0,
                  warehouseCode: 'US-EAST-1',
                },
              },
            },
          ],
        },
      },
      {
        id: 'order-service',
        type: 'serviceNode',
        position: { x: 320, y: 250 },
        data: {
          id: 'order-service',
          label: 'Order & Ledger Service',
          nodeType: 'service',
          description: 'ACID-compliant order processor with distributed transactions & idempotency.',
          techStack: ['Node.js', 'Prisma', 'PostgreSQL'],
          status: 'operational',
          latency: '18ms',
          sla: '99.99%',
          endpoints: [
            {
              id: 'ep-order-status',
              name: 'Retrieve Order State',
              method: 'GET',
              path: '/v1/orders/ord_990141a',
              summary: 'Get current shipping and payment reconciliation state',
              description: 'Returns real-time status recorded in the ledger.',
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                body: {
                  orderId: 'ord_990141a',
                  status: 'confirmed',
                  settlementTime: '2026-10-31T04:35:12Z',
                  estimatedDelivery: '2026-11-03',
                },
              },
            },
          ],
        },
      },
      {
        id: 'kafka-bus',
        type: 'serviceNode',
        position: { x: 620, y: 250 },
        data: {
          id: 'kafka-bus',
          label: 'Kafka Event Backbone',
          nodeType: 'queue',
          description: 'High-throughput distributed append-only log handling order lifecycle events.',
          techStack: ['Apache Kafka', 'Strimzi', 'Zookeeper-less Raft'],
          status: 'operational',
          latency: '5ms',
          sla: '99.999%',
          endpoints: [
            {
              id: 'ep-kafka-publish',
              name: 'Publish Order Event',
              method: 'POST',
              path: '/topics/orders.lifecycle',
              summary: 'Emit OrderCreated or OrderSettled event',
              description: 'Broadcasts to inventory reservation & email workers.',
              requestBodySchema: JSON.stringify(
                {
                  topic: 'orders.lifecycle',
                  partitionKey: 'ord_990141a',
                  eventType: 'ORDER_SETTLED',
                },
                null,
                2
              ),
              mockResponse: {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                body: { partition: 3, offset: 4910294, timestamp: 1793421312 },
              },
            },
          ],
        },
      },
    ],
    edges: [
      { id: 'ek-1', source: 'kong-gateway', target: 'catalog-service', animated: true, label: 'verify stock' },
      { id: 'ek-2', source: 'kong-gateway', target: 'order-service', animated: true, label: 'create order' },
      { id: 'ek-3', source: 'order-service', target: 'kafka-bus', animated: true, label: 'emit order.created' },
    ],
  },
];
