'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForThumbnail } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGridMobile({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'

  return (
    <section className="md:hidden w-full flex flex-col items-center gap-6  py-6">
      {posts.map((post, i) => {
        const title =
          lang === 'en'
            ? post.title_en || post.title || ''
            : post.title || post.title_en || ''

        return (
          <Link
            key={`${post._id}-${i}`}
            href={`/series/${post.slug.current}`}
            className="w-full group"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: post.mainImage?.aspectRatio || '3/2', // fallback if missing
              }}
            >
              {post.mainImage ? (
                <Image
                  src={urlForThumbnail(post.mainImage, 1200)}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="90vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100" />
              )}
            </div>

            <div className=" text-center">
              <h3 className="text-black dark:text-black font-light text-lg transition-all duration-300">
                <span className="group-hover:hidden">{title}</span>
                <span className="hidden group-hover:inline underline underline-offset-2 font-normal tracking-tight">
                  View series
                </span>
              </h3>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
