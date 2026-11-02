export interface PDFTool {
  id: string;
  name: string;
  shortName?: string;
  path: string;
  description: string;
  category: 'organize' | 'convert-to-pdf' | 'convert-from-pdf' | 'edit-security' | 'advanced';
  icon: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  accept: string[];
  maxFiles: number;
}

export const PDF_TOOLS: PDFTool[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    path: '/tools/merge-pdf',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    category: 'organize',
    icon: 'Layers',
    iconBg: 'bg-orange-500',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 20
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    path: '/tools/split-pdf',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    category: 'organize',
    icon: 'Scissors',
    iconBg: 'bg-orange-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    path: '/tools/compress-pdf',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    category: 'organize',
    icon: 'Minimize2',
    iconBg: 'bg-emerald-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 10
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    path: '/tools/pdf-to-word',
    description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.',
    category: 'convert-from-pdf',
    icon: 'FileText',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 10
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    path: '/tools/pdf-to-powerpoint',
    description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
    category: 'convert-from-pdf',
    icon: 'Presentation',
    iconBg: 'bg-orange-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 10
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    path: '/tools/pdf-to-excel',
    description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
    category: 'convert-from-pdf',
    icon: 'Sheet',
    iconBg: 'bg-green-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 10
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    path: '/tools/word-to-pdf',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    category: 'convert-to-pdf',
    icon: 'FileCode2',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    accept: ['.docx', '.doc'],
    maxFiles: 10
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    path: '/tools/powerpoint-to-pdf',
    description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
    category: 'convert-to-pdf',
    icon: 'SlidersHorizontal',
    iconBg: 'bg-orange-500',
    iconColor: 'text-white',
    accept: ['.pptx', '.ppt'],
    maxFiles: 10
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    path: '/tools/excel-to-pdf',
    description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
    category: 'convert-to-pdf',
    icon: 'Table',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    accept: ['.xlsx', '.xls', '.csv'],
    maxFiles: 10
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    path: '/tools/edit-pdf',
    description: 'Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.',
    category: 'edit-security',
    icon: 'Edit3',
    iconBg: 'bg-purple-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    path: '/tools/pdf-to-jpg',
    description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    category: 'convert-from-pdf',
    icon: 'Image',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 5
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    path: '/tools/jpg-to-pdf',
    description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
    category: 'convert-to-pdf',
    icon: 'FileImage',
    iconBg: 'bg-amber-600',
    iconColor: 'text-white',
    accept: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 30
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    path: '/tools/sign-pdf',
    description: 'Sign yourself or request electronic signatures from others.',
    category: 'edit-security',
    icon: 'PenTool',
    iconBg: 'bg-sky-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark',
    path: '/tools/watermark-pdf',
    description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
    category: 'edit-security',
    icon: 'Stamp',
    iconBg: 'bg-indigo-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 5
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    path: '/tools/rotate-pdf',
    description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
    category: 'organize',
    icon: 'RotateCw',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 10
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    path: '/tools/html-to-pdf',
    description: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.',
    category: 'convert-to-pdf',
    icon: 'Globe',
    iconBg: 'bg-yellow-500',
    iconColor: 'text-white',
    accept: ['.html', '.htm'],
    maxFiles: 1
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    path: '/tools/unlock-pdf',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
    category: 'edit-security',
    icon: 'Unlock',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    path: '/tools/protect-pdf',
    description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
    category: 'edit-security',
    icon: 'ShieldLock',
    iconBg: 'bg-blue-700',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 5
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    path: '/tools/organize-pdf',
    description: 'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.',
    category: 'organize',
    icon: 'LayoutGrid',
    iconBg: 'bg-orange-500',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    path: '/tools/pdf-to-pdfa',
    description: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting and remain compliant.',
    category: 'advanced',
    icon: 'Archive',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 5
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    path: '/tools/repair-pdf',
    description: 'Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.',
    category: 'advanced',
    icon: 'Wrench',
    iconBg: 'bg-green-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'page-numbers',
    name: 'Page numbers',
    path: '/tools/page-numbers',
    description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.',
    category: 'edit-security',
    icon: 'Binary',
    iconBg: 'bg-pink-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 5
  },
  {
    id: 'scan-to-pdf',
    name: 'Scan to PDF',
    path: '/tools/scan-to-pdf',
    description: 'Capture document scans from your mobile device camera or image uploads and combine into PDF instantly.',
    category: 'convert-to-pdf',
    icon: 'Camera',
    iconBg: 'bg-orange-600',
    iconColor: 'text-white',
    accept: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 20
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    path: '/tools/ocr-pdf',
    description: 'Easily convert scanned PDF into searchable and selectable documents using optical character recognition.',
    category: 'advanced',
    icon: 'ScanText',
    iconBg: 'bg-lime-600',
    iconColor: 'text-white',
    accept: ['.pdf', '.png', '.jpg'],
    maxFiles: 3
  },
  {
    id: 'compare-pdf',
    name: 'Compare PDF',
    path: '/tools/compare-pdf',
    description: 'Show a side-by-side document comparison and easily spot visual and textual changes between different file versions.',
    category: 'advanced',
    icon: 'Columns2',
    iconBg: 'bg-cyan-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 2
  },
  {
    id: 'redact-pdf',
    name: 'Redact PDF',
    path: '/tools/redact-pdf',
    description: 'Redact text and graphics to permanently remove sensitive information from a PDF.',
    category: 'edit-security',
    icon: 'ShieldAlert',
    iconBg: 'bg-slate-700',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    path: '/tools/crop-pdf',
    description: 'Crop margins of PDF documents or select specific areas, then apply the changes to chosen pages or whole document.',
    category: 'organize',
    icon: 'Crop',
    iconBg: 'bg-purple-700',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'pdf-forms',
    name: 'PDF Forms',
    path: '/tools/pdf-forms',
    description: 'Detect form fields automatically, fill PDF interactive forms: text boxes, checkboxes, radio buttons, and dropdowns.',
    category: 'edit-security',
    icon: 'CheckSquare',
    iconBg: 'bg-violet-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'ai-summarizer',
    name: 'AI Summarizer',
    path: '/tools/ai-summarizer',
    description: 'Quickly generate concise summaries from articles, paragraphs, and essays, providing clear key points in seconds.',
    category: 'advanced',
    icon: 'Sparkles',
    iconBg: 'bg-indigo-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'translate-pdf',
    name: 'Translate PDF',
    path: '/tools/translate-pdf',
    description: 'Easily translate PDF documents to 40+ languages while preserving layout, fonts, and styling as much as possible.',
    category: 'advanced',
    icon: 'Languages',
    iconBg: 'bg-purple-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 1
  },
  {
    id: 'pdf-to-markdown',
    name: 'PDF to Markdown',
    path: '/tools/pdf-to-markdown',
    description: 'Turn your PDFs into Markdown files. Perfect for notes, docs, and LLMs (headings, tables, lists, and links preserved).',
    category: 'convert-from-pdf',
    icon: 'FileCode',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 5
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    path: '/tools/text-to-pdf',
    description: 'Convert plain text notes or .txt files into clean, beautifully formatted PDF documents.',
    category: 'convert-to-pdf',
    icon: 'AlignLeft',
    iconBg: 'bg-teal-600',
    iconColor: 'text-white',
    accept: ['.txt'],
    maxFiles: 5
  },
  {
    id: 'markdown-to-pdf',
    name: 'Markdown PDF',
    path: '/tools/markdown-to-pdf',
    description: 'Convert Markdown documents (.md) into styled PDFs with formatted headings, tables, code blocks, and lists.',
    category: 'convert-to-pdf',
    icon: 'FileText',
    iconBg: 'bg-rose-600',
    iconColor: 'text-white',
    accept: ['.md', '.markdown'],
    maxFiles: 5
  },
  {
    id: 'flatten-pdf',
    name: 'Flatten PDF',
    path: '/tools/flatten-pdf',
    description: 'Flatten form fields, annotations, and vector layers into uneditable static printable PDF pages.',
    category: 'edit-security',
    icon: 'FileSpreadsheet',
    iconBg: 'bg-stone-600',
    iconColor: 'text-white',
    accept: ['.pdf'],
    maxFiles: 5
  },
  {
    id: 'workflow',
    name: 'Create a workflow',
    path: '/tools/workflow',
    description: 'Create custom workflows with your favorite tools, automate steps, and reuse them anytime.',
    category: 'advanced',
    icon: 'Workflow',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    badge: 'Automation',
    accept: ['.pdf'],
    maxFiles: 10
  }
];
