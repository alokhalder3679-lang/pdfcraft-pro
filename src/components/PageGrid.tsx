import React, { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { RotateCw, RotateCcw, Trash2, Undo2, ArrowLeft, ArrowRight, CheckSquare, Square, Loader2 } from 'lucide-react';

export interface PageCardState {
  pageNumber: number; // 1-indexed original
  rotation: number; // 0, 90, 180, 270
  deleted: boolean;
  selected: boolean;
}

interface PageGridProps {
  file: File | ArrayBuffer;
  mode?: 'organize' | 'split' | 'rotate' | 'view';
  onStateChange?: (pages: PageCardState[]) => void;
  className?: string;
}

export const PageGrid: React.FC<PageGridProps> = ({
  file,
  mode = 'organize',
  onStateChange,
  className = '',
}) => {
  const [pagesState, setPagesState] = useState<PageCardState[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Render all page thumbnails once
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const generateThumbs = async () => {
      try {
        let buffer: ArrayBuffer;
        if (file instanceof File) buffer = await file.arrayBuffer();
        else buffer = file;

        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
        const total = doc.numPages;
        const initialStates: PageCardState[] = [];
        const thumbMap: Record<number, string> = {};

        for (let i = 1; i <= total; i++) {
          initialStates.push({
            pageNumber: i,
            rotation: 0,
            deleted: false,
            selected: true,
          });

          const pageObj = await doc.getPage(i);
          const viewport = pageObj.getViewport({ scale: 0.35 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;

          await pageObj.render({ canvasContext: ctx, viewport }).promise;
          thumbMap[i] = canvas.toDataURL('image/jpeg', 0.85);

          if (isCancelled) return;
        }

        if (!isCancelled) {
          setPagesState(initialStates);
          setThumbnails(thumbMap);
          onStateChange?.(initialStates);
          setLoading(false);
        }
      } catch (err) {
        console.error('Thumbnail generation error:', err);
        setLoading(false);
      }
    };

    generateThumbs();
    return () => {
      isCancelled = true;
    };
  }, [file]);

  const updateState = (updater: (prev: PageCardState[]) => PageCardState[]) => {
    setPagesState((prev) => {
      const next = updater(prev);
      onStateChange?.(next);
      return next;
    });
  };

  const handleRotatePage = (index: number, angleDiff: number) => {
    updateState((prev) => {
      const copy = [...prev];
      const cur = copy[index].rotation;
      copy[index] = { ...copy[index], rotation: (cur + angleDiff + 360) % 360 };
      return copy;
    });
  };

  const handleToggleDelete = (index: number) => {
    updateState((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], deleted: !copy[index].deleted };
      return copy;
    });
  };

  const handleToggleSelect = (index: number) => {
    updateState((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], selected: !copy[index].selected };
      return copy;
    });
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pagesState.length) return;
    updateState((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(targetIdx, 0, item);
      return copy;
    });
  };

  const handleRotateAll = (deg: number) => {
    updateState((prev) =>
      prev.map((p) => ({ ...p, rotation: (p.rotation + deg + 360) % 360 }))
    );
  };

  const handleSelectAll = (select: boolean) => {
    updateState((prev) => prev.map((p) => ({ ...p, selected: select })));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-2" />
        <p className="text-xs font-semibold text-slate-500">Generating page thumbnails...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grid Utility Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">
            {pagesState.filter((p) => !p.deleted).length} of {pagesState.length} pages active
          </span>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'rotate' && (
            <>
              <button
                type="button"
                onClick={() => handleRotateAll(90)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate All +90°
              </button>
            </>
          )}

          {mode === 'split' && (
            <>
              <button
                type="button"
                onClick={() => handleSelectAll(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => handleSelectAll(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pages Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pagesState.map((card, idx) => {
          const thumbSrc = thumbnails[card.pageNumber];
          return (
            <div
              key={`${card.pageNumber}-${idx}`}
              className={`relative bg-white rounded-2xl p-3 border transition-all duration-200 flex flex-col items-center justify-between ${
                card.deleted
                  ? 'opacity-35 border-red-200 bg-red-50/20'
                  : card.selected
                  ? 'border-slate-300 shadow-sm hover:shadow-md hover:border-rose-300'
                  : 'border-slate-200 opacity-60'
              }`}
            >
              {/* Card Header: Page Number badge */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-bold text-slate-700">
                  Page {idx + 1}
                  {card.pageNumber !== idx + 1 && ` (Orig: ${card.pageNumber})`}
                </span>

                {mode === 'split' && (
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(idx)}
                    className="text-rose-600 hover:scale-110 transition-transform"
                  >
                    {card.selected ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                )}
              </div>

              {/* Rendered Thumbnail with Live Rotation transform */}
              <div className="w-full aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/80 mb-3 shadow-inner">
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt={`Page ${card.pageNumber}`}
                    className="max-h-full max-w-full object-contain transition-transform duration-300"
                    style={{
                      transform: `rotate(${card.rotation}deg)`,
                    }}
                  />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                )}
              </div>

              {/* Action Toolbar on Card */}
              <div className="w-full flex items-center justify-between border-t border-slate-100 pt-2 text-slate-600">
                {/* Reorder Left */}
                {mode === 'organize' && (
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'left')}
                    title="Move Left"
                    className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-20"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Rotate Page */}
                <button
                  type="button"
                  onClick={() => handleRotatePage(idx, 90)}
                  title="Rotate 90° Clockwise"
                  className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                {/* Delete / Restore Page */}
                {mode === 'organize' && (
                  <button
                    type="button"
                    onClick={() => handleToggleDelete(idx)}
                    title={card.deleted ? 'Restore Page' : 'Remove Page'}
                    className={`p-1 rounded transition-colors ${
                      card.deleted
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    {card.deleted ? <Undo2 className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Reorder Right */}
                {mode === 'organize' && (
                  <button
                    type="button"
                    disabled={idx === pagesState.length - 1}
                    onClick={() => handleMove(idx, 'right')}
                    title="Move Right"
                    className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-20"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
