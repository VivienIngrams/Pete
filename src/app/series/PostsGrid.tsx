'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
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

  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  gsap.registerPlugin(ScrollTrigger)

  // Triple posts for seamless infinite scroll
  const infinitePosts = [...posts, ...posts, ...posts]

  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    if (!container || !wrapper) return

    gsap.set(container, { x: 0 })

    const singleSetWidth = container.scrollWidth / 3
    const totalScrollDistance = singleSetWidth * 10

    const ctx = gsap.context(() => {
      gsap.to(container, {
        x: () => -singleSetWidth * 10,
        ease: 'none',
        modifiers: {
          x: (x) => {
            const xNum = parseFloat(x)
            const wrapped = xNum % singleSetWidth
            return `${wrapped}px`
          },
        },
        scrollTrigger: {
          trigger: wrapper,
          start: 'top center',
          end: () => `+=${totalScrollDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrapper)

    return () => ctx.revert()
  }, [posts])

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden bg-white"
      style={{
        marginTop: '300px',
        height: '65vh',
        paddingLeft: '32px',
      }}
    >
      <div ref={containerRef} className="flex gap-[1px] h-[70%] items-center pr-4">
        {infinitePosts.map((post, index) => {
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <div
              key={`${post._id}-${index}`}
              className="relative flex-shrink-0 w-[25vw] lg:w-[17vw] mr-4 aspect-square group overflow-hidden cursor-pointer m-[-0.5px]"
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
              >
                <span className="sr-only">{title}</span>

                <div className="relative font-light text-3xl text-white transition-transform duration-200 group-hover:scale-105 p-6 leading-tight">
                  <span className="relative inline-block text-center">
                    <span
                      className="absolute inset-[-0.3em] blur-text-background"
                      aria-hidden="true"
                    />

                    <span className="relative block transition-opacity duration-200 group-hover:opacity-0">
                      {title.split(' ').map((word, i) => (
                        <span key={i} className="block leading-[0.95]">
                          {word}
                        </span>
                      ))}
                    </span>
                  </span>

                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-light text-xl">
                    View series
                  </span>
                </div>
              </Link>
            </div>
          )
        })}
      <div className="flex-shrink-0 w-4" />
      </div>
    </div>
  )
}
