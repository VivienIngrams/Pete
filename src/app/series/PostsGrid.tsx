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

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return

    const container = containerRef.current
    const wrapper = wrapperRef.current

    const totalWidth = container.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      gsap.to(container, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${totalWidth}`,
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

  return (
    <div
      ref={wrapperRef}
      className="relative h-[150vh] overflow-hidden bg-white"
    >
      <div ref={containerRef} className="flex gap-[1px] h-full items-center">
        {posts.map((post) => {
          const isActive = activeOverlay === post.slug.current
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <div
              key={post._id}
              className="relative flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[25vw] lg:w-[20vw] xl:w-[15vw] aspect-square group overflow-hidden cursor-pointer m-[-0.5px]"
              onClick={() => handleClick(post.slug.current)}
            >
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={title}
                fill
                sizes="25vw"
                className="object-contain transition-all duration-300 scale-[1.01]"
              />

              {/* Single Link overlay that handles both desktop and mobile */}
              <Link
                href={`/series/${post.slug.current}`}
                className="absolute inset-0 z-10 flex items-center justify-center text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">{title}</span>

                {/* Text content */}
                <div className="relative font-light text-lg md:text-3xl text-white transition-transform duration-200 md:hover:scale-105 p-4 md:p-6 leading-tight">
                  {/* Title with adaptive blur */}
                  <span className="relative inline-block text-center">
                    {/* Light blur backdrop that hugs text */}
                    <span
                      className="absolute inset-[-0.3em] blur-text-background"
                      aria-hidden="true"
                    />

                    {/* One word per line */}
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

                  {/* Hover / active text */}
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
