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
    <div className="relative w-full h-screen bg-[#f6f5ee] mt-6 flex flex-col items-center justify-center">
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
          className="fixed top-4 left-4 text-black text-sm tracking-wider underline underline-offset-2 z-50 font-bold "
        >
          close
        </button>
      </div>

      {/* Mobile arrows: below image */}
      <div className="flex w-full justify-between px-2 mt-4 md:hidden">
        {currentIndex > 0 ? (
          <button
            onClick={handlePrev}
            className=""
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        ) : (
          <div className="w-8" />
        )}
        {currentIndex < post.images.length - 1 ? (
          <button
            onClick={handleNext}
            className=""
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Overlay */}
      <div className=" bg-[#f6f5ee]/50 w-full px-4 py-4 ">
        {currentTitle && (
          <h1 className="text-2xl md:text-3xl font-bold">{currentTitle}</h1>
        )}
        {currentExcerpt && (
          <p className="mt-2 text-xs font-inter">{currentExcerpt}</p>
        )}
        <div className="mt-3 flex justify-start">
          <button
            onClick={() => setIsAboutOpen(true)}
            className=" text-base font-bold underline underline-offset-2 rounded-md tracking-wider"
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
            className=" max-w-2xl w-full max-h-[80vh] overflow-auto p-6 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-sm fixed top-4 left-4 tracking-wider underline underline-offset-2 bg-[#f6f5ee] "
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
