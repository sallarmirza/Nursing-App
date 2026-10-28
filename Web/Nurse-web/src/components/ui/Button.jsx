export default function Button({ children, variant = "primary", className = "", ...props }) {
  const baseStyle = "inline-flex items-center justify-center rounded-full font-semibold transition-colors px-6 py-3 text-sm";
  
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-hover",
    secondary: "bg-white text-text-dark border border-gray-200 hover:bg-gray-50",
    outline: "bg-transparent text-brand-blue border border-brand-blue hover:bg-brand-light",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}