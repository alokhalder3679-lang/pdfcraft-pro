import React, { useState, useMemo } from 'react';
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
  HardDrive,
  Check,
  Eye,
  SlidersHorizontal,
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
    { id: 'all', label: 'All Tools', count: PDF_TOOLS.length },
    { id: 'organize', label: 'Organize & Pages', count: PDF_TOOLS.filter((t) => t.category === 'organize').length },
    { id: 'convert-to-pdf', label: 'Convert to PDF', count: PDF_TOOLS.filter((t) => t.category === 'convert-to-pdf').length },
    { id: 'convert-from-pdf', label: 'Convert from PDF', count: PDF_TOOLS.filter((t) => t.category === 'convert-from-pdf').length },
    { id: 'edit-security', label: 'Edit & Security', count: PDF_TOOLS.filter((t) => t.category === 'edit-security').length },
    { id: 'advanced', label: 'AI & Utilities', count: PDF_TOOLS.filter((t) => t.category === 'advanced').length },
  ];

  const filteredTools = useMemo(() => {
    return PDF_TOOLS.filter((tool) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.accept.some((ext) => ext.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

  // Compute recommended tools based on dropped file type
  const recommendedActions = useMemo(() => {
    if (!droppedFile) return [];
    const name = droppedFile.name.toLowerCase();
    if (name.endsWith('.pdf')) {
      return [
        { name: 'Compress PDF', id: 'compress-pdf', desc: 'Shrink file size without losing clarity' },
        { name: 'PDF to Word', id: 'pdf-to-word', desc: 'Extract editable DOCX manuscript' },
        { name: 'Split Pages', id: 'split-pdf', desc: 'Extract or separate individual pages' },
        { name: 'Sign Document', id: 'sign-pdf', desc: 'Place handwritten signature & initials' },
        { name: 'AI Summarizer', id: 'ai-summarizer', desc: 'Extract executive summary & takeaways' },
        { name: 'Organize Pages', id: 'organize-pdf', desc: 'Drag, rotate, and reorder page grid' },
      ];
    }
    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      return [{ name: 'Word to PDF', id: 'word-to-pdf', desc: 'Convert DOCX manuscript to PDF' }];
    }
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) {
      return [{ name: 'Excel to PDF', id: 'excel-to-pdf', desc: 'Format spreadsheet tables to PDF' }];
    }
    if (name.endsWith('.pptx') || name.endsWith('.ppt')) {
      return [{ name: 'PowerPoint to PDF', id: 'powerpoint-to-pdf', desc: 'Convert presentation slides to PDF' }];
    }
    if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp')) {
      return [{ name: 'JPG to PDF', id: 'jpg-to-pdf', desc: 'Assemble image into standard PDF' }];
    }
    if (name.endsWith('.md') || name.endsWith('.markdown')) {
      return [{ name: 'Markdown to PDF', id: 'markdown-to-pdf', desc: 'Render Markdown AST to formatted PDF' }];
    }
    if (name.endsWith('.html') || name.endsWith('.htm')) {
      return [{ name: 'HTML to PDF', id: 'html-to-pdf', desc: 'Sanitize and convert HTML to PDF' }];
    }
    return [
      { name: 'Compress PDF', id: 'compress-pdf', desc: 'Optimize document' },
      { name: 'Merge PDF', id: 'merge-pdf', desc: 'Combine multiple documents' },
    ];
  }, [droppedFile]);

  return (
    <div className="min-h-screen">
      {/* Top Telemetry & Status Ribbon */}
      <section className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 font-medium text-slate-600">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-beacon"></span>
              Client Sandbox Active
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-500">
              Zero network uploads • All 35 tools execute in WebAssembly
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden md:inline">
              Quick Shortcuts:
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
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-transparent text-slate-700 font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{shortcut.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero Workstation Section */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-4 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-rose-600" />
            <span>100% In-Browser WebAssembly Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-4">
            Precision document tools. <br className="hidden sm:inline" />
            <span className="text-rose-600">Built for your browser.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Merge, split, compress, convert, sign, and edit files entirely inside your device's memory.
            Your bank statements, legal contracts, and personal IDs never leave your computer.
          </p>
        </div>

        {/* Tactile Document Desk / Drop Workbench */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleHeroDrop}
          className={`max-w-3xl mx-auto rounded-3xl p-6 sm:p-8 transition-all duration-200 ${
            isDragging
              ? 'border-2 border-dashed border-rose-500 bg-rose-50/60 scale-[1.01]'
              : 'border border-slate-200/90 bg-white shadow-card hover:shadow-card-hover'
          }`}
        >
          {!droppedFile ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-left">
                <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <UploadCloud className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Interactive Document Desk
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-md leading-relaxed">
                    Drop any PDF, Office file, or image here. We'll inspect it locally and suggest the right tool instantly.
                  </p>
                </div>
              </div>

              <label className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md flex items-center gap-2 flex-shrink-0">
                <FileText className="w-4 h-4 text-slate-300" />
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
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* File Telemetry Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center flex-shrink-0">
                    <File className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {droppedFile.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono">
                      <span>{formatSize(droppedFile.size)}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">Local Memory Verified</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDroppedFile(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Clear File
                </button>
              </div>

              {/* Recommended Tool Actions Grid */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2.5">
                  Suggested Actions for this Document:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {recommendedActions.map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => onSelectTool(act.id, [droppedFile])}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-200/80 text-left transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                          {act.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <span className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                        {act.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Precision Guarantees Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> 100% In-Browser Sandbox
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Zero Upload Bottlenecks
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> Free & Open Source (MIT)
          </span>
        </div>
      </section>

      {/* Filter Category Toolbar & View Mode Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
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

          {/* Results Metric & View Mode Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto">
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredTools.length} of {PDF_TOOLS.length} tools
            </span>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Bento Grid View"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="Linear List View"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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

      {/* Architectural Security Manifesto Section (Deep Obsidian Tone) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#090D16] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden border border-slate-800 bg-architectural-grid">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-rose-300 text-xs font-semibold mb-5 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Architectural Privacy Manifesto</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white leading-tight">
              Confidential documents should remain on your machine.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-10 font-normal">
              Every day, sensitive tax records, medical charts, and confidential enterprise NDAs are uploaded to opaque cloud converters. PDFCraft Pro was engineered from first principles with local-first WebAssembly execution: your documents never touch a remote server, cannot be intercepted, and are processed with the full horsepower of your own CPU.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-800 text-left">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-white mb-0.5">
                  0 Bytes
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Network Data Egress
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-white mb-0.5">
                  100%
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Client WebAssembly
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-white mb-0.5">
                  35 Tools
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Zero Paywalls
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-white mb-0.5">
                  MIT
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Open Source Code
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
