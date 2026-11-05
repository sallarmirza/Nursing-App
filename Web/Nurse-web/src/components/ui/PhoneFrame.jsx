// 


export default function PhoneFrame({
  src,
  alt = "",
  priority = false,
  className = "",
}) {
  return (
    <div className={`relative mx-auto w-56 sm:w-64 aspect-9/19 ${className}`}>
      {/* Outer matte black device body */}
      <div className="
        relative w-full h-full
        rounded-[2.7rem]
        bg-[#171717]
        p-1.25
        shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_8px_20px_-8px_rgba(0,0,0,0.2)]
        ring-1 ring-black/20
      ">

        {/* Subtle metallic edge */}
        <div className="
          relative w-full h-full
          rounded-[2.4rem]
          bg-[#292929]
          p-0.5
        ">

          {/* Inner display */}
          <div className="
            relative w-full h-full
            overflow-hidden
            rounded-[2.25rem]
            bg-black
          ">

            {/* Android punch-hole camera */}
            <div className="
              absolute top-2.25 left-1/2 -translate-x-1/2
              z-20
              w-2.75 h-2.75
              rounded-full
              bg-[#050505]
              ring-[1.5px] ring-[#383838]
              shadow-inner
            ">
              <div className="
                absolute inset-0.75
                rounded-full
                bg-[#111827]
              " />
            </div>

            {/* App screenshot */}
            {src ? (
              <img
                src={src}
                alt={alt}
                fetchPriority={priority ? "high" : undefined}
                loading={priority ? undefined : "lazy"}
                decoding="async"
                className="
                  w-full h-full
                  object-cover object-top
                "
              />
            ) : (
              <div className="
                w-full h-full
                flex items-center justify-center
                bg-[#f8fafc]
                text-gray-400 text-sm
              ">
                App screenshot
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Physical side buttons */}
      <div className="
        absolute -right-0.75 top-[22%]
        w-0.75 h-10
        rounded-r-md
        bg-[#393939]
        shadow-sm
      " />

      <div className="
        absolute -left-0.75 top-[17%]
        w-0.75 h-7
        rounded-l-md
        bg-[#393939]
      " />

      <div className="
        absolute -left-0.75 top-[27%]
        w-0.75 h-7
        rounded-l-md`
        bg-[#393939]
      " />
    </div>
  );
}
