'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { useScrollPosition } from '~/app/components/context/ScrollPositionProvider'
import { urlForThumbnail } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGridMobile({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const { saveScrollPosition, getScrollPosition } = useScrollPosition()
  const lang = language || activeLang || 'en'

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const hasRestoredScroll = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Restore scroll position when component mounts
  useEffect(() => {
    if (!mounted || !scrollContainerRef.current || hasRestoredScroll.current)
      return

    const savedPosition = getScrollPosition('series-mobile-scroll')
    if (savedPosition && typeof savedPosition === 'number') {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedPosition
        }
      }, 100)
    }

    hasRestoredScroll.current = true
  }, [mounted, getScrollPosition])

  // ✅ Save scroll position before navigating away
  const handleLinkClick = () => {
    if (scrollContainerRef.current) {
      saveScrollPosition(
        'series-mobile-scroll',
        scrollContainerRef.current.scrollTop,
      )
    }
  }

  if (!mounted) return null

  return (
    <section
      ref={scrollContainerRef}
      className="md:hidden w-full flex flex-col items-center gap-6 py-6 overflow-y-auto scrollbar-hide"
      style={{ maxHeight: '100vh', WebkitOverflowScrolling: 'touch' }}
    >
      {posts.map((post, i) => {
        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        return (
          <Link
            key={`${post._id}-${i}`}
            href={`/series/${post.slug.current}`}
            className="w-full group"
            onClick={handleLinkClick}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: post.mainImage?.aspectRatio || '3/2',
              }}
            >
              {post.mainImage ? (
                <Image
                  src={urlForThumbnail(post.mainImage, 1200)}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="90vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100" />
              )}
            </div>

            {/* Fading Text */}
            <div className="relative text-center mt-1 mb-2 h-6 transition-all duration-300 group-hover:scale-110 group-hover:font-medium ">
              <span
                className="absolute inset-0 transition-opacity duration-1000 group-hover:underline"
                style={{
                  animation:
                    'fadeTitle 5s cubic-bezier(0.45, 0, 0.55, 1) infinite',
                }}
              >
                {title}
              </span>
              <span
                className="absolute inset-0 text-gray-600 transition-opacity duration-1000 group-hover:underline"
                style={{
                  animation:
                    'fadeView 5s cubic-bezier(0.45, 0, 0.55, 1) infinite',
                }}
              >
                {activeLang === 'en' ? 'View Series' : 'Voir la série'}
              </span>

              <style global>{`
      @keyframes fadeTitle {
        0%, 20% { opacity: 1; }
        35%, 70% { opacity: 0; }
        85%, 100% { opacity: 1; }
      }
      @keyframes fadeView {
        0%, 20% { opacity: 0; }
        35%, 70% { opacity: 1; }
        85%, 100% { opacity: 0; }
      }
    `}</style>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
