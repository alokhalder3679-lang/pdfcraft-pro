import React from 'react';
import { FileText, ShieldCheck, Lock, Cpu, Heart, Command, ArrowRight } from 'lucide-react';
import { PDF_TOOLS } from '../types/tools';

interface FooterProps {
  onSelectTool: (id: string | null) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool }) => {
  return (
    <footer className="bg-white border-t border-slate-200/90 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Security & Privacy Highlight Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/30">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>100% Client-Side Privacy Architecture</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  ISO 32000 Compliant
                </span>
              </h4>
              <p className="text-xs text-slate-300 max-w-xl mt-0.5 leading-relaxed">
                Your confidential documents never travel across the internet. Cryptographic operations, stream compression, and rendering occur inside your browser's private memory sandbox.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Egress</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-rose-400" />
              <span>WebAssembly</span>
            </div>
          </div>
        </div>

        {/* 4 Tool Categorization Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">PDFCraft Engine</span>
            <span>•</span>
            <span>All 35 Tools Operational</span>
            <span>•</span>
            <span className="font-mono text-slate-400">Release 2.4</span>
            <span>•</span>
            <a href="https://pdfcraft-pro.vercel.app/" className="text-rose-600 hover:text-rose-700 font-semibold transition-colors">pdfcraft-pro.vercel.app</a>
            <span>•</span>
            <a href="https://github.com/alokhalder3679-lang/pdfcraft-pro" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">Ctrl+K</kbd> to search</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSelectTool(null)}
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
