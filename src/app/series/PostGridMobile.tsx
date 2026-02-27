'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { BannerWithAutoFallback } from '~/app/components/Banner'
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
  const [showScrollHint, setShowScrollHint] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const hasRestoredScroll = useRef(false)

 
useEffect(() => {
  const handleScroll = () => {
    setShowScrollHint(false)
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [])
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
      className="md:hidden w-full flex flex-col items-center overflow-y-auto scrollbar-hide"
      style={{ maxHeight: '100vh', WebkitOverflowScrolling: 'touch' }}
    >
      <BannerWithAutoFallback />

      <div className="w-full flex flex-col items-center gap-6 py-6 px-4">
        {posts.map((post, i) => {
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <Link
              key={`${post._id}-${i}`}
              href={`/series/${post.slug.current}`}
              className="w-full group active:scale-[0.98] transition-transform duration-150"
              onClick={handleLinkClick}
            >
              <div className="relative overflow-hidden ">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: post.mainImage?.aspectRatio || '3/2',
                  }}
                >
                  {post.mainImage ? (
                    <Image
                      src={
                        urlForThumbnail(post.mainImage, 500) ||
                        '/placeholder.svg'
                      }
                      alt={title}
                      fill
                      className="object-cover transition-all duration-300 group-active:brightness-95"
                      sizes="90vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100" />
                  )}
                </div>

                <div className=" py-1 flex justify-between font-light ">
                  <h3 className="text-[17px]    text-gray-500">{title}</h3>
                  <div className="flex items-center gap-1.5 pl-3 -mb-[1px] text-gray-500 text-[15px]">
                    <span>
                      {activeLang === 'en' ? 'View Series' : 'Voir la série'}
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-active:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      {/* Bottom gradient + Explore CTA */}
      <div
        className={`md:hidden fixed -bottom-1 left-0 w-full pointer-events-none transition-opacity duration-500 ${
          showScrollHint ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Gradient */}
        <div
          className="w-full h-36"
          style={{
            background:
              'linear-gradient(to top, rgba(255,255,255,1) 0%,  rgba(255,255,255,0) 100%)',
          }}
        />

        {/* CTA */}
        <div className="absolute bottom-2 left-0 w-full flex flex-col items-center">
          <span className="text-lg tracking-[0.15em] uppercase text-black">
            {activeLang === 'en' ? 'Explore' : 'Explorez'}
          </span>

          <svg
            className="w-5 h-5 text-black "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
