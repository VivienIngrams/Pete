'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

export default function CommissionsGrid({ posts, language }: Props) {
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
    <div className="p-8 md:p-0 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 overflow-hidden">
      {posts.map((post) => {
        const isActive = activeOverlay === post.slug.current
        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        return (
          <div
            key={post._id}
            className="relative aspect-[3/4] group overflow-hidden m-[-0.5px] cursor-pointer"
            onClick={() => handleClick(post.slug.current)}
          >
            {/* Background Image */}
            {post.mainImage ? (
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-300 scale-[1.01] md:group-hover:opacity-100"
              />
            ) : (
              <div className="absolute inset-0 bg-black" />
            )}

            <Link
              href={`/commissions/${post.slug.current}`}
              className="absolute inset-0 z-10 flex items-center justify-center text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">{title}</span>

              <div className="relative font-light text-lg md:text-3xl text-white transition-transform duration-200 md:hover:scale-105 p-4 md:p-6 leading-tight">
                {/* Text wrapper */}
                <span className="relative inline-block text-center">
                  {/* Subtle blur background */}
                  <span
                    className="absolute inset-[-0.3em] blur-text-background z-0"
                    aria-hidden="true"
                  />

                  {/* Main title words */}
                  <span
                    className={`relative z-10 block transition-opacity duration-200 ${
                      isActive
                        ? 'opacity-0'
                        : 'opacity-100 md:group-hover:opacity-0'
                    }`}
                  >
                    {title.split(' ').map((word, i) => (
                      <span
                        key={i}
                        className="block leading-[0.95] uppercase tracking-wide"
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </span>

                {/* Hover / active text */}
                <span
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-200 font-light text-base md:text-xl ${
                    isActive
                      ? 'opacity-100'
                      : 'opacity-0 md:group-hover:opacity-100'
                  }`}
                >
                  View series
                </span>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
