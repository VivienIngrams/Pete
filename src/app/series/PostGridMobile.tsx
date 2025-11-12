"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { useLanguage } from "~/app/components/context/LanguageProvider"
import { useScrollPosition } from "~/app/components/context/ScrollPositionProvider"
import { urlForThumbnail } from "~/sanity/lib/sanity.image"
import type { Post } from "~/sanity/lib/sanity.queries"

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGridMobile({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const { saveScrollPosition, getScrollPosition } = useScrollPosition()
  const lang = language || activeLang || "en"

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const hasRestoredScroll = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Restore scroll position when component mounts
  useEffect(() => {
    if (!mounted || !scrollContainerRef.current || hasRestoredScroll.current) return

    const savedPosition = getScrollPosition("series-mobile-scroll")
    if (savedPosition && typeof savedPosition === "number") {
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
      saveScrollPosition("series-mobile-scroll", scrollContainerRef.current.scrollTop)
    }
  }

  if (!mounted) return null

  return (
    <section
      ref={scrollContainerRef}
      className="md:hidden w-full flex flex-col items-center gap-6 py-6 overflow-y-auto scrollbar-hide"
      style={{ maxHeight: "100vh", WebkitOverflowScrolling: "touch" }}
    >
      {posts.map((post, i) => {
        const title = lang === "en" ? post.title_en || post.title || "" : post.title || post.title_en || ""

        return (
          <Link
            key={`${post._id}-${i}`}
            href={`/series/${post.slug.current}`}
            className="w-full group active:scale-[0.98] transition-transform duration-150"
            onClick={handleLinkClick}
          >
            <div className="relative overflow-hidden border border-border rounded-sm shadow-sm">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: post.mainImage?.aspectRatio || "3/2",
                }}
              >
                {post.mainImage ? (
                  <Image
                    src={urlForThumbnail(post.mainImage, 500) || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover transition-all duration-300 group-active:brightness-95"
                    sizes="90vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}

              </div>

              <div className="px-3 py-3 bg-card">
                <h3 className="text-base font-medium text-foreground mb-1 leading-snug">{title}</h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span>{activeLang === "en" ? "View Series" : "Voir la série"}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-active:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
