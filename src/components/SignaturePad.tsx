import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Upload, Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureReady: (base64Png: string) => void;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureReady, className = '' }) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState('Alex Mercer');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    if (tab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tab]);

  // Generate output on typed change
  useEffect(() => {
    if (tab === 'type') {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `italic 36px ${selectedFont}, 'Brush Script MT', cursive`;
        ctx.fillStyle = '#0F172A';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 20, 60);
        onSignatureReady(canvas.toDataURL('image/png'));
      }
    }
  }, [tab, typedName, selectedFont]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      onSignatureReady(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSignatureReady(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm ${className}`}>
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-100 pb-3 mb-4 gap-2">
        <button
          type="button"
          onClick={() => setTab('draw')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            tab === 'draw' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" /> Draw
        </button>
        <button
          type="button"
          onClick={() => setTab('type')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            tab === 'type' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Type className="w-3.5 h-3.5" /> Type Name
        </button>
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            tab === 'upload' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload Image
        </button>
      </div>

      {/* Draw Mode */}
      {tab === 'draw' && (
        <div className="space-y-3">
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={420}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[140px] cursor-crosshair touch-none"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 font-medium">
                Sign here with mouse or touch
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" /> Clear Signature
            </button>
            <span className="text-slate-400 font-mono text-[11px]">Ink: Dark Slate</span>
          </div>
        </div>
      )}

      {/* Type Mode */}
      {tab === 'type' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name:</label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Handwriting Style:</label>
            <div className="grid grid-cols-2 gap-2">
              {['cursive', 'serif', 'sans-serif', 'monospace'].map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setSelectedFont(font)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedFont === font
                      ? 'border-rose-500 bg-rose-50/40 text-rose-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-lg italic" style={{ fontFamily: font }}>
                    {typedName || 'Sample Signature'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Mode */}
      {tab === 'upload' && (
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            className="hidden"
            id="sig-upload"
          />
          <label htmlFor="sig-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800 mb-0.5">Upload signature image</p>
            <p className="text-[11px] text-slate-500">PNG or JPG with transparent or clean background</p>
          </label>
        </div>
      )}
    </div>
  );
};
