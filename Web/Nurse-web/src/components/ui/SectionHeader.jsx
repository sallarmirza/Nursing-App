// Section heading block.
// Left-aligned by default; pass align="center" to centre.
// Pass inverted for use on brand-blue section backgrounds.
export default function SectionHeader({ title, subtitle, badge, align = "left", inverted = false }) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const titleColor = inverted ? "text-white" : "text-text-dark";
  const subtitleColor = inverted ? "text-white/80" : "text-text-muted";
  const badgeStyle = inverted
    ? "border-white/30 text-white/85"
    : "border-brand-blue/30 text-brand-blue";

  return (
    <div className={`flex flex-col mb-12 max-w-2xl ${alignment}`}>
      {badge && (
        <span className={`inline-block px-4 py-1.5 rounded-full border ${badgeStyle} text-xs font-bold tracking-wider uppercase mb-4`}>
          {badge}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl ${titleColor} mb-4`}>{title}</h2>
      {subtitle && (
        <p className={`${subtitleColor} text-base md:text-lg leading-relaxed`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}