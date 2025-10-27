"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "~/app/components/context/LanguageProvider"
import { urlForImage } from "~/sanity/lib/sanity.image"
import type { Post } from "~/sanity/lib/sanity.queries"

type Props = {
  posts: Post[]
  language?: string
}

function PostImage({
  post,
  title,
  imageHeight,
  imageWidth,
  priority,
}: {
  post: Post
  title: string
  imageHeight: number
  imageWidth: number
  priority: boolean
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link
      href={`/series/${post.slug.current}`}
      className="relative flex-shrink-0 group"
      style={{ width: `${imageWidth}px` }}
    >
      <div className="relative overflow-hidden bg-gray-100" style={{ height: `${imageHeight}px` }}>
        <Image
          src={(urlForImage(post.mainImage).url() as string) || "/placeholder.svg"}
          alt={title}
          fill
          className={`object-cover transition-all duration-500 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } group-hover:scale-105`}
          sizes="(max-width: 768px) 85vw, 35vw"
          priority={priority}
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div className={`w-full px-4 mt-2 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <h3 className="text-black font-light text-xl text-center">
          <span className="group-hover:hidden">{title}</span>
          <span className="hidden group-hover:inline underline underline-offset-2 font-normal text-lg tracking-tight">
            View series
          </span>
        </h3>
      </div>
    </Link>
  )
}

export default function ScrollPostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || "en"

  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [dimensions, setDimensions] = useState<{
    imageHeight: number
    totalWidth: number
  } | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    const calculateDimensions = () => {
      if (typeof window === "undefined") return

      const viewportHeight = window.innerHeight
      const imageHeight = viewportHeight * 0.47
      const imageSpacing = 48

      // Calculate total width needed
      let totalWidth = imageSpacing
      const repeatedPosts = [...posts, ...posts]

      repeatedPosts.forEach((post) => {
        const aspect = post.mainImage.aspectRatio || 1.5
        totalWidth += imageHeight * aspect + imageSpacing
      })

      setDimensions({ imageHeight, totalWidth })
    }

    calculateDimensions()

    const handleResize = () => {
      // Debounce resize
      const timeoutId = setTimeout(calculateDimensions, 150)
      return () => clearTimeout(timeoutId)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [posts])

  useEffect(() => {
    if (!dimensions || !wrapperRef.current || !containerRef.current) return

    const wrapper = wrapperRef.current
    const container = containerRef.current
    const totalScroll = dimensions.totalWidth - window.innerWidth
    const startPosition = window.innerHeight * 0.4

    const ctx = gsap.context(() => {
      gsap.to(container, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: `top ${startPosition}px`,
          end: `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrapper)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [dimensions])

  if (!dimensions) {
    return (
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </section>
    )
  }

  const repeatedPosts = [...posts, ...posts]

  return (
    <section ref={wrapperRef} className="relative overflow-hidden">
      <div
        ref={containerRef}
        className="flex items-center gap-12 will-change-transform"
        style={{ width: `${dimensions.totalWidth}px` }}
      >
        {repeatedPosts.map((post, index) => {
          const title = lang === "en" ? post.title_en || post.title || "" : post.title || post.title_en || ""
          const aspect = post.mainImage.aspectRatio || 1.5
          const imageWidth = dimensions.imageHeight * aspect

          return (
            <PostImage
              key={`${post._id}-${index}`}
              post={post}
              title={title}
              imageHeight={dimensions.imageHeight}
              imageWidth={imageWidth}
              priority={index < 3}
            />
          )
        })}
      </div>
    </section>
  )
}
