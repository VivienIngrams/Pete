'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { urlForImage } from '~/sanity/lib/sanity.image'

type SplashPageProps = {
  mainImage: any
}

export default function SplashPage({ mainImage }: SplashPageProps) {
  const [bgVisible, setBgVisible] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fade in background
    const bgFadeIn = setTimeout(() => setBgVisible(true), 100)
    // Fade in title slightly after background
    const titleFadeIn = setTimeout(() => setTitleVisible(true), 300)

    // Fade out both after short pause
    const fadeOut = setTimeout(() => {
      setTitleVisible(false)
      setBgVisible(false)
    }, 3800)

    // Navigate after fade-out completes
    const navigate = setTimeout(() => router.push('/series'), 4800)

    return () => {
      clearTimeout(bgFadeIn)
      clearTimeout(titleFadeIn)
      clearTimeout(fadeOut)
      clearTimeout(navigate)
    }
  }, [router])

  const handleClick = () => {
    router.push('/series')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1500ms] ${
          bgVisible ? 'opacity-100' : 'opacity-20'
        }`}
      >
        <Image
          src={urlForImage(mainImage).url() || ''}
          alt="Splash Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

       {/* White semi-transparent overlay */}
       {/* <div className="absolute inset-0 bg-[#f6f5ee]/15" /> */}


      {/* Title */}
      <h1
        className={`absolute text-black tracking-tight  text-2xl xl:text-7xl top-[10vh] md:top-[5vh]   transition-opacity duration-[1500ms] ${
          titleVisible ? 'opacity-100' : 'opacity-0'
        }`}
              >
        Peter Lippmann
      </h1>
    </div>
  )
}
