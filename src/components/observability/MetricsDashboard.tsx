'use client';

import React, { useState } from 'react';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import {
  Activity,
  BarChart3,
  Clock,
  Cpu,
  Layers,
  Play,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const MetricsDashboard: React.FC = () => {
  const { activeTemplate, spans, telemetryList, runEndpointSimulation, isSimulating } =
    useDocuMorphStore();
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(spans[0]?.id || null);

  // Total duration of current trace
  const totalTraceDuration = Math.max(
    ...spans.map((s) => s.offsetMs + s.durationMs),
    50
  );

  const selectedSpan = spans.find((s) => s.id === selectedSpanId) || spans[0];

  const handleSimulateNewTrace = () => {
    const firstEp = activeTemplate.nodes[0]?.data.endpoints[0];
    if (firstEp) {
      runEndpointSimulation(firstEp);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-4 space-y-4">
      {/* Grafana-style Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-800/60 text-orange-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-100">Grafana Telemetry & Trace View</h2>
              <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Service telemetry, resource matrix, and distributed trace waterfall (Tempo/Jaeger spec)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateNewTrace}
            disabled={isSimulating}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-md ${
              isSimulating
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Sampling Trace...' : 'Generate New Trace'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row (Grafana Big Stat Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: RPS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Throughput</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">1,482 <span className="text-xs text-slate-400 font-normal">req/s</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">↑ 4.2% vs last 15m</div>
        </div>

        {/* Card 2: P95 Latency */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>P95 Latency</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">22.4 <span className="text-xs text-slate-400 font-normal">ms</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">P99: 46.8ms</div>
        </div>

        {/* Card 3: Error Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Error Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">0.008<span className="text-xs text-slate-400 font-normal">%</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">100% within SLA</div>
        </div>

        {/* Card 4: Microservices */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Nodes Status</span>
            <Cpu className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {activeTemplate.nodes.length} / {activeTemplate.nodes.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">All Pods Healthy</div>
        </div>
      </div>

      {/* Grafana Tempo Waterfall Trace Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Distributed Trace Waterfall (Trace ID: tr_{totalTraceDuration}ms_ok)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Duration: <strong className="text-emerald-400">{totalTraceDuration} ms</strong> ({spans.length} spans)
          </span>
        </div>

        {/* Timeline Axis */}
        <div className="relative h-6 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center px-4 font-mono text-[10px] text-slate-500 justify-between">
          <span>0ms</span>
          <span>{Math.round(totalTraceDuration * 0.25)}ms</span>
          <span>{Math.round(totalTraceDuration * 0.5)}ms</span>
          <span>{Math.round(totalTraceDuration * 0.75)}ms</span>
          <span>{totalTraceDuration}ms</span>
        </div>

        {/* Spans List */}
        <div className="space-y-1.5 font-mono text-xs">
          {spans.map((span) => {
            const leftPercent = (span.offsetMs / totalTraceDuration) * 100;
            const widthPercent = Math.max((span.durationMs / totalTraceDuration) * 100, 4);
            const isSelected = selectedSpanId === span.id;

            return (
              <div
                key={span.id}
                onClick={() => setSelectedSpanId(span.id)}
                className={`flex items-center p-2 rounded-xl transition cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-800/90 border-orange-500/70 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                {/* Span details */}
                <div className="w-48 lg:w-64 truncate pr-2 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="text-[11px] text-slate-200 font-medium truncate">{span.service}</span>
                  <span className="text-[10px] text-slate-400 truncate">({span.name})</span>
                </div>

                {/* Waterfall Bar */}
                <div className="flex-1 relative h-6 bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80">
                  <div
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded flex items-center px-2 text-[10px] font-bold text-slate-950 shadow-sm"
                  >
                    <span className="truncate">{span.durationMs}ms</span>
                  </div>
                </div>

                {/* Status tag */}
                <div className="w-16 text-right pl-2">
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                    200 OK
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Span Metadata (OpenTelemetry Tags) */}
        {selectedSpan && (
          <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
            <div className="text-[11px] font-semibold text-orange-400 flex items-center justify-between">
              <span>Span Attributes: {selectedSpan.name}</span>
              <span className="text-slate-500">Duration: {selectedSpan.durationMs}ms</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[10px] text-slate-400">
              {Object.entries(selectedSpan.tags).map(([k, v]) => (
                <div key={k} className="p-1.5 bg-slate-900 rounded border border-slate-800/80">
                  <span className="text-slate-500 block truncate">{k}</span>
                  <span className="text-slate-200 font-semibold truncate block">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Service Resource Matrix (Grafana Table Panel) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Microservice Resource & Traffic Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 text-[11px]">
                <th className="pb-2 font-medium">Service Node</th>
                <th className="pb-2 font-medium">Throughput (RPS)</th>
                <th className="pb-2 font-medium">P95 Latency</th>
                <th className="pb-2 font-medium">CPU Usage</th>
                <th className="pb-2 font-medium">Memory</th>
                <th className="pb-2 font-medium">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {telemetryList.map((tel) => (
                <tr key={tel.serviceId} className="hover:bg-slate-950/40 transition">
                  <td className="py-2.5 font-medium text-slate-200">{tel.serviceName}</td>
                  <td className="py-2.5 text-sky-400">{tel.rps} req/s</td>
                  <td className="py-2.5 text-amber-400">{tel.p95LatencyMs} ms</td>
                  <td className="py-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${tel.cpuPercent}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-[11px] text-slate-300">{tel.cpuPercent}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-300">{tel.memoryMb} MB</td>
                  <td className="py-2.5">
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                      Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
