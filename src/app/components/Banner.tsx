'use client'

import Image from 'next/image'

import { useLanguage } from './context/LanguageProvider'

export function BannerWithAutoFallback() {
  const { language } = useLanguage()

  return (
    <div id="series-banner" className="z-20 bg-white dark:bg-white">
      {/* Desktop banner */}
      <div className="hidden md:relative w-full md:mt-24 h-[12vh] md:flex items-center justify-center">
        {/* Light mode image */}
        <Image
          src="/shifting-ground.png"
          alt="Shifting Ground"
          fill
          sizes="40vw"
          className="object-contain"
          priority
        />
        {/* Dark mode image */}
        <Image
          src="/shifting-ground-w.png"
          alt="Shifting Ground (Dark)"
          fill
          sizes="40vw"
          className="object-contain hidden"
          priority
        />
      </div>

      {/* Mobile banner */}
      <div className="md:hidden relative w-full h-auto flex flex-col items-center justify-center">
        {/* Light mode: Shifting */}
        <div className="w-full h-[12vh] relative mr-5  mt-20">
          <Image
            src="/shifting.png"
            alt="Shifting"
            fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>
        {/* Dark mode: Shifting-white */}
        <div className="w-full h-[12vh] relative mr-5 hidden">
          <Image
            src="/shifting-white.png"
            alt="Shifting (Dark)"
            fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Light mode: Ground */}
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
        {/* Dark mode: Ground-white */}
        <div className="w-full h-[12vh] relative -mt-[4vh] hidden">
          <Image
            src="/ground-white.png"
            alt="Ground (Dark)"
            fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

   <div className="pb-4 md:px-8 flex justify-center -mt-1">
  <h3 className="
    text-center 
    font-light 
    font-roboto 
    tracking-wide 
    text-[18px] 
    md:text-[17px]
    leading-tighter 
    text-black dark:text-black 
   
  ">
    {language === 'en' ? (
      <>
        Slow photography {' '}
        <br className="block md:hidden" />
        in an accelerating world
      </>
    ) : (
      <>
        Photographie lente {' '}
        <br className="block md:hidden" />
        dans un monde qui s’accélère
      </>
    )}
  </h3>
</div>

    </div>
  )
}
