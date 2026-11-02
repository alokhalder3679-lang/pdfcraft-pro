import React from 'react';
import { getToolSEO } from '../services/seoService';
import { PDF_TOOLS } from '../types/tools';
import { ShieldCheck, Zap, Lock, Sparkles, ChevronRight, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface ToolSEOSectionProps {
  toolId: string;
  onSelectTool: (id: string) => void;
  onBackToHome: () => void;
}

export const ToolSEOSection: React.FC<ToolSEOSectionProps> = ({
  toolId,
  onSelectTool,
  onBackToHome,
}) => {
  const seo = getToolSEO(toolId);
  const currentTool = PDF_TOOLS.find((t) => t.id === toolId);
  const relatedTools = (seo.relatedToolIds || [])
    .map((id) => PDF_TOOLS.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <section className="mt-14 pt-12 border-t border-slate-200/90 text-left space-y-12">
      {/* Semantic Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button
          type="button"
          onClick={onBackToHome}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400">Tools</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold" aria-current="page">
          {currentTool?.name || seo.title}
        </span>
      </nav>

      {/* Guide Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>In-Browser WebAssembly Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {seo.h1}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          {seo.subtitle}
        </p>
      </div>

      {/* How to Steps */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>How to use {currentTool?.name || 'this tool'} in 3 simple steps</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {seo.steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative group hover:border-slate-300 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">
                0{idx + 1}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Performance Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 mb-1">Zero Server Uploads</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            Your files remain in your browser RAM. No bytes are sent to cloud storage or remote servers.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 mb-1">Fast WebAssembly</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            Compiled C/Rust/JS WebAssembly executes multi-threaded operations at near-native hardware speed.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 mb-1">Confidential & Offline</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            Safe for medical, legal, and banking records. Once loaded, tools work even without internet.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-2.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 mb-1">100% Free Forever</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            No registration, credit cards, watermarks, or artificial daily document throttle limits.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      {seo.faqs && seo.faqs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-700" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-2"
              >
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools Internal Linking */}
      {relatedTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Related Document Utilities
            </h3>
            <span className="text-xs text-slate-400 font-mono">35 in-browser tools</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {relatedTools.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTool(t.id)}
                className="group p-3.5 bg-white rounded-xl border border-slate-200/90 hover:border-slate-900 hover:shadow-sm text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center justify-between">
                    <span>{t.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-rose-600" />
                  </span>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug font-normal">
                    {t.description}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-2 block">
                  {t.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
