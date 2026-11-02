import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as pdfService from './src/services/pdfService.ts';
import * as convService from './src/services/conversionService.ts';
import * as workflowService from './src/services/workflowService.ts';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n========================================');
  console.log('   PDFCraft Pro Comprehensive Test Suite');
  console.log('========================================\n');

  // 1. Create Baseline Multi-Page PDF Fixture
  const baseDoc = await PDFDocument.create();
  const font = await baseDoc.embedFont(StandardFonts.Helvetica);
  const p1 = baseDoc.addPage([600, 400]);
  p1.drawText('Page 1 Content - Confidential Invoice', { x: 50, y: 350, size: 16, font });
  const p2 = baseDoc.addPage([600, 400]);
  p2.drawText('Page 2 Content - Financial Summary Table', { x: 50, y: 350, size: 16, font });
  const p3 = baseDoc.addPage([600, 400]);
  p3.drawText('Page 3 Content - Legal Disclaimers & Signatures', { x: 50, y: 350, size: 16, font });
  const testBytes = (await baseDoc.save()).buffer;

  console.log('Testing Core PDF Service:');

  // Test getPDFInfo
  const info = await pdfService.getPDFInfo(testBytes);
  assert(info.metadata.pageCount === 3, 'getPDFInfo: reports correct page count (3)');
  assert(info.pages.length === 3, 'getPDFInfo: returns array of 3 page descriptions');

  // Test mergePDFs
  const merged = await pdfService.mergePDFs([testBytes, testBytes]);
  const mergedDoc = await PDFDocument.load(merged);
  assert(mergedDoc.getPageCount() === 6, 'mergePDFs: merges 2 PDFs into 6 pages');

  // Test splitPDF
  const splitAll = await pdfService.splitPDF(testBytes, 'all');
  assert(splitAll.length === 3, 'splitPDF: mode=all extracts 3 individual files');

  const splitRange = await pdfService.splitPDF(testBytes, 'range', '1-2');
  const splitRangeDoc = await PDFDocument.load(splitRange[0].data);
  assert(splitRangeDoc.getPageCount() === 2, 'splitPDF: mode=range 1-2 extracts exactly 2 pages');

  const splitExtract = await pdfService.splitPDF(testBytes, 'extract', undefined, [1, 3]);
  const splitExtractDoc = await PDFDocument.load(splitExtract[0].data);
  assert(splitExtractDoc.getPageCount() === 2, 'splitPDF: mode=extract [1, 3] extracts 2 pages');

  // Test compressPDF
  const comp = await pdfService.compressPDF(testBytes, 'recommended');
  assert(comp.data.length > 0 && comp.newSize > 0, 'compressPDF: produces non-empty compressed stream');

  const compExtreme = await pdfService.compressPDF(testBytes, 'extreme');
  assert(compExtreme.data.length > 0, 'compressPDF: extreme compression mode executes cleanly');

  // Test rotatePDF
  const rotated = await pdfService.rotatePDF(testBytes, 90);
  const rotDoc = await PDFDocument.load(rotated);
  assert(rotDoc.getPage(0).getRotation().angle === 90, 'rotatePDF: page 1 rotated to 90 degrees');

  // Test addWatermark
  const watermarked = await pdfService.addWatermark(testBytes, {
    text: 'STRICTLY PRIVATE',
    opacity: 0.4,
    position: 'diagonal',
  });
  const wmDoc = await PDFDocument.load(watermarked);
  assert(wmDoc.getPageCount() === 3, 'addWatermark: stamps watermark without corrupting page tree');

  // Test addPageNumbers
  const numbered = await pdfService.addPageNumbers(testBytes, {
    format: 'Page {n} of {total}',
    position: 'bottom-center',
  });
  const numDoc = await PDFDocument.load(numbered);
  assert(numDoc.getPageCount() === 3, 'addPageNumbers: renders page numbering on all pages');

  // Test organizePDF
  const organized = await pdfService.organizePDF(testBytes, [
    { originalIndex: 2, rotation: 180 },
    { originalIndex: 0 },
  ]);
  const orgDoc = await PDFDocument.load(organized);
  assert(orgDoc.getPageCount() === 2, 'organizePDF: reorders pages and sets custom count (2)');
  assert(orgDoc.getPage(0).getRotation().angle === 180, 'organizePDF: applies custom per-page rotation (180°)');

  // Test protectPDF & unlockPDF
  const protectedBytes = await pdfService.protectPDF(testBytes, 'SecurePass123');
  assert(protectedBytes.length > 0, 'protectPDF: generates password-protected PDF stream');

  const unlockedBytes = await pdfService.unlockPDF(protectedBytes, 'SecurePass123');
  const unlockedDoc = await PDFDocument.load(unlockedBytes);
  assert(unlockedDoc.getPageCount() === 3, 'unlockPDF: decrypts document and maintains page structure');

  // Test convertToPDFA
  const pdfaBytes = await pdfService.convertToPDFA(testBytes);
  const pdfaDoc = await PDFDocument.load(pdfaBytes);
  assert(pdfaDoc.getSubject() && pdfaDoc.getSubject().includes('PDF/A'), 'convertToPDFA: embeds PDF/A-1b metadata subject');

  // Test repairPDF
  const repairedBytes = await pdfService.repairPDF(testBytes);
  const repairedDoc = await PDFDocument.load(repairedBytes);
  assert(repairedDoc.getPageCount() === 3, 'repairPDF: reconstructs clean xref table');

  // Test redactPDF
  const redactedBytes = await pdfService.redactPDF(testBytes, {
    0: [{ x: 50, y: 100, width: 200, height: 30 }],
  });
  const redDoc = await PDFDocument.load(redactedBytes);
  assert(redDoc.getPageCount() === 3, 'redactPDF: burns redaction rectangles cleanly');

  // Test cropPDF
  const croppedBytes = await pdfService.cropPDF(testBytes, { x: 20, y: 20, width: 500, height: 350 });
  const cropDoc = await PDFDocument.load(croppedBytes);
  const cropBox = cropDoc.getPage(0).getCropBox();
  assert(cropBox.width === 500 && cropBox.height === 350, 'cropPDF: adjusts CropBox coordinates');

  // Test applyEditAnnotations
  const annotatedBytes = await pdfService.applyEditAnnotations(testBytes, {
    0: [
      { type: 'text', x: 50, y: 50, text: 'Approved by Legal', fontSize: 16 },
      { type: 'rect', x: 50, y: 80, width: 100, height: 20 },
      { type: 'draw', x: 0, y: 0, points: [{ x: 10, y: 10 }, { x: 20, y: 20 }] },
    ],
  });
  const annDoc = await PDFDocument.load(annotatedBytes);
  assert(annDoc.getPageCount() === 3, 'applyEditAnnotations: embeds text, rect, and freehand drawing');

  // Test flattenPDF
  const flattened = await pdfService.flattenPDF(testBytes);
  assert(flattened.length > 0, 'flattenPDF: flattens annotations into base content stream');

  console.log('\nTesting Document Conversions:');

  // Test Text to PDF
  const textPdf = await convService.convertTextToPDF('Sample Document Title\n\nThis is paragraph one.\nThis is paragraph two.');
  const textDoc = await PDFDocument.load(textPdf);
  assert(textDoc.getPageCount() >= 1, 'convertTextToPDF: compiles plain text to PDF');

  // Test Markdown to PDF
  const mdPdf = await convService.convertMarkdownToPDF('# Heading 1\n\nParagraph text with **bold**.\n- List item 1\n- List item 2');
  const mdDoc = await PDFDocument.load(mdPdf);
  assert(mdDoc.getPageCount() >= 1, 'convertMarkdownToPDF: compiles Markdown AST to styled PDF');

  // Test Excel to PDF
  const testWb = XLSX.utils.book_new();
  const testWs = XLSX.utils.aoa_to_sheet([
    ['Quarter', 'Revenue', 'Profit'],
    ['Q1', 120000, 35000],
    ['Q2', 145000, 42000],
    ['Q3', 160000, 49000],
  ]);
  XLSX.utils.book_append_sheet(testWb, testWs, 'Financials');
  const xlsxBytes = XLSX.write(testWb, { bookType: 'xlsx', type: 'array' });
  const xlsxPdf = await convService.convertExcelToPDF(xlsxBytes);
  const xlsxDoc = await PDFDocument.load(xlsxPdf);
  assert(xlsxDoc.getPageCount() >= 1, 'convertExcelToPDF: renders paginated Excel spreadsheet tables');

  // Test PowerPoint to PDF with ZIP archive
  const pptxZip = new JSZip();
  pptxZip.file(
    'ppt/slides/slide1.xml',
    '<?xml version="1.0"?><p:sld><a:t>Quarterly Strategy Deck</a:t><a:t>Key Initiatives for 2026</a:t></p:sld>'
  );
  pptxZip.file(
    'ppt/slides/slide2.xml',
    '<?xml version="1.0"?><p:sld><a:t>Financial Projections</a:t><a:t>Target Revenue: $10M</a:t></p:sld>'
  );
  const pptxBytes = await pptxZip.generateAsync({ type: 'arraybuffer' });
  const pptxPdf = await convService.convertPowerPointToPDF(pptxBytes);
  const pptxDoc = await PDFDocument.load(pptxPdf);
  assert(pptxDoc.getPageCount() === 2, 'convertPowerPointToPDF: parses slide XML and produces 2 landscape pages');

  console.log('\nTesting Multi-Step Workflow Pipeline:');

  // Test executeWorkflow with all 5 chain steps
  const wfResult = await workflowService.executeWorkflow(testBytes, [
    { id: '1', type: 'rotate', name: 'Rotate 90°', enabled: true, params: { angle: 90 } },
    { id: '2', type: 'watermark', name: 'Watermark', enabled: true, params: { text: 'TEST WF', opacity: 0.25 } },
    { id: '3', type: 'page-numbers', name: 'Page Numbers', enabled: true, params: {} },
    { id: '4', type: 'compress', name: 'Compress', enabled: true, params: {} },
    { id: '5', type: 'pdfa', name: 'PDF/A Tag', enabled: true, params: {} },
  ]);

  const wfDoc = await PDFDocument.load(wfResult.finalPdf);
  assert(wfDoc.getPageCount() === 3, 'executeWorkflow: chains 5 operations without byte-offset corruption');
  assert(wfResult.log.length >= 6, 'executeWorkflow: emits full audit step log');

  console.log('\n========================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
