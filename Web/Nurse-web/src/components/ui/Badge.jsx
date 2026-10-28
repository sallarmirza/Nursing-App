export default function Badge({ children }) {
  return (
    <span className="inline-block px-4 py-1.5 rounded-full border border-brand-blue/30 text-brand-blue text-xs font-bold tracking-wider uppercase mb-4">
      {children}
    </span>
  );
}