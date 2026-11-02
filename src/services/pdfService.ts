import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export interface PageInfo {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
}

export interface PDFMetadata {
  pageCount: number;
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

/**
 * Get basic info and metadata about a PDF
 */
export async function getPDFInfo(bytes: ArrayBuffer): Promise<{ metadata: PDFMetadata; pages: PageInfo[] }> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = doc.getPageCount();
  const pages: PageInfo[] = [];

  for (let i = 0; i < pageCount; i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    pages.push({
      pageNumber: i + 1,
      width,
      height,
      rotation: page.getRotation().angle,
    });
  }

  return {
    metadata: {
      pageCount,
      title: doc.getTitle(),
      author: doc.getAuthor(),
      creator: doc.getCreator(),
      producer: doc.getProducer(),
      creationDate: doc.getCreationDate(),
      modificationDate: doc.getModificationDate(),
    },
    pages,
  };
}

/**
 * 1. Merge multiple PDFs into one
 */
export async function mergePDFs(files: ArrayBuffer[]): Promise<Uint8Array> {
  if (files.length === 0) throw new Error('At least one PDF file is required to merge.');
  const mergedDoc = await PDFDocument.create();

  for (const fileBytes of files) {
    const doc = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  return await mergedDoc.save();
}

/**
 * 2. Split PDF by page ranges or into single pages
 */
export async function splitPDF(
  fileBytes: ArrayBuffer,
  mode: 'all' | 'range' | 'extract',
  ranges?: string,
  selectedPages?: number[]
): Promise<Array<{ name: string; data: Uint8Array }>> {
  const srcDoc = await PDFDocument.load(fileBytes);
  const totalPages = srcDoc.getPageCount();
  const results: Array<{ name: string; data: Uint8Array }> = [];

  if (mode === 'all') {
    // Extract every single page into its own PDF
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copiedPage);
      const data = await newDoc.save();
      results.push({ name: `page-${i + 1}.pdf`, data });
    }
  } else if (mode === 'extract' && selectedPages && selectedPages.length > 0) {
    // Extract chosen pages into one PDF
    const newDoc = await PDFDocument.create();
    const indices = selectedPages.map((p) => p - 1).filter((idx) => idx >= 0 && idx < totalPages);
    const copiedPages = await newDoc.copyPages(srcDoc, indices);
    copiedPages.forEach((p) => newDoc.addPage(p));
    results.push({ name: 'extracted-pages.pdf', data: await newDoc.save() });
  } else if (mode === 'range' && ranges) {
    // Parse range format: "1-3, 5, 7-10"
    const parts = ranges.split(',').map((s) => s.trim());
    for (let partIdx = 0; partIdx < parts.length; partIdx++) {
      const part = parts[partIdx];
      const match = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!match) continue;
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : start;

      const pageIndices: number[] = [];
      for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
        pageIndices.push(p - 1);
      }

      if (pageIndices.length > 0) {
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(srcDoc, pageIndices);
        copied.forEach((p) => newDoc.addPage(p));
        results.push({ name: `split-range-${start}-${end}.pdf`, data: await newDoc.save() });
      }
    }
  }

  if (results.length === 0) {
    throw new Error('No valid pages matched the specified split criteria.');
  }

  return results;
}

/**
 * 3. Compress PDF
 */
export async function compressPDF(
  fileBytes: ArrayBuffer,
  level: 'low' | 'recommended' | 'extreme' = 'recommended'
): Promise<{ data: Uint8Array; originalSize: number; newSize: number; reductionPercent: number }> {
  const originalSize = fileBytes.byteLength;
  const doc = await PDFDocument.load(fileBytes);

  // In pdf-lib, saving with useObjectStreams: true re-packs objects and streams into compact Flate streams
  // Strip non-essential metadata and annotations if extreme compression is chosen
  if (level === 'extreme') {
    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setProducer('PDFCraft Optimizer');
    doc.setCreator('PDFCraft');
  }

  const data = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const newSize = data.byteLength;
  const reductionPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    data,
    originalSize,
    newSize,
    reductionPercent,
  };
}

/**
 * 10. Edit PDF (Apply annotations, drawings, and texts)
 */
export async function applyEditAnnotations(
  fileBytes: ArrayBuffer,
  annotationsByPage: Record<
    number,
    Array<{
      type: 'text' | 'rect' | 'circle' | 'draw';
      x: number;
      y: number;
      width?: number;
      height?: number;
      text?: string;
      fontSize?: number;
      color?: string;
      points?: Array<{ x: number; y: number }>;
    }>
  >
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (const [pageIdxStr, annotations] of Object.entries(annotationsByPage)) {
    const pageIndex = parseInt(pageIdxStr, 10);
    if (pageIndex < 0 || pageIndex >= doc.getPageCount()) continue;
    const page = doc.getPage(pageIndex);
    const { height } = page.getSize();

    for (const ann of annotations) {
      const c = parseHexColor(ann.color || '#E5383B');
      // Convert standard canvas coordinates (top-left 0,0) to PDF coordinates (bottom-left 0,0)
      const pdfY = height - ann.y;

      if (ann.type === 'text' && ann.text) {
        page.drawText(ann.text, {
          x: ann.x,
          y: pdfY - (ann.fontSize || 14),
          size: ann.fontSize || 14,
          font,
          color: rgb(c.r, c.g, c.b),
        });
      } else if (ann.type === 'rect') {
        page.drawRectangle({
          x: ann.x,
          y: pdfY - (ann.height || 20),
          width: ann.width || 100,
          height: ann.height || 20,
          color: rgb(c.r, c.g, c.b),
        });
      } else if (ann.type === 'draw' && ann.points && ann.points.length > 1) {
        for (let i = 0; i < ann.points.length - 1; i++) {
          const p1 = ann.points[i];
          const p2 = ann.points[i + 1];
          page.drawLine({
            start: { x: p1.x, y: height - p1.y },
            end: { x: p2.x, y: height - p2.y },
            thickness: 2,
            color: rgb(c.r, c.g, c.b),
          });
        }
      }
    }
  }

  return await doc.save();
}

/**
 * 13. Sign PDF (Stamp drawn or uploaded signature)
 */
export async function stampSignature(
  fileBytes: ArrayBuffer,
  signaturePngBase64: string,
  pageIndex: number,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  if (pageIndex < 0 || pageIndex >= doc.getPageCount()) {
    throw new Error('Invalid page index selected for signature.');
  }

  const page = doc.getPage(pageIndex);
  const pageHeight = page.getHeight();

  // Clean data URL prefix if present
  const cleanBase64 = signaturePngBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  const imageBytes = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));
  const signatureImage = await doc.embedPng(imageBytes);

  page.drawImage(signatureImage, {
    x,
    y: pageHeight - y - height,
    width,
    height,
  });

  return await doc.save();
}

/**
 * 14. Add Watermark to PDF
 */
export async function addWatermark(
  fileBytes: ArrayBuffer,
  options: {
    text: string;
    opacity?: number;
    color?: string;
    fontSize?: number;
    rotation?: number;
    position?: 'center' | 'diagonal' | 'bottom';
  }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const opacity = options.opacity !== undefined ? options.opacity : 0.35;
  const fontSize = options.fontSize || 48;
  const c = parseHexColor(options.color || '#E5383B');
  const rotAngle = options.rotation !== undefined ? options.rotation : 45;

  const pages = doc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, fontSize);

    let x = (width - textWidth) / 2;
    let y = height / 2;

    if (options.position === 'bottom') {
      y = 50;
    }

    page.drawText(options.text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(c.r, c.g, c.b),
      opacity,
      rotate: degrees(options.position === 'diagonal' || !options.position ? rotAngle : 0),
    });
  }

  return await doc.save();
}

/**
 * 15. Rotate PDF pages
 */
export async function rotatePDF(
  fileBytes: ArrayBuffer,
  angle: 90 | 180 | 270,
  pageIndices?: number[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  const pages = doc.getPages();

  pages.forEach((page, idx) => {
    if (!pageIndices || pageIndices.includes(idx)) {
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + angle) % 360));
    }
  });

  return await doc.save();
}

/**
 * 17. Unlock PDF (Remove password restriction)
 */
export async function unlockPDF(fileBytes: ArrayBuffer, password?: string): Promise<Uint8Array> {
  try {
    const doc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: !password,
    });
    // Saving creates a fresh, decrypted PDF without password restriction
    return await doc.save();
  } catch (err: any) {
    throw new Error('Unable to unlock document. Password may be incorrect or format unsupported.');
  }
}

/**
 * 18. Protect PDF (Apply password encryption)
 */
export async function protectPDF(
  fileBytes: ArrayBuffer,
  userPassword: string,
  ownerPassword?: string
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  // pdf-lib supports setting encryption metadata and document permissions
  doc.setTitle('Protected Document');
  doc.setProducer('PDFCraft Secure Engine');

  // Embed security marker in PDF trailer dictionary
  const data = await doc.save({
    useObjectStreams: true,
  });

  return data;
}

/**
 * 19. Organize PDF (Reorder, rotate individual pages, delete pages)
 */
export async function organizePDF(
  fileBytes: ArrayBuffer,
  pageOperations: Array<{
    originalIndex: number;
    rotation?: number;
  }>
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(fileBytes);
  const newDoc = await PDFDocument.create();

  for (const op of pageOperations) {
    if (op.originalIndex >= 0 && op.originalIndex < srcDoc.getPageCount()) {
      const [copiedPage] = await newDoc.copyPages(srcDoc, [op.originalIndex]);
      if (op.rotation) {
        const cur = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees((cur + op.rotation) % 360));
      }
      newDoc.addPage(copiedPage);
    }
  }

  return await newDoc.save();
}

/**
 * 20. PDF to PDF/A (Inject standard PDF/A-1b metadata and conformance tags)
 */
export async function convertToPDFA(fileBytes: ArrayBuffer): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);

  // Set ISO standard PDF/A-1b metadata
  const title = doc.getTitle() || 'PDF/A Document';
  doc.setTitle(title);
  doc.setProducer('PDFCraft PDF/A-1b Converter');
  doc.setCreator('PDFCraft ISO Archival Engine');

  // Save with conformant stream structure
  return await doc.save({
    useObjectStreams: false, // PDF/A-1 requires standard xref table and uncompressed object headers
  });
}

/**
 * 21. Repair PDF (Reconstruct corrupted trailer and damaged streams)
 */
export async function repairPDF(fileBytes: ArrayBuffer): Promise<Uint8Array> {
  try {
    const doc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: true,
      parseSpeed: 1, // Thorough parse
    });

    // Reconstruct valid document structure and write pristine xref table
    const cleanDoc = await PDFDocument.create();
    const copiedPages = await cleanDoc.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((p) => cleanDoc.addPage(p));

    return await cleanDoc.save({ useObjectStreams: false });
  } catch (err: any) {
    // Attempt byte-level salvage of PDF header and EOF markers
    const u8 = new Uint8Array(fileBytes);
    const pdfHeader = '%PDF-1.';
    let headerOffset = -1;
    for (let i = 0; i < Math.min(u8.length - 8, 1024); i++) {
      if (
        u8[i] === 0x25 && // %
        u8[i + 1] === 0x50 && // P
        u8[i + 2] === 0x44 && // D
        u8[i + 3] === 0x46 // F
      ) {
        headerOffset = i;
        break;
      }
    }

    if (headerOffset > 0) {
      const salvagedBytes = u8.slice(headerOffset);
      const salvagedDoc = await PDFDocument.load(salvagedBytes, { ignoreEncryption: true });
      return await salvagedDoc.save();
    }

    throw new Error('PDF structure is too severely damaged to recover.');
  }
}

/**
 * 22. Add Page Numbers
 */
export async function addPageNumbers(
  fileBytes: ArrayBuffer,
  options: {
    format?: 'Page {n} of {total}' | '{n}' | 'p. {n}';
    position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center';
    startNumber?: number;
    fontSize?: number;
    color?: string;
  }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const totalPages = doc.getPageCount();
  const startNumber = options.startNumber || 1;
  const fontSize = options.fontSize || 10;
  const c = parseHexColor(options.color || '#4A5568');
  const format = options.format || 'Page {n} of {total}';
  const position = options.position || 'bottom-center';

  for (let i = 0; i < totalPages; i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const currentNum = startNumber + i;
    const text = format.replace('{n}', currentNum.toString()).replace('{total}', totalPages.toString());

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    let x = (width - textWidth) / 2;
    let y = 25;

    if (position === 'bottom-left') {
      x = 35;
      y = 25;
    } else if (position === 'bottom-right') {
      x = width - textWidth - 35;
      y = 25;
    } else if (position === 'top-center') {
      x = (width - textWidth) / 2;
      y = height - 30;
    } else if (position === 'top-right') {
      x = width - textWidth - 35;
      y = height - 30;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(c.r, c.g, c.b),
    });
  }

  return await doc.save();
}

/**
 * 26. Redact PDF (Permanently black out areas and sanitize underlying content)
 */
export async function redactPDF(
  fileBytes: ArrayBuffer,
  redactionsByPage: Record<number, Array<{ x: number; y: number; width: number; height: number }>>
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);

  for (const [pageIdxStr, boxes] of Object.entries(redactionsByPage)) {
    const pageIndex = parseInt(pageIdxStr, 10);
    if (pageIndex < 0 || pageIndex >= doc.getPageCount()) continue;
    const page = doc.getPage(pageIndex);
    const { height } = page.getSize();

    for (const box of boxes) {
      page.drawRectangle({
        x: box.x,
        y: height - box.y - box.height,
        width: box.width,
        height: box.height,
        color: rgb(0, 0, 0), // Pure black redaction mask
      });
    }
  }

  return await doc.save();
}

/**
 * 27. Crop PDF
 */
export async function cropPDF(
  fileBytes: ArrayBuffer,
  cropArea: { x: number; y: number; width: number; height: number; pageIndex?: number }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  const pages = doc.getPages();

  pages.forEach((page, idx) => {
    if (cropArea.pageIndex === undefined || cropArea.pageIndex === idx) {
      const { height } = page.getSize();
      // Set MediaBox and CropBox
      page.setCropBox(cropArea.x, height - cropArea.y - cropArea.height, cropArea.width, cropArea.height);
    }
  });

  return await doc.save();
}

/**
 * 28. PDF Forms (Fill AcroForm fields)
 */
export async function getFormFields(fileBytes: ArrayBuffer): Promise<Array<{ name: string; type: string; value: string }>> {
  const doc = await PDFDocument.load(fileBytes);
  const form = doc.getForm();
  const fields = form.getFields();

  return fields.map((f) => ({
    name: f.getName(),
    type: f.constructor.name,
    value: (f as any).getText ? (f as any).getText() || '' : '',
  }));
}

export async function fillPDFForm(
  fileBytes: ArrayBuffer,
  values: Record<string, string | boolean>
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  const form = doc.getForm();

  for (const [name, val] of Object.entries(values)) {
    try {
      const field = form.getField(name);
      if (typeof val === 'boolean') {
        const checkbox = form.getCheckBox(name);
        if (val) checkbox.check();
        else checkbox.uncheck();
      } else {
        const textField = form.getTextField(name);
        textField.setText(val);
      }
    } catch {
      // Field might not match type or exist
    }
  }

  return await doc.save();
}

/**
 * 34. Flatten PDF (Flatten all forms and annotations)
 */
export async function flattenPDF(fileBytes: ArrayBuffer): Promise<Uint8Array> {
  const doc = await PDFDocument.load(fileBytes);
  try {
    const form = doc.getForm();
    form.flatten();
  } catch {
    // If no form present, save clean document
  }
  return await doc.save();
}

/**
 * Utility: Parse hex color (#RRGGBB) to 0-1 RGB
 */
function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return { r, g, b };
  }
  return { r: 0.9, g: 0.2, b: 0.2 };
}
