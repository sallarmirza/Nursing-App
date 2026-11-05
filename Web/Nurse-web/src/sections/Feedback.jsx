// Feedback form. Posts JSON to Formspree.
// Flow: fill form -> validate on submit -> POST (15s timeout) -> success or error.
// Setup: create a form at formspree.io and put its ID in VITE_FORMSPREE_ID.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/ui/SectionHeader";
import { SITE } from "../config/site";

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const FORMSPREE_URL = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : "";
const TIMEOUT_MS = 15000;
const MAX_LENGTH = 2000;

const INITIAL_FORM = { name: "", email: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Smooth border + shadow transition on focus; caret and placeholder on the design token scale
const fieldClass =
  "w-full px-4 py-3 rounded-xl border bg-bg-soft text-text-dark text-base placeholder:text-text-muted caret-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 disabled:opacity-50 transition-[border-color,box-shadow] duration-150";
const fieldBorder = (invalid) =>
  invalid ? "border-error focus:border-error" : "border-gray-200 focus:border-brand-blue";

const MailIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CheckIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Feedback() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const successRef = useRef(null);

  const isLoading = status === "loading";

  // Move focus to the confirmation so keyboard and screen-reader users land on it
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChange = (e) => updateField(e.target.name, e.target.value);

  // Check the fields before sending; returns true when the form is valid
  const validate = () => {
    const errors = {};
    if (!form.message.trim()) errors.message = "Please write a message before sending.";
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) {
      errors.email = "Enter a valid email address, or leave it blank.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Honeypot: real users never see this field. Bots fill it, so we fake success.
    if (new FormData(e.currentTarget).get("_gotcha")) {
      setStatus("success");
      return;
    }

    if (!validate()) return;

    if (!FORMSPREE_URL) {
      setStatus("error");
      setErrorMessage("The feedback form is not set up yet. Please email us instead.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Abort if the connection hangs (hospital networks can be slow)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || "Anonymous",
          email: form.email.trim() || "Not provided",
          app_version: SITE.apk.version, // added automatically
          message: form.message.trim(),
          _subject: "Feedback — DNA",
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      setForm(INITIAL_FORM);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.name === "AbortError"
          ? "This is taking too long. Check your connection and try again."
          : "Your message could not be sent. Check your connection and try again."
      );
    } finally {
      clearTimeout(timer);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setErrorMessage("");
    setStatus("idle");
  };

  return (
    <section id="feedback" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left: heading + direct contact */}
        <div>
          <SectionHeader
            title="Tell us what to fix or add"
            subtitle="Found a bug, or missing a tool on your shift? Send it here; the team reads every message."
          />
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-blue transition-colors"
          >
            {MailIcon}
            {SITE.email}
          </a>
        </div>

        {/* Right: form */}
        <div className="max-w-lg w-full">
          {/* Screen readers hear every state change */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {isLoading && "Sending feedback."}
            {status === "success" && "Feedback sent. Thank you for helping shape DNA."}
            {status === "error" && errorMessage}
          </div>

          {status === "success" ? (
            // Success state
            <div className="flex flex-col items-start gap-4 py-8">
              <div className="w-14 h-14 rounded-full bg-success-bg text-success flex items-center justify-center">
                {CheckIcon}
              </div>
              <div>
                <h3 ref={successRef} tabIndex={-1} className="text-2xl font-bold text-text-dark outline-none mb-2">
                  Feedback sent
                </h3>
                <p className="text-text-muted leading-relaxed">
                  Thank you for helping shape DNA. We read every message.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-semibold text-brand-blue hover:underline underline-offset-2"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* Honeypot: hidden from people and assistive tech */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {/* Name + email (both optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fb-name" className="text-sm font-medium text-text-dark">
                    Name 
                  </label>
                  <input
                    id="fb-name" name="name" type="text" autoComplete="name"
                    value={form.name} onChange={handleChange} disabled={isLoading}
                    placeholder="Your name"
                    className={`${fieldClass} ${fieldBorder(false)}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fb-email" className="text-sm font-medium text-text-dark">
                    Email 
                  </label>
                  <input
                    id="fb-email" name="email" type="email" autoComplete="email"
                    value={form.email} onChange={handleChange} disabled={isLoading}
                    placeholder="you@hospital.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "fb-email-error" : undefined}
                    className={`${fieldClass} ${fieldBorder(fieldErrors.email)}`}
                  />
                  {fieldErrors.email && (
                    <p id="fb-email-error" className="text-error text-sm">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Message (required) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fb-message" className="text-sm font-medium text-text-dark">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  id="fb-message" name="message" rows={5} maxLength={MAX_LENGTH}
                  value={form.message} onChange={handleChange} disabled={isLoading}
                  placeholder="What happened, or what would make your shift easier?"
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? "fb-message-error" : "fb-message-count"}
                  className={`${fieldClass} ${fieldBorder(fieldErrors.message)} resize-none leading-relaxed`}
                />
                <div className="flex justify-between gap-4">
                  <p id="fb-message-error" role="alert" className="text-error text-sm">
                    {fieldErrors.message}
                  </p>
                  <p id="fb-message-count" className="text-xs text-text-muted shrink-0 ml-auto">
                    {form.message.length}/{MAX_LENGTH}
                  </p>
                </div>
              </div>

              {/* Submission error */}
              {status === "error" && (
                <p role="alert" className="text-error text-sm bg-error-bg rounded-xl px-4 py-3">
                  {errorMessage}
                </p>
              )}

              {/* Submit: same corner radius as the fields; active:scale gives instant pointer-down feedback */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue text-white font-semibold py-3.5 rounded-xl hover:bg-brand-hover active:scale-[0.98] transition-[background-color,transform] duration-100 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send feedback"
                )}
              </button>

              <p className="text-xs text-text-muted leading-relaxed">
                Add your email if you would like a reply. We use it only to respond to you. See our{" "}
                <Link to="/privacy" className="text-brand-blue hover:underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}