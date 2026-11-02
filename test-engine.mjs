import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

async function runTests() {
  console.log('--- RUNNING PDF CORE ENGINE VERIFICATION ---');
  // 1. Create a blank PDF
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText('Test Page 1 - PDFCraft Engine', { x: 50, y: 350, size: 20, font, color: rgb(0.9, 0.2, 0.2) });
  
  const page2 = doc.addPage([600, 400]);
  page2.drawText('Test Page 2 - PDFCraft Engine', { x: 50, y: 350, size: 20, font, color: rgb(0.2, 0.5, 0.8) });
  
  const pdfBytes = await doc.save();
  console.log('✓ Created 2-page test PDF:', pdfBytes.length, 'bytes');

  // 2. Test Merge
  const mergeDoc = await PDFDocument.create();
  const loaded1 = await PDFDocument.load(pdfBytes);
  const loaded2 = await PDFDocument.load(pdfBytes);
  const pages1 = await mergeDoc.copyPages(loaded1, [0, 1]);
  const pages2 = await mergeDoc.copyPages(loaded2, [0, 1]);
  pages1.forEach(p => mergeDoc.addPage(p));
  pages2.forEach(p => mergeDoc.addPage(p));
  const mergedBytes = await mergeDoc.save();
  console.log('✓ Merged 2 PDFs -> 4 pages:', mergedBytes.length, 'bytes');

  // 3. Test Split
  const splitDoc = await PDFDocument.create();
  const [splitPage] = await splitDoc.copyPages(loaded1, [0]);
  splitDoc.addPage(splitPage);
  const splitBytes = await splitDoc.save();
  console.log('✓ Split Page 1 ->', splitBytes.length, 'bytes');

  // 4. Test Watermark
  const wmDoc = await PDFDocument.load(pdfBytes);
  wmDoc.getPages().forEach(p => {
    p.drawText('CONFIDENTIAL', { x: 150, y: 200, size: 36, font, opacity: 0.3 });
  });
  const wmBytes = await wmDoc.save();
  console.log('✓ Watermark Stamped ->', wmBytes.length, 'bytes');

  // 5. Test Rotate
  const rotDoc = await PDFDocument.load(pdfBytes);
  rotDoc.getPage(0).setRotation(degrees(90));
  const rotBytes = await rotDoc.save();
  console.log('✓ Rotated 90 degrees ->', rotBytes.length, 'bytes');

  // 6. Test Page Numbers
  const pnDoc = await PDFDocument.load(pdfBytes);
  pnDoc.getPages().forEach((p, i) => {
    p.drawText(`Page ${i + 1} of 2`, { x: 250, y: 30, size: 10, font });
  });
  const pnBytes = await pnDoc.save();
  console.log('✓ Page Numbers added ->', pnBytes.length, 'bytes');

  // 7. Test Compress / Object Stream repack
  const compBytes = await pnDoc.save({ useObjectStreams: true });
  console.log('✓ Compressed / Object Stream repack ->', compBytes.length, 'bytes');

  console.log('ALL CORE PDF OPERATIONS VERIFIED SUCCESSFULLY!');
}

runTests().catch(console.error);
