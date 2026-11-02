import React from 'react';
import { FileText, ShieldCheck, Lock, Cpu, Heart, Command, ArrowRight, Mail, Globe, Github } from 'lucide-react';
import { PDF_TOOLS } from '../types/tools';

interface FooterProps {
  onSelectTool: (id: string | null) => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, onOpenContact }) => {
  return (
    <footer className="bg-white border-t border-slate-200/90 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Summary Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center font-bold shadow-xs">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                PDFCraft Pro
              </span>
              <p className="text-xs text-slate-400">
                100% In-Browser Privacy-First PDF Toolkit • Zero Server Transmission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Local Sandbox</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Cpu className="w-3.5 h-3.5 text-rose-600" />
              <span>WebAssembly</span>
            </span>
          </div>
        </div>

        {/* 4 Tool Categorization Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-100">
          <div>
            <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Organize & Pages
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {['merge-pdf', 'split-pdf', 'organize-pdf', 'compress-pdf', 'rotate-pdf', 'crop-pdf'].map((id) => {
                const tool = PDF_TOOLS.find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelectTool(id)}
                      className="hover:text-rose-600 transition-colors text-left cursor-pointer"
                    >
                      {tool.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Convert To PDF
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {['word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'jpg-to-pdf', 'html-to-pdf', 'text-to-pdf', 'markdown-to-pdf', 'scan-to-pdf'].map((id) => {
                const tool = PDF_TOOLS.find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelectTool(id)}
                      className="hover:text-rose-600 transition-colors text-left cursor-pointer"
                    >
                      {tool.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Convert From PDF
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {['pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-jpg', 'pdf-to-markdown', 'pdf-to-pdfa'].map((id) => {
                const tool = PDF_TOOLS.find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelectTool(id)}
                      className="hover:text-rose-600 transition-colors text-left cursor-pointer"
                    >
                      {tool.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Edit, Sign & AI
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {['edit-pdf', 'sign-pdf', 'watermark-pdf', 'page-numbers', 'protect-pdf', 'unlock-pdf', 'pdf-forms', 'ai-summarizer', 'translate-pdf', 'workflow'].map((id) => {
                const tool = PDF_TOOLS.find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelectTool(id)}
                      className="hover:text-rose-600 transition-colors text-left cursor-pointer"
                    >
                      {tool.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Metadata & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-slate-800">PDFCraft Engine</span>
            <span>•</span>
            <span>All 35 Tools Operational</span>
            <span>•</span>
            <span className="font-mono text-slate-400">Release 2.4</span>
            <span>•</span>
            <a href="https://pdfcraft-pro.vercel.app/" className="text-rose-600 hover:text-rose-700 font-semibold transition-colors">pdfcraft-pro.vercel.app</a>
            <span>•</span>
            <a href="https://github.com/alokhalder3679-lang/pdfcraft-pro" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
            {onOpenContact && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="text-rose-600 hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> Contact & Feedback
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" /> Free Domain & Email Specs
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>Powered by <a href="https://github.com/ripienaar/free-for-dev" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-rose-600">free-for-dev</a></span>
            <span>•</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">Ctrl+K</kbd></span>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                onSelectTool(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-700 transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
