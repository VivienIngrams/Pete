'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

export default function CommissionsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'
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
    <div className="p-8 md:p-0 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 overflow-hidden">
      {posts.map((post) => {
        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        return (
          <div
            key={post._id}
            className="flex flex-col cursor-pointer group md:px-2"
            onClick={() => handleClick(post.slug.current)}
          >
             <Link
              href={`/commissions/${post.slug.current}`}
              className=" text-center"
            >
            {/* Image */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.1)] shadow-gray-700 mt-4">
              {post.mainImage ? (
                <Image
                  src={urlForImage(post.mainImage).url() as string}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200" />
              )}
            </div>

            {/* Text below image */}
           
              <h3 className="text-black dark:text-black font-light text-lg transition-all duration-300">
                <span className="block group-hover:hidden">{title}</span>
                <span className="hidden group-hover:inline underline underline-offset-2 font-normal text-base tracking-tight">
                  View series
                </span>
              </h3>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
