import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Bug,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  ShieldCheck,
  Server,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  sendContactMessage,
  DOMAIN_AND_EMAIL_SPECS,
  ContactMessagePayload,
  EmailDispatchResult,
} from '../services/emailService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentToolId?: string | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  currentToolId,
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'bug' | 'tool-request' | 'specs'>('feedback');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<EmailDispatchResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    setResult(null);

    const payload: ContactMessagePayload = {
      name: name.trim() || 'Anonymous User',
      email: email.trim() || 'user@pdfcraft.dev',
      subject: subject.trim() || `Inquiry from PDFCraft Pro (${activeTab})`,
      message: message.trim(),
      category: activeTab === 'specs' ? 'general' : activeTab,
      toolId: currentToolId || undefined,
    };

    try {
      const res = await sendContactMessage(payload);
      setResult(res);
      if (res.success && res.provider !== 'mailto') {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setResult({
        success: false,
        provider: 'mailto',
        message: 'Could not connect. Please reach out to us directly at support@pdfcraft-pro.is-a.dev.',
      });
    } finally {
      setSending(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DOMAIN_AND_EMAIL_SPECS.supportEmail);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 font-bold">
              <Mail className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Contact & Ecosystem Hub</span>
                <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  free-for-dev verified
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct community support, feature requests, and domain infrastructure specs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 overflow-x-auto">
          {[
            { id: 'feedback', label: 'Feedback', icon: MessageSquare },
            { id: 'bug', label: 'Report Issue', icon: Bug },
            { id: 'tool-request', label: 'Request Tool', icon: Sparkles },
            { id: 'specs', label: 'Domain & Email Setup', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setResult(null);
                }}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'specs' ? (
            <div className="space-y-6 text-xs text-slate-600">
              {/* Introduction Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Server className="w-4 h-4 text-rose-600" />
                  <span>Free Infrastructure Architecture</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  PDFCraft Pro runs on zero-dollar, developer-tier cloud infrastructure curated from{' '}
                  <a
                    href="https://github.com/ripienaar/free-for-dev"
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-600 hover:underline font-semibold"
                  >
                    ripienaar/free-for-dev
                  </a>
                  . No servers, no hidden tracking, and no infrastructure bills.
                </p>
              </div>

              {/* Domains Grid */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Domain & DNS Configuration</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Production Vercel Host
                    </span>
                    <a
                      href="https://pdfcraft-pro.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-slate-900 hover:text-rose-600 flex items-center justify-between"
                    >
                      <span>pdfcraft-pro.vercel.app</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                      ● Active (Vercel CDN + Edge SSL)
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Free Developer Domain
                    </span>
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>pdfcraft-pro.is-a.dev</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        is-a.dev
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block mt-1">
                      CNAME → cname.vercel-dns.com
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      JavaScript Suite Domain
                    </span>
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>pdfcraft.js.org</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        js.org
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block mt-1">
                      Free for open-source JS tooling
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      DNS & CDN Protection
                    </span>
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>Cloudflare / FreeDNS</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                        Free Tier
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block mt-1">
                      DDoS Shield, CNAME Flattening & DNSSEC
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Routing Specs */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>Free Email Infrastructure</span>
                </h4>
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800">Direct Support Mailbox</div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {DOMAIN_AND_EMAIL_SPECS.supportEmail}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold font-mono">
                        Forms & Submissions
                      </span>
                      <span className="font-medium text-slate-700">
                        Web3Forms (250 free submissions/mo, no backend)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold font-mono">
                        MX Inbound Forwarding
                      </span>
                      <span className="font-medium text-slate-700">
                        ImprovMX / eForward (Instant forward to personal inbox)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marie Curie"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Email (for replies)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    activeTab === 'bug'
                      ? 'Brief description of what went wrong'
                      : activeTab === 'tool-request'
                      ? 'Tool or conversion format you would love to see'
                      : 'How can we help or improve?'
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Message
                  </label>
                  {currentToolId && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Context: {currentToolId}
                    </span>
                  )}
                </div>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeTab === 'bug'
                      ? 'Tell us what happened, which browser you are on, and steps to reproduce...'
                      : activeTab === 'tool-request'
                      ? 'Describe your desired tool, expected inputs, and outputs...'
                      : 'Share your feedback, feature ideas, or thoughts...'
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50 resize-y"
                />
              </div>

              {/* Status or Result Banner */}
              {result && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    result.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{result.message}</p>
                    {result.mailtoFallback && (
                      <div className="mt-2 flex items-center gap-2">
                        <a
                          href={result.mailtoFallback}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-2xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Launch Mail Client</span>
                        </a>
                        <span className="text-[10px] text-emerald-600 font-mono">
                          (Direct pre-filled email)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Your email is never sold or shared.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {sending ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
