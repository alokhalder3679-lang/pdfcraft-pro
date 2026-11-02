import * as pdfjsLib from 'pdfjs-dist';

export const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export function initPdfWorker(): void {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
  }
}

// Ensure worker is registered immediately upon import
initPdfWorker();

export { pdfjsLib };
