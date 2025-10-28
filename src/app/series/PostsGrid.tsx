'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForThumbnail, getBlurDataURL } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    // Calculate which images are in viewport for lazy loading
    const containerLeft = scrollLeft
    const containerRight = scrollLeft + clientWidth
    const itemWidth = clientWidth * 0.3 // Approximate item width

    const start = Math.max(0, Math.floor(containerLeft / itemWidth) - 2)
    const end = Math.min(posts.length * 2, Math.ceil(containerRight / itemWidth) + 2)
    
    setVisibleRange({ start, end })
  }, [posts.length])

  useEffect(() => {
    if (!mounted) return
    
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [mounted, updateScrollButtons])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.3
    const newScrollLeft =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  if (!mounted) {
    return null
  }

  const repeatedPosts = [...posts, ...posts]

  return (
    <section className="relative w-full mt-[8vh] md:mt-[2vh]">
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute -left-2 top-[85%] z-10 bg-white hover:bg-black/10 rounded-full p-3 transition-all duration-300 
    ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-black" />
      </button>

      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute -right-2 top-[85%] z-10 bg-white hover:bg-black/10 rounded-full p-3 transition-all duration-300 
    ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-black" />
      </button>

      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth snap-x scrollbar-hide"
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

          // Only render images in or near viewport
          const shouldLoad = i >= visibleRange.start && i <= visibleRange.end

          return (
            <Link
              key={`${post._id}-${i}`}
              href={`/series/${post.slug.current}`}
              className="relative flex-shrink-0 snap-center group"
              style={{
                width: `${widthVh}vh`,
              }}
            >
              <div
                className="relative overflow-hidden rounded-sm w-full"
                style={{
                  height: `${height}vh`,
                  aspectRatio: aspect.toString(),
                }}
              >
                {shouldLoad && post.mainImage ? (
                  <Image
                    src={urlForThumbnail(post.mainImage, 800)}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 40vh"
                    loading={i < 3 ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(post.mainImage)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
              </div>

              <div className="w-full px-4">
                <h3 className="text-black font-light text-xl text-center transition-all duration-300">
                  <span className="group-hover:hidden">{title}</span>
                  <span className="hidden group-hover:inline underline underline-offset-2 font-normal text-lg tracking-tight">
                    View series
                  </span>
                </h3>
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
    </section>
  )
}