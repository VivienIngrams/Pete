'use client'

import { PortableText } from '@portabletext/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import LanguageSwitcher from '~/app/components/LanguageSwitcher'
import NavMenu from '~/app/components/NavMenu'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'



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
  const [forceRender, setForceRender] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const imageWrapperRef = useRef<HTMLDivElement>(null)

  // Force re-render when language changes to ensure PortableText updates
  useEffect(() => {
    setForceRender((prev) => prev + 1)
  }, [activeLang])

  // Reset loading state when image changes
  useEffect(() => {
    setIsImageLoading(true)
  }, [currentIndex])

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

  // --- Navigation handlers ---
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

const pathname = usePathname()
  // --- Close handler ---
  const handleClose = () => {
  if (pathname.startsWith('/series')) {
    router.push('/series#' + post.slug.current)
  } else if (pathname.startsWith('/commissions')) {
    router.push('/commissions#' + post.slug.current)
  } else {
    router.push('/') // fallback
  }
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
      <NavMenu
        slideshowMode={true}
        onDropdownToggle={setIsDropdownOpen}
        hideMenu={isAboutOpen}
      />
      {/* Persistent top bar with close button */}
      <div
        className={`fixed top-0 left-0 z-[900] bg-white flex items-center h-12 p-6 ${isDropdownOpen || isAboutOpen ? 'hidden' : 'block'}`}
      >
        <button
          onClick={handleClose}
          className="text-black text-sm tracking-wide uppercase mt-1"
        >
          {t.close}
        </button>
      </div>

      {/* Image + swipe area */}
      <div
        ref={imageWrapperRef}
        className="relative w-full flex-shrink-0 flex items-center justify-center mt-10 touch-pan-x touch-swipe-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-auto max-h-[80vh] flex items-center justify-center">
          {/* Loading state */}
          {isImageLoading && images.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white animate-pulse">
              <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* If there are no images, show black background */}
          {!images.length ? (
            <div className="w-full h-[60vh] flex items-center justify-center text-sm uppercase">
              No images available
            </div>
          ) : (
            current?.image && (
              <Image
                src={urlForImage(current.image).url() || ''}
                alt={currentTitle || post.title}
                width={500}
                height={500}
                className={`w-auto max-h-[80vh] object-contain transition-opacity duration-500 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsImageLoading(false)}
                priority
              />
            )
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex w-full justify-between px-3 mt-4 md:hidden">
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
      <div className="bg-white/50 w-full px-6 py-4 min-h-[120px]">
        {currentTitle && (
          <h1 className="text-xl font-normal">{currentTitle}</h1>
        )}
        <div className=" text-sm font-roboto">
          {currentExcerpt && (
            <PortableText
              key={`${activeLang}-${forceRender}`}
              value={currentExcerpt}
            />
          )}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-sm uppercase tracking-wide"
          >
            {t.about}
          </button>
        </div>
      </div>

      {/* About modal */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-[1100] text-black bg-white/90 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-auto p-6 -mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inline Language Switcher */}
            <div className=" flex justify-end ">
              <LanguageSwitcher />
            </div>

            <div className="flex justify-between items-start mb-4 ">
              <h2 className="text-xl font-normal">{postTitle}</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-sm fixed top-4 left-4 tracking-wide uppercase bg-white"
              >
                {t.close}
              </button>
            </div>
            <div className="prose prose-sm md:prose-base text-sm font-roboto text-justify ">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <PortableText
                  key={`${activeLang}-${forceRender}`}
                  value={postExcerptBlocks}
                />
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
