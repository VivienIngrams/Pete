"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import { useLanguage } from "~/app/components/context/LanguageProvider"
import { useScrollPosition } from "~/app/components/context/ScrollPositionProvider"
import { urlForThumbnail } from "~/sanity/lib/sanity.image"
import type { Post } from "~/sanity/lib/sanity.queries"

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const { saveScrollPosition, getScrollPosition } = useScrollPosition()
  const lang = language || activeLang || "en"

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [mounted, setMounted] = useState(false)
  const hasRestoredScroll = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  // Restore scroll position on mount
  // In PostsGrid.tsx, update the restoration useEffect:
  useEffect(() => {
    if (!mounted || !scrollContainerRef.current || hasRestoredScroll.current) return

    const savedPosition = getScrollPosition("series-grid")
    if (savedPosition && typeof savedPosition === "number") {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = savedPosition
          updateScrollButtons()
        }
      }, 100)
    }
    hasRestoredScroll.current = true
  }, [mounted, getScrollPosition, updateScrollButtons])

  useEffect(() => {
    if (!mounted) return

    updateScrollButtons()
    window.addEventListener("resize", updateScrollButtons)
    return () => window.removeEventListener("resize", updateScrollButtons)
  }, [mounted, updateScrollButtons])

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.3

    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  // Save scroll position before navigating
  const handleLinkClick = () => {
    if (scrollContainerRef.current) {
      saveScrollPosition("series-grid", scrollContainerRef.current.scrollLeft)
    }
  }

  if (!mounted) {
    return null
  }

  const repeatedPosts = [...posts, ...posts]

  return (
    <section className="relative w-full scrollbar-hide overflow-hidden">
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 md:gap-8 overflow-x-scroll scroll-smooth snap-x "
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE
          overflowY: "hidden",
          paddingRight: 0,
          marginRight: 0,
        }}
      >
        {repeatedPosts.map((post, i) => {
          const title = lang === "en" ? post.title_en || post.title || "" : post.title || post.title_en || ""
          const aspect = post.mainImage?.aspectRatio || 1.5

          const height = typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 40
          const widthVh = aspect * height

          return (
            <Link
              key={`${post._id}-${i}`}
              href={`/series/${post.slug.current}`}
              onClick={handleLinkClick}
              className="relative flex-shrink-0 snap-center group cursor-pointer active:scale-[0.98] transition-transform duration-150"
              style={{ width: `${widthVh}vh` }}
            >
              <div className="border border-border rounded-sm shadow-sm overflow-hidden mt-4">
                <div
                  className="relative overflow-hidden w-full"
                  style={{
                    height: `${height}vh`,
                    aspectRatio: aspect.toString(),
                  }}
                >
                  {/* Image */}
                  <Image
                    src={urlForThumbnail(post.mainImage, 600) || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-105 group-active:brightness-95"
                    sizes="(max-width: 768px) 50vw, 30vw"
                  />
                </div>

                <div className="px-2 py-2.5 flex justify-between items-center gap-3">
                  <h3 className="text-sm md:text-base text-gray-600 leading-snug transition-transform duration-300 group-hover:scale-105">
                    {title}
                  </h3>
                  <div className="flex items-center 
                   gap-1.5  text-gray-500 shrink-0">
                    <span className="group-hover:underline">
                      {activeLang === "en" ? "View Series" : "Voir la série"}
                    </span>
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
      </div>

      <div className="w-full flex justify-between  ">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`z-10 !bg-white dark:!bg-white hover:!bg-white/10 dark:hover:!bg-white/10 hover:rounded-full  p-3 transition-all duration-300 
    ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 !text-gray-400  dark:!text-gray-400 " />
        </button>

        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={` z-10 -mr-4 !bg-white dark:!bg-white hover:!bg-white/10 dark:hover:!bg-white/10 hover:rounded-full p-3 transition-all duration-300 
    ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 md:w-10 md:h-10 !text-gray-400  dark:!gray-400" />
        </button>
      </div>
    </section>
  )
}
