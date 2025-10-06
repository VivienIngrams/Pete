'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'

export default function PostSlideshow({
  post,
  language,
}: {
  post: Post
  language: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  if (!post.images || post.images.length === 0) return <p>No images found.</p>

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1))

  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev === post.images!.length - 1 ? 0 : prev + 1
    )

  const handleClose = () => {
    if (document.referrer.includes('/posts')) {
      router.back()
    } else {
      router.push(`/posts#${post.slug.current}`)
    }
  }

  const current = post.images[currentIndex]
  const currentTitle =
    language === 'en' ? current.title_en || current.title_fr : current.title_fr
  const currentExcerpt =
    language === 'en'
      ? current.excerpt_en || current.excerpt_fr
      : current.excerpt_fr

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#edece0] ">
      {/* Close Button */}
      <button
        onClick={handleClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-50 bg-[#edece0]/40 hover:bg-[#edece0]/60 p-3 rounded-full"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image */}
      <div className="w-full h-full flex items-center justify-center">
        {current.image ? (
          <Image
            src={urlForImage(current.image).url() || ''}
            alt={currentTitle || post.title}
            width={1600}
            height={1200}
            className="max-h-[95vh] w-auto object-contain"
            priority
          />
        ) : (
          <p>No image available.</p>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute bottom-6 right-6 text-right bg-[#edece0]/50 p-4 rounded-xl max-w-lg">
        {currentTitle && <h1 className="text-3xl font-bold">{currentTitle}</h1>}
        {currentExcerpt && (
          <p className="mt-2 text-base font-instrument">{currentExcerpt}</p>
        )}
      </div>

      {/* Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="z-50 absolute left-4 top-1/2 -translate-y-1/2 hover:bg-black/10 p-3 rounded-full"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {currentIndex < post.images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-black/10 p-3 rounded-full"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  )
}
