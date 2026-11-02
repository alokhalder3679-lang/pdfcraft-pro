import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ShieldCheck, ChevronDown, Layers, Sparkles, Command, HardDrive, Cpu, Github } from 'lucide-react';
import { PDF_TOOLS } from '../types/tools';
import { CommandPalette } from './CommandPalette';

interface NavbarProps {
  onSelectTool: (toolId: string | null) => void;
  currentToolId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectTool,
  currentToolId,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Keyboard shortcut listener for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => onSelectTool(null)}
                className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
              >
                {/* Custom Geometric Origami Document Icon */}
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-600/20 group-hover:shadow-rose-600/30 transition-all duration-200">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="13" y2="17" />
                  </svg>
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-extrabold tracking-tight text-slate-900">
                      PDF<span className="text-rose-600">Craft</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      ENGINE
                    </span>
                  </div>
                  <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-0.5">
                    100% In-Browser PDF Suite
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Command Palette Trigger Button */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs text-slate-500 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  <span className="font-medium text-slate-500 group-hover:text-slate-800">
                    Search 35 tools or actions...
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  <Command className="w-3 h-3 text-slate-400" /> K
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => onSelectTool(null)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentToolId === null
                    ? 'text-rose-600 bg-rose-50 border border-rose-200/60'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                All 35 Tools
              </button>

              {/* Category Quick Jumper */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  Categories <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in duration-100"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase font-bold text-slate-400">
                      Tool Categories
                    </div>
                    {[
                      { label: 'Organize & Pages', id: 'merge-pdf', count: 6, color: 'bg-orange-500' },
                      { label: 'Convert to PDF', id: 'word-to-pdf', count: 8, color: 'bg-blue-500' },
                      { label: 'Convert from PDF', id: 'pdf-to-word', count: 5, color: 'bg-rose-500' },
                      { label: 'Edit & Security', id: 'edit-pdf', count: 9, color: 'bg-purple-500' },
                      { label: 'AI & Automation', id: 'ai-summarizer', count: 7, color: 'bg-emerald-500' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onSelectTool(cat.id);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 font-semibold cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                          <span>{cat.label}</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">({cat.count})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>100% In-Browser</span>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
                aria-label="Search Tools"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
                aria-label="Open Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Browse Tools by Family
            </div>
            {[
              { label: 'All 35 Tools', id: null },
              { label: 'Merge & Organize (PDF Tools)', id: 'merge-pdf' },
              { label: 'Convert from PDF (Word, PPT, Excel)', id: 'pdf-to-word' },
              { label: 'Convert to PDF (Office, Images, Text)', id: 'word-to-pdf' },
              { label: 'Edit, Sign & Protect', id: 'sign-pdf' },
              { label: 'AI Summarize & Automation', id: 'ai-summarizer' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onSelectTool(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  (item.id === null && currentToolId === null) || currentToolId === item.id
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zero Server Transmission
              </span>
              <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded">Local WASM</span>
            </div>
          </div>
        )}
      </header>

      {/* Global Raycast-style Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTool={onSelectTool}
      />
    </>
  );
};
