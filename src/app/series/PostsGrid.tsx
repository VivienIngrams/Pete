'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

const FIXED_HEIGHT_VH = 60
const IMAGE_SPACING = 64

export default function PostsGridMobile({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState<{ height: number }>({ height: 0 })

  // Calculate height once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const height = (FIXED_HEIGHT_VH / 100) * window.innerHeight
      setDimensions({ height })
    }
  }, [])

  const infinitePosts = [...posts, ...posts]

  const handleClick = (slug: string) => {
    if (activeOverlay === slug) {
      router.push(`/series/${slug}`)
    } else {
      setActiveOverlay(slug)
    }
  }

  return (
    <div
      className="relative overflow-x-auto overflow-y-hidden bg-white mt-[45vh] hide-scrollbar"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
      }}
    >
      <div className="flex items-start w-max pb-4" style={{ gap: `${IMAGE_SPACING}px` }}>
        {infinitePosts.map((post, index) => {
          const isActive = activeOverlay === post.slug.current
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          const aspectRatio = post.mainImage.aspectRatio || 1.5
          const imgWidth = dimensions.height * aspectRatio

          const [isLoaded, setIsLoaded] = useState(false)

          return (
            <div
              key={`${post._id}-${index}`}
              className="flex-shrink-0 flex flex-col items-center group"
              style={{
                width: `${imgWidth}px`,
                height: `${dimensions.height}px`,
                scrollSnapAlign: 'start',
              }}
              onClick={() => handleClick(post.slug.current)}
            >
              <Link
                href={`/series/${post.slug.current}`}
                className="flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full">
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
                  )}
                  <Image
                    src={urlForImage(post.mainImage).url() as string}
                    alt={title}
                    fill
                    sizes="65vw"
                    onLoadingComplete={() => setIsLoaded(true)}
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>

                {isLoaded && (
                  <div className="w-full h-[50px] px-4 transition-opacity duration-300">
                    <h3 className="text-black font-light text-xl text-center">
                      <span className={`${isActive ? 'hidden' : 'inline'}`}>{title}</span>
                    </h3>
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
