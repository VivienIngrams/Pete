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

  // ✅ Explicitly tell TypeScript what this array contains
  const squares: Square[] = posts.flatMap((post) => [
    { type: 'image' as const, post },
    { type: 'title' as const, post },
  ])

  // Determines whether to flip the order on a row
  const getDisplayType = (index: number, type: 'image' | 'title', cols: number) => {
    const row = Math.floor(index / cols)
    const isReversedRow = row % 2 !== 0
    if (!isReversedRow) return type
    return type === 'image' ? 'title' : 'image'
  }

  const getAlignment = (row: number) =>
    row % 2 === 0 ? 'justify-start text-left pr-4' : 'justify-end text-right pl-4'

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

        const rowMobile = Math.floor(index / mobileCols)
        const rowDesktop = Math.floor(index / desktopCols)

        const displayTypeMobile = getDisplayType(index, type, mobileCols)
        const displayTypeDesktop = getDisplayType(index, type, desktopCols)

        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        return (
          <div
            key={`${post._id}-${index}`}
            className="relative aspect-square flex items-center justify-center overflow-hidden m-[-0.5px]"
          >
            {/* MOBILE */}
            <div className="block lg:hidden w-full h-full">
              {displayTypeMobile === 'image' && post.mainImage?.asset ? (
                <Image
                  src={urlForImage(post.mainImage).url() as string}
                  alt={post.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-white flex items-center ${getAlignment(
                    rowMobile
                  )}`}
                >
                  {title && (
                    <span className="font-normal text-lg px-4">{title}</span>
                  )}
                </div>
              )}
            </div>

            {/* DESKTOP */}
            <div className="hidden lg:block w-full h-full">
              {displayTypeDesktop === 'image' && post.mainImage?.asset ? (
                <Image
                  src={urlForImage(post.mainImage).url() as string}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-white flex items-center ${getAlignment(
                    rowDesktop
                  )}`}
                >
                  {title && (
                    <span className="font-normal text-lg md:text-xl px-4">
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
