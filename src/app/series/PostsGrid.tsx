'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { useLanguage } from '~/app/components/context/LanguageProvider'

type Props = {
  posts: Post[]
  language?: string
}

type Square = {
  type: 'image' | 'title'
  post: Post
}

export default function PostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'

  // Each post contributes two squares: image + title
  const squares: Square[] = posts.flatMap((post) => [
    { type: 'image' as const, post },
    { type: 'title' as const, post },
  ])

  // Alternate order per row (chessboard effect)
  const getDisplayType = (index: number, type: 'image' | 'title', cols: number) => {
    const row = Math.floor(index / cols)
    const isReversedRow = row % 2 !== 0
    if (!isReversedRow) return type
    return type === 'image' ? 'title' : 'image'
  }

  return (
    <div
      className="
        pt-4 md:pt-0
        grid grid-cols-2 lg:grid-cols-4
        gap-0 overflow-hidden
      "
    >
      {squares.map(({ type, post }, index) => {
        const mobileCols = 2
        const desktopCols = 4

        const displayTypeMobile = getDisplayType(index, type, mobileCols)
        const displayTypeDesktop = getDisplayType(index, type, desktopCols)

        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        // Flip horizontally for title squares only
        const flipClass = 'scale-x-[-1]'

        return (
          <div
            key={`${post._id}-${index}`}
            className="relative aspect-square flex items-center justify-center overflow-hidden m-[-0.5px]"
          >
            {/* --- MOBILE --- */}
            <div className="block lg:hidden w-full h-full relative">
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={post.title}
                fill
                sizes="100vw"
                className={`object-cover ${
                  displayTypeMobile === 'title' ? flipClass : ''
                }`}
              />
              {displayTypeMobile === 'title' && (
                <div
                  className="
                    absolute inset-0 bg-white/80
                    flex items-center justify-center
                  "
                >
                  {title && (
                    <span className="font-normal text-lg text-black text-center underline underline-offset-2 px-4 break-words">
                      {title}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* --- DESKTOP --- */}
            <div className="hidden lg:block w-full h-full relative">
              <Image
                src={urlForImage(post.mainImage).url() as string}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className={`object-cover ${
                  displayTypeDesktop === 'title' ? flipClass : ''
                }`}
              />
              {displayTypeDesktop === 'title' && (
                <div
                  className="
                    absolute inset-0 bg-white/80
                    flex items-center justify-center
                  "
                >
                  {title && (
                    <span className="font-normal text-lg md:text-xl text-black text-center underline underline-offset-2 px-6 break-words">
                      {title}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Clickable overlay */}
            <Link
              href={`/series/${post.slug.current}`}
              className="absolute inset-0 z-10"
            >
              <span className="sr-only">{post.title}</span>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
