'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { urlForImage } from '~/sanity/lib/sanity.image'

type SplashPageProps = {
  mainImage: any
}

export default function SplashPage({ mainImage }: SplashPageProps) {
  const router = useRouter()

  useEffect(() => {
    // Automatically navigate after 3 seconds if user doesn't click
    const timer = setTimeout(() => {
      router.push('/series')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const handleClick = () => {
    router.push('/series')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-black"
      onClick={handleClick}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={urlForImage(mainImage).url() || ''}
          alt="Splash Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Title */}
      <h1 className="absolute text-black text-4xl xl:text-7xl top-[15vh] md:top-[9vh] tracking-widest">
        Peter Lippmann
      </h1>
    </div>
  )
}
