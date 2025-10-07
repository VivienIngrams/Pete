'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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

  return (
    <div className="relative w-full h-screen bg-[#f6f5ee] flex flex-col items-center justify-center">
      <div
        ref={imageWrapperRef}
        className="relative w-full flex-shrink-0 flex items-center justify-center"
      >
        {current.image && (
          <Image
            src={urlForImage(current.image).url() || ''}
            alt={currentTitle || post.title}
            width={1600}
            height={1200}
            className="w-auto max-h-[80vh] md:max-h-[95vh] object-contain"
            priority
          />
        )}

        <button
          onClick={handleClose}
          className="fixed top-4 left-4  text-xs font-inter z-50 font-bold  p-3 "
        >
          close
        </button>
      </div>

      {/* Mobile arrows: below image */}
      <div className="flex w-full justify-between px-2 mt-2 md:hidden">
        {currentIndex > 0 ? (
          <button
            onClick={handlePrev}
            className="hover:bg-black/10 p-2 rounded-full"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        ) : (
          <div className="w-8" />
        )}
        {currentIndex < post.images.length - 1 ? (
          <button
            onClick={handleNext}
            className="hover:bg-black/10 p-2 rounded-full"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute bottom-6 right-6 text-right bg-[#f6f5ee]/50 max-w-sm">
        {currentTitle && (
          <h1 className="text-2xl md:text-3xl font-bold">{currentTitle}</h1>
        )}
        {currentExcerpt && (
          <p className="mt-2 text-xs font-inter">{currentExcerpt}</p>
        )}
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="px-3 py-1 text-xs font-inter underline underline-offset-4"
          >
            About
          </button>
        </div>
      </div>

      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="bg-[#f6f5ee] max-w-2xl w-full max-h-[80vh] overflow-auto p-6 rounded shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">About</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-sm font-inter underline underline-offset-4"
              >
                Close
              </button>
            </div>
            {postExcerptBlocks && postExcerptBlocks.length ? (
              <PortableText value={postExcerptBlocks} />
            ) : (
              <p className="text-sm font-inter">No description available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
