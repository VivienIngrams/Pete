"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { useLanguage } from "~/app/components/context/LanguageProvider"
import { urlForImage } from "~/sanity/lib/sanity.image"
import type { Post } from "~/sanity/lib/sanity.queries"

type Props = {
  posts: Post[]
  language?: string
}

function PostItem({
  post,
  title,
  isActive,
  onClick,
}: {
  post: Post
  title: string
  isActive: boolean
  onClick: () => void
}) {
  const [loaded, setLoaded] = useState(false)

  const aspect = post.mainImage.aspectRatio || 1.5
  const heightVh = 47

  // Use CSS for responsive sizing instead of JS calculations
  const imageStyle = {
    height: `${heightVh}vh`,
    width: "auto",
    aspectRatio: aspect.toString(),
  }

  return (
    <div className="flex-shrink-0 flex flex-col items-center group scroll-snap-align-start" onClick={onClick}>
      <Link
        href={`/series/${post.slug.current}`}
        className="flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gray-100" style={imageStyle}>
          <Image
            src={(urlForImage(post.mainImage).url() as string) || "/placeholder.svg"}
            alt={title}
            fill
            sizes="85vw"
            className={`object-cover transition-all duration-500 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } group-hover:scale-105`}
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
    </div>
  )
}

export default function TouchPostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || "en"
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  const doublePosts = [...posts, ...posts]

  const handleClick = (slug: string) => {
    if (activeOverlay === slug) {
      router.push(`/series/${slug}`)
    } else {
      setActiveOverlay(slug)
    }
  }

  return (
    <div
      className="relative overflow-x-auto overflow-y-hidden bg-white mt-[45vh] md:mt-[40vh] hide-scrollbar"
      style={{
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "x proximity",
      }}
    >
      <div className="flex gap-4 md:gap-12 items-start w-max pb-4 pl-4 md:pl-12">
        {doublePosts.map((post, index) => {
          const isActive = activeOverlay === post.slug.current
          const title = lang === "en" ? post.title_en || post.title || "" : post.title || post.title_en || ""

          return (
            <PostItem
              key={`${post._id}-${index}`}
              post={post}
              title={title}
              isActive={isActive}
              onClick={() => handleClick(post.slug.current)}
            />
          )
        })}
      </div>
    </div>
  )
}
