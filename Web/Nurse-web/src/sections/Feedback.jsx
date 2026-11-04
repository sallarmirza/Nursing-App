// Feedback form. Posts JSON to Formspree.
// Flow: fill form -> validate on submit -> POST (15s timeout) -> success or error.
// Setup: create a form at formspree.io and put its ID in VITE_FORMSPREE_ID.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/ui/SectionHeader";
import { SITE } from "../config/site";

const CATEGORIES = [
  { label: "Bug report", value: "bug" },
  { label: "Feature request", value: "feature" },
  { label: "Improvement", value: "improvement" },
  { label: "General", value: "general" },
];

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const FORMSPREE_URL = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : "";
const TIMEOUT_MS = 15000;
const MAX_LENGTH = 2000;

const INITIAL_FORM = { name: "", email: "", category: "bug", device: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared field style; the invalid variant is added per field
const fieldClass =
  "w-full px-4 py-3 rounded-xl border bg-bg-soft text-text-dark text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 disabled:opacity-50 transition-colors";
const fieldBorder = (invalid) =>
  invalid ? "border-error focus:border-error" : "border-gray-200 focus:border-brand-blue";

export default function Feedback() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // { email, message }
  const successRef = useRef(null);

  const isLoading = status === "loading";

  // Move focus to the confirmation so keyboard and screen-reader users land on it
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error as soon as the user edits it
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChange = (e) => updateField(e.target.name, e.target.value);

  // Arrow keys move between category chips (roving radiogroup)
  const handleCategoryKeyDown = (e) => {
    const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (direction === undefined) return;
    e.preventDefault();
    const current = CATEGORIES.findIndex((c) => c.value === form.category);
    const next = (current + direction + CATEGORIES.length) % CATEGORIES.length;
    updateField("category", CATEGORIES[next].value);
    e.currentTarget.querySelectorAll('[role="radio"]')[next]?.focus();
  };

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
          category: form.category,
          // Only bug reports carry device details; app version is added automatically
          ...(form.category === "bug" && form.device.trim() ? { device: form.device.trim() } : {}),
          app_version: SITE.apk.version,
          message: form.message.trim(),
          _subject: `Feedback (${form.category}) — DNA`,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: heading + direct contact, so the column is never empty */}
        <div>
          <SectionHeader
            title="Tell us what to fix or add"
            subtitle="Found a bug, or missing a tool on your shift? Send it here. The team reads every message."
          />
          <p className="text-text-muted">
            Prefer email?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-brand-blue font-semibold hover:underline underline-offset-2"
            >
              {SITE.email}
            </a>
          </p>
        </div>

        <div className="max-w-lg w-full">
          {/* Screen readers hear every state change */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {isLoading && "Sending feedback."}
            {status === "success" && "Feedback sent. Thank you for helping shape DNA."}
            {status === "error" && errorMessage}
          </div>

          {status === "success" ? (
            // Success state
            <div className="flex flex-col items-start gap-3 py-8">
              <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center text-success text-2xl">
                ✓
              </div>
              <h3 ref={successRef} tabIndex={-1} className="text-2xl font-bold text-text-dark outline-none">
                Feedback sent
              </h3>
              <p className="text-text-muted leading-relaxed">
                Thank you for helping shape DNA. We read every message.
              </p>
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

              {/* Category chips (44px tall for easy tapping) */}
              <div
                role="radiogroup"
                aria-label="Feedback category"
                onKeyDown={handleCategoryKeyDown}
                className="flex flex-wrap gap-2"
              >
                {CATEGORIES.map((category) => {
                  const selected = form.category === category.value;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      tabIndex={selected ? 0 : -1}
                      disabled={isLoading}
                      onClick={() => updateField("category", category.value)}
                      className={`min-h-11 px-4 rounded-full text-sm font-semibold border transition-colors disabled:opacity-50 ${
                        selected
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "text-text-muted border-gray-200 hover:border-brand-blue hover:text-brand-blue"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>

              {/* Name + email (both optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fb-name" className="text-sm font-medium text-text-dark">
                    Name <span className="font-normal text-text-muted">(optional)</span>
                  </label>
                  <input
                    id="fb-name" name="name" type="text" autoComplete="name"
                    value={form.name} onChange={handleChange} disabled={isLoading}
                    placeholder="Your name" className={`${fieldClass} ${fieldBorder(false)}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fb-email" className="text-sm font-medium text-text-dark">
                    Email <span className="font-normal text-text-muted">(optional)</span>
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

              {/* Bug reports only: helps us reproduce the problem */}
              {form.category === "bug" && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fb-device" className="text-sm font-medium text-text-dark">
                    Phone and Android version <span className="font-normal text-text-muted">(optional)</span>
                  </label>
                  <input
                    id="fb-device" name="device" type="text"
                    value={form.device} onChange={handleChange} disabled={isLoading}
                    placeholder="e.g. Samsung A14, Android 13"
                    className={`${fieldClass} ${fieldBorder(false)}`}
                  />
                </div>
              )}

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

              {/* Submit stays enabled; problems are explained inline instead */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue text-white font-semibold py-3.5 rounded-full hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send feedback"
                )}
              </button>

              {/* Why we ask for email + privacy link */}
              <p className="text-xs text-text-muted leading-relaxed">
                Add your email if you would like a reply. We use it only to respond to you.
                See our{" "}
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