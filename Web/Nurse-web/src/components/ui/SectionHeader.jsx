// Section heading block. The pill badge above every heading is gone;
// the heading and optional subtitle carry the section on their own.
// Left-aligned by default (faster to scan on phones); pass align="center" to centre.
export default function SectionHeader({ title, subtitle, align = "left" }) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col mb-12 max-w-2xl ${alignment}`}>
      <h2 className="text-3xl md:text-4xl text-text-dark mb-4">{title}</h2>
      {subtitle && (
        <p className="text-text-muted text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}