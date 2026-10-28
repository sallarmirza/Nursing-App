import Badge from './Badge';

export default function SectionHeader({ badge, title, subtitle, align = "center" }) {
  return (
    <div className={`flex flex-col mb-12 ${align === "center" ? "items-center text-center" : "items-start text-left"}`}>
      <Badge>{badge}</Badge>
      <h2 className="text-3xl md:text-4xl text-text-dark mb-4">{title}</h2>
      {subtitle && (
        <p className="text-text-muted max-w-2xl text-base md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}