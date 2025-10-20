'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

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

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState({
    height: 0,
    totalImagesWidth: 0,
  })

  // NEW: Track individual image loading states
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})

  gsap.registerPlugin(ScrollTrigger)

  const IMAGE_SPACING = 64

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const height = window.innerHeight * 0.45
      let totalImagesWidth = IMAGE_SPACING
      const infinitePosts = [...posts, ...posts]

      infinitePosts.forEach((post) => {
        const aspectRatio = post.mainImage.aspectRatio || 1.5
        const imgWidth = height * aspectRatio
        totalImagesWidth += imgWidth + IMAGE_SPACING
      })

      setDimensions({ height, totalImagesWidth })
    }
  }, [posts])

  useEffect(() => {
    if (dimensions.totalImagesWidth > 0 && typeof window !== 'undefined') {
      const containerWidth = window.innerWidth * 0.8
      const totalWidth = dimensions.totalImagesWidth - containerWidth

      const pin = gsap.fromTo(
        sectionRef.current,
        { translateX: 0 },
        {
          translateX: `-${totalWidth}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'center center',
            end: `${totalWidth} top`,
            scrub: true,
            pin: true,
          },
        },
      )

      return () => {
        pin.kill()
      }
    }
  }, [dimensions])

  const infinitePosts = [...posts, ...posts]

  return (
    <section
      ref={triggerRef}
      className="w-full h-full overflow-visible bg-white pt-[30vh] pl-16"
    >
      <div
        ref={sectionRef}
        className="flex space-x-16 pl-16"
        style={{ width: `${dimensions.totalImagesWidth}px` }}
      >
        {infinitePosts.map((post, index) => {
          const postKey = `${post._id}-${index}` // unique key per instance

          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          const aspectRatio = post.mainImage.aspectRatio || 1.5
          const imgWidth = dimensions.height * aspectRatio
          const isLoaded = loadedMap[postKey]

          return (
            <Link
              key={postKey}
              href={`/series/${post.slug.current}`}
              className="relative flex-shrink-0 cursor-pointer group"
              style={{
                width: `${imgWidth}px`,
                height: `${dimensions.height}px`,
              }}
            >
              <div className="relative w-full h-full">
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
                )}

                <Image
                  src={urlForImage(post.mainImage).url() as string}
                  alt={title}
                  fill
                  sizes="25vw"
                  onLoad={() =>
                    setLoadedMap((prev) => ({ ...prev, [postKey]: true }))
                  }
                  className={`object-cover transition-transform duration-300 group-hover:shadow-md shadow-black ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              {isLoaded && (
                <div className="w-full h-[50px] px-4 transition-opacity duration-300">
                  <h3 className="text-black font-light text-xl text-center">
                    <span className="group-hover:hidden">{title}</span>
                    <span className="hidden group-hover:inline underline underline-offset-2 font-normal text-lg tracking-tight">
                      View series
                    </span>
                  </h3>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
