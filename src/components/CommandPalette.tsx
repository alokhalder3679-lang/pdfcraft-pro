import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, FileText, Lock, Layers, Scissors, Minimize2 } from 'lucide-react';
import { PDF_TOOLS, PDFTool } from '../types/tools';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Filter tools
  const filteredTools = PDF_TOOLS.filter((t) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.accept.some((ext) => ext.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    );
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onSelectTool(filteredTools[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onClose, onSelectTool]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a tool name, format (.pdf, .docx), or action..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 text-slate-500 rounded border border-slate-200">
            ESC to close
          </span>
        </div>

        {/* Quick Category Hints */}
        {!query && (
          <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs text-slate-500">
            <span className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider mr-1">Quick:</span>
            {[
              { name: 'Merge', id: 'merge-pdf' },
              { name: 'Compress', id: 'compress-pdf' },
              { name: 'PDF to Word', id: 'pdf-to-word' },
              { name: 'Sign', id: 'sign-pdf' },
              { name: 'AI Summary', id: 'ai-summarizer' },
            ].map((shortcut) => (
              <button
                key={shortcut.id}
                type="button"
                onClick={() => {
                  onSelectTool(shortcut.id);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-300 hover:text-rose-600 text-slate-600 text-xs font-semibold transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                {shortcut.name}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-slate-50">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No PDF tool matches "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for merge, word, sign, ocr, or compress.</p>
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const toolNum = String(PDF_TOOLS.findIndex((t) => t.id === tool.id) + 1).padStart(2, '0');

              return (
                <div
                  key={tool.id}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-rose-50/80 text-rose-950' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] font-mono font-semibold text-slate-400 w-6">
                      #{toolNum}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg ${tool.iconBg} ${tool.iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate">{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">{tool.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-1">
                      {tool.accept.slice(0, 2).map((ext) => (
                        <span key={ext} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          {ext}
                        </span>
                      ))}
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded-md">
                        Open <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <strong className="font-mono text-slate-600">↑↓</strong> Navigate
            </span>
            <span>
              <strong className="font-mono text-slate-600">↵</strong> Select
            </span>
            <span>
              <strong className="font-mono text-slate-600">ESC</strong> Dismiss
            </span>
          </div>
          <span className="font-mono text-slate-500">{filteredTools.length} of 35 tools</span>
        </div>
      </div>
    </div>
  );
};
