'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'

type Props = {
  posts: Post[]
}

export default function PostsGrid({ posts }: Props) {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  const toggleOverlay = (slug: string) => {
    setActiveOverlay((prev) => (prev === slug ? null : slug))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-[#edece0]">
      {posts.map((post) => {
        const isActive = activeOverlay === post.slug.current

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

            {/* Title overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center text-center transition-opacity duration-300
                ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                md:group-hover:opacity-100 md:pointer-events-auto`}
            >
              <Link
                href={`/posts/${post.slug.current}`}
                className="text-black text-xl md:text-2xl font-bold underline-offset-2 underline transition-transform duration-200
                  md:hover:scale-105"
                onClick={(e) => e.stopPropagation()} // prevent toggling overlay on title click
              >
                {post.title}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
