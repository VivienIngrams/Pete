'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { PortableText } from '@portabletext/react'

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
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const current = post.images?.[currentIndex]
  if (!current) return <p>No images found.</p>

  const postTitle =  language === 'en'
  ? post.title_en || post.title
  : post.title_en

  const currentTitle = 
    (language === 'en'
      ? current.title_en || current.title_fr
      : current.title_en) || `${postTitle} ${currentIndex + 1}`
 

  const currentExcerpt =
    language === 'en'
      ? current.excerpt_en || current.excerpt_fr
      : current.excerpt_en

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

  const postExcerptBlocks =
    language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt

  return (
    <div className="relative w-full h-screen bg-[#f6f5ee] flex items-center py-10 justify-center hide-scrollbar ">
        {/* Placeholder skeleton */}
    {isImageLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-[#eae8dd] animate-pulse">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}
      {current.image && (
        <Image
          src={urlForImage(current.image).url() || ''}
          alt={currentTitle || post.title}
          width={1600}
          height={1200}
          className={`w-auto h-full object-contain transition-opacity duration-500 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoadingComplete={() => setIsImageLoading(false)}
          
          priority
        />
      )}
      <button
        onClick={handleClose}
        className="absolute text-lg text-black tracking-wider underline underline-offset-2 top-6 left-6 z-50 font-semibold hover:font-extrabold rounded-full"
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
        <div className="mt-3">
          <button
            onClick={() => setIsAboutOpen(true)}
            className=" text-lg font-bold underline underline-offset-2 rounded-md tracking-wider"
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
              <h2 className="text-4xl font-bold">{post.title}</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute text-lg underline underline-offset-2 top-6 left-6 z-50 font-semibold hover:font-extrabold tracking-wider bg-[#f6f5ee]"
                >
                close
              </button>
            </div>
            <div className="text-base font-inter text-justify">
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
