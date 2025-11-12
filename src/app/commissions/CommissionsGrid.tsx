"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { useLanguage } from "~/app/components/context/LanguageProvider"
import { urlForImage } from "~/sanity/lib/sanity.image"
import type { Post } from "~/sanity/lib/sanity.queries"

type Props = {
  posts: Post[]
  language?: string
}

export default function CommissionsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || "en"
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  const handleClick = (slug: string) => {
    if (window.innerWidth < 768) {
      if (activeOverlay === slug) {
        window.location.href = `/commissions/${slug}`
      } else {
        setActiveOverlay(slug)
      }
    }
  }

  return (
    <section className="p-4 md:p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
      {posts.map((post) => {
        const title =
          lang === "en" ? post.title_en || post.title || "" : post.title || post.title_en || ""

        return (
          <div
            key={post._id}
            className="group cursor-pointer active:scale-[0.98] transition-transform duration-150"
            onClick={() => handleClick(post.slug.current)}
          >
            <Link href={`/commissions/${post.slug.current}`} className="block">
              {/* Card Container */}
              <div className=" overflow-hidden bg-white dark:bg-neutral-50  duration-300">
                {/* Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  {post.mainImage ? (
                    <Image
                      src={urlForImage(post.mainImage).url() as string}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105 group-active:brightness-95"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                </div>

                {/* Text section */}
                <div className=" py-1 flex justify-between group-hover:px-1 font-light items-center text-center">
                  <h3 className="text-sm  md:text-base text-gray-500 leading-snug transition-transform duration-300 group-hover:scale-105">
                    {title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 ">
                    <span className="group-hover:underline">
                      {activeLang === "en" ? "See more" : "Voir plus"}
                    </span>
                    <svg
                      className="w-4 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
          </div>
        )
      })}
    </section>
  )
}
