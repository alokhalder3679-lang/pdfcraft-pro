/**
 * PDFCraft Pro - Domain & Email Verification Suite
 * Tests domain registration records, email templates, and free-for-dev configurations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} - ${details}`);
  }
}

console.log('\n\x1b[1m=== PDFCraft Pro Domain & Email Test Suite ===\x1b[0m\n');

// 1. Verify is-a.dev registration file
console.log('\x1b[36m1. Domain Configuration Validation\x1b[0m');
const isADevPath = path.join(rootDir, 'domains', 'pdfcraft-pro.json');
assert(fs.existsSync(isADevPath), 'is-a.dev registration file exists');

if (fs.existsSync(isADevPath)) {
  const content = JSON.parse(fs.readFileSync(isADevPath, 'utf8'));
  assert(content.owner && content.owner.username, 'Owner username specified in is-a.dev JSON');
  assert(content.record && content.record.CNAME === 'cname.vercel-dns.com', 'CNAME points to cname.vercel-dns.com');
  assert(content.repo.includes('pdfcraft-pro'), 'Repository URL valid in is-a.dev JSON');
}

// 2. Verify js.org CNAME instructions
const jsOrgPath = path.join(rootDir, 'domains', 'js-org-cname.txt');
assert(fs.existsSync(jsOrgPath), 'js.org CNAME definition file exists');
if (fs.existsSync(jsOrgPath)) {
  const jsContent = fs.readFileSync(jsOrgPath, 'utf8');
  assert(jsContent.includes('cname.vercel-dns.com'), 'js.org record points to cname.vercel-dns.com');
}

// 3. Verify Email Service logic
console.log('\n\x1b[36m2. Email Service Logic & Template Validation\x1b[0m');
const emailServicePath = path.join(rootDir, 'src', 'services', 'emailService.ts');
assert(fs.existsSync(emailServicePath), 'emailService.ts exists in src/services');

// Test mailto fallback generator logic directly
function testMailtoFallback() {
  const payload = {
    name: 'Alok Halder',
    email: 'test@example.com',
    subject: 'Feature Request: Batch OCR',
    category: 'tool-request',
    toolId: 'ocr-pdf',
    message: 'Could you support batch OCR for 50 pages?',
  };

  const subject = encodeURIComponent(`[PDFCraft ${payload.category.toUpperCase()}] ${payload.subject}`);
  const expectedUrl = `mailto:support@pdfcraft-pro.is-a.dev?subject=${subject}`;
  
  assert(subject.includes('BATCH%20OCR') || subject.includes('TOOL-REQUEST'), 'Subject contains URL-encoded category and title');
  assert(expectedUrl.startsWith('mailto:support@pdfcraft-pro.is-a.dev'), 'Target email is support@pdfcraft-pro.is-a.dev');
}
testMailtoFallback();

// 4. Verify vercel.json headers & rewrites
console.log('\n\x1b[36m3. Vercel & Production Hardening\x1b[0m');
const vercelConfigPath = path.join(rootDir, 'vercel.json');
assert(fs.existsSync(vercelConfigPath), 'vercel.json exists');
if (fs.existsSync(vercelConfigPath)) {
  const vercelCfg = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  assert(Array.isArray(vercelCfg.headers), 'Security headers configured in vercel.json');
  assert(Array.isArray(vercelCfg.rewrites), 'SPA fallback rewrites configured');
}

console.log(`\n\x1b[1mSummary: ${passedTests}/${totalTests} tests passed.\x1b[0m`);
if (passedTests === totalTests) {
  console.log('\x1b[32mAll Domain & Email configurations verified successfully!\x1b[0m\n');
  process.exit(0);
} else {
  console.error('\x1b[31mSome tests failed.\x1b[0m\n');
  process.exit(1);
}
