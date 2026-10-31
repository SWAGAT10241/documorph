# 📊 Observability & Grafana Tracing Suite

DocuMorph incorporates a built-in **Grafana-Style Observability Dashboard**, allowing developers to monitor distributed system health, latency SLAs, throughput, and waterfall execution traces without leaving the documentation view.

---

## 1. Dashboard Subsystems

```mermaid
graph TD
    A["Observability Dashboard"] --> B["Sample KPI Cards"]
    A --> C["Grafana Tempo Waterfall Trace Viewer"]
    A --> D["Service Resource & SLA Matrix"]

    B --> B1["Throughput: 1,482 req/s"]
    B --> B2["P95 Latency: 22.4 ms"]
    B --> B3["Error Rate: 0.008%"]
    B --> B4["Nodes Status: Template Node Count"]

    C --> C1["Parent Span: Edge Gateway"]
    C --> C2["Child Span: Core Microservice"]
    C --> C3["Child Span: Database Query"]
    C --> C4["Child Span: AI Reasoning Engine"]
```

---

## 2. Interactive 3D KPI Metric Cards

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:f6cbcb870909166791777f8ef0025fc7c66bb539e099d5166c7ebbb010aafdef -->

The top metrics row in `MetricsDashboard` displays sample values, not live telemetry:
- **Throughput:** 1,482 req/s.
- **P95 latency:** 22.4 ms, with P99 shown as 46.8 ms.
- **Error rate:** 0.008%.
- **Nodes status:** The active template's node count is shown as both numerator and denominator, alongside a fixed “All Pods Healthy” label.

<!-- /coderabbit-ai-generated:v1 -->

### 3D Perspective Tilt Interactivity
Every KPI card is wrapped in the [`Card3DTilt`](../../src/components/ui/Card3DTilt.tsx) component:
- Computes pointer coordinates relative to card center on `onMouseMove`.
- Applies dynamic 3D perspective rotation:
  $$\text{rotateX} = \frac{-(y - \text{centerY})}{\text{centerY}} \times \text{maxTilt}, \quad \text{rotateY} = \frac{(x - \text{centerX})}{\text{centerX}} \times \text{maxTilt}$$
- Renders a radial specular holographic glare following cursor movement.
- Built-in accessibility: Automatically disabled when `prefers-reduced-motion` is detected.

---

## 3. Grafana Tempo Waterfall Trace Viewer

DocuMorph simulates OpenTelemetry-compliant distributed tracing spans across the microservice topology:
- **Trace Hierarchy**: Renders parent and child spans with depth indentation.
- **Relative Offset & Duration**: Calculates start offset (`offsetMs`) and execution duration (`durationMs`) relative to the total trace timeline:
  $$\text{barLeft} = \frac{\text{offsetMs}}{\text{totalDuration}} \times 100\%, \quad \text{barWidth} = \frac{\text{durationMs}}{\text{totalDuration}} \times 100\%$$
- **Color-Coded Service Spans**:
  - Sky Blue: Edge Gateway
  - Indigo: Core Microservice
  - Emerald: Database / Storage
  - Rose: AI Agent Reasoning
  - Amber: Message Broker / Queue

---

## 4. Microservice Resource Matrix

A telemetry table listing each microservice in the active specification:
- Microservice name & role badge.
- Current CPU and RAM consumption.
- P50, P95, and P99 latency percentiles.
- Health status indicator with active pod count.
