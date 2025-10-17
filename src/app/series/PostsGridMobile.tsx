'use client'

import { useState } from 'react'
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

export default function PostsGridMobile({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  // Duplicate posts for smoother horizontal scroll
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
      className="relative overflow-x-auto overflow-y-hidden bg-white mt-[45vh] hide-scrollbar"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
      }}
    >
      <div className="flex gap-4 h-[70%] items-start w-max pb-4">
        {doublePosts.map((post, index) => {
          const isActive = activeOverlay === post.slug.current
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''

          return (
            <div
              key={`${post._id}-${index}`}
              className="flex-shrink-0 w-[65vw] flex flex-col items-center group ${index === 0 ? 'ml-4' : ''}"
              onClick={() => handleClick(post.slug.current)}
            >
              <Link href={`/series/${post.slug.current}`} className="w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={urlForImage(post.mainImage).url() as string}
                    alt={title}
                    fill
                    sizes="65vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h3 className=" text-black font-light text-xl text-center transition-all duration-200">
                  <span className={`${isActive ? 'hidden' : 'inline'}`}>{title}</span>
                  
                </h3>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
