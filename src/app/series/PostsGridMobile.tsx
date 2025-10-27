'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

// Component for individual post with aspect ratio calculation
function PostItemMobile({ post, title, lang, isActive, onClick }: { 
  post: Post; 
  title: string; 
  lang: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  const [imageWidth, setImageWidth] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})
  const FIXED_HEIGHT = 45

  useEffect(() => {
    const loadImage = () => {
      const img = document.createElement('img')
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight
        const calculatedWidth = (FIXED_HEIGHT * window.innerHeight / 100) * aspectRatio
        setImageWidth(calculatedWidth)
        setImageLoaded(true)
      }
      img.src = urlForImage(post.mainImage).url() as string
    }

    loadImage()
  }, [post.mainImage])


  return (
    <div
      className="flex-shrink-0 flex flex-col items-center group"
      style={{ width: imageWidth ? `${imageWidth}px` : 'auto' }}
      onClick={onClick}
    >
      <Link href={`/series/${post.slug.current}`} className="flex flex-col items-center min-h-[150px]"  onClick={(e) => e.stopPropagation()}>
        <div className="relative overflow-hidden" style={{ height: `${FIXED_HEIGHT}vh` }}>
          {imageLoaded && imageWidth ? (
            <Image
              src={urlForImage(post.mainImage).url() as string}
              alt={title}
              width={imageWidth}
              height={FIXED_HEIGHT * window.innerHeight / 100}
              sizes="85vw, "
              className="object-fill transition-transform duration-300 group-hover:scale-105"
              onLoad={() =>
                setLoadedMap((prev) => ({ ...prev}))
              }
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>

        <div
                className={`w-full px-4 mt-2 transition-opacity duration-500 ${
                  loadedMap ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <h3 className="text-black font-light text-xl text-center">
                  <span className="group-hover:hidden">{title}</span>
                  <span className="hidden group-hover:inline underline underline-offset-2 font-normal text-lg tracking-tight">
                    View series
                  </span>
                </h3>
              </div>
      </Link>
    </div>
  )
}

export default function PostsGridMobile({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  // Duplicate posts for smoother horizontal scroll
  const doublePosts = [...posts, ...posts]

  const handleClick = (slug: string) => {
    if (activeOverlay === slug) {
      router.push(`/series/${slug}`)
    } else {
      setActiveOverlay(slug)
    }
  }

  return (
    <div
      className="relative overflow-x-auto overflow-y-hidden bg-white mt-[45vh] md:mt-[40vh] hide-scrollbar"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
      }}
    >
      <div className="flex gap-4 md:gap-12 h-[80%] items-start w-max pb-4">
        {doublePosts.map((post, index) => {
          const isActive = activeOverlay === post.slug.current
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <PostItemMobile
              key={`${post._id}-${index}`}
              post={post}
              title={title}
              lang={lang}
              isActive={isActive}
              onClick={() => handleClick(post.slug.current)}
            />
          )
        })}
      </div>
    </div>
  )
}
