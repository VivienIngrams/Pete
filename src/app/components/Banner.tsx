'use client'

import Image from 'next/image'

export function BannerWithAutoFallback() {
  return (
    <div
      id="series-banner"
      className="  z-20 bg-white"
    >
      {/* Desktop banner */}
      <div className="hidden md:relative w-full mt-4 h-[12vh] md:flex items-center justify-center">
        <Image
          src="/shifting-ground.png"
          alt="Shifting Ground"
          fill
          sizes="40vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Mobile banner */}
      <div className="md:hidden relative w-full h-auto flex flex-col items-center justify-center">
        <div className="w-full h-[12vh] relative mr-5">
          <Image
            src="/shifting.png"
            alt="Shifting"
            fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full h-[12vh] relative -mt-[4vh]">
          <Image
            src="/ground.png"
            alt="Ground"
            fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="pb-4 md:px-8 flex justify-center -mt-1 font-light font-roboto tracking-wide text-lg md:text-xl 3xl:text-2xl text-black">
        <h3>Slow photography for an accelerating world</h3>
      </div>
    </div>
  )
}
