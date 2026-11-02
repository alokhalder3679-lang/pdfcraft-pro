import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, FileWarning } from 'lucide-react';

// Configure PDF.js worker
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface PDFPreviewProps {
  file: File | ArrayBuffer | Uint8Array;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  scale?: number;
  className?: string;
  showControls?: boolean;
  overlayRenderer?: (ctx: CanvasRenderingContext2D, width: number, height: number, pageNum: number) => void;
  onClickCanvas?: (e: React.MouseEvent<HTMLCanvasElement>, width: number, height: number) => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  file,
  currentPage: controlledPage,
  onPageChange,
  scale: initialScale = 1.0,
  className = '',
  showControls = true,
  overlayRenderer,
  onClickCanvas,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(controlledPage || 1);
  const [zoom, setZoom] = useState<number>(initialScale);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync internal page with controlled prop
  useEffect(() => {
    if (controlledPage && controlledPage !== page) {
      setPage(controlledPage);
    }
  }, [controlledPage]);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadDoc = async () => {
      try {
        let buffer: ArrayBuffer;
        if (file instanceof File) {
          buffer = await file.arrayBuffer();
        } else if (file instanceof Uint8Array) {
          buffer = file.buffer as ArrayBuffer;
        } else {
          buffer = file;
        }

        const task = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const doc = await task.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setPageCount(doc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Error loading PDF in viewer:', err);
          setError(err.message || 'Failed to render PDF preview.');
          setLoading(false);
        }
      }
    };

    loadDoc();
    return () => {
      isCancelled = true;
    };
  }, [file]);

  // Render Page to Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let renderTask: any = null;

    const render = async () => {
      try {
        const pageObj = await pdfDoc.getPage(page);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = pageObj.getViewport({ scale: zoom * 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        renderTask = pageObj.render({
          canvasContext: ctx,
          viewport,
        });

        await renderTask.promise;

        // Custom overlay rendering (watermarks, signatures, redactions)
        if (overlayRenderer) {
          overlayRenderer(ctx, viewport.width, viewport.height, page);
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Page render error:', err);
        }
      }
    };

    render();
    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, page, zoom, overlayRenderer]);

  const handlePrevPage = () => {
    if (page > 1) {
      const next = page - 1;
      setPage(next);
      onPageChange?.(next);
    }
  };

  const handleNextPage = () => {
    if (page < pageCount) {
      const next = page + 1;
      setPage(next);
      onPageChange?.(next);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-slate-200 min-h-[320px] ${className}`}>
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Rendering document preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-amber-50/50 rounded-2xl border border-amber-200 min-h-[260px] text-center ${className}`}>
        <FileWarning className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-xs font-bold text-slate-800 mb-1">Preview Unavailable</p>
        <p className="text-[11px] text-slate-500 max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Viewer Canvas Container */}
      <div className="relative max-w-full overflow-auto bg-slate-200/70 p-4 rounded-2xl shadow-inner border border-slate-300/60 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          onClick={(e) => {
            if (canvasRef.current && onClickCanvas) {
              const rect = canvasRef.current.getBoundingClientRect();
              const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
              const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
              onClickCanvas(e, x, y);
            }
          }}
          className="rounded-lg shadow-lg bg-white max-w-full h-auto cursor-crosshair transition-transform"
          style={{ maxHeight: '68vh' }}
        />
      </div>

      {/* Navigation Controls Bar */}
      {showControls && pageCount > 0 && (
        <div className="mt-3 flex items-center justify-between w-full max-w-md px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2">
              Page <span className="font-bold text-slate-900">{page}</span> of {pageCount}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={page >= pageCount}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-500 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
