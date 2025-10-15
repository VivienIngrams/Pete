'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { useLanguage } from '~/app/components/context/LanguageProvider'
import { useRouter } from 'next/navigation'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  const handleClick = (slug: string) => {
    if (window.innerWidth < 768) {
      if (activeOverlay === slug) {
        router.push(`/series/${slug}`)
      } else {
        setActiveOverlay(slug)
      }
    }
  }

  return (
    <div className="pt-4 md:pt-0 grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 overflow-hidden">
      {posts.map((post, index) => {
        const isActive = activeOverlay === post.slug.current
        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        const cols = 5 // adjust for your grid (e.g., 5 columns on xl)
        const isWhite = (Math.floor(index / cols) + (index % cols)) % 2 === 0
        const overlayColor = isWhite ? 'bg-white/30' : 'bg-black/70'
        const textColor = isWhite ? 'text-black' : 'text-white'
        const imageFilter = isWhite ? '' : 'invert brightness-110'

        return (
          <div
            key={post._id}
            className="relative aspect-square group overflow-hidden m-[-0.5px] cursor-pointer"
            onClick={() => handleClick(post.slug.current)}
          >
            <Image
              src={urlForImage(post.mainImage).url() as string}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-300 scale-[1.01]
    ${!isWhite ? 'invert brightness-110 group-hover:invert-0 md:group-hover:invert-0' : ''}
    ${isActive ? 'invert-0 opacity-100' : isWhite ? 'opacity-20' : 'opacity-20'}
    md:group-hover:opacity-100`}
            />

            {/* Desktop link */}
            <Link
              href={`/series/${post.slug.current}`}
              className="hidden md:block absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="sr-only">{title}</span>
            </Link>

            {/* Overlay */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 ease-in-out ${overlayColor}
          ${isActive ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'}
          md:group-hover:opacity-0 md:group-hover:scale-95 md:pointer-events-none`}
            >
              <Link
                href={`/series/${post.slug.current}`}
                className={`font-normal text-base md:text-lg underline underline-offset-2 transition-transform duration-200 md:hover:scale-105 mb-2 pointer-events-auto ${textColor}`}
                onClick={(e) => e.stopPropagation()}
              >
                {title}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
