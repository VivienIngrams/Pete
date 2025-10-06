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

  const toggleOverlay = (slug: string) => {
    setActiveOverlay((prev) => (prev === slug ? null : slug))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-[#edece0]">
      {posts.map((post) => {
        const isActive = activeOverlay === post.slug.current
        const excerpt =
          language === 'en'
            ? post.excerpt_en || post.excerpt
            : post.excerpt

        return (
          <div
            key={post._id}
            className="relative aspect-square border border-[#edece0] group overflow-hidden"
            onClick={() => toggleOverlay(post.slug.current)}
          >
            {/* Image */}
            {post.mainImage?.asset && (
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-300
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
                  className="text-black text-xl md:text-2xl font-bold underline-offset-2 underline transition-transform duration-200 md:hover:scale-105 mb-2 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.title}
                </Link>
                {excerpt && (
                    <div className="md:hidden max-w-xs text-xs font-instrument text-black">
                      <PortableText value={excerpt} />
                    </div>
                  )}
              </div>

              {/* Desktop bottom-left overlay with title + excerpt */}
              <div className="hidden md:flex fixed inset-0 z-20 pointer-events-none">
                <div className="absolute bottom-4 left-4 flex flex-col items-start">
                  <Link
                    href={`/series/${post.slug.current}`}
                    className="text-black text-2xl font-bold underline-offset-2 underline transition-transform duration-200 hover:scale-105 pointer-events-auto mb-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.title}
                  </Link>
                  {excerpt && (
                    <div className="max-w-xs text-xs font-instrument text-black">
                      <PortableText value={excerpt} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
