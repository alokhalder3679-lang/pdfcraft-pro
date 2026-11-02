import React from 'react';
import {
  Layers,
  Scissors,
  Minimize2,
  FileText,
  Presentation,
  Sheet,
  FileCode2,
  SlidersHorizontal,
  Table,
  Edit3,
  Image,
  FileImage,
  PenTool,
  Stamp,
  RotateCw,
  Globe,
  Unlock,
  ShieldAlert,
  LayoutGrid,
  Archive,
  Wrench,
  Binary,
  Camera,
  ScanText,
  Columns2,
  Crop,
  CheckSquare,
  Sparkles,
  Languages,
  FileCode,
  AlignLeft,
  FileSpreadsheet,
  Workflow,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PDFTool } from '../types/tools';

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Scissors,
  Minimize2,
  FileText,
  Presentation,
  Sheet,
  FileCode2,
  SlidersHorizontal,
  Table,
  Edit3,
  Image,
  FileImage,
  PenTool,
  Stamp,
  RotateCw,
  Globe,
  Unlock,
  ShieldLock: Lock,
  ShieldAlert,
  LayoutGrid,
  Archive,
  Wrench,
  Binary,
  Camera,
  ScanText,
  Columns2,
  Crop,
  CheckSquare,
  Sparkles,
  Languages,
  FileCode,
  AlignLeft,
  FileSpreadsheet,
  Workflow,
};

interface ToolCardProps {
  tool: PDFTool;
  onSelect: (toolId: string) => void;
  index: number;
  viewMode?: 'grid' | 'list';
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  index,
  viewMode = 'grid',
}) => {
  const IconComponent = ICON_MAP[tool.icon] || FileText;
  const toolNum = String(index + 1).padStart(2, '0');

  // List view (Mobile-first view matching user's original screenshot layout)
  if (viewMode === 'list') {
    return (
      <button
        type="button"
        onClick={() => onSelect(tool.id)}
        className="group w-full text-left bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-rose-400 shadow-2xs hover:shadow-card transition-all flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
          >
            <IconComponent className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400">#{toolNum}</span>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                {tool.name}
              </h3>
              {tool.badge && (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5 max-w-sm sm:max-w-md">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {tool.accept.slice(0, 2).map((ext) => (
              <span
                key={ext}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
              >
                {ext}
              </span>
            ))}
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-rose-50 group-hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </button>
    );
  }

  // Grid view (Editorial Bento layout)
  return (
    <button
      type="button"
      onClick={() => onSelect(tool.id)}
      className="group w-full text-left bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-slate-300/90 tool-card-transition flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20 relative overflow-hidden"
    >
      {/* Top subtle hairline accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Header: Icon & Metadata Number */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div
            className={`w-11 h-11 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200`}
          >
            <IconComponent className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                {tool.badge}
              </span>
            )}
            <span className="text-xs font-mono font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
              #{toolNum}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors mb-1.5 tracking-tight leading-snug">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 font-normal">
          {tool.description}
        </p>
      </div>

      {/* Footer: Format Pills & Action Arrow */}
      <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {tool.accept.slice(0, 2).map((ext) => (
            <span
              key={ext}
              className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
            >
              {ext}
            </span>
          ))}
          {tool.accept.length > 2 && (
            <span className="text-[10px] text-slate-400 font-mono">+{tool.accept.length - 2}</span>
          )}
        </div>

        <span className="text-xs font-bold text-slate-600 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all flex items-center gap-1">
          Open <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};
