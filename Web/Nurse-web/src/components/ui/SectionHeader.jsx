// Section heading block.
// Left-aligned by default (faster to scan on phones); pass align="center" to centre.
// Optional badge shows a small pill above the heading.
export default function SectionHeader({ title, subtitle, badge, align = "left" }) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col mb-12 max-w-2xl ${alignment}`}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full border border-brand-blue/30 text-brand-blue text-xs font-bold tracking-wider uppercase mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl text-text-dark mb-4">{title}</h2>
      {subtitle && (
        <p className="text-text-muted text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}