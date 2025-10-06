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
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null) // for desktop fixed overlay

  const handleMobileToggle = (slug: string) => {
    if (window.innerWidth < 768) {
      setActiveSlug((prev) => (prev === slug ? null : slug))
    }
  }

  return (
    <>
      {/* Desktop bottom-left fixed overlay */}
      <div className="hidden md:flex fixed bottom-4 left-4 flex-col items-start z-50 pointer-events-none">
        {hoveredSlug &&
          posts
            .filter((post) => post.slug.current === hoveredSlug)
            .map((post) => {
              const excerpt =
                language === 'en'
                  ? post.excerpt_en || post.excerpt
                  : post.excerpt
              return (
                <div key={post._id} className="max-w-[25vw] text-left">
                  <Link
                    href={`/series/${post.slug.current}`}
                    className="text-black text-2xl font-bold underline underline-offset-2 transition-transform duration-200 hover:scale-105 pointer-events-auto mb-1"
                  >
                    {post.title}
                  </Link>
                  {excerpt && (
                    <div className="text-xs font-inter text-black pointer-events-none">
                      <PortableText value={excerpt} />
                    </div>
                  )}
                </div>
              )
            })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-[#edece0]">
        {posts.map((post) => {
          const isActive = activeSlug === post.slug.current
          const excerpt =
            language === 'en'
              ? post.excerpt_en || post.excerpt
              : post.excerpt

          return (
            <div
              key={post._id}
              className="relative aspect-square border border-[#edece0] group overflow-hidden cursor-pointer"
              onClick={() => handleMobileToggle(post.slug.current)}
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
                  className={`object-cover transition-opacity duration-300
                    ${isActive ? 'opacity-20' : 'opacity-100'}
                    md:group-hover:opacity-20`}
                />
              )}

              {/* Overlay container */}
              <div
                className={`absolute inset-0 transition-opacity duration-300
                  ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                  md:opacity-0 md:group-hover:opacity-100 md:pointer-events-none`}
              >
                {/* MOBILE: Centered overlay */}
                <div className="flex flex-col items-center justify-center h-full px-2 text-center md:hidden">
                  <Link
                    href={`/series/${post.slug.current}`}
                    className="text-black text-lg font-bold underline underline-offset-2 transition-transform duration-200 hover:scale-105 mb-2"
                    onClick={(e) => e.stopPropagation()} // stop toggle, allow navigation
                  >
                    {post.title}
                  </Link>

                  {excerpt && (
                    <div className="max-w-[10vw] text-xs font-inter text-black font-normal pointer-events-none">
                      <PortableText value={excerpt} />
                    </div>
                  )}
                </div>

                {/* DESKTOP: Centered title overlay */}
                <Link
                    href={`/series/${post.slug.current}`} className="hidden md:flex absolute inset-0 items-center justify-center ">
                  <span className="text-black text-2xl font-bold underline underline-offset-2">
                    {post.title}
                  </span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
