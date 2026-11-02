# PDFCraft Pro — Free Custom Domain & Email Setup Guide

This guide provides end-to-end instructions for configuring a free custom domain and free email service for PDFCraft Pro using curated zero-cost developer tiers from [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev.git).

---

## 1. Domain Configuration

### Option A: `is-a.dev` (Recommended for Developers)
[is-a.dev](https://is-a.dev) is a free subdomain service for developers and open-source projects hosted on GitHub Pages, Vercel, Cloudflare Pages, etc.

1. **Prepared Registration File**:
   We have already pre-generated the registration record at [`domains/pdfcraft-pro.json`](../domains/pdfcraft-pro.json):
   ```json
   {
     "owner": {
       "username": "alokhalder3679-lang",
       "email": "alokhalder3679@gmail.com"
     },
     "description": "PDFCraft Pro - 100% In-Browser Privacy-First PDF Utility Suite",
     "repo": "https://github.com/alokhalder3679-lang/pdfcraft-pro",
     "record": {
       "CNAME": "cname.vercel-dns.com"
     }
   }
   ```
2. **How to Register**:
   - Fork [`is-a-dev/register`](https://github.com/is-a-dev/register).
   - Place `pdfcraft-pro.json` into the `domains/` folder of your fork.
   - Submit a Pull Request. Once merged by the automated CI bot, `https://pdfcraft-pro.is-a.dev` will instantly route to Vercel!
3. **Vercel Project Setup**:
   - In your [Vercel Dashboard](https://vercel.com/dashboard) → Select `pdfcraft-pro` → **Settings** → **Domains**.
   - Add `pdfcraft-pro.is-a.dev`.
   - Vercel will automatically verify the CNAME and generate a Let's Encrypt SSL/TLS edge certificate within 60 seconds.

---

### Option B: `js.org` (For JavaScript Web Tools)
[js.org](https://js.org) provides free subdomains for JavaScript and TypeScript projects hosted on GitHub/Vercel.

1. **Prepared Registration Entry**:
   See [`domains/js-org-cname.txt`](../domains/js-org-cname.txt):
   ```javascript
   "pdfcraft": "cname.vercel-dns.com",
   "pdfcraft-pro": "cname.vercel-dns.com"
   ```
2. **How to Register**:
   - Fork [`js-org/js.org`](https://github.com/js-org/js.org).
   - Add the lines above to `cnames_active.js` in alphabetical order.
   - Open a Pull Request. Once approved, add `pdfcraft.js.org` to your Vercel Domains list.

---

### Option C: `freedns.afraid.org` (Instant Subdomains)
From `free-for-dev` DNS category:
- Visit [freedns.afraid.org](https://freedns.afraid.org/).
- Sign up for a free account.
- In **Subdomains** → Add a new CNAME record pointing your chosen subdomain to `cname.vercel-dns.com`.

---

## 2. Email Service Setup

### Option 1: Web3Forms (Form Submissions to Inbox)
From `free-for-dev` Forms category:
- **Free Tier**: 250 submissions/month, zero backend required, spam protection.
- **How to Activate**:
  1. Go to [web3forms.com](https://web3forms.com/) and enter your personal email (`alokhalder3679@gmail.com`).
  2. You will instantly receive a free Access Key in your email.
  3. Set this environment variable in your Vercel Dashboard (**Settings** → **Environment Variables**) or local `.env`:
     ```env
     VITE_WEB3FORMS_ACCESS_KEY="your-access-key-here"
     ```
  4. Redepoy or build. All messages submitted through the in-app "Support & Feedback" modal will now deliver directly to your Gmail inbox!

---

### Option 2: Free Inbound Forwarding via ImprovMX / eForward
From `free-for-dev` Email category:
- Forward all emails sent to `support@pdfcraft-pro.is-a.dev` or `contact@yourdomain` straight to your personal Gmail.
- **Setup with ImprovMX** ([improvmx.com](https://improvmx.com)):
  1. Add your domain to ImprovMX.
  2. Configure DNS MX records:
     - `MX 10 mx1.improvmx.com`
     - `MX 20 mx2.improvmx.com`
  3. Add alias: `support@...` → `alokhalder3679@gmail.com`.
  4. Free forwarding is active forever.

---

### Option 3: EmailJS (Client-Side Direct Dispatch)
From `free-for-dev` Email category:
- **Free Tier**: 200 emails/month client-side without exposing backend credentials.
- Set the following in `.env`:
  ```env
  VITE_EMAILJS_SERVICE_ID="your_service_id"
  VITE_EMAILJS_TEMPLATE_ID="your_template_id"
  VITE_EMAILJS_PUBLIC_KEY="your_public_key"
  ```

---

## 3. Built-in Client Fallbacks

If no third-party API keys are set, PDFCraft Pro automatically activates its **Zero-Failure Mailto Fallback Engine**:
- Automatically structures URI-encoded email drafts pre-addressed to `support@pdfcraft-pro.is-a.dev`.
- Populates diagnostic context (current tool, browser environment, user message).
- Allows users to launch their default email client (Gmail, Outlook, Thunderbird, Apple Mail) in one click.
- Allows sending processed PDF completion notices directly from `ToolPage.tsx`.

---

## 4. Verification Suite

Run the built-in domain and email verification script anytime:
```bash
node scripts/verify-domain-and-email.mjs
```
Expected output:
```
=== PDFCraft Pro Domain & Email Test Suite ===
1. Domain Configuration Validation
  ✔ PASS: is-a.dev registration file exists
  ✔ PASS: Owner username specified in is-a.dev JSON
  ✔ PASS: CNAME points to cname.vercel-dns.com
  ✔ PASS: Repository URL valid in is-a.dev JSON
  ✔ PASS: js.org CNAME definition file exists
  ✔ PASS: js.org record points to cname.vercel-dns.com

2. Email Service Logic & Template Validation
  ✔ PASS: emailService.ts exists in src/services
  ✔ PASS: Subject contains URL-encoded category and title
  ✔ PASS: Target email is support@pdfcraft-pro.is-a.dev

3. Vercel & Production Hardening
  ✔ PASS: vercel.json exists
  ✔ PASS: Security headers configured in vercel.json
  ✔ PASS: SPA fallback rewrites configured

Summary: 12/12 tests passed.
All Domain & Email configurations verified successfully!
```
