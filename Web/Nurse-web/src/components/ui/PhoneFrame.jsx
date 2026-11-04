// Simple phone outline used in Hero and Features.
// Pass `src` with an app screenshot; without it a neutral placeholder shows,
// so the layout is correct before real screenshots exist.
export default function PhoneFrame({ src, alt = "", priority = false, className = "" }) {
  return (
    <div
      className={`relative mx-auto w-56 sm:w-64 aspect-[9/19] rounded-[2.5rem] border-[10px] border-brand-navy bg-white shadow-xl overflow-hidden ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          className="w-full h-full object-cover object-top"
        />
      ) : (
        // Placeholder until a real screenshot is supplied
        <div className="w-full h-full flex items-center justify-center bg-brand-light text-text-muted text-sm text-center px-6">
          App screenshot
        </div>
      )}
    </div>
  );
}