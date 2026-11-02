import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, ArrowUp, ArrowDown, Plus, AlertCircle, FileCheck } from 'lucide-react';

interface FileUploaderProps {
  accept: string[];
  maxFiles: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  maxFiles,
  files,
  onFilesChange,
  title = 'Select PDF files',
  subtitle = 'or drop files anywhere in this box',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndAddFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validList: File[] = [];
    const allowedExtensions = accept.map((ext) => ext.toLowerCase());

    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      // Check extension
      const isAllowed =
        allowedExtensions.includes(ext) ||
        accept.some((a) => file.type.toLowerCase().includes(a.replace('.', '')));

      if (!isAllowed) {
        setErrorMessage(`"${file.name}" has an unsupported format. Allowed: ${accept.join(', ')}`);
        continue;
      }

      // Check size limit: 100MB
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 100MB size limit.`);
        continue;
      }

      validList.push(file);
    }

    if (maxFiles === 1) {
      if (validList.length > 0) {
        onFilesChange([validList[0]]);
      }
    } else {
      const combined = [...files, ...validList].slice(0, maxFiles);
      if (files.length + validList.length > maxFiles) {
        setErrorMessage(`Maximum allowed files for this tool is ${maxFiles}.`);
      }
      onFilesChange(combined);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, idx) => idx !== index);
    onFilesChange(updated);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= files.length) return;
    const reordered = [...files];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    onFilesChange(reordered);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept.join(',')}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) validateAndAddFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {files.length === 0 ? (
        /* Empty State Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-rose-500 bg-rose-50/60 scale-[1.01]'
              : 'border-slate-200 bg-white hover:border-rose-400 hover:bg-slate-50/50 shadow-card'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            {/* Action button */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-600/25 mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
            </div>

            <button
              type="button"
              className="px-7 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/25 hover:shadow-xl transition-all cursor-pointer mb-2 flex items-center gap-2"
            >
              <span>{title}</span>
            </button>

            <p className="text-xs font-semibold text-slate-500 mb-3">{subtitle}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Supports {accept.join(', ')}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Max {maxFiles} file{maxFiles > 1 ? 's' : ''} (up to 100MB)
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Selected Files List View */
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>Selected Files</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px]">
                {files.length} {maxFiles > 1 ? `/ ${maxFiles}` : ''}
              </span>
            </h4>

            {maxFiles > files.length && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add more
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-rose-100/80 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{formatSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-3">
                  {maxFiles > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, 'down')}
                        disabled={idx === files.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    title="Remove File"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error notification */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
