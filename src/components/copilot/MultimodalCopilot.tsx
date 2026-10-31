'use client';

import React, { useState } from 'react';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { Bot, Send, Sparkles, ShieldAlert, Cpu } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const MultimodalCopilot: React.FC = () => {
  const { activeTemplate, selectedNode } = useDocuMorphStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content: `Hello! I'm your DocuMorph Technical Co-Pilot. I am actively analyzing **${activeTemplate.title}**. You can ask about data bottlenecks, failover strategies, or API payload designs.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPrompt = (promptText?: string) => {
    const text = promptText || inputPrompt;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `Based on the **${selectedNode ? selectedNode.label : activeTemplate.title}** specification: `;
      if (text.toLowerCase().includes('fail') || text.toLowerCase().includes('crash')) {
        reply += `If this component encounters an unhandled fault, upstream clients receive a circuit-breaker fallback response within ${selectedNode?.latency || '15ms'}, preventing cascading timeout storms. Idempotency guarantees in the ledger ensure duplicate messages are dropped.`;
      } else if (text.toLowerCase().includes('cache') || text.toLowerCase().includes('latency')) {
        reply += `Latency is currently rated at ${selectedNode?.latency || '10ms'} with an SLA of ${selectedNode?.sla || '99.9%'}. To optimize further, consider enabling read-through cache eviction with Redis cluster replicas.`;
      } else {
        reply += `The microservices adhere to strict decoupled boundaries. Downstream endpoints are queried via asynchronous event logs, maintaining high availability even during peak load bursts.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-rep-${Date.now()}`,
          sender: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-3">
      {/* Active context pill */}
      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Bot className="w-4 h-4 text-rose-400" />
          <span className="font-semibold">Contextual Focus:</span>
          <span className="text-sky-400 font-mono">
            {selectedNode ? selectedNode.label : activeTemplate.title}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Gemini 2.0 Agentic Reasoner</span>
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
              }`}
            >
              {m.content}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 max-w-[200px] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Analyzing system spec...</span>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          onClick={() => handleSendPrompt('What happens if this service crashes?')}
          className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full flex items-center space-x-1 transition"
        >
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          <span>Failover Strategy</span>
        </button>
        <button
          onClick={() => handleSendPrompt('How do we optimize latency for this node?')}
          className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full flex items-center space-x-1 transition"
        >
          <Cpu className="w-3 h-3 text-sky-400" />
          <span>Latency Optimization</span>
        </button>
      </div>

      {/* Input bar */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
          placeholder="Ask a technical question about this architecture..."
          className="flex-1 bg-transparent text-xs text-slate-200 px-3 py-1 outline-none placeholder:text-slate-500"
        />
        <button
          onClick={() => handleSendPrompt()}
          className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition shadow-md shadow-sky-600/30"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
