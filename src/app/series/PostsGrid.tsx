'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { useScrollPosition } from '~/app/components/context/ScrollPositionProvider'
import { urlForThumbnail } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const { saveScrollPosition, getScrollPosition } = useScrollPosition()
  const lang = language || activeLang || 'en'

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [mounted, setMounted] = useState(false)
  const hasRestoredScroll = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  // Restore scroll position on mount
  // In PostsGrid.tsx, update the restoration useEffect:
  useEffect(() => {
    if (!mounted || !scrollContainerRef.current || hasRestoredScroll.current)
      return

    const savedPosition = getScrollPosition('series-grid')
    if (savedPosition && typeof savedPosition === 'number') {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = savedPosition
          updateScrollButtons()
        }
      }, 100)
    }
    hasRestoredScroll.current = true
  }, [mounted, getScrollPosition, updateScrollButtons])

  useEffect(() => {
    if (!mounted) return

    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [mounted, updateScrollButtons])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.3

    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Save scroll position before navigating
  const handleLinkClick = () => {
    if (scrollContainerRef.current) {
      saveScrollPosition('series-grid', scrollContainerRef.current.scrollLeft)
    }
  }

  if (!mounted) {
    return null
  }

  const repeatedPosts = [...posts, ...posts]

  return (
    <section className="relative w-full scrollbar-hide">
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth snap-x scrollbar-hide md:pl-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {repeatedPosts.map((post, i) => {
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''
          const aspect = post.mainImage?.aspectRatio || 1.5

          const height =
            typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 40
          const widthVh = aspect * height

          return (
            <Link
              key={`${post._id}-${i}`}
              href={`/series/${post.slug.current}`}
              onClick={handleLinkClick}
              className="relative flex-shrink-0 snap-center group cursor-pointer transform transition-transform duration-300"
              style={{ width: `${widthVh}vh` }}
            >
              <div
                className="relative overflow-hidden w-full mt-4"
                style={{
                  height: `${height}vh`,
                  aspectRatio: aspect.toString(),
                }}
              >
                {/* Image */}
                <Image
                  src={urlForThumbnail(post.mainImage, 600)}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
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

                <style global={true}>{`
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
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="w-full flex justify-between  ">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`z-10 -ml-4 !bg-white dark:!bg-white hover:!bg-white/10 dark:hover:!bg-white/10 hover:rounded-full  p-3 transition-all duration-300 
    ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 !text-gray-600 dark:!text-gray-600" />
        </button>

        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={` z-10 -mr-4 !bg-white dark:!bg-white hover:!bg-white/10 dark:hover:!bg-white/10 hover:rounded-full p-3 transition-all duration-300 
    ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 md:w-10 md:h-10 !text-gray-600 dark:!gray-600" />
        </button>
      </div>
    </section>
  )
}
