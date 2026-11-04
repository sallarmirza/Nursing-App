// Shared button. Renders a real <a> when `href` is passed (no more
// <button> nested inside <a>), otherwise a <button>.
// Variants: primary | secondary | outline | light | ghostLight
// "light" / "ghostLight" are for use on the dark navy sections.
export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors px-6 py-3 text-sm";

  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-hover",
    secondary: "bg-white text-text-dark border border-gray-200 hover:bg-gray-50",
    outline: "bg-transparent text-brand-blue border border-brand-blue hover:bg-brand-light",
    light: "bg-white text-brand-navy hover:bg-brand-light",
    ghostLight: "bg-transparent text-white border border-white/30 hover:bg-white/10",
  };

  const classes = `${baseStyle} ${variants[variant]} ${className}`;

  // Link mode: used for anchors, downloads and routes
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}