# PDFCraft Pro — 35-in-1 Client-Side PDF & Document Processing Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38b2ac.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**PDFCraft Pro** is an open-source, modern web application delivering **35 comprehensive document and PDF manipulation tools**. Inspired by popular tools like iLovePDF, PDFCraft Pro processes documents **100% locally in your browser** using WebAssembly and client-side JavaScript engines. No files are ever uploaded to a server, guaranteeing total confidentiality and enterprise-grade privacy.

---

## 🌟 Key Highlights

* **35 Tools Built-In**: Comprehensive suite covering page organization, office conversion, security, editing, OCR, and AI summarization.
* **100% Private & Client-Side**: All PDF assembly, page manipulation, compression, and text extraction run inside an in-browser WebAssembly sandbox.
* **Modern Editorial Design**: Built with high-contrast typography, responsive Bento-style tool cards, category filtering, and dark/light accents.
* **Command Palette**: `Ctrl + K` or `Cmd + K` instant keyboard shortcuts for quick tool discovery and navigation.
* **Zero Backend Required**: Fully deployable as a static SPA on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

---

## 🛠️ The 35 Verified Tools

| # | Tool Name | Route | Description | Engine / Library |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Merge PDF** | `/tools/merge-pdf` | Combine multiple PDF documents into a single document | `pdf-lib` |
| **2** | **Split PDF** | `/tools/split-pdf` | Split pages or extract individual ranges into distinct files | `pdf-lib` |
| **3** | **Compress PDF** | `/tools/compress-pdf` | Optimize streams, images, and fonts to reduce file weight | `pdf-lib` stream optimizer |
| **4** | **PDF to Word** | `/tools/pdf-to-word` | Convert PDF document structures into editable `.docx` files | `pdfjs-dist` + `docx` |
| **5** | **PDF to PowerPoint** | `/tools/pdf-to-powerpoint` | Render and extract slide pages into `.pptx` decks | `pdfjs-dist` + `pptxgenjs` |
| **6** | **PDF to Excel** | `/tools/pdf-to-excel` | Detect tabular boundaries and export data to `.xlsx` workbooks | `pdfjs-dist` + `xlsx` (SheetJS) |
| **7** | **Word to PDF** | `/tools/word-to-pdf` | Convert `.docx` manuscripts and styling into clean PDF files | `mammoth` + `jspdf` |
| **8** | **PowerPoint to PDF** | `/tools/powerpoint-to-pdf` | Convert presentation decks into standardized PDF slides | `jszip` + `jspdf` |
| **9** | **Excel to PDF** | `/tools/excel-to-pdf` | Format spreadsheet tables and cells into paginated PDF sheets | `xlsx` + `jspdf` |
| **10** | **Edit PDF** | `/tools/edit-pdf` | Add freehand annotations, text overlays, and callouts | HTML5 Canvas + `pdf-lib` |
| **11** | **PDF to JPG** | `/tools/pdf-to-jpg` | High-resolution rasterization of PDF pages to JPEG / ZIP | `pdfjs-dist` |
| **12** | **JPG to PDF** | `/tools/jpg-to-pdf` | Assemble image collections into customized PDF documents | `pdf-lib` |
| **13** | **Sign PDF** | `/tools/sign-pdf` | Interactive signature canvas with custom positioning | Touch canvas + `pdf-lib` |
| **14** | **Watermark** | `/tools/watermark-pdf` | Stamp diagonal/horizontal text watermarks with opacity | `pdf-lib` text matrix |
| **15** | **Rotate PDF** | `/tools/rotate-pdf` | Rotate pages by 90°, 180°, or 270° with visual grid | `pdf-lib` page rotation |
| **16** | **HTML to PDF** | `/tools/html-to-pdf` | Render rich HTML code or secure web snippets into PDF | `html2canvas` + `jspdf` |
| **17** | **Unlock PDF** | `/tools/unlock-pdf` | Strip owner and permission restrictions from unlocked PDFs | `pdf-lib` decryption parser |
| **18** | **Protect PDF** | `/tools/protect-pdf` | Encrypt document streams with user and owner passwords | Standard PDF encryption |
| **19** | **Organize PDF** | `/tools/organize-pdf` | Interactive visual grid to drag, reorder, rotate, or delete pages | Canvas thumbnails + `pdf-lib` |
| **20** | **PDF to PDF/A** | `/tools/pdf-to-pdfa` | Conform metadata and embed fonts for archival standards | PDF/A-1b metadata embedder |
| **21** | **Repair PDF** | `/tools/repair-pdf` | Rebuild corrupted XRef tables and salvage readable objects | `pdf-lib` fault-tolerant loader |
| **22** | **Page Numbers** | `/tools/page-numbers` | Add configurable pagination, margins, and custom numbering | `pdf-lib` font renderer |
| **23** | **Scan to PDF** | `/tools/scan-to-pdf` | Capture receipts/documents directly via webcam or mobile camera | MediaDevices API + `pdf-lib` |
| **24** | **OCR PDF** | `/tools/ocr-pdf` | Optical Character Recognition for scanned documents | `tesseract.js` (WebAssembly) |
| **25** | **Compare PDF** | `/tools/compare-pdf` | Side-by-side textual and visual difference detector | Diff algorithm + Canvas diff |
| **26** | **Markdown PDF** | `/tools/markdown-to-pdf` | Convert Markdown syntax, tables, and code blocks to PDF | `marked` + `jspdf` |
| **27** | **Crop PDF** | `/tools/crop-pdf` | Visual crop box selector to trim margins and headers | `pdf-lib` CropBox / MediaBox |
| **28** | **PDF Forms** | `/tools/pdf-forms` | Fill AcroForm interactive fields, checkboxes, and export | `pdf-lib` PDFForm API |
| **29** | **AI Summarizer** | `/tools/ai-summarizer` | Extract text and generate key takeaways and summaries | In-browser heuristics / AI API |
| **30** | **Translate PDF** | `/tools/translate-pdf` | Multi-language document translation with layout preservation | DOM text mapper |
| **31** | **Text to PDF** | `/tools/text-to-pdf` | Turn plain `.txt` files into cleanly paginated PDF books | `jspdf` typography engine |
| **32** | **PDF to Markdown** | `/tools/pdf-to-markdown` | Extract headings, lists, and formatted body prose to `.md` | `pdfjs-dist` text stream |
| **33** | **Excel to PDF (Pro)** | `/tools/excel-to-pdf-alt` | Multi-sheet spreadsheet formatting with custom page sizes | `xlsx` table engine |
| **34** | **PowerPoint to PDF (Pro)** | `/tools/powerpoint-to-pdf-alt` | Slide-by-slide vector extraction to PDF presentation | `jszip` presentation parser |
| **35** | **Word to PDF (Pro)** | `/tools/word-to-pdf-alt` | Advanced typography and heading structure preservation | `mammoth` semantic parser |

---

## 🚀 Getting Started

### Prerequisites

* Node.js `20.x` or `22.x`
* npm `10+`

### Installation

```bash
# Clone the repository
git clone https://github.com/alokhalder3679-lang/pdfcraft-pro.git

# Navigate into the project
cd pdfcraft-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be live at `http://localhost:3000/`.

---

## 🏗️ Production Build

```bash
# Typecheck and compile static bundle
npm run build

# Preview production build locally
npm run preview
```

The compiled assets will be in `./dist/`.

---

## 🚢 Deployment

### Deploy to Vercel

The repository includes a ready-to-deploy configuration:

```bash
vercel deploy --prod
```

Or connect the repository on the [Vercel Dashboard](https://vercel.com/new).

### Deploy to Netlify

```bash
netlify deploy --prod --dir=dist
```

---

## 🔒 Security & Privacy Architecture

PDFCraft Pro is engineered with a strict **Local-First** security model:

1. **Zero Data Egress**: All parsing, rendering, and file assembly execute on the client device.
2. **WebAssembly Sandboxing**: Heavy computational tasks (Tesseract OCR, PDF stream decompression) run inside isolated WASM instances.
3. **No Database or Storage Logging**: Files remain strictly in volatile browser memory (`Uint8Array`, `ArrayBuffer`) and are freed upon document export.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
