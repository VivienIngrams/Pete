'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState, useMemo } from 'react'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { PortableText } from '@portabletext/react'
import LanguageSwitcher from '~/app/components/LanguageSwitcher'
import { useLanguage } from '~/app/components/context/LanguageProvider'

type Props = {
  post: Post
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function MobileSlideshow({
  post,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const router = useRouter()
  const { language: activeLang } = useLanguage()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const imageWrapperRef = useRef<HTMLDivElement>(null)

  // --- Swipe gesture refs ---
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Memoize images array to have a stable reference
  const images = useMemo(() => post.images || [], [post.images])

  // Memoize current image based on currentIndex
  const current = useMemo(
    () => images[currentIndex] || null,
    [images, currentIndex],
  )

  // --- Memoized titles & excerpts ---
  const postTitle = useMemo(
    () => (activeLang === 'en' ? post.title_en || post.title : post.title),
    [activeLang, post.title, post.title_en],
  )
  const currentTitle = useMemo(() => {
    if (!current) return ''
    return (
      (activeLang === 'en'
        ? current.title_en || current.title_fr
        : current.title_fr || current.title_en) ||
      `${postTitle} ${currentIndex + 1}`
    )
  }, [activeLang, current, currentIndex, postTitle])

  const currentExcerpt = useMemo(() => {
    if (!current) return null
    return activeLang === 'en'
      ? current.excerpt_en || current.excerpt_fr
      : current.excerpt_fr || current.excerpt_en
  }, [activeLang, current])

  const postExcerptBlocks = useMemo(() => {
    return activeLang === 'en'
      ? post.excerpt_en || post.excerpt
      : post.excerpt || post.excerpt_en
  }, [activeLang, post.excerpt, post.excerpt_en])

  // Early return for empty images
  if (!images.length) return <p>No images found.</p>

  // --- Navigation handlers ---
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  // --- Close handler ---
  const handleClose = () => {
    if (document.referrer.includes('/series')) router.back()
    else router.push(`/series#${post.slug.current}`)
  }

  // --- Swipe handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev()
    touchStartX.current = null
    touchEndX.current = null
  }

  // --- Translations ---
  const t = {
    about: activeLang === 'en' ? 'about' : 'à propos',
    close: activeLang === 'en' ? 'close' : 'fermer',
  }

  return (
    <div className="relative w-full h-screen bg-white mt-6 flex flex-col items-center justify-center">
      {/* Persistent top bar with close button */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-white flex items-center h-10 px-4 ">
        <button
          onClick={handleClose}
          className="text-black text-sm tracking-wide underline underline-offset-2"
        >
          {t.close}
        </button>
      </div>

      {/* Image + swipe area */}
      <div
        ref={imageWrapperRef}
        className="relative w-full flex-shrink-0 flex items-center justify-center mt-10 touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {current.image && (
          <div className="relative w-auto max-h-[80vh] md:max-h-[95vh] flex items-center justify-center">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#eae8dd] animate-pulse">
                <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <Image
              src={urlForImage(current.image).url() || ''}
              alt={currentTitle || post.title}
              width={1600}
              height={1200}
              className={`w-auto max-h-[80vh] md:max-h-[95vh] object-contain transition-opacity duration-500 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              priority
            />
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="flex w-full justify-between px-1 mt-4 md:hidden">
        <button
          onClick={handlePrev}
          className="rounded-full bg-white/60 active:bg-white/90 transition"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="rounded-full bg-white/60 active:bg-white/90 transition"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Caption overlay */}
      <div className="bg-white/50 w-full px-4 py-4">
        {currentTitle && (
          <h1 className="text-xl font-normal">{currentTitle}</h1>
        )}
        {currentExcerpt && (
          <div className=" text-sm font-roboto">
            <PortableText value={currentExcerpt} key={activeLang} />
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-sm underline underline-offset-2 tracking-wide"
            >
              {t.about}
            </button>
          </div>
        )}
      </div>

      {/* About modal */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 text-black bg-white/90 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inline Language Switcher */}
            <div className=" flex justify-end ">
              <LanguageSwitcher />
            </div>

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-normal">{postTitle}</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-sm fixed top-4 left-4 tracking-wide underline underline-offset-2 bg-white"
              >
                {t.close}
              </button>
            </div>
            <div className="prose prose-sm md:prose-base text-sm font-roboto text-justify">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <PortableText value={postExcerptBlocks} key={activeLang} />
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
