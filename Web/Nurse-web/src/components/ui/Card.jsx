export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}