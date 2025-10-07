'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'

type Props = {
  post: Post
  language: string
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function DesktopSlideshow({
  post,
  language,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const router = useRouter()
  const current = post.images?.[currentIndex]
  if (!current) return <p>No images found.</p>

  const currentTitle =
    language === 'en' ? current.title_en || current.title_fr : current.title_fr
  const currentExcerpt =
    language === 'en'
      ? current.excerpt_en || current.excerpt_fr
      : current.excerpt_fr

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    )
  const handleClose = () => {
    if (document.referrer.includes('/series')) {
      router.back()
    } else {
      router.push(`/series#${post.slug.current}`)
    }
  }

  return (
    <div className="relative w-full h-screen bg-[#f6f5ee] flex items-center py-10 justify-center hide-scrollbar ">
      {current.image && (
        <Image
          src={urlForImage(current.image).url() || ''}
          alt={currentTitle || post.title}
          width={1600}
          height={1200}
          className="w-auto h-full object-contain"
          priority
        />
      )}
      <button
        onClick={handleClose}
        className="absolute font-inter top-4 left-4 z-50 font-semibold hover:font-extrabold p-3 rounded-full"
      >
        close
      </button>

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 transition-transform duration-200 md:hover:scale-105  p-2 rounded-full z-50 ml-4"
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
      )}
      {currentIndex < post.images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-200 md:hover:scale-105  p-2 rounded-full z-50 mr-4"
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      )}

      <div className="absolute bottom-6 left-6  max-w-sm">
        {currentTitle && <h1 className="text-2xl md:text-3xl font-bold">{currentTitle}</h1>}
        {currentExcerpt && <p className="mt-2 text-base font-inter">{currentExcerpt}</p>}
      </div>
    </div>
  )
}
