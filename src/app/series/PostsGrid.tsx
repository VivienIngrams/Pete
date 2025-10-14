'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { PortableText } from '@portabletext/react'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGrid({ posts, language = 'fr' }: Props) {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null) // desktop hover only

  const toggleOverlay = (slug: string) => {
    if (window.innerWidth < 768) {
      setActiveOverlay((prev) => (prev === slug ? null : slug))
    }
  }

  return (
    <div className="pt-4 md:pt-0 grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 overflow-hidden">
      {posts.map((post) => {
        const isActive = activeOverlay === post.slug.current
   
        return (
          <div
            key={post._id}
            className="relative aspect-square  group overflow-hidden m-[-0.5px]"
            onClick={() => toggleOverlay(post.slug.current)}
            onMouseEnter={() => setHoveredSlug(post.slug.current)}
            onMouseLeave={() => setHoveredSlug(null)}
          >
            {/* Image */}
            {post.mainImage?.asset && (
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-300 scale-[1.01]
                  ${isActive ? 'opacity-20' : 'opacity-100'}
                  md:group-hover:opacity-20`}
              />
            )}

            {/* Overlay container */}
            <div
              className={`absolute inset-0 transition-opacity duration-300
                ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                md:group-hover:opacity-100 md:pointer-events-auto`}
            >
              {/* Centered title (both mobile and desktop) */}
              <div className="flex flex-col items-center justify-center h-full px-2 text-center">
                <Link
                  href={`/series/${post.slug.current}`}
                  className="font-normal text-base md:text-lg underline-offset-2 underline transition-transform duration-200 md:hover:scale-105 mb-2 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.title}
                </Link>
               
              </div>

             
            </div>
          </div>
        )
      })}
    </div>
  )
}

