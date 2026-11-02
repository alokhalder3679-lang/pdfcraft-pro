/**
 * PDFCraft Pro - Free Email Service
 * Powered by zero-cost developer tiers curated from ripienaar/free-for-dev:
 * - Web3Forms (250 free submissions/mo, spam protection, zero backend)
 * - EmailJS (200 free client-side emails/mo)
 * - ImprovMX / eForward (Free custom domain email forwarding)
 */

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: 'feedback' | 'bug' | 'tool-request' | 'general';
  toolId?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  provider: 'web3forms' | 'emailjs' | 'mailto' | 'simulated';
  message: string;
  mailtoFallback?: string;
}

export interface DomainAndEmailConfig {
  primaryDomain: string;
  subdomainDev: string;
  subdomainJsOrg: string;
  supportEmail: string;
  routingProvider: string;
  formsProvider: string;
}

export const DOMAIN_AND_EMAIL_SPECS: DomainAndEmailConfig = {
  primaryDomain: 'pdfcraft-pro.vercel.app',
  subdomainDev: 'pdfcraft-pro.is-a.dev',
  subdomainJsOrg: 'pdfcraft.js.org',
  supportEmail: 'support@pdfcraft-pro.is-a.dev',
  routingProvider: 'ImprovMX / Cloudflare Email Routing (free-for-dev)',
  formsProvider: 'Web3Forms (free-for-dev Forms category)',
};

/**
 * Builds a standardized, URI-encoded mailto link as a zero-failure fallback
 */
export function buildMailtoFallback(payload: ContactMessagePayload): string {
  const targetEmail = DOMAIN_AND_EMAIL_SPECS.supportEmail;
  const subject = encodeURIComponent(
    `[PDFCraft ${payload.category ? payload.category.toUpperCase() : 'FEEDBACK'}] ${payload.subject}`
  );
  const bodyText = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.category ? `Category: ${payload.category}` : null,
    payload.toolId ? `Referenced Tool: ${payload.toolId}` : null,
    `Client: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client'}`,
    `Timestamp: ${new Date().toISOString()}`,
    '',
    '--- Message ---',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n');

  return `mailto:${targetEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
}

/**
 * Builds a mailto link for sharing document completion metadata with a colleague or client
 */
export function buildShareDocumentMailto(params: {
  recipient?: string;
  documentName: string;
  toolName: string;
  notes?: string;
}): string {
  const recipient = params.recipient || '';
  const subject = encodeURIComponent(`Processed Document: ${params.documentName} via PDFCraft Pro`);
  const body = encodeURIComponent(
    `Hello,\n\nI just processed "${params.documentName}" using the ${params.toolName} tool on PDFCraft Pro (https://pdfcraft-pro.vercel.app/).\n\n` +
      (params.notes ? `Notes:\n${params.notes}\n\n` : '') +
      `PDFCraft Pro is a 100% in-browser, privacy-first PDF utility suite.\n\nBest regards,`
  );

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

/**
 * Send contact, feedback, or bug report through Web3Forms or client-side fallbacks
 */
export async function sendContactMessage(
  payload: ContactMessagePayload
): Promise<EmailDispatchResult> {
  const mailtoLink = buildMailtoFallback(payload);

  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;

  // Check for Web3Forms Access Key from environment
  const web3formsKey = metaEnv?.VITE_WEB3FORMS_ACCESS_KEY;

  // Check for EmailJS configuration
  const emailjsService = metaEnv?.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplate = metaEnv?.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = metaEnv?.VITE_EMAILJS_PUBLIC_KEY;

  // 1. Try Web3Forms if configured
  if (web3formsKey && web3formsKey.trim().length > 0) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          name: payload.name,
          email: payload.email,
          subject: `[PDFCraft] ${payload.subject}`,
          category: payload.category || 'general',
          tool_id: payload.toolId || 'none',
          message: payload.message,
          from_name: 'PDFCraft Pro Web App',
          botcheck: false,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return {
          success: true,
          provider: 'web3forms',
          message: 'Thank you! Your message has been delivered directly to our support team.',
        };
      }
    } catch {
      // Fall through to next provider
    }
  }

  // 2. Try EmailJS if configured
  if (emailjsService && emailjsTemplate && emailjsPublicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: emailjsService,
          template_id: emailjsTemplate,
          user_id: emailjsPublicKey,
          template_params: {
            from_name: payload.name,
            from_email: payload.email,
            subject: payload.subject,
            category: payload.category,
            message: payload.message,
          },
        }),
      });

      if (response.ok) {
        return {
          success: true,
          provider: 'emailjs',
          message: 'Message delivered via EmailJS free client tier!',
        };
      }
    } catch {
      // Fall through to mailto
    }
  }

  // 3. Fallback: Return mailto link ready for 1-click dispatch
  return {
    success: true,
    provider: 'mailto',
    message: 'Feedback prepared! Click below to send via your email client, or copy the template.',
    mailtoFallback: mailtoLink,
  };
}
