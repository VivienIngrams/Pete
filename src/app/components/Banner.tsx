'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'


export function BannerWithAutoFallback() {
  const [isDarkBackground, setIsDarkBackground] = useState(false)

  useEffect(() => {
    // 1️⃣ Prefer explicit media query (accurate)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateMode = () => setIsDarkBackground(mediaQuery.matches)
    updateMode()
    mediaQuery.addEventListener('change', updateMode)
  
    // 2️⃣ (Optional) fallback to checking actual color
    if (!mediaQuery.matches) {
      const bg = window.getComputedStyle(document.body).backgroundColor
      const match = bg.match(/\d+/g)
      if (match) {
        const [r, g, b] = match.map(Number)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        if (brightness < 128) setIsDarkBackground(true)
      }
    }
  
    return () => mediaQuery.removeEventListener('change', updateMode)
  }, [])
  

  return (
    <div
      id="series-banner"
      className={`fixed top-[12vh] md:top-[9vw] left-0 right-0 z-20 ${
        isDarkBackground ? 'bg-black' : 'bg-white'
      }`}
    >
      {/* Desktop banner */}
      <div className="hidden relative w-full h-[13vh] md:flex items-center justify-center">
        <Image
          src={isDarkBackground ? '/shifting-ground-white.png' : '/shifting-ground.png'}
          alt="Shifting Ground"
          fill
          sizes="50vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Mobile banner */}
      <div className="md:hidden relative w-full h-auto flex flex-col items-center justify-center">
        <div className="w-full h-[12vh] relative mr-5">
          <Image
            src={isDarkBackground ? '/shifting-white.png' : '/shifting.png'}
            alt="Shifting"
            fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full h-[12vh] relative -mt-[4vh]">
          <Image
            src={isDarkBackground ? '/ground-white.png' : '/ground.png'}
            alt="Ground"
            fill
            sizes="70vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div
        className={`pb-4 md:px-8 flex justify-center -mt-1 font-light font-roboto tracking-wide text-lg ${
          isDarkBackground ? 'text-white' : 'text-black'
        }`}
      >
        <h3>Fine art photos for an upcoming book</h3>
      </div>
    </div>
  )
}
