'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'
import { useLanguage } from '~/app/components/context/LanguageProvider'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGridMobile({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  // Duplicate posts array for smoother horizontal scroll
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
      className="relative overflow-x-auto overflow-y-hidden bg-white md:hidden mt-[45vh]"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
      }}
    >
      <div className="flex gap-[1px] h-[70%] items-center w-max pb-4">
        {doublePosts.map((post, index) => {
          const isActive = activeOverlay === post.slug.current
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <div
              key={`${post._id}-${index}`}
              className="relative flex-shrink-0 w-[65vw] sm:w-[50vw] md:w-[25vw] lg:w-[17vw] mr-4 aspect-square group overflow-hidden cursor-pointer m-[-0.5px]"
              onClick={() => handleClick(post.slug.current)}
            >
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={title}
                fill
                sizes="65vw"
                className="object-contain transition-all duration-300 scale-[1.01]"
              />

              <Link
                href={`/series/${post.slug.current}`}
                className="absolute inset-0 z-10 flex items-center justify-center text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">{title}</span>

                <div className="relative font-light text-2xl md:text-3xl text-white  transition-transform duration-200 md:hover:scale-105 p-4 md:p-6 leading-tight">
                  <span className="relative inline-block text-center">
                    <span
                      className="absolute inset-[-0.3em] blur-text-background"
                      aria-hidden="true"
                    />

                    <span
                      className={`relative block transition-opacity duration-200 ${
                        isActive
                          ? 'opacity-0'
                          : 'opacity-100 md:group-hover:opacity-0'
                      }`}
                    >
                      {title.split(' ').map((word, i) => (
                        <span key={i} className="block leading-[0.95]">
                          {word}
                        </span>
                      ))}
                    </span>
                  </span>

                  <span
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 font-light text-base md:text-xl ${
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
    </div>
  )
}
