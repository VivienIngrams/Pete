'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { PortableText } from '@portabletext/react'

type Props = {
  post: Post
  language: string
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function MobileSlideshow({
  post,
  language,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const router = useRouter()
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const [imageBottom, setImageBottom] = useState(0)
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  // --- Swipe gesture refs ---
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  useEffect(() => {
    const updatePosition = () => {
      if (imageWrapperRef.current) {
        const rect = imageWrapperRef.current.getBoundingClientRect()
        setImageBottom(rect.bottom)
      }
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [currentIndex])

  const current = post.images?.[currentIndex]
  if (!current) return <p>No images found.</p>

  const currentTitle =
    language === 'en' ? current.title_en || current.title_fr : current.title_fr
  const currentExcerpt =
    language === 'en'
      ? current.excerpt_en || current.excerpt_fr
      : current.excerpt_fr

  const postExcerptBlocks =
    language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))

  const handleClose = () => {
    if (document.referrer.includes('/series')) {
      router.back()
    } else {
      router.push(`/series#${post.slug.current}`)
    }
  }

  // --- Swipe Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return

    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left → next image
        handleNext()
      } else {
        // Swipe right → previous image
        handlePrev()
      }
    }

    // Reset refs
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div className="relative w-full h-screen bg-[#f6f5ee] mt-6 flex flex-col items-center justify-center">
      <div
        ref={imageWrapperRef}
        className="relative w-full flex-shrink-0 flex items-center justify-center"
        // 👇 Add swipe listeners
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {current.image && (
          <Image
            src={urlForImage(current.image).url() || ''}
            alt={currentTitle || post.title}
            width={1600}
            height={1200}
            className="w-auto max-h-[80vh] md:max-h-[95vh] object-contain transition-transform duration-300"
            priority
          />
        )}

        <button
          onClick={handleClose}
          className="fixed top-4 left-4 text-black text-sm tracking-wider underline underline-offset-2 z-50 font-bold"
        >
          close
        </button>
      </div>

      {/* Mobile arrows: always visible, wrap around */}
      <div className="flex w-full justify-between px-4 mt-4 md:hidden">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-[#f6f5ee]/60 active:bg-[#f6f5ee]/90 transition"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-[#f6f5ee]/60 active:bg-[#f6f5ee]/90 transition"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Overlay */}
      <div className="bg-[#f6f5ee]/50 w-full px-4 py-4">
        {currentTitle && (
          <h1 className="text-2xl md:text-3xl font-bold">{currentTitle}</h1>
        )}
        {currentExcerpt && (
          <p className="mt-2 text-xs font-inter">{currentExcerpt}</p>
        )}
        <div className="mt-3 flex justify-start">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-base font-bold underline underline-offset-2 rounded-md tracking-wider"
          >
            about
          </button>
        </div>
      </div>

      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 text-black bg-[#f6f5ee]/85 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-sm fixed top-4 left-4 tracking-wider underline underline-offset-2 bg-[#f6f5ee]"
              >
                close
              </button>
            </div>
            <div className="text-sm font-inter text-justify">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <PortableText value={postExcerptBlocks} />
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
