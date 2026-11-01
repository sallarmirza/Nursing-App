// Waitlist + Feedback section.
// Both forms POST to Formspree → ha5599248@gmail.com.
// First submission triggers a one-click confirmation to that inbox; all
// subsequent submissions are forwarded automatically.
// To avoid exposing the address in the bundle long-term, move the URL to
// VITE_FORMSPREE_ID env var and use https://formspree.io/f/{id} instead.
import { useState } from 'react';
import logoWhite from '../assets/nursing-app-logo-white.png';

const CATEGORIES = [
  { label: 'Feature Request', value: 'feature' },
  { label: 'Improvement',     value: 'improvement' },
  { label: 'Bug Report',      value: 'bug' },
  { label: 'General',         value: 'general' },
];

const FORMSPREE_URL = 'https://formspree.io/ha5599248@gmail.com';

export default function Waitlist() {
  const [tab, setTab] = useState('waitlist');

  const [wEmail, setWEmail]   = useState('');
  const [wStatus, setWStatus] = useState('idle'); // idle | loading | success | error

  const [fb, setFb]             = useState({ name: '', email: '', category: 'feature', message: '' });
  const [fbStatus, setFbStatus] = useState('idle'); // idle | loading | success | error

  /* ── Waitlist submit — real POST to Formspree ── */
  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!wEmail || wStatus === 'loading') return;
    setWStatus('loading');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: wEmail,
          type: 'waitlist',
          _subject: 'New Waitlist Signup — DNA',
        }),
      });
      if (res.ok) { setWStatus('success'); setWEmail(''); }
      else          setWStatus('error');
    } catch { setWStatus('error'); }
  };

  /* ── Feedback submit via Formspree ── */
  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!fb.message.trim() || fbStatus === 'loading') return;
    setFbStatus('loading');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:     fb.name    || 'Anonymous',
          email:    fb.email   || 'Not provided',
          category: fb.category,
          message:  fb.message,
          _subject: `Feedback (${fb.category}) — DNA`,
        }),
      });
      if (res.ok) { setFbStatus('success'); setFb({ name: '', email: '', category: 'feature', message: '' }); }
      else          setFbStatus('error');
    } catch { setFbStatus('error'); }
  };

  const fbChange = (e) => setFb((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── Category chip keyboard navigation (roving radiogroup) ── */
  const handleCategoryKeyDown = (e) => {
    const current = CATEGORIES.findIndex((c) => c.value === fb.category);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = CATEGORIES[(current + 1) % CATEGORIES.length].value;
      setFb((p) => ({ ...p, category: next }));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = CATEGORIES[(current - 1 + CATEGORIES.length) % CATEGORIES.length].value;
      setFb((p) => ({ ...p, category: prev }));
    }
  };

  return (
    <section id="waitlist" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab toggle */}
        <div className="flex justify-center mb-10">
          <div role="tablist" className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
            {[
              { key: 'waitlist', label: 'Join Waitlist' },
              { key: 'feedback', label: 'Share Feedback' },
            ].map(({ key, label }) => (
              <button
                key={key}
                id={`tab-${key}`}
                role="tab"
                aria-selected={tab === key}
                aria-controls={`panel-${key}`}
                onClick={() => setTab(key)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 ${
                  tab === key
                    ? 'bg-white text-text-dark shadow-sm'
                    : 'text-text-muted hover:text-text-dark'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── WAITLIST — full branded blue card ── */}
        {tab === 'waitlist' && (
          <div role="tabpanel" id="panel-waitlist" aria-labelledby="tab-waitlist" className="bg-brand-blue rounded-[2.5rem] py-16 px-6 md:px-16 text-center flex flex-col items-center shadow-xl relative overflow-hidden">
            <img src={logoWhite} alt="DNA Logo" className="h-16 w-auto object-contain mb-6" />

            <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 text-white text-xs font-bold tracking-wider uppercase mb-6">
              Early Access
            </span>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Be the First to Experience <br className="hidden md:block" /> DNA
            </h2>

            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Get early access to the Digital Nursing Assistant app, exclusive updates, and launch news delivered straight to your inbox.
            </p>

            {/* Always-present live region — screen readers announce status changes */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {wStatus === 'success' && "You're on the list! We'll be in touch."}
              {wStatus === 'error' && 'Something went wrong — please try again.'}
            </div>

            <div className="w-full max-w-xl flex flex-col items-center gap-3">
              {wStatus === 'success' ? (
                <div className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-full flex items-center gap-3 animate-fade-in">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="font-semibold">You're on the list! We'll be in touch.</span>
                </div>
              ) : (
                <>
                  <form onSubmit={handleWaitlist} className="w-full flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-full shadow-lg">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      aria-label="Email address"
                      required
                      value={wEmail}
                      onChange={(e) => setWEmail(e.target.value)}
                      disabled={wStatus === 'loading'}
                      className="grow px-6 py-3 rounded-full text-text-dark focus:outline-none bg-transparent placeholder:text-gray-400 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={wStatus === 'loading'}
                      className="bg-brand-blue text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-hover transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center min-w-35"
                    >
                      {wStatus === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : 'Join Waitlist'}
                    </button>
                  </form>
                  {wStatus === 'error' && (
                    <p className="text-white/80 text-sm" aria-hidden="true">Something went wrong — please try again.</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── FEEDBACK — clean minimal form, no branding ── */}
        {tab === 'feedback' && (
          <div role="tabpanel" id="panel-feedback" aria-labelledby="tab-feedback" className="max-w-lg mx-auto">

            {/* Always-present live region — screen readers announce status changes */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {fbStatus === 'success' && 'Feedback sent. Thank you for helping shape DNA.'}
              {fbStatus === 'error' && 'Something went wrong — please try again.'}
            </div>

            {fbStatus === 'success' ? (
              <div className="text-center py-16 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-text-dark">Feedback sent</h3>
                <p className="text-text-muted max-w-xs leading-relaxed">
                  The team reviews every submission. Thank you for helping shape DNA.
                </p>
                <button
                  onClick={() => setFbStatus('idle')}
                  className="mt-2 text-sm font-semibold text-brand-blue hover:underline underline-offset-2"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-text-dark mb-2">Share Your Feedback</h2>
                  <p className="text-text-muted">Your thoughts help shape what we build next.</p>
                </div>

                <form onSubmit={handleFeedback} className="flex flex-col gap-5">

                  {/* Category chips — role="radiogroup" with roving tabindex for keyboard nav */}
                  <div
                    role="radiogroup"
                    aria-label="Feedback category"
                    onKeyDown={handleCategoryKeyDown}
                    className="flex flex-wrap gap-2"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        role="radio"
                        aria-checked={fb.category === cat.value}
                        tabIndex={fb.category === cat.value ? 0 : -1}
                        onClick={() => setFb((p) => ({ ...p, category: cat.value }))}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 ${
                          fb.category === cat.value
                            ? 'bg-brand-blue text-white border-brand-blue'
                            : 'text-text-muted border-gray-200 hover:border-brand-blue hover:text-brand-blue'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Name + Email — stacks on mobile, side-by-side from sm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fb-name" className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Name <span className="font-normal normal-case">(optional)</span>
                      </label>
                      <input
                        id="fb-name"
                        type="text"
                        name="name"
                        value={fb.name}
                        onChange={fbChange}
                        placeholder="Your name"
                        disabled={fbStatus === 'loading'}
                        className="px-4 py-3 rounded-xl border border-gray-200 text-text-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 text-base bg-gray-50 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fb-email" className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Email <span className="font-normal normal-case">(optional)</span>
                      </label>
                      <input
                        id="fb-email"
                        type="email"
                        name="email"
                        value={fb.email}
                        onChange={fbChange}
                        placeholder="you@hospital.com"
                        disabled={fbStatus === 'loading'}
                        className="px-4 py-3 rounded-xl border border-gray-200 text-text-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 text-base bg-gray-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fb-message" className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="fb-message"
                      name="message"
                      value={fb.message}
                      onChange={fbChange}
                      required
                      rows={5}
                      maxLength={2000}
                      placeholder="What would make your shift easier? What's missing from tools you use today?"
                      disabled={fbStatus === 'loading'}
                      className="px-4 py-3 rounded-xl border border-gray-200 text-text-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 text-base bg-gray-50 resize-none leading-relaxed disabled:opacity-50"
                    />
                  </div>

                  {fbStatus === 'error' && (
                    <p className="text-error text-sm text-center" aria-hidden="true">Something went wrong — please try again.</p>
                  )}

                  <button
                    type="submit"
                    disabled={fbStatus === 'loading' || !fb.message.trim()}
                    className="w-full bg-brand-blue text-white font-semibold py-3.5 rounded-full hover:bg-brand-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {fbStatus === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Feedback
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </button>

                </form>
              </>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
