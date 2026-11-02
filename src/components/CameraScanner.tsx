import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Sparkles, Trash2, CheckCircle, RefreshCw } from 'lucide-react';

interface CameraScannerProps {
  onCaptureScans: (files: File[]) => void;
  className?: string;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCaptureScans, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [capturedScans, setCapturedScans] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'color' | 'contrast' | 'grayscale'>('contrast');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Unable to access device camera. Please check browser permissions or upload scans directly.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply document contrast/grayscale filter
    if (filterMode === 'contrast') {
      ctx.filter = 'contrast(1.4) brightness(1.05) grayscale(0.2)';
    } else if (filterMode === 'grayscale') {
      ctx.filter = 'grayscale(1) contrast(1.2)';
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const updated = [...capturedScans, dataUrl];
    setCapturedScans(updated);

    // Convert dataUrl to File objects
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `scan-${updated.length}.jpg`, { type: 'image/jpeg' });
          onCaptureScans([file]);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const removeScan = (index: number) => {
    const next = capturedScans.filter((_, i) => i !== index);
    setCapturedScans(next);
  };

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 ${className}`}>
      {/* Header & Camera Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-rose-500" />
            <span>Document Camera Scanner</span>
          </h4>
          <p className="text-[11px] text-slate-500">Live capture receipts, agreements, or book pages</p>
        </div>

        {!streamActive ? (
          <button
            type="button"
            onClick={startCamera}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" /> Start Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <CameraOff className="w-3.5 h-3.5" /> Stop Camera
          </button>
        )}
      </div>

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          {cameraError}
        </div>
      )}

      {/* Live Stream Viewport */}
      {streamActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-lg mx-auto border-2 border-slate-800 shadow-lg">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {/* Document Framing Guide lines */}
          <div className="absolute inset-8 border-2 border-white/50 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-white/60 text-[11px] font-mono tracking-widest bg-black/40 px-2 py-0.5 rounded">
              ALIGN DOCUMENT HERE
            </span>
          </div>

          {/* Shutter Button */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={captureFrame}
              className="w-14 h-14 rounded-full bg-white border-4 border-rose-500 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Capture Scan"
            >
              <div className="w-9 h-9 rounded-full bg-rose-600"></div>
            </button>
          </div>
        </div>
      )}

      {/* Captured Frames Reel */}
      {capturedScans.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Captured Pages ({capturedScans.length}):</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {capturedScans.map((src, i) => (
              <div key={i} className="relative flex-shrink-0 w-24 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                <img src={src} alt={`Scan ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeScan(i)}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded font-mono">
                  #{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
