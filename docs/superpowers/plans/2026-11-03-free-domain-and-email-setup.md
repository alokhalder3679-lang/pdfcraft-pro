# Free Domain and Email Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

This implementation plan specifies the complete configuration, integration, and UI enhancement to equip **PDFCraft Pro** with a free custom domain and free email service, rigorously following free tiers documented in [`ripienaar/free-for-dev`](https://github.com/ripienaar/free-for-dev.git).

---

## 1. Architecture Overview

### 1.1 Free Domain Selection (`free-for-dev` DNS & Domain Categories)
- **Primary Domain**: `is-a.dev` (Free developer subdomain `pdfcraft-pro.is-a.dev`)
  - Target: CNAME to `cname.vercel-dns.com`
  - Registration format: JSON file submitted to `is-a-dev/register`
- **Secondary Domain**: `js.org` (`pdfcraft.js.org`)
  - Target: CNAME to `cname.vercel-dns.com`
  - Registration format: CNAME mapping in `js-org/js.org`
- **Instant Fallback**: `FreeDNS` (`freedns.afraid.org` - free subdomain registry)
- **Edge Routing & Protection**: Cloudflare Free Tier (DNS, universal SSL/TLS, CNAME flattening)

### 1.2 Free Email Selection (`free-for-dev` Email & Forms Categories)
- **Inbound / Contact Form Submissions**:
  - `Web3Forms` (`https://web3forms.com`): 250 free monthly submissions, zero backend needed, honeypot & spam protection, delivered directly to the author's inbox.
  - `EmailJS` (`https://www.emailjs.com`): 200 free client-side emails/month via direct browser SDK/REST API.
- **Inbound Domain Email Forwarding**:
  - `ImprovMX` (`https://improvmx.com`) & `eForward` (`https://eforward.com`): MX forwarding from `support@pdfcraft-pro.is-a.dev` or `contact@...` to personal Gmail/Outlook without running mail servers.
- **Transactional / Delivery**:
  - `Resend` (`https://resend.com`): 3,000 free emails/month, 100/day.

---

## 2. File Structure Changes

```
pdfcraft-pro/
├── domains/
│   ├── pdfcraft-pro.json          # is-a.dev registration file
│   └── js-org-cname.txt           # js.org CNAME entry
├── docs/
│   ├── FREE_DOMAIN_AND_EMAIL_GUIDE.md  # Step-by-step activation guide
│   └── superpowers/plans/2026-11-03-free-domain-and-email-setup.md
├── scripts/
│   └── verify-domain-and-email.mjs # Integration test suite for domain & email
├── src/
│   ├── services/
│   │   └── emailService.ts        # Client-side email dispatch (Web3Forms/EmailJS/mailto)
│   ├── components/
│   │   ├── ContactModal.tsx       # Support, feedback, bug report modal
│   │   ├── EmailShareModal.tsx    # Send processed document via email modal
│   │   ├── Navbar.tsx             # Added Contact trigger & domain badge
│   │   └── Footer.tsx             # Added Domain & Email links and credits
│   └── App.tsx                    # State wiring for contact modal
└── vercel.json                    # Domain aliases & headers
```

---

## 3. Tasks Breakdown

### Task 1: Domain Configuration & Free Registry Records
- [ ] Create `domains/pdfcraft-pro.json` with `is-a.dev` schema.
- [ ] Create `domains/js-org-cname.txt` for `js.org`.
- [ ] Update `vercel.json` with domain routing and redirects.
- [ ] Update `index.html` with canonical URL `https://pdfcraft-pro.is-a.dev` / `https://pdfcraft-pro.vercel.app`.

### Task 2: Client-Side Email Engine (`src/services/emailService.ts`)
- [ ] Implement Web3Forms submission with access key resolution and payload formatting.
- [ ] Implement client-side `mailto:` generator as a bulletproof zero-failure offline fallback.
- [ ] Implement email validation and sanitization.
- [ ] Add `sendProcessedDocumentEmail` helper for PDF sharing.

### Task 3: UI Integration (`ContactModal.tsx` & `EmailShareModal.tsx`)
- [ ] Build `ContactModal.tsx` with tabs: Feedback, Bug Report, Tool Request, Free Infrastructure Specs.
- [ ] Build `EmailShareModal.tsx` enabling users to send document metadata, summary, or attachments.
- [ ] Wire triggers into `Navbar.tsx` and `Footer.tsx`.
- [ ] Integrate "Email Document" action in `ToolPage.tsx`.

### Task 4: Automated Verification Suite
- [ ] Implement `scripts/verify-domain-and-email.mjs`.
- [ ] Verify Web3Forms payload structure, mailto link builder, and domain JSON validity.
- [ ] Run test suite with zero failures.

### Task 5: Documentation & Git Release
- [ ] Write `docs/FREE_DOMAIN_AND_EMAIL_GUIDE.md`.
- [ ] Update `README.md` and `.env.example`.
- [ ] Run full project compilation (`tsc -b && vite build`).
- [ ] Push clean commits to GitHub repository.
