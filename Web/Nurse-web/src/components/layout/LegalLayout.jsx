import { Link } from "react-router-dom";

// Shared shell for Privacy and Terms.
// Single readable column (about 70 characters per line); the stock photo is gone.
export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-bg-soft border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <Link to="/" className="inline-flex items-center text-brand-blue font-semibold text-sm hover:underline mb-6">
            ← Back to DNA
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">{title}</h1>
          <p className="text-text-muted text-sm md:text-base">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="text-text-dark text-base leading-relaxed space-y-8">{children}</div>
      </div>
    </div>
  );
}