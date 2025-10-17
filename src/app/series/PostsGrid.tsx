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
      <div ref={containerRef} className="flex gap-[1px] h-[70%] items-start pr-4">
        {infinitePosts.map((post, index) => {
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <div
              key={`${post._id}-${index}`}
              className="flex-shrink-0 w-[25vw] lg:w-[17vw] mr-4 flex flex-col items-center group cursor-pointer"
            >
              <Link href={`/series/${post.slug.current}`} className="w-full flex flex-col items-center">
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={urlForImage(post.mainImage).url() as string}
                    alt={title}
                    fill
                    sizes="25vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h3 className=" text-black font-light text-2xl text-center transition-all duration-200 group-hover:text-gray-800">
                  <span className="group-hover:hidden">{title}</span>
                  <span className="hidden group-hover:inline underline underline-offset-2 font-normal text-lg tracking-tight">View series</span>
                </h3>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
