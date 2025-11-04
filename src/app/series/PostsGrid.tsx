'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForThumbnail } from '~/sanity/lib/sanity.image'
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

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
              className="relative flex-shrink-0 snap-center group"
              style={{
                width: `${widthVh}vh`,
              }}
            >
              <div
                className="relative overflow-hidden w-full  mt-4"
                style={{
                  height: `${height}vh`,
                  aspectRatio: aspect.toString(),
                }}
              >
                {post.mainImage ? (
                  <Image
                    src={urlForThumbnail(post.mainImage, 600)}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 30vw"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}
              </div>

              <div className="w-full px-4 md:mt-1">
                <h3 className="text-black dark:text-black  font-light text-xl text-center transition-all duration-300">
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
      <div className='w-full flex justify-between  '>
       <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`z-10 -ml-4 bg-white dark:bg-white hover:bg-white/10 dark:hover:bg-white/10 hover:rounded-full  p-3 transition-all duration-300 
    ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-black dark:text-black" />
      </button>

      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={` z-10 -mr-4 bg-white dark:bg-white hover:bg-white/10 dark:hover:bg-white/10 hover:rounded-full p-3 transition-all duration-300 
    ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-black dark:text-black" />
      </button>
</div>
    </section>
  )
}
