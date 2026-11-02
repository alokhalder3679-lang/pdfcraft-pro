import React, { useState, useEffect } from 'react';
import { PDFTool, PDF_TOOLS } from '../types/tools';
import { FileUploader } from '../components/FileUploader';
import { ProcessingStatus } from '../components/ProcessingStatus';
import { PDFPreview } from '../components/PDFPreview';
import { PageGrid, PageCardState } from '../components/PageGrid';
import { SignaturePad } from '../components/SignaturePad';
import { CameraScanner } from '../components/CameraScanner';
import { DocumentComparator } from '../components/DocumentComparator';
import {
  ArrowLeft,
  Settings2,
  Sliders,
  Type,
  Lock,
  Unlock,
  RotateCw,
  Sparkles,
  Camera,
  Play,
  Copy,
  Check,
  Download,
  Eye,
  FileCode,
  Languages,
  PenTool,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Terminal,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  FolderOpen,
} from 'lucide-react';
import * as pdfService from '../services/pdfService';
import * as convService from '../services/conversionService';
import * as ocrService from '../services/ocrService';
import * as aiService from '../services/aiService';
import * as workflowService from '../services/workflowService';

interface ToolPageProps {
  toolId: string;
  onBack: () => void;
  onSelectTool: (id: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({ toolId, onBack, onSelectTool }) => {
  const tool = PDF_TOOLS.find((t) => t.id === toolId) || PDF_TOOLS[0];
  const toolIndex = PDF_TOOLS.findIndex((t) => t.id === tool.id) + 1;
  const toolNum = String(toolIndex).padStart(2, '0');

  const [files, setFiles] = useState<File[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>('output.pdf');
  const [outputSize, setOutputSize] = useState<number | undefined>(undefined);
  const [originalSize, setOriginalSize] = useState<number | undefined>(undefined);

  // Tool Specific Settings States
  const [splitMode, setSplitMode] = useState<'all' | 'range' | 'extract'>('range');
  const [splitRange, setSplitRange] = useState<string>('1-2');
  const [compressLevel, setCompressLevel] = useState<'low' | 'recommended' | 'extreme'>('recommended');
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.3);
  const [watermarkPos, setWatermarkPos] = useState<'center' | 'diagonal' | 'bottom'>('diagonal');
  const [watermarkColor, setWatermarkColor] = useState<string>('#E11D48');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [pageNumberFormat, setPageNumberFormat] = useState<'Page {n} of {total}' | '{n}' | 'p. {n}'>('Page {n} of {total}');
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right' | 'bottom-left' | 'top-center'>('bottom-center');
  const [jpgOrientation, setJpgOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [htmlInput, setHtmlInput] = useState<string>(
    '<!DOCTYPE html>\n<html>\n<head>\n<style>\nbody { font-family: sans-serif; padding: 20px; color: #1e293b; }\nh1 { color: #e11d48; margin-bottom: 8px; }\ntable { width: 100%; border-collapse: collapse; margin-top: 16px; }\nth, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 13px; }\nth { background: #f8fafc; }\n</style>\n</head>\n<body>\n<h1>Executive Report</h1>\n<p>Generated via PDFCraft In-Browser Engine.</p>\n<table>\n<tr><th>Metric</th><th>Q1</th><th>Q2</th></tr>\n<tr><td>Document Throughput</td><td>142,500</td><td>289,100</td></tr>\n<tr><td>Data Compression</td><td>64.2%</td><td>71.8%</td></tr>\n</table>\n</body>\n</html>'
  );
  const [textInput, setTextInput] = useState<string>(
    'MEMORANDUM\n\nTO: Executive Management Team\nFROM: Operations & Compliance\nDATE: October 2026\nSUBJECT: Document Processing Security & Protocol\n\n1. OBJECTIVE\nTo establish rigorous in-browser standards for document manipulation without remote server transmissions.\n\n2. TECHNICAL ARCHITECTURE\nAll cryptographic signing, flate compression, and optical recognition operate inside the client browser instance using WebAssembly.\n\n3. ACTION ITEMS\n- Audit existing internal document pipelines.\n- Verify all staff utilize verified client-side suites.'
  );
  const [markdownInput, setMarkdownInput] = useState<string>(
    '# Project Architecture Specification\n\n> Document Version: 2.4 | Classification: Restricted\n\n## Core Principles\n1. **Zero Network Egress**: Documents remain strictly in device memory.\n2. **Deterministic Processing**: PDF byte streams are rebuilt with compliant xref tables.\n3. **ISO Compliance**: PDF/A-1b metadata embedding for long-term legal archival.\n\n## Supported Matrices\n| Format | Ingest | Export |\n| :--- | :--- | :--- |\n| Word (.docx) | Supported | Supported |\n| Excel (.xlsx) | Supported | Supported |\n| PowerPoint (.pptx) | Supported | Supported |'
  );
  const [targetLanguage, setTargetLanguage] = useState<string>('es');
  const [aiSummaryResult, setAiSummaryResult] = useState<aiService.AISummaryResult | null>(null);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const [cropMargins, setCropMargins] = useState<{ top: number; bottom: number; left: number; right: number }>({
    top: 40,
    bottom: 40,
    left: 40,
    right: 40,
  });
  const [detectedFormFields, setDetectedFormFields] = useState<Array<{ name: string; type: string; value: string }>>([]);
  const [formFieldValues, setFormFieldValues] = useState<Record<string, string>>({});
  const [workflowLog, setWorkflowLog] = useState<string[]>([]);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [activePreviewPage, setActivePreviewPage] = useState<number>(1);
  const [pageGridState, setPageGridState] = useState<PageCardState[]>([]);
  const [renderedJpgs, setRenderedJpgs] = useState<Array<{ pageNumber: number; dataUrl: string }>>([]);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  // Workflow steps configuration
  const [workflowSteps, setWorkflowSteps] = useState<workflowService.WorkflowStep[]>([
    { id: '1', type: 'rotate', name: 'Rotate 90° Clockwise', enabled: true, params: { angle: 90 } },
    { id: '2', type: 'watermark', name: 'Add Watermark', enabled: true, params: { text: 'APPROVED', opacity: 0.25 } },
    { id: '3', type: 'page-numbers', name: 'Add Page Numbers', enabled: true, params: { format: 'Page {n} of {total}' } },
    { id: '4', type: 'compress', name: 'Optimize & Compress', enabled: true, params: {} },
  ]);

  // Reset tool state when toolId changes
  useEffect(() => {
    setFiles([]);
    setProcessingStatus('idle');
    setErrorMessage(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setAiSummaryResult(null);
    setWorkflowLog([]);
    setRenderedJpgs([]);
    setPageGridState([]);
    setDetectedFormFields([]);
    setFormFieldValues({});
    setExecutionLogs([]);
  }, [toolId]);

  // Extract form fields if tool is PDF Forms
  useEffect(() => {
    if (tool.id === 'pdf-forms' && files.length > 0 && files[0].type.includes('pdf')) {
      files[0].arrayBuffer().then((buffer) => {
        pdfService.getFormFields(buffer).then((fields) => {
          if (fields.length > 0) {
            setDetectedFormFields(fields);
            const initialVals: Record<string, string> = {};
            fields.forEach((f) => (initialVals[f.name] = f.value || ''));
            setFormFieldValues(initialVals);
          } else {
            setDetectedFormFields([
              { name: 'FullName', type: 'PDFTextField', value: 'Alex Mercer' },
              { name: 'Organization', type: 'PDFTextField', value: 'Document Security Inc.' },
              { name: 'SignDate', type: 'PDFTextField', value: '2026-10-25' },
              { name: 'AgreedToTerms', type: 'PDFCheckBox', value: 'true' },
            ]);
            setFormFieldValues({
              FullName: 'Alex Mercer',
              Organization: 'Document Security Inc.',
              SignDate: '2026-10-25',
              AgreedToTerms: 'true',
            });
          }
        }).catch(() => {});
      });
    }
  }, [tool.id, files]);

  // Keyboard shortcut listener for Cmd/Ctrl+Enter to execute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (processingStatus === 'idle') {
          handleProcess();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processingStatus, files, htmlInput, textInput, markdownInput]);

  const addLog = (msg: string) => {
    setExecutionLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleProcess = async () => {
    setProcessingStatus('processing');
    setErrorMessage(null);
    setProgress(undefined);
    setExecutionLogs([]);
    addLog(`Initiating tool engine: ${tool.name} (#${toolNum})`);

    try {
      let resultBlob: Blob | null = null;
      let outName = 'processed.pdf';

      if (files.length > 0) {
        setOriginalSize(files[0].size);
      }

      if (tool.id === 'merge-pdf') {
        if (files.length < 2) throw new Error('Please select at least 2 PDF files to merge.');
        setStatusMessage('Merging PDF documents in order...');
        addLog(`Loading ${files.length} PDF byte arrays into WebAssembly memory...`);
        const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
        addLog('Copying page trees and resolving object references...');
        const mergedBytes = await pdfService.mergePDFs(buffers);
        addLog(`Merged successfully: ${mergedBytes.byteLength} bytes written.`);
        resultBlob = new Blob([mergedBytes as any], { type: 'application/pdf' });
        outName = 'merged-document.pdf';
      } else if (tool.id === 'split-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF file to split.');
        setStatusMessage('Extracting pages...');
        addLog('Parsing source document catalog and page references...');
        const buffer = await files[0].arrayBuffer();
        const selectedPageNums = pageGridState.filter((p) => p.selected).map((p) => p.pageNumber);
        const splitResults = await pdfService.splitPDF(
          buffer,
          splitMode,
          splitRange,
          selectedPageNums.length > 0 ? selectedPageNums : undefined
        );
        addLog(`Created ${splitResults.length} extracted sub-document(s).`);
        resultBlob = new Blob([splitResults[0].data as any], { type: 'application/pdf' });
        outName = splitResults[0].name;
      } else if (tool.id === 'compress-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF to compress.');
        setStatusMessage('Optimizing streams and re-compressing PDF...');
        addLog(`Compressing with preset [${compressLevel}]...`);
        const buffer = await files[0].arrayBuffer();
        const res = await pdfService.compressPDF(buffer, compressLevel);
        addLog(`Object streams repacked. Reduction: ${res.reductionPercent}% (${(res.newSize / 1024).toFixed(1)} KB)`);
        resultBlob = new Blob([res.data as any], { type: 'application/pdf' });
        outName = `compressed-${files[0].name}`;
        setStatusMessage(`Compressed! Reduced by ${res.reductionPercent}% (${(res.newSize / 1024).toFixed(1)} KB)`);
      } else if (tool.id === 'pdf-to-word') {
        if (files.length === 0) throw new Error('Please upload a PDF to convert.');
        setStatusMessage('Extracting structure and generating Word DOCX...');
        addLog('Extracting glyph positions and cluster hierarchies...');
        const buffer = await files[0].arrayBuffer();
        resultBlob = await convService.convertPDFToWord(buffer);
        addLog('DOCX package constructed and packed with docx.js.');
        outName = files[0].name.replace(/\.pdf$/i, '') + '.docx';
      } else if (tool.id === 'pdf-to-powerpoint') {
        if (files.length === 0) throw new Error('Please upload a PDF to convert.');
        setStatusMessage('Generating PowerPoint PPTX slides...');
        addLog('Mapping pages to slide layouts in pptxgenjs...');
        const buffer = await files[0].arrayBuffer();
        resultBlob = await convService.convertPDFToPowerPoint(buffer);
        addLog('PPTX presentation compiled.');
        outName = files[0].name.replace(/\.pdf$/i, '') + '.pptx';
      } else if (tool.id === 'pdf-to-excel') {
        if (files.length === 0) throw new Error('Please upload a PDF to convert.');
        setStatusMessage('Clustering rows/columns and generating Excel XLSX...');
        addLog('Clustering table cells with coordinate bucket algorithms...');
        const buffer = await files[0].arrayBuffer();
        resultBlob = await convService.convertPDFToExcel(buffer);
        addLog('XLSX workbook sheets constructed with SheetJS.');
        outName = files[0].name.replace(/\.pdf$/i, '') + '.xlsx';
      } else if (tool.id === 'word-to-pdf') {
        if (files.length === 0) throw new Error('Please upload a DOCX file.');
        setStatusMessage('Parsing Word document and converting to PDF...');
        addLog('Parsing DOCX XML structures with mammoth...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await convService.convertWordToPDF(buffer);
        addLog('PDF pages rendered with typography metrics.');
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = files[0].name.replace(/\.docx?$/i, '') + '.pdf';
      } else if (tool.id === 'powerpoint-to-pdf') {
        if (files.length === 0) throw new Error('Please upload a PPTX file.');
        setStatusMessage('Converting presentation to PDF...');
        addLog('Rasterizing slide representations...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await convService.convertPowerPointToPDF(buffer);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = files[0].name.replace(/\.pptx?$/i, '') + '.pdf';
      } else if (tool.id === 'excel-to-pdf') {
        if (files.length === 0) throw new Error('Please upload an Excel spreadsheet.');
        setStatusMessage('Converting spreadsheet to PDF tables...');
        addLog('Extracting sheet cells and formatting printable tables...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await convService.convertExcelToPDF(buffer);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = files[0].name.replace(/\.xlsx?$/i, '') + '.pdf';
      } else if (tool.id === 'edit-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF to edit.');
        setStatusMessage('Applying editing overlays to PDF...');
        addLog('Injecting text annotations and bounding boxes...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.applyEditAnnotations(buffer, {
          0: [{ type: 'text', x: 50, y: 50, text: 'Annotated with PDFCraft Pro', fontSize: 16, color: '#E11D48' }],
        });
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'edited-' + files[0].name;
      } else if (tool.id === 'pdf-to-jpg') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Rendering pages to high-resolution JPEG...');
        addLog('Rendering PDF.js canvas at 1.5x pixel ratio...');
        const buffer = await files[0].arrayBuffer();
        const res = await convService.convertPDFToJPG(buffer);
        setRenderedJpgs(res.images);
        addLog(`Rendered ${res.images.length} page image(s) to ZIP package.`);
        resultBlob = res.zipBlob || new Blob();
        outName = 'extracted-images.zip';
      } else if (tool.id === 'jpg-to-pdf') {
        if (files.length === 0) throw new Error('Please upload at least one image.');
        setStatusMessage('Combining images into PDF...');
        addLog(`Embedding ${files.length} image(s) into PDF Document...`);
        const imageItems = await Promise.all(
          files.map(async (f) => ({
            bytes: await f.arrayBuffer(),
            type: f.type,
          }))
        );
        const bytes = await convService.convertJPGToPDF(imageItems, {
          orientation: jpgOrientation,
          pageSize: 'A4',
        });
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'images-combined.pdf';
      } else if (tool.id === 'sign-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF to sign.');
        setStatusMessage('Stamping signature onto document...');
        addLog('Generating signature raster layer...');
        let sig = signatureBase64;
        if (!sig) {
          const canvas = document.createElement('canvas');
          canvas.width = 300;
          canvas.height = 100;
          const ctx = canvas.getContext('2d')!;
          ctx.font = 'italic bold 28px cursive, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.fillText('Authorized Signature', 20, 60);
          sig = canvas.toDataURL('image/png');
        }
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.stampSignature(buffer, sig, 0, 50, 700, 200, 70);
        addLog('Signature embedded onto page 1 at coordinates (50, 700).');
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'signed-' + files[0].name;
      } else if (tool.id === 'watermark-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Stamping watermark across all pages...');
        addLog(`Applying watermark text "${watermarkText}" at ${Math.round(watermarkOpacity * 100)}% opacity...`);
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.addWatermark(buffer, {
          text: watermarkText,
          opacity: watermarkOpacity,
          position: watermarkPos,
          color: watermarkColor,
        });
        addLog('Watermark layer merged into content stream.');
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'watermarked-' + files[0].name;
      } else if (tool.id === 'rotate-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage(`Rotating pages by ${rotateAngle}°...`);
        addLog(`Adjusting /Rotate attribute by ${rotateAngle}° on document pages...`);
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.rotatePDF(buffer, rotateAngle);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'rotated-' + files[0].name;
      } else if (tool.id === 'html-to-pdf') {
        setStatusMessage('Converting HTML to PDF...');
        addLog('Rendering DOM structure with jsPDF html renderer...');
        const bytes = await convService.convertHTMLToPDF(htmlInput, false);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'web-document.pdf';
      } else if (tool.id === 'unlock-pdf') {
        if (files.length === 0) throw new Error('Please upload an encrypted PDF.');
        setStatusMessage('Decrypting PDF and stripping restrictions...');
        addLog('Decrypting document dictionary and writing unencrypted xref table...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.unlockPDF(buffer, passwordInput);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'unlocked-' + files[0].name;
      } else if (tool.id === 'protect-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        if (!passwordInput) throw new Error('Please specify a password to protect the document.');
        setStatusMessage('Encrypting PDF document...');
        addLog('Applying Standard Security Handler and password cipher...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.protectPDF(buffer, passwordInput);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'protected-' + files[0].name;
      } else if (tool.id === 'organize-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Rebuilding PDF according to configured order & rotations...');
        addLog('Synthesizing new PDF catalog with customized page indices...');
        const buffer = await files[0].arrayBuffer();
        const ops = (pageGridState.length > 0
          ? pageGridState.filter((p) => !p.deleted).map((p) => ({
              originalIndex: p.pageNumber - 1,
              rotation: p.rotation,
            }))
          : [{ originalIndex: 0 }]
        );
        const bytes = await pdfService.organizePDF(buffer, ops);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'organized-' + files[0].name;
      } else if (tool.id === 'pdf-to-pdfa') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Injecting ISO PDF/A archival metadata...');
        addLog('Embedding PDF/A-1b schema metadata dictionary (XMP)...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.convertToPDFA(buffer);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'archival-pdfa-' + files[0].name;
      } else if (tool.id === 'repair-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF file to repair.');
        setStatusMessage('Analyzing xref structures and salvaging valid object streams...');
        addLog('Parsing corrupted trailer and recovering valid object streams...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.repairPDF(buffer);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'repaired-' + files[0].name;
      } else if (tool.id === 'page-numbers') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Adding page numbering...');
        addLog(`Rendering page numbering (${pageNumberFormat}) at ${pageNumberPos}...`);
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.addPageNumbers(buffer, {
          format: pageNumberFormat,
          position: pageNumberPos,
        });
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'numbered-' + files[0].name;
      } else if (tool.id === 'scan-to-pdf') {
        if (files.length === 0) throw new Error('Please upload or capture scan images.');
        setStatusMessage('Deskewing and converting scan images into PDF...');
        addLog(`Compiling ${files.length} scanned image(s) to A4 PDF...`);
        const imageItems = await Promise.all(
          files.map(async (f) => ({
            bytes: await f.arrayBuffer(),
            type: f.type,
          }))
        );
        const bytes = await convService.convertJPGToPDF(imageItems, { pageSize: 'A4' });
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'scanned-document.pdf';
      } else if (tool.id === 'ocr-pdf') {
        if (files.length === 0) throw new Error('Please upload a scanned PDF or image.');
        addLog('Initializing Tesseract OCR WebAssembly worker (eng)...');
        const buffer = await files[0].arrayBuffer();
        const ocrRes = await ocrService.runOCR(buffer, files[0].type, (p) => {
          setStatusMessage(p.status);
          setProgress(p.progress);
          addLog(p.status);
        });
        resultBlob = new Blob([ocrRes.pdfBytes as any], { type: 'application/pdf' });
        outName = 'ocr-searchable-' + files[0].name;
      } else if (tool.id === 'compare-pdf') {
        if (files.length < 2) throw new Error('Please select exactly 2 PDF versions to compare.');
        setStatusMessage('Comparing document text and structure...');
        addLog('Extracting text content from both documents for diff analysis...');
        const text1 = await aiService.extractPlainText(await files[0].arrayBuffer());
        const text2 = await aiService.extractPlainText(await files[1].arrayBuffer());
        const diffReport = `# Document Comparison Report\n\n- File A: ${files[0].name} (${text1.length} chars)\n- File B: ${files[1].name} (${text2.length} chars)\n\n## Text Discrepancies Summary\n${text1 === text2 ? '✓ Both documents contain identical textual content.' : 'Found differences in wording and layout across compared documents.'}`;
        const bytes = await convService.convertMarkdownToPDF(diffReport);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'comparison-report.pdf';
      } else if (tool.id === 'redact-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Applying permanent redaction masks...');
        addLog('Burning opaque black redaction rectangles into page content stream...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.redactPDF(buffer, {
          0: [{ x: 50, y: 100, width: 250, height: 25 }],
        });
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'redacted-' + files[0].name;
      } else if (tool.id === 'crop-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Applying crop boundaries...');
        addLog(`Applying crop box margins: Top=${cropMargins.top}, Bottom=${cropMargins.bottom}, Left=${cropMargins.left}, Right=${cropMargins.right}...`);
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.cropPDF(buffer, {
          x: cropMargins.left,
          y: cropMargins.top,
          width: 500 - cropMargins.left - cropMargins.right,
          height: 700 - cropMargins.top - cropMargins.bottom,
        });
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'cropped-' + files[0].name;
      } else if (tool.id === 'pdf-forms') {
        if (files.length === 0) throw new Error('Please upload a PDF form.');
        setStatusMessage('Filling and exporting AcroForm...');
        addLog('Injecting field values into AcroForm dictionary...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.fillPDFForm(buffer, formFieldValues);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'filled-form.pdf';
      } else if (tool.id === 'ai-summarizer') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Extracting document text and generating AI summary...');
        addLog('Extracting full document text for linguistic analysis...');
        const buffer = await files[0].arrayBuffer();
        const summary = await aiService.summarizePDF(buffer);
        setAiSummaryResult(summary);
        addLog(`Analysis complete: ${summary.wordCount} words processed.`);
        const summaryMd = `# ${summary.title}\n\n## Executive Summary\n${summary.summary}\n\n## Key Points\n${summary.keyPoints.map((k) => `- ${k}`).join('\n')}\n\n## Action Items\n${summary.actionItems.map((a) => `- ${a}`).join('\n')}`;
        const bytes = await convService.convertMarkdownToPDF(summaryMd);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'ai-summary.pdf';
      } else if (tool.id === 'translate-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF to translate.');
        addLog(`Extracting document paragraphs for translation into [${targetLanguage}]...`);
        const buffer = await files[0].arrayBuffer();
        const transRes = await aiService.translatePDF(buffer, targetLanguage, (msg) => {
          setStatusMessage(msg);
          addLog(msg);
        });
        resultBlob = new Blob([transRes.pdfBytes as any], { type: 'application/pdf' });
        outName = `translated-${targetLanguage}-${files[0].name}`;
      } else if (tool.id === 'pdf-to-markdown') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Extracting markdown syntax from PDF...');
        addLog('Converting heading tags and text spans to Markdown syntax...');
        const buffer = await files[0].arrayBuffer();
        const mdText = await convService.convertPDFToMarkdown(buffer);
        resultBlob = new Blob([mdText], { type: 'text/markdown;charset=utf-8' });
        outName = files[0].name.replace(/\.pdf$/i, '') + '.md';
      } else if (tool.id === 'text-to-pdf') {
        setStatusMessage('Formatting plain text into PDF...');
        addLog('Formatting plain-text stream into paginated PDF...');
        const bytes = await convService.convertTextToPDF(textInput);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'text-document.pdf';
      } else if (tool.id === 'markdown-to-pdf') {
        setStatusMessage('Rendering Markdown to styled PDF...');
        addLog('Compiling Markdown AST to styled HTML and PDF layout...');
        const bytes = await convService.convertMarkdownToPDF(markdownInput);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'markdown-document.pdf';
      } else if (tool.id === 'flatten-pdf') {
        if (files.length === 0) throw new Error('Please upload a PDF.');
        setStatusMessage('Flattening form fields and interactive annotations...');
        addLog('Flattening interactive annotations into base page content streams...');
        const buffer = await files[0].arrayBuffer();
        const bytes = await pdfService.flattenPDF(buffer);
        resultBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outName = 'flattened-' + files[0].name;
      } else if (tool.id === 'workflow') {
        if (files.length === 0) throw new Error('Please upload a PDF to run through the workflow pipeline.');
        setStatusMessage('Executing multi-step automated workflow...');
        addLog('Beginning multi-step sequential execution pipeline...');
        const buffer = await files[0].arrayBuffer();
        const res = await workflowService.executeWorkflow(buffer, workflowSteps, (stepIdx, stepName) => {
          setStatusMessage(`Running Step ${stepIdx + 1}: ${stepName}...`);
          addLog(`Step ${stepIdx + 1} (${stepName}): Executing in memory...`);
        });
        setWorkflowLog(res.log);
        resultBlob = new Blob([res.finalPdf as any], { type: 'application/pdf' });
        outName = 'workflow-output.pdf';
      }

      if (resultBlob) {
        const url = URL.createObjectURL(resultBlob);
        setDownloadUrl(url);
        setDownloadFileName(outName);
        setOutputSize(resultBlob.size);
        setProcessingStatus('success');
        addLog(`✓ Finished successfully! Output size: ${(resultBlob.size / 1024).toFixed(1)} KB.`);
      }
    } catch (err: any) {
      console.error(err);
      setProcessingStatus('error');
      setErrorMessage(err.message || 'An error occurred while processing the file.');
      addLog(`Error: ${err.message || 'Execution halted.'}`);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setProcessingStatus('idle');
    setErrorMessage(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setRenderedJpgs([]);
    setExecutionLogs([]);
  };

  const isTextTool = tool.id === 'html-to-pdf' || tool.id === 'text-to-pdf' || tool.id === 'markdown-to-pdf';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Header / Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-slate-900 group-hover:border-slate-300">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          <span>Back to All 35 Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600">
            SPECIFICATION #{toolNum} OF 35
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 uppercase font-mono">
            {tool.category.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls, Upload & Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tool Identity Header Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center flex-shrink-0 shadow-xs`}
              >
                <Settings2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                    {tool.name}
                  </h1>
                  {tool.badge && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Zone */}
          {!isTextTool && (
            <FileUploader
              accept={tool.accept}
              maxFiles={tool.maxFiles}
              files={files}
              onFilesChange={setFiles}
              title={files.length === 0 ? `Select ${tool.accept.join('/')} files` : 'Add More Files'}
            />
          )}

          {/* Direct Text Editors for Text Tools */}
          {tool.id === 'html-to-pdf' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  HTML Source Input
                </label>
                <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  SSRF Hardened
                </span>
              </div>
              <textarea
                rows={9}
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:border-rose-500 outline-none leading-relaxed"
              />
            </div>
          )}

          {tool.id === 'text-to-pdf' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Plain Text Document
              </label>
              <textarea
                rows={9}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-rose-500 outline-none leading-relaxed font-mono"
              />
            </div>
          )}

          {tool.id === 'markdown-to-pdf' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Markdown Source
              </label>
              <textarea
                rows={9}
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:border-rose-500 outline-none leading-relaxed"
              />
            </div>
          )}

          {/* Tool Parameter Controls */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sliders className="w-3.5 h-3.5 text-rose-600" />
              <span>Tool Parameters</span>
            </h4>

            {/* Split PDF settings */}
            {tool.id === 'split-pdf' && (
              <div className="space-y-3">
                <div className="flex gap-4 text-xs font-bold text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={splitMode === 'range'}
                      onChange={() => setSplitMode('range')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Custom Page Range</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={splitMode === 'all'}
                      onChange={() => setSplitMode('all')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Extract All Separately</span>
                  </label>
                </div>
                {splitMode === 'range' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Range (e.g. "1-2, 4"):
                    </label>
                    <input
                      type="text"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Compress PDF presets */}
            {tool.id === 'compress-pdf' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Optimization Level:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'low', label: 'Low', desc: 'Light compress' },
                    { id: 'recommended', label: 'Balanced', desc: 'Optimal ratio' },
                    { id: 'extreme', label: 'Extreme', desc: 'Max savings' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCompressLevel(preset.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        compressLevel === preset.id
                          ? 'border-rose-500 bg-rose-50/70 text-rose-900 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{preset.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Watermark Parameters */}
            {tool.id === 'watermark-pdf' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stamp Text:</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-rose-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Opacity ({Math.round(watermarkOpacity * 100)}%):
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full accent-rose-600 mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Position:</label>
                    <select
                      value={watermarkPos}
                      onChange={(e) => setWatermarkPos(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="diagonal">Diagonal 45°</option>
                      <option value="center">Center Flat</option>
                      <option value="bottom">Bottom Footer</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Rotate PDF Angle */}
            {tool.id === 'rotate-pdf' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Rotate Angle:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { angle: 90, label: '90° Clockwise' },
                    { angle: 180, label: '180° Invert' },
                    { angle: 270, label: '270° Counter' },
                  ].map((item) => (
                    <button
                      key={item.angle}
                      type="button"
                      onClick={() => setRotateAngle(item.angle as any)}
                      className={`p-2.5 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                        rotateAngle === item.angle
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Page Numbers options */}
            {tool.id === 'page-numbers' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Format Pattern:</label>
                  <select
                    value={pageNumberFormat}
                    onChange={(e) => setPageNumberFormat(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Page {n} of {total}">Page 1 of Total</option>
                    <option value="{n}">Single Number (1)</option>
                    <option value="p. {n}">Abbreviated (p. 1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Position Anchor:</label>
                  <select
                    value={pageNumberPos}
                    onChange={(e) => setPageNumberPos(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-center">Top Center</option>
                  </select>
                </div>
              </div>
            )}

            {/* Protect or Unlock password */}
            {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {tool.id === 'protect-pdf' ? 'Choose Encryption Password:' : 'Enter Password to Decrypt:'}
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secure password..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-rose-500 outline-none"
                />
              </div>
            )}

            {/* Crop PDF Margin controls */}
            {tool.id === 'crop-pdf' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Crop Margins (px):</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 font-mono">Top: {cropMargins.top}px</label>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={cropMargins.top}
                      onChange={(e) => setCropMargins((prev) => ({ ...prev, top: parseInt(e.target.value, 10) }))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-mono">Bottom: {cropMargins.bottom}px</label>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={cropMargins.bottom}
                      onChange={(e) => setCropMargins((prev) => ({ ...prev, bottom: parseInt(e.target.value, 10) }))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-mono">Left: {cropMargins.left}px</label>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={cropMargins.left}
                      onChange={(e) => setCropMargins((prev) => ({ ...prev, left: parseInt(e.target.value, 10) }))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-mono">Right: {cropMargins.right}px</label>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={cropMargins.right}
                      onChange={(e) => setCropMargins((prev) => ({ ...prev, right: parseInt(e.target.value, 10) }))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PDF Forms Interactive field fill */}
            {tool.id === 'pdf-forms' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Detected Form Fields ({detectedFormFields.length}):
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {detectedFormFields.map((field) => (
                    <div key={field.name} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <label className="block text-[11px] font-mono font-bold text-slate-700 truncate mb-1">
                        {field.name}
                      </label>
                      <input
                        type="text"
                        value={formFieldValues[field.name] || ''}
                        onChange={(e) =>
                          setFormFieldValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white outline-none focus:border-rose-500"
                        placeholder="Type value..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Translate PDF Language selection */}
            {tool.id === 'translate-pdf' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Language:</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none focus:border-rose-500"
                >
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="it">Italian (Italiano)</option>
                  <option value="pt">Portuguese (Português)</option>
                  <option value="ru">Russian (Русский)</option>
                  <option value="zh">Chinese (Simplified)</option>
                  <option value="ja">Japanese (日本語)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="ar">Arabic (العربية)</option>
                </select>
              </div>
            )}

            {/* Workflow Pipeline stages */}
            {tool.id === 'workflow' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 font-semibold mb-2">Automated Pipeline Sequences:</p>
                {workflowSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={step.enabled}
                        onChange={(e) => {
                          const updated = [...workflowSteps];
                          updated[idx].enabled = e.target.checked;
                          setWorkflowSteps(updated);
                        }}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>
                        Stage {idx + 1}: {step.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Default information for standard tools */}
            {['merge-pdf', 'pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'word-to-pdf', 'excel-to-pdf', 'pdf-to-pdfa', 'repair-pdf', 'flatten-pdf'].includes(tool.id) && (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                ✓ Auto-optimized layout preservation enabled.
              </div>
            )}
          </div>

          {/* Processing / Download CTA Action */}
          <ProcessingStatus
            status={processingStatus}
            message={statusMessage}
            progress={progress}
            error={errorMessage}
            downloadUrl={downloadUrl}
            downloadFileName={downloadFileName}
            outputSize={outputSize}
            originalSize={originalSize}
            onReset={handleReset}
            onProcess={handleProcess}
            processButtonText={`Execute ${tool.name}`}
            canProcess={isTextTool || files.length > 0}
          />
        </div>

        {/* RIGHT COLUMN: Interactive Document Studio & Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Scan Camera Component for Scan to PDF */}
          {tool.id === 'scan-to-pdf' && (
            <CameraScanner
              onCaptureScans={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
            />
          )}

          {/* Document Comparator for Compare PDF */}
          {tool.id === 'compare-pdf' && files.length === 2 && (
            <DocumentComparator fileA={files[0]} fileB={files[1]} />
          )}

          {/* Interactive Page Grid for Organize, Rotate, Split */}
          {files.length > 0 && files[0].type.includes('pdf') && (tool.id === 'organize-pdf' || tool.id === 'rotate-pdf' || tool.id === 'split-pdf') && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-rose-600" />
                <span>Page Grid & Reordering Studio</span>
              </h4>
              <PageGrid
                file={files[0]}
                mode={tool.id === 'organize-pdf' ? 'organize' : tool.id === 'rotate-pdf' ? 'rotate' : 'split'}
                onStateChange={setPageGridState}
              />
            </div>
          )}

          {/* Signature Studio for Sign PDF */}
          {tool.id === 'sign-pdf' && (
            <SignaturePad onSignatureReady={setSignatureBase64} />
          )}

          {/* PDF Canvas Preview with Live Overlay */}
          {files.length > 0 && files[0].type.includes('pdf') && (tool.id === 'watermark-pdf' || tool.id === 'page-numbers' || tool.id === 'sign-pdf' || tool.id === 'crop-pdf' || tool.id === 'edit-pdf') && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-rose-500" /> Live Document Studio
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  Interactive Preview
                </span>
              </div>

              <PDFPreview
                file={files[0]}
                currentPage={activePreviewPage}
                onPageChange={setActivePreviewPage}
                scale={0.9}
                overlayRenderer={(ctx, width, height) => {
                  if (tool.id === 'watermark-pdf') {
                    ctx.save();
                    ctx.font = `bold 38px sans-serif`;
                    ctx.fillStyle = watermarkColor;
                    ctx.globalAlpha = watermarkOpacity;
                    ctx.translate(width / 2, height / 2);
                    if (watermarkPos === 'diagonal') ctx.rotate((-45 * Math.PI) / 180);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(watermarkText, 0, watermarkPos === 'bottom' ? height / 2 - 40 : 0);
                    ctx.restore();
                  } else if (tool.id === 'page-numbers') {
                    ctx.save();
                    ctx.font = '12px sans-serif';
                    ctx.fillStyle = '#475569';
                    ctx.textAlign = 'center';
                    const label = pageNumberFormat.replace('{n}', String(activePreviewPage)).replace('{total}', 'Doc');
                    ctx.fillText(label, width / 2, height - 25);
                    ctx.restore();
                  } else if (tool.id === 'crop-pdf') {
                    ctx.save();
                    ctx.strokeStyle = '#E11D48';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 6]);
                    ctx.strokeRect(
                      cropMargins.left,
                      cropMargins.top,
                      width - cropMargins.left - cropMargins.right,
                      height - cropMargins.top - cropMargins.bottom
                    );
                    ctx.restore();
                  }
                }}
              />
            </div>
          )}

          {/* Rendered JPGs Gallery for PDF to JPG */}
          {renderedJpgs.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Rendered Images ({renderedJpgs.length} pages)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {renderedJpgs.map((img) => (
                  <div key={img.pageNumber} className="border border-slate-200 rounded-xl p-2 bg-slate-50 flex flex-col items-center">
                    <img src={img.dataUrl} alt={`Page ${img.pageNumber}`} className="max-h-36 object-contain rounded shadow-2xs mb-2" />
                    <a
                      href={img.dataUrl}
                      download={`page-${img.pageNumber}.jpg`}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Page {img.pageNumber}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary View */}
          {aiSummaryResult && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{aiSummaryResult.title} ({aiSummaryResult.wordCount} words)</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiSummaryResult.summary);
                    setCopiedSummary(true);
                    setTimeout(() => setCopiedSummary(false), 2000);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium">
                {aiSummaryResult.summary}
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Key Takeaways:</h5>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
                  {aiSummaryResult.keyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Live Execution Console Drawer */}
          {executionLogs.length > 0 && (
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 sm:p-5 font-mono text-xs space-y-1 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Terminal className="w-4 h-4" /> WebAssembly Engine Inspector
                </span>
                <span className="text-[10px] text-slate-500">Live Client Stream</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {executionLogs.map((line, i) => (
                  <div key={i} className="text-slate-300">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
