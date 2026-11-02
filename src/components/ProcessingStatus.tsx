import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle, Download, RefreshCw, ArrowRight, FileCheck, ShieldCheck, ArrowDownRight } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  progress?: number; // 0 to 1
  error?: string | null;
  downloadUrl?: string | null;
  downloadFileName?: string;
  outputSize?: number;
  originalSize?: number;
  onReset?: () => void;
  onProcess?: () => void;
  processButtonText?: string;
  canProcess?: boolean;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  message,
  progress,
  error,
  downloadUrl,
  downloadFileName = 'processed.pdf',
  outputSize,
  originalSize,
  onReset,
  onProcess,
  processButtonText = 'Process Document',
  canProcess = true,
}) => {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const savingsPercent =
    originalSize && outputSize && originalSize > outputSize
      ? Math.round(((originalSize - outputSize) / originalSize) * 100)
      : null;

  return (
    <div className="w-full">
      {/* Idle / Ready to process Action Button */}
      {status === 'idle' && onProcess && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onProcess}
            disabled={!canProcess}
            className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>{processButtonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Processed locally • No files leave your device</span>
          </div>
        </div>
      )}

      {/* Processing State */}
      {status === 'processing' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-card animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            {message || 'Working on your document...'}
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Processing directly on your device • Zero network uploads
          </p>

          {progress !== undefined && progress >= 0 && (
            <div className="max-w-xs mx-auto">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
                <div
                  className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600">
                {Math.round(progress * 100)}% Complete
              </span>
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-emerald-200/90 bg-emerald-50/15 text-center shadow-card animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h4 className="text-lg font-black text-slate-900 mb-1">Ready to Download!</h4>
          <p className="text-xs text-slate-500 mb-4">
            Your file was generated and verified safely in your browser.
          </p>

          {/* Metrics */}
          {outputSize !== undefined && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200/70">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>File Size: <strong>{formatSize(outputSize)}</strong></span>
              </span>

              {savingsPercent !== null && savingsPercent > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>{savingsPercent}% smaller</span>
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={downloadFileName}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download {downloadFileName}</span>
              </a>
            )}

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="bg-white rounded-2xl p-6 border border-rose-200 bg-rose-50/20 text-center shadow-card animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Unable to Process Document</h4>
          <p className="text-xs text-rose-700 font-medium mb-4 max-w-md mx-auto leading-relaxed">
            {error || 'An unexpected issue occurred while processing the file. Please ensure the document is not corrupted or password-protected.'}
          </p>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};
