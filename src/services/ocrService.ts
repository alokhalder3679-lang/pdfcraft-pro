import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

export interface OCRProgress {
  status: string;
  progress: number;
}

export async function runOCR(
  fileBytes: ArrayBuffer,
  fileType: string,
  onProgress?: (p: OCRProgress) => void
): Promise<{ text: string; pdfBytes: Uint8Array }> {
  const worker = await createWorker('eng');

  let fullText = '';
  const isPDF = fileType.includes('pdf');

  if (isPDF) {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBytes) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      onProgress?.({
        status: `Rendering page ${pageNum}/${numPages}`,
        progress: (pageNum - 1) / numPages,
      });

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;

      await page.render({ canvasContext: ctx, viewport }).promise;

      onProgress?.({
        status: `Recognizing text on page ${pageNum}/${numPages}`,
        progress: (pageNum - 0.5) / numPages,
      });

      const ret = await worker.recognize(canvas);
      fullText += `--- Page ${pageNum} ---\n` + ret.data.text + '\n\n';
    }
  } else {
    // Single image file (JPG / PNG)
    onProgress?.({ status: 'Processing image OCR', progress: 0.5 });
    const blob = new Blob([fileBytes], { type: fileType });
    const ret = await worker.recognize(blob);
    fullText = ret.data.text;
  }

  await worker.terminate();
  onProgress?.({ status: 'Generating searchable output', progress: 1.0 });

  // Generate output PDF with extracted text
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const lines = doc.splitTextToSize(fullText, 515);
  let y = 50;

  for (let i = 0; i < lines.length; i++) {
    if (y > 780) {
      doc.addPage();
      y = 50;
    }
    doc.text(lines[i], 40, y);
    y += 15;
  }

  return {
    text: fullText,
    pdfBytes: new Uint8Array(doc.output('arraybuffer')),
  };
}
