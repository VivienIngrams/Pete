'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForImage } from '~/sanity/lib/sanity.image'
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

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [mounted])

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
  // Duplicate posts for looping feel
  const repeatedPosts = [...posts, ...posts]

  return (
    <section className="relative w-full mt-[8vh] md:mt-[2vh]">
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute -left-2    top-[85%]     z-10 bg-white hover:bg-black/10  rounded-full p-3 transition-all duration-300 
    ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-black" />
      </button>

      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute -right-2 top-[85%] z-10 bg-white hover:bg-black/10  rounded-full p-3 transition-all duration-300 
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

          return (
            <Link
              key={`${post._id}-${i}`} // ✅ ensures unique key across duplicates
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
                <Image
                  src={
                    (post.mainImage
                      ? urlForImage(post.mainImage).url()
                      : '/placeholder.svg') as string
                  }
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="80vw"
                  priority={false}
                />
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
