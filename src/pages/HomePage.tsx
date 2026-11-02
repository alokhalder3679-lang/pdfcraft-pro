import React, { useState } from 'react';
import { PDF_TOOLS, PDFTool } from '../types/tools';
import { ToolCard } from '../components/ToolCard';
import {
  ShieldCheck,
  Cpu,
  Lock,
  Zap,
  ArrowRight,
  UploadCloud,
  File,
  Layers,
  Minimize2,
  FileText,
  PenTool,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  Heart,
  Github,
} from 'lucide-react';

interface HomePageProps {
  onSelectTool: (toolId: string, files?: File[]) => void;
  searchQuery: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTool, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All 35 Tools', count: PDF_TOOLS.length },
    { id: 'organize', label: 'Organize & Pages', count: PDF_TOOLS.filter((t) => t.category === 'organize').length },
    { id: 'convert-from-pdf', label: 'Convert from PDF', count: PDF_TOOLS.filter((t) => t.category === 'convert-from-pdf').length },
    { id: 'convert-to-pdf', label: 'Convert to PDF', count: PDF_TOOLS.filter((t) => t.category === 'convert-to-pdf').length },
    { id: 'edit-security', label: 'Edit & Security', count: PDF_TOOLS.filter((t) => t.category === 'edit-security').length },
    { id: 'advanced', label: 'AI & Utilities', count: PDF_TOOLS.filter((t) => t.category === 'advanced').length },
  ];

  const filteredTools = PDF_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.accept.some((ext) => ext.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setDroppedFile(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen">
      {/* Friendly Privacy Notice & Quick Shortcuts */}
      <section className="border-b border-slate-200/80 bg-white/70 backdrop-blur-xs py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-600">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-800">100% Private:</span>
            <span>Your files never leave your browser</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Popular Tools:
            </span>
            {[
              { id: 'merge-pdf', name: 'Merge', icon: Layers },
              { id: 'compress-pdf', name: 'Compress', icon: Minimize2 },
              { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText },
              { id: 'sign-pdf', name: 'Sign', icon: PenTool },
              { id: 'ai-summarizer', name: 'AI Summary', icon: Sparkles },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <button
                  key={shortcut.id}
                  type="button"
                  onClick={() => onSelectTool(shortcut.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-transparent text-slate-700 font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{shortcut.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero Workbench Section */}
      <section className="pt-10 pb-8 sm:pt-16 sm:pb-12 px-4 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-semibold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Complete 35-Tool Document Suite</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none mb-4">
          Every PDF tool you need. <span className="text-rose-600">Right in your browser.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
          Merge, split, compress, convert, sign, and edit documents privately. No server uploads, no accounts to create, and zero waiting.
        </p>

        {/* Interactive Instant Dropzone in Hero */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleHeroDrop}
          className={`max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 transition-all duration-200 text-left ${
            isDragging
              ? 'border-2 border-dashed border-rose-500 bg-rose-50/70 scale-[1.01]'
              : 'border border-slate-200/90 bg-white shadow-card hover:shadow-card-hover'
          }`}
        >
          {!droppedFile ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <UploadCloud className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Quick Document Workbench
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Drop a file here to inspect and choose what to do with it
                  </p>
                </div>
              </div>

              <label className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm">
                <span>Select Document</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setDroppedFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{droppedFile.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{formatSize(droppedFile.size)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDroppedFile(null)}
                  className="text-xs font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  Clear File
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 mr-1">Choose Action:</span>
                {[
                  { name: 'Compress File', id: 'compress-pdf' },
                  { name: 'Convert to Word', id: 'pdf-to-word' },
                  { name: 'Split Pages', id: 'split-pdf' },
                  { name: 'Sign Document', id: 'sign-pdf' },
                  { name: 'Protect Document', id: 'protect-pdf' },
                  { name: 'AI Summarize', id: 'ai-summarizer' },
                  { name: 'Rotate Pages', id: 'rotate-pdf' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => onSelectTool(act.id, [droppedFile])}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 group"
                  >
                    <span>{act.name}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Human Trust & Privacy Guarantee Badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Never leaves your computer
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-500" /> Instant client-side speed
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-rose-600" /> Free & Open Source
          </span>
        </div>
      </section>

      {/* Filter Category Toolbar & View Mode Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    selectedCategory === cat.id ? 'bg-slate-800 text-rose-300' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Grid vs. List) */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredTools.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 my-8">
            <p className="text-slate-700 text-sm font-bold">
              No PDF tool matched "{searchQuery}".
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Try searching for merge, word, compress, protect, sign, or ocr.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const originalIndex = PDF_TOOLS.findIndex((t) => t.id === tool.id);
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  index={originalIndex}
                  onSelect={(id) => onSelectTool(id, droppedFile ? [droppedFile] : undefined)}
                  viewMode="grid"
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5 max-w-4xl mx-auto">
            {filteredTools.map((tool) => {
              const originalIndex = PDF_TOOLS.findIndex((t) => t.id === tool.id);
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  index={originalIndex}
                  onSelect={(id) => onSelectTool(id, droppedFile ? [droppedFile] : undefined)}
                  viewMode="list"
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Why In-Browser Processing Matters (Human Touch & Trust Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-semibold mb-4 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Why We Built PDFCraft Pro</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Your documents are confidential. They should stay that way.
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Most online PDF converters silently upload your bank statements, legal contracts, and medical records to third-party cloud servers. We built PDFCraft Pro to run 100% locally in your web browser using modern WebAssembly. No files ever leave your computer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-700/60 text-left">
              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> Total Privacy
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Zero server transmission. Process sensitive contracts and IDs without NDA violations.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Blazing Fast
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No slow uploads or queue wait times. Large PDFs process at the speed of your device's CPU.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" /> Free Forever
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open source software built for the community. No premium paywalls or subscription traps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
