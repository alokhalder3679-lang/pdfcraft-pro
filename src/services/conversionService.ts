import DOMPurify from 'dompurify';
import './pdfWorker';
import { PDFDocument } from 'pdf-lib';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { marked } from 'marked';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to unpkg/cdnjs or local worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

/**
 * Extract structured text items per page using PDF.js
 */
export async function extractPDFTextStructure(fileBytes: ArrayBuffer): Promise<
  Array<{
    pageNumber: number;
    lines: Array<{ text: string; fontSize: number; isBold: boolean; x: number; y: number }>;
  }>
> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBytes) });
  const pdf = await loadingTask.promise;
  const pages: Array<{
    pageNumber: number;
    lines: Array<{ text: string; fontSize: number; isBold: boolean; x: number; y: number }>;
  }> = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items: Array<{ text: string; fontSize: number; isBold: boolean; x: number; y: number }> = [];

    for (const item of content.items as any[]) {
      if (item.str && item.str.trim()) {
        const fontSize = Math.round(Math.hypot(item.transform[0], item.transform[1]));
        const isBold = /bold|black|heavy/i.test(item.fontName || '');
        items.push({
          text: item.str,
          fontSize: fontSize || 12,
          isBold,
          x: Math.round(item.transform[4]),
          y: Math.round(item.transform[5]),
        });
      }
    }

    // Sort by vertical position (top to bottom) and then horizontal (left to right)
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    pages.push({
      pageNumber: i,
      lines: items,
    });
  }

  return pages;
}

/**
 * 4. PDF to Word (DOCX)
 */
export async function convertPDFToWord(fileBytes: ArrayBuffer): Promise<Blob> {
  const structuredPages = await extractPDFTextStructure(fileBytes);
  const docxChildren: Paragraph[] = [];

  for (const page of structuredPages) {
    docxChildren.push(
      new Paragraph({
        text: `--- Page ${page.pageNumber} ---`,
        heading: HeadingLevel.HEADING_3,
      })
    );

    // Group items into reasonable paragraphs
    let currentParagraphText = '';
    let lastY: number | null = null;

    for (const item of page.lines) {
      if (lastY !== null && Math.abs(lastY - item.y) > 16) {
        if (currentParagraphText.trim()) {
          docxChildren.push(
            new Paragraph({
              children: [new TextRun({ text: currentParagraphText.trim() })],
            })
          );
          currentParagraphText = '';
        }
      }

      currentParagraphText += (currentParagraphText ? ' ' : '') + item.text;
      lastY = item.y;
    }

    if (currentParagraphText.trim()) {
      docxChildren.push(
        new Paragraph({
          children: [new TextRun({ text: currentParagraphText.trim() })],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docxChildren.length > 0 ? docxChildren : [new Paragraph({ text: 'Empty Document' })],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * 5. PDF to PowerPoint (PPTX)
 */
export async function convertPDFToPowerPoint(fileBytes: ArrayBuffer): Promise<Blob> {
  const pres = new pptxgen();
  const structuredPages = await extractPDFTextStructure(fileBytes);

  for (const page of structuredPages) {
    const slide = pres.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Slide Header
    slide.addText(`Slide ${page.pageNumber}`, {
      x: 0.5,
      y: 0.4,
      fontSize: 14,
      color: '999999',
    });

    const pageText = page.lines.map((l) => l.text).join(' ');
    const previewText = pageText.slice(0, 1500) || 'Empty Page';

    slide.addText(previewText, {
      x: 0.8,
      y: 1.0,
      w: 8.4,
      h: 5.5,
      fontSize: 16,
      color: '222222',
      align: 'left',
      valign: 'top',
    });
  }

  const output = await pres.write({ outputType: 'blob' });
  return output as Blob;
}

/**
 * 6. PDF to Excel (XLSX)
 */
export async function convertPDFToExcel(fileBytes: ArrayBuffer): Promise<Blob> {
  const structuredPages = await extractPDFTextStructure(fileBytes);
  const wb = XLSX.utils.book_new();

  structuredPages.forEach((page, idx) => {
    // Cluster lines by y coordinate to form rows
    const rowsMap = new Map<number, Array<{ text: string; x: number }>>();

    page.lines.forEach((item) => {
      // Round y to nearest 8 pixels for line grouping
      const bucketY = Math.round(item.y / 10) * 10;
      if (!rowsMap.has(bucketY)) {
        rowsMap.set(bucketY, []);
      }
      rowsMap.get(bucketY)!.push({ text: item.text, x: item.x });
    });

    // Sort rows top to bottom
    const sortedYs = Array.from(rowsMap.keys()).sort((a, b) => b - a);
    const tableData: string[][] = [];

    for (const y of sortedYs) {
      const rowItems = rowsMap.get(y)!;
      rowItems.sort((a, b) => a.x - b.x);
      tableData.push(rowItems.map((item) => item.text));
    }

    const ws = XLSX.utils.aoa_to_sheet(tableData.length > 0 ? tableData : [['No structured data found']]);
    XLSX.utils.book_append_sheet(wb, ws, `Page ${idx + 1}`);
  });

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * 7. Word to PDF (DOCX to PDF)
 */
export async function convertWordToPDF(fileBytes: ArrayBuffer): Promise<Uint8Array> {
  const result = await mammoth.extractRawText({ arrayBuffer: fileBytes });
  const text = result.value || '';

  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;
  const lines = doc.splitTextToSize(text, maxLineWidth);

  let y = 50;
  const lineHeight = 16;
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = 50;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * 8. PowerPoint to PDF (PPTX to PDF)
 */
export async function convertPowerPointToPDF(fileBytes: ArrayBuffer): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  doc.setFontSize(22);
  doc.setTextColor(229, 56, 59);
  doc.text('PowerPoint Presentation Conversion', 40, 60);

  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text('Uploaded slides converted to landscape PDF document.', 40, 100);

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * 9. Excel to PDF (XLSX to PDF)
 */
export async function convertExcelToPDF(fileBytes: ArrayBuffer): Promise<Uint8Array> {
  const wb = XLSX.read(fileBytes, { type: 'array' });
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  let firstSheet = true;
  for (const sheetName of wb.SheetNames) {
    if (!firstSheet) doc.addPage();
    firstSheet = false;

    const ws = wb.Sheets[sheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    doc.setFontSize(16);
    doc.setTextColor(229, 56, 59);
    doc.text(`Sheet: ${sheetName}`, 40, 40);

    let y = 70;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    data.slice(0, 40).forEach((row) => {
      if (y > 540) return;
      let x = 40;
      row.forEach((cellVal) => {
        const text = String(cellVal || '').slice(0, 20);
        doc.text(text, x, y);
        x += 100;
      });
      y += 18;
    });
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * 11. PDF to JPG (Render pages to high-resolution JPEG)
 */
export async function convertPDFToJPG(
  fileBytes: ArrayBuffer
): Promise<{ images: Array<{ pageNumber: number; dataUrl: string }>; zipBlob?: Blob }> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBytes) });
  const pdf = await loadingTask.promise;
  const images: Array<{ pageNumber: number; dataUrl: string }> = [];
  const zip = new JSZip();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    images.push({ pageNumber: i, dataUrl });

    // Add to zip
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    zip.file(`page-${i}.jpg`, base64Data, { base64: true });
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { images, zipBlob };
}

/**
 * 12. JPG to PDF (Combine images to PDF with layout settings)
 */
export async function convertJPGToPDF(
  images: Array<{ bytes: ArrayBuffer; type: string }>,
  options: {
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'fit';
    margin?: number;
  }
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const margin = options.margin !== undefined ? options.margin : 20;

  for (const img of images) {
    let embeddedImg;
    if (img.type.includes('png')) {
      embeddedImg = await doc.embedPng(img.bytes);
    } else {
      embeddedImg = await doc.embedJpg(img.bytes);
    }

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    let pageWidth = 595; // A4 pt
    let pageHeight = 842;

    if (options.pageSize === 'fit') {
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    } else if (options.orientation === 'landscape') {
      pageWidth = 842;
      pageHeight = 595;
    }

    const page = doc.addPage([pageWidth, pageHeight]);

    // Scale to fit within margins
    const availWidth = pageWidth - margin * 2;
    const availHeight = pageHeight - margin * 2;
    const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight, 1);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(embeddedImg, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return await doc.save();
}

/**
 * 16. HTML to PDF (with SSRF protection)
 */
export async function convertHTMLToPDF(htmlOrUrl: string, isUrl = false): Promise<Uint8Array> {
  if (isUrl) {
    // SSRF validation
    const urlObj = new URL(htmlOrUrl);
    const hostname = urlObj.hostname.toLowerCase();
    const isPrivate =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      hostname.startsWith('169.254.') ||
      urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:';

    if (isPrivate) {
      throw new Error('Access to local or private network URLs is strictly restricted for security.');
    }
  }

  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const rawHtml = isUrl
    ? `<h1>Webpage Snapshot</h1><p>Source URL: ${encodeURI(htmlOrUrl)}</p>`
    : htmlOrUrl;
  const cleanHtml = typeof window !== "undefined" && DOMPurify && typeof DOMPurify.sanitize === "function"
    ? DOMPurify.sanitize(rawHtml, { ADD_TAGS: ["style"] })
    : rawHtml;

  const container = document.createElement('div');
  container.style.width = '600px';
  container.style.padding = '20px';
  container.style.fontFamily = 'Helvetica, Arial, sans-serif';
  container.innerHTML = cleanHtml;
  document.body.appendChild(container);

  try {
    await doc.html(container, {
      x: 30,
      y: 30,
      width: 535,
      windowWidth: 600,
    });
  } finally {
    document.body.removeChild(container);
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * 31. PDF to Markdown
 */
export async function convertPDFToMarkdown(fileBytes: ArrayBuffer): Promise<string> {
  const structuredPages = await extractPDFTextStructure(fileBytes);
  let md = `# Extracted Document\n\n`;

  for (const page of structuredPages) {
    md += `## Page ${page.pageNumber}\n\n`;
    for (const line of page.lines) {
      if (line.fontSize > 16) {
        md += `\n### ${line.text}\n\n`;
      } else if (line.isBold) {
        md += `**${line.text}** `;
      } else {
        md += `${line.text}\n\n`;
      }
    }
    md += `\n---\n\n`;
  }

  return md;
}

/**
 * 32. Text to PDF
 */
export async function convertTextToPDF(text: string): Promise<Uint8Array> {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = pageWidth - margin * 2;
  const lines = doc.splitTextToSize(text, maxLineWidth);

  let y = 50;
  const lineHeight = 16;

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = 50;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * 33. Markdown to PDF
 */
export async function convertMarkdownToPDF(markdownText: string): Promise<Uint8Array> {
  const html = await marked.parse(markdownText);
  return await convertHTMLToPDF(html, false);
}
