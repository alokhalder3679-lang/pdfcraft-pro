import React, { useState } from 'react';
import { PDFPreview } from './PDFPreview';
import { Columns2, ArrowLeftRight, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentComparatorProps {
  fileA: File;
  fileB: File;
  className?: string;
}

export const DocumentComparator: React.FC<DocumentComparatorProps> = ({ fileA, fileB, className = '' }) => {
  const [pageA, setPageA] = useState(1);
  const [pageB, setPageB] = useState(1);
  const [syncScroll, setSyncScroll] = useState(true);

  const handlePageAChange = (p: number) => {
    setPageA(p);
    if (syncScroll) setPageB(p);
  };

  const handlePageBChange = (p: number) => {
    setPageB(p);
    if (syncScroll) setPageA(p);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Comparator Bar */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <Columns2 className="w-4 h-4 text-rose-500" />
          <span className="font-bold text-slate-800">Side-by-Side Document Comparator</span>
        </div>

        <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={syncScroll}
            onChange={(e) => setSyncScroll(e.target.checked)}
            className="rounded text-rose-600 focus:ring-rose-500"
          />
          <span>Synchronize Pages</span>
        </label>
      </div>

      {/* Dual Pane View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pane A */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
              Document A: {fileA.name}
            </span>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              {(fileA.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <PDFPreview
            file={fileA}
            currentPage={pageA}
            onPageChange={handlePageAChange}
            scale={0.8}
            className="bg-transparent border-0"
          />
        </div>

        {/* Pane B */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
              Document B: {fileB.name}
            </span>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              {(fileB.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <PDFPreview
            file={fileB}
            currentPage={pageB}
            onPageChange={handlePageBChange}
            scale={0.8}
            className="bg-transparent border-0"
          />
        </div>
      </div>
    </div>
  );
};
