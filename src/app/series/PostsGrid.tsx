'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
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

  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  gsap.registerPlugin(ScrollTrigger)

  // Duplicate posts for infinite scroll on desktop
  const infinitePosts = [...posts, ...posts, ...posts]

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return
    if (window.innerWidth < 768) return // Skip GSAP for mobile

    const container = containerRef.current
    const wrapper = wrapperRef.current

    // Width of one set of posts
    const singleSetWidth = container.scrollWidth / 3

    const ctx = gsap.context(() => {
      gsap.to(container, {
        x: () => -singleSetWidth * 10,
        ease: 'none',
        modifiers: {
          x: (x) => {
            const xNum = parseFloat(x)
            // Wrap position for seamless infinite scroll
            const wrapped = xNum % singleSetWidth
            return `${wrapped}px`
          }
        },
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${singleSetWidth * 10}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrapper)

    return () => {
      ctx.revert()
    }
  }, [posts])

  // Check screen width for mobile rendering
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden bg-white`}
      style={{
        marginTop: '280px', // adjust for banners if needed
        height: '60vh'
      }}
    >
      <div
        ref={containerRef}
        className={`flex h-full items-center ${
          isMobile
            ? 'overflow-x-auto snap-x snap-mandatory touch-pan-x'
            : 'gap-[1px]'
        }`}
      >
        {(isMobile ? posts : infinitePosts).map((post, index) => {
          const isActive = activeOverlay === post.slug.current
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <div
              key={`${post._id}-${index}`}
              className={`relative flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[25vw] lg:w-[20vw] xl:w-[15vw] aspect-square group overflow-hidden cursor-pointer m-[-0.5px] ${
                isMobile ? 'snap-start' : ''
              }`}
              onClick={() => handleClick(post.slug.current)}
            >
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={title}
                fill
                sizes="25vw"
                className="object-contain transition-all duration-300 scale-[1.01]"
              />

              <Link
                href={`/series/${post.slug.current}`}
                className="absolute inset-0 z-10 flex items-center justify-center text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">{title}</span>

                <div className="relative font-light text-lg md:text-3xl text-white transition-transform duration-200 md:hover:scale-105 p-4 md:p-6 leading-tight">
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
