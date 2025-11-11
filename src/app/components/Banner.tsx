'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { useLanguage } from './context/LanguageProvider'

export function BannerWithAutoFallback() {
  const { language } = useLanguage()
  const [forceDark, setForceDark] = useState(false)

  useEffect(() => {
    const el = document.getElementById('bg-tester')
    const bgColor = window.getComputedStyle(el).backgroundColor
    setForceDark(bgColor !== 'rgb(255, 255, 255)')
  }, [])

  return (
    <div id="series-banner" className="z-20 !bg-white dark:!bg-white">
      {/* Test for forced dark bg */}
      <div id="bg-tester" style={{ background: 'white', display: 'none' }} />

      {/* Desktop banner */}
      <div className="hidden relative  w-full md:mt-28 h-[12vh] md:flex items-center justify-center">
        {/* Light mode image */}
        <Image
          src={forceDark ? '/shifting-ground-w.png' : '/shifting-ground.png'}
          alt="Shifting Ground"
         fill
          sizes="40vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Mobile banner */}
      <div className="md:hidden relative w-full h-auto flex flex-col items-center justify-center">
        {/* Light mode: Shifting */}
        <div className="w-full h-[10vh] relative mr-7  mt-16">
          <Image
            src={forceDark ? '/shifting-white.png' : '/shifting.png'}
            alt="Shifting"
           fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Light mode: Ground */}
        <div className="w-full h-[10vh] relative -mt-[3vh] ml-2">
          <Image
            src={forceDark ? 'ground-white.png' : '/ground.png'}
            alt="Ground"
           fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="pb-2 md:px-8 flex justify-center -mt-2 md:mt-0">
        <h3
          className="
    text-center 
    font-light 
    font-roboto 
    tracking-wide 
    text-[16px] 
    md:text-[18px]
    leading-tighter 
    !text-black dark:!text-black 
   
  "
        >
          {language === 'en' ? (
            <>
              Slow photography <br className="block md:hidden" />
              in an accelerating world
            </>
          ) : (
            <>
              Photographie lente <br className="block md:hidden" />
              dans un monde qui s’accélère
            </>
          )}
        </h3>
      </div>
    </div>
  )
}
