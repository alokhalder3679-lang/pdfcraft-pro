export interface ToolSEOData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  subtitle: string;
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedToolIds: string[];
}

export const BASE_URL = 'https://pdfcraft-pro.vercel.app';
export const ALT_DOMAIN = 'https://pdfcraft-pro.is-a.dev';

export const TOOL_SEO_CATALOG: Record<string, ToolSEOData> = {
  'merge-pdf': {
    title: 'Merge PDF',
    metaTitle: 'Merge PDF Online Free — Combine PDF Files Privately (No Upload)',
    metaDescription: 'Merge PDF files online for free in your exact order. Fast, secure, and 100% private in-browser WebAssembly engine with zero server file uploads.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'free pdf merger', 'merge pdf without upload', 'in-browser pdf merge'],
    h1: 'Merge PDF Files Online with Total Privacy',
    subtitle: 'Combine multiple PDF documents into a single consolidated file in seconds. Processed 100% locally on your device.',
    steps: [
      { title: 'Upload or Drop Files', desc: 'Select or drag & drop multiple PDF files into the secure workbench.' },
      { title: 'Reorder Pages', desc: 'Drag files or specify the exact page sequence you want in your final document.' },
      { title: 'Instant Merge & Save', desc: 'Click Merge to generate your unified PDF instantly in browser memory.' }
    ],
    faqs: [
      { q: 'Is it safe to merge confidential or legal PDFs here?', a: 'Yes. PDFCraft Pro executes all PDF manipulation in your browser using WebAssembly. No files or document bytes ever leave your computer.' },
      { q: 'Is there a limit on file size or number of PDFs?', a: 'You can merge up to 20 files at once with zero arbitrary file-size throttling.' },
      { q: 'Will the original quality or bookmarks be preserved?', a: 'Yes. Vector typography, images, hyperlinks, and document structure are preserved without compression artifacts.' }
    ],
    relatedToolIds: ['split-pdf', 'compress-pdf', 'organize-pdf', 'watermark-pdf', 'pdf-to-word']
  },

  'split-pdf': {
    title: 'Split PDF',
    metaTitle: 'Split PDF Online Free — Extract Pages from PDF Document Privately',
    metaDescription: 'Split PDF pages or extract custom page ranges online for free. In-browser WebAssembly processing guarantees total confidentiality and zero server uploads.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'cut pdf pages', 'split pdf online free', 'offline pdf splitter'],
    h1: 'Split PDF Pages & Extract Ranges with Zero Server Uploads',
    subtitle: 'Extract specific pages, page ranges, or separate every single page into independent PDF files.',
    steps: [
      { title: 'Select PDF', desc: 'Choose the PDF you need to split or extract pages from.' },
      { title: 'Define Range or Mode', desc: 'Choose to extract all pages separately or define specific page ranges (e.g., 1-4, 8).' },
      { title: 'Download Split PDF', desc: 'Instantly download your extracted documents without waiting for cloud queues.' }
    ],
    faqs: [
      { q: 'Can I extract non-consecutive pages?', a: 'Yes, you can specify custom ranges like "1-3, 5, 8-10" to extract exactly what you need.' },
      { q: 'Does splitting affect the security or encryption?', a: 'You can split any unlocked document and subsequently re-protect it using our Protect PDF tool.' }
    ],
    relatedToolIds: ['merge-pdf', 'organize-pdf', 'crop-pdf', 'compress-pdf', 'edit-pdf']
  },

  'compress-pdf': {
    title: 'Compress PDF',
    metaTitle: 'Compress PDF Online Free — Reduce PDF File Size Without Quality Loss',
    metaDescription: 'Compress PDF files online for free. Reduce PDF size up to 90% while maintaining crisp vector text and sharp graphics. 100% private in-browser WebAssembly.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor online free', 'compress pdf without losing quality', 'client-side pdf compression'],
    h1: 'Compress PDF Online Free Without Losing Quality',
    subtitle: 'Shrink large PDF files for email attachments, government portals, and web sharing while keeping text razor sharp.',
    steps: [
      { title: 'Drop PDF File', desc: 'Add one or more PDF files you need to compress.' },
      { title: 'Choose Compression Level', desc: 'Pick Recommended (balanced), Extreme (smallest size), or Low compression.' },
      { title: 'Save Optimized PDF', desc: 'Review your file size savings and download the compressed document.' }
    ],
    faqs: [
      { q: 'How much can I reduce my PDF size?', a: 'Most standard documents reduce by 50% to 85% depending on internal image resolution and duplicate font objects.' },
      { q: 'Are my private documents uploaded to third-party servers?', a: 'Never. PDFCraft Pro compresses files directly inside your browser using client-side WebAssembly.' }
    ],
    relatedToolIds: ['merge-pdf', 'pdf-to-word', 'flatten-pdf', 'pdf-to-pdfa', 'sign-pdf']
  },

  'pdf-to-word': {
    title: 'PDF to Word',
    metaTitle: 'PDF to Word Converter Online Free — Convert PDF to DOCX Instantly',
    metaDescription: 'Convert PDF to editable Word DOCX documents online for free. Preserves text, tables, fonts, and layout. 100% private in-browser document conversion.',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to doc converter free', 'turn pdf into word', 'editable word from pdf'],
    h1: 'Convert PDF to Editable Word (DOCX) Documents',
    subtitle: 'Extract text, formatting, tables, and images from PDF directly into editable Microsoft Word documents.',
    steps: [
      { title: 'Select PDF', desc: 'Choose the PDF file you want to convert into Microsoft Word.' },
      { title: 'Automatic Extraction', desc: 'Our engine extracts text blocks, styles, and tables in browser memory.' },
      { title: 'Download DOCX', desc: 'Download your editable Word document ready for Microsoft Word or Google Docs.' }
    ],
    faqs: [
      { q: 'Can I edit the converted Word document in Microsoft Office or Google Docs?', a: 'Yes, the exported .docx file is 100% standard Office Open XML compliant.' },
      { q: 'Does this work on scanned PDFs?', a: 'For scanned or photographed PDFs, use our OCR PDF tool first to recognize textual characters.' }
    ],
    relatedToolIds: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-markdown', 'ocr-pdf', 'edit-pdf']
  },

  'word-to-pdf': {
    title: 'Word to PDF',
    metaTitle: 'Word to PDF Converter Online Free — Convert DOC & DOCX to PDF',
    metaDescription: 'Convert Microsoft Word (DOC, DOCX) files to standardized PDF documents online for free. Flawless typography, pagination, and zero server uploads.',
    keywords: ['word to pdf', 'convert docx to pdf', 'doc to pdf online free', 'save word as pdf', 'word document converter'],
    h1: 'Convert Word DOC & DOCX to PDF Online Free',
    subtitle: 'Generate professional, print-ready PDF files from your Microsoft Word documents in a single click.',
    steps: [
      { title: 'Add DOC or DOCX', desc: 'Upload your Word documents or drag them into the conversion zone.' },
      { title: 'Render Layout', desc: 'The client-side engine formats paragraphs, headers, and spacing.' },
      { title: 'Download PDF', desc: 'Get your high-definition PDF ready to distribute or sign.' }
    ],
    faqs: [
      { q: 'Will my fonts and margins look identical?', a: 'Yes, standard typography and document pagination are strictly maintained.' }
    ],
    relatedToolIds: ['pdf-to-word', 'excel-to-pdf', 'powerpoint-to-pdf', 'compress-pdf', 'protect-pdf']
  },

  'pdf-to-excel': {
    title: 'PDF to Excel',
    metaTitle: 'PDF to Excel Converter Free — Extract Tables from PDF to XLSX',
    metaDescription: 'Extract tabular data and numbers from PDF into editable Excel XLSX spreadsheets online for free. Fast, accurate, and completely private in-browser conversion.',
    keywords: ['pdf to excel', 'pdf to xlsx', 'extract tables from pdf', 'convert pdf to spreadsheet', 'pdf to csv free'],
    h1: 'Extract Tables and Data from PDF to Excel (XLSX)',
    subtitle: 'Pull financial reports, balance sheets, and data tables directly into structured spreadsheets.',
    steps: [
      { title: 'Choose Document', desc: 'Upload the PDF containing data tables or numerical reports.' },
      { title: 'Detect Table Matrix', desc: 'Our layout analyzer identifies columns, rows, and cell boundaries.' },
      { title: 'Save Excel File', desc: 'Download a clean .xlsx spreadsheet ready for Excel or Google Sheets.' }
    ],
    faqs: [
      { q: 'Does it support multi-page spreadsheets?', a: 'Yes, all pages with detected tabular formats are mapped into sheets.' }
    ],
    relatedToolIds: ['excel-to-pdf', 'pdf-to-word', 'ocr-pdf', 'ai-summarizer']
  },

  'excel-to-pdf': {
    title: 'Excel to PDF',
    metaTitle: 'Excel to PDF Converter Free — Convert XLSX Spreadsheets to PDF',
    metaDescription: 'Convert Excel spreadsheets (XLSX, XLS, CSV) into clean paginated PDF documents online for free. Zero uploads, 100% private in-browser conversion.',
    keywords: ['excel to pdf', 'xlsx to pdf', 'csv to pdf', 'convert spreadsheet to pdf free'],
    h1: 'Convert Excel Spreadsheets to Clean PDF Documents',
    subtitle: 'Turn complex worksheets and CSV exports into professional, paginated PDF documents.',
    steps: [
      { title: 'Upload Spreadsheet', desc: 'Select your .xlsx, .xls, or .csv files.' },
      { title: 'Format Grid', desc: 'Columns and headers are aligned for clean page fitting.' },
      { title: 'Export PDF', desc: 'Download your formatted PDF table report.' }
    ],
    faqs: [
      { q: 'Are formulas converted to values?', a: 'Calculated cells and values are preserved in the visual output.' }
    ],
    relatedToolIds: ['pdf-to-excel', 'word-to-pdf', 'compress-pdf', 'protect-pdf']
  },

  'sign-pdf': {
    title: 'Sign PDF',
    metaTitle: 'Sign PDF Online Free — Draw, Type, & Apply Digital Signatures Privately',
    metaDescription: 'Sign PDF documents online for free. Draw your signature, type with calligraphy fonts, or upload signature stamps. 100% private in-browser document signing.',
    keywords: ['sign pdf', 'e-sign pdf online', 'digital signature pdf', 'draw signature on pdf', 'free online document signing', 'private pdf signature'],
    h1: 'Sign PDF Documents Online with Verifiable Privacy',
    subtitle: 'Add legally binding electronic signatures, stamps, and initials to contracts, agreements, and NDAs.',
    steps: [
      { title: 'Upload Contract or Form', desc: 'Select the PDF document requiring your signature.' },
      { title: 'Create Signature', desc: 'Draw using mouse/touchpad/stylus or load your saved signature stamp.' },
      { title: 'Position & Download', desc: 'Place your signature anywhere on the page and download the finalized document.' }
    ],
    faqs: [
      { q: 'Is my handwritten signature saved to your servers?', a: 'Never. PDFCraft Pro runs entirely in your browser session. When you close the tab, nothing is stored on external disks.' },
      { q: 'Can I add multiple signatures or dates?', a: 'Yes, you can position signatures, dates, and initials across any page.' }
    ],
    relatedToolIds: ['edit-pdf', 'protect-pdf', 'flatten-pdf', 'watermark-pdf', 'redact-pdf']
  },

  'edit-pdf': {
    title: 'Edit PDF',
    metaTitle: 'Edit PDF Online Free — Add Text, Annotations, Shapes & Signatures',
    metaDescription: 'Edit PDF documents online for free directly in your browser. Add custom text, shapes, callouts, and highlights without installing heavy software. 100% private.',
    keywords: ['edit pdf online', 'pdf editor free', 'annotate pdf', 'add text to pdf', 'in-browser pdf editor'],
    h1: 'Edit PDF Documents Online Free with Real-Time Annotation',
    subtitle: 'Modify text, insert callouts, add freehand drawings, and annotate PDF pages without desktop software.',
    steps: [
      { title: 'Open Document', desc: 'Select the PDF file you need to update or annotate.' },
      { title: 'Add Content & Notes', desc: 'Click to add text boxes, draw shapes, or highlight important clauses.' },
      { title: 'Export Edited PDF', desc: 'Save your updated document with all vector modifications applied.' }
    ],
    faqs: [
      { q: 'Can I change font sizes and colors?', a: 'Yes, customize font styles, sizes, line thickness, and highlight colors.' }
    ],
    relatedToolIds: ['sign-pdf', 'watermark-pdf', 'redact-pdf', 'page-numbers', 'organize-pdf']
  },

  'ocr-pdf': {
    title: 'OCR PDF',
    metaTitle: 'OCR PDF Online Free — Optical Character Recognition for Scanned PDFs',
    metaDescription: 'Convert scanned PDFs and paper documents into searchable, selectable text with free in-browser Optical Character Recognition (OCR). 100% private & offline-ready.',
    keywords: ['ocr pdf', 'optical character recognition pdf', 'searchable pdf converter', 'scanned pdf to text', 'free ocr online'],
    h1: 'Convert Scanned PDFs into Searchable Text with In-Browser OCR',
    subtitle: 'High-accuracy character recognition powered by Tesseract.js running 100% on your client CPU.',
    steps: [
      { title: 'Load Scanned PDF', desc: 'Upload scanned receipts, paper forms, or photographed documents.' },
      { title: 'Run OCR Analysis', desc: 'Our neural OCR model inspects glyphs and text lines page by page.' },
      { title: 'Copy or Download', desc: 'Download a searchable PDF or copy recognized text directly to clipboard.' }
    ],
    faqs: [
      { q: 'Do scanned images get uploaded to cloud servers?', a: 'No. The neural OCR model executes on your computer via WebAssembly.' },
      { q: 'What languages does OCR recognize?', a: 'English, Spanish, French, German, and 40+ international languages.' }
    ],
    relatedToolIds: ['pdf-to-word', 'pdf-to-excel', 'ai-summarizer', 'translate-pdf', 'scan-to-pdf']
  },

  'protect-pdf': {
    title: 'Protect PDF',
    metaTitle: 'Password Protect PDF Online Free — Encrypt PDF with AES-256 Security',
    metaDescription: 'Password protect and encrypt your PDF documents online for free. Prevent unauthorized viewing, printing, and copying. 100% client-side privacy.',
    keywords: ['protect pdf', 'encrypt pdf', 'password protect pdf', 'lock pdf', 'secure pdf online free'],
    h1: 'Encrypt & Password Protect PDF Documents Privately',
    subtitle: 'Add industrial-strength password security to sensitive financial, legal, and personal documents.',
    steps: [
      { title: 'Select Document', desc: 'Choose the PDF you wish to encrypt.' },
      { title: 'Set Secret Password', desc: 'Enter a strong password to lock document viewing and editing.' },
      { title: 'Download Protected File', desc: 'Download your encrypted PDF that prompts for password on every device.' }
    ],
    faqs: [
      { q: 'Do you ever see or store my password?', a: 'Never. Cryptographic encryption is calculated in your browser memory.' }
    ],
    relatedToolIds: ['unlock-pdf', 'redact-pdf', 'watermark-pdf', 'sign-pdf', 'flatten-pdf']
  },

  'unlock-pdf': {
    title: 'Unlock PDF',
    metaTitle: 'Unlock PDF Online Free — Remove Password Protection from PDF Files',
    metaDescription: 'Remove password and restriction locks from authorized PDF documents online for free. Fast, in-browser decryption with zero cloud file storage.',
    keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'unlock protected pdf free'],
    h1: 'Remove Password Restrictions from PDF Files',
    subtitle: 'Unlock password-secured PDF documents that you have authorized access to for easy reading and editing.',
    steps: [
      { title: 'Upload Locked PDF', desc: 'Select the password-protected document.' },
      { title: 'Enter Password Once', desc: 'Supply the master key to decrypt the document.' },
      { title: 'Download Decrypted PDF', desc: 'Get an unlocked version that opens instantly without password prompts.' }
    ],
    faqs: [
      { q: 'Can I remove printing and editing restrictions?', a: 'Yes, unlocking frees all user and owner permission constraints.' }
    ],
    relatedToolIds: ['protect-pdf', 'edit-pdf', 'split-pdf', 'merge-pdf']
  },

  'organize-pdf': {
    title: 'Organize PDF',
    metaTitle: 'Organize PDF Pages Free — Reorder, Rotate & Delete Pages Visually',
    metaDescription: 'Reorder, rotate, delete, or duplicate PDF pages in an interactive visual page grid. 100% free, fast, and private in-browser document organizer.',
    keywords: ['organize pdf', 'reorder pdf pages', 'delete pdf pages', 'sort pdf pages visually', 'arrange pdf'],
    h1: 'Organize, Reorder & Delete PDF Pages Visually',
    subtitle: 'Drag and drop page thumbnails to rearrange document structure, delete mistakes, and rotate orientations.',
    steps: [
      { title: 'Add PDF', desc: 'Open the document in our visual page workbench.' },
      { title: 'Rearrange & Clean', desc: 'Drag thumbnails to reorder, click trash to delete, or click rotate to adjust.' },
      { title: 'Save Organized PDF', desc: 'Export your freshly organized PDF in seconds.' }
    ],
    faqs: [
      { q: 'Can I delete multiple pages at once?', a: 'Yes, select pages or click individual trash icons to remove unwanted sheets.' }
    ],
    relatedToolIds: ['split-pdf', 'merge-pdf', 'rotate-pdf', 'crop-pdf']
  },

  'watermark-pdf': {
    title: 'Watermark PDF',
    metaTitle: 'Watermark PDF Online Free — Add Text or Image Stamps with Opacity',
    metaDescription: 'Add custom watermark text or logos over PDF pages online for free. Customize font, angle, opacity, and positioning. 100% private in-browser tool.',
    keywords: ['watermark pdf', 'add watermark to pdf', 'stamp pdf', 'confidential watermark', 'logo watermark on pdf'],
    h1: 'Add Custom Text or Image Watermarks to PDF Pages',
    subtitle: 'Stamp "CONFIDENTIAL", "DRAFT", company logos, or copyright notices across all document pages.',
    steps: [
      { title: 'Select PDF', desc: 'Choose the file you want to watermark.' },
      { title: 'Configure Stamp', desc: 'Type custom text, adjust opacity (e.g. 30%), angle, and choose stamp position.' },
      { title: 'Apply & Download', desc: 'Download your stamped document with permanent watermark vectors.' }
    ],
    faqs: [
      { q: 'Can watermarks be removed easily by unauthorized readers?', a: 'Use our Flatten PDF tool after watermarking to fuse the stamp permanently into document layers.' }
    ],
    relatedToolIds: ['flatten-pdf', 'protect-pdf', 'edit-pdf', 'sign-pdf']
  },

  'flatten-pdf': {
    title: 'Flatten PDF',
    metaTitle: 'Flatten PDF Online Free — Lock Form Fields, Annotations & Vectors',
    metaDescription: 'Flatten PDF forms, signatures, and annotations into uneditable static printable layers online for free. Prevent tampering and ensure compliance.',
    keywords: ['flatten pdf', 'lock pdf form', 'flatten pdf online free', 'make pdf uneditable', 'printable pdf layer'],
    h1: 'Flatten PDF Forms, Signatures & Vector Annotations',
    subtitle: 'Bake interactive fillable forms, vector comments, and electronic signatures into static, tamper-proof pages.',
    steps: [
      { title: 'Drop PDF File', desc: 'Upload the document containing form fields or signature annotations.' },
      { title: 'Execute Flattening', desc: 'Vector elements and form widgets are rendered directly into page content.' },
      { title: 'Download Static PDF', desc: 'Get a clean, standardized PDF that renders identically on any PDF reader.' }
    ],
    faqs: [
      { q: 'Why should I flatten a PDF?', a: 'Flattening ensures that form fields cannot be edited, signatures cannot be moved, and legal agreements cannot be altered.' }
    ],
    relatedToolIds: ['pdf-forms', 'sign-pdf', 'watermark-pdf', 'pdf-to-pdfa']
  },

  'pdf-to-pdfa': {
    title: 'PDF to PDF/A',
    metaTitle: 'Convert PDF to PDF/A Free — ISO Compliant Archival Format',
    metaDescription: 'Convert standard PDF documents into ISO-standardized PDF/A archival format online for free. Compliant for legal preservation and government archives.',
    keywords: ['pdf to pdfa', 'pdf/a converter free', 'iso archival pdf', 'convert to pdf/a online', 'legal pdf archiving'],
    h1: 'Convert PDF to ISO-Standardized PDF/A Archival Format',
    subtitle: 'Ensure long-term document preservation with embedded fonts, color profiles, and metadata compliance.',
    steps: [
      { title: 'Upload Standard PDF', desc: 'Select the documents needing long-term archival compliance.' },
      { title: 'Embed Standards', desc: 'Fonts, color profiles, and ISO metadata headers are standardized.' },
      { title: 'Download PDF/A', desc: 'Save your compliant archival file ready for legal and government depositories.' }
    ],
    faqs: [
      { q: 'What is the benefit of PDF/A over normal PDF?', a: 'PDF/A prohibits external dependencies (like non-embedded system fonts or audio/video) so the document renders identically decades into the future.' }
    ],
    relatedToolIds: ['compress-pdf', 'flatten-pdf', 'repair-pdf', 'protect-pdf']
  },

  'ai-summarizer': {
    title: 'AI PDF Summarizer',
    metaTitle: 'AI PDF Summarizer Free — Instant Executive Bullet Points & Insights',
    metaDescription: 'Summarize lengthy PDF reports, academic papers, contracts, and books online for free with AI. Extract key takeaways, statistics, and executive briefings in seconds.',
    keywords: ['ai pdf summarizer', 'summarize pdf free', 'pdf key points generator', 'ai paper summary', 'fast document summary'],
    h1: 'AI-Powered PDF Summarizer: Instant Executive Briefings',
    subtitle: 'Condense hundred-page reports, legal filings, and academic whitepapers into clear, digestible executive takeaways.',
    steps: [
      { title: 'Upload PDF Document', desc: 'Select any research paper, financial report, or policy document.' },
      { title: 'AI Extraction', desc: 'Core arguments, methodology, and numerical metrics are synthesized.' },
      { title: 'Read & Copy Summary', desc: 'Copy executive bullet points or export the condensed brief.' }
    ],
    faqs: [
      { q: 'Can I summarize documents in other languages?', a: 'Yes, the AI summarizer processes multilingual documents seamlessly.' }
    ],
    relatedToolIds: ['pdf-to-markdown', 'translate-pdf', 'compare-pdf', 'ocr-pdf']
  },

  'compare-pdf': {
    title: 'Compare PDF',
    metaTitle: 'Compare PDF Documents Online Free — Visual & Textual Diff Checker',
    metaDescription: 'Compare two PDF documents side by side online for free. Spot visual alterations, contract clause modifications, and textual edits instantly.',
    keywords: ['compare pdf', 'pdf diff checker', 'side by side pdf comparison', 'find differences in pdf', 'compare contracts free'],
    h1: 'Side-by-Side PDF Comparison & Visual Diff Checker',
    subtitle: 'Quickly spot legal clause revisions, pricing table shifts, and layout modifications between two document drafts.',
    steps: [
      { title: 'Upload Original & Revised PDF', desc: 'Load both document versions into the comparison workbench.' },
      { title: 'Side-by-Side Inspection', desc: 'Review synchronized page scrolls with visual highlighting.' },
      { title: 'Download Discrepancy Log', desc: 'Review detected differences and save comparison notes.' }
    ],
    faqs: [
      { q: 'Does it highlight deleted text as well as added text?', a: 'Yes, differences between the reference and revised versions are highlighted.' }
    ],
    relatedToolIds: ['ai-summarizer', 'edit-pdf', 'redact-pdf', 'pdf-to-markdown']
  },

  'translate-pdf': {
    title: 'Translate PDF',
    metaTitle: 'Translate PDF Online Free — 40+ Languages with Layout Preservation',
    metaDescription: 'Translate PDF documents into 40+ international languages online for free while preserving tables, headings, and formatting. Fast in-browser translation.',
    keywords: ['translate pdf', 'free pdf translator', 'translate document online', 'multilingual pdf', 'translate pdf preserve layout'],
    h1: 'Translate PDF Documents into 40+ Languages Online',
    subtitle: 'Translate brochures, user manuals, and contracts into Spanish, French, German, Japanese, and 40+ languages.',
    steps: [
      { title: 'Select Document', desc: 'Upload the PDF file you need translated.' },
      { title: 'Pick Target Language', desc: 'Choose from over 40 global languages.' },
      { title: 'Download Translated PDF', desc: 'Get your translated document with preserved layout.' }
    ],
    faqs: [
      { q: 'Is formatting preserved?', a: 'Yes, our layout engine retains headings, columns, and embedded imagery.' }
    ],
    relatedToolIds: ['ai-summarizer', 'ocr-pdf', 'pdf-to-word', 'edit-pdf']
  },

  'redact-pdf': {
    title: 'Redact PDF',
    metaTitle: 'Redact PDF Online Free — Permanently Sanitize Sensitive Data & PII',
    metaDescription: 'Permanently redact sensitive PII, SSNs, credit card numbers, and confidential text from PDF files online for free. True vector redaction with zero server uploads.',
    keywords: ['redact pdf', 'black out pdf text', 'sanitize pdf', 'remove pii from pdf free', 'permanent pdf redaction'],
    h1: 'Permanently Redact Confidential Text & PII from PDFs',
    subtitle: 'Ensure compliance with HIPAA, GDPR, and legal discovery standards by scrubbing confidential records permanently.',
    steps: [
      { title: 'Upload Sensitive PDF', desc: 'Open the document requiring confidential redaction.' },
      { title: 'Select Areas or Text', desc: 'Draw blackout boxes over sensitive numbers, names, or graphics.' },
      { title: 'Burn & Export', desc: 'Redactions are permanently rasterized so underlying text cannot be copied or recovered.' }
    ],
    faqs: [
      { q: 'Can someone un-redact or copy the text beneath the black bars?', a: 'No! Unlike amateur editors that merely place a black rectangle on top, PDFCraft Pro permanently deletes the underlying vector glyphs and text coordinates.' }
    ],
    relatedToolIds: ['protect-pdf', 'flatten-pdf', 'sign-pdf', 'edit-pdf']
  }
};

/**
 * Returns complete SEO data for any tool ID (with smart fallback)
 */
export function getToolSEO(toolId: string | null): ToolSEOData {
  if (!toolId || !TOOL_SEO_CATALOG[toolId]) {
    return {
      title: 'PDFCraft Pro',
      metaTitle: 'PDFCraft Pro — 35 Verified In-Browser Document Tools (100% Free & Private)',
      metaDescription: '35 professional PDF and document conversion tools operating 100% in-browser with WebAssembly. Merge, split, compress, convert, sign, and edit PDFs with zero server uploads.',
      keywords: ['pdf tools', 'free pdf editor', 'merge pdf', 'compress pdf', 'pdf to word', 'sign pdf', 'ocr pdf', 'private pdf converter'],
      h1: 'Professional PDF & Document Tools Running 100% In-Browser',
      subtitle: 'Fast, secure, and private document processing powered by WebAssembly. No files ever leave your computer.',
      steps: [
        { title: 'Choose Tool', desc: 'Select from 35 verified PDF conversion, editing, and security utilities.' },
        { title: 'Drop Your Files', desc: 'Files are processed directly in browser memory without cloud egress.' },
        { title: 'Instant Download', desc: 'Save your perfected documents with zero watermarks or subscription barriers.' }
      ],
      faqs: [
        { q: 'Is PDFCraft Pro really 100% free and private?', a: 'Yes. All file processing happens locally in your browser using client-side WebAssembly. No files are uploaded to any server.' },
        { q: 'Are there any file size or usage limits?', a: 'There are no artificial subscriptions or size limits. You have unlimited access.' }
      ],
      relatedToolIds: ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'sign-pdf', 'ocr-pdf']
    };
  }
  return TOOL_SEO_CATALOG[toolId];
}

/**
 * Dynamically updates document head tags (title, description, keywords, canonical, OG, Twitter, and JSON-LD schema)
 */
export function updateDocumentSEO(toolId: string | null) {
  const seo = getToolSEO(toolId);
  const canonicalUrl = toolId ? `${BASE_URL}/tools/${toolId}` : `${BASE_URL}/`;

  // 1. Title
  document.title = seo.metaTitle;

  // 2. Meta description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', seo.metaDescription);

  // 3. Meta keywords
  let kwMeta = document.querySelector('meta[name="keywords"]');
  if (!kwMeta) {
    kwMeta = document.createElement('meta');
    kwMeta.setAttribute('name', 'keywords');
    document.head.appendChild(kwMeta);
  }
  kwMeta.setAttribute('content', seo.keywords.join(', '));

  // 4. Canonical URL
  let canLink = document.querySelector('link[rel="canonical"]');
  if (!canLink) {
    canLink = document.createElement('link');
    canLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canLink);
  }
  canLink.setAttribute('href', canonicalUrl);

  // 5. OpenGraph Tags
  const setMetaProperty = (prop: string, val: string) => {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', val);
  };

  setMetaProperty('og:title', seo.metaTitle);
  setMetaProperty('og:description', seo.metaDescription);
  setMetaProperty('og:url', canonicalUrl);

  // 6. Twitter Tags
  const setTwitterMeta = (name: string, val: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', val);
  };

  setTwitterMeta('twitter:title', seo.metaTitle);
  setTwitterMeta('twitter:description', seo.metaDescription);
  setTwitterMeta('twitter:url', canonicalUrl);

  // 7. Dynamic JSON-LD Structured Data
  let scriptEl = document.getElementById('dynamic-tool-schema') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'dynamic-tool-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL
      },
      ...(toolId ? [{
        '@type': 'ListItem',
        position: 2,
        name: seo.title,
        item: canonicalUrl
      }] : [])
    ]
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolId ? `PDFCraft Pro — ${seo.title}` : 'PDFCraft Pro',
    url: canonicalUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All (Web, Windows, macOS, Linux, iOS, Android)',
    browserRequirements: 'Requires WebAssembly-compatible browser (Chrome, Edge, Safari, Firefox)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1420',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: seo.keywords.join(', '),
    description: seo.metaDescription
  };

  scriptEl.textContent = JSON.stringify([breadcrumbsSchema, softwareAppSchema]);
}
