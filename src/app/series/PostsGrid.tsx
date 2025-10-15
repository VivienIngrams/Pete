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
      {posts.map((post) => {
        const isActive = activeOverlay === post.slug.current
        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        return (
          <div
            key={post._id}
            className="relative aspect-square group overflow-hidden m-[-0.5px] cursor-pointer"
            onClick={() => handleClick(post.slug.current)}
          >
            {/* Background Image */}
            <Image
              src={urlForImage(post.mainImage).url() as string}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-300 scale-[1.01] md:group-hover:opacity-100"
            />

            {/* Desktop link overlay */}
            <Link
              href={`/series/${post.slug.current}`}
              className="hidden md:block absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="sr-only">{title}</span>
            </Link>

            {/* Title Overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
              <Link
                href={`/series/${post.slug.current}`}
                className={`relative font-light text-lg md:text-3xl max-w-20 md:max-w-24   text-white  transition-transform duration-200 md:hover:scale-105
                    p-1 md:p-2 pointer-events-auto flex items-center justify-center`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Original title */}
                <span
                  className={`transition-opacity duration-200 backdrop-blur-[2px] ${
                    isActive ? 'opacity-0' : 'opacity-100 md:group-hover:opacity-0'
                  }`}
                >
                  {title}
                </span>
                {/* Hover / active text */}
                <span
                  className={`absolute transition-opacity duration-200 font-light backdrop-blur-[2px]  text-base md:text-xl underline underline-offset-2 ${
                    isActive ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'
                  }`}
                >
                  View series
                </span>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
