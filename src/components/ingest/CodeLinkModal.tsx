'use client';

import React, { useState } from 'react';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { DocTemplate } from '@/types/documorph';
import {
  Link2,
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface CodeLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeLinkModal: React.FC<CodeLinkModalProps> = ({ isOpen, onClose }) => {
  const { loadCustomTemplate, setActiveTab } = useDocuMorphStore();
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ title: string; nodesCount: number } | null>(null);

  if (!isOpen) return null;

  const handleIngest = async (urlToIngest?: string) => {
    const targetUrl = (urlToIngest || repoUrl).trim();
    if (!targetUrl) {
      setErrorMessage('Please provide a valid GitHub repository link.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);
    setLoadingStage('Validating security rules and rate limits...');

    try {
      setLoadingStage('Querying GitHub API & scanning file tree...');
      const res = await fetch('/api/v1/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to ingest repository.');
      }

      setLoadingStage('Synthesizing 2D/3D microservice topology & endpoints...');
      const template: DocTemplate = data.data;

      // Load into store
      loadCustomTemplate(template);
      setSuccessInfo({
        title: template.title,
        nodesCount: template.nodes.length,
      });

      // Brief delay so user sees success confirmation
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        setActiveTab('diagram');
      }, 1200);
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during ingestion.');
    }
  };

  const handleQuickPreset = (presetUrl: string) => {
    setRepoUrl(presetUrl);
    handleIngest(presetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Subtle Cyber Glow Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shadow-md">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Ingest Architecture from Code Link</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold uppercase">
                  Protected
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Turn any public GitHub repository into an interactive 2D/3D living architecture & API sandbox.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input Form */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            GitHub Repository URL
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-3 pointer-events-none text-slate-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isLoading}
              placeholder="https://github.com/SWAGAT10241/documorph"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50 font-mono"
            />
          </div>

          {/* Quick Preset Badges */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 text-[11px]">Try sample:</span>
            <button
              type="button"
              onClick={() => handleQuickPreset('https://github.com/SWAGAT10241/documorph')}
              disabled={isLoading}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono text-[10px] transition border border-slate-700"
            >
              SWAGAT10241/documorph
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('https://github.com/expressjs/express')}
              disabled={isLoading}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition border border-slate-700"
            >
              expressjs/express
            </button>
          </div>
        </div>

        {/* Security & Isolation Callout */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200 block">Security Guardrails Enforced:</span>
            <span className="text-[11px] block text-slate-400">
              Zero credential leakage. Validated against SSRF & local network abuse. Rate-limited to 10 requests/min.
              XSS sanitized before AST compilation.
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successInfo && (
          <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Successfully ingested <strong>{successInfo.title}</strong> with {successInfo.nodesCount} microservices!
            </span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-[11px] text-slate-500 font-mono">
            {isLoading && (
              <span className="flex items-center space-x-1.5 text-cyan-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{loadingStage}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleIngest()}
              disabled={isLoading || !repoUrl.trim()}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-cyan-950/40 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-400/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ingest & Generate Spec</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
