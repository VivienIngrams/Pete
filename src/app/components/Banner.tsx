'use client'

import Image from 'next/image'
import { useLanguage } from './context/LanguageProvider'

export function BannerWithAutoFallback() {
  const { language } = useLanguage()

  const captions = {
    en: 'Slow photography for an accelerating world',
    fr: 'Photographie lente pour un monde qui s’accélère',
  }

  return (
    <div id="series-banner" className="z-20 bg-white dark:bg-black">
      {/* Desktop banner */}
      <div className="hidden md:relative w-full mt-8 md:mt-16 h-[12vh] md:flex items-center justify-center">
        {/* Light mode image */}
        <Image
          src="/shifting-ground.png"
          alt="Shifting Ground"
          fill
          sizes="40vw"
          className="object-contain dark:hidden"
          priority
        />
        {/* Dark mode image */}
        <Image
          src="/shifting-ground-w.png"
          alt="Shifting Ground (Dark)"
          fill
          sizes="40vw"
          className="object-contain hidden dark:block"
          priority
        />
      </div>

      {/* Mobile banner */}
      <div className="md:hidden relative w-full h-auto flex flex-col items-center justify-center">
        {/* Light mode: Shifting */}
        <div className="w-full h-[12vh] relative mr-5 dark:hidden">
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
        <div className="w-full h-[12vh] relative mr-5 hidden dark:block">
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
        <div className="w-full h-[12vh] relative -mt-[4vh] dark:hidden">
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
        <div className="w-full h-[12vh] relative -mt-[4vh] hidden dark:block">
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

      {/* Caption */}
      <div className="pb-4 md:px-8 flex justify-center -mt-1 font-light font-roboto tracking-wide text-lg md:text-xl 3xl:text-2xl text-black dark:text-white">
        <h3>{captions[language]}</h3>
      </div>
    </div>
  )
}
